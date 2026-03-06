"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { UploadSection } from "@/components/UploadSection";
import { useWorkspaceStore } from "@/store/useWorkspaceStore";
import { useRouter } from "next/navigation";
import { FileSearch } from "lucide-react";
import { motion } from "framer-motion";

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
          <div className="flex flex-col items-center justify-center gap-8 text-center p-12 max-w-md mx-auto">
            <div className="relative w-32 h-32 flex items-center justify-center rounded-2xl bg-surface border border-primary/10 shadow-lg overflow-hidden">
              <motion.div 
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.6, 0.3]
                }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                className="absolute inset-0 bg-accent/5 rounded-2xl"
              />
              <motion.div
                 animate={{ y: [-5, 5, -5] }}
                 transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              >
                <FileSearch className="w-12 h-12 text-accent" />
              </motion.div>
              <motion.div 
                className="absolute left-0 right-0 h-1 bg-accent/50 filter blur-[2px]"
                animate={{ top: ["0%", "100%", "0%"] }}
                transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }}
              />
            </div>
            <div className="space-y-3">
              <h2 className="text-2xl font-bold text-primary">Scanning Application</h2>
              <p className="text-primary/70 text-sm leading-relaxed">
                Our AI is extracting semantic context, parsing skills, and calculating your baseline Domain fit scores against the Job Description...
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
