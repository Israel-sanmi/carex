"use client";

import { useState } from "react";
import { useRole } from "@/lib/role-context";
import {
  Settings,
  User,
  Building2,
  Bell,
  ShieldCheck,
  Lock,
  CheckCircle2,
  Save,
  KeyRound,
  Eye,
  EyeOff,
  ChevronRight,
} from "lucide-react";
import {
  Avatar,
  Badge,
  PageHeader,
  Panel,
  btn,
  field,
} from "@/components/dashboard/ui";

const sections = [
  { id: "profile", label: "Profile", icon: User },
  { id: "care-home", label: "Care home context", icon: Building2 },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security & password", icon: Lock },
];

const readOnlyInput = `${field.input} bg-ink/[0.025] font-medium cursor-not-allowed`;

export default function SettingsPage() {
  const { currentRole, user, activeCareHome, setActiveCareHome } = useRole();
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [roundReminders, setRoundReminders] = useState(true);

  // Password state
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [showPw, setShowPw] = useState(false);

  const handleSavePreferences = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const notificationOptions = [
    {
      title: "Urgent Medical & Allergy Alerts",
      description: "Immediate push alerts when vital signs cross critical thresholds",
      checked: smsAlerts,
      onChange: (v: boolean) => setSmsAlerts(v),
    },
    {
      title: "Admission & Intake Notifications",
      description: "Receive alerts when prospective residents submit registration forms",
      checked: emailAlerts,
      onChange: (v: boolean) => setEmailAlerts(v),
    },
    {
      title: "Care Round & Medication Reminders",
      description: "Shift reminders for upcoming bedside observations and rounds",
      checked: roundReminders,
      onChange: (v: boolean) => setRoundReminders(v),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        icon={Settings}
        title="Account & Facility Settings"
        description="Manage your CarerLoop credentials, active care home context, and clinical notifications."
      />

      {savedSuccess && (
        <div
          role="status"
          className="p-4 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-rise"
        >
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          Settings and preferences successfully saved!
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[260px_minmax(0,1fr)] gap-6 items-start">
        {/* Left: identity summary + section nav */}
        <aside className="space-y-4 lg:sticky lg:top-6">
          <div className="relative overflow-hidden bg-white border border-ink/[0.08] rounded-md p-5">
            <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-br from-mint via-cream to-sky-soft" />
            <div className="relative flex flex-col items-center text-center pt-4">
              <Avatar name={user.name} size="lg" />
              <p className="mt-3 font-semibold text-ink truncate max-w-full">{user.name}</p>
              <p className="text-xs text-ink/55 truncate max-w-full">{user.email}</p>
              <div className="mt-3 flex flex-wrap justify-center gap-1.5">
                <Badge tone="teal" icon={ShieldCheck}>
                  {currentRole.replace(/_/g, " ")}
                </Badge>
                <Badge tone="violet">{user.roleTier}</Badge>
              </div>
            </div>
          </div>

          <nav
            aria-label="Settings sections"
            className="flex lg:flex-col gap-1 overflow-x-auto p-1 bg-white border border-ink/[0.08] rounded-md"
          >
            {sections.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="group flex items-center gap-2.5 shrink-0 px-3 py-2 rounded-md text-xs sm:text-sm font-medium text-ink/65 hover:text-ink hover:bg-mint/40 transition-colors"
              >
                <s.icon className="h-4 w-4 text-teal-brand" />
                <span className="whitespace-nowrap">{s.label}</span>
                <ChevronRight className="hidden lg:block ml-auto h-3.5 w-3.5 text-ink/30 transition-transform group-hover:translate-x-0.5 group-hover:text-teal-brand" />
              </a>
            ))}
          </nav>
        </aside>

        {/* Right: setting panels */}
        <div className="space-y-6 min-w-0">
          {/* Profile Card */}
          <div id="profile" className="scroll-mt-6">
            <Panel
              icon={User}
              title="User Profile & Security Context"
              description="Your identity as provided by your organisation."
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={field.label}>Full Name</label>
                  <input type="text" readOnly value={user.name} className={readOnlyInput} />
                </div>

                <div>
                  <label className={field.label}>Email Address</label>
                  <input type="email" readOnly value={user.email} className={readOnlyInput} />
                </div>

                <div>
                  <label className={field.label}>Active Role</label>
                  <div className="px-3.5 py-2.5 rounded-md border border-ink/12 bg-ink/[0.025] flex items-center justify-between gap-2 text-sm">
                    <span className="font-semibold text-teal-deep truncate">
                      {currentRole.replace(/_/g, " ")}
                    </span>
                    <Badge tone="teal">{user.roleTier}</Badge>
                  </div>
                </div>

                <div>
                  <label className={field.label}>Parent Organisation</label>
                  <input
                    type="text"
                    readOnly
                    value={user.organisationName}
                    className={readOnlyInput}
                  />
                </div>
              </div>
            </Panel>
          </div>

          {/* Care Home Context Switcher */}
          <div id="care-home" className="scroll-mt-6">
            <Panel
              icon={Building2}
              title="Care Home Context Scope"
              description="Your active view filters resident lists, bed occupancy, and medication logs to this facility."
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  "St. Jude's Residential Home",
                  "Meadow View Lodge",
                  "Oakridge Manor Care Centre",
                  "Hazelwood House",
                ].map((home) => {
                  const isSelected = activeCareHome === home;
                  return (
                    <button
                      key={home}
                      onClick={() => {
                        setActiveCareHome(home);
                        handleSavePreferences();
                      }}
                      aria-pressed={isSelected}
                      className={`group flex items-center gap-3 p-4 rounded-md border text-left transition-all cursor-pointer hover:-translate-y-0.5 ${
                        isSelected
                          ? "border-teal-brand bg-mint/40 ring-4 ring-teal-brand/10"
                          : "border-ink/10 bg-white hover:border-teal-brand/40 hover:shadow-sm"
                      }`}
                    >
                      <span
                        className={`grid place-items-center w-9 h-9 rounded-md shrink-0 transition-colors ${
                          isSelected
                            ? "bg-teal-brand text-white"
                            : "bg-ink/[0.04] text-ink/50 group-hover:bg-mint group-hover:text-teal-brand"
                        }`}
                      >
                        <Building2 className="h-4 w-4" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block font-semibold text-sm text-ink truncate">{home}</span>
                        <span className="text-[11px] text-ink/55 mt-0.5 block">
                          South West Region
                        </span>
                      </span>
                      {isSelected && (
                        <CheckCircle2 className="h-5 w-5 text-teal-brand shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            </Panel>
          </div>

          {/* Notifications */}
          <div id="notifications" className="scroll-mt-6">
            <Panel
              icon={Bell}
              title="Alerts & Notification Preferences"
              description="Choose which clinical and operational alerts reach you."
              flush
            >
              <div className="divide-y divide-ink/[0.06]">
                {notificationOptions.map((opt) => (
                  <label
                    key={opt.title}
                    className="flex items-center justify-between gap-4 px-5 py-4 cursor-pointer transition-colors hover:bg-mint/25"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-ink">{opt.title}</p>
                      <p className="text-xs text-ink/55 mt-0.5">{opt.description}</p>
                    </div>
                    <span className="relative inline-flex shrink-0">
                      <input
                        type="checkbox"
                        checked={opt.checked}
                        onChange={(e) => opt.onChange(e.target.checked)}
                        className="peer sr-only"
                      />
                      <span className="w-10 h-6 rounded-full bg-ink/15 transition-colors peer-checked:bg-teal-brand peer-focus-visible:ring-4 peer-focus-visible:ring-teal-brand/20" />
                      <span className="absolute left-0.5 top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform peer-checked:translate-x-4" />
                    </span>
                  </label>
                ))}
              </div>
            </Panel>
          </div>

          {/* Password & Security */}
          <div id="security" className="scroll-mt-6">
            <Panel
              icon={Lock}
              title="Security & Password"
              description="Keep your account protected with a strong password."
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={field.label}>Current Password</label>
                  <input
                    type="password"
                    placeholder="••••••••••••"
                    value={currentPw}
                    onChange={(e) => setCurrentPw(e.target.value)}
                    className={field.input}
                  />
                </div>

                <div>
                  <label className={field.label}>New Secure Password</label>
                  <div className="relative">
                    <input
                      type={showPw ? "text" : "password"}
                      placeholder="At least 8 characters"
                      value={newPw}
                      onChange={(e) => setNewPw(e.target.value)}
                      className={`${field.input} pr-11`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw(!showPw)}
                      className="absolute right-1.5 top-1/2 -translate-y-1/2 grid place-items-center w-8 h-8 rounded-md text-ink/40 hover:text-ink hover:bg-ink/5 cursor-pointer"
                      aria-label={showPw ? "Hide password" : "Show password"}
                    >
                      {showPw ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-ink/[0.06] flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3">
                <p className="flex items-center gap-1.5 text-[11px] text-ink/50">
                  <KeyRound className="h-3.5 w-3.5" />
                  Use at least 8 characters.
                </p>
                <button onClick={handleSavePreferences} className={`${btn.primary} group`}>
                  <Save className="h-4 w-4 transition-transform group-hover:scale-110" />
                  Update Security Credentials
                </button>
              </div>
            </Panel>
          </div>
        </div>
      </div>
    </div>
  );
}
