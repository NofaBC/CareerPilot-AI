import { NextResponse } from 'next/server';
import { ScoringService, JobPosting } from '../../lib/scoring-service';

const JSEARCH_API_KEY = process.env.JSEARCH_API_KEY;
const SERPAPI_API_KEY = process.env.SERPAPI_API_KEY;

export async function POST(req: Request) {
  try {
    const { profile, query, location } = await req.json();
    let debugInfo: any = { jsearch: 'Not attempted', serpapi: 'Not attempted' };

    // 1. Test JSearch
    let jsearchJobs = [];
    if (JSEARCH_API_KEY) {
      try {
        const res = await fetch(`https://jsearch.p.rapidapi.com/search?query=${encodeURIComponent(query )}&location=${encodeURIComponent(location)}`, {
          headers: { 'X-RapidAPI-Key': JSEARCH_API_KEY, 'X-RapidAPI-Host': 'jsearch.p.rapidapi.com' }
        });
        const data = await res.json();
        if (data.data) {
          jsearchJobs = data.data;
          debugInfo.jsearch = `Success: Found ${jsearchJobs.length} jobs`;
        } else {
          debugInfo.jsearch = `Error: ${data.message || 'Unknown JSearch error'}`;
        }
      } catch (e: any) { debugInfo.jsearch = `Fetch Failed: ${e.message}`; }
    } else { debugInfo.jsearch = 'Missing JSEARCH_API_KEY'; }

    // 2. Test SerpAPI
    let serpapiJobs = [];
    if (SERPAPI_API_KEY) {
      try {
        const res = await fetch(`https://serpapi.com/search?engine=google_jobs&q=${encodeURIComponent(query )}&location=${encodeURIComponent(location)}&api_key=${SERPAPI_API_KEY}`);
        const data = await res.json();
        if (data.jobs_results) {
          serpapiJobs = data.jobs_results.map((j: any) => ({
            job_id: j.job_id, job_title: j.title, company_name: j.company_name, job_description: j.description, job_city: j.location
          }));
          debugInfo.serpapi = `Success: Found ${serpapiJobs.length} jobs`;
        } else {
          debugInfo.serpapi = `Error: ${data.error || 'Unknown SerpAPI error'}`;
        }
      } catch (e: any) { debugInfo.serpapi = `Fetch Failed: ${e.message}`; }
    } else { debugInfo.serpapi = 'Missing SERPAPI_API_KEY'; }

    // 3. Combine & Score
    const rawJobs = [...jsearchJobs, ...serpapiJobs];
    
    // If NO jobs found, return the debug info so we can see why
    if (rawJobs.length === 0) {
      return NextResponse.json({ success: false, message: "No jobs found", debug: debugInfo });
    }

    const scoredJobs = rawJobs.map((job: any) => {
      const posting: JobPosting = {
        id: job.job_id, title: job.job_title, description: job.job_description,
        requiredSkills: profile.skills || [], location: job.job_city || job.location
      };
      const fit = ScoringService.calculateFitScore(profile, posting);
      return { ...job, fitScore: fit.score, fitExplanation: fit.explanation };
    });

    return NextResponse.json({ success: true, jobs: scoredJobs.sort((a, b) => b.fitScore - a.fitScore) });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
