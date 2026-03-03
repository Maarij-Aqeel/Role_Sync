"use client";

import React from "react";
import { TrendingUp, Target } from "lucide-react";

interface ScoreDisplayProps {
  atsScore: number;
  domainScore: number;
}

const ScoreRing: React.FC<{
  score: number;
  label: string;
  icon: React.ReactNode;
  color: string;
}> = ({ score, label, icon, color }) => {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

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
          <circle
            cx="50"
            cy="50"
            r={radius}
            stroke={color}
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-primary">{score}</span>
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
        color="#EA5455"
      />
      <ScoreRing
        score={domainScore}
        label="Domain Fit"
        icon={<Target size={16} />}
        color="#2D4059"
      />
    </div>
  );
};
