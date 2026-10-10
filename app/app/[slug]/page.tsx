import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAutomationModule } from '@/lib/automations/registry';
import { AutomationConsoleClient } from '@/components/app/AutomationConsoleClient';

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const autoModule = getAutomationModule(params.slug);
  if (!autoModule) return { title: 'Module Not Found | Nexvanta.AI' };
  return {
    title: `${autoModule.title} Console | Nexvanta.AI`,
    description: `Configure, run, and monitor ${autoModule.title}.`,
  };
}

export default function AutomationConsolePage({ params }: Props) {
  const autoModule = getAutomationModule(params.slug);

  if (!autoModule) {
    notFound();
  }

  return <AutomationConsoleClient slug={params.slug} />;
}
