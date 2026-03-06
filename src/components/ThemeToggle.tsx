"use client";

import React, { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export const ThemeToggle = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-9 h-9" />; // Placeholder to avoid layout shift
  }

  // Use resolvedTheme so it correctly identifies "dark" or "light" even if theme="system"
  const currentTheme = resolvedTheme || theme;

  return (
    <button
      onClick={() => setTheme(currentTheme === "dark" ? "light" : "dark")}
      className="p-2 rounded-lg bg-primary/5 hover:bg-primary/10 text-primary transition-colors flex items-center justify-center"
      aria-label="Toggle Dark Mode"
    >
      {currentTheme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
};
