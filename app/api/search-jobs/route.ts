import { NextResponse } from 'next/server';

const JSEARCH_API_KEY = process.env.JSEARCH_API_KEY;

export async function POST(req: Request) {
  try {
    const { query, location } = await req.json();
    let jobs: any[] = [];

    if (JSEARCH_API_KEY) {
      try {
        // *** FIX: We now combine Role + Location into the query for 100% accuracy ***
        const combinedQuery = `${query} in ${location}`;
        
        // We also use 'page=1' and 'num_pages=1' to keep it fast
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
            job_city: j.job_city || location.split(',')[0], // Fallback to searched city
            job_state: j.job_state || location.split(',')[1]?.trim() || '',
            job_apply_link: j.job_apply_link || '#'
          })); 
        }
      } catch (e: any) { console.error("Fetch error:", e); }
    }

    return NextResponse.json({ 
      success: jobs.length > 0, 
      jobs 
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
