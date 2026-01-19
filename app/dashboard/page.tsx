"use client";
import React, { useState, useEffect } from 'react';
import { Search, MapPin, Briefcase, TrendingUp, Loader2, User } from 'lucide-react';

export default function Dashboard() {
  const [profile] = useState({
    name: "Head Nurse",
    location: "Chicago, IL",
    skills: ["staff supervision", "acute care", "leadership"],
    experience: "12+ years"
  });
  const [jobs, setJobs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const findJobs = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/search-jobs', {
        method: 'POST',
        body: JSON.stringify({ profile, query: "Head Nurse", location: "Chicago, IL" })
      });
      const data = await res.json();
      if (data.success) setJobs(data.jobs);
    } catch (e) { console.error(e); }
    finally { setIsLoading(false); }
  };

  useEffect(() => { findJobs(); }, []);

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-6">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white"><User /></div>
          <div>
            <h1 className="text-2xl font-bold">{profile.name}</h1>
            <p className="text-slate-500">{profile.location} • {profile.experience}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">AI Job Matches (Live)</h2>
            <button onClick={findJobs} className="px-6 py-2 bg-blue-600 text-white rounded-xl font-bold">Refresh</button>
          </div>

          {isLoading ? (
            <div className="py-20 text-center"><Loader2 className="animate-spin mx-auto w-10 h-10 text-blue-600" /><p className="mt-4 text-slate-500">Searching Chicago for Nursing roles...</p></div>
          ) : jobs.length > 0 ? (
            <div className="grid gap-4">
              {jobs.map((job, i) => (
                <div key={i} className="bg-white p-6 rounded-3xl border border-slate-200">
                  <div className="flex justify-between">
                    <h3 className="font-bold text-lg">{job.job_title}</h3>
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full font-bold">{job.fitScore}% Match</span>
                  </div>
                  <p className="text-blue-600 font-medium">{job.company_name}</p>
                  <p className="text-slate-500 text-sm mt-2">{job.fitExplanation}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center border-2 border-dashed rounded-3xl"><p className="text-slate-400">No jobs found yet. Check your API keys.</p></div>
          )}
        </div>
      </div>
    </div>
  );
}
