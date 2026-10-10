# Nexvanta.AI — Production Website & Lead CRM Engine

Production-ready, high-converting website and automated lead machine for **Nexvanta.AI**, an Indian AI automation agency and SaaS platform.

Built with Next.js 14 (App Router), TypeScript (strict), Tailwind CSS, Framer Motion, and Google Apps Script CRM integration.

---

## 1. Project Overview

The website serves two vital functions:
1. **Storefront with Exactly Three Offerings**:
   - **Segment 1 — Service-Based**: 30 turnkey industry-specific AI agents + Website Design & Build.
   - **Segment 2 — Subscription-Based SaaS**: 5 hands-off automation systems with central dashboards.
   - **Segment 3 — Digital Products**: Downloadable prompt packs & SOP starter kits (seeded at ₹99).
2. **Automated Lead Generation Machine**: Every interaction (contact forms, quote requests, demo requests, chatbot messages, digital product checkouts, manual payment claims) automatically logs a formatted row to a Google Sheet CRM with instant email alerts sent to `hello.nexvanta56@gmail.com`. The owner can export this sheet directly to Excel (.xlsx) in one click.

---

## 2. Tech Stack & Architecture

- **Framework**: Next.js 14+ (App Router), React 18, Node 20
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS with custom dark navy-black and gold design tokens
- **Typography**: Syne (Headings), Plus Jakarta Sans (Body), JetBrains Mono (Numbers, Badges)
- **Forms & Validation**: React Hook Form, Zod
- **Animations & Icons**: Framer Motion, Lucide React
- **Payments**: Razorpay Checkout + Editable Manual UPI & Bank Transfer
- **CRM Integration**: Google Apps Script Web App (`integrations/google-apps-script/Code.gs`)
- **Testing**: Vitest for strict data verification

---

## 3. Folder Structure

```
nexvanta-ai/
├── app/
│   ├── api/
│   │   ├── checkout/
│   │   │   ├── create-order/route.ts   # Razorpay order creator
│   │   │   └── verify/route.ts         # HMAC payment verifier
│   │   ├── download/route.ts           # 15-min HMAC token download validator
│   │   ├── lead/route.ts               # Core CRM webhook lead collector
│   │   └── subscriptions/create/       # Phase 2 Razorpay subscription skeleton
│   ├── app/                            # Phase 2 Client Portal / Dashboard
│   │   ├── [slug]/page.tsx             # Runner console placeholder
│   │   └── page.tsx                    # 5 SaaS automations status view
│   ├── contact/page.tsx                # Contact page with direct cards & form
│   ├── digital-products/
│   │   ├── [slug]/page.tsx             # Product detail & checkout flow
│   │   └── page.tsx                    # Digital product shelf
│   ├── pay/page.tsx                    # Dedicated manual UPI & Bank transfer hub
│   ├── privacy/page.tsx                # Privacy Policy (draft)
│   ├── refund/page.tsx                 # Refund & Cancellation Policy (draft)
│   ├── saas/
│   │   ├── [slug]/page.tsx             # Automation feature & pricing detail
│   │   └── page.tsx                    # 5 SaaS automations index
│   ├── services/page.tsx               # 30 AI agent catalog + Website Build
│   ├── terms/page.tsx                  # Terms of Service (draft)
│   ├── thank-you/page.tsx              # Confirmation & secure download
│   ├── globals.css                     # Design tokens & film-grain overlay
│   ├── icon.svg                        # Gold SVG "N" favicon
│   ├── layout.tsx                      # Root layout, Header, Footer, Chatbot
│   ├── not-found.tsx                   # Custom 404 page
│   ├── page.tsx                        # High-converting home page
│   ├── robots.ts                       # SEO robots.txt
│   └── sitemap.ts                      # Dynamic sitemap.xml
├── components/
│   ├── auth/                           # Login and signup card components
│   ├── chatbot/                        # WhatsApp-style state machine widget
│   ├── common/                         # Wordmark, QuoteModal, PaymentModal
│   ├── digital-products/               # Product cards and checkout modal
│   ├── home/                           # Home client section components
│   ├── layout/                         # Header and Footer
│   ├── saas/                           # SaaS card and detail views
│   └── services/                       # 30-agent catalog & table view
├── data/
│   ├── agents.ts                       # Exact 30 service agents & pricing
│   ├── digital-products.ts             # Editable digital product catalog
│   ├── payment.ts                      # Editable UPI & Bank account details
│   ├── saas.ts                         # 5 SaaS automation copies & tiers
│   └── site.ts                         # Brand facts, phone, email, WhatsApp
├── integrations/
│   └── google-apps-script/
│       └── Code.gs                     # Google Sheets CRM script with Excel export
├── lib/
│   ├── automations/                    # Phase 2 module registry and types
│   ├── chatbot/ai-adapter.ts           # Future AI / n8n webhook extension hook
│   ├── format.ts                       # Indian INR currency & phone formatter
│   ├── submitLead.ts                   # Client lead submission & UTM manager
│   └── token.ts                        # HMAC token generation & verification
├── tests/
│   └── agents.test.ts                  # Vitest unit test for 30 agents data
├── .env.example                        # Environment variables template
├── next.config.mjs                     # Security headers & CSP
├── tailwind.config.ts                  # Custom design tokens
└── tsconfig.json                       # Strict TypeScript configuration
```

