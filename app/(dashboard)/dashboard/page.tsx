"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  Activity,
  AlertCircle,
  ArrowRight,
  ArrowUpRight,
  BedDouble,
  Building2,
  CheckCircle2,
  ClipboardCheck,
  Clock,
  Droplets,
  FileClock,
  Heart,
  Home,
  Mail,
  Pill,
  ShieldCheck,
  Sparkles,
  UserCheck,
  UserPlus,
  Users,
  Utensils,
  Wifi,
} from "lucide-react";
import { useRole } from "@/lib/role-context";
import StatCard from "@/components/dashboard/stat-card";
import { Avatar, Badge, Panel, StatusBadge, btn } from "@/components/dashboard/ui";
import { AreaTrend, BarList, RingMeter } from "@/components/dashboard/charts";

/* ------------------------------------------------------------------ */
/* Client-only time strings (Cache Components forbids Date in prerender) */
/* ------------------------------------------------------------------ */
const noopSubscribe = () => () => {};
const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
};
const getToday = () =>
  new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });

const PLATFORM_ROLES = ["SUPER_ADMIN", "SYSTEM_ADMIN", "SYSTEM_SUPPORT"];

/* ------------------------------------------------------------------ */
/* Placeholder content (replace with API data as endpoints land)       */
/* ------------------------------------------------------------------ */

// Sample series for the trend panels. Clearly badged as sample in the UI.
const WEEKS = ["W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8", "W9", "W10", "W11", "W12"];
const sampleSeries = (values: number[]) => WEEKS.map((label, i) => ({ label, value: values[i] }));
const platformResidentsTrend = sampleSeries([2104, 2131, 2158, 2172, 2210, 2236, 2259, 2281, 2320, 2352, 2390, 2418]);
const groupOccupancyTrend = sampleSeries([88.1, 88.6, 89.4, 89.0, 90.2, 90.8, 91.1, 91.6, 91.9, 92.3, 92.5, 92.7]);
const homeOccupancyTrend = sampleSeries([81.3, 83.3, 83.3, 85.4, 85.4, 87.5, 85.4, 87.5, 87.5, 89.6, 87.5, 87.5]);

const organisations = [
  { name: "St. Jude Care Services Group", homes: 4, residents: 164, id: "org_99c301ae" },
  { name: "Oakridge Healthcare Trust", homes: 3, residents: 112, id: "org_54a88b12" },
  { name: "Waverley Assisted Care", homes: 2, residents: 68, id: "org_77d12f90" },
];

const platformAudit = [
  { title: "Organisation Created", detail: "Super Admin Victoria S. created Waverley Assisted Care.", ago: "10m ago", icon: Building2, tone: "green" as const },
  { title: "Role Assigned", detail: "Dr. Alistair Finch assigned Care Home Manager to Sarah Jenkins.", ago: "45m ago", icon: UserCheck, tone: "sky" as const },
  { title: "Security Policy Synced", detail: "OpenAPI /api/v1 tenant context isolation check passed.", ago: "2h ago", icon: ShieldCheck, tone: "violet" as const },
];

const careHomes = [
  { name: "Meadow View Lodge", occupied: 42, beds: 48, manager: "Sarah Jenkins, RN", staff: 14, intake: 2 },
  { name: "Oakridge Manor Residence", occupied: 34, beds: 36, manager: "David Roberts", staff: 12, intake: 1 },
  { name: "Willow Creek Court", occupied: 28, beds: 30, manager: "Claire Henderson", staff: 9, intake: 2 },
  { name: "Highland Pines Nursing", occupied: 50, beds: 52, manager: "Patricia Gomez, RN", staff: 18, intake: 1 },
];

const pendingAdmissions = [
  { name: "Robert Sterling", age: 84, ref: "REG-2026-9904", detail: "Care Level: Residential • Desired Room: Ground Floor", verified: "Email Verified by Guardian" },
  { name: "Beatrice Miller", age: 81, ref: "REG-2026-8812", detail: "Care Level: Dementia Support • Dietary: Diabetic-Friendly", verified: "Email Verified by Son" },
];

