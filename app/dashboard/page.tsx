"use client";

import React, { useState, useEffect } from 'react';
import { auth, firestore } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { 
  Search, MapPin, Briefcase, Star, TrendingUp, Settings, 
  LogOut, Loader2, User, RefreshCw, ExternalLink, 
  CheckCircle2, AlertCircle 
} from 'lucide-react';

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [debug, setDebug] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        await fetchProfile(currentUser.uid);
      } else {
        window.location.href = '/login';
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchProfile = async (uid: string) => {
    try {
      const docRef = doc(firestore, "users", uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const profileData = docSnap.data();
        setProfile(profileData);
        findJobs(profileData);
      } else {
        window.location.href = '/profile/setup';
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      setIsLoading(false);
    }
  };

  const findJobs = async (userProfile: any) => {
    setIsSearching(true);
    setDebug(null);
    try {
      const res = await fetch('/api/search-jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          profile: userProfile,
          query: userProfile.targetRole,
          location: userProfile.location
        })
      });
      const data = await res.json();
      if (data.success) {
        setJobs(data.jobs || []);
      } else {
        setDebug(data.debug);
        setJobs([]);
      }
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsSearching(false);
      setIsLoading(false);
    }
  };

  const handleLogout = () => auth.signOut().then(() => window.location.href = '/');

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto" />
          <p className="text-slate-500 font-medium">Loading your campaign...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <aside className="w-72 bg-white border-r border-slate-200 p-8 flex flex-col fixed h-full">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
            <TrendingUp className="text-white w-6 h-6" />
          </div>
          <span className="font-black text-xl tracking-tight">CareerPilot<span className="text-blue-600">AI</span></span>
        </div>
        <nav className="space-y-2 flex-1">
          <button className="w-full flex items-center gap-3 p-4 bg-blue-50 text-blue-600 rounded-2xl font-bold transition-all">
            <Search className="w-5 h-5" /> Job Matches
          </button>
          <button onClick={() => window.location.href = '/dashboard/interview'} className="w-full flex items-center gap-3 p-4 text-slate-500 hover:bg-slate-50 rounded-2xl font-bold transition-all">
            <Star className="w-5 h-5" /> Interview Coach
          </button>
          <button className="w-full flex items-center gap-3 p-4 text-slate-500 hover:bg-slate-50 rounded-2xl font-bold transition-all">
            <Briefcase className="w-5 h-5" /> Applications
          </button>
        </nav>
        <div className="pt-8 border-t border-slate-100 space-y-2">
          <button onClick={() => window.location.href = '/profile/edit'} className="w-full flex items-center gap-3 p-4 text-slate-500 hover:bg-slate-50 rounded-2xl font-bold transition-all">
            <Settings className="w-5 h-5" /> Settings
          </button>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 p-4 text-red-500 hover:bg-red-50 rounded-2xl font-bold transition-all">
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 ml-72 p-12">
        <header className="flex justify-between items-end mb-12">
          <div>
            <h1 className="text-4xl font-black text-slate-900 mb-2">Campaign Dashboard</h1>
            <p className="text-slate-500 font-medium">Welcome back, {user?.displayName || 'Candidate'}</p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <CheckCircle2 className="text-green-600 w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Campaign Status</p>
              <p className="font-bold text-green-600 text-lg">Active</p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-3 gap-8">
          <div className="col-span-1 space-y-8">
            <section className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="font-bold text-xl">Target Profile</h2>
                <button onClick={() => window.location.href = '/profile/edit'} className="text-blue-600 font-bold text-sm hover:underline">Edit Profile</button>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl">
                  <Briefcase className="text-blue-600 w-5 h-5" />
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase">Role</p>
                    <p className="font-bold text-slate-900">{profile?.targetRole}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl">
                  <MapPin className="text-blue-600 w-5 h-5" />
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase">Location</p>
                    <p className="font-bold text-slate-900">{profile?.location}</p>
                  </div>
                </div>
              </div>
              <div className="pt-4">
                <p className="text-xs font-bold text-slate-400 uppercase mb-3">Key Skills</p>
                <div className="flex flex-wrap gap-2">
                  {profile?.skills?.map((skill: string, i: number) => (
                    <span key={i} className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-sm font-bold">{skill}</span>
                  ))}
                </div>
              </div>
            </section>
          </div>

          <div className="col-span-2 space-y-8">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold flex items-center gap-3">AI Job Matches <span className="px-3 py-1 bg-blue-600 text-white text-xs rounded-full">Live Results</span></h2>
              <button onClick={() => findJobs(profile)} disabled={isSearching} className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-2xl font-bold text-slate-600 hover:bg-slate-50 transition-all disabled:opacity-50">
                {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />} Refresh Matches
              </button>
            </div>

            {isSearching ? (
              <div className="py-24 text-center space-y-4">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto" />
                <p className="text-slate-500 font-bold">Scanning 100+ job boards...</p>
              </div>
            ) : jobs.length > 0 ? (
              <div className="space-y-4">
                {jobs.map((job: any, i: number) => (
                  <div key={i} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:border-blue-300 transition-all group">
                    <div className="flex justify-between items-start">
                      <div className="flex gap-4">
                        <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center font-bold text-slate-400">{job.employer_name?.charAt(0)}</div>
                        <div>
                          <h3 className="font-bold text-lg text-slate-900 group-hover:text-blue-600 transition-colors">{job.job_title}</h3>
                          <p className="text-slate-500 font-medium">{job.employer_name} • {job.job_city}, {job.job_state}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="inline-flex items-center gap-1 px-3 py-1 bg-green-50 text-green-600 rounded-full text-sm font-black mb-2">
                          <Star className="w-3 h-3 fill-current" /> {job.fit_score}% Match
                        </div>
                      </div>
                    </div>
                    <div className="mt-6 pt-6 border-t border-slate-50 flex justify-end">
                      <a href={job.job_apply_link} target="_blank" className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-blue-600 transition-all">Apply Now <ExternalLink className="w-4 h-4" /></a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-24 text-center border-2 border-dashed border-slate-200 rounded-3xl bg-white space-y-4">
                <Search className="w-14 h-14 text-slate-200 mx-auto" />
                <p className="text-slate-500 font-bold text-xl">No matches found yet</p>
                {debug && (
                  <div className="max-w-md mx-auto mt-8 p-6 bg-slate-900 rounded-2xl text-left font-mono text-xs space-y-3">
                    <div className="flex items-center gap-2 text-blue-400 border-b border-slate-800 pb-2 mb-2">
                      <AlertCircle className="w-4 h-4" /> <span className="font-bold uppercase tracking-widest">API Diagnostic Logs</span>
                    </div>
                    <p className={debug.jsearch.includes('Success') ? 'text-green-400' : 'text-red-400'}>JSearch: {debug.jsearch}</p>
                    <p className={debug.serpapi.includes('Success') ? 'text-green-400' : 'text-red-400'}>SerpAPI: {debug.serpapi}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
