'use client';

import React, { useState } from 'react';
import { siteConfig } from '@/data/site';
import { submitLead } from '@/lib/submitLead';
import { isValidIndianPhone } from '@/lib/format';
import { getAllIndustries } from '@/data/agents';
import { Mail, Phone, MessageSquare, CheckCircle2, ArrowRight } from 'lucide-react';

export const ContactClient: React.FC = () => {
  const industries = getAllIndustries();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [industry, setIndustry] = useState('');
  const [interestedIn, setInterestedIn] = useState('Service-Based AI Agents');
  const [message, setMessage] = useState('');
  const [consent, setConsent] = useState(true);
  const [honeypot, setHoneypot] = useState('');
  const [startTime, setStartTime] = useState<number>(() => Date.now());
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Please provide your name.');
      return;
    }
    if (!phone.trim() || !isValidIndianPhone(phone)) {
      setError('Please provide a valid 10-digit Indian mobile number.');
      return;
    }
    if (!consent) {
      setError('Consent checkbox is required.');
      return;
    }

    setLoading(true);
    const duration = Date.now() - startTime;

    try {
      let segment: 'Service' | 'SaaS' | 'Digital Product' | 'General' = 'General';
      if (interestedIn.includes('Service') || interestedIn.includes('Website')) segment = 'Service';
      else if (interestedIn.includes('SaaS')) segment = 'SaaS';
      else if (interestedIn.includes('Digital')) segment = 'Digital Product';

      const res = await submitLead({
        name,
        phone,
        email,
        company,
        industry,
        interestedIn,
        segment,
        source: 'Contact Form',
        message,
        consent,
        honeypot,
        submissionDurationMs: duration,
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        setError(res.error || 'Failed to submit form.');
      }
    } catch {
      setError('Network error. Please message us on WhatsApp.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-mono text-gold uppercase tracking-wider px-3 py-1 rounded bg-gold/10 border border-gold/20 inline-block">
          DIRECT INQUIRY
        </span>
        <h1 className="text-3xl sm:text-5xl font-bold font-heading text-text">
          Contact Nexvanta.AI
        </h1>
        <p className="text-muted text-sm sm:text-base leading-relaxed">
          Connect directly with our engineering team for custom AI architecture proposals and deployment walkthroughs.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Direct Contact Cards (Left 5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-2xl bg-surface border border-border space-y-4">
            <h3 className="font-heading font-bold text-lg text-text">
              Direct Channels
            </h3>
            <p className="text-muted text-xs leading-relaxed">
              We respond to all verified business inquiries within 24 business hours.
            </p>

            <div className="space-y-4 pt-2">
              {/* Email */}
              <a
                href={`mailto:${siteConfig.email}`}
                className="p-4 rounded-xl bg-surface-2 border border-border flex items-center gap-3.5 hover:border-gold transition-colors group"
              >
                <div className="w-10 h-10 rounded-lg bg-gold/10 border border-gold/25 flex items-center justify-center text-gold group-hover:scale-105 transition-transform">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] font-mono text-muted uppercase">EMAIL US</div>
                  <div className="text-sm font-medium text-text group-hover:text-gold transition-colors">
                    {siteConfig.email}
                  </div>
                </div>
              </a>

              {/* Phone */}
              <a
                href={`tel:${siteConfig.phone}`}
                className="p-4 rounded-xl bg-surface-2 border border-border flex items-center gap-3.5 hover:border-gold transition-colors group"
              >
                <div className="w-10 h-10 rounded-lg bg-gold/10 border border-gold/25 flex items-center justify-center text-gold group-hover:scale-105 transition-transform">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] font-mono text-muted uppercase">CALL US</div>
                  <div className="text-sm font-medium text-text group-hover:text-gold transition-colors">
                    {siteConfig.phoneDisplay}
                  </div>
                </div>
              </a>

              {/* WhatsApp with prefilled message */}
              <a
                href={`https://wa.me/919713103152?text=${encodeURIComponent(
                  "Hi Nexvanta.AI, I'd like to know more about your services."
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-xl bg-whatsapp/10 border border-whatsapp/30 flex items-center gap-3.5 hover:bg-whatsapp/20 transition-colors group"
              >
                <div className="w-10 h-10 rounded-lg bg-whatsapp/20 border border-whatsapp/40 flex items-center justify-center text-whatsapp group-hover:scale-105 transition-transform">
                  <MessageSquare className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <div className="text-[10px] font-mono text-whatsapp uppercase font-semibold">WHATSAPP CHAT</div>
                  <div className="text-sm font-medium text-text">
                    +91 97131 03152
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Contact Form (Right 7 Cols) */}
        <div className="lg:col-span-7 bg-surface border border-border-strong rounded-3xl p-8 md:p-10 shadow-2xl">
          <h2 className="text-xl sm:text-2xl font-bold font-heading text-text mb-2">
            Send Us an Enquiry
          </h2>
          <p className="text-muted text-xs sm:text-sm mb-6">
            Fill out the form below and we will prepare a customized technical proposal.
          </p>

          {submitted ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-success/15 border border-success/40 text-success flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold font-heading text-text mb-2">
                Enquiry Logged
              </h3>
              <p className="text-muted text-sm max-w-md mx-auto mb-6">
                Thank you! Your enquiry has been routed directly to our team. We will connect with you on WhatsApp or phone shortly.
              </p>
              <a
                href={`https://wa.me/919713103152?text=${encodeURIComponent(
                  "Hi Nexvanta.AI, I'd like to know more about your services."
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-whatsapp text-black font-semibold text-xs"
              >
                Open WhatsApp Chat
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
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
                    Your Name <span className="text-gold">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Aditya Verma"
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
                    placeholder="name@company.com"
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
                    placeholder="Nexvanta Tech"
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
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
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
                    Interested In
                  </label>
                  <select
                    value={interestedIn}
                    onChange={(e) => setInterestedIn(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface-2 border border-border text-text text-xs sm:text-sm focus:border-gold focus:outline-none"
                  >
                    <option value="Service-Based AI Agents">Service-Based AI Agents (30 Listings)</option>
                    <option value="SaaS Subscriptions">Subscription-Based SaaS (5 Automations)</option>
                    <option value="Digital Products">Digital Products (₹99)</option>
                    <option value="Website Design + Build">Website Design + Build</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-muted uppercase mb-1">
                  Message / Requirements
                </label>
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us what workflows you want to automate..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface-2 border border-border text-text text-xs sm:text-sm focus:border-gold focus:outline-none resize-none"
                />
              </div>

              <div className="flex items-start gap-2 pt-1">
                <input
                  type="checkbox"
                  id="contact-consent"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-border text-gold focus:ring-gold bg-surface-2 cursor-pointer"
                />
                <label htmlFor="contact-consent" className="text-xs text-muted cursor-pointer leading-relaxed">
                  I agree to be contacted by Nexvanta.AI about my enquiry
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-6 rounded-xl font-heading font-semibold text-sm bg-gold text-black hover:bg-gold-soft transition-all shadow-gold-glow flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? 'Submitting...' : 'Send Message ↗'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
