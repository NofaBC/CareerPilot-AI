import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const SERPAPI_KEY = process.env.SERPAPI_KEY;
    
    if (!SERPAPI_KEY) {
      console.error('SERPAPI_KEY not found');
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    const body = await req.json().catch(() => ({}));
    const { query = 'software engineer', location = '', remote = false } = body;
    
    const searchQuery = `${query} ${location} ${remote ? 'remote' : ''}`.trim();
    const url = `https://serpapi.com/search.json?engine=google_jobs&q=${encodeURIComponent(searchQuery)}&api_key=${SERPAPI_KEY}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`SerpAPI error: ${response.status}`);
    }
    
    const data = await response.json();
    const jobs = data.jobs_results?.map((job: any) => ({
      id: job.job_id,
      title: job.title,
      company: job.company_name,
      location: job.location,
      description: job.description?.substring(0, 500) + '...',
      applyLink: job.share_link || job.related_links?.[0]?.link,
      posted: job.detected_extensions?.posted_at,
      salary: job.detected_extensions?.salary,
      remote: job.detected_extensions?.work_from_home ? true : false,
    })) || [];
    
    return NextResponse.json({ jobs });

  } catch (error) {
    console.error('Job search error:', error);
    return NextResponse.json({ jobs: [], error: 'Search failed' }, { status: 500 });
  }
}
