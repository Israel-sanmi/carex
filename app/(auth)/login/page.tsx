"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AuthCard from "@/components/auth/auth-card";
import { useLoginMutation } from "@/lib/hooks/use-auth-mutations";
import {
  Mail,
  Lock,
  ArrowRight,
  AlertCircle,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [validationError, setValidationError] = useState("");

  const loginMutation = useLoginMutation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError("");
    if (!email || !password) return;

    if (password.length < 12) {
      setValidationError("Password must be at least 12 characters long.");
      return;
    }

    loginMutation.mutate(
      { email, password },
      {
        onSuccess: () => {
          router.push("/dashboard");
        },
      },
    );
  };

  return (
    <AuthCard
      title="Welcome back"
      subtitle="Sign in to your CarerLoop workspace to manage facilities, people and records."
      badge="Multi-Tenant Care Platform"
      footer={
        <div className="space-y-2">
          <p>
            Don&apos;t have an account?{" "}
            <a
              href="/register"
              className="font-semibold text-teal-brand hover:text-teal-deep underline decoration-teal-brand/40 underline-offset-4"
            >
              Register
            </a>
          </p>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
        {/* Client validation error */}
        {validationError && (
          <div className="p-3.5 rounded-md border border-coral/30 bg-coral-soft/50 text-ink space-y-1 animate-fade-in">
            <p className="font-semibold text-coral flex items-center gap-1.5 text-xs">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {validationError}
            </p>
          </div>
        )}

        {/* Error alert from real API */}
        {loginMutation.isError && (
          <div className="p-3.5 rounded-md border border-coral/30 bg-coral-soft/50 text-ink space-y-1 animate-fade-in">
            <p className="font-semibold text-coral flex items-center gap-1.5 text-xs">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {loginMutation.error.message || "Invalid email or password"}
            </p>
            {loginMutation.error.status === 401 && (
              <p className="text-xs text-ink/70">
                Please double check your credentials or verify your account
                email.
              </p>
            )}
          </div>
        )}

        {/* Email field */}
        <div className="space-y-1.5">
          <label className="font-semibold text-ink flex items-center justify-between">
            <span>Email Address</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-ink/40">
              <Mail className="h-4 w-4" />
            </div>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@carehome.com"
              autoComplete="email"
              className="w-full rounded-md border border-ink/15 bg-cream/30 pl-10 pr-4 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-teal-brand/40 shadow-xs"
            />
          </div>
        </div>

        {/* Password field */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="font-semibold text-ink">Password</label>
            <a
              href="/forgot-password"
              className="text-xs text-teal-brand hover:underline font-medium"
            >
              Forgot password?
            </a>
          </div>
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
              placeholder="Enter your password"
              autoComplete="current-password"
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
        </div>

        {/* Submit button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={loginMutation.isPending}
            className="group w-full py-3.5 rounded-full bg-teal-brand text-white font-semibold text-sm sm:text-base hover:bg-teal-deep shadow-[0_10px_25px_-8px_rgba(15,118,110,0.5)] hover:shadow-[0_14px_30px_-8px_rgba(15,118,110,0.6)] transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-wait"
          >
            {loginMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Signing in…</span>
              </>
            ) : (
              <>
                <span>Sign in</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </button>
        </div>
      </form>
    </AuthCard>
  );
}
