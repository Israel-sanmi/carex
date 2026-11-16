"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Logo from "@/components/landing/logo";
import {
  ArrowLeft,
  Check,
  Clock,
  ShieldCheck,
  Wifi,
  Quote,
} from "lucide-react";

interface AuthCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  badge?: string;
  maxWidth?: string;
}

const quotes = [
  {
    text: "Our morning handovers used to take 45 minutes. With CarerLoop, it takes eight. Our nurses spend that time with residents over breakfast.",
    author: "Sarah Jenkins, RN",
    role: "Registered Manager, Meadow View Lodge",
    initials: "SJ",
  },
  {
    text: "When the Wi-Fi drops in our lower rooms I can still check allergies and log medications. Everything syncs the moment I step into the corridor.",
    author: "Marcus Cole",
    role: "Lead Senior Caregiver, Oakridge Residential",
    initials: "MC",
  },
];

function BrandPanel() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % quotes.length), 7000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="relative h-full w-full overflow-hidden rounded-[2rem] bg-[linear-gradient(135deg,#042f2e,#0b4f4a_40%,#0f172a)] text-white flex flex-col justify-between p-10 xl:p-14">
      {/* Ambient layers */}
      <div className="absolute inset-0 bg-grid opacity-70 pointer-events-none" />
      <div className="absolute -top-32 -right-24 w-[28rem] h-[28rem] rounded-full bg-emerald-400/25 blur-3xl animate-float-slow pointer-events-none" />
      <div className="absolute -bottom-40 -left-24 w-[26rem] h-[26rem] rounded-full bg-teal-300/15 blur-3xl animate-float-slow [animation-delay:-3.5s] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 w-72 h-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-300/10 blur-3xl pointer-events-none" />

      {/* Top tagline */}
      <div className="relative animate-rise">
        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 backdrop-blur-md text-xs font-semibold text-emerald-200">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ring" />
          Better Organised Care. Better Lives.
        </span>
        <h2 className="mt-6 text-4xl xl:text-5xl font-bold leading-[1.1] tracking-tight">
          <span className="font-serif italic font-normal text-emerald-200">
            Calm,
          </span>{" "}
          connected
          <br /> care operations.
        </h2>
        <p className="mt-4 max-w-md text-sm xl:text-base text-slate-300 leading-relaxed">
          One secure workspace for your organisation, care homes, staff and
          residents.
        </p>
      </div>

      {/* Floating product glimpses */}
      <div className="relative my-10 h-48 hidden xl:block">
        <div
          className="absolute left-0 top-2 w-72 rounded-md bg-white/10 border border-white/15 backdrop-blur-xl p-4 shadow-2xl animate-float-slow"
          style={{ "--tilt": "-2deg" } as React.CSSProperties}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 grid place-items-center text-xs font-bold">
              EV
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold">Eleanor Vance • 14B</p>
              <p className="text-[11px] text-slate-300 truncate">
                Metformin 500mg administered
              </p>
            </div>
            <span className="grid place-items-center w-6 h-6 rounded-full bg-emerald-400 text-teal-950">
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            </span>
          </div>
          <div className="mt-3 h-1.5 rounded-full bg-white/10 overflow-hidden">
            <div className="h-full w-4/5 rounded-full bg-gradient-to-r from-emerald-400 to-teal-300 animate-grow-x [animation-delay:600ms]" />
          </div>
        </div>

        <div
          className="absolute right-0 bottom-0 w-60 rounded-md bg-white/10 border border-white/15 backdrop-blur-xl p-4 shadow-2xl animate-float-slow [animation-delay:-3s]"
          style={{ "--tilt": "2deg" } as React.CSSProperties}
        >
          <div className="flex items-center justify-between text-[11px] text-slate-300">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-emerald-300" /> Shift handover
            </span>
            <span className="flex items-center gap-1 text-emerald-300 font-semibold">
              <Wifi className="w-3 h-3" /> Synced
            </span>
          </div>
          <p className="mt-2 text-2xl font-bold">
            8 min{" "}
            <span className="text-sm font-medium text-slate-400 line-through ml-1">
              45 min
            </span>
          </p>
        </div>
      </div>

      {/* Rotating testimonial */}
      <div className="relative">
        <div className="relative rounded-md bg-white/[0.07] border border-white/10 backdrop-blur-md p-6">
          <Quote className="absolute -top-3 left-6 w-7 h-7 text-emerald-300 bg-[#0b4f4a] rounded-md p-1" />
          <div className="grid">
            {quotes.map((q, i) => (
              <figure
                key={q.author}
                aria-hidden={i !== idx}
                className={`[grid-area:1/1] transition-all duration-700 ${
                  i === idx
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-3 pointer-events-none"
                }`}
              >
                <blockquote className="text-sm xl:text-[15px] leading-relaxed text-slate-100">
                  &ldquo;{q.text}&rdquo;
                </blockquote>
                <figcaption className="mt-4 flex items-center gap-3">
                  <span className="w-9 h-9 rounded-full bg-white/15 grid place-items-center text-xs font-bold">
                    {q.initials}
                  </span>
                  <span>
                    <span className="block text-sm font-semibold">
                      {q.author}
                    </span>
                    <span className="block text-xs text-slate-400">
                      {q.role}
                    </span>
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between">
          <div className="flex gap-1.5">
            {quotes.map((q, i) => (
              <button
                key={q.author}
                onClick={() => setIdx(i)}
                aria-label={`Show testimonial ${i + 1}`}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  i === idx
                    ? "w-8 bg-emerald-300"
                    : "w-3 bg-white/25 hover:bg-white/40"
                }`}
              />
            ))}
          </div>
          <span className="flex items-center gap-1.5 text-xs text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" /> Encrypted &
            GDPR-ready
          </span>
        </div>
      </div>
    </div>
  );
}

export default function AuthCard({
  title,
  subtitle,
  children,
  footer,
  maxWidth = "max-w-md",
}: AuthCardProps) {
  return (
    <div className="auth-scope relative min-h-screen bg-cream font-sans text-ink selection:bg-sun/60 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] xl:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
      {/* Form column */}
      <div className="relative flex min-h-screen flex-col p-5 sm:p-8 lg:p-10 overflow-hidden">
        {/* Soft background (mobile + desktop) */}
        <div className="absolute inset-0 bg-dots opacity-50 pointer-events-none [mask-image:radial-gradient(ellipse_at_top,#000,transparent_70%)]" />
        <div className="absolute -top-40 -left-40 w-[30rem] h-[30rem] rounded-full bg-emerald-300/20 blur-3xl pointer-events-none" />

        <header className="relative flex items-center justify-between animate-rise">
          <Link
            href="/"
            className="inline-block transition-transform hover:scale-[1.02]"
            aria-label="CarerLoop home"
          >
            <Logo />
          </Link>
        </header>

        <main
          className={`relative w-full ${maxWidth} mx-auto flex-1 flex flex-col justify-center py-10`}
        >
          <div className="space-y-2 mb-8 animate-rise [animation-delay:60ms]">
            <h1 className="text-3xl sm:text-[2.1rem] font-semibold tracking-tight text-ink font-heading leading-tight">
              {title}
            </h1>
            {subtitle && (
              <p className="text-sm sm:text-[15px] text-ink/60 leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>

          <div className="space-y-4">{children}</div>

          {footer && (
            <div className="mt-8 pt-6 border-t border-ink/10 text-sm text-center text-ink/60 animate-rise [animation-delay:350ms]">
              {footer}
            </div>
          )}
        </main>

        <footer className="relative text-center text-xs text-ink/45">
          © 2026 CARERLOOP. Better Organised Care. Better Lives.
        </footer>
      </div>

      {/* Brand column (desktop) */}
      <aside className="hidden lg:block p-4 pl-0">
        <div className="sticky top-4 h-[calc(100vh-2rem)] animate-pop-in [animation-delay:120ms]">
          <BrandPanel />
        </div>
      </aside>
    </div>
  );
}
