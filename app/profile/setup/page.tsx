"use client";
import React, { useState } from 'react';
// FIXED: Changed db to firestore to match your firebase.ts
import { auth, firestore } from '../../lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { Loader2, CheckCircle, Info } from 'lucide-react';

export default function ProfileSetup() {
  const [formData, setFormData] = useState({
    targetRole: '',
    location: '',
    country: '',
    experienceYears: '',
    skills: ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isDone, setIsDone] = useState(false);
  
  // English-speaking countries for better job search results
  const englishSpeakingCountries = ['United States', 'United Kingdom', 'Canada', 'Australia', 'Ireland', 'Singapore'];
  const isNonEnglishCountry = formData.country && !englishSpeakingCountries.includes(formData.country);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;
    
    setIsSaving(true);
    try {
      // FIXED: Using firestore instead of db
      await setDoc(doc(firestore, "users", auth.currentUser.uid), {
        targetRole: formData.targetRole,
        location: formData.location,
        country: formData.country,
        experienceYears: parseInt(formData.experienceYears),
        // Handle both comma and bullet point separators
        skills: formData.skills
          .split(/[,•]/)  // Split by comma OR bullet point
          .map(s => s.trim())
          .filter(s => s.length > 0),  // Remove empty strings
        updatedAt: new Date().toISOString()
      });
      setIsDone(true);
      setTimeout(() => window.location.href = '/dashboard', 2000);
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Failed to save profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isDone) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-4">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
          <h1 className="text-2xl font-bold">Profile Saved!</h1>
          <p className="text-slate-500">Redirecting you to your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
      <div className="max-w-md w-full bg-white p-10 rounded-3xl border border-slate-200 shadow-xl space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-900">Setup Your Profile</h1>
          <p className="text-slate-500 mt-2">Tell us about your career goals.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Target Role</label>
            <input 
              required
              placeholder="e.g. Software Engineer or Registered Nurse"
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.targetRole}
              onChange={(e) => setFormData({...formData, targetRole: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Country</label>
            <select
              required
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.country}
              onChange={(e) => setFormData({...formData, country: e.target.value})}
            >
              <option value="">Select your country</option>
              <option value="United States">🇺🇸 United States</option>
              <option value="United Kingdom">🇬🇧 United Kingdom</option>
              <option value="Canada">🇨🇦 Canada</option>
              <option value="Australia">🇦🇺 Australia</option>
              <option value="Ireland">🇮🇪 Ireland</option>
              <option value="Singapore">🇸🇬 Singapore</option>
              <option value="Germany">🇩🇪 Germany (Limited Support)</option>
              <option value="France">🇫🇷 France (Limited Support)</option>
              <option value="Netherlands">🇳🇱 Netherlands (Limited Support)</option>
              <option value="Spain">🇪🇸 Spain (Limited Support)</option>
              <option value="Italy">🇮🇹 Italy (Limited Support)</option>
              <option value="India">🇮🇳 India (Limited Support)</option>
              <option value="UAE">🇦🇪 UAE (Limited Support)</option>
              <option value="Other">🌍 Other (Limited Support)</option>
            </select>
            
            {/* English-only warning for non-English countries */}
            {isNonEnglishCountry && (
              <div className="mt-3 bg-yellow-50 border border-yellow-200 rounded-xl p-3">
                <div className="flex items-start gap-2">
                  <Info className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-yellow-800">
                      <strong className="font-semibold">Note:</strong> CareerPilot AI currently supports English-language job searches only. 
                      Job availability may be limited in non-English-speaking countries. For best results, consider searching in 
                      English-speaking countries (US, UK, Canada, Australia).
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">City / Region</label>
            <input 
              required
              placeholder="e.g. London, Toronto, or Sydney"
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Years Experience</label>
            <input 
              required
              type="number"
              placeholder="12"
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.experienceYears}
              onChange={(e) => setFormData({...formData, experienceYears: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Key Skills</label>
            <p className="text-xs text-slate-500">List your main technical skills, separated by commas (e.g., React, Node.js, TypeScript, AWS)</p>
            <textarea 
              required
              rows={4}
              placeholder="React, Node.js, TypeScript, MongoDB, AWS, Docker, GraphQL"
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none resize-none"
              value={formData.skills}
              onChange={(e) => setFormData({...formData, skills: e.target.value})}
            />
          </div>

          <button 
            type="submit"
            disabled={isSaving}
            className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg flex items-center justify-center gap-2"
          >
            {isSaving ? <Loader2 className="animate-spin w-5 h-5" /> : "Complete Setup"}
          </button>
        </form>
      </div>
    </div>
  );
}
