-- NEXVANTA.AI — SaaS Platform Core Seed Plans

insert into public.plans (automation_slug, code, name, price_inr, limits, is_active, sort_order)
values
  -- 1. Lead Capture & Instant AI Qualification CRM
  ('lead-capture-crm', 'lead-capture-basic', 'Basic', 3500, '{"leads_per_month": 500}', true, 1),
  ('lead-capture-crm', 'lead-capture-growth', 'Growth', 5500, '{"leads_per_month": 2000}', true, 2),
  ('lead-capture-crm', 'lead-capture-pro', 'Pro', 7500, '{"leads_per_month": 5000}', true, 3),

  -- 2. Cold Email AI Outreach & Warm Follow-up
  ('email-outreach', 'email-outreach-basic', 'Basic', 5000, '{"emails_per_month": 1500}', true, 1),
  ('email-outreach', 'email-outreach-growth', 'Growth', 7500, '{"emails_per_month": 5000}', true, 2),
  ('email-outreach', 'email-outreach-pro', 'Pro', 10000, '{"emails_per_month": 15000}', true, 3),

  -- 3. Social Media Auto-Repurposing & Multi-Platform Posting
  ('social-auto-posting', 'social-basic', 'Basic', 3000, '{"posts_per_month": 60}', true, 1),
  ('social-auto-posting', 'social-growth', 'Growth', 4500, '{"posts_per_month": 150}', true, 2),
  ('social-auto-posting', 'social-pro', 'Pro', 6000, '{"posts_per_month": 400}', true, 3),

  -- 4. Voice AI Receptionist & Inbound Qualification
  ('voice-agent', 'voice-basic', 'Basic', 8000, '{"minutes_per_month": 300}', true, 1),
  ('voice-agent', 'voice-growth', 'Growth', 11500, '{"minutes_per_month": 750}', true, 2),
  ('voice-agent', 'voice-pro', 'Pro', 15000, '{"minutes_per_month": 1500}', true, 3),

  -- 5. Faceless YouTube & Shorts Content Pipeline
  ('youtube-automation', 'youtube-starter', 'Starter', 999, '{"videos_per_month": 8}', true, 1),
  ('youtube-automation', 'youtube-pro', 'Pro', 2499, '{"videos_per_month": 20}', true, 2),
  ('youtube-automation', 'youtube-studio', 'Studio', 4999, '{"videos_per_month": 40}', true, 3)
on conflict (code) do update set
  name = excluded.name,
  price_inr = excluded.price_inr,
  limits = excluded.limits,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order;
