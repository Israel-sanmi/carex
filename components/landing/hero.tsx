"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Wifi,
  Check,
  Sparkles,
  Pill,
  TrendingDown,
} from "lucide-react";
import { Tilt } from "@/components/ui/motion";

export default function Hero() {
  return (
    <section id="top" className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-14 lg:gap-10 items-center">
          {/* Left: copy */}
          <div className="lg:col-span-7 space-y-8 stagger">
            <h1 className="text-[2.75rem] sm:text-6xl lg:text-7xl leading-[1.04] tracking-tight text-slate-900 dark:text-white font-heading">
              <span className="font-serif italic font-normal text-slate-700 dark:text-slate-200">
                Give your team
              </span>
              <br />
              <span className="relative inline-block font-bold">
                <span className="gradient-text-animated">
                  the gift of time.
                </span>
                {/* Hand-drawn underline */}
                <svg
                  className="absolute -bottom-2 left-0 w-full h-3 text-emerald-400/70"
                  viewBox="0 0 300 12"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <path
                    d="M2 9 C 60 3, 140 3, 298 7"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    pathLength={1}
                    className="[stroke-dasharray:1] [stroke-dashoffset:1] animate-[draw_1.2s_0.8s_ease-out_forwards]"
                  />
                </svg>
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
              CarerLoop replaces scattered paper binders, frantic shift
              handovers, and disconnected systems with one calm, human-centred
              platform, so your staff spend less time typing and more time with
              residents.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-1">
              <Link
                href="/register"
                className="shine group inline-flex justify-center items-center gap-2 px-8 py-4 bg-emerald-600 hover:bg-emerald-500 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-slate-950 rounded-full font-bold text-base sm:text-lg transition-all shadow-xl shadow-emerald-600/25 hover:shadow-emerald-500/40 hover:-translate-y-0.5"
              >
                Get started free
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/login"
                className="inline-flex justify-center items-center gap-2 px-8 py-4 glass text-slate-800 dark:text-white font-semibold text-base sm:text-lg rounded-full transition-all hover:bg-white dark:hover:bg-slate-800/80 hover:shadow-md hover:-translate-y-0.5 border border-slate-200/80 dark:border-white/10"
              >
                Sign in
              </Link>
            </div>

            <div className="pt-5 border-t border-slate-200/70 dark:border-white/10">
              <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">
                {[
                  "No credit card required",
                  "Setup in under 2 hours",
                  "Free data migration",
                ].map((t) => (
                  <span key={t} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right: photo card with live HUD */}
          <div className="lg:col-span-5 relative animate-pop-in [animation-delay:250ms]">
            <div className="absolute -inset-6 bg-gradient-to-tr from-emerald-500/30 via-teal-400/15 to-amber-300/10 rounded-[2.5rem] blur-3xl pointer-events-none animate-pulse-slow" />

            <Tilt max={5}>
              <div className="relative rounded-md overflow-hidden glass-card border border-white/60 dark:border-white/10 shadow-2xl shadow-emerald-900/20">
                <div className="relative h-[440px] sm:h-[500px] w-full overflow-hidden group">
                  <Image
                    src="/images/hero-care.jpg"
                    alt="Compassionate caregiver interacting warmly with an elderly resident"
                    fill
                    priority
                    className="object-cover object-center transition-transform duration-[1.5s] ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/15 to-transparent" />
                </div>

                {/* Top badges */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                  <div className="glass dark:bg-slate-900/80 rounded-md px-3.5 py-2 border border-white/40 dark:border-white/15 shadow-lg flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ring" />
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-300 block leading-tight">
                        Morning Handover
                      </span>
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        Meadow View • Room 14B
                      </span>
                    </div>
                  </div>
                  <div className="glass dark:bg-slate-900/80 rounded-md px-3 py-1.5 border border-white/40 dark:border-white/15 shadow-lg flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                    Verified
                  </div>
                </div>

                {/* Bottom HUD */}
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="glass dark:bg-slate-900/90 rounded-md p-4 border border-white/50 dark:border-white/15 shadow-2xl space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-500 to-teal-700 text-white font-bold text-xs flex flex-none items-center justify-center shadow-sm">
                          EV
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-slate-900 dark:text-white">
                            Eleanor Vance, 84
                          </div>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                            BP 124/82 mmHg • Metformin 500mg taken
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] whitespace-nowrap font-mono text-emerald-600 dark:text-emerald-400 font-semibold px-2 py-0.5 rounded-md bg-emerald-500/10">
                        09:15 AM
                      </span>
                    </div>

                    {/* Round progress */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                        <span>Morning round</span>
                        <span className="text-emerald-600 dark:text-emerald-400">
                          7 / 8 residents
                        </span>
                      </div>
                      <div className="h-1.5 rounded-full bg-slate-200/80 dark:bg-white/10 overflow-hidden">
                        <div className="h-full w-[87.5%] rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 animate-grow-x [animation-delay:900ms]" />
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-200/50 dark:border-white/10 text-[11px]">
                      <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5 font-medium">
                        <Clock className="w-3 h-3 text-emerald-500" />
                        8-minute handover
                      </span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                        <Wifi className="w-3 h-3" /> Offline auto-synced
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Tilt>

            {/* Floating stat chips */}
            <div
              className="hidden sm:flex absolute -left-10 top-1/3 glass-card rounded-md px-4 py-3 shadow-xl items-center gap-3 animate-float-slow"
              style={{ "--tilt": "-3deg" } as React.CSSProperties}
            >
              <div className="w-9 h-9 rounded-md bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 grid place-items-center">
                <TrendingDown className="w-4.5 h-4.5" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400">
                  Handover time
                </p>
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  <span className="line-through text-slate-400 font-medium mr-1">
                    45m
                  </span>{" "}
                  8m
                </p>
              </div>
            </div>

            <div
              className="hidden sm:flex absolute -right-6 -top-6 glass-card rounded-md px-4 py-3 shadow-xl items-center gap-3 animate-float-slow [animation-delay:-3.5s]"
              style={{ "--tilt": "3deg" } as React.CSSProperties}
            >
              <div className="w-9 h-9 rounded-md bg-amber-400/20 text-amber-600 dark:text-amber-400 grid place-items-center">
                <Pill className="w-4.5 h-4.5" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400">
                  Meds compliance
                </p>
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  99.8%
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
