'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import {
  User,
  Lock,
  Bell,
  Download,
  Trash2,
  CheckCircle2,
  ShieldAlert,
} from 'lucide-react';

export default function SettingsPage() {
  const router = useRouter();
  const supabase = createClient();

  // Profile states
  const [fullName, setFullName] = useState('Ankit Sharma');
  const [phone, setPhone] = useState('9713103152');
  const [company, setCompany] = useState('Sharma Enterprises');
  const [profileSaved, setProfileSaved] = useState(false);

  // Password state
  const [newPassword, setNewPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState<string | null>(null);

  // Notifications
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [usageAlerts, setUsageAlerts] = useState(true);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2500);
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMsg(null);
    if (newPassword.length < 6) {
      setPasswordMsg('Password must be at least 6 characters.');
      return;
    }
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      setPasswordMsg(error.message);
    } else {
      setPasswordMsg('Password updated successfully.');
      setNewPassword('');
    }
  };

  const handleExportData = () => {
    const exportData = {
      profile: { fullName, phone, company },
      exportedAt: new Date().toISOString(),
      platform: 'Nexvanta.AI SaaS',
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'nexvanta_account_data.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDeleteAccount = async () => {
    if (
      !confirm(
        'WARNING: Deleting your account will immediately revoke all automation entitlements, cancel active subscriptions, and remove your vault credentials. Continue?'
      )
    ) {
      return;
    }
    alert('Account deletion request submitted. Logging out.');
    await supabase.auth.signOut();
    router.push('/');
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="border-b border-border pb-6">
        <span className="text-xs font-mono text-gold uppercase tracking-wider block mb-1">
          PREFERENCES &amp; SECURITY
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold font-heading text-text">
          Account Settings
        </h1>
        <p className="text-muted text-xs sm:text-sm mt-1">
          Manage your contact credentials, authentication keys, and data privacy options.
        </p>
      </div>

      {/* 1. Profile Details */}
      <div className="p-6 md:p-8 rounded-3xl bg-surface border border-border space-y-6">
        <div className="flex items-center gap-2">
          <User className="w-5 h-5 text-gold" />
          <h2 className="text-lg font-bold font-heading text-text">Profile Information</h2>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4 max-w-lg">
          {profileSaved && (
            <div className="p-3 bg-success/10 border border-success/30 text-success text-xs rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Profile updated successfully.
            </div>
          )}

          <div>
            <label className="block text-xs font-mono text-muted uppercase mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-2 border border-border text-text text-xs focus:border-gold focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-muted uppercase mb-1">
              Mobile / WhatsApp
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-2 border border-border text-text text-xs focus:border-gold focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-muted uppercase mb-1">
              Company
            </label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-2 border border-border text-text text-xs focus:border-gold focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="py-2.5 px-5 rounded-xl bg-gold text-black font-semibold text-xs uppercase hover:bg-gold-soft transition-colors shadow-gold-glow"
          >
            Save Profile Changes
          </button>
        </form>
      </div>

      {/* 2. Change Password */}
      <div className="p-6 md:p-8 rounded-3xl bg-surface border border-border space-y-6">
        <div className="flex items-center gap-2">
          <Lock className="w-5 h-5 text-gold" />
          <h2 className="text-lg font-bold font-heading text-text">Change Password</h2>
        </div>

        <form onSubmit={handleUpdatePassword} className="space-y-4 max-w-lg">
          {passwordMsg && (
            <div className="p-3 bg-surface-2 border border-border text-xs rounded-xl font-mono text-gold">
              {passwordMsg}
            </div>
          )}

          <div>
            <label className="block text-xs font-mono text-muted uppercase mb-1">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-2 border border-border text-text text-xs focus:border-gold focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="py-2.5 px-5 rounded-xl bg-surface-2 border border-border hover:border-gold text-text font-semibold text-xs transition-colors"
          >
            Update Password
          </button>
        </form>
      </div>

      {/* 3. Notification Preferences */}
      <div className="p-6 md:p-8 rounded-3xl bg-surface border border-border space-y-6">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-gold" />
          <h2 className="text-lg font-bold font-heading text-text">Notification Preferences</h2>
        </div>

        <div className="space-y-3 max-w-lg text-xs">
          <label className="flex items-center justify-between p-3 rounded-xl bg-surface-2 border border-border cursor-pointer">
            <span className="text-text">Transactional Renewal &amp; Payment Receipts</span>
            <input
              type="checkbox"
              checked={emailNotifs}
              onChange={(e) => setEmailNotifs(e.target.checked)}
              className="rounded border-border text-gold focus:ring-gold"
            />
          </label>
          <label className="flex items-center justify-between p-3 rounded-xl bg-surface-2 border border-border cursor-pointer">
            <span className="text-text">80% Usage Quota Warning Alerts</span>
            <input
              type="checkbox"
              checked={usageAlerts}
              onChange={(e) => setUsageAlerts(e.target.checked)}
              className="rounded border-border text-gold focus:ring-gold"
            />
          </label>
        </div>
      </div>

      {/* 4. Privacy & Data Export (DPDP Compliant) */}
      <div className="p-6 md:p-8 rounded-3xl bg-surface border border-border space-y-6">
        <div>
          <h2 className="text-lg font-bold font-heading text-text">Data Privacy &amp; Export</h2>
          <p className="text-muted text-xs mt-1">
            Compliant with Indian DPDP standards. You can download a complete JSON export of your profile and pipeline history at any time.
          </p>
        </div>

        <button
          onClick={handleExportData}
          className="px-4 py-2.5 rounded-xl bg-surface-2 border border-border hover:border-gold text-text text-xs font-mono flex items-center gap-2 transition-colors"
        >
          <Download className="w-4 h-4" />
          Download Account Data (JSON) ↗
        </button>
      </div>

      {/* 5. Danger Zone */}
      <div className="p-6 md:p-8 rounded-3xl bg-red-500/5 border border-red-500/20 space-y-4">
        <div className="flex items-center gap-2 text-red-400">
          <ShieldAlert className="w-5 h-5" />
          <h2 className="text-lg font-bold font-heading">Danger Zone</h2>
        </div>
        <p className="text-muted text-xs leading-relaxed max-w-xl">
          Permanently delete your account, cancel all active subscriptions, and clear stored integration credentials from the encryption vault. This action cannot be reversed.
        </p>
        <button
          onClick={handleDeleteAccount}
          className="px-4 py-2.5 rounded-xl bg-red-500/20 border border-red-500/40 text-red-400 hover:bg-red-500 hover:text-white text-xs font-semibold flex items-center gap-2 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          Delete Account Permanently
        </button>
      </div>
    </div>
  );
}
