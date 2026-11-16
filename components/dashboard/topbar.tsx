"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
    roles,
    roleAssignments,
    activeCareHome,
    setActiveCareHome,
    availableCareHomes,
  } = useRole();

  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [facilityMenuOpen, setFacilityMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const pathname = usePathname();

  // Close any open menu on outside click or Escape
  useEffect(() => {
    const closeAll = () => {
      setRoleMenuOpen(false);
      setFacilityMenuOpen(false);
      setNotificationsOpen(false);
    };
    const onPointer = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node))
        closeAll();
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeAll();
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const segment = pathname.split("/")[2];
  const pageTitle = segment
    ? segment.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
    : "Overview";

  const allRolesList: { role: RoleType; label: string; icon: any }[] = [
    { role: "SUPER_ADMIN", label: "Platform Super Admin", icon: Crown },
    {
      role: "ORGANISATION_ADMIN",
      label: "Organisation Admin",
      icon: Building2,
    },
    { role: "CARE_HOME_MANAGER", label: "Care Home Manager", icon: Home },
    { role: "CAREGIVER", label: "Caregiver / Nurse", icon: HeartHandshake },
    { role: "RESIDENT", label: "Resident / Next-of-Kin", icon: User },
  ];

  // Only include roles that the user actually possesses in their auth session
  const userAssignedRoles = Array.from(
    new Set([
      ...(roles || []),
      ...(roleAssignments?.map((ra) => ra.role) || []),
      currentRole,
    ]),
  ).filter(Boolean);

  const availableRoles = allRolesList.filter((item) =>
    userAssignedRoles.includes(item.role),
  );

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-30 h-16 sm:h-18 bg-white/70 backdrop-blur-xl backdrop-saturate-150 border-b border-ink/[0.07] px-3 sm:px-6 lg:px-8 flex items-center justify-between gap-2 sm:gap-4"
    >
      {/* Left: Mobile Toggle, page title & context */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onOpenMobileNav}
          className="p-2 rounded-md text-ink/70 hover:text-ink hover:bg-cream lg:hidden cursor-pointer"
          aria-label="Open mobile navigation"
        >
          <Menu className="h-6 w-6" />
        </button>

        <div
          key={pageTitle}
          className="min-w-0 sm:pr-3 sm:mr-1 sm:border-r border-ink/10 animate-rise"
        >
          <p className="hidden sm:block text-[10px] font-semibold uppercase tracking-[0.16em] text-ink/40 leading-none">
            Dashboard
          </p>
          <p className="text-base font-semibold text-ink truncate leading-tight sm:mt-1">
            {pageTitle}
          </p>
        </div>

        {/* Facility Context Picker (for Org Admin & Care Home Manager) */}
        {currentRole !== "SUPER_ADMIN" && currentRole !== "RESIDENT" ? (
          <div className="relative">
            <button
              onClick={() => {
                setFacilityMenuOpen(!facilityMenuOpen);
                setRoleMenuOpen(false);
              }}
              className="flex items-center gap-2 px-3 py-2 rounded-md border border-ink/10 bg-white hover:border-teal-brand/30 hover:shadow-sm text-xs font-semibold text-ink transition-colors cursor-pointer"
            >
              <Home className="h-3.5 w-3.5 text-teal-brand" />
              <span className="hidden sm:inline">Facility:</span>
              <span className="hidden sm:inline font-bold max-w-[10rem] lg:max-w-[14rem] truncate">{activeCareHome}</span>
              <ChevronDown
                className={`h-3.5 w-3.5 text-ink/40 transition-transform ${facilityMenuOpen ? "rotate-180" : ""}`}
              />
            </button>

            {facilityMenuOpen && (
              <div className="absolute left-0 sm:left-0 mt-2 w-[min(16rem,calc(100vw-1.5rem))] rounded-md bg-white/95 backdrop-blur-xl border border-ink/10 shadow-2xl shadow-ink/10 p-2 z-50 animate-scale-in text-xs space-y-1">
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
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-left transition-colors cursor-pointer ${
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
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-md bg-cream border border-ink/10 text-xs text-ink/70 font-medium">
            <Building2 className="h-3.5 w-3.5 text-teal-brand" />
            <span>{user.organisationName}</span>
          </div>
        )}
      </div>

      {/* Right: Live Interactive Role Switcher & Notifications */}
      <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
        {/* Role Display / Switcher (only show dropdown if user has multiple assigned roles) */}
        <div className="relative">
          {availableRoles.length > 1 ? (
            <>
              <button
                onClick={() => {
                  setRoleMenuOpen(!roleMenuOpen);
                  setFacilityMenuOpen(false);
                }}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-md border border-teal-brand/30 bg-mint text-teal-deep hover:bg-mint/80 text-xs font-semibold transition-all cursor-pointer shadow-xs"
              >
                <ShieldCheck className="h-3.5 w-3.5 text-teal-brand" />
                <span className="hidden md:inline text-teal-brand font-medium">
                  Active Role:
                </span>
                <span className="hidden sm:inline font-bold">
                  {ROLE_PROFILES[currentRole]?.roleTitle?.split(" ")[0] ||
                    currentRole}
                </span>
                <ChevronDown
                  className={`h-3 w-3 text-teal-brand/70 transition-transform ${roleMenuOpen ? "rotate-180" : ""}`}
                />
              </button>

              {roleMenuOpen && (
                <div className="absolute right-0 mt-2 w-[min(18rem,calc(100vw-1.5rem))] rounded-md bg-white/95 backdrop-blur-xl border border-ink/10 shadow-2xl shadow-ink/10 p-2 z-50 animate-scale-in origin-top-right text-xs space-y-1">
                  <div className="px-3 py-2 border-b border-ink/5">
                    <p className="text-[10px] font-bold text-ink/40 uppercase tracking-wider">
                      Switch Assigned Role
                    </p>
                  </div>

                  <div className="py-1 space-y-1">
                    {availableRoles.map(({ role, label, icon: Icon }) => (
                      <button
                        key={role}
                        onClick={() => {
                          setCurrentRole(role);
                          setRoleMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md text-left transition-colors cursor-pointer ${
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
                              {ROLE_PROFILES[role]?.roleTier || "Assigned Role"}
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
            </>
          ) : (
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-teal-brand/20 bg-mint/50 text-teal-deep text-xs font-semibold shadow-xs">
              <ShieldCheck className="h-3.5 w-3.5 text-teal-brand" />
              <span className="hidden md:inline text-teal-brand/75 font-medium">
                Role:
              </span>
              <span className="hidden sm:inline font-bold truncate max-w-[12rem]">
                {ROLE_PROFILES[currentRole]?.roleTitle ||
                  currentRole.replace(/_/g, " ")}
              </span>
            </div>
          )}
        </div>

        {/* Notifications Icon */}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="group relative p-2.5 rounded-md text-ink/70 hover:text-ink hover:bg-cream transition-colors cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5 transition-transform group-hover:rotate-[14deg]" />
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-[min(20rem,calc(100vw-1.5rem))] rounded-md bg-white/95 backdrop-blur-xl border border-ink/10 shadow-2xl shadow-ink/10 p-4 z-50 animate-scale-in origin-top-right text-xs space-y-3">
              <div className="flex items-center justify-between border-b border-ink/5 pb-2">
                <span className="font-bold text-ink">System Notifications</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cream text-ink/60 font-semibold">
                  0 Unread
                </span>
              </div>

              <div className="py-8 text-center text-ink/50 text-xs flex flex-col items-center gap-2">
                <span className="grid place-items-center w-10 h-10 rounded-full bg-mint text-teal-brand">
                  <Bell className="h-4 w-4" />
                </span>
                No new unread alerts or notifications.
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
