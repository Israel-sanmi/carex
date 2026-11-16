"use client";

import { Home, Sun, Heart, ShieldCheck, Leaf, TreePine, Flower2, Building } from "lucide-react";

const providers = [
  { name: "Oakridge Care", icon: Home },
  { name: "Meadow View", icon: Sun },
  { name: "Harmony Living", icon: Heart },
  { name: "BrightPath", icon: ShieldCheck },
  { name: "Willow Creek", icon: Leaf },
  { name: "Highland Pines", icon: TreePine },
  { name: "Rosewood House", icon: Flower2 },
  { name: "St. Jude Group", icon: Building },
];

export default function TrustBar() {
  return (
    <section className="relative py-12 z-10">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-8">
          Trusted by forward-thinking care providers
        </p>

        <div className="marquee overflow-hidden">
          <div className="marquee-track gap-14 pr-14">
            {/* Rendered twice so the -50% translate loops seamlessly */}
            {[...providers, ...providers].map((p, i) => {
              const Icon = p.icon;
              return (
                <span
                  key={i}
                  aria-hidden={i >= providers.length}
                  className="flex items-center gap-2.5 text-lg md:text-xl font-bold text-slate-400 dark:text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors whitespace-nowrap grayscale hover:grayscale-0"
                >
                  <Icon className="w-6 h-6 text-slate-300 dark:text-slate-600" />
                  {p.name}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
