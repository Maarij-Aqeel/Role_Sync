"use client";

import React, { useEffect, useState, useRef } from "react";
import { Navbar } from "@/components/Navbar";
import { useWorkspaceStore } from "@/store/useWorkspaceStore";
import { useRouter } from "next/navigation";
import { Loader2, ArrowLeft, Wand2, Download, Copy, Check } from "lucide-react";
import { ResumeEditor, ResumeEditorHandle } from "@/components/ResumeEditor";

export default function CoverLetterPage() {
  const router = useRouter();
  const editorRef = useRef<ResumeEditorHandle>(null);
  const { originalResumeText, jobDescription } = useWorkspaceStore();
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [coverLetterHTML, setCoverLetterHTML] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Route guarding
  useEffect(() => {
    if (!originalResumeText || !jobDescription) {
      router.push("/upload?intent=cover-letter");
    }
  }, [originalResumeText, jobDescription, router]);

  const generateCoverLetter = async () => {
    setIsGenerating(true);
    setCoverLetterHTML(null);

    try {
      const response = await fetch("/api/generate-cover-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ originalResumeText, jobDescription }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate cover letter.");
      }

      const data = await response.json();
      setCoverLetterHTML(data.coverLetterHTML);
    } catch (error: any) {
      console.error(error);
      alert("Error generating cover letter. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrint = () => {
    // The easiest way to export a basic cover letter from TipTap without a complex LaTeX template
    window.print();
  };

  const handleCopy = async () => {
    if (!editorRef.current) return;
    const htmlContent = editorRef.current.getHTML();
    const textContent = htmlContent.replace(/<[^>]*>?/gm, '');
    let success = false;
    
    // Attempt 1: Rich Text Clipboard (Chromium / Safari Secure Context)
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard && typeof ClipboardItem !== "undefined") {
        const blobHtml = new Blob([htmlContent], { type: "text/html" });
        const blobText = new Blob([textContent], { type: "text/plain" });
        
        const item = new ClipboardItem({
          "text/html": blobHtml,
          "text/plain": blobText,
        });
        
        await navigator.clipboard.write([item]);
        success = true;
      }
    } catch (err) {
      console.warn("Rich text AsyncClipboard API failed:", err);
    }

    // Attempt 2: Plain Text Async Clipboard (Firefox or general HTTP fallback)
    if (!success) {
      try {
        if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(textContent);
          success = true;
        }
      } catch (err) {
        console.warn("Plain text AsyncClipboard API failed:", err);
      }
    }

    // Attempt 3: Legacy execCommand Fallback (Insecure Contexts like 192.168 local network IPs)
    if (!success) {
      try {
        const textArea = document.createElement("textarea");
        textArea.value = textContent;
        // Keep hidden
        textArea.style.position = "absolute";
        textArea.style.left = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        success = document.execCommand("copy");
        document.body.removeChild(textArea);
      } catch (err) {
        console.error("ExecCommand fallback completely failed:", err);
      }
    }

    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } else {
      alert("Failed to copy to clipboard automatically. Your browser may be blocking access.");
    }
  };

  if (!originalResumeText || !jobDescription) return null;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-start p-4 lg:p-8">
        
        <div className="w-full max-w-4xl bg-surface p-6 rounded-2xl shadow-sm border border-primary/10 flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-primary/10 pb-4">
            <div>
              <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
                <Wand2 className="text-accent" /> AI Cover Letter Writer
              </h1>
              <p className="text-primary/70 text-sm mt-1">
                Generated using your globally saved Resume and Job Description.
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={generateCoverLetter}
                disabled={isGenerating}
                className="bg-accent/10 text-accent px-3 py-1.5 rounded-md font-medium text-sm hover:bg-accent/20 transition-colors disabled:opacity-50"
              >
                {isGenerating ? "Writing..." : (coverLetterHTML ? "Regenerate" : "Generate Now")}
              </button>
              
              {coverLetterHTML && (
                <>
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 bg-surface text-primary border border-primary/20 px-3 py-1.5 rounded-md font-medium text-sm hover:bg-primary/5 transition-colors shadow-sm"
                  >
                    {copied ? <Check size={14} className="text-[#04b304]" /> : <Copy size={14} />}
                    {copied ? "Copied!" : "Copy"}
                  </button>
                  <button
                    onClick={handlePrint}
                    className="flex items-center gap-1.5 bg-accent text-surface px-3 py-1.5 rounded-md font-medium text-sm hover:bg-accent/90 transition-colors shadow-sm"
                  >
                    <Download size={14} /> Export
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="min-h-[500px] flex flex-col">
            {isGenerating ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center">
                <Loader2 className="w-12 h-12 text-accent animate-spin" />
                <p className="text-primary/70">
                  Analyzing your Resume and formulating the perfect Domain match Cover Letter...
                </p>
              </div>
            ) : coverLetterHTML ? (
              <div className="flex-1 border border-primary/10 rounded-xl overflow-hidden shadow-sm">
                <ResumeEditor ref={editorRef} initialContent={coverLetterHTML} title="Cover Letter Editor" />
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-12 bg-primary/5 rounded-xl border-2 border-dashed border-primary/10">
                <Wand2 className="w-16 h-16 text-primary/30 mb-4" />
                <h3 className="text-xl font-bold text-primary mb-2">Ready to Impress?</h3>
                <p className="text-primary/70 max-w-md">
                  We have successfully located your Resume PDF content and Job Description in the global workspace memory. Click "Generate Now" to write your personalized Cover Letter.
                </p>
              </div>
            )}
          </div>
        </div>
        
      </main>
    </div>
  );
}
