'use client';

import { useState } from 'react';
import { generateInterviewPrep } from '@/app/api/interview-prep/client';
import type { Profile, JobMatch } from '@/lib/types';

interface InterviewPrepPanelProps {
  profile: Profile | null;
}

export function InterviewPrepPanel({ profile }: InterviewPrepPanelProps) {
  const [selectedJob, setSelectedJob] = useState<JobMatch | null>(null);
  const [questions, setQuestions] = useState<string[]>([]);
  const [tips, setTips] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // This would be connected to the selected job from JobMatchList
  // For now, we'll use a simple input to select a job title
  const [jobTitle, setJobTitle] = useState('');

  const handlePrepInterview = async () => {
    if (!profile) {
      alert('Please complete your profile first');
      return;
    }

    if (!jobTitle.trim()) {
      alert('Please enter a job title to prepare for');
      return;
    }

    setLoading(true);
    try {
      const prep = await generateInterviewPrep({
        userId: profile.userId,
        job: {
          title: jobTitle,
          company: 'Selected Company',
          summary: 'Target role for interview preparation',
        } as JobMatch,
        profile,
      });

      setQuestions(prep.questions);
      setTips(prep.tips);
    } catch (err) {
      alert('Failed to generate interview prep: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 sm:p-5 space-y-4">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-base sm:text-lg font-semibold text-slate-50 flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-violet-500/15 border border-violet-400/40 text-violet-300 text-xs font-bold">
            3
          </span>
          Interview Prep
        </h2>
        <button
          onClick={handlePrepInterview}
          disabled={loading}
          className="inline-flex items-center gap-1.5 rounded-lg border border-violet-400/40 bg-violet-500/10 px-3 py-1.5 text-[11px] font-medium text-violet-100 hover:bg-violet-500/15 disabled:opacity-50"
        >
          {loading ? 'Generating...' : 'Prep Mock Interview'}
        </button>
      </div>

      <div className="space-y-2">
        <label className="block text-xs font-medium text-slate-300">
          Job Title to Prepare For
        </label>
        <input
          type="text"
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
          className="w-full rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          placeholder="e.g., Senior Product Manager"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1.15fr)_minmax(0,0.9fr)] gap-4">
        {/* Questions */}
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-semibold text-slate-100">
              Likely Interview Questions
            </h3>
            <span className="text-[11px] text-slate-400">
              {selectedJob ? `${selectedJob.title} @ ${selectedJob.company}` : 'No job selected'}
            </span>
          </div>
          <ul className="text-xs sm:text-[13px] text-slate-300 space-y-1.5 max-h-[180px] overflow-y-auto pr-1 list-disc list-inside">
            {questions.length > 0 ? (
              questions.map((q, idx) => <li key={idx}>{q}</li>)
            ) : (
              <li className="text-slate-500">
                Enter a job title above and click "Prep Mock Interview" to generate tailored questions.
              </li>
            )}
          </ul>
        </div>

        {/* Tips */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-slate-100">
            Coaching Tips
          </h3>
          <ul className="text-xs sm:text-[13px] text-slate-300 space-y-1.5 max-h-[180px] overflow-y-auto pr-1 list-disc list-inside">
            {tips.length > 0 ? (
              tips.map((t, idx) => <li key={idx}>{t}</li>)
            ) : (
              <>
                <li className="text-slate-500">
                  In the real build, CareerPilot AI™ will research the company and role.
                </li>
                <li className="text-slate-500">
                  Use mock interviews to practice out loud and track improvement.
                </li>
              </>
            )}
          </ul>
        </div>
      </div>

      <p className="text-[11px] text-slate-400 pt-1 border-t border-slate-800 mt-1">
        No live AI during the real interview. CareerPilot AI™ prepares you before the call; the answers during the interview are always yours.
      </p>
    </div>
  );
}
