'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { DigitalProduct } from '@/data/digital-products';
import { formatINR } from '@/lib/format';
import { ProductCheckoutModal } from './ProductCheckoutModal';
import { Check, ShieldCheck, ArrowRight, ArrowLeft } from 'lucide-react';

interface ProductDetailClientProps {
  product: DigitalProduct;
}

export const ProductDetailClient: React.FC<ProductDetailClientProps> = ({
  product,
}) => {
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  return (
    <div className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-12">
      {/* Back button */}
      <div>
        <Link
          href="/digital-products"
          className="inline-flex items-center gap-2 text-xs font-mono text-muted hover:text-gold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to all digital products
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
        {/* Cover Preview */}
        <div className="md:col-span-5 rounded-2xl bg-surface border border-border overflow-hidden">
          <div className="relative aspect-[4/3] w-full">
            {product.image.startsWith('data:') ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <Image
                src={product.image}
                alt={product.title}
                fill
                className="object-cover"
              />
            )}
          </div>
          {product.badge && (
            <div className="p-3 bg-surface-2 border-t border-border text-center text-xs font-mono text-gold">
              {product.badge}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="md:col-span-7 space-y-6">
          <div>
            <span className="text-xs font-mono text-gold uppercase tracking-wider block mb-2">
              DIGITAL ASSET · INSTANT ACCESS
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold font-heading text-text mb-2">
              {product.title}
            </h1>
            <p className="text-gold font-medium text-sm">
              &ldquo;{product.tagline}&rdquo;
            </p>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-4xl font-extrabold font-mono text-gold">
              {formatINR(product.price)}
            </span>
            {product.compareAtPrice && (
              <span className="text-base font-mono text-muted line-through">
                {formatINR(product.compareAtPrice)}
              </span>
            )}
          </div>

          <p className="text-muted text-sm leading-relaxed">
            {product.description}
          </p>

          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-mono uppercase tracking-wider text-muted">
              WHAT IS INCLUDED
            </h3>
            <ul className="space-y-2.5">
              {product.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-text">
                  <span className="w-4 h-4 rounded-full bg-success/15 text-success flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-4 space-y-3">
            <button
              onClick={() => setCheckoutOpen(true)}
              className="w-full py-4 px-6 rounded-xl bg-gold text-black font-heading font-bold text-sm uppercase tracking-wide hover:bg-gold-soft transition-all shadow-gold-glow flex items-center justify-center gap-2"
            >
              Buy Now ({formatINR(product.price)})
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Short refund policy note */}
            <p className="text-xs text-muted text-center leading-relaxed">
              Protected by our standard digital terms. Due to immediate electronic delivery, review our{' '}
              <Link href="/refund" className="text-gold hover:underline">
                Refund &amp; Cancellation Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </div>

      {checkoutOpen && (
        <ProductCheckoutModal
          product={product}
          isOpen={true}
          onClose={() => setCheckoutOpen(false)}
        />
      )}
    </div>
  );
};
