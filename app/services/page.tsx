import React, { Suspense } from 'react';
import { Metadata } from 'next';
import { ServicesClient } from '@/components/services/ServicesClient';

export const metadata: Metadata = {
  title: 'Service-Based AI Agents (30 Listings) | Nexvanta.AI',
  description:
    'Turnkey, done-for-you AI agents built for Indian clinics, real estate, salons, gyms, restaurants, and professional services.',
};

export default function ServicesPage() {
  return (
    <Suspense
      fallback={
        <div className="py-24 text-center text-muted font-mono text-sm">
          Loading AI Agent Listings...
        </div>
      }
    >
      <ServicesClient />
    </Suspense>
  );
}
