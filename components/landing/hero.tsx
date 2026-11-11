import Image from "next/image";
import { ArrowRight, Check } from "lucide-react";
import { images } from "./images";
import { Blob, DotGrid, HeartLine, Sparkle, Squiggle } from "./illustrations";

interface HeroProps {
  onOpenDemo?: () => void;
}

export default function Hero({ onOpenDemo }: HeroProps) {
  return (
    <section
      id="top"
      className="relative overflow-hidden bg-cream pt-32 pb-20 sm:pt-40 lg:pb-28"
    >
      {/* soft background shapes */}
      <Blob className="pointer-events-none absolute -right-40 -top-32 h-[560px] w-[560px] text-mint" />
      <Blob className="pointer-events-none absolute -left-48 bottom-[-220px] h-[420px] w-[420px] rotate-90 text-sun-soft" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 sm:px-8 lg:grid-cols-[1.05fr_1fr]">
        {/* Copy */}
        <div className="animate-fade-in">
          <p className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-teal-brand">
            <span className="h-px w-8 bg-teal-brand" />
            Care management, made calm
          </p>

          <h1 className="text-[2.6rem] font-semibold leading-[1.08] tracking-tight text-ink sm:text-6xl">
            Better organised care.
            <br />
            <span className="relative inline-block">
              Better lives.
              <Squiggle className="absolute -bottom-3 left-0 w-full text-coral" />
            </span>
          </h1>

          <p className="mt-8 max-w-lg text-lg leading-relaxed text-ink/70">
            CarerLoop brings your residents, care homes, staff and admissions
            into one simple place - so your team spends less time on paperwork
            and more time with the people they care for.
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a
              href="/register"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-teal-brand px-7 py-3.5 font-medium text-white shadow-[0_10px_30px_-10px_rgba(15,118,110,0.6)] transition hover:bg-teal-deep"
            >
              Get started
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
            <a
              href="#how-it-works"
              className="inline-flex items-center justify-center rounded-full px-6 py-3.5 font-medium text-ink underline decoration-coral decoration-2 underline-offset-[6px] hover:text-teal-deep"
            >
              See how it works
            </a>
          </div>

          <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink/65">
            {[
              "Works on any device",
              "One place for every home",
              "Secure by design",
            ].map((t) => (
              <li key={t} className="flex items-center gap-2">
                <span className="grid h-5 w-5 place-items-center rounded-full bg-mint text-teal-brand">
                  <Check className="h-3 w-3" strokeWidth={3} />
                </span>
                {t}
              </li>
            ))}
          </ul>
        </div>

        {/* Visual */}
        <div className="relative mx-auto w-full max-w-md lg:max-w-none">
          <DotGrid className="absolute -left-8 -top-8 h-32 w-32 text-coral/40" />
          <Sparkle className="absolute -right-2 top-6 h-8 w-8 animate-float text-sun" />

          <div className="relative overflow-hidden rounded-[2.5rem] rounded-tr-[7rem] bg-mint shadow-[0_30px_60px_-25px_rgba(19,48,45,0.35)]">
            <Image
              src={images.hero}
              alt="A caregiver sharing a laugh with an elderly resident in a care home lounge"
              width={800}
              height={1000}
              priority
              className="aspect-[4/5] h-auto w-full object-cover"
            />
          </div>

          {/* floating card: today */}
          <div className="absolute -left-6 bottom-16 w-56 animate-float rounded-md bg-white p-4 shadow-[0_20px_40px_-15px_rgba(19,48,45,0.3)] sm:-left-12">
            <p className="text-xs font-medium text-ink/50">
              Today at Meadow View
            </p>
            <div className="mt-3 flex items-end justify-between">
              <div>
                <p className="text-2xl font-semibold text-ink">42</p>
                <p className="text-xs text-ink/60">residents</p>
              </div>
              <svg viewBox="0 0 80 32" className="h-8 w-20" aria-hidden="true">
                <path
                  d="M2 26c10-2 14-12 24-12s12 8 22 6S64 6 78 4"
                  fill="none"
                  stroke="#0f766e"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>

          {/* floating card: admission */}
          <div
            className="absolute -right-3 top-24 flex items-center gap-3 rounded-md bg-white py-3 pl-3 pr-5 shadow-[0_20px_40px_-15px_rgba(19,48,45,0.3)] sm:-right-8"
            style={{
              animation: "var(--animate-float)",
              animationDelay: "1.5s",
            }}
          >
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-coral-soft text-coral">
              <HeartLine className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-semibold text-ink">New admission</p>
              <p className="text-xs text-ink/55">Room 14B is ready</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
