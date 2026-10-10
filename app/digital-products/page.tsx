import React from 'react';
import { Metadata } from 'next';
import { DigitalProductsClient } from '@/components/digital-products/DigitalProductsClient';

export const metadata: Metadata = {
  title: 'Digital Products & Automation SOPs (₹99) | Nexvanta.AI',
  description:
    'Download production AI frameworks, prompt engineering packs, and automation SOPs for immediate implementation.',
};

export default function DigitalProductsPage() {
  return <DigitalProductsClient />;
}
