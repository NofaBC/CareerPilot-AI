'use client';

import { useState } from 'react';
import { generateProfile } from '@/app/api/profile/client';

interface ProfileFormProps {
  userId: string;
  profile: any;
  onProfileUpdate: () => void;
}

export function ProfileForm({ userId, profile, onProfileUpdate }: ProfileFormProps) {
  const [formData, setFormData] = useState({
    name: profile?.name || '',
    email: profile?.email || '',
    jobTitleTarget: profile?.jobTitleTarget || '',
    industry: profile?.industry || '',
    salaryRange: profile?.salaryRange || '',
    locationPreference: profile?.locationPreference || '',
    workMode: profile?.workMode || 'Any',
    resumeText: profile?.resumeText || '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await generateProfile({
        userId,
        ...formData,
      });
      onProfileUpdate();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Profile generation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 backdrop-blur-sm p-4 sm:p-5 space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-base sm:text-lg font-semibold text-slate-50 flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-emerald-500/15 border border-emerald-400/40 text-emerald-300 text-xs font-bold">
            1
          </span>
          Build Your Career Profile
        </h2>
        <span className="text-[11px] text-slate-400 hidden sm:inline">
          AI-powered optimization
        </span>
      </div>

      {error && (
        <div className="rounded-lg border border-red-400/30 bg-red-500/10 p-2 text-xs text-red-200">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label htmlFor="user-name" className="block text-xs font-medium text-slate-300">
              Full Name
            </label>
            <input
              id="user-name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              placeholder="e.g., Sarah Johnson"
              required
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="user-email" className="block text-xs font-medium text-slate-300">
              Email (for auto-apply)
            </label>
            <input
              id="user-email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              placeholder="you@email.com"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="space-y-1">
            <label htmlFor="user-role" className="block text-xs font-medium text-slate-300">
              Target Role
            </label>
            <input
              id="user-role"
              type="text"
              value={formData.jobTitleTarget}
              onChange={(e) => setFormData({ ...formData, jobTitleTarget: e.target.value })}
              className="w-full rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              placeholder="Product Manager, Data Analyst..."
              required
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="user-industry" className="block text-xs font-medium text-slate-300">
              Industry / Domain
            </label>
            <input
              id="user-industry"
              type="text"
              value={formData.industry}
              onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
              className="w-full rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              placeholder="Tech, Healthcare, Finance..."
              required
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="user-salary" className="block text-xs font-medium text-slate-300">
              Target Salary Range
            </label>
            <input
              id="user-salary"
              type="text"
              value={formData.salaryRange}
              onChange={(e) => setFormData({ ...formData, salaryRange: e.target.value })}
              className="w-full rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              placeholder="$90k – $120k"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label htmlFor="user-location" className="block text-xs font-medium text-slate-300">
              Preferred Location(s)
            </label>
            <input
              id="user-location"
              type="text"
              value={formData.locationPreference}
              onChange={(e) => setFormData({ ...formData, locationPreference: e.target.value })}
              className="w-full rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              placeholder="Remote, DC/MD/VA, etc."
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="user-mode" className="block text-xs font-medium text-slate-300">
              Work Mode
            </label>
            <select
              id="user-mode"
              value={formData.workMode}
              onChange={(e) => setFormData({ ...formData, workMode: e.target.value })}
              className="w-full rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="Any">Any (Hybrid/Remote/On-site)</option>
              <option value="Remote">Remote only</option>
              <option value="Hybrid">Hybrid preferred</option>
              <option value="On-site">On-site preferred</option>
            </select>
          </div>
        </div>

        <div className="space-y-1">
          <label htmlFor="user-resume" className="block text-xs font-medium text-slate-300">
            Paste Resume or LinkedIn-Style Bio
          </label>
          <textarea
            id="user-resume"
            rows={6}
            value={formData.resumeText}
            onChange={(e) => setFormData({ ...formData, resumeText: e.target.value })}
            className="w-full rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-2 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            placeholder="Paste your resume text or a summary of your experience. For best results, include 3-5 bullet points with your key achievements."
            required
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex flex-wrap gap-2">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 text-xs sm:text-sm font-semibold text-slate-900 shadow-lg shadow-emerald-500/30 hover:bg-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:opacity-50"
            >
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-slate-700 border-t-emerald-500 rounded-full animate-spin"></span>
                  Processing...
                </span>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M5 12h14M12 5v14" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Generate Profile & Skills
                </>
              )}
            </button>
          </div>
          <p className="text-[11px] text-slate-400">
            AI processing uses 1 profile generation credit
          </p>
        </div>
      </form>
    </div>
  );
}
