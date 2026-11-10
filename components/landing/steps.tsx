import Image from "next/image";
import Reveal from "./reveal";
import { images } from "./images";
import { DashedArrow } from "./illustrations";

const steps = [
  {
    n: "01",
    title: "Set up your organisation",
    body: "Add your organisation and each of your care homes. It takes minutes, not weeks.",
    color: "bg-mint text-teal-brand",
  },
  {
    n: "02",
    title: "Invite your team",
    body: "Send email invitations to managers and caregivers. Everyone gets the right access from day one.",
    color: "bg-coral-soft text-coral",
  },
  {
    n: "03",
    title: "Welcome your residents",
    body: "Review registrations, approve admissions and place residents in the right home and room.",
    color: "bg-sun-soft text-[#a77900]",
  },
];

export default function Steps() {
  return (
    <section id="how-it-works" className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-medium text-lilac">How it works</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ink sm:text-[2.75rem] sm:leading-[1.15]">
              Up and running in three steps
            </h2>
          </div>
        </Reveal>

        <div className="relative mt-16 grid gap-12 md:grid-cols-3 md:gap-8">
          {/* connectors (desktop only) */}
          <DashedArrow className="absolute left-[24%] top-4 hidden w-[18%] text-ink/25 md:block" />
          <DashedArrow className="absolute left-[57%] top-4 hidden w-[18%] text-ink/25 md:block" />

          {steps.map((s) => (
            <Reveal key={s.n}>
              <div className="text-center md:px-4">
                <span
                  className={`mx-auto grid h-16 w-16 place-items-center rounded-full text-lg font-semibold ${s.color}`}
                >
                  {s.n}
                </span>
                <h3 className="mt-6 text-lg font-semibold text-ink">
                  {s.title}
                </h3>
                <p className="mx-auto mt-2 max-w-xs leading-relaxed text-ink/65">
                  {s.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Wide photo band */}
        <Reveal>
          <div className="relative mt-20 overflow-hidden rounded-[2rem]">
            <Image
              src={images.team}
              alt="A care home manager and caregivers talking in a bright hallway"
              width={1600}
              height={1000}
              className="h-[320px] w-full object-cover sm:h-[440px]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
            <div className="absolute bottom-0 left-0 p-7 sm:p-10">
              <p className="max-w-md text-xl font-medium leading-snug text-white sm:text-2xl">
                &ldquo;Less time chasing paperwork. More time with
                residents.&rdquo;
              </p>
              <p className="mt-2 text-sm text-white/75">
                What CarerLoop is built for
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