const floorObservations = [
  { room: "Room 14B", name: "Eleanor Vance", note: "Morning vitals & Metformin 500mg logged by Nurse Sarah M.", ago: "3m ago", icon: Pill },
  { room: "Room 08A", name: "Arthur Pendelton", note: "Assisted walking exercise completed by Carer Marcus C.", ago: "18m ago", icon: Activity },
  { room: "Room 22C", name: "Grace O’Connor", note: "Dietary texture note: Moistened lunch enjoyed, 450ml fluids.", ago: "42m ago", icon: Utensils },
];

const careRound = [
  { room: "14B", name: "Eleanor Vance", meta: "Level 3 Residential • Age 82", status: "done" as const, note: "Next: 12:30 PM Diabetic-friendly lunch & hydration.", alert: "Severe Allergy: Penicillin & Tree Nuts", action: undefined },
  { room: "08A", name: "Arthur Pendelton", meta: "Assisted Mobility • Age 79", status: "due" as const, note: "Task: Assisted walking exercise & morning fluid log.", action: "Record Care Check" },
  { room: "22C", name: "Grace O’Connor", meta: "Nutritional Review • Age 86", status: "scheduled" as const, note: "Dietary directive: Soft moistened texture meals only.", action: "View Care Directives" },
  { room: "15A", name: "Robert Sterling", meta: "Newly Admitted • Age 84", status: "intake" as const, note: "Task: Welcome introduction & room orientation completed.", action: "Open Dossier" },
];

/* ------------------------------------------------------------------ */
/* Small presentational helpers                                        */
/* ------------------------------------------------------------------ */

function SampleBadge() {
  return (
    <Badge tone="slate" icon={Sparkles}>
      Sample data
    </Badge>
  );
}

function PanelLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="group inline-flex items-center gap-1 text-xs font-semibold text-teal-brand hover:text-teal-deep"
    >
      {children}
      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
    </Link>
  );
}

function QuickAction({ href, icon: Icon, label, hint }: { href: string; icon: LucideIcon; label: string; hint: string }) {
  return (
    <Link
      href={href}
      className="group relative flex items-center gap-3 p-3.5 rounded-md bg-white border border-ink/[0.08] hover:border-teal-brand/30 transition-all hover:-translate-y-0.5"
    >
      <span className="grid place-items-center w-10 h-10 rounded-md bg-mint text-teal-brand shrink-0 transition-all group-hover:bg-teal-brand group-hover:text-white group-hover:rotate-[-6deg]">
        <Icon className="h-[18px] w-[18px]" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold text-ink truncate">{label}</span>
        <span className="block text-[11px] text-ink/50 truncate">{hint}</span>
      </span>
      <ArrowUpRight className="h-4 w-4 text-ink/25 transition-all group-hover:text-teal-brand group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
    </Link>
  );
}

