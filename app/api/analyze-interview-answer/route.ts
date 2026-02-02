import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const OPENROUTER_KEY = process.env.OPENROUTER_API_KEY;

export async function POST(req: Request) {
  try {
    const { question, answer, jobTitle } = await req.json();

    if (!OPENROUTER_KEY) {
      return NextResponse.json({ success: false, message: "API Key Missing" }, { status: 500 });
    }

    const promptText = `
      You are an expert executive coach and hiring manager.
      
      Job Title: ${jobTitle}
      Interview Question: "${question}"
      Candidate's Answer: "${answer}"

      Analyze this answer and provide:
      1. A fit score (0-100) - how well does this answer align with the role?
      2. Readiness level (Beginner/Intermediate/Advanced/Expert)
      3. Detailed feedback on strengths, areas for improvement, and specific tips to sound more senior.

      Return ONLY a JSON object with this exact structure:
      {
        "score": 75,
        "readiness": "Advanced",
        "analysis": "Your answer demonstrates... [detailed feedback]"
      }
    `;

    const apiResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini",
        messages: [{ role: "user", content: promptText }],
        response_format: { type: "json_object" }
      } )
    });

    const result = await apiResponse.json();
    const content = result.choices?.[0]?.message?.content;
    
    let feedback = { score: 75, readiness: "Advanced", analysis: "" };
    try {
      feedback = JSON.parse(content);
    } catch (e) {
      feedback.analysis = content || "Great answer! Keep practicing to refine your delivery.";
    }

    return NextResponse.json({ success: true, feedback });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
