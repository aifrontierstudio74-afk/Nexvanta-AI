'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DigitalProduct } from '@/data/digital-products';
import { paymentConfig } from '@/data/payment';
import { submitLead } from '@/lib/submitLead';
import { isValidIndianPhone, formatINR } from '@/lib/format';
import { PaymentModal } from '@/components/common/PaymentModal';
import { X, CreditCard, QrCode, ArrowRight, ShieldCheck, MessageSquare } from 'lucide-react';

interface ProductCheckoutModalProps {
  product: DigitalProduct;
  isOpen: boolean;
  onClose: () => void;
}

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
  }
}

export const ProductCheckoutModal: React.FC<ProductCheckoutModalProps> = ({
  product,
  isOpen,
  onClose,
}) => {
  const router = useRouter();
  const [method, setMethod] = useState<'razorpay' | 'manual'>('razorpay');
  const [showManualModal, setShowManualModal] = useState(false);

  // Fallback direct interest form states
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  if (showManualModal) {
    return (
      <PaymentModal
        isOpen={true}
        onClose={() => {
          setShowManualModal(false);
          onClose();
        }}
        title={product.title}
        amount={product.price}
        slug={product.slug}
        segment="Digital Product"
      />
    );
  }

  const handleRazorpayCheckout = async () => {
    setError(null);
    if (!name.trim()) {
      setError('Please provide your name to initiate checkout.');
      return;
    }
    if (!phone.trim() || !isValidIndianPhone(phone)) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    setLoading(true);
    try {
      const orderRes = await fetch('/api/checkout/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: product.slug }),
      });
      const orderData = await orderRes.json();

      if (!orderData.ok) {
        setError(orderData.error || 'Failed to initialize payment.');
        setLoading(false);
        return;
      }

      // If Razorpay keys are not configured (fallback mode)
      if (orderData.fallback) {
        await submitLead({
          name,
          phone,
          email,
          segment: 'Digital Product',
          interestedIn: product.title,
          source: 'Digital Product Interest',
          message: `Digital product interest logged for ${product.title} (₹${product.price}). Razorpay keys not active.`,
          consent: true,
        });

        // Switch user to manual payment / WhatsApp modal
        setShowManualModal(true);
        setLoading(false);
        return;
      }

      // Check if Razorpay script is loaded
      if (typeof window.Razorpay === 'undefined') {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);
        await new Promise((resolve) => (script.onload = resolve));
      }

      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Nexvanta.AI',
        description: product.title,
        order_id: orderData.orderId,
        prefill: {
          name,
          contact: phone,
          email,
        },
        theme: {
          color: '#F5C518',
        },
        handler: async (response: Record<string, string>) => {
          try {
            const verifyRes = await fetch('/api/checkout/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                ...response,
                slug: product.slug,
                customerName: name,
                customerEmail: email,
                customerPhone: phone,
              }),
            });
            const verifyData = await verifyRes.json();
            if (verifyData.ok && verifyData.redirectUrl) {
              router.push(verifyData.redirectUrl);
            } else {
              setError('Payment verification failed. Please contact support.');
            }
          } catch {
            setError('Payment verification failed.');
          }
        },
      };

      if (window.Razorpay) {
        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        setError('Payment gateway SDK could not be initialized.');
      }
    } catch {
      setError('An error occurred while connecting to payment gateway.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-md bg-surface border border-border-strong rounded-2xl p-6 md:p-8 shadow-2xl text-text">
        <button
          onClick={onClose}
          aria-label="Close checkout modal"
          className="absolute top-5 right-5 text-muted hover:text-text p-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <span className="text-xs font-mono text-gold uppercase px-2.5 py-1 rounded bg-gold/10 border border-gold/20 inline-block mb-2">
            INSTANT CHECKOUT
          </span>
          <h2 className="text-xl font-bold font-heading text-text">
            {product.title}
          </h2>
          <div className="text-2xl font-extrabold font-mono text-gold mt-1">
            {formatINR(product.price)}
          </div>
        </div>

        {error && (
          <div className="p-3 mb-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
            {error}
          </div>
        )}

        {/* Payment Method Selector */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            type="button"
            onClick={() => setMethod('razorpay')}
            className={`p-3 rounded-xl border flex flex-col items-center gap-2 text-xs font-mono transition-all ${
              method === 'razorpay'
                ? 'border-gold bg-gold/10 text-gold font-bold'
                : 'border-border bg-surface-2 text-muted hover:text-text'
            }`}
          >
            <CreditCard className="w-5 h-5" />
            <span>Cards / UPI (Online)</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setMethod('manual');
              setShowManualModal(true);
            }}
            className={`p-3 rounded-xl border flex flex-col items-center gap-2 text-xs font-mono transition-all ${
              method === 'manual'
                ? 'border-gold bg-gold/10 text-gold font-bold'
                : 'border-border bg-surface-2 text-muted hover:text-text'
            }`}
          >
            <QrCode className="w-5 h-5" />
            <span>UPI / Bank (Manual)</span>
          </button>
        </div>

        {/* Contact details for delivery and receipt */}
        <div className="space-y-3 mb-5">
          <div>
            <label className="block text-xs font-mono text-muted uppercase mb-1">
              Your Name <span className="text-gold">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full Name"
              className="w-full px-3 py-2 rounded-xl bg-surface-2 border border-border text-text text-xs focus:border-gold focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-mono text-muted uppercase mb-1">
              Mobile Number (WhatsApp) <span className="text-gold">*</span>
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
          <div>
            <label className="block text-xs font-mono text-muted uppercase mb-1">
              Email Address (for download delivery)
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@email.com"
              className="w-full px-3 py-2 rounded-xl bg-surface-2 border border-border text-text text-xs focus:border-gold focus:outline-none"
            />
          </div>
        </div>

        <button
          onClick={handleRazorpayCheckout}
          disabled={loading}
          className="w-full py-3 px-5 rounded-xl bg-gold text-black font-heading font-bold text-sm uppercase tracking-wide hover:bg-gold-soft active:scale-[0.99] transition-all shadow-gold-glow flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? 'Connecting Payment...' : `Proceed to Pay ${formatINR(product.price)} ↗`}
        </button>

        <p className="text-[11px] text-muted text-center mt-3">
          Instant digital delivery upon payment verification · Secure SSL Checkout
        </p>
      </div>
    </div>
  );
};
