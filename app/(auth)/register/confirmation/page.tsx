"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import AuthCard from "@/components/auth/auth-card";
import {
  CheckCircle2,
  Mail,
  Clock,
  ArrowRight,
  Copy,
  Check,
  ShieldCheck,
  Building2,
  Home,
  Activity,
} from "lucide-react";

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const refCode = searchParams.get("ref") || "REG-2026-8492";
  const residentName = searchParams.get("name") || "Arthur Pendelton";
  const email = searchParams.get("email") || "arthur.pendelton@example.co.uk";
  const careHome = searchParams.get("home") || "St. Jude's Residential Home";
  const org = searchParams.get("org") || "Apex Care Group";

  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(refCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 text-ink dark:text-slate-100 animate-fade-in">
      {/* Success Badge & Icon */}
      <div className="text-center space-y-2">
        <div className="grid h-16 w-16 place-items-center rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 mx-auto shadow-sm">
          <CheckCircle2 className="h-9 w-9" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-ink dark:text-white font-heading">
          Resident Registration Received
        </h2>
        <p className="text-xs sm:text-sm text-ink/65 dark:text-slate-300 max-w-sm mx-auto">
          Account and master resident profile generated for{" "}
          <span className="font-semibold text-ink dark:text-white">
            {residentName}
          </span>{" "}
          at{" "}
          <span className="font-semibold text-ink dark:text-white">
            {careHome}
          </span>
          .
        </p>
      </div>

      {/* Generated Reference Callout */}
      <div className="rounded-2xl border border-teal-brand/30 dark:border-emerald-500/30 bg-mint/40 dark:bg-slate-800/60 p-4 sm:p-5 text-center space-y-1.5 shadow-xs">
        <span className="text-[11px] font-semibold text-teal-deep dark:text-emerald-400 uppercase tracking-wider">
          Unique Registration Reference Code
        </span>
        <div className="flex items-center justify-center gap-2 pt-1">
          <span className="font-mono text-2xl sm:text-3xl font-bold tracking-wider text-teal-brand dark:text-emerald-400">
            {refCode}
          </span>
          <button
            onClick={handleCopy}
            className="p-1.5 rounded-md bg-white/80 dark:bg-slate-700 hover:bg-white text-teal-brand dark:text-emerald-400 border border-teal-brand/20 dark:border-white/10 transition-colors cursor-pointer"
            title="Copy reference code"
          >
            {copied ? (
              <Check className="h-4 w-4 text-emerald-600" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </button>
        </div>
        <p className="text-[11px] text-ink/60 dark:text-slate-400">
          Save this reference code to track your admission status anytime.
        </p>
      </div>

      
      

      {/* Action buttons */}
      <div className="pt-2 flex flex-col gap-3">
        <Link
          href={`/verify-email?token=demo_token_${refCode}&email=${encodeURIComponent(email)}&ref=${refCode}&name=${encodeURIComponent(residentName)}&home=${encodeURIComponent(careHome)}&org=${encodeURIComponent(org)}`}
          className="py-3 rounded-md bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white font-semibold text-xs sm:text-sm text-center transition-all shadow-md"
        >
          Email Verification →
        </Link>
        <Link
          href={`/admission-status?ref=${refCode}&name=${encodeURIComponent(residentName)}&email=${encodeURIComponent(email)}&home=${encodeURIComponent(careHome)}&org=${encodeURIComponent(org)}&status=PENDING_ADMISSION`}
          className="py-3 rounded-md border border-ink/15 dark:border-white/15 text-ink dark:text-white font-semibold text-xs sm:text-sm text-center hover:bg-cream dark:hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
        >
          <Activity className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Admission Status</span>
        </Link>
      </div>
    </div>
  );
}

export default function RegisterConfirmationPage() {
  return (
    <AuthCard
      title="Registration Received"
      subtitle="Next steps to complete admission"
    >
      <Suspense
        fallback={
          <div className="p-8 text-center text-xs text-ink/50 dark:text-slate-400">
            Loading confirmation details...
          </div>
        }
      >
        <ConfirmationContent />
      </Suspense>
    </AuthCard>
  );
}
