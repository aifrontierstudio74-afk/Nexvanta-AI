'use client';

import React, { useState } from 'react';
import { X, Copy, Check, QrCode, Building, CreditCard, ArrowRight, ShieldAlert } from 'lucide-react';
import { paymentConfig } from '@/data/payment';
import { submitLead } from '@/lib/submitLead';
import { isValidIndianPhone, formatINR } from '@/lib/format';
import Image from 'next/image';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  amount?: number;
  slug?: string;
  segment?: 'Service' | 'SaaS' | 'Digital Product' | 'General';
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  title,
  amount,
  segment = 'Digital Product',
}) => {
  const [activeTab, setActiveTab] = useState<'upi' | 'bank' | 'claim'>('upi');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Form states for "I have paid"
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [paidAmount, setPaidAmount] = useState<string>(amount ? String(amount) : '');
  const [method, setMethod] = useState<'UPI' | 'Bank Transfer'>('UPI');
  const [utrNumber, setUtrNumber] = useState('');
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const isUpiConfigured =
    paymentConfig.enableUpi && Boolean(paymentConfig.upi.upiId.trim());
  const isBankConfigured =
    paymentConfig.enableBankTransfer &&
    Boolean(paymentConfig.bank.accountNumber.trim()) &&
    Boolean(paymentConfig.bank.ifsc.trim());

  const nothingConfigured = !isUpiConfigured && !isBankConfigured;

  const handleClaimSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!phone.trim() || !isValidIndianPhone(phone)) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!utrNumber.trim()) {
      setError('Please provide the UTR / Transaction reference number.');
      return;
    }

    setSubmitting(true);
    try {
      const claimMessage = `Payment claimed: ₹${paidAmount || amount || '0'} via ${method}, UTR: ${utrNumber}. Note: ${note || 'None'}`;
      const res = await submitLead({
        name,
        phone,
        email,
        segment,
        interestedIn: title,
        source: 'Manual Payment Submitted',
        message: claimMessage,
        consent: true,
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        setError(res.error || 'Failed to submit payment claim. Please contact support.');
      }
    } catch {
      setError('An error occurred. Please contact us on WhatsApp.');
    } finally {
      setSubmitting(false);
    }
  };

  const upiDeepLink = isUpiConfigured
    ? `upi://pay?pa=${paymentConfig.upi.upiId}&pn=${encodeURIComponent(
        paymentConfig.upi.payeeName
      )}${amount ? `&am=${amount}` : ''}&cu=INR&tn=${encodeURIComponent(title)}`
    : '#';

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-lg bg-surface border border-border-strong rounded-2xl p-6 md:p-8 shadow-2xl text-text overflow-y-auto max-h-[92vh]">
        <button
          onClick={onClose}
          aria-label="Close payment modal"
          className="absolute top-5 right-5 text-muted hover:text-text p-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-success/15 border border-success/40 rounded-full flex items-center justify-center mx-auto mb-4 text-success">
              <Check className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold font-heading mb-2 text-text">
              Payment Submission Received
            </h3>
            <p className="text-muted text-sm mb-6 leading-relaxed">
              We will verify your payment and send your product or confirmation to your email and WhatsApp shortly.
            </p>
            <div className="p-3 bg-surface-2 rounded-xl border border-border text-xs text-muted mb-6 font-mono">
              Reference UTR: <span className="text-gold font-bold">{utrNumber}</span>
            </div>
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-gold text-black font-semibold text-sm hover:bg-gold-soft transition-colors"
            >
              Done
            </button>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <span className="text-xs font-mono text-gold uppercase px-2.5 py-1 rounded bg-gold/10 border border-gold/20 inline-block mb-2">
                MANUAL PAYMENT
              </span>
              <h2 className="text-xl md:text-2xl font-bold font-heading text-text">
                {title}
              </h2>
              {amount !== undefined && (
                <p className="text-gold font-mono font-bold text-lg mt-1">
                  Payable Amount: {formatINR(amount)}
                </p>
              )}
            </div>

            {nothingConfigured ? (
              <div className="text-center py-8 bg-surface-2/50 rounded-xl border border-border p-6">
                <ShieldAlert className="w-10 h-10 text-gold mx-auto mb-3" />
                <h4 className="text-base font-bold font-heading mb-2">Contact Us to Pay</h4>
                <p className="text-muted text-sm mb-6">
                  Online accounts are currently being updated. Please contact our accounts team directly via WhatsApp or Email to receive payment details.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <a
                    href="https://wa.me/919713103152"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 rounded-xl bg-whatsapp text-black font-semibold text-xs flex items-center justify-center gap-2"
                  >
                    WhatsApp +91 97131 03152
                  </a>
                  <a
                    href="mailto:hello.nexvanta56@gmail.com"
                    className="px-5 py-2.5 rounded-xl bg-surface border border-border text-text text-xs flex items-center justify-center gap-2 hover:border-gold"
                  >
                    hello.nexvanta56@gmail.com
                  </a>
                </div>
              </div>
            ) : (
              <>
                {/* Method Tabs */}
                <div className="flex border-b border-border mb-6">
                  {isUpiConfigured && (
                    <button
                      onClick={() => setActiveTab('upi')}
                      className={`flex items-center gap-2 px-4 py-2.5 text-xs font-mono uppercase tracking-wider border-b-2 font-medium transition-all ${
                        activeTab === 'upi'
                          ? 'border-gold text-gold bg-gold/5'
                          : 'border-transparent text-muted hover:text-text'
                      }`}
                    >
                      <QrCode className="w-4 h-4" />
                      UPI
                    </button>
                  )}
                  {isBankConfigured && (
                    <button
                      onClick={() => setActiveTab('bank')}
                      className={`flex items-center gap-2 px-4 py-2.5 text-xs font-mono uppercase tracking-wider border-b-2 font-medium transition-all ${
                        activeTab === 'bank'
                          ? 'border-gold text-gold bg-gold/5'
                          : 'border-transparent text-muted hover:text-text'
                      }`}
                    >
                      <Building className="w-4 h-4" />
                      Bank Transfer
                    </button>
                  )}
                  <button
                    onClick={() => setActiveTab('claim')}
                    className={`flex items-center gap-2 px-4 py-2.5 text-xs font-mono uppercase tracking-wider border-b-2 font-medium transition-all ${
                      activeTab === 'claim'
                        ? 'border-gold text-gold bg-gold/5'
                        : 'border-transparent text-muted hover:text-text'
                    }`}
                  >
                    <CreditCard className="w-4 h-4" />
                    I Have Paid
                  </button>
                </div>

                {/* Tab: UPI */}
                {activeTab === 'upi' && isUpiConfigured && (
                  <div className="space-y-4">
                    {paymentConfig.upi.qrImage && (
                      <div className="flex justify-center p-4 bg-surface-2 rounded-xl border border-border">
                        <Image
                          src={paymentConfig.upi.qrImage}
                          alt="UPI QR Code"
                          width={180}
                          height={180}
                          className="rounded-lg"
                        />
                      </div>
                    )}

                    <div className="p-3.5 bg-surface-2 rounded-xl border border-border flex items-center justify-between">
                      <div>
                        <div className="text-[11px] font-mono text-muted uppercase">UPI ID</div>
                        <div className="text-sm font-mono font-bold text-text">
                          {paymentConfig.upi.upiId}
                        </div>
                      </div>
                      <button
                        onClick={() => handleCopy(paymentConfig.upi.upiId, 'upiId')}
                        className="p-2 rounded-lg bg-surface border border-border hover:border-gold text-muted hover:text-gold transition-colors flex items-center gap-1.5 text-xs"
                      >
                        {copiedField === 'upiId' ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
                        <span>{copiedField === 'upiId' ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>

                    <div className="p-3.5 bg-surface-2 rounded-xl border border-border flex items-center justify-between">
                      <div>
                        <div className="text-[11px] font-mono text-muted uppercase">Payee Name</div>
                        <div className="text-sm font-medium text-text">{paymentConfig.upi.payeeName}</div>
                      </div>
                    </div>

                    {/* Mobile UPI Deep link */}
                    <a
                      href={upiDeepLink}
                      className="w-full py-3 px-4 rounded-xl bg-gold text-black font-semibold text-sm flex items-center justify-center gap-2 shadow-gold-glow hover:bg-gold-soft transition-colors"
                    >
                      Pay with UPI App
                      <ArrowRight className="w-4 h-4" />
                    </a>

                    <div className="p-3 rounded-lg bg-surface-2/60 border border-border text-xs text-muted leading-relaxed">
                      💡 {paymentConfig.instructions} Click <strong>&quot;I Have Paid&quot;</strong> tab above once completed.
                    </div>
                  </div>
                )}

                {/* Tab: Bank Transfer */}
                {activeTab === 'bank' && isBankConfigured && (
                  <div className="space-y-3">
                    {[
                      { label: 'Account Holder', val: paymentConfig.bank.accountHolderName, id: 'holder' },
                      { label: 'Bank Name', val: paymentConfig.bank.bankName, id: 'bankName' },
                      { label: 'Account Number', val: paymentConfig.bank.accountNumber, id: 'accNo' },
                      { label: 'IFSC Code', val: paymentConfig.bank.ifsc, id: 'ifsc' },
                      { label: 'Branch', val: paymentConfig.bank.branch, id: 'branch' },
                      { label: 'Account Type', val: paymentConfig.bank.accountType, id: 'accType' },
                    ]
                      .filter((item) => Boolean(item.val))
                      .map((item) => (
                        <div
                          key={item.id}
                          className="p-3 bg-surface-2 rounded-xl border border-border flex items-center justify-between"
                        >
                          <div>
                            <div className="text-[10px] font-mono text-muted uppercase">{item.label}</div>
                            <div className="text-xs font-mono font-medium text-text">{item.val}</div>
                          </div>
                          <button
                            onClick={() => handleCopy(item.val, item.id)}
                            className="p-1.5 rounded-lg bg-surface border border-border hover:border-gold text-muted hover:text-gold transition-colors flex items-center gap-1 text-[11px]"
                          >
                            {copiedField === item.id ? <Check className="w-3.5 h-3.5 text-success" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{copiedField === item.id ? 'Copied' : 'Copy'}</span>
                          </button>
                        </div>
                      ))}

                    <div className="p-3 rounded-lg bg-surface-2/60 border border-border text-xs text-muted leading-relaxed">
                      💡 {paymentConfig.instructions} Click <strong>&quot;I Have Paid&quot;</strong> tab to record your UTR.
                    </div>
                  </div>
                )}

                {/* Tab: I Have Paid (Claim Form) */}
                {activeTab === 'claim' && (
                  <form onSubmit={handleClaimSubmit} className="space-y-3.5">
                    {error && (
                      <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
                        {error}
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-mono text-muted uppercase mb-1">
                          Full Name <span className="text-gold">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Your Name"
                          className="w-full px-3 py-2 rounded-xl bg-surface-2 border border-border text-text text-xs focus:border-gold focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono text-muted uppercase mb-1">
                          Mobile / WhatsApp <span className="text-gold">*</span>
                        </label>
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="97131 03152"
                          className="w-full px-3 py-2 rounded-xl bg-surface-2 border border-border text-text text-xs focus:border-gold focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-mono text-muted uppercase mb-1">
                          Email (Optional)
                        </label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="name@email.com"
                          className="w-full px-3 py-2 rounded-xl bg-surface-2 border border-border text-text text-xs focus:border-gold focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono text-muted uppercase mb-1">
                          Amount Paid (₹)
                        </label>
                        <input
                          type="text"
                          value={paidAmount}
                          onChange={(e) => setPaidAmount(e.target.value)}
                          placeholder={amount ? String(amount) : '₹'}
                          className="w-full px-3 py-2 rounded-xl bg-surface-2 border border-border text-text text-xs focus:border-gold focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-muted uppercase mb-1">
                        Payment Method
                      </label>
                      <div className="flex gap-4 text-xs">
                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="radio"
                            name="method"
                            checked={method === 'UPI'}
                            onChange={() => setMethod('UPI')}
                            className="text-gold focus:ring-gold"
                          />
                          <span>UPI</span>
                        </label>
                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="radio"
                            name="method"
                            checked={method === 'Bank Transfer'}
                            onChange={() => setMethod('Bank Transfer')}
                            className="text-gold focus:ring-gold"
                          />
                          <span>Bank Transfer</span>
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-muted uppercase mb-1">
                        UTR / Transaction ID <span className="text-gold">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={utrNumber}
                        onChange={(e) => setUtrNumber(e.target.value)}
                        placeholder="12-digit UTR or Bank Ref ID"
                        className="w-full px-3 py-2 rounded-xl bg-surface-2 border border-border text-text text-xs focus:border-gold focus:outline-none font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-muted uppercase mb-1">
                        Optional Note
                      </label>
                      <input
                        type="text"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="e.g. Paid via PhonePe / GPay"
                        className="w-full px-3 py-2 rounded-xl bg-surface-2 border border-border text-text text-xs focus:border-gold focus:outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-2.5 px-4 rounded-xl bg-gold text-black font-semibold text-xs shadow-gold-glow hover:bg-gold-soft transition-colors disabled:opacity-50"
                    >
                      {submitting ? 'Submitting Verification Claim...' : 'Submit Payment Verification Claim'}
                    </button>
                  </form>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
