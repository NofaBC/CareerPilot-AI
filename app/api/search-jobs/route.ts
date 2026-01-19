/**
 * CareerPilot AI™: /api/search-jobs Endpoint
 * 
 * This endpoint integrates with JSearch and SerpAPI to fetch live jobs and 
 * uses the ScoringService to provide AI-driven fit scores.
 */

import { NextResponse } from 'next/server';
import { ScoringService, UserProfile, JobPosting } from '@/app/lib/scoring-service';

// Environment Variables
const JSEARCH_API_KEY = process.env.JSEARCH_API_KEY;
const SERPAPI_API_KEY = process.env.SERPAPI_API_KEY;

// API URLs
const JSEARCH_API_URL = 'https://jsearch.p.rapidapi.com/search';
const SERPAPI_URL = 'https://serpapi.com/search';

export async function POST(req: Request ) {
  try {
    const body = await req.json();
    const { profile, query, location } = body;

    if (!profile) {
      return NextResponse.json({ message: 'User profile is required for matching' }, { status: 400 });
    }

    // 1. Fetch Jobs from multiple sources
    const jsearchJobs = await fetchJobsFromJSearch(query, location);
    const serpapiJobs = await fetchJobsFromSerpAPI(query, location);
    
    // Combine and deduplicate jobs (simple deduplication by title/company for POC)
    const allJobsMap = new Map();
    [...jsearchJobs, ...serpapiJobs].forEach(job => {
        const key = `${job.job_title}-${job.company_name}`;
        if (!allJobsMap.has(key)) {
            allJobsMap.set(key, job);
        }
    });
    const rawJobs = Array.from(allJobsMap.values());

    // 2. Process and Score each job using the ScoringService
    const scoredJobs = rawJobs.map((job: any) => {
      const jobPosting: JobPosting = {
        id: job.job_id || job.result_id, // Use appropriate ID
        title: job.job_title,
        description: job.job_description || job.snippet,
        requiredSkills: extractSkillsFromDescription(job.job_description || job.snippet),
        experienceRequired: job.job_required_experience?.no_of_years_experience,
        location: job.job_city || job.job_country || job.location || 'Remote'
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
 * Fetches jobs from JSearch API
 */
async function fetchJobsFromJSearch(query: string, location: string) {
    if (!JSEARCH_API_KEY) return [];
    
    try {
        const response = await fetch(`${JSEARCH_API_URL}?query=${encodeURIComponent(query || '')}&location=${encodeURIComponent(location || '')}&num_pages=1`, {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': JSEARCH_API_KEY || '',
                'X-RapidAPI-Host': 'jsearch.p.rapidapi.com'
            }
        });

        if (!response.ok) {
            console.error('JSearch API Error:', response.statusText);
            return [];
        }

        const data = await response.json();
        return data.data || [];
    } catch (error) {
        console.error('JSearch Fetch Error:', error);
        return [];
    }
}

/**
 * Fetches jobs from SerpAPI (Google Jobs)
 */
async function fetchJobsFromSerpAPI(query: string, location: string) {
    if (!SERPAPI_API_KEY) return [];

    try {
        const params = new URLSearchParams({
            api_key: SERPAPI_API_KEY,
            engine: 'google_jobs',
            q: query,
            location: location,
            hl: 'en',
            gl: 'us'
        });

        const response = await fetch(`${SERPAPI_URL}?${params.toString()}`);

        if (!response.ok) {
            console.error('SerpAPI Error:', response.statusText);
            return [];
        }

        const data = await response.json();
        // Map SerpAPI's job_results structure to be somewhat compatible with JSearch's
        return (data.jobs_results || []).map((job: any) => ({
            job_id: job.job_id,
            job_title: job.title,
            company_name: job.company_name,
            job_description: job.description,
            job_city: job.location,
            job_country: job.detected_extensions?.schedule_type, // Using this field for a placeholder
            job_required_experience: { no_of_years_experience: null }, // Placeholder
            // Add other SerpAPI fields you need
        }));
    } catch (error) {
        console.error('SerpAPI Fetch Error:', error);
        return [];
    }
}

/**
 * Simple skill extraction logic (can be enhanced with LLM)
 */
function extractSkillsFromDescription(description: string): string[] {
  if (!description) return [];
  const commonSkills = [
    'React', 'TypeScript', 'Node.js', 'AWS', 'Python', 'SQL', 'Docker', 
    'JavaScript', 'Next.js', 'Tailwind', 'Firebase', 'Java', 'C#', 'Go'
  ];
  return commonSkills.filter(skill => 
    description.toLowerCase().includes(skill.toLowerCase())
  );
}
