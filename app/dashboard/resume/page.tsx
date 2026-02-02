"use client";

import React, { useState, useEffect } from 'react';
import { auth, firestore } from '../../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { 
  FileText, Download, Sparkles, Save, ArrowLeft, Loader2, Plus, Trash2, CheckCircle2, Briefcase, MapPin, Mail
} from 'lucide-react';

export default function ResumeBuilder() {
  const [profile, setProfile] = useState<any>(null);
  const [resumeData, setResumeData] = useState<any>({
    summary: '',
    experience: [],
    education: [],
    certifications: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await fetchData(user.uid);
      } else {
        window.location.href = '/login';
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchData = async (uid: string) => {
    try {
      const profileSnap = await getDoc(doc(firestore, "users", uid));
      if (profileSnap.exists()) {
        const pData = profileSnap.data();
        setProfile(pData);
        const resumeSnap = await getDoc(doc(firestore, "resumes", uid));
        if (resumeSnap.exists()) {
          setResumeData(resumeSnap.data());
        } else {
          setResumeData({
            summary: pData.summary || "",
            experience: pData.experience || [],
            education: pData.education || [],
            certifications: pData.certifications || []
          });
        }
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!auth.currentUser) return;
    setIsSaving(true);
    try {
      await setDoc(doc(firestore, "resumes", auth.currentUser.uid), {
        ...resumeData,
        updatedAt: new Date().toISOString()
      });
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      alert("Error saving resume");
    } finally {
      setIsSaving(false);
    }
  };

  const optimizeWithAI = async () => {
    if (!profile) return;
    setIsOptimizing(true);
    try {
      const res = await fetch('/api/generate-cover-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobTitle: profile.targetRole,
          employer: "General",
          jobDescription: "Professional Resume Optimization",
          userProfile: profile,
          resumeSummary: resumeData.summary
        })
      });
      const data = await res.json();
      if (data.success) {
        const optimized = data.coverLetter.split('\n\n')[0].replace(/Dear Hiring Team at General,/, '').trim();
        setResumeData({ ...resumeData, summary: optimized });
      }
    } catch (e) { console.error(e); }
    finally { setIsOptimizing(false); }
  };

  const addExperience = () => {
    setResumeData({
      ...resumeData,
      experience: [...resumeData.experience, { company: '', role: '', duration: '', description: '' }]
    });
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin w-10 h-10 text-blue-600" /></div>;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <style jsx global>{`
        @media print {
          body { background: white !important; }
          .print\\:hidden { display: none !important; }
          .print\\:p-0 { padding: 0 !important; }
          .print\\:m-0 { margin: 0 !important; }
          .print\\:shadow-none { box-shadow: none !important; }
          .print\\:border-none { border: none !important; }
          .print\\:max-w-none { max-width: none !important; }
          .print\\:w-full { width: 100% !important; }
          .print\\:block { display: block !important; }
          #resume-preview { 
            transform: none !important; 
            width: 100% !important; 
            height: auto !important; 
            padding: 0 !important;
            margin: 0 !important;
            border: none !important;
            box-shadow: none !important;
          }
        }
      `}</style>

      <header className="bg-white border-b border-slate-200 p-6 sticky top-0 z-10 print:hidden">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button onClick={() => window.location.href = '/dashboard'} className="p-2 hover:bg-slate-100 rounded-xl transition-all">
              <ArrowLeft className="w-5 h-5 text-slate-500" />
            </button>
            <div>
              <h1 className="text-2xl font-black text-slate-900">Master Resume Builder</h1>
              <p className="text-slate-500 text-sm font-medium">Syncing with: <span className="text-blue-600">{profile?.targetRole}</span></p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {showSuccess && (
              <span className="flex items-center gap-2 text-green-600 font-bold text-sm animate-in fade-in slide-in-from-right-4">
                <CheckCircle2 className="w-4 h-4" /> Saved to Cloud
              </span>
            )}
            <button onClick={optimizeWithAI} disabled={isOptimizing} className="flex items-center gap-2 px-5 py-2.5 bg-blue-50 text-blue-600 rounded-xl font-bold hover:bg-blue-100 transition-all disabled:opacity-50">
              {isOptimizing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              AI Optimize
            </button>
            <button onClick={handleSave} disabled={isSaving} className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all disabled:opacity-50">
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save Changes
            </button>
            <button onClick={() => window.print()} className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition-all">
              <Download className="w-4 h-4" /> Export PDF
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full p-8 grid grid-cols-2 gap-8 print:block print:p-0 print:max-w-none">
        <div className="space-y-8 pb-24 print:hidden">
          <section className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2"><FileText className="w-5 h-5 text-blue-600" /> Professional Summary</h2>
            <textarea className="w-full h-40 p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-700 leading-relaxed" value={resumeData.summary} onChange={(e) => setResumeData({...resumeData, summary: e.target.value})} placeholder="Write a compelling summary of your career..." />
          </section>
          <section className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold flex items-center gap-2"><Briefcase className="w-5 h-5 text-blue-600" /> Work Experience</h2>
              <button onClick={addExperience} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-all"><Plus className="w-4 h-4" /></button>
            </div>
            <div className="space-y-6">
              {resumeData.experience.map((exp: any, index: number) => (
                <div key={index} className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-4 relative group">
                  <button onClick={() => { const newExp = [...resumeData.experience]; newExp.splice(index, 1); setResumeData({...resumeData, experience: newExp}); }} className="absolute top-4 right-4 p-2 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"><Trash2 className="w-4 h-4" /></button>
                  <div className="grid grid-cols-2 gap-4">
                    <input placeholder="Company" className="bg-white p-3 rounded-xl border border-slate-200 text-sm font-bold" value={exp.company} onChange={(e) => { const newExp = [...resumeData.experience]; newExp[index].company = e.target.value; setResumeData({...resumeData, experience: newExp}); }} />
                    <input placeholder="Role" className="bg-white p-3 rounded-xl border border-slate-200 text-sm font-bold" value={exp.role} onChange={(e) => { const newExp = [...resumeData.experience]; newExp[index].role = e.target.value; setResumeData({...resumeData, experience: newExp}); }} />
                  </div>
                  <input placeholder="Duration (e.g. 2020 - Present)" className="w-full bg-white p-3 rounded-xl border border-slate-200 text-sm" value={exp.duration} onChange={(e) => { const newExp = [...resumeData.experience]; newExp[index].duration = e.target.value; setResumeData({...resumeData, experience: newExp}); }} />
                  <textarea placeholder="Key achievements..." className="w-full h-32 bg-white p-3 rounded-xl border border-slate-200 text-sm outline-none" value={exp.description} onChange={(e) => { const newExp = [...resumeData.experience]; newExp[index].description = e.target.value; setResumeData({...resumeData, experience: newExp}); }} />
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="sticky top-32 h-fit print:static print:top-0 print:h-auto print:w-full">
          <div id="resume-preview" className="bg-white shadow-2xl rounded-sm p-12 aspect-[1/1.41] overflow-hidden border border-slate-100 origin-top scale-[0.95] print:shadow-none print:border-none print:p-0 print:scale-100 print:aspect-auto print:w-full">
            <header className="border-b-2 border-slate-900 pb-6 mb-8 flex justify-between items-end">
              <div>
                <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">{auth.currentUser?.displayName || 'Candidate Name'}</h1>
                <p className="text-blue-600 font-bold text-lg mt-1">{profile?.targetRole}</p>
              </div>
              <div className="text-right text-slate-500 text-sm font-medium space-y-1">
                <p className="flex items-center justify-end gap-2"><MapPin className="w-3 h-3" /> {profile?.location}</p>
                <p className="flex items-center justify-end gap-2"><Mail className="w-3 h-3" /> {auth.currentUser?.email}</p>
              </div>
            </header>
            <div className="space-y-8">
              {resumeData.summary && (
                <section>
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 border-b border-slate-100 pb-1">Professional Profile</h3>
                  <p className="text-slate-700 text-sm leading-relaxed">{resumeData.summary}</p>
                </section>
              )}
              {profile?.skills?.length > 0 && (
                <section>
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 border-b border-slate-100 pb-1">Core Expertise</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile?.skills?.map((skill: string, i: number) => (
                      <span key={i} className="px-3 py-1 bg-slate-100 text-slate-700 rounded text-[10px] font-bold uppercase tracking-wider">{skill}</span>
                    ))}
                  </div>
                </section>
              )}
              {resumeData.experience?.length > 0 && (
                <section>
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 border-b border-slate-100 pb-1">Professional Experience</h3>
                  <div className="space-y-6">
                    {resumeData.experience.map((exp: any, i: number) => (
                      <div key={i}>
                        <div className="flex justify-between items-baseline mb-1">
                          <h4 className="font-black text-slate-900 text-sm">{exp.company}</h4>
                          <span className="text-[10px] font-bold text-slate-400 uppercase">{exp.duration}</span>
                        </div>
                        <p className="text-xs font-bold text-blue-600 mb-2">{exp.role}</p>
                        <p className="text-slate-600 text-xs leading-relaxed whitespace-pre-line">{exp.description}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
