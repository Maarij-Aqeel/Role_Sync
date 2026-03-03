"use client";

import React from "react";
import { Sparkles, CheckCircle2 } from "lucide-react";

export interface MissingKeyword {
  keyword: string;
  type: "hard_skill" | "concept";
  target_section: string;
  suggested_injection: string;
  target_bullet_index?: number;
  confidence: number;
}

interface KeywordPanelProps {
  missingKeywords: MissingKeyword[];
  injectedKeywords: MissingKeyword[];
  onKeywordClick: (keywordObj: MissingKeyword) => void;
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
        <div className="flex flex-col gap-2">
          {missingKeywords.map((kw, i) => (
            <button
              key={i}
              onClick={() => onKeywordClick(kw)}
              className="flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg border border-accent/30 text-accent bg-accent/5 hover:bg-accent hover:text-surface transition-all cursor-pointer group"
            >
              <span>+ {kw.keyword}</span>
              <span className="text-[10px] uppercase tracking-wider opacity-60 bg-surface/50 px-2 py-0.5 rounded text-primary group-hover:text-primary">
                {kw.type.replace("_", " ")}
              </span>
            </button>
          ))}
        </div>
        {injectedKeywords.length > 0 && (
          <div className="mt-6 pt-4 border-t border-primary/10">
            <h4 className="text-xs font-semibold text-primary/50 uppercase tracking-wider mb-2">
              Added Keywords
            </h4>
            <div className="flex flex-wrap gap-2">
              {injectedKeywords.map((kw, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 text-sm font-medium rounded-lg bg-green-50 text-green-700 border border-green-200 flex items-center gap-1"
                >
                  <CheckCircle2 size={14} />
                  {kw.keyword}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
