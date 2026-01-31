import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const OPENROUTER_KEY = process.env.OPENROUTER_API_KEY;

export async function POST(req: Request) {
  try {
    const requestData = await req.json();
    const { jobTitle, employer, jobDescription, userProfile, resumeSummary } = requestData;

    if (!OPENROUTER_KEY) {
      return NextResponse.json({ success: false, message: "API Key Missing" }, { status: 500 });
    }

    const promptText = `
      Write a professional cover letter for:
      Role: ${jobTitle || 'Professional'}
      Company: ${employer || 'Company'}
      Description: ${jobDescription || ''}

      Candidate:
      Role: ${userProfile?.targetRole || ''}
      Exp: ${userProfile?.experienceYears || ''}
      Skills: ${userProfile?.skills?.join(', ') || ''}
      Summary: ${resumeSummary || ''}

      Instructions: 3 paragraphs, professional tone, start with "Dear Hiring Team at ${employer || 'the company'},".
    `;

    const apiResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini",
        messages: [{ role: "user", content: promptText }]
      } )
    });

    const result = await apiResponse.json();
    const letter = result.choices?.[0]?.message?.content || "Failed to generate content.";

    return NextResponse.json({ success: true, coverLetter: letter });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
