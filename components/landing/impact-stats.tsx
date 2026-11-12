"use client";

import { Clock, ShieldAlert, Zap, FileCheck } from "lucide-react";

export default function ImpactStats() {
  const stats = [
    {
      metric: "15+",
      unit: "hours",
      label: "Saved per manager monthly",
      detail: "Eliminating duplicate paper binders and manual rota sheets",
      icon: Clock,
    },
    {
      metric: "99.8%",
      unit: "accuracy",
      label: "Medication & care compliance",
      detail: "Allergy validation with mandatory two-carer checks",
      icon: ShieldAlert,
    },
    {
      metric: "<24h",
      unit: "turnaround",
      label: "Inquiry to resident placement",
      detail: "Digital admissions pipeline with room allocation",
      icon: Zap,
    },
    {
      metric: "100%",
      unit: "audit-ready",
      label: "Tamper-proof compliance records",
      detail: "CQC Regulation 17 compliant audit trail",
      icon: FileCheck,
    },
  ];

  return (
    <section id="impact" className="relative py-20 lg:py-28 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass border border-emerald-500/20 text-xs font-semibold text-emerald-700 dark:text-emerald-400 mb-4 shadow-xs">
            <span>Measurable Impact</span>
          </div>
          <h2 className="text-3xl lg:text-5xl font-bold text-slate-900 dark:text-white font-heading tracking-tight">
            The <span className="gradient-text">CarerLoop Effect</span> in numbers.
          </h2>
          <p className="text-base lg:text-lg text-slate-600 dark:text-slate-300 mt-3 max-w-xl mx-auto">
            Quantifiable time returned to caregivers and verified safety improvements across residential homes.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={idx}
                className="glass-card rounded-3xl p-8 text-center border border-white/80 dark:border-white/10 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white font-heading tracking-tight mb-1">
                    {s.metric}
                  </div>
                  <div className="text-[11px] font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-semibold mb-3">
                    {s.unit}
                  </div>
                  <div className="text-slate-800 dark:text-slate-200 font-bold text-sm sm:text-base leading-snug mb-2">
                    {s.label}
                  </div>
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 pt-4 border-t border-slate-200/60 dark:border-white/10 leading-relaxed">
                  {s.detail}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
