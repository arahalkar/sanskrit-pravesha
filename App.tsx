
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
  
  // Dynamic captures during session
  const [capturedTopics, setCapturedTopics] = useState<Record<number, TopicContent>>({});
  const [capturedGrandQuiz, setCapturedGrandQuiz] = useState<GrandQuiz | null>(null);
  const [capturedGrandCards, setCapturedGrandCards] = useState<GrandFlashcards | null>(null);
  
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [completedTopics, setCompletedTopics] = useState<Set<number>>(new Set());

  // SAFELY check if AI is available without crashing the module loader
  const isAiCapable = useMemo(() => {
    try {
      return typeof process !== 'undefined' && !!process?.env?.API_KEY;
    } catch (e) {
      return false;
    }
  }, []);

  // Sync Progress
  useEffect(() => {
    const saved = localStorage.getItem('samskrita_completed_topics');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) setCompletedTopics(new Set(parsed));
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('samskrita_completed_topics', JSON.stringify(Array.from(completedTopics)));
  }, [completedTopics]);

  const getTopicData = (id: number): TopicContent | null => {
    if (capturedTopics[id]) return capturedTopics[id];
    // Return pre-loaded if it's not the generic placeholder
    if (TOPIC_DATA[id] && !TOPIC_DATA[id].summaryEnglish.includes("digitized from")) {
      return TOPIC_DATA[id];
    }
    return null;
  };

  const openTopic = async (topic: Topic) => {
    let data = getTopicData(topic.id);

    // AI Capture Path (Admin Only)
    if (!data && isAdminMode && isAiCapable) {
      setLoading(true);
      try {
        data = await generateTopicContent(topic.title);
        setCapturedTopics(prev => ({ ...prev, [topic.id]: data! }));
      } catch (e) {
        console.warn("AI logic bypassed:", e);
      } finally {
        setLoading(false);
      }
    } 
    
    // Fallback/Static Path
    if (!data) {
      data = TOPIC_DATA[topic.id] || {
        summaryEnglish: "Lesson overview coming soon in the next update.",
        summaryMarathi: "या धड्याचा सारांश लवकरच येईल.",
        practiceQuestions: [],
        flashcards: []
      };
    }

    setSelectedTopic(topic);
    setCurrentView('topic');
    window.scrollTo(0, 0);
  };

  const handleTopicQuizComplete = (topicId: number) => {
    setCompletedTopics(prev => new Set(prev).add(topicId));
  };

  const completionPercentage = Math.round((completedTopics.size / TOPICS.length) * 100);

  return (
    <div className="min-h-screen pb-20 bg-[#fffdfa]">
      <header className="bg-orange-600 text-white shadow-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl md:text-2xl font-bold tracking-tight cursor-pointer flex items-center gap-2" onClick={() => setCurrentView('home')}>
             <span className="bg-white text-orange-600 w-8 h-8 rounded-lg flex items-center justify-center text-lg">ॐ</span>
             Samskrita <span className="font-light opacity-80">Praveshah</span>
          </h1>
          
          {/* Admin Toggle - Only visible if key exists or explicitly requested */}
          <div className="flex items-center gap-2">
             <div className="flex items-center gap-2 bg-black/10 px-3 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest">
                <span>Admin Mode</span>
                <button 
                  onClick={() => setIsAdminMode(!isAdminMode)}
                  className={`w-8 h-4 rounded-full transition-all relative ${isAdminMode ? 'bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.5)]' : 'bg-white/20'}`}
                >
                  <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all shadow-sm ${isAdminMode ? 'left-4.5' : 'left-0.5'}`}></div>
                </button>
             </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 mt-8">
        {loading && (
          <div className="fixed inset-0 bg-white/95 flex flex-col items-center justify-center z-[100] backdrop-blur-sm">
            <div className="w-16 h-16 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mb-6"></div>
            <p className="text-orange-900 font-black text-xl animate-pulse">Consulting Guru Gemini...</p>
            <p className="text-slate-400 text-sm mt-2">Digitizing the curriculum</p>
          </div>
        )}

        {currentView === 'home' && (
          <div className="animate-fade-in">
            {/* Elegant Status Card */}
            <div className="bg-white rounded-[2.5rem] p-8 shadow-[0_20px_50px_rgba(255,165,0,0.08)] border border-orange-100/50 mb-10">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div className="flex-1">
                  <h3 className="text-[10px] font-black text-orange-400 uppercase tracking-[0.3em] mb-2">Knowledge Progress</h3>
                  <div className="flex items-end gap-3">
                    <span className="text-6xl font-black text-slate-800 leading-none">{completedTopics.size}</span>
                    <div className="mb-1">
                      <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest leading-none">Lessons</p>
                      <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest leading-none">Mastered</p>
                    </div>
                  </div>
                  <div className="mt-6 w-full bg-slate-100 h-5 rounded-full overflow-hidden p-1 border border-slate-200/50 shadow-inner">
                    <div 
                      className="bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 h-full rounded-full transition-all duration-1000 ease-out flex items-center justify-end px-2"
                      style={{ width: `${Math.max(completionPercentage, 5)}%` }}
                    >
                      <div className="w-1.5 h-1.5 bg-white/50 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-center justify-center bg-gradient-to-br from-orange-500 to-orange-700 text-white w-24 h-24 rounded-[2rem] shadow-2xl shadow-orange-200 border-4 border-white transform hover:scale-105 transition-transform">
                  <span className="text-xs font-bold opacity-60 uppercase mb-0.5">Score</span>
                  <span className="text-3xl font-black leading-none">{completionPercentage}%</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-12">
               <button 
                onClick={() => setCurrentView('grandQuiz')} 
                className="p-8 bg-orange-600 rounded-[2rem] text-left hover:shadow-2xl hover:translate-y-[-4px] transition-all group relative overflow-hidden"
               >
                 <div className="relative z-10">
                   <h3 className="text-2xl font-black text-white mb-2">Grand Final Quiz</h3>
                   <p className="text-orange-100 text-xs font-medium uppercase tracking-widest">The Ultimate Challenge</p>
                 </div>
                 <div className="absolute -right-6 -bottom-6 text-white/10 group-hover:scale-110 transition-transform">
                   <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                 </div>
               </button>
               <button 
                onClick={() => setCurrentView('grandFlashcards')} 
                className="p-8 bg-emerald-600 rounded-[2rem] text-left hover:shadow-2xl hover:translate-y-[-4px] transition-all group relative overflow-hidden"
               >
                 <div className="relative z-10">
                   <h3 className="text-2xl font-black text-white mb-2">Master Cards</h3>
                   <p className="text-emerald-100 text-xs font-medium uppercase tracking-widest">30 Core Concepts</p>
                 </div>
                 <div className="absolute -right-6 -bottom-6 text-white/10 group-hover:scale-110 transition-transform">
                   <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M4 6h16v12H4z"/></svg>
                 </div>
               </button>
            </div>

            {/* Chapter List */}
            <div className="flex items-center justify-between mb-6 px-2">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Curriculum Index</h3>
              <span className="text-[10px] font-bold text-orange-400 uppercase tracking-widest">{TOPICS.length} Topics Total</span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-20">
              {TOPICS.map((topic) => {
                const hasData = !!getTopicData(topic.id);
                const isCompleted = completedTopics.has(topic.id);
                return (
                  <button
                    key={topic.id}
                    onClick={() => openTopic(topic)}
                    className={`flex items-center justify-between p-6 bg-white rounded-3xl border-2 transition-all text-left ${
                      hasData 
                        ? (isCompleted ? 'border-green-100 bg-green-50/10' : 'border-slate-50 hover:border-orange-300 hover:shadow-xl') 
                        : 'border-slate-100 opacity-60 grayscale'
                    }`}
                  >
                    <div className="flex items-center gap-5">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg shadow-sm transition-all ${
                        isCompleted ? 'bg-green-500 text-white shadow-green-100' : 'bg-orange-50 text-orange-600'
                      }`}>
                        {isCompleted ? (
                          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7"></path></svg>
                        ) : topic.id}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 devanagari text-xl leading-none mb-1">{topic.title}</h4>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.15em]">Samskrita • Page {topic.pageNumber}</p>
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
            <button 
              onClick={() => setCurrentView('home')} 
              className="group flex items-center gap-3 text-orange-600 font-black text-xs uppercase tracking-widest"
            >
              <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center group-hover:translate-x-[-2px] transition-transform">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
              </div>
              Back to Dashboard
            </button>
            
            {/* Topic Hero Card */}
            <div className="bg-white p-10 rounded-[3rem] shadow-[0_30px_60px_rgba(0,0,0,0.04)] border border-slate-100 relative overflow-hidden">
               {completedTopics.has(selectedTopic.id) && (
                  <div className="absolute top-6 right-6 bg-green-500 text-white px-5 py-2 rounded-full font-black text-[10px] uppercase tracking-widest shadow-xl flex items-center gap-2">
                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7"></path></svg>
                     Mastered
                  </div>
               )}
               
               <h2 className="text-4xl font-black text-slate-800 devanagari leading-tight pr-20">{selectedTopic.title}</h2>
               
               <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-10">
                 <div className="space-y-4">
                   <div className="flex items-center gap-3">
                     <span className="w-8 h-px bg-orange-400"></span>
                     <h4 className="text-[10px] font-black text-orange-400 uppercase tracking-[0.3em]">English Summary</h4>
                   </div>
                   <p className="text-slate-600 text-lg leading-relaxed font-medium">
                     {(capturedTopics[selectedTopic.id] || TOPIC_DATA[selectedTopic.id] || {}).summaryEnglish}
                   </p>
                 </div>
                 <div className="space-y-4 bg-orange-50/50 p-8 rounded-[2rem] border border-orange-100">
                   <div className="flex items-center gap-3">
                     <span className="w-8 h-px bg-orange-800/30"></span>
                     <h4 className="text-[10px] font-black text-orange-800/40 uppercase tracking-[0.3em]">मराठी सारांश</h4>
                   </div>
                   <p className="text-slate-800 text-lg leading-relaxed devanagari font-medium">
                     {(capturedTopics[selectedTopic.id] || TOPIC_DATA[selectedTopic.id] || {}).summaryMarathi}
                   </p>
                 </div>
               </div>
            </div>

            {/* Questions Section */}
            <section className="space-y-8">
              <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-4">
                <span className="w-3 h-3 rounded-full bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]"></span>
                Practice Quiz
              </h3>
              <QuizView 
                questions={(capturedTopics[selectedTopic.id] || TOPIC_DATA[selectedTopic.id] || {}).practiceQuestions || []} 
                onComplete={() => handleTopicQuizComplete(selectedTopic.id)}
              />
            </section>

            {/* Flashcards Section */}
            <section className="space-y-8">
              <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-4">
                <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></span>
                Memory Cards
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {((capturedTopics[selectedTopic.id] || TOPIC_DATA[selectedTopic.id] || {}).flashcards || []).map((c, i) => (
                  <FlashcardItem key={i} front={c.front} back={c.back} />
                ))}
              </div>
            </section>
          </div>
        )}

        {currentView === 'grandQuiz' && (
           <div className="animate-fade-in pb-20">
              <button onClick={() => setCurrentView('home')} className="text-orange-600 font-black text-xs uppercase mb-10 flex items-center gap-3 group">
                <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center group-hover:translate-x-[-2px] transition-transform">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                </div>
                Return Home
              </button>
              <div className="max-w-2xl mx-auto">
                <h2 className="text-3xl font-black text-center mb-10 text-slate-800">Grand Final Examination</h2>
                <QuizView questions={capturedGrandQuiz?.questions || GRAND_QUIZ.questions} />
              </div>
           </div>
        )}

        {currentView === 'grandFlashcards' && (
           <div className="animate-fade-in pb-20">
              <button onClick={() => setCurrentView('home')} className="text-emerald-600 font-black text-xs uppercase mb-10 flex items-center gap-3 group">
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center group-hover:translate-x-[-2px] transition-transform">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                </div>
                Return Home
              </button>
              <h2 className="text-3xl font-black text-center mb-12 text-slate-800">Master Vocabulary Deck</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {(capturedGrandCards?.flashcards || GRAND_FLASHCARDS.flashcards).map((c, i) => (
                  <FlashcardItem key={i} front={c.front} back={c.back} />
                ))}
              </div>
           </div>
        )}
      </main>
    </div>
  );
};

export default App;
