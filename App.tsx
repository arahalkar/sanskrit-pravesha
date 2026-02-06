
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
  
  // Data State
  const [capturedTopics, setCapturedTopics] = useState<Record<number, TopicContent>>({});
  const [capturedGrandQuiz, setCapturedGrandQuiz] = useState<GrandQuiz | null>(null);
  const [capturedGrandCards, setCapturedGrandCards] = useState<GrandFlashcards | null>(null);
  const [isAdminMode, setIsAdminMode] = useState(false);

  const getTopicData = (id: number): TopicContent | null => {
    // 1. Check if we just fetched it this session
    if (capturedTopics[id]) return capturedTopics[id];
    // 2. Check if it's already properly defined in preLoaded (not the placeholder)
    if (TOPIC_DATA[id] && !TOPIC_DATA[id].summaryEnglish.includes("digitized from the Bhaashaa Praveshah book")) {
      return TOPIC_DATA[id];
    }
    return null;
  };

  const openTopic = async (topic: Topic) => {
    let data = getTopicData(topic.id);

    if (!data && isAdminMode) {
      setLoading(true);
      try {
        data = await generateTopicContent(topic.title);
        setCapturedTopics(prev => ({ ...prev, [topic.id]: data! }));
      } catch (e) {
        alert("AI Fetch failed. Ensure API Key is valid.");
      } finally {
        setLoading(false);
      }
    } else if (!data) {
      // Fallback to static generic if not in admin mode
      data = TOPIC_DATA[topic.id] || {
        summaryEnglish: "Placeholder content. Enable Admin Mode to fetch live data.",
        summaryMarathi: "येथे मजकूर नाही. डेटा मिळवण्यासाठी ॲडमिन मोड सुरू करा.",
        practiceQuestions: [],
        flashcards: []
      };
    }

    setSelectedTopic(topic);
    setCurrentView('topic');
    window.scrollTo(0, 0);
  };

  const fetchGrandQuiz = async () => {
    if (isAdminMode && !capturedGrandQuiz) {
      setLoading(true);
      try {
        const data = await generateGrandQuiz();
        setCapturedGrandQuiz(data);
      } finally {
        setLoading(false);
      }
    }
    setCurrentView('grandQuiz');
  };

  const fetchGrandFlashcards = async () => {
    if (isAdminMode && !capturedGrandCards) {
      setLoading(true);
      try {
        const data = await generateGrandFlashcards();
        setCapturedGrandCards(data);
      } finally {
        setLoading(false);
      }
    }
    setCurrentView('grandFlashcards');
  };

  const downloadFullData = () => {
    // Merge everything for export
    const fullExport = {
      topics: { ...TOPIC_DATA, ...capturedTopics },
      grandQuiz: capturedGrandQuiz || GRAND_QUIZ,
      grandFlashcards: capturedGrandCards || GRAND_FLASHCARDS
    };
    
    const blob = new Blob([JSON.stringify(fullExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'samskrita_curriculum_data.json';
    a.click();
  };

  const hasRealData = (id: number) => !!getTopicData(id);

  return (
    <div className="min-h-screen pb-20">
      <header className="bg-orange-600 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl md:text-2xl font-bold tracking-tight cursor-pointer" onClick={() => setCurrentView('home')}>
            Samskrita <span className="text-orange-200">Praveshah</span>
          </h1>
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2 bg-orange-700 px-3 py-1 rounded-full text-xs">
                <span>Admin Capture</span>
                <button 
                  onClick={() => setIsAdminMode(!isAdminMode)}
                  className={`w-8 h-4 rounded-full transition-colors relative ${isAdminMode ? 'bg-green-400' : 'bg-slate-400'}`}
                >
                  <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${isAdminMode ? 'left-4.5' : 'left-0.5'}`}></div>
                </button>
             </div>
             {isAdminMode && (
               <button 
                onClick={downloadFullData}
                className="bg-white text-orange-600 text-xs font-bold px-3 py-1 rounded-md hover:bg-orange-50"
               >
                 Export JSON
               </button>
             )}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 mt-8">
        {loading && (
          <div className="fixed inset-0 bg-white/80 flex flex-col items-center justify-center z-50">
            <div className="w-12 h-12 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-orange-800 font-medium">Fetching from Gemini AI...</p>
            <p className="text-xs text-orange-600 mt-2">Updating curriculum memory</p>
          </div>
        )}

        {currentView === 'home' && (
          <div className="animate-fade-in">
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-bold text-orange-900 mb-2">Sanskrit Learning Portal</h2>
              <p className="text-slate-600 text-sm">
                {isAdminMode 
                  ? "Admin Mode Active: Click topics to fetch and save their content using AI." 
                  : "Welcome student! Choose a topic below to begin your journey."}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
               <button onClick={fetchGrandQuiz} className="p-6 bg-orange-100 border-2 border-orange-300 rounded-3xl text-left hover:bg-orange-200 transition group">
                 <h3 className="text-xl font-bold text-orange-900">Grand Quiz</h3>
                 <p className="text-orange-800/70 text-sm">30 Master Questions</p>
               </button>
               <button onClick={fetchGrandFlashcards} className="p-6 bg-emerald-100 border-2 border-emerald-300 rounded-3xl text-left hover:bg-emerald-200 transition group">
                 <h3 className="text-xl font-bold text-emerald-900">Master Deck</h3>
                 <p className="text-emerald-800/70 text-sm">30 Revision Cards</p>
               </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {TOPICS.map((topic) => {
                const captured = hasRealData(topic.id);
                return (
                  <button
                    key={topic.id}
                    onClick={() => openTopic(topic)}
                    className={`flex items-center justify-between p-4 bg-white rounded-2xl border transition text-left group ${captured ? 'border-orange-200' : 'border-slate-100 opacity-60'}`}
                  >
                    <div className="flex items-center gap-4">
                      <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${captured ? 'bg-orange-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
                        {topic.id}
                      </span>
                      <div>
                        <h4 className="font-semibold text-slate-800 devanagari leading-tight">{topic.title}</h4>
                        <p className="text-[10px] text-slate-400 uppercase tracking-widest">Page {topic.pageNumber}</p>
                      </div>
                    </div>
                    {isAdminMode && (
                      <span className={`text-[10px] px-2 py-0.5 rounded uppercase font-bold ${captured ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                        {captured ? 'Captured' : 'Empty'}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {(currentView === 'topic' && (capturedTopics[selectedTopic?.id || 0] || TOPIC_DATA[selectedTopic?.id || 0])) && (
          <div className="animate-fade-in space-y-12 pb-12">
            <button onClick={() => setCurrentView('home')} className="flex items-center gap-2 text-orange-600 font-bold mb-6">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
              Back
            </button>
            <h2 className="text-3xl font-bold text-orange-900 devanagari">{selectedTopic?.title}</h2>
            
            <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-3xl border border-orange-100">
                <h3 className="font-bold text-orange-700 mb-2">English Summary</h3>
                <p className="text-sm text-slate-700">{(capturedTopics[selectedTopic!.id] || TOPIC_DATA[selectedTopic!.id]).summaryEnglish}</p>
              </div>
              <div className="bg-orange-900 text-orange-50 p-6 rounded-3xl">
                <h3 className="font-bold text-orange-200 mb-2">मराठी सारांश</h3>
                <p className="text-sm devanagari">{(capturedTopics[selectedTopic!.id] || TOPIC_DATA[selectedTopic!.id]).summaryMarathi}</p>
              </div>
            </section>

            <section>
              <h3 className="text-xl font-bold mb-6">Practice Questions</h3>
              <QuizView questions={(capturedTopics[selectedTopic!.id] || TOPIC_DATA[selectedTopic!.id]).practiceQuestions} />
            </section>

            <section>
              <h3 className="text-xl font-bold mb-6">Flashcards</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {(capturedTopics[selectedTopic!.id] || TOPIC_DATA[selectedTopic!.id]).flashcards.map((c, i) => (
                  <FlashcardItem key={i} front={c.front} back={c.back} />
                ))}
              </div>
            </section>
          </div>
        )}

        {currentView === 'grandQuiz' && (
           <div className="animate-fade-in pb-12">
              <button onClick={() => setCurrentView('home')} className="text-orange-600 font-bold mb-8">← Exit</button>
              <h2 className="text-2xl font-bold text-center mb-8">Grand Quiz</h2>
              <QuizView questions={capturedGrandQuiz?.questions || GRAND_QUIZ.questions} />
           </div>
        )}

        {currentView === 'grandFlashcards' && (
           <div className="animate-fade-in pb-12">
              <button onClick={() => setCurrentView('home')} className="text-emerald-600 font-bold mb-8">← Back</button>
              <h2 className="text-2xl font-bold text-center mb-8">Master Deck</h2>
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
