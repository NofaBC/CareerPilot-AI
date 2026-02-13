'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-hooks';

export default function DebugPage() {
  const { user } = useAuth();
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testDebug = async () => {
    if (!user) {
      alert('Please sign in first');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/debug-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.uid }),
      });

      const data = await response.json();
      setResult(data);
      console.log('Debug result:', data);
    } catch (error) {
      console.error('Debug failed:', error);
      setResult({ error: String(error) });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Debug Profile & API</h1>
        
        <div className="bg-white rounded-lg p-6 shadow mb-6">
          <p className="mb-4">
            <strong>User ID:</strong> {user?.uid || 'Not signed in'}
          </p>
          
          <button
            onClick={testDebug}
            disabled={loading || !user}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? 'Testing...' : 'Test Profile Access'}
          </button>
        </div>

        {result && (
          <div className="bg-white rounded-lg p-6 shadow">
            <h2 className="text-xl font-bold mb-4">Results:</h2>
            <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
