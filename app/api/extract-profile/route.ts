// app/api/extract-profile/route.ts
import { NextResponse } from 'next/server';
import { getOpenAIClient, isOpenAIConfigured } from '@/lib/openai-client';

// Force Node.js runtime for environment variable access
export const runtime = 'nodejs';

export async function POST(request: Request) {
  let resumeText = '';
  
  try {
    const body = await request.json();
    resumeText = body.resumeText || '';
    
    console.log('📥 API received resume text length:', resumeText.length);

    if (!isOpenAIConfigured()) {
      console.warn('⚠️ OpenRouter not configured - using fallback');
      return NextResponse.json({
        error: 'OpenRouter not configured',
        extractedData: fallbackExtract(resumeText)
      });
    }

    const client = getOpenAIClient();
    
    console.log('🤖 Calling OpenAI API...');
    
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini", // Cheaper for testing
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

// Fallback functions
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