function Timeline({
  items,
}: {
  items: { title: React.ReactNode; detail: React.ReactNode; ago: string; icon: LucideIcon }[];
}) {
  return (
    <ol className="relative">
      {items.map((it, i) => {
        const Icon = it.icon;
        return (
          <li key={i} className="relative flex gap-3.5 pb-5 last:pb-0">
            {i < items.length - 1 && (
              <span className="absolute left-[15px] top-9 bottom-0 w-px bg-gradient-to-b from-ink/15 to-transparent" />
            )}
            <span className="relative grid place-items-center w-8 h-8 rounded-full bg-mint text-teal-brand ring-4 ring-white shrink-0">
              <Icon className="h-3.5 w-3.5" />
              {i === 0 && <span className="absolute inset-0 rounded-full animate-ring" />}
            </span>
            <div className="min-w-0 flex-1 pt-0.5">
              <div className="flex items-baseline justify-between gap-3">
                <p className="text-sm font-semibold text-ink truncate">{it.title}</p>
                <span className="text-[11px] text-ink/40 shrink-0 tabular-nums">{it.ago}</span>
              </div>
              <p className="mt-0.5 text-xs text-ink/60 leading-relaxed">{it.detail}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function DashboardPage() {
  const { currentRole, user } = useRole();
  const greetingText = useSyncExternalStore(noopSubscribe, getGreeting, () => "Welcome back");
  const today = useSyncExternalStore(noopSubscribe, getToday, () => "");
  const isPlatform = PLATFORM_ROLES.includes(currentRole);
  const isManagerial = isPlatform || currentRole === "ORGANISATION_ADMIN" || currentRole === "CARE_HOME_MANAGER";

  const firstName = user.name?.split(" ")[0] || user.name;
  const residentInitials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "R";

  return (
    <div className="space-y-6">
      {/* ============================================================ */}
      {/* Welcome banner                                                */}
      {/* ============================================================ */}
      <section className="relative overflow-hidden rounded-md text-white bg-[linear-gradient(115deg,#05302d_0%,#0b4f4a_35%,#0f766e_70%,#13a383_100%)] shadow-xl shadow-teal-900/15">
        <div className="absolute inset-0 bg-grid opacity-40 pointer-events-none" />
        <div className="absolute -right-20 -top-28 w-96 h-96 rounded-full bg-emerald-300/25 blur-3xl animate-float-slow pointer-events-none" />
        <div className="absolute right-1/4 -bottom-40 w-80 h-80 rounded-full bg-amber-200/20 blur-3xl pointer-events-none" />
        {/* Decorative loop mark */}
        <svg
          viewBox="0 0 200 120"
          className="absolute right-6 top-1/2 -translate-y-1/2 w-72 opacity-[0.12] hidden md:block pointer-events-none animate-float-slow"
          aria-hidden="true"
        >
          <circle cx="75" cy="60" r="48" fill="none" stroke="white" strokeWidth="10" />
          <circle cx="125" cy="60" r="48" fill="none" stroke="#f6c453" strokeWidth="10" />
        </svg>

        <div className="relative p-5 sm:p-8 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-2.5 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] px-2.5 py-1 rounded-full bg-white/15 border border-white/20 backdrop-blur-md font-semibold">
                {user.roleTier}
              </span>
              <span className="text-xs text-emerald-100/90 font-medium">{user.roleTitle}</span>
            </div>
            <h1 className="text-[1.65rem] sm:text-4xl font-bold tracking-tight leading-tight">
              {greetingText},{" "}
              <span className="font-serif italic font-normal text-emerald-100">{firstName}</span>
            </h1>
            <p className="text-xs sm:text-sm text-emerald-50/80 flex flex-wrap items-center gap-x-2 gap-y-1">
              <span className="inline-flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5" />
                {user.organisationName}
              </span>
              <span className="opacity-40">•</span>
              <span className="inline-flex items-center gap-1.5">
                <Home className="h-3.5 w-3.5" />
                {user.careHomeName}
              </span>
              {today && (
                <>
                  <span className="opacity-40 hidden sm:inline">•</span>
                  <span className="hidden sm:inline">{today}</span>
                </>
              )}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {currentRole === "CAREGIVER" && user.shiftBadge && (
              <span className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-white/15 border border-white/20 backdrop-blur-md text-xs font-semibold">
                <span className="h-2 w-2 rounded-full bg-emerald-300 animate-ring" />
                {user.shiftBadge}
              </span>
            )}
            {currentRole === "RESIDENT" && (
              <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md bg-white/15 border border-white/20 backdrop-blur-md text-xs font-semibold">
                <Heart className="h-3.5 w-3.5 text-coral-soft" />
                {user.assignedRoom ? `Room ${user.assignedRoom}` : "Resident Portal"}
              </span>
            )}
            <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md bg-white/10 border border-white/15 text-xs font-medium text-emerald-50">
              <Wifi className="h-3.5 w-3.5 text-emerald-300" />
              All systems synced
            </span>
            <Link
              href="/dashboard/settings"
              className="group inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-white text-teal-deep text-xs font-semibold shadow-lg shadow-teal-950/20 hover:-translate-y-0.5 transition-all"
            >
              Preferences
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* Quick actions (managerial roles)                              */}
      {/* ============================================================ */}
      {isManagerial && (
        <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
          {isPlatform ? (
            <>
              <QuickAction href="/dashboard/organisations" icon={Building2} label="Organisations" hint="Onboard & manage tenants" />
              <QuickAction href="/dashboard/care-homes" icon={Home} label="Care homes" hint="Facilities across tenants" />
              <QuickAction href="/dashboard/users" icon={UserCheck} label="Users & roles" hint="Access across the platform" />
              <QuickAction href="/dashboard/audit-logs" icon={FileClock} label="Audit ledger" hint="Immutable activity trail" />
            </>
          ) : (
            <>
              <QuickAction href="/dashboard/registrations" icon={UserPlus} label="Review admissions" hint="Intake awaiting decisions" />
              <QuickAction href="/dashboard/residents" icon={Users} label="Residents" hint="Profiles & care records" />
              <QuickAction href="/dashboard/invitations" icon={Mail} label="Invite staff" hint="Send role-based invitations" />
              <QuickAction href="/dashboard/care-homes" icon={Home} label="Care homes" hint="Facilities & capacity" />
            </>
          )}
        </section>
      )}

      {/* ============================================================ */}
      {/* 1. PLATFORM                                                   */}
      {/* ============================================================ */}
      {isPlatform && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            <StatCard label="Total Organisations" value="18" icon={Building2} hint="+2 this quarter" />
            <StatCard label="Total Care Homes" value="64" icon={Home} tone="sky" hint="Across UK & EU" hintMuted />
            <StatCard label="Total Residents" value="2,418" icon={Users} tone="lilac" hint="92% capacity" />
            <StatCard label="Registered Users" value="812" icon={UserCheck} tone="sun" hint="Staff & Caregivers" hintMuted />
            <StatCard label="Pending Registrations" value="14" icon={UserPlus} tone="coral" hint="Awaiting org review" className="col-span-2 lg:col-span-1" />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            <Panel
              className="xl:col-span-8"
              icon={Activity}
              title="Residents on the platform"
              description="Weekly active resident records across every tenant"
              action={<SampleBadge />}
            >
              <AreaTrend data={platformResidentsTrend} label="Platform residents per week" />
            </Panel>

            <Panel
              className="xl:col-span-4"
              icon={BedDouble}
              title="Residents by organisation"
              description="Largest tenants by resident count"
            >
              <BarList
                data={organisations.map((o) => ({
                  label: o.name,
                  value: o.residents,
                  sublabel: `${o.homes} homes`,
                  tooltip: `${o.homes} care homes • ${o.id}`,
                }))}
              />
            </Panel>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <Panel
              className="lg:col-span-7"
              flush
              icon={Building2}
              title="Registered care organisations"
              action={<PanelLink href="/dashboard/organisations">View all</PanelLink>}
            >
              <ul className="divide-y divide-ink/[0.06]">
                {organisations.map((o) => (
                  <li key={o.id} className="flex items-center gap-3.5 px-5 py-3.5 hover:bg-mint/25 transition-colors">
                    <Avatar name={o.name} />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-ink truncate">{o.name}</p>
                      <p className="text-xs text-ink/55 truncate">
                        {o.homes} Care Homes • {o.residents} Residents
                        <span className="hidden sm:inline font-mono text-ink/40"> • {o.id}</span>
                      </p>
                    </div>
                    <StatusBadge status="ACTIVE" />
                  </li>
                ))}
              </ul>
            </Panel>

            <Panel
              className="lg:col-span-5"
              icon={FileClock}
              title="Platform audit stream"
              action={<PanelLink href="/dashboard/audit-logs">Full ledger</PanelLink>}
            >
              <Timeline items={platformAudit} />
            </Panel>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 2. ORGANISATION ADMIN                                         */}
      {/* ============================================================ */}
      {currentRole === "ORGANISATION_ADMIN" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Care Homes in Group" value="4" icon={Home} hint="166 Total Licensed Beds" hintMuted />
            <StatCard label="Total Residents" value="154" icon={Users} tone="sky" hint="92.7% Group Occupancy" />
            <StatCard label="Organisation Staff" value="53" icon={UserCheck} tone="lilac" hint="Carers, Nurses & Leads" hintMuted />
            <StatCard label="Pending Admissions" value="6" icon={UserPlus} tone="coral" hint="Across 3 facilities" />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            <Panel
              className="xl:col-span-7"
              icon={Activity}
              title="Group occupancy"
              description="Share of licensed beds occupied, weekly"
              action={<SampleBadge />}
            >
              <AreaTrend data={groupOccupancyTrend} min={85} max={95} valueSuffix="%" label="Group occupancy percentage per week" />
            </Panel>

            <Panel
              className="xl:col-span-5"
              icon={BedDouble}
              title="Occupancy by care home"
              description="Beds occupied vs licensed"
              action={<PanelLink href="/dashboard/care-homes">Manage</PanelLink>}
            >
              <BarList
                max={100}
                data={careHomes.map((h) => ({
                  label: h.name,
                  value: Math.round((h.occupied / h.beds) * 1000) / 10,
                  sublabel: `${h.occupied}/${h.beds} beds`,
                  tooltip: `Manager: ${h.manager} • ${h.staff} on duty • ${h.intake} pending intake`,
                }))}
                valueSuffix="%"
              />
            </Panel>
          </div>

          <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {careHomes.map((h) => (
              <div key={h.name} className="group bg-white border border-ink/[0.08] rounded-md p-4 hover:border-teal-brand/30">
                <div className="flex items-start gap-3">
                  <span className="grid place-items-center w-10 h-10 rounded-md bg-gradient-to-br from-teal-brand to-teal-deep text-white shrink-0 transition-transform group-hover:-rotate-6">
                    <Home className="h-4 w-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-ink truncate">{h.name}</p>
                    <p className="text-[11px] text-ink/50 truncate">{h.manager}</p>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                  {[
                    { k: "Beds", v: `${h.occupied}/${h.beds}` },
                    { k: "On duty", v: h.staff },
                    { k: "Intake", v: h.intake },
                  ].map((d) => (
                    <div key={d.k} className="rounded-md bg-[#f6f8f7] py-2">
                      <p className="text-sm font-bold text-ink tabular-nums">{d.v}</p>
                      <p className="text-[10px] uppercase tracking-wider text-ink/45">{d.k}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </section>
        </div>
      )}

      {/* ============================================================ */}
      {/* 3. CARE HOME MANAGER                                          */}
      {/* ============================================================ */}
      {currentRole === "CARE_HOME_MANAGER" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Active Residents" value="42" icon={Users} hint="42 of 48 Beds Occupied" />
            <StatCard label="Pending Admissions" value="4" icon={UserPlus} tone="coral" hint="2 ready for room placement" />
            <StatCard label="Staff on Shift" value="11" icon={UserCheck} tone="sky" hint="Morning Shift B • 1:4 Ratio" hintMuted />
            <StatCard label="Daily Task Progress" value="94%" icon={CheckCircle2} tone="lilac" hint="128 of 136 checks logged" />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            <Panel
              className="xl:col-span-8"
              icon={BedDouble}
              title="Bed occupancy"
              description="Meadow View Lodge • weekly"
              action={<SampleBadge />}
            >
              <AreaTrend data={homeOccupancyTrend} min={75} max={95} valueSuffix="%" label="Care home bed occupancy percentage per week" />
            </Panel>

            <Panel className="xl:col-span-4" icon={ClipboardCheck} title="Today's care checks">
              <div className="flex flex-col sm:flex-row xl:flex-col items-center gap-5">
                <RingMeter value={94} sublabel="Logged" label="Daily care checks completed" />
                <ul className="w-full space-y-2.5 text-sm">
                  {[
                    { k: "Checks logged", v: "128" },
                    { k: "Outstanding", v: "8" },
                    { k: "Staff ratio", v: "1:4" },
                  ].map((r) => (
                    <li key={r.k} className="flex items-center justify-between rounded-md bg-[#f6f8f7] px-3 py-2">
                      <span className="text-ink/60">{r.k}</span>
                      <span className="font-semibold text-ink tabular-nums">{r.v}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Panel>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <Panel
              className="lg:col-span-7"
              icon={UserPlus}
              title="Admissions requiring review"
              description="Stage 6 & 7: Clinical assessment & bed allocation"
              action={<PanelLink href="/dashboard/registrations">Full pipeline</PanelLink>}
              bodyClassName="p-3 sm:p-4 space-y-3"
            >
              {pendingAdmissions.map((a) => (
                <div
                  key={a.ref}
                  className="group flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-md border border-ink/[0.08] hover:border-teal-brand/30 hover:bg-mint/20 transition-all"
                >
                  <Avatar name={a.name} size="lg" className="hidden sm:inline-grid" />
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-ink">
                        {a.name} <span className="text-ink/45 font-normal">({a.age})</span>
                      </span>
                      <span className="font-mono text-[10px] px-2 py-0.5 rounded-md bg-ink/[0.04] border border-ink/10 text-ink/60">
                        {a.ref}
                      </span>
                    </div>
                    <p className="text-xs text-ink/60">{a.detail}</p>
                    <p className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" /> {a.verified}
                    </p>
                  </div>
                  <Link href="/dashboard/registrations" className={`${btn.primary} ${btn.sm} w-full sm:w-auto`}>
                    Allocate Bed
                  </Link>
                </div>
              ))}
            </Panel>

            <Panel
              className="lg:col-span-5"
              icon={Activity}
              title="Recent floor observations"
              action={
                <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-teal-brand">
                  <span className="h-2 w-2 rounded-full bg-teal-brand animate-ring" /> Live
                </span>
              }
            >
              <Timeline
                items={floorObservations.map((o) => ({
                  title: `${o.room} • ${o.name}`,
                  detail: o.note,
                  ago: o.ago,
                  icon: o.icon,
                }))}
              />
            </Panel>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 4. CAREGIVER                                                  */}
      {/* ============================================================ */}
      {currentRole === "CAREGIVER" && (
        <div className="space-y-6">
          <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-md bg-gradient-to-r from-mint to-white border border-teal-brand/20">
              <div className="flex items-center gap-3.5">
                <span className="grid place-items-center w-11 h-11 rounded-md bg-teal-brand text-white shadow-lg shadow-teal-brand/25">
                  <Clock className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-bold text-teal-deep">Morning Shift B Active</p>
                  <p className="text-xs text-ink/65">West Wing Corridor (Rooms 10A – 22C)</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge tone="teal" icon={Users}>8 Assigned Residents</Badge>
                <Badge tone="green" icon={Wifi}>Offline sync OK</Badge>
              </div>
            </div>
            <div className="flex items-center gap-4 p-5 rounded-md bg-white border border-ink/[0.08]">
              <RingMeter value={25} size={84} stroke={8} sublabel="Round" label="Care round progress" />
              <div>
                <p className="text-sm font-semibold text-ink">Round progress</p>
                <p className="text-xs text-ink/55">1 of 4 priority residents completed</p>
              </div>
            </div>
          </section>

          <Panel
            icon={Heart}
            title="My assigned care round"
            description="Tap to record medication, vitals, or observation."
            bodyClassName="p-3 sm:p-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              {careRound.map((r) => {
                const status = {
                  done: <Badge tone="green" icon={CheckCircle2}>Completed</Badge>,
                  due: <Badge tone="amber" icon={AlertCircle}>Due now</Badge>,
                  scheduled: <Badge tone="slate" icon={Clock}>Scheduled 12:30</Badge>,
                  intake: <Badge tone="teal" icon={Sparkles}>Intake ready</Badge>,
                }[r.status];
                return (
                  <div
                    key={r.room}
                    className={`relative flex flex-col gap-3 p-4 rounded-md border transition-all hover:-translate-y-0.5 ${
                      r.status === "due"
                        ? "border-amber-300/70 bg-amber-50/40 shadow-[0_0_0_3px_rgba(245,158,11,0.08)]"
                        : r.status === "done"
                          ? "border-teal-brand/25 bg-mint/25"
                          : "border-ink/[0.08] bg-white"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="grid place-items-center w-11 h-11 rounded-md bg-ink text-white text-xs font-bold shrink-0">
                          {r.room}
                        </span>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-ink truncate">{r.name}</p>
                          <p className="text-[11px] text-ink/55 truncate">{r.meta}</p>
                        </div>
                      </div>
                      {status}
                    </div>
                    {r.alert && (
                      <p className="flex items-center gap-1.5 p-2.5 rounded-md bg-red-50 text-red-700 border border-red-200/70 text-[11px] font-semibold">
                        <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                        {r.alert}
                      </p>
                    )}
                    <p className="text-xs text-ink/70">{r.note}</p>
                    {r.action && (
                      <button
                        className={`${r.status === "due" ? btn.primary : btn.secondary} ${btn.sm} w-full mt-auto`}
                      >
                        {r.status === "due" && <ClipboardCheck className="h-3.5 w-3.5" />}
                        {r.action}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </Panel>
        </div>
      )}

      {/* ============================================================ */}
      {/* 5. RESIDENT & FAMILY PORTAL                                   */}
      {/* ============================================================ */}
      {currentRole === "RESIDENT" && (
        <div className="space-y-6">
          <section className="bg-white border border-ink/[0.08] rounded-md overflow-hidden">
            <div className="h-20 sm:h-24 bg-[linear-gradient(120deg,#d9f2ec,#fdf1cf_60%,#fde4da)] relative">
              <div className="absolute inset-0 bg-dots opacity-60" />
            </div>
            <div className="px-5 sm:px-8 pb-6 -mt-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="flex items-end gap-4">
                <div className="h-20 w-20 rounded-md bg-gradient-to-br from-teal-brand to-teal-deep text-white font-bold text-2xl grid place-items-center shadow-xl ring-4 ring-white">
                  {residentInitials}
                </div>
                <div className="pb-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-xl sm:text-2xl font-bold text-ink">{user.name || "Resident"}</h2>
                    <Badge tone="teal">Resident Profile</Badge>
                  </div>
                  <p className="text-xs text-ink/60 mt-0.5">
                    {user.careHomeName || "Assigned Care Facility"} • {user.organisationName || "Care Organisation"}
                  </p>
                </div>
              </div>
              <div className="text-xs sm:text-right rounded-md bg-[#f6f8f7] px-4 py-3">
                <p className="text-ink/50">Primary Facility Contact</p>
                <p className="font-semibold text-ink">{user.careHomeName || "Care Office"}</p>
                <p className="text-teal-brand font-medium break-all">{user.email || ""}</p>
              </div>
            </div>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white border border-ink/[0.08] rounded-md p-5 space-y-3">
              <p className="flex items-center gap-2 text-sm font-semibold text-ink">
                <span className="grid place-items-center w-8 h-8 rounded-md bg-mint text-teal-brand">
                  <Pill className="h-4 w-4" />
                </span>
                Medical & Directives
              </p>
              <p className="flex items-center gap-1.5 p-2.5 rounded-md bg-red-50 text-red-700 border border-red-200/70 text-xs font-semibold">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                Allergy: Penicillin & Tree Nuts
              </p>
              <p className="text-xs text-ink/70 leading-relaxed">
                Morning Blood Pressure & Metformin 500mg
              </p>
              <Badge tone="green" icon={CheckCircle2}>Logged at 08:30 AM</Badge>
            </div>

            <div className="bg-white border border-ink/[0.08] rounded-md p-5 space-y-3">
              <p className="flex items-center gap-2 text-sm font-semibold text-ink">
                <span className="grid place-items-center w-8 h-8 rounded-md bg-coral-soft text-coral">
                  <Utensils className="h-4 w-4" />
                </span>
                Today&apos;s Menu & Dining
              </p>
              <div className="space-y-2 text-xs">
                <p className="flex justify-between gap-3"><span className="text-ink/50">Lunch</span><span className="font-semibold text-ink text-right">Roast Chicken & Steamed Greens</span></p>
                <p className="flex justify-between gap-3"><span className="text-ink/50">Dinner</span><span className="font-semibold text-ink text-right">Cream of Vegetable Soup & Fresh Sourdough</span></p>
              </div>
              <div className="flex items-center gap-3 pt-2 border-t border-ink/[0.06]">
                <RingMeter value={75} size={60} stroke={6} label="Hydration goal" />
                <div className="text-xs">
                  <p className="font-semibold text-ink flex items-center gap-1"><Droplets className="h-3.5 w-3.5 text-sky" /> Hydration goal</p>
                  <p className="text-ink/55">1,800ml • 75% achieved</p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-ink/[0.08] rounded-md p-5 space-y-3">
              <p className="flex items-center gap-2 text-sm font-semibold text-ink">
                <span className="grid place-items-center w-8 h-8 rounded-md bg-sun-soft text-amber-600">
                  <Activity className="h-4 w-4" />
                </span>
                Activities & Wellbeing
              </p>
              <ol className="space-y-2">
                {[
                  { t: "10:30 AM", a: "Garden Walk in Conservatory" },
                  { t: "02:30 PM", a: "Live Acoustic Piano Afternoon" },
                ].map((e) => (
                  <li key={e.t} className="flex gap-3 rounded-md bg-[#f6f8f7] px-3 py-2">
                    <span className="text-[11px] font-mono font-semibold text-teal-brand shrink-0 pt-px">{e.t}</span>
                    <span className="text-xs font-medium text-ink">{e.a}</span>
                  </li>
                ))}
              </ol>
              <p className="text-xs text-ink/55 flex items-center gap-1.5">
                <Heart className="h-3.5 w-3.5 text-coral" /> Care Lead: Sarah Jenkins, RN
              </p>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
