import React, { useState, useEffect } from "react";
import { Editor } from "@tiptap/react";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw, Code, Copy, Check } from "lucide-react";

interface EditorToolbarProps {
  editor: Editor | null;
}

export const EditorToolbar: React.FC<EditorToolbarProps> = ({ editor }) => {
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [isGeneratingLatex, setIsGeneratingLatex] = useState(false);
  const [latexCode, setLatexCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Disable TipTap read-only mode during generation
  useEffect(() => {
    if (editor && !editor.isDestroyed) {
      editor.setEditable(!isRegenerating);
    }
  }, [isRegenerating, editor]);

  const handleRegenerate = async () => {
    setIsRegenerating(true);
    // TODO: Call AI route with base resume + JD, then editor.commands.setContent(newHtml)
    
    // Simulating API call for now
    setTimeout(() => {
      setIsRegenerating(false);
    }, 2000);
  };

  const handleGenerateLatex = async () => {
    setIsGeneratingLatex(true);
    // TODO: Call existing LLM LaTeX API, then setLatexCode(result)
    
    // Simulating API call for now
    setTimeout(() => {
      setLatexCode("% Simulated LaTeX Export\\n\\documentclass{article}");
      setIsGeneratingLatex(false);
    }, 2000);
  };

  const handleCopyLatex = async () => {
    if (latexCode) {
      await navigator.clipboard.writeText(latexCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="bg-slate-900/50 backdrop-blur-md border-b border-white/10 p-3 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-2">
        <button
          onClick={handleRegenerate}
          disabled={isRegenerating}
          className="group flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-300 hover:text-rose-400 hover:bg-rose-500/10 transition-all disabled:opacity-50"
        >
          <RefreshCw size={16} className={`${isRegenerating ? "animate-spin text-rose-400" : "group-hover:rotate-180 transition-transform duration-500"}`} />
          {isRegenerating ? "Regenerating..." : "Regenerate for JD"}
        </button>
      </div>

      <div className="flex items-center gap-2">
        <AnimatePresence mode="popLayout">
          {latexCode && (
            <motion.button
              key="copy"
              initial={{ opacity: 0, scale: 0.8, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.8, x: 20 }}
              onClick={handleCopyLatex}
              className={`group flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-bold transition-all shadow-sm ${
                copied 
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" 
                  : "bg-surface border border-primary/10 text-primary hover:border-primary/30"
              }`}
            >
              {copied ? (
                <>
                  <Check size={16} className="text-emerald-400 group-hover:scale-110 transition-transform" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy size={16} className="group-hover:scale-110 transition-transform" />
                  Copy LaTeX Code
                </>
              )}
            </motion.button>
          )}

          <motion.button
            key="generate"
            layout
            onClick={handleGenerateLatex}
            disabled={isGeneratingLatex}
            className="group flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-bold bg-[#EA5455] text-white hover:bg-[#EA5455]/90 transition-all shadow-[0_0_15px_rgba(234,84,85,0.3)] disabled:opacity-50"
          >
            <Code size={16} className={`${isGeneratingLatex ? "animate-pulse" : "group-hover:scale-110 transition-transform"}`} />
            {isGeneratingLatex ? "Generating..." : "Generate LaTeX"}
          </motion.button>
        </AnimatePresence>
      </div>
    </div>
  );
};
