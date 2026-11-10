"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import AuthCard from "@/components/auth/auth-card";
import { Lock, CheckCircle2, ArrowRight, Eye, EyeOff } from "lucide-react";

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);

    // Simulate backend /api/v1/auth/reset-password
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 700);
  };

  return (
    <div>
      {submitted ? (
        <div className="py-4 text-center space-y-4 animate-fade-in">
          <div className="grid h-14 w-14 place-items-center rounded-full bg-mint text-teal-brand mx-auto shadow-xs">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-ink">Password Updated</h2>
            <p className="text-xs text-ink/70 mt-1 max-w-xs mx-auto leading-relaxed">
              Your password has been changed successfully. You can now sign in with your new credentials.
            </p>
          </div>
          <div className="pt-2">
            <a
              href="/login"
              className="inline-flex items-center gap-2 rounded-full bg-teal-brand px-6 py-2.5 text-xs font-semibold text-white hover:bg-teal-deep transition-all shadow-sm"
            >
              <span>Go to Sign In</span>
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
          {error && (
            <div className="p-3 rounded-xl border border-destructive/30 bg-destructive/10 text-destructive text-xs">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="font-semibold text-ink">New Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-ink/40">
                <Lock className="h-4 w-4" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 8 characters"
                className="w-full rounded-xl border border-ink/15 bg-cream/30 pl-10 pr-10 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-teal-brand/40 shadow-xs"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-ink/40 hover:text-ink cursor-pointer"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-ink">Confirm New Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-ink/40">
                <Lock className="h-4 w-4" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                required
                minLength={8}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your new password"
                className="w-full rounded-xl border border-ink/15 bg-cream/30 pl-10 pr-4 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-teal-brand/40 shadow-xs"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-full bg-teal-brand text-white font-medium text-sm sm:text-base hover:bg-teal-deep shadow-[0_10px_25px_-8px_rgba(15,118,110,0.5)] transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>{loading ? "Updating..." : "Update Password"}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <AuthCard
      title="Create New Password"
      subtitle="Ensure your new password is at least 8 characters long."
      badge="Security Protocol"
    >
      <Suspense fallback={<div className="p-8 text-center text-xs text-ink/50">Loading security parameters...</div>}>
        <ResetPasswordContent />
      </Suspense>
    </AuthCard>
  );
}

