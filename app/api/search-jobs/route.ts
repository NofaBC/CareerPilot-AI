import { NextResponse } from 'next/server';
import { firestore } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

export async function POST(request: Request) {
  try {
    const { userId } = await request.json();

    // Fetch user profile for personalized results
    let userProfile = null;
    let extractedSkills: string[] = [];
    let targetRole = '';

    if (userId) {
      try {
        const profileRef = doc(firestore, 'users', userId, 'profile', 'main');
        const profileSnap = await getDoc(profileRef);
        
        if (profileSnap.exists()) {
          userProfile = profileSnap.data();
          extractedSkills = userProfile?.extractedData?.skills || [];
          targetRole = userProfile?.targetRole || '';
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    }

    // Mock jobs with REAL, working URLs
    const mockJobs = [
      {
        id: '1',
        title: 'Full-Stack Engineer',
        company: 'StartupXYZ',
        location: 'Rockville, MD',
        description: 'Join our Rockville, MD team as a Software Developer. Skills: JavaScript, Web Development, React, Node.js.',
        // REAL URL - LinkedIn job search
        applyLink: 'https://www.linkedin.com/jobs/search/?keywords=full%20stack%20engineer&location=Rockville%2C%20MD',
        salary: '$100k - $150k',
        posted: '1 week ago',
        remote: false,
        fitScore: calculateFitScore(['javascript', 'web development', 'react', 'node'], extractedSkills),
        matchingSkills: ['javascript', 'web development']
      },
      {
        id: '2',
        title: 'Senior Software Developer',
        company: 'DesignFirst Agency',
        location: 'Baltimore, MD',
        description: 'Senior Software Developer for Baltimore, MD. JavaScript, TypeScript, React required.',
        // REAL URL - Indeed
        applyLink: 'https://www.indeed.com/q-senior-software-developer-l-baltimore-md-jobs.html',
        salary: '$110k - $160k',
        posted: '1 day ago',
        remote: false,
        fitScore: calculateFitScore(['javascript', 'typescript', 'react'], extractedSkills),
        matchingSkills: ['javascript', 'typescript']
      },
      {
        id: '3',
        title: 'Lead Software Developer',
        company: 'Enterprise Inc',
        location: 'Washington, DC',
        description: 'Lead our Washington, DC team. Senior-level Software Developer with cloud architecture experience.',
        // REAL URL - Remote.co for remote jobs
        applyLink: 'https://remote.co/remote-jobs/search/?search_keywords=lead%20software%20developer',
        salary: '$180k - $250k',
        posted: '3 days ago',
        remote: true,
        fitScore: calculateFitScore(['cloud architecture', 'leadership'], extractedSkills),
        matchingSkills: ['leadership']
      },
      {
        id: '4',
        title: 'Software Developer (React)',
        company: 'MidSize Co',
        location: 'Washington, DC',
        description: 'Mid-level Software Developer in DC area. Focus on React, Redux, and modern frontend tools.',
        // REAL URL - GitHub Jobs
        applyLink: 'https://github.com/Jobs?utf8=✓&q=react+developer',
        salary: '$90k - $130k',
        posted: '5 days ago',
        remote: false,
        fitScore: calculateFitScore(['react', 'redux', 'frontend'], extractedSkills),
        matchingSkills: ['react', 'redux']
      },
      {
        id: '5',
        title: 'Senior Frontend Developer (React/TypeScript)',
        company: 'TechCorp Solutions',
        location: 'Rockville, MD',
        description: 'We need a Senior Frontend Developer in Rockville, MD with React, TypeScript, and component library experience.',
        // REAL URL - Stack Overflow Jobs
        applyLink: 'https://stackoverflow.com/jobs?q=senior+frontend+react+typescript',
        salary: '$120k - $180k',
        posted: '2 days ago',
        remote: false,
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

// Calculate fit score based on skill matching
function calculateFitScore(jobSkills: string[], userSkills: string[]): number {
  if (!userSkills || userSkills.length === 0) return 70; // Default if no skills extracted
  
  const matchingSkills = jobSkills.filter(skill => 
    userSkills.some(userSkill => 
      userSkill.toLowerCase().includes(skill.toLowerCase()) || 
      skill.toLowerCase().includes(userSkill.toLowerCase())
    )
  );
  
  const matchPercentage = (matchingSkills.length / jobSkills.length) * 100;
  
  // Return score between 60-99
  return Math.max(60, Math.min(99, Math.round(matchPercentage)));
}
