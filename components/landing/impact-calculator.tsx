"use client";

import { useState } from "react";
import {
  Calculator,
  Clock,
  Heart,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  TrendingUp,
  FileCheck2,
} from "lucide-react";
import Reveal from "./reveal";
import { Blob, Sparkle } from "./illustrations";

export default function ImpactCalculator() {
  const [homesCount, setHomesCount] = useState(3);

  // Dynamic calculations based on care home operations averages
  const weeklyHoursSaved = homesCount * 18;
  const monthlyHoursSaved = weeklyHoursSaved * 4;
  const estimatedResidents = homesCount * 36;
  const admissionsPerYear = homesCount * 28;

  const presets = [1, 2, 4, 8, 12];

  return (
    <section
      id="impact"
      className="relative overflow-hidden bg-white pt-24 sm:pt-32"
    >
      {/* Decorative Blob */}
      <Blob className="pointer-events-none absolute -right-36 top-1/4 h-[480px] w-[480px] text-coral-soft/50" />
      <Sparkle className="pointer-events-none absolute left-16 bottom-20 h-8 w-8 text-sun" />

      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-medium text-coral">Care impact</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ink sm:text-[2.75rem] sm:leading-[1.15]">
              See what CarerLoop gives back to your team.
            </h2>
            <p className="mt-4 text-base sm:text-lg text-ink/65">
              Less time filling out binders means more time listening to
              stories, holding hands, and delivering real care.
            </p>
          </div>
        </Reveal>

        {/* Interactive Calculator Container */}
        <div className="mt-14 max-w-4xl mx-auto rounded-md bg-cream/80 border border-ink/10 p-6 sm:p-12 shadow-[0_20px_60px_-25px_rgba(19,48,45,0.15)]">
          {/* Slider control area */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <label
                htmlFor="homes-range"
                className="text-base sm:text-lg font-semibold text-ink"
              >
                How many care homes do you run?
              </label>
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold text-teal-brand font-mono">
                  {homesCount}
                </span>
                <span className="text-sm font-medium text-ink/60">
                  {homesCount === 1 ? "Care Home" : "Care Homes"}
                </span>
              </div>
            </div>

            {/* Slider */}
            <div className="relative pt-2">
              <input
                id="homes-range"
                type="range"
                min="1"
                max="15"
                step="1"
                value={homesCount}
                onChange={(e) => setHomesCount(Number(e.target.value))}
                className="w-full h-3 bg-white rounded-full appearance-none cursor-pointer accent-teal-brand shadow-inner"
              />
              <div className="flex justify-between text-xs text-ink/50 mt-2 font-mono">
                <span>1 Home</span>
                <span>5 Homes</span>
                <span>10 Homes</span>
                <span>15+ Homes</span>
              </div>
            </div>

            {/* Quick Presets */}
            <div className="flex items-center gap-2 pt-2 flex-wrap">
              <span className="text-xs text-ink/60 mr-1 font-medium">
                Quick select:
              </span>
              {presets.map((p) => (
                <button
                  key={p}
                  onClick={() => setHomesCount(p)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    homesCount === p
                      ? "bg-teal-brand text-white shadow-xs"
                      : "bg-white text-ink/70 hover:text-ink border border-ink/10 hover:border-ink/20"
                  }`}
                >
                  {p} {p === 1 ? "Home" : "Homes"}
                </button>
              ))}
            </div>
          </div>

          {/* Dynamic Metrics Grid */}
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Hours Saved */}
            <div className="rounded-md bg-white p-5 border border-ink/10 shadow-xs space-y-2 transition-transform duration-300 hover:-translate-y-1">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-mint text-teal-brand">
                <Clock className="h-5 w-5" />
              </div>
              <p className="text-3xl font-bold text-ink tracking-tight">
                ~{monthlyHoursSaved}{" "}
                <span className="text-sm font-normal text-ink/60">hrs</span>
              </p>
              <p className="text-xs font-semibold text-ink">
                Admin hours saved / month
              </p>
              <p className="text-[11px] text-ink/55 leading-relaxed">
                Freed from paper forms and manual shift logs.
              </p>
            </div>

            {/* Card 2: Residents supported */}
            <div className="rounded-md bg-white p-5 border border-ink/10 shadow-xs space-y-2 transition-transform duration-300 hover:-translate-y-1">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-coral-soft text-coral">
                <Heart className="h-5 w-5" />
              </div>
              <p className="text-3xl font-bold text-ink tracking-tight">
                ~{estimatedResidents}
              </p>
              <p className="text-xs font-semibold text-ink">
                Residents at the centre
              </p>
              <p className="text-[11px] text-ink/55 leading-relaxed">
                With instant profiles and digital care records.
              </p>
            </div>

            {/* Card 3: Admission turnaround */}
            <div className="rounded-md bg-white p-5 border border-ink/10 shadow-xs space-y-2 transition-transform duration-300 hover:-translate-y-1">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-sun-soft text-[#9a6700]">
                <TrendingUp className="h-5 w-5" />
              </div>
              <p className="text-3xl font-bold text-ink tracking-tight">
                &lt; 24h
              </p>
              <p className="text-xs font-semibold text-ink">
                Intake to room placement
              </p>
              <p className="text-[11px] text-ink/55 leading-relaxed">
                Down from days of phone tag and lost faxes.
              </p>
            </div>

            {/* Card 4: Audit & Inspection readiness */}
            <div className="rounded-md bg-white p-5 border border-ink/10 shadow-xs space-y-2 transition-transform duration-300 hover:-translate-y-1">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-lilac-soft text-lilac">
                <FileCheck2 className="h-5 w-5" />
              </div>
              <p className="text-3xl font-bold text-ink tracking-tight">100%</p>
              <p className="text-xs font-semibold text-ink">
                Inspection ready records
              </p>
              <p className="text-[11px] text-ink/55 leading-relaxed">
                Timestamped, verified, and unalterable.
              </p>
            </div>
          </div>

          {/* Bottom highlight pill */}
          <div className="mt-8 pt-6 border-t border-ink/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-ink/70">
            <span className="flex items-center gap-2">
              {/* <Sparkles className="h-4 w-4 text-teal-brand" /> */}
              <span>
                Calculated based on average residential care shift workflows.
              </span>
            </span>

            {/* <a
              href="#get-started"
              className="font-semibold text-teal-brand hover:text-teal-deep underline decoration-teal-brand/40 underline-offset-4"
            >
              See a personalised breakdown for your organisation →
            </a> */}
          </div>
        </div>
      </div>
    </section>
  );
}
