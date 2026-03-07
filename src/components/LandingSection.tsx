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
        className="absolute inset-0 z-0 opacity-5"
        style={{
          backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />
      
      {/* Massive Centered Blurred Radial Gradient */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-[#EA5455] to-[#a855f7] rounded-full blur-[120px] opacity-15 z-0" />

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
          className="mt-20 w-full max-w-4xl aspect-video rounded-2xl bg-slate-800/50 backdrop-blur-md border border-white/10 overflow-hidden relative shadow-2xl"
          animate={{ y: [0, -15, 0] }}
          transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
        >
          {/* Internal Dashboard Mock Styling */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent">
             <div className="h-10 border-b border-white/10 flex items-center px-4 gap-2 bg-slate-900/50">
                <div className="w-3 h-3 rounded-full bg-red-400/50" />
                <div className="w-3 h-3 rounded-full bg-amber-400/50" />
                <div className="w-3 h-3 rounded-full bg-green-400/50" />
             </div>
             <div className="p-8 flex items-center justify-center h-[calc(100%-2.5rem)] text-slate-500 font-medium">
                [ Interactive Dashboard Preview Elements ]
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
          <motion.h2 variants={itemVariants} className="text-3xl font-bold text-primary mb-4">Why use RoleSync AI?</motion.h2>
          <motion.div variants={itemVariants} className="h-1 w-20 bg-accent mx-auto rounded-full"></motion.div>
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
        className="mt-32 w-full max-w-4xl bg-primary text-surface rounded-[2.5rem] p-12 text-center relative overflow-hidden shadow-2xl"
      >
        {/* Abstract background shapes */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3"></div>

        <div className="relative z-10">
          <motion.h3 variants={itemVariants} className="text-3xl md:text-4xl font-bold mb-6">Stop guessing what the ATS wants.</motion.h3>
          <motion.p variants={itemVariants} className="text-primary-100 text-surface/80 max-w-xl mx-auto mb-10">
            Join thousands of candidates breaking through the automated screening filters using purely algorithmic semantic matching.
          </motion.p>
          <motion.button
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onStart}
            className="bg-surface text-primary px-8 py-4 rounded-xl font-bold hover:bg-surface/90 transition-colors shadow-lg"
          >
            Optimize My Resume Now
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
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="bg-surface border border-primary/5 rounded-3xl p-8 flex flex-col gap-4 shadow-sm hover:shadow-xl hover:border-accent/20 transition-all group"
    >
      <div className="w-16 h-16 rounded-2xl bg-accent/5 flex items-center justify-center group-hover:bg-accent/10 transition-colors">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-primary mt-2">{title}</h3>
      <p className="text-primary/60 text-sm leading-relaxed">{description}</p>
    </motion.div>
  );
};
