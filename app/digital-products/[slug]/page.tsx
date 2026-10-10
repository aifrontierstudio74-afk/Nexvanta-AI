import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { digitalProducts } from '@/data/digital-products';
import { ProductDetailClient } from '@/components/digital-products/ProductDetailClient';

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  return digitalProducts.map((p) => ({
    slug: p.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = digitalProducts.find((p) => p.slug === params.slug);
  if (!product) return { title: 'Product Not Found | Nexvanta.AI' };

  return {
    title: `${product.title} (₹${product.price}) | Nexvanta.AI`,
    description: product.description,
  };
}

export default function ProductDetailPage({ params }: Props) {
  const product = digitalProducts.find((p) => p.slug === params.slug);

  if (!product) {
    notFound();
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description,
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductDetailClient product={product} />
    </>
  );
}
