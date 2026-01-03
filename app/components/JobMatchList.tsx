'use client';

import { useState } from 'react';
import { FiBriefcase, FiMapPin, FiDollarSign, FiExternalLink } from 'react-icons/fi';

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
          {jobs.map((job) => (
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
              
              <p className="text-sm text-gray-600 mb-3">{job.description}</p>
              
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400">{job.posted}</span>
                <div className="space-x-2">
                  <button className="text-blue-600 text-sm hover:text-blue-800">View Details</button>
                  <a 
                    href={job.applyLink}
                    target="_blank"
                    className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 flex items-center"
                  >
                    <FiExternalLink className="w-3 h-3 mr-1" />
                    Apply
                  </a>
                </div>
              </div>
            </div>
          ))}
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
