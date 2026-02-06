
import { GoogleGenAI, Type } from "@google/genai";
import { TopicContent, GrandQuiz, GrandFlashcards } from "../types";

// Always initialize GoogleGenAI inside functions to ensure fresh state and correct key usage.
export const generateTopicContent = async (topicTitle: string): Promise<TopicContent> => {
  // Use the direct process.env.API_KEY when initializing.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
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
                question: { type: Type.STRING, description: "Question text in Devanagari" },
                options: { type: Type.ARRAY, items: { type: Type.STRING }, description: "4 options in Devanagari" },
                correctAnswer: { type: Type.STRING, description: "The correct option text in Devanagari" },
                explanation: { type: Type.STRING, description: "Explanation in English" },
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
                front: { type: Type.STRING, description: "Sanskrit text in Devanagari" },
                back: { type: Type.STRING, description: "Meaning/Translation" }
              },
              required: ["front", "back"]
            }
          }
        },
        required: ["summaryEnglish", "summaryMarathi", "practiceQuestions", "flashcards"]
      }
    }
  });

  // Accessing the .text property directly (not calling as a function).
  return JSON.parse(response.text || '{}');
};

export const generateGrandQuiz = async (): Promise<GrandQuiz> => {
  // Use the direct process.env.API_KEY when initializing.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Generate a comprehensive "Grand Quiz" based on the entire "Bhaashaa Praveshah - I" Sanskrit book. 
    Total 30 questions. 
    Distribution: 10 Easy, 10 Medium, 10 Hard. 
    CRITICAL: All questions and options MUST be in Devanagari script/Sanskrit language. 
    Cover topics: Vibhaktis (1-7), Lakaras (Present, Past, Future), Sankhyas, and daily vocabulary.`,
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
                question: { type: Type.STRING, description: "In Devanagari" },
                options: { type: Type.ARRAY, items: { type: Type.STRING }, description: "In Devanagari" },
                correctAnswer: { type: Type.STRING, description: "In Devanagari" },
                explanation: { type: Type.STRING, description: "In English/Marathi" },
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
  // Accessing the .text property directly.
  return JSON.parse(response.text || '{}');
};

export const generateGrandFlashcards = async (): Promise<GrandFlashcards> => {
  // Use the direct process.env.API_KEY when initializing.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Generate a grand list of 30 flashcards spanning the entire course of "Bhaashaa Praveshah - I". 
    Focus on key grammar rules, vocabulary, and common sentences. 
    CRITICAL: Front side MUST be in Devanagari script/Sanskrit.`,
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
                front: { type: Type.STRING, description: "Sanskrit term/phrase in Devanagari" },
                back: { type: Type.STRING, description: "Meaning in English or Marathi" }
              }
            }
          }
        }
      }
    }
  });
  // Accessing the .text property directly.
  return JSON.parse(response.text || '{}');
};
