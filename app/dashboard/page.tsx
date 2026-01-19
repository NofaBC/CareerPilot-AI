"use client";

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  MapPin, 
  Briefcase, 
  TrendingUp, 
  CheckCircle, 
  Clock, 
  ChevronRight,
  User,
  LogOut,
  Bell,
  Settings,
  Loader2
} from 'lucide-react';

export default function Dashboard() {
  const [profile, setProfile] = useState({
    name: "Head Nurse",
    location: "Chicago, IL",
    skills: ["staff supervision", "patient flow", "acute care", "leadership", "mentoring"],
    experience: "12+ years",
    status: "Active"
  });

  const [jobs, setJobs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Initial load - find jobs based on profile
  useEffect(() => {
    handleFindJobs();
  }, []);

  const handleFindJobs = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/search-jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile: {
            skills: profile.skills,
            experienceYears: 12, // Extracted from your profile string
            targetRoles: [profile.name, "Nursing Manager", "Clinical Lead"],
            locationPreference: profile.location
          },
          query: searchQuery || profile.name,
          location: profile.location
        })
      });

      const data = await response.json();
      if (data.success) {
        setJobs(data.jobs);
      } else {
        console.error("API Error:", data.message);
      }
    } catch (error) {
      console.error("Failed to fetch jobs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <TrendingUp className="text-white w-5 h-5" />
            </div>
            <span className="font-bold text-xl tracking-tight">CareerPilot</span>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          <a href="#" className="flex items-center gap-3 px-4 py-3 bg-blue-50 text-blue-700 rounded-xl font-medium">
            <Briefcase className="w-5 h-5" /> Dashboard
          </a>
          <a href="/dashboard/interview" className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-xl font-medium transition-colors">
            <User className="w-5 h-5" /> Interview Coach
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-xl font-medium transition-colors">
            <Clock className="w-5 h-5" /> History
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-xl font-medium transition-colors">
            <Settings className="w-5 h-5" /> Settings
          </a>
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button className="flex items-center gap-3 px-4 py-3 w-full text-slate-600 hover:bg-red-50 hover:text-red-600 rounded-xl font-medium transition-colors">
            <LogOut className="w-5 h-5" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">CareerPilot Dashboard</h1>
            <p className="text-slate-500 text-sm">Manage your job search and applications</p>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:text-slate-600 relative">
              <Bell className="w-6 h-6" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-10 w-10 bg-slate-200 rounded-full overflow-hidden border-2 border-white shadow-sm">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Avatar" />
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-8 overflow-y-auto">
          <div className="grid grid-cols-12 gap-8">
            
            {/* Left Column: Profile & Search */}
            <div className="col-span-12 lg:col-span-8 space-y-8">
              
              {/* Profile Summary Card */}
              <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8">
                  <button className="px-4 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    Edit Profile
                  </button>
                </div>
                <div className="flex items-start gap-6">
                  <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center">
                    <User className="w-10 h-10 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">{profile.name}</h2>
                    <div className="flex items-center gap-4 mt-2 text-slate-500">
                      <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {profile.location}</span>
                      <span className="flex items-center gap-1"><Briefcase className="w-4 h-4" /> {profile.experience}</span>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-4">
                      {profile.skills.map((skill, i ) => (
                        <span key={i} className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-medium uppercase tracking-wider">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Job Search Section */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    AI Job Matches
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-md">Live</span>
                  </h3>
                  <div className="flex gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                      <input 
                        type="text" 
                        placeholder="Search roles..." 
                        className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all w-64"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <button 
                      onClick={handleFindJobs}
                      disabled={isLoading}
                      className="px-6 py-2 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 flex items-center gap-2 disabled:opacity-50"
                    >
                      {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                      Find Jobs
                    </button>
                  </div>
                </div>

                {/* Job Cards Grid */}
                <div className="grid grid-cols-1 gap-4">
                  {isLoading ? (
                    <div className="py-20 text-center space-y-4">
                      <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto" />
                      <p className="text-slate-500 font-medium">AI is scanning JSearch & SerpAPI for your perfect match...</p>
                    </div>
                  ) : jobs.length > 0 ? (
                    jobs.map((job, index) => (
                      <div key={index} className="bg-white p-6 rounded-3xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all group">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex gap-4">
                            <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                              <Briefcase className="w-6 h-6 text-slate-400 group-hover:text-blue-600" />
                            </div>
                            <div>
                              <h4 className="font-bold text-slate-900 text-lg">{job.job_title}</h4>
                              <p className="text-blue-600 font-medium">{job.company_name || 'Featured Company'}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`px-3 py-1 rounded-full text-sm font-bold ${job.fitScore >= 80 ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                              {job.fitScore}% Match
                            </div>
                            <p className="text-xs text-slate-400 mt-1 flex items-center justify-end gap-1">
                              <Clock className="w-3 h-3" /> {job.job_posted_at_datetime_utc ? new Date(job.job_posted_at_datetime_utc).toLocaleDateString() : 'Recently'}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
                          <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {job.job_city || job.location}</span>
                          {job.job_min_salary && (
                            <span className="flex items-center gap-1 font-medium text-slate-700">
                              ${(job.job_min_salary/1000).toFixed(0)}k - ${(job.job_max_salary/1000).toFixed(0)}k
                            </span>
                          )}
                        </div>

                        <div className="bg-slate-50 p-4 rounded-2xl mb-4">
                          <p className="text-sm text-slate-600 line-clamp-2">
                            {job.fitExplanation}
                          </p>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                          <div className="flex gap-2">
                            {job.fitBreakdown && Object.entries(job.fitBreakdown).filter(([_, val]: any) => val >= 80).slice(0, 2).map(([key], i) => (
                              <span key={i} className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                                <CheckCircle className="w-3 h-3 text-green-500" /> {key.replace('Match', '')}
                              </span>
                            ))}
                          </div>
                          <div className="flex gap-3">
                            <button className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">
                              View Details
                            </button>
                            <button className="px-6 py-2 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all flex items-center gap-2">
                              Smart Apply <ChevronRight className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-20 text-center bg-white rounded-3xl border border-dashed border-slate-300">
                      <Search className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                      <p className="text-slate-500 font-medium">No jobs found. Try adjusting your search or profile.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Stats & Status */}
            <div className="col-span-12 lg:col-span-4 space-y-8">
              
              {/* Profile Status Card */}
              <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden">
                <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-blue-600/20 rounded-full blur-3xl"></div>
                <h3 className="text-lg font-bold mb-4">Profile Status</h3>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-green-500/20 rounded-2xl flex items-center justify-center">
                    <CheckCircle className="text-green-400 w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-bold">✅ Profile Active</p>
                    <p className="text-slate-400 text-sm">AI is personalizing your search</p>
                  </div>
                </div>
                <button className="w-full py-4 bg-white/10 hover:bg-white/20 rounded-2xl font-bold transition-all border border-white/10">
                  View Campaign Plan
                </button>
              </div>

              {/* Application History Preview */}
              <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-6">Recent Applications</h3>
                <div className="space-y-6">
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Clock className="w-8 h-8 text-slate-300" />
                    </div>
                    <p className="text-slate-500 font-medium">No Applications Yet</p>
                    <p className="text-slate-400 text-xs mt-1">Click "Smart Apply" on job matches to start tracking.</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
