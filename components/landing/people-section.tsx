import Image from "next/image";
import { Check } from "lucide-react";
import Reveal from "./reveal";
import { images } from "./images";
import { Blob, HeartLine, Sparkle } from "./illustrations";

const points = [
  "Every resident has one complete, up-to-date profile",
  "Families and emergency contacts are always to hand",
  "Moves between homes and rooms are recorded automatically",
];

export default function PeopleSection() {
  return (
    <section className="relative overflow-hidden bg-cream py-24 sm:py-32">
      <div className="mx-auto grid max-w-7xl items-center gap-16 px-5 sm:px-8 lg:grid-cols-2">
        {/* Image collage */}
        <Reveal>
          <div className="relative mx-auto max-w-md lg:max-w-none">
            <Blob className="absolute -left-10 -top-10 h-[115%] w-[115%] text-coral-soft" />
            <div className="relative grid grid-cols-5 gap-4">
              <div className="col-span-3 overflow-hidden rounded-[2rem] rounded-bl-[5rem] shadow-[0_25px_50px_-20px_rgba(19,48,45,0.35)]">
                <Image
                  src={images.resident}
                  alt="An elderly man smiling in a care home garden"
                  width={700}
                  height={700}
                  className="aspect-[3/4] h-full w-full object-cover"
                />
              </div>
              <div className="col-span-2 flex flex-col gap-4 pt-12">
                <div className="grid aspect-square place-items-center rounded-[2rem] bg-sun">
                  <HeartLine className="h-12 w-12 text-ink" />
                </div>
                <div className="grid aspect-square place-items-center rounded-[2rem] rounded-tr-[4rem] bg-teal-brand p-5 text-center">
                  <p className="text-sm font-medium leading-snug text-white">
                    People at the centre of care
                  </p>
                </div>
              </div>
            </div>
            <Sparkle className="absolute -bottom-4 right-10 h-7 w-7 text-coral" />
          </div>
        </Reveal>

        {/* Copy */}
        <Reveal>
          <div>
            <p className="text-sm font-medium text-teal-brand">
              Built around people
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ink sm:text-[2.75rem] sm:leading-[1.15]">
              Know every resident, not just their room number.
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-ink/65">
              Care is personal. CarerLoop keeps the details that matter in one
              calm, organised profile - so whoever is on shift has what they
              need.
            </p>

            <ul className="mt-8 space-y-4">
              {points.map((p) => (
                <li key={p} className="flex items-start gap-3 text-ink/80">
                  <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-teal-brand text-white">
                    <Check className="h-3.5 w-3.5" strokeWidth={3} />
                  </span>
                  {p}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
