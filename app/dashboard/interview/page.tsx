"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { auth, firestore } from '../../lib/firebase';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { 
  TrendingUp, Search, FileText, Star, Settings, LogOut, 
  Loader2, Sparkles, MessageSquare, ChevronRight, Play, 
  CheckCircle2, AlertCircle, Trophy, Target, X
} from 'lucide-react';

export default function InterviewCoach() {
  const [user, setUser] = useState<any>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [questions, setQuestions] = useState<string[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        try {
          const q = query(collection(firestore, "applications"), where("userId", "==", currentUser.uid));
          const qSnap = await getDocs(q);
          const apps = qSnap.docs.map(d => ({ id: d.id, ...d.data() }));
          setApplications(apps);
        } catch (e) { console.error(e); }
        finally { setIsLoading(false); }
      } else { window.location.href = '/login'; }
    });
    return () => unsubscribe();
  }, []);

  const startCoaching = async (app: any) => {
    setSelectedApp(app);
    setIsGenerating(true);
    setQuestions([]);
    setFeedback(null);
    setCurrentQuestionIndex(0);
    
    try {
      const res = await fetch('/api/generate-interview-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobTitle: app.jobTitle,
          employer: app.employer,
          coverLetter: app.coverLetter
        })
      });
      const data = await res.json();
      if (data.success) setQuestions(data.questions);
    } catch (e) { console.error(e); }
    finally { setIsGenerating(false); }
  };

  const submitAnswer = async () => {
    if (!userAnswer.trim()) return;
    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/analyze-interview-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: questions[currentQuestionIndex],
          answer: userAnswer,
          jobTitle: selectedApp.jobTitle
        })
      });
      const data = await res.json();
      if (data.success) setFeedback(data.feedback);
    } catch (e) { console.error(e); }
    finally { setIsAnalyzing(false); }
  };

  if (isLoading) return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
      <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 flex relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full"></div>
      
      <aside className="w-80 bg-slate-900/50 backdrop-blur-xl border-r border-white/5 p-8 flex flex-col fixed h-full z-[50]">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <TrendingUp className="text-white w-7 h-7" />
          </div>
          <span className="font-black text-2xl tracking-tighter text-white">CareerPilot<span className="text-blue-500">AI</span></span>
        </div>
        
        <nav className="space-y-2 flex-1">
          <button onClick={() => window.location.href = '/dashboard'} className="w-full flex items-center gap-4 p-4 text-slate-500 hover:bg-white/5 hover:text-slate-300 rounded-2xl font-bold transition-all"><Search className="w-5 h-5" /> Job Matches</button>
          <button onClick={() => window.location.href = '/dashboard/resume'} className="w-full flex items-center gap-4 p-4 text-slate-500 hover:bg-white/5 hover:text-slate-300 rounded-2xl font-bold transition-all"><FileText className="w-5 h-5" /> Master Resume</button>
          <button className="w-full flex items-center gap-4 p-4 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-2xl font-bold transition-all"><Star className="w-5 h-5" /> Interview Coach</button>
        </nav>

        <div className="pt-8 border-t border-white/5 space-y-2">
          <button onClick={() => window.location.href = '/profile/edit'} className="w-full flex items-center gap-4 p-4 text-slate-500 hover:bg-white/5 rounded-2xl font-bold transition-all"><Settings className="w-5 h-5" /> Settings</button>
          <button onClick={() => auth.signOut().then(() => window.location.href = '/')} className="w-full flex items-center gap-4 p-4 text-rose-500/70 hover:bg-rose-500/10 rounded-2xl font-bold transition-all"><LogOut className="w-5 h-5" /> Logout</button>
        </div>
      </aside>

      <main className="flex-1 ml-80 p-12 relative z-10">
        <header className="mb-12">
          <h1 className="text-5xl font-black text-white tracking-tight mb-3">AI Interview Coach</h1>
          <p className="text-slate-400 font-medium">Master your pitch for the roles you've applied to.</p>
        </header>

        {!selectedApp ? (
          <div className="grid grid-cols-1 gap-6">
            <h2 className="text-xl font-bold text-white mb-4">Select an Application to Practice</h2>
            {applications.length === 0 ? (
              <div className="bg-slate-900/40 backdrop-blur-md p-12 rounded-[40px] border border-white/5 text-center">
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                  <MessageSquare className="w-10 h-10 text-slate-600" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">No Applications Yet</h3>
                <p className="text-slate-500 mb-8">Apply to a job from your dashboard to start coaching.</p>
                <button onClick={() => window.location.href = '/dashboard'} className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-black hover:bg-blue-500 transition-all">Go to Dashboard</button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-6">
                {applications.map((app, i) => (
                  <motion.div 
                    key={app.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    onClick={() => startCoaching(app)}
                    className="bg-slate-900/40 backdrop-blur-md p-8 rounded-[40px] border border-white/5 hover:border-blue-500/30 transition-all cursor-pointer group"
                  >
                    <div className="flex justify-between items-start mb-6">
                      <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center font-black text-slate-500">{app.employer?.charAt(0)}</div>
                      <div className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-[10px] font-black uppercase tracking-widest">Applied</div>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">{app.jobTitle}</h3>
                    <p className="text-slate-500 font-medium mb-6">{app.employer}</p>
                    <div className="flex items-center text-blue-400 font-black text-sm">
                      Start Mock Interview <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            <AnimatePresence mode="wait">
              {isGenerating ? (
                <motion.div 
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-20 space-y-6"
                >
                  <Loader2 className="w-16 h-16 text-blue-500 animate-spin mx-auto" />
                  <h2 className="text-2xl font-black text-white">Analyzing Job Requirements...</h2>
                  <p className="text-slate-500">Generating realistic interview questions for {selectedApp.employer}.</p>
                </motion.div>
              ) : questions.length > 0 ? (
                <motion.div 
                  key="interview"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-8"
                >
                  <div className="flex justify-between items-center">
                    <button onClick={() => setSelectedApp(null)} className="text-slate-500 hover:text-white font-bold flex items-center gap-2">
                      <X className="w-4 h-4" /> Exit Session
                    </button>
                    <div className="px-4 py-2 bg-white/5 rounded-full text-xs font-black text-slate-400">
                      Question {currentQuestionIndex + 1} of {questions.length}
                    </div>
                  </div>

                  <div className="bg-slate-900/60 backdrop-blur-xl p-10 rounded-[48px] border border-white/10 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
                    <div className="flex gap-6 items-start mb-8">
                      <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                        <Sparkles className="w-6 h-6 text-blue-400" />
                      </div>
                      <h2 className="text-2xl font-black text-white leading-tight">{questions[currentQuestionIndex]}</h2>
                    </div>

                    {!feedback ? (
                      <div className="space-y-6">
                        <textarea 
                          value={userAnswer}
                          onChange={(e) => setUserAnswer(e.target.value)}
                          placeholder="Type your answer here..."
                          className="w-full h-48 p-8 bg-black/40 border border-white/5 rounded-[32px] text-slate-300 outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium"
                        />
                        <button 
                          onClick={submitAnswer}
                          disabled={isAnalyzing || !userAnswer.trim()}
                          className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black hover:bg-blue-500 transition-all shadow-2xl shadow-blue-900/40 flex items-center justify-center gap-3 disabled:opacity-50"
                        >
                          {isAnalyzing ? <Loader2 className="w-6 h-6 animate-spin" /> : <Play className="w-6 h-6" />} Analyze Answer
                        </button>
                      </div>
                    ) : (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="space-y-8"
                      >
                        <div className="grid grid-cols-2 gap-6">
                          <div className="p-6 bg-blue-500/10 rounded-3xl border border-blue-500/20">
                            <div className="flex items-center gap-2 text-blue-400 font-black text-xs uppercase tracking-widest mb-2">
                              <Target className="w-4 h-4" /> Fit Score
                            </div>
                            <div className="text-3xl font-black text-white">{feedback.score}%</div>
                          </div>
                          <div className="p-6 bg-green-500/10 rounded-3xl border border-green-500/20">
                            <div className="flex items-center gap-2 text-green-400 font-black text-xs uppercase tracking-widest mb-2">
                              <Trophy className="w-4 h-4" /> Readiness
                            </div>
                            <div className="text-3xl font-black text-white">{feedback.readiness}</div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <h3 className="font-black text-white uppercase tracking-widest text-xs">AI Feedback</h3>
                          <p className="text-slate-400 leading-relaxed">{feedback.analysis}</p>
                        </div>

                        <div className="pt-6 flex gap-4">
                          <button 
                            onClick={() => { setFeedback(null); setUserAnswer(""); }}
                            className="flex-1 py-4 bg-white/5 border border-white/10 text-slate-400 rounded-2xl font-black hover:bg-white/10 transition-all"
                          >
                            Retry Question
                          </button>
                          <button 
                            onClick={() => {
                              if (currentQuestionIndex < questions.length - 1) {
                                setCurrentQuestionIndex(prev => prev + 1);
                                setFeedback(null);
                                setUserAnswer("");
                              } else {
                                setSelectedApp(null);
                              }
                            }}
                            className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-black hover:bg-blue-500 transition-all shadow-xl shadow-blue-900/20"
                          >
                            {currentQuestionIndex < questions.length - 1 ? "Next Question" : "Finish Session"}
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        )}
      </main>
    </div>
  );
}
