"use client";

import type { LucideIcon } from "lucide-react";
import { CountUp, Spotlight } from "@/components/ui/motion";

const tones = {
  teal: {
    tile: "bg-teal-brand/10 text-teal-brand",
    bar: "from-teal-brand to-emerald-400",
    hint: "text-emerald-700",
  },
  coral: {
    tile: "bg-coral-soft text-coral",
    bar: "from-coral to-amber-300",
    hint: "text-coral",
  },
  sky: {
    tile: "bg-sky-soft text-sky",
    bar: "from-sky to-teal-300",
    hint: "text-sky",
  },
  lilac: {
    tile: "bg-lilac-soft text-lilac",
    bar: "from-lilac to-sky",
    hint: "text-lilac",
  },
  sun: {
    tile: "bg-sun-soft text-amber-600",
    bar: "from-sun to-coral",
    hint: "text-amber-700",
  },
} as const;

export type StatTone = keyof typeof tones;

export default function StatCard({
  label,
  value,
  icon: Icon,
  hint,
  tone = "teal",
  hintMuted = false,
  className = "",
}: {
  label: string;
  value: string | number;
  icon: LucideIcon;
  hint?: string;
  tone?: StatTone;
  /** Render the hint in neutral grey instead of the tone colour */
  hintMuted?: boolean;
  className?: string;
}) {
  const t = tones[tone];
  return (
    <Spotlight
      className={`group bg-white border border-ink/[0.08] rounded-md p-5 overflow-hidden ${className}`}
    >
      {/* Accent bar */}
      <span
        className={`absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r ${t.bar} origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100`}
      />
      <div className="relative flex items-start justify-between gap-3">
        <p className="text-xs font-medium text-ink/55 leading-snug">{label}</p>
        <span
          className={`grid place-items-center w-9 h-9 rounded-md shrink-0 ${t.tile} transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6`}
        >
          <Icon className="h-[18px] w-[18px]" />
        </span>
      </div>
      <p
        className={`relative mt-2 text-3xl font-bold tracking-tight ${
          tone === "coral" ? "text-coral" : "text-ink"
        }`}
      >
        <CountUp value={value} duration={1100} />
      </p>
      {hint && (
        <p
          className={`relative mt-1 text-[11px] font-medium ${hintMuted ? "text-ink/50" : t.hint}`}
        >
          {hint}
        </p>
      )}
    </Spotlight>
  );
}
