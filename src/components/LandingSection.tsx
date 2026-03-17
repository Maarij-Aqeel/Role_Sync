"use client";

import React, { useRef, useEffect, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  Variants,
  useSpring,
  useInView,
} from "framer-motion";
import {
  Sparkles,
  Target,
  Zap,
  ShieldCheck,
  ArrowRight,
  ChevronDown,
  FileText,
  BarChart3,
  Lock,
  Cpu,
  CheckCircle2,
  Play,
} from "lucide-react";

interface LandingSectionProps {
  onStart: () => void;
}

// --- Custom Hooks & Utilities ---

const useCountUp = (end: number, duration: number = 2) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      let startTime: number;
      const animate = (currentTime: number) => {
        if (!startTime) startTime = currentTime;
        const progress = Math.min(
          (currentTime - startTime) / (duration * 1000),
          1,
        );
        setCount(Math.floor(progress * end));
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      requestAnimationFrame(animate);
    }
  }, [isInView, end, duration]);

  return { count, ref };
};

// --- Components ---

const FeatureCard = ({
  icon,
  title,
  description,
  className = "",
  delay = 0,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  className?: string;
  delay?: number;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className={`group relative bg-surface shadow-lg border border-border rounded-3xl p-8 overflow-hidden hover:border-[#EA5455]/30 transition-all duration-500 ${className}`}
    >
      {/* Gradient Hover Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#EA5455]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative z-10">
        <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center mb-6 text-[#EA5455] group-hover:scale-110 group-hover:bg-[#EA5455] group-hover:text-white transition-all duration-300 shadow-lg">
          {icon}
        </div>
        <h3 className="text-xl font-bold text-foreground mb-3 tracking-tight">
          {title}
        </h3>
        <p className="text-muted-foreground text-sm leading-relaxed group-hover:text-foreground/80 transition-colors">
          {description}
        </p>
      </div>
    </motion.div>
  );
};

const StatItem = ({
  value,
  label,
  suffix = "",
}: {
  value: number;
  label: string;
  suffix?: string;
}) => {
  const { count, ref } = useCountUp(value);
  return (
    <div ref={ref} className="text-center">
      <div className="text-4xl md:text-5xl font-bold text-foreground mb-2 tabular-nums tracking-tight">
        {count}
        {suffix}
      </div>
      <div className="text-sm text-muted-foreground uppercase tracking-widest font-medium">
        {label}
      </div>
    </div>
  );
};

export const LandingSection: React.FC<LandingSectionProps> = ({ onStart }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll Progress for Hero Parallax
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9]);

  // Smooth spring for mouse movement
  const mouseX = useSpring(0, { stiffness: 500, damping: 100 });
  const mouseY = useSpring(0, { stiffness: 500, damping: 100 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    mouseX.set((clientX - innerWidth / 2) / 50);
    mouseY.set((clientY - innerHeight / 2) / 50);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="w-full bg-background text-foreground overflow-x-hidden selection:bg-[#EA5455] selection:text-white"
    >
      {/* --- HERO SECTION --- */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-20 pb-32 px-4 overflow-hidden">
        {/* Dynamic Background Elements - Using primary color with low opacity */}
        <motion.div
          style={{ x: mouseX, y: mouseY }}
          className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#EA5455]/10 rounded-full blur-[120px] pointer-events-none mix-blend-multiply dark:mix-blend-screen"
        />
        <motion.div
          style={{
            x: useTransform(mouseX, (v) => v * -1),
            y: useTransform(mouseY, (v) => v * -1),
          }}
          className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none mix-blend-multiply dark:mix-blend-screen"
        />

        <motion.div
          style={{ opacity, scale, y }}
          className="relative z-10 max-w-6xl mx-auto text-center flex flex-col items-center"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border bg-secondary/50 backdrop-blur-md mb-8"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#EA5455] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#EA5455]"></span>
            </span>
            <span className="text-sm font-medium text-muted-foreground">
              v2.0 Now Live: Multimodal AI Engine
            </span>
          </motion.div>

          {/* Main Headline */}
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter mb-8 leading-[0.9] text-foreground">
            <div className="overflow-hidden">
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              >
                Your Resume,
              </motion.div>
            </div>
            <div className="overflow-hidden">
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                transition={{
                  duration: 1,
                  delay: 0.1,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="bg-clip-text text-transparent bg-gradient-to-r from-[#EA5455] via-[#ff8a8a] to-[#EA5455] animate-gradient-x"
              >
                Perfectly Aligned.
              </motion.div>
            </div>
          </h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            Don't let the algorithm reject you. RoleSync AI simulates enterprise
            ATS systems to score your resume against job descriptions, injecting
            critical domain keywords so you never miss an interview.
          </motion.p>

          {/* CTA Group */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center gap-4"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onStart}
              className="group relative px-8 py-4 bg-[#EA5455] text-white rounded-full font-semibold text-lg shadow-[0_0_40px_-10px_rgba(234,84,85,0.6)] overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              <span className="relative flex items-center gap-2">
                Start Optimizing{" "}
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-secondary border border-border text-foreground rounded-full font-semibold text-lg hover:bg-secondary/80 transition-colors flex items-center gap-2"
            >
              <Play size={18} className="fill-current" /> Watch Demo
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground"
        >
          <span className="text-xs uppercase tracking-widest">
            Scroll to explore
          </span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <ChevronDown size={20} />
          </motion.div>
        </motion.div>
      </section>

      {/* --- VISUAL SHOWCASE (Marquee & Cards) --- */}
      <section className="py-24 relative overflow-hidden bg-secondary/30">
        {/* Infinite Marquee Text */}
        <div className="relative mb-20 overflow-hidden py-10 opacity-10">
          <motion.div
            animate={{ x: [0, -1000] }}
            transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
            className="flex gap-10 whitespace-nowrap text-8xl font-bold text-foreground"
          >
            <span>ATS OPTIMIZATION</span>
            <span>•</span>
            <span>KEYWORD INJECTION</span>
            <span>•</span>
            <span>PDF MASTERING</span>
            <span>•</span>
            <span>ATS OPTIMIZATION</span>
            <span>•</span>
            <span>KEYWORD INJECTION</span>
            <span>•</span>
            <span>PDF MASTERING</span>
            <span>•</span>
          </motion.div>
        </div>

        {/* Bento Grid Features */}
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(300px,auto)]">
            {/* Large Feature Card */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="md:col-span-2 row-span-2 bg-surface shadow-lg border border-border rounded-3xl p-8 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 p-32 bg-[#EA5455]/20 blur-[100px] rounded-full group-hover:bg-[#EA5455]/30 transition-all duration-700" />

              <div className="relative z-10 h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-[#EA5455] mb-4">
                    <Target size={24} />
                    <span className="font-bold tracking-wider text-sm">
                      SURGICAL PRECISION
                    </span>
                  </div>
                  <h3 className="text-3xl md:text-4xl font-bold mb-4 max-w-lg text-foreground">
                    Intelligent Keyword Injection
                  </h3>
                  <p className="text-muted-foreground max-w-md">
                    Our AI doesn't just stuff keywords. It intelligently
                    rewrites sentences to naturally weave hard skills and
                    conceptual gaps into your experience.
                  </p>
                </div>

                {/* Mock UI Element inside Card */}
                <div className="mt-8 bg-black/80 dark:bg-black/40 border border-white/10 rounded-xl p-6 backdrop-blur-sm">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-3 h-3 rounded-full bg-red-500/50" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                    <div className="w-3 h-3 rounded-full bg-green-500/50" />
                  </div>
                  <div className="space-y-3 font-mono text-sm">
                    <div className="flex gap-2">
                      <span className="text-purple-400">const</span>
                      <span className="text-blue-400">skills</span>
                      <span className="text-white">=</span>
                      <span className="text-white">[</span>
                    </div>
                    <div className="pl-4 text-green-400/80">
                      "React", "TypeScript",{" "}
                      <span className="text-[#EA5455] bg-[#EA5455]/10 px-1 rounded">
                        "GraphQL"
                      </span>
                      , "Node.js"
                    </div>
                    <div className="text-white">];</div>
                  </div>
                </div>
              </div>
            </motion.div>

            <FeatureCard
              icon={<Zap size={24} />}
              title="Dual-Axis Scoring"
              description="Track two independent scores. One for raw ATS density, and another measuring deep domain relevance required by human hiring managers."
              delay={0.2}
            />

            <FeatureCard
              icon={<FileText size={24} />}
              title="LaTeX PDF Mastering"
              description="Click download, and our Multimodal visual AI accurately clones your original PDF's spatial layout, cleanly exporting the injected code via LaTeX."
              delay={0.3}
            />

            <FeatureCard
              icon={<ShieldCheck size={24} />}
              title="Absolute Privacy"
              description="All textual extraction happens entirely within your browser. You own your data, and nothing is persistently logged."
              className="md:col-span-1"
              delay={0.4}
            />

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="md:col-span-2 bg-[#EA5455] rounded-3xl p-8 relative overflow-hidden flex items-center justify-between group"
            >
              <div className="relative z-10">
                <h3 className="text-3xl font-bold text-white mb-2">
                  Ready to break through?
                </h3>
                <p className="text-white/80">
                  Join 10,000+ engineers who optimized their resumes this week.
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.1, rotate: -5 }}
                whileTap={{ scale: 0.9 }}
                onClick={onStart}
                className="w-16 h-16 bg-white text-[#EA5455] rounded-full flex items-center justify-center shadow-xl"
              >
                <ArrowRight size={24} />
              </motion.button>

              {/* Decorative circles */}
              <div className="absolute -right-10 -bottom-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- STATS & SOCIAL PROOF --- */}
      <section className="py-32 border-y border-border bg-background">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight text-foreground">
                Trusted by job seekers at{" "}
                <span className="text-[#EA5455]">top companies</span>
              </h2>
              <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                We analyze thousands of job descriptions daily to keep our
                matching algorithms ahead of the curve. Our users report a 3x
                increase in interview callbacks.
              </p>

              <div className="flex flex-col gap-4">
                {[
                  "Resume parsing accuracy: 99.8%",
                  "Average optimization time: < 2 mins",
                  "Data privacy: 100% Client-side",
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-3 text-foreground"
                  >
                    <CheckCircle2 size={20} className="text-[#EA5455]" />
                    <span>{item}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8">
              <StatItem value={98} suffix="%" label="Success Rate" />
              <StatItem value={50000} suffix="+" label="Resumes Optimized" />
              <StatItem value={3} suffix="x" label="More Interviews" />
              <StatItem value={15} suffix="s" label="Avg Processing" />
            </div>
          </div>
        </div>
      </section>

      {/* --- HOW IT WORKS --- */}
      <section className="py-32 relative bg-secondary/30">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-20">
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-[#EA5455] font-bold tracking-widest text-sm uppercase mb-4 block"
            >
              The Process
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-bold text-foreground"
            >
              Three steps to your dream job
            </motion.h2>
          </div>

          <div className="space-y-24">
            {[
              {
                step: "01",
                title: "Upload & Parse",
                desc: "Drop your PDF. Our engine instantly extracts text and visual structure without sending data to servers.",
                align: "left",
              },
              {
                step: "02",
                title: "AI Analysis",
                desc: "We compare your resume against the job description using semantic similarity models, not just keyword matching.",
                align: "right",
              },
              {
                step: "03",
                title: "Optimize & Export",
                desc: "Receive suggested rewrites. Accept changes and download a perfectly formatted PDF or LaTeX source.",
                align: "left",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                className={`flex flex-col ${item.align === "right" ? "md:flex-row-reverse" : "md:flex-row"} items-center gap-12`}
              >
                <div className="flex-1 relative">
                  <div className="text-8xl md:text-[10rem] font-bold text-text-primary opacity-5 select-none absolute -top-10 -left-6 z-0 pointer-events-none">
                    {item.step}
                  </div>
                  <h3 className="text-3xl font-bold mb-4 relative z-10 text-text-primary">
                    {item.title}
                  </h3>
                  <p className="text-text-muted text-lg leading-relaxed relative z-10">
                    {item.desc}
                  </p>
                </div>
                <div className="flex-1 w-full">
                  <div className="aspect-video bg-surface shadow-md border border-border rounded-2xl flex items-center justify-center group hover:border-[#EA5455]/50 transition-colors duration-500">
                    <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                      {index === 0 && (
                        <FileText className="text-muted-foreground" />
                      )}
                      {index === 1 && <Cpu className="text-muted-foreground" />}
                      {index === 2 && (
                        <CheckCircle2 className="text-muted-foreground" />
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- FINAL CTA --- */}
      <section className="py-32 px-4 bg-background">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto bg-surface shadow-2xl border border-border rounded-[2.5rem] p-12 md:p-20 text-center relative overflow-hidden"
        >
          {/* Animated Background Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[#EA5455]/10 blur-[100px] pointer-events-none" />

          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-bold mb-8 tracking-tight text-foreground">
              Stop guessing what the <span className="text-[#EA5455]">ATS</span>{" "}
              wants.
            </h2>
            <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
              Join thousands of candidates breaking through the automated
              screening filters using purely algorithmic semantic matching.
            </p>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onStart}
              className="px-10 py-5 bg-[#EA5455] text-white rounded-full font-bold text-xl hover:bg-[#d63e3f] transition-colors shadow-[0_0_40px_rgba(234,84,85,0.4)]"
            >
              Optimize My Resume Now
            </motion.button>

            <p className="mt-6 text-sm text-muted-foreground">
              No credit card required • Free tier available
            </p>
          </div>
        </motion.div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="border-t border-border py-12 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#EA5455] rounded-lg flex items-center justify-center">
              <Sparkles size={16} className="text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-foreground">
              RoleSync AI
            </span>
          </div>

          <div className="text-muted-foreground text-sm">
            © 2026 RoleSync AI. All rights reserved.
          </div>

          <div className="flex gap-6">
            {["Twitter", "GitHub", "LinkedIn"].map((social) => (
              <a
                key={social}
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors text-sm"
              >
                {social}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
};
