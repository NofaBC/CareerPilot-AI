import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateCoverLetter(
  jobTitle: string,
  company: string,
  jobDescription: string,
  resumeText: string
) {
  const prompt = `You are a professional job applicant with this resume:
${resumeText}

Write a personalized cover letter for this position:
Job: ${jobTitle}
Company: ${company}
Description: ${jobDescription.substring(0, 1000)}

Keep it concise (150-200 words), professional, and highlight relevant skills.`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 300,
  });

  return response.choices[0].message.content || '';
}
