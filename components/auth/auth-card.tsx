"use client";

import React from "react";
import Logo from "@/components/landing/logo";
import ThemeToggle from "@/components/landing/theme-toggle";

interface AuthCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  badge?: string;
  maxWidth?: string;
}

export default function AuthCard({
  title,
  subtitle,
  children,
  footer,
  maxWidth = "max-w-md",
}: AuthCardProps) {
  return (
    <div className="relative min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-between p-4 sm:p-6 lg:p-8 font-sans text-ink dark:text-slate-100 selection:bg-emerald-500/30 overflow-x-hidden transition-colors duration-300">
      {/* Aurora Gradient Background */}
      <div className="aurora-bg" />

      {/* Top Header */}
      <div className="relative z-10 w-full max-w-6xl mx-auto flex items-center justify-between py-2">
        <a href="/" className="inline-block transition-transform hover:scale-102">
          <Logo />
        </a>
        <ThemeToggle />
      </div>

      {/* Main Card Container */}
      <div className={`relative z-10 w-full ${maxWidth} mx-auto my-8`}>
        {/* Radiant glow behind card */}
        <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-[3rem] blur-2xl pointer-events-none" />

        <div className="relative rounded-[2.5rem] glass dark:bg-slate-900/80 p-6 sm:p-10 border border-white/80 dark:border-white/10 shadow-2xl">
          {/* Heading */}
          <div className="space-y-1.5 mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-ink dark:text-white font-heading">
              {title}
            </h1>
            {subtitle && (
              <p className="text-sm text-ink/75 dark:text-slate-300 leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>

          {/* Form Content */}
          <div className="space-y-4">
            {children}
          </div>

          {/* Optional Footer */}
          {footer && (
            <div className="mt-6 pt-6 border-t border-ink/10 dark:border-white/10 text-xs text-center text-ink/60 dark:text-slate-400">
              {footer}
            </div>
          )}
        </div>
      </div>

      {/* Page Footer */}
      <div className="relative z-10 w-full max-w-6xl mx-auto py-4 text-center text-xs text-ink/50 dark:text-slate-500">
        <p>© 2026 CARERLOOP. Better Organised Care. Better Lives.</p>
      </div>
    </div>
  );
}
