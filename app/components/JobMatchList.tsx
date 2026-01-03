'use client';

import { useState } from 'react';
import { FiBriefcase, FiMapPin, FiDollarSign, FiExternalLink, FiMail, FiEye } from 'react-icons/fi';
import { trackApplication } from '@/lib/applications';
import { generateCoverLetter } from '@/lib/email-service';
import { useAuth } from '@/lib/firebase';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  applyLink?: string;
  posted?: string;
  salary?: string;
  remote?: boolean;
}

export default function JobMatchList() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState<Set<string>>(new Set());
  const [expandedJob, setExpandedJob] = useState<string | null>(null);
  const [coverLetters, setCoverLetters] = useState<Record<string, string>>({});
  const { user } = useAuth();

  const searchJobs = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/search-jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: 'Senior Frontend Developer React TypeScript',
          location: 'United States',
          remote: true,
        }),
      });

      const data = await response.json();
      setJobs(data.jobs || []);
    } catch (error) {
      console.error('Failed to search jobs:', error);
    }
    setLoading(false);
  };

  const toggleDetails = (jobId: string) => {
    setExpandedJob(expandedJob === jobId ? null : jobId);
  };

  const handleSmartApply = async (job: Job) => {
    if (!user || !job.applyLink) return;

    try {
      setSending(prev => new Set(prev).add(job.id));

      // 1. Track application in Firebase
      await trackApplication(user.uid, {
        jobId: job.id,
        jobTitle: job.title,
        company: job.company,
        location: job.location,
        applyLink: job.applyLink,
        salary: job.salary,
        remote: job.remote,
        status: 'pending', // ✅ ADDED: Required field for new applications
      });

      // 2. Generate AI cover letter
      const resumeText = "Senior Frontend Engineer with 5 years React/TypeScript experience building scalable web applications and leading development teams.";
      const coverLetter = await generateCoverLetter(
        job.title,
        job.company,
        job.description,
        resumeText
      );

      // 3. Store and log cover letter (email sending disabled for now)
      setCoverLetters(prev => ({ ...prev, [job.id]: coverLetter }));
      console.log('=== AI-GENERATED COVER LETTER ===');
      console.log(`For: ${job.title} at ${job.company}`);
      console.log(coverLetter);
      console.log('==================================');

      // 4. Open application link in new tab
      window.open(job.applyLink, '_blank');

    } catch (error) {
      console.error('Application failed:', error);
      alert('Error sending application. Please try again.');
    } finally {
      setSending(prev => {
        const newSet = new Set(prev);
        newSet.delete(job.id);
        return newSet;
      });
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <FiBriefcase className="w-5 h-5 mr-2 text-blue-600" />
          AI Job Matches
        </h3>
        <button 
          onClick={searchJobs}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? 'Searching...' : 'Find Jobs'}
        </button>
      </div>

      {jobs.length > 0 ? (
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {jobs.map((job) => {
            const isSending = sending.has(job.id);
            const isExpanded = expandedJob === job.id;
            const hasCoverLetter = coverLetters[job.id];
            
            return (
              <div key={job.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold text-gray-900">{job.title}</h4>
                    <p className="text-blue-600">{job.company}</p>
                  </div>
                  {job.remote && <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Remote</span>}
                </div>
                
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <FiMapPin className="w-4 h-4 mr-1" />
                  {job.location}
                  {job.salary && (
                    <>
                      <span className="mx-2">•</span>
                      <FiDollarSign className="w-4 h-4 mr-1" />
                      {job.salary}
                    </>
                  )}
                </div>
                
                <p className={`text-sm text-gray-600 mb-3 ${isExpanded ? '' : 'line-clamp-2'}`}>
                  {job.description}
                </p>
                
                {isExpanded && hasCoverLetter && (
                  <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-xs font-medium text-gray-900">AI-Generated Cover Letter:</p>
                    <p className="text-xs text-gray-600 mt-1">{coverLetters[job.id]}</p>
                  </div>
                )}
                
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-400">{job.posted}</span>
                  <div className="space-x-2">
                    {job.applyLink ? (
                      <>
                        <button 
                          onClick={() => toggleDetails(job.id)}
                          className="text-blue-600 text-sm hover:text-blue-800 flex items-center"
                        >
                          <FiEye className="w-3 h-3 mr-1" />
                          {isExpanded ? 'Hide' : 'View Details'}
                        </button>
                        
                        <button 
                          onClick={() => handleSmartApply(job)}
                          disabled={isSending}
                          className={`px-3 py-1 rounded text-sm flex items-center ${isSending ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'} text-white disabled:cursor-not-allowed disabled:bg-gray-400`}
                        >
                          {isSending ? (
                            <>
                              <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin mr-1" />
                              Sending...
                            </>
                          ) : (
                            <>
                              <FiMail className="w-3 h-3 mr-1" />
                              Smart Apply
                            </>
                          )}
                        </button>
                      </>
                    ) : (
                      <span className="text-xs text-gray-400">No apply link</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8">
          <FiBriefcase className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Click "Find Jobs" to see AI matches</p>
        </div>
      )}
    </div>
  );
}
