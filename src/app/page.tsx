"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { UploadSection } from "@/components/UploadSection";
import { OptimizerSection } from "@/components/OptimizerSection";
import { Loader2 } from "lucide-react";

interface AnalysisResult {
  ats_score: number;
  domain_score: number;
  missing_keywords: string[];
  resumeHTML: string;
}

type AppPhase = "upload" | "analyzing" | "optimize";

export default function HomePage() {
  const [phase, setPhase] = useState<AppPhase>("upload");
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleAnalyze = async (file: File | null, jdText: string) => {
    if (!file || !jdText) return;

    setPhase("analyzing");

    try {
      const formData = new FormData();
      formData.append("resume", file);
      formData.append("jd", jdText);

      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Analysis failed");

      const data = await response.json();
      setResult(data);
      setPhase("optimize");
    } catch (error) {
      console.error("Analysis error:", error);
      setPhase("upload");
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-8">
        {phase === "upload" && <UploadSection onAnalyze={handleAnalyze} />}

        {phase === "analyzing" && (
          <div className="flex flex-col items-center gap-6 text-center p-12">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center">
                <Loader2 size={36} className="text-accent animate-spin" />
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-primary mb-2">
                Analyzing Your Resume...
              </h2>
              <p className="text-primary/60 text-sm">
                Our AI is comparing your resume against the job description.
                This usually takes a few seconds.
              </p>
            </div>
          </div>
        )}

        {phase === "optimize" && result && (
          <OptimizerSection
            result={result}
            onBack={() => {
              setPhase("upload");
              setResult(null);
            }}
          />
        )}
      </main>

      <footer className="py-4 text-center text-xs text-primary/40 border-t border-primary/10">
        © {new Date().getFullYear()} RoleSync AI — Your resumes never leave
        your browser.
      </footer>
    </div>
  );
}