---

## 4. How to Run Locally

1. Clone or download the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create your local environment file:
   ```bash
   cp .env.example .env.local
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 5. How to Edit Business Content

### A. 30 Industry-Specific AI Agents
Open `data/agents.ts`. Edit, update or re-order any agent in the `agents` array. Prices are stored as numbers (e.g. `8000`) and formatted at render time automatically.

### B. 5 SaaS Automations
Open `data/saas.ts`. Edit titles, taglines, descriptions, bullet points, and pricing tiers (such as the 3 YouTube tiers: Starter, Pro, Studio).

### C. Digital Products
Open `data/digital-products.ts`. To add a new product, simply add a new object to the `digitalProducts` array:
```ts
{
  slug: "new-product-slug",
  title: "New Product Title",
  tagline: "Short product hook",
  description: "Comprehensive product description...",
  price: 199,
  image: "data:image/svg+xml;utf8,...", // or path in /public
  features: ["Feature 1", "Feature 2"],
  fileUrl: "https://your-storage-bucket.com/file.zip",
  isActive: true,
}
```
No code modifications or database migrations required.

---

## 6. How to Change Payment Details (UPI & Bank Transfer)

All payment details live in **one single file**: `data/payment.ts`.

```ts
export const paymentConfig = {
  enableRazorpay: true,          // toggle online card/UPI gateway
  enableUpi: true,               // toggle manual UPI option
  enableBankTransfer: true,      // toggle manual bank transfer option
  upi: {
    upiId: "name@okhdfcbank",    // enter your UPI ID here
    payeeName: "Nexvanta.AI",
    qrImage: "/payment/upi-qr.png", // place QR image in public/payment/
  },
  bank: {
    accountHolderName: "Nexvanta AI Pvt Ltd",
    bankName: "HDFC Bank",
    accountNumber: "50200000000000",
    ifsc: "HDFC0001234",
    branch: "Connaught Place, New Delhi",
    accountType: "Current",
  },
  instructions: "After paying, submit your transaction/UTR number so we can confirm your order.",
  supportEmail: "hello.nexvanta56@gmail.com",
  supportWhatsApp: "919713103152",
};
```
- **Hiding an option**: If any field is left empty or the flag is set to `false`, that option is automatically hidden across all payment modals and the `/pay` page.
- **UTR Claims**: Users who pay manually can submit their UTR transaction ID, which is logged as a **HOT** lead in the Google Sheet CRM for verification.

---

## 7. Google Sheet CRM Setup Steps (Owner Walkthrough)

Follow these exact steps to connect your website leads to Google Sheets:

1. Open [Google Sheets](https://sheets.google.com) and create a new spreadsheet named **"Nexvanta Leads"**.
2. Click **Extensions** → **Apps Script** in the top menu.
3. Delete any default code in `Code.gs` and paste the contents of `integrations/google-apps-script/Code.gs`.
4. On line 2, replace `CHANGE_THIS_SECRET` with a long random secret key of your choice (e.g., `nx_secret_9941a82f3`).
5. Click **Deploy** → **New deployment**.
   - Select type: **Web app**
   - Description: `Nexvanta Lead Webhook`
   - Execute as: **Me** (`your-email@gmail.com`)
   - Who has access: **Anyone**
6. Click **Deploy**, approve permissions when prompted, and copy the **Web app URL**.
7. In your `.env.local` (and in Vercel project environment variables), set:
   ```env
   GOOGLE_SHEET_WEBHOOK_URL="https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec"
   GOOGLE_SHEET_SECRET="nx_secret_9941a82f3"
   ```
8. **Exporting to Excel**: In your Google Sheet, use the newly added top menu: **Nexvanta** → **Download as Excel (.xlsx)**, or go to **File** → **Download** → **Microsoft Excel (.xlsx)**.
9. **Test Submission**: Submit a quote or contact enquiry on the website. Verify that a new colored row appears in the sheet and an email arrives at `hello.nexvanta56@gmail.com`.

---

## 8. Razorpay Setup (Test & Live Mode)

1. Sign up or log into [Razorpay Dashboard](https://dashboard.razorpay.com).
2. Go to **Settings** → **API Keys** → click **Generate Key**.
3. In test mode, copy `Key ID` and `Key Secret`.
4. Add to your `.env.local`:
   ```env
   RAZORPAY_KEY_ID="rzp_test_..."
   RAZORPAY_KEY_SECRET="..."
   NEXT_PUBLIC_RAZORPAY_KEY_ID="rzp_test_..."
   ```
5. When ready for live production, switch to Live Mode on Razorpay, generate Live Keys, and update the environment variables in Vercel.

---

## 9. Vercel Deployment Guide

1. Push this repository to GitHub or GitLab.
2. In [Vercel](https://vercel.com), click **Add New Project** and import the repository.
3. In **Environment Variables**, add:
   - `GOOGLE_SHEET_WEBHOOK_URL`
   - `GOOGLE_SHEET_SECRET`
   - `NEXT_PUBLIC_SITE_URL` (e.g. `https://nexvanta.ai`)
   - `RAZORPAY_KEY_ID`
   - `RAZORPAY_KEY_SECRET`
   - `NEXT_PUBLIC_RAZORPAY_KEY_ID`
   - `DOWNLOAD_TOKEN_SECRET` (generate a random 32-character string)
