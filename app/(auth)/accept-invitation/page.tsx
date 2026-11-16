"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import AuthCard from "@/components/auth/auth-card";
import { useAcceptInvitationMutation } from "@/lib/hooks/use-invitations";
import { AcceptInvitationResponse } from "@/lib/api-invitations";
import {
  CheckCircle2,
  Lock,
  User,
  Eye,
  EyeOff,
  AlertTriangle,
  RefreshCw,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

function AcceptInvitationContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [validationError, setValidationError] = useState("");
  const [result, setResult] = useState<AcceptInvitationResponse | null>(null);

  const acceptMutation = useAcceptInvitationMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError("");

    if (!token) {
      setValidationError("Invitation token is missing from the URL link.");
      return;
    }

    if (!firstName.trim() || !lastName.trim()) {
      setValidationError(
        "Please enter your full legal name (first and last name).",
      );
      return;
    }

    if (password.length < 12) {
      setValidationError("Password must be at least 12 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setValidationError("Passwords do not match. Please re-enter.");
      return;
    }

    try {
      const data = await acceptMutation.mutateAsync({
        token,
        password,
        firstName: firstName.trim(),
        middleName: middleName.trim() || undefined,
        lastName: lastName.trim(),
      });
      setResult(data);
    } catch {
      // handled by mutation toast
    }
  };

  // If no token is provided in the URL
  if (!token) {
    return (
      <AuthCard
        title="Invalid Invitation Link"
        subtitle="This link is missing a valid verification token."
        badge="Invitation Error"
        footer={
          <div className="text-center text-xs text-ink/70">
            Have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-teal-brand hover:underline"
            >
              Sign In
            </Link>
          </div>
        }
      >
        <div className="py-6 text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center mx-auto">
            <AlertTriangle className="h-7 w-7" />
          </div>
          <div className="space-y-2">
            <h3 className="text-base font-bold text-ink">
              Missing Invitation Token
            </h3>
            <p className="text-xs text-ink/70 max-w-sm mx-auto leading-relaxed">
              We could not find a verification token in the URL. Please verify
              you clicked the complete link provided in your CarerLoop
              invitation email.
            </p>
          </div>
          <div className="pt-2">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-teal-brand text-white text-xs font-semibold hover:bg-teal-deep transition-all shadow-sm"
            >
              <span>Return to Sign In</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </AuthCard>
    );
  }

  // If successfully accepted
  if (result) {
    return (
      <AuthCard
        title="Welcome to CarerLoop!"
        subtitle="Your invitation has been accepted and your account is active."
        badge="Account Activated"
        footer={
          <div className="text-center text-xs text-ink/70">
            Need help? Contact your care home administrator or support.
          </div>
        }
      >
        <div className="py-6 text-center space-y-5 animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-xs">
            <CheckCircle2 className="h-9 w-9" />
          </div>

          <div className="space-y-1.5">
            <h2 className="text-xl font-bold text-ink font-heading">
              Account Registration Complete
            </h2>
            <p className="text-xs text-ink/70 max-w-sm mx-auto leading-relaxed">
              {result.message ||
                "Your identity has been verified and registered on CarerLoop."}
            </p>
          </div>

          <div className="p-4 rounded-md bg-cream/40 border border-ink/10 text-xs space-y-2 text-left max-w-sm mx-auto">
            {result.email && (
              <div className="flex justify-between">
                <span className="text-ink/60">Email:</span>
                <span className="font-semibold text-ink">{result.email}</span>
              </div>
            )}
            {result.role && (
              <div className="flex justify-between">
                <span className="text-ink/60">Assigned Role:</span>
                <span className="font-semibold text-teal-deep bg-mint px-2 py-0.5 rounded-md">
                  {result.role}
                </span>
              </div>
            )}
          </div>

          <div className="pt-2">
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 w-full px-5 py-3 rounded-md bg-teal-brand text-white text-xs sm:text-sm font-semibold hover:bg-teal-deep transition-all shadow-sm"
            >
              <span>Proceed to Sign In</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </AuthCard>
    );
  }

  // Acceptance Form
  return (
    <AuthCard
      title="Accept Invitation"
      subtitle="Complete your profile and choose a password to activate your account."
      badge="Join CarerLoop"
      footer={
        <div className="text-center text-xs text-ink/70">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-teal-brand hover:underline"
          >
            Sign In
          </Link>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
        {validationError && (
          <div className="p-3 rounded-md bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5 text-red-600" />
            <span>{validationError}</span>
          </div>
        )}

        {/* Legal Name */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="font-semibold text-ink block">First Name *</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink/40" />
              <input
                type="text"
                required
                placeholder="Eleanor"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-md border border-ink/15 bg-cream/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-brand/30"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-ink block">Middle Name</label>
            <input
              type="text"
              placeholder="Optional"
              value={middleName}
              onChange={(e) => setMiddleName(e.target.value)}
              className="w-full px-3 py-2 rounded-md border border-ink/15 bg-cream/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-brand/30"
            />
          </div>

          <div className="sm:col-span-2 space-y-1">
            <label className="font-semibold text-ink block">Last Name *</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink/40" />
              <input
                type="text"
                required
                placeholder="Vance"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-md border border-ink/15 bg-cream/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-brand/30"
              />
            </div>
          </div>
        </div>

        {/* Password */}
        <div className="space-y-1">
          <label className="font-semibold text-ink block">
            Choose Password * (min 12 characters)
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink/40" />
            <input
              type={showPassword ? "text" : "password"}
              required
              minLength={12}
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-9 pr-10 py-2 rounded-md border border-ink/15 bg-cream/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-brand/30 text-ink"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/40 hover:text-ink cursor-pointer"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div className="space-y-1">
          <label className="font-semibold text-ink block">
            Confirm Password *
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink/40" />
            <input
              type={showPassword ? "text" : "password"}
              required
              minLength={12}
              placeholder="••••••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-md border border-ink/15 bg-cream/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-brand/30 text-ink"
            />
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={acceptMutation.isPending}
            className="w-full py-2.5 px-4 rounded-md bg-teal-brand text-white font-semibold text-xs sm:text-sm hover:bg-teal-deep transition-all shadow-sm cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {acceptMutation.isPending ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>Activating Account...</span>
              </>
            ) : (
              <>
                <span>Complete Account Setup</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </AuthCard>
  );
}

export default function AcceptInvitationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[50vh] flex items-center justify-center text-xs text-ink/60">
          <RefreshCw className="h-5 w-5 animate-spin mr-2 text-teal-brand" />
          Loading invitation...
        </div>
      }
    >
      <AcceptInvitationContent />
    </Suspense>
  );
}
