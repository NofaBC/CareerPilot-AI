// app/api/search-jobs/route.ts
import { NextResponse } from 'next/server';
import { firestore } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  applyLink: string;
  posted: string;
  salary?: string;
  remote?: boolean;
  category: string;
  requiredSkills: string[];
}

interface Profile {
  targetRole: string;
  location: string;
  extractedData?: {
    skills: string[];
    experienceYears: number;
    jobTitles: string[];
    industries: string[];
  };
}

// Mock job data across industries - only returns if matches profile
const mockData: Job[] = [
  {
    id: '1',
    title: 'Regional Sales Manager',
    company: 'RetailCorp',
    location: 'Austin, TX',
    description: 'Lead retail operations across Texas region. P&L management, team development, sales strategy, inventory optimization for 20+ stores.',
    applyLink: 'https://www.indeed.com/jobs?q=regional+sales+manager&l=Austin, TX',
    posted: '1 day ago',
    salary: '$90k - $130k',
    remote: false,
    category: 'retail',
    requiredSkills: ['retail', 'sales', 'management', 'p&l', 'inventory']
  },
  {
    id: '2',
    title: 'Senior Full Stack Developer',
    company: 'TechCorp Solutions',
    location: 'Remote',
    description: 'React, TypeScript, Node.js development for enterprise applications.',
    applyLink: 'https://www.linkedin.com/jobs/search/?keywords=senior+full+stack+developer&location=Remote',
    posted: '2 days ago',
    salary: '$120k - $160k',
    remote: true,
    category: 'technology',
    requiredSkills: ['react', 'typescript', 'node', 'javascript']
  },
  {
    id: '3',
    title: 'Registered Nurse - ICU',
    company: 'Johns Hopkins Hospital',
    location: 'Baltimore, MD',
    description: 'Critical care RN. BSN required, 3+ years experience, ACLS certification preferred.',
    applyLink: 'https://www.indeed.com/jobs?q=icu+registered+nurse&l=Baltimore, MD',
    posted: '1 week ago',
    salary: '$75k - $95k',
    remote: false,
    category: 'healthcare',
    requiredSkills: ['nursing', 'critical care', 'acls', 'patient care']
  },
  {
    id: '4',
    title: 'Financial Analyst',
    company: 'Morgan Stanley',
    location: 'New York, NY',
    description: 'Financial modeling, Excel expertise, SQL, CFA preferred. Support investment banking team.',
    applyLink: 'https://www.glassdoor.com/Job/new-york-financial-analyst-jobs-SRCH_IL.0,8_IC1132348_KO9,25.htm',
    posted: '3 days ago',
    salary: '$80k - $110k',
    remote: false,
    category: 'finance',
    requiredSkills: ['excel', 'financial modeling', 'sql', 'cfa']
  }
];

// Calculate fit score based on profile skills vs job requirements
function calculateFitScore(profile: Profile, job: Job): number {
  const extractedSkills = profile.extractedData?.skills || [];
  
  if (extractedSkills.length === 0) return 70; // Fallback score

  // Skill match calculation
  const matchingSkills = job.requiredSkills.filter(skill =>
    extractedSkills.some(userSkill => 
      userSkill.toLowerCase().includes(skill.toLowerCase()) ||
      skill.toLowerCase().includes(userSkill.toLowerCase())
    )
  );
  
  const skillScore = (matchingSkills.length / job.requiredSkills.length) * 100;
  
  // Location match (20 points)
  const locationMatch = profile.location.toLowerCase() === 'remote' || job.remote
    ? 20
    : job.location.toLowerCase().includes(profile.location.toLowerCase())
    ? 20
    : 0;

  // Target role relevance (10 points)
  const roleRelevance = profile.targetRole.toLowerCase().includes(job.category) ||
    job.title.toLowerCase().includes(profile.targetRole.toLowerCase())
    ? 10
    : 0;

  return Math.min(100, Math.round(skillScore * 0.7 + locationMatch + roleRelevance));
}

export async function POST(request: Request) {
  try {
    const { userId } = await request.json();
    
    if (!userId) {
      return NextResponse.json({ jobs: [] });
    }

    // CRITICAL: Fetch user profile from Firestore
    const profileRef = doc(firestore, 'users', userId, 'profile', 'main');
    const profileSnap = await getDoc(profileRef);
    
    // If no profile exists, return EMPTY array - no jobs shown
    if (!profileSnap.exists()) {
      console.log('No profile found for user:', userId);
      return NextResponse.json({ jobs: [] });
    }

    const profile = profileSnap.data() as Profile;
    
    // Extract location and skills
    const userLocation = profile.location || 'Remote';
    const extractedSkills = profile.extractedData?.skills || [];
    
    console.log('🎯 Profile found:', {
      location: userLocation,
      targetRole: profile.targetRole,
      skills: extractedSkills
    });

    // Filter jobs based on profile data
    const filteredJobs = mockData
      .filter(job => {
        // Location match: either exact match, remote, or user wants remote
        const locationMatches = job.remote || 
          job.location.toLowerCase().includes(userLocation.toLowerCase()) ||
          userLocation.toLowerCase().includes('remote');
        
        // Skill/industry match: job category matches user's extracted skills/industry
        const hasSkillOverlap = extractedSkills.some(skill => 
          job.requiredSkills.includes(skill) || 
          job.description.toLowerCase().includes(skill.toLowerCase())
        );
        
        // Target role relevance
        const roleMatches = profile.targetRole.toLowerCase().includes(job.category) ||
          job.title.toLowerCase().includes(profile.targetRole.toLowerCase());
        
        return locationMatches && (hasSkillOverlap || roleMatches);
      })
      .map(job => ({
        ...job,
        fitScore: calculateFitScore(profile, job),
        matchingSkills: extractedSkills.filter(skill =>
          job.requiredSkills.includes(skill) || 
          job.description.toLowerCase().includes(skill.toLowerCase())
        )
      }))
      .sort((a, b) => b.fitScore - a.fitScore); // Highest matches first

    console.log(`🎉 Found ${filteredJobs.length} relevant jobs for: ${profile.targetRole}`);
    
    return NextResponse.json({ jobs: filteredJobs });

  } catch (error) {
    console.error('❌ Job search error:', error);
    return NextResponse.json({ jobs: [] });
  }
}