4. Click **Deploy**.
5. After deployment, navigate to **Project Settings** → **Domains** and connect your custom domain (e.g. `nexvanta.ai`).

---

## 10. Verification & Quality Assurance

Run test suite:
```bash
npm run test
```

Run linter:
```bash
npm run lint
```

Build production bundle:
```bash
npm run build
```
All commands pass with zero errors.

---

## 11. SaaS Platform Core — Non-Developer Owner Setup Guide

Follow these steps to activate the multi-user SaaS foundation, automated billing, encrypted credentials vault, and admin portal.

### 1. Supabase Setup (Database & Auth)
1. Sign up / log into [Supabase](https://supabase.com) and click **New Project** (choose South Asia - Mumbai region).
2. Open the **SQL Editor** in your Supabase dashboard:
   - Run the migration file: `supabase/migrations/20261011000000_saas_platform_core.sql`
   - Run the seed file: `supabase/seed.sql` (populates 15 tiered plans across all 5 automations)
3. Under **Project Settings** → **API**, copy:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - Anon Public Key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Service Role Key → `SUPABASE_SERVICE_ROLE_KEY` (keep secret!)
4. Under **Authentication** → **URL Configuration**:
   - Set **Site URL** to `https://<your-domain>`
   - Add **Redirect URL**: `https://<your-domain>/auth/callback` (and `http://localhost:3000/auth/callback` for testing)
5. **Grant Admin Privileges**: Once you sign up with your email, go to the SQL Editor and execute:
   ```sql
   UPDATE public.profiles SET is_admin = true WHERE id = (SELECT id FROM auth.users WHERE email = 'your-email@example.com');
   ```

### 2. Razorpay Subscriptions & Webhook Setup
1. Open the [Razorpay Dashboard](https://dashboard.razorpay.com) and switch to **Test Mode** (or Live Mode when launching).
2. Under **Settings** → **API Keys**, get `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET`.
3. Under **Settings** → **Webhooks**, click **Add New Webhook**:
   - Webhook URL: `https://<your-domain>/api/webhooks/razorpay`
   - Secret: create a secret string and set it as `RAZORPAY_WEBHOOK_SECRET`
   - Active Events: select:
     - `subscription.activated`
     - `subscription.charged`
     - `subscription.pending`
     - `subscription.halted`
     - `subscription.cancelled`
4. Register the 15 subscription plans automatically:
   ```bash
   npm run seed:razorpay-plans
   ```
   This script registers the plans in Razorpay and prints out the plan IDs to update into your `plans` table.

### 3. Resend Setup (Transactional Emails)
1. Sign up at [Resend](https://resend.com) and create an API Key.
2. Set `RESEND_API_KEY="re_..."` in your environment.
3. Verify your custom sending domain, or test with Resend's default onboarding address:
   - Set `EMAIL_FROM="Nexvanta.AI <notifications@your-domain.com>"`

### 4. Upstash Redis (Rate Limiting)
1. Sign up at [Upstash](https://upstash.com) and create a Redis database.
2. In the database details, copy **REST API**:
   - `UPSTASH_REDIS_REST_URL="https://..."`
   - `UPSTASH_REDIS_REST_TOKEN="..."`
   *(Note: If omitted, the platform automatically falls back to an in-memory sliding window rate limiter).*

### 5. Inngest Setup (Background Jobs & Crons)
1. Sign up at [Inngest](https://inngest.com) and create an app:
   - App URL: `https://<your-domain>/api/inngest`
2. Copy `INNGEST_EVENT_KEY` and `INNGEST_SIGNING_KEY` into your environment variables.

### 6. AES-256 Encryption Key (Credentials Vault)
Generate a cryptographically secure 32-byte encryption key for integration secrets:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```
Paste the generated string into `CREDENTIAL_ENC_KEY`.

### 7. AI Gateway Configuration
Specify your preferred LLM provider for the automation pipelines:
- `LLM_PROVIDER=anthropic` (or `openai`)
- `LLM_MODEL=claude-3-5-sonnet-20241022`
- `ANTHROPIC_API_KEY="..."` or `OPENAI_API_KEY="..."`

---

## 12. 10-Minute End-to-End Test (Zero Cost)

1. **Sign Up**: Navigate to `/signup` and create a free user account.
2. **Access App**: You will be redirected to `/app`. You will see all 5 automation cards locked with the active lock indicator.
3. **Test the Demo Module**: Open `/app/demo-automation` — this interactive benchmark module has built-in entitlement and allows testing live LLM prompts, runs recording, and quota meters immediately.
4. **Subscribe via Razorpay Test Card**: Go to `/saas/lead-capture-crm`, pick a plan, and proceed to checkout with a Razorpay test card.
5. **Or Simulate a Webhook**:
   ```bash
   npm run simulate:webhook -- --subId=sub_test_123 --status=active
   ```
6. **Instant Unlock**: Return to `/app/lead-capture-crm`. The console is unlocked, displaying the Setup Wizard, Execution Runs table, and Quota meters.
7. **Test Manual UPI / Bank Approval**:
   - Go to `/app/checkout?plan=lead-capture-crm-basic`, select **Manual UPI / Bank Transfer**, enter a test UTR (e.g. `UTR1234567890`), and submit claim.
   - Open `/admin/payments` with your admin user.
   - Click **Approve**. The subscription activates immediately and sends a dark-gold confirmation receipt email to the user.

