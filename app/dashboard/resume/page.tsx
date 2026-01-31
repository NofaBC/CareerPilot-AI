"use client";

import React, { useState, useEffect } from 'react';
import { auth, firestore } from '../../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { 
  FileText, 
  Download, 
  Sparkles, 
  Save, 
  ArrowLeft, 
  Loader2, 
  Plus, 
  Trash2,
  CheckCircle2
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
      // Get Profile
      const profileSnap = await getDoc(doc(firestore, "users", uid));
      if (profileSnap.exists()) {
        const pData = profileSnap.data();
        setProfile(pData);
        
        // Get existing Resume or initialize from Profile
        const resumeSnap = await getDoc(doc(firestore, "resumes", uid));
        if (resumeSnap.exists()) {
          setResumeData(resumeSnap.data());
        } else {
          // Initialize with profile data
          setResumeData({
            summary: `Experienced ${pData.targetRole} with ${pData.experienceYears} years of expertise in ${pData.skills?.join(', ')}.`,
            experience: [{
              company: 'Current/Last Company',
              role: pData.targetRole,
              duration: '2020 - Present',
              description: 'Describe your key achievements here...'
            }],
            education: [{ school: 'University Name', degree: 'Bachelor of Science', year: '2015' }],
            certifications: []
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
    setIsOptimizing(true);
    // This would call an API endpoint we'll build next
    // For now, we'll simulate a professional enhancement
    setTimeout(() => {
      setResumeData({
        ...resumeData,
        summary: `Strategic and results-driven ${profile.targetRole} offering ${profile.experienceYears} years of high-impact experience. Expert in leveraging ${profile.skills?.slice(0,3).join(', ')} to drive operational excellence and scalable growth. Proven track record of delivering complex projects in fast-paced environments.`
      });
      setIsOptimizing(false);
    }, 1500);
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
      {/* Header */}
      <header className="bg-white border-b border-slate-200 p-6 sticky top-0 z-10">
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
            <button 
              onClick={optimizeWithAI}
              disabled={isOptimizing}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-50 text-blue-600 rounded-xl font-bold hover:bg-blue-100 transition-all disabled:opacity-50"
            >
              {isOptimizing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              AI Optimize
            </button>
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all disabled:opacity-50"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save Changes
            </button>
            <button 
              onClick={() => window.print()}
              className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition-all"
            >
              <Download className="w-4 h-4" />
              Export PDF
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full p-8 grid grid-cols-2 gap-8">
        {/* Editor Side */}
        <div className="space-y-8 pb-24">
          <section className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" /> Professional Summary
            </h2>
            <textarea 
              className="w-full h-40 p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-700 leading-relaxed"
              value={resumeData.summary}
              onChange={(e) => setResumeData({...resumeData, summary: e.target.value})}
              placeholder="Write a compelling summary of your career..."
            />
          </section>

          <section className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-blue-600" /> Work Experience
              </h2>
              <button onClick={addExperience} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-all">
                <Plus className="w-4 h-4" />
              </button>
            </div>
            
            <div className="space-y-6">
              {resumeData.experience.map((exp: any, index: number) => (
                <div key={index} className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-4 relative group">
                  <button 
                    onClick={() => {
                      const newExp = [...resumeData.experience];
                      newExp.splice(index, 1);
                      setResumeData({...resumeData, experience: newExp});
                    }}
                    className="absolute top-4 right-4 p-2 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="grid grid-cols-2 gap-4">
                    <input 
                      placeholder="Company" 
                      className="bg-white p-3 rounded-xl border border-slate-200 text-sm font-bold"
                      value={exp.company}
                      onChange={(e) => {
                        const newExp = [...resumeData.experience];
                        newExp[index].company = e.target.value;
                        setResumeData({...resumeData, experience: newExp});
                      }}
                    />
                    <input 
                      placeholder="Role" 
                      className="bg-white p-3 rounded-xl border border-slate-200 text-sm font-bold"
                      value={exp.role}
                      onChange={(e) => {
                        const newExp = [...resumeData.experience];
                        newExp[index].role = e.target.value;
                        setResumeData({...resumeData, experience: newExp});
                      }}
                    />
                  </div>
                  <input 
                    placeholder="Duration (e.g. 2020 - Present)" 
                    className="w-full bg-white p-3 rounded-xl border border-slate-200 text-sm"
                    value={exp.duration}
                    onChange={(e) => {
                      const newExp = [...resumeData.experience];
                      newExp[index].duration = e.target.value;
                      setResumeData({...resumeData, experience: newExp});
                    }}
                  />
                  <textarea 
                    placeholder="Key achievements..." 
                    className="w-full h-24 bg-white p-3 rounded-xl border border-slate-200 text-sm outline-none"
                    value={exp.description}
                    onChange={(e) => {
                      const newExp = [...resumeData.experience];
                      newExp[index].description = e.target.value;
                      setResumeData({...resumeData, experience: newExp});
                    }}
                  />
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Preview Side (The actual Resume layout) */}
        <div className="sticky top-32 h-fit">
          <div id="resume-preview" className="bg-white shadow-2xl rounded-sm p-12 aspect-[1/1.41] overflow-hidden border border-slate-100 origin-top scale-[0.95]">
            <header className="border-b-2 border-slate-900 pb-6 mb-8">
              <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">{auth.currentUser?.displayName || 'Candidate Name'}</h1>
              <p className="text-blue-600 font-bold text-lg mt-1">{profile?.targetRole}</p>
              <div className="flex gap-4 mt-4 text-slate-500 text-sm font-medium">
                <span>{profile?.location}</span>
                <span>•</span>
                <span>{auth.currentUser?.email}</span>
              </div>
            </header>

            <div className="space-y-8">
              <section>
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Professional Profile</h3>
                <p className="text-slate-700 text-sm leading-relaxed">{resumeData.summary}</p>
              </section>

              <section>
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Core Expertise</h3>
                <div className="flex flex-wrap gap-2">
                  {profile?.skills?.map((skill: string, i: number) => (
                    <span key={i} className="px-3 py-1 bg-slate-100 text-slate-700 rounded text-xs font-bold uppercase">{skill}</span>
                  ))}
                </div>
              </section>

              <section>
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Experience</h3>
                <div className="space-y-6">
                  {resumeData.experience.map((exp: any, i: number) => (
                    <div key={i}>
                      <div className="flex justify-between items-baseline mb-1">
                        <h4 className="font-black text-slate-900">{exp.company}</h4>
                        <span className="text-xs font-bold text-slate-400">{exp.duration}</span>
                      </div>
                      <p className="text-sm font-bold text-blue-600 mb-2">{exp.role}</p>
                      <p className="text-slate-600 text-xs leading-relaxed whitespace-pre-line">{exp.description}</p>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
          <p className="text-center mt-4 text-slate-400 text-xs font-medium italic">
            Tip: Use the "AI Optimize" button to polish your summary and experience.
          </p>
        </div>
      </main>
    </div>
  );
}

// Re-import icons needed for the component
import { Briefcase } from 'lucide-react';
