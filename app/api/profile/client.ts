import { Profile } from '@/lib/types';

export async function generateProfile(data: any): Promise<Profile> {
  const response = await fetch('/api/profile', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || 'Profile generation failed');
  }

  return result.profile;
}
