"use client";

import { useRole } from "@/lib/role-context";
import Link from "next/link";
import {
  Building2,
  Home,
  Users,
  UserPlus,
  UserCheck,
  FileClock,
  ArrowRight,
  CheckCircle2,
  Clock,
  AlertCircle,
  Pill,
  Heart,
  Utensils,
  TrendingUp,
  ShieldCheck,
  BedDouble,
  Activity,
  Plus,
  Phone,
} from "lucide-react";

export default function DashboardPage() {
  const { currentRole, user, activeCareHome } = useRole();

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome & Context Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-md bg-white border border-ink/10 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-mint text-teal-deep font-semibold">
              {user.roleTier}
            </span>
            <span className="text-xs text-ink/50">•</span>
            <span className="text-xs text-teal-brand font-medium">
              {user.roleTitle}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-ink">
            Welcome back, {user.name}
          </h1>
          <p className="text-xs sm:text-sm text-ink/65">
            {user.organisationName} • {user.careHomeName}
          </p>
        </div>

        {/* Quick Context Pill */}
        <div className="flex items-center gap-2">
          {currentRole === "CAREGIVER" && user.shiftBadge && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-teal-brand/10 text-teal-deep text-xs font-semibold">
              <span className="h-2 w-2 rounded-full bg-teal-brand animate-pulse" />
              {user.shiftBadge}
            </span>
          )}
          {currentRole === "RESIDENT" && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-coral-soft text-coral text-xs font-semibold">
              <Heart className="h-3.5 w-3.5" />
              Assigned: Room 14B
            </span>
          )}
          <Link
            href="/dashboard/settings"
            className="px-3.5 py-1.5 rounded-md border border-ink/10 bg-cream/40 hover:bg-cream text-xs font-semibold text-ink transition-colors"
          >
            Preferences
          </Link>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 1. PLATFORM ADMINISTRATOR DASHBOARD (Section 4.1)              */}
      {/* ------------------------------------------------------------- */}
      {currentRole === "SUPER_ADMIN" && (
        <div className="space-y-6">
          {/* Platform Metric Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="p-4 rounded-md bg-white border border-ink/10 shadow-xs space-y-1">
              <p className="text-xs text-ink/60 flex items-center justify-between">
                <span>Total Organisations</span>
                <Building2 className="h-4 w-4 text-teal-brand" />
              </p>
              <p className="text-2xl sm:text-3xl font-bold text-ink">18</p>
              <p className="text-[11px] text-emerald-600 font-medium">
                +2 this quarter
              </p>
            </div>

            <div className="p-4 rounded-md bg-white border border-ink/10 shadow-xs space-y-1">
              <p className="text-xs text-ink/60 flex items-center justify-between">
                <span>Total Care Homes</span>
                <Home className="h-4 w-4 text-teal-brand" />
              </p>
              <p className="text-2xl sm:text-3xl font-bold text-ink">64</p>
              <p className="text-[11px] text-ink/50">Across UK & EU</p>
            </div>

            <div className="p-4 rounded-md bg-white border border-ink/10 shadow-xs space-y-1">
              <p className="text-xs text-ink/60 flex items-center justify-between">
                <span>Total Residents</span>
                <Users className="h-4 w-4 text-teal-brand" />
              </p>
              <p className="text-2xl sm:text-3xl font-bold text-ink">2,418</p>
              <p className="text-[11px] text-emerald-600 font-medium">
                92% capacity
              </p>
            </div>

            <div className="p-4 rounded-md bg-white border border-ink/10 shadow-xs space-y-1">
              <p className="text-xs text-ink/60 flex items-center justify-between">
                <span>Registered Users</span>
                <UserCheck className="h-4 w-4 text-teal-brand" />
              </p>
              <p className="text-2xl sm:text-3xl font-bold text-ink">812</p>
              <p className="text-[11px] text-ink/50">Staff & Caregivers</p>
            </div>

            <div className="p-4 rounded-md bg-white border border-ink/10 shadow-xs space-y-1 col-span-2 lg:col-span-1">
              <p className="text-xs text-ink/60 flex items-center justify-between">
                <span>Pending Registrations</span>
                <UserPlus className="h-4 w-4 text-coral" />
              </p>
              <p className="text-2xl sm:text-3xl font-bold text-coral">14</p>
              <p className="text-[11px] text-coral font-medium">
                Awaiting org review
              </p>
            </div>
          </div>

          {/* Platform Management & Recent Activities */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 rounded-md bg-white border border-ink/10 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-ink/10">
                <h3 className="text-base font-bold text-ink">
                  Registered Care Organisations
                </h3>
                <Link
                  href="/dashboard/organisations"
                  className="text-xs font-semibold text-teal-brand hover:underline"
                >
                  View All Organisations →
                </Link>
              </div>

              <div className="divide-y divide-ink/5 text-xs">
                <div className="py-3 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-ink">
                      St. Jude Care Services Group
                    </p>
                    <p className="text-ink/60">
                      4 Care Homes • 164 Residents • Tenant ID: org_99c301ae
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-700 font-semibold text-[11px]">
                    Active
                  </span>
                </div>

                <div className="py-3 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-ink">
                      Oakridge Healthcare Trust
                    </p>
                    <p className="text-ink/60">
                      3 Care Homes • 112 Residents • Tenant ID: org_54a88b12
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-700 font-semibold text-[11px]">
                    Active
                  </span>
                </div>

                <div className="py-3 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-ink">Waverley Assisted Care</p>
                    <p className="text-ink/60">
                      2 Care Homes • 68 Residents • Tenant ID: org_77d12f90
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-700 font-semibold text-[11px]">
                    Active
                  </span>
                </div>
              </div>
            </div>

            {/* Platform Audit Stream */}
            <div className="lg:col-span-5 rounded-md bg-white border border-ink/10 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-ink/10">
                <h3 className="text-base font-bold text-ink">
                  Platform Audit Stream
                </h3>
                <Link
                  href="/dashboard/audit-logs"
                  className="text-xs font-semibold text-teal-brand hover:underline"
                >
                  Full Ledger →
                </Link>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-md bg-cream/50 border border-ink/5 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-ink">
                      Organisation Created
                    </span>
                    <span className="text-[10px] text-ink/40">10m ago</span>
                  </div>
                  <p className="text-ink/65 text-[11px]">
                    Actor: Super Admin Victoria S. created Waverley Assisted
                    Care.
                  </p>
                </div>

                <div className="p-3 rounded-md bg-cream/50 border border-ink/5 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-ink">
                      Role Assigned
                    </span>
                    <span className="text-[10px] text-ink/40">45m ago</span>
                  </div>
                  <p className="text-ink/65 text-[11px]">
                    Actor: Dr. Alistair Finch assigned Care Home Manager to
                    Sarah Jenkins.
                  </p>
                </div>

                <div className="p-3 rounded-md bg-cream/50 border border-ink/5 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-ink">
                      Security Policy Synced
                    </span>
                    <span className="text-[10px] text-ink/40">2h ago</span>
                  </div>
                  <p className="text-ink/65 text-[11px]">
                    OpenAPI /api/v1 tenant context isolation check passed.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 2. ORGANISATION ADMINISTRATOR DASHBOARD (Section 4.1)          */}
      {/* ------------------------------------------------------------- */}
      {currentRole === "ORGANISATION_ADMIN" && (
        <div className="space-y-6">
          {/* Organisation Metric Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-md bg-white border border-ink/10 shadow-xs space-y-1">
              <p className="text-xs text-ink/60 flex items-center justify-between">
                <span>Care Homes in Group</span>
                <Home className="h-4 w-4 text-teal-brand" />
              </p>
              <p className="text-3xl font-bold text-ink">4</p>
              <p className="text-[11px] text-ink/50">166 Total Licensed Beds</p>
            </div>

            <div className="p-5 rounded-md bg-white border border-ink/10 shadow-xs space-y-1">
              <p className="text-xs text-ink/60 flex items-center justify-between">
                <span>Total Residents</span>
                <Users className="h-4 w-4 text-teal-brand" />
              </p>
              <p className="text-3xl font-bold text-ink">154</p>
              <p className="text-[11px] text-emerald-600 font-medium">
                92.7% Group Occupancy
              </p>
            </div>

            <div className="p-5 rounded-md bg-white border border-ink/10 shadow-xs space-y-1">
              <p className="text-xs text-ink/60 flex items-center justify-between">
                <span>Organisation Staff</span>
                <UserCheck className="h-4 w-4 text-teal-brand" />
              </p>
              <p className="text-3xl font-bold text-ink">53</p>
              <p className="text-[11px] text-ink/50">Carers, Nurses & Leads</p>
            </div>

            <div className="p-5 rounded-md bg-white border border-ink/10 shadow-xs space-y-1">
              <p className="text-xs text-ink/60 flex items-center justify-between">
                <span>Pending Admissions</span>
                <UserPlus className="h-4 w-4 text-coral" />
              </p>
              <p className="text-3xl font-bold text-coral">6</p>
              <p className="text-[11px] text-coral font-medium">
                Across 3 facilities
              </p>
            </div>
          </div>

          {/* Facility Distribution Overview */}
          <div className="rounded-md bg-white border border-ink/10 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-ink/10">
              <div>
                <h3 className="text-lg font-bold text-ink">
                  Resident Distribution Across Care Homes
                </h3>
                <p className="text-xs text-ink/60">
                  Live bed occupancy & staff deployment per facility.
                </p>
              </div>
              <Link
                href="/dashboard/care-homes"
                className="px-4 py-2 rounded-md bg-teal-brand text-white font-semibold text-xs hover:bg-teal-deep transition-all"
              >
                Manage Care Homes
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {/* Home 1 */}
              <div className="p-4 rounded-md border border-ink/10 bg-cream/30 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-ink">
                    Meadow View Lodge
                  </h4>
                  <span className="font-semibold text-teal-brand">
                    42 / 48 Beds (87.5%)
                  </span>
                </div>
                <div className="w-full bg-cream rounded-full h-2.5 overflow-hidden border border-ink/5">
                  <div
                    className="bg-teal-brand h-full rounded-full"
                    style={{ width: "87.5%" }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-ink/60 pt-1">
                  <span>Manager: Sarah Jenkins, RN</span>
                  <span>14 On-duty Staff • 2 Pending Intake</span>
                </div>
              </div>

              {/* Home 2 */}
              <div className="p-4 rounded-md border border-ink/10 bg-cream/30 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-ink">
                    Oakridge Manor Residence
                  </h4>
                  <span className="font-semibold text-teal-brand">
                    34 / 36 Beds (94.4%)
                  </span>
                </div>
                <div className="w-full bg-cream rounded-full h-2.5 overflow-hidden border border-ink/5">
                  <div
                    className="bg-teal-brand h-full rounded-full"
                    style={{ width: "94.4%" }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-ink/60 pt-1">
                  <span>Manager: David Roberts</span>
                  <span>12 On-duty Staff • 1 Pending Intake</span>
                </div>
              </div>

              {/* Home 3 */}
              <div className="p-4 rounded-md border border-ink/10 bg-cream/30 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-ink">
                    Willow Creek Court
                  </h4>
                  <span className="font-semibold text-sun-dark text-amber-700">
                    28 / 30 Beds (93.3%)
                  </span>
                </div>
                <div className="w-full bg-cream rounded-full h-2.5 overflow-hidden border border-ink/5">
                  <div
                    className="bg-amber-500 h-full rounded-full"
                    style={{ width: "93.3%" }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-ink/60 pt-1">
                  <span>Manager: Claire Henderson</span>
                  <span>9 On-duty Staff • 2 Pending Intake</span>
                </div>
              </div>

              {/* Home 4 */}
              <div className="p-4 rounded-md border border-ink/10 bg-cream/30 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-ink">
                    Highland Pines Nursing
                  </h4>
                  <span className="font-semibold text-teal-brand">
                    50 / 52 Beds (96.1%)
                  </span>
                </div>
                <div className="w-full bg-cream rounded-full h-2.5 overflow-hidden border border-ink/5">
                  <div
                    className="bg-teal-brand h-full rounded-full"
                    style={{ width: "96.1%" }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-ink/60 pt-1">
                  <span>Manager: Patricia Gomez, RN</span>
                  <span>18 On-duty Staff • 1 Pending Intake</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 3. CARE HOME MANAGER DASHBOARD (Section 4.1)                  */}
      {/* ------------------------------------------------------------- */}
      {currentRole === "CARE_HOME_MANAGER" && (
        <div className="space-y-6">
          {/* Care Home Metric Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-md bg-white border border-ink/10 shadow-xs space-y-1">
              <p className="text-xs text-ink/60 flex items-center justify-between">
                <span>Active Residents</span>
                <Users className="h-4 w-4 text-teal-brand" />
              </p>
              <p className="text-3xl font-bold text-ink">42</p>
              <p className="text-[11px] text-emerald-600 font-medium">
                42 of 48 Beds Occupied
              </p>
            </div>

            <div className="p-5 rounded-md bg-white border border-ink/10 shadow-xs space-y-1">
              <p className="text-xs text-ink/60 flex items-center justify-between">
                <span>Pending Admissions</span>
                <UserPlus className="h-4 w-4 text-coral" />
              </p>
              <p className="text-3xl font-bold text-coral">4</p>
              <p className="text-[11px] text-coral font-medium">
                2 ready for room placement
              </p>
            </div>

            <div className="p-5 rounded-md bg-white border border-ink/10 shadow-xs space-y-1">
              <p className="text-xs text-ink/60 flex items-center justify-between">
                <span>Staff on Shift</span>
                <UserCheck className="h-4 w-4 text-teal-brand" />
              </p>
              <p className="text-3xl font-bold text-ink">11</p>
              <p className="text-[11px] text-ink/50">
                Morning Shift B • 1:4 Ratio
              </p>
            </div>

            <div className="p-5 rounded-md bg-white border border-ink/10 shadow-xs space-y-1">
              <p className="text-xs text-ink/60 flex items-center justify-between">
                <span>Daily Task Progress</span>
                <CheckCircle2 className="h-4 w-4 text-teal-brand" />
              </p>
              <p className="text-3xl font-bold text-ink">94%</p>
              <p className="text-[11px] text-emerald-600 font-medium">
                128 of 136 checks logged
              </p>
            </div>
          </div>

          {/* Placement Overview & Pending Admission Pipeline */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Admissions review list */}
            <div className="lg:col-span-7 rounded-md bg-white border border-ink/10 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-ink/10">
                <div>
                  <h3 className="text-base font-bold text-ink">
                    Admissions Requiring Review
                  </h3>
                  <p className="text-xs text-ink/60">
                    Stage 6 & 7: Clinical assessment & bed allocation.
                  </p>
                </div>
                <Link
                  href="/dashboard/registrations"
                  className="text-xs font-semibold text-teal-brand hover:underline"
                >
                  Full Pipeline →
                </Link>
              </div>

              <div className="space-y-3 text-xs">
                {/* Pending Admission 1 */}
                <div className="p-4 rounded-md border border-ink/10 bg-cream/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-ink text-sm">
                        Robert Sterling (Age 84)
                      </span>
                      <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-cream border border-ink/10 text-ink/70">
                        REG-2026-9904
                      </span>
                    </div>
                    <p className="text-ink/65">
                      Care Level: Residential • Desired Room: Ground Floor
                    </p>
                    <p className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" /> Email Verified by
                      Guardian
                    </p>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Link
                      href="/dashboard/registrations"
                      className="px-3.5 py-1.5 rounded-md bg-teal-brand text-white font-semibold text-xs hover:bg-teal-deep transition-all"
                    >
                      Allocate Bed
                    </Link>
                  </div>
                </div>

                {/* Pending Admission 2 */}
                <div className="p-4 rounded-md border border-ink/10 bg-cream/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-ink text-sm">
                        Beatrice Miller (Age 81)
                      </span>
                      <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-cream border border-ink/10 text-ink/70">
                        REG-2026-8812
                      </span>
                    </div>
                    <p className="text-ink/65">
                      Care Level: Dementia Support • Dietary: Diabetic-Friendly
                    </p>
                    <p className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" /> Email Verified by Son
                    </p>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Link
                      href="/dashboard/registrations"
                      className="px-3.5 py-1.5 rounded-md bg-teal-brand text-white font-semibold text-xs hover:bg-teal-deep transition-all"
                    >
                      Allocate Bed
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Live Care Home Floor Activity */}
            <div className="lg:col-span-5 rounded-md bg-white border border-ink/10 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-ink/10">
                <h3 className="text-base font-bold text-ink">
                  Recent Floor Observations
                </h3>
                <span className="h-2 w-2 rounded-full bg-teal-brand animate-pulse" />
              </div>

              <div className="divide-y divide-ink/5 text-xs">
                <div className="py-2.5 space-y-0.5">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-ink">
                      Room 14B • Eleanor Vance
                    </span>
                    <span className="text-[10px] text-ink/40">3m ago</span>
                  </div>
                  <p className="text-ink/70">
                    Morning vitals & Metformin 500mg logged by Nurse Sarah M.
                  </p>
                </div>

                <div className="py-2.5 space-y-0.5">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-ink">
                      Room 08A • Arthur Pendelton
                    </span>
                    <span className="text-[10px] text-ink/40">18m ago</span>
                  </div>
                  <p className="text-ink/70">
                    Assisted walking exercise completed by Carer Marcus C.
                  </p>
                </div>

                <div className="py-2.5 space-y-0.5">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-ink">
                      Room 22C • Grace O'Connor
                    </span>
                    <span className="text-[10px] text-ink/40">42m ago</span>
                  </div>
                  <p className="text-ink/70">
                    Dietary texture note: Moistened lunch enjoyed, 450ml fluids.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 4. CAREGIVER / NURSE DASHBOARD (Section 4.1)                  */}
      {/* ------------------------------------------------------------- */}
      {currentRole === "CAREGIVER" && (
        <div className="space-y-6">
          {/* Shift Banner */}
          <div className="p-4 rounded-md bg-mint/50 border border-teal-brand/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <Clock className="h-4 w-4 text-teal-brand" />
              <div>
                <span className="font-bold text-teal-deep">
                  Morning Shift B Active:{" "}
                </span>
                <span className="text-ink/80">
                  West Wing Corridor (Rooms 10A - 22C)
                </span>
              </div>
            </div>
            <span className="text-[11px] font-semibold text-teal-brand bg-white px-3 py-1 rounded-full border border-teal-brand/20">
              8 Assigned Residents
            </span>
          </div>

          {/* Assigned Residents Round List */}
          <div className="rounded-md bg-white border border-ink/10 p-6 sm:p-8 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-ink/10">
              <div>
                <h3 className="text-lg font-bold text-ink">
                  My Assigned Care Round
                </h3>
                <p className="text-xs text-ink/60">
                  Tap to record medication, vitals, or observation.
                </p>
              </div>
              <span className="text-xs font-semibold text-teal-brand">
                PWA Offline Sync OK
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {/* Resident Card 1 */}
              <div className="p-4 rounded-md border border-teal-brand/30 bg-mint/20 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-ink">
                      Room 14B • Eleanor Vance
                    </h4>
                    <p className="text-ink/60 text-[11px]">
                      Level 3 Residential • Age 82
                    </p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 font-bold text-[10px]">
                    Completed ✓
                  </span>
                </div>

                <div className="p-2.5 rounded-md bg-destructive/10 text-destructive border border-destructive/20 text-[11px] font-semibold flex items-center gap-1.5">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  <span>Severe Allergy: Penicillin & Tree Nuts</span>
                </div>

                <div className="text-[11px] text-ink/70">
                  <p>Next: 12:30 PM Diabetic-friendly lunch & hydration.</p>
                </div>
              </div>

              {/* Resident Card 2 */}
              <div className="p-4 rounded-md border border-ink/10 bg-cream/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-ink">
                      Room 08A • Arthur Pendelton
                    </h4>
                    <p className="text-ink/60 text-[11px]">
                      Assisted Mobility • Age 79
                    </p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-700 font-bold text-[10px]">
                    Due Now
                  </span>
                </div>

                <p className="text-[11px] text-ink/75">
                  Task: Assisted walking exercise & morning fluid log.
                </p>

                <button className="w-full py-2 rounded-md bg-teal-brand text-white font-semibold text-xs hover:bg-teal-deep transition-all cursor-pointer">
                  + Record Care Check
                </button>
              </div>

              {/* Resident Card 3 */}
              <div className="p-4 rounded-md border border-ink/10 bg-cream/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-ink">
                      Room 22C • Grace O'Connor
                    </h4>
                    <p className="text-ink/60 text-[11px]">
                      Nutritional Review • Age 86
                    </p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-ink/10 text-ink/70 font-bold text-[10px]">
                    Scheduled 12:30
                  </span>
                </div>

                <p className="text-[11px] text-ink/75">
                  Dietary directive: Soft moistened texture meals only.
                </p>

                <button className="w-full py-2 rounded-md border border-ink/15 bg-white text-ink font-semibold text-xs hover:bg-cream transition-all cursor-pointer">
                  View Care Directives
                </button>
              </div>

              {/* Resident Card 4 */}
              <div className="p-4 rounded-md border border-ink/10 bg-cream/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-ink">
                      Room 15A • Robert Sterling
                    </h4>
                    <p className="text-ink/60 text-[11px]">
                      Newly Admitted • Age 84
                    </p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-mint text-teal-deep font-bold text-[10px]">
                    Intake Ready
                  </span>
                </div>

                <p className="text-[11px] text-ink/75">
                  Task: Welcome introduction & room orientation completed.
                </p>

                <button className="w-full py-2 rounded-md border border-ink/15 bg-white text-ink font-semibold text-xs hover:bg-cream transition-all cursor-pointer">
                  Open Dossier
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 5. RESIDENT & FAMILY PORTAL (Section 4.1)                     */}
      {/* ------------------------------------------------------------- */}
      {currentRole === "RESIDENT" && (
        <div className="space-y-6">
          {/* Resident Header Card */}
          <div className="rounded-md bg-white border border-ink/10 p-6 sm:p-8 shadow-xs">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-ink/10">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-md bg-teal-brand text-white font-bold text-2xl grid place-items-center shadow-sm">
                  EV
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl sm:text-2xl font-bold text-ink">
                      Eleanor Vance
                    </h2>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-mint text-teal-deep font-semibold">
                      Resident #RL-8821
                    </span>
                  </div>
                  <p className="text-xs text-ink/65 mt-0.5">
                    Meadow View Lodge • Room 14B • Care Level 3 Residential
                  </p>
                </div>
              </div>

              <div className="text-xs text-right">
                <p className="text-ink/50">Next of Kin Contact:</p>
                <p className="font-bold text-ink">David Vance (Son & POA)</p>
                <p className="text-teal-brand font-medium">+44 7700 900821</p>
              </div>
            </div>

            {/* Resident 3-Column Plan */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 text-xs">
              <div className="p-4 rounded-md border border-ink/10 bg-cream/30 space-y-2">
                <p className="font-bold text-ink flex items-center gap-1.5 text-sm">
                  <Pill className="h-4 w-4 text-teal-brand" />
                  <span>Medical & Directives</span>
                </p>
                <p className="text-destructive font-semibold">
                  Allergy: Penicillin & Tree Nuts
                </p>
                <p className="text-ink/70">
                  Morning Blood Pressure & Metformin 500mg (Logged at 08:30 AM
                  ✓)
                </p>
              </div>

              <div className="p-4 rounded-md border border-ink/10 bg-cream/30 space-y-2">
                <p className="font-bold text-ink flex items-center gap-1.5 text-sm">
                  <Utensils className="h-4 w-4 text-coral" />
                  <span>Today&apos;s Menu & Dining</span>
                </p>
                <p className="text-ink font-semibold">
                  Lunch: Roast Chicken & Steamed Greens
                </p>
                <p className="text-ink/70">
                  Dinner: Cream of Vegetable Soup & Fresh Sourdough
                </p>
                <p className="text-teal-brand font-medium">
                  Hydration Goal: 1,800ml (75% achieved)
                </p>
              </div>

              <div className="p-4 rounded-md border border-ink/10 bg-cream/30 space-y-2">
                <p className="font-bold text-ink flex items-center gap-1.5 text-sm">
                  <Activity className="h-4 w-4 text-sun" />
                  <span>Activities & Wellbeing</span>
                </p>
                <p className="text-ink font-semibold">
                  10:30 AM: Garden Walk in Conservatory
                </p>
                <p className="text-ink font-semibold">
                  02:30 PM: Live Acoustic Piano Afternoon
                </p>
                <p className="text-emerald-700 font-medium">
                  Care Lead: Sarah Jenkins, RN
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Role Navigation Quick Links per Section 5 */}
      {/* <div className="p-6 rounded-md bg-white border border-ink/10 shadow-xs space-y-3">
        <h3 className="text-sm font-bold text-ink uppercase tracking-wider text-ink/60">
          Role-Permitted Application Modules:
        </h3>
        <div className="flex flex-wrap gap-2 text-xs">
          <Link
            href="/dashboard/care-homes"
            className="px-3.5 py-2 rounded-md bg-cream hover:bg-mint hover:text-teal-deep text-ink font-medium border border-ink/10 transition-colors"
          >
            Care Homes Facility Hub
          </Link>
          <Link
            href="/dashboard/residents"
            className="px-3.5 py-2 rounded-md bg-cream hover:bg-mint hover:text-teal-deep text-ink font-medium border border-ink/10 transition-colors"
          >
            Residents Directory
          </Link>
          <Link
            href="/dashboard/registrations"
            className="px-3.5 py-2 rounded-md bg-cream hover:bg-mint hover:text-teal-deep text-ink font-medium border border-ink/10 transition-colors"
          >
            Admissions Pipeline
          </Link>
          {(currentRole === "SUPER_ADMIN" || currentRole === "ORGANISATION_ADMIN") && (
            <Link
              href="/dashboard/audit-logs"
              className="px-3.5 py-2 rounded-md bg-cream hover:bg-mint hover:text-teal-deep text-ink font-medium border border-ink/10 transition-colors"
            >
              Immutable Audit Logs
            </Link>
          )}
          {currentRole === "SUPER_ADMIN" && (
            <Link
              href="/dashboard/organisations"
              className="px-3.5 py-2 rounded-md bg-cream hover:bg-mint hover:text-teal-deep text-ink font-medium border border-ink/10 transition-colors"
            >
              Platform Organisations
            </Link>
          )}
        </div>
      </div> */}
    </div>
  );
}
