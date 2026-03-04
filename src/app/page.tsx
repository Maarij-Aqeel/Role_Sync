"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { UploadSection } from "@/components/UploadSection";
import { OptimizerSection } from "@/components/OptimizerSection";
import { LandingSection } from "@/components/LandingSection";
import { Loader2 } from "lucide-react";

import { Modification } from "@/components/KeywordPanel";

interface AnalysisResult {
  ats_score: number;
  domain_score: number;
  modifications: Modification[];
  resumeHTML: string;
}

type AppPhase = "landing" | "upload" | "analyzing" | "optimize";

export default function HomePage() {
  const [phase, setPhase] = useState<AppPhase>("landing");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [resumeFile, setResumeFile] = useState<File | null>(null);

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
      setResumeFile(file);
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
        {phase === "landing" && <LandingSection onStart={() => setPhase("upload")} />}

        {phase === "upload" && <UploadSection onAnalyze={handleAnalyze} />}

        {phase === "analyzing" && (
          <div className="flex flex-col items-center gap-6 text-center p-12">
            <div className="relative w-24 h-24 flex items-center justify-center">
              {/* Outer ATS Ring */}
              <div className="absolute inset-0 border-4 border-accent/20 border-t-accent rounded-full animate-spin"></div>
              
              {/* Inner Domain Ring */}
              <div className="absolute inset-3 border-4 border-primary/10 border-b-primary rounded-full animate-[spin_1.5s_linear_infinite_reverse]"></div>
              
              <Loader2 size={24} className="text-primary/50 animate-pulse" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-primary mb-2">
                Analyzing Your Fit...
              </h2>
              <p className="text-primary/60 text-sm max-w-sm mx-auto">
                Our AI is simulating an ATS scan and extracting critical domain-specific keywords.
              </p>
            </div>
          </div>
        )}

        {phase === "optimize" && result && resumeFile && (
          <OptimizerSection
            result={result}
            resumeFile={resumeFile}
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
