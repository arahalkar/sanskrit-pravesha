
import { GoogleGenAI, Type } from "@google/genai";
import { TopicContent, GrandQuiz, GrandFlashcards } from "../types";

/**
 * Safely checks for the API key without crashing the browser.
 */
const getSafeApiKey = (): string | null => {
  try {
    // Standard way to check for global variables in a browser context
    if (typeof process !== 'undefined' && process.env && process.env.API_KEY) {
      return process.env.API_KEY;
    }
    // Check window for potential injection or fallback
    if ((window as any)._GEMINI_API_KEY) {
      return (window as any)._GEMINI_API_KEY;
    }
  } catch (e) {
    return null;
  }
  return null;
};

export const generateTopicContent = async (topicTitle: string): Promise<TopicContent> => {
  const apiKey = getSafeApiKey();
  if (!apiKey) {
    throw new Error("Samskrita AI: No API Key found. Using static data instead.");
  }

  const ai = new GoogleGenAI({ apiKey });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Act as a Sanskrit expert teacher. Based on the "Bhaashaa Praveshah - I" curriculum, generate content for the topic: "${topicTitle}". 
    CRITICAL RULES:
    - Use Devanagari script for ALL Sanskrit words.
    - Questions must be in Devanagari.
    - Summaries must follow specified languages (English/Marathi).

    Include:
    1. One-paragraph summary in English.
    2. One-paragraph summary in Marathi.
    3. 5 multiple-choice questions in Devanagari.
    4. 5 flashcards (Front: Devanagari, Back: Meaning).`,
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
              },
              required: ["question", "options", "correctAnswer", "explanation", "difficulty"]
            }
          },
          flashcards: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                front: { type: Type.STRING },
                back: { type: Type.STRING }
              },
              required: ["front", "back"]
            }
          }
        },
        required: ["summaryEnglish", "summaryMarathi", "practiceQuestions", "flashcards"]
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
    contents: "Generate a 30-question Grand Quiz for Bhaashaa Praveshah - I. 10 Easy, 10 Medium, 10 Hard. Use Devanagari.",
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          questions: {
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
          }
        }
      }
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
    contents: "Generate 30 Grand Flashcards for Bhaashaa Praveshah - I. Front: Devanagari, Back: Meaning.",
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
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
