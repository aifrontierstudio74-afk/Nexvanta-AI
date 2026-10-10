'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { AuthCard } from '@/components/auth/AuthCard';

function SignupContent() {
  const searchParams = useSearchParams();
  const plan = searchParams.get('plan') || undefined;
  return <AuthCard mode="signup" plan={plan} />;
}

export default function SignupPage() {
  return (
    <Suspense
      fallback={
        <div className="py-24 text-center text-muted font-mono text-sm">
          Loading sign up...
        </div>
      }
    >
      <SignupContent />
    </Suspense>
  );
}
