'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { saasAutomations } from '@/data/saas';
import { SaaSCard } from '@/components/saas/SaaSCard';
import { QuoteModal } from '@/components/common/QuoteModal';
import { submitLead } from '@/lib/submitLead';
import { isValidIndianPhone } from '@/lib/format';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  HelpCircle,
  ChevronDown,
  Layers,
} from 'lucide-react';

const SAAS_FAQS = [
  {
    q: 'How do subscriptions work at Nexvanta?',
    a: 'Choose your desired automation, complete onboarding, and connect your business credentials (WhatsApp API, email inboxes, or social profiles). Our system manages pipeline processing automatically while you view real-time data on your dashboard.',
  },
  {
    q: 'Can I cancel or pause my subscription anytime?',
    a: 'Yes, subscriptions are billed monthly with no lock-in contracts. You can upgrade, downgrade, or cancel at any time from your billing portal.',
  },
  {
    q: 'Is technical setup assistance provided?',
    a: 'Yes! Even though SaaS automations run self-serve, our engineers perform initial domain warming, webhook routing, and integration support to ensure 100% operational reliability.',
  },
  {
    q: 'What is included in the one-time setup fee?',
    a: 'Domain setup, SPF/DKIM/DMARC authentication, custom prompt tuning, CRM pipeline schema creation, and personal team walkthroughs.',
  },
];

