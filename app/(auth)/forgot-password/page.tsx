"use client";

import { useState } from "react";
import AuthCard from "@/components/auth/auth-card";
import { Mail, ArrowRight, CheckCircle2, ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate backend /api/v1/auth/forgot-password
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 700);
  };

  return (
    <AuthCard
      title="Reset Password"
      subtitle="Enter the email associated with your CarerLoop account."
      badge="Account Recovery"
      footer={
        <a
          href="/login"
          className="inline-flex items-center gap-1.5 font-semibold text-teal-brand hover:text-teal-deep"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to sign in</span>
        </a>
      }
    >
      {submitted ? (
        <div className="py-4 text-center space-y-4 animate-fade-in">
          <div className="grid h-14 w-14 place-items-center rounded-full bg-mint text-teal-brand mx-auto shadow-xs">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-ink">Reset Link Sent</h2>
            <p className="text-xs text-ink/70 mt-1 max-w-xs mx-auto leading-relaxed">
              If an account exists for <span className="font-semibold text-ink">{email}</span>, we have dispatched instructions to reset your password.
            </p>
          </div>
          <div className="pt-2">
            <a
              href="/reset-password?token=sample_demo_token"
              className="inline-flex items-center gap-2 rounded-full bg-teal-brand px-6 py-2.5 text-xs font-semibold text-white hover:bg-teal-deep transition-all shadow-sm"
            >
              <span>Simulate Resetting Password →</span>
            </a>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
          <div className="space-y-1.5">
            <label className="font-semibold text-ink">Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-ink/40">
                <Mail className="h-4 w-4" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@carehome.co.uk"
                className="w-full rounded-md border border-ink/15 bg-cream/30 pl-10 pr-4 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-teal-brand/40 shadow-xs"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-full bg-teal-brand text-white font-medium text-sm sm:text-base hover:bg-teal-deep shadow-[0_10px_25px_-8px_rgba(15,118,110,0.5)] transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>{loading ? "Sending..." : "Send Reset Link"}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </form>
      )}
    </AuthCard>
  );
}

