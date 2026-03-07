"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useFeedbackStore } from "@/store/useFeedbackStore";
import { CheckCircle2, AlertTriangle, MessageSquare, Target, Hash } from "lucide-react";

const formatWithCodeBlocks = (text: string) => {
  if (!text) return text;
  // Splits by both single and double quotes, preserving the tokens
  const parts = text.split(/(['"][^'"]+['"])/g);
  return parts.map((part, i) => {
    if ((part.startsWith("'") && part.endsWith("'")) || (part.startsWith('"') && part.endsWith('"'))) {
      const cleanWord = part.slice(1, -1);
      return (
        <code key={i} className="font-mono text-[11px] bg-slate-950 px-1.5 py-0.5 mx-0.5 rounded text-rose-300 border border-slate-800">
          {cleanWord}
        </code>
      );
    }
    return <span key={i}>{part}</span>;
  });
};

export const FeedbackPanel = () => {
  const { interviewerCritique, repetitiveWords, sectionAnalysis, uiHighlights, setActiveHighlight, activeHighlight } = useFeedbackStore();

  if (!interviewerCritique && (!repetitiveWords || repetitiveWords.length === 0) && !sectionAnalysis && (!uiHighlights || uiHighlights.length === 0)) {
    return null; // Don't render if there's no feedback data
  }

  const handlePhraseClick = (phrase: string) => {
    if (activeHighlight === phrase) {
      setActiveHighlight(null); // Toggle off
    } else {
      setActiveHighlight(phrase);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="w-full h-full bg-surface rounded-b-xl border border-primary/10 border-t-0 shadow-sm flex flex-col overflow-hidden"
    >
      <div className="p-4 border-b border-primary/10 bg-primary/5 flex items-center gap-2 shrink-0">
        <Target size={18} className="text-accent" />
        <h3 className="font-bold text-primary">Resume Feedback</h3>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-700 [&::-webkit-scrollbar-thumb]:rounded-full">
        {/* Interviewer Critique */}
        <AnimatePresence>
          {interviewerCritique && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-accent/10 border border-accent/20 rounded-xl p-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare size={16} className="text-accent" />
                <h4 className="font-semibold text-accent text-sm">Recruiter Critique</h4>
                {interviewerCritique.tone && (
                  <span className="text-[10px] uppercase font-bold tracking-wider bg-surface px-1.5 py-0.5 rounded text-accent ml-auto">
                    {interviewerCritique.tone}
                  </span>
                )}
              </div>
              <p className="text-sm text-primary/80 leading-relaxed font-medium">{formatWithCodeBlocks(interviewerCritique.summary)}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Structural Analysis */}
        {sectionAnalysis && Object.keys(sectionAnalysis).length > 0 && (
          <div className="space-y-3">
            <h4 className="font-semibold text-primary text-sm flex items-center gap-2 border-b border-primary/10 pb-2">
              <CheckCircle2 size={16} className="text-primary/60" /> Structural Completeness
            </h4>
            <div className="space-y-2">
              {Object.entries(sectionAnalysis).map(([section, data]) => {
                const isPass = data.status === "pass";
                return (
                  <div key={section} className="flex flex-col gap-1.5 bg-surface border border-primary/5 rounded-lg p-3 shadow-sm">
                    <div className="flex items-center gap-2">
                      {isPass ? (
                        <CheckCircle2 size={14} className="text-[#04b304]" />
                      ) : (
                        <AlertTriangle size={14} className="text-accent" />
                      )}
                      <span className="text-sm font-bold text-primary capitalize">{section}</span>
                    </div>
                    <p className="text-xs text-primary/70 mt-1">{formatWithCodeBlocks(data.message)}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Repetitive Action Verbs Heatmap */}
        {repetitiveWords && repetitiveWords.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-semibold text-primary text-sm flex items-center gap-2 border-b border-primary/10 pb-2">
              <Hash size={16} className="text-primary/60" /> Action Verb Heatmap
            </h4>
            <div className="flex flex-wrap gap-2">
              {repetitiveWords.map((wordObj, idx) => {
                const isHighImpact = wordObj.impact === "high" || wordObj.impact === "high_impact";
                const isActive = activeHighlight === wordObj.word;
                return (
                  <div key={idx} className="group relative">
                    <button
                      onClick={() => handlePhraseClick(wordObj.word)}
                      className={`px-2 py-1 text-xs font-bold rounded-md transition-all border shadow-sm ${
                        isActive
                          ? "bg-red-500/20 text-red-700 border-red-500 dark:bg-red-900/40 dark:text-red-400"
                          : isHighImpact
                          ? "bg-accent/10 text-accent border-accent/20 hover:bg-accent/20"
                          : "bg-surface text-primary border-primary/10 hover:bg-primary/5"
                      }`}
                    >
                      {wordObj.word} <span className="opacity-60 tabular-nums font-medium border-l border-current pl-1 ml-1">{wordObj.count}</span>
                    </button>
                    {/* Tooltip for better alternatives */}
                    {wordObj.betterAlternatives && wordObj.betterAlternatives.length > 0 && (
                      <div className="absolute z-10 bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-64 bg-primary text-surface text-xs rounded-xl p-3 shadow-xl pointer-events-none">
                        <p className="font-bold mb-2 opacity-90">Instead of "{wordObj.word}", consider:</p>
                        <div className="flex flex-wrap gap-1.5">
                          {wordObj.betterAlternatives.map((alt, i) => (
                            <span key={i} className="bg-surface/20 px-2 py-0.5 rounded border border-surface/10 font-medium">
                              {alt}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <p className="text-[11px] text-primary/50 italic">Click a verb to locate all instances in your resume.</p>
          </div>
        )}
        
        {/* Specific UI Highlights / Re-writes */}
        {uiHighlights && uiHighlights.length > 0 && (
           <div className="space-y-3 pb-8">
            <h4 className="font-semibold text-primary text-sm flex items-center gap-2 border-b border-primary/10 pb-2">
              <Target size={16} className="text-primary/60" /> Actionable Precision
            </h4>
            <div className="space-y-3">
              {uiHighlights.map((hl, idx) => {
                const isActive = activeHighlight === hl.exactPhrase;
                return (
                  <div key={idx} 
                       className={`border rounded-xl p-3 cursor-pointer transition-all shadow-sm ${
                         isActive 
                          ? "bg-red-500/10 border-red-500/50 dark:bg-red-900/20" 
                          : "bg-surface border-primary/10 hover:border-primary/30"
                       }`}
                       onClick={() => handlePhraseClick(hl.exactPhrase)}>
                    <div className="flex flex-col gap-2">
                      <p className="text-[13px] font-bold text-accent italic">"{hl.exactPhrase}"</p>
                      <p className="text-xs text-primary/80 leading-relaxed font-medium">{formatWithCodeBlocks(hl.reason)}</p>
                      <div className="bg-primary/5 border border-primary/10 p-2.5 rounded-lg text-xs text-[#04b304] font-bold">
                        <span className="opacity-70 font-medium text-primary mr-1">Rewrite:</span> 
                        {hl.suggestedRewrite}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};
