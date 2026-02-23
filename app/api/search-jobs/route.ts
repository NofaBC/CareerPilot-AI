import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';

// Helper function to check for common skill variations
function checkSkillVariations(skill: string, jobText: string): boolean {
  const variations: Record<string, string[]> = {
    'hospitality': ['hotel', 'guest service', 'front desk', 'concierge'],
    'customer service': ['guest service', 'client service', 'customer care', 'customer support'],
    'reception': ['receptionist', 'front desk', 'front office'],
    'management': ['manager', 'lead', 'supervisor', 'director'],
    'communication': ['interpersonal', 'verbal', 'written'],
    'organization': ['organizational', 'scheduling', 'planning'],
    'microsoft office': ['ms office', 'word', 'excel', 'powerpoint'],
    'leadership': ['team lead', 'supervisor', 'manager'],
  };
  
  // Check if skill has variations and if any appear in job text
  const skillVariations = variations[skill] || [];
  return skillVariations.some(variation => jobText.includes(variation));
}

export async function POST(request: NextRequest) {
  try {
    // 1. Get userId from request body
    const { userId } = await request.json();
    if (!userId) {
      return NextResponse.json({ error: 'userId required' }, { status: 400 });
    }

    // 2. Fetch user profile from Firestore
    const userDoc = await db.collection('users').doc(userId).get();
    if (!userDoc.exists) {
      return NextResponse.json({ error: 'User profile not found. Please complete your profile setup first.' }, { status: 404 });
    }

    const profile = userDoc.data();
    // Combine city and country for better international job search
    const location = profile?.country 
      ? `${profile?.location || ''}, ${profile?.country}`.trim()
      : (profile?.location || 'remote');
    const searchQuery = `${profile?.targetRole || 'software engineer'} in ${location}`;
    const skills = profile?.skills || [];
    
    console.log('🔍 Searching jobs for:', { searchQuery, skills });

    // 3. Check if API key exists
    if (!process.env.JSEARCH_API_KEY) {
      console.error('❌ JSEARCH_API_KEY not configured');
      return NextResponse.json({ 
        error: 'Job search service not configured. Please contact support.',
        jobs: [] 
      }, { status: 500 });
    }

    // 4. Call JSearch API
    const jsearchUrl = `https://jsearch.p.rapidapi.com/search?query=${encodeURIComponent(searchQuery)}&page=1&num_pages=1`;
    const response = await fetch(jsearchUrl, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': process.env.JSEARCH_API_KEY,
        'X-RapidAPI-Host': 'jsearch.p.rapidapi.com',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ JSearch API error:', response.status, errorText);
      return NextResponse.json({ 
        error: `Job search failed: ${response.status}`,
        jobs: [] 
      }, { status: 500 });
    }

    const data = await response.json();
    const jobs = data.data || [];
    
    console.log(`✅ Found ${jobs.length} jobs from JSearch`);
    console.log('📊 User skills:', skills.length, 'skills');

    // 5. Calculate fit scores based on skills match
    const scoredJobs = jobs.map((job: any, index: number) => {
      // Extract job skills from the JSearch response
      const jobSkills = job.job_required_skills || [];
      const jobTitle = job.job_title || '';
      const jobDescription = job.job_description || '';
      
      // Combine all job text for matching
      const jobText = `${jobTitle} ${jobDescription}`.toLowerCase();
      
      // Find matching skills with more flexible matching
      const matchingSkills = skills.filter((userSkill: string) => {
        const skillLower = userSkill.toLowerCase().trim();
        if (!skillLower || skillLower.length < 2) return false;
        
        // Match if:
        // 1. Skill appears in job required skills array (case-insensitive)
        const inJobSkills = jobSkills.some((jobSkill: string) => {
          const jobSkillLower = jobSkill.toLowerCase();
          return jobSkillLower.includes(skillLower) || skillLower.includes(jobSkillLower);
        });
        
        // 2. Skill appears in job title or description
        const inJobText = jobText.includes(skillLower);
        
        // 3. Handle common skill variations (hospitality → hotel, customer service → guest service, etc.)
        const hasVariation = checkSkillVariations(skillLower, jobText);
        
        return inJobSkills || inJobText || hasVariation;
      });
      
      // Calculate fit score based on matching skills
      let fitScore = 0;
      if (skills.length > 0) {
        // Base score from skill matches
        fitScore = Math.round((matchingSkills.length / skills.length) * 100);
        
        // Bonus points for job title match with user's target role
        const targetRoleLower = profile?.targetRole?.toLowerCase() || '';
        if (targetRoleLower && jobTitle.toLowerCase().includes(targetRoleLower)) {
          fitScore = Math.min(100, fitScore + 20);
        }
      } else {
        fitScore = 50; // Default if no skills provided
      }
      
      // Log first job for debugging
      if (index === 0) {
        console.log('🔍 Fit Score Debug (First Job):', {
          jobTitle,
          userSkills: skills,
          jobSkills: jobSkills.slice(0, 5),
          matchingSkills,
          fitScore,
          targetRole: profile?.targetRole
        });
      }

      // Format posted date - use ISO format for international compatibility
      let postedDate = 'Recent';
      if (job.job_posted_at_datetime_utc) {
        try {
          const date = new Date(job.job_posted_at_datetime_utc);
          if (!isNaN(date.getTime())) {
            // Use ISO-like format that's universally understood
            const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' };
            postedDate = date.toLocaleDateString(undefined, options); // undefined uses user's locale
          }
        } catch (e) {
          postedDate = 'Recent';
        }
      }

      return {
        id: job.job_id,
        title: job.job_title,
        company: job.employer_name,
        location: job.job_city 
          ? `${job.job_city}${job.job_state ? ', ' + job.job_state : ''}`
          : 'Remote',
        description: job.job_description?.slice(0, 300) + '...',
        applyLink: job.job_apply_link,
        salary: job.job_salary?.min ? `${job.job_salary.currency || ''} ${job.job_salary.min.toLocaleString()} - ${job.job_salary.max?.toLocaleString() || ''}`.trim() : 'Not disclosed',
        fitScore,
        matchingSkills: matchingSkills.slice(0, 5),
        posted: postedDate,
      };
    }).sort((a: any, b: any) => b.fitScore - a.fitScore).slice(0, 10); // Top 10

    return NextResponse.json({ jobs: scoredJobs });
  } catch (error: any) {
    console.error('❌ /api/search-jobs error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error.message,
      stack: error.stack 
    }, { status: 500 });
  }
}
