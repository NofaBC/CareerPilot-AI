import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();
    
    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Text input required' }, { status: 400 });
    }

    // Check if API key exists
    if (!process.env.OPENAI_API_KEY) {
      console.error('❌ OPENAI_API_KEY not configured');
      return NextResponse.json({ 
        error: 'AI service not configured',
        skills: [] 
      }, { status: 500 });
    }

    console.log('🔍 Extracting skills from text:', text.substring(0, 100) + '...');

    // Use GPT-4o to extract skills from paragraph
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are a professional skill extractor. Extract 5-10 specific, concise professional skills from the user\'s text. Return ONLY comma-separated keywords, no explanations. Focus on concrete skills, technologies, and competencies.'
        },
        {
          role: 'user',
          content: `Extract the key professional skills from this text:\n\n${text}`
        }
      ],
      temperature: 0.3,
      max_tokens: 150,
    });

    const extractedText = completion.choices[0]?.message?.content?.trim() || '';
    
    // Parse the comma-separated skills
    const skills = extractedText
      .split(/[,\n]/)
      .map(s => s.trim())
      .filter(s => s.length > 0 && s.length < 50); // Filter out empty or too-long strings

    console.log('✅ Extracted skills:', skills);

    return NextResponse.json({ 
      skills,
      originalText: extractedText 
    });

  } catch (error: any) {
    console.error('❌ /api/extract-skills error:', error);
    return NextResponse.json({ 
      error: 'Failed to extract skills',
      details: error.message,
      skills: []
    }, { status: 500 });
  }
}
