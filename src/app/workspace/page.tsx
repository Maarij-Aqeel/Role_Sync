"use client";

import React, { useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { OptimizerSection } from "@/components/OptimizerSection";
import { useWorkspaceStore } from "@/store/useWorkspaceStore";
import { useRouter } from "next/navigation";

export default function WorkspacePage() {
  const router = useRouter();
  const { atsScore, domainScore, modifications, optimizedResumeState, resumeFile } = useWorkspaceStore();

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
