import OpenAI from 'openai';

// Initialize OpenAI client only if API key exists
const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
}) : null;

export async function generateCoverLetter(
  jobTitle: string,
  company: string,
  jobDescription: string,
  resumeText: string
): Promise<string> {
  // Check if OpenAI is configured
  if (!openai) {
    console.warn('OpenAI not configured - returning placeholder cover letter');
    return `Dear Hiring Manager,\n\nI am writing to express my interest in the ${jobTitle} position at ${company}.\n\nBest regards,\nApplicant`;
  }

  try {
    const prompt = `
You are a professional career coach. Write a compelling cover letter for the following job:

Job: ${jobTitle} at ${company}
Description: ${jobDescription}

Applicant's experience: ${resumeText}

Write a concise, professional cover letter (200-300 words) that highlights relevant skills and demonstrates enthusiasm for the role.
`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 400,
    });

    return response.choices[0]?.message?.content || 'Failed to generate cover letter';
  } catch (error) {
    console.error('OpenAI error:', error);
    // Fallback to placeholder if API fails
    return `Dear Hiring Manager,\n\nI am writing to express my interest in the ${jobTitle} position at ${company}.\n\nBest regards,\nApplicant`;
  }
}
