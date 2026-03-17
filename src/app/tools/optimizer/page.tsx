// app/tools/optimizer/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  Zap, 
  Target, 
  TrendingUp,
  AlertCircle,
  CheckCircle2
} from "lucide-react";
import { useWorkspaceStore } from "@/store/useWorkspaceStore";
import { Navbar } from "@/components/Navbar";
import { PaperResumeEditor } from "@/components/PaperResumeEditor";

export default function OptimizerToolPage() {
  const router = useRouter();
  const { 
    optimizedResumeHTML, 
    atsScore, 
    domainScore, 
    modifications,
    feedback 
  } = useWorkspaceStore();

  const [activeTab, setActiveTab] = useState<'keywords' | 'feedback'>('keywords');
  const [editorContent, setEditorContent] = useState(optimizedResumeHTML);

  useEffect(() => {
    if (!optimizedResumeHTML) {
      router.push("/setup");
    }
  }, [optimizedResumeHTML, router]);

  const applyModification = (id: string) => {
    // Logic to apply keyword injection
    console.log("Applying modification:", id);
  };

  if (!optimizedResumeHTML) return null;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-surface border-b border-border px-6 py-4">
          <div className="max-w-[1920px] mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => router.push("/dashboard")}
                className="p-2 hover:bg-background rounded-lg transition-colors text-text-muted hover:text-text-primary"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-text-primary flex items-center gap-2">
                  <Zap className="w-5 h-5 text-accent" />
                  Resume Optimizer
                </h1>
              </div>
            </div>

            {/* Score Display */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3 px-4 py-2 bg-background rounded-lg">
                <Target className="w-5 h-5 text-accent" />
                <div>
                  <p className="text-xs text-text-muted uppercase">ATS Score</p>
                  <p className="text-lg font-bold text-text-primary leading-none">{atsScore}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 px-4 py-2 bg-background rounded-lg">
                <TrendingUp className="w-5 h-5 text-green-500" />
                <div>
                  <p className="text-xs text-text-muted uppercase">Domain Fit</p>
                  <p className="text-lg font-bold text-text-primary leading-none">{domainScore}%</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Split Screen Workspace */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Panel - Paper Editor */}
          <div className="flex-1 bg-[#E8E6E1] dark:bg-[#1a1a1a] overflow-auto p-8">
            <PaperResumeEditor 
              content={editorContent}
              onChange={setEditorContent}
              highlights={feedback.uiHighlights}
            />
          </div>

          {/* Right Panel - AI Suggestions */}
          <div className="w-96 bg-surface border-l border-border flex flex-col">
            {/* Tabs */}
            <div className="flex border-b border-border">
              <button
                onClick={() => setActiveTab('keywords')}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors relative ${
                  activeTab === 'keywords' ? 'text-accent' : 'text-text-muted hover:text-text-primary'
                }`}
              >
                Keywords
                {activeTab === 'keywords' && (
                  <motion.div 
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent"
                  />
                )}
              </button>
              <button
                onClick={() => setActiveTab('feedback')}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors relative ${
                  activeTab === 'feedback' ? 'text-accent' : 'text-text-muted hover:text-text-primary'
                }`}
              >
                AI Feedback
                {activeTab === 'feedback' && (
                  <motion.div 
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent"
                  />
                )}
              </button>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {activeTab === 'keywords' ? (
                <div className="space-y-3">
                  <p className="text-sm text-text-muted mb-4">
                    {modifications.length} suggestions to improve your ATS score
                  </p>
                  {modifications.map((mod) => (
                    <motion.div
                      key={mod.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 rounded-xl bg-background border border-border hover:border-accent/50 transition-all group"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <span className="text-xs font-medium px-2 py-1 rounded-full bg-accent-subtle text-accent uppercase tracking-wider">
                          {mod.category}
                        </span>
                        <button
                          onClick={() => applyModification(mod.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-xs text-accent hover:underline"
                        >
                          Apply
                        </button>
                      </div>
                      <p className="text-sm text-text-secondary line-through mb-1">{mod.original}</p>
                      <p className="text-sm text-accent font-medium">{mod.suggested}</p>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Interviewer Critique */}
                  {feedback.interviewerCritique && (
                    <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800">
                      <div className="flex items-center gap-2 mb-2 text-amber-700 dark:text-amber-400">
                        <AlertCircle className="w-4 h-4" />
                        <span className="font-medium text-sm">Interviewer Perspective</span>
                      </div>
                      <p className="text-sm text-text-secondary leading-relaxed">
                        {feedback.interviewerCritique.summary}
                      </p>
                    </div>
                  )}

                  {/* Repetitive Words */}
                  <div>
                    <h4 className="font-medium text-text-primary mb-3 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      Word Variety
                    </h4>
                    <div className="space-y-2">
                      {feedback.repetitiveWords.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-background text-sm">
                          <div>
                            <span className="font-medium text-text-primary">{item.word}</span>
                            <span className="text-text-muted ml-2">used {item.count}x</span>
                          </div>
                          <div className="flex gap-1">
                            {item.betterAlternatives.slice(0, 2).map((alt, i) => (
                              <span key={i} className="px-2 py-1 rounded bg-surface-elevated text-xs text-text-secondary">
                                {alt}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}