"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Heart,
  Clock,
  Sparkles,
  Wifi,
  Activity,
  Check,
} from "lucide-react";

export default function Hero() {
  return (
    <section id="top" className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Copy & Value Proposition (7 cols) */}
          <div className="lg:col-span-7 space-y-8 animate-fade-in">
            {/* Accreditation / Trust pill */}
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full glass border border-emerald-500/20 dark:border-emerald-500/30 text-xs sm:text-sm font-semibold shadow-xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              {/* <span className="text-emerald-800 dark:text-emerald-300 tracking-wide font-medium">
                CQC & GDPR Compliant • Residential Care Platform
              </span> */}
            </div>

            {/* Headline with Instrument Serif accent */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl leading-[1.08] tracking-tight text-slate-900 dark:text-white font-heading">
              <span className="font-serif italic font-normal text-slate-700 dark:text-slate-200">
                Give your team
              </span>{" "}
              <br />
              <span className="gradient-text font-bold">
                the gift of time.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
              CarerLoop replaces scattered paper binders, frantic shift handovers, and disconnected systems with one calm, human-centred platform. Designed so your staff can spend less time typing and more time with residents.
            </p>

            {/* Call to Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Link
                href="/register"
                className="inline-flex justify-center items-center gap-2 px-8 py-4 bg-emerald-600 hover:bg-emerald-500 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-slate-950 rounded-full font-bold text-base sm:text-lg transition-all shadow-xl shadow-emerald-600/25 hover:shadow-emerald-500/35 hover:-translate-y-0.5 cursor-pointer"
              >
                Get started
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/login"
                className="inline-flex justify-center items-center gap-2 px-8 py-4 glass text-slate-800 dark:text-white font-semibold text-base sm:text-lg rounded-full transition-all hover:bg-white/90 dark:hover:bg-slate-800/80 hover:shadow-md cursor-pointer border border-slate-200/80 dark:border-white/10"
              >
                Sign in to Dashboard
              </Link>
            </div>

            {/* Micro guarantees & social proof */}
            <div className="pt-2 border-t border-slate-200/70 dark:border-white/10 space-y-4">
              <div className="flex flex-wrap items-center gap-6 text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  No credit card required
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  Setup in under 2 hours
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  Free data migration
                </span>
              </div>

             
            </div>
          </div>

          {/* Right Column: Layered Authentic Care Photography & Live HUD (5 cols) */}
          <div className="lg:col-span-5 relative mt-6 lg:mt-0">
            {/* Ambient emerald backlight orb */}
            <div className="absolute -inset-4 bg-gradient-to-tr from-emerald-500/25 via-teal-500/15 to-transparent rounded-3xl blur-2xl pointer-events-none" />

            {/* Photo Card Container */}
            <div className="relative rounded-3xl overflow-hidden glass-card border border-white/60 dark:border-white/10 shadow-2xl">
              {/* Main Real Photography */}
              <div className="relative h-[420px] sm:h-[480px] w-full overflow-hidden">
                <Image
                  src="/images/hero-care.jpg"
                  alt="Compassionate caregiver interacting warmly with an elderly resident"
                  fill
                  priority
                  className="object-cover object-center transform hover:scale-102 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
              </div>

              {/* Floating Top Badge: Handover Verification */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                <div className="glass dark:bg-slate-900/80 backdrop-blur-md rounded-2xl px-3.5 py-2 border border-white/40 dark:border-white/15 shadow-lg flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 dark:text-slate-300 block leading-tight">
                      Morning Handover
                    </span>
                    <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1">
                      Meadow View • Room 14B
                    </span>
                  </div>
                </div>

                <div className="glass dark:bg-slate-900/80 backdrop-blur-md rounded-2xl px-3 py-1.5 border border-white/40 dark:border-white/15 shadow-lg flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                  <span>Verified</span>
                </div>
              </div>

              {/* Floating Bottom HUD Card: Bedside Record Entry */}
              <div className="absolute bottom-4 left-4 right-4">
                <div className="glass dark:bg-slate-900/90 backdrop-blur-xl rounded-2xl p-4 border border-white/50 dark:border-white/15 shadow-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-full bg-emerald-600 dark:bg-emerald-500 text-white font-bold text-xs flex flex-none items-center justify-center shadow-sm">
                        EV
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white">
                          Eleanor Vance, 84
                        </div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400">
                          Blood pressure 124/82 mmHg • Metformin 500mg taken
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] whitespace-nowrap font-mono text-emerald-600 dark:text-emerald-400 font-semibold px-2 py-0.5 rounded-md bg-emerald-500/10">
                      09:15 AM
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-200/50 dark:border-white/10 text-[11px]">
                    <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5 font-medium">
                      <Clock className="w-3 h-3 text-emerald-500" />
                      8-minute shift handover
                    </span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                      <Wifi className="w-3 h-3" /> Offline auto-synced
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
