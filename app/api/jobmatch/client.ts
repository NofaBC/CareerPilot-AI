import { JobMatch } from '@/lib/types';

export async function findJobMatches(data: any): Promise<JobMatch[]> {
  const response = await fetch('/api/jobmatch', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || 'Job matching failed');
  }

  return result.jobs;
}
