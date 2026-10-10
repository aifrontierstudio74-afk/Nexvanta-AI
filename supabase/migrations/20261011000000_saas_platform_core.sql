-- NEXVANTA.AI — SaaS Platform Core Migration
-- Extensions
create extension if not exists pgcrypto;

-- Enums
do $$ begin
  if not exists (select 1 from pg_type where typname = 'app_role') then
    create type app_role as enum ('user', 'admin');
  end if;
  if not exists (select 1 from pg_type where typname = 'sub_status') then
    create type sub_status as enum ('created', 'active', 'past_due', 'paused', 'cancelled', 'expired');
  end if;
  if not exists (select 1 from pg_type where typname = 'run_status') then
    create type run_status as enum ('queued', 'running', 'succeeded', 'failed', 'cancelled');
  end if;
  if not exists (select 1 from pg_type where typname = 'payment_provider') then
    create type payment_provider as enum ('razorpay', 'manual');
  end if;
  if not exists (select 1 from pg_type where typname = 'payment_status') then
    create type payment_status as enum ('pending', 'captured', 'failed', 'refunded', 'rejected');
  end if;
  if not exists (select 1 from pg_type where typname = 'instance_status') then
    create type instance_status as enum ('draft', 'active', 'paused', 'error');
  end if;
end $$;

-- 1. Profiles Table
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  company text,
  role app_role not null default 'user',
  accepted_terms_at timestamptz,
  created_at timestamptz not null default now()
);

-- 2. Plans Table
create table if not exists plans (
  id uuid primary key default gen_random_uuid(),
  automation_slug text not null,
  code text not null unique,
  name text not null,
  price_inr integer not null,               -- monthly price in rupees
  razorpay_plan_id text,
  limits jsonb not null default '{}',       -- per-automation limits, defined in later prompts
  is_active boolean not null default true,
  sort_order integer not null default 0
);

-- 3. Subscriptions Table
create table if not exists subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  plan_id uuid not null references plans(id),
  automation_slug text not null,
  status sub_status not null default 'created',
  provider payment_provider not null default 'razorpay',
  razorpay_subscription_id text unique,
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean not null default false,
  grace_until timestamptz,
  created_at timestamptz not null default now()
);

create unique index if not exists one_live_sub_per_automation
  on subscriptions(user_id, automation_slug)
  where status in ('created', 'active', 'past_due', 'paused');

-- 4. Automation Instances Table
create table if not exists automation_instances (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  automation_slug text not null,
  name text not null default 'My automation',
  config jsonb not null default '{}',
  status instance_status not null default 'draft',
  last_error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 5. Credentials Table (NO client access at all)
create table if not exists credentials (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  instance_id uuid references automation_instances(id) on delete cascade,
  provider text not null,                      -- e.g. 'google','meta','smtp','whatsapp','elevenlabs'
  encrypted_payload text not null,             -- AES-256-GCM iv.tag.ciphertext
  created_at timestamptz not null default now(),
  unique (user_id, instance_id, provider)
);

-- 6. Usage Counters Table
create table if not exists usage_counters (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  automation_slug text not null,
  metric text not null,
  period_start timestamptz not null,
  used integer not null default 0,
  unique (user_id, automation_slug, metric, period_start)
);

-- 7. Runs Table
create table if not exists runs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  instance_id uuid references automation_instances(id) on delete set null,
  automation_slug text not null,
  type text not null,
  status run_status not null default 'queued',
  idempotency_key text,
  input jsonb,
  output jsonb,
  error text,
  attempts integer not null default 0,
  started_at timestamptz,
  finished_at timestamptz,
  created_at timestamptz not null default now(),
  unique (automation_slug, idempotency_key)
);

-- 8. Payments Table
create table if not exists payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete set null,
  subscription_id uuid references subscriptions(id) on delete set null,
  provider payment_provider not null,
  amount_inr integer not null,
  status payment_status not null default 'pending',
  razorpay_payment_id text unique,
  utr text,                                    -- manual payments
  method text,
  notes text,
  verified_by uuid references profiles(id),
  verified_at timestamptz,
  created_at timestamptz not null default now()
);

-- 9. Webhook Events Table (idempotency)
create table if not exists webhook_events (
  id text primary key,                         -- provider event id
  provider text not null,
  received_at timestamptz not null default now()
);

-- 10. Notifications Table
create table if not exists notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  title text not null,
  body text,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

-- 11. Audit Log Table
create table if not exists audit_log (
  id bigint generated always as identity primary key,
  actor_id uuid,
  action text not null,
  target text,
  meta jsonb,
  created_at timestamptz not null default now()
);

