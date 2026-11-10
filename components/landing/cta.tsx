import { ArrowRight } from "lucide-react";
import { DotGrid, HeartLine, Sparkle } from "./illustrations";

export default function Cta() {
  return (
    <section id="get-started" className="bg-cream pb-24 sm:pb-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-ink px-8 py-16 text-center sm:px-16 sm:py-24">
          {/* decoration */}
          <DotGrid className="absolute -left-6 -top-6 h-40 w-40 text-white/10" />
          <HeartLine className="absolute -right-6 bottom-6 h-40 w-40 rotate-12 text-coral/30" />
          <Sparkle className="absolute left-[18%] bottom-10 h-6 w-6 text-sun" />
          <Sparkle className="absolute right-[22%] top-10 h-4 w-4 text-mint" />

          <h2 className="relative mx-auto max-w-2xl text-3xl font-semibold tracking-tight text-white sm:text-5xl sm:leading-[1.1]">
            Ready to bring calm to your care operations?
          </h2>
          <p className="relative mx-auto mt-5 max-w-lg text-lg text-white/70">
            See how CarerLoop can work for your organisation and care homes.
          </p>

          <div className="relative mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <a
              href="/register"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-sun px-7 py-3.5 font-medium text-ink transition hover:bg-[#f9d27a]"
            >
              Get started
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
            <a
              href="#features"
              className="inline-flex items-center justify-center rounded-full border border-white/25 px-7 py-3.5 font-medium text-white transition hover:bg-white/10"
            >
              Explore features
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
