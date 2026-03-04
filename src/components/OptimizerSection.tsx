"use client";

import React, { useRef, useState } from "react";
import { ScoreDisplay } from "./ScoreDisplay";
import { KeywordPanel, Modification } from "./KeywordPanel";
import { ResumeEditor, ResumeEditorHandle } from "./ResumeEditor";
import { Download, ArrowLeft } from "lucide-react";

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
  const [activeTab, setActiveTab] = useState<"editor" | "keywords">("editor");
  const [isExporting, setIsExporting] = useState(false);

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

  const handleDownloadPDF = async () => {
    const html = editorRef.current?.getHTML();
    if (!html) return;
    
    setIsExporting(true);
    
    try {
      const formData = new FormData();
      formData.append("resumeFile", resumeFile);
      formData.append("htmlContent", html);

      const response = await fetch("/api/export", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.error
            ? `${errorData.error}: ${errorData.details || errorData.log || ""}`
            : "Failed to generate PDF"
        );
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "rolesync-optimized-resume.pdf";
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    } catch (error: any) {
      console.error("Export error:", error);
      alert(`An error occurred while generating the PDF: ${error.message}`);
    } finally {
      setIsExporting(false);
    }
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

        <button
          onClick={handleDownloadPDF}
          disabled={isExporting}
          className="flex items-center gap-2 bg-accent text-surface px-5 py-3 rounded-xl font-bold text-sm hover:bg-accent/90 transition-colors shadow-lg shadow-accent/20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isExporting ? "Generating Layout..." : <><Download size={16} /> Download PDF</>}
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
          Keywords ({pendingModifications.length})
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
            modifications={pendingModifications}
            injectedModifications={injectedModifications}
            onModificationClick={handleModificationClick}
          />
        </div>
      </div>
    </div>
  );
};
