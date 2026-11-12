"use client";

import { Home, Sun, Heart, ShieldCheck, CheckCircle } from "lucide-react";

export default function TrustBar() {
  return (
    <section className="relative py-14 z-10">
      <div className="max-w-7xl mx-auto px-4 text-center">
        {/* Micro guarantees from hero */}
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium mb-10">
          <span className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-500" />
            No credit card required
          </span>
          <span className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-500" />
            Setup in under 2 hours
          </span>
          <span className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-500" />
            Free migration
          </span>
        </div>

        {/* Section label */}
        <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-8">
          Trusted by forward-thinking care providers
        </p>

        {/* Brand logos in clean monochromatic treatment matching sample */}
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-14 opacity-75 dark:opacity-60">
          <span className="text-lg md:text-xl font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2.5">
            <Home className="w-6 h-6 text-slate-400 dark:text-slate-300" /> Oakridge Care
          </span>
          <span className="text-lg md:text-xl font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2.5">
            <Sun className="w-6 h-6 text-slate-400 dark:text-slate-300" /> Meadow View
          </span>
          <span className="text-lg md:text-xl font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2.5">
            <Heart className="w-6 h-6 text-slate-400 dark:text-slate-300" /> Harmony Living
          </span>
          <span className="text-lg md:text-xl font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2.5">
            <ShieldCheck className="w-6 h-6 text-slate-400 dark:text-slate-300" /> BrightPath
          </span>
        </div>
      </div>
    </section>
  );
}
