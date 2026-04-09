'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-hooks';
import { ArrowLeft, Check, Zap, CreditCard } from 'lucide-react';
import Link from 'next/link';
import { SUBSCRIPTION_TIERS, CREDIT_TOPUPS } from '@/lib/credits';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function PricingPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async (priceId: string, mode: 'subscription' | 'payment', planName: string) => {
    if (!user) {
      window.location.href = '/login?redirect=/pricing';
      return;
    }

    setLoading(priceId);
    setError(null);

    try {
      // Get Firebase ID token
      const token = await user.getIdToken();

      // Call our API to create checkout session
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          priceId,
          mode,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create checkout session');
      }

      const { url } = await response.json();

      // Redirect to Stripe Checkout
      if (url) {
        window.location.href = url;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (err: any) {
      console.error('Checkout error:', err);
      setError(err.message || 'Something went wrong. Please try again.');
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200">
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full"></div>

      <div className="max-w-7xl mx-auto p-8 relative z-10">
        {/* Header */}
        <div className="mb-12 text-center">
          <Link
            href="/dashboard"
            className="inline-flex items-center text-slate-400 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
          <h1 className="text-5xl font-bold text-white mb-4">Choose Your Plan</h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Premium AI-powered job search. Global reach. Fair pricing.
          </p>
          <div className="flex items-center justify-center gap-6 mt-6 text-sm">
            <span className="flex items-center text-slate-300">
              <Check className="w-4 h-4 mr-2 text-green-400" />
              🌍 Available in 14+ countries
            </span>
            <span className="flex items-center text-slate-300">
              <Check className="w-4 h-4 mr-2 text-green-400" />
              ✅ Cancel anytime
            </span>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8 max-w-2xl mx-auto bg-red-500/10 border border-red-500/20 p-4 rounded-xl">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Subscription Plans */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">Monthly Subscriptions</h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* Free Tier */}
            <div className="bg-slate-900/40 backdrop-blur-md p-8 rounded-2xl border border-white/10">
              <h3 className="text-2xl font-bold text-white mb-2">{SUBSCRIPTION_TIERS.free.name}</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-white">${SUBSCRIPTION_TIERS.free.price}</span>
                <span className="text-slate-400">/month</span>
              </div>
              <p className="text-slate-400 mb-6">{SUBSCRIPTION_TIERS.free.description}</p>
              <ul className="space-y-3 mb-8">
                {SUBSCRIPTION_TIERS.free.features.map((feature, i) => (
                  <li key={i} className="flex items-start text-sm">
                    <Check className="w-4 h-4 mr-2 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-300">{feature}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/signup"
                className="block w-full py-3 px-4 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-semibold text-center transition-colors"
              >
                Get Started Free
              </Link>
            </div>

            {/* Starter Tier */}
            <div className="bg-slate-900/40 backdrop-blur-md p-8 rounded-2xl border border-blue-500/50 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                POPULAR
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">{SUBSCRIPTION_TIERS.starter.name}</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-white">${SUBSCRIPTION_TIERS.starter.price}</span>
                <span className="text-slate-400">/month</span>
              </div>
              <p className="text-slate-400 mb-6">{SUBSCRIPTION_TIERS.starter.description}</p>
              <ul className="space-y-3 mb-8">
                {SUBSCRIPTION_TIERS.starter.features.map((feature, i) => (
                  <li key={i} className="flex items-start text-sm">
                    <Check className="w-4 h-4 mr-2 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-300">{feature}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleCheckout(SUBSCRIPTION_TIERS.starter.stripePriceId, 'subscription', 'Starter')}
                disabled={loading === SUBSCRIPTION_TIERS.starter.stripePriceId}
                className="w-full py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading === SUBSCRIPTION_TIERS.starter.stripePriceId ? 'Loading...' : 'Subscribe Now'}
              </button>
            </div>

            {/* Pro Tier */}
            <div className="bg-slate-900/40 backdrop-blur-md p-8 rounded-2xl border border-white/10">
              <h3 className="text-2xl font-bold text-white mb-2">{SUBSCRIPTION_TIERS.pro.name}</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-white">${SUBSCRIPTION_TIERS.pro.price}</span>
                <span className="text-slate-400">/month</span>
              </div>
              <p className="text-slate-400 mb-6">{SUBSCRIPTION_TIERS.pro.description}</p>
              <ul className="space-y-3 mb-8">
                {SUBSCRIPTION_TIERS.pro.features.map((feature, i) => (
                  <li key={i} className="flex items-start text-sm">
                    <Check className="w-4 h-4 mr-2 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-300">{feature}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleCheckout(SUBSCRIPTION_TIERS.pro.stripePriceId, 'subscription', 'Pro')}
                disabled={loading === SUBSCRIPTION_TIERS.pro.stripePriceId}
                className="w-full py-3 px-4 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading === SUBSCRIPTION_TIERS.pro.stripePriceId ? 'Loading...' : 'Subscribe Now'}
              </button>
            </div>
          </div>
        </div>

        {/* Credit Top-Ups */}
        <div>
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">Credit Top-Ups</h2>
            <p className="text-slate-400">Need more credits? Purchase one-time top-ups (no monthly reset).</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* Small Pack */}
            <div className="bg-slate-900/40 backdrop-blur-md p-6 rounded-2xl border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">{CREDIT_TOPUPS.small.name}</h3>
                <Zap className="w-6 h-6 text-yellow-400" />
              </div>
              <div className="mb-4">
                <span className="text-3xl font-bold text-white">${CREDIT_TOPUPS.small.price}</span>
              </div>
              <p className="text-slate-400 mb-4">
                {CREDIT_TOPUPS.small.credits} credits • ${CREDIT_TOPUPS.small.pricePerCredit.toFixed(3)}/credit
              </p>
              <p className="text-sm text-slate-500 mb-6">{CREDIT_TOPUPS.small.bestFor}</p>
              <button
                onClick={() => handleCheckout(CREDIT_TOPUPS.small.stripePriceId, 'payment', 'Small Pack')}
                disabled={loading === CREDIT_TOPUPS.small.stripePriceId}
                className="w-full py-3 px-4 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                <CreditCard className="w-4 h-4 mr-2" />
                {loading === CREDIT_TOPUPS.small.stripePriceId ? 'Loading...' : 'Buy Now'}
              </button>
            </div>

            {/* Medium Pack */}
            <div className="bg-slate-900/40 backdrop-blur-md p-6 rounded-2xl border border-green-500/30">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">{CREDIT_TOPUPS.medium.name}</h3>
                <div className="flex items-center">
                  <Zap className="w-6 h-6 text-yellow-400" />
                  <Zap className="w-6 h-6 text-yellow-400 -ml-2" />
                </div>
              </div>
              <div className="mb-4">
                <span className="text-3xl font-bold text-white">${CREDIT_TOPUPS.medium.price}</span>
                <span className="ml-2 text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">
                  {CREDIT_TOPUPS.medium.savings}
                </span>
              </div>
              <p className="text-slate-400 mb-4">
                {CREDIT_TOPUPS.medium.credits} credits • ${CREDIT_TOPUPS.medium.pricePerCredit.toFixed(3)}/credit
              </p>
              <p className="text-sm text-slate-500 mb-6">{CREDIT_TOPUPS.medium.bestFor}</p>
              <button
                onClick={() => handleCheckout(CREDIT_TOPUPS.medium.stripePriceId, 'payment', 'Medium Pack')}
                disabled={loading === CREDIT_TOPUPS.medium.stripePriceId}
                className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                <CreditCard className="w-4 h-4 mr-2" />
                {loading === CREDIT_TOPUPS.medium.stripePriceId ? 'Loading...' : 'Buy Now'}
              </button>
            </div>

            {/* Large Pack */}
            <div className="bg-slate-900/40 backdrop-blur-md p-6 rounded-2xl border border-purple-500/50 relative">
              <div className="absolute -top-3 right-4 bg-purple-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                {CREDIT_TOPUPS.large.badge}
              </div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">{CREDIT_TOPUPS.large.name}</h3>
                <div className="flex items-center">
                  <Zap className="w-6 h-6 text-yellow-400" />
                  <Zap className="w-6 h-6 text-yellow-400 -ml-2" />
                  <Zap className="w-6 h-6 text-yellow-400 -ml-2" />
                </div>
              </div>
              <div className="mb-4">
                <span className="text-3xl font-bold text-white">${CREDIT_TOPUPS.large.price}</span>
                <span className="ml-2 text-xs bg-purple-500/20 text-purple-400 px-2 py-1 rounded-full">
                  {CREDIT_TOPUPS.large.savings}
                </span>
              </div>
              <p className="text-slate-400 mb-4">
                {CREDIT_TOPUPS.large.credits} credits • ${CREDIT_TOPUPS.large.pricePerCredit.toFixed(3)}/credit
              </p>
              <p className="text-sm text-slate-500 mb-6">{CREDIT_TOPUPS.large.bestFor}</p>
              <button
                onClick={() => handleCheckout(CREDIT_TOPUPS.large.stripePriceId, 'payment', 'Large Pack')}
                disabled={loading === CREDIT_TOPUPS.large.stripePriceId}
                className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                <CreditCard className="w-4 h-4 mr-2" />
                {loading === CREDIT_TOPUPS.large.stripePriceId ? 'Loading...' : 'Buy Now'}
              </button>
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-16 max-w-3xl mx-auto">
          <div className="bg-blue-500/10 border border-blue-500/20 p-6 rounded-2xl">
            <h3 className="text-lg font-semibold text-white mb-4">💡 How Credits Work</h3>
            <ul className="space-y-2 text-sm text-slate-300">
              <li className="flex items-start">
                <Check className="w-4 h-4 mr-2 text-blue-400 mt-0.5 flex-shrink-0" />
                <span><strong>Job Search:</strong> 8 credits per search (get 10 matched jobs with fit scores)</span>
              </li>
              <li className="flex items-start">
                <Check className="w-4 h-4 mr-2 text-blue-400 mt-0.5 flex-shrink-0" />
                <span><strong>AI Cover Letter:</strong> 15 credits (tailored to each job)</span>
              </li>
              <li className="flex items-start">
                <Check className="w-4 h-4 mr-2 text-blue-400 mt-0.5 flex-shrink-0" />
                <span><strong>Interview Practice:</strong> 25 credits (full coaching session)</span>
              </li>
              <li className="flex items-start">
                <Check className="w-4 h-4 mr-2 text-blue-400 mt-0.5 flex-shrink-0" />
                <span><strong>Resume Builder:</strong> Always FREE (unlimited use)</span>
              </li>
            </ul>
            <p className="mt-4 text-xs text-slate-400">
              ⚠️ <strong>Important:</strong> Subscription credits reset monthly and do not roll over. 
              Top-up credits never expire and remain in your account forever.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
