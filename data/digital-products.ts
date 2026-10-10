export interface DigitalProduct {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  price: number; // in INR (₹)
  compareAtPrice?: number;
  image: string; // SVG data URI or local path
  badge?: string;
  features: string[];
  fileUrl: string;
  isActive: boolean;
}

export const digitalProducts: DigitalProduct[] = [
  {
    slug: "your-digital-product",
    title: "Your Digital Product (edit me)",
    tagline: "Essential AI Prompt & SOP Starter Kit",
    description:
      "This is a placeholder. Replace it with your own product in data/digital-products.ts.",
    price: 99,
    compareAtPrice: 499,
    badge: "INSTANT ACCESS",
    image: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="600" height="400"><rect width="600" height="400" fill="%2311131F"/><rect x="20" y="20" width="560" height="360" rx="16" fill="%23161827" stroke="%23F5C518" stroke-opacity="0.3" stroke-width="2"/><circle cx="300" cy="180" r="60" fill="%230A0B14" stroke="%23F5C518" stroke-width="2"/><path d="M280 160 L320 180 L280 200 Z" fill="%23F5C518"/><text x="300" y="280" font-family="sans-serif" font-size="22" font-weight="bold" fill="%23F4F4F6" text-anchor="middle">NEXVANTA.AI</text><text x="300" y="310" font-family="monospace" font-size="14" fill="%23F5C518" text-anchor="middle">DIGITAL RESOURCE KIT (₹99)</text></svg>`,
    features: [
      "Instant digital access upon purchase",
      "Ready-to-deploy automation SOPs & prompt templates",
      "Compatible with ChatGPT, Claude, and Make.com",
      "Lifetime updates and documentation included",
    ],
    fileUrl: "",
    isActive: true,
  },
];
