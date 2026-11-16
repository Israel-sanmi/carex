"use client";

import { Clock, ShieldAlert, Zap, FileCheck } from "lucide-react";
import { CountUp, Spotlight } from "@/components/ui/motion";

const stats = [
  {
    metric: "15+",
    unit: "hours",
    label: "Saved per manager monthly",
    detail: "Eliminating duplicate paper binders and manual rota sheets",
    icon: Clock,
    tint: "from-emerald-500/15 to-teal-500/5 text-emerald-600 dark:text-emerald-400",
  },
  {
    metric: "99.8%",
    unit: "accuracy",
    label: "Medication & care compliance",
    detail: "Allergy validation with mandatory two-carer checks",
    icon: ShieldAlert,
    tint: "from-sky-500/15 to-sky-500/5 text-sky-600 dark:text-sky-400",
  },
  {
    metric: "<24h",
    unit: "turnaround",
    label: "Inquiry to resident placement",
    detail: "Digital admissions pipeline with room allocation",
    icon: Zap,
    tint: "from-amber-400/20 to-amber-400/5 text-amber-600 dark:text-amber-400",
  },
  {
    metric: "100%",
    unit: "audit-ready",
    label: "Tamper-proof compliance records",
    detail: "CQC Regulation 17 compliant audit trail",
    icon: FileCheck,
    tint: "from-violet-500/15 to-violet-500/5 text-violet-600 dark:text-violet-400",
  },
];

export default function ImpactStats() {
  return (
    <section id="impact" className="relative py-20 lg:py-28 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass border border-emerald-500/20 text-xs font-semibold text-emerald-700 dark:text-emerald-400 mb-4 shadow-xs">
            Measurable Impact
          </div>
          <h2 className="text-3xl lg:text-5xl font-bold text-slate-900 dark:text-white font-heading tracking-tight">
            The <span className="gradient-text-animated">CarerLoop Effect</span>{" "}
            in numbers.
          </h2>
          <p className="text-base lg:text-lg text-slate-600 dark:text-slate-300 mt-3 max-w-xl mx-auto">
            Quantifiable time returned to caregivers and verified safety
            improvements across residential homes.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((s) => {
            const Icon = s.icon;
            return (
              <Spotlight
                key={s.label}
                className="glass-card rounded-md p-8 text-center border border-white/80 dark:border-white/10 shadow-xl hover:shadow-2xl hover:shadow-emerald-900/10 hover:-translate-y-1.5 transition-all duration-500 flex flex-col justify-between group overflow-hidden"
              >
                <div className="relative">
                  <div
                    className={`w-12 h-12 rounded-md bg-gradient-to-br ${s.tint} flex items-center justify-center mx-auto mb-5 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white font-heading tracking-tight mb-1">
                    <CountUp value={s.metric} />
                  </div>
                  <div className="text-[11px] font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-semibold mb-3">
                    {s.unit}
                  </div>
                  <div className="text-slate-800 dark:text-slate-200 font-bold text-sm sm:text-base leading-snug mb-2">
                    {s.label}
                  </div>
                </div>
                <div className="relative text-xs text-slate-500 dark:text-slate-400 pt-4 border-t border-slate-200/60 dark:border-white/10 leading-relaxed">
                  {s.detail}
                </div>
              </Spotlight>
            );
          })}
        </div>
      </div>
    </section>
  );
}
