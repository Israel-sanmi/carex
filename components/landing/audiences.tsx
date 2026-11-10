import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import Reveal from "./reveal";
import { images } from "./images";

const audiences = [
  {
    title: "Organisations",
    body: "Oversee every care home, manage your people and keep an eye on the whole picture.",
    bg: "bg-teal-brand",
    text: "text-white",
    sub: "text-white/75",
  },
  {
    title: "Care home managers",
    body: "Coordinate admissions, placements and staff for your home from one dashboard.",
    bg: "bg-sun",
    text: "text-ink",
    sub: "text-ink/70",
  },
  {
    title: "Caregivers",
    body: "See the information you need for the residents you support - on a tablet, phone or desktop.",
    bg: "bg-coral",
    text: "text-white",
    sub: "text-white/80",
  },
];

export default function Audiences() {
  return (
    <section id="who" className="bg-cream pt-24 sm:pt-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div className="max-w-xl">
              <p className="text-sm font-medium text-coral">
                Who it&apos;s for
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ink sm:text-[2.75rem] sm:leading-[1.15]">
                One platform, shaped around each role.
              </h2>
            </div>
            <p className="max-w-sm text-ink/65">
              Everyone sees what&apos;s relevant to them - nothing more, nothing
              less.
            </p>
          </div>
        </Reveal>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {audiences.map((a) => (
            <Reveal key={a.title}>
              <div
                className={`group flex h-full min-h-[260px] flex-col justify-between rounded-[2rem] p-8 transition-transform duration-300 hover:-translate-y-1 ${a.bg}`}
              >
                <ArrowUpRight
                  className={`h-7 w-7 self-end transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 ${a.text}`}
                />
                <div>
                  <h3 className={`text-2xl font-semibold ${a.text}`}>
                    {a.title}
                  </h3>
                  <p className={`mt-3 leading-relaxed ${a.sub}`}>{a.body}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Device strip */}
        <Reveal>
          <div className="mt-5 grid items-center gap-8 overflow-hidden rounded-[2rem] bg-white md:grid-cols-2">
            <div className="p-8 sm:p-12">
              <h3 className="text-2xl font-semibold text-ink">
                Install it like an app
              </h3>
              <p className="mt-3 max-w-md leading-relaxed text-ink/65">
                CarerLoop works in the browser and can be added to the home
                screen of any tablet, phone or computer - no app store needed.
              </p>
            </div>
            <Image
              src={images.tablet}
              alt="A caregiver using a tablet at a care home reception desk"
              width={1200}
              height={900}
              className="h-full max-h-[320px] w-full object-cover"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
