"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { UploadSection } from "@/components/UploadSection";
import { useWorkspaceStore } from "@/store/useWorkspaceStore";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function UploadGatePage() {
  const router = useRouter();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { 
    setResumeFile, 
    setJobDescription, 
    setOptimizedResumeState, 
    setAtsScore,
    setDomainScore,
    setModifications,
    setOriginalResumeText
  } = useWorkspaceStore();

  const handleAnalyze = async (file: File | null, jdText: string) => {
    if (!file || !jdText) return;
    setIsAnalyzing(true);
    
    try {
      const formData = new FormData();
      formData.append("resume", file);
      formData.append("jd", jdText);

      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || "Analysis failed. Please try again.");
      }

      const data = await response.json();
      
      // Update global store
      setResumeFile(file);
      setJobDescription(jdText);
      setOptimizedResumeState(data.resumeHTML);
      setAtsScore(data.ats_score || 0);
      setDomainScore(data.domain_score || 0);
      setModifications(data.modifications || []);
      setOriginalResumeText(data.originalResumeText || "");

      // Navigate to unified workspace
      router.push("/workspace");
      
    } catch (error: any) {
      console.error("Analysis error:", error);
      alert(error.message);
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center p-8">
        {isAnalyzing ? (
          <div className="flex flex-col items-center gap-6 text-center p-12">
            <div className="relative">
              <Loader2 className="w-16 h-16 text-accent animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-primary/10 animate-pulse"></div>
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-primary mb-2">Analyzing Resume Match</h2>
              <p className="text-primary/70 max-w-sm">
                Our AI is extracting semantic context and computing your baseline ATS and Domain fit scores...
              </p>
            </div>
          </div>
        ) : (
          <UploadSection onAnalyze={handleAnalyze} />
        )}
      </main>
    </div>
  );
}
