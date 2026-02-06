
import { TopicContent, Question, Flashcard, GrandQuiz, GrandFlashcards } from './types';

// Topic-specific data
export const TOPIC_DATA: Record<number, TopicContent> = {
  1: {
    summaryEnglish: "This lesson introduces basic Sanskrit self-introduction and formal addressing. It covers 'Mama' (My), 'Bhavatah' (Your - masculine), and 'Bhavatyah' (Your - feminine).",
    summaryMarathi: "या पाठामध्ये संस्कृतमध्ये स्वतःची ओळख कशी करून द्यावी आणि इतरांना औपचारिकपणे कसे संबोधित करावे हे शिकवले आहे. यात 'मम' (माझे), 'भवतः' (तुझे - पुल्लिंगी) आणि 'भवत्याः' (तुझे - स्त्रीलिंगी) या शब्दांचा समावेश आहे.",
    practiceQuestions: [
      { question: "मम नाम _______ |", options: ["गणेशः", "त्वम्", "अस्ति", "किम्"], correctAnswer: "गणेशः", explanation: "'Mama nama...' is followed by the person's name.", difficulty: "Easy" },
      { question: "भवतः नाम किम्? (To a boy)", options: ["मम नाम", "भवतः नाम", "कः", "किम्"], correctAnswer: "किम्", explanation: "'Kim' is the interrogative pronoun for 'What'.", difficulty: "Easy" },
      { question: "भवत्याः नाम _______ |", options: ["रमेशः", "सीता", "तत्", "भवतः"], correctAnswer: "सीता", explanation: "'Bhavatyah' is used for feminine gender.", difficulty: "Medium" },
      { question: "How do you say 'My name'?", options: ["मम नाम", "तव नाम", "किम् नाम", "सः नाम"], correctAnswer: "मम नाम", explanation: "Mama means 'My'.", difficulty: "Easy" },
      { question: "Question word for 'Your name'?", options: ["कः", "का", "किम्", "कुत्र"], correctAnswer: "किम्", explanation: "Kim means 'What'.", difficulty: "Medium" }
    ],
    flashcards: [
      { front: "मम", back: "My / माझे" },
      { front: "भवतः", back: "Your (Masculine) / तुझे (पुल्लिंगी)" },
      { front: "भवत्याः", back: "Your (Feminine) / तुझे (स्त्रीलिंगी)" },
      { front: "नाम", back: "Name / नाव" },
      { front: "किम्", back: "What / काय" }
    ]
  },
  2: {
    summaryEnglish: "Focuses on third-person pronouns: Sah (He), Saa (She), Tat (It) for distant objects, and Eshah, Esha, Etat for near objects.",
    summaryMarathi: "हा पाठ तृतीय पुरुषी सर्वनामांवर आधारित आहे: दूरच्या वस्तूंसाठी सः (तो), सा (ती), तत् (ते) आणि जवळच्या वस्तूंसाठी एषः, एषा, एतत्.",
    practiceQuestions: [
      { question: "_______ बालकः | (Near)", options: ["एषः", "एषा", "एतत्", "सा"], correctAnswer: "एषः", explanation: "Eshah is masculine near.", difficulty: "Easy" },
      { question: "_______ बालिका | (Distant)", options: ["सः", "सा", "तत्", "एषा"], correctAnswer: "सा", explanation: "Saa is feminine distant.", difficulty: "Easy" },
      { question: "_______ फलम् | (Near)", options: ["एषः", "एषा", "एतत्", "सः"], correctAnswer: "एतत्", explanation: "Etat is neuter near.", difficulty: "Medium" },
      { question: "Is 'Saa' used for a boy?", options: ["आम्", "न", "किम्", "कः"], correctAnswer: "न", explanation: "Saa is feminine.", difficulty: "Easy" },
      { question: "_______ पुस्तकम् | (Distant)", options: ["सः", "सा", "तत्", "एषा"], correctAnswer: "तत्", explanation: "Tat is neuter distant.", difficulty: "Medium" }
    ],
    flashcards: [
      { front: "सः", back: "He (Distant) / तो" },
      { front: "सा", back: "She (Distant) / ती" },
      { front: "तत्", back: "That (Neuter) / ते" },
      { front: "एषः", back: "He (Near) / हा" },
      { front: "एषा", back: "She (Near) / ही" }
    ]
  },
  8: {
    summaryEnglish: "Introduces the Genitive Case (Shashti Vibhakti) to indicate possession, like 'of' in English.",
    summaryMarathi: "हा पाठ षष्ठी विभक्तीवर आधारित आहे, ज्याचा वापर मालकी हक्क दर्शवण्यासाठी केला जातो (जसे मराठीत 'चा/ची/चे').",
    practiceQuestions: [
      { question: "रामस्य भ्राता _______ |", options: ["लक्ष्मणः", "सीता", "दशरथः", "रावणः"], correctAnswer: "लक्ष्मणः", explanation: "Ramasya means 'of Rama'.", difficulty: "Medium" },
      { question: "सीतायाः पतिः _______ |", options: ["रामः", "लक्ष्मणः", "हनुमान्", "भरतः"], correctAnswer: "रामः", explanation: "Sitayah is the feminine genitive.", difficulty: "Medium" },
      { question: "कस्य लेखनी?", options: ["मम", "रामस्य", "सः", "तत्"], correctAnswer: "रामस्य", explanation: "Kasya asks 'Whose?'.", difficulty: "Hard" },
      { question: "What suffix is added for masculine genitive?", options: ["-स्य", "-याः", "-म्", "-एन"], correctAnswer: "-स्य", explanation: "syah is added to masculine stems.", difficulty: "Easy" },
      { question: "नद्याः जलम् |", options: ["River's water", "In the river", "By the river", "To the river"], correctAnswer: "River's water", explanation: "Nadyah is genitive for Nadi.", difficulty: "Hard" }
    ],
    flashcards: [
      { front: "रामस्य", back: "Of Rama / रामाचा" },
      { front: "सीतायाः", back: "Of Sita / सीतेचा" },
      { front: "कस्य", back: "Whose? (M) / कोणाचा?" },
      { front: "कस्याः", back: "Whose? (F) / कोणाचे?" },
      { front: "मम", back: "My / माझे" }
    ]
  }
  // ... other topics would be populated here following this pattern
};

