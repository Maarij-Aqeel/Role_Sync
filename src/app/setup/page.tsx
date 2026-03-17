// app/setup/page.tsx
"use client";

import React, { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Upload, 
  FileText, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2,
  Loader2,
  Briefcase,
  FileSearch
} from "lucide-react";
import { useWorkspaceStore } from "@/store/useWorkspaceStore";
import { Navbar } from "@/components/Navbar";

export default function SetupPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [jdText, setJdText] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const { setResumeFile, setJobDescription, setAnalysisResults, setIsAnalyzing, setFeedback } = useWorkspaceStore();

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === "application/pdf") {
      setFile(droppedFile);
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleAnalyze = async () => {
    if (!file || !jdText.trim()) return;
    
    setIsUploading(true);
    setIsAnalyzing(true);
    
    // Simulate progress
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => Math.min(prev + 10, 90));
    }, 200);

    try {
      const formData = new FormData();
      formData.append("resume", file);
      formData.append("jd", jdText);

      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (!response.ok) throw new Error("Analysis failed");

      const data = await response.json();
      
      setResumeFile(file);
      setJobDescription(jdText);
      setAnalysisResults({
        atsScore: data.ats_score || 0,
        domainScore: data.domain_score || 0,
        modifications: (data.modifications || []).map((mod: any, index: number) => ({
          id: `mod-${index}-${Date.now()}`,
          original: mod.original_text || '',
          suggested: mod.rewritten_text || '',
          category: mod.type === 'concept' ? 'content' : 'keyword',
          applied: false
        })),
        optimizedResumeHTML: data.resumeHTML,
        originalResumeText: data.originalResumeText || "",
      });

      // Also set the feedback data if it exists
      if (data.feedback) {
        setFeedback(data.feedback);
      }

      // Small delay for progress bar completion animation
      setTimeout(() => {
        router.push("/dashboard");
      }, 500);
      
    } catch (error) {
      console.error(error);
      alert("Analysis failed. Please try again.");
      setIsUploading(false);
      setIsAnalyzing(false);
      setUploadProgress(0);
    }
  };

  const isReady = file && jdText.trim().length > 50;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 flex items-center justify-center p-4 lg:p-8">
        {isUploading ? (
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
              <h2 className="text-2xl font-bold text-text-primary">
                Scanning Application
              </h2>
              <p className="text-text-muted text-sm leading-relaxed">
                Our AI is extracting semantic context, parsing skills, and calculating your baseline Domain fit scores against the Job Description...
              </p>
              <div className="w-full bg-surface-elevated rounded-full h-2 mt-4 overflow-hidden">
                <motion.div 
                  initial={{ width: "0%" }}
                  animate={{ width: `${uploadProgress}%` }}
                  className="h-full bg-accent transition-all duration-200"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          
          {/* Left Column - Upload */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="space-y-2">
              <h1 className="text-4xl font-bold text-text-primary tracking-tight">
                Let's get you <span className="text-accent">synced</span>
              </h1>
              <p className="text-text-secondary text-lg">
                Upload your resume and job description once. Use them across all our tools.
              </p>
            </div>

            {/* Resume Upload Zone */}
            <div 
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`
                relative group cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-300
                ${isDragging 
                  ? 'border-accent bg-accent-subtle scale-[1.02]' 
                  : 'border-border hover:border-primary-muted bg-surface'
                }
                ${file ? 'p-6' : 'p-12'}
              `}
            >
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileInput}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              
              <AnimatePresence mode="wait">
                {file ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex items-center gap-4"
                  >
                    <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                      <FileText className="w-6 h-6 text-accent" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-text-primary truncate">{file.name}</p>
                      <p className="text-sm text-text-muted">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                    <CheckCircle2 className="w-6 h-6 text-green-500" />
                  </motion.div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center space-y-4"
                  >
                    <div className="w-16 h-16 mx-auto rounded-2xl bg-surface-elevated flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Upload className="w-8 h-8 text-primary-muted" />
                    </div>
                    <div>
                      <p className="font-medium text-text-primary">Drop your resume here</p>
                      <p className="text-sm text-text-muted mt-1">PDF up to 10MB</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* JD Input */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-medium text-text-primary">
                <Briefcase className="w-4 h-4 text-accent" />
                Job Description
              </label>
              <textarea
                value={jdText}
                onChange={(e) => setJdText(e.target.value)}
                placeholder="Paste the job description here..."
                className="w-full h-48 p-4 rounded-xl bg-surface border border-border resize-none focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all text-text-primary placeholder:text-text-muted"
              />
              <p className="text-xs text-text-muted text-right">
                {jdText.length} characters
              </p>
            </div>
          </motion.div>

          {/* Right Column - Preview & Action */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:sticky lg:top-8 space-y-6"
          >
            <div className="bg-surface rounded-2xl p-6 border border-border shadow-sm">
              <h3 className="font-semibold text-text-primary mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-accent" />
                What happens next?
              </h3>
              <ul className="space-y-4">
                {[
                  { step: 1, text: "AI extracts skills & experience from your resume" },
                  { step: 2, text: "Analyzes semantic match with job requirements" },
                  { step: 3, text: "Calculates ATS compatibility score" },
                  { step: 4, text: "Generates optimization suggestions" },
                ].map((item) => (
                  <li key={item.step} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent-subtle text-accent text-xs font-bold flex items-center justify-center">
                      {item.step}
                    </span>
                    <span className="text-text-secondary text-sm">{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Action Button */}
            <button
              onClick={handleAnalyze}
              disabled={!isReady || isUploading}
              className={`
                w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-3
                ${isReady && !isUploading
                  ? 'bg-accent text-white hover:bg-accent/90 hover:scale-[1.02] hover:shadow-lg shadow-accent/25' 
                  : 'bg-surface-elevated text-text-muted cursor-not-allowed border border-border'
                }
              `}
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Analyzing... {uploadProgress}%</span>
                </>
              ) : (
                <>
                  <span>Analyze Resume</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>

            {!isReady && (
              <p className="text-center text-sm text-text-muted">
                Upload a PDF and paste a job description to continue
              </p>
            )}
          </motion.div>
        </div>
        )}
      </main>
    </div>
  );
}