import React from 'react';
import { Metadata } from 'next';
import { siteConfig } from '@/data/site';

export const metadata: Metadata = {
  title: 'Privacy Policy | Nexvanta.AI',
  description: 'Privacy Policy detailing data collection, processing, and protection by Nexvanta.AI.',
};

export default function PrivacyPage() {
  return (
    <div className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
      <div>
        <span className="text-xs font-mono text-gold uppercase tracking-wider block mb-2">
          LEGAL &amp; COMPLIANCE
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold font-heading text-text">
          Privacy Policy
        </h1>
        <p className="text-muted text-xs font-mono mt-1">
          Last updated: October 2026
        </p>
      </div>

      <div className="space-y-6 text-sm text-text/90 leading-relaxed bg-surface border border-border rounded-2xl p-6 md:p-10">
        <section className="space-y-2">
          <h2 className="text-lg font-bold font-heading text-text">1. Overview</h2>
          <p className="text-muted">
            Nexvanta.AI (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;) is dedicated to respecting and safeguarding the privacy of our visitors, clients, and partners. This Privacy Policy describes how we collect, store, and process personal data across our website and automated intake channels.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold font-heading text-text">2. Information We Collect</h2>
          <p className="text-muted">
            We collect personal information that you voluntarily provide when using our contact forms, quote request modals, and WhatsApp assistant chatbot:
          </p>
          <ul className="list-disc list-inside space-y-1 text-muted pl-2">
            <li>Name and contact details (email address, mobile/WhatsApp number)</li>
            <li>Business metadata (company name, industry, service interests)</li>
            <li>Payment reference numbers (UTR/Transaction IDs submitted for verification)</li>
            <li>Referral parameters (UTM campaign tags captured for analytics attribution)</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold font-heading text-text">3. Purpose of Processing</h2>
          <p className="text-muted">
            Collected data is utilized strictly for:
          </p>
          <ul className="list-disc list-inside space-y-1 text-muted pl-2">
            <li>Evaluating automation requirements and delivering personalized fixed quotes</li>
            <li>Conducting customer communication via WhatsApp, telephone, or email</li>
            <li>Fulfilling digital product downloads and subscription accounts</li>
            <li>Protecting forms against automated spam and unauthorized submissions</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold font-heading text-text">4. Third-Party Integrations &amp; Storage</h2>
          <p className="text-muted">
            Lead information is securely routed to our internal Google Sheets CRM webhook and stored for client management. We do not sell, rent, or trade your personal information to third-party advertisers. Payments are processed securely via PCI-DSS compliant gateways (such as Razorpay) or directly through authorized bank transfer channels.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold font-heading text-text">5. Contact Information</h2>
          <p className="text-muted">
            If you have questions regarding this Privacy Policy or wish to request data erasure, reach out to us at{' '}
            <strong className="text-text">{siteConfig.email}</strong> or{' '}
            <strong className="text-text">{siteConfig.phoneDisplay}</strong>.
          </p>
        </section>

        {/* Visible Draft Notice */}
        <div className="pt-6 border-t border-border/80 text-xs font-mono text-gold/90 bg-gold/5 p-4 rounded-xl border">
          ⚠️ Note: Draft — review with a legal professional before launch.
        </div>
      </div>
    </div>
  );
}