export const SaaSIndexClient: React.FC = () => {
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [quoteTarget, setQuoteTarget] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Lead Form
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [interestedIn, setInterestedIn] = useState('Lead Capture + CRM');
  const [consent, setConsent] = useState(true);
  const [honeypot, setHoneypot] = useState('');
  const [formStart, setFormStart] = useState<number>(() => Date.now());
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleOpenQuote = (title: string) => {
    setQuoteTarget(title);
    setQuoteModalOpen(true);
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!phone.trim() || !isValidIndianPhone(phone)) {
      setError('Please enter a valid 10-digit Indian mobile number.');
      return;
    }
    if (!consent) {
      setError('Please confirm consent.');
      return;
    }

    setSubmitting(true);
    const duration = Date.now() - formStart;

    try {
      const res = await submitLead({
        name,
        phone,
        email,
        company,
        interestedIn,
        segment: 'SaaS',
        source: 'SaaS Page Enquiry',
        consent,
        honeypot,
        submissionDurationMs: duration,
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        setError(res.error || 'Failed to submit enquiry.');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-20">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-mono text-gold uppercase tracking-wider px-3 py-1 rounded bg-gold/10 border border-gold/20 inline-block">
          SEGMENT 02 — SUBSCRIPTION SAAS
        </span>
        <h1 className="text-3xl sm:text-5xl font-bold font-heading text-text">
          5 Dedicated SaaS Automations
        </h1>
        <p className="text-muted text-sm sm:text-base leading-relaxed">
          Production automation engines you subscribe to and run directly. Complete with pipeline management, instant alerts, and hands-off background execution.
        </p>
      </div>

      {/* 5 Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {saasAutomations.map((automation) => (
          <SaaSCard
            key={automation.id}
            automation={automation}
            onOpenQuote={handleOpenQuote}
          />
        ))}
      </div>

      {/* How Subscriptions Work Strip */}
      <section className="rounded-3xl bg-surface border border-border p-8 md:p-12 text-center">
        <span className="text-xs font-mono text-gold uppercase tracking-wider px-3 py-1 rounded bg-gold/10 border border-gold/20 inline-block mb-3">
          LIFECYCLE
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold font-heading text-text mb-8">
          How Subscriptions Work
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
          {[
            {
              num: '1',
              title: 'Choose Automation',
              desc: 'Select the automation engine engineered for your bottleneck.',
            },
            {
              num: '2',
              title: 'Sign Up & Configure',
              desc: 'Select your tier, subscribe, and complete account authentication.',
            },
            {
              num: '3',
              title: 'We Onboard You',
              desc: 'Our technical team verifies credentials, domains, and webhooks.',
            },
            {
              num: '4',
              title: 'It Runs 24/7',
              desc: 'Workflows trigger autonomously, populating your CRM with qualified revenue.',
            },
          ].map((item) => (
            <div key={item.num} className="p-5 rounded-2xl bg-surface-2 border border-border">
              <div className="w-8 h-8 rounded-lg bg-gold/15 text-gold font-mono font-bold flex items-center justify-center mb-3 text-sm">
                {item.num}
              </div>
              <h3 className="font-heading font-bold text-text text-base mb-1.5">{item.title}</h3>
              <p className="text-muted text-xs leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-4xl mx-auto space-y-6">
        <div className="text-center">
          <span className="text-xs font-mono text-gold uppercase tracking-wider px-3 py-1 rounded bg-gold/10 border border-gold/20 inline-block mb-3">
            SAAS KNOWLEDGE BASE
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-heading text-text">
            SaaS Subscription FAQs
          </h2>
        </div>

        <div className="space-y-3">
          {SAAS_FAQS.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-border bg-surface overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 focus:outline-none"
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
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-muted leading-relaxed border-t border-border/50">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Lead Form */}
      <section className="max-w-3xl mx-auto bg-surface border border-border-strong rounded-3xl p-8 md:p-12 shadow-2xl">
        <div className="text-center mb-8">
          <span className="text-xs font-mono text-gold uppercase tracking-wider px-3 py-1 rounded bg-gold/10 border border-gold/20 inline-block mb-3">
            SUBSCRIBE CONSULTATION
          </span>
          <h2 className="text-2xl md:text-3xl font-bold font-heading text-text">
            Request Custom Automation Scope
          </h2>
          <p className="text-muted text-xs sm:text-sm mt-1">
            Need high-volume sending or bespoke routing? Request an enterprise consultation.
          </p>
        </div>

        {submitted ? (
          <div className="text-center py-8">
            <div className="w-14 h-14 bg-success/15 border border-success/40 text-success rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold font-heading text-text mb-2">Request Logged</h3>
            <p className="text-muted text-xs max-w-md mx-auto">
              Our engineering lead will connect with you via WhatsApp to configure your pipeline.
            </p>
          </div>
        ) : (
          <form onSubmit={handleLeadSubmit} className="space-y-4">
            <input
              type="text"
              name="honeypot"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              className="hidden"
              aria-hidden="true"
            />

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-xl">
                {error}
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
                  value={name}
                  onChange={(e) => setName(e.target.value)}
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
                  placeholder="karan@enterprise.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface-2 border border-border text-text text-xs sm:text-sm focus:border-gold focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-muted uppercase mb-1">
                  Desired Automation
                </label>
                <select
                  value={interestedIn}
                  onChange={(e) => setInterestedIn(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface-2 border border-border text-text text-xs sm:text-sm focus:border-gold focus:outline-none"
                >
                  {saasAutomations.map((s) => (
                    <option key={s.id} value={s.title}>
                      {s.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-start gap-2 pt-2">
              <input
                type="checkbox"
                id="saas-consent"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-border text-gold focus:ring-gold bg-surface-2 cursor-pointer"
              />
              <label htmlFor="saas-consent" className="text-xs text-muted cursor-pointer">
                I agree to be contacted by Nexvanta.AI regarding subscription details.
              </label>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 px-6 rounded-xl font-heading font-semibold text-sm bg-gold text-black hover:bg-gold-soft transition-all shadow-gold-glow flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Request SaaS Information ↗'}
            </button>
          </form>
        )}
      </section>

      {/* Quote Modal */}
      <QuoteModal
        isOpen={quoteModalOpen}
        onClose={() => setQuoteModalOpen(false)}
        defaultInterestedIn={quoteTarget}
        defaultSegment="SaaS"
      />
    </div>
  );
};
