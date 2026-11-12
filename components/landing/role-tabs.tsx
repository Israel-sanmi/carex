"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Building2,
  Smartphone,
  BarChart3,
  Users,
  Check,
  ShieldCheck,
  Activity,
  Calendar,
  Heart,
  Bed,
  Clock,
  FileCheck2,
  Lock,
  Wifi,
} from "lucide-react";

type RoleKey = "managers" | "caregivers" | "directors" | "families";

export default function RoleTabs() {
  const [activeTab, setActiveTab] = useState<RoleKey>("managers");

  const tabs: { key: RoleKey; label: string; icon: any }[] = [
    { key: "managers", label: "Care Home Managers", icon: Building2 },
    { key: "caregivers", label: "Frontline Caregivers", icon: Smartphone },
    { key: "directors", label: "Operations Directors", icon: BarChart3 },
    { key: "families", label: "Families & Residents", icon: Users },
  ];

  return (
    <section id="roles" className="relative py-20 lg:py-28 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass border border-emerald-500/20 text-xs font-semibold text-emerald-700 dark:text-emerald-400 mb-4 shadow-xs">
            <span>Tailored Solutions</span>
          </div>
          <h2 className="text-3xl lg:text-5xl font-bold text-slate-900 dark:text-white font-heading tracking-tight">
            One platform, perfectly tailored to{" "}
            <span className="gradient-text">every role</span>.
          </h2>
          <p className="text-base lg:text-lg text-slate-600 dark:text-slate-300 mt-3 max-w-2xl mx-auto">
            Strict Role-Based Access Control (RBAC) ensures everyone sees only what they need to deliver outstanding, confidential care.
          </p>
        </div>

        {/* Tab Switcher Buttons */}
        <div className="flex flex-wrap justify-center gap-3 md:gap-4 mb-12">
          {tabs.map((t) => {
            const isActive = activeTab === t.key;
            const Icon = t.icon;
            return (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                className={`inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full text-sm font-semibold transition-all cursor-pointer ${
                  isActive
                    ? "bg-emerald-600 dark:bg-emerald-500 text-white dark:text-slate-950 shadow-lg shadow-emerald-600/25 scale-102"
                    : "glass border border-slate-200/80 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/90 dark:hover:bg-slate-800/80"
                }`}
              >
                <Icon
                  className={`w-4 h-4 ${isActive ? "text-white dark:text-slate-950" : "text-emerald-600 dark:text-emerald-400"}`}
                />
                {t.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content Container */}
        <div className="glass-card rounded-3xl p-6 sm:p-10 lg:p-12 shadow-2xl border border-white/80 dark:border-white/10 transition-all duration-300">
          {/* TAB 1: Care Home Managers */}
          {activeTab === "managers" && (
            <div className="grid lg:grid-cols-12 gap-10 items-center animate-fade-in">
              <div className="lg:col-span-6 space-y-6">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-500/20">
                  Facility Leadership
                </span>
                <h3 className="text-3xl font-bold text-slate-900 dark:text-white font-heading">
                  Run your home with calm authority.
                </h3>
                <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                  Streamline admissions from first prospective inquiry to move-in day. Manage shift rotas, invite caregivers instantly with preset roles, and maintain complete CQC inspection readiness at all times.
                </p>
                <ul className="space-y-3.5 pt-2">
                  <li className="flex items-center gap-3 text-slate-800 dark:text-slate-200 font-medium text-sm">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5" />
                    </span>
                    Structured resident admission pipeline with room & bed allocation
                  </li>
                  <li className="flex items-center gap-3 text-slate-800 dark:text-slate-200 font-medium text-sm">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5" />
                    </span>
                    Instant staff onboarding with pre-configured role permissions
                  </li>
                  <li className="flex items-center gap-3 text-slate-800 dark:text-slate-200 font-medium text-sm">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5" />
                    </span>
                    One-click audit trail exports formatted for CQC inspections
                  </li>
                </ul>
              </div>

              <div className="lg:col-span-6 relative">
                <div className="relative h-80 sm:h-96 rounded-2xl overflow-hidden shadow-xl border border-slate-200/60 dark:border-white/10">
                  <Image
                    src="/images/team.jpg"
                    alt="Care home management and multidisciplinary team"
                    fill
                    className="object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent" />

                  {/* Overlay HUD cards */}
                  <div className="absolute bottom-4 left-4 right-4 p-4 glass dark:bg-slate-900/90 rounded-2xl border border-white/20 shadow-xl space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-white/10">
                      <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <Building2 className="w-4 h-4 text-emerald-500" />
                        St. Jude&apos;s Residential Home
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                        CQC: Good
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-mono block">Bed Occupancy</span>
                        <span className="text-base font-bold text-slate-900 dark:text-white">42 / 48 (88%)</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-mono block">Staff on Shift</span>
                        <span className="text-base font-bold text-emerald-600 dark:text-emerald-400">14 Carers on duty</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Frontline Caregivers */}
          {activeTab === "caregivers" && (
            <div className="grid lg:grid-cols-12 gap-10 items-center animate-fade-in">
              <div className="lg:col-span-6 space-y-6">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-500/20">
                  Frontline Care Team
                </span>
                <h3 className="text-3xl font-bold text-slate-900 dark:text-white font-heading">
                  Bedside logging in seconds, not hours.
                </h3>
                <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                  Caregivers spend their shift with residents, not trapped at the nurses’ station. Quick 3-tap bedside observations, verified medication checks, and automatic speech-to-text notes ensure nothing slips through the cracks.
                </p>
                <ul className="space-y-3.5 pt-2">
                  <li className="flex items-center gap-3 text-slate-800 dark:text-slate-200 font-medium text-sm">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5" />
                    </span>
                    Tap-to-log fluid intake, meals, mobility and personal care
                  </li>
                  <li className="flex items-center gap-3 text-slate-800 dark:text-slate-200 font-medium text-sm">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5" />
                    </span>
                    Works completely offline across Wi-Fi dead zones and stone walls
                  </li>
                  <li className="flex items-center gap-3 text-slate-800 dark:text-slate-200 font-medium text-sm">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5" />
                    </span>
                    Critical allergy, dietary, and DNR alerts prominently flagged
                  </li>
                </ul>
              </div>

              <div className="lg:col-span-6 relative">
                <div className="relative h-80 sm:h-96 rounded-2xl overflow-hidden shadow-xl border border-slate-200/60 dark:border-white/10">
                  <Image
                    src="/images/tablet.jpg"
                    alt="Caregiver logging vitals directly onto a bedside tablet"
                    fill
                    className="object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent" />

                  {/* Overlay HUD cards */}
                  <div className="absolute bottom-4 left-4 right-4 p-4 glass dark:bg-slate-900/90 rounded-2xl border border-white/20 shadow-xl space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <Activity className="w-4 h-4 text-emerald-500" />
                        Bedside Care Log • Room 14B
                      </span>
                      <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold px-2 py-0.5 rounded-md bg-emerald-500/10">
                        ⚡ Offline Active
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300">
                      Eleanor Vance: Blood Pressure 124/82 mmHg • Metformin 500mg verified.
                    </p>
                    <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
                      <span>Sync status: Auto-sync on signal</span>
                      <span className="text-emerald-500 font-semibold">Saved locally ✓</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Operations Directors */}
          {activeTab === "directors" && (
            <div className="grid lg:grid-cols-12 gap-10 items-center animate-fade-in">
              <div className="lg:col-span-6 space-y-6">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-500/20">
                  Multi-Facility Governance
                </span>
                <h3 className="text-3xl font-bold text-slate-900 dark:text-white font-heading">
                  Enterprise clarity across all your homes.
                </h3>
                <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                  Gain panoramic oversight across multiple care facilities without relying on fragmented weekly emails. Monitor occupancy rates, incident reports, staffing ratios, and regulatory compliance from one centralised control tower.
                </p>
                <ul className="space-y-3.5 pt-2">
                  <li className="flex items-center gap-3 text-slate-800 dark:text-slate-200 font-medium text-sm">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5" />
                    </span>
                    Real-time cross-facility bed occupancy and revenue forecasting
                  </li>
                  <li className="flex items-center gap-3 text-slate-800 dark:text-slate-200 font-medium text-sm">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5" />
                    </span>
                    Centralised incident reporting and safeguarding escalation
                  </li>
                  <li className="flex items-center gap-3 text-slate-800 dark:text-slate-200 font-medium text-sm">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5" />
                    </span>
                    Standardised care policies and staff onboarding across all sites
                  </li>
                </ul>
              </div>

              <div className="lg:col-span-6 relative">
                <div className="relative h-80 sm:h-96 rounded-2xl overflow-hidden shadow-xl border border-slate-200/60 dark:border-white/10">
                  <Image
                    src="/images/hero-care.jpg"
                    alt="Care home operations overview"
                    fill
                    className="object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent" />

                  {/* Overlay HUD cards */}
                  <div className="absolute bottom-4 left-4 right-4 p-4 glass dark:bg-slate-900/90 rounded-2xl border border-white/20 shadow-xl space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-white/10">
                      <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <BarChart3 className="w-4 h-4 text-emerald-500" />
                        Apex Care Group • 4 Homes
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                        100% CQC Compliant
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center text-xs">
                      <div className="p-2 rounded-lg bg-white/5 border border-white/5">
                        <span className="text-[10px] text-slate-400 block font-mono">Total Beds</span>
                        <span className="text-sm font-bold text-slate-900 dark:text-white">186</span>
                      </div>
                      <div className="p-2 rounded-lg bg-white/5 border border-white/5">
                        <span className="text-[10px] text-slate-400 block font-mono">Occupancy</span>
                        <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">94.2%</span>
                      </div>
                      <div className="p-2 rounded-lg bg-white/5 border border-white/5">
                        <span className="text-[10px] text-slate-400 block font-mono">Audit Score</span>
                        <span className="text-sm font-bold text-slate-900 dark:text-white">99.8%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Families & Residents */}
          {activeTab === "families" && (
            <div className="grid lg:grid-cols-12 gap-10 items-center animate-fade-in">
              <div className="lg:col-span-6 space-y-6">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-500/20">
                  Family & Resident Circle
                </span>
                <h3 className="text-3xl font-bold text-slate-900 dark:text-white font-heading">
                  Peace of mind for families, every single day.
                </h3>
                <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                  Moving a loved one into residential care is emotional. The CarerLoop Family Portal offers transparent, comforting updates on daily meals, activities, and wellness without overburdening staff with constant phone inquiries.
                </p>
                <ul className="space-y-3.5 pt-2">
                  <li className="flex items-center gap-3 text-slate-800 dark:text-slate-200 font-medium text-sm">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5" />
                    </span>
                    Daily activity timeline, photo updates, and meal logs
                  </li>
                  <li className="flex items-center gap-3 text-slate-800 dark:text-slate-200 font-medium text-sm">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5" />
                    </span>
                    Direct, secure messaging with shift managers and key workers
                  </li>
                  <li className="flex items-center gap-3 text-slate-800 dark:text-slate-200 font-medium text-sm">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5" />
                    </span>
                    Easy visiting schedule requests and event reminders
                  </li>
                </ul>
              </div>

              <div className="lg:col-span-6 relative">
                <div className="relative h-80 sm:h-96 rounded-2xl overflow-hidden shadow-xl border border-slate-200/60 dark:border-white/10">
                  <Image
                    src="/images/resident.jpg"
                    alt="Senior resident smiling and relaxed in a warm care home lounge"
                    fill
                    className="object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent" />

                  {/* Overlay HUD cards */}
                  <div className="absolute bottom-4 left-4 right-4 p-4 glass dark:bg-slate-900/90 rounded-2xl border border-white/20 shadow-xl space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                        Family Portal Update • Eleanor Vance
                      </span>
                      <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                        Today 2:30 PM
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300">
                      Eleanor had a lovely afternoon in the garden and attended the live piano session. Ate lunch well and in high spirits!
                    </p>
                    <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
                      <span>Shared by: Key Worker Sarah</span>
                      <span className="text-emerald-500 font-semibold">Shared with 3 family members ✓</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
