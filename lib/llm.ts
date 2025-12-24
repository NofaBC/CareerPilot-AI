import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function generateProfileSummary(data: {
  name: string;
  jobTitleTarget: string;
  industry: string;
  workMode: string;
  location?: string;
  salary?: string;
  resumeText: string;
}): Promise<string> {
  const prompt = `Create a compelling professional profile summary for a candidate targeting ${data.jobTitleTarget} roles in ${data.industry}.

Name: ${data.name}
Work Mode: ${data.workMode}
Location: ${data.location || 'Not specified'}
Salary: ${data.salary || 'Not specified'}

Resume/Bio:
${data.resumeText}

Generate a concise 3-4 sentence summary that highlights their qualifications and career goals. Focus on transferable skills and value proposition.`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 200,
  });

  return completion.choices[0]?.message?.content?.trim() || 'Profile summary generation failed.';
}

export async function extractSkills(resumeText: string): Promise<string[]> {
  const prompt = `Extract 8-12 key professional skills from this resume text. Return as a simple comma-separated list.

Resume:
${resumeText}

Skills (comma-separated):`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 150,
  });

  const skillsText = completion.choices[0]?.message?.content || '';
  return skillsText
    .split(',')
    .map((skill) => skill.trim())
    .filter((skill) => skill.length > 0)
    .slice(0, 12);
}

export async function generateCoverLetter(job: any, profile: any): Promise<string> {
  const prompt = `Write a compelling cover letter for a ${job.title} position at ${job.company}.

Job Details:
- Title: ${job.title}
- Company: ${job.company}
- Summary: ${job.summary}

Candidate Profile:
- Name: ${profile.name}
- Target Role: ${profile.jobTitleTarget}
- Industry: ${profile.industry}
- Skills: ${profile.skills?.join(', ') || 'Not specified'}
- Experience: ${profile.profileSummary || 'See resume for details'}

Write a professional cover letter that:
1. Opens with enthusiasm for the specific role
2. Connects 2-3 key skills to job requirements
3. Shows knowledge of the company
4. Closes with a strong call to action
5. Is 250-300 words
6. Professional yet conversational tone`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 400,
  });

  return completion.choices[0]?.message?.content?.trim() || 'Cover letter generation failed.';
}

export async function generateInterviewQuestions(job: any, profile: any): Promise<string[]> {
  const prompt = `Generate 8 specific interview questions for a ${job.title} role at ${job.company} based on this candidate's profile.

Job: ${job.title} at ${job.company}
Candidate Skills: ${profile.skills?.join(', ') || profile.profileSummary}

Generate questions that:
1. Assess technical skills related to the role
2. Explore past experience and achievements
3. Evaluate cultural fit and work style
4. Test problem-solving abilities
5. Include 1-2 company-specific questions

Return as a numbered list.`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 300,
  });

  const questionsText = completion.choices[0]?.message?.content || '';
  return questionsText
    .split('\n')
    .filter((line) => line.trim().length > 0)
    .map((line) => line.replace(/^\d+\.\s*/, '').trim())
    .slice(0, 10);
}

export async function generateInterviewTips(job: any, profile: any): Promise<string[]> {
  const prompt = `Provide 5-7 interview coaching tips for a ${job.title} role at ${job.company}.

Job: ${job.title}
Company: ${job.company}
Candidate: ${profile.name}

Focus on:
1. Company research points
2. Key skills to highlight
3. Potential red flags to address
4. Questions to ask the interviewer
5. STAR method preparation tips

Return as bullet points.`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 250,
  });

  const tipsText = completion.choices[0]?.message?.content || '';
  return tipsText
    .split('\n')
    .filter((line) => line.trim().length > 0 && line.includes('•'))
    .map((line) => line.replace(/^•\s*/, '').trim())
    .slice(0, 10);
}
