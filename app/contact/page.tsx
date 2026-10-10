import React from 'react';
import { Metadata } from 'next';
import { ContactClient } from '@/components/contact/ContactClient';

export const metadata: Metadata = {
  title: 'Contact Us | Nexvanta.AI',
  description:
    'Connect with Nexvanta.AI for AI automation architecture consultations, custom quotes, or technical questions.',
};

export default function ContactPage() {
  return <ContactClient />;
}
