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
        const profileRef = doc(firestore, 'users', user.uid, 'profile', 'main');
        const profileSnap = await getDoc(profileRef);
        
        if (profileSnap.exists()) {
          userProfile = profileSnap.data();
          extractedSkills = userProfile?.extractedData?.skills || [];
          userLocation = userProfile?.location || 'Rockville, MD';
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
      {
        id: '3',
        title: 'Lead Software Developer',
        company: 'Enterprise Inc',
        location: userLocation,
        description: `Lead our ${userLocation} team. Senior-level Software Developer with cloud architecture experience.`,
        applyLink: `https://remote.co/remote-jobs/search/?search_keywords=lead%20software%20developer`,
        salary: '$180k - $250k',
        posted: '3 days ago',
        remote: userLocation.toLowerCase().includes('remote'),
        fitScore: calculateFitScore(['cloud architecture', 'leadership'], extractedSkills),
        matchingSkills: ['leadership']
      },
      {
        id: '4',
        title: 'Software Developer (React)',
        company: 'MidSize Co',
        location: userLocation,
        description: `Mid-level Software Developer in ${userLocation} area. Focus on React, Redux, and modern frontend tools.`,
        applyLink: `https://github.com/Jobs?utf8=✓&q=react+developer`,
        salary: '$90k - $130k',
        posted: '5 days ago',
        remote: userLocation.toLowerCase().includes('remote'),
        fitScore: calculateFitScore(['react', 'redux', 'frontend'], extractedSkills),
        matchingSkills: ['react', 'redux']
      },
      {
        id: '5',
        title: 'Senior Frontend Developer (React/TypeScript)',
        company: 'TechCorp Solutions',
        location: userLocation,
        description: `We need a Senior Frontend Developer in ${userLocation} with React, TypeScript, and component library experience.`,
        applyLink: `https://stackoverflow.com/jobs?q=senior+frontend+react+typescript`,
        salary: '$120k - $180k',
        posted: '2 days ago',
        remote: userLocation.toLowerCase().includes('remote'),
        fitScore: calculateFitScore(['react', 'typescript', 'frontend'], extractedSkills),
        matchingSkills: ['react', 'typescript']
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
