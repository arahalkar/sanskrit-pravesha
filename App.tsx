
import React, { useState, useEffect, useMemo } from 'react';
import { TOPICS } from './constants';
import { Topic, TopicContent, GrandQuiz, GrandFlashcards } from './types';
import { TOPIC_DATA, GRAND_QUIZ, GRAND_FLASHCARDS } from './preLoaded';
import { generateTopicContent, generateGrandQuiz, generateGrandFlashcards } from './services/geminiService';
import FlashcardItem from './components/FlashcardItem';
import QuizView from './components/QuizView';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'home' | 'topic' | 'grandQuiz' | 'grandFlashcards'>('home');
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [loading, setLoading] = useState(false);
  
  const [capturedTopics, setCapturedTopics] = useState<Record<number, TopicContent>>({});
  const [capturedGrandQuiz, setCapturedGrandQuiz] = useState<GrandQuiz | null>(null);
  const [capturedGrandCards, setCapturedGrandCards] = useState<GrandFlashcards | null>(null);
  
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [completedTopics, setCompletedTopics] = useState<Set<number>>(new Set());

  // ULTRA-SAFE Environment Check
  const isAiCapable = useMemo(() => {
    try {
      // Use window.process polyfill from index.html
      const win = window as any;
      return !!(win.process?.env?.API_KEY || win._GEMINI_API_KEY);
    } catch (e) {
      return false;
    }
  }, []);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('samskrita_completed_topics');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) setCompletedTopics(new Set(parsed));
      }
    } catch (e) {}
  }, []);

  useEffect(() => {
    localStorage.setItem('samskrita_completed_topics', JSON.stringify(Array.from(completedTopics)));
  }, [completedTopics]);

  const getTopicData = (id: number): TopicContent | null => {
    if (capturedTopics[id]) return capturedTopics[id];
    if (TOPIC_DATA[id] && !TOPIC_DATA[id].summaryEnglish.includes("digitized from")) {
      return TOPIC_DATA[id];
    }
    return null;
  };

  const openTopic = async (topic: Topic) => {
    let data = getTopicData(topic.id);

    if (!data && isAdminMode && isAiCapable) {
      setLoading(true);
      try {
        data = await generateTopicContent(topic.title);
        if (data) setCapturedTopics(prev => ({ ...prev, [topic.id]: data! }));
      } catch (e) {
        console.error("Gemini Capture Error:", e);
      } finally {
        setLoading(false);
      }
    } 
    
    if (!data) {
      data = TOPIC_DATA[topic.id] || {
        summaryEnglish: "Static content loaded. Full digitizing in progress.",
        summaryMarathi: "धड्याचा सारांश उपलब्ध आहे.",
        practiceQuestions: [],
        flashcards: []
      };
    }

    setSelectedTopic(topic);
    setCurrentView('topic');
    window.scrollTo(0, 0);
  };

  const handleTopicQuizComplete = (topicId: number) => {
    setCompletedTopics(prev => {
      const next = new Set(prev);
      next.add(topicId);
      return next;
    });
  };

  const completionPercentage = Math.round((completedTopics.size / TOPICS.length) * 100);

  return (
    <div className="min-h-screen pb-20 bg-[#fffdfa] selection:bg-orange-100">
      <header className="bg-orange-600 text-white shadow-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <button onClick={() => setCurrentView('home')} className="text-xl md:text-2xl font-bold tracking-tight flex items-center gap-2">
             <span className="bg-white text-orange-600 w-8 h-8 rounded-lg flex items-center justify-center text-lg shadow-sm">ॐ</span>
             Samskrita <span className="font-light opacity-90">Praveshah</span>
          </button>
          
          <div className="flex items-center gap-2">
             <div className="flex items-center gap-2 bg-black/10 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.1em]">
                <span>AI Mode</span>
                <button 
                  onClick={() => setIsAdminMode(!isAdminMode)}
                  className={`w-8 h-4 rounded-full transition-all relative ${isAdminMode ? 'bg-green-400' : 'bg-white/20'}`}
                >
                  <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${isAdminMode ? 'left-4.5' : 'left-0.5'}`}></div>
                </button>
             </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 mt-8">
        {loading && (
          <div className="fixed inset-0 bg-white/95 flex flex-col items-center justify-center z-[100] backdrop-blur-sm">
            <div className="w-16 h-16 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mb-6"></div>
            <p className="text-orange-900 font-black text-xl animate-pulse">Consulting AI...</p>
          </div>
        )}

        {currentView === 'home' && (
          <div className="animate-fade-in">
            {/* Progress Card */}
            <div className="bg-white rounded-[2.5rem] p-8 shadow-[0_20px_60px_rgba(249,115,22,0.08)] border border-orange-100/50 mb-10">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div className="flex-1">
                  <h3 className="text-[10px] font-black text-orange-400 uppercase tracking-[0.3em] mb-2">Mastery Progress</h3>
                  <div className="flex items-end gap-3">
                    <span className="text-6xl font-black text-slate-800 leading-none">{completedTopics.size}</span>
                    <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mb-1">Topics Completed</p>
                  </div>
                  <div className="mt-6 w-full bg-slate-100 h-4 rounded-full overflow-hidden shadow-inner">
                    <div 
                      className="bg-orange-500 h-full rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${Math.max(completionPercentage, 4)}%` }}
                    ></div>
                  </div>
                </div>
                <div className="bg-orange-500 text-white w-24 h-24 rounded-[2rem] flex flex-col items-center justify-center shadow-2xl shadow-orange-200 border-4 border-white transform rotate-2">
                  <span className="text-[10px] font-black opacity-70 uppercase">Total</span>
                  <span className="text-3xl font-black">{completionPercentage}%</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
               <button 
                onClick={() => setCurrentView('grandQuiz')} 
                className="p-8 bg-orange-600 rounded-[2.5rem] text-left hover:shadow-2xl transition-all group relative overflow-hidden"
               >
                 <div className="relative z-10">
                   <h3 className="text-2xl font-black text-white mb-2">Grand Quiz</h3>
                   <p className="text-orange-100 text-[10px] font-black uppercase tracking-widest">30 Questions</p>
                 </div>
                 <div className="absolute -right-6 -bottom-6 text-white/10 group-hover:scale-110 transition-transform">
                   <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                 </div>
               </button>
               <button 
                onClick={() => setCurrentView('grandFlashcards')} 
                className="p-8 bg-emerald-600 rounded-[2.5rem] text-left hover:shadow-2xl transition-all group relative overflow-hidden"
               >
                 <div className="relative z-10">
                   <h3 className="text-2xl font-black text-white mb-2">Master Cards</h3>
                   <p className="text-emerald-100 text-[10px] font-black uppercase tracking-widest">Core Vocabulary</p>
                 </div>
                 <div className="absolute -right-6 -bottom-6 text-white/10 group-hover:scale-110 transition-transform">
                   <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M4 6h16v12H4z"/></svg>
                 </div>
               </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-20">
              {TOPICS.map((topic) => {
                const hasData = !!getTopicData(topic.id);
                const isCompleted = completedTopics.has(topic.id);
                return (
                  <button
                    key={topic.id}
                    onClick={() => openTopic(topic)}
                    className={`flex items-center justify-between p-6 bg-white rounded-3xl border-2 transition-all ${
                      isCompleted ? 'border-green-100 bg-green-50/10' : 'border-slate-50 hover:border-orange-200 hover:shadow-lg'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg ${
                        isCompleted ? 'bg-green-500 text-white' : 'bg-orange-50 text-orange-600'
                      }`}>
                        {isCompleted ? '✓' : topic.id}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 devanagari text-xl leading-tight">{topic.title}</h4>
                        <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mt-0.5">Page {topic.pageNumber}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {currentView === 'topic' && selectedTopic && (
          <div className="animate-fade-in space-y-12 pb-24">
            <button onClick={() => setCurrentView('home')} className="flex items-center gap-2 text-orange-600 font-black text-xs uppercase tracking-[0.2em] mb-8">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
              Home
            </button>
            
            <div className="bg-white p-10 rounded-[3rem] border border-orange-100/50 shadow-sm relative overflow-hidden">
               <h2 className="text-4xl font-black text-slate-800 devanagari pr-20">{selectedTopic.title}</h2>
               <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-10">
                 <div className="space-y-4">
                   <h4 className="text-[10px] font-black text-orange-400 uppercase tracking-[0.3em]">English</h4>
                   <p className="text-slate-600 text-lg leading-relaxed">{(getTopicData(selectedTopic.id) || TOPIC_DATA[selectedTopic.id]).summaryEnglish}</p>
                 </div>
                 <div className="space-y-4 bg-orange-50/50 p-6 rounded-2xl border border-orange-100">
                   <h4 className="text-[10px] font-black text-orange-800/40 uppercase tracking-[0.3em]">मराठी</h4>
                   <p className="text-slate-800 text-lg leading-relaxed devanagari">{(getTopicData(selectedTopic.id) || TOPIC_DATA[selectedTopic.id]).summaryMarathi}</p>
                 </div>
               </div>
            </div>

            <section className="space-y-6">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-4">
                <span className="w-4 h-1 bg-orange-500 rounded-full"></span> Practice Quiz
              </h3>
              <QuizView 
                questions={(getTopicData(selectedTopic.id) || TOPIC_DATA[selectedTopic.id]).practiceQuestions || []} 
                onComplete={() => handleTopicQuizComplete(selectedTopic.id)}
              />
            </section>

            <section className="space-y-6">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-4">
                <span className="w-4 h-1 bg-emerald-500 rounded-full"></span> Flashcards
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {(getTopicData(selectedTopic.id) || TOPIC_DATA[selectedTopic.id]).flashcards.map((c, i) => (
                  <FlashcardItem key={i} front={c.front} back={c.back} />
                ))}
              </div>
            </section>
          </div>
        )}

        {(currentView === 'grandQuiz' || currentView === 'grandFlashcards') && (
           <div className="pb-20">
              <button onClick={() => setCurrentView('home')} className="text-orange-600 font-black text-xs uppercase mb-10 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                Exit
              </button>
              {currentView === 'grandQuiz' ? (
                 <QuizView questions={capturedGrandQuiz?.questions || GRAND_QUIZ.questions} />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {(capturedGrandCards?.flashcards || GRAND_FLASHCARDS.flashcards).map((c, i) => (
                    <FlashcardItem key={i} front={c.front} back={c.back} />
                  ))}
                </div>
              )}
           </div>
        )}
      </main>
    </div>
  );
};

export default App;
