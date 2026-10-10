import React from 'react';
import { Metadata } from 'next';
import { PaymentModal } from '@/components/common/PaymentModal';
import { paymentConfig } from '@/data/payment';
import { siteConfig } from '@/data/site';
import { QrCode, Building, ShieldCheck, Mail, MessageSquare } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Make a Payment | Nexvanta.AI',
  description: 'Direct manual payment options via UPI and Bank Transfer for Nexvanta.AI services, subscriptions, and products.',
};

export default function PayPage() {
  const isUpiConfigured =
    paymentConfig.enableUpi && Boolean(paymentConfig.upi.upiId.trim());
  const isBankConfigured =
    paymentConfig.enableBankTransfer &&
    Boolean(paymentConfig.bank.accountNumber.trim()) &&
    Boolean(paymentConfig.bank.ifsc.trim());

  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <span className="text-xs font-mono uppercase tracking-widest text-gold px-3 py-1 rounded bg-gold/10 border border-gold/20 inline-block mb-3">
          DIRECT ACCOUNTS
        </span>
        <h1 className="text-3xl md:text-5xl font-bold font-heading text-text mb-4">
          Manual Payment Center
        </h1>
        <p className="text-muted text-sm md:text-base max-w-xl mx-auto leading-relaxed">
          Pay for approved quotes, retainers, and digital products via direct UPI or RTGS/NEFT/IMPS bank transfer.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* UPI Card */}
        <div className="p-6 md:p-8 rounded-2xl bg-surface border border-border flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-xl bg-gold/10 border border-gold/30 flex items-center justify-center text-gold mb-4">
              <QrCode className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold font-heading text-text mb-2">Pay via UPI</h2>
            <p className="text-muted text-xs leading-relaxed mb-6">
              Instant transfer via Google Pay, PhonePe, Paytm, or any BHIM UPI mobile application.
            </p>

            {isUpiConfigured ? (
              <div className="space-y-3 font-mono text-xs">
                <div className="p-3 bg-surface-2 rounded-xl border border-border">
                  <span className="text-muted block text-[10px]">UPI ID</span>
                  <span className="text-text font-bold text-sm">{paymentConfig.upi.upiId}</span>
                </div>
                <div className="p-3 bg-surface-2 rounded-xl border border-border">
                  <span className="text-muted block text-[10px]">PAYEE NAME</span>
                  <span className="text-text font-medium">{paymentConfig.upi.payeeName}</span>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-surface-2 rounded-xl border border-border text-xs text-muted">
                UPI details are currently being updated by the accounts team. Please connect on WhatsApp to receive the current QR code.
              </div>
            )}
          </div>

          <div className="pt-6">
            <a
              href="https://wa.me/919713103152?text=Hi%20Nexvanta.AI,%20please%20share%20UPI%20payment%20details%20for%20my%20invoice"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 rounded-xl bg-whatsapp text-black font-semibold text-xs flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              Request UPI QR on WhatsApp
            </a>
          </div>
        </div>

        {/* Bank Transfer Card */}
        <div className="p-6 md:p-8 rounded-2xl bg-surface border border-border flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-xl bg-gold/10 border border-gold/30 flex items-center justify-center text-gold mb-4">
              <Building className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold font-heading text-text mb-2">NEFT / RTGS / IMPS</h2>
            <p className="text-muted text-xs leading-relaxed mb-6">
              Official corporate bank transfer for standard invoices, retainers, and enterprise quotes.
            </p>

            {isBankConfigured ? (
              <div className="space-y-2 font-mono text-xs">
                <div className="p-2.5 bg-surface-2 rounded-lg border border-border">
                  <span className="text-muted block text-[10px]">ACCOUNT HOLDER</span>
                  <span className="text-text font-medium">{paymentConfig.bank.accountHolderName}</span>
                </div>
                <div className="p-2.5 bg-surface-2 rounded-lg border border-border">
                  <span className="text-muted block text-[10px]">ACCOUNT NUMBER</span>
                  <span className="text-text font-bold">{paymentConfig.bank.accountNumber}</span>
                </div>
                <div className="p-2.5 bg-surface-2 rounded-lg border border-border">
                  <span className="text-muted block text-[10px]">IFSC CODE</span>
                  <span className="text-gold font-bold">{paymentConfig.bank.ifsc}</span>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-surface-2 rounded-xl border border-border text-xs text-muted">
                Official bank details are shared directly on formal quotation letters and invoices.
              </div>
            )}
          </div>

          <div className="pt-6">
            <a
              href={`mailto:${siteConfig.email}?subject=Requesting Bank Invoice Details`}
              className="w-full py-2.5 px-4 rounded-xl bg-surface border border-border text-text font-semibold text-xs flex items-center justify-center gap-2 hover:border-gold"
            >
              <Mail className="w-4 h-4 text-gold" />
              Request Invoice by Email
            </a>
          </div>
        </div>
      </div>

      {/* Safety & UTR Notice */}
      <div className="p-6 rounded-2xl bg-surface-2 border border-border flex items-start gap-4">
        <ShieldCheck className="w-6 h-6 text-gold shrink-0 mt-0.5" />
        <div className="text-xs text-muted leading-relaxed">
          <p className="font-bold text-text mb-1">Payment Verification & Receipts</p>
          <p>
            After making any manual transfer, please email or WhatsApp your Transaction ID / UTR number along with your business name to{' '}
            <strong className="text-text">{siteConfig.email}</strong> or{' '}
            <strong className="text-whatsapp">{siteConfig.phoneDisplay}</strong>. A GST invoice will be generated and dispatched within 12 business hours.
          </p>
        </div>
      </div>
    </div>
  );
}
