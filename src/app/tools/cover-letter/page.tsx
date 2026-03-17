// app/tools/cover-letter/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  Wand2, 
  Copy, 
  Check, 
  Download, 
  RefreshCw,
  FileText
} from "lucide-react";
import { useWorkspaceStore } from "@/store/useWorkspaceStore";
import { Navbar } from "@/components/Navbar";

export default function CoverLetterToolPage() {
  const router = useRouter();
  const { jobDescription, originalResumeText, coverLetterHTML, setCoverLetterHTML } = useWorkspaceStore();
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [content, setContent] = useState(coverLetterHTML || "");

  useEffect(() => {
    if (!jobDescription || !originalResumeText) {
      router.push("/setup");
    }
  }, [jobDescription, originalResumeText, router]);

  const generateCoverLetter = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch("/api/generate-cover-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ originalResumeText, jobDescription }),
      });

      if (!response.ok) throw new Error("Generation failed");
      
      const data = await response.json();
      setCoverLetterHTML(data.coverLetterHTML);
      setContent(data.coverLetterHTML);
    } catch (error) {
      alert("Failed to generate cover letter");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = async () => {
    try {
      const text = content.replace(/<[^>]*>?/gm, '');
      const blobHtml = new Blob([content], { type: "text/html" });
      const blobText = new Blob([text], { type: "text/plain" });
      
      await navigator.clipboard.write([
        new ClipboardItem({
          "text/html": blobHtml,
          "text/plain": blobText,
        }),
      ]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy rich text", err);
      // Fallback
      const text = content.replace(/<[^>]*>?/gm, '');
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleExport = async () => {
    // PDF export logic here
    const html2pdf = (await import("html2pdf.js")).default;
    const element = document.getElementById("cover-letter-content");
    if (element) {
      await html2pdf().from(element).save("cover-letter.pdf");
    }
  };

  if (!jobDescription) return null;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <div className="flex-1 flex flex-col max-w-5xl mx-auto w-full p-6">
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => router.push("/dashboard")}
              className="p-2 hover:bg-surface rounded-lg transition-colors text-text-muted hover:text-text-primary"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
                <FileText className="w-6 h-6 text-accent" />
                Cover Letter Writer
              </h1>
              <p className="text-text-muted text-sm">Tailored to your resume and job description</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {content && (
              <>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-surface border border-border hover:border-accent/50 text-text-primary transition-all"
                >
                  {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  {copied ? "Copied" : "Copy Text"}
                </button>
                <button
                  onClick={handleExport}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-surface hover:bg-primary/90 transition-all"
                >
                  <Download className="w-4 h-4" />
                  Export PDF
                </button>
              </>
            )}
            <button
              onClick={generateCoverLetter}
              disabled={isGenerating}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-white hover:bg-accent/90 disabled:opacity-50 transition-all"
            >
              {isGenerating ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Wand2 className="w-4 h-4" />
              )}
              {content ? "Regenerate" : "Generate"}
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <div className="flex-1 bg-surface rounded-2xl border border-border shadow-sm overflow-hidden">
          {isGenerating ? (
            <div className="h-full flex flex-col items-center justify-center gap-4 p-12">
              <motion.div 
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="w-16 h-16 rounded-2xl bg-accent-subtle flex items-center justify-center"
              >
                <Wand2 className="w-8 h-8 text-accent" />
              </motion.div>
              <p className="text-text-secondary">Crafting your personalized cover letter...</p>
            </div>
          ) : content ? (
            <div className="h-full flex flex-col">
              {/* Simple Toolbar */}
              <div className="px-6 py-3 border-b border-border bg-surface-elevated flex items-center gap-4">
                <span className="text-xs font-medium text-text-muted uppercase tracking-wider">
                  Editor
                </span>
                <div className="h-4 w-px bg-border" />
                <span className="text-xs text-text-muted">
                  {content.replace(/<[^>]*>?/gm, '').length} characters
                </span>
              </div>
              
              {/* Content Editable Area */}
              <div className="flex-1 overflow-y-auto p-8">
                <div 
                  id="cover-letter-content"
                  contentEditable
                  onInput={(e) => setContent(e.currentTarget.innerHTML)}
                  className="max-w-3xl mx-auto prose prose-slate focus:outline-none min-h-[600px] text-text-primary"
                  dangerouslySetInnerHTML={{ __html: content }}
                />
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center gap-4 p-12 text-center">
              <div className="w-20 h-20 rounded-3xl bg-surface-elevated flex items-center justify-center mb-4">
                <FileText className="w-10 h-10 text-text-muted" />
              </div>
              <h3 className="text-xl font-semibold text-text-primary">Ready to create</h3>
              <p className="text-text-secondary max-w-md">
                Generate a personalized cover letter that highlights your relevant experience and matches the job requirements.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}