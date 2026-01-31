import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const JSEARCH_API_KEY = process.env.JSEARCH_API_KEY;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { query, location } = body;
    let jobs: any[] = [];

    if (JSEARCH_API_KEY) {
      try {
        const combinedQuery = `${query} in ${location}`;
        const url = `https://jsearch.p.rapidapi.com/search?query=${encodeURIComponent(combinedQuery )}&page=1&num_pages=1`;
        
        const res = await fetch(url, {
          headers: { 
            'X-RapidAPI-Key': JSEARCH_API_KEY, 
            'X-RapidAPI-Host': 'jsearch.p.rapidapi.com' 
          }
        });
        
        const data = await res.json();
        
        if (data.data) {
          jobs = data.data.map((j: any) => ({ 
            ...j, 
            fit_score: 85,
            job_title: j.job_title || 'N/A',
            employer_name: j.employer_name || 'Confidential',
            job_city: j.job_city || location.split(',')[0],
            job_state: j.job_state || location.split(',')[1]?.trim() || '',
            job_apply_link: j.job_apply_link || '#'
          })); 
        }
      } catch (e: any) { 
        console.error("JSearch Fetch error:", e); 
      }
    }

    return NextResponse.json({ 
      success: jobs.length > 0, 
      jobs,
      debug: jobs.length === 0 ? { jsearch: JSEARCH_API_KEY ? "No jobs found" : "Missing API Key" } : undefined
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
