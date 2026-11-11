"use client";

import { useState } from "react";
import Link from "next/link";
import { useRole, RoleType, ROLE_PROFILES } from "@/lib/role-context";
import {
  Menu,
  Bell,
  Building2,
  ChevronDown,
  ShieldCheck,
  Crown,
  HeartHandshake,
  Home,
  User,
  ExternalLink,
  Check,
} from "lucide-react";

interface TopbarProps {
  onOpenMobileNav: () => void;
}

export default function Topbar({ onOpenMobileNav }: TopbarProps) {
  const {
    currentRole,
    setCurrentRole,
    user,
    activeCareHome,
    setActiveCareHome,
    availableCareHomes,
  } = useRole();

  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [facilityMenuOpen, setFacilityMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const rolesList: { role: RoleType; label: string; icon: any }[] = [
    { role: "CARE_HOME_MANAGER", label: "Care Home Manager", icon: Home },
    {
      role: "ORGANISATION_ADMIN",
      label: "Organisation Admin",
      icon: Building2,
    },
    { role: "CAREGIVER", label: "Caregiver / Nurse", icon: HeartHandshake },
    { role: "SUPER_ADMIN", label: "Platform Super Admin", icon: Crown },
    { role: "RESIDENT", label: "Resident / Next-of-Kin", icon: User },
  ];

  return (
    <header className="sticky top-0 z-30 h-18 bg-white/90 backdrop-blur-md border-b border-ink/10 px-4 sm:px-8 flex items-center justify-between">
      {/* Left: Mobile Toggle & Context Info */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileNav}
          className="p-2 rounded-xl text-ink/70 hover:text-ink hover:bg-cream lg:hidden cursor-pointer"
          aria-label="Open mobile navigation"
        >
          <Menu className="h-6 w-6" />
        </button>

        {/* Facility Context Picker (for Org Admin & Care Home Manager) */}
        {currentRole !== "SUPER_ADMIN" && currentRole !== "RESIDENT" ? (
          <div className="relative">
            <button
              onClick={() => {
                setFacilityMenuOpen(!facilityMenuOpen);
                setRoleMenuOpen(false);
              }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-ink/10 bg-cream/50 hover:bg-cream text-xs font-semibold text-ink transition-colors cursor-pointer"
            >
              <Home className="h-3.5 w-3.5 text-teal-brand" />
              <span className="hidden sm:inline">Facility:</span>
              <span className="font-bold">{activeCareHome}</span>
              <ChevronDown className="h-3.5 w-3.5 text-ink/40" />
            </button>

            {facilityMenuOpen && (
              <div className="absolute left-0 mt-2 w-64 rounded-md bg-white border border-ink/10 shadow-xl p-2 z-50 animate-fade-in text-xs space-y-1">
                <p className="px-2.5 py-1 text-[10px] font-bold text-ink/40 uppercase tracking-wider">
                  Select Care Home Facility
                </p>
                {availableCareHomes.map((home) => (
                  <button
                    key={home}
                    onClick={() => {
                      setActiveCareHome(home.split(" (")[0]);
                      setFacilityMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-colors cursor-pointer ${
                      activeCareHome === home.split(" (")[0]
                        ? "bg-mint text-teal-deep font-bold"
                        : "hover:bg-cream text-ink/70 hover:text-ink"
                    }`}
                  >
                    <span>{home}</span>
                    {activeCareHome === home.split(" (")[0] && (
                      <Check className="h-3.5 w-3.5 text-teal-brand" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-cream border border-ink/10 text-xs text-ink/70 font-medium">
            <Building2 className="h-3.5 w-3.5 text-teal-brand" />
            <span>{user.organisationName}</span>
          </div>
        )}
      </div>

      {/* Right: Live Interactive Role Switcher & Notifications */}
      <div className="flex items-center gap-3">
        {/* Role Switcher Pill */}
        <div className="relative">
          <button
            onClick={() => {
              setRoleMenuOpen(!roleMenuOpen);
              setFacilityMenuOpen(false);
            }}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-teal-brand/30 bg-mint text-teal-deep hover:bg-mint/80 text-xs font-semibold transition-all cursor-pointer shadow-xs"
          >
            <ShieldCheck className="h-3.5 w-3.5 text-teal-brand" />
            <span className="hidden md:inline text-teal-brand font-medium">
              Active Role:
            </span>
            <span className="font-bold">
              {ROLE_PROFILES[currentRole].roleTitle.split(" ")[0]}
            </span>
            <ChevronDown className="h-3 w-3 text-teal-brand/70" />
          </button>

          {roleMenuOpen && (
            <div className="absolute right-0 mt-2 w-72 rounded-md bg-white border border-ink/10 shadow-2xl p-2 z-50 animate-fade-in text-xs space-y-1">
              <div className="px-3 py-2 border-b border-ink/5">
                <p className="text-[10px] font-bold text-ink/40 uppercase tracking-wider">
                  Switch Active Role Persona
                </p>
              </div>

              <div className="py-1 space-y-1">
                {rolesList.map(({ role, label, icon: Icon }) => (
                  <button
                    key={role}
                    onClick={() => {
                      setCurrentRole(role);
                      setRoleMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-colors cursor-pointer ${
                      currentRole === role
                        ? "bg-mint text-teal-deep font-bold"
                        : "hover:bg-cream text-ink/80 hover:text-ink"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon
                        className={`h-4 w-4 ${currentRole === role ? "text-teal-brand" : "text-ink/40"}`}
                      />
                      <div>
                        <p className="font-semibold">{label}</p>
                        <p className="text-[10px] text-ink/50">
                          {ROLE_PROFILES[role].roleTier}
                        </p>
                      </div>
                    </div>

                    {currentRole === role && (
                      <Check className="h-4 w-4 text-teal-brand" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Notifications Icon with Mock alerts */}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="relative p-2 rounded-xl text-ink/70 hover:text-ink hover:bg-cream transition-colors cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-coral animate-ping" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-coral" />
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-md bg-white border border-ink/10 shadow-2xl p-4 z-50 animate-fade-in text-xs space-y-3">
              <div className="flex items-center justify-between border-b border-ink/5 pb-2">
                <span className="font-bold text-ink">
                  Care Alerts & Activities
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-coral-soft text-coral font-bold">
                  2 New
                </span>
              </div>

              <div className="space-y-2">
                <div className="p-2.5 rounded-xl bg-cream/50 border border-ink/5 space-y-0.5">
                  <p className="font-semibold text-ink">
                    Room 14B • Eleanor Vance
                  </p>
                  <p className="text-ink/65 text-[11px]">
                    Morning blood pressure check (124/82) logged.
                  </p>
                  <span className="text-[10px] text-ink/40">5m ago</span>
                </div>

                <div className="p-2.5 rounded-xl bg-cream/50 border border-ink/5 space-y-0.5">
                  <p className="font-semibold text-ink">
                    New Self-Registration Ref: REG-2026-9904
                  </p>
                  <p className="text-ink/65 text-[11px]">
                    Email verified. Awaiting clinical manager review.
                  </p>
                  <span className="text-[10px] text-ink/40">22m ago</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
