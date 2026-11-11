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
} from "lucide-react";

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

  return (
    <div className="space-y-8  mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-ink font-heading">
          Account & Facility Settings
        </h1>
        <p className="text-sm text-ink/70 mt-1">
          Manage your CarerLoop credentials, active care home context, and
          clinical notifications.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          Settings and preferences successfully saved!
        </div>
      )}

      {/* Profile Card */}
      <div className="p-6 rounded-md bg-white border border-ink/10 shadow-xs space-y-6">
        <h2 className="text-base font-bold text-ink font-heading flex items-center gap-2">
          <User className="h-4 w-4 text-teal-brand" />
          User Profile & Security Context
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="font-semibold text-ink/70 block mb-1">
              Full Name
            </label>
            <input
              type="text"
              readOnly
              value={user.name}
              className="w-full px-3 py-2 rounded-md border border-ink/10 bg-cream/40 text-ink font-medium cursor-not-allowed"
            />
          </div>

          <div>
            <label className="font-semibold text-ink/70 block mb-1">
              Email Address
            </label>
            <input
              type="email"
              readOnly
              value={user.email}
              className="w-full px-3 py-2 rounded-md border border-ink/10 bg-cream/40 text-ink font-medium cursor-not-allowed"
            />
          </div>

          <div>
            <label className="font-semibold text-ink/70 block mb-1">
              Active Role
            </label>
            <div className="px-3 py-2 rounded-md border border-ink/10 bg-cream/40 flex items-center justify-between">
              <span className="font-bold text-teal-deep">
                {currentRole.replace(/_/g, " ")}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-mint text-teal-deep font-semibold">
                {user.roleTier}
              </span>
            </div>
          </div>

          <div>
            <label className="font-semibold text-ink/70 block mb-1">
              Parent Organisation
            </label>
            <input
              type="text"
              readOnly
              value={user.organisationName}
              className="w-full px-3 py-2 rounded-md border border-ink/10 bg-cream/40 text-ink font-medium cursor-not-allowed"
            />
          </div>
        </div>
      </div>

      {/* Care Home Context Switcher */}
      <div className="p-6 rounded-md bg-white border border-ink/10 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-ink font-heading flex items-center gap-2">
          <Building2 className="h-4 w-4 text-teal-brand" />
          Care Home Context Scope
        </h2>
        <p className="text-xs text-ink/70">
          Your active view filters resident lists, bed occupancy, and medication
          logs to this facility.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
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
                className={`p-4 rounded-md border text-left transition-all cursor-pointer ${
                  isSelected
                    ? "border-teal-brand bg-mint/20 ring-2 ring-teal-brand/20"
                    : "border-ink/10 hover:border-ink/20 bg-cream/20"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-ink">{home}</span>
                  {isSelected && (
                    <CheckCircle2 className="h-4 w-4 text-teal-brand" />
                  )}
                </div>
                <span className="text-[11px] text-ink/60 mt-1 block">
                  South West Region
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Notifications */}
      <div className="p-6 rounded-md bg-white border border-ink/10 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-ink font-heading flex items-center gap-2">
          <Bell className="h-4 w-4 text-teal-brand" />
          Alerts & Notification Preferences
        </h2>

        <div className="space-y-3 pt-2 text-xs">
          <label className="flex items-center justify-between p-3.5 rounded-md border border-ink/5 bg-cream/30 cursor-pointer">
            <div>
              <p className="font-bold text-ink">
                Urgent Medical & Allergy Alerts
              </p>
              <p className="text-[11px] text-ink/60">
                Immediate push alerts when vital signs cross critical thresholds
              </p>
            </div>
            <input
              type="checkbox"
              checked={smsAlerts}
              onChange={(e) => setSmsAlerts(e.target.checked)}
              className="h-4 w-4 accent-teal-brand rounded cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between p-3.5 rounded-md border border-ink/5 bg-cream/30 cursor-pointer">
            <div>
              <p className="font-bold text-ink">
                Admission & Intake Notifications
              </p>
              <p className="text-[11px] text-ink/60">
                Receive alerts when prospective residents submit registration
                forms
              </p>
            </div>
            <input
              type="checkbox"
              checked={emailAlerts}
              onChange={(e) => setEmailAlerts(e.target.checked)}
              className="h-4 w-4 accent-teal-brand rounded cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between p-3.5 rounded-md border border-ink/5 bg-cream/30 cursor-pointer">
            <div>
              <p className="font-bold text-ink">
                Care Round & Medication Reminders
              </p>
              <p className="text-[11px] text-ink/60">
                Shift reminders for upcoming bedside observations and rounds
              </p>
            </div>
            <input
              type="checkbox"
              checked={roundReminders}
              onChange={(e) => setRoundReminders(e.target.checked)}
              className="h-4 w-4 accent-teal-brand rounded cursor-pointer"
            />
          </label>
        </div>
      </div>

      {/* Password & Security */}
      <div className="p-6 rounded-md bg-white border border-ink/10 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-ink font-heading flex items-center gap-2">
          <Lock className="h-4 w-4 text-teal-brand" />
          Security & Password
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-1">
          <div>
            <label className="font-semibold text-ink block mb-1">
              Current Password
            </label>
            <input
              type="password"
              placeholder="••••••••••••"
              value={currentPw}
              onChange={(e) => setCurrentPw(e.target.value)}
              className="w-full px-3 py-2 rounded-md border border-ink/10 bg-cream/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-brand/20 font-medium"
            />
          </div>

          <div>
            <label className="font-semibold text-ink block mb-1">
              New Secure Password
            </label>
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                placeholder="At least 8 characters"
                value={newPw}
                onChange={(e) => setNewPw(e.target.value)}
                className="w-full px-3 py-2 rounded-md border border-ink/10 bg-cream/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-brand/20 font-medium pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/40 hover:text-ink cursor-pointer"
              >
                {showPw ? (
                  <EyeOff className="h-3.5 w-3.5" />
                ) : (
                  <Eye className="h-3.5 w-3.5" />
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={handleSavePreferences}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-teal-brand text-white text-xs font-semibold hover:bg-teal-deep transition-all cursor-pointer shadow-xs"
          >
            <Save className="h-3.5 w-3.5" />
            Update Security Credentials
          </button>
        </div>
      </div>
    </div>
  );
}
