export type InputType = 'url' | 'file' | 'text' | 'sample';

export interface Chapter {
  id: string;
  timestamp: string; // e.g. "01:25"
  seconds: number;   // e.g. 85
  title: string;
  summary: string;
  keyPoints: string[];
  keywords: string[];
}

export interface GlossaryItem {
  term: string;
  definition: string;
  importance?: 'high' | 'medium';
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  timestamp?: string;
}

export interface TranscriptLine {
  timestamp: string;
  seconds: number;
  speaker?: string;
  text: string;
}

export interface VideoAnalysis {
  id: string;
  sourceType: InputType;
  title: string;
  channelOrAuthor?: string;
  duration: string;
  durationSeconds: number;
  videoUrl?: string;
  thumbnailUrl?: string;
  language: string;
  analyzedAt?: string;
  isRealAnalysis?: boolean;
  
  // Executive Summary
  executiveSummary: string[];
  coreTakeaways: string[];
  targetAudience: string;
  keyInsights: {
    category: string;
    points: string[];
  }[];
  
  // Chapters / Timestamps
  chapters: Chapter[];
  
  // Glossary / Keywords
  glossary: GlossaryItem[];
  allKeywords: string[];
  
  // Quiz for Learning Efficiency
  quiz: QuizQuestion[];
  
  // Full Transcript
  transcript: TranscriptLine[];
  
  // Suggested Questions
  suggestedQuestions: string[];
  
  rawTextContent?: string;
}

export interface QAMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestampRef?: {
    time: string;
    seconds: number;
  };
  createdAt: Date;
}

export type SupportedLanguage = 'ko' | 'en' | 'ja' | 'zh' | 'es' | 'de' | 'fr';

export interface LanguageOption {
  code: SupportedLanguage;
  name: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'ko', name: '한국어 (Korean)', flag: '🇰🇷' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'ja', name: '日本語 (Japanese)', flag: '🇯🇵' },
  { code: 'zh', name: '中文 (Chinese)', flag: '🇨🇳' },
  { code: 'es', name: 'Español (Spanish)', flag: '🇪🇸' },
  { code: 'de', name: 'Deutsch (German)', flag: '🇩🇪' },
  { code: 'fr', name: 'Français (French)', flag: '🇫🇷' },
];
