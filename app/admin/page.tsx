'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Download, Users, ShieldAlert, CheckCircle2 } from 'lucide-react';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<
    { id: string; full_name: string; phone: string; company: string; role: string; created_at: string }[]
  >([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`/api/admin/users?q=${encodeURIComponent(search)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.ok && Array.isArray(data.users)) {
          setUsers(data.users);
        }
      })
      .catch(() => {});
  }, [search]);

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <span className="text-xs font-mono text-gold uppercase tracking-wider block mb-1">
            USER MANAGEMENT
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold font-heading text-text">
            Registered Client Accounts
          </h1>
          <p className="text-muted text-xs sm:text-sm mt-1">
            Search users, verify contact details, and export directory records.
          </p>
        </div>

        <a
          href="/api/admin/export?type=users"
          download
          className="px-4 py-2 rounded-xl bg-gold text-black font-semibold text-xs font-mono uppercase tracking-wide hover:bg-gold-soft transition-all shadow-gold-glow flex items-center gap-2 self-start sm:self-auto"
        >
          <Download className="w-4 h-4" />
          Export Users (CSV) ↗
        </a>
      </div>

      {/* Search Input */}
      <div className="max-w-md relative">
        <Search className="w-4 h-4 text-muted absolute left-3.5 top-3" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, phone or company..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface border border-border text-text text-xs focus:border-gold focus:outline-none"
        />
      </div>

      {/* Users Table */}
      <div className="p-6 rounded-2xl bg-surface border border-border space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-border text-muted uppercase text-[10px]">
                <th className="py-2.5">User ID</th>
                <th className="py-2.5">Full Name</th>
                <th className="py-2.5">Phone</th>
                <th className="py-2.5">Company</th>
                <th className="py-2.5">Role</th>
                <th className="py-2.5">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-muted">
                    No registered user accounts found.
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id}>
                    <td className="py-3 text-gold">{u.id.slice(0, 12)}...</td>
                    <td className="py-3 text-text font-medium">{u.full_name || 'N/A'}</td>
                    <td className="py-3">{u.phone || 'N/A'}</td>
                    <td className="py-3 text-muted">{u.company || 'N/A'}</td>
                    <td className="py-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] ${
                          u.role === 'admin'
                            ? 'bg-gold/20 text-gold font-bold border border-gold/40'
                            : 'bg-surface-2 text-muted'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 text-muted">
                      {new Date(u.created_at).toLocaleDateString('en-IN')}
                    </td>
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
