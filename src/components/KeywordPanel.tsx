"use client";

import React from "react";
import { Sparkles, CheckCircle2 } from "lucide-react";

interface KeywordPanelProps {
  missingKeywords: string[];
  injectedKeywords: string[];
  onKeywordClick: (keyword: string) => void;
}

export const KeywordPanel: React.FC<KeywordPanelProps> = ({
  missingKeywords,
  injectedKeywords,
  onKeywordClick,
}) => {
  return (
    <div className="bg-surface rounded-xl border border-primary/10 shadow-sm overflow-hidden">
      <div className="p-4 bg-accent/5 border-b border-primary/10 flex items-center gap-2">
        <Sparkles size={18} className="text-accent" />
        <h3 className="font-bold text-primary text-sm">Missing Keywords</h3>
        <span className="ml-auto text-xs bg-accent/10 text-accent px-2 py-0.5 rounded-full font-medium">
          {missingKeywords.length} remaining
        </span>
      </div>
      <div className="p-4">
        <p className="text-xs text-primary/60 mb-3">
          Click a keyword to auto-inject it into the best section of your resume.
        </p>
        <div className="flex flex-wrap gap-2">
          {missingKeywords.map((keyword) => (
            <button
              key={keyword}
              onClick={() => onKeywordClick(keyword)}
              className="px-3 py-1.5 text-sm font-medium rounded-lg border border-accent/30 text-accent bg-accent/5 hover:bg-accent hover:text-surface transition-all cursor-pointer"
            >
              + {keyword}
            </button>
          ))}
        </div>
        {injectedKeywords.length > 0 && (
          <div className="mt-6 pt-4 border-t border-primary/10">
            <h4 className="text-xs font-semibold text-primary/50 uppercase tracking-wider mb-2">
              Added Keywords
            </h4>
            <div className="flex flex-wrap gap-2">
              {injectedKeywords.map((keyword) => (
                <span
                  key={keyword}
                  className="px-3 py-1.5 text-sm font-medium rounded-lg bg-green-50 text-green-700 border border-green-200 flex items-center gap-1"
                >
                  <CheckCircle2 size={14} />
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
