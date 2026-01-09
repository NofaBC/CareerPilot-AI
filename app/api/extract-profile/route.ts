// app/api/extract-profile/route.ts
import { NextResponse } from 'next/server';
import { getOpenAIClient, isOpenAIConfigured } from '@/lib/openai-client';

export async function POST(request: Request) {
  let resumeText = '';
  
  try {
    const body = await request.json();
    resumeText = body.resumeText || '';
    
    if (!resumeText) {
      return NextResponse.json({
        error: 'No resume text provided',
        extractedData: fallbackExtract(resumeText)
      });
    }

    const client = getOpenAIClient();
    
    if (!client || !isOpenAIConfigured()) {
      console.warn('⚠️ OpenRouter not configured - using fallback extraction');
      return NextResponse.json({
        error: 'OpenRouter not configured',
        extractedData: fallbackExtract(resumeText)
      });
    }

    const completion = await client.chat.completions.create({
      model: "gpt-3.5-turbo", // Use GPT-3.5 for faster/cheaper testing first
      messages: [
        {
          role: "system",
          content: `You are a resume parsing AI. Extract structured data from resumes. Return ONLY a JSON object with these exact fields:
{
  "skills": ["skill1", "skill2"],
  "experienceYears": number,
  "jobTitles": ["title1", "title2"],
  "industries": ["industry1"]
}`
        },
        {
          role: "user",
          content: `Extract data from this resume:\n\n${resumeText}`
        }
      ],
      temperature: 0.3,
      max_tokens: 500,
    });

    const content = completion.choices[0]?.message?.content || '';
    
    try {
      const extractedData = JSON.parse(content);
      console.log('✅ AI extracted data:', extractedData);
      return NextResponse.json({ extractedData });
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      return NextResponse.json({
        error: 'Invalid AI response format',
        extractedData: fallbackExtract(resumeText)
      });
    }
    
  } catch (error) {
    console.error('Profile extraction error:', error);
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
    experienceYears: extractYearsOfExperience(resumeText),
    jobTitles: extractJobTitles(resumeText),
    industries: extractIndustries(resumeText),
  };
}

function extractYearsOfExperience(text: string): number {
  const matches = text.match(/(\d+)\s*\+?\s*years?/i);
  return matches ? parseInt(matches[1]) : 3;
}

function extractJobTitles(text: string): string[] {
  const titles = ['Regional Director', 'Sales Manager', 'Full Stack Developer', 'Software Engineer'];
  return titles.filter(title => text.toLowerCase().includes(title.toLowerCase()));
}

function extractIndustries(text: string): string[] {
  return text.toLowerCase().includes('retail') ? ['Retail'] : 
         text.toLowerCase().includes('healthcare') ? ['Healthcare'] : ['Technology'];
}
