'use client';

import React, { useState, useEffect } from 'react';
import { AlertTriangle, Clock, RefreshCw } from 'lucide-react';

export default function AdminFailedRunsPage() {
  const [runs, setRuns] = useState<
    { id: string; user_id: string; automation_slug: string; error: string; created_at: string }[]
  >([]);

  return (
    <div className="space-y-8">
      <div className="border-b border-border pb-6">
        <span className="text-xs font-mono text-gold uppercase tracking-wider block mb-1">
          OPERATIONAL HEALTH
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold font-heading text-text">
          Failed Automation Runs
        </h1>
        <p className="text-muted text-xs sm:text-sm mt-1">
          Inspect execution exceptions, stack traces, and affected customer instances.
        </p>
      </div>

      <div className="p-6 rounded-2xl bg-surface border border-border space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-border text-muted uppercase text-[10px]">
                <th className="py-2.5">Run ID</th>
                <th className="py-2.5">User</th>
                <th className="py-2.5">Automation</th>
                <th className="py-2.5">Error Message</th>
                <th className="py-2.5">Failed At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {runs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-muted">
                    Zero pipeline run failures recorded. System running smoothly!
                  </td>
                </tr>
              ) : (
                runs.map((r) => (
                  <tr key={r.id}>
                    <td className="py-3 text-red-400 font-bold">{r.id}</td>
                    <td className="py-3">{r.user_id.slice(0, 10)}...</td>
                    <td className="py-3 text-gold">{r.automation_slug}</td>
                    <td className="py-3 text-red-300">{r.error}</td>
                    <td className="py-3 text-muted">{new Date(r.created_at).toLocaleDateString('en-IN')}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
