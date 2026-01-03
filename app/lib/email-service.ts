import OpenAI from 'openai';
import nodemailer from 'nodemailer';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Create email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
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

export async function sendApplicationEmail(
  to: string,
  jobTitle: string,
  company: string,
  coverLetter: string,
  resumeLink: string
) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: to,
    subject: `Application for ${jobTitle} at ${company}`,
    html: `
      <h2>Application for ${jobTitle}</h2>
      <p><strong>Position:</strong> ${jobTitle}</p>
      <p><strong>Company:</strong> ${company}</p>
      
      <h3>Cover Letter</h3>
      <p>${coverLetter.replace(/\n/g, '<br>')}</p>
      
      <p><strong>Resume:</strong> <a href="${resumeLink}">View Resume</a></p>
      
      <p>Best regards,<br>
      CareerPilot AI™ Autonomous Job Agent</p>
    `,
  };

  return transporter.sendMail(mailOptions);
}
