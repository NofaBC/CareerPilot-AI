'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-hooks';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

export default function UpdateSkillsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [skills, setSkills] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;
      
      try {
        const userDoc = await getDoc(doc(firestore, 'users', user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          // Convert array back to comma-separated string
          setSkills(Array.isArray(data.skills) ? data.skills.join(', ') : '');
        }
      } catch (error) {
        console.error('Failed to load profile:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    try {
      await updateDoc(doc(firestore, 'users', user.uid), {
        skills: skills.split(',').map(s => s.trim()).filter(s => s.length > 0),
        updatedAt: new Date().toISOString()
      });
      
      alert('Skills updated successfully!');
      router.push('/dashboard');
    } catch (error) {
      console.error('Failed to update skills:', error);
      alert('Failed to update skills. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Update Your Skills</h1>
          <p className="text-gray-600 mb-6">
            List your key technical skills, separated by commas. This helps us match you with the right jobs.
          </p>

          <form onSubmit={handleSave} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Key Skills
              </label>
              <p className="text-xs text-gray-500 mb-3">
                Examples: React, Node.js, TypeScript, AWS, Docker, GraphQL, PostgreSQL, REST APIs
              </p>
              <textarea
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                rows={6}
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="React, Node.js, TypeScript, MongoDB, AWS, Docker, GraphQL, PostgreSQL, REST APIs, CI/CD"
              />
              <p className="text-xs text-gray-500 mt-2">
                Current: {skills.split(',').filter(s => s.trim().length > 0).length} skills
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">💡 Tips for Better Job Matching:</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Use specific technologies (e.g., "React" not "frontend")</li>
                <li>• Include both technical skills and tools</li>
                <li>• Keep each skill short (1-3 words)</li>
                <li>• Aim for 10-20 key skills</li>
              </ul>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
              >
                {saving ? 'Saving...' : 'Save Skills'}
              </button>
              <button
                type="button"
                onClick={() => router.push('/dashboard')}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
