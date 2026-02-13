import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();
    
    if (!userId) {
      return NextResponse.json({ error: 'userId required' }, { status: 400 });
    }

    // Check if Firebase Admin is initialized
    console.log('🔍 Checking Firebase Admin...');
    
    // Check environment variables
    const envCheck = {
      hasProjectId: !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      hasPrivateKey: !!process.env.FIREBASE_PRIVATE_KEY,
      hasClientEmail: !!process.env.FIREBASE_CLIENT_EMAIL,
      hasJSearchKey: !!process.env.JSEARCH_API_KEY,
      hasOpenAIKey: !!process.env.OPENAI_API_KEY,
    };

    console.log('Environment check:', envCheck);

    // Try to fetch user profile
    let profileData = null;
    let profileError = null;

    try {
      const userDoc = await db.collection('users').doc(userId).get();
      
      if (userDoc.exists) {
        profileData = userDoc.data();
        console.log('✅ Profile found:', profileData);
      } else {
        profileError = 'Profile document does not exist';
        console.log('❌ Profile not found');
      }
    } catch (err: any) {
      profileError = err.message;
      console.error('❌ Error fetching profile:', err);
    }

    return NextResponse.json({
      success: true,
      envCheck,
      profile: profileData,
      profileError,
      userId,
    });
  } catch (error: any) {
    console.error('❌ Debug endpoint error:', error);
    return NextResponse.json({ 
      error: error.message,
      stack: error.stack 
    }, { status: 500 });
  }
}
