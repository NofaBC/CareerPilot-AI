import { JobMatch } from './types';

export async function findJobMatches(preferences: {
  jobTitleTarget: string;
  industry: string;
  locationPreference?: string;
  workMode: string;
  skills: string[];
}): Promise<JobMatch[]> {
  // For MVP: Return stubbed matches
  // In production, integrate with:
  // - LinkedIn Jobs API
  // - Indeed API
  // - Greenhouse / Lever
  // - Google Jobs API
  // - Jooble API

  const { jobTitleTarget, industry, locationPreference, workMode } = preferences;

  return [
    {
      id: `job_${Date.now()}_1`,
      title: `${jobTitleTarget} – Growth Track`,
      company: 'SignalPath Labs',
      location: locationPreference || 'Remote',
      mode: workMode === 'Any' ? 'Remote / Hybrid' : workMode,
      salary: '$95k – $130k',
      score: 93,
      summary: `High-impact ${jobTitleTarget} role in fast-growing ${industry} team. Emphasis on measurable outcomes and cross-functional collaboration.`,
      sourceUrl: 'https://example.com/job1',
    },
    {
      id: `job_${Date.now()}_2`,
      title: `Associate ${jobTitleTarget}`,
      company: 'NorthBridge Partners',
      location: locationPreference || 'New York, NY',
      mode: workMode === 'Any' ? 'Hybrid' : workMode,
      salary: '$85k – $110k',
      score: 87,
      summary: `Supporting role for candidates transitioning into ${industry}. Strong mentorship and clear career ladder.`,
      sourceUrl: 'https://example.com/job2',
    },
    {
      id: `job_${Date.now()}_3`,
      title: `${jobTitleTarget} (Remote-First)`,
      company: 'AuroraFlow',
      location: 'Remote – US',
      mode: 'Remote',
      salary: '$100k – $140k',
      score: 90,
      summary: `Remote-first ${industry} company seeking independent, self-managed ${jobTitleTarget.toLowerCase()}.`,
      sourceUrl: 'https://example.com/job3',
    },
  ];
}
