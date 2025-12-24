import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth, adminAuth } from './firebase';
import { cookies } from 'next/headers';
import type { User } from 'firebase/auth';

// Client-side auth functions
export async function signIn(email: string, password: string) {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
}

export async function signUp(email: string, password: string, name: string) {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  return userCredential.user;
}

export async function signOut() {
  await firebaseSignOut(auth);
}

// Server-side session management
export async function getServerSession(): Promise<{ user: User | null }> {
  const cookieStore = cookies();
  const token = cookieStore.get('session')?.value;

  if (!token) {
    return { user: null };
  }

  try {
    const decodedToken = await adminAuth.verifySessionCookie(token, true);
    const user = await adminAuth.getUser(decodedToken.uid);
    return { user: user as any };
  } catch (error) {
    return { user: null };
  }
}

export function useAuth() {
  // This is a placeholder for the client-side hook
  // The actual implementation is in the AuthProvider
  throw new Error('useAuth must be used within AuthProvider');
}
