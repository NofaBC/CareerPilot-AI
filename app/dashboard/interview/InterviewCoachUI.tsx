/**
 * CareerPilot AI™: InterviewCoachUI Component
 * 
 * A React component for the interactive AI Interview Coach.
 */

import React, { useState, useEffect } from 'react';

interface InterviewCoachProps {
  jobId: string;
  jobTitle: string;
}

export const InterviewCoachUI: React.FC<InterviewCoachProps> = ({ jobId, jobTitle }) => {
  const [status, setStatus] = useState<'idle' | 'interviewing' | 'completed'>('idle');
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [userResponse, setUserResponse] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [report, setReport] = useState<any>(null);
  const [isRecording, setIsRecording] = useState(false);

  const startInterview = async () => {
    setStatus('interviewing');
    // Call /api/interview with action: 'START_SESSION'
    const res = await fetch('/api/interview', {
      method: 'POST',
      body: JSON.stringify({ action: 'START_SESSION', jobId })
    });
    const data = await res.json();
    setSessionId(data.sessionId);
    setCurrentQuestion(data.question);
  };

  const submitResponse = async () => {
    // Call /api/interview with action: 'SUBMIT_RESPONSE'
    const res = await fetch('/api/interview', {
      method: 'POST',
      body: JSON.stringify({ action: 'SUBMIT_RESPONSE', sessionId, userResponse })
    });
    const data = await res.json();
    
    if (data.isLastQuestion) {
      setStatus('completed');
      getReport();
    } else {
      setCurrentQuestion(data.nextQuestion);
      setUserResponse('');
    }
  };

  const getReport = async () => {
    const res = await fetch(`/api/interview?action=GET_REPORT&sessionId=${sessionId}`);
    const data = await res.json();
    setReport(data.report);
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-200">
      <h2 className="text-2xl font-bold mb-4">AI Interview Coach: {jobTitle}</h2>
      
      {status === 'idle' && (
        <div className="text-center py-10">
          <p className="mb-6 text-gray-600">Ready to practice for this role? Our AI coach will ask you 3-5 tailored questions.</p>
          <button 
            onClick={startInterview}
            className="px-8 py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition"
          >
            Start Practice Session
          </button>
        </div>
      )}

      {status === 'interviewing' && (
        <div className="space-y-6">
          <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
            <p className="font-medium text-blue-800">AI Coach:</p>
            <p className="text-lg">{currentQuestion}</p>
          </div>

          <div className="space-y-2">
            <label className="block font-medium text-gray-700">Your Response:</label>
            <textarea 
              value={userResponse}
              onChange={(e) => setUserResponse(e.target.value)}
              className="w-full p-4 border rounded-lg h-32 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Type or record your answer here..."
            />
          </div>

          <div className="flex justify-between items-center">
            <button 
              onClick={() => setIsRecording(!isRecording)}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${isRecording ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'}`}
            >
              {isRecording ? 'Stop Recording' : 'Start Recording'}
            </button>
            <button 
              onClick={submitResponse}
              className="px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700"
            >
              Submit Answer
            </button>
          </div>
        </div>
      )}

      {status === 'completed' && report && (
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
            <span className="text-xl font-bold text-green-800">Overall Score: {report.overallScore}%</span>
            <span className="px-3 py-1 bg-green-200 text-green-800 rounded-full text-sm font-bold">COMPLETED</span>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-2">Summary</h3>
            <p className="text-gray-700">{report.summary}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-bold text-blue-800 mb-2">Strengths</h4>
              <ul className="list-disc list-inside text-blue-700">
                {report.strengths.map((s: string, i: number) => <li key={i}>{s}</li>)}
              </ul>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg">
              <h4 className="font-bold text-orange-800 mb-2">Areas for Improvement</h4>
              <ul className="list-disc list-inside text-orange-700">
                {report.improvements.map((s: string, i: number) => <li key={i}>{s}</li>)}
              </ul>
            </div>
          </div>

          <button 
            onClick={() => setStatus('idle')}
            className="w-full py-3 border-2 border-blue-600 text-blue-600 rounded-lg font-bold hover:bg-blue-50"
          >
            Practice Again
          </button>
        </div>
      )}
    </div>
  );
};
