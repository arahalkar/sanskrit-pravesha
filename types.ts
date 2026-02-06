
export interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface Flashcard {
  front: string;
  back: string;
}

export interface TopicContent {
  summaryEnglish: string;
  summaryMarathi: string;
  practiceQuestions: Question[];
  flashcards: Flashcard[];
}

export interface Topic {
  id: number;
  title: string;
  pageNumber: number;
}

export interface GrandQuiz {
  questions: Question[];
}

export interface GrandFlashcards {
  flashcards: Flashcard[];
}
