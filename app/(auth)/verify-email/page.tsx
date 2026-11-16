"use client";

import { Suspense, useState, useEffect, useRef } from "react";
import { useSearchParams, useParams } from "next/navigation";
import Link from "next/link";
import AuthCard from "@/components/auth/auth-card";
import {
  useVerifyEmailMutation,
  useResendVerificationMutation,
} from "@/lib/hooks/use-auth-mutations";
import {
  CheckCircle2,
  XCircle,
  Mail,
  ArrowRight,
  Send,
  AlertCircle,
  Clock,
} from "lucide-react";

export function VerifyEmailContent({ tokenProp }: { tokenProp?: string }) {
  const searchParams = useSearchParams();
  const urlParams = useParams();

  const token =
    tokenProp ||
    (typeof urlParams?.token === "string" ? urlParams.token : null) ||
    searchParams.get("token") ||
    searchParams.get("t") ||
    "";

  const emailParam = searchParams.get("email") || "";

  const [resendEmail, setResendEmail] = useState(emailParam);
  const [resendSuccessMessage, setResendSuccessMessage] = useState("");

  const verifyMutation = useVerifyEmailMutation();
  const resendMutation = useResendVerificationMutation();
  const hasTriggeredRef = useRef(false);

  // Automatically trigger email verification when token is present on mount
  useEffect(() => {
    if (token && !hasTriggeredRef.current) {
      hasTriggeredRef.current = true;
      verifyMutation.mutate({ token });
    }
  }, [token]);

  const handleResend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resendEmail) return;
    setResendSuccessMessage("");

    resendMutation.mutate(
      { email: resendEmail.trim() },
      {
        onSuccess: (data) => {
          setResendSuccessMessage(
            data?.message ||
              "If an account exists with this email address, a new verification link has been sent.",
          );
        },
      },
    );
  };

  // State 1: Verifying token in progress (token present and awaiting API result)
  if (token && !verifyMutation.isSuccess && !verifyMutation.isError) {
    return (
      <div className="py-8 text-center space-y-4 animate-fade-in">
        <div className="relative mx-auto h-14 w-14">
          <div className="h-14 w-14 rounded-full border-4 border-teal-brand/20 border-t-teal-brand animate-spin" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-ink">
            Verifying Your Email Address
          </h2>
          <p className="text-xs text-ink/70 mt-1 max-w-xs mx-auto leading-relaxed">
            Validating your email verification token with CarerLoop
            authentication servers...
          </p>
        </div>
      </div>
    );
  }

  // State 2: Verification Successful
  if (token && verifyMutation.isSuccess) {
    const successMessage =
      verifyMutation.data?.message || "Email verified successfully.";

    return (
      <div className="py-4 text-center space-y-5 animate-fade-in">
        <div className="grid h-16 w-16 place-items-center rounded-md bg-emerald-100 text-emerald-600 mx-auto shadow-sm">
          <CheckCircle2 className="h-9 w-9" />
        </div>

        <div>
          <h2 className="text-2xl font-bold text-ink font-heading">
            {successMessage}
          </h2>
          <p className="text-xs sm:text-sm text-ink/70 mt-1.5 max-w-sm mx-auto leading-relaxed">
            Your email has been confirmed. Your account is now active and ready
            for use.
          </p>
        </div>

        <div className="pt-2">
          <Link
            href="/login"
            className="w-full py-3.5 rounded-full bg-teal-brand text-white font-medium text-sm sm:text-base hover:bg-teal-deep shadow-[0_10px_25px_-8px_rgba(15,118,110,0.5)] transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Sign In to CarerLoop</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  const isAlreadyUsed =
    verifyMutation.error?.message?.toLowerCase().includes("already") ||
    verifyMutation.error?.status === 409;

  // State 3: Verification Failed OR No Token in URL (Resend form)
  return (
    <div className="space-y-5 text-ink animate-fade-in">
      {token && verifyMutation.isError && (
        <div className="p-4 rounded-md border border-coral/30 bg-coral-soft/50 text-ink space-y-3">
          <div className="flex items-start gap-2 text-coral">
            <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-sm">
                {verifyMutation.error.message ||
                  "Invalid or expired verification token"}
              </p>
              <p className="text-xs text-ink/70 mt-1 leading-relaxed">
                {isAlreadyUsed
                  ? "This verification link has already been used. If you have already verified your email, you can proceed directly to sign in."
                  : "The link may have expired. Please enter your email below to request a new link."}
              </p>
            </div>
          </div>

          {isAlreadyUsed && (
            <div className="pt-1">
              <Link
                href="/login"
                className="w-full py-2.5 rounded-md bg-teal-brand text-white font-medium text-xs sm:text-sm hover:bg-teal-deep transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <span>Proceed to Sign In</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )}
        </div>
      )}

      {!token && (
        <div className="text-center space-y-1.5 pb-2">
          <div className="grid h-12 w-12 place-items-center rounded-full bg-mint text-teal-brand mx-auto mb-2">
            <Mail className="h-6 w-6" />
          </div>
          <h2 className="text-lg font-bold text-ink">
            Resend Email Verification
          </h2>
          <p className="text-xs text-ink/70 max-w-xs mx-auto leading-relaxed">
            Enter your email address to receive a fresh verification link.
          </p>
        </div>
      )}

      {resendSuccessMessage ? (
        <div className="py-4 text-center space-y-4">
          <div className="grid h-12 w-12 place-items-center rounded-full bg-mint text-teal-brand mx-auto">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <p className="text-xs text-ink/80 leading-relaxed max-w-sm mx-auto font-medium">
            {resendSuccessMessage}
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-xs font-semibold text-teal-brand hover:underline pt-2"
          >
            <span>Return to Sign In</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      ) : (
        (!isAlreadyUsed || !token) && (
          <form
            onSubmit={handleResend}
            className="space-y-4 text-xs sm:text-sm"
          >
            {resendMutation.isError && (
              <div className="p-3 rounded-md border border-coral/30 bg-coral-soft/50 text-coral text-xs flex items-center gap-1.5">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>
                  {resendMutation.error.message ||
                    "Unable to resend verification email"}
                </span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="font-semibold text-ink">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-ink/40">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  required
                  value={resendEmail}
                  onChange={(e) => setResendEmail(e.target.value)}
                  placeholder="name@carehome.com"
                  className="w-full rounded-md border border-ink/15 bg-cream/30 pl-10 pr-4 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-teal-brand/40 shadow-xs"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={resendMutation.isPending}
                className="w-full py-3.5 rounded-full bg-teal-brand text-white font-medium text-sm sm:text-base hover:bg-teal-deep shadow-[0_10px_25px_-8px_rgba(15,118,110,0.5)] transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <span>
                  {resendMutation.isPending
                    ? "Sending..."
                    : "Send Verification Link"}
                </span>
                <Send className="h-4 w-4" />
              </button>
            </div>
          </form>
        )
      )}

      <div className="pt-2 text-center">
        <Link
          href="/login"
          className="text-xs text-ink/60 hover:text-ink font-medium"
        >
          Back to sign in
        </Link>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <AuthCard
      title="Email Verification"
      subtitle="Confirm your identity to access CarerLoop"
      badge="Verification Portal"
    >
      <Suspense
        fallback={
          <div className="p-8 text-center text-xs text-ink/50">
            Loading verification parameters...
          </div>
        }
      >
        <VerifyEmailContent />
      </Suspense>
    </AuthCard>
  );
}
