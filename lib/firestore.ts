import { adminDb } from './firebase';
import { Profile, Usage } from './types';

export async function createUserDocument(user: any) {
  const userRef = adminDb.collection('users').doc(user.uid);
  const doc = await userRef.get();

  if (!doc.exists) {
    await userRef.set({
      email: user.email,
      name: user.displayName || '',
      createdAt: new Date().toISOString(),
      subscriptionStatus: 'free',
      stripeCustomerId: null,
    });
  }
}

export async function updateProfile(userId: string, profile: Partial<Profile>) {
  await adminDb.collection('profiles').doc(userId).set({
    ...profile,
    updatedAt: new Date().toISOString(),
  }, { merge: true });
}

export async function getUserProfile(userId: string): Promise<Profile | null> {
  const profileDoc = await adminDb.collection('profiles').doc(userId).get();
  if (!profileDoc.exists) return null;
  
  const userDoc = await adminDb.collection('users').doc(userId).get();
  
  return {
    userId,
    ...profileDoc.data(),
    ...userDoc.data(),
  } as Profile;
}

export async function getUsage(userId: string): Promise<Usage> {
  const usageDoc = await adminDb.collection('usage').doc(userId).get();
  
  if (!usageDoc.exists) {
    const defaultUsage: Usage = {
      userId,
      profileGenerations: 0,
      jobScans: 0,
      applicationDrafts: 0,
      interviewPreps: 0,
      lastReset: new Date().toISOString(),
    };
    await adminDb.collection('usage').doc(userId).set(defaultUsage);
    return defaultUsage;
  }

  return usageDoc.data() as Usage;
}

export async function incrementUsage(userId: string, field: keyof Usage, amount: number) {
  const usageRef = adminDb.collection('usage').doc(userId);
  await usageRef.set({
    [field]: adminDb.FieldValue.increment(amount),
    updatedAt: new Date().toISOString(),
  }, { merge: true });
}

export async function saveApplication(application: any) {
  const docRef = await adminDb.collection('applications').add({
    ...application,
    createdAt: new Date().toISOString(),
  });
  return docRef.id;
}

export async function saveInterviewPrep(prep: any) {
  await adminDb.collection('interviewPreps').add({
    ...prep,
    createdAt: new Date().toISOString(),
  });
}
