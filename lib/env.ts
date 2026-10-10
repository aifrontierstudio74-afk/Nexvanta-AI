import { z } from 'zod';

const envSchema = z.object({
  // Supabase
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional().or(z.literal('')),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().optional().or(z.literal('')),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional().or(z.literal('')),

  // Razorpay
  RAZORPAY_KEY_ID: z.string().optional().or(z.literal('')),
  RAZORPAY_KEY_SECRET: z.string().optional().or(z.literal('')),
  RAZORPAY_WEBHOOK_SECRET: z.string().optional().or(z.literal('')),
  NEXT_PUBLIC_RAZORPAY_KEY_ID: z.string().optional().or(z.literal('')),

  // Inngest
  INNGEST_EVENT_KEY: z.string().optional().or(z.literal('')),
  INNGEST_SIGNING_KEY: z.string().optional().or(z.literal('')),

  // Resend
  RESEND_API_KEY: z.string().optional().or(z.literal('')),
  EMAIL_FROM: z.string().default('Nexvanta.AI <noreply@nexvanta.ai>'),

  // Upstash Redis
  UPSTASH_REDIS_REST_URL: z.string().url().optional().or(z.literal('')),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional().or(z.literal('')),

  // Security & Vault
  CREDENTIAL_ENC_KEY: z.string().optional().or(z.literal('')), // 32-byte base64

  // AI & LLM
  LLM_PROVIDER: z.enum(['anthropic', 'openai']).default('anthropic'),
  LLM_MODEL: z.string().optional().or(z.literal('')),
  ANTHROPIC_API_KEY: z.string().optional().or(z.literal('')),
  OPENAI_API_KEY: z.string().optional().or(z.literal('')),

  // Admin & Billing
  ADMIN_EMAILS: z.string().default('hello.nexvanta56@gmail.com'),
  PRICES_INCLUDE_GST: z
    .string()
    .transform((val) => val !== 'false')
    .default('true'),
  GST_PERCENT: z
    .string()
    .transform((val) => Number(val) || 18)
    .default('18'),
  GRACE_DAYS: z
    .string()
    .transform((val) => Number(val) || 3)
    .default('3'),

  // Site & Webhook (existing)
  NEXT_PUBLIC_SITE_URL: z.string().default('https://nexvanta.ai'),
  GOOGLE_SHEET_WEBHOOK_URL: z.string().optional().or(z.literal('')),
  GOOGLE_SHEET_SECRET: z.string().optional().or(z.literal('')),
  DOWNLOAD_TOKEN_SECRET: z.string().default('nx_dl_secret_key_prod_2026'),
});

const rawEnv = {
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID,
  RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET,
  RAZORPAY_WEBHOOK_SECRET: process.env.RAZORPAY_WEBHOOK_SECRET,
  NEXT_PUBLIC_RAZORPAY_KEY_ID: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
  INNGEST_EVENT_KEY: process.env.INNGEST_EVENT_KEY,
  INNGEST_SIGNING_KEY: process.env.INNGEST_SIGNING_KEY,
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  EMAIL_FROM: process.env.EMAIL_FROM || 'Nexvanta.AI <noreply@nexvanta.ai>',
  UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
  UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
  CREDENTIAL_ENC_KEY: process.env.CREDENTIAL_ENC_KEY,
  LLM_PROVIDER: (process.env.LLM_PROVIDER as 'anthropic' | 'openai') || 'anthropic',
  LLM_MODEL: process.env.LLM_MODEL || '',
  ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  ADMIN_EMAILS: process.env.ADMIN_EMAILS || 'hello.nexvanta56@gmail.com',
  PRICES_INCLUDE_GST: process.env.PRICES_INCLUDE_GST || 'true',
  GST_PERCENT: process.env.GST_PERCENT || '18',
  GRACE_DAYS: process.env.GRACE_DAYS || '3',
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'https://nexvanta.ai',
  GOOGLE_SHEET_WEBHOOK_URL: process.env.GOOGLE_SHEET_WEBHOOK_URL,
  GOOGLE_SHEET_SECRET: process.env.GOOGLE_SHEET_SECRET,
  DOWNLOAD_TOKEN_SECRET: process.env.DOWNLOAD_TOKEN_SECRET || 'nx_dl_secret_key_prod_2026',
};

const parsedEnv = envSchema.safeParse(rawEnv);

if (!parsedEnv.success) {
  console.error('❌ Environment validation failure:', parsedEnv.error.format());
  throw new Error('Invalid environment variables. Check server logs.');
}

export const env = parsedEnv.data;

export const isSupabaseConfigured = Boolean(
  env.NEXT_PUBLIC_SUPABASE_URL &&
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    env.SUPABASE_SERVICE_ROLE_KEY
);

export const isRazorpayConfigured = Boolean(
  env.RAZORPAY_KEY_ID && env.RAZORPAY_KEY_SECRET
);

export const isResendConfigured = Boolean(env.RESEND_API_KEY);

export const isUpstashConfigured = Boolean(
  env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN
);

export const adminEmailList = env.ADMIN_EMAILS.split(',')
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);
