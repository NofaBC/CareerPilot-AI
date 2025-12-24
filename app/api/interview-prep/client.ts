export async function generateInterviewPrep(data: any): Promise<any> {
  const response = await fetch('/api/interview-prep', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || 'Interview prep generation failed');
  }

  return result.prep;
}
