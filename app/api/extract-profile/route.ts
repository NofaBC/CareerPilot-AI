import { NextResponse } from 'next/server';
import { getOpenAIClient, isOpenAIConfigured } from '@/lib/openai-client';

export async function POST(request: Request) {
  try {
    const { resumeText } = await request.json();
    
    const client = getOpenAIClient();
    
    if (!client || !isOpenAIConfigured()) {
      return NextResponse.json({ 
        error: 'OpenRouter not configured',
        extractedData: fallbackExtract(resumeText)
      });
    }

    const completion = await client.chat.completions.create({
      model: "gpt-5.2",
      messages: [
        {
          role: "system",
          content: `Extract: skills, experienceYears, jobTitles, industries from resume. Return JSON only.`
        },
        {
          role: "user",
          content: resumeText
        }
      ],
      temperature: 0.3,
      max_tokens: 500,
    });

    const content = completion.choices[0]?.message?.content || '';
    const extractedData = JSON.parse(content);
    return NextResponse.json({ extractedData });
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
  const extractedSkills = skills.filter(skill => resumeText.toLowerCase().includes(skill.toLowerCase()));

  return {
    skills: extractedSkills,
    experienceYears: 5,
    jobTitles: ['Manager'],
    industries: ['Technology']
  };
}
