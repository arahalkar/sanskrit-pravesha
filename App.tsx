
import React, { useState, useEffect } from 'react';
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

  // Check if we can even use AI (Safely check process.env)
  const isAiAvailable = (() => {
    try {
      return !!process.env.API_KEY;
    } catch (e) {
      return false;
    }
  })();

  useEffect(() => {
    const savedProgress = localStorage.getItem('samskrita_completed_topics');
    if (savedProgress) {
      try {
        const parsed = JSON.parse(savedProgress);
        if (Array.isArray(parsed)) setCompletedTopics(new Set(parsed));
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('samskrita_completed_topics', JSON.stringify(Array.from(completedTopics)));
  }, [completedTopics]);

  const getTopicData = (id: number): TopicContent | null => {
    if (capturedTopics[id]) return capturedTopics[id];
    // Check if real data exists in preLoaded
    if (TOPIC_DATA[id] && !TOPIC_DATA[id].summaryEnglish.includes("digitized from")) {
      return TOPIC_DATA[id];
    }
    return null;
  };

  const openTopic = async (topic: Topic) => {
    let data = getTopicData(topic.id);

    // Only attempt AI fetch if in Admin Mode AND AI is actually configured
    if (!data && isAdminMode && isAiAvailable) {
      setLoading(true);
      try {
        data = await generateTopicContent(topic.title);
        setCapturedTopics(prev => ({ ...prev, [topic.id]: data! }));
      } catch (e) {
        console.error("AI Fetch failed", e);
      } finally {
        setLoading(false);
      }
    } 
    
    // Fallback if still no data
    if (!data) {
      data = TOPIC_DATA[topic.id] || {
        summaryEnglish: "Content for this topic will be available soon in the full curriculum update.",
        summaryMarathi: "या विषयाचा मजकूर लवकरच उपलब्ध होईल.",
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

  const fetchGrandQuiz = async () => {
    if (isAdminMode && !capturedGrandQuiz && isAiAvailable) {
      setLoading(true);
      try {
        const data = await generateGrandQuiz();
        setCapturedGrandQuiz(data);
      } catch(e) { console.error(e); }
      finally { setLoading(false); }
    }
    setCurrentView('grandQuiz');
  };

  const fetchGrandFlashcards = async () => {
    if (isAdminMode && !capturedGrandCards && isAiAvailable) {
      setLoading(true);
      try {
        const data = await generateGrandFlashcards();
        setCapturedGrandCards(data);
      } catch(e) { console.error(e); }
      finally { setLoading(false); }
    }
    setCurrentView('grandFlashcards');
  };

  const completionPercentage = Math.round((completedTopics.size / TOPICS.length) * 100);

  return (
    <div className="min-h-screen pb-20 bg-orange-50">
      <header className="bg-orange-600 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl md:text-2xl font-bold tracking-tight cursor-pointer" onClick={() => setCurrentView('home')}>
            Samskrita <span className="text-orange-200 font-medium">Praveshah</span>
          </h1>
          <div className="flex items-center gap-3">
             {/* Only show Admin Toggle if AI key is potentially available or for debugging */}
             <div className="flex items-center gap-2 bg-orange-700/50 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter">
                <span>Admin Mode</span>
                <button 
                  onClick={() => setIsAdminMode(!isAdminMode)}
                  className={`w-7 h-4 rounded-full transition-colors relative ${isAdminMode ? 'bg-green-400' : 'bg-slate-400'}`}
                >
                  <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${isAdminMode ? 'left-3.5' : 'left-0.5'}`}></div>
                </button>
             </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 mt-8">
        {loading && (
          <div className="fixed inset-0 bg-white/90 flex flex-col items-center justify-center z-50">
            <div className="w-12 h-12 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-orange-800 font-bold">Connecting to Sanskrit Tutor AI...</p>
          </div>
        )}

        {currentView === 'home' && (
          <div className="animate-fade-in">
            <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-orange-100 mb-8 relative overflow-hidden">
              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex-1">
                  <h3 className="text-xs font-black text-orange-400 uppercase tracking-widest mb-1">Learning Progress</h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black text-slate-800">{completedTopics.size}</span>
                    <span className="text-slate-400 font-bold uppercase text-[10px]">of {TOPICS.length} Topics Mastered</span>
                  </div>
                  <div className="mt-4 w-full bg-orange-50 h-4 rounded-full overflow-hidden border border-orange-100 p-1">
                    <div 
                      className="bg-gradient-to-r from-orange-400 to-orange-600 h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(249,115,22,0.3)]"
                      style={{ width: `${completionPercentage}%` }}
                    ></div>
                  </div>
                </div>
                <div className="flex items-center justify-center bg-orange-500 text-white w-20 h-20 rounded-3xl shadow-lg border-4 border-white transform rotate-3">
                  <span className="text-2xl font-black">{completionPercentage}%</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
               <button onClick={fetchGrandQuiz} className="p-6 bg-orange-600 rounded-3xl text-left hover:scale-[1.02] transition-all group relative overflow-hidden shadow-xl shadow-orange-200">
                 <div className="relative z-10">
                   <h3 className="text-xl font-bold text-white mb-1">Grand Final Quiz</h3>
                   <p className="text-orange-100 text-xs font-medium">30 Questions Across All Chapters</p>
                 </div>
                 <div className="absolute -right-2 -bottom-2 text-white/10 transform rotate-12">
                   <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                 </div>
               </button>
               <button onClick={fetchGrandFlashcards} className="p-6 bg-emerald-600 rounded-3xl text-left hover:scale-[1.02] transition-all group relative overflow-hidden shadow-xl shadow-emerald-200">
                 <div className="relative z-10">
                   <h3 className="text-xl font-bold text-white mb-1">Master Vocabulary</h3>
                   <p className="text-emerald-100 text-xs font-medium">30 Core Sanskrit Concepts</p>
                 </div>
                 <div className="absolute -right-2 -bottom-2 text-white/10 transform -rotate-12">
                   <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24"><path d="M4 6h16v12H4z"/></svg>
                 </div>
               </button>
            </div>

            <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-4 pl-2">Curriculum Topics</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-10">
              {TOPICS.map((topic) => {
                const hasData = !!getTopicData(topic.id);
                const isCompleted = completedTopics.has(topic.id);
                return (
                  <button
                    key={topic.id}
                    onClick={() => openTopic(topic)}
                    className={`flex items-center justify-between p-5 bg-white rounded-2xl border-2 transition-all text-left ${
                      hasData 
                        ? (isCompleted ? 'border-green-100 bg-green-50/20' : 'border-white hover:border-orange-300 hover:shadow-lg') 
                        : 'border-slate-100 opacity-60 grayscale'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm shadow-sm transition-colors ${
                        isCompleted ? 'bg-green-500 text-white' : 'bg-orange-100 text-orange-600'
                      }`}>
                        {isCompleted ? (
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7"></path></svg>
                        ) : topic.id}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 devanagari leading-tight text-lg">{topic.title}</h4>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Page {topic.pageNumber}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {currentView === 'topic' && selectedTopic && (
          <div className="animate-fade-in space-y-10 pb-12">
            <button onClick={() => setCurrentView('home')} className="flex items-center gap-2 text-orange-600 font-black text-xs uppercase tracking-widest hover:translate-x-[-4px] transition-transform">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
              Dashboard
            </button>
            
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-orange-100 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4">
                 {completedTopics.has(selectedTopic.id) && (
                    <div className="bg-green-500 text-white px-4 py-1.5 rounded-full font-black text-[10px] uppercase tracking-widest shadow-lg flex items-center gap-2">
                       <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7"></path></svg>
                       Mastered
                    </div>
                 )}
               </div>
               <h2 className="text-3xl font-black text-slate-800 devanagari pr-12">{selectedTopic.title}</h2>
               <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-2">
                   <h4 className="text-[10px] font-black text-orange-400 uppercase tracking-[0.2em]">Summary (EN)</h4>
                   <p className="text-slate-600 text-sm leading-relaxed">{(capturedTopics[selectedTopic.id] || TOPIC_DATA[selectedTopic.id] || {}).summaryEnglish}</p>
                 </div>
                 <div className="space-y-2 bg-orange-900/5 p-4 rounded-2xl border border-orange-900/10">
                   <h4 className="text-[10px] font-black text-orange-800/60 uppercase tracking-[0.2em]">सारांश (MR)</h4>
                   <p className="text-slate-800 text-sm leading-relaxed devanagari">{(capturedTopics[selectedTopic.id] || TOPIC_DATA[selectedTopic.id] || {}).summaryMarathi}</p>
                 </div>
               </div>
            </div>

            <section>
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-3 pl-2">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span> Practice Quiz
              </h3>
              <QuizView 
                questions={(capturedTopics[selectedTopic.id] || TOPIC_DATA[selectedTopic.id] || {}).practiceQuestions || []} 
                onComplete={() => handleTopicQuizComplete(selectedTopic.id)}
              />
            </section>

            <section>
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-3 pl-2">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span> Flashcards
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {((capturedTopics[selectedTopic.id] || TOPIC_DATA[selectedTopic.id] || {}).flashcards || []).map((c, i) => (
                  <FlashcardItem key={i} front={c.front} back={c.back} />
                ))}
              </div>
            </section>
          </div>
        )}

        {/* Grand Views simplified for build stability */}
        {currentView === 'grandQuiz' && (
           <div className="animate-fade-in pb-12">
              <button onClick={() => setCurrentView('home')} className="text-orange-600 font-black text-xs uppercase mb-8 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                Exit
              </button>
              <QuizView questions={capturedGrandQuiz?.questions || GRAND_QUIZ.questions} />
           </div>
        )}

        {currentView === 'grandFlashcards' && (
           <div className="animate-fade-in pb-12">
              <button onClick={() => setCurrentView('home')} className="text-emerald-600 font-black text-xs uppercase mb-8 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                Back
              </button>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
