import { NextRequest, NextResponse } from 'next/server';

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
}

export async function POST(request: NextRequest) {
  try {
    const { query, location, remote } = await request.json();
    
    // TODO: Integrate with real job search API (Google Jobs, LinkedIn, Indeed)
    // For now, return realistic mock data based on the query
    
    const mockJobs: Job[] = [
      {
        id: 'job-1',
        title: 'Senior Frontend Developer (React/TypeScript)',
        company: 'TechCorp Solutions',
        location: remote ? 'Remote' : location || 'United States',
        description: `We are looking for an experienced frontend developer with 5+ years in ${query || 'React and TypeScript'}. Experience with Next.js, performance optimization, and component architecture is preferred. You will lead feature development and mentor junior developers in a collaborative environment.`,
        applyLink: 'https://example.com/apply/1',
        salary: '$120k - $180k',
        remote: true,
        posted: '2 days ago',
      },
      {
        id: 'job-2',
        title: 'Full-Stack Engineer',
        company: 'StartupXYZ',
        location: 'New York, NY',
        description: 'Join our growing team as a full-stack engineer. Work with modern technologies including React, Node.js, and PostgreSQL. We value autonomy, code quality, and rapid iteration in a small, agile team.',
        applyLink: 'https://example.com/apply/2',
        salary: '$100k - $150k',
        remote: false,
        posted: '1 week ago',
      },
      {
        id: 'job-3',
        title: 'Lead Frontend Architect',
        company: 'Enterprise Inc',
        location: 'San Francisco, CA',
        description: 'Lead our frontend architecture and design system efforts. 7+ years experience required. Strong TypeScript, React, and mentoring skills essential for this senior role.',
        applyLink: 'https://example.com/apply/3',
        salary: '$180k - $250k',
        remote: true,
        posted: '3 days ago',
      },
      {
        id: 'job-4',
        title: 'Frontend Engineer (React)',
        company: 'MidSize Co',
        location: 'Austin, TX',
        description: 'Mid-level frontend engineer position focused on building user-facing features with React, TypeScript, and modern tooling. Great opportunity for growth and learning.',
        applyLink: 'https://example.com/apply/4',
        salary: '$90k - $130k',
        remote: true,
        posted: '5 days ago',
      },
      {
        id: 'job-5',
        title: 'Senior UI/UX Developer',
        company: 'DesignFirst Agency',
        location: 'Seattle, WA',
        description: 'Bridge the gap between design and development. Work closely with designers to implement pixel-perfect interfaces with React, TypeScript, and CSS-in-JS libraries.',
        applyLink: 'https://example.com/apply/5',
        salary: '$110k - $160k',
        remote: false,
        posted: '1 day ago',
      },
    ];
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return NextResponse.json({ jobs: mockJobs });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ jobs: [], error: 'Failed to search jobs' }, { status: 500 });
  }
}
