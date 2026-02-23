'use client';

import { useEffect } from 'react';
import { useAuth } from '@/lib/auth-hooks';
import { Settings, CreditCard, Bell, Shield, HelpCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function SettingsPage() {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      window.location.href = '/login';
    }
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <p className="text-slate-400">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200">
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full"></div>

      <div className="max-w-4xl mx-auto p-8 relative z-10">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center text-slate-400 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center">
            <Settings className="w-8 h-8 mr-3 text-blue-400" />
            Settings
          </h1>
          <p className="text-slate-400">Manage your account preferences and billing</p>
        </div>

        {/* Coming Soon Cards */}
        <div className="space-y-4">
          {/* Billing & Subscription */}
          <div className="bg-slate-900/40 backdrop-blur-md p-6 rounded-2xl border border-white/5">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <div className="bg-blue-500/20 p-3 rounded-xl">
                  <CreditCard className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-1">Billing & Subscription</h3>
                  <p className="text-slate-400 text-sm mb-3">
                    Manage your subscription plan, payment methods, and billing history
                  </p>
                  <span className="inline-block px-3 py-1 bg-yellow-500/10 text-yellow-400 text-xs font-medium rounded-full border border-yellow-500/20">
                    Coming Soon with Stripe Integration
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-slate-900/40 backdrop-blur-md p-6 rounded-2xl border border-white/5">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <div className="bg-purple-500/20 p-3 rounded-xl">
                  <Bell className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-1">Notifications</h3>
                  <p className="text-slate-400 text-sm mb-3">
                    Configure email and push notifications for job matches, applications, and interviews
                  </p>
                  <span className="inline-block px-3 py-1 bg-yellow-500/10 text-yellow-400 text-xs font-medium rounded-full border border-yellow-500/20">
                    Coming Soon
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Privacy & Security */}
          <div className="bg-slate-900/40 backdrop-blur-md p-6 rounded-2xl border border-white/5">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <div className="bg-green-500/20 p-3 rounded-xl">
                  <Shield className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-1">Privacy & Security</h3>
                  <p className="text-slate-400 text-sm mb-3">
                    Control your data privacy settings and account security preferences
                  </p>
                  <span className="inline-block px-3 py-1 bg-yellow-500/10 text-yellow-400 text-xs font-medium rounded-full border border-yellow-500/20">
                    Coming Soon
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Help & Support */}
          <div className="bg-slate-900/40 backdrop-blur-md p-6 rounded-2xl border border-white/5">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <div className="bg-indigo-500/20 p-3 rounded-xl">
                  <HelpCircle className="w-6 h-6 text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-1">Help & Support</h3>
                  <p className="text-slate-400 text-sm mb-3">
                    Access documentation, FAQs, and contact support team
                  </p>
                  <span className="inline-block px-3 py-1 bg-yellow-500/10 text-yellow-400 text-xs font-medium rounded-full border border-yellow-500/20">
                    Coming Soon
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Account Info */}
        <div className="mt-8 bg-slate-900/40 backdrop-blur-md p-6 rounded-2xl border border-white/5">
          <h3 className="text-lg font-semibold text-white mb-4">Account Information</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-white/5">
              <span className="text-slate-400">Email</span>
              <span className="text-white font-medium">{user.email}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-white/5">
              <span className="text-slate-400">Account Created</span>
              <span className="text-white font-medium">
                {user.metadata.creationTime 
                  ? new Date(user.metadata.creationTime).toLocaleDateString()
                  : 'N/A'}
              </span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-slate-400">User ID</span>
              <span className="text-slate-500 text-sm font-mono">{user.uid}</span>
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-8 bg-blue-500/10 border border-blue-500/20 p-6 rounded-2xl">
          <div className="flex items-start space-x-3">
            <div className="text-blue-400 mt-0.5">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-blue-200">
                <strong className="font-semibold">Beta Access:</strong> You're using CareerPilot AI MVP.
                Additional settings features (including billing and subscriptions) will be available after
                Stripe integration is complete.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
