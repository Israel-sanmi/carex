"use client";

import { useState } from "react";
import {
  Sun,
  Pill,
  Utensils,
  DoorOpen,
  Moon,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import Reveal from "./reveal";
import { Blob, Sparkle, HeartLine } from "./illustrations";

const timelineEvents = [
  {
    time: "07:30",
    label: "Morning Handover",
    icon: Sun,
    accent: "bg-sun text-[#9a6700]",
    borderAccent: "border-sun",
    badge: "Shift Change",
    title: "Smooth handover, zero lost notes",
    summary:
      "Night and day shifts meet in the lounge. Instead of deciphering paper logbooks, the lead nurse opens CarerLoop's morning summary on the tablet. Every resident's sleep quality and overnight observations are already organized.",
    activeResident: "Arthur Pendelton (Room 08A)",
    note: "Slept peacefully through the night. Physio scheduled for 10:15 AM.",
    stats: "100% staff briefed in 8 minutes",
  },
  {
    time: "09:15",
    label: "Medication & Rounds",
    icon: Pill,
    accent: "bg-teal-brand text-white",
    borderAccent: "border-teal-brand",
    badge: "Clinical Care",
    title: "Care at the bedside, not behind a desk",
    summary:
      "Caregivers carry lightweight tablets on room rounds. Eleanor Vance is due for morning blood pressure monitoring and medication. One tap verifies her allergy safety check and logs the vitals immediately.",
    activeResident: "Eleanor Vance (Room 14B)",
    note: "Blood pressure 124/82 mmHg recorded. Metformin 500mg administered.",
    stats: "Zero missed medication rounds",
  },
  {
    time: "12:30",
    label: "Lunch & Social Time",
    icon: Utensils,
    accent: "bg-coral text-white",
    borderAccent: "border-coral",
    badge: "Nutrition & Wellbeing",
    title: "Every dietary need automatically respected",
    summary:
      "Kitchen staff and carers reference instant dietary texture flags (soft texture, low sodium, diabetic-friendly). Hydration charts update in real-time as carers assist with drinks in the conservatory.",
    activeResident: "Grace O'Connor (Room 22C)",
    note: "Diabetic-friendly lunch enjoyed. 450ml fluid intake logged.",
    stats: "Instant kitchen allergy sync",
  },
  {
    time: "15:00",
    label: "Admissions & Placements",
    icon: DoorOpen,
    accent: "bg-lilac text-white",
    borderAccent: "border-lilac",
    badge: "Admissions",
    title: "Welcoming a new resident with confidence",
    summary:
      "The care home manager opens the admissions pipeline. A newly approved resident is arriving next Monday. The room is assigned, emergency contacts are saved, and the care plan template is ready before they walk through the door.",
    activeResident: "Robert Sterling (Admitted to Room 15A)",
    note: "Room 15A prepared. Welcome pack and family contact portal active.",
    stats: "Admission completed in 24 hours",
  },
  {
    time: "18:45",
    label: "Evening & Family Updates",
    icon: Moon,
    accent: "bg-sky text-white",
    borderAccent: "border-sky",
    badge: "Transparency",
    title: "Peace of mind for families",
    summary:
      "As evening quiet hours begin, authorized family members can see that their loved ones had a warm, active day. Evening staff log dinner and prepare bedtime routines with complete continuity.",
    activeResident: "David Vance (Next-of-Kin)",
    note: "Family portal notified: 'Mum had a great afternoon in the garden.'",
    stats: "Family questions reduced by 70%",
  },
];

export default function DayInTheLife() {
  const [selectedIdx, setSelectedIdx] = useState(1);
  const activeEvent = timelineEvents[selectedIdx];
  const ActiveIcon = activeEvent.icon;

  return (
    <section
      id="shift-flow"
      className="relative overflow-hidden bg-cream py-24 sm:py-32"
    >
      {/* Playful background blobs */}
      <Blob className="pointer-events-none absolute -left-48 top-10 h-[500px] w-[500px] text-sun-soft/50" />
      <Blob className="pointer-events-none absolute -right-36 bottom-0 h-[450px] w-[450px] text-mint/60" />

      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-medium text-teal-brand">
              A day in the home
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ink sm:text-[2.75rem] sm:leading-[1.15]">
              How CarerLoop feels from sunrise to sunset.
            </h2>
            <p className="mt-4 text-base sm:text-lg text-ink/65">
              Follow a normal day across your care team - where every task flows
              smoothly into the next.
            </p>
          </div>
        </Reveal>

        {/* Time Selector Pills */}
        <div className="mt-14 flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-4 pt-2">
          {timelineEvents.map((ev, idx) => {
            const isSelected = selectedIdx === idx;
            const Icon = ev.icon;
            return (
              <button
                key={ev.time}
                onClick={() => setSelectedIdx(idx)}
                className={`group flex items-center gap-2.5 rounded-md px-4 py-2.5 text-xs sm:text-sm font-medium transition-all duration-300 cursor-pointer whitespace-nowrap ${
                  isSelected
                    ? "bg-ink text-white shadow-md scale-105"
                    : "bg-white text-ink/70 hover:text-ink hover:bg-white/90 border border-ink/10"
                }`}
              >
                <span
                  className={`grid h-6 w-6 place-items-center rounded-md text-xs transition-transform group-hover:scale-110 ${ev.accent}`}
                >
                  <Icon className="h-3.5 w-3.5" />
                </span>
                <span className="font-semibold">{ev.time}</span>
                <span className="hidden md:inline text-xs opacity-75">
                  {ev.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Animated Interactive Shift Card */}
        <div className="mt-8">
          <div className="relative rounded-md bg-white p-3 sm:p-5 shadow-[0_20px_50px_-20px_rgba(19,48,45,0.18)] border border-ink/10 overflow-hidden">
            {/* Top decorative badge */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-ink/10">
              <div className="flex items-center gap-3">
                <div
                  className={`grid h-12 w-12 place-items-center rounded-2xl shadow-xs transition-transform duration-300 ${activeEvent.accent}`}
                >
                  <ActiveIcon className="h-6 w-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-teal-brand">
                      {activeEvent.time}
                    </span>
                    <span className="text-xs px-2.5 py-0.5 rounded-md bg-cream text-ink font-semibold border border-ink/10">
                      {activeEvent.badge}
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-semibold text-ink mt-0.5">
                    {activeEvent.title}
                  </h3>
                </div>
              </div>

              <span className="inline-flex items-center gap-1.5 rounded-md bg-mint px-3 py-1 text-xs font-semibold text-teal-deep">
                <CheckCircle2 className="h-3.5 w-3.5 text-teal-brand" />
                {activeEvent.stats}
              </span>
            </div>

            {/* Main content grid */}
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left narrative */}
              <div className="lg:col-span-7 space-y-4">
                <p className="text-base sm:text-lg leading-relaxed text-ink/75">
                  {activeEvent.summary}
                </p>

                <div className="pt-2 flex flex-wrap gap-2 text-xs">
                  <span className="px-3 py-1 rounded-md bg-cream text-ink/80 border border-ink/10">
                    Live updates on iPad & Android
                  </span>
                  <span className="px-3 py-1 rounded-md bg-cream text-ink/80 border border-ink/10">
                    Auto-synced to manager console
                  </span>
                </div>
              </div>

              {/* Right live observation card preview */}
              <div className="lg:col-span-5">
                <div className="rounded-md border border-ink/10 bg-cream/70 p-5 space-y-3 shadow-xs">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-ink/60 uppercase tracking-wider text-[10px]">
                      Resident Profile Snapshot
                    </span>
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-teal-brand">
                      <span className="h-1.5 w-1.5 rounded-md bg-teal-brand animate-ping" />
                      Live Log
                    </span>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm font-bold text-ink">
                      {activeEvent.activeResident}
                    </p>
                    <p className="text-xs text-ink/70 leading-relaxed bg-white/80 p-3 rounded-xl border border-ink/5">
                      &ldquo;{activeEvent.note}&rdquo;
                    </p>
                  </div>

                  <div className="pt-1 flex items-center justify-between text-[11px] text-ink/60">
                    <span>Logged by Lead Carer</span>
                    <span className="text-emerald-700 font-medium">
                      Verified ✓
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline navigation arrows */}
            <div className="mt-8 pt-6 border-t border-ink/5 flex items-center justify-between text-xs text-ink/60">
              <button
                onClick={() =>
                  setSelectedIdx((prev) =>
                    prev > 0 ? prev - 1 : timelineEvents.length - 1,
                  )
                }
                className="hover:text-ink font-semibold transition-colors cursor-pointer"
              >
                ← Earlier in the day
              </button>

              <div className="flex items-center gap-1.5">
                {timelineEvents.map((_, i) => (
                  <span
                    key={i}
                    onClick={() => setSelectedIdx(i)}
                    className={`h-2 rounded-md transition-all duration-300 cursor-pointer ${
                      selectedIdx === i ? "w-6 bg-teal-brand" : "w-2 bg-ink/20"
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={() =>
                  setSelectedIdx((prev) =>
                    prev < timelineEvents.length - 1 ? prev + 1 : 0,
                  )
                }
                className="hover:text-ink font-semibold transition-colors cursor-pointer"
              >
                Later in the day →
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
