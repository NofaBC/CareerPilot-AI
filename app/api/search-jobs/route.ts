import { NextRequest, NextResponse } from 'next/server';
import { firestore } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

interface Profile {
  targetRole: string;
  location: string;
  minSalary: string;
  maxSalary: string;
  resume: string;
  extractedData?: {
    skills: string[];
    experienceYears: number;
    jobTitles: string[];
    industries: string[];
  };
}

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  applyLink?: string;
  posted?: string;
  salary?: string;
  remote?: boolean;
  fitScore?: number;
  matchingSkills?: string[];
}

function calculateFitScore(job: Job, profile: Profile): number {
  let score = 0;

  // Skills match (40 points)
  if (profile.extractedData?.skills) {
    const jobDesc = job.description.toLowerCase();
    const matchingSkills = profile.extractedData.skills.filter(skill => 
      jobDesc.includes(skill.toLowerCase())
    );
    score += Math.min(matchingSkills.length * 8, 40);
    job.matchingSkills = matchingSkills;
  }

  // Job title relevance (30 points)
  if (profile.targetRole) {
    const target = profile.targetRole.toLowerCase();
    const jobTitle = job.title.toLowerCase();
    if (jobTitle.includes(target)) score += 30;
    else if (jobTitle.includes('developer') && target.includes('developer')) score += 20;
    else if (jobTitle.includes('engineer') && target.includes('engineer')) score += 20;
  }

  return Math.min(score, 100);
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();
    
    // Get user profile if available
    let profile: Profile | null = null;
    if (userId) {
      try {
        const profileRef = doc(firestore, 'users', userId, 'profile', 'main');
        const profileSnap = await getDoc(profileRef);
        
        if (profileSnap.exists()) {
          profile = profileSnap.data() as Profile;
          console.log('✅ Found profile:', profile);
        } else {
          console.log('⚠️ No profile found for user:', userId);
        }
      } catch (error) {
        console.warn('Could not fetch profile');
      }
    }

    // Use profile or defaults
    const targetRole = profile?.targetRole || 'Software Developer';
    const profileLocation = profile?.location || 'Rockville, MD';
    const isRemote = profileLocation.includes('Remote');
    const skills = profile?.extractedData?.skills || ['JavaScript', 'Web Development'];

    // ALL jobs now use the EXACT same location logic
    const mockJobs: Job[] = [
      {
        id: 'job-1',
        title: `${targetRole} (React/TypeScript)`,
        company: 'TechCorp Solutions',
        location: isRemote ? 'Remote' : profileLocation, // ✅ Your location
        description: `We need a ${targetRole} in ${profileLocation} with skills: ${skills.join(', ')}.`,
        applyLink: 'https://example.com/apply/1',
        salary: '$120k - $180k',
        remote: isRemote,
        posted: '2 days ago',
      },
      {
        id: 'job-2',
        title: 'Full-Stack Engineer',
        company: 'StartupXYZ',
        location: isRemote ? 'Remote' : profileLocation, // ✅ Your location
        description: `Join our ${profileLocation} team as a ${targetRole}. Skills: ${skills.join(', ')}.`,
        applyLink: 'https://example.com/apply/2',
        salary: '$100k - $150k',
        remote: false,
        posted: '1 week ago',
      },
      {
        id: 'job-3',
        title: `Lead ${targetRole}`,
        company: 'Enterprise Inc',
        location: isRemote ? 'Remote' : 'Baltimore, MD', // Near Rockville
        description: `Lead our ${profileLocation} team. ${targetRole} with ${skills.join(', ')}.`,  
        applyLink: 'https://example.com/apply/3',
        salary: '$180k - $250k',
        remote: isRemote,
        posted: '3 days ago',
      },
      {
        id: 'job-4',
        title: `${targetRole} (React)`,
        company: 'MidSize Co',
        location: isRemote ? 'Remote' : 'Washington, DC', // Near Rockville
        description: `Mid-level ${targetRole} in ${profileLocation} area. Skills: ${skills.join(', ')}.`,
        applyLink: 'https://example.com/apply/4',
        salary: '$90k - $130k',
        remote: isRemote,
        posted: '5 days ago',
      },
      {
        id: 'job-5',
        title: `Senior ${targetRole}`,
        company: 'DesignFirst Agency',
        location: isRemote ? 'Remote' : 'Baltimore, MD', // Near Rockville
        description: `Senior ${targetRole} for ${profileLocation}. ${skills.join(', ')} skills.`,
        applyLink: 'https://example.com/apply/5',
        salary: '$110k - $160k',
        remote: false,
        posted: '1 day ago',
      },
    ];

    // Calculate fit scores and sort
    const jobsWithScores = mockJobs.map(job => ({
      ...job,
      fitScore: profile ? calculateFitScore(job, profile) : Math.floor(Math.random() * 40) + 60,
    }));

    jobsWithScores.sort((a, b) => (b.fitScore || 0) - (a.fitScore || 0));

    return NextResponse.json({ jobs: jobsWithScores });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ jobs: [], error: 'Failed to search jobs' }, { status: 500 });
  }
}
