import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { saasAutomations } from '@/data/saas';
import { LayoutDashboard, ArrowRight, ShieldCheck, Cpu } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Client Dashboard | Nexvanta.AI',
  description: 'Manage and run your subscribed SaaS automation modules.',
};

export default function DashboardPage() {
  return (
    <div className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-8">
        <div>
          <span className="text-xs font-mono text-gold uppercase tracking-wider block mb-1">
            CONTROL CENTER
          </span>
          <h1 className="text-3xl font-bold font-heading text-text">
            Client Automation Dashboard
          </h1>
          <p className="text-muted text-sm mt-1">
            Monitor background pipelines, manage subscription modules, and inspect live runs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-full border border-border bg-surface-2 text-xs font-mono text-muted flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-success"></span>
            <span>All Engines Operational</span>
          </div>
        </div>
      </div>

      {/* 5 Automation Cards with Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {saasAutomations.map((automation) => (
          <div
            key={automation.id}
            className="rounded-2xl bg-surface border border-border p-6 flex flex-col justify-between hover:border-gold/50 transition-colors"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-xs text-muted">
                  MODULE {automation.number}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-surface-2 border border-border text-[10px] font-mono text-muted">
                  Not Subscribed
                </span>
              </div>

              <h3 className="text-xl font-bold font-heading text-text mb-2">
                {automation.title}
              </h3>
              <p className="text-muted text-xs leading-relaxed mb-6">
                {automation.description}
              </p>
            </div>

            <div className="pt-4 border-t border-border flex items-center justify-between">
              <span className="text-xs font-mono text-gold">
                {automation.pricing.saas || 'From ₹999/mo'}
              </span>
              <Link
                href={`/app/${automation.slug}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-2 hover:bg-gold hover:text-black border border-border hover:border-gold text-xs font-heading font-semibold transition-all"
              >
                Launch Console
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
