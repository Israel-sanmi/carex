"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Logo from "@/components/landing/logo";
import ThemeToggle from "@/components/landing/theme-toggle";
import {
  CheckCircle2,
  Clock,
  XCircle,
  Building2,
  Home,
  User,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Phone,
  Mail,
  RefreshCw,
  FileCheck2,
  AlertTriangle,
} from "lucide-react";

type ResidentStatusType =
  | "PENDING_VERIFICATION"
  | "VERIFIED"
  | "PENDING_ADMISSION"
  | "PLACED"
  | "REJECTED"
  | "TRANSFER_PENDING"
  | "TRANSFER_APPROVED"
  | "TRANSFER_REJECTED";

function AdmissionStatusContent() {
  const searchParams = useSearchParams();
  const refParam = searchParams.get("ref") || "REG-2026-8492";
  const nameParam = searchParams.get("name") || "Arthur Pendelton";
  const emailParam =
    searchParams.get("email") || "arthur.pendelton@example.co.uk";
  const homeParam = searchParams.get("home") || "St. Jude's Residential Home";
  const orgParam = searchParams.get("org") || "Apex Care Group";
  const typeParam = searchParams.get("type") || "New Admission"; // or 'Transfer'
  const initialStatus =
    (searchParams.get("status") as ResidentStatusType) || "PENDING_ADMISSION";

  const [currentStatus, setCurrentStatus] =
    useState<ResidentStatusType>(initialStatus);

  const statusConfig = {
    PENDING_VERIFICATION: {
      badge: "Pending Verification",
      color:
        "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-500/30",
      description:
        "Email verification is outstanding. Please check your inbox.",
    },
    VERIFIED: {
      badge: "Email Verified",
      color:
        "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-500/30",
      description: "Email confirmed. Queued for administrative review.",
    },
    PENDING_ADMISSION: {
      badge: "Pending Admission (Awaiting Review)",
      color:
        "bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-500/30",
      description:
        "Registration submitted. Waiting for authorised administrator approval.",
    },
    PLACED: {
      badge: "Placed & Admitted",
      color:
        "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-500/30",
      description:
        "Official admission confirmed. Resident placed in care home.",
    },
    REJECTED: {
      badge: "Admission Declined",
      color:
        "bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-500/30",
      description: "Admission was declined by the care organisation.",
    },
    TRANSFER_PENDING: {
      badge: "Transfer Pending",
      color:
        "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-500/30",
      description:
        "Destination organisation has not decided yet. Resident remains with current care home.",
    },
    TRANSFER_APPROVED: {
      badge: "Transfer Approved",
      color:
        "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-500/30",
      description: "Care organisation transfer successfully completed.",
    },
    TRANSFER_REJECTED: {
      badge: "Transfer Rejected",
      color:
        "bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-500/30",
      description:
        "Transfer declined. Resident remains with previous care home.",
    },
  };

  return (
    <div className="space-y-6 text-ink dark:text-slate-100 animate-fade-in max-w-2xl mx-auto">
      {/* Status Simulator Controls for testing UI */}
      <div className="p-3 rounded-md glass dark:bg-slate-900/80 border border-teal-brand/30 dark:border-emerald-500/30 text-xs flex flex-wrap items-center justify-between gap-2 shadow-xs">
        <span className="font-bold text-teal-deep dark:text-emerald-300 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          Interactive Status Preview:
        </span>
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setCurrentStatus("PENDING_ADMISSION")}
            className={`px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer ${
              currentStatus === "PENDING_ADMISSION"
                ? "bg-purple-600 text-white"
                : "bg-cream/80 dark:bg-slate-800 text-ink/70 dark:text-slate-300 hover:bg-cream"
            }`}
          >
            Awaiting Review
          </button>
          <button
            onClick={() => setCurrentStatus("PLACED")}
            className={`px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer ${
              currentStatus === "PLACED"
                ? "bg-emerald-600 text-white"
                : "bg-cream/80 dark:bg-slate-800 text-ink/70 dark:text-slate-300 hover:bg-cream"
            }`}
          >
            Preview Approved
          </button>
          <button
            onClick={() => setCurrentStatus("REJECTED")}
            className={`px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer ${
              currentStatus === "REJECTED"
                ? "bg-rose-600 text-white"
                : "bg-cream/80 dark:bg-slate-800 text-ink/70 dark:text-slate-300 hover:bg-cream"
            }`}
          >
            Preview Declined
          </button>
          <button
            onClick={() => setCurrentStatus("TRANSFER_PENDING")}
            className={`px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer ${
              currentStatus === "TRANSFER_PENDING"
                ? "bg-amber-600 text-white"
                : "bg-cream/80 dark:bg-slate-800 text-ink/70 dark:text-slate-300 hover:bg-cream"
            }`}
          >
            Preview Transfer
          </button>
        </div>
      </div>

      {/* Main Status Header Card */}
      <div className="glass dark:bg-slate-900/80 rounded-md p-6 sm:p-8 border border-white/80 dark:border-white/10 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-ink/10 dark:border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-md bg-teal-brand/10 dark:bg-emerald-950 text-teal-deep dark:text-emerald-300 border border-teal-brand/20 dark:border-emerald-500/20">
                {refParam}
              </span>
              <span className="text-xs text-ink/60 dark:text-slate-400">
                Type:{" "}
                <span className="font-semibold text-ink dark:text-white">
                  {typeParam}
                </span>
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-ink dark:text-white font-heading mt-2">
              {nameParam}
            </h1>
            <p className="text-xs text-ink/65 dark:text-slate-400">
              {emailParam}
            </p>
          </div>

          <div>
            <span
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold border shadow-xs ${
                statusConfig[currentStatus].color
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
              {statusConfig[currentStatus].badge}
            </span>
          </div>
        </div>

        {/* Destination Facility Context */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-md bg-cream/50 dark:bg-slate-800/60 border border-ink/5 dark:border-white/5 space-y-1">
            <span className="text-[10px] uppercase font-bold text-ink/50 dark:text-slate-400 block">
              Destination Care Organisation
            </span>
            <p className="font-bold text-ink dark:text-white text-sm flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-teal-brand dark:text-emerald-400" />
              {orgParam}
            </p>
          </div>

          <div className="p-3.5 rounded-md bg-cream/50 dark:bg-slate-800/60 border border-ink/5 dark:border-white/5 space-y-1">
            <span className="text-[10px] uppercase font-bold text-ink/50 dark:text-slate-400 block">
              Requested Care Home
            </span>
            <p className="font-bold text-ink dark:text-white text-sm flex items-center gap-1.5">
              <Home className="w-4 h-4 text-teal-brand dark:text-emerald-400" />
              {homeParam}
            </p>
          </div>
        </div>

        {/* Section 1 What The Resident Sees: Progress Checklist */}
        <div className="space-y-3 pt-2">
          <h2 className="text-xs font-bold text-ink dark:text-white uppercase tracking-wider">
            Onboarding Progress Checklist (Section 1)
          </h2>

          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-3 p-3 rounded-md bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-500/20">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span className="font-semibold text-emerald-900 dark:text-emerald-200">
                Account created
              </span>
              <span className="ml-auto text-[10px] text-emerald-700 dark:text-emerald-400">
                Completed
              </span>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-md bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-500/20">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span className="font-semibold text-emerald-900 dark:text-emerald-200">
                Email verified
              </span>
              <span className="ml-auto text-[10px] text-emerald-700 dark:text-emerald-400">
                Confirmed
              </span>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-md bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-500/20">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span className="font-semibold text-emerald-900 dark:text-emerald-200">
                Registration submitted
              </span>
              <span className="ml-auto text-[10px] text-emerald-700 dark:text-emerald-400">
                Dossier Generated
              </span>
            </div>

            <div
              className={`flex items-center gap-3 p-3 rounded-md border transition-all ${
                currentStatus === "PLACED" ||
                currentStatus === "TRANSFER_APPROVED"
                  ? "bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-500/20"
                  : currentStatus === "REJECTED" ||
                      currentStatus === "TRANSFER_REJECTED"
                    ? "bg-rose-50/60 dark:bg-rose-950/30 border-rose-200 dark:border-rose-500/20"
                    : "bg-purple-50/60 dark:bg-purple-950/30 border-purple-200 dark:border-purple-500/20"
              }`}
            >
              {currentStatus === "PLACED" ||
              currentStatus === "TRANSFER_APPROVED" ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              ) : currentStatus === "REJECTED" ||
                currentStatus === "TRANSFER_REJECTED" ? (
                <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
              ) : (
                <Clock className="w-4 h-4 text-purple-600 dark:text-purple-400 animate-spin shrink-0" />
              )}
              <span
                className={`font-semibold ${
                  currentStatus === "PLACED" ||
                  currentStatus === "TRANSFER_APPROVED"
                    ? "text-emerald-900 dark:text-emerald-200"
                    : currentStatus === "REJECTED" ||
                        currentStatus === "TRANSFER_REJECTED"
                      ? "text-rose-900 dark:text-rose-200"
                      : "text-purple-900 dark:text-purple-200"
                }`}
              >
                Waiting for administrator approval
              </span>
              <span className="ml-auto text-[10px] font-bold">
                {currentStatus === "PLACED" ||
                currentStatus === "TRANSFER_APPROVED"
                  ? "Approved"
                  : currentStatus === "REJECTED" ||
                      currentStatus === "TRANSFER_REJECTED"
                    ? "Declined"
                    : "In Review"}
              </span>
            </div>
          </div>
        </div>

        {/* Outcome Box: Approved vs Rejected vs Pending */}
        {(currentStatus === "PLACED" ||
          currentStatus === "TRANSFER_APPROVED") && (
          <div className="p-5 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-900 dark:text-emerald-200 space-y-3 animate-fade-in">
            <div className="flex items-center gap-2 font-bold text-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              Admission Approved! You are officially admitted into {homeParam}.
            </div>
            <p className="text-xs leading-relaxed text-emerald-800 dark:text-emerald-300">
              The administrator has allocated your physical room placement
              (Suite 104, Bed 1) and your designated Key Worker has been
              assigned. You may now enter your resident portal to view your
              daily wellbeing journal, care plan, and meal schedules.
            </p>
            <div className="pt-1">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-md transition-all"
              >
                <span>Enter Resident Portal</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}

        {(currentStatus === "REJECTED" ||
          currentStatus === "TRANSFER_REJECTED") && (
          <div className="p-5 rounded-md bg-rose-500/10 border border-rose-500/30 text-rose-900 dark:text-rose-200 space-y-3 animate-fade-in">
            <div className="flex items-center gap-2 font-bold text-sm">
              <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
              Registration Declined
            </div>
            <p className="text-xs leading-relaxed text-rose-800 dark:text-rose-300">
              The care organisation reviewed your registration and was unable to
              offer placement at this time due to bed capacity or specialised
              care requirements.
              {typeParam === "Transfer" &&
                " For this transfer request, your resident record remains securely with your previous care organisation."}
            </p>
            <div className="text-[11px] text-rose-700 dark:text-rose-400 pt-1 flex items-center gap-2">
              <Phone className="w-3.5 h-3.5" />
              Admissions Support Desk: +44 (0) 117 496 0281
            </div>
          </div>
        )}

        {currentStatus === "PENDING_ADMISSION" && (
          <div className="p-5 rounded-md bg-purple-500/10 border border-purple-500/30 text-purple-900 dark:text-purple-200 space-y-2">
            <div className="flex items-center gap-2 font-bold text-sm">
              <Clock className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              Awaiting Administrative Evaluation
            </div>
            <p className="text-xs leading-relaxed text-purple-800 dark:text-purple-300">
              Your identity has been verified. The Care Home Manager is
              reviewing your clinical requirements, dietary directives, and room
              vacancies. You will receive an automated notification as soon as
              the admission decision is finalized.
            </p>
          </div>
        )}

        {currentStatus === "TRANSFER_PENDING" && (
          <div className="p-5 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 space-y-2">
            <div className="flex items-center gap-2 font-bold text-sm">
              <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              Transfer In Progress
            </div>
            <p className="text-xs leading-relaxed text-amber-800 dark:text-amber-300">
              Destination organisation ({orgParam}) has not decided yet. As per
              regulatory compliance rules, you remain officially supported by
              your existing care organisation until the transfer is formally
              approved.
            </p>
          </div>
        )}

        {/* Back Link */}
        <div className="pt-4 border-t border-ink/10 dark:border-white/10 flex items-center justify-between text-xs">
          <Link
            href="/"
            className="text-teal-brand dark:text-emerald-400 font-semibold hover:underline"
          >
            ← Return to CarerLoop Home
          </Link>
          <Link
            href="/login"
            className="px-4 py-2 rounded-md border border-ink/10 dark:border-white/10 hover:bg-cream dark:hover:bg-slate-800 text-ink dark:text-white font-medium transition-all"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function AdmissionStatusPage() {
  return (
    <div className="relative min-h-screen bg-slate-50 dark:bg-slate-950 p-4 sm:p-6 lg:p-8 font-sans text-ink dark:text-slate-100 selection:bg-emerald-500/30 overflow-x-hidden transition-colors duration-300">
      <div className="aurora-bg" />

      {/* Header */}
      <div className="relative z-10 w-full max-w-4xl mx-auto flex items-center justify-between py-2 mb-6">
        <Link
          href="/"
          className="inline-block transition-transform hover:scale-102"
        >
          <Logo />
        </Link>
        <ThemeToggle />
      </div>

      <div className="relative z-10 w-full max-w-4xl mx-auto my-4">
        <Suspense
          fallback={
            <div className="p-8 text-center text-xs text-ink/50 dark:text-slate-400">
              Loading admission status...
            </div>
          }
        >
          <AdmissionStatusContent />
        </Suspense>
      </div>

      {/* Footer */}
      <div className="relative z-10 w-full max-w-4xl mx-auto py-6 text-center text-xs text-ink/50 dark:text-slate-500">
        <p>© 2026 CARERLOOP. Better Organised Care. Better Lives.</p>
      </div>
    </div>
  );
}
