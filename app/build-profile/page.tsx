'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-hooks';
import { firestore } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { FiUser, FiTarget, FiMapPin, FiDollarSign, FiSave } from 'react-icons/fi';
import { extractProfileFromResume, updateExtractedProfileData } from '@/lib/profile-service';

export default function BuildProfilePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    resume: '',
    targetRole: '',
    location: '',
    minSalary: '',
    maxSalary: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert('Please sign in to create a profile');
      return;
    }

    setLoading(true);
    try {
      // 1. Save basic profile
      await setDoc(doc(firestore, 'users', user.uid, 'profile', 'main'), {
        ...formData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      // 2. AI Extract skills from resume
      const extractedData = await extractProfileFromResume(user.uid, formData.resume);
      
      // 3. Save extracted data
      await updateExtractedProfileData(user.uid, extractedData);

      router.push('/dashboard');
    } catch (error) {
      console.error('Error saving profile:', error);
      alert(`Failed to save profile: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">

  

      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center">
          <FiUser className="w-10 h-10 mr-3 text-blue-600" />
          Build Your Career Profile
        </h1>
        <p className="text-gray-600 text-lg">
          Tell us about yourself so our AI can find the perfect job matches for you.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 rounded-xl shadow-lg border border-gray-200">
        {/* Resume/Bio Section */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
            <FiSave className="w-6 h-6 mr-2 text-blue-600" />
            Your Background
          </h2>
          <label className="block text-sm font-medium text-gray-700">
            Paste your resume, LinkedIn bio, or work experience
            <span className="text-red-500 ml-1">*</span>
          </label>
          <textarea
            value={formData.resume}
            onChange={(e) => handleChange('resume', e.target.value)}
            className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Full Stack Developer with 5 years experience in React, Node.js, and TypeScript..."
            required
          />
         
