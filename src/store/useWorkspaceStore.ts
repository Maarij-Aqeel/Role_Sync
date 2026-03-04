import { create } from 'zustand';

interface WorkspaceState {
  originalResumeText: string;
  jobDescription: string;
  optimizedResumeState: any; // We'll refine this later (HTML string or JSON)
  atsScore: number;
  domainScore: number;
  modifications: any[];
  resumeFile: File | null; // Needed for the Phase 10 LaTeX export
  
  setOriginalResumeText: (text: string) => void;
  setJobDescription: (text: string) => void;
  setOptimizedResumeState: (state: any) => void;
  setAtsScore: (score: number) => void;
  setDomainScore: (score: number) => void;
  setModifications: (mods: any[]) => void;
  setResumeFile: (file: File | null) => void;
}

export const useWorkspaceStore = create<WorkspaceState>((set) => ({
  originalResumeText: '',
  jobDescription: '',
  optimizedResumeState: null,
  atsScore: 0,
  domainScore: 0,
  modifications: [],
  resumeFile: null,

  setOriginalResumeText: (text) => set({ originalResumeText: text }),
  setJobDescription: (text) => set({ jobDescription: text }),
  setOptimizedResumeState: (state) => set({ optimizedResumeState: state }),
  setAtsScore: (score) => set({ atsScore: score }),
  setDomainScore: (score: number) => set({ domainScore: score }),
  setModifications: (mods) => set({ modifications: mods }),
  setResumeFile: (file) => set({ resumeFile: file }),
}));
