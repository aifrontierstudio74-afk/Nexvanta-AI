'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { SaaSAutomation } from '@/data/saas';
import { QuoteModal } from '@/components/common/QuoteModal';
import { submitLead } from '@/lib/submitLead';
import { isValidIndianPhone, formatINR } from '@/lib/format';
import {
  Check,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  HelpCircle,
  ChevronDown,
  Layers,
  Sparkles,
} from 'lucide-react';

interface SaaSDetailClientProps {
  automation: SaaSAutomation;
}

export const SaaSDetailClient: React.FC<SaaSDetailClientProps> = ({
  automation,
}) => {
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Demo Request Form
  const [demoName, setDemoName] = useState('');
  const [demoPhone, setDemoPhone] = useState('');
  const [demoEmail, setDemoEmail] = useState('');
  const [demoCompany, setDemoCompany] = useState('');
  const [demoConsent, setDemoConsent] = useState(true);
  const [demoHoneypot, setDemoHoneypot] = useState('');
  const [demoStart, setDemoStart] = useState<number>(() => Date.now());
  const [submittingDemo, setSubmittingDemo] = useState(false);
  const [demoSuccess, setDemoSuccess] = useState(false);
  const [demoError, setDemoError] = useState<string | null>(null);

  const handleDemoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setDemoError(null);

    if (!demoName.trim()) {
      setDemoError('Please enter your full name.');
      return;
    }
    if (!demoPhone.trim() || !isValidIndianPhone(demoPhone)) {
      setDemoError('Please enter a valid 10-digit Indian mobile number.');
      return;
    }
    if (!demoConsent) {
      setDemoError('Please confirm consent.');
      return;
    }

    setSubmittingDemo(true);
    const duration = Date.now() - demoStart;

    try {
      const res = await submitLead({
        name: demoName,
        phone: demoPhone,
        email: demoEmail,
        company: demoCompany,
        interestedIn: automation.title,
        segment: 'SaaS',
        source: 'Demo Request',
        consent: demoConsent,
        honeypot: demoHoneypot,
        submissionDurationMs: duration,
      });

      if (res.ok) {
        setDemoSuccess(true);
      } else {
        setDemoError(res.error || 'Failed to submit demo request.');
      }
    } catch {
      setDemoError('Network error. Please message us on WhatsApp.');
    } finally {
      setSubmittingDemo(false);
    }
  };

  return (
    <div className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-20">
      {/* 1. Hero */}
      <section className="text-center max-w-4xl mx-auto space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-gold/30 bg-gold/10 text-gold text-xs font-mono tracking-wider uppercase">
          <span>AUTOMATION {automation.number}</span>
          {automation.badge && <span>· {automation.badge}</span>}
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold font-heading text-text">
          {automation.title}
        </h1>

        <p className="text-xl sm:text-2xl text-gold font-medium">
          &ldquo;{automation.tagline}&rdquo;
        </p>

        <p className="text-muted text-base sm:text-lg leading-relaxed max-w-3xl mx-auto">
          {automation.description}
        </p>

        {/* 2 CTA Buttons: "Get a fixed quote" and "Subscribe" */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button
            onClick={() => setQuoteModalOpen(true)}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gold text-black font-heading font-bold text-sm uppercase tracking-wide hover:bg-gold-soft transition-all shadow-gold-glow flex items-center justify-center gap-2"
          >
            Get a Fixed Quote ↗
          </button>
          <Link
            href={`/signup?plan=${automation.slug}`}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl border border-border-strong bg-surface hover:bg-surface-2 text-text font-heading font-semibold text-sm uppercase tracking-wide hover:border-gold transition-all flex items-center justify-center gap-2"
          >
            Subscribe to {automation.title}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* 2. Bullets as Larger Feature Cards */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-mono text-gold uppercase tracking-wider px-3 py-1 rounded bg-gold/10 border border-gold/20 inline-block mb-3">
            CAPABILITIES
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-heading text-text">
            Engineered Capabilities
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {automation.bullets.map((bullet, idx) => (
            <div
              key={idx}
              className="p-6 md:p-8 rounded-2xl bg-surface border border-border flex items-start gap-4 hover:border-gold/50 transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-gold/10 text-gold border border-gold/30 flex items-center justify-center shrink-0">
                <Check className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-base text-text mb-1">
                  Feature 0{idx + 1}
                </h3>
                <p className="text-muted text-sm leading-relaxed">{bullet}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. How It Works (3 Steps) */}
      <section className="rounded-3xl bg-surface border border-border p-8 md:p-12">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-mono text-gold uppercase tracking-wider px-3 py-1 rounded bg-gold/10 border border-gold/20 inline-block mb-3">
            WORKFLOW
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-heading text-text">
            How It Works
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {automation.howItWorks.map((step) => (
            <div key={step.step} className="p-6 rounded-2xl bg-surface-2 border border-border relative">
              <div className="font-mono text-4xl font-extrabold text-gold/20 mb-3">
                {step.step}
              </div>
              <h3 className="font-heading font-bold text-lg text-text mb-2">
                {step.title}
              </h3>
              <p className="text-muted text-xs sm:text-sm leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Pricing Block */}
      <section className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <span className="text-xs font-mono text-gold uppercase tracking-wider px-3 py-1 rounded bg-gold/10 border border-gold/20 inline-block mb-3">
            TRANSPARENT INVESTMENT
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-heading text-text">
            Pricing Architecture
          </h2>
        </div>

        {automation.pricing.tiers ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {automation.pricing.tiers.map((tier) => (
              <div
                key={tier.name}
                className={`p-6 md:p-8 rounded-2xl border flex flex-col justify-between ${
                  tier.highlighted
                    ? 'bg-surface border-gold shadow-gold-glow relative'
                    : 'bg-surface border-border'
                }`}
              >
                <div>
                  {tier.highlighted && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gold text-black font-mono text-[10px] font-bold">
                      RECOMMENDED
                    </span>
                  )}
                  <h3 className="font-heading font-bold text-xl text-text mb-2">
                    {tier.name}
                  </h3>
                  <div className="flex items-baseline gap-1 mb-4">
                    <span className="text-3xl font-extrabold font-mono text-gold">
                      {formatINR(tier.price)}
                    </span>
                    <span className="text-muted text-xs font-mono">/{tier.period}</span>
                  </div>
                  <p className="text-muted text-xs mb-6 font-mono">{tier.limit}</p>
                </div>

                <Link
                  href={`/signup?plan=${automation.slug}&tier=${tier.name.toLowerCase()}`}
                  className={`w-full py-2.5 rounded-xl text-center text-xs font-heading font-semibold transition-all ${
                    tier.highlighted
                      ? 'bg-gold text-black hover:bg-gold-soft'
                      : 'bg-surface-2 border border-border text-text hover:border-gold'
                  }`}
                >
                  Choose {tier.name} Plan
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 rounded-2xl bg-surface border border-border-strong grid grid-cols-1 md:grid-cols-2 gap-8 items-center text-center md:text-left">
            <div>
              <span className="text-xs font-mono text-muted uppercase block mb-1">
                ONE-TIME IMPLEMENTATION
              </span>
              <div className="text-3xl font-extrabold font-mono text-text mb-2">
                {automation.pricing.setup}
              </div>
              <p className="text-muted text-xs leading-relaxed">
                Includes dedicated domain setup, SPF/DKIM/DMARC protocols, custom prompt tuning, and CRM schema mapping.
              </p>
            </div>
            <div className="md:border-l md:border-border md:pl-8">
              <span className="text-xs font-mono text-gold uppercase block mb-1">
                MONTHLY SUBSCRIPTION
              </span>
              <div className="text-3xl font-extrabold font-mono text-gold mb-2">
                {automation.pricing.saas}
              </div>
              <p className="text-muted text-xs leading-relaxed">
                Covers server infrastructure, API inference compute, model updates, and ongoing monitoring.
              </p>
            </div>
          </div>
        )}
      </section>

      {/* 5. Request a Demo Form */}
      <section className="max-w-3xl mx-auto bg-surface border border-border-strong rounded-3xl p-8 md:p-12 shadow-2xl">
        <div className="text-center mb-8">
          <span className="text-xs font-mono text-gold uppercase tracking-wider px-3 py-1 rounded bg-gold/10 border border-gold/20 inline-block mb-3">
            INTERACTIVE PREVIEW
          </span>
          <h2 className="text-2xl md:text-3xl font-bold font-heading text-text">
            Request a Live Demo
          </h2>
          <p className="text-muted text-xs sm:text-sm mt-1">
            See {automation.title} in action on a 15-minute walkthrough call.
          </p>
        </div>

        {demoSuccess ? (
          <div className="text-center py-8">
            <div className="w-14 h-14 bg-success/15 border border-success/40 text-success rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold font-heading text-text mb-2">
              Demo Request Received
            </h3>
            <p className="text-muted text-xs max-w-md mx-auto">
              Our technical consultant will message you on WhatsApp to confirm a demo time slot.
            </p>
          </div>
        ) : (
          <form onSubmit={handleDemoSubmit} className="space-y-4">
            <input
              type="text"
              name="honeypot"
              value={demoHoneypot}
              onChange={(e) => setDemoHoneypot(e.target.value)}
              className="hidden"
              aria-hidden="true"
            />

            {demoError && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-xl">
                {demoError}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-muted uppercase mb-1">
                  Full Name <span className="text-gold">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={demoName}
                  onChange={(e) => setDemoName(e.target.value)}
                  placeholder="Karan Mehra"
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
                  value={demoPhone}
                  onChange={(e) => setDemoPhone(e.target.value)}
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
                  value={demoEmail}
                  onChange={(e) => setDemoEmail(e.target.value)}
                  placeholder="karan@enterprise.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface-2 border border-border text-text text-xs sm:text-sm focus:border-gold focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-muted uppercase mb-1">
                  Company / Agency
                </label>
                <input
                  type="text"
                  value={demoCompany}
                  onChange={(e) => setDemoCompany(e.target.value)}
                  placeholder="Mehra Digital"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface-2 border border-border text-text text-xs sm:text-sm focus:border-gold focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-start gap-2 pt-2">
              <input
                type="checkbox"
                id="demo-consent"
                checked={demoConsent}
                onChange={(e) => setDemoConsent(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-border text-gold focus:ring-gold bg-surface-2 cursor-pointer"
              />
              <label htmlFor="demo-consent" className="text-xs text-muted cursor-pointer">
                I agree to be contacted by Nexvanta.AI about this demo request.
              </label>
            </div>

            <button
              type="submit"
              disabled={submittingDemo}
              className="w-full py-3.5 px-6 rounded-xl font-heading font-semibold text-sm bg-gold text-black hover:bg-gold-soft transition-all shadow-gold-glow flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {submittingDemo ? 'Scheduling Request...' : 'Schedule Live Demo ↗'}
            </button>
          </form>
        )}
      </section>

      {/* 6. FAQ Block */}
      <section className="max-w-4xl mx-auto space-y-4">
        <div className="text-center mb-6">
          <span className="text-xs font-mono text-gold uppercase tracking-wider px-3 py-1 rounded bg-gold/10 border border-gold/20 inline-block mb-2">
            FREQUENT QUESTIONS
          </span>
          <h2 className="text-2xl font-bold font-heading text-text">
            {automation.title} FAQs
          </h2>
        </div>

        <div className="space-y-3">
          {automation.faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-border bg-surface overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 focus:outline-none"
                >
                  <span className="font-heading font-semibold text-sm sm:text-base text-text flex items-center gap-3">
                    <HelpCircle className="w-4 h-4 text-gold shrink-0" />
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-muted transition-transform duration-200 shrink-0 ${
                      isOpen ? 'rotate-180 text-gold' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-muted leading-relaxed border-t border-border/50">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Quote Modal */}
      <QuoteModal
        isOpen={quoteModalOpen}
        onClose={() => setQuoteModalOpen(false)}
        defaultInterestedIn={automation.title}
        defaultSegment="SaaS"
      />
    </div>
  );
};
