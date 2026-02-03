"use client";

export const dynamic = "force-dynamic";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { auth, firestore } from '../../lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { 
  TrendingUp, Search, FileText, Star, Settings, LogOut, 
  Loader2, Sparkles, MessageSquare, ChevronRight, Play, 
  Trophy, Target, X, BrainCircuit, ChevronLeft
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
          const querySnapshot = await getDocs(q);
          const apps = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setApplications(apps);
        } catch (error) {
          console.error("Error fetching applications:", error);
        } finally {
          setIsLoading(false);
        }
      } else {
        window.location.href = '/login';
      }
    });
    return () => unsubscribe();
  }, []);

  const startInterview = async (app: any) => {
    setSelectedApp(app);
    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate-interview-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobTitle: app.jobTitle,
          company: app.company,
          coverLetter: app.coverLetter
        }),
      });
      const data = await response.json();
      if (data.success) {
        setQuestions(data.questions);
        setCurrentQuestionIndex(0);
      }
    } catch (error) {
      console.error("Error generating questions:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const submitAnswer = async () => {
    if (!userAnswer.trim()) return;
    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/analyze-interview-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: questions[currentQuestionIndex],
          answer: userAnswer,
          jobTitle: selectedApp.jobTitle
        }),
      });
      const data = await response.json();
      if (data.success) {
        setFeedback(data.feedback);
      }
    } catch (error) {
      console.error("Error analyzing answer:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 p-8">
      <main className="max-w-6xl mx-auto">
        <header className="mb-12 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-black text-white tracking-tight flex items-center gap-3">
              <BrainCircuit className="text-blue-500 w-10 h-10" /> AI Interview Coach
            </h1>
            <p className="text-slate-400 mt-2">Practice role-specific questions and get instant AI feedback.</p>
          </div>
          <button 
            onClick={() => window.location.href = '/dashboard'}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors font-bold"
          >
            <ChevronLeft className="w-5 h-5" /> Back to Command Center
          </button>
        </header>

        {!selectedApp ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {applications.length > 0 ? (
              applications.map((app) => (
                <motion.div 
                  key={app.id}
                  whileHover={{ y: -5 }}
                  className="bg-slate-900/50 backdrop-blur-xl border border-white/5 p-6 rounded-[32px] flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-all">
                        <Briefcase className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-black uppercase tracking-widest text-slate-500">Ready to Practice</span>
                    </div>
                    <h3 className="text-xl font-black text-white mb-1">{app.jobTitle}</h3>
                    <p className="text-slate-400 text-sm mb-6">{app.company}</p>
                  </div>
                  <button 
                    onClick={() => startInterview(app)}
                    className="w-full py-4 bg-white/5 hover:bg-blue-600 text-white rounded-2xl font-bold transition-all flex items-center justify-center gap-2"
                  >
                    <Play className="w-4 h-4" /> Start Mock Interview
                  </button>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-20 bg-slate-900/30 rounded-[40px] border border-dashed border-white/10">
                <Target className="w-16 h-16 text-slate-700 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-400">No applications found</h3>
                <p className="text-slate-500 mt-2">Apply to a job first to start practicing.</p>
              </div>
            )}
          </div>
        ) : (
          <div className="max-w-3xl mx-auto">
            <AnimatePresence mode="wait">
              {isGenerating ? (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="text-center py-20"
                >
                  <div className="relative w-24 h-24 mx-auto mb-8">
                    <div className="absolute inset-0 border-4 border-blue-500/20 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-t-blue-500 rounded-full animate-spin"></div>
                    <Sparkles className="absolute inset-0 m-auto w-10 h-10 text-blue-400 animate-pulse" />
                  </div>
                  <h2 className="text-2xl font-black text-white mb-2">Analyzing Role Context...</h2>
                  <p className="text-slate-400">Generating 5 realistic interview questions for {selectedApp.jobTitle}.</p>
                </motion.div>
              ) : questions.length > 0 ? (
                <motion.div 
                  initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                  className="space-y-8"
                >
                  <div className="bg-slate-900/80 backdrop-blur-2xl border border-white/10 p-10 rounded-[40px] shadow-2xl">
                    <div className="flex items-center justify-between mb-8">
                      <span className="px-4 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-black uppercase tracking-widest">
                        Question {currentQuestionIndex + 1} of {questions.length}
                      </span>
                      <button onClick={() => setSelectedApp(null)} className="text-slate-500 hover:text-white"><X className="w-6 h-6" /></button>
                    </div>
                    <h2 className="text-3xl font-black text-white leading-tight mb-10">
                      "{questions[currentQuestionIndex]}"
                    </h2>

                    {!feedback ? (
                      <div className="space-y-6">
                        <textarea 
                          value={userAnswer}
                          onChange={(e) => setUserAnswer(e.target.value)}
                          placeholder="Type your answer here..."
                          className="w-full h-48 bg-black/40 border border-white/5 rounded-3xl p-6 text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 transition-all resize-none text-lg"
                        />
                        <button 
                          onClick={submitAnswer}
                          disabled={isAnalyzing || !userAnswer.trim()}
                          className="w-full py-5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-2xl font-black text-xl transition-all shadow-xl shadow-blue-900/20 flex items-center justify-center gap-3"
                        >
                          {isAnalyzing ? <><Loader2 className="w-6 h-6 animate-spin" /> Analyzing...</> : <><MessageSquare className="w-6 h-6" /> Submit Answer</>}
                        </button>
                      </div>
                    ) : (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-white/5 p-6 rounded-3xl border border-white/5">
                            <div className="text-slate-500 text-xs font-black uppercase mb-2">Fit Score</div>
                            <div className="text-4xl font-black text-blue-400">{feedback.score}%</div>
                          </div>
                          <div className="bg-white/5 p-6 rounded-3xl border border-white/5">
                            <div className="text-slate-500 text-xs font-black uppercase mb-2">Readiness</div>
                            <div className="text-4xl font-black text-indigo-400">{feedback.readiness}</div>
                          </div>
                        </div>
                        <div className="bg-blue-500/5 border border-blue-500/20 p-8 rounded-3xl">
                          <div className="flex items-center gap-2 text-blue-400 font-black uppercase text-xs mb-4">
                            <Sparkles className="w-4 h-4" /> AI Analysis & Feedback
                          </div>
                          <p className="text-slate-300 leading-relaxed text-lg italic">"{feedback.analysis}"</p>
                        </div>
                        <div className="flex gap-4">
                          <button 
                            onClick={() => { setFeedback(null); setUserAnswer(""); }}
                            className="flex-1 py-4 bg-white/5 text-white rounded-2xl font-bold hover:bg-white/10 transition-all"
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
              ) : (
                <div className="text-center py-20">
                  <p className="text-slate-500">Failed to load questions. Please try again.</p>
                  <button onClick={() => setSelectedApp(null)} className="mt-4 text-blue-400 font-bold">Go Back</button>
                </div>
              )}
            </AnimatePresence>
          </div>
        )}
      </main>
    </div>
  );
}
