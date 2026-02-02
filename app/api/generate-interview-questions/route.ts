import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const OPENROUTER_KEY = process.env.OPENROUTER_API_KEY;

export async function POST(req: Request) {
  try {
    const { jobTitle, employer, coverLetter } = await req.json();

    if (!OPENROUTER_KEY) {
      return NextResponse.json({ success: false, message: "API Key Missing" }, { status: 500 });
    }

    const promptText = `
      You are an expert hiring manager at ${employer}. 
      You are interviewing a candidate for the role of ${jobTitle}.
      The candidate's cover letter mentioned: "${coverLetter.substring(0, 500)}..."

      Generate 5 realistic, high-stakes interview questions for this specific role.
      Include a mix of:
      1. Behavioral (past experience)
      2. Technical/Strategic (how they solve problems)
      3. Cultural (alignment with ${employer})

      Return ONLY a JSON array of strings. Example: ["Question 1", "Question 2", ...]
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
    
    // Parse the JSON array from the response
    let questions = [];
    try {
      const parsed = JSON.parse(content);
      questions = Array.isArray(parsed) ? parsed : parsed.questions || [];
    } catch (e) {
      // Fallback if AI doesn't return clean JSON
      questions = [
        `Tell me about your experience as a ${jobTitle}.`,
        `Why do you want to work at ${employer}?`,
        `Describe a difficult technical challenge you solved recently.`,
        `How do you handle tight deadlines in a high-pressure environment?`,
        `What is your approach to collaborating with cross-functional teams?`
      ];
    }

    return NextResponse.json({ success: true, questions: questions.slice(0, 5) });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
