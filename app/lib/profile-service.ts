import OpenAI from 'openai';
import { firestore } from '@/lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';

const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
}) : null;

interface ExtractedProfileData {
  skills: string[];
  experienceYears: number;
  jobTitles: string[];
  industries: string[];
}

export async function extractProfileFromResume(
  userId: string,
  resumeText: string
): Promise<ExtractedProfileData> {
  console.log('=== AI Extraction Starting ===');
  console.log('User ID:', userId);
  console.log('Resume length:', resumeText.length);

  if (!openai) {
    console.warn('OpenAI not configured - using fallback extraction');
    return fallbackExtraction(resumeText);
  }

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo',
      messages: [{
        role: 'user',
        content: `Extract structured career data from this resume. Return ONLY a JSON object with these exact keys:

{
  "skills": ["skill1", "skill2"],
  "experienceYears": 5,
  "jobTitles": ["Job Title 1", "Job Title 2"],
  "industries": ["Industry 1", "Industry 2"]
}

Resume to analyze:
${resumeText}

Return ONLY the JSON object.`
      }],
      max_tokens: 800,
      temperature: 0.3,
    });

    const content = response.choices[0]?.message?.content || '';
    console.log('OpenAI raw response:', content);

    // Extract JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      throw new Error('No valid JSON found in OpenAI response');
    }

    const extracted = JSON.parse(jsonMatch[0]);
    console.log('✅ Successfully extracted:', extracted);

    return {
      skills: extracted.skills.slice(0, 10),
      experienceYears: extracted.experienceYears || 3,
      jobTitles: extracted.jobTitles || [],
      industries: extracted.industries || [],
    };
  } catch (error) {
    console.error('❌ OpenAI extraction failed:', error);
    return fallbackExtraction(resumeText);
  }
}

function fallbackExtraction(text: string): ExtractedProfileData {
  const skillKeywords = ['react', 'typescript', 'javascript', 'node', 'python', 'aws', 'docker'];
  const foundSkills = skillKeywords.filter(skill => 
    text.toLowerCase().includes(skill.toLowerCase())
  );

  const yearsMatch = text.match(/\b(\d+)\s+years\b/i);
  const experienceYears = yearsMatch ? parseInt(yearsMatch[1]) : 3;

  return {
    skills: foundSkills.length > 0 ? foundSkills : ['Web Development'],
    experienceYears,
    jobTitles: ['Developer'],
    industries: ['Technology'],
  };
}

export async function updateExtractedProfileData(
  userId: string,
  data: ExtractedProfileData
): Promise<void> {
  const profileRef = doc(firestore, 'users', userId, 'profile', 'main');
  await updateDoc(profileRef, {
    extractedData: data,
    extractedAt: new Date().toISOString(),
  });
  console.log('✅ Extracted data saved to profile');
}
