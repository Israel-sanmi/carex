"use client";

import { useEffect, useState } from "react";
import {
  Check,
  ClipboardCheck,
  Cloud,
  CloudOff,
  FileClock,
  HeartHandshake,
  Lock,
  MessageCircleHeart,
  ShieldCheck,
  UserPlus,
  Unlock,
} from "lucide-react";
import { Spotlight } from "@/components/ui/motion";

/* Shared hook: advance a step counter on an interval (paused for reduced motion). */
function useTicker(length: number, ms: number) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setI((v) => (v + 1) % length), ms);
    return () => clearInterval(t);
  }, [length, ms]);
  return i;
}

function Tile({
  className = "",
  icon: Icon,
  eyebrow,
  title,
  body,
  children,
}: {
  className?: string;
  icon: typeof Check;
  eyebrow: string;
  title: string;
  body: string;
  children: React.ReactNode;
}) {
  return (
    <Spotlight
      className={`group glass-card rounded-md border border-white/80 dark:border-white/10 p-6 overflow-hidden flex flex-col transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-emerald-900/10 ${className}`}
    >
      <div className="relative flex items-center gap-2 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
        <span className="grid place-items-center w-7 h-7 rounded-md bg-emerald-500/10 transition-transform duration-500 group-hover:rotate-[-8deg] group-hover:scale-110">
          <Icon className="w-3.5 h-3.5" />
        </span>
        {eyebrow}
      </div>
      <h3 className="relative mt-3 text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight">{title}</h3>
      <p className="relative mt-1.5 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{body}</p>
      <div className="relative mt-6 flex-1 flex flex-col justify-end">{children}</div>
    </Spotlight>
  );
}

