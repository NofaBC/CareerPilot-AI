"use client";
import React, { useState, useEffect } from 'react';
import { auth, firestore } from '../../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { Loader2, ArrowLeft, Info, AlertTriangle, X, Sparkles } from 'lucide-react';

export default function EditProfile() {
  const [formData, setFormData] = useState({ targetRole: '', location: '', country: '', experienceYears: '', skills: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [originalCountry, setOriginalCountry] = useState('');
  const [isExtractingSkills, setIsExtractingSkills] = useState(false);
  
  // English-speaking countries for better job search results
  const englishSpeakingCountries = ['United States', 'United Kingdom', 'Canada', 'Australia', 'Ireland', 'Singapore'];
  const isNonEnglishCountry = formData.country && !englishSpeakingCountries.includes(formData.country);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docSnap = await getDoc(doc(firestore, "users", user.uid));
        if (docSnap.exists()) {
          const data = docSnap.data();
          const country = data.country || '';
          setFormData({
            targetRole: data.targetRole || '',
            location: data.location || '',
            country: country,
            experienceYears: data.experienceYears?.toString() || '',
            skills: data.skills?.join(', ') || ''
          });
          setOriginalCountry(country);
        }
        setIsLoading(false);
      } else { window.location.href = '/login'; }
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;
    
    // Show confirmation modal if changing to non-English country
    const isChangingToNonEnglish = formData.country !== originalCountry && isNonEnglishCountry;
    if (isChangingToNonEnglish) {
      setShowConfirmModal(true);
      return;
    }
    
    await saveProfile();
  };
  
  const saveProfile = async () => {
    setIsSaving(true);
    try {
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
      window.location.href = '/dashboard';
    } catch (error) { alert("Error saving profile"); }
    finally { setIsSaving(false); }
  };
  
  const handleConfirmProceed = async () => {
    setShowConfirmModal(false);
    await saveProfile();
  };
  
  const handleExtractSkills = async () => {
    if (!formData.skills || formData.skills.trim().length === 0) {
      alert('Please enter some text describing your skills first');
      return;
    }
    
    setIsExtractingSkills(true);
    try {
      const response = await fetch('/api/extract-skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: formData.skills })
      });
      
      const data = await response.json();
      
      if (data.skills && data.skills.length > 0) {
        setFormData({ ...formData, skills: data.skills.join(', ') });
      } else {
        alert('Could not extract skills. Please enter skills manually.');
      }
    } catch (error) {
      console.error('Skill extraction error:', error);
      alert('Failed to extract skills. Please try again.');
    } finally {
      setIsExtractingSkills(false);
    }
  };
  
  // Parse and preview skills
  const parseSkills = (skillsText: string): string[] => {
    return skillsText
      .split(/[,•]/)  
      .map(s => s.trim())
      .filter(s => s.length > 0 && s.length < 100);
  };
  
  const skillsParsed = parseSkills(formData.skills);
  const isParagraphFormat = formData.skills.length > 100 && skillsParsed.length < 3;

  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin w-10 h-10 text-blue-600" /></div>;

  return (
    <>
    {/* Geographic Limitation Confirmation Modal */}
    {showConfirmModal && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4 relative animate-in fade-in zoom-in duration-200">
          {/* Close button */}
          <button
            onClick={() => setShowConfirmModal(false)}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          {/* Warning icon */}
          <div className="flex justify-center">
            <div className="bg-amber-100 rounded-full p-3">
              <AlertTriangle className="w-8 h-8 text-amber-600" />
            </div>
          </div>
          
          {/* Content */}
          <div className="text-center space-y-3">
            <h2 className="text-xl font-bold text-slate-900">
              Limited Support for {formData.country}
            </h2>
            <div className="text-sm text-slate-600 space-y-2 text-left">
              <p>
                <strong className="text-slate-900">Important:</strong> CareerPilot AI works best in English-speaking countries (US, UK, Canada, Australia, Ireland, Singapore).
              </p>
              <p>
                In <strong>{formData.country}</strong>, you may experience:
              </p>
              <ul className="list-disc list-inside space-y-1 pl-2">
                <li>Very limited or zero job listings</li>
                <li>Jobs primarily from English-speaking companies</li>
                <li>All resumes and cover letters in English only</li>
              </ul>
              <p className="text-amber-700 font-medium">
                We recommend selecting an English-speaking country for the best experience.
              </p>
            </div>
          </div>
          
          {/* Action buttons */}
          <div className="space-y-2 pt-2">
            <button
              onClick={() => setShowConfirmModal(false)}
              className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
            >
              ← Change Country
            </button>
            <button
              onClick={handleConfirmProceed}
              disabled={isSaving}
              className="w-full py-3 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSaving ? (
                <>
                  <Loader2 className="animate-spin w-4 h-4" />
                  Saving...
                </>
              ) : (
                'I Understand, Continue Anyway'
              )}
            </button>
          </div>
          
          <p className="text-xs text-slate-400 text-center pt-2">
            You can change this anytime in Settings
          </p>
        </div>
      </div>
    )}
    
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-md mx-auto bg-white p-10 rounded-3xl border border-slate-200 shadow-xl space-y-8">
        <button onClick={() => window.location.href = '/dashboard'} className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-bold"><ArrowLeft className="w-4 h-4" /> Back</button>
        <h1 className="text-3xl font-bold">Edit Profile</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Target Role</label>
            <input placeholder="e.g. Software Engineer" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl" value={formData.targetRole} onChange={(e) => setFormData({...formData, targetRole: e.target.value})} required />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Country</label>
            <select
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.country}
              onChange={(e) => setFormData({...formData, country: e.target.value})}
              required
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
            <input placeholder="e.g. London, Toronto, or Sydney" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} required />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Years Experience</label>
            <input placeholder="Years" type="number" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl" value={formData.experienceYears} onChange={(e) => setFormData({...formData, experienceYears: e.target.value})} required />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Key Skills</label>
            <textarea 
              placeholder="e.g., Patient Care, Staff Coordination, Quality Improvement, EMR Systems" 
              rows={4} 
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl resize-none" 
              value={formData.skills} 
              onChange={(e) => setFormData({...formData, skills: e.target.value})} 
              required 
            />
            
            {/* Helper text and examples */}
            <div className="text-xs text-slate-500 space-y-1">
              <p>💡 <strong>Tip:</strong> List specific skills separated by commas</p>
              <p className="pl-5">Examples: JavaScript, React, Node.js, AWS • Nursing, Patient Care, EMR • Excel, Data Analysis</p>
            </div>
            
            {/* Paragraph format warning + AI extract button */}
            {isParagraphFormat && (
              <div className="mt-2 bg-blue-50 border border-blue-200 rounded-xl p-3">
                <div className="flex items-start gap-2">
                  <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs text-blue-800 mb-2">
                      <strong>Detected paragraph format.</strong> For best job matching results, use comma-separated skills instead.
                    </p>
                    <button
                      type="button"
                      onClick={handleExtractSkills}
                      disabled={isExtractingSkills}
                      className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isExtractingSkills ? (
                        <>
                          <Loader2 className="w-3 h-3 animate-spin" />
                          Extracting...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3 h-3" />
                          Extract Skills with AI
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Real-time skill preview badges */}
            {skillsParsed.length > 0 && !isParagraphFormat && (
              <div className="mt-2">
                <p className="text-xs font-semibold text-slate-600 mb-1.5">Preview ({skillsParsed.length} skills):</p>
                <div className="flex flex-wrap gap-1.5">
                  {skillsParsed.slice(0, 10).map((skill, idx) => (
                    <span key={idx} className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full font-medium">
                      {skill}
                    </span>
                  ))}
                  {skillsParsed.length > 10 && (
                    <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-full font-medium">
                      +{skillsParsed.length - 10} more
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
          
          <button type="submit" disabled={isSaving} className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold">{isSaving ? "Saving..." : "Save Changes"}</button>
        </form>
      </div>
    </div>
    </>
  );
}
