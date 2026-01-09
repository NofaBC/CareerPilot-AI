// app/api/extract-profile/route.ts
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Force Node.js runtime
export const runtime = 'nodejs';

export async function POST(request: Request) {
  let resumeText = '';
  
  try {
    const body = await request.json();
    resumeText = body.resumeText || '';
    
    console.log('📥 API received resume. Length:', resumeText.length);
    console.log('🔍 DIRECT ENV CHECK - process.env.OPENROUTER_API_KEY:', 
      process.env.OPENROUTER_API_KEY ? `✅ EXISTS (${process.env.OPENROUTER_API_KEY.length} chars)` : '❌ UNDEFINED'
    );

    // CRITICAL: Direct access, no helper functions
    const apiKey = process.env.OPENROUTER_API_KEY;
    
    if (!apiKey) {
      console.error('❌ DIRECT ENV ACCESS FAILED - API key undefined');
      return NextResponse.json({
        error: 'OpenRouter API key not configured',
        extractedData: fallbackExtract(resumeText)
      });
    }

    console.log('✅ Direct env access successful, initializing client...');
    
    const client = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: apiKey,
      defaultHeaders: {
        "HTTP-Referer": "https://career-pilot-ai-delta.vercel.app",
        "X-Title": "CareerPilot AI",
      },
    });

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "Extract: skills[], experienceYears, jobTitles[], industries[]. Return JSON only."
        },
        {
          role: "user",
          content: resumeText
        }
      ],
      temperature: 0.3,
      max_tokens: 400,
    });

    const content = completion.choices[0]?.message?.content || '';
    console.log('📤 Raw AI response:', content);
    
    const extractedData = JSON.parse(content);
    console.log('✅ AI extracted data:', extractedData);
    
    return NextResponse.json({ extractedData });
    
  } catch (error) {
    console.error('❌ Profile extraction error:', error);
    return NextResponse.json({
      error: 'Extraction failed',
      extractedData: fallbackExtract(resumeText)
    });
  }
}

function fallbackExtract(resumeText: string) {
  const skills = ['retail', 'sales', 'management', 'p&l', 'inventory', 'javascript', 'react'];
  const extractedSkills = skills.filter(skill =>
    resumeText.toLowerCase().includes(skill.toLowerCase())
  );
  
  return {
    skills: extractedSkills,
    experienceYears: 3,
    jobTitles: ['Manager'],
    industries: ['Technology'],
  };
}
