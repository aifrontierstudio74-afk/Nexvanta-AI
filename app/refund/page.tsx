import React from 'react';
import { Metadata } from 'next';
import { siteConfig } from '@/data/site';

export const metadata: Metadata = {
  title: 'Refund & Cancellation Policy | Nexvanta.AI',
  description: 'Refund, return, and cancellation policy for Nexvanta.AI services, SaaS plans, and digital products.',
};

export default function RefundPage() {
  return (
    <div className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
      <div>
        <span className="text-xs font-mono text-gold uppercase tracking-wider block mb-2">
          CLIENT GUARANTEES
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold font-heading text-text">
          Refund &amp; Cancellation Policy
        </h1>
        <p className="text-muted text-xs font-mono mt-1">
          Last updated: October 2026
        </p>
      </div>

      <div className="space-y-6 text-sm text-text/90 leading-relaxed bg-surface border border-border rounded-2xl p-6 md:p-10">
        <section className="space-y-2">
          <h2 className="text-lg font-bold font-heading text-text">1. Digital Products (Downloads &amp; SOP Kits)</h2>
          <p className="text-muted">
            Due to the immediate electronic delivery and intangible nature of digital products (such as our ₹99 Starter Kit), all sales of downloadable digital goods are final and non-refundable once the download link or access key has been generated. If you encounter technical difficulties accessing your purchase, please contact us at{' '}
            <strong className="text-text">{siteConfig.email}</strong> for prompt resolution.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold font-heading text-text">2. SaaS Subscriptions</h2>
          <p className="text-muted">
            SaaS subscriptions are billed on a monthly recurring basis. You may cancel your subscription at any time prior to the renewal billing cycle. Upon cancellation, access remains active until the conclusion of the paid billing month. Pro-rated refunds for partial monthly usage are not provided.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold font-heading text-text">3. Turnkey Service Agents &amp; Website Design</h2>
          <p className="text-muted">
            For custom service-based AI agent setups and Website Design + Build projects:
          </p>
          <ul className="list-disc list-inside space-y-1 text-muted pl-2">
            <li>One-time setup deposits cover dedicated engineering hours and are non-refundable once architecture build has commenced.</li>
            <li>If Nexvanta.AI fails to initiate the agreed implementation scope within the agreed timeline, clients may request a full refund of setup fees paid.</li>
            <li>Monthly maintenance retainers may be cancelled with 14 days written notice prior to the upcoming monthly cycle.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold font-heading text-text">4. Support &amp; Claim Requests</h2>
          <p className="text-muted">
            To submit an inquiry regarding an invoice or payment verification, contact our billing team at{' '}
            <strong className="text-text">{siteConfig.email}</strong> or via WhatsApp at{' '}
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