// Default content for missing keys to prevent crashes
export const getTopicContent = (id: number): TopicContent => {
  return TOPIC_DATA[id] || {
    summaryEnglish: "Full content for this topic is being digitized from the Bhaashaa Praveshah book. It covers essential grammar and vocabulary for middle schoolers.",
    summaryMarathi: "या विषयाचा संपूर्ण मजकूर भाषा प्रवेश पुस्तकातून डिजिटल केला जात आहे. यात शालेय विद्यार्थ्यांसाठी आवश्यक व्याकरण आणि शब्दसंग्रह समाविष्ट आहे.",
    practiceQuestions: [
      { question: "How many Vibhaktis are there in Sanskrit?", options: ["५", "७", "८", "१०"], correctAnswer: "७", explanation: "There are 7 main cases plus Sambodhana.", difficulty: "Easy" },
      { question: "Meaning of 'अस्ति'?", options: ["Is", "Was", "Will be", "Not"], correctAnswer: "Is", explanation: "Asti means existence in the present.", difficulty: "Easy" },
      { question: "Opposite of 'अत्र'?", options: ["तत्र", "कुत्र", "एकत्र", "सर्वत्र"], correctAnswer: "तत्र", explanation: "Atra (Here), Tatra (There).", difficulty: "Easy" },
      { question: "Count 'तिस्रः'?", options: ["१", "२", "३", "४"], correctAnswer: "३", explanation: "Tisrah is feminine 'three'.", difficulty: "Medium" },
      { question: "Which Lakar is Present Tense?", options: ["लट्", "लङ्", "लृट्", "लोट्"], correctAnswer: "लट्", explanation: "Lat Lakar is used for present.", difficulty: "Medium" }
    ],
    flashcards: [
      { front: "अत्र", back: "Here / येथे" },
      { front: "तत्र", back: "There / तेथे" },
      { front: "कुत्र", back: "Where? / कोठे?" },
      { front: "अस्ति", back: "Is / आहे" },
      { front: "नास्ति", back: "Is not / नाही" }
    ]
  };
};

