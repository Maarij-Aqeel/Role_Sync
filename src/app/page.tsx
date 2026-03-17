"use client";

import React from "react";
import { Navbar } from "@/components/Navbar";
import { LandingSection } from "@/components/LandingSection";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-8">
        <LandingSection onStart={() => router.push("/setup")} />
      </main>

      <footer className="py-4 text-center text-xs text-primary/40 border-t border-primary/10">
        © {new Date().getFullYear()} RoleSync AI — Your resumes never leave
        your browser.
      </footer>
    </div>
  );
}
