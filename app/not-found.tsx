import React from 'react';
import Link from 'next/link';
import { Wordmark } from '@/components/common/Wordmark';
import { Home, ArrowRight, MessageSquare } from 'lucide-react';
import { siteConfig } from '@/data/site';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-20 text-center">
      <div className="max-w-md w-full space-y-6">
        <span className="font-mono text-5xl sm:text-6xl font-extrabold text-gold block">
          404
        </span>

        <h1 className="text-2xl sm:text-3xl font-bold font-heading text-text">
          Page Not Found
        </h1>

        <p className="text-muted text-sm leading-relaxed">
          The page you are looking for has moved or does not exist. Explore our service agents catalog or connect with us directly.
        </p>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gold text-black font-semibold text-xs flex items-center justify-center gap-2 hover:bg-gold-soft transition-colors shadow-gold-glow"
          >
            <Home className="w-4 h-4" />
            Back to Homepage
          </Link>
          <a
            href={siteConfig.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-surface-2 border border-border text-text hover:border-gold transition-colors text-xs flex items-center justify-center gap-2"
          >
            <MessageSquare className="w-4 h-4 text-whatsapp" />
            Chat on WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
