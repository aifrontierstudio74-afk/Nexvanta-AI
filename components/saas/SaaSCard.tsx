'use client';

import React from 'react';
import Link from 'next/link';
import { SaaSAutomation } from '@/data/saas';
import { Magnet, Send, Share2, PhoneCall, Youtube, Check } from 'lucide-react';

interface SaaSCardProps {
  automation: SaaSAutomation;
  onOpenQuote?: (name: string) => void;
}

export const SaaSCard: React.FC<SaaSCardProps> = ({
  automation,
  onOpenQuote,
}) => {
  const getIcon = () => {
    switch (automation.iconName) {
      case 'Magnet':
        return <Magnet className="w-5 h-5 text-gold" />;
      case 'Send':
        return <Send className="w-5 h-5 text-gold" />;
      case 'Share2':
        return <Share2 className="w-5 h-5 text-gold" />;
      case 'PhoneCall':
        return <PhoneCall className="w-5 h-5 text-gold" />;
      case 'Youtube':
        return <Youtube className="w-5 h-5 text-gold" />;
      default:
        return <Magnet className="w-5 h-5 text-gold" />;
    }
  };

  return (
    <div className="group relative flex flex-col justify-between rounded-2xl bg-surface border border-border p-6 md:p-8 transition-all duration-300 hover:border-border-strong hover:shadow-gold-glow hover:-translate-y-1">
      <div>
        {/* Top Header Row */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gold/10 border border-gold/25 flex items-center justify-center shrink-0">
            {getIcon()}
          </div>
          <div className="flex items-center gap-2">
            {automation.badge && (
              <span className="px-2.5 py-1 rounded-full border border-gold/40 bg-gold/10 text-gold text-[10px] font-mono tracking-wider">
                {automation.badge}
              </span>
            )}
            <span className="font-mono text-muted text-sm tracking-widest">
              {automation.number}
            </span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xl md:text-2xl font-bold font-heading text-text mb-2">
          {automation.title}
        </h3>

        {/* Gold Quoted Tagline */}
        <p className="text-gold font-medium text-sm mb-3">
          &ldquo;{automation.tagline}&rdquo;
        </p>

        {/* Description */}
        <p className="text-muted text-xs md:text-sm leading-relaxed mb-6">
          {automation.description}
        </p>

        {/* 4 Bullets with Green Check */}
        <ul className="space-y-2.5 mb-6 text-xs text-text/90">
          {automation.bullets.map((b, i) => (
            <li key={i} className="flex items-start gap-2.5">
              <span className="w-4 h-4 rounded-full bg-success/15 text-success flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-2.5 h-2.5 stroke-[3]" />
              </span>
              <span className="leading-normal">{b}</span>
            </li>
          ))}
        </ul>
      </div>

      <div>
        {/* Hairline Divider */}
        <div className="h-[1px] w-full bg-border my-5" />

        {/* Pricing Row */}
        {automation.pricing.tiers ? (
          <div className="space-y-2 mb-4">
            <div className="text-[11px] font-mono text-muted uppercase">
              NO SETUP FEE · THREE TIERS
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              {automation.pricing.tiers.map((t) => (
                <div
                  key={t.name}
                  className={`p-2 rounded-lg border ${
                    t.highlighted
                      ? 'border-gold bg-gold/10 text-gold'
                      : 'border-border bg-surface-2 text-muted'
                  }`}
                >
                  <div className="text-[10px] font-mono">{t.name}</div>
                  <div className="text-xs font-bold text-text">₹{t.price}</div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-4 mb-4">
            <div>
              <span className="block text-[10px] font-mono text-muted uppercase tracking-wider">
                ONE-TIME SETUP
              </span>
              <span className="text-sm font-bold font-mono text-text">
                {automation.pricing.setup}
              </span>
            </div>
            <div className="text-right">
              <span className="block text-[10px] font-mono text-muted uppercase tracking-wider">
                SAAS
              </span>
              <span className="text-sm font-bold font-mono text-gold">
                {automation.pricing.saas}
              </span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between gap-3 pt-2">
          <Link
            href={`/saas/${automation.slug}`}
            className="text-xs font-mono text-muted hover:text-text transition-colors"
          >
            Details ↗
          </Link>
          <button
            onClick={() => onOpenQuote?.(automation.title)}
            className="px-4 py-2 rounded-xl bg-gold/10 hover:bg-gold text-gold hover:text-black border border-gold/30 hover:border-gold transition-all text-xs font-semibold font-heading"
          >
            Get a fixed quote ↗
          </button>
        </div>
      </div>
    </div>
  );
};
