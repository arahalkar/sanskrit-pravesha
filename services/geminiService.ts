
import { GoogleGenAI, Type } from "@google/genai";
import { TopicContent, GrandQuiz, GrandFlashcards } from "../types";

/**
 * Safely get the API Key. 
 * If running in a static environment where process.env is not defined, 
 * it returns null to prevent the app from crashing.
 */
const getApiKey = () => {
  try {
    return process.env.API_KEY || null;
  } catch (e) {
    return null;
  }
};

export const generateTopicContent = async (topicTitle: string): Promise<TopicContent> => {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error("API Key not found. AI features are disabled in static mode.");
  }

  const ai = new GoogleGenAI({ apiKey });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Act as a Sanskrit expert teacher. Based on the "Bhaashaa Praveshah - I" curriculum, generate content for the topic: "${topicTitle}". 
    CRITICAL RULES:
    - Use Devanagari script for ALL Sanskrit words, sentences, and vocabulary.
    - All multiple-choice questions must have the question and options in Devanagari/Sanskrit.
    - Flashcards must have the front in Devanagari/Sanskrit.
    - Summaries must follow the specified languages.

    Include:
    1. A one-paragraph summary in English.
    2. A one-paragraph summary in Marathi.
    3. 5 multiple-choice practice questions (Question and Options MUST be in Devanagari/Sanskrit).
    4. 5 educational flashcards (Front MUST be in Devanagari/Sanskrit, Back in English/Marathi explanation).`,
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
                difficulty: { type: Type.STRING, enum: ["Easy", "Medium", "Hard"] }
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
  const apiKey = getApiKey();
  if (!apiKey) throw new Error("API Key missing");

  const ai = new GoogleGenAI({ apiKey });
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Generate a comprehensive "Grand Quiz" based on the entire "Bhaashaa Praveshah - I" Sanskrit book. 
    Total 30 questions. 10 Easy, 10 Medium, 10 Hard. All in Devanagari.`,
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
              },
              required: ["question", "options", "correctAnswer", "explanation", "difficulty"]
            }
          }
        },
        required: ["questions"]
      }
    }
  });
  return JSON.parse(response.text || '{}');
};

export const generateGrandFlashcards = async (): Promise<GrandFlashcards> => {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error("API Key missing");

  const ai = new GoogleGenAI({ apiKey });
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Generate a grand list of 30 flashcards spanning "Bhaashaa Praveshah - I". Front in Devanagari.`,
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
