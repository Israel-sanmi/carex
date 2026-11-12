"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AuthCard from "@/components/auth/auth-card";
import { useRole, RoleType, ROLE_PROFILES } from "@/lib/role-context";
import {
  Mail,
  Lock,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Building2,
  HelpCircle,
  Eye,
  EyeOff,
  UserCheck,
  ShieldCheck,
  Crown,
  HeartHandshake,
  User,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { currentRole, loginAs } = useRole();

  const [selectedRole, setSelectedRole] = useState<RoleType>(currentRole);
  const [email, setEmail] = useState(ROLE_PROFILES[currentRole].email);
  const [password, setPassword] = useState("••••••••••••");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorType, setErrorType] = useState<
    "none" | "invalid_credentials" | "unverified_email" | "suspended_account"
  >("none");
  const [loginSuccess, setLoginSuccess] = useState(false);

  const handleRoleSelect = (role: RoleType) => {
    setSelectedRole(role);
    setEmail(ROLE_PROFILES[role].email);
    setPassword("••••••••••••");
    setErrorType("none");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorType("none");

    setTimeout(() => {
      setLoading(false);

      if (email.includes("unverified")) {
        setErrorType("unverified_email");
      } else if (email.includes("suspended")) {
        setErrorType("suspended_account");
      } else if (password === "wrong") {
        setErrorType("invalid_credentials");
      } else {
        loginAs(selectedRole);
        setLoginSuccess(true);
        // setTimeout(() => {
        //   router.push("/dashboard");
        // }, 600);
      }
    }, 500);
  };

  const rolePills: { role: RoleType; label: string; icon: any }[] = [
    { role: "CARE_HOME_MANAGER", label: "Care Home Manager", icon: Building2 },
    { role: "ORGANISATION_ADMIN", label: "Org Admin", icon: ShieldCheck },
    { role: "CAREGIVER", label: "Caregiver", icon: HeartHandshake },
    { role: "SUPER_ADMIN", label: "Super Admin", icon: Crown },
    { role: "RESIDENT", label: "Resident / Family", icon: User },
  ];

  return (
    <AuthCard
      title="Sign in to CarerLoop"
      subtitle="Access your role-based care home workspace and resident information."
      badge="Multi-Tenant Care Platform"
      footer={
        <div className="space-y-2">
          <p>
            Don't have an account?{" "}
            <a
              href="/register"
              className="font-semibold text-teal-brand hover:text-teal-deep underline decoration-teal-brand/40 underline-offset-4"
            >
              Register
            </a>
          </p>
          {/* <p>
            Received an invitation?{" "}
            <a
              href="/accept-invitation"
              className="font-semibold text-ink/80 hover:text-ink underline underline-offset-4"
            >
              Accept staff invitation
            </a>
          </p> */}
        </div>
      }
    >
      {loginSuccess ? (
        <div className="py-6 text-center space-y-4 animate-fade-in">
          <div className="grid h-14 w-14 place-items-center rounded-full bg-mint text-teal-brand mx-auto shadow-xs">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-ink">
              Authentication Successful
            </h2>
            <p className="text-xs text-ink/70 mt-1 max-w-xs mx-auto">
              Resolved tenant context for{" "}
              <span className="font-semibold text-ink">
                {ROLE_PROFILES[selectedRole].name}
              </span>{" "}
              ({ROLE_PROFILES[selectedRole].roleTitle}). Redirecting to your
              dashboard...
            </p>
          </div>
          <div className="pt-2">
            <a
              // href="/dashboard"
              className="inline-flex items-center gap-2 rounded-full bg-teal-brand px-6 py-2.5 text-xs font-semibold text-white hover:bg-teal-deep transition-all shadow-sm"
            >
              <span>Go to Dashboard</span>
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
          {/* Quick Role Persona Switcher per Document Section 3 */}
          {/* <div className="space-y-2 pb-2">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-ink text-xs">
                Select Your Role Persona:
              </label>
              <span className="text-[11px] text-teal-brand font-medium">
                {ROLE_PROFILES[selectedRole].roleTier}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              {rolePills.map(({ role, label, icon: Icon }) => (
                <button
                  type="button"
                  key={role}
                  onClick={() => handleRoleSelect(role)}
                  className={`flex items-center gap-1.5 p-2 rounded-xl text-left border text-xs transition-all cursor-pointer ${
                    selectedRole === role
                      ? "border-teal-brand bg-teal-brand/10 text-teal-deep font-bold ring-1 ring-teal-brand/30"
                      : "border-ink/10 bg-cream/40 text-ink/70 hover:bg-cream hover:text-ink"
                  }`}
                >
                  <Icon className={`h-3.5 w-3.5 shrink-0 ${selectedRole === role ? "text-teal-brand" : "text-ink/50"}`} />
                  <span className="truncate">{label}</span>
                </button>
              ))}
            </div>
          </div> */}

          {/* Active Profile Context Banner */}
          {/* <div className="p-3 rounded-xl border border-ink/10 bg-cream/50 text-xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-ink">{ROLE_PROFILES[selectedRole].name}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-mint text-teal-deep font-semibold">
                {selectedRole}
              </span>
            </div>
            <p className="text-[11px] text-ink/65">
              Organisation: {ROLE_PROFILES[selectedRole].organisationName}
            </p>
            <p className="text-[11px] text-teal-brand font-medium">
              Context: {ROLE_PROFILES[selectedRole].careHomeName}
            </p>
          </div> */}

          {/* Error alerts per Section 5 specification */}
          {errorType === "invalid_credentials" && (
            <div className="p-3.5 rounded-xl border border-coral/30 bg-coral-soft/50 text-ink space-y-1 animate-fade-in">
              <p className="font-semibold text-coral flex items-center gap-1.5 text-xs">
                <AlertCircle className="h-4 w-4 shrink-0" />
                Invalid email or password
              </p>
              <p className="text-xs text-ink/70">
                Please double check your credentials and try again.
              </p>
            </div>
          )}

          {errorType === "unverified_email" && (
            <div className="p-3.5 rounded-xl border border-sun/40 bg-sun-soft/60 text-ink space-y-1.5 animate-fade-in">
              <p className="font-semibold text-[#8b6100] flex items-center gap-1.5 text-xs">
                <AlertCircle className="h-4 w-4 shrink-0" />
                Email verification required
              </p>
              <p className="text-xs text-ink/75">
                Your email address has not been verified yet. Check your inbox
                or request a new verification link.
              </p>
              <a
                href="/verify-email"
                className="inline-block text-xs font-semibold text-teal-brand underline decoration-teal-brand/40 underline-offset-2 pt-0.5"
              >
                Go to verification screen →
              </a>
            </div>
          )}

          {errorType === "suspended_account" && (
            <div className="p-3.5 rounded-xl border border-destructive/30 bg-destructive/10 text-destructive space-y-1 animate-fade-in">
              <p className="font-semibold flex items-center gap-1.5 text-xs">
                <AlertCircle className="h-4 w-4 shrink-0" />
                Account inactive or suspended
              </p>
              <p className="text-xs text-ink/75">
                This account has been deactivated by your organisation
                administrator.
              </p>
            </div>
          )}

          {/* Email field */}
          <div className="space-y-1.5">
            <label className="font-semibold text-ink flex items-center justify-between">
              <span>Account Email</span>
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
                placeholder="name@carehome.co.uk"
                className="w-full rounded-xl border border-ink/15 bg-cream/30 pl-10 pr-4 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-teal-brand/40 shadow-xs"
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full rounded-xl border border-ink/15 bg-cream/30 pl-10 pr-10 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-teal-brand/40 shadow-xs"
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
              disabled={loading}
              className="w-full py-3.5 rounded-full bg-teal-brand text-white font-medium text-sm sm:text-base hover:bg-teal-deep shadow-[0_10px_25px_-8px_rgba(15,118,110,0.5)] transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {/* <span>{loading ? "Authenticating..." : `Sign in as ${ROLE_PROFILES[selectedRole].roleTitle.split(" ")[0]}`}</span> */}
              <span>{loading ? "Authenticating..." : `Sign in `}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </form>
      )}
    </AuthCard>
  );
}
