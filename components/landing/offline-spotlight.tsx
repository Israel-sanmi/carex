"use client";

import Image from "next/image";
import {
  WifiOff,
  ShieldCheck,
  Database,
  RefreshCw,
  CheckCircle2,
  Lock,
  Zap,
} from "lucide-react";

export default function OfflineSpotlight() {
  return (
    <section className="relative py-20 lg:py-28 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl p-8 sm:p-12 lg:p-14 bg-gradient-to-br from-teal-950 via-slate-900 to-[#040e0f] text-white shadow-2xl overflow-hidden border border-white/10">
          {/* Subtle animated light orbs inside */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-teal-500/15 blur-3xl pointer-events-none" />

          <div className="grid lg:grid-cols-12 gap-10 items-center relative z-10">
            {/* Left Content (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-emerald-300 text-xs font-semibold uppercase tracking-wider border border-white/10 shadow-xs">
                <WifiOff className="w-3.5 h-3.5" />
                Offline-First Architecture
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-heading tracking-tight leading-tight">
                Care doesn’t stop when <br />
                <span className="text-emerald-400 font-serif italic font-normal">the Wi-Fi does</span>.
              </h2>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
                Residential care facilities are notorious for thick Victorian brick walls and basement Wi-Fi dead zones. CarerLoop operates as an offline-first Progressive Web App (PWA). Your carers can record observations, review allergy warnings, and log medications anywhere in the building.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm space-y-2">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold">
                    <Lock className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-sm text-white">
                    AES-256 Storage
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Local IndexedDB encryption protects records at rest on staff tablets.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm space-y-2">
                  <div className="w-9 h-9 rounded-xl bg-teal-500/20 text-teal-300 flex items-center justify-center font-bold">
                    <Database className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-sm text-white">
                    Zero Downtime
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Daily care plans and emergency protocols are cached prior to shifts.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm space-y-2">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold">
                    <RefreshCw className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-sm text-white">
                    Instant Auto-Sync
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Changes silently merge the split-second signal is restored.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Visual (5 cols): Bedside tablet in action with live status badge */}
            <div className="lg:col-span-5 relative">
              <div className="relative h-72 sm:h-84 lg:h-96 rounded-2xl overflow-hidden shadow-2xl border border-white/15">
                <Image
                  src="/images/tablet.jpg"
                  alt="Carer using tablet in residential room with offline sync"
                  fill
                  className="object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/25 to-transparent" />

                {/* Floating status badge */}
                <div className="absolute bottom-4 left-4 right-4 p-4 glass dark:bg-slate-900/90 rounded-2xl border border-white/20 shadow-2xl space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
                      <span className="text-xs font-bold text-white">
                        Offline Mode Active
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                      PWA Local DB
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">
                    14 observations logged in Room 22B. Queued for silent background replication.
                  </p>
                  <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
                    <span>Data integrity: 100% verified</span>
                    <span className="text-emerald-400 font-semibold">Zero lost records</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
