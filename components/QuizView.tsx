
import React, { useState } from 'react';
import { Question } from '../types';

interface Props {
  questions: Question[];
  onComplete?: (score: number) => void;
}

const QuizView: React.FC<Props> = ({ questions, onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [quizEnded, setQuizEnded] = useState(false);

  const currentQ = questions[currentIndex];

  const handleNext = () => {
    if (selectedOption === currentQ.correctAnswer) {
      setScore(score + 1);
    }

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedOption(null);
      setShowResult(false);
    } else {
      setQuizEnded(true);
      if (onComplete) onComplete(score + (selectedOption === currentQ.correctAnswer ? 1 : 0));
    }
  };

  if (quizEnded) {
    return (
      <div className="bg-white p-8 rounded-2xl shadow-xl text-center">
        <h3 className="text-2xl font-bold text-orange-600 mb-4">Quiz Completed!</h3>
        <p className="text-4xl font-bold mb-6">{score} / {questions.length}</p>
        <button 
          onClick={() => window.location.reload()}
          className="bg-orange-500 text-white px-8 py-3 rounded-full font-bold hover:bg-orange-600 transition"
        >
          Restart or Go Home
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-orange-100">
      <div className="flex justify-between items-center mb-6">
        <span className="text-orange-500 font-bold">Question {currentIndex + 1} / {questions.length}</span>
        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
          currentQ.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
          currentQ.difficulty === 'Medium' ? 'bg-blue-100 text-blue-700' :
          'bg-red-100 text-red-700'
        }`}>
          {currentQ.difficulty}
        </span>
      </div>

      <h3 className="text-xl font-semibold mb-6 devanagari">{currentQ.question}</h3>

      <div className="space-y-3 mb-8">
        {currentQ.options.map((opt, i) => (
          <button
            key={i}
            onClick={() => !showResult && setSelectedOption(opt)}
            className={`w-full text-left p-4 rounded-xl border-2 transition ${
              selectedOption === opt 
                ? (showResult ? (opt === currentQ.correctAnswer ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500') : 'bg-orange-50 border-orange-400')
                : (showResult && opt === currentQ.correctAnswer ? 'bg-green-50 border-green-500' : 'bg-white border-slate-100 hover:border-orange-200')
            }`}
          >
            <span className="devanagari">{opt}</span>
          </button>
        ))}
      </div>

      {showResult && (
        <div className="bg-slate-50 p-4 rounded-xl mb-6 text-sm">
          <p className="font-bold text-slate-700 mb-1">Explanation:</p>
          <p className="text-slate-600">{currentQ.explanation}</p>
        </div>
      )}

      <button
        disabled={!selectedOption}
        onClick={() => !showResult ? setShowResult(true) : handleNext()}
        className={`w-full py-4 rounded-xl font-bold transition text-white ${
          !selectedOption ? 'bg-slate-300' : 'bg-orange-500 hover:bg-orange-600'
        }`}
      >
        {!showResult ? 'Check Answer' : 'Next Question'}
      </button>
    </div>
  );
};

export default QuizView;
