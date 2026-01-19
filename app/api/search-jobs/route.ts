import { NextResponse } from 'next/server';

// Note: We are temporarily using a simple job object for the sake of testing the API connection.
// The full scoring logic from app/lib/scoring-service.ts will be re-integrated once the API is stable.

const JSEARCH_API_KEY = process.env.JSEARCH_API_KEY;

export async function POST(req: Request) {
  try {
    const { query, location } = await req.json();
    let debug = { jsearch: 'Not attempted' };
    let jobs: any[] = [];

    // JSearch Attempt
    if (JSEARCH_API_KEY) {
      try {
        // *** FIX: Added 'radius=10' to enforce strict location matching (10km radius) ***
        const url = `https://jsearch.p.rapidapi.com/search?query=${encodeURIComponent(query )}&location=${encodeURIComponent(location)}&radius=10&remote_jobs_only=false`;
        
        const res = await fetch(url, {
          headers: { 'X-RapidAPI-Key': JSEARCH_API_KEY, 'X-RapidAPI-Host': 'jsearch.p.rapidapi.com' }
        });
        
        const data = await res.json();
        
        if (data.data) {
          // Map the data and apply a placeholder score for now
          jobs = data.data.map((j: any) => ({ 
            ...j, 
            fit_score: 85, // Placeholder score
            job_title: j.job_title || 'N/A',
            employer_name: j.employer_name || 'Confidential',
            job_city: j.job_city || 'N/A',
            job_state: j.job_state || 'N/A',
            job_apply_link: j.job_apply_link || '#'
          })); 
          debug.jsearch = `Success: Found ${jobs.length} jobs`;
        } else { 
          debug.jsearch = `API Error: ${data.message || 'Unknown'}`; 
        }
      } catch (e: any) { 
        debug.jsearch = `Fetch Failed: ${e.message}`; 
      }
    } else { 
      debug.jsearch = 'Missing JSEARCH_API_KEY in Vercel'; 
    }

    // We only return the debug info if no jobs were found, otherwise we return the jobs
    return NextResponse.json({ 
      success: jobs.length > 0, 
      jobs, 
      debug: jobs.length === 0 ? debug : undefined 
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
