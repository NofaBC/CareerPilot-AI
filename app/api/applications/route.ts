import { NextRequest, NextResponse } from 'next/server';
import { generateCoverLetter } from '@/lib/llm';
import { saveApplication, incrementUsage } from '@/lib/firestore';
import { checkUsageLimit } from '@/lib/usage';
import { getServerSession } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { userId, job, profile } = body;

    // Check usage limit
    const canGenerate = await checkUsageLimit(userId, 'applicationDrafts', 3);
    if (!canGenerate) {
      return NextResponse.json(
        { error: 'You have reached your application draft limit. Please upgrade your plan.' },
        { status: 403 }
      );
    }

    // Generate cover letter
    const coverLetter = await generateCoverLetter(job, profile);

    // Save application draft
    const application = {
      userId,
      job,
      coverLetter,
      status: 'draft',
      createdAt: new Date().toISOString(),
    };

    const applicationId = await saveApplication(application);
    await incrementUsage(userId, 'applicationDrafts', 1);

    return NextResponse.json({ 
      application: { 
        id: applicationId, 
        ...application 
      } 
    });
  } catch (error) {
    console.error('Application generation error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
