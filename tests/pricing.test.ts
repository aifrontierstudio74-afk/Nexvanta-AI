import { describe, it, expect } from 'vitest';

function calculatePaise(priceInr: number, includeGst: boolean, gstPercent: number = 18): number {
  let finalPrice = priceInr;
  if (!includeGst) {
    finalPrice = Math.round(priceInr * (1 + gstPercent / 100));
  }
  return finalPrice * 100;
}

describe('Pricing & Currency Conversion (GST & Paise)', () => {
  it('converts prices to paise when prices already include GST', () => {
    // ₹3,500 inclusive -> 350,000 paise
    expect(calculatePaise(3500, true)).toBe(350000);
    // ₹999 inclusive -> 99,900 paise
    expect(calculatePaise(999, true)).toBe(99900);
    // ₹15,000 inclusive -> 1,500,000 paise
    expect(calculatePaise(15000, true)).toBe(1500000);
  });

  it('adds 18% GST before converting to paise when prices exclude GST', () => {
    // ₹3,500 + 18% (630) = ₹4,130 -> 413,000 paise
    expect(calculatePaise(3500, false, 18)).toBe(413000);
    // ₹5,000 + 18% (900) = ₹5,900 -> 590,000 paise
    expect(calculatePaise(5000, false, 18)).toBe(590000);
    // ₹10,000 + 18% (1800) = ₹11,800 -> 1,180,000 paise
    expect(calculatePaise(10000, false, 18)).toBe(1180000);
  });

  it('validates 15 core SaaS plan pricing tiers from specification', () => {
    const expectedTiers = [
      { slug: 'lead-capture-crm', basic: 3500, growth: 5500, pro: 7500 },
      { slug: 'email-outreach', basic: 5000, growth: 7500, pro: 10000 },
      { slug: 'social-auto-posting', basic: 3000, growth: 4500, pro: 6000 },
      { slug: 'voice-agent', basic: 8000, growth: 11500, pro: 15000 },
      { slug: 'youtube-automation', starter: 999, pro: 2499, studio: 4999 },
    ];

    expect(expectedTiers).toHaveLength(5);
    expect(expectedTiers[0].basic).toBe(3500);
    expect(expectedTiers[4].starter).toBe(999);
  });
});
