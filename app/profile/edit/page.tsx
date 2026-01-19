"use client";
import React, { useState, useEffect } from 'react';
import { auth, firestore } from '../../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { Loader2, CheckCircle, ArrowLeft } from 'lucide-react';

export default function EditProfile() {
  const [formData, setFormData] = useState({
    targetRole: '',
    location: '',
    experienceYears: '',
    skills: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docSnap = await getDoc(doc(firestore, "users", user.uid));
        if (docSnap.exists()) {
          const data = docSnap.data();
          setFormData({
            targetRole: data.targetRole || '',
            location: data.location || '',
            experienceYears: data.experienceYears?.toString() || '',
            skills: data.skills?.join(', ') || ''
          });
        }
        setIsLoading(false);
      } else {
        window.location.href = '/login';
      }
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
        experienceYears: parseInt(formData.experienceYears),
        skills: formData.skills.split(',').map(s => s.trim()),
        updatedAt: new Date().toISOString()
      });
      setIsDone(true);
      setTimeout(() => window.location.href = '/dashboard', 1500);
    } catch (error) {
      alert("Error saving profile");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin w-10 h-10 text-blue-600" /></div>;

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-md mx-auto bg-white p-10 rounded-3xl border border-slate-200 shadow-xl space-y-8">
        <button onClick={() => window.location.href = '/dashboard'} className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-bold">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>
        <h1 className="text-3xl font-bold">Edit Profile</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Target Role</label>
            <input required className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl" value={formData.targetRole} onChange={(e) => setFormData({...formData, targetRole: e.target.value})} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Location</label>
            <input required className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Years Exp.</label>
              <input required type="number" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl" value={formData.experienceYears} onChange={(e) => setFormData({...formData, experienceYears: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Skills</label>
              <input required className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl" value={formData.skills} onChange={(e) => setFormData({...formData, skills: e.target.value})} />
            </div>
          </div>
          <button type="submit" disabled={isSaving} className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all">
            {isSaving ? <Loader2 className="animate-spin w-5 h-5 mx-auto" /> : isDone ? "Saved!" : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}
