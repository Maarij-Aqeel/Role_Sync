"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  UploadCloud, 
  FileText, 
  CheckCircle2, 
  X, 
  Sparkles,
  Briefcase
} from "lucide-react";
import { toast } from "sonner";

interface UploadSectionProps {
  onAnalyze: (resumeFile: File | null, jdText: string) => void;
  isCoverLetter?: boolean;
}

export const UploadSection: React.FC<UploadSectionProps> = ({ 
  onAnalyze, 
  isCoverLetter = false 
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [jd, setJd] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- Handlers ---
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === "application/pdf") {
        setFile(droppedFile);
      } else {
        toast.error("Please upload a PDF file.");
      }
    }
  };

  const clearFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // --- Utility ---
  const wordCount = jd.trim().split(/\s+/).filter(word => word.length > 0).length;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-5xl mx-auto p-6 flex flex-col gap-10"
    >
      {/* Header Section */}
      <div className="text-center max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-semibold mb-6"
        >
          <Sparkles size={16} />
          {isCoverLetter ? "Cover Letter Generator" : "ATS Optimization Engine"}
        </motion.div>
        
        <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-4 tracking-tight">
          {isCoverLetter ? "Craft Your Perfect Cover Letter" : "Align Your Experience"}
        </h1>
        <p className="text-text-muted text-lg leading-relaxed">
          {isCoverLetter 
            ? "Upload your resume and paste the job description to generate a highly personalized, AI-driven cover letter."
            : "Upload your resume and the target job description. We'll simulate the ATS and inject the missing keywords."}
        </p>
      </div>

      {/* Main Input Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-auto md:h-[450px]">
        
        {/* Upload Box */}
        <motion.div
          whileHover={{ scale: file ? 1 : 1.01 }}
          onClick={() => !file && fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative bg-surface rounded-3xl flex flex-col items-center justify-center p-8 transition-all duration-300 border-2 overflow-hidden shadow-sm
            ${file ? 'border-border/50 cursor-default' : 'cursor-pointer'}
            ${isDragging ? 'border-accent bg-accent/5 scale-[1.02]' : 'border-dashed border-border hover:border-accent/50'}
          `}
        >
          <input
            type="file"
            accept=".pdf"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileChange}
          />

          <AnimatePresence mode="wait">
            {!file ? (
              <motion.div 
                key="upload-prompt"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex flex-col items-center text-center pointer-events-none"
              >
                <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-6 transition-colors duration-300 ${isDragging ? 'bg-accent text-white shadow-lg shadow-accent/30' : 'bg-secondary text-text-muted'}`}>
                  <UploadCloud size={36} strokeWidth={1.5} />
                </div>
                <h3 className="font-bold text-xl text-text-primary mb-2">
                  Upload Resume
                </h3>
                <p className="text-sm text-text-muted max-w-[200px]">
                  Drag and drop your PDF here, or click to browse files.
                </p>
              </motion.div>
            ) : (
              <motion.div 
                key="file-success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center text-center w-full"
              >
                <div className="w-20 h-20 rounded-2xl bg-green-500/10 text-green-500 flex items-center justify-center mb-6 border border-green-500/20">
                  <CheckCircle2 size={40} strokeWidth={1.5} />
                </div>
                <h3 className="font-bold text-xl text-text-primary mb-2 truncate w-full px-4">
                  {file.name}
                </h3>
                <p className="text-sm text-text-muted mb-8">
                  {(file.size / 1024 / 1024).toFixed(2)} MB • PDF Document
                </p>
                
                <div className="flex gap-3">
                  <button 
                    onClick={clearFile}
                    className="px-4 py-2 rounded-xl text-sm font-medium text-text-muted bg-secondary hover:bg-red-500/10 hover:text-red-500 transition-colors flex items-center gap-2"
                  >
                    <X size={16} /> Remove
                  </button>
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 rounded-xl text-sm font-medium text-text-primary bg-surface-elevated border border-border hover:border-accent/50 transition-colors"
                  >
                    Replace
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* JD Box */}
        <div className="bg-surface border border-border rounded-3xl flex flex-col overflow-hidden shadow-sm group focus-within:border-accent/50 focus-within:ring-4 focus-within:ring-accent/10 transition-all duration-300">
          <div className="bg-secondary/50 p-5 border-b border-border flex justify-between items-center">
            <div className="flex items-center gap-3 font-semibold text-text-primary">
              <div className="w-8 h-8 rounded-lg bg-surface border border-border flex items-center justify-center text-text-muted">
                <Briefcase size={16} />
              </div>
              Job Description
            </div>
            {/* Word Counter */}
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${wordCount > 50 ? 'bg-green-500/10 text-green-600' : 'bg-surface border border-border text-text-muted'}`}>
              {wordCount} words
            </span>
          </div>
          
          <textarea
            value={jd}
            onChange={(e) => setJd(e.target.value)}
            placeholder="Paste the full text of the job description here. Include responsibilities, requirements, and required skills..."
            className="flex-1 w-full p-6 resize-none bg-transparent outline-none text-text-primary placeholder:text-text-muted/60 leading-relaxed"
          />
        </div>
      </div>

      {/* Action Area */}
      <div className="flex flex-col items-center mt-4">
        <motion.button
          whileHover={file && jd ? { scale: 1.02 } : {}}
          whileTap={file && jd ? { scale: 0.98 } : {}}
          onClick={() => onAnalyze(file, jd)}
          disabled={!file || !jd}
          className="relative px-10 py-5 bg-accent text-white rounded-full font-bold text-lg shadow-[0_0_40px_-10px_rgba(234,84,85,0.6)] disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none transition-all duration-300 overflow-hidden group"
        >
          {/* Shine effect on hover */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
          
          <span className="relative flex items-center gap-2">
            {isCoverLetter ? "Generate Cover Letter" : "Run ATS Analysis"}
            <Sparkles size={18} className={file && jd ? "animate-pulse" : ""} />
          </span>
        </motion.button>
        
        {!file || !jd ? (
          <p className="mt-4 text-sm text-text-muted flex items-center gap-1.5 animate-pulse">
             Waiting for <span className="font-semibold">{!file ? "Resume" : ""}</span> {!file && !jd ? "and" : ""} <span className="font-semibold">{!jd ? "Job Description" : ""}</span>
          </p>
        ) : (
          <p className="mt-4 text-sm text-green-500 font-medium">
            Ready to process
          </p>
        )}
      </div>
    </motion.div>
  );
};