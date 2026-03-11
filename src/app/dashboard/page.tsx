// app/dashboard/page.tsx
"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  FileEdit, 
  PenTool, 
  ArrowRight, 
  BarChart3,
  Sparkles
} from "lucide-react";
import { useWorkspaceStore } from "@/store/useWorkspaceStore";
import { Navbar } from "@/components/Navbar";

const tools = [
  {
    id: "optimizer",
    name: "Resume Optimizer",
    description: "Enhance your resume with AI-powered keyword injection and ATS scoring. Split-screen editor with real-time suggestions.",
    icon: FileEdit,
    color: "accent",
    stats: "ATS Score & Keyword Analysis",
  },
  {
    id: "cover-letter",
    name: "Cover Letter Writer",
    description: "Generate a tailored cover letter based on your resume and the job description. Clean editing interface with one-click copy.",
    icon: PenTool,
    color: "primary",
    stats: "AI-Generated Personalization",
  },
];

export default function DashboardPage() {
  const router = useRouter();
  const { atsScore, domainScore, resumeFileName } = useWorkspaceStore();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 max-w-6xl mx-auto w-full p-6 lg:p-12">
        {/* Header */}
        <div className="mb-12">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-subtle text-accent text-sm font-medium mb-4"
          >
            <Sparkles className="w-4 h-4" />
            Analysis Complete
          </motion.div>
          <h1 className="text-4xl font-bold text-text-primary mb-2">
            Choose your tool
          </h1>
          <p className="text-text-secondary text-lg">
            Working with: <span className="font-medium text-text-primary">{resumeFileName}</span>
          </p>
          
          {/* Quick Stats */}
          <div className="flex gap-6 mt-6">
            <div className="flex items-center gap-3 px-4 py-2 bg-surface rounded-lg border border-border">
              <BarChart3 className="w-5 h-5 text-accent" />
              <div>
                <p className="text-xs text-text-muted uppercase tracking-wider">ATS Score</p>
                <p className="text-xl font-bold text-text-primary">{atsScore}/100</p>
              </div>
            </div>
            <div className="flex items-center gap-3 px-4 py-2 bg-surface rounded-lg border border-border">
              <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-green-500" />
              </div>
              <div>
                <p className="text-xs text-text-muted uppercase tracking-wider">Domain Match</p>
                <p className="text-xl font-bold text-text-primary">{domainScore}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tool Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {tools.map((tool, index) => (
            <motion.button
              key={tool.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => router.push(`/tools/${tool.id}`)}
              className="group relative text-left bg-surface rounded-2xl p-8 border border-border hover:border-accent/50 hover:shadow-xl hover:shadow-accent/5 transition-all duration-300"
            >
              <div className={`
                w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110
                ${tool.color === 'accent' ? 'bg-accent-subtle text-accent' : 'bg-primary/5 text-primary'}
              `}>
                <tool.icon className="w-7 h-7" />
              </div>
              
              <h3 className="text-2xl font-bold text-text-primary mb-2 group-hover:text-accent transition-colors">
                {tool.name}
              </h3>
              <p className="text-text-secondary mb-6 leading-relaxed">
                {tool.description}
              </p>
              
              <div className="flex items-center justify-between pt-6 border-t border-border">
                <span className="text-sm font-medium text-text-muted">
                  {tool.stats}
                </span>
                <div className="flex items-center gap-2 text-accent font-medium group-hover:gap-3 transition-all">
                  Open Tool <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </main>
    </div>
  );
}