"use client";

import React, { useState, useEffect } from 'react';
import { auth, firestore } from '../lib/firebase';
import { doc, getDoc, collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { 
  Search, MapPin, Briefcase, Star, TrendingUp, Settings, 
  LogOut, Loader2, RefreshCw, CheckCircle2, Zap, X, Calendar, Clock, FileText, Sparkles 
} from 'lucide-react';

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [resume, setResume] = useState<any>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  const [stats, setStats] = useState({ sent: 0, response: 0, interview: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [isGeneratingCL, setIsGeneratingCL] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [availability, setAvailability] = useState("Mon-Fri, 9am-5pm");
  const [isApplying, setIsApplying] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        try {
          const docRef = doc(firestore, "users", currentUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const pData = docSnap.data();
            setProfile(pData);
            const rSnap = await getDoc(doc(firestore, "resumes", currentUser.uid));
            if (rSnap.exists()) setResume(rSnap.data());
            const res = await fetch('/api/search-jobs', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ query: pData.targetRole, location: pData.location })
            });
            const data = await res.json();
            if (data.success) setJobs(data.jobs || []);
          } else { window.location.href = '/profile/setup'; }
          const q = query(collection(firestore, "applications"), where("userId", "==", currentUser.uid));
          const qSnap = await getDocs(q);
          const apps = qSnap.docs.map(d => d.data());
          setStats({
            sent: apps.length,
            response: apps.filter(a => a.status === 'viewed' || a.status === 'interview').length,
            interview: apps.filter(a => a.status === 'interview').length
          });
        } catch (e) { console.error(e); }
        finally { setIsLoading(false); }
      } else { window.location.href = '/login'; }
    });
    return () => unsubscribe();
  }, []);

  const handleSmartApply = async (job: any) => {
    setSelectedJob(job);
    setIsGeneratingCL(true);
    setCoverLetter(""); 
    try {
      const res = await fetch('/api/generate-cover-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobTitle: job.job_title,
          employer: job.employer_name,
          jobDescription: job.job_description || job.job_title,
          userProfile: profile,
          resumeSummary: resume?.summary || profile?.summary || ""
        })
      });
      const data = await res.json();
      if (data.success) setCoverLetter(data.coverLetter);
      else setCoverLetter("Error generating cover letter.");
    } catch (e) { setCoverLetter("Connection error."); }
    finally { setIsGeneratingCL(false); }
  };

  const confirmApplication = async () => {
    if (!user || !selectedJob) return;
    setIsApplying(true);
    try {
      await addDoc(collection(firestore, "applications"), {
        userId: user.uid,
        jobId: selectedJob.job_id || Math.random().toString(36),
        jobTitle: selectedJob.job_title,
        employer: selectedJob.employer_name,
        status: 'sent',
        coverLetter,
        availability,
        appliedAt: new Date().toISOString()
      });
      setStats(prev => ({ ...prev, sent: prev.sent + 1 }));
      window.open(selectedJob.job_apply_link, '_blank');
      setSelectedJob(null);
    } catch (e) { alert("Error saving application"); }
    finally { setIsApplying(false); }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex relative">
      {isLoading ? (
        <div className="fixed inset-0 bg-white z-[100] flex items-center justify-center">
          <div className="text-center space-y-4">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto" />
            <p className="text-slate-500 font-medium">Loading your campaign...</p>
          </div>
        </div>
      ) : (
        <>
          <aside className="w-72 bg-white border-r border-slate-200 p-8 flex flex-col fixed h-full z-[50]">
            <div className="flex items-center gap-3 mb-12">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center"><TrendingUp className="text-white w-6 h-6" /></div>
              <span className="font-black text-xl tracking-tight">CareerPilot<span className="text-blue-600">AI</span></span>
            </div>
            <nav className="space-y-2 flex-1">
              <button className="w-full flex items-center gap-3 p-4 bg-blue-50 text-blue-600 rounded-2xl font-bold text-left"><Search className="w-5 h-5" /> Job Matches</button>
              <button onClick={() => window.location.href = '/dashboard/resume'} className="w-full flex items-center gap-3 p-4 text-slate-500 hover:bg-slate-50 rounded-2xl font-bold text-left"><FileText className="w-5 h-5" /> Master Resume</button>
              <button onClick={() => window.location.href = '/dashboard/interview'} className="w-full flex items-center gap-3 p-4 text-slate-500 hover:bg-slate-50 rounded-2xl font-bold text-left"><Star className="w-5 h-5" /> Interview Coach</button>
            </nav>
            <div className="pt-8 border-t border-slate-100 space-y-2">
              <button onClick={() => window.location.href = '/profile/edit'} className="w-full flex items-center gap-3 p-4 text-slate-500 hover:bg-slate-50 rounded-2xl font-bold text-left"><Settings className="w-5 h-5" /> Settings</button>
              <button onClick={() => auth.signOut().then(() => window.location.href = '/')} className="w-full flex items-center gap-3 p-4 text-red-500 hover:bg-red-50 rounded-2xl font-bold text-left"><LogOut className="w-5 h-5" /> Logout</button>
            </div>
          </aside>

          <main className="flex-1 ml-72 p-12">
            <header className="flex justify-between items-end mb-12">
              <div><h1 className="text-4xl font-black text-slate-900 mb-2">Campaign Dashboard</h1><p className="text-slate-500 font-medium">Welcome back, {user?.displayName || 'Candidate'}</p></div>
              <div className="bg-white p-4 px-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                <div className="text-center"><p className="text-[10px] font-black text-slate-400 uppercase">Sent</p><p className="font-black text-slate-900 text-xl">{stats.sent}</p></div>
                <div className="w-px h-8 bg-slate-100"></div>
                <div className="text-center"><p className="text-[10px] font-black text-slate-400 uppercase">Response</p><p className="font-black text-blue-600 text-xl">{Math.round((stats.response / (stats.sent || 1)) * 100)}%</p></div>
                <div className="w-px h-8 bg-slate-100"></div>
                <div className="text-center"><p className="text-[10px] font-black text-slate-400 uppercase">Interviews</p><p className="font-black text-green-600 text-xl">{stats.interview}</p></div>
              </div>
            </header>

            <div className="grid grid-cols-3 gap-8">
              <div className="col-span-1"><section className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6"><div className="flex justify-between items-center"><h2 className="font-bold text-xl">Target Profile</h2><button onClick={() => window.location.href = '/profile/edit'} className="text-blue-600 font-bold text-sm">Edit Profile</button></div><div className="space-y-4"><div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl"><Briefcase className="text-blue-600 w-5 h-5" /><div><p className="text-xs font-bold text-slate-400 uppercase">Role</p><p className="font-bold text-slate-900">{profile?.targetRole}</p></div></div><div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl"><MapPin className="text-blue-600 w-5 h-5" /><div><p className="text-xs font-bold text-slate-400 uppercase">Location</p><p className="font-bold text-slate-900">{profile?.location}</p></div></div></div><div className="pt-4"><p className="text-xs font-bold text-slate-400 uppercase mb-3">Key Skills</p><div className="flex flex-wrap gap-2">{profile?.skills?.map((s: any, i: any) => (<span key={i} className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-sm font-bold">{s}</span>))}</div></div></section></div>
              <div className="col-span-2 space-y-8">
                <div className="flex justify-between items-center"><h2 className="text-2xl font-bold flex items-center gap-3">AI Job Matches <span className="px-3 py-1 bg-blue-600 text-white text-xs rounded-full">Live Results</span></h2><button onClick={() => window.location.reload()} className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-2xl font-bold text-slate-600 hover:bg-slate-50 transition-all"><RefreshCw className="w-4 h-4" /> Refresh Matches</button></div>
                <div className="space-y-4">
                  {jobs.map((job: any, i: number) => (
                    <div key={i} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:border-blue-300 transition-all group">
                      <div className="flex justify-between items-start">
                        <div className="flex gap-4"><div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center font-bold text-slate-400">{job.employer_name?.charAt(0)}</div><div><h3 className="font-bold text-lg text-slate-900 group-hover:text-blue-600 transition-colors">{job.job_title}</h3><p className="text-slate-500 font-medium">{job.employer_name} • {job.job_city}, {job.job_state}</p></div></div>
                        <div className="inline-flex items-center gap-1 px-3 py-1 bg-green-50 text-green-600 rounded-full text-sm font-black"><Star className="w-3 h-3 fill-current" /> {job.fit_score}% Match</div>
                      </div>
                      <div className="mt-6 pt-6 border-t border-slate-50 flex justify-end"><button onClick={() => handleSmartApply(job)} className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"><Zap className="w-4 h-4 fill-current" /> Smart Apply</button></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </main>

          {selectedJob && selectedJob.job_title && (
            <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.9)', backdropFilter: 'blur(8px)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
              <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl relative z-[100000]">
                <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-3xl">
                  <div><h2 className="text-2xl font-black text-slate-900">Smart Apply</h2><p className="text-slate-500 font-medium">Tailoring application for <span className="text-blue-600">{selectedJob.employer_name}</span></p></div>
                  <button onClick={() => setSelectedJob(null)} className="p-2 hover:bg-white rounded-full transition-all"><X className="w-6 h-6 text-slate-400" /></button>
                </div>
                <div className="p-8 space-y-8 max-h-[60vh] overflow-y-auto">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center"><h3 className="font-bold text-slate-900 flex items-center gap-2"><Sparkles className="w-4 h-4 text-blue-600" /> AI Tailored Cover Letter</h3>{isGeneratingCL && <Loader2 className="w-4 h-4 animate-spin text-blue-600" />}</div>
                    <textarea className="w-full h-64 p-6 bg-slate-50 border border-slate-200 rounded-2xl text-sm leading-relaxed text-slate-700 outline-none focus:ring-2 focus:ring-blue-500" value={coverLetter} onChange={(e) => setCoverLetter(e.target.value)} placeholder="Generating..." />
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-bold text-slate-900 flex items-center gap-2"><Calendar className="w-4 h-4 text-blue-600" /> Interview Availability</h3>
                    <div className="relative"><Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" /><input className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold" value={availability} onChange={(e) => setAvailability(e.target.value)} /></div>
                  </div>
                </div>
                <div className="p-8 bg-slate-50 border-t border-slate-100 flex gap-4 rounded-b-3xl">
                  <button onClick={() => setSelectedJob(null)} className="flex-1 py-4 bg-white border border-slate-200 text-slate-600 rounded-2xl font-bold hover:bg-slate-100 transition-all">Cancel</button>
                  <button onClick={confirmApplication} disabled={isApplying || isGeneratingCL} className="flex-[2] py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2">{isApplying ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />} Confirm & Apply Now</button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
