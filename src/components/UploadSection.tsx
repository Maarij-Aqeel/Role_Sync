"use client";

import React, { useState, useRef } from "react";
import { UploadCloud, FileText } from "lucide-react";

interface UploadSectionProps {
  onAnalyze: (resumeFile: File | null, jdText: string) => void;
}

export const UploadSection: React.FC<UploadSectionProps> = ({ onAnalyze }) => {
  const [file, setFile] = useState<File | null>(null);
  const [jd, setJd] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 flex flex-col gap-8">
      <div className="text-center mb-4">
        <h1 className="text-4xl font-bold text-primary mb-4">
          Optimize Your Resume for the ATS
        </h1>
        <p className="text-primary/70 text-lg">
          Upload your resume and paste the job description to get AI-powered insights and keyword suggestions.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[400px]">
        {/* Upload Box */}
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className="border-2 border-dashed border-primary/20 bg-surface rounded-xl flex flex-col items-center justify-center p-8 cursor-pointer hover:border-accent hover:bg-accent/5 transition-all text-center"
        >
          <input
            type="file"
            accept=".pdf"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileChange}
          />
          <div className="bg-primary/5 p-4 rounded-full mb-4 text-primary">
            <UploadCloud size={48} />
          </div>
          <h3 className="font-bold text-xl text-primary mb-2">
            {file ? file.name : "Upload Resume (PDF)"}
          </h3>
          <p className="text-sm text-primary/60">
            {file ? "Click to replace" : "Drag and drop or click to browse"}
          </p>
        </div>

        {/* JD Box */}
        <div className="bg-surface border border-primary/10 rounded-xl flex flex-col overflow-hidden shadow-sm">
          <div className="bg-primary/5 p-4 border-b border-primary/10 flex items-center gap-2 font-semibold text-primary">
            <FileText size={20} />
            Job Description
          </div>
          <textarea
            value={jd}
            onChange={(e) => setJd(e.target.value)}
            placeholder="Paste the target job description here..."
            className="flex-1 w-full p-4 resize-none outline-none focus:ring-2 focus:ring-accent/50 text-sm text-primary"
          />
        </div>
      </div>

      <div className="flex justify-center mt-4">
        <button
          onClick={() => onAnalyze(file, jd)}
          disabled={!file || !jd}
          className="bg-accent text-surface px-8 py-4 rounded-xl font-bold text-lg hover:bg-accent/90 transition-colors shadow-lg shadow-accent/20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Analyze Resume Matching
        </button>
      </div>
    </div>
  );
};
