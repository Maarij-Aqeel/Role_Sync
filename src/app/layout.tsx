// layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RoleSync AI | ATS Resume Matcher",
  description: "Analyze your resume against Job Descriptions and intelligently auto-inject missing keywords for an ATS-optimized result.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen relative`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* Unified Subtle Grid Background */}
          <div 
            className="fixed inset-0 -z-10 opacity-[0.4] dark:opacity-[0.2] pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, var(--primary-muted) 1px, transparent 0)`,
              backgroundSize: '24px 24px',
            }}
          />
          {/* Gradient overlay for depth */}
          <div 
            className="fixed inset-0 -z-10 bg-gradient-to-br from-accent/5 via-transparent to-primary/5 pointer-events-none"
          />
          {children}
          <Toaster position="top-center" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}