import { NextResponse } from 'next/server';
import { firestore } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

export async function POST(request: Request) {
  try {
    const { userId } = await request.json();

    // Fetch user profile
    let userProfile = null;
    let extractedSkills: string[] = [];
    let userLocation = 'Rockville, MD'; // Default fallback

    if (userId) {
      try {
        const profileRef = doc(firestore, 'users', userId, 'profile', 'main');
        const profileSnap = await getDoc(profileRef);
        
        if (profileSnap.exists()) {
          userProfile = profileSnap.data();
          extractedSkills = userProfile?.extractedData?.skills || [];
          userLocation = userProfile?.location || 'Rockville, MD';
          console.log('✅ Profile found. Location:', userLocation); // Debug log
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    }

    // Mock jobs using YOUR location for ALL professions
    const mockJobs = [
      // Tech Jobs (dynamic location)
      {
        id: '1',
        title: 'Full-Stack Engineer',
        company: 'StartupXYZ',
        location: userLocation,
        description: `Join our ${userLocation} team as a Software Developer. Skills: JavaScript, Web Development, React, Node.js.`,
        applyLink: `https://www.linkedin.com/jobs/search/?keywords=full%20stack%20engineer&location=${encodeURIComponent(userLocation)}`,
        salary: '$100k - $150k',
        posted: '1 week ago',
        remote: userLocation.toLowerCase().includes('remote'),
        fitScore: calculateFitScore(['javascript', 'web development', 'react', 'node'], extractedSkills),
        matchingSkills: ['javascript', 'web development']
      },
      {
        id: '2',
        title: 'Senior Software Developer',
        company: 'DesignFirst Agency',
        location: userLocation,
        description: `Senior Software Developer for ${userLocation}. JavaScript, TypeScript, React required.`,
        applyLink: `https://www.indeed.com/q-senior-software-developer-l-${encodeURIComponent(userLocation)}-jobs.html`,
        salary: '$110k - $160k',
        posted: '1 day ago',
        remote: userLocation.toLowerCase().includes('remote'),
        fitScore: calculateFitScore(['javascript', 'typescript', 'react'], extractedSkills),
        matchingSkills: ['javascript', 'typescript']
      },
      // Non-Tech Jobs (ALSO dynamic location now)
      {
        id: '6',
        title: 'Executive Chef',
        company: 'Metropolitan Restaurant Group',
        location: userLocation, // ✅ FIXED: Was hardcoded to Washington, DC
        description: `Lead kitchen operations in ${userLocation}. Menu development, team management, cost control, French cuisine expertise.`,
        applyLink: `https://www.indeed.com/q-executive-chef-l-${encodeURIComponent(userLocation)}-jobs.html`,
        salary: '$65k - $85k',
        posted: '2 days ago',
        remote: userLocation.toLowerCase().includes('remote'),
        fitScore: calculateFitScore(['menu planning', 'french cuisine', 'team leadership'], extractedSkills),
        matchingSkills: ['menu planning', 'team leadership']
      },
      {
        id: '7',
        title: 'Registered Nurse - ICU',
        company: 'Johns Hopkins Hospital',
        location: userLocation, // ✅ FIXED: Was hardcoded to Baltimore, MD
        description: `Critical care RN for ${userLocation} area. BSN required, 3+ years experience, ACLS certification preferred.`,
        applyLink: `https://www.indeed.com/q-registered-nurse-icu-l-${encodeURIComponent(userLocation)}-jobs.html`,
        salary: '$75k - $95k',
        posted: '1 week ago',
        remote: userLocation.toLowerCase().includes('remote'),
        fitScore: calculateFitScore(['critical care', 'acls', 'bsn'], extractedSkills),
        matchingSkills: ['critical care', 'acls']
      },
      {
        id: '8',
        title: 'Financial Analyst',
        company: 'Morgan Stanley',
        location: userLocation, // ✅ FIXED: Was hardcoded to Rockville, MD
        description: `Financial modeling, Excel expertise, SQL, CFA preferred. Support investment banking team in ${userLocation}.`,
        applyLink: `https://www.glassdoor.com/job-listing/financial-analyst-${encodeURIComponent(userLocation).toLowerCase()}-morgan-stanley-jl.htm`,
        salary: '$60k - $80k',
        posted: '3 days ago',
        remote: userLocation.toLowerCase().includes('remote'),
        fitScore: calculateFitScore(['excel', 'financial modeling', 'sql'], extractedSkills),
        matchingSkills: ['excel', 'financial modeling']
      }
    ];

    console.log('🎯 Generated', mockJobs.length, 'jobs for location:', userLocation); // Debug log

    return NextResponse.json({ jobs: mockJobs });
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json({ error: 'Failed to search jobs' }, { status: 500 });
  }
}

function calculateFitScore(jobSkills: string[], userSkills: string[]): number {
  if (!userSkills || userSkills.length === 0) return 70;
  
  const matchingSkills = jobSkills.filter(skill => 
    userSkills.some(userSkill => 
      userSkill.toLowerCase().includes(skill.toLowerCase()) || 
      skill.toLowerCase().includes(userSkill.toLowerCase())
    )
  );
  
  const matchPercentage = (matchingSkills.length / jobSkills.length) * 100;
  return Math.max(60, Math.min(99, Math.round(matchPercentage)));
}
