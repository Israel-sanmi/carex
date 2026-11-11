"use client";

import { Star, Heart, CheckCircle2, Quote } from "lucide-react";
import Reveal from "./reveal";
import { Sparkle, Blob } from "./illustrations";

const testimonials = [
  {
    quote:
      "Our morning handovers used to take 45 minutes of deciphering handwriting in spiral notebooks. With CarerLoop, it takes eight minutes, and our nurses actually spend that extra time talking to the residents over breakfast.",
    author: "Sarah Jenkins, RN",
    role: "Registered Care Home Manager",
    facility: "Meadow View Lodge",
    accent: "bg-mint/40 border-teal-brand/30",
    avatarBg: "bg-teal-brand text-white",
    initials: "SJ",
    highlight: "8-min handovers",
  },
  {
    quote:
      "When my mum moved into residential care, I spent the first month worrying constantly. Having access to the family portal and seeing her meals, activities, and afternoon garden walks gave our entire family incredible peace of mind.",
    author: "David Vance",
    role: "Son & Power of Attorney",
    facility: "Family of Eleanor Vance (Room 14B)",
    accent: "bg-coral-soft/40 border-coral/30",
    avatarBg: "bg-coral text-white",
    initials: "DV",
    highlight: "Family transparency",
  },
  {
    quote:
      "Walking the corridors during night rounds with a tablet that works without Wi-Fi is a lifesaver. You tap a resident's room, see their exact medical notes and allergies, and know immediately what to do without rummaging through locked filing cabinets.",
    author: "Marcus Cole",
    role: "Lead Senior Caregiver",
    facility: "Oakridge Residential Home",
    accent: "bg-sun-soft/40 border-sun/40",
    avatarBg: "bg-sun text-ink",
    initials: "MC",
    highlight: "Works offline",
  },
];

export default function Stories() {
  return (
    <section
      id="stories"
      className="relative overflow-hidden bg-cream py-24 sm:py-32"
    >
      {/* Decorative Blob */}
      <Blob className="pointer-events-none absolute -left-40 top-1/3 h-[450px] w-[450px] text-mint/40" />

      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-medium text-teal-brand">
              Real experiences
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ink sm:text-[2.75rem] sm:leading-[1.15]">
              Trusted by the people who deliver care every day.
            </h2>
            <p className="mt-4 text-base sm:text-lg text-ink/65">
              From care home managers to front-line caregivers and families,
              here is what changes when care is better organised.
            </p>
          </div>
        </Reveal>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <Reveal key={t.author}>
              <div
                className={`group relative flex h-full flex-col justify-between rounded-3xl p-7 sm:p-8 bg-white border ${t.accent} shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-md`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs px-2.5 py-1 rounded-full bg-cream text-ink font-semibold border border-ink/10">
                      {t.highlight}
                    </span>
                    <Quote className="h-6 w-6 text-ink/15 group-hover:text-ink/30 transition-colors" />
                  </div>

                  <p className="text-sm sm:text-[15px] leading-relaxed text-ink/80 italic">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-ink/10 flex items-center gap-3.5">
                  <div
                    className={`grid h-11 w-11 shrink-0 place-items-center rounded-md font-bold text-sm shadow-xs ${t.avatarBg}`}
                  >
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-ink">{t.author}</p>
                    <p className="text-xs text-ink/65">{t.role}</p>
                    <p className="text-[11px] text-teal-brand font-medium mt-0.5">
                      {t.facility}
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Bottom trust bar */}
        <div className="mt-16 rounded-md bg-white border border-ink/10 p-6 sm:p-8 text-center max-w-3xl mx-auto shadow-xs">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-xs text-ink/70">
            <span className="flex items-center gap-2 font-medium">
              <CheckCircle2 className="h-4 w-4 text-teal-brand" />
              <span>Full compliance audit trails</span>
            </span>
            <span className="hidden sm:inline text-ink/30">•</span>
            <span className="flex items-center gap-2 font-medium">
              <CheckCircle2 className="h-4 w-4 text-teal-brand" />
              <span>Zero cross-tenant data leaks</span>
            </span>
            <span className="hidden sm:inline text-ink/30">•</span>
            <span className="flex items-center gap-2 font-medium">
              <CheckCircle2 className="h-4 w-4 text-teal-brand" />
              <span>Simple PWA offline rounds</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
