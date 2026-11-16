"use client";

import { useEffect, useRef, useState } from "react";
import { Building2, Mail, HeartHandshake, ArrowRight } from "lucide-react";
import Link from "next/link";

const steps = [
  {
    n: "01",
    icon: Building2,
    title: "Set up your organisation",
    body: "Add your organisation and each of your care homes. It takes minutes, not weeks.",
    time: "~10 minutes",
  },
  {
    n: "02",
    icon: Mail,
    title: "Invite your team",
    body: "Send email invitations to managers and caregivers. Everyone gets the right access from day one.",
    time: "~20 minutes",
  },
  {
    n: "03",
    icon: HeartHandshake,
    title: "Welcome your residents",
    body: "Review registrations, approve admissions and place residents in the right home and room.",
    time: "Same day",
  },
];

export default function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(-1);

  // Light up steps one by one when the section enters the viewport
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        steps.forEach((_, i) => timers.push(setTimeout(() => setActive(i), 250 + i * 550)));
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      timers.forEach(clearTimeout);
    };
  }, []);

  const progress = active < 0 ? 0 : (active / (steps.length - 1)) * 100;

  return (
    <section id="how-it-works" className="relative py-20 lg:py-28 z-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass border border-emerald-500/20 text-xs font-semibold text-emerald-700 dark:text-emerald-400 mb-4 shadow-xs">
            How it works
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white tracking-tight">
            Live in an afternoon,{" "}
            <span className="font-serif italic font-normal">not a quarter.</span>
          </h2>
        </div>

        <div ref={ref} className="relative">
          {/* Connector: horizontal on desktop, vertical on mobile */}
          <div className="hidden md:block absolute top-8 left-[16.66%] right-[16.66%] h-0.5 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-300 transition-[width] duration-700 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="md:hidden absolute left-8 top-8 bottom-8 w-0.5 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
            <div
              className="w-full bg-gradient-to-b from-emerald-500 via-teal-400 to-amber-300 transition-[height] duration-700 ease-out"
              style={{ height: `${progress}%` }}
            />
          </div>

          <ol className="relative grid md:grid-cols-3 gap-8 md:gap-6">
            {steps.map((s, i) => {
              const Icon = s.icon;
              const on = i <= active;
              return (
                <li key={s.n} className="relative flex md:flex-col md:items-center md:text-center gap-5">
                  <span
                    className={`relative z-10 grid place-items-center w-16 h-16 shrink-0 rounded-md border-2 transition-all duration-500 ${
                      on
                        ? "bg-emerald-600 dark:bg-emerald-500 border-emerald-600 dark:border-emerald-500 text-white shadow-xl shadow-emerald-600/30 scale-100"
                        : "bg-white dark:bg-slate-900 border-slate-200 dark:border-white/10 text-slate-400 scale-95"
                    }`}
                  >
                    <Icon className="w-6 h-6" />
                    {i === active && <span className="absolute inset-0 rounded-md animate-ring" />}
                  </span>
                  <div
                    className={`glass-card rounded-md p-5 md:p-6 border border-white/80 dark:border-white/10 flex-1 transition-all duration-500 ${
                      on ? "opacity-100 translate-y-0" : "opacity-50 translate-y-2"
                    }`}
                  >
                    <div className="flex md:justify-center items-center gap-2 text-xs font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                      STEP {s.n}
                      <span className="text-slate-300 dark:text-slate-600">•</span>
                      <span className="text-slate-500 dark:text-slate-400 font-sans font-medium">{s.time}</span>
                    </div>
                    <h3 className="mt-2 text-lg font-bold text-slate-900 dark:text-white">{s.title}</h3>
                    <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{s.body}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/register"
            className="shine group inline-flex items-center gap-2 px-6 py-3 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-semibold shadow-lg hover:-translate-y-0.5 transition-all"
          >
            Start your setup
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
