"use client";

import { XCircle, CheckCircle2, Minus, Check } from "lucide-react";

export default function BeforeAfter() {
  return (
    <section id="features" className="relative py-20 lg:py-28 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight">
            <span className="font-serif italic font-normal">The end of</span>{" "}
            care-by-paperwork.
          </h2>
          <p className="text-lg lg:text-xl text-slate-600 dark:text-slate-400 leading-relaxed">
            We designed CarerLoop to eliminate the friction that steals time
            from your caregivers.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-stretch">
          {/* The Old Way */}
          <div className="glass-card rounded-3xl p-8 lg:p-10 border border-red-200/80 dark:border-red-900/40 shadow-lg relative overflow-hidden flex flex-col justify-between">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-red-600 dark:text-red-400 flex items-center gap-3">
                <XCircle className="w-7 h-7" /> The Old Way
              </h3>

              <ul className="space-y-4 pt-2">
                <li className="flex items-start gap-3.5 text-slate-600 dark:text-slate-400 text-base">
                  <Minus className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                  <span>
                    Fragmented notes lost in binders and sticky notes.
                  </span>
                </li>
                <li className="flex items-start gap-3.5 text-slate-600 dark:text-slate-400 text-base">
                  <Minus className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                  <span>45-minute handwritten handovers prone to errors.</span>
                </li>
                <li className="flex items-start gap-3.5 text-slate-600 dark:text-slate-400 text-base">
                  <Minus className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                  <span>Families left in the dark, calling constantly.</span>
                </li>
                <li className="flex items-start gap-3.5 text-slate-600 dark:text-slate-400 text-base">
                  <Minus className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                  <span>Wi-Fi drops mean care delivery stops.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* The CarerLoop Way */}
          <div className="glass-card rounded-3xl p-8 lg:p-10 border border-emerald-300/70 dark:border-emerald-500/30 shadow-2xl relative overflow-hidden flex flex-col justify-between">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-3">
                <CheckCircle2 className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />{" "}
                The CarerLoop Way
              </h3>

              <ul className="space-y-4 pt-2">
                <li className="flex items-start gap-3.5 text-slate-700 dark:text-slate-300 text-base font-medium">
                  <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    One secure, real-time digital record for every resident.
                  </span>
                </li>
                <li className="flex items-start gap-3.5 text-slate-700 dark:text-slate-300 text-base font-medium">
                  <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    8-minute digital handovers with verified checklists.
                  </span>
                </li>
                <li className="flex items-start gap-3.5 text-slate-700 dark:text-slate-300 text-base font-medium">
                  <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span>Optional family portal for transparent updates.</span>
                </li>
                <li className="flex items-start gap-3.5 text-slate-700 dark:text-slate-300 text-base font-medium">
                  <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span>Full offline mode. Tap, log, and auto-sync.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
