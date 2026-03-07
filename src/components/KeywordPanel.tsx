"use client";

import React from "react";
import { Sparkles, CheckCircle2 } from "lucide-react";

export interface Modification {
  type: "hard_skill" | "concept";
  keyword_added: string;
  target_section: string;
  original_text: string;
  rewritten_text: string;
}

interface KeywordPanelProps {
  modifications: Modification[];
  injectedModifications: Modification[];
  onModificationClick: (modObj: Modification) => void;
}

export const KeywordPanel: React.FC<KeywordPanelProps> = ({
  modifications,
  injectedModifications,
  onModificationClick,
}) => {
  const domainSkills = modifications.filter((m) => m.type === "hard_skill");
  const actionableRewrites = modifications.filter((m) => m.type === "concept");

  return (
    <div className="bg-surface rounded-b-xl border border-primary/10 border-t-0 shadow-sm flex flex-col h-full w-full overflow-hidden">
      <div className="p-4 bg-accent/5 border-b border-primary/10 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <Sparkles size={18} className="text-accent" />
          <h3 className="font-bold text-primary text-sm">Optimization Engine</h3>
        </div>
        <span className="text-xs bg-accent/10 text-accent px-2 py-0.5 rounded-full font-medium">
          {modifications.length} remaining
        </span>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-6">
        
        {/* Domain Fit Keywords Section */}
        {domainSkills.length > 0 && (
          <div className="flex flex-col gap-2">
            <h4 className="text-xs font-bold text-primary/70 uppercase tracking-widest border-b border-primary/5 pb-1">
              Domain Fit Keywords
            </h4>
            <p className="text-[11px] text-primary/50 mb-1">
              Click to instantly inject highly-relevant skills into your existing sections.
            </p>
            <div className="flex flex-col gap-2">
              {domainSkills.map((mod, i) => (
                <button
                  key={`hs-${i}`}
                  onClick={() => onModificationClick(mod)}
                  className="flex flex-col items-start gap-1 px-3 py-2 text-sm font-medium rounded-lg border border-[#EA5455]/30 text-[#EA5455] bg-[#EA5455]/5 hover:bg-[#EA5455] hover:text-surface transition-all cursor-pointer group text-left"
                >
                  <span className="font-bold border-b border-[#EA5455]/20 group-hover:border-surface/40 pb-1 w-full flex justify-between">
                    <span>+ {mod.keyword_added}</span>
                    <span className="text-[10px] uppercase font-bold tracking-widest opacity-60">Skill</span>
                  </span>
                  <span className="text-xs opacity-80 mt-1 line-clamp-2 italic">
                    &quot;{mod.rewritten_text}&quot;
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Actionable Rewrites Section */}
        {actionableRewrites.length > 0 && (
          <div className="flex flex-col gap-2 mt-2">
            <h4 className="text-xs font-bold text-accent uppercase tracking-widest border-b border-accent/20 pb-1">
              Actionable Rewrites
            </h4>
            <p className="text-[11px] text-primary/50 mb-1">
              Click to upgrade entire bullet points with stronger impact sentences.
            </p>
            <div className="flex flex-col gap-2">
              {actionableRewrites.map((mod, i) => (
                <button
                  key={`ar-${i}`}
                  onClick={() => onModificationClick(mod)}
                  className="flex flex-col items-start gap-1 px-3 py-2 text-sm font-medium rounded-lg border border-accent/30 text-accent bg-accent/5 hover:bg-accent hover:text-surface transition-all cursor-pointer group text-left shadow-sm"
                >
                  <span className="font-bold border-b border-accent/20 group-hover:border-surface/40 pb-1 w-full flex justify-between">
                    <span>Rewrite Bullet Point</span>
                    <span className="text-[10px] uppercase font-bold tracking-widest opacity-60">Action</span>
                  </span>
                  <span className="text-xs opacity-90 mt-1 leading-relaxed">
                    &quot;{mod.rewritten_text}&quot;
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Integrated Updates */}
        {injectedModifications.length > 0 && (
          <div className="mt-4 pt-4 border-t border-primary/10 shrink-0">
            <h4 className="text-[10px] font-semibold text-primary/40 uppercase tracking-widest mb-3 text-center">
              Successfully Integrated
            </h4>
            <div className="flex flex-wrap gap-2 justify-center">
              {injectedModifications.map((mod, i) => (
                <span
                  key={`inj-${i}`}
                  className="px-2 py-1 text-xs font-medium rounded-md bg-green-500/10 text-green-700 border border-green-500/20 flex items-center gap-1.5 shadow-sm"
                >
                  <CheckCircle2 size={12} className="text-green-600" />
                  {mod.type === "hard_skill" ? mod.keyword_added : "Bullet Rewritten"}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
