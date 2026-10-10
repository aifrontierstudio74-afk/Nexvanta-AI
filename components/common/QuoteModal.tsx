'use client';

import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, ArrowRight } from 'lucide-react';
import { submitLead } from '@/lib/submitLead';
import { isValidIndianPhone } from '@/lib/format';

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultInterestedIn?: string;
  defaultSegment?: 'Service' | 'SaaS' | 'General';
}

export const QuoteModal: React.FC<QuoteModalProps> = ({
  isOpen,
  onClose,
  defaultInterestedIn = '',
  defaultSegment = 'General',
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [industry, setIndustry] = useState('');
  const [interestedIn, setInterestedIn] = useState(defaultInterestedIn);
  const [message, setMessage] = useState('');
  const [consent, setConsent] = useState(true);
  const [honeypot, setHoneypot] = useState('');
  const [startTime, setStartTime] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setStartTime(Date.now());
      setInterestedIn(defaultInterestedIn);
      setSubmitted(false);
      setError(null);
      // Trap ESC key
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, defaultInterestedIn, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
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
      setError('Please confirm consent to be contacted regarding your quote.');
      return;
    }

    setLoading(true);
    const duration = Date.now() - startTime;

    try {
      const res = await submitLead({
        name,
        phone,
        email,
        company,
        industry,
        interestedIn: interestedIn || defaultInterestedIn,
        segment: defaultSegment,
        source: 'Quote Request',
        message,
        consent,
        honeypot,
        submissionDurationMs: duration,
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        setError(res.error || 'Failed to submit quote request. Please try again.');
      }
    } catch {
      setError('An error occurred. Please contact us on WhatsApp directly.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="quote-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-lg bg-surface border border-border-strong rounded-2xl p-6 md:p-8 shadow-2xl text-text overflow-y-auto max-h-[90vh]">
        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Close quote modal"
          className="absolute top-5 right-5 text-muted hover:text-text transition-colors p-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-success/10 border border-success/30 rounded-full flex items-center justify-center mx-auto mb-4 text-success">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 id="quote-modal-title" className="text-2xl font-bold font-heading mb-2 text-text">
              Quote Request Received
            </h3>
            <p className="text-muted text-sm mb-6 leading-relaxed">
              Thank you! Our automation engineers are reviewing your requirements and will reach out with a fixed, tailored quote via WhatsApp or phone.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="https://wa.me/919713103152"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-whatsapp text-black font-semibold text-sm hover:opacity-90 transition-opacity"
              >
                Chat Instantly on WhatsApp
                <ArrowRight className="w-4 h-4" />
              </a>
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl border border-border bg-surface-2 text-text text-sm hover:border-gold/40 transition-colors"
              >
                Close Window
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <span className="text-xs font-mono tracking-wider text-gold uppercase px-2.5 py-1 rounded bg-gold/10 border border-gold/20 inline-block mb-2">
                FIXED PROPOSAL
              </span>
              <h2 id="quote-modal-title" className="text-2xl font-bold font-heading text-text">
                Get a Fixed Quote
              </h2>
              <p className="text-muted text-xs md:text-sm mt-1">
                Tell us about your business. We will provide a transparent, fixed implementation scope within 24 hours.
              </p>
            </div>

            {error && (
              <div className="p-3 mb-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Honeypot field for bot protection */}
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

              {defaultInterestedIn && (
                <div>
                  <label className="block text-xs font-mono text-muted uppercase mb-1">
                    Selected Agent / Automation
                  </label>
                  <input
                    type="text"
                    value={interestedIn}
                    onChange={(e) => setInterestedIn(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface-2 border border-border text-text text-sm focus:border-gold focus:outline-none"
                  />
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-muted uppercase mb-1">
                    Your Name <span className="text-gold">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Aditya Sharma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface-2 border border-border text-text text-sm focus:border-gold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-muted uppercase mb-1">
                    Mobile / WhatsApp <span className="text-gold">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="97131 03152"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface-2 border border-border text-text text-sm focus:border-gold focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-muted uppercase mb-1">
                    Work Email (Optional)
                  </label>
                  <input
                    type="email"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface-2 border border-border text-text text-sm focus:border-gold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-muted uppercase mb-1">
                    Company / Clinic Name
                  </label>
                  <input
                    type="text"
                    placeholder="Nexvanta Tech"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface-2 border border-border text-text text-sm focus:border-gold focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-muted uppercase mb-1">
                  Industry / Niche
                </label>
                <input
                  type="text"
                  placeholder="e.g. Dental Clinic, Real Estate, E-commerce"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface-2 border border-border text-text text-sm focus:border-gold focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-muted uppercase mb-1">
                  Specific Requirements or Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="Describe your current process and goals..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface-2 border border-border text-text text-sm focus:border-gold focus:outline-none resize-none"
                />
              </div>

              <div className="flex items-start gap-2.5 pt-1">
                <input
                  type="checkbox"
                  id="quote-consent"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-border text-gold focus:ring-gold bg-surface-2 cursor-pointer"
                />
                <label htmlFor="quote-consent" className="text-xs text-muted cursor-pointer">
                  I agree to be contacted by Nexvanta.AI about my enquiry via WhatsApp, phone, or email.
                </label>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-6 rounded-xl font-heading font-semibold text-sm bg-gold text-black hover:bg-gold-soft active:scale-[0.99] transition-all shadow-gold-glow flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? 'Submitting Quote Request...' : 'Get a Fixed Quote ↗'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
