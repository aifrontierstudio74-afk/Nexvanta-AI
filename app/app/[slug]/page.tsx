import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { automationRegistry } from '@/lib/automations/registry';
import { ArrowLeft } from 'lucide-react';

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const automationModule = automationRegistry[params.slug];
  if (!automationModule) return { title: 'Module Not Found | Nexvanta.AI' };
  return {
    title: `${automationModule.title} Console | Nexvanta.AI`,
  };
}

export default function AutomationConsolePage({ params }: Props) {
  const automationModule = automationRegistry[params.slug];

  if (!automationModule) {
    notFound();
  }

  const Component = automationModule.Component;

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8">
      <div>
        <Link
          href="/app"
          className="inline-flex items-center gap-2 text-xs font-mono text-muted hover:text-gold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Automation Dashboard
        </Link>
      </div>

      <div className="border-b border-border pb-6 flex items-center justify-between">
        <div>
          <span className="text-xs font-mono text-gold uppercase tracking-wider block mb-1">
            ACTIVE RUNNER SHELL
          </span>
          <h1 className="text-3xl font-bold font-heading text-text">
            {automationModule.title}
          </h1>
        </div>
        <span className="px-3 py-1 rounded-full bg-surface-2 border border-border text-xs font-mono text-muted">
          v1.0 (Sandbox)
        </span>
      </div>

      <div className="py-6">
        <Component />
      </div>
    </div>
  );
}
