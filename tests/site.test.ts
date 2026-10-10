import { describe, it, expect } from 'vitest';
import { siteConfig } from '../data/site';
import { saasAutomations } from '../data/saas';
import { digitalProducts } from '../data/digital-products';
import { paymentConfig } from '../data/payment';
import { formatINR, normalizeIndianPhone, isValidIndianPhone } from '../lib/format';
import { createDownloadToken, verifyDownloadToken } from '../lib/token';

describe('Nexvanta.AI Comprehensive Specification Verification', () => {
  it('verifies non-negotiable brand facts in data/site.ts', () => {
    expect(siteConfig.name).toBe('Nexvanta.AI');
    expect(siteConfig.email).toBe('hello.nexvanta56@gmail.com');
    expect(siteConfig.phone).toBe('9713103152');
    expect(siteConfig.phoneDisplay).toBe('+91 97131 03152');
    expect(siteConfig.whatsappUrl).toBe('https://wa.me/919713103152');
    expect(siteConfig.factStrip).toEqual([
      '30 industry-specific AI agents',
      '5 SaaS automations',
      'Hindi · English · Hinglish',
      'WhatsApp + Voice + CRM',
    ]);
  });

  it('verifies 5 SaaS automations specification', () => {
    expect(saasAutomations).toHaveLength(5);

    const slugs = saasAutomations.map((s) => s.slug);
    expect(slugs).toEqual([
      'lead-capture-crm',
      'email-outreach',
      'social-auto-posting',
      'voice-agent',
      'youtube-automation',
    ]);

    // Check MOST BOOKED badges
    const emailOutreach = saasAutomations.find((s) => s.slug === 'email-outreach');
    expect(emailOutreach?.badge).toBe('★ MOST BOOKED');

    const voiceAgent = saasAutomations.find((s) => s.slug === 'voice-agent');
    expect(voiceAgent?.badge).toBe('★ MOST BOOKED');

    const social = saasAutomations.find((s) => s.slug === 'social-auto-posting');
    expect(social?.badge).toBeUndefined();

    // YouTube Automation
    const yt = saasAutomations.find((s) => s.slug === 'youtube-automation');
    expect(yt?.pricing.setup).toBe('No setup fee');
    expect(yt?.pricing.tiers).toBeDefined();
    expect(yt?.pricing.tiers).toHaveLength(3);
    expect(yt?.pricing.tiers?.[0]).toEqual({
      name: 'Starter',
      price: 999,
      period: 'mo',
      limit: 'Up to 8 videos per month',
      highlighted: false,
    });
    expect(yt?.pricing.tiers?.[1]).toEqual({
      name: 'Pro',
      price: 2499,
      period: 'mo',
      limit: 'Up to 20 videos per month',
      highlighted: true,
    });
    expect(yt?.pricing.tiers?.[2]).toEqual({
      name: 'Studio',
      price: 4999,
      period: 'mo',
      limit: 'Up to 40 videos per month',
      highlighted: false,
    });
  });

  it('verifies 3 digital products catalog at ₹99 with Drive download links', () => {
    const activeProducts = digitalProducts.filter((p) => p.isActive);
    expect(activeProducts).toHaveLength(3);

    const vault = activeProducts.find((p) => p.slug === 'ai-writing-prompt-vault');
    expect(vault).toBeDefined();
    expect(vault?.price).toBe(99);
    expect(vault?.fileUrl).toContain('drive.google.com');

    const blueprint = activeProducts.find((p) => p.slug === 'make-lead-responder-blueprint');
    expect(blueprint).toBeDefined();
    expect(blueprint?.price).toBe(99);
    expect(blueprint?.fileUrl).toContain('drive.google.com');

    const secondBrain = activeProducts.find((p) => p.slug === 'notion-ai-second-brain');
    expect(secondBrain).toBeDefined();
    expect(secondBrain?.price).toBe(99);
    expect(secondBrain?.fileUrl).toContain('drive.google.com');
  });

  it('verifies payment configuration schema and empty defaults', () => {
    expect(paymentConfig.enableRazorpay).toBe(true);
    expect(paymentConfig.enableUpi).toBe(true);
    expect(paymentConfig.enableBankTransfer).toBe(true);
    // UPI configured, bank fields empty until owner updates
    expect(paymentConfig.upi.upiId).toBe('9713103152@upi');
    expect(paymentConfig.bank.accountNumber).toBe('');
    expect(paymentConfig.bank.ifsc).toBe('');
    expect(paymentConfig.supportEmail).toBe('hello.nexvanta56@gmail.com');
    expect(paymentConfig.supportWhatsApp).toBe('919713103152');
  });

  it('verifies Indian currency formatting and phone validation', () => {
    expect(formatINR(8000)).toBe('₹8,000');
    expect(formatINR(20000)).toBe('₹20,000');
    expect(formatINR(99)).toBe('₹99');
    expect(formatINR(75000)).toBe('₹75,000');

    expect(isValidIndianPhone('9713103152')).toBe(true);
    expect(isValidIndianPhone('+919713103152')).toBe(true);
    expect(isValidIndianPhone('12345')).toBe(false);

    expect(normalizeIndianPhone('9713103152')).toBe('+919713103152');
    expect(normalizeIndianPhone('09713103152')).toBe('+919713103152');
  });

  it('verifies HMAC-signed download token lifecycle', () => {
    const slug = 'your-digital-product';
    const token = createDownloadToken(slug);
    expect(token).toBeDefined();
    const verification = verifyDownloadToken(token);
    expect(verification.valid).toBe(true);
    expect(verification.slug).toBe(slug);

    const badVerification = verifyDownloadToken('invalid-token');
    expect(badVerification.valid).toBe(false);
  });
});
