"use client";

import { useEffect, useState } from "react";
import { Activity, Droplets, Pill, Footprints } from "lucide-react";

const events = [
  { initials: "EV", name: "Eleanor Vance, 84", detail: "BP 124/82 mmHg • Metformin 500mg taken", time: "09:15", icon: Pill, hue: "from-emerald-500 to-teal-700" },
  { initials: "AP", name: "Arthur Pendelton, 79", detail: "Assisted walk completed • 15 min", time: "09:22", icon: Footprints, hue: "from-amber-400 to-orange-500" },
  { initials: "GO", name: "Grace O’Connor, 86", detail: "Fluids logged • 450ml with lunch", time: "09:31", icon: Droplets, hue: "from-sky-400 to-blue-600" },
  { initials: "RS", name: "Robert Sterling, 84", detail: "Welcome orientation • Room 15A", time: "09:40", icon: Activity, hue: "from-violet-400 to-indigo-600" },
];

/** Cycles through recent care events like a live bedside feed. */
export default function LiveFeed() {
  const [i, setI] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setI((v) => (v + 1) % events.length), 3200);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="relative h-11 overflow-hidden" aria-live="polite">
      {events.map((e, idx) => {
        const Icon = e.icon;
        const state = idx === i ? "translate-y-0 opacity-100" : idx === (i - 1 + events.length) % events.length ? "-translate-y-full opacity-0" : "translate-y-full opacity-0";
        return (
          <div
            key={e.initials}
            aria-hidden={idx !== i}
            className={`absolute inset-0 flex items-center justify-between gap-3 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${state}`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className={`relative w-9 h-9 rounded-full bg-gradient-to-br ${e.hue} text-white font-bold text-xs flex flex-none items-center justify-center shadow-sm`}>
                {e.initials}
                <span className="absolute -bottom-0.5 -right-0.5 grid place-items-center w-4 h-4 rounded-full bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400">
                  <Icon className="w-2.5 h-2.5" />
                </span>
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-slate-900 dark:text-white truncate">{e.name}</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{e.detail}</div>
              </div>
            </div>
            <span className="text-[10px] whitespace-nowrap font-mono text-emerald-600 dark:text-emerald-400 font-semibold px-2 py-0.5 rounded-md bg-emerald-500/10">
              {e.time} AM
            </span>
          </div>
        );
      })}
    </div>
  );
}