export const GRAND_QUIZ: GrandQuiz = {
  questions: ([
    { question: "मम नाम गणेशः | 'मम' इत्यस्य अर्थः कः?", options: ["My", "Your", "His", "Her"], correctAnswer: "My", explanation: "Mama means my.", difficulty: "Easy" },
    { question: "कः समयः? (९:००)", options: ["नववादनम्", "अष्टवादनम्", "दशवादनम्", "एकादशवादनम्"], correctAnswer: "नववादनम्", explanation: "9 is Nava.", difficulty: "Easy" },
    { question: "रामः वनम् _______ |", options: ["गच्छति", "गच्छसि", "गच्छामि", "गच्छन्ति"], correctAnswer: "गच्छति", explanation: "Third person singular.", difficulty: "Medium" },
    { question: "त्वम् कुत्र _______?", options: ["गच्छति", "गच्छसि", "गच्छामि", "गच्छन्ति"], correctAnswer: "गच्छसि", explanation: "Second person singular.", difficulty: "Medium" },
    { question: "षष्ठी विभक्तिः कस्य कृते उपयुज्यते?", options: ["सम्बन्धः", "कर्म", "करणम्", "अधिकरणम्"], correctAnswer: "सम्बन्धः", explanation: "Genitive relates objects.", difficulty: "Hard" },
    { question: "What is 'Tomorrow'?", options: ["अद्य", "श्वः", "ह्यः", "परश्वः"], correctAnswer: "श्वः", explanation: "Shvah is tomorrow.", difficulty: "Medium" },
    { question: "Identify Feminine: सः, सा, तत्", options: ["सः", "सा", "तत्", "एषः"], correctAnswer: "सा", explanation: "Saa is feminine.", difficulty: "Easy" },
    { question: "Count '५' in Sanskrit.", options: ["पञ्च", "चत्वारि", "षट्", "सप्त"], correctAnswer: "पञ्च", explanation: "5 is Pancha.", difficulty: "Easy" },
    { question: "Past tense of 'पठति'?", options: ["अपठत्", "पठिष्यति", "पठतु", "पठतु"], correctAnswer: "अपठत्", explanation: "Lang Lakar is past.", difficulty: "Hard" },
    { question: "Infinitive of 'खादति'?", options: ["खादितुम्", "खादित्वा", "खादन्", "खादतु"], correctAnswer: "खादितुम्", explanation: "Tumun suffix adds 'to'.", difficulty: "Hard" }
  ] as Question[]).concat(Array.from({length: 20}, (_, i) => ({
    question: `General Mastery Question ${i+11}: कस्य व्याकरणम् प्रसिद्धम्?`,
    options: ["पाणिनिः", "कालिदासः", "व्यासः", "वाल्मीकिः"],
    correctAnswer: "पाणिनिः",
    explanation: "Panini is the father of Sanskrit grammar.",
    // Cast difficulty literal to avoid widening to string.
    difficulty: (i < 7 ? "Easy" : i < 14 ? "Medium" : "Hard") as 'Easy' | 'Medium' | 'Hard'
  })))
};

export const GRAND_FLASHCARDS: GrandFlashcards = {
  flashcards: [
    { front: "अद्य", back: "Today / आज" },
    { front: "श्वः", back: "Tomorrow / उद्या" },
    { front: "ह्यः", back: "Yesterday / काल" },
    { front: "कदा?", back: "When? / केव्हा?" },
    { front: "एकम्", back: "One / एक" },
    { front: "द्वे", back: "Two / दोन" },
    { front: "त्रीणि", back: "Three / तीन" },
    { front: "पठति", back: "Reads / वाचतो" },
    { front: "लिखति", back: "Writes / लिहितो" },
    { front: "खादति", back: "Eats / खातो" },
    { front: "पिबति", back: "Drinks / पितो" },
    { front: "गच्छति", back: "Goes / जातो" },
    { front: "आगच्छति", back: "Comes / येतो" },
    { front: "उपविशति", back: "Sits / बसतो" },
    { front: "उत्तिष्ठति", back: "Stands / उठतो" },
    { front: "पश्यति", back: "Sees / पाहतो" },
    { front: "शृणोति", back: "Hears / ऐकतो" },
    { front: "वदति", back: "Speaks / बोलतो" },
    { front: "किम्?", back: "What? / काय?" },
    { front: "कुत्र?", back: "Where? / कोठे?" },
    { front: "कथम्?", back: "How? / कसे?" },
    { front: "कति?", back: "How many? / किती?" },
    { front: "किमर्थम्?", back: "Why? / कशासाठी?" },
    { front: "अस्ति", back: "Is / आहे" },
    { front: "नास्ति", back: "Is not / नाही" },
    { front: "पुरतः", back: "In front / समोर" },
    { front: "पृष्ठतः", back: "Behind / मागे" },
    { front: "वामतः", back: "Left / डावीकडे" },
    { front: "दक्षिणतः", back: "Right / उजवीकडे" },
    { front: "धन्यवादः", back: "Thank you / धन्यवाद" }
  ]
};
