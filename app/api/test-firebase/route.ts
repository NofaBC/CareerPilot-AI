import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';

export async function GET(request: NextRequest) {
  try {
    console.log('Testing Firebase Admin SDK...');
    
    // Check environment variables
    const envCheck = {
      FIREBASE_PROJECT_ID: !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      FIREBASE_PRIVATE_KEY: !!process.env.FIREBASE_PRIVATE_KEY,
      FIREBASE_CLIENT_EMAIL: !!process.env.FIREBASE_CLIENT_EMAIL,
      projectIdValue: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmailValue: process.env.FIREBASE_CLIENT_EMAIL,
      privateKeyLength: process.env.FIREBASE_PRIVATE_KEY?.length || 0
    };

    console.log('Environment check:', envCheck);

    // Try to access Firestore
    const testCollection = await db.collection('users').limit(1).get();
    
    return NextResponse.json({
      success: true,
      message: 'Firebase Admin SDK connection successful',
      envCheck,
      firestoreConnected: true,
      usersCollectionExists: !testCollection.empty,
      documentCount: testCollection.size
    });

  } catch (error: any) {
    console.error('Firebase test error:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      errorCode: error.code,
      stack: error.stack,
      envCheck: {
        FIREBASE_PROJECT_ID: !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        FIREBASE_PRIVATE_KEY: !!process.env.FIREBASE_PRIVATE_KEY,
        FIREBASE_CLIENT_EMAIL: !!process.env.FIREBASE_CLIENT_EMAIL,
        projectIdValue: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        clientEmailValue: process.env.FIREBASE_CLIENT_EMAIL,
        privateKeyLength: process.env.FIREBASE_PRIVATE_KEY?.length || 0
      }
    }, { status: 500 });
  }
}
