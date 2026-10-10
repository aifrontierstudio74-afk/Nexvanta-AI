'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { siteConfig } from '@/data/site';
import { saasAutomations } from '@/data/saas';
import { SaaSCard } from '@/components/saas/SaaSCard';
import { QuoteModal } from '@/components/common/QuoteModal';
import { submitLead } from '@/lib/submitLead';
import { isValidIndianPhone } from '@/lib/format';
import {
  ArrowRight,
  MessageSquare,
  Sparkles,
  Bot,
  Layers,
  ShoppingBag,
  CheckCircle2,
  ChevronDown,
  HelpCircle,
} from 'lucide-react';

interface HomeClientProps {
  industries: string[];
}

const FAQS = [
  {
    q: 'What is an AI agent?',
    a: 'An AI agent is an autonomous software worker programmed to perform specific business tasks — such as answering patient calls, booking appointments, following up with real estate buyers, or answering customer inquiries on WhatsApp 24/7 without human intervention.',
  },
  {
    q: 'What is the difference between the three segments?',
    a: '1. Services: 30 done-for-you, turnkey AI agents tailored to specific industries.\n2. SaaS: 5 self-serve automation systems with monthly subscription plans.\n3. Digital Products: Instant downloadable SOPs and prompt kits starting at ₹99.',
  },
  {
    q: 'Does Nexvanta support Hindi and Hinglish?',
    a: 'Yes. Our WhatsApp and Voice AI models are natively calibrated for Indian vernacular nuances, effortlessly comprehending and responding in pure Hindi, standard English, or mixed conversational Hinglish.',
  },
  {
    q: 'Why is there a one-time setup fee in addition to monthly subscription?',
    a: 'The one-time setup covers custom prompt engineering, CRM pipeline integration, telephony routing, calendar synchronization, and rigorous sandbox testing for your specific business logic. The monthly fee covers AI inference compute, server maintenance, and ongoing updates.',
  },
  {
    q: 'How do I get a fixed quote for my business?',
    a: 'Simply click "Get a fixed quote" on any agent card or submit our consultation form. Our automation architects will evaluate your workflow volume and share a comprehensive, fixed-price implementation proposal within 24 hours.',
  },
  {
    q: 'What is the digital product starter kit (₹99)?',
    a: 'It is a curated downloadable pack containing battle-tested prompt templates, system architectures, and standard operating procedures (SOPs) designed to help founders immediately implement AI workflows.',
  },
  {
    q: 'How long does implementation take?',
    a: 'Standard service agents and website builds are deployed within 5 to 7 business days from requirement sign-off.',
  },
  {
    q: 'Do you offer custom integrations with proprietary CRMs?',
    a: 'Yes, we integrate with Google Sheets, Zoho, Salesforce, LeadSquared, HubSpot, WhatsApp Cloud API, and any REST API webhook.',
  },
];

