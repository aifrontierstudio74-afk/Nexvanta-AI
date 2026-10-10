export interface SaaSTier {
  name: string;
  price: number;
  period: string;
  limit: string;
  highlighted?: boolean;
}

export interface SaaSAutomation {
  id: string;
  number: string;
  slug: string;
  title: string;
  iconName: 'Magnet' | 'Send' | 'Share2' | 'PhoneCall' | 'Youtube';
  badge?: string;
  tagline: string;
  description: string;
  bullets: string[];
  pricing: {
    setup?: string;
    saas?: string;
    tiers?: SaaSTier[];
  };
  howItWorks: {
    step: string;
    title: string;
    description: string;
  }[];
  faqs: {
    question: string;
    answer: string;
  }[];
}

export const saasAutomations: SaaSAutomation[] = [
  {
    id: "lead-capture-crm",
    number: "01",
    slug: "lead-capture-crm",
    title: "Lead Capture + CRM",
    iconName: "Magnet",
    tagline: "Turn Every Lead Into Revenue",
    description:
      "Stop losing warm leads from WhatsApp, Instagram & web forms. Every enquiry lands in one pipeline, answered in 10 seconds flat.",
    bullets: [
      "Instant multi-channel lead ingestion — WhatsApp, web, Meta Ads",
      "Automated response within 10 seconds, 24/7",
      "AI lead-qualification bot that never sleeps",
      "Central pipeline dashboard with instant alerts",
    ],
    pricing: {
      setup: "₹20,000",
      saas: "₹3.5–7.5K/mo",
    },
    howItWorks: [
      {
        step: "01",
        title: "Connect Channels",
        description: "Plug in your WhatsApp Business, Meta Ads, and website forms in minutes.",
      },
      {
        step: "02",
        title: "Automate Qualification",
        description: "AI instantly greets every prospect and collects their requirements 24/7.",
      },
      {
        step: "03",
        title: "Close Deals",
        description: "View enriched leads in your unified CRM pipeline and convert warm buyers.",
      },
    ],
    faqs: [
      {
        question: "How fast is the response time to leads?",
        answer: "Incoming leads receive an automated WhatsApp or SMS confirmation within 10 seconds flat, 24/7.",
      },
      {
        question: "Can this integrate with our existing CRM?",
        answer: "Yes, we connect directly with Google Sheets, HubSpot, Zoho, or custom webhooks.",
      },
      {
        question: "Does it qualify leads in regional languages?",
        answer: "Yes, it fully supports Hindi, English, and conversational Hinglish.",
      },
    ],
  },
  {
    id: "email-outreach",
    number: "02",
    slug: "email-outreach",
    title: "Email Outreach Sequences",
    iconName: "Send",
    badge: "★ MOST BOOKED",
    tagline: "Turn Prospects Into Clients Automatically",
    description:
      "Hyper-personalised cold outreach engineered for the primary inbox — not spam. Follow-ups fire themselves until the meeting is booked.",
    bullets: [
      "Domain warming with SPF / DKIM / DMARC setup",
      "AI copywriting tuned for Indian B2B decision-makers",
      "Multi-step, trigger-based follow-up sequences",
      "Deliverability tracking & real-time inbox warming",
    ],
    pricing: {
      setup: "₹25,000",
      saas: "₹5–10K/mo",
    },
    howItWorks: [
      {
        step: "01",
        title: "Domain & Deliverability Setup",
        description: "We configure secondary sending domains, SPF, DKIM, and DMARC with automatic warming.",
      },
      {
        step: "02",
        title: "AI Sequence Crafting",
        description: "High-converting copy tailored for decision-makers with automated personalization.",
      },
      {
        step: "03",
        title: "Automated Execution",
        description: "Smart follow-ups launch autonomously and pause immediately once a prospect replies.",
      },
    ],
    faqs: [
      {
        question: "Will our primary business email domain be at risk?",
        answer: "No. We set up isolated sending domains to protect your primary domain reputation completely.",
      },
      {
        question: "How many emails are sent per day?",
        answer: "We adhere strictly to safe inbox limits (30–50 emails per warmed inbox/day) to maintain 99%+ deliverability.",
      },
      {
        question: "What happens when a prospect replies?",
        answer: "Follow-up sequences stop automatically and an instant notification is routed to your team.",
      },
    ],
  },
  {
    id: "social-auto-posting",
    number: "03",
    slug: "social-auto-posting",
    title: "Social Media Auto-Posting",
    iconName: "Share2",
    tagline: "Post Every Day Without Lifting a Finger",
    description:
      "A consistent, professional social presence powered by AI content pipelines — you approve once, it posts everywhere, every day.",
    bullets: [
      "AI captions trained on top-performing niche posts",
      "Automated scheduling for LinkedIn, Instagram & X",
      "Custom banner templates auto-formatted per platform",
      "Monthly performance analytics summary",
    ],
    pricing: {
      setup: "₹15,000",
      saas: "₹3–6K/mo",
    },
    howItWorks: [
      {
        step: "01",
        title: "Voice & Brand Profiling",
        description: "We calibrate tone, key messaging pillars, and custom visual templates.",
      },
      {
        step: "02",
        title: "Batch Generation & Approval",
        description: "Review a full month of engaging posts and graphics in one quick approval view.",
      },
      {
        step: "03",
        title: "Multi-Platform Auto-Publishing",
        description: "Posts are scheduled and published automatically at optimal peak engagement hours.",
      },
    ],
    faqs: [
      {
        question: "Do I have control over what gets posted?",
        answer: "Absolutely. Everything passes through a 1-click approval queue before scheduling.",
      },
      {
        question: "Which social media platforms are supported?",
        answer: "We support LinkedIn (Company & Personal profiles), Instagram, and X (Twitter).",
      },
      {
        question: "Can it generate images as well as text?",
        answer: "Yes, automated branded banners and carousel slides are created to match your brand style.",
      },
    ],
  },
  {
    id: "voice-agent",
    number: "04",
    slug: "voice-agent",
    title: "Voice Agent (AI Receptionist)",
    iconName: "PhoneCall",
    badge: "★ MOST BOOKED",
    tagline: "Your AI Receptionist Never Takes a Break",
    description:
      "A human-sounding voice AI that answers every call in Hindi, English or Hinglish — books appointments and follows up on missed leads.",
    bullets: [
      "Natural voice AI with Indian accent support",
      "Answers inbound inquiries & books straight to your calendar",
      "Outbound follow-up calls for every missed lead",
      "Call transcriptions + sentiment sent to WhatsApp",
    ],
    pricing: {
      setup: "₹40,000",
      saas: "₹8–15K/mo",
    },
    howItWorks: [
      {
        step: "01",
        title: "Custom Knowledge Ingestion",
        description: "We train the voice agent on your services, pricing, business FAQs, and booking availability.",
      },
      {
        step: "02",
        title: "Phone Line Integration",
        description: "Forward your existing phone number or assign a dedicated virtual line.",
      },
      {
        step: "03",
        title: "Live Call Answering & Summaries",
        description: "The AI speaks naturally with callers, books appointments, and sends audio summaries to WhatsApp.",
      },
    ],
    faqs: [
      {
        question: "Does the voice sound natural or robotic?",
        answer: "It uses ultra-low latency conversational voice models with natural pacing and authentic Indian accents.",
      },
      {
        question: "Can it understand Hindi and Hinglish?",
        answer: "Yes, callers can speak in English, pure Hindi, or casual Hinglish without switching modes.",
      },
      {
        question: "Can the AI transfer calls to a human?",
        answer: "Yes, complex or VIP inquiries can be warm-transferred directly to an executive's mobile phone.",
      },
    ],
  },
  {
    id: "youtube-automation",
    number: "05",
    slug: "youtube-automation",
    title: "YouTube Automation",
    iconName: "Youtube",
    tagline: "From Idea to Published Video, on Autopilot",
    description:
      "Built for YouTube creators: go from a topic to a finished, published video with AI doing the heavy lifting — scripts, voiceover, publishing and channel data in one place.",
    bullets: [
      "AI script writing in your niche and your tone",
      "Natural AI voiceover with ElevenLabs",
      "Auto-publishing with titles, descriptions and tags",
      "Channel performance data and next-video ideas",
    ],
    pricing: {
      setup: "No setup fee",
      tiers: [
        {
          name: "Starter",
          price: 999,
          period: "mo",
          limit: "Up to 8 videos per month",
          highlighted: false,
        },
        {
          name: "Pro",
          price: 2499,
          period: "mo",
          limit: "Up to 20 videos per month",
          highlighted: true,
        },
        {
          name: "Studio",
          price: 4999,
          period: "mo",
          limit: "Up to 40 videos per month",
          highlighted: false,
        },
      ],
    },
    howItWorks: [
      {
        step: "01",
        title: "Topic & Trend Ideation",
        description: "AI scours trending niches and formulates structured titles, outlines, and hooks.",
      },
      {
        step: "02",
        title: "Scripting & ElevenLabs Voiceover",
        description: "Generate full-length narrative scripts and studio-grade voice narration.",
      },
      {
        step: "03",
        title: "Metadata & Direct Publishing",
        description: "Auto-generate high-CTR titles, descriptions, and tags, scheduling directly to YouTube Studio.",
      },
    ],
    faqs: [
      {
        question: "Is there a setup fee for YouTube Automation?",
        answer: "No, there is zero setup fee. You only pay for your chosen monthly subscription tier.",
      },
      {
        question: "Can I bring my own voice clone?",
        answer: "Yes, you can connect your custom ElevenLabs cloned voice or select from premium pre-built narrators.",
      },
      {
        question: "Can I edit scripts before publishing?",
        answer: "Yes, the creator interface allows full manual review and editing before final publishing.",
      },
    ],
  },
];
