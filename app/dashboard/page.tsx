"use client";
import React, { useState, useEffect } from 'react';
import { Search, MapPin, Briefcase, TrendingUp, Loader2, User, PlusCircle } from 'lucide-react';
import { auth, firestore } from '../lib/firebase'; 
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        await fetchUserProfile(currentUser.uid);
      } else {
        window.location.href = '/login'; 
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchUserProfile = async (uid: string) => {
    try {
      const docRef = doc(firestore, "users", uid); 
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const profileData = docSnap.data();
        setProfile(profileData);
        // Only trigger search if we have the necessary data
        if (profileData.targetRole || profileData.jobTitle) {
          findJobs(profileData);
        } else {
          setIsLoading(false);
        }
      } else {
        setProfile(null); 
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      setIsLoading(false);
    }
  };

  const findJobs = async (userProfile: any) => {
    if (isSearching) return;
    setIsSearching(true);
    try {
      const res = await fetch('/api/search-jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          profile: {
            skills: userProfile.skills || [],
            experienceYears: userProfile.experienceYears || 5,
            targetRoles: [userProfile.targetRole || userProfile.jobTitle || "Professional"],
            locationPreference: userProfile.location || "Remote"
          }, 
          query: userProfile.targetRole || userProfile.jobTitle || "Job", 
          location: userProfile.location || "" 
        })
      });
      
      if (!res.ok) throw new Error("API Search Failed");
      
      const data = await res.json();
      // Safety: Ensure data.jobs is an array before setting state
      if (data.success && Array.isArray(data.jobs)) {
        setJobs(data.jobs);
      } else {
        setJobs([]);
      }
    } catch (e) { 
      console.error("Search error:", e); 
      setJobs([]);
    } finally { 
      setIsSearching(false); 
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin w-10 h-10 text-blue-600" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
        <div className="max-w-md w-full bg-white p-10 rounded-3xl border border-slate-200 shadow-xl text-center space-y-6">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
            <PlusCircle className="w-10 h-10 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Welcome to CareerPilot</h1>
          <p className="text-slate-500">We couldn't find your career profile. Let's set it up to start your 60-90 day job search campaign.</p>
          <button 
            onClick={() => window.location.href = '/profile/setup'} 
            className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
          >
            Create My Profile
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
              <User />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{profile.targetRole || profile.jobTitle || "Your Profile"}</h1>
              <p className="text-slate-500 font-medium">{profile.location || "Location not set"} • {profile.experienceYears || "5+"} Years Experience</p>
            </div>
          </div>
          <button onClick={() => window.location.href = '/profile/edit'} className="px-5 py-2.5 text-sm font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all">
            Edit Profile
          </button>
        </div>

        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              AI Job Matches
              <span className="px-2 py-1 bg-green-100 text-green-700 text-[10px] rounded-md uppercase tracking-wider font-bold">Live Results</span>
            </h2>
            <button 
              onClick={() => findJobs(profile)} 
              disabled={isSearching}
              className="px-6 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm disabled:opacity-50"
            >
              {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              Refresh Matches
            </button>
          </div>

          {isSearching ? (
            <div className="py-24 text-center bg-white rounded-3xl border border-slate-200 shadow-sm">
              <Loader2 className="animate-spin mx-auto w-12 h-12 text-blue-600" />
              <p className="mt-6 text-slate-600 font-bold text-lg">Scanning the market...</p>
              <p className="text-slate-400">Finding the best {profile.targetRole} roles in {profile.location}</p>
            </div>
          ) : jobs && jobs.length > 0 ? (
            <div className="grid gap-5">
              {jobs.map((job, i) => (
                <div key={job.job_id || i} className="bg-white p-7 rounded-3xl border border-slate-200 hover:border-blue-400 hover:shadow-xl hover:shadow-blue-500/5 transition-all group">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <h3 className="font-bold text-xl text-slate-900 group-hover:text-blue-600 transition-colors">{job.job_title || "Job Title"}</h3>
                      <p className="text-blue-600 font-semibold text-lg">{job.company_name || "Company"}</p>
                    </div>
                    <div className="text-right">
                      <div className="px-4 py-1.5 bg-blue-600 text-white rounded-full font-bold text-sm shadow-md shadow-blue-200">
                        {job.fitScore || 0}% Match
                      </div>
                      <p className="text-[11px] text-slate-400 mt-2 uppercase font-bold tracking-widest flex items-center justify-end gap-1">
                        <MapPin className="w-3 h-3" /> {job.job_city || job.location || "Remote"}
                      </p>
                    </div>
                  </div>
                  <div className="mt-5 bg-slate-50 p-5 rounded-2xl border border-slate-100">
                    <p className="text-slate-600 text-sm leading-relaxed font-medium italic">"{job.fitExplanation || "Analyzing fit..."}"</p>
                  </div>
                  <div className="mt-6 flex justify-end gap-3">
                    <button className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">View Details</button>
                    <button className="px-7 py-2.5 bg-slate-900 text-white rounded-xl font-bold hover:bg-blue-600 transition-all shadow-lg">Smart Apply</button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-24 text-center border-2 border-dashed border-slate-200 rounded-3xl bg-white">
              <Search className="w-14 h-14 text-slate-200 mx-auto mb-4" />
              <p className="text-slate-500 font-bold text-xl">No matches found yet</p>
              <p className="text-slate-400 mt-2">Try updating your profile with more specific skills or locations.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
