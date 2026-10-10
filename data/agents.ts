export interface AgentService {
  id: number;
  name: string;
  specificIndustry: string;
  subscription: number;
  setup: number;
  maintenance: number;
}

export const websiteDesignCard = {
  title: "Website Design + Build",
  tagline: "Professional Website Built in 5–7 Days",
  description:
    "A blazing-fast, conversion-first website that closes clients while you sleep — designed, built and launched inside a week.",
  bullets: [
    "Custom UI/UX designed specifically for conversion",
    "Fully responsive with sub-second load times",
    "Built-in SEO, analytics & conversion tracking",
    "Monthly maintenance, security & backups",
  ],
  pricing: {
    setup: "₹8K–₹40K",
    maintenance: "₹2–5K/mo",
  },
};

export const agents: AgentService[] = [
  {
    id: 1,
    name: "AI WhatsApp Receptionist",
    specificIndustry: "Clinics, salons, restaurants, gyms, real estate",
    subscription: 8000,
    setup: 20000,
    maintenance: 5000,
  },
  {
    id: 2,
    name: "AI Lead Qualification Agent",
    specificIndustry: "Real estate, coaching, insurance, automotive",
    subscription: 10000,
    setup: 25000,
    maintenance: 7500,
  },
  {
    id: 3,
    name: "AI Lead Follow-Up Agent",
    specificIndustry: "Real estate, coaching, agencies, home services",
    subscription: 10000,
    setup: 25000,
    maintenance: 7500,
  },
  {
    id: 4,
    name: "AI Sales Agent",
    specificIndustry: "Retail, B2B services, SaaS, automotive",
    subscription: 15000,
    setup: 40000,
    maintenance: 10000,
  },
  {
    id: 5,
    name: "AI Customer Support Agent",
    specificIndustry: "E-commerce, D2C, SaaS, retail",
    subscription: 15000,
    setup: 35000,
    maintenance: 10000,
  },
  {
    id: 6,
    name: "AI Appointment Booking Agent",
    specificIndustry: "Clinics, salons, consultants, gyms",
    subscription: 8000,
    setup: 20000,
    maintenance: 5000,
  },
  {
    id: 7,
    name: "AI Voice Receptionist",
    specificIndustry: "Clinics, restaurants, hotels, service businesses",
    subscription: 18000,
    setup: 40000,
    maintenance: 10000,
  },
  {
    id: 8,
    name: "AI Voice Sales Agent",
    specificIndustry: "Real estate, automotive, insurance, B2B",
    subscription: 25000,
    setup: 50000,
    maintenance: 12500,
  },
  {
    id: 9,
    name: "AI Voice Follow-Up Agent",
    specificIndustry: "Real estate, coaching, agencies, service businesses",
    subscription: 18000,
    setup: 40000,
    maintenance: 10000,
  },
  {
    id: 10,
    name: "AI Voice Appointment Agent",
    specificIndustry: "Clinics, salons, consultants, home services",
    subscription: 18000,
    setup: 40000,
    maintenance: 10000,
  },
  {
    id: 11,
    name: "AI Voice + WhatsApp Receptionist",
    specificIndustry: "Clinics, hotels, restaurants, real estate",
    subscription: 25000,
    setup: 60000,
    maintenance: 15000,
  },
  {
    id: 12,
    name: "AI Voice + WhatsApp Sales Agent",
    specificIndustry: "Real estate, automotive, education, B2B",
    subscription: 30000,
    setup: 75000,
    maintenance: 18000,
  },
  {
    id: 13,
    name: "AI Voice + WhatsApp Lead Conversion Agent",
    specificIndustry: "Real estate, coaching, dealerships, agencies",
    subscription: 30000,
    setup: 75000,
    maintenance: 18000,
  },
  {
    id: 14,
    name: "AI Real Estate Agent",
    specificIndustry: "Residential and commercial real estate agencies",
    subscription: 20000,
    setup: 50000,
    maintenance: 12500,
  },
  {
    id: 15,
    name: "AI Real Estate Lead Agent",
    specificIndustry: "Property brokers, builders, real estate developers",
    subscription: 15000,
    setup: 35000,
    maintenance: 10000,
  },
  {
    id: 16,
    name: "AI Coaching / Admission Agent",
    specificIndustry: "Coaching institutes, colleges, study-abroad consultants",
    subscription: 15000,
    setup: 35000,
    maintenance: 10000,
  },
  {
    id: 17,
    name: "AI Clinic Receptionist",
    specificIndustry: "Clinics, diagnostic centres, healthcare practices",
    subscription: 12000,
    setup: 30000,
    maintenance: 8000,
  },
  {
    id: 18,
    name: "AI Dental Receptionist",
    specificIndustry: "Dental clinics and dental chains",
    subscription: 12000,
    setup: 30000,
    maintenance: 8000,
  },
  {
    id: 19,
    name: "AI Gym Sales Agent",
    specificIndustry: "Gyms, fitness studios, personal training centres",
    subscription: 10000,
    setup: 25000,
    maintenance: 7500,
  },
  {
    id: 20,
    name: "AI Restaurant Receptionist",
    specificIndustry: "Restaurants, cafes, cloud kitchens",
    subscription: 12000,
    setup: 30000,
    maintenance: 8000,
  },
  {
    id: 21,
    name: "AI Hotel Booking Agent",
    specificIndustry: "Hotels, resorts, serviced apartments",
    subscription: 20000,
    setup: 50000,
    maintenance: 12500,
  },
  {
    id: 22,
    name: "AI Recruitment Agent",
    specificIndustry: "Recruitment agencies, HR teams, staffing firms",
    subscription: 20000,
    setup: 50000,
    maintenance: 12500,
  },
  {
    id: 23,
    name: "AI E-commerce Support Agent",
    specificIndustry: "Online stores, D2C brands, marketplaces",
    subscription: 18000,
    setup: 40000,
    maintenance: 10000,
  },
  {
    id: 24,
    name: "AI Abandoned Cart Agent",
    specificIndustry: "Shopify stores, D2C and e-commerce brands",
    subscription: 10000,
    setup: 25000,
    maintenance: 7500,
  },
  {
    id: 25,
    name: "AI Insurance Lead Agent",
    specificIndustry: "Insurance brokers, agencies, financial distributors",
    subscription: 15000,
    setup: 40000,
    maintenance: 10000,
  },
  {
    id: 26,
    name: "AI Legal Intake Agent",
    specificIndustry: "Law firms, legal consultants, legal service providers",
    subscription: 15000,
    setup: 40000,
    maintenance: 10000,
  },
  {
    id: 27,
    name: "AI Marketing Agency Agent",
    specificIndustry: "Digital marketing and performance marketing agencies",
    subscription: 20000,
    setup: 50000,
    maintenance: 12500,
  },
  {
    id: 28,
    name: "AI CRM Agent",
    specificIndustry: "B2B sales teams, service firms, real estate agencies",
    subscription: 20000,
    setup: 50000,
    maintenance: 12500,
  },
  {
    id: 29,
    name: "AI Document Processing Agent",
    specificIndustry: "Accounting firms, logistics, insurance, back offices",
    subscription: 15000,
    setup: 35000,
    maintenance: 10000,
  },
  {
    id: 30,
    name: "AI Business Operations Agent",
    specificIndustry: "SMEs, agencies, multi-location businesses",
    subscription: 25000,
    setup: 60000,
    maintenance: 15000,
  },
];

/**
 * Extracts unique industry tags trimmed from all 30 agents.
 */
export function getAllIndustries(): string[] {
  const set = new Set<string>();
  agents.forEach((agent) => {
    agent.specificIndustry.split(",").forEach((item) => {
      const trimmed = item.trim();
      if (trimmed) set.add(trimmed);
    });
  });
  return Array.from(set).sort((a, b) => a.localeCompare(b));
}
