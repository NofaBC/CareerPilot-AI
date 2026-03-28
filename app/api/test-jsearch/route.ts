import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Check if API key exists
    if (!process.env.JSEARCH_API_KEY) {
      return NextResponse.json({ 
        error: 'JSEARCH_API_KEY not configured',
        success: false
      }, { status: 500 });
    }

    console.log('Testing JSearch API connection...');
    console.log('API Key length:', process.env.JSEARCH_API_KEY.length);
    console.log('API Key first 10 chars:', process.env.JSEARCH_API_KEY.substring(0, 10));

    // Simple test query
    const testQuery = 'Software Engineer in San Francisco';
    const jsearchUrl = `https://jsearch.p.rapidapi.com/search?query=${encodeURIComponent(testQuery)}&page=1&num_pages=1`;
    
    const response = await fetch(jsearchUrl, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': process.env.JSEARCH_API_KEY,
        'X-RapidAPI-Host': 'jsearch.p.rapidapi.com',
      },
    });

    const responseText = await response.text();
    console.log('JSearch response status:', response.status);
    console.log('JSearch response:', responseText);

    if (!response.ok) {
      return NextResponse.json({
        success: false,
        error: 'JSearch API request failed',
        status: response.status,
        statusText: response.statusText,
        response: responseText,
        headers: Object.fromEntries(response.headers.entries())
      });
    }

    const data = JSON.parse(responseText);
    
    return NextResponse.json({
      success: true,
      message: 'JSearch API connection successful',
      jobsFound: data.data?.length || 0,
      sampleJob: data.data?.[0]?.job_title || 'N/A',
      apiStatus: response.status
    });

  } catch (error: any) {
    console.error('Test endpoint error:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}
