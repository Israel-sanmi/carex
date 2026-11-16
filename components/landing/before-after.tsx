"use client";

import { XCircle, CheckCircle2, Minus, Check, ArrowRight } from "lucide-react";
import { Spotlight } from "@/components/ui/motion";

const oldWay = [
  "Fragmented notes lost in binders and sticky notes.",
  "45-minute handwritten handovers prone to errors.",
  "Families left in the dark, calling constantly.",
  "Wi-Fi drops mean care delivery stops.",
];

const newWay = [
  "One secure, real-time digital record for every resident.",
  "8-minute digital handovers with verified checklists.",
  "Optional family portal for transparent updates.",
  "Full offline mode. Tap, log, and auto-sync.",
];

export default function BeforeAfter() {
  return (
    <section id="features" className="relative py-20 lg:py-28 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass border border-emerald-500/20 text-xs font-semibold text-emerald-700 dark:text-emerald-400 mb-4 shadow-xs">
            Why CarerLoop
          </span>
          <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight">
            <span className="font-serif italic font-normal">The end of</span>{" "}
            care-by-paperwork.
          </h2>
          <p className="text-lg lg:text-xl text-slate-600 dark:text-slate-400 leading-relaxed">
            We designed CarerLoop to eliminate the friction that steals time
            from your caregivers.
          </p>
        </div>

        <div className="relative grid md:grid-cols-2 gap-6 lg:gap-10 items-stretch">
          {/* VS connector */}
          <div className="hidden md:grid absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-14 h-14 rounded-full glass-card shadow-xl place-items-center border border-emerald-500/30">
            <ArrowRight className="w-6 h-6 text-emerald-600 dark:text-emerald-400 animate-[bounce-x_2s_ease-in-out_infinite]" />
          </div>

          {/* Old way */}
          <div className="rounded-md p-8 lg:p-10 border border-slate-200 dark:border-white/10 bg-slate-100/60 dark:bg-white/[0.02] relative overflow-hidden transition-all duration-500 hover:border-red-300/70 dark:hover:border-red-900/50">
            <div className="absolute inset-0 bg-dots opacity-40 pointer-events-none" />
            <div className="relative space-y-6">
              <h3 className="text-2xl font-bold text-slate-500 dark:text-slate-400 flex items-center gap-3">
                <XCircle className="w-7 h-7 text-red-400" /> The Old Way
              </h3>
              <ul className="space-y-4 pt-2">
                {oldWay.map((item) => (
                  <li
                    key={item}
                    className="group flex items-start gap-3.5 text-slate-500 dark:text-slate-400 text-base"
                  >
                    <Minus className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                    <span className="bg-[linear-gradient(currentColor,currentColor)] bg-no-repeat bg-[length:0%_1px] bg-[position:0_55%] transition-[background-size] duration-500 group-hover:bg-[length:100%_1px]">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* CarerLoop way */}
          <Spotlight className="border-glow glass-card rounded-md p-8 lg:p-10 border border-emerald-300/70 dark:border-emerald-500/30 shadow-2xl shadow-emerald-900/10 overflow-hidden">
            <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-emerald-400/20 blur-3xl pointer-events-none" />
            <div className="relative space-y-6">
              <h3 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-3">
                <CheckCircle2 className="w-7 h-7" /> The CarerLoop Way
              </h3>
              <ul className="space-y-4 pt-2">
                {newWay.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3.5 text-slate-700 dark:text-slate-200 text-base font-medium transition-transform duration-300 hover:translate-x-1"
                  >
                    <span className="grid place-items-center w-5 h-5 rounded-full bg-emerald-500 text-white shrink-0 mt-0.5 shadow-sm shadow-emerald-500/40">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Spotlight>
        </div>
      </div>
    </section>
  );
}