export const HomeClient: React.FC<HomeClientProps> = ({ industries }) => {
  const router = useRouter();
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [quoteTarget, setQuoteTarget] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Home Lead Form States
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('');
  const [lookingFor, setLookingFor] = useState('Service-Based AI Agent');
  const [consent, setConsent] = useState(true);
  const [honeypot, setHoneypot] = useState('');
  const [formStart, setFormStart] = useState<number>(() => Date.now());
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleOpenQuote = (agentOrSaaS: string) => {
    setQuoteTarget(agentOrSaaS);
    setQuoteModalOpen(true);
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!name.trim()) {
      setFormError('Please enter your full name.');
      return;
    }
    if (!phone.trim() || !isValidIndianPhone(phone)) {
      setFormError('Please enter a valid 10-digit Indian mobile number.');
      return;
    }
    if (!consent) {
      setFormError('Please confirm consent to be contacted.');
      return;
    }

    setFormSubmitting(true);
    const duration = Date.now() - formStart;

    try {
      let segment: 'Service' | 'SaaS' | 'Digital Product' | 'General' = 'General';
      if (lookingFor.includes('Service')) segment = 'Service';
      else if (lookingFor.includes('SaaS')) segment = 'SaaS';
      else if (lookingFor.includes('Digital')) segment = 'Digital Product';

      const res = await submitLead({
        name,
        phone,
        email,
        company,
        industry: selectedIndustry,
        interestedIn: lookingFor,
        segment,
        source: 'Home Lead Form',
        consent,
        honeypot,
        submissionDurationMs: duration,
      });

      if (res.ok) {
        setFormSuccess(true);
      } else {
        setFormError(res.error || 'Failed to submit enquiry. Please message us on WhatsApp.');
      }
    } catch {
      setFormError('Network error. Please connect with us directly via WhatsApp.');
    } finally {
      setFormSubmitting(false);
    }
  };

  return (
    <div className="space-y-24 md:space-y-36 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative pt-16 md:pt-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        {/* Subtle Gold Gradient Glow behind Hero */}
        <div
          className="absolute -top-10 left-1/2 -translate-x-1/2 w-[350px] sm:w-[650px] h-[350px] sm:h-[450px] bg-gold/10 blur-[130px] rounded-full pointer-events-none -z-10"
          aria-hidden="true"
        />

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-gold/30 bg-gold/10 text-gold text-xs font-mono tracking-wider uppercase mb-8">
          <Sparkles className="w-3.5 h-3.5" />
          <span>PRODUCTION-GRADE AI ARCHITECTURES</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold font-heading text-text tracking-tight max-w-5xl mx-auto leading-[1.1] mb-6">
          AI Automation That Works{' '}
          <span className="text-gold underline decoration-gold/40 underline-offset-8">
            While You Sleep
          </span>
        </h1>

        <p className="text-base sm:text-xl text-muted max-w-3xl mx-auto leading-relaxed mb-10">
          AI agents for WhatsApp, voice, sales and operations in{' '}
          <span className="text-text font-medium">Hindi, English and Hinglish</span>. Stop losing warm leads and run your business on high-converting autopilot.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md sm:max-w-none mx-auto">
          <Link
            href="/services"
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gold text-black font-heading font-bold text-sm uppercase tracking-wide hover:bg-gold-soft transition-all shadow-gold-glow flex items-center justify-center gap-2"
          >
            Explore Services
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/saas"
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl border border-border-strong bg-surface hover:bg-surface-2 text-text font-heading font-semibold text-sm uppercase tracking-wide hover:border-gold transition-all flex items-center justify-center gap-2"
          >
            See SaaS Plans
          </Link>
          <a
            href={siteConfig.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-whatsapp/15 border border-whatsapp/40 text-whatsapp hover:bg-whatsapp hover:text-black font-semibold text-sm transition-all flex items-center justify-center gap-2"
          >
            <MessageSquare className="w-4 h-4 fill-current" />
            WhatsApp (+91 97131 03152)
          </a>
        </div>
      </section>

      {/* 2. FACT STRIP (Non-negotiable true facts only) */}
      <section className="border-y border-border bg-surface-2/60 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            {siteConfig.factStrip.map((fact, index) => (
              <div key={index} className="flex flex-col items-center justify-center">
                <span className="font-mono text-xs text-gold uppercase tracking-widest mb-1">
                  FACT 0{index + 1}
                </span>
                <span className="font-heading font-bold text-sm sm:text-base text-text">
                  {fact}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. THREE SEGMENTS OVERVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-mono text-gold uppercase tracking-wider px-3 py-1 rounded bg-gold/10 border border-gold/20 inline-block mb-3">
            CATALOG ARCHITECTURE
          </span>
          <h2 className="text-3xl md:text-4xl font-bold font-heading text-text">
            Three Ways to Deploy AI
          </h2>
          <p className="text-muted text-sm mt-2">
            Tailored deployment models designed for agencies, clinics, retail stores, and modern enterprises.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Segment 1: Services */}
          <Link
            href="/services"
            className="group rounded-2xl bg-surface border border-border p-8 transition-all hover:border-gold hover:shadow-gold-glow hover:-translate-y-1.5 flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-gold/10 border border-gold/30 flex items-center justify-center text-gold mb-6 group-hover:scale-110 transition-transform">
                <Bot className="w-6 h-6" />
              </div>
              <span className="font-mono text-xs text-gold uppercase tracking-wider block mb-1">
                SEGMENT 01
              </span>
              <h3 className="text-2xl font-bold font-heading text-text mb-3">
                Service-Based
              </h3>
              <p className="text-muted text-sm leading-relaxed mb-6">
                30 industry-specific AI agents built and calibrated for your exact business requirements. Turnkey setup with zero maintenance headaches.
              </p>
            </div>
            <div>
              <div className="h-[1px] w-full bg-border my-4" />
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-muted uppercase block">STARTING AT</span>
                  <span className="text-gold font-mono font-bold text-base">From ₹8,000/mo</span>
                </div>
                <span className="text-xs font-heading font-semibold text-text group-hover:text-gold transition-colors flex items-center gap-1">
                  View 30 Agents <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </Link>

          {/* Segment 2: SaaS */}
          <Link
            href="/saas"
            className="group rounded-2xl bg-surface border border-border p-8 transition-all hover:border-gold hover:shadow-gold-glow hover:-translate-y-1.5 flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-gold/10 border border-gold/30 flex items-center justify-center text-gold mb-6 group-hover:scale-110 transition-transform">
                <Layers className="w-6 h-6" />
              </div>
              <span className="font-mono text-xs text-gold uppercase tracking-wider block mb-1">
                SEGMENT 02
              </span>
              <h3 className="text-2xl font-bold font-heading text-text mb-3">
                Subscription SaaS
              </h3>
              <p className="text-muted text-sm leading-relaxed mb-6">
                5 powerful automations you subscribe to and manage yourself. Complete with central control dashboards and instant alerts.
              </p>
            </div>
            <div>
              <div className="h-[1px] w-full bg-border my-4" />
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-muted uppercase block">STARTING AT</span>
                  <span className="text-gold font-mono font-bold text-base">From ₹999/mo</span>
                </div>
                <span className="text-xs font-heading font-semibold text-text group-hover:text-gold transition-colors flex items-center gap-1">
                  Explore Plans <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </Link>

          {/* Segment 3: Digital Products */}
          <Link
            href="/digital-products"
            className="group rounded-2xl bg-surface border border-border p-8 transition-all hover:border-gold hover:shadow-gold-glow hover:-translate-y-1.5 flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-gold/10 border border-gold/30 flex items-center justify-center text-gold mb-6 group-hover:scale-110 transition-transform">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <span className="font-mono text-xs text-gold uppercase tracking-wider block mb-1">
                SEGMENT 03
              </span>
              <h3 className="text-2xl font-bold font-heading text-text mb-3">
                Digital Products
              </h3>
              <p className="text-muted text-sm leading-relaxed mb-6">
                Battle-tested prompt kits, SOP frameworks, and workflow architectures. Downloadable instantly for DIY implementation.
              </p>
            </div>
            <div>
              <div className="h-[1px] w-full bg-border my-4" />
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-muted uppercase block">PRICE</span>
                  <span className="text-gold font-mono font-bold text-base">₹99</span>
                </div>
                <span className="text-xs font-heading font-semibold text-text group-hover:text-gold transition-colors flex items-center gap-1">
                  Instant Download <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* 4. FEATURED SAAS AUTOMATIONS (5 cards compact) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-xs font-mono text-gold uppercase tracking-wider px-3 py-1 rounded bg-gold/10 border border-gold/20 inline-block mb-3">
              SUBSCRIPTION ENGINES
            </span>
            <h2 className="text-3xl md:text-4xl font-bold font-heading text-text">
              Featured SaaS Automations
            </h2>
            <p className="text-muted text-sm mt-2">
              Ready-to-deploy systems designed for high-velocity revenue and lead generation.
            </p>
          </div>
          <Link
            href="/saas"
            className="text-xs font-mono text-gold hover:underline flex items-center gap-1 shrink-0"
          >
            View all 5 automation details ↗
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {saasAutomations.map((automation) => (
            <SaaSCard
              key={automation.id}
              automation={automation}
              onOpenQuote={handleOpenQuote}
            />
          ))}
        </div>
      </section>

      {/* 5. INDUSTRIES WE SERVE (Chips from 30 agents data) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-surface border border-border p-8 md:p-12 text-center">
          <span className="text-xs font-mono text-gold uppercase tracking-wider px-3 py-1 rounded bg-gold/10 border border-gold/20 inline-block mb-3">
            VERTICAL SPECIALIZATION
          </span>
          <h2 className="text-3xl md:text-4xl font-bold font-heading text-text mb-4">
            Industries We Serve
          </h2>
          <p className="text-muted text-sm max-w-2xl mx-auto mb-8">
            Click any niche to view dedicated AI agents specifically calibrated for your customer workflows and terminology:
          </p>

          <div className="flex flex-wrap justify-center gap-2.5 max-w-4xl mx-auto">
            {industries.map((ind) => (
              <button
                key={ind}
                onClick={() => router.push(`/services?industry=${encodeURIComponent(ind)}`)}
                className="px-4 py-2 rounded-xl bg-surface-2 border border-border hover:border-gold hover:bg-gold/10 text-xs sm:text-sm text-text hover:text-gold transition-all"
              >
                {ind} ↗
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 6. HOW IT WORKS (4 Steps) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-mono text-gold uppercase tracking-wider px-3 py-1 rounded bg-gold/10 border border-gold/20 inline-block mb-3">
            EXECUTION PLAYBOOK
          </span>
          <h2 className="text-3xl md:text-4xl font-bold font-heading text-text">
            How It Works
          </h2>
          <p className="text-muted text-sm mt-2">
            From initial discovery to full live automation in 4 disciplined steps.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              step: '01',
              title: 'Tell Us Your Business',
              desc: 'Share your current sales and inquiry channels, volume, and customer journey bottlenecks.',
            },
            {
              step: '02',
              title: 'Choose Agent or Tool',
              desc: 'Select an industry-specific service agent or subscribe to a ready-made SaaS automation engine.',
            },
            {
              step: '03',
              title: 'We Set It Up',
              desc: 'Our engineers configure prompt knowledge, verify telephony, connect webhooks, and test extensively.',
            },
            {
              step: '04',
              title: 'Run on Autopilot',
              desc: 'Leads, bookings, and customer inquiries execute 24/7 with instant alerts routed to your team.',
            },
          ].map((item) => (
            <div
              key={item.step}
              className="p-6 rounded-2xl bg-surface border border-border relative overflow-hidden"
            >
              <div className="font-mono text-4xl font-extrabold text-gold/20 mb-4">
                {item.step}
              </div>
              <h3 className="text-lg font-bold font-heading text-text mb-2">
                {item.title}
              </h3>
              <p className="text-muted text-xs leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 7. LEAD CAPTURE SECTION */}
      <section id="lead-capture" className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-surface border border-border-strong p-8 md:p-12 shadow-2xl relative">
          <div className="text-center mb-8">
            <span className="text-xs font-mono text-gold uppercase tracking-wider px-3 py-1 rounded bg-gold/10 border border-gold/20 inline-block mb-3">
              DIRECT INQUIRY
            </span>
            <h2 className="text-2xl md:text-3xl font-bold font-heading text-text">
              Automate Your Operations
            </h2>
            <p className="text-muted text-xs md:text-sm mt-2">
              Submit your details to receive an end-to-end automation architecture and pricing proposal.
            </p>
          </div>

          {formSuccess ? (
            <div className="text-center py-10">
              <div className="w-16 h-16 rounded-full bg-success/15 border border-success/40 text-success flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold font-heading mb-2 text-text">
                Enquiry Logged Successfully
              </h3>
              <p className="text-muted text-sm max-w-md mx-auto mb-6">
                Our automation team has received your enquiry. We will connect with you on WhatsApp or phone within 24 hours.
              </p>
              <a
                href={siteConfig.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-whatsapp text-black font-semibold text-xs"
              >
                Continue to WhatsApp Now
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          ) : (
            <form onSubmit={handleLeadSubmit} className="space-y-4">
              {/* Honeypot */}
              <input
                type="text"
                name="honeypot"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
                className="hidden"
                aria-hidden="true"
              />

              {formError && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
                  {formError}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-muted uppercase mb-1">
                    Your Name <span className="text-gold">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Rahul Verma"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface-2 border border-border text-text text-xs sm:text-sm focus:border-gold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-muted uppercase mb-1">
                    Mobile / WhatsApp <span className="text-gold">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="97131 03152"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface-2 border border-border text-text text-xs sm:text-sm focus:border-gold focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-muted uppercase mb-1">
                    Work Email (Optional)
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="rahul@company.in"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface-2 border border-border text-text text-xs sm:text-sm focus:border-gold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-muted uppercase mb-1">
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Verma Dental Care"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface-2 border border-border text-text text-xs sm:text-sm focus:border-gold focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-muted uppercase mb-1">
                    Industry
                  </label>
                  <select
                    value={selectedIndustry}
                    onChange={(e) => setSelectedIndustry(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface-2 border border-border text-text text-xs sm:text-sm focus:border-gold focus:outline-none"
                  >
                    <option value="">Select Industry</option>
                    {industries.map((ind) => (
                      <option key={ind} value={ind}>
                        {ind}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-mono text-muted uppercase mb-1">
                    What are you looking for?
                  </label>
                  <select
                    value={lookingFor}
                    onChange={(e) => setLookingFor(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface-2 border border-border text-text text-xs sm:text-sm focus:border-gold focus:outline-none"
                  >
                    <option value="Service-Based AI Agent">Service-Based AI Agent (Turnkey)</option>
                    <option value="SaaS Subscription Automation">SaaS Subscription Automation</option>
                    <option value="Digital Product Starter Kit (₹99)">Digital Product Starter Kit (₹99)</option>
                    <option value="Website Design + Build">Website Design + Build</option>
                    <option value="Custom Enterprise Automation">Custom Enterprise Automation</option>
                  </select>
                </div>
              </div>

              <div className="flex items-start gap-2 pt-2">
                <input
                  type="checkbox"
                  id="home-consent"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-border text-gold focus:ring-gold bg-surface-2 cursor-pointer"
                />
                <label htmlFor="home-consent" className="text-xs text-muted cursor-pointer leading-relaxed">
                  I agree to be contacted by Nexvanta.AI about my enquiry via WhatsApp, phone, or email.
                </label>
              </div>

              <button
                type="submit"
                disabled={formSubmitting}
                className="w-full py-3.5 px-6 rounded-xl font-heading font-semibold text-sm bg-gold text-black hover:bg-gold-soft transition-all shadow-gold-glow flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {formSubmitting ? 'Recording Enquiry...' : 'Request Proposal & Pricing ↗'}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* 8. FAQ SECTION (6 to 8 honest questions) */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-xs font-mono text-gold uppercase tracking-wider px-3 py-1 rounded bg-gold/10 border border-gold/20 inline-block mb-3">
            CLEAR ANSWERS
          </span>
          <h2 className="text-3xl md:text-4xl font-bold font-heading text-text">
            Frequently Asked Questions
          </h2>
          <p className="text-muted text-sm mt-2">
            No jargon, no invented guarantees — transparent facts about how our AI systems operate.
          </p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-border bg-surface overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                  aria-expanded={isOpen}
                >
                  <span className="font-heading font-semibold text-sm sm:text-base text-text flex items-center gap-3">
                    <HelpCircle className="w-4 h-4 text-gold shrink-0" />
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-muted transition-transform duration-200 shrink-0 ${
                      isOpen ? 'rotate-180 text-gold' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-muted leading-relaxed whitespace-pre-line border-t border-border/50">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 9. FINAL CTA BAND */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-b from-surface to-surface-2 border border-border-strong p-8 md:p-14 text-center relative overflow-hidden shadow-2xl">
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl sm:text-5xl font-bold font-heading text-text">
              Ready to Automate Your Business?
            </h2>
            <p className="text-muted text-sm sm:text-base leading-relaxed">
              Join leading Indian clinics, developers, and businesses operating 24/7 with zero missed leads.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <button
                onClick={() => setQuoteModalOpen(true)}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gold text-black font-heading font-bold text-sm uppercase tracking-wide hover:bg-gold-soft transition-all shadow-gold-glow"
              >
                Get a Fixed Quote ↗
              </button>
              <a
                href={siteConfig.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-whatsapp text-black font-semibold text-sm transition-all flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-4 h-4 fill-current" />
                Chat on WhatsApp (+91 97131 03152)
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Quote Modal */}
      <QuoteModal
        isOpen={quoteModalOpen}
        onClose={() => setQuoteModalOpen(false)}
        defaultInterestedIn={quoteTarget}
        defaultSegment="General"
      />
    </div>
  );
};
