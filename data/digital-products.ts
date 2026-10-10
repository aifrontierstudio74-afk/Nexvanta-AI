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
    slug: 'ai-writing-prompt-vault',
    title: '10x AI Writing Prompt Vault',
    tagline: 'Human-Grade Editorial System for Claude 3.5 & GPT-4o',
    description:
      'The exact 4-stage prompt engineering framework top copywriters, journalists, and researchers use with Claude 3.5 Sonnet and GPT-4o to write authoritative long-form content 10x faster without robotic buzzwords or generic fluff.',
    price: 99,
    compareAtPrice: 499,
    badge: '★ BESTSELLER · INSTANT ACCESS',
    image: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="600" height="400"><defs><linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%23161827"/><stop offset="100%" stop-color="%230A0B14"/></linearGradient></defs><rect width="600" height="400" fill="%2311131F"/><rect x="24" y="24" width="552" height="352" rx="16" fill="url(%23g1)" stroke="%23F5C518" stroke-opacity="0.25" stroke-width="2"/><rect x="44" y="44" width="130" height="26" rx="6" fill="%23F5C518" fill-opacity="0.12" stroke="%23F5C518" stroke-opacity="0.4"/><text x="109" y="61" font-family="monospace" font-size="11" font-weight="bold" fill="%23F5C518" text-anchor="middle">PROMPT VAULT</text><circle cx="300" cy="165" r="48" fill="%230A0B14" stroke="%23F5C518" stroke-width="2"/><path d="M285 180 L295 150 L315 150 L315 180 Z M295 150 L305 138 L315 150" fill="none" stroke="%23F5C518" stroke-width="2.5" stroke-linejoin="round"/><line x1="285" y1="188" x2="315" y2="188" stroke="%23F5C518" stroke-width="2.5" stroke-linecap="round"/><text x="300" y="250" font-family="sans-serif" font-size="22" font-weight="bold" fill="%23F4F4F6" text-anchor="middle">10x AI WRITING VAULT</text><text x="300" y="278" font-family="sans-serif" font-size="13" fill="%239AA0B4" text-anchor="middle">Human-Grade Editorial Framework · Claude 3.5 &amp; GPT-4o</text><text x="300" y="325" font-family="monospace" font-size="15" font-weight="bold" fill="%23F5C518" text-anchor="middle">INSTANT DOWNLOAD · ₹99</text></svg>`,
    features: [
      '4-stage editorial prompt system (Anti-Cliché, Research Ingestion, Skeptic Outline, Few-Shot Tone Anchor)',
      'Banned buzzword blacklist and robotic trope elimination filters',
      'Compatible with Claude 3.5 Sonnet, ChatGPT (GPT-4o) & Gemini 1.5 Pro',
      'Instant access link with lifetime markdown updates included',
    ],
    fileUrl:
      'https://drive.google.com/file/d/15wPcycWxg5utCUrRc9t3l7z4OQ-s2qXa/view?usp=drive_link',
    isActive: true,
  },
  {
    slug: 'make-lead-responder-blueprint',
    title: 'Make.com 4-Second AI Lead Intake Engine',
    tagline: 'Production Make.com Scenario Blueprint for Inbound Leads',
    description:
      'Plug-and-play Make.com (Integromat) scenario JSON blueprint. Ingests inbound leads from Webflow, Typeform, or Facebook Ads, analyzes budget and urgency with GPT-4o, and drafts personalized Gmail replies in 4 seconds.',
    price: 99,
    compareAtPrice: 799,
    badge: 'AUTOMATION BLUEPRINT',
    image: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="600" height="400"><defs><linearGradient id="g2" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%23161827"/><stop offset="100%" stop-color="%230A0B14"/></linearGradient></defs><rect width="600" height="400" fill="%2311131F"/><rect x="24" y="24" width="552" height="352" rx="16" fill="url(%23g2)" stroke="%23F5C518" stroke-opacity="0.25" stroke-width="2"/><rect x="44" y="44" width="150" height="26" rx="6" fill="%23F5C518" fill-opacity="0.12" stroke="%23F5C518" stroke-opacity="0.4"/><text x="119" y="61" font-family="monospace" font-size="11" font-weight="bold" fill="%23F5C518" text-anchor="middle">MAKE.COM BLUEPRINT</text><circle cx="210" cy="165" r="26" fill="%230A0B14" stroke="%23F5C518" stroke-width="2"/><text x="210" y="169" font-family="monospace" font-size="11" fill="%23F5C518" text-anchor="middle">HOOK</text><line x1="236" y1="165" x2="268" y2="165" stroke="%23F5C518" stroke-width="2" stroke-dasharray="4 2"/><circle cx="300" cy="165" r="32" fill="%230A0B14" stroke="%23F5C518" stroke-width="2"/><text x="300" y="169" font-family="monospace" font-size="11" fill="%23F5C518" font-weight="bold" text-anchor="middle">GPT-4o</text><line x1="332" y1="165" x2="364" y2="165" stroke="%23F5C518" stroke-width="2" stroke-dasharray="4 2"/><circle cx="390" cy="165" r="26" fill="%230A0B14" stroke="%23F5C518" stroke-width="2"/><text x="390" y="169" font-family="monospace" font-size="11" fill="%23F5C518" text-anchor="middle">GMAIL</text><text x="300" y="250" font-family="sans-serif" font-size="22" font-weight="bold" fill="%23F4F4F6" text-anchor="middle">4-SEC AI LEAD RESPONDER</text><text x="300" y="278" font-family="sans-serif" font-size="13" fill="%239AA0B4" text-anchor="middle">Plug &amp; Play Scenario Blueprint · Qualification &amp; Drafting</text><text x="300" y="325" font-family="monospace" font-size="15" font-weight="bold" fill="%23F5C518" text-anchor="middle">INSTANT DOWNLOAD · ₹99</text></svg>`,
    features: [
      '1-click importable Make.com scenario JSON file',
      'GPT-4o lead qualification, budget evaluation & urgency scoring prompt',
      'Automated Gmail personalized proposal draft generator (1-click send)',
      'Instant webhook setup guide for Typeform, Webflow & custom landing pages',
    ],
    fileUrl:
      'https://drive.google.com/file/d/1luWy0BWW5vBzTvL1KgoirTeaZe1npGYi/view?usp=drive_link',
    isActive: true,
  },
  {
    slug: 'notion-ai-second-brain',
    title: 'Notion AI Second Brain Architecture',
    tagline: 'PARA Framework + Automated Notion AI Autofill Properties',
    description:
      'Turn your Notion into an autonomous thinking partner. Pre-configured PARA databases (Projects, Areas, Resources, Archives) with automated Notion AI autofill properties, 1-click web clipper summaries, and strategic Q&A prompts.',
    price: 99,
    compareAtPrice: 899,
    badge: 'POPULAR TEMPLATE',
    image: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="600" height="400"><defs><linearGradient id="g3" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%23161827"/><stop offset="100%" stop-color="%230A0B14"/></linearGradient></defs><rect width="600" height="400" fill="%2311131F"/><rect x="24" y="24" width="552" height="352" rx="16" fill="url(%23g3)" stroke="%23F5C518" stroke-opacity="0.25" stroke-width="2"/><rect x="44" y="44" width="150" height="26" rx="6" fill="%23F5C518" fill-opacity="0.12" stroke="%23F5C518" stroke-opacity="0.4"/><text x="119" y="61" font-family="monospace" font-size="11" font-weight="bold" fill="%23F5C518" text-anchor="middle">NOTION AI TEMPLATE</text><circle cx="300" cy="165" r="48" fill="%230A0B14" stroke="%23F5C518" stroke-width="2"/><path d="M282 155 C282 145 292 140 300 140 C308 140 318 145 318 155 C318 165 308 170 300 175 L300 185 M300 193 L300 195" fill="none" stroke="%23F5C518" stroke-width="2.5" stroke-linecap="round"/><text x="300" y="250" font-family="sans-serif" font-size="22" font-weight="bold" fill="%23F4F4F6" text-anchor="middle">NOTION AI SECOND BRAIN</text><text x="300" y="278" font-family="sans-serif" font-size="13" fill="%239AA0B4" text-anchor="middle">PARA System + Automated Web Clipper AI Autofill</text><text x="300" y="325" font-family="monospace" font-size="15" font-weight="bold" fill="%23F5C518" text-anchor="middle">INSTANT DOWNLOAD · ₹99</text></svg>`,
    features: [
      'Complete 4-database PARA workspace structure (Projects, Areas, Resources, Archives)',
      'Automated Notion AI autofill summary rules for web clipping',
      '3 executive semantic Q&A prompts for weekly retrospectives & client research',
      'Step-by-step 5-minute workspace setup and configuration guide',
    ],
    fileUrl:
      'https://drive.google.com/file/d/16rEWNUHrGAJpjJoladKF7J4gEE8BbpjD/view?usp=drive_link',
    isActive: true,
  },
  {
    // Legacy alias to ensure backwards compatibility with older links
    slug: 'your-digital-product',
    title: '10x AI Writing Prompt Vault',
    tagline: 'Human-Grade Editorial System for Claude 3.5 & GPT-4o',
    description:
      'Legacy route mapping to 10x AI Writing Prompt Vault.',
    price: 99,
    compareAtPrice: 499,
    badge: '★ BESTSELLER · INSTANT ACCESS',
    image: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="600" height="400"><rect width="600" height="400" fill="%2311131F"/><text x="300" y="200" fill="%23F5C518" text-anchor="middle">NEXVANTA.AI</text></svg>`,
    features: [
      '4-stage editorial prompt system',
      'Instant access link with lifetime markdown updates included',
    ],
    fileUrl:
      'https://drive.google.com/file/d/15wPcycWxg5utCUrRc9t3l7z4OQ-s2qXa/view?usp=drive_link',
    isActive: false,
  },
];
