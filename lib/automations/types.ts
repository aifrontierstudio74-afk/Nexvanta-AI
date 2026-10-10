import React from 'react';

export interface AutomationModule {
  slug: 'lead-capture-crm' | 'email-outreach' | 'social-auto-posting' | 'voice-agent' | 'youtube-automation';
  title: string;
  Component: React.ComponentType; // the UI the user runs after subscribing
  onSubscribe?: (userId: string) => Promise<void>;
}
