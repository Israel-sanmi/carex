"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import AuthCard from "@/components/auth/auth-card";
import { 
  Building2, 
  Home, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  Lock, 
  User, 
  Phone 
} from "lucide-react";

function AcceptInvitationContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "inv_demo_982";
  const emailParam = searchParams.get("email") || "s.jenkins@meadowview.co.uk";
  const roleParam = searchParams.get("role") || "CARE_HOME_MANAGER";
  const orgParam = searchParams.get("org") || "St. Jude Care Services Group";
  const facilityParam = searchParams.get("facility") || "Meadow View Lodge";

  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [activated, setActivated] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate backend /api/v1/invitations/accept
    setTimeout(() => {
      setLoading(false);
      setActivated(true);
    }, 800);
  };

  return (
    <div>
      {activated ? (
        <div className="py-4 text-center space-y-4 animate-fade-in">
          <div className="grid h-16 w-16 place-items-center rounded-full bg-mint text-teal-brand mx-auto shadow-sm">
            <CheckCircle2 className="h-9 w-9" />
          </div>

          <div>
            <h2 className="text-xl font-bold text-ink">Account Activated!</h2>
            <p className="text-xs text-ink/70 mt-1 max-w-xs mx-auto leading-relaxed">
              Your staff account has been provisioned with the <span className="font-semibold text-teal-brand">{roleParam}</span> role for <span className="font-semibold text-ink">{facilityParam}</span>.
            </p>
          </div>

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
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
          
          {/* Context Boundary Card (Section 4.7) */}
          <div className="p-4 rounded-2xl border border-teal-brand/20 bg-mint/40 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-teal-deep flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-teal-brand" />
                Invitation Context
              </span>
              <span className="font-mono text-[10px] text-teal-brand bg-white px-2 py-0.5 rounded-full border border-teal-brand/20 font-bold">
                {roleParam}
              </span>
            </div>

            <div className="text-xs space-y-1 pt-1">
              <p className="flex items-center gap-1.5 text-ink/80">
                <Building2 className="h-3.5 w-3.5 text-teal-brand shrink-0" />
                <span>{orgParam}</span>
              </p>
              <p className="flex items-center gap-1.5 text-ink/80">
                <Home className="h-3.5 w-3.5 text-teal-brand shrink-0" />
                <span>Facility: {facilityParam}</span>
              </p>
            </div>
          </div>

          {/* Invitee Email (Readonly) */}
          <div className="space-y-1.5">
            <label className="font-semibold text-ink">Invited Email Address</label>
            <input
              type="email"
              disabled
              value={emailParam}
              className="w-full rounded-xl border border-ink/10 bg-cream/70 px-3.5 py-2.5 text-sm text-ink/70 font-mono shadow-inner cursor-not-allowed"
            />
          </div>

          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="font-semibold text-ink">Full Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-ink/40">
                <User className="h-4 w-4" />
              </div>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Sarah Jenkins"
                className="w-full rounded-xl border border-ink/15 bg-cream/30 pl-10 pr-4 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-teal-brand/40 shadow-xs"
              />
            </div>
          </div>

          {/* Phone */}
          <div className="space-y-1.5">
            <label className="font-semibold text-ink">Contact Phone Number</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-ink/40">
                <Phone className="h-4 w-4" />
              </div>
              <input
                type="tel"
                required
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+44 7700 900412"
                className="w-full rounded-xl border border-ink/15 bg-cream/30 pl-10 pr-4 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-teal-brand/40 shadow-xs"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="font-semibold text-ink">Create Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-ink/40">
                <Lock className="h-4 w-4" />
              </div>
              <input
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 8 characters"
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
              <span>{loading ? "Activating..." : "Accept & Activate Account"}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default function AcceptInvitationPage() {
  return (
    <AuthCard
      title="Staff Onboarding"
      subtitle="Complete your profile to join your care organisation on CarerLoop."
      badge="Invitation Onboarding"
    >
      <Suspense fallback={<div className="p-8 text-center text-xs text-ink/50">Validating invitation credentials...</div>}>
        <AcceptInvitationContent />
      </Suspense>
    </AuthCard>
  );
}

