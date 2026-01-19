import { NextResponse } from 'next/server';
import { ScoringService, JobPosting } from '../../lib/scoring-service';

const JSEARCH_API_KEY = process.env.JSEARCH_API_KEY;
const SERPAPI_API_KEY = process.env.SERPAPI_API_KEY;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { profile, query, location } = body;
    
    let debugInfo: any = { jsearch: 'Not attempted', serpapi: 'Not attempted' };

    // 1. Test JSearch
    let jsearchJobs = [];
    if (JSEARCH_API_KEY) {
      try {
        const res = await fetch(`https://jsearch.p.rapidapi.com/search?query=${encodeURIComponent(query )}&location=${encodeURIComponent(location)}`, {
          headers: { 
            'X-RapidAPI-Key': JSEARCH_API_KEY, 
            'X-RapidAPI-Host': 'jsearch.p.rapidapi.com' 
          }
        });
        const data = await res.json();
        if (data.data) {
          jsearchJobs = data.data;
          debugInfo.jsearch = `Success: Found ${jsearchJobs.length} jobs`;
        } else {
          debugInfo.jsearch = `API Error: ${data.message || 'Unknown error'}`;
        }
      } catch (e: any) { debugInfo.jsearch = `Fetch Failed: ${e.message}`; }
    } else { debugInfo.jsearch = 'Missing JSEARCH_API_KEY in Vercel'; }

    // 2. Test SerpAPI
    let serpapiJobs = [];
    if (SERPAPI_API_KEY) {
      try {
        const res = await fetch(`https://serpapi.com/search?engine=google_jobs&q=${encodeURIComponent(query )}&location=${encodeURIComponent(location)}&api_key=${SERPAPI_API_KEY}`);
        const data = await res.json();
        if (data.jobs_results) {
          serpapiJobs = data.jobs_results;
          debugInfo.serpapi = `Success: Found ${serpapiJobs.length} jobs`;
        } else {
          debugInfo.serpapi = `API Error: ${data.error || 'Unknown error'}`;
        }
      } catch (e: any) { debugInfo.serpapi = `Fetch Failed: ${e.message}`; }
    } else { debugInfo.serpapi = 'Missing SERPAPI_API_KEY in Vercel'; }

    // 3. Return results OR debug info if empty
    if (jsearchJobs.length === 0 && serpapiJobs.length === 0) {
      return NextResponse.json({ 
        success: false, 
        message: "No jobs found", 
        debug: debugInfo 
      });
    }

    // ... (rest of the scoring logic)
    return NextResponse.json({ success: true, jobs: [] }); // Placeholder for now

  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
