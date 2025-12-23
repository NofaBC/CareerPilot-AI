import { NextRequest, NextResponse } from 'next/server';
import { generateProfileSummary, extractSkills } from '@/lib/llm';
import { updateProfile, incrementUsage } from '@/lib/firestore';
import { checkUsageLimit } from '@/lib/usage';
import { getServerSession } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { userId, name, email, jobTitleTarget, industry, salaryRange, locationPreference, workMode, resumeText } = body;

    // Check usage limit
    const canGenerate = await checkUsageLimit(userId, 'profileGenerations', 1);
    if (!canGenerate) {
      return NextResponse.json(
        { error: 'You have reached your profile generation limit. Please upgrade your plan.' },
        { status: 403 }
      );
    }

    // Generate AI content
    const [summary, skills] = await Promise.all([
      generateProfileSummary({
        name,
        jobTitleTarget,
        industry,
        workMode,
        location: locationPreference,
        salary: salaryRange,
        resumeText,
      }),
      extractSkills(resumeText),
    ]);

    // Save to Firestore
    const profileData = {
      userId,
      name,
      email,
      jobTitleTarget,
      industry,
      salaryRange,
      locationPreference,
      workMode,
      resumeText,
      profileSummary: summary,
      skills,
      updatedAt: new Date().toISOString(),
    };

    await updateProfile(userId, profileData);
    await incrementUsage(userId, 'profileGenerations', 1);

    return NextResponse.json({ profile: profileData });
  } catch (error) {
    console.error('Profile generation error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
