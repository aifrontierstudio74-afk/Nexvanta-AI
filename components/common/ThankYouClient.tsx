'use client';

import React from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { digitalProducts } from '@/data/digital-products';
import { siteConfig } from '@/data/site';
import { CheckCircle2, Download, ArrowRight, MessageSquare, Home } from 'lucide-react';

export const ThankYouClient: React.FC = () => {
  const searchParams = useSearchParams();
  const productSlug = searchParams.get('product');
  const token = searchParams.get('token');

  const product = productSlug
    ? digitalProducts.find((p) => p.slug === productSlug)
    : null;

  return (
    <div className="py-20 md:py-32 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto text-center">
      <div className="p-8 md:p-12 rounded-3xl bg-surface border border-border-strong shadow-2xl space-y-6">
        <div className="w-16 h-16 rounded-full bg-success/15 border border-success/40 text-success flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <span className="text-xs font-mono text-gold uppercase tracking-wider px-3 py-1 rounded bg-gold/10 border border-gold/20 inline-block">
          CONFIRMED
        </span>

        <h1 className="text-3xl sm:text-4xl font-bold font-heading text-text">
          {product ? 'Order Completed Successfully' : 'Thank You for Reaching Out'}
        </h1>

        <p className="text-muted text-sm leading-relaxed max-w-md mx-auto">
          {product
            ? `Your order for "${product.title}" has been confirmed. You can download your asset package below.`
            : 'Your enquiry has been securely logged with our automation engineering team. We will connect with you on WhatsApp or phone within 24 hours.'}
        </p>

        {product && token && (
          <div className="p-6 rounded-2xl bg-surface-2 border border-border space-y-4 text-center">
            <div className="text-xs font-mono text-gold">
              SECURE DOWNLOAD TOKEN ACTIVE (EXPIRES IN 15 MINUTES)
            </div>
            <a
              href={`/api/download?token=${encodeURIComponent(token)}`}
              download
              className="w-full py-3.5 px-6 rounded-xl bg-gold text-black font-heading font-bold text-sm uppercase tracking-wide hover:bg-gold-soft transition-all shadow-gold-glow flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download Asset Package ↗
            </a>
          </div>
        )}

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href={siteConfig.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-whatsapp text-black font-semibold text-xs flex items-center justify-center gap-2"
          >
            <MessageSquare className="w-4 h-4" />
            Connect on WhatsApp (+91 97131 03152)
          </a>
          <Link
            href="/"
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-surface-2 border border-border text-text hover:border-gold transition-colors text-xs font-medium flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
};
