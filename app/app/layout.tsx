'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Wordmark } from '@/components/common/Wordmark';
import { createClient } from '@/lib/supabase/client';
import {
  LayoutDashboard,
  CreditCard,
  Settings,
  HelpCircle,
  Bell,
  LogOut,
  ChevronDown,
  Layers,
  Menu,
  X,
  ShieldCheck,
  Check,
} from 'lucide-react';

const automationNavItems = [
  { slug: 'lead-capture-crm', name: 'Lead Capture CRM' },
  { slug: 'email-outreach', name: 'Cold Email Outreach' },
  { slug: 'social-auto-posting', name: 'Social Auto-Posting' },
  { slug: 'voice-agent', name: 'Voice AI Receptionist' },
  { slug: 'youtube-automation', name: 'YouTube Pipeline' },
  { slug: 'demo-automation', name: 'Demo Benchmark' },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string>('Client Partner');
  const [notifications, setNotifications] = useState<
    { id: string; title: string; body: string; read: boolean }[]
  >([
    {
      id: '1',
      title: 'Welcome to Nexvanta.AI',
      body: 'Your SaaS platform instance is provisioned and ready.',
      read: false,
    },
  ]);

  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user?.email) {
        setUserEmail(data.user.email);
      }
    });
  }, [supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen bg-bg text-text flex flex-col md:flex-row">
      {/* Mobile Top Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-surface border-b border-border sticky top-0 z-40">
        <Wordmark size="sm" />
        <div className="flex items-center gap-3">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative p-2 rounded-xl bg-surface-2 border border-border text-muted"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-gold" />
            )}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-surface-2 border border-border text-muted"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Sidebar (Desktop & Mobile Drawer) */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen w-64 bg-surface border-r border-border flex flex-col justify-between z-50 transition-transform duration-200 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Logo */}
          <div className="flex items-center justify-between">
            <Wordmark size="md" />
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="md:hidden text-muted p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            <Link
              href="/app"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-mono transition-colors ${
                pathname === '/app'
                  ? 'bg-gold/15 text-gold font-bold border border-gold/30'
                  : 'text-muted hover:text-text hover:bg-surface-2'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Overview</span>
            </Link>

            <div className="pt-4 pb-2 px-3 text-[10px] font-mono text-muted uppercase tracking-wider">
              AUTOMATIONS
            </div>

            {automationNavItems.map((item) => {
              const active = pathname === `/app/${item.slug}`;
              return (
                <Link
                  key={item.slug}
                  href={`/app/${item.slug}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2 rounded-xl text-xs transition-colors ${
                    active
                      ? 'bg-gold/15 text-gold font-bold border border-gold/30'
                      : 'text-muted hover:text-text hover:bg-surface-2'
                  }`}
                >
                  <span className="truncate">{item.name}</span>
                  <span className="w-2 h-2 rounded-full bg-border shrink-0" />
                </Link>
              );
            })}

            <div className="pt-4 pb-2 px-3 text-[10px] font-mono text-muted uppercase tracking-wider">
              ACCOUNT
            </div>

            <Link
              href="/app/billing"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-mono transition-colors ${
                pathname === '/app/billing'
                  ? 'bg-gold/15 text-gold font-bold border border-gold/30'
                  : 'text-muted hover:text-text hover:bg-surface-2'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              <span>Billing &amp; Plans</span>
            </Link>

            <Link
              href="/app/settings"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-mono transition-colors ${
                pathname === '/app/settings'
                  ? 'bg-gold/15 text-gold font-bold border border-gold/30'
                  : 'text-muted hover:text-text hover:bg-surface-2'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </Link>

            <a
              href="https://wa.me/919713103152"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-mono text-muted hover:text-gold hover:bg-surface-2 transition-colors"
            >
              <HelpCircle className="w-4 h-4" />
              <span>Support WhatsApp</span>
            </a>
          </nav>
        </div>

        {/* User Profile Card at Bottom */}
        <div className="p-4 border-t border-border bg-surface-2/40">
          <div className="flex items-center justify-between">
            <div className="truncate pr-2">
              <div className="text-[10px] font-mono text-gold uppercase tracking-wider">
                CONNECTED
              </div>
              <div className="text-xs font-medium text-text truncate">{userEmail}</div>
            </div>
            <button
              onClick={handleSignOut}
              title="Sign Out"
              className="p-2 rounded-lg bg-surface border border-border hover:border-red-400 hover:text-red-400 text-muted transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-h-screen bg-bg flex flex-col">
        {/* Desktop Topbar */}
        <div className="hidden md:flex items-center justify-between px-8 py-4 bg-surface/50 border-b border-border backdrop-blur-md sticky top-0 z-30">
          <div className="flex items-center gap-2 text-xs font-mono text-muted">
            <span>SaaS Core Platform</span>
            <span>/</span>
            <span className="text-gold font-bold uppercase">
              {pathname.split('/')[2] || 'Overview'}
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className="relative p-2 rounded-xl bg-surface-2 border border-border text-muted hover:text-text transition-colors"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-gold animate-pulse" />
                )}
              </button>

              {/* Notification Popover */}
              {notifOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-surface border border-border-strong rounded-2xl shadow-2xl p-4 space-y-3 z-50">
                  <div className="flex items-center justify-between border-b border-border pb-2">
                    <span className="text-xs font-mono font-bold text-text">Notifications</span>
                    <span className="text-[10px] font-mono text-gold">{unreadCount} new</span>
                  </div>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        className="p-2.5 rounded-xl bg-surface-2 border border-border text-xs space-y-1"
                      >
                        <div className="font-semibold text-text">{n.title}</div>
                        <p className="text-muted text-[11px] leading-relaxed">{n.body}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/app/billing"
              className="text-xs font-mono text-gold hover:underline"
            >
              Manage Plans ↗
            </Link>
          </div>
        </div>

        {/* Page Inner Content */}
        <div className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">{children}</div>
      </main>
    </div>
  );
}
