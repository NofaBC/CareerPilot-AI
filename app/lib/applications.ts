import { firestore } from '@/lib/firebase';
import { collection, addDoc, doc, updateDoc, query, where, getDocs, Timestamp } from 'firebase/firestore';

export type ApplicationStatus = 'applied' | 'screening' | 'interview' | 'offer' | 'rejected';

export interface Application {
  id?: string;
  userId: string;
  jobId: string;
  jobTitle: string;
  company: string;
  location?: string;
  applyLink: string;
  status: ApplicationStatus;
  appliedAt: Date;
  notes?: string;
  salary?: string;
  remote?: boolean;
}

// Track a new application
export async function trackApplication(userId: string, jobData: Omit<Application, 'id' | 'userId' | 'appliedAt'>) {
  try {
    const appData = {
      ...jobData,
      userId,
      appliedAt: new Date(),
      status: 'applied' as ApplicationStatus,
    };
    
    const docRef = await addDoc(collection(firestore, 'applications'), appData);
    return docRef.id;
  } catch (error) {
    console.error('Error tracking application:', error);
    throw error;
  }
}

// Get user's applications
export async function getUserApplications(userId: string) {
  try {
    const q = query(
      collection(firestore, 'applications'),
      where('userId', '==', userId)
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      appliedAt: doc.data().appliedAt?.toDate(),
    })) as Application[];
  } catch (error) {
    console.error('Error fetching applications:', error);
    return [];
  }
}

// Update application status
export async function updateApplicationStatus(appId: string, status: ApplicationStatus) {
  try {
    await updateDoc(doc(firestore, 'applications', appId), {
      status,
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error('Error updating application:', error);
    throw error;
  }
}
