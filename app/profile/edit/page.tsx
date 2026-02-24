"use client";
import React, { useState, useEffect } from 'react';
import { auth, firestore } from '../../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { Loader2, ArrowLeft } from 'lucide-react';

export default function EditProfile() {
  const [formData, setFormData] = useState({ targetRole: '', location: '', country: '', experienceYears: '', skills: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docSnap = await getDoc(doc(firestore, "users", user.uid));
        if (docSnap.exists()) {
          const data = docSnap.data();
          setFormData({
            targetRole: data.targetRole || '',
            location: data.location || '',
            country: data.country || '',
            experienceYears: data.experienceYears?.toString() || '',
            skills: data.skills?.join(', ') || ''
          });
        }
        setIsLoading(false);
      } else { window.location.href = '/login'; }
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;
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

  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin w-10 h-10 text-blue-600" /></div>;

  return (
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
              <option value="Germany">🇩🇪 Germany</option>
              <option value="France">🇫🇷 France</option>
              <option value="Netherlands">🇳🇱 Netherlands</option>
              <option value="Spain">🇪🇸 Spain</option>
              <option value="Italy">🇮🇹 Italy</option>
              <option value="Ireland">🇮🇪 Ireland</option>
              <option value="Singapore">🇸🇬 Singapore</option>
              <option value="India">🇮🇳 India</option>
              <option value="UAE">🇦🇪 United Arab Emirates</option>
              <option value="Other">🌍 Other</option>
            </select>
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
            <textarea placeholder="Skills (comma separated)" rows={3} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl resize-none" value={formData.skills} onChange={(e) => setFormData({...formData, skills: e.target.value})} required />
          </div>
          
          <button type="submit" disabled={isSaving} className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold">{isSaving ? "Saving..." : "Save Changes"}</button>
        </form>
      </div>
    </div>
  );
}
