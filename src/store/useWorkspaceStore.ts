// store/useWorkspaceStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface Modification {
  id: string;
  original: string;
  suggested: string;
  category: 'keyword' | 'format' | 'content';
  applied: boolean;
}

export interface FeedbackData {
  interviewerCritique: {
    summary: string;
    tone: string;
  } | null;
  repetitiveWords: Array<{
    word: string;
    count: number;
    impact: 'high' | 'medium' | 'low';
    betterAlternatives: string[];
  }>;
  sectionAnalysis: Record<string, { status: 'pass' | 'needs_work' | 'fail'; message: string }>;
  uiHighlights: Array<{
    exactPhrase: string;
    reason: string;
    suggestedRewrite: string;
  }>;
}

interface WorkspaceState {
  // Core Data
  resumeFile: File | null;
  resumeFileName: string;
  jobDescription: string;
  originalResumeText: string;
  
  // Analysis Results
  atsScore: number;
  domainScore: number;
  modifications: Modification[];
  optimizedResumeHTML: string;
  coverLetterHTML: string | null;
  
  // Feedback Data
  feedback: FeedbackData;
  
  // UI State
  currentTool: 'optimizer' | 'cover-letter' | null;
  isAnalyzing: boolean;
  
  // Actions
  setResumeFile: (file: File | null) => void;
  setJobDescription: (jd: string) => void;
  setOriginalResumeText: (text: string) => void;
  setAnalysisResults: (results: {
    atsScore: number;
    domainScore: number;
    modifications: Modification[];
    optimizedResumeHTML: string;
    originalResumeText: string;
  }) => void;
  setCoverLetterHTML: (html: string | null) => void;
  setFeedback: (feedback: Partial<FeedbackData>) => void;
  setCurrentTool: (tool: 'optimizer' | 'cover-letter' | null) => void;
  setIsAnalyzing: (analyzing: boolean) => void;
  updateModification: (id: string, applied: boolean) => void;
  resetWorkspace: () => void;
}

const initialState = {
  resumeFile: null,
  resumeFileName: '',
  jobDescription: '',
  originalResumeText: '',
  atsScore: 0,
  domainScore: 0,
  modifications: [],
  optimizedResumeHTML: '',
  coverLetterHTML: null,
  feedback: {
    interviewerCritique: null,
    repetitiveWords: [],
    sectionAnalysis: {},
    uiHighlights: [],
  },
  currentTool: null,
  isAnalyzing: false,
};

export const useWorkspaceStore = create<WorkspaceState>()(
  persist(
    (set, get) => ({
      ...initialState,
      
      setResumeFile: (file) => set({ 
        resumeFile: file, 
        resumeFileName: file?.name || '' 
      }),
      
      setJobDescription: (jd) => set({ jobDescription: jd }),
      
      setOriginalResumeText: (text) => set({ originalResumeText: text }),
      
      setAnalysisResults: (results) => set({
        atsScore: results.atsScore,
        domainScore: results.domainScore,
        modifications: results.modifications,
        optimizedResumeHTML: results.optimizedResumeHTML,
        originalResumeText: results.originalResumeText,
      }),
      
      setCoverLetterHTML: (html) => set({ coverLetterHTML: html }),
      
      setFeedback: (feedback) => set((state) => ({
        feedback: { ...state.feedback, ...feedback },
      })),
      
      setCurrentTool: (tool) => set({ currentTool: tool }),
      
      setIsAnalyzing: (analyzing) => set({ isAnalyzing: analyzing }),
      
      updateModification: (id, applied) => set((state) => ({
        modifications: state.modifications.map((mod) =>
          mod.id === id ? { ...mod, applied } : mod
        ),
      })),
      
      resetWorkspace: () => set(initialState),
    }),
    {
      name: 'rolesync-workspace',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        // Don't persist the File object, only metadata
        resumeFileName: state.resumeFileName,
        jobDescription: state.jobDescription,
        originalResumeText: state.originalResumeText,
        atsScore: state.atsScore,
        domainScore: state.domainScore,
        modifications: state.modifications,
        optimizedResumeHTML: state.optimizedResumeHTML,
        coverLetterHTML: state.coverLetterHTML,
        feedback: state.feedback,
        currentTool: state.currentTool,
      }),
    }
  )
);