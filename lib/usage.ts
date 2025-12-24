import { getUsage } from './firestore';

const PLAN_LIMITS = {
  starter: {
    profileGenerations: 2,
    jobScans: 5,
    applicationDrafts: 3,
    interviewPreps: 5,
  },
  pro: {
    profileGenerations: Number.POSITIVE_INFINITY,
    jobScans: Number.POSITIVE_INFINITY,
    applicationDrafts: Number.POSITIVE_INFINITY,
    interviewPreps: Number.POSITIVE_INFINITY,
  },
};

export async function checkUsageLimit(
  userId: string,
  action: keyof typeof PLAN_LIMITS.starter,
  freeLimit: number
): Promise<boolean> {
  const usage = await getUsage(userId);
  const userProfile = await getUserProfile(userId);
  const plan = userProfile?.subscriptionStatus === 'active' ? 'pro' : 'starter';
  const limit = PLAN_LIMITS[plan][action];

  // Pro users have unlimited
  if (limit === Number.POSITIVE_INFINITY) return true;

  // Check actual usage
  return (usage[action] || 0) < limit;
}
