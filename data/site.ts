export interface SiteConfig {
  name: string;
  wordmark: {
    main: string;
    accent: string;
  };
  email: string;
  phone: string;
  phoneDisplay: string;
  whatsappNumber: string;
  whatsappUrl: string;
  currency: string;
  tagline: string;
  description: string;
  navLinks: {
    name: string;
    href: string;
  }[];
  factStrip: string[];
}

export const siteConfig: SiteConfig = {
  name: "Nexvanta.AI",
  wordmark: {
    main: "Nexvanta",
    accent: ".AI",
  },
  email: "hello.nexvanta56@gmail.com",
  phone: "9713103152",
  phoneDisplay: "+91 97131 03152",
  whatsappNumber: "919713103152",
  whatsappUrl: "https://wa.me/919713103152",
  currency: "₹",
  tagline: "AI Automation That Works While You Sleep",
  description: "AI agents for WhatsApp, voice, sales and operations in Hindi, English and Hinglish.",
  navLinks: [
    { name: "Services", href: "/services" },
    { name: "SaaS", href: "/saas" },
    { name: "Digital Products", href: "/digital-products" },
    { name: "Contact", href: "/contact" },
  ],
  factStrip: [
    "30 industry-specific AI agents",
    "5 SaaS automations",
    "Hindi · English · Hinglish",
    "WhatsApp + Voice + CRM",
  ],
};
