import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { saasAutomations } from '@/data/saas';
import { SaaSDetailClient } from '@/components/saas/SaaSDetailClient';

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  return saasAutomations.map((a) => ({
    slug: a.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const automation = saasAutomations.find((a) => a.slug === params.slug);
  if (!automation) return { title: 'Automation Not Found | Nexvanta.AI' };

  return {
    title: `${automation.title} | Nexvanta.AI`,
    description: automation.description,
  };
}

export default function SaaSDetailPage({ params }: Props) {
  const automation = saasAutomations.find((a) => a.slug === params.slug);

  if (!automation) {
    notFound();
  }

  return <SaaSDetailClient automation={automation} />;
}
