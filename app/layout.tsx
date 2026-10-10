import type { Metadata } from 'next';
import { Syne, Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ChatbotWidget } from '@/components/chatbot/ChatbotWidget';
import { siteConfig } from '@/data/site';

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
  display: 'swap',
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://nexvanta.ai'),
  title: {
    default: 'Nexvanta.AI — AI Automation That Works While You Sleep',
    template: '%s | Nexvanta.AI',
  },
  description: siteConfig.description,
  keywords: [
    'AI automation',
    'AI agents India',
    'WhatsApp AI receptionist',
    'voice AI agents',
    'Hindi AI automation',
    'SaaS automation',
  ],
  authors: [{ name: 'Nexvanta.AI' }],
  creator: 'Nexvanta.AI',
  publisher: 'Nexvanta.AI',
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/icon.svg',
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://nexvanta.ai',
    title: 'Nexvanta.AI — AI Automation That Works While You Sleep',
    description: siteConfig.description,
    siteName: 'Nexvanta.AI',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nexvanta.AI — AI Automation That Works While You Sleep',
    description: siteConfig.description,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Nexvanta.AI',
    url: 'https://nexvanta.ai',
    email: 'hello.nexvanta56@gmail.com',
    telephone: '+919713103152',
    description: siteConfig.description,
  };

  return (
    <html
      lang="en"
      className={`${syne.variable} ${jakarta.variable} ${mono.variable} scroll-smooth`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-bg text-text min-h-screen flex flex-col antialiased selection:bg-gold selection:text-black">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <ChatbotWidget />
      </body>
    </html>
  );
}
