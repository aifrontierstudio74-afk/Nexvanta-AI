import React from 'react';
import { Metadata } from 'next';
import { SaaSIndexClient } from '@/components/saas/SaaSIndexClient';

export const metadata: Metadata = {
  title: 'Subscription-Based SaaS Automations | Nexvanta.AI',
  description:
    '5 self-serve AI automation systems for Lead Capture & CRM, Cold Email Outreach, Social Media Auto-Posting, Voice AI Receptionist, and YouTube Creator Automation.',
};

export default function SaaSPage() {
  return <SaaSIndexClient />;
}
