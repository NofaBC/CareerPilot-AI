import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { jobTitle, company, jobDescription, resumeText } = await request.json();

    if (!jobTitle || !company || !jobDescription) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      console.error('❌ OPENAI_API_KEY not configured');
      return NextResponse.json({ 
        error: 'Cover letter generation not configured',
        coverLetter: null
      }, { status: 500 });
    }

    // Build prompt
    const prompt = `Write a concise, professional cover letter for a candidate applying to the ${jobTitle} position at ${company}.

${resumeText ? `Candidate Resume/Profile:\n${resumeText}\n\n` : ''}Job Description:
${jobDescription}

Write in a professional but personable tone. Keep it under 250 words. Start with "Dear Hiring Manager," and end with "Sincerely,".`;

    // Call OpenAI API
    console.log('🤖 Generating cover letter with OpenAI');
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ OpenAI API error:', response.status, errorText);
      throw new Error(`OpenAI error: ${response.status}`);
    }

    const data = await response.json();
    const coverLetter = data.choices?.[0]?.message?.content || 'Failed to generate cover letter.';
    
    console.log('✅ Cover letter generated successfully');

    return NextResponse.json({ coverLetter });
  } catch (error) {
    console.error('/api/generate-cover-letter error:', error);
    return NextResponse.json({ error: 'Failed to generate cover letter' }, { status: 500 });
  }
}
