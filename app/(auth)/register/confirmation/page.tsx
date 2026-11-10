"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import AuthCard from "@/components/auth/auth-card";
import { 
  CheckCircle2, 
  Mail, 
  Clock, 
  ArrowRight, 
  Copy, 
  Check, 
  ShieldAlert, 
  BedDouble,
  Building2 
} from "lucide-react";
import { useState } from "react";

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const refCode = searchParams.get("ref") || "REG-2026-8492";
  const residentName = searchParams.get("name") || "Eleanor Vance";
  const email = searchParams.get("email") || "family@example.co.uk";
  const careHome = searchParams.get("home") || "Meadow View Lodge";

  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(refCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 text-ink animate-fade-in">
      {/* Success Badge & Icon */}
      <div className="text-center space-y-2">
        <div className="grid h-16 w-16 place-items-center rounded-md bg-mint text-teal-brand mx-auto shadow-sm">
          <CheckCircle2 className="h-9 w-9" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-ink">
          Registration Submitted
        </h2>
        <p className="text-xs sm:text-sm text-ink/65 max-w-sm mx-auto">
          Application created for <span className="font-semibold text-ink">{residentName}</span> at <span className="font-semibold text-ink">{careHome}</span>.
        </p>
      </div>

      {/* Generated Reference Callout */}
      <div className="rounded-2xl border border-teal-brand/30 bg-mint/40 p-4 sm:p-5 text-center space-y-1.5 shadow-xs">
        <span className="text-[11px] font-semibold text-teal-deep uppercase tracking-wider">
          Your Unique Registration Reference
        </span>
        <div className="flex items-center justify-center gap-2 pt-1">
          <span className="font-mono text-2xl sm:text-3xl font-bold tracking-wider text-teal-brand">
            {refCode}
          </span>
          <button
            onClick={handleCopy}
            className="p-1.5 rounded-lg bg-white/80 hover:bg-white text-teal-brand border border-teal-brand/20 transition-colors cursor-pointer"
            title="Copy reference code"
          >
            {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
          </button>
        </div>
        <p className="text-[11px] text-ink/60">
          Save this code for correspondence with care home admissions.
        </p>
      </div>

      {/* Next Steps: Highlighting Section 4.5 Separation of Concerns */}
      <div className="space-y-3 pt-2">
        <p className="text-xs font-bold text-ink uppercase tracking-wider">
          Next Steps In Your Admission Pipeline:
        </p>

        <div className="space-y-2.5 text-xs">
          {/* Step 1 */}
          <div className="flex items-start gap-3 p-3.5 rounded-xl border border-ink/10 bg-cream/40">
            <div className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-teal-brand text-white font-bold text-xs mt-0.5">
              1
            </div>
            <div>
              <p className="font-semibold text-ink">Verify Your Email Address</p>
              <p className="text-ink/65 mt-0.5 leading-relaxed">
                We sent a secure verification link to <span className="font-semibold text-ink">{email}</span>. Click the link in your email to confirm ownership.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex items-start gap-3 p-3.5 rounded-xl border border-ink/10 bg-cream/40">
            <div className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-ink/10 text-ink font-bold text-xs mt-0.5">
              2
            </div>
            <div>
              <p className="font-semibold text-ink">Clinical Assessment & Review</p>
              <p className="text-ink/65 mt-0.5 leading-relaxed">
                The care home manager and clinical lead will review care notes, dietary directives, and room suitability.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex items-start gap-3 p-3.5 rounded-xl border border-ink/10 bg-cream/40">
            <div className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-ink/10 text-ink font-bold text-xs mt-0.5">
              3
            </div>
            <div>
              <p className="font-semibold text-ink">Bed Placement & Admission</p>
              <p className="text-ink/65 mt-0.5 leading-relaxed">
                Upon approval, an active room bed is allocated and your resident portal becomes fully active.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Section 4.5 Crucial Rule Reminder */}
      {/* <div className="p-3.5 rounded-xl border border-sun/40 bg-sun-soft/60 text-xs text-ink/80 flex items-start gap-2.5">
        <Clock className="h-4 w-4 text-[#8b6100] shrink-0 mt-0.5" />
        <p>
          <span className="font-bold text-[#8b6100]">Important Rule: </span>
          Email verification and admission are separate operations. Verifying your email confirms your identity, after which the care home team approves formal admission.
        </p>
      </div> */}

      {/* Action buttons */}
      <div className="pt-2 flex flex-col gap-3">
        <a
          href={`/verify-email?token=demo_token_${refCode}&email=${encodeURIComponent(email)}`}
          className=" py-3 rounded-md bg-teal-brand text-white font-medium text-xs sm:text-sm text-center hover:bg-teal-deep transition-all shadow-sm"
        >
          Simulate Email Verification →
        </a>
        <a
          href="/login"
          className=" py-3 rounded-md border border-ink/15 text-ink font-medium text-xs sm:text-sm text-center hover:bg-cream transition-all"
        >
          Return to Sign In
        </a>
      </div>
    </div>
  );
}

export default function RegisterConfirmationPage() {
  return (
    <AuthCard
      title="Registration Received"
      badge="Stage 1 of 8 Complete"
    >
      <Suspense fallback={<div className="p-8 text-center text-xs text-ink/50">Loading confirmation details...</div>}>
        <ConfirmationContent />
      </Suspense>
    </AuthCard>
  );
}

