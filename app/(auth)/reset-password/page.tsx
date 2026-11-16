"use client";

import { Suspense, useState } from "react";
import { useSearchParams, useParams } from "next/navigation";
import Link from "next/link";
import AuthCard from "@/components/auth/auth-card";
import { useResetPasswordMutation } from "@/lib/hooks/use-auth-mutations";
import { toast } from "@/components/ui/toast";
import {
  Lock,
  CheckCircle2,
  ArrowRight,
  Eye,
  EyeOff,
  AlertCircle,
  ShieldCheck,
  KeyRound,
  RefreshCw,
} from "lucide-react";

export function ResetPasswordContent({ tokenProp }: { tokenProp?: string }) {
  const searchParams = useSearchParams();
  const urlParams = useParams();

  // Extract token from query params (?token=...) or route params (/[token])
  const queryToken = searchParams.get("token") || searchParams.get("t") || "";
  const routeToken =
    typeof urlParams?.token === "string" ? urlParams.token : "";
  const initialUrlToken = (tokenProp || routeToken || queryToken).trim();

  const [manualToken, setManualToken] = useState("");
  const token = initialUrlToken || manualToken.trim();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [validationError, setValidationError] = useState("");

  const resetPasswordMutation = useResetPasswordMutation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError("");

    if (!token) {
      setValidationError(
        "Missing reset token. Please use the link provided in your email or paste your token.",
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

    resetPasswordMutation.mutate(
      {
        token,
        newPassword: password,
        confirmPassword,
      },
      {
        onSuccess: (res) => {
          setSubmitted(true);
          toast.success(
            res?.message ||
              "Password updated successfully! You can now sign in.",
          );
        },
        onError: (err) => {
          toast.error(err.message || "Failed to reset password.");
        },
      },
    );
  };

  if (submitted) {
    return (
      <div className="py-6 text-center space-y-4 animate-fade-in">
        <div className="grid h-14 w-14 place-items-center rounded-full bg-mint text-teal-brand mx-auto shadow-xs">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-ink">
            Password Updated Successfully
          </h2>
          <p className="text-xs text-ink/70 mt-1 max-w-xs mx-auto leading-relaxed">
            Your password has been changed. You can now sign in with your new
            credentials.
          </p>
        </div>
        <div className="pt-2">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 rounded-full bg-teal-brand px-6 py-2.5 text-xs font-semibold text-white hover:bg-teal-deep transition-all shadow-sm"
          >
            <span>Proceed to Sign In</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
    
      {/* Validation or API error display */}
      {(validationError || resetPasswordMutation.isError) && (
        <div className="p-3.5 rounded-md border border-coral/30 bg-coral-soft/50 text-ink space-y-1 animate-fade-in">
          <p className="font-semibold text-coral flex items-center gap-1.5 text-xs">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {validationError ||
              resetPasswordMutation.error?.message ||
              "Password update failed"}
          </p>
        </div>
      )}

      {/* New Password */}
      <div className="space-y-1.5">
        <label className="font-semibold text-ink">New Password *</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-ink/40">
            <Lock className="h-4 w-4" />
          </div>
          <input
            type={showPassword ? "text" : "password"}
            required
            minLength={12}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter new password (min 12 chars)"
            className="w-full rounded-md border border-ink/15 bg-cream/30 pl-10 pr-10 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-teal-brand/40 shadow-xs"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-ink/40 hover:text-ink cursor-pointer"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
        <p className="text-[11px] text-ink/50">
          Must be at least 12 characters long.
        </p>
      </div>

      {/* Confirm New Password */}
      <div className="space-y-1.5">
        <label className="font-semibold text-ink">Confirm New Password *</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-ink/40">
            <Lock className="h-4 w-4" />
          </div>
          <input
            type={showConfirmPassword ? "text" : "password"}
            required
            minLength={12}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Re-enter new password"
            className="w-full rounded-md border border-ink/15 bg-cream/30 pl-10 pr-10 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-teal-brand/40 shadow-xs"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-ink/40 hover:text-ink cursor-pointer"
            aria-label={showConfirmPassword ? "Hide password" : "Show password"}
          >
            {showConfirmPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={resetPasswordMutation.isPending}
          className="w-full py-3.5 rounded-full bg-teal-brand text-white font-medium text-sm sm:text-base hover:bg-teal-deep shadow-[0_10px_25px_-8px_rgba(15,118,110,0.5)] transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {resetPasswordMutation.isPending ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin" />
              <span>Updating Password...</span>
            </>
          ) : (
            <>
              <span>Update Password</span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <AuthCard
      title="Create New Password"
      subtitle="Ensure your new password is at least 12 characters long."
      badge="Security Protocol"
      footer={
        <div className="text-center text-xs text-ink/70">
          Remember your password?{" "}
          <Link
            href="/login"
            className="font-semibold text-teal-brand hover:underline"
          >
            Sign In
          </Link>
        </div>
      }
    >
      <Suspense
        fallback={
          <div className="p-8 text-center text-xs text-ink/50">
            Loading reset parameters...
          </div>
        }
      >
        <ResetPasswordContent />
      </Suspense>
    </AuthCard>
  );
}
