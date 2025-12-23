import { NextRequest, NextResponse } from 'next/server';
import { generateInterviewQuestions, generateInterviewTips } from '@/lib/llm';
import { saveInterviewPrep, incrementUsage } from '@/lib/firestore';
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
    const canGenerate = await checkUsageLimit(userId, 'interviewPreps', 5);
    if (!canGenerate) {
      return NextResponse.json(
        { error: 'You have reached your interview prep limit. Please upgrade your plan.' },
        { status: 403 }
      );
    }

    // Generate interview content
    const [questions, tips] = await Promise.all([
      generateInterviewQuestions(job, profile),
      generateInterviewTips(job, profile),
    ]);

    // Save prep
    const prep = {
      userId,
      job,
      questions,
      tips,
      createdAt: new Date().toISOString(),
    };

    await saveInterviewPrep(prep);
    await incrementUsage(userId, 'interviewPreps', 1);

    return NextResponse.json({ prep });
  } catch (error) {
    console.error('Interview prep error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
