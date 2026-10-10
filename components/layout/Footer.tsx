import React from 'react';
import Link from 'next/link';
import { Wordmark } from '@/components/common/Wordmark';
import { siteConfig } from '@/data/site';
import { Mail, Phone, MessageSquare, CreditCard } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-border bg-surface text-text/80 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-border">
          {/* Brand info */}
          <div className="lg:col-span-2 space-y-4">
            <Wordmark size="md" />
            <p className="text-muted text-sm max-w-sm leading-relaxed">
              {siteConfig.description} Production-ready AI automation, custom workflows, and subscription systems engineered for Indian businesses.
            </p>
            <div className="pt-2 text-xs font-mono text-muted">
              Wordmark: Nexvanta<span className="text-gold">.AI</span> · New Delhi & Pan-India
            </div>
          </div>

          {/* Three Segments */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-gold mb-4">
              Offerings
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/services" className="hover:text-gold transition-colors">
                  01. Service-Based (30 Agents)
                </Link>
              </li>
              <li>
                <Link href="/saas" className="hover:text-gold transition-colors">
                  02. SaaS Automations (5 Tools)
                </Link>
              </li>
              <li>
                <Link href="/digital-products" className="hover:text-gold transition-colors">
                  03. Digital Products (₹99)
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-gold transition-colors">
                  Website Design + Build
                </Link>
              </li>
            </ul>
          </div>

          {/* Direct Contact */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-gold mb-4">
              Direct Contact
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="flex items-center gap-2 hover:text-gold transition-colors"
                >
                  <Mail className="w-4 h-4 text-gold shrink-0" />
                  <span className="break-all">{siteConfig.email}</span>
                </a>
              </li>
              <li>
                <a
                  href={`tel:${siteConfig.phone}`}
                  className="flex items-center gap-2 hover:text-gold transition-colors"
                >
                  <Phone className="w-4 h-4 text-gold shrink-0" />
                  <span>{siteConfig.phoneDisplay}</span>
                </a>
              </li>
              <li>
                <a
                  href={siteConfig.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-gold transition-colors"
                >
                  <MessageSquare className="w-4 h-4 text-whatsapp shrink-0" />
                  <span>WhatsApp (+91 97131 03152)</span>
                </a>
              </li>
              <li>
                <Link
                  href="/pay"
                  className="flex items-center gap-2 hover:text-gold transition-colors text-gold/90"
                >
                  <CreditCard className="w-4 h-4 text-gold shrink-0" />
                  <span>Manual Payment (UPI / Bank)</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & App */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-gold mb-4">
              Company & Legal
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/contact" className="hover:text-gold transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-gold transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-gold transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/refund" className="hover:text-gold transition-colors">
                  Refund & Cancellation
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-gold transition-colors text-muted">
                  Client Portal
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright row */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted">
          <p>© {new Date().getFullYear()} Nexvanta.AI. All rights reserved.</p>
          <p className="font-mono text-muted/80">
            Engineered for high performance · No third-party tracking cookies
          </p>
        </div>
      </div>
    </footer>
  );
};
