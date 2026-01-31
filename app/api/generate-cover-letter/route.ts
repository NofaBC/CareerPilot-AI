import { NextResponse } from 'next/server';

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

export async function POST(req: Request) {
  try {
    const { jobTitle, employer, jobDescription, userProfile, resumeSummary } = await req.json();

    if (!OPENROUTER_API_KEY) {
      return NextResponse.json({ 
        success: false, 
        message: "OpenRouter API Key missing" 
      }, { status: 500 });
    }

    const prompt = `
      Write a professional, high-impact cover letter for the following job:
      Role: ${jobTitle}
      Company: ${employer}
      Job Description: ${jobDescription}

      Candidate Profile:
      Target Role: ${userProfile.targetRole}
      Experience: ${userProfile.experienceYears} years
      Skills: ${userProfile.skills.join(', ')}
      Resume Summary: ${resumeSummary}

      Instructions:
      - Keep it to 3 concise paragraphs.
      - Focus on how the candidate's specific experience in ${userProfile.skills.slice(0,3).join(', ')} solves the company's problems.
      - Maintain a confident, professional, and enthusiastic tone.
      - Do not use placeholders like [Date] or [Address]. Start directly with "Dear Hiring Team at ${employer},".
    `;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://careerpilot.ai",
        "X-Title": "CareerPilot AI"
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini", // Using a fast, reliable model for cover letters
        messages: [{ role: "user", content: prompt }]
      })
    });

    const data = await response.json();
    const coverLetter = data.choices[0].message.content;

    return NextResponse.json({ success: true, coverLetter });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}


live

