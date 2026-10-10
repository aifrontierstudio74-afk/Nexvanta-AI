import React from 'react';
import { Metadata } from 'next';
import { HomeClient } from '@/components/home/HomeClient';
import { getAllIndustries } from '@/data/agents';
import { siteConfig } from '@/data/site';

export const metadata: Metadata = {
  title: 'Nexvanta.AI — AI Automation That Works While You Sleep',
  description: siteConfig.description,
};

export default function HomePage() {
  const industries = getAllIndustries();

  return <HomeClient industries={industries} />;
}
