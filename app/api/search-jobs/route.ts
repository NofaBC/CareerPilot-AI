import { NextResponse } from 'next/server';
import { ScoringService, JobPosting } from '@/app/lib/scoring-service';

const JSEARCH_API_KEY = process.env.JSEARCH_API_KEY;
const SERPAPI_API_KEY = process.env.SERPAPI_API_KEY;

export async function POST(req: Request) {
  try {
    const { profile, query, location } = await req.json();

    // 1. Fetch from JSearch
    let jsearchJobs = [];
    if (JSEARCH_API_KEY) {
      const res = await fetch(`https://jsearch.p.rapidapi.com/search?query=${encodeURIComponent(query )}&location=${encodeURIComponent(location)}`, {
        headers: { 'X-RapidAPI-Key': JSEARCH_API_KEY, 'X-RapidAPI-Host': 'jsearch.p.rapidapi.com' }
      });
      const data = await res.json();
      jsearchJobs = data.data || [];
    }

    // 2. Fetch from SerpAPI
    let serpapiJobs = [];
    if (SERPAPI_API_KEY) {
      const res = await fetch(`https://serpapi.com/search?engine=google_jobs&q=${encodeURIComponent(query )}&location=${encodeURIComponent(location)}&api_key=${SERPAPI_API_KEY}`);
      const data = await res.json();
      serpapiJobs = (data.jobs_results || []).map((j: any) => ({
        job_id: j.job_id,
        job_title: j.title,
        company_name: j.company_name,
        job_description: j.description,
        job_city: j.location,
      }));
    }

    // 3. Combine & Score
    const rawJobs = [...jsearchJobs, ...serpapiJobs];
    const scoredJobs = rawJobs.map((job: any) => {
      const posting: JobPosting = {
        id: job.job_id,
        title: job.job_title,
        description: job.job_description,
        requiredSkills: ['nursing', 'leadership', 'acute care'], // Simplified for POC
        location: job.job_city || job.location
      };
      const fit = ScoringService.calculateFitScore(profile, posting);
      return { ...job, fitScore: fit.score, fitExplanation: fit.explanation, fitBreakdown: fit.breakdown };
    });

    return NextResponse.json({ success: true, jobs: scoredJobs.sort((a, b) => b.fitScore - a.fitScore) });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
