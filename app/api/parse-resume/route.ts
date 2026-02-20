import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { resumeText } = await req.json();

    if (!resumeText) {
      return NextResponse.json({ error: 'Resume text is required' }, { status: 400 });
    }

    const prompt = `Parse the following resume and extract structured information. Return ONLY a valid JSON object with this exact structure:

{
  "personalInfo": {
    "fullName": "string",
    "email": "string",
    "phone": "string",
    "location": "string",
    "linkedin": "string",
    "website": "string"
  },
  "summary": "string (professional summary)",
  "experience": [
    {
      "company": "string",
      "position": "string",
      "startDate": "YYYY-MM format",
      "endDate": "YYYY-MM format or empty if current",
      "current": boolean,
      "description": "string (responsibilities and achievements)"
    }
  ],
  "education": [
    {
      "school": "string",
      "degree": "string",
      "field": "string",
      "graduationDate": "YYYY-MM format"
    }
  ],
  "skills": ["array of skill strings"]
}

Resume text:
${resumeText}

Important:
- Extract ALL work experience entries, even if multiple
- Extract ALL education entries
- For dates, convert to YYYY-MM format (e.g., "2020-01")
- If information is not found, use empty string "" for strings, [] for arrays, false for booleans
- Return ONLY the JSON object, no other text`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a resume parser that extracts structured data from resumes. Always respond with valid JSON only.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.3,
    });

    const responseText = completion.choices[0].message.content?.trim() || '{}';
    
    // Remove markdown code blocks if present
    const jsonText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    const parsedData = JSON.parse(jsonText);

    return NextResponse.json({ data: parsedData });
  } catch (error) {
    console.error('Error parsing resume:', error);
    return NextResponse.json(
      { error: 'Failed to parse resume' },
      { status: 500 }
    );
  }
}
