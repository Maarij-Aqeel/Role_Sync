"use client";

import React, { useRef, useState } from "react";
import { ScoreDisplay } from "./ScoreDisplay";
import { KeywordPanel } from "./KeywordPanel";
import { ResumeEditor, ResumeEditorHandle } from "./ResumeEditor";
import { Download, ArrowLeft } from "lucide-react";

interface AnalysisResult {
  ats_score: number;
  domain_score: number;
  missing_keywords: string[];
  resumeHTML: string;
}

interface OptimizerSectionProps {
  result: AnalysisResult;
  onBack: () => void;
}

export const OptimizerSection: React.FC<OptimizerSectionProps> = ({
  result,
  onBack,
}) => {
  const editorRef = useRef<ResumeEditorHandle>(null);
  const [atsScore, setAtsScore] = useState(result.ats_score);
  const [missingKeywords, setMissingKeywords] = useState<string[]>(
    result.missing_keywords
  );
  const [injectedKeywords, setInjectedKeywords] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<"editor" | "keywords">("editor");

  const handleKeywordClick = (keyword: string) => {
    editorRef.current?.injectKeyword(keyword);

    setMissingKeywords((prev) => prev.filter((k) => k !== keyword));
    setInjectedKeywords((prev) => [...prev, keyword]);

    // Dynamically boost ATS score by 2-5 points per keyword
    const boost = Math.floor(Math.random() * 4) + 2;
    setAtsScore((prev) => Math.min(100, prev + boost));
  };

  const handleDownloadPDF = async () => {
    const html = editorRef.current?.getHTML();
    if (!html) return;

    // Dynamic import for client-side PDF generation
    const { default: html2pdf } = await import("html2pdf.js");

    const container = document.createElement("div");
    container.innerHTML = html;
    container.style.padding = "40px";
    container.style.fontFamily = "Arial, Helvetica, sans-serif";
    container.style.fontSize = "12px";
    container.style.lineHeight = "1.6";
    container.style.color = "#2D4059";

    html2pdf()
      .set({
        margin: [10, 15],
        filename: "rolesync-optimized-resume.pdf",
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      })
      .from(container)
      .save();
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

        <ScoreDisplay atsScore={atsScore} domainScore={result.domain_score} />

        <button
          onClick={handleDownloadPDF}
          className="flex items-center gap-2 bg-accent text-surface px-5 py-3 rounded-xl font-bold text-sm hover:bg-accent/90 transition-colors shadow-lg shadow-accent/20"
        >
          <Download size={16} />
          Download PDF
        </button>
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
          onClick={() => setActiveTab("keywords")}
          className={`flex-1 py-3 text-sm font-semibold text-center transition-colors ${
            activeTab === "keywords"
              ? "text-accent border-b-2 border-accent"
              : "text-primary/50"
          }`}
        >
          Keywords ({missingKeywords.length})
        </button>
      </div>

      {/* Split Screen */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6 flex-1">
        {/* Left: Resume Editor */}
        <div
          className={`${activeTab === "editor" ? "block" : "hidden"} lg:block`}
        >
          <ResumeEditor ref={editorRef} initialContent={result.resumeHTML} />
        </div>

        {/* Right: Keywords Panel */}
        <div
          className={`${
            activeTab === "keywords" ? "block" : "hidden"
          } lg:block lg:sticky lg:top-20 lg:self-start`}
        >
          <KeywordPanel
            missingKeywords={missingKeywords}
            injectedKeywords={injectedKeywords}
            onKeywordClick={handleKeywordClick}
          />
        </div>
      </div>
    </div>
  );
};
