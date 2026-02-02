"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { auth, firestore } from '../lib/firebase';
import { doc, getDoc, collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { 
  Search, MapPin, Briefcase, Star, TrendingUp, Settings, 
  LogOut, Loader2, RefreshCw, CheckCircle2, Zap, X, Calendar, Clock, FileText, Sparkles, ChevronRight
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

  if (isLoading) return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center space-y-6"
      >
        <div className="relative w-24 h-24 mx-auto">
          <div className="absolute inset-0 border-4 border-blue-500/20 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-t-blue-500 rounded-full animate-spin"></div>
          <TrendingUp className="absolute inset-0 m-auto w-10 h-10 text-blue-500" />
        </div>
        <p className="text-slate-400 font-bold tracking-widest uppercase text-xs animate-pulse">Initializing AI Flight Deck...</p>
      </motion.div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 flex relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full"></div>

      <aside className="w-80 bg-slate-900/50 backdrop-blur-xl border-r border-white/5 p-8 flex flex-col fixed h-full z-[50]">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <TrendingUp className="text-white w-7 h-7" />
          </div>
          <span className="font-black text-2xl tracking-tighter text-white">CareerPilot<span className="text-blue-500">AI</span></span>
        </div>
        
        <nav className="space-y-2 flex-1">
          {[
            { id: 'matches', icon: Search, label: 'Job Matches', active: true },
            { id: 'resume', icon: FileText, label: 'Master Resume', path: '/dashboard/resume' },
            { id: 'coach', icon: Star, label: 'Interview Coach', path: '/dashboard/interview' },
          ].map((item) => (
            <button 
              key={item.id}
              onClick={() => item.path && (window.location.href = item.path)}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl font-bold transition-all duration-300 ${
                item.active 
                ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20 shadow-inner' 
                : 'text-slate-500 hover:bg-white/5 hover:text-slate-300'
              }`}
            >
              <item.icon className="w-5 h-5" /> {item.label}
            </button>
          ))}
        </nav>

        <div className="pt-8 border-t border-white/5 space-y-2">
          <button onClick={() => window.location.href = '/profile/edit'} className="w-full flex items-center gap-4 p-4 text-slate-500 hover:bg-white/5 rounded-2xl font-bold transition-all"><Settings className="w-5 h-5" /> Settings</button>
          <button onClick={() => auth.signOut().then(() => window.location.href = '/')} className="w-full flex items-center gap-4 p-4 text-rose-500/70 hover:bg-rose-500/10 rounded-2xl font-bold transition-all"><LogOut className="w-5 h-5" /> Logout</button>
        </div>
      </aside>

      <main className="flex-1 ml-80 p-12 relative z-10">
        <header className="flex justify-between items-start mb-16">
          <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
            <h1 className="text-5xl font-black text-white tracking-tight mb-3">Campaign Dashboard</h1>
            <div className="flex items-center gap-2 text-slate-400 font-medium">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              Active Campaign: {user?.displayName || 'Candidate'}
            </div>
          </motion.div>

          <motion.div 
            initial={{ y: -20, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }}
            className="bg-slate-900/40 backdrop-blur-md p-6 rounded-[32px] border border-white/5 shadow-2xl flex items-center gap-8"
          >
            <div className="text-center">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Applications</p>
              <p className="font-black text-white text-3xl">{stats.sent}</p>
            </div>
            <div className="w-px h-10 bg-white/5"></div>
            <div className="flex items-center gap-4">
              <div className="relative w-14 h-14 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90">
                  <circle cx="28" cy="28" r="24" fill="none" stroke="currentColor" strokeWidth="4" className="text-white/5" />
                  <circle cx="28" cy="28" r="24" fill="none" stroke="currentColor" strokeWidth="4" strokeDasharray={150} strokeDashoffset={150 - (150 * (stats.response / (stats.sent || 1)))} className="text-blue-500 transition-all duration-1000" />
                </svg>
                <span className="absolute font-black text-xs text-blue-400">{Math.round((stats.response / (stats.sent || 1)) * 100)}%</span>
              </div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Response  
Rate</p>
            </div>
          </motion.div>
        </header>

        <div className="grid grid-cols-12 gap-10">
          <div className="col-span-4">
            <motion.section 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-slate-900/40 backdrop-blur-md p-8 rounded-[40px] border border-white/5 shadow-2xl sticky top-12"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="font-black text-xl text-white tracking-tight">Target Profile</h2>
                <button onClick={() => window.location.href = '/profile/edit'} className="text-blue-400 font-bold text-sm hover:text-blue-300 transition-colors">Edit</button>
              </div>
              
              <div className="space-y-4">
                <div className="p-5 bg-white/5 rounded-3xl border border-white/5 group hover:bg-white/10 transition-all">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Target Role</p>
                  <p className="font-black text-white text-lg flex items-center gap-2"><Briefcase className="w-4 h-4 text-blue-500" /> {profile?.targetRole}</p>
                </div>
                <div className="p-5 bg-white/5 rounded-3xl border border-white/5 group hover:bg-white/10 transition-all">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Location</p>
                  <p className="font-black text-white text-lg flex items-center gap-2"><MapPin className="w-4 h-4 text-blue-500" /> {profile?.location}</p>
                </div>
              </div>

              <div className="mt-8">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Core Expertise</p>
                <div className="flex flex-wrap gap-2">
                  {profile?.skills?.map((s: any, i: any) => (
                    <span key={i} className="px-4 py-2 bg-blue-500/10 text-blue-400 rounded-xl text-xs font-black border border-blue-500/10">{s}</span>
                  ))}
                </div>
              </div>
            </motion.section>
          </div>

          <div className="col-span-8 space-y-8">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-black text-white tracking-tight flex items-center gap-4">
                AI Job Matches 
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                </span>
              </h2>
              <button onClick={() => window.location.reload()} className="flex items-center gap-2 px-8 py-4 bg-white/5 border border-white/10 rounded-2xl font-black text-slate-300 hover:bg-white/10 transition-all active:scale-95">
                <RefreshCw className="w-4 h-4" /> Refresh AI Scan
              </button>
            </div>

            <div className="space-y-6">
              <AnimatePresence>
                {jobs.map((job: any, i: number) => (
                  <motion.div 
                    key={i}
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-slate-900/40 backdrop-blur-md p-8 rounded-[40px] border border-white/5 shadow-xl hover:border-blue-500/30 transition-all group relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-blue-500/10 transition-all"></div>
                    
                    <div className="flex justify-between items-start relative z-10">
                      <div className="flex gap-6">
                        <div className="w-16 h-16 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl flex items-center justify-center font-black text-2xl text-slate-600 border border-white/5 shadow-inner">
                          {job.employer_name?.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-black text-2xl text-white mb-1 group-hover:text-blue-400 transition-colors">{job.job_title}</h3>
                          <p className="text-slate-400 font-bold flex items-center gap-2">
                            {job.employer_name} <span className="w-1 h-1 bg-slate-700 rounded-full"></span> {job.job_city}, {job.job_state}
                          </p>
                        </div>
                      </div>
                      <div className="px-4 py-2 bg-blue-500/10 text-blue-400 rounded-full text-xs font-black border border-blue-500/20 flex items-center gap-2">
                        <Star className="w-3 h-3 fill-current" /> {job.fit_score}% AI Match
                      </div>
                    </div>

                    <div className="mt-8 flex items-center justify-between relative z-10">
                      <div className="flex items-center gap-2 text-blue-400/60 text-xs font-black uppercase tracking-widest">
                        <Sparkles className="w-4 h-4" /> AI Insight: Strategic match for your {profile?.skills?.[0]} expertise
                      </div>
                      <button 
                        onClick={() => handleSmartApply(job)} 
                        className="flex items-center gap-3 px-8 py-4 bg-blue-600 text-white rounded-2xl font-black hover:bg-blue-500 transition-all shadow-xl shadow-blue-900/20 active:scale-95 group/btn"
                      >
                        <Zap className="w-4 h-4 fill-current" /> Smart Apply <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>

      {/* Cinematic Modal */}
      <AnimatePresence>
        {selectedJob && selectedJob.job_title && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(2, 6, 23, 0.95)', backdropFilter: 'blur(12px)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-slate-900 w-full max-w-3xl rounded-[48px] border border-white/10 shadow-[0_0_100px_rgba(59,130,246,0.1)] relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
              
              <div className="p-10 border-b border-white/5 flex justify-between items-center bg-white/5">
                <div>
                  <h2 className="text-3xl font-black text-white tracking-tight mb-1">Smart Apply</h2>
                  <p className="text-slate-400 font-bold">Tailoring campaign for <span className="text-blue-400">{selectedJob.employer_name}</span></p>
                </div>
                <button onClick={() => setSelectedJob(null)} className="p-3 hover:bg-white/10 rounded-2xl transition-all text-slate-500 hover:text-white"><X className="w-7 h-7" /></button>
              </div>

              <div className="p-10 space-y-10 max-h-[60vh] overflow-y-auto custom-scrollbar">
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="font-black text-white flex items-center gap-3 uppercase tracking-widest text-xs">
                      <Sparkles className="w-4 h-4 text-blue-400" /> AI Tailored Cover Letter
                    </h3>
                    {isGeneratingCL && <Loader2 className="w-5 h-5 animate-spin text-blue-400" />}
                  </div>
                  <textarea 
                    className="w-full h-72 p-8 bg-black/40 border border-white/5 rounded-[32px] text-sm leading-relaxed text-slate-300 outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium" 
                    value={coverLetter} 
                    onChange={(e) => setCoverLetter(e.target.value)} 
                    placeholder="AI is analyzing the job description..." 
                  />
                </div>

                <div className="space-y-6">
                  <h3 className="font-black text-white flex items-center gap-3 uppercase tracking-widest text-xs">
                    <Calendar className="w-4 h-4 text-blue-400" /> Interview Availability
                  </h3>
                  <div className="relative group">
                    <Clock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                    <input 
                      className="w-full pl-16 pr-8 py-5 bg-black/40 border border-white/5 rounded-2xl text-sm font-black text-white outline-none focus:ring-2 focus:ring-blue-500/50 transition-all" 
                      value={availability} 
                      onChange={(e) => setAvailability(e.target.value)} 
                    />
                  </div>
                </div>
              </div>

              <div className="p-10 bg-white/5 border-t border-white/5 flex gap-6">
                <button onClick={() => setSelectedJob(null)} className="flex-1 py-5 bg-transparent border border-white/10 text-slate-400 rounded-2xl font-black hover:bg-white/5 transition-all">Cancel</button>
                <button 
                  onClick={confirmApplication} 
                  disabled={isApplying || isGeneratingCL} 
                  className="flex-[2] py-5 bg-blue-600 text-white rounded-2xl font-black hover:bg-blue-500 transition-all shadow-2xl shadow-blue-900/40 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isApplying ? <Loader2 className="w-6 h-6 animate-spin" /> : <CheckCircle2 className="w-6 h-6" />} Confirm & Launch Application
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.1); }
      `}</style>
    </div>
  );
}
