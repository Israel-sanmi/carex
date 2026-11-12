"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import AuthCard from "@/components/auth/auth-card";
import {
  Building2,
  Home,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Lock,
  User,
  Phone,
  Eye,
  EyeOff,
  UserPlus,
  LogIn,
  AlertTriangle,
  Clock,
} from "lucide-react";

function AcceptInvitationContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "tok_inv_resident_901";
  const emailParam =
    searchParams.get("email") || "arthur.pendelton@example.co.uk";
  const roleParam = searchParams.get("role") || "RESIDENT";
  const orgParam = searchParams.get("org") || "Apex Care Group";
  const facilityParam =
    searchParams.get("facility") || "St. Jude's Residential Home";

  // Section 2: Two possibilities (New vs Existing Resident)
  const [residentType, setResidentType] = useState<"new" | "existing">("new");

  // New Resident Fields (Section 2A)
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Existing Resident Fields (Section 2B - Transfer)
  const [existingPassword, setExistingPassword] = useState("");
  const [currentCareOrg, setCurrentCareOrg] = useState(
    "Beacon Light Care Trust",
  );
  const [currentCareHome, setCurrentCareHome] = useState("Oakview House");

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate backend /api/v1/invitations/accept-resident
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 800);
  };

  return (
    <div>
      {submitted ? (
        <div className="py-4 text-center space-y-5 animate-fade-in text-ink dark:text-slate-100">
          <div className="grid h-16 w-16 place-items-center rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 mx-auto shadow-sm">
            <CheckCircle2 className="h-9 w-9" />
          </div>

          <div>
            <h2 className="text-2xl font-bold tracking-tight text-ink dark:text-white font-heading">
              {residentType === "new"
                ? "Admission Request Submitted!"
                : "Transfer Request Submitted!"}
            </h2>
            <p className="text-xs sm:text-sm text-ink/70 dark:text-slate-300 mt-1.5 max-w-sm mx-auto leading-relaxed">
              {residentType === "new" ? (
                <>
                  Your account and resident profile have been created with email
                  verified through this invitation. Your admission request has
                  been sent to{" "}
                  <span className="font-semibold text-ink dark:text-white">
                    {orgParam}
                  </span>{" "}
                  ({facilityParam}).
                </>
              ) : (
                <>
                  CarerLoop has recognized your existing profile. A formal care
                  transfer request to{" "}
                  <span className="font-semibold text-ink dark:text-white">
                    {facilityParam}
                  </span>{" "}
                  has been dispatched.
                </>
              )}
            </p>
          </div>

          {/* Section 2B Crucial Rule Box */}
          {residentType === "existing" ? (
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-500/20 text-xs text-left text-amber-900 dark:text-amber-300 space-y-1">
              <p className="font-bold flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                Continuity of Care Rule:
              </p>
              <p className="text-[11px] leading-relaxed">
                You will officially remain with your existing care organisation
                (<span className="font-semibold">{currentCareOrg}</span>) until
                the destination administrator reviews and approves the transfer.
              </p>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-500/20 text-xs text-left text-purple-900 dark:text-purple-300 space-y-1">
              <p className="font-bold flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                Next Step: Administrator Evaluation
              </p>
              <p className="text-[11px] leading-relaxed">
                The care home manager will review your admission dossier and
                assign your designated room and bed.
              </p>
            </div>
          )}

          <div className="pt-2 flex flex-col sm:flex-row justify-center gap-3">
            <Link
              href={`/admission-status?type=${residentType === "new" ? "New Admission" : "Transfer"}&home=${encodeURIComponent(facilityParam)}&org=${encodeURIComponent(orgParam)}&status=${residentType === "new" ? "PENDING_ADMISSION" : "TRANSFER_PENDING"}&email=${encodeURIComponent(emailParam)}`}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 px-6 py-3 text-xs sm:text-sm font-semibold text-white transition-all shadow-md"
            >
              <span>Track Admission Status →</span>
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 rounded-md border border-ink/15 dark:border-white/15 px-6 py-3 text-xs sm:text-sm font-semibold text-ink dark:text-white hover:bg-cream dark:hover:bg-slate-800 transition-all"
            >
              <span>Sign In</span>
            </Link>
          </div>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="space-y-5 text-xs sm:text-sm text-ink dark:text-slate-100"
        >
          {/* Destination Invitation Context Banner (Section 2) */}
          <div className="p-4 rounded-2xl border border-teal-brand/20 dark:border-emerald-500/30 bg-mint/40 dark:bg-slate-800/60 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-teal-deep dark:text-emerald-400 flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4" />
                Invitation Destination
              </span>
              <span className="font-mono text-[10px] text-teal-brand dark:text-emerald-300 bg-white dark:bg-slate-900 px-2.5 py-0.5 rounded-full border border-teal-brand/20 dark:border-white/10 font-bold">
                {roleParam === "RESIDENT" ? "Resident Intake" : roleParam}
              </span>
            </div>

            <div className="text-xs space-y-1 pt-1">
              <p className="flex items-center gap-1.5 text-ink/80 dark:text-slate-300">
                <Building2 className="h-3.5 w-3.5 text-teal-brand dark:text-emerald-400 shrink-0" />
                <span>
                  Organisation:{" "}
                  <span className="font-semibold text-ink dark:text-white">
                    {orgParam}
                  </span>
                </span>
              </p>
              <p className="flex items-center gap-1.5 text-ink/80 dark:text-slate-300">
                <Home className="h-3.5 w-3.5 text-teal-brand dark:text-emerald-400 shrink-0" />
                <span>
                  Care Facility:{" "}
                  <span className="font-semibold text-ink dark:text-white">
                    {facilityParam}
                  </span>
                </span>
              </p>
            </div>
          </div>

          {/* Section 2 Decision Toggle: New Resident vs. Existing Account (Transfer) */}
          <div className="space-y-1.5">
            <label className="font-semibold text-ink dark:text-slate-200 block text-xs">
              Select Your CarerLoop Account Status:
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setResidentType("new")}
                className={`p-3 rounded-md border text-left transition-all cursor-pointer ${
                  residentType === "new"
                    ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 ring-2 ring-emerald-500/20"
                    : "border-ink/10 dark:border-white/10 hover:bg-cream dark:hover:bg-slate-800 text-ink/70 dark:text-slate-400"
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-xs">
                  <UserPlus className="w-4 h-4" />
                  <span>I am New (Option 2A)</span>
                </div>
                <p className="text-[10px] mt-1 opacity-80">
                  Create fresh account & resident profile.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setResidentType("existing")}
                className={`p-3 rounded-md border text-left transition-all cursor-pointer ${
                  residentType === "existing"
                    ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 ring-2 ring-emerald-500/20"
                    : "border-ink/10 dark:border-white/10 hover:bg-cream dark:hover:bg-slate-800 text-ink/70 dark:text-slate-400"
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-xs">
                  <LogIn className="w-4 h-4" />
                  <span>Existing / Transfer (2B)</span>
                </div>
                <p className="text-[10px] mt-1 opacity-80">
                  Moving from another care home.
                </p>
              </button>
            </div>
          </div>

          {/* Invitee Email (Readonly) */}
          <div className="space-y-1.5">
            <label className="font-semibold text-ink dark:text-slate-200">
              Invited Email Address (Locked)
            </label>
            <input
              type="email"
              disabled
              value={emailParam}
              className="w-full rounded-md border border-ink/10 dark:border-white/10 bg-cream/70 dark:bg-slate-800 px-3.5 py-2.5 text-sm text-ink/70 dark:text-slate-300 font-mono shadow-inner cursor-not-allowed"
            />
          </div>

          {/* PATH A: NEW TO CARERLOOP (Section 2A) */}
          {residentType === "new" && (
            <div className="space-y-3.5 animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-semibold text-ink dark:text-slate-200">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="e.g. Arthur"
                    className="w-full rounded-md border border-ink/15 dark:border-white/15 bg-cream/30 dark:bg-slate-800/60 px-3.5 py-2.5 text-sm text-ink dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-ink dark:text-slate-200">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="e.g. Pendelton"
                    className="w-full rounded-md border border-ink/15 dark:border-white/15 bg-cream/30 dark:bg-slate-800/60 px-3.5 py-2.5 text-sm text-ink dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-ink dark:text-slate-200">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-ink/40 dark:text-slate-500">
                    <Phone className="h-4 w-4" />
                  </div>
                  <input
                    type="tel"
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+44 7911 234567"
                    className="w-full rounded-md border border-ink/15 dark:border-white/15 bg-cream/30 dark:bg-slate-800/60 pl-10 pr-4 py-2.5 text-sm text-ink dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-ink dark:text-slate-200">
                  Choose Account Password{" "}
                  <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-ink/40 dark:text-slate-500">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 8 characters"
                    className="w-full rounded-md border border-ink/15 dark:border-white/15 bg-cream/30 dark:bg-slate-800/60 pl-10 pr-10 py-2.5 text-sm text-ink dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-ink/40 dark:text-slate-500 hover:text-ink dark:hover:text-white cursor-pointer"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* PATH B: EXISTING RESIDENT ACCOUNT (TRANSFER - Section 2B) */}
          {residentType === "existing" && (
            <div className="space-y-3.5 animate-fade-in">
              <div className="p-3.5 rounded-2xl bg-cream/40 dark:bg-slate-800/50 border border-ink/5 dark:border-white/5 space-y-2 text-xs">
                <span className="font-bold text-ink dark:text-white block">
                  Current Care Home Registration:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <span className="text-[10px] text-ink/50 dark:text-slate-400 uppercase block">
                      Current Organisation
                    </span>
                    <input
                      type="text"
                      value={currentCareOrg}
                      onChange={(e) => setCurrentCareOrg(e.target.value)}
                      className="w-full mt-0.5 rounded-md border border-ink/10 dark:border-white/10 bg-white dark:bg-slate-900 px-2.5 py-1.5 text-xs text-ink dark:text-white"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-ink/50 dark:text-slate-400 uppercase block">
                      Current Care Home
                    </span>
                    <input
                      type="text"
                      value={currentCareHome}
                      onChange={(e) => setCurrentCareHome(e.target.value)}
                      className="w-full mt-0.5 rounded-md border border-ink/10 dark:border-white/10 bg-white dark:bg-slate-900 px-2.5 py-1.5 text-xs text-ink dark:text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-ink dark:text-slate-200">
                  Verify Your Existing Password{" "}
                  <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-ink/40 dark:text-slate-500">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={existingPassword}
                    onChange={(e) => setExistingPassword(e.target.value)}
                    placeholder="Enter existing password"
                    className="w-full rounded-md border border-ink/15 dark:border-white/15 bg-cream/30 dark:bg-slate-800/60 pl-10 pr-10 py-2.5 text-sm text-ink dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-ink/40 dark:text-slate-500 hover:text-ink dark:hover:text-white cursor-pointer"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                <span className="text-[11px] text-ink/60 dark:text-slate-400 block pt-0.5">
                  Your email must match the invitation email to authorize
                  transfer.
                </span>
              </div>
            </div>
          )}

          {/* Submit button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-md bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white font-semibold text-xs sm:text-sm transition-all shadow-md hover:shadow-lg disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>
                {loading
                  ? "Processing Onboarding..."
                  : residentType === "new"
                    ? "Accept Invitation & Submit Admission"
                    : "Accept Transfer to Destination Care Home"}
              </span>
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
      title="Accept Care Home Invitation"
      subtitle="Complete your onboarding into the care organisation"
      maxWidth="max-w-xl"
    >
      <Suspense
        fallback={
          <div className="p-8 text-center text-xs text-ink/50 dark:text-slate-400">
            Validating onboarding token...
          </div>
        }
      >
        <AcceptInvitationContent />
      </Suspense>
    </AuthCard>
  );
}
