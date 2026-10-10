'use client';

import React, { useState } from 'react';
import { ToggleLeft, ToggleRight, ShieldAlert, CheckCircle2 } from 'lucide-react';

export default function AdminFeaturesPage() {
  const [flags, setFlags] = useState<Record<string, boolean>>({
    'lead-capture-crm': true,
    'email-outreach': true,
    'social-auto-posting': true,
    'voice-agent': true,
    'youtube-automation': true,
  });

  const toggleFlag = (slug: string) => {
    setFlags((prev) => ({
      ...prev,
      [slug]: !prev[slug],
    }));
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="border-b border-border pb-6">
        <span className="text-xs font-mono text-gold uppercase tracking-wider block mb-1">
          KILL SWITCH &amp; AVAILABILITY
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold font-heading text-text">
          Automation Kill Switches
        </h1>
        <p className="text-muted text-xs sm:text-sm mt-1">
          Instantly disable or pause an automation module globally in case of API outages or upstream maintenance.
        </p>
      </div>

      <div className="space-y-4">
        {Object.entries(flags).map(([slug, active]) => (
          <div
            key={slug}
            className="p-5 rounded-2xl bg-surface border border-border flex items-center justify-between"
          >
            <div>
              <div className="text-xs font-mono text-gold uppercase tracking-wider">{slug}</div>
              <h3 className="font-heading font-bold text-base text-text capitalize">
                {slug.replace(/-/g, ' ')}
              </h3>
              <p className="text-xs text-muted">
                {active
                  ? 'Operational: New signups and background executions allowed.'
                  : 'Emergency Pause: New activations and executions blocked globally.'}
              </p>
            </div>

            <button
              onClick={() => toggleFlag(slug)}
              className={`px-4 py-2 rounded-xl text-xs font-mono uppercase font-bold transition-all flex items-center gap-2 ${
                active
                  ? 'bg-success/20 border border-success/40 text-success'
                  : 'bg-red-500/20 border border-red-500/40 text-red-400'
              }`}
            >
              {active ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
              {active ? 'ACTIVE' : 'PAUSED'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
