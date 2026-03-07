import { create } from 'zustand';

export interface RepetitiveWord {
  word: string;
  count: number;
  impact: 'high' | 'medium' | 'low' | string;
  betterAlternatives: string[];
}

export interface SectionAnalysis {
  experience?: {
    status: 'pass' | 'needs_work';
    message: string;
  };
  education?: {
    status: 'pass' | 'needs_work';
    message: string;
  };
  [key: string]: any;
}

export interface UIHighlight {
  exactPhrase: string;
  reason: string;
  suggestedRewrite: string;
}

export interface FeedbackState {
  interviewerCritique: { summary: string; tone: string } | null;
  repetitiveWords: RepetitiveWord[];
  sectionAnalysis: SectionAnalysis | null;
  uiHighlights: UIHighlight[];
  activeHighlight: string | null;

  setInterviewerCritique: (critique: { summary: string; tone: string } | null) => void;
  setRepetitiveWords: (words: RepetitiveWord[]) => void;
  setSectionAnalysis: (analysis: SectionAnalysis | null) => void;
  setUiHighlights: (highlights: UIHighlight[]) => void;
  setActiveHighlight: (phrase: string | null) => void;
}

export const useFeedbackStore = create<FeedbackState>((set) => ({
  interviewerCritique: null,
  repetitiveWords: [],
  sectionAnalysis: null,
  uiHighlights: [],
  activeHighlight: null,

  setInterviewerCritique: (critique) => set({ interviewerCritique: critique }),
  setRepetitiveWords: (words) => set({ repetitiveWords: words }),
  setSectionAnalysis: (analysis) => set({ sectionAnalysis: analysis }),
  setUiHighlights: (highlights) => set({ uiHighlights: highlights }),
  setActiveHighlight: (phrase) => set({ activeHighlight: phrase }),
}));
