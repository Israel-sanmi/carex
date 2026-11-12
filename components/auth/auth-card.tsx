"use client";

import React from "react";
import Logo from "@/components/landing/logo";

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
  badge,
  maxWidth = "max-w-md",
}: AuthCardProps) {
  return (
    <div className="min-h-screen bg-cream flex flex-col justify-between p-4 sm:p-6 lg:p-8 font-sans text-ink selection:bg-sun/60">
      {/* Top Header */}
      <div className="w-full max-w-6xl mx-auto flex items-center justify-between py-2">
        <a href="/" className="inline-block transition-transform hover:scale-102">
          <Logo />
        </a>
      </div>

      {/* Main Card Container */}
      <div className={`w-full ${maxWidth} mx-auto my-8`}>
        <div className="relative rounded-[2rem] bg-white p-6 sm:p-10 border border-ink/10 shadow-[0_20px_60px_-20px_rgba(19,48,45,0.18)]">
          {/* Optional Badge
          {badge && (
            <div className="mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-mint text-teal-deep border border-teal-brand/20">
                {badge}
              </span>
            </div>
          )} */}

          {/* Heading */}
          <div className="space-y-1.5 mb-6">
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-ink font-heading">
              {title}
            </h1>
            {subtitle && (
              <p className="text-sm text-ink/65 leading-relaxed">
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
            <div className="mt-6 pt-6 border-t border-ink/10 text-xs text-center text-ink/60">
              {footer}
            </div>
          )}
        </div>
      </div>

      {/* Page Footer */}
      <div className="w-full max-w-6xl mx-auto py-4 text-center text-xs text-ink/50">
        <p>© 2026 CARERLOOP. Better Organised Care. Better Lives.</p>
      </div>
    </div>
  );
}
