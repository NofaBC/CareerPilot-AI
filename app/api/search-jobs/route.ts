import { NextResponse } from 'next/server';

const JSEARCH_API_KEY = process.env.JSEARCH_API_KEY;
const SERPAPI_API_KEY = process.env.SERPAPI_API_KEY;

export async function POST(req: Request) {
  try {
    const { query, location } = await req.json();
    let debug = { jsearch: 'Not attempted', serpapi: 'Not attempted' };
    let jobs: any[] = [];

    // JSearch Attempt
    if (JSEARCH_API_KEY) {
      try {
        const res = await fetch(`https://jsearch.p.rapidapi.com/search?query=${encodeURIComponent(query )}&location=${encodeURIComponent(location)}`, {
          headers: { 'X-RapidAPI-Key': JSEARCH_API_KEY, 'X-RapidAPI-Host': 'jsearch.p.rapidapi.com' }
        });
        const data = await res.json();
        if (data.data) {
          jobs = data.data.map((j: any) => ({ ...j, fit_score: 85 })); // Simple scoring for now
          debug.jsearch = `Success: Found ${jobs.length} jobs`;
        } else { debug.jsearch = `API Error: ${data.message || 'Unknown'}`; }
      } catch (e: any) { debug.jsearch = `Fetch Failed: ${e.message}`; }
    } else { debug.jsearch = 'Missing JSEARCH_API_KEY in Vercel'; }

    return NextResponse.json({ success: jobs.length > 0, jobs, debug });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
