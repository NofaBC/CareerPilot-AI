'use client';

import { useState, useEffect } from 'react';
import { FiBriefcase, FiMapPin, FiDollarSign, FiExternalLink, FiMail, FiEye, FiZap } from 'react-icons/fi';
import { trackApplication } from '@/lib/applications';
import { useAuth } from '@/lib/auth-hooks';
import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';

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
  fitScore?: number;
  matchingSkills?: string[];
  category?: string;
}

export default function JobMatchList() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedJob, setExpandedJob] = useState<string | null>(null);
  const [coverLetters, setCoverLetters] = useState<Record<string, string>>({});
  const [resumeText, setResumeText] = useState<string>('');
  const [smartApplyJob, setSmartApplyJob] = useState<Job | null>(null);
  const [generatingCoverLetter, setGeneratingCoverLetter] = useState(false);
  const [smartApplyStep, setSmartApplyStep] = useState<'generating' | 'ready' | 'applied'>('generating');
  const { user } = useAuth();

  // Load user's resume text for cover letter generation
  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;
      try {
        const profileRef = doc(firestore, 'users', user.uid, 'profile', 'main');
        const profileSnap = await getDoc(profileRef);
        if (profileSnap.exists()) {
          const data = profileSnap.data();
          setResumeText(data.resume || '');
        }
      } catch (error) {
        console.error('Failed to load profile:', error);
      }
    };
    loadProfile();
  }, [user]);

  // Auto-load jobs when component mounts
  useEffect(() => {
    if (user) {
      searchJobs();
    }
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  const searchJobs = async () => {
    if (!user) {
      alert('Please sign in to search jobs');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/search-jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.uid }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        console.error('Job search failed:', data.error);
        alert(`Job search failed: ${data.error || 'Unknown error'}`);
        return;
      }
      
      console.log('Job search results:', data.jobs);
      setJobs(data.jobs || []);
      
      // Don't alert - UI will show helpful message
    } catch (error) {
      console.error('Failed to search jobs:', error);
      alert('Error searching jobs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleDetails = (jobId: string) => {
    setExpandedJob(expandedJob === jobId ? null : jobId);
  };

  const handleSmartApply = async (job: Job) => {
    if (!job.applyLink) {
      alert('No application link available for this job');
      return;
    }

    // Open modal and start generating cover letter
    setSmartApplyJob(job);
    setSmartApplyStep('generating');
    setGeneratingCoverLetter(true);

    try {
      // Generate cover letter
      if (resumeText && job.description) {
        console.log('🤖 Generating cover letter...');
        const response = await fetch('/api/generate-cover-letter', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jobTitle: job.title,
            company: job.company,
            jobDescription: job.description,
            resumeText: resumeText
          })
        });

        const data = await response.json();
        if (data.coverLetter) {
          setCoverLetters(prev => ({ ...prev, [job.id]: data.coverLetter }));
          console.log('✅ Cover letter generated');
        } else {
          setCoverLetters(prev => ({ 
            ...prev, 
            [job.id]: generatePlaceholderCoverLetter(job.title, job.company) 
          }));
        }
      } else {
        // No resume text, use placeholder
        setCoverLetters(prev => ({ 
          ...prev, 
          [job.id]: generatePlaceholderCoverLetter(job.title, job.company) 
        }));
      }

      setSmartApplyStep('ready');
    } catch (error) {
      console.error('❌ Cover letter generation failed:', error);
      // Still show ready state with placeholder
      setCoverLetters(prev => ({ 
        ...prev, 
        [job.id]: generatePlaceholderCoverLetter(job.title, job.company) 
      }));
      setSmartApplyStep('ready');
    } finally {
      setGeneratingCoverLetter(false);
    }
  };

  const handleOpenJobAndApply = async (job: Job) => {
    if (!job.applyLink || !user) return;

    // Track application in Firebase
    try {
      await trackApplication(user.uid, {
        userId: user.uid,
        jobId: job.id,
        jobTitle: job.title,
        company: job.company,
        location: job.location,
        applyLink: job.applyLink,
        salary: job.salary,
        remote: job.remote,
        status: 'applied',
      });
      console.log('✅ Application tracked in Firebase');
    } catch (error) {
      console.error('❌ Failed to track application:', error);
    }

    // Open job link in new tab
    window.open(job.applyLink, '_blank', 'noopener,noreferrer');
    
    // Update modal state
    setSmartApplyStep('applied');
  };

  const handleCopyCoverLetter = (jobId: string) => {
    const coverLetter = coverLetters[jobId];
    if (coverLetter) {
      navigator.clipboard.writeText(coverLetter);
      alert('Cover letter copied to clipboard!');
    }
  };

  const closeSmartApplyModal = () => {
    setSmartApplyJob(null);
    setSmartApplyStep('generating');
  };

  // Fallback placeholder generator (for when API fails)
  function generatePlaceholderCoverLetter(jobTitle: string, company: string): string {
    return `Dear Hiring Manager,

I am writing to express my strong interest in the ${jobTitle} position at ${company}. 

With my proven track record and passion for excellence, I am confident I would be a valuable asset to your team.

I look forward to the opportunity to discuss how my skills and experience align with your needs.

Best regards,
Applicant`;
  }

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
            const isExpanded = expandedJob === job.id;
            const hasCoverLetter = coverLetters[job.id];
            const fitScore = job.fitScore || 0;
            const isExcellentMatch = fitScore >= 80;
            const isGoodMatch = fitScore >= 60;
            
            return (
              <div key={job.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{job.title}</h4>
                    <p className="text-blue-600">{job.company}</p>
                  </div>
                  <div className="flex flex-col items-end space-y-1">
                    {job.remote && <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Remote</span>}
                    {fitScore > 0 && (
                      <span className={`px-2 py-1 text-xs rounded-full font-medium flex items-center ${
                        isExcellentMatch ? 'bg-green-100 text-green-800' :
                        isGoodMatch ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        <FiZap className="w-3 h-3 mr-1" />
                        {fitScore}% Match
                      </span>
                    )}
                  </div>
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

                {job.matchingSkills && job.matchingSkills.length > 0 && (
                  <div className="mb-2">
                    <p className="text-xs text-gray-600">
                      <span className="font-medium">Matching Skills:</span> {job.matchingSkills.join(', ')}
                    </p>
                  </div>
                )}
                
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
                          className="px-3 py-1 rounded text-sm flex items-center bg-green-600 hover:bg-green-700 text-white"
                        >
                          <FiZap className="w-3 h-3 mr-1" />
                          Smart Apply
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
      ) : loading ? (
        <div className="text-center py-8">
          <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-3"></div>
          <p className="text-gray-500">Searching for jobs...</p>
        </div>
      ) : (
        <div className="text-center py-8">
          <FiBriefcase className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-700 font-medium mb-2">No jobs found</p>
          <p className="text-gray-500 text-sm mb-4">Try updating your profile with different skills or location.</p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4 text-left max-w-md mx-auto">
            <p className="text-sm text-blue-900">
              <strong className="font-semibold">International users:</strong> Job availability varies by country. 
              Some regions may have limited listings in English. Consider searching in major cities or 
              English-speaking countries (US, UK, Canada, Australia) for best results.
            </p>
          </div>
        </div>
      )}

      {/* Smart Apply Modal */}
      {smartApplyJob && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{smartApplyJob.title}</h3>
                  <p className="text-blue-600 font-medium">{smartApplyJob.company}</p>
                </div>
                <button 
                  onClick={closeSmartApplyModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Step 1: Generating */}
              {smartApplyStep === 'generating' && (
                <div className="text-center py-12">
                  <div className="inline-block">
                    <svg className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Generating Your Cover Letter...</h4>
                  <p className="text-gray-600">Our AI is analyzing the job and crafting a personalized cover letter for you.</p>
                </div>
              )}

              {/* Step 2: Ready */}
              {smartApplyStep === 'ready' && (
                <div>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                    <div className="flex items-start">
                      <svg className="w-6 h-6 text-green-600 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <h4 className="font-semibold text-green-900 mb-1">Cover Letter Ready!</h4>
                        <p className="text-sm text-green-700">Your personalized cover letter has been generated and is ready to use.</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4 max-h-64 overflow-y-auto">
                    <div className="flex justify-between items-start mb-2">
                      <h5 className="font-medium text-gray-900">Your Cover Letter:</h5>
                      <button
                        onClick={() => handleCopyCoverLetter(smartApplyJob.id)}
                        className="text-sm text-blue-600 hover:text-blue-700 flex items-center"
                      >
                        <FiMail className="w-3 h-3 mr-1" />
                        Copy
                      </button>
                    </div>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{coverLetters[smartApplyJob.id]}</p>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <p className="text-sm text-blue-900">
                      <strong>Next steps:</strong> Click "Open Job & Apply" to visit the employer's website in a new tab. 
                      You can paste the cover letter above into their application form.
                    </p>
                  </div>

                  <button
                    onClick={() => handleOpenJobAndApply(smartApplyJob)}
                    className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center"
                  >
                    <FiExternalLink className="w-5 h-5 mr-2" />
                    Open Job & Apply
                  </button>
                </div>
              )}

              {/* Step 3: Applied */}
              {smartApplyStep === 'applied' && (
                <div className="text-center py-12">
                  <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Application Tracked!</h4>
                  <p className="text-gray-600 mb-6">We've tracked this application in your dashboard. Good luck with your interview!</p>
                  <button
                    onClick={closeSmartApplyModal}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
