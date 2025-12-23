import { NextRequest, NextResponse } from 'next/server';
import { findJobMatches as findMatches } from '@/lib/jobSources';
import { incrementUsage } from '@/lib/firestore';
import { checkUsageLimit } from '@/lib/usage';
import { getServerSession } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { userId, preferences } = body;

    // Check usage limit (5 job scans for starter, unlimited for pro)
    const canScan = await checkUsageLimit(userId, 'jobScans', 5);
    if (!canScan) {
      return NextResponse.json(
        { error: 'You have reached your job scan limit. Please upgrade to Pro for unlimited scans.' },
        { status: 403 }
      );
    }

    // Find matches (stubbed or real API)
    const jobs = await findMatches(preferences);

    // Increment usage
    await incrementUsage(userId, 'jobScans', 1);

    return NextResponse.json({ jobs });
  } catch (error) {
    console.error('Job matching error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
