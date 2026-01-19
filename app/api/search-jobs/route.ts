import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const JSEARCH_API_KEY = process.env.JSEARCH_API_KEY;

    console.log("Debug: Starting Minimalist Search...");

    if (!JSEARCH_API_KEY) {
      return NextResponse.json({ success: false, message: "JSEARCH_API_KEY is missing in Vercel" });
    }

    const res = await fetch(`https://jsearch.p.rapidapi.com/search?query=Nurse&location=Chicago`, {
      headers: { 
        'X-RapidAPI-Key': JSEARCH_API_KEY, 
        'X-RapidAPI-Host': 'jsearch.p.rapidapi.com' 
      }
    } );

    const data = await res.json();

    return NextResponse.json({ 
      success: true, 
      message: "API is working!",
      jobCount: data.data?.length || 0,
      firstJob: data.data?.[0]?.job_title || "No jobs found"
    });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
