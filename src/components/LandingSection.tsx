"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import { Sparkles, Target, Zap, ShieldCheck, ArrowRight } from "lucide-react";

interface LandingSectionProps {
  onStart: () => void;
}

export const LandingSection: React.FC<LandingSectionProps> = ({ onStart }) => {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } },
  };

  return (
    <div className="w-full relative flex flex-col items-center justify-start pt-24 pb-32 px-4 overflow-hidden bg-[#0a0f1c]">
      {/* Background Grid Pattern (Opacity 5%) */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
          maskImage: 'radial-gradient(circle at center, black 10%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(circle at center, black 10%, transparent 80%)'
        }}
      />
      
      {/* Massive Centered Blurred Radial Gradient */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-rose-500/10 rounded-full blur-3xl -z-10" />

      {/* Hero Section */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-5xl text-center flex flex-col items-center z-10 relative mb-24"
      >
        {/* Top Badge ("The Next Generation ATS Optimizer") */}
        <motion.div 
          variants={itemVariants} 
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white text-sm font-medium mb-8 backdrop-blur-md shadow-lg"
        >
          <Sparkles size={16} className="text-[#EA5455] drop-shadow-[0_0_8px_rgba(234,84,85,0.8)]" />
          <span>The Next Generation ATS Optimizer</span>
        </motion.div>
        
        {/* Main Heading */}
        <motion.h1 
          variants={itemVariants} 
          className="text-5xl md:text-7xl lg:text-8xl font-extrabold mb-6 leading-[1.1] tracking-tight text-white"
        >
          Your Resume,<br className="hidden md:block"/>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#EA5455] to-[#ff8a8a]">
             Perfectly Aligned
          </span>
        </motion.h1>
        
        {/* Subheadline */}
        <motion.p 
          variants={itemVariants} 
          className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl leading-relaxed mx-auto font-medium"
        >
          Don't let the algorithm reject you. RoleSync AI simulates enterprise ATS systems to score your resume against job descriptions, injecting critical domain keywords so you never miss an interview.
        </motion.p>
        
        {/* CTA Button */}
        <motion.button
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onStart}
          className="group relative inline-flex items-center justify-center gap-3 bg-[#EA5455] text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-[0_0_30px_rgba(234,84,85,0.4)] hover:shadow-[0_0_40px_rgba(234,84,85,0.6)] border-t border-white/20"
        >
          Let's get started
          <ArrowRight className="group-hover:translate-x-1 transition-transform" />
        </motion.button>
        
        {/* Floating Dashboard Preview Anchor */}
        <motion.div 
          variants={{
             hidden: { opacity: 0, y: 50 },
             visible: { 
               opacity: 1, 
               y: 0, 
               transition: { duration: 0.8, ease: "easeOut" } 
             }
          }}
          className="mt-20 w-full max-w-4xl aspect-video rounded-2xl bg-slate-800/50 backdrop-blur-md border border-white/10 overflow-hidden relative shadow-2xl shadow-rose-500/15"
          animate={{ y: [0, -15, 0] }}
          transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
        >
          {/* Internal Dashboard Mock Styling */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/50 to-slate-800/20 flex flex-col">
             <div className="h-10 border-b border-white/10 flex items-center px-4 gap-2 bg-slate-900/80 shrink-0 backdrop-blur-xl">
                <div className="w-3 h-3 rounded-full bg-red-500/80 shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80 shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                <div className="ml-4 text-xs font-medium text-slate-500 font-mono hidden sm:block">rolesync-ai.sh</div>
             </div>
             
             {/* 2-Column Dashboard Layout */}
             <div className="flex-1 flex p-4 sm:p-6 gap-6 overflow-hidden relative">
               
               {/* Dashboard Overlay Vignette to focus center */}
               <div className="absolute inset-0 border-[40px] border-slate-900/20 blur-xl pointer-events-none z-10" />

               {/* Left: Original PDF Mock UI */}
               <div className="flex-1 bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-200 p-6 flex flex-col gap-4 overflow-hidden relative opacity-90 grayscale-[0.2]">
                 <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-white via-white to-transparent z-10" />
                 
                 <div className="w-1/3 h-5 bg-slate-200 rounded-md mb-2" />
                 <div className="w-2/3 h-3 bg-slate-100 rounded" />
                 <div className="w-1/2 h-3 bg-slate-100 rounded" />
                 
                 <div className="w-full h-[1px] bg-slate-100 my-2" />
                 
                 <div className="w-1/4 h-4 bg-slate-200 rounded mb-1" />
                 <div className="w-full h-2.5 bg-slate-100 rounded" />
                 <div className="w-[90%] h-2.5 bg-slate-100 rounded" />
                 <div className="w-[85%] h-2.5 bg-slate-100 rounded" />
                 
                 <div className="w-1/4 h-4 bg-slate-200 rounded mt-4 mb-1" />
                 <div className="w-full h-2.5 bg-slate-100 rounded" />
                 <div className="w-[95%] h-2.5 bg-slate-100 rounded" />
                 <div className="w-[70%] h-2.5 bg-slate-100 rounded" />
               </div>

               {/* Right: TipTap Editor / Optimized Output UI */}
               <div className="flex-[1.2] bg-[#0f172a] rounded-xl border border-rose-500/20 p-6 shadow-[0_0_40px_rgba(244,63,94,0.05)] flex flex-col gap-4 overflow-hidden text-slate-300 font-mono text-[13px] leading-relaxed relative">
                 {/* Glowing Editor background blob */}
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] bg-rose-500/10 blur-[80px] rounded-full z-0 pointer-events-none" />
                 
                 <div className="relative z-10">
                   <div className="text-rose-400 font-bold mb-3 tracking-widest text-xs opacity-80 uppercase flex items-center gap-2">
                     <Target size={12} /> Optimization Engine
                   </div>
                   
                   <p className="mb-4 text-slate-400">
                     <span className="text-slate-500">const</span> <span className="text-[#a855f7]">ResumeEditor</span> = <span className="text-slate-500">() {"=>"}</span> {"{"}
                   </p>
                   
                   <div className="pl-4 border-l-2 border-slate-800 space-y-3">
                     <p>
                       Spearheaded the migration of legacy monolith into 
                       <mark className="bg-rose-500/20 text-rose-300 px-1.5 py-0.5 mx-1 rounded border border-rose-500/30 animate-pulse font-semibold">robust microservices</mark>
                       infrastructure, decreasing deployment times by 40%.
                     </p>
                     
                     <p>
                       Engineered scalable backend pipelines leveraging 
                       <mark className="bg-rose-500/20 text-rose-300 px-1.5 py-0.5 mx-1 rounded border border-rose-500/30 animate-pulse font-semibold" style={{ animationDelay: '0.5s' }}>Node.js and GraphQL</mark>
                       handling 50k+ active operations/sec.
                     </p>
                     
                     <div className="space-y-2 mt-6 opacity-30">
                       <div className="w-full h-2 bg-slate-700 rounded" />
                       <div className="w-[85%] h-2 bg-slate-700 rounded" />
                       <div className="w-[90%] h-2 bg-slate-700 rounded" />
                     </div>
                   </div>
                 </div>
               </div>
             </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Feature Cards Section */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
        className="w-full max-w-6xl"
      >
        <div className="text-center mb-16">
          <motion.h2 variants={itemVariants} className="text-3xl font-bold text-white mb-4 tracking-tight">Why use RoleSync AI?</motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <FeatureCard
            icon={<Target size={32} className="text-accent" />}
            title="Surgical Keyword Injection"
            description="Our AI doesn't just stuff keywords. It intelligently rewrites sentences to naturally weave hard skills and conceptual gaps into your experience."
          />
          <FeatureCard
            icon={<Zap size={32} className="text-accent" />}
            title="Dual-Axis Scoring"
            description="Track two independent scores. One for raw ATS density, and another measuring deep domain relevance required by human hiring managers."
          />
          <FeatureCard
            icon={<Sparkles size={32} className="text-accent" />}
            title="LaTeX PDF Mastering"
            description="Click download, and our Multimodal visual AI accurately clones your original PDF's spatial layout, cleanly exporting the injected code via LaTeX."
          />
          <FeatureCard
            icon={<ShieldCheck size={32} className="text-accent" />}
            title="Absolute Privacy First"
            description="All textual extraction happens entirely within your browser. You own your data, and nothing is persistently logged or stored on our servers."
          />
        </div>
      </motion.div>

      {/* Trust / Call to Action Bottom */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
        className="mt-32 w-full max-w-4xl bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-[2.5rem] p-12 text-center relative overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)]"
      >
        {/* Soft radial gradient glow from center */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(244,63,94,0.12),transparent_60%)] pointer-events-none" />

        <div className="relative z-10">
          <motion.h3 variants={itemVariants} className="text-3xl md:text-5xl font-extrabold mb-6 text-white tracking-tight">
            Stop guessing what the <span className="text-[#EA5455]">ATS</span> wants.
          </motion.h3>
          <motion.p variants={itemVariants} className="text-lg text-slate-300 max-w-xl mx-auto mb-10 leading-relaxed">
            Join thousands of candidates breaking through the automated screening filters using purely algorithmic semantic matching.
          </motion.p>
          <motion.button
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onStart}
            className="group relative inline-flex items-center justify-center gap-3 bg-[#EA5455] text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-[0_0_30px_rgba(234,84,85,0.4)] hover:shadow-[0_0_40px_rgba(234,84,85,0.6)] border-t border-white/20"
          >
            Optimize My Resume Now
            <ArrowRight className="group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } },
      }}
      className="bg-white/[0.03] backdrop-blur-sm border border-rose-500/10 rounded-2xl p-8 flex flex-col gap-4 hover:bg-white/[0.05] hover:border-rose-500/40 hover:-translate-y-1 transition-all duration-300 group shadow-lg"
    >
      <div className="w-12 h-12 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center p-2 shadow-[0_0_15px_rgba(244,63,94,0.15)] group-hover:shadow-[0_0_20px_rgba(244,63,94,0.25)] transition-shadow">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-white mt-1">{title}</h3>
      <p className="text-slate-400 text-[15px] leading-loose font-medium">{description}</p>
    </motion.div>
  );
};
