'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { AuthCard } from '@/components/auth/AuthCard';

function LoginContent() {
  const searchParams = useSearchParams();
  const plan = searchParams.get('plan') || undefined;
  return <AuthCard mode="login" plan={plan} />;
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="py-24 text-center text-muted font-mono text-sm">
          Loading portal...
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
