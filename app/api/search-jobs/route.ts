import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';

// Helper function to check for common skill variations
function checkSkillVariations(skill: string, jobText: string): boolean {
  const variations: Record<string, string[]> = {
    // Hospitality & Customer Service
    'hospitality': ['hotel', 'guest service', 'front desk', 'concierge'],
    'customer service': ['guest service', 'client service', 'customer care', 'customer support'],
    'reception': ['receptionist', 'front desk', 'front office'],
    
    // Management & Leadership
    'management': ['manager', 'lead', 'supervisor', 'director'],
    'leadership': ['team lead', 'supervisor', 'manager'],
    'staff coordination': ['team coordination', 'staff management', 'staff supervision'],
    
    // General Skills
    'communication': ['interpersonal', 'verbal', 'written'],
    'organization': ['organizational', 'scheduling', 'planning'],
    'microsoft office': ['ms office', 'word', 'excel', 'powerpoint'],
    
    // Healthcare & Nursing
    'patient care': ['bedside care', 'clinical care', 'patient safety', 'direct patient care'],
    'nursing': ['rn', 'registered nurse', 'nurse', 'clinical nursing'],
    'quality improvement': ['quality assurance', 'qa', 'process improvement', 'continuous improvement'],
    'emr': ['electronic medical records', 'ehr', 'electronic health records', 'medical records'],
    'acute care': ['critical care', 'icu', 'intensive care'],
    'care planning': ['care coordination', 'treatment planning', 'patient planning'],
    'shift management': ['shift coordination', 'shift scheduling', 'shift supervision'],
    'medical surgical': ['med surg', 'medical-surgical', 'medsurg'],
    'rehabilitation': ['rehab', 'physical therapy', 'occupational therapy'],
    
    // Trade Skills - Plumbing
    'plumbing': ['plumber', 'pipe', 'piping'],
    'pipe installation': ['piping', 'pipe fitting', 'pipefitter'],
    'plumbing repair': ['plumbing maintenance', 'pipe repair', 'fixture repair'],
    'water heater': ['water heater installation', 'tankless', 'boiler'],
    'drain systems': ['drainage', 'sewer', 'waste systems'],
    'gas piping': ['gas line', 'gas fitting', 'natural gas'],
    'leak detection': ['leak repair', 'water leak', 'pipe leak'],
    'fixture installation': ['plumbing fixtures', 'sink', 'toilet', 'faucet'],
    'code compliance': ['building codes', 'plumbing codes', 'compliance'],
    'blueprint reading': ['blueprints', 'technical drawings', 'plans'],
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
    
    // Robust skill handling - ensure it's always an array
    let skills: string[] = [];
    if (Array.isArray(profile?.skills)) {
      skills = profile.skills;
    } else if (typeof profile?.skills === 'string') {
      // If skills is a string, split it
      skills = profile.skills.split(/[,•]/).map((s: string) => s.trim()).filter((s: string) => s.length > 0);
    }
    
    console.log('🔍 Searching jobs for:', { 
      searchQuery, 
      skillsType: typeof profile?.skills,
      skillsIsArray: Array.isArray(profile?.skills),
      skillsRaw: profile?.skills,
      skillsParsed: skills,
      skillsCount: skills.length 
    });

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
    console.log('🌍 Search query sent to JSearch:', searchQuery);
    console.log('🔍 JSearch response status:', response.status);
    
    // If no jobs found, log detailed info for debugging
    if (jobs.length === 0) {
      console.warn('⚠️ No jobs found for query:', {
        searchQuery,
        location,
        country: profile?.country,
        city: profile?.location,
        targetRole: profile?.targetRole
      });
      
      // Return helpful message to user
      return NextResponse.json({ 
        jobs: [],
        message: `No jobs found for "${profile?.targetRole}" in ${profile?.location}. This could mean: (1) JSearch API has limited coverage for this role/location, (2) Try a broader search term (e.g., "Plumber" instead of "Master Plumber"), or (3) Check back later as new jobs are added daily.`
      });
    }

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
      
      // Log detailed skill matching for all jobs
      console.log(`🔍 Job ${index + 1}: "${jobTitle}"`, {
        company: job.employer_name,
        userSkills: skills,
        userSkillsCount: skills.length,
        jobSkills: jobSkills,
        matchingSkills,
        matchingCount: matchingSkills.length,
        baseScore: Math.round((matchingSkills.length / skills.length) * 100),
        titleMatchBonus: (targetRoleLower && jobTitle.toLowerCase().includes(targetRoleLower)) ? 20 : 0,
        finalFitScore: fitScore,
        targetRole: profile?.targetRole
      });

      // Format posted date - use ISO format for international compatibility
      let postedDate = 'Date not available';
      if (job.job_posted_at_datetime_utc) {
        try {
          const date = new Date(job.job_posted_at_datetime_utc);
          if (!isNaN(date.getTime())) {
            // Use consistent format for all dates
            const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' };
            postedDate = date.toLocaleDateString('en-US', options); // Consistent format
          }
        } catch (e) {
          // If date parsing fails, show nothing instead of 'Recent'
          postedDate = 'Date not available';
        }
      } else if (job.job_posted_at_timestamp) {
        // Fallback: Try timestamp if datetime not available
        try {
          const date = new Date(job.job_posted_at_timestamp * 1000);
          if (!isNaN(date.getTime())) {
            const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' };
            postedDate = date.toLocaleDateString('en-US', options);
          }
        } catch (e) {
          postedDate = 'Date not available';
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
        totalSkills: skills.length,
        matchingCount: matchingSkills.length,
        fitExplanation: matchingSkills.length > 0 
          ? `Matched ${matchingSkills.length}/${skills.length} skills`
          : 'No matching skills found',
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
