import React from "react";
import { Briefcase, ChevronDown } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import Link from "next/link";

export const Navbar = () => {
  return (
    <nav className="w-full h-16 bg-surface shadow-sm border-b border-primary/10 flex items-center justify-between px-6 lg:px-12 sticky top-0 z-50">
      <Link href="/" className="flex items-center gap-2 text-primary font-bold text-xl hover:opacity-80 transition-opacity">
        <div className="bg-accent/10 p-2 rounded-lg text-accent">
          <Briefcase size={24} />
        </div>
        RoleSync AI
      </Link>
      <div className="flex items-center gap-6">
        <div className="relative group">
          <button className="flex items-center gap-1 text-sm font-medium text-primary/70 hover:text-primary transition-colors py-2">
            Tools <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-200" />
          </button>
          <div className="absolute top-full right-0 mt-0 w-48 bg-surface border border-primary/10 rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 overflow-hidden transform origin-top-right scale-95 group-hover:scale-100">
            <Link href="/upload" className="block px-4 py-3 text-sm text-primary/80 hover:bg-accent/5 hover:text-accent transition-colors">
              Resume Optimizer
            </Link>
            <Link href="/workspace/cover-letter" className="block px-4 py-3 text-sm text-primary/80 hover:bg-accent/5 hover:text-accent transition-colors border-t border-primary/5">
              Cover Letter Writer
            </Link>
          </div>
        </div>
        
        <ThemeToggle />
        <Link href="/upload" className="text-sm font-medium text-primary/70 hover:text-primary transition-colors">
          How it Works
        </Link>
        <Link href="/upload" className="text-sm font-medium bg-accent text-surface px-4 py-2 rounded-lg hover:bg-accent/90 transition-colors">
          Get Started
        </Link>
      </div>
    </nav>
  );
};
