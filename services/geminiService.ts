
import { GoogleGenAI, Type } from "@google/genai";
import { TopicContent, GrandQuiz, GrandFlashcards } from "../types";

const getApiKey = () => {
  try {
    return process.env.API_KEY || null;
  } catch (e) {
    return null;
  }
};

export const generateTopicContent = async (topicTitle: string): Promise<TopicContent | null> => {
  const apiKey = getApiKey();
  if (!apiKey) return null;

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Act as a Sanskrit expert teacher. Based on the "Bhaashaa Praveshah - I" curriculum, generate content for the topic: "${topicTitle}". 
      Include: English/Marathi summaries, 5 MCQs in Devanagari, and 5 Flashcards.`,
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
  } catch (err) {
    console.error("AI Generation failed:", err);
    return null;
  }
};

export const generateGrandQuiz = async (): Promise<GrandQuiz | null> => {
  const apiKey = getApiKey();
  if (!apiKey) return null;
  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: "Generate 30 Sanskrit MCQs for Bhaashaa Praveshah curriculum in JSON.",
      config: { responseMimeType: "application/json" }
    });
    return JSON.parse(response.text || '{}');
  } catch (e) { return null; }
};

export const generateGrandFlashcards = async (): Promise<GrandFlashcards | null> => {
  const apiKey = getApiKey();
  if (!apiKey) return null;
  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: "Generate 30 Sanskrit Flashcards for Bhaashaa Praveshah curriculum in JSON.",
      config: { responseMimeType: "application/json" }
    });
    return JSON.parse(response.text || '{}');
  } catch (e) { return null; }
};