-- Helper Functions
create or replace function is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists(select 1 from profiles where id = auth.uid() and role = 'admin');
$$;

create or replace function consume_quota(
  p_user uuid, p_slug text, p_metric text, p_amount integer,
  p_limit integer, p_period_start timestamptz
) returns boolean
language plpgsql security definer set search_path = public as $$
declare v_used integer;
begin
  insert into usage_counters(user_id, automation_slug, metric, period_start, used)
  values (p_user, p_slug, p_metric, p_period_start, 0)
  on conflict (user_id, automation_slug, metric, period_start) do nothing;

  update usage_counters set used = used + p_amount
  where user_id = p_user and automation_slug = p_slug
    and metric = p_metric and period_start = p_period_start
    and used + p_amount <= p_limit
  returning used into v_used;

  return v_used is not null;
end $$;
revoke all on function consume_quota(uuid, text, text, integer, integer, timestamptz) from public, anon, authenticated;

-- Indexes
create index if not exists idx_subscriptions_user on subscriptions(user_id);
create index if not exists idx_automation_instances_user on automation_instances(user_id);
create index if not exists idx_runs_instance on runs(instance_id);
create index if not exists idx_runs_user on runs(user_id);
create index if not exists idx_payments_user on payments(user_id);
create index if not exists idx_notifications_user on notifications(user_id);

-- Enable RLS on every table
alter table profiles enable row level security;
alter table plans enable row level security;
alter table subscriptions enable row level security;
alter table automation_instances enable row level security;
alter table credentials enable row level security;
alter table usage_counters enable row level security;
alter table runs enable row level security;
alter table payments enable row level security;
alter table webhook_events enable row level security;
alter table notifications enable row level security;
alter table audit_log enable row level security;

-- Profiles Policies
create policy "profiles_select_own" on profiles
  for select using (id = auth.uid() or is_admin());

create policy "profiles_update_own" on profiles
  for update using (id = auth.uid())
  with check (id = auth.uid());

-- Restrict column updates on profiles: role can never be updated by client
revoke update on profiles from authenticated;
grant update (full_name, phone, company) on profiles to authenticated;

-- Plans Policies
create policy "plans_select_active" on plans
  for select using (is_active or is_admin());

create policy "plans_admin_all" on plans
  for all using (is_admin());

-- Subscriptions Policies
create policy "subscriptions_select_own" on subscriptions
  for select using (user_id = auth.uid() or is_admin());

-- Automation Instances Policies
create policy "instances_select_own" on automation_instances
  for select using (user_id = auth.uid() or is_admin());

create policy "instances_insert_own" on automation_instances
  for insert with check (user_id = auth.uid());

create policy "instances_update_own" on automation_instances
  for update using (user_id = auth.uid() or is_admin())
  with check (user_id = auth.uid() or is_admin());

create policy "instances_delete_own" on automation_instances
  for delete using (user_id = auth.uid() or is_admin());

-- Usage Counters Policies
create policy "usage_select_own" on usage_counters
  for select using (user_id = auth.uid() or is_admin());

-- Runs Policies
create policy "runs_select_own" on runs
  for select using (user_id = auth.uid() or is_admin());

-- Payments Policies
create policy "payments_select_own" on payments
  for select using (user_id = auth.uid() or is_admin());

-- Notifications Policies
create policy "notifications_select_own" on notifications
  for select using (user_id = auth.uid() or is_admin());

create policy "notifications_update_own" on notifications
  for update using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- Audit Log Policies
create policy "audit_log_select_admin" on audit_log
  for select using (is_admin());

-- Credentials & Webhook Events: No policies granted to anon or authenticated (Service Role only)

-- Auth User Creation Trigger
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  v_admin_emails text;
  v_role app_role := 'user';
begin
  -- Fetch ADMIN_EMAILS if configured
  v_admin_emails := coalesce(current_setting('app.settings.admin_emails', true), 'hello.nexvanta56@gmail.com');
  if new.email is not null and v_admin_emails ilike '%' || new.email || '%' then
    v_role := 'admin';
  end if;

  insert into public.profiles (id, full_name, phone, company, role, accepted_terms_at)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'phone', ''),
    coalesce(new.raw_user_meta_data->>'company', ''),
    v_role,
    case when new.raw_user_meta_data->>'accepted_terms_at' is not null
      then (new.raw_user_meta_data->>'accepted_terms_at')::timestamptz
      else now()
    end
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
