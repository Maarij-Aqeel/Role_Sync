"use client";

import { motion } from "framer-motion";
import { TrendingUp, Target } from "lucide-react";

interface ScoreDisplayProps {
  atsScore: number;
  domainScore: number;
}

const ScoreRing: React.FC<{
  score: number;
  label: string;
  icon: React.ReactNode;
  colorClass: string;
}> = ({ score, label, icon, colorClass }) => {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  // Make sure the offset calculation strictly enforces boundaries
  const safeScore = Math.min(100, Math.max(0, score || 0));
  const offset = circumference - (safeScore / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-3 p-6 bg-surface rounded-xl border border-primary/10 shadow-sm hover:shadow-md transition-shadow">
      <div className="relative w-28 h-28">
        <svg className="w-28 h-28 -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            className="text-primary/10"
          />
          <motion.circle
            cx="50"
            cy="50"
            r={radius}
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            className={colorClass}
            style={{ stroke: "currentColor" }}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span 
            className="text-2xl font-bold text-primary"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            {safeScore}
          </motion.span>
          <span className="text-xs text-primary/50">/ 100</span>
        </div>
      </div>
      <div className="flex items-center gap-2 text-sm font-semibold text-primary">
        {icon}
        {label}
      </div>
    </div>
  );
};

export const ScoreDisplay: React.FC<ScoreDisplayProps> = ({
  atsScore,
  domainScore,
}) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <ScoreRing
        score={atsScore}
        label="ATS Score"
        icon={<TrendingUp size={16} />}
        colorClass="text-accent"
      />
      <ScoreRing
        score={domainScore}
        label="Domain Fit"
        icon={<Target size={16} />}
        colorClass="text-primary"
      />
    </div>
  );
};
