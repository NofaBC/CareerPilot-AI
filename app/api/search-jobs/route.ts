/**
 * CareerPilot AI™: /api/search-jobs Endpoint
 * 
 * This endpoint integrates with the JSearch API to fetch live jobs and 
 * uses the ScoringService to provide AI-driven fit scores.
 */

import { NextResponse } from 'next/server';
import { ScoringService, UserProfile, JobPosting } from '@/app/lib/scoring-service';

// Ensure these are set in your .env.local or Vercel environment variables
const JSEARCH_API_KEY = process.env.JSEARCH_API_KEY;
const JSEARCH_API_URL = 'https://jsearch.p.rapidapi.com/search';

export async function POST(req: Request ) {
  try {
    const body = await req.json();
    const { profile, query, location } = body;

    if (!profile) {
      return NextResponse.json({ message: 'User profile is required for matching' }, { status: 400 });
    }

    // 1. Fetch Jobs from JSearch API via RapidAPI
    const response = await fetch(`${JSEARCH_API_URL}?query=${encodeURIComponent(query || profile.targetRoles[0])}&location=${encodeURIComponent(location || profile.locationPreference)}&num_pages=1`, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': JSEARCH_API_KEY || '',
        'X-RapidAPI-Host': 'jsearch.p.rapidapi.com'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch jobs from JSearch API');
    }

    const data = await response.json();
    const rawJobs = data.data || [];

    // 2. Process and Score each job using the ScoringService
    const scoredJobs = rawJobs.map((job: any) => {
      const jobPosting: JobPosting = {
        id: job.job_id,
        title: job.job_title,
        description: job.job_description,
        requiredSkills: extractSkillsFromDescription(job.job_description),
        experienceRequired: job.job_required_experience?.no_of_years_experience,
        location: job.job_city || job.job_country || 'Remote'
      };

      const fitResult = ScoringService.calculateFitScore(profile, jobPosting);

      return {
        ...job,
        fitScore: fitResult.score,
        fitExplanation: fitResult.explanation,
        fitBreakdown: fitResult.breakdown
      };
    });

    // 3. Sort by Fit Score (Descending)
    const sortedJobs = scoredJobs.sort((a: any, b: any) => b.fitScore - a.fitScore);

    return NextResponse.json({
      success: true,
      count: sortedJobs.length,
      jobs: sortedJobs
    });

  } catch (error: any) {
    console.error('Job search error:', error);
    return NextResponse.json({ message: 'Internal server error during job search', error: error.message }, { status: 500 });
  }
}

/**
 * Simple skill extraction logic (can be enhanced with LLM/OpenRouter)
 */
function extractSkillsFromDescription(description: string): string[] {
  const commonSkills = [
    'React', 'TypeScript', 'Node.js', 'AWS', 'Python', 'SQL', 'Docker', 
    'JavaScript', 'Next.js', 'Tailwind', 'Firebase', 'Java', 'C#', 'Go'
  ];
  return commonSkills.filter(skill => 
    description.toLowerCase().includes(skill.toLowerCase())
  );
}
