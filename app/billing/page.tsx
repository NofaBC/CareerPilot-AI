'use client';

import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function BillingPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  const handleUpgrade = async (priceId: string) => {
    setLoading(true);
    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId }),
      });

      const { sessionId } = await response.json();
      const stripe = await stripePromise;

      if (stripe) {
        await stripe.redirectToCheckout({ sessionId });
      }
    } catch (error) {
      console.error('Upgrade error:', error);
      alert('Failed to initiate checkout. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-slate-400">Loading...</div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-4xl space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-semibold text-slate-50">Choose Your Plan</h1>
          <p className="text-slate-400">Unlock more features and accelerate your job search</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Starter Plan */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-slate-50">Starter</h2>
              <p className="text-3xl font-bold text-emerald-400">Free</p>
              <p className="text-sm text-slate-400">Perfect for getting started</p>
            </div>

            <ul className="space-y-2 text-sm text-slate-300">
              <li className="flex items-center gap-2">
                <span className="text-emerald-400">✓</span>
                2 Profile Generations
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-400">✓</span>
                5 Job Scans
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-400">✓</span>
                3 Application Drafts
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-400">✓</span>
                5 Interview Prep Sessions
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-400">✓</span>
                Basic job matching
              </li>
            </ul>

            <button
              // disabled
              className="w-full opacity-50 inline-flex items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-800/50 px-4 py-2 text-sm font-medium text-slate-300 cursor-not-allowed"
            >
              Current Plan
            </button>
          </div>

          {/* Pro Plan */}
          <div className="rounded-2xl border-2 border-emerald-400/40 bg-slate-900/70 p-6 space-y-4 shadow-lg shadow-emerald-500/20">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-slate-50">Pro</h2>
                <span className="px-2 py-1 rounded-full bg-emerald-500/10 border border-emerald-400/40 text-emerald-200 text-xs font-medium">
                  Most Popular
                </span>
              </div>
              <p className="text-3xl font-bold text-emerald-400">$29<span className="text-lg text-slate-400">/month</span></p>
              <p className="text-sm text-slate-400">Unlimited everything</p>
            </div>

            <ul className="space-y-2 text-sm text-slate-300">
              <li className="flex items-center gap-2">
                <span className="text-emerald-400">✓</span>
                Unlimited Profile Generations
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-400">✓</span>
                Unlimited Job Scans
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-400">✓</span>
                Unlimited Application Drafts
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-400">✓</span>
                Unlimited Interview Prep
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-400">✓</span>
                Real-time job API integration
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-400">✓</span>
                Priority support
              </li>
            </ul>

            <button
              onClick={() => handleUpgrade(process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_ID!)}
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-900 shadow-lg shadow-emerald-500/30 hover:bg-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Upgrade to Pro'}
            </button>
          </div>
        </div>

        <div className="text-center text-xs text-slate-500">
          Secure payments powered by Stripe. Cancel anytime.
        </div>
      </div>
    </div>
  );
}
