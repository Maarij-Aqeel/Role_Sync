"use client";

import React from "react";
import { Navbar } from "@/components/Navbar";
import { motion, useScroll, useTransform } from "framer-motion";
import { UploadCloud, Cpu, PenTool, DownloadCloud, ArrowRight } from "lucide-react";
import Link from "next/link";

const steps = [
  {
    id: 1,
    title: "Upload Context",
    description: "Provide your current PDF resume alongside the target Job Description. No accounts required—everything happens instantly.",
    icon: UploadCloud,
    color: "from-blue-500 to-cyan-400"
  },
  {
    id: 2,
    title: "AI Extraction",
    description: "Our dual-metrics engine parses your resume, mapping your existing skills against the job requirements to generate baseline ATS and Domain Fit scores.",
    icon: Cpu,
    color: "from-purple-500 to-indigo-400"
  },
  {
    id: 3,
    title: "Surgical Optimization",
    description: "The AI identifies crucial missing keywords and injects them seamlessly. It writes context-aware, metric-driven achievements perfectly suited for the job.",
    icon: PenTool,
    color: "from-[#EA5455] to-orange-400"
  },
  {
    id: 4,
    title: "Export & Apply",
    description: "Export an immaculate LaTeX-compiled PDF, or one-click copy the rich-text format directly into Gmail or Google Docs with all formatting preserved.",
    icon: DownloadCloud,
    color: "from-emerald-500 to-teal-400"
  }
];

export default function HowItWorksPage() {
  const { scrollYProgress } = useScroll();
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div className="min-h-screen bg-background flex flex-col selection:bg-accent/20">
      <Navbar />

      {/* Progress Bar */}
      <motion.div
        style={{ scaleX }}
        className="fixed top-16 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-[#EA5455] to-emerald-500 origin-left z-50"
      />

      <main className="flex-1 flex flex-col items-center overflow-hidden">
        {/* Hero Section */}
        <section className="w-full relative py-24 lg:py-32 flex flex-col items-center justify-center text-center px-6">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[100px] pointer-events-none -z-10" />
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-4xl"
          >
            <h1 className="text-5xl md:text-7xl font-extrabold text-primary mb-6 tracking-tight">
              How{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#EA5455] to-orange-400">
                RoleSync AI
              </span>{" "}
              Works
            </h1>
            <p className="text-xl md:text-2xl text-primary/70 leading-relaxed max-w-2xl mx-auto font-medium mb-12">
              A transparent, privacy-first algorithm that bridges the gap between your true experience and what applicant tracking systems demand.
            </p>
          </motion.div>
        </section>

        {/* Steps Timeline */}
        <section className="w-full max-w-5xl mx-auto px-6 pb-32 relative">
          {/* Vertical Connecting Line (Desktop) */}
          <div className="hidden md:block absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-border to-transparent z-0" />

          <div className="space-y-24 relative z-10">
            {steps.map((step, index) => {
              const isEven = index % 2 === 0;

              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.7, type: "spring", bounce: 0.4 }}
                  className={`flex flex-col md:flex-row items-center gap-8 lg:gap-16 ${
                    isEven ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  {/* Content Container */}
                  <div className={`flex-1 flex flex-col ${isEven ? "md:items-end md:text-right" : "md:items-start md:text-left"} text-center items-center`}>
                    <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-surface-elevated border border-border text-sm font-bold text-text-muted mb-4 shadow-sm">
                      Step 0{step.id}
                    </div>
                    <h3 className="text-3xl font-bold text-primary mb-4">{step.title}</h3>
                    <p className="text-lg text-primary/70 leading-relaxed max-w-md">
                      {step.description}
                    </p>
                  </div>

                  {/* Icon Node */}
                  <div className="relative shrink-0 w-24 h-24 rounded-3xl bg-surface border border-border shadow-xl flex items-center justify-center p-6 group">
                    <div className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-10 rounded-3xl group-hover:opacity-20 transition-opacity duration-300`} />
                    <step.icon className={`w-12 h-12 text-transparent bg-clip-text bg-gradient-to-br ${step.color}`} style={{ color: "currentColor" }} />
                    
                    {/* Glowing dot for timeline connection */}
                    <div className={`hidden md:block absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-surface border-4 border-background ${isEven ? "-left-14 lg:-left-22" : "-right-14 lg:-right-22"} shadow-[0_0_15px_rgba(0,0,0,0.2)] z-20`} />
                  </div>

                  {/* Empty Spacer for Layout Balance */}
                  <div className="hidden md:block flex-1" />
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full relative py-32 bg-surface text-center border-t border-border">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(234,84,85,0.05),transparent_70%)] pointer-events-none" />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative z-10 max-w-2xl mx-auto px-6"
          >
            <h2 className="text-4xl md:text-5xl font-extrabold text-primary mb-6">
              Ready to beat the ATS?
            </h2>
            <p className="text-lg text-primary/70 mb-10">
              Stop guessing what formatting or magical keywords the algorithm wants. Let AI align your resume against the exact requirements.
            </p>
            <Link 
              href="/setup" 
              className="group relative inline-flex items-center justify-center gap-3 bg-[#EA5455] text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-[0_0_30px_rgba(234,84,85,0.4)] hover:shadow-[0_0_40px_rgba(234,84,85,0.6)] hover:-translate-y-1"
            >
              Start Optimizing
              <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </section>

      </main>
    </div>
  );
}
