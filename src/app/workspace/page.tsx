"use client";

import React, { useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { OptimizerSection } from "@/components/OptimizerSection";
import { useWorkspaceStore } from "@/store/useWorkspaceStore";
import { useRouter } from "next/navigation";
import { useFeedbackStore } from "@/store/useFeedbackStore";

export default function WorkspacePage() {
  const router = useRouter();
  const { atsScore, domainScore, modifications, optimizedResumeState, resumeFile } = useWorkspaceStore();
  
  const setInterviewerCritique = useFeedbackStore((s) => s.setInterviewerCritique);
  const setRepetitiveWords = useFeedbackStore((s) => s.setRepetitiveWords);
  const setSectionAnalysis = useFeedbackStore((s) => s.setSectionAnalysis);
  const setUiHighlights = useFeedbackStore((s) => s.setUiHighlights);

  useEffect(() => {
    // --- TEMPORARY MOCK DATA FOR PHASE 18 HIGHLIGHT ENGINE TESTING ---
    setInterviewerCritique({
      summary: "Your technical background is strong, but the resume reads like a loosely connected list of tools rather than a cohesive narrative of impact. Focus on business value and specific outcomes.",
      tone: "Critical & Direct"
    });
    
    setRepetitiveWords([
      { word: "Developed", count: 7, impact: "high", betterAlternatives: ["Architected", "Engineered", "Spearheaded"] },
      { word: "Used", count: 5, impact: "high", betterAlternatives: ["Leveraged", "Utilized", "Deployed"] },
      { word: "Team", count: 4, impact: "medium", betterAlternatives: ["Cross-functional group", "Squad"] }
    ]);
    
    setSectionAnalysis({
      experience: { status: "pass", message: "Great quantifiable metrics found." },
      education: { status: "needs_work", message: "Missing graduation date or GPA metrics." }
    });
    
    setUiHighlights([
      {
        exactPhrase: "software",
        reason: "Generic noun. If possible, replace with the specific architecture (e.g. 'microservices', 'distributed systems').",
        suggestedRewrite: "scalable microservices"
      },
      {
        exactPhrase: "project",
        reason: "Ambiguous scope. Specify what the project was.",
        suggestedRewrite: "enterprise application"
      }
    ]);
    // ---------------------------------------------------------------
  }, [setInterviewerCritique, setRepetitiveWords, setSectionAnalysis, setUiHighlights]);

  // Route guarding: Send them back to the gate if they try to access the workspace without a session
  useEffect(() => {
    if (!resumeFile || !optimizedResumeState) {
      router.push("/upload");
    }
  }, [resumeFile, optimizedResumeState, router]);

  if (!resumeFile || !optimizedResumeState) return null;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-start pb-12">
        <OptimizerSection 
          result={{
            ats_score: atsScore,
            domain_score: domainScore,
            modifications: modifications,
            resumeHTML: optimizedResumeState
          }}
          resumeFile={resumeFile}
          onBack={() => router.push("/upload")}
        />
      </main>
    </div>
  );
}
