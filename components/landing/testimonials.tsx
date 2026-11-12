"use client";

import Image from "next/image";
import { Star, Quote, Building2, CheckCircle2 } from "lucide-react";

export default function Testimonials() {
  const reviews = [
    {
      stars: 5,
      quote:
        "Our morning handovers used to take 45 minutes of deciphering handwriting and piecing together sticky notes. With CarerLoop, it takes eight minutes. Our nurses actually spend that extra time talking to residents over breakfast. It has completely transformed our morning culture.",
      author: "Sarah Jenkins, RN",
      role: "Registered Manager, Meadow View Lodge",
      careHome: "Meadow View Lodge • 48 Beds",
      cqc: "CQC Rating: Outstanding",
      image: "/images/sarah-jenkins.jpg",
    },
    {
      stars: 5,
      quote:
        "As a senior caregiver, the offline mode is a lifesaver. When I'm in our lower ground floor rooms where Wi-Fi drops completely, I can still tap a resident’s profile, check allergies, and log medications without missing a beat. Everything syncs the moment I step into the corridor.",
      author: "Marcus Cole",
      role: "Lead Senior Caregiver, Oakridge Residential",
      careHome: "Oakridge Care Home • Dementia Suite",
      cqc: "Verified Lead Carer",
      image: "/images/marcus-cole.jpg",
    },
  ];

  return (
    <section id="reviews" className="relative py-20 lg:py-28 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass border border-emerald-500/20 text-xs font-semibold text-emerald-700 dark:text-emerald-400 mb-4 shadow-xs">
            <span>Frontline Voices</span>
          </div>
          <h2 className="text-3xl lg:text-5xl font-bold text-slate-900 dark:text-white font-heading tracking-tight">
            Loved by the people who{" "}
            <span className="gradient-text">deliver care</span> every day.
          </h2>
          <p className="text-base lg:text-lg text-slate-600 dark:text-slate-300 mt-3 max-w-2xl mx-auto">
            Hear from registered managers and caregivers who use CarerLoop to run calmer, safer residential care homes.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-10">
          {reviews.map((r, idx) => (
            <div
              key={idx}
              className="glass-card rounded-3xl p-8 sm:p-10 border border-white/80 dark:border-white/10 shadow-xl relative flex flex-col justify-between group hover:border-emerald-500/30 transition-all duration-300"
            >
              <div className="space-y-6">
                {/* Star rating & quote icon */}
                <div className="flex items-center justify-between">
                  <div className="flex gap-1 text-amber-400">
                    {[...Array(r.stars)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <Quote className="w-8 h-8 text-emerald-500/20 group-hover:text-emerald-500/40 transition-colors" />
                </div>

                <p className="text-base sm:text-lg text-slate-700 dark:text-slate-200 leading-relaxed italic">
                  &ldquo;{r.quote}&rdquo;
                </p>
              </div>

              {/* Author Footer with Real Photography & Accreditation */}
              <div className="flex items-center gap-4 pt-6 mt-6 border-t border-slate-200/60 dark:border-white/10">
                <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-emerald-500/40 shrink-0 shadow-md">
                  <Image
                    src={r.image}
                    alt={r.author}
                    fill
                    className="object-cover object-center"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-white text-base">
                      {r.author}
                    </span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  </div>
                  <div className="text-xs font-medium text-emerald-700 dark:text-emerald-400">
                    {r.role}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
                    <Building2 className="w-3 h-3 text-slate-400" />
                    <span>{r.careHome}</span>
                    <span className="text-emerald-500">• {r.cqc}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
