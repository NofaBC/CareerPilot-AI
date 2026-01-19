import { NextResponse } from 'next/server';
import { ScoringService, JobPosting } from '../../lib/scoring-service';

const JSEARCH_API_KEY = process.env.JSEARCH_API_KEY;
const SERPAPI_API_KEY = process.env.SERPAPI_API_KEY;

export async function POST(req: Request) {
  try {
    // Safety Check 1: Ensure body exists
    const body = await req.json().catch(() => null);
    if (!body || !body.profile) {
      return NextResponse.json({ success: false, message: "Missing profile in request body" }, { status: 400 });
    }

    const { profile, query, location } = body;
    
    // Safety Check 2: Ensure profile fields exist
    const safeProfile = {
      skills: profile.skills || [],
      experienceYears: profile.experienceYears || 0,
      targetRoles: profile.targetRoles || ["Professional"],
      locationPreference: profile.locationPreference || "Remote"
    };

    const searchQuery = query || safeProfile.targetRoles[0] || "Job";
    const searchLocation = location || safeProfile.locationPreference || "";

    console.log(`Searching for ${searchQuery} in ${searchLocation}`);

    // 1. Fetch from JSearch
    let jsearchJobs = [];
    if (JSEARCH_API_KEY) {
      try {
        const res = await fetch(`https://jsearch.p.rapidapi.com/search?query=${encodeURIComponent(searchQuery )}&location=${encodeURIComponent(searchLocation)}`, {
          headers: { 
            'X-RapidAPI-Key': JSEARCH_API_KEY, 
            'X-RapidAPI-Host': 'jsearch.p.rapidapi.com' 
          },
          next: { revalidate: 3600 } // Cache for 1 hour
        });
        const data = await res.json();
        jsearchJobs = data.data || [];
      } catch (e) { console.error("JSearch Fetch Error:", e); }
    }

    // 2. Fetch from SerpAPI
    let serpapiJobs = [];
    if (SERPAPI_API_KEY) {
      try {
        const res = await fetch(`https://serpapi.com/search?engine=google_jobs&q=${encodeURIComponent(searchQuery )}&location=${encodeURIComponent(searchLocation)}&api_key=${SERPAPI_API_KEY}`, {
          next: { revalidate: 3600 }
        });
        const data = await res.json();
        if (data.jobs_results) {
          serpapiJobs = data.jobs_results.map((j: any) => ({
            job_id: j.job_id,
            job_title: j.title,
            company_name: j.company_name,
            job_description: j.description,
            job_city: j.location,
          }));
        }
      } catch (e) { console.error("SerpAPI Fetch Error:", e); }
    }

    const rawJobs = [...jsearchJobs, ...serpapiJobs];

    // 3. Score Jobs
    const scoredJobs = rawJobs.map((job: any) => {
      const posting: JobPosting = {
        id: job.job_id || Math.random().toString(),
        title: job.job_title || "Unknown Title",
        description: job.job_description || "",
        requiredSkills: [], // We can enhance this later
        location: job.job_city || job.location || "Remote"
      };
      const fit = ScoringService.calculateFitScore(safeProfile, posting);
      return {
        ...job,
        fitScore: fit.score,
        fitExplanation: fit.explanation
      };
    });

    return NextResponse.json({ 
      success: true, 
      jobs: scoredJobs.sort((a, b) => b.fitScore - a.fitScore).slice(0, 20) 
    });

  } catch (error: any) {
    console.error("CRITICAL API ERROR:", error);
    return NextResponse.json({ 
      success: false, 
      message: "Internal Server Error", 
      error: error.message 
    }, { status: 500 });
  }
}
