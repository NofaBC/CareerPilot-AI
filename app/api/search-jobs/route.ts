import { NextResponse } from 'next/server';
import { firestore } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

export async function POST(request: Request) {
  try {
    const { userId } = await request.json();

    // Fetch user profile
    let userProfile = null;
    let extractedSkills: string[] = [];
    let targetRole = '';
    let userLocation = 'Rockville, MD'; // Default

    if (userId) {
      try {
        const profileRef = doc(firestore, 'users', userId, 'profile', 'main');
        const profileSnap = await getDoc(profileRef);
        
        if (profileSnap.exists()) {
          userProfile = profileSnap.data();
          extractedSkills = userProfile?.extractedData?.skills || [];
          targetRole = userProfile?.targetRole || '';
          userLocation = userProfile?.location || 'Rockville, MD'; // ✅ YOUR LOCATION
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    }

    // Mock jobs using YOUR location
    const mockJobs = [
      {
        id: '1',
        title: 'Full-Stack Engineer',
        company: 'StartupXYZ',
        location: userLocation, // ✅ Dynamic location
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
        location: userLocation, // ✅ Dynamic location
        description: `Senior Software Developer for ${userLocation}. JavaScript, TypeScript, React required.`,
        applyLink: `https://www.indeed.com/q-senior-software-developer-l-${encodeURIComponent(userLocation)}-jobs.html`,
        salary: '$110k - $160k',
        posted: '1 day ago',
        remote: userLocation.toLowerCase().includes('remote'),
        fitScore: calculateFitScore(['javascript', 'typescript', 'react'], extractedSkills),
        matchingSkills: ['javascript', 'typescript']
      },
      // Add similar changes for jobs 3-5...
      {
        id: '3',
        title: 'Executive Chef',
        company: 'Metropolitan Restaurant Group',
        location: userLocation,
        description: `Lead kitchen operations in ${userLocation}. Menu development, team management, cost control.`,
        applyLink: `https://www.indeed.com/q-executive-chef-l-${encodeURIComponent(userLocation)}-jobs.html`,
        salary: '$65k - $85k',
        posted: '2 days ago',
        remote: false,
        fitScore: calculateFitScore(['menu planning', 'team leadership'], extractedSkills),
        matchingSkills: ['menu planning', 'team leadership']
      }
    ];

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
