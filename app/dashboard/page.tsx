'use client';

import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ProfileForm } from '@/components/dashboard/ProfileForm';
import { ProfileSummary } from '@/components/dashboard/ProfileSummary';
import { SkillsChips } from '@/components/dashboard/SkillsChips';
import { JobMatchList } from '@/components/dashboard/JobMatchList';
import { InterviewPrepPanel } from '@/components/dashboard/InterviewPrepPanel';
import { UsageMeter } from '@/components/dashboard/UsageMeter';
import { getUserProfile } from '@/lib/firestore';
import type { Profile } from '@/lib/types';

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }

    if (user) {
      loadProfile();
    }
  }, [user, authLoading, router]);

  const loadProfile = async () => {
    try {
      const userProfile = await getUserProfile(user!.uid);
      setProfile(userProfile);
    } catch (error) {
      console.error('Failed to load profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-slate-400">Loading dashboard...</div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Demo Banner - Update based on plan */}
      <div className="bg-amber-500/10 border-b border-amber-400/30 text-amber-100">
        <div className="max-w-6xl mx-auto px-4 py-2 text-xs sm:text-sm flex items-center justify-between gap-2">
          <span className="font-medium tracking-wide">
            {profile?.subscriptionStatus === 'active' ? '🚀 Pro Plan Active' : '🆓 Starter Plan - Limited actions'}
          </span>
          <span className="hidden sm:inline-flex items-center gap-1 text-amber-200/90">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            AI-Powered SaaS
          </span>
        </div>
      </div>

      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 py-8 sm:py-10 space-y-8">
          {/* Hero */}
          <section className="flex flex-col lg:flex-row lg:items-center gap-6">
            <div className="flex-1 space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-200 mb-2">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                CareerPilot AI™ Dashboard
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-slate-50">
                Welcome back, <span className="text-emerald-300">{profile?.name || user.email?.split('@')[0]}</span>
              </h1>

              <p className="text-sm sm:text-base text-slate-300 max-w-xl">
                Your AI career assistant is ready. Build your profile, discover matches, and accelerate your job search.
              </p>

              <UsageMeter userId={user.uid} />
            </div>

            {/* Quick Actions */}
            <div className="w-full lg:w-80">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 shadow-2xl shadow-emerald-500/20 p-4 space-y-3">
                <h2 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-400/60">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-emerald-300" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M12 5v14M5 12h14" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                  Quick Actions
                </h2>
                <div className="flex flex-wrap gap-2">
                  <Link href="/billing" className="text-xs px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800/50 hover:bg-slate-700/50">
                    💳 Manage Billing
                  </Link>
                  <button 
                    onClick={() => router.push('/login')}
                    className="text-xs px-3 py-1.5 rounded-lg border border-red-400/30 bg-red-500/10 text-red-200 hover:bg-red-500/20"
                  >
                    🚪 Sign Out
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Main Grid */}
          <section className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,1.1fr)] gap-6">
            {/* LEFT: Profile */}
            <div className="space-y-4">
              <ProfileForm 
                userId={user.uid} 
                profile={profile} 
                onProfileUpdate={loadProfile}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ProfileSummary profile={profile} />
                <SkillsChips profile={profile} />
              </div>
            </div>

            {/* RIGHT: Jobs & Interview Prep */}
            <div className="space-y-4">
              <JobMatchList userId={user.uid} profile={profile} />
              <InterviewPrepPanel profile={profile} />
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/80">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] sm:text-xs text-slate-500">
          <span>CareerPilot AI™ – SaaS MVP v1.0</span>
          <span className="flex items-center gap-1">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Brick-by-brick: Production-ready
          </span>
        </div>
      </footer>
    </div>
  );
}
