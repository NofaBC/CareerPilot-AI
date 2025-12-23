'use client';

import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';

export default function LandingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-slate-400">Loading...</div>
      </div>
    );
  }

  if (user) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Demo Banner */}
      <div className="bg-amber-500/10 border-b border-amber-400/30 text-amber-100">
        <div className="max-w-6xl mx-auto px-4 py-2 text-xs sm:text-sm flex items-center justify-between gap-2">
          <span className="font-medium tracking-wide">
            Demo Mode: Try the full SaaS version with real AI, job APIs & billing
          </span>
          <span className="hidden sm:inline-flex items-center gap-1 text-amber-200/90">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            SaaS MVP Ready
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
                New: CareerPilot AI™ – Autonomous Job Hunt Agent
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-slate-50">
                Put your <span className="text-emerald-300">job search</span> on autopilot.
              </h1>

              <p className="text-sm sm:text-base text-slate-300 max-w-xl">
                CareerPilot AI™ turns your resume, skills, and target role into a guided job-hunt engine:
                build your profile, scan for matching roles, draft applications, and prepare for interviews –
                all from one intelligent dashboard.
              </p>

              <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm">
                <div className="flex items-center gap-2 text-slate-300">
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-emerald-500/15 border border-emerald-400/40 text-emerald-300 text-xs font-semibold">
                    1
                  </span>
                  <span>Paste your resume or bio</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-emerald-500/15 border border-emerald-400/40 text-emerald-300 text-xs font-semibold">
                    2
                  </span>
                  <span>Generate profile & job matches</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-emerald-500/15 border border-emerald-400/40 text-emerald-300 text-xs font-semibold">
                    3
                  </span>
                  <span>Queue applications & prep interviews</span>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Link
                  href="/signup"
                  className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-6 py-3 text-sm font-semibold text-slate-900 shadow-lg shadow-emerald-500/30 hover:bg-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  Start Free Trial
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-600 px-6 py-3 text-sm font-medium text-slate-200 hover:bg-slate-800/50"
                >
                  Sign In
                </Link>
              </div>
            </div>

            {/* Side Card: How It Works */}
            <div className="w-full lg:w-80">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 shadow-2xl shadow-emerald-500/20 p-4 space-y-3">
                <h2 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-400/60">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-emerald-300" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M12 5v14M5 12h14" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                  CareerPilot Flow – v1.0 (SaaS MVP)
                </h2>
                <ol className="text-xs text-slate-300 space-y-1.5 list-decimal list-inside">
                  <li>Create account & set job preferences</li>
                  <li>AI extracts skills & generates profile summary</li>
                  <li>Real-time job matching from multiple sources</li>
                  <li>Draft applications & generate interview prep</li>
                  <li>Track progress with usage limits & upgrade when ready</li>
                </ol>
                <p className="text-[11px] text-slate-400">
                  Powered by OpenAI, Firebase, Stripe & Vercel. Real job APIs, email automation & calendar integrations included.
                </p>
              </div>
            </div>
          </section>

          {/* Features Grid */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 space-y-2">
              <h3 className="text-sm font-semibold text-slate-100">AI Profile Builder</h3>
              <p className="text-xs text-slate-400">
                Transform your resume into a compelling professional narrative with AI-powered parsing and optimization.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 space-y-2">
              <h3 className="text-sm font-semibold text-slate-100">Smart Job Matching</h3>
              <p className="text-xs text-slate-400">
                Get ranked job recommendations based on your skills, preferences, and market fit scores.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 space-y-2">
              <h3 className="text-sm font-semibold text-slate-100">Interview Prep</h3>
              <p className="text-xs text-slate-400">
                Generate company-specific interview questions and coaching tips tailored to each role.
              </p>
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
            Built brick-by-brick for production
          </span>
        </div>
      </footer>
    </div>
  );
}
