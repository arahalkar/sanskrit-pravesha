
import { GoogleGenAI, Type } from "@google/genai";
import { TopicContent, GrandQuiz, GrandFlashcards } from "../types";

/**
 * Robustly checks for the API key.
 */
const getSafeApiKey = (): string | null => {
  try {
    // Check global process object safely
    if (typeof window !== 'undefined' && (window as any).process?.env?.API_KEY) {
      return (window as any).process.env.API_KEY;
    }
    // Check for directly injected global
    if (typeof window !== 'undefined' && (window as any)._GEMINI_API_KEY) {
      return (window as any)._GEMINI_API_KEY;
    }
  } catch (e) {
    console.warn("Samskrita: Safe key check caught an error", e);
  }
  return null;
};

export const generateTopicContent = async (topicTitle: string): Promise<TopicContent> => {
  const apiKey = getSafeApiKey();
  if (!apiKey) {
    throw new Error("AI features disabled: No API key provided.");
  }

  const ai = new GoogleGenAI({ apiKey });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Act as a Sanskrit expert teacher. Based on the "Bhaashaa Praveshah - I" curriculum, generate content for the topic: "${topicTitle}". 
    Include:
    1. Summary in English.
    2. Summary in Marathi.
    3. 5 MCQs in Devanagari.
    4. 5 Flashcards.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summaryEnglish: { type: Type.STRING },
          summaryMarathi: { type: Type.STRING },
          practiceQuestions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                question: { type: Type.STRING },
                options: { type: Type.ARRAY, items: { type: Type.STRING } },
                correctAnswer: { type: Type.STRING },
                explanation: { type: Type.STRING },
                difficulty: { type: Type.STRING }
              }
            }
          },
          flashcards: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                front: { type: Type.STRING },
                back: { type: Type.STRING }
              }
            }
          }
        }
      }
    }
  });

  return JSON.parse(response.text || '{}');
};

export const generateGrandQuiz = async (): Promise<GrandQuiz> => {
  const apiKey = getSafeApiKey();
  if (!apiKey) throw new Error("API Key missing");
  const ai = new GoogleGenAI({ apiKey });
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: "Generate 30 Sanskrit MCQs in Devanagari.",
    config: {
      responseMimeType: "application/json"
    }
  });
  return JSON.parse(response.text || '{}');
};

export const generateGrandFlashcards = async (): Promise<GrandFlashcards> => {
  const apiKey = getSafeApiKey();
  if (!apiKey) throw new Error("API Key missing");
  const ai = new GoogleGenAI({ apiKey });
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: "Generate 30 Sanskrit Flashcards.",
    config: {
      responseMimeType: "application/json"
    }
  });
  return JSON.parse(response.text || '{}');
};
