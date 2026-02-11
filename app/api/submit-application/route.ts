import { NextRequest, NextResponse } from 'next/server';
import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp, cert } from 'firebase-admin/app';

// Initialize Firebase Admin (reuse from above or create helper)
const serviceAccount = {
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
};

const app = initializeApp({
  credential: cert(serviceAccount as any),
  databaseURL: `https://${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.firebaseio.com`,
});

const db = getFirestore(app);

export async function POST(request: NextRequest) {
  try {
    const { userId, jobId, jobTitle, company, applyLink, coverLetter, status = 'applied' } = await request.json();

    if (!userId || !jobTitle || !company) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const applicationRef = db.collection('applications').doc();
    await applicationRef.set({
      userId,
      jobId,
      jobTitle,
      company,
      applyLink,
      coverLetter,
      status,
      appliedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, applicationId: applicationRef.id });
  } catch (error) {
    console.error('/api/submit-application error:', error);
    return NextResponse.json({ error: 'Failed to save application' }, { status: 500 });
  }
}
