'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { digitalProducts, DigitalProduct } from '@/data/digital-products';
import { formatINR } from '@/lib/format';
import { ProductCheckoutModal } from './ProductCheckoutModal';
import { ShoppingBag, ArrowRight, ShieldCheck, Sparkles, Check } from 'lucide-react';

export const DigitalProductsClient: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState<DigitalProduct | null>(null);

  const activeProducts = digitalProducts.filter((p) => p.isActive);

  return (
    <div className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-mono text-gold uppercase tracking-wider px-3 py-1 rounded bg-gold/10 border border-gold/20 inline-block">
          SEGMENT 03 — DIGITAL PRODUCTS
        </span>
        <h1 className="text-3xl sm:text-5xl font-bold font-heading text-text">
          Digital Products &amp; Automation SOPs
        </h1>
        <p className="text-muted text-sm sm:text-base leading-relaxed">
          Production-tested prompt frameworks, SOP architectures, and automation blueprints. Immediate access upon checkout.
        </p>
      </div>

      {/* Grid of active products */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {activeProducts.map((product) => (
          <div
            key={product.slug}
            className="rounded-2xl bg-surface border border-border overflow-hidden flex flex-col justify-between hover:border-gold hover:shadow-gold-glow hover:-translate-y-1 transition-all duration-300"
          >
            <div>
              {/* Product Cover */}
              <div className="relative aspect-[16/10] w-full bg-surface-2 overflow-hidden border-b border-border">
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
                {product.badge && (
                  <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-md border border-gold/40 text-gold text-[10px] font-mono tracking-wider">
                    {product.badge}
                  </span>
                )}
              </div>

              {/* Body */}
              <div className="p-6 space-y-3">
                <h3 className="text-xl font-bold font-heading text-text">
                  {product.title}
                </h3>
                <p className="text-gold font-medium text-xs">
                  &ldquo;{product.tagline}&rdquo;
                </p>
                <p className="text-muted text-xs leading-relaxed line-clamp-3">
                  {product.description}
                </p>

                {/* Features list */}
                <ul className="space-y-1.5 pt-2">
                  {product.features.slice(0, 3).map((f, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs text-text/80">
                      <span className="w-3.5 h-3.5 rounded-full bg-success/15 text-success flex items-center justify-center shrink-0">
                        <Check className="w-2 h-2 stroke-[3]" />
                      </span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="p-6 pt-0">
              <div className="h-[1px] w-full bg-border my-4" />

              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="block text-[10px] font-mono text-muted uppercase">PRICE</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-extrabold font-mono text-gold">
                      {formatINR(product.price)}
                    </span>
                    {product.compareAtPrice && (
                      <span className="text-xs font-mono text-muted line-through">
                        {formatINR(product.compareAtPrice)}
                      </span>
                    )}
                  </div>
                </div>
                <Link
                  href={`/digital-products/${product.slug}`}
                  className="text-xs font-mono text-muted hover:text-gold transition-colors flex items-center gap-1"
                >
                  View details ↗
                </Link>
              </div>

              <button
                onClick={() => setSelectedProduct(product)}
                className="w-full py-3 px-4 rounded-xl bg-gold text-black font-heading font-semibold text-xs uppercase tracking-wider hover:bg-gold-soft transition-all shadow-gold-glow flex items-center justify-center gap-2"
              >
                Buy Now ({formatINR(product.price)})
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Checkout Modal */}
      {selectedProduct && (
        <ProductCheckoutModal
          product={selectedProduct}
          isOpen={true}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
};
