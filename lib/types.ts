export interface Profile {
  userId: string;
  name: string;
  email: string;
  jobTitleTarget: string;
  industry: string;
  salaryRange?: string;
  locationPreference?: string;
  workMode: string;
  resumeText?: string;
  profileSummary?: string;
  skills: string[];
  subscriptionStatus?: 'free' | 'active' | 'canceled';
  stripeCustomerId?: string;
  updatedAt?: string;
}

export interface JobMatch {
  id: string;
  title: string;
  company: string;
  location: string;
  mode: string;
  salary: string;
  score: number;
  summary: string;
  sourceUrl: string;
  postedDate?: string;
}

export interface Usage {
  userId: string;
  profileGenerations: number;
  jobScans: number;
  applicationDrafts: number;
  interviewPreps: number;
  lastReset?: string;
}
