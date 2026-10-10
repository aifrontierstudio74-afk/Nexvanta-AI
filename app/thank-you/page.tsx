import React, { Suspense } from 'react';
import { Metadata } from 'next';
import { ThankYouClient } from '@/components/common/ThankYouClient';

export const metadata: Metadata = {
  title: 'Thank You | Nexvanta.AI',
  description: 'Thank you for connecting with Nexvanta.AI.',
};

export default function ThankYouPage() {
  return (
    <Suspense
      fallback={
        <div className="py-24 text-center text-muted font-mono text-sm">
          Loading confirmation...
        </div>
      }
    >
      <ThankYouClient />
    </Suspense>
  );
}