/* 1. Handover checklist that ticks itself off ------------------------------ */
const handoverItems = [
  "Medication round reconciled",
  "Falls risk reviewed • Room 08A",
  "Fluids & nutrition logged",
  "Night observations signed",
  "Family call scheduled • 14B",
];
function HandoverDemo() {
  const step = useTicker(handoverItems.length + 2, 1100);
  const done = Math.min(step, handoverItems.length);
  const pct = Math.round((done / handoverItems.length) * 100);
  return (
    <div className="rounded-md bg-white/80 dark:bg-slate-900/60 border border-slate-200/70 dark:border-white/10 p-4 shadow-sm">
      <div className="flex items-center justify-between text-xs mb-3">
        <span className="font-semibold text-slate-700 dark:text-slate-200">Morning handover • West Wing</span>
        <span className="font-mono text-emerald-600 dark:text-emerald-400 tabular-nums">{pct}%</span>
      </div>
      <div className="h-1.5 rounded-full bg-slate-200/80 dark:bg-white/10 overflow-hidden mb-3">
        <div
          className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-[width] duration-700 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
      <ul className="space-y-2">
        {handoverItems.map((item, i) => {
          const checked = i < done;
          return (
            <li key={item} className="flex items-center gap-2.5 text-sm">
              <span
                className={`grid place-items-center w-5 h-5 rounded-md border transition-all duration-300 ${
                  checked
                    ? "bg-emerald-500 border-emerald-500 text-white scale-100"
                    : "border-slate-300 dark:border-white/20 scale-90"
                }`}
              >
                <Check className={`w-3 h-3 stroke-[3] transition-opacity ${checked ? "opacity-100" : "opacity-0"}`} />
              </span>
              <span
                className={`transition-colors duration-300 ${
                  checked ? "text-slate-400 dark:text-slate-500 line-through decoration-emerald-500/40" : "text-slate-700 dark:text-slate-200"
                }`}
              >
                {item}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/* 2. Offline queue that syncs when connectivity returns -------------------- */
function OfflineDemo() {
  const step = useTicker(8, 900); // 0-4 offline queuing, 5-7 online syncing
  const online = step >= 5;
  const queued = online ? Math.max(0, 4 - (step - 4) * 2) : step;
  return (
    <div className="rounded-md bg-white/80 dark:bg-slate-900/60 border border-slate-200/70 dark:border-white/10 p-4 shadow-sm space-y-3">
      <div className="flex items-center justify-between">
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-colors duration-500 ${
            online ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400" : "bg-amber-500/10 text-amber-700 dark:text-amber-400"
          }`}
        >
          {online ? <Cloud className="w-3.5 h-3.5" /> : <CloudOff className="w-3.5 h-3.5" />}
          {online ? "Back online • syncing" : "Offline • basement corridor"}
        </span>
        <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 tabular-nums">{queued} queued</span>
      </div>
      <div className="flex gap-1.5">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`h-8 flex-1 rounded-md border transition-all duration-500 ${
              i < queued
                ? "bg-amber-400/15 border-amber-400/40 translate-y-0"
                : online
                  ? "bg-emerald-500/15 border-emerald-500/30 -translate-y-1"
                  : "bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

/* 3. Immutable audit ledger scrolling past --------------------------------- */
const ledger = [
  ["09:15:02", "MEDICATION_ADMINISTERED", "Nurse S. Mitchell"],
  ["09:16:40", "CARE_PLAN_UPDATED", "Mgr. S. Jenkins"],
  ["09:18:11", "ROLE_ASSIGNED", "Admin A. Finch"],
  ["09:21:37", "OBSERVATION_LOGGED", "Carer M. Cole"],
  ["09:24:05", "ADMISSION_APPROVED", "Mgr. S. Jenkins"],
  ["09:26:52", "INVITATION_SENT", "Admin A. Finch"],
];
function LedgerDemo() {
  return (
    <div className="relative h-40 overflow-hidden rounded-md bg-slate-950 border border-white/10 [mask-image:linear-gradient(to_bottom,transparent,#000_20%,#000_80%,transparent)]">
      <div className="animate-[ledger_14s_linear_infinite] hover:[animation-play-state:paused]">
        {[...ledger, ...ledger].map(([t, a, who], i) => (
          <div key={i} className="flex items-center gap-3 px-4 py-2 font-mono text-[11px] border-b border-white/5">
            <span className="text-slate-500">{t}</span>
            <span className="text-emerald-400 truncate">{a}</span>
            <span className="ml-auto text-slate-400 truncate hidden sm:inline">{who}</span>
            <Lock className="w-3 h-3 text-slate-600 shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}

/* 4. Admissions pipeline with a resident moving through stages ------------- */
const stages = ["Enquiry", "Verified", "Assessed", "Bed allocated", "Admitted"];
function PipelineDemo() {
  const step = useTicker(stages.length + 1, 1000);
  const at = Math.min(step, stages.length - 1);
  return (
    <div className="space-y-3">
      <div className="relative flex items-center justify-between">
        <div className="absolute left-2 right-2 top-1/2 h-0.5 -translate-y-1/2 bg-slate-200 dark:bg-white/10">
          <div
            className="h-full bg-emerald-500 transition-[width] duration-700 ease-out"
            style={{ width: `${(at / (stages.length - 1)) * 100}%` }}
          />
        </div>
        {stages.map((s, i) => (
          <span
            key={s}
            className={`relative grid place-items-center w-4 h-4 rounded-full border-2 transition-all duration-500 ${
              i <= at ? "bg-emerald-500 border-emerald-500 scale-110" : "bg-white dark:bg-slate-900 border-slate-300 dark:border-white/20"
            } ${i === at ? "animate-ring" : ""}`}
          />
        ))}
      </div>
      <div className="flex justify-between text-[10px] sm:text-[11px] font-medium">
        {stages.map((s, i) => (
          <span key={s} className={`transition-colors ${i <= at ? "text-slate-800 dark:text-slate-100" : "text-slate-400"}`}>
            {s}
          </span>
        ))}
      </div>
    </div>
  );
}

/* 5. Role-based access cycling through roles ------------------------------- */
const roleViews = [
  { role: "Caregiver", sees: ["Care round", "Allergies", "Observations"], hidden: "Billing & audit" },
  { role: "Manager", sees: ["Admissions", "Rota", "Care plans"], hidden: "Other homes" },
  { role: "Family", sees: ["Wellbeing", "Menu", "Activities"], hidden: "Clinical notes" },
];
function RolesDemo() {
  const i = useTicker(roleViews.length, 2600);
  const v = roleViews[i];
  return (
    <div className="space-y-3">
      <div className="flex gap-1.5">
        {roleViews.map((r, idx) => (
          <span
            key={r.role}
            className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all duration-300 ${
              idx === i ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/25" : "bg-slate-100 dark:bg-white/5 text-slate-500"
            }`}
          >
            {r.role}
          </span>
        ))}
      </div>
      <div key={v.role} className="space-y-1.5 animate-rise">
        {v.sees.map((s) => (
          <div key={s} className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
            <Unlock className="w-3.5 h-3.5 text-emerald-500" /> {s}
          </div>
        ))}
        <div className="flex items-center gap-2 text-sm text-slate-400 line-through">
          <Lock className="w-3.5 h-3.5" /> {v.hidden}
        </div>
      </div>
    </div>
  );
}

/* 6. Family portal message with typing indicator --------------------------- */
function FamilyDemo() {
  const step = useTicker(3, 2200);
  return (
    <div className="space-y-2">
      <div className="max-w-[85%] rounded-md rounded-bl-none bg-slate-100 dark:bg-white/10 px-3 py-2 text-sm text-slate-700 dark:text-slate-200">
        How was Mum&apos;s morning?
      </div>
      <div className="flex justify-end">
        {step === 0 ? (
          <div className="flex gap-1 rounded-md rounded-br-none bg-emerald-600 px-3 py-3">
            {[0, 1, 2].map((d) => (
              <span key={d} className="w-1.5 h-1.5 rounded-full bg-white/80 animate-bounce" style={{ animationDelay: `${d * 120}ms` }} />
            ))}
          </div>
        ) : (
          <div className="max-w-[85%] rounded-md rounded-br-none bg-emerald-600 px-3 py-2 text-sm text-white animate-pop-in">
            Lovely! Garden walk at 10:30 and she enjoyed the piano 🎹
          </div>
        )}
      </div>
    </div>
  );
}

export default function Bento() {
  return (
    <section id="platform" className="relative py-20 lg:py-28 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass border border-emerald-500/20 text-xs font-semibold text-emerald-700 dark:text-emerald-400 mb-4 shadow-xs">
            The Platform
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white tracking-tight">
            Everything your home runs on,{" "}
            <span className="font-serif italic font-normal gradient-text-animated">quietly working.</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
            From the first enquiry to the last shift of the night, every workflow lives in one calm, connected place.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 lg:gap-5">
          <Tile
            className="md:col-span-3 lg:col-span-3 md:row-span-2"
            icon={ClipboardCheck}
            eyebrow="Digital handovers"
            title="45-minute handovers, now eight."
            body="Verified checklists replace sticky notes, so nothing slips between shifts."
          >
            <HandoverDemo />
          </Tile>
          <Tile
            className="md:col-span-3"
            icon={CloudOff}
            eyebrow="Offline-first"
            title="Wi-Fi drops. Care doesn't."
            body="Records queue on the device and sync the moment a signal returns."
          >
            <OfflineDemo />
          </Tile>
          <Tile
            className="md:col-span-3"
            icon={UserPlus}
            eyebrow="Admissions pipeline"
            title="Enquiry to move-in, in one flow."
            body="Verification, assessment and bed allocation, all tracked."
          >
            <PipelineDemo />
          </Tile>
          <Tile
            className="md:col-span-2"
            icon={ShieldCheck}
            eyebrow="Role-based access"
            title="Everyone sees just enough."
            body="Strict permissions per role, per home."
          >
            <RolesDemo />
          </Tile>
          <Tile
            className="md:col-span-2"
            icon={FileClock}
            eyebrow="Immutable audit"
            title="Inspection-ready, always."
            body="Every action stamped with who, what and when."
          >
            <LedgerDemo />
          </Tile>
          <Tile
            className="md:col-span-2"
            icon={MessageCircleHeart}
            eyebrow="Family portal"
            title="Families feel close."
            body="Gentle, transparent updates without the phone tag."
          >
            <FamilyDemo />
          </Tile>
        </div>

        <p className="mt-8 flex items-center justify-center gap-2 text-sm text-slate-500 dark:text-slate-400">
          <HeartHandshake className="w-4 h-4 text-emerald-500" />
          Designed with registered managers, nurses and caregivers.
        </p>
      </div>
    </section>
  );
}
