'use client';

import { useState } from 'react';
import { findJobMatches } from '@/app/api/jobmatch/client';
import type { Profile, JobMatch } from '@/lib/types';

interface JobMatchListProps {
  userId: string;
  profile: Profile | null;
}

export function JobMatchList({ userId, profile }: JobMatchListProps) {
  const [jobs, setJobs] = useState<JobMatch[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedJob, setSelectedJob] = useState<JobMatch | null>(null);

  const handleScanJobs = async () => {
    if (!profile) {
      setError('Please complete your profile first');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const matches = await findJobMatches({
        userId,
        preferences: {
          jobTitleTarget: profile.jobTitleTarget,
          industry: profile.industry,
          locationPreference: profile.locationPreference,
          workMode: profile.workMode,
          skills: profile.skills || [],
        },
      });
      setJobs(matches);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to find job matches');
    } finally {
      setLoading(false);
    }
  };

  const generateApplication = async (job: JobMatch) => {
    try {
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          job,
          profile,
        }),
      });

      if (!response.ok) throw new Error('Failed to generate application');

      const { application } = await response.json();
      alert('Application draft generated! Check your applications page.');
    } catch (err) {
      alert('Error generating application: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 sm:p-5 space-y-3">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-base sm:text-lg font-semibold text-slate-50 flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-emerald-500/15 border border-emerald-400/40 text-emerald-300 text-xs font-bold">
            2
          </span>
          JobMatch Engine™
        </h2>
        <span className="text-[11px] text-slate-400">
          {profile?.subscriptionStatus === 'active' ? 'Real job data enabled' : 'Demo mode - Limited scans'}
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={handleScanJobs}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-lg border border-emerald-400/40 bg-emerald-500/5 px-4 py-2 text-xs sm:text-sm font-medium text-emerald-200 hover:bg-emerald-500/10 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:opacity-50"
        >
          {loading ? (
            <span className="inline-flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-slate-700 border-t-emerald-400 rounded-full animate-spin"></span>
              Scanning...
            </span>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="11" cy="11" r="6" strokeWidth="1.8" />
                <path d="m16 16 3.5 3.5" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
              Scan for Job Matches
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="rounded-lg border border-red-400/30 bg-red-500/10 p-2 text-xs text-red-200">
          {error}
        </div>
      )}

      <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
        {jobs.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-700 bg-slate-900/60 p-4 text-xs text-slate-400 text-center">
            Click <span className="text-emerald-300 font-medium">"Scan for Job Matches"</span> to generate job cards
            based on your target role, industry, and location.
          </div>
        ) : (
          jobs.map((job) => (
            <div
              key={job.id}
              className={`w-full text-left rounded-xl border border-slate-800 bg-slate-950/70 px-4 py-3 space-y-1.5 transition hover:border-emerald-500/60 hover:bg-slate-900/80 ${selectedJob?.id === job.id ? 'border-emerald-500/80 bg-slate-900' : ''}`}
              onClick={() => setSelectedJob(job)}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-slate-50">{job.title}</p>
                  <p className="text-xs text-slate-400">{job.company} • {job.location} • {job.mode}</p>
                </div>
                <div className="text-right text-xs">
                  <span className="inline-flex items-center rounded-full bg-emerald-500/10 border border-emerald-400/40 px-2 py-0.5 text-[11px] text-emerald-200">
                    Fit Score: <span className="ml-1 font-semibold">{job.score}%</span>
                  </span>
                  <p className="text-[11px] text-slate-400 mt-1">{job.salary}</p>
                </div>
              </div>
              <p className="text-[11px] text-slate-300 mt-1.5">
                {job.summary}
              </p>
              <div className="flex items-center justify-between mt-2 gap-2">
                <p className="text-[11px] text-slate-500">
                  <a href={job.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline">
                    View original posting
                  </a>
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      generateApplication(job);
                    }}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-400/40 bg-emerald-500/10 px-3 py-1.5 text-[11px] font-medium text-emerald-100 hover:bg-emerald-500/15"
                  >
                    Generate Application
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedJob(job);
                    }}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-violet-400/40 bg-violet-500/10 px-3 py-1.5 text-[11px] font-medium text-violet-100 hover:bg-violet-500/15"
                  >
                    Prep Interview
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
