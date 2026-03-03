import React from "react";
import { Briefcase } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

export const Navbar = () => {
  return (
    <nav className="w-full h-16 bg-surface shadow-sm border-b border-primary/10 flex items-center justify-between px-6 lg:px-12 sticky top-0 z-50">
      <div className="flex items-center gap-2 text-primary font-bold text-xl">
        <div className="bg-accent/10 p-2 rounded-lg text-accent">
          <Briefcase size={24} />
        </div>
        RoleSync AI
      </div>
      <div className="flex items-center gap-4">
        <ThemeToggle />
        <button className="text-sm font-medium text-primary/70 hover:text-primary transition-colors">
          How it Works
        </button>
        <button className="text-sm font-medium bg-accent text-surface px-4 py-2 rounded-lg hover:bg-accent/90 transition-colors">
          Get Started
        </button>
      </div>
    </nav>
  );
};
