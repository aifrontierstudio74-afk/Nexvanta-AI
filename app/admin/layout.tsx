'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Wordmark } from '@/components/common/Wordmark';
import { createClient } from '@/lib/supabase/client';
import {
  ShieldAlert,
  Users,
  CreditCard,
  CheckCircle2,
  Sliders,
  AlertTriangle,
  ToggleLeft,
  Download,
  ArrowLeft,
} from 'lucide-react';

const adminNav = [
  { href: '/admin', label: 'Users & Overview', icon: Users },
  { href: '/admin/subscriptions', label: 'Subscriptions', icon: CreditCard },
  { href: '/admin/payments', label: 'Payment Approvals', icon: CheckCircle2 },
  { href: '/admin/plans', label: 'Plans & Limits', icon: Sliders },
  { href: '/admin/runs', label: 'Failed Runs', icon: AlertTriangle },
  { href: '/admin/features', label: 'Kill Switches', icon: ToggleLeft },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(true);
  const [loading, setLoading] = useState(false);

  return (
    <div className="min-h-screen bg-bg text-text flex flex-col md:flex-row">
      {/* Admin Sidebar */}
      <aside className="w-full md:w-64 bg-surface border-r border-border p-6 flex flex-col justify-between">
        <div className="space-y-6">
          <div className="space-y-2">
            <Wordmark size="sm" />
            <div className="inline-block px-2.5 py-1 rounded-md bg-gold/15 border border-gold/40 text-[10px] font-mono text-gold font-bold uppercase tracking-wider">
              ADMIN CONTROL PANEL
            </div>
          </div>

          <nav className="space-y-1">
            {adminNav.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-mono transition-colors ${
                    active
                      ? 'bg-gold/15 text-gold font-bold border border-gold/30'
                      : 'text-muted hover:text-text hover:bg-surface-2'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="pt-6 border-t border-border space-y-3">
          <Link
            href="/app"
            className="flex items-center gap-2 text-xs font-mono text-muted hover:text-gold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Exit to Client App
          </Link>
          <div className="text-[10px] text-muted font-mono">
            Owner Email: hello.nexvanta56@gmail.com
          </div>
        </div>
      </aside>

      {/* Main Admin Area */}
      <main className="flex-1 p-6 md:p-10 max-w-7xl overflow-x-hidden">{children}</main>
    </div>
  );
}
