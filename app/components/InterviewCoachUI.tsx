/**
 * CareerPilot AI™: InterviewCoachUI Component
 * 
 * A React component for the interactive AI Interview Coach.
 * This component handles the session state, user input, and displays AI feedback.
 */

import React, { useState } from 'react';

interface InterviewCoachProps {
  jobId: string;
  jobTitle: string;
  jobDescription: string;
  userProfile: any; // Pass the extracted user profile here
}

export const InterviewCoachUI: React.FC<InterviewCoachProps> = ({ 
  jobId, 
  jobTitle, 
  jobDescription, 
  userProfile 
}) => {
  const [status, setStatus] = useState<'idle' | 'interviewing' | 'completed'>('idle');
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [userResponse, setUserResponse] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [history, setHistory] = useState<any[]>([]);
  const [report, setReport] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const startInterview = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/interview-coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'START_SESSION', 
          jobId, 
          jobTitle, 
          jobDescription, 
          userProfile 
        })
      });
      const data = await res.json();
      setSessionId(data.sessionId);
      setCurrentQuestion(data.question);
      setStatus('interviewing');
    } catch (error) {
      console.error("Failed to start interview:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const submitResponse = async () => {
    if (!userResponse.trim()) return;
    setIsLoading(true);
    
    const newHistory = [...history, { question: currentQuestion, response: userResponse }];
    
    try {
      const res = await fetch('/api/interview-coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'SUBMIT_RESPONSE', 
          sessionId, 
          userResponse, 
          history: newHistory,
          jobTitle,
          jobDescription,
          userProfile
        })
      });
      const data = await res.json();
      
      if (data.isLastQuestion) {
        setStatus('completed');
        generateReport(newHistory);
      } else {
        setHistory(newHistory);
        setCurrentQuestion(data.nextQuestion);
        setUserResponse('');
      }
    } catch (error) {
      console.error("Failed to submit response:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateReport = async (finalHistory: any[]) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/interview-coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'GET_REPORT', 
          sessionId, 
          history: finalHistory,
          jobTitle,
          jobDescription,
          userProfile
        })
      });
      const data = await res.json();
      setReport(data.report);
    } catch (error) {
      console.error("Failed to generate report:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-2xl shadow-xl border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">AI Interview Coach</h2>
        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold uppercase tracking-wider">
          {jobTitle}
        </span>
      </div>
      
      {status === 'idle' && (
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2">Ready for your 60-90 day sprint?</h3>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">
            Practice makes perfect. Our AI coach will simulate a real interview for this role and provide a detailed performance report.
          </p>
          <button 
            onClick={startInterview}
            disabled={isLoading}
            className="px-10 py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 disabled:opacity-50"
          >
            {isLoading ? 'Initializing Coach...' : 'Start Practice Session'}
          </button>
        </div>
      )}

      {status === 'interviewing' && (
        <div className="space-y-8 animate-in fade-in duration-500">
          <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
            <p className="text-sm font-bold text-blue-600 uppercase mb-2">AI Interviewer:</p>
            <p className="text-xl text-gray-800 leading-relaxed">{currentQuestion}</p>
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-bold text-gray-700 uppercase">Your Response:</label>
            <textarea 
              value={userResponse}
              onChange={(e) => setUserResponse(e.target.value)}
              disabled={isLoading}
              className="w-full p-5 border-2 border-gray-100 rounded-2xl h-48 focus:border-blue-500 focus:ring-0 outline-none transition-all text-lg"
              placeholder="Speak or type your answer here. Be specific and use the STAR method if possible..."
            />
          </div>

          <div className="flex justify-end">
            <button 
              onClick={submitResponse}
              disabled={isLoading || !userResponse.trim()}
              className="px-8 py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {isLoading ? 'Processing...' : 'Submit Answer'}
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {status === 'completed' && report && (
        <div className="space-y-8 animate-in zoom-in-95 duration-500">
          <div className="flex items-center justify-between p-6 bg-green-50 rounded-2xl border border-green-100">
            <div>
              <p className="text-sm font-bold text-green-600 uppercase">Campaign Readiness Score</p>
              <p className="text-4xl font-black text-green-800">{report.overallScore}%</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-green-700 font-medium">Session Completed</p>
              <p className="text-xs text-green-600">Interview Coach v1.0</p>
            </div>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-2xl">
            <h3 className="font-bold text-gray-800 mb-2">Executive Summary</h3>
            <p className="text-gray-600 leading-relaxed">{report.summary}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-white border border-gray-100 rounded-2xl shadow-sm">
              <h4 className="font-bold text-blue-700 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                Key Strengths
              </h4>
              <ul className="space-y-2">
                {report.strengths.map((s: string, i: number) => (
                  <li key={i} className="text-gray-600 flex items-start gap-2">
                    <span className="text-blue-500 mt-1">•</span> {s}
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-6 bg-white border border-gray-100 rounded-2xl shadow-sm">
              <h4 className="font-bold text-orange-700 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M12 7a1 1 0 110-2h5V2a1 1 0 112 0v5a1 1 0 01-1 1h-6zM2 11a1 1 0 011-1h2V5a1 1 0 012 0v5h5a1 1 0 110 2H7v5a1 1 0 11-2 0v-5H3a1 1 0 01-1-1z" clipRule="evenodd"/></svg>
                Growth Areas
              </h4>
              <ul className="space-y-2">
                {report.improvements.map((s: string, i: number) => (
                  <li key={i} className="text-gray-600 flex items-start gap-2">
                    <span className="text-orange-500 mt-1">•</span> {s}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="p-6 bg-blue-600 rounded-2xl text-white">
            <h4 className="font-bold mb-3">Actionable Tips for Your Campaign:</h4>
            <ul className="space-y-2">
              {report.actionableTips.map((tip: string, i: number) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="bg-blue-500 rounded-full p-1 text-xs">✓</span>
                  <span className="text-blue-50 font-medium">{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          <button 
            onClick={() => setStatus('idle')}
            className="w-full py-4 border-2 border-gray-200 text-gray-600 rounded-xl font-bold hover:bg-gray-50 transition-all"
          >
            Start New Practice Session
          </button>
        </div>
      )}
    </div>
  );
};
