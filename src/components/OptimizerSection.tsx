"use client";

import React, { useRef, useState } from "react";
import { ScoreDisplay } from "./ScoreDisplay";
import { KeywordPanel, Modification } from "./KeywordPanel";
import { FeedbackPanel } from "./feedback/FeedbackPanel";
import { ResumeEditor, ResumeEditorHandle } from "./ResumeEditor";
import { ArrowLeft } from "lucide-react";

interface AnalysisResult {
  ats_score: number;
  domain_score: number;
  modifications: Modification[];
  resumeHTML: string;
}

interface OptimizerSectionProps {
  result: AnalysisResult;
  resumeFile: File;
  onBack: () => void;
}

export const OptimizerSection: React.FC<OptimizerSectionProps> = ({
  result,
  resumeFile,
  onBack,
}) => {
  const editorRef = useRef<ResumeEditorHandle>(null);
  const [atsScore, setAtsScore] = useState(result.ats_score);
  const [domainScore, setDomainScore] = useState(result.domain_score);
  const [pendingModifications, setPendingModifications] = useState<Modification[]>(
    result.modifications
  );
  const [injectedModifications, setInjectedModifications] = useState<Modification[]>([]);
  const [activeTab, setActiveTab] = useState<"editor" | "sidebar">("editor");
  const [sidebarTab, setSidebarTab] = useState<"keywords" | "feedback">("keywords");

  const handleModificationClick = (modObj: Modification) => {
    editorRef.current?.injectKeyword(modObj);

    setPendingModifications((prev) => prev.filter((m) => m.keyword_added !== modObj.keyword_added));
    setInjectedModifications((prev) => [...prev, modObj]);

    // Dynamically boost Domain score significantly per keyword, and ATS slightly
    const domainBoost = Math.floor(Math.random() * 5) + 3; // 3 to 7 points
    setDomainScore((prev) => Math.min(100, prev + domainBoost));

    const atsBoost = Math.floor(Math.random() * 3) + 1; // 1 to 3 points
    setAtsScore((prev) => Math.min(100, prev + atsBoost));
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 lg:p-6 flex flex-col gap-6">
      {/* Top Bar */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-medium text-primary/70 hover:text-primary transition-colors"
        >
          <ArrowLeft size={16} />
          New Analysis
        </button>

        <ScoreDisplay atsScore={atsScore} domainScore={domainScore} />
      </div>

      {/* Mobile Tab Navigation */}
      <div className="flex lg:hidden border-b border-primary/10">
        <button
          onClick={() => setActiveTab("editor")}
          className={`flex-1 py-3 text-sm font-semibold text-center transition-colors ${
            activeTab === "editor"
              ? "text-accent border-b-2 border-accent"
              : "text-primary/50"
          }`}
        >
          Resume Editor
        </button>
        <button
          onClick={() => setActiveTab("sidebar")}
          className={`flex-1 py-3 text-sm font-semibold text-center transition-colors ${
            activeTab === "sidebar"
              ? "text-accent border-b-2 border-accent"
              : "text-primary/50"
          }`}
        >
          Analysis Tools
        </button>
      </div>

      {/* Split Screen */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6 flex-1">
        {/* Left: Resume Editor */}
        <div
          className={`${activeTab === "editor" ? "flex" : "hidden"} lg:flex min-h-[500px] flex-col`}
        >
          <ResumeEditor ref={editorRef} initialContent={result.resumeHTML} />
        </div>

        {/* Right: Analysis Sidebar */}
        <div
          className={`${
            activeTab === "sidebar" ? "flex" : "hidden"
          } lg:flex lg:sticky lg:top-20 lg:self-start h-[calc(100vh-140px)] flex-col`}
        >
          <div className="flex bg-primary/5 rounded-t-xl p-1 gap-1 border border-primary/10 border-b-0 shrink-0">
            <button
              onClick={() => setSidebarTab("keywords")}
              className={`flex-1 py-2 text-xs font-bold text-center rounded-lg transition-all ${
                sidebarTab === "keywords"
                  ? "bg-surface text-accent shadow-sm"
                  : "text-primary/60 hover:text-primary hover:bg-primary/5"
              }`}
            >
              Missing Skills
            </button>
            <button
              onClick={() => setSidebarTab("feedback")}
              className={`flex-1 py-2 text-xs font-bold text-center rounded-lg transition-all ${
                sidebarTab === "feedback"
                  ? "bg-surface text-accent shadow-sm"
                  : "text-primary/60 hover:text-primary hover:bg-primary/5"
              }`}
            >
              AI Feedback
            </button>
          </div>
          
          <div className="flex-1 overflow-hidden flex flex-col">
            {sidebarTab === "keywords" && (
              <KeywordPanel
                modifications={pendingModifications}
                injectedModifications={injectedModifications}
                onModificationClick={handleModificationClick}
              />
            )}
            {sidebarTab === "feedback" && <FeedbackPanel />}
          </div>
        </div>
      </div>
    </div>
  );
};
