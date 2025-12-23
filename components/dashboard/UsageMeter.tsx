'use client';

import { useEffect, useState } from 'react';
import { getUsage } from '@/lib/firestore';

interface UsageMeterProps {
  userId: string;
}

export function UsageMeter({ userId }: UsageMeterProps) {
  const [usage, setUsage] = useState({
    profileGenerations: 0,
    jobScans: 0,
    applicationDrafts: 0,
    interviewPreps: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsage();
  }, [userId]);

  const loadUsage = async () => {
    try {
      const userUsage = await getUsage(userId);
      setUsage(userUsage);
    } catch (error) {
      console.error('Failed to load usage:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return null;

  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3 text-xs text-slate-400">
      <div className="flex flex-wrap gap-4">
        <span>Profile Generations: {usage.profileGenerations}</span>
        <span>Job Scans: {usage.jobScans}</span>
        <span>Application Drafts: {usage.applicationDrafts}</span>
        <span>Interview Preps: {usage.interviewPreps}</span>
      </div>
    </div>
  );
}
