import Reveal from "./reveal";
import {
  IconAdmission,
  IconChart,
  IconHome,
  IconResidents,
  IconShield,
  IconTeam,
} from "./illustrations";

const features = [
  {
    title: "Resident records",
    body: "Personal details, contacts and placement history for every resident, kept tidy and easy to find.",
    Icon: IconResidents,
    tile: "bg-mint text-teal-brand",
  },
  {
    title: "All your care homes",
    body: "Run one home or twenty. See each facility on its own, or the whole organisation at a glance.",
    Icon: IconHome,
    tile: "bg-coral-soft text-coral",
  },
  {
    title: "Simple admissions",
    body: "From the first registration to the day someone moves in, every step is clear and tracked.",
    Icon: IconAdmission,
    tile: "bg-sun-soft text-[#b8860b]",
  },
  {
    title: "Team onboarding",
    body: "Invite managers and caregivers by email. They join with exactly the access their role needs.",
    Icon: IconTeam,
    tile: "bg-lilac-soft text-lilac",
  },
  {
    title: "The right access",
    body: "Each person only sees what they should. Organisations never see each other's information.",
    Icon: IconShield,
    tile: "bg-sky-soft text-sky",
  },
  {
    title: "A clear overview",
    body: "Dashboards that show what matters to you - occupancy, pending admissions, recent activity.",
    Icon: IconChart,
    tile: "bg-mint text-teal-brand",
  },
];

export default function Features() {
  return (
    <section id="features" className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-coral">What you get</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ink sm:text-[2.75rem] sm:leading-[1.15]">
              Everything your care organisation runs on, in one place.
            </h2>
            <p className="mt-5 text-lg text-ink/65">
              No more paper folders, scattered spreadsheets or apps that
              don&apos;t talk to each other.
            </p>
          </div>
        </Reveal>

        <div className="mt-16 grid gap-x-10 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ title, body, Icon, tile }) => (
            <Reveal key={title}>
              <div className="group">
                <span
                  className={`grid h-14 w-14 place-items-center rounded-md transition-transform duration-300 group-hover:-rotate-6 ${tile}`}
                >
                  <Icon />
                </span>
                <h3 className="mt-6 text-lg font-semibold text-ink">{title}</h3>
                <p className="mt-2 leading-relaxed text-ink/65">{body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
