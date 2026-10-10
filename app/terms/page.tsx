import React from 'react';
import { Metadata } from 'next';
import { siteConfig } from '@/data/site';

export const metadata: Metadata = {
  title: 'Terms of Service | Nexvanta.AI',
  description: 'Terms of Service governing use of Nexvanta.AI services, SaaS products, and digital assets.',
};

export default function TermsPage() {
  return (
    <div className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
      <div>
        <span className="text-xs font-mono text-gold uppercase tracking-wider block mb-2">
          TERMS OF USE
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold font-heading text-text">
          Terms of Service
        </h1>
        <p className="text-muted text-xs font-mono mt-1">
          Last updated: October 2026
        </p>
      </div>

      <div className="space-y-6 text-sm text-text/90 leading-relaxed bg-surface border border-border rounded-2xl p-6 md:p-10">
        <section className="space-y-2">
          <h2 className="text-lg font-bold font-heading text-text">1. Agreement to Terms</h2>
          <p className="text-muted">
            By accessing or using Nexvanta.AI, you agree to be bound by these Terms of Service. If you disagree with any portion of these terms, please refrain from using our website and services.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold font-heading text-text">2. Service Scope</h2>
          <p className="text-muted">
            Nexvanta.AI offers custom AI automation engineering, software subscription tools, and downloadable digital assets. Service delivery timelines, milestones, and deliverables for service-based engagements are defined exclusively in formal written quotation agreements.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold font-heading text-text">3. Intellectual Property &amp; License</h2>
          <p className="text-muted">
            All code, digital assets, templates, and trademarks displayed on Nexvanta.AI are the intellectual property of Nexvanta.AI unless otherwise noted. Purchasing a digital product grants a non-exclusive, non-transferable license for internal business use; redistribution or resale of downloadable assets is strictly prohibited.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold font-heading text-text">4. Client Responsibilities</h2>
          <p className="text-muted">
            Clients utilizing our WhatsApp and voice AI agents must comply with applicable telecommunications laws, anti-spam guidelines, and Meta Business platform terms. Nexvanta.AI is not liable for account suspensions resulting from inappropriate client usage or prohibited messaging categories.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold font-heading text-text">5. Governing Law &amp; Jurisdiction</h2>
          <p className="text-muted">
            These Terms are governed by and construed in accordance with the laws of India. Any disputes arising in connection with these terms shall be subject to the exclusive jurisdiction of the courts of India.
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
