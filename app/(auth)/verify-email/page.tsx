"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import AuthCard from "@/components/auth/auth-card";
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Mail, 
  ArrowRight, 
  RotateCcw, 
  ShieldCheck,
  Send
} from "lucide-react";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const emailParam = searchParams.get("email") || "";

  const [status, setStatus] = useState<
    "verifying" | "success" | "expired" | "failed" | "resend_form"
  >(token ? "verifying" : "resend_form");

  const [emailInput, setEmailInput] = useState(emailParam);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      // Simulate token validation against /api/v1/auth/verify-email
      const timer = setTimeout(() => {
        if (token.includes("expired")) {
          setStatus("expired");
        } else if (token.includes("invalid")) {
          setStatus("failed");
        } else {
          setStatus("success");
        }
      }, 900);
      return () => clearTimeout(timer);
    }
  }, [token]);

  const handleResend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput) return;
    setLoading(true);

    // Simulate /api/v1/auth/resend-verification
    setTimeout(() => {
      setLoading(false);
      setResendSuccess(true);
    }, 700);
  };

  return (
    <div className="space-y-6 text-ink">
      
      {/* 1. VERIFYING STATE */}
      {status === "verifying" && (
        <div className="py-8 text-center space-y-4 animate-fade-in">
          <div className="relative mx-auto h-14 w-14">
            <div className="h-14 w-14 rounded-full border-4 border-teal-brand/20 border-t-teal-brand animate-spin" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-ink">Verifying Email Address</h2>
            <p className="text-xs text-ink/65 mt-1">
              Contacting CarerLoop authentication servers to validate your cryptographic token...
            </p>
          </div>
        </div>
      )}

      {/* 2. SUCCESS STATE (Section 4.8) */}
      {status === "success" && (
        <div className="py-4 text-center space-y-5 animate-fade-in">
          <div className="grid h-16 w-16 place-items-center rounded-full bg-mint text-teal-brand mx-auto shadow-sm">
            <CheckCircle2 className="h-9 w-9" />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-ink">
              Email Verified Successfully
            </h2>
            <p className="text-xs sm:text-sm text-ink/65 mt-1.5 max-w-sm mx-auto leading-relaxed">
              Your email ownership is confirmed. If you registered as a resident, your application is now queued for care home clinical review.
            </p>
          </div>

          {/* Separation reminder */}
          {/* <div className="p-3.5 rounded-xl border border-teal-brand/20 bg-mint/40 text-xs text-left text-ink/80 space-y-1">
            <p className="font-semibold text-teal-deep">Next Operation:</p>
            <p>
              Your care home administration team will review your admission details and assign an available room bed. You will receive an alert once admitted.
            </p>
          </div> */}

          <div className="pt-2">
            <a
              href="/login"
              className="inline-flex items-center gap-2 rounded-full bg-teal-brand px-7 py-3 text-sm font-semibold text-white hover:bg-teal-deep transition-all shadow-sm"
            >
              <span>Continue to Sign In</span>
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      )}

      {/* 3. EXPIRED STATE (Section 4.8) */}
      {status === "expired" && (
        <div className="py-4 text-center space-y-5 animate-fade-in">
          <div className="grid h-16 w-16 place-items-center rounded-full bg-sun-soft text-[#8b6100] mx-auto shadow-sm">
            <Clock className="h-9 w-9" />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-ink">
              Verification Link Expired
            </h2>
            <p className="text-xs sm:text-sm text-ink/65 mt-1.5 max-w-sm mx-auto leading-relaxed">
              For security, email verification links expire after 24 hours. Request a new link below to continue.
            </p>
          </div>

          <button
            onClick={() => setStatus("resend_form")}
            className="inline-flex items-center gap-2 rounded-full bg-teal-brand px-6 py-2.5 text-xs font-semibold text-white hover:bg-teal-deep transition-all cursor-pointer"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Request New Verification Link</span>
          </button>
        </div>
      )}

      {/* 4. FAILED STATE (Section 4.8) */}
      {status === "failed" && (
        <div className="py-4 text-center space-y-5 animate-fade-in">
          <div className="grid h-16 w-16 place-items-center rounded-full bg-destructive/10 text-destructive mx-auto shadow-sm">
            <XCircle className="h-9 w-9" />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-ink">
              Verification Failed
            </h2>
            <p className="text-xs sm:text-sm text-ink/65 mt-1.5 max-w-sm mx-auto leading-relaxed">
              This verification link is invalid or has already been used. Please request a fresh link.
            </p>
          </div>

          <button
            onClick={() => setStatus("resend_form")}
            className="inline-flex items-center gap-2 rounded-full bg-ink text-white px-6 py-2.5 text-xs font-semibold hover:bg-teal-deep transition-all cursor-pointer"
          >
            <span>Resend Verification Email</span>
          </button>
        </div>
      )}

      {/* 5. RESEND FORM (Section 4.8) */}
      {status === "resend_form" && (
        <div className="space-y-4 animate-fade-in">
          {resendSuccess ? (
            <div className="p-4 rounded-2xl bg-mint/60 border border-teal-brand/30 text-center space-y-2">
              <CheckCircle2 className="h-8 w-8 text-teal-brand mx-auto" />
              <p className="text-sm font-bold text-teal-deep">Fresh Link Dispatched</p>
              <p className="text-xs text-ink/70">
                We sent a new verification link to <span className="font-semibold text-ink">{emailInput}</span>. Please check your inbox.
              </p>
              <div className="pt-2">
                <a
                  href="/login"
                  className="text-xs font-semibold text-teal-brand underline decoration-teal-brand/40 underline-offset-2"
                >
                  Return to Sign In →
                </a>
              </div>
            </div>
          ) : (
            <form onSubmit={handleResend} className="space-y-4 text-xs sm:text-sm">
              <div className="space-y-1.5">
                <label className="font-semibold text-ink">Your Registered Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-ink/40">
                    <Mail className="h-4 w-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="name@carehome.co.uk"
                    className="w-full rounded-xl border border-ink/15 bg-cream/30 pl-10 pr-4 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-teal-brand/40 shadow-xs"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-full bg-teal-brand text-white font-medium text-xs sm:text-sm hover:bg-teal-deep transition-all shadow-sm cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
                <span>{loading ? "Sending..." : "Send Verification Link"}</span>
              </button>

              <div className="pt-2 text-center">
                <a
                  href="/login"
                  className="text-xs text-ink/65 hover:text-ink font-medium underline underline-offset-4"
                >
                  Remember your credentials? Sign in
                </a>
              </div>
            </form>
          )}

          {/* Quick simulation pills for testing */}
          <div className="pt-4 border-t border-ink/10 text-[11px] text-ink/50 space-y-1 text-center">
            <p className="font-semibold text-ink/70">Test different verification states:</p>
            <div className="flex justify-center gap-2 pt-1 flex-wrap">
              <a href="/verify-email?token=valid_test_token" className="px-2 py-0.5 rounded bg-cream border border-ink/10 hover:border-teal-brand text-teal-brand">
                Simulate Valid
              </a>
              <a href="/verify-email?token=expired_test_token" className="px-2 py-0.5 rounded bg-cream border border-ink/10 hover:border-sun text-[#8b6100]">
                Simulate Expired
              </a>
              <a href="/verify-email?token=invalid_test_token" className="px-2 py-0.5 rounded bg-cream border border-ink/10 hover:border-destructive text-destructive">
                Simulate Failed
              </a>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <AuthCard
      title="Email Verification"
      subtitle="Confirming your email identity for secure care home portal access."
      badge="Identity Security"
    >
      <Suspense fallback={<div className="p-8 text-center text-xs text-ink/50">Processing verification request...</div>}>
        <VerifyEmailContent />
      </Suspense>
    </AuthCard>
  );
}

