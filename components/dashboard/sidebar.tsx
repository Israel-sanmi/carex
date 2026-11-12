"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRole, RoleType } from "@/lib/role-context";
import Logo from "@/components/landing/logo";
import {
  LayoutDashboard,
  Building2,
  Home,
  Users,
  UserPlus,
  UserCheck,
  Mail,
  FileClock,
  Settings,
  LogOut,
  ShieldCheck,
  Heart,
  X,
} from "lucide-react";

interface SidebarProps {
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export default function Sidebar({ mobileOpen, onCloseMobile }: SidebarProps) {
  const pathname = usePathname();
  const { currentRole, user } = useRole();

  // Define nav links with role-based visibility matrix according to Section 5
  const allNavItems = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      allowedRoles: [
        "SUPER_ADMIN",
        "ORGANISATION_ADMIN",
        "CARE_HOME_MANAGER",
        "CAREGIVER",
        "RESIDENT",
      ],
      badge: undefined,
    },
    {
      label: "Organisations",
      href: "/dashboard/organisations",
      icon: Building2,
      allowedRoles: ["SUPER_ADMIN"],
      badge: "Platform",
    },
    {
      label: "Care Homes",
      href: "/dashboard/care-homes",
      icon: Home,
      allowedRoles: ["SUPER_ADMIN", "ORGANISATION_ADMIN", "CARE_HOME_MANAGER"],
      badge: undefined,
    },
    {
      label: "Residents",
      href: "/dashboard/residents",
      icon: Users,
      allowedRoles: [
        "ORGANISATION_ADMIN",
        "CARE_HOME_MANAGER",
        "CAREGIVER",
        "RESIDENT",
      ],
      badge: currentRole === "RESIDENT" ? "My Profile" : undefined,
    },
    {
      label: "Admissions & Intake",
      href: "/dashboard/registrations",
      icon: UserPlus,
      allowedRoles: ["SUPER_ADMIN", "ORGANISATION_ADMIN", "CARE_HOME_MANAGER"],
      badge: "4",
    },
    {
      label: "User Management",
      href: "/dashboard/users",
      icon: UserCheck,
      allowedRoles: ["SUPER_ADMIN", "ORGANISATION_ADMIN", "CARE_HOME_MANAGER"],
      badge: undefined,
    },
    {
      label: "Invitations",
      href: "/dashboard/invitations",
      icon: Mail,
      allowedRoles: ["SUPER_ADMIN", "ORGANISATION_ADMIN", "CARE_HOME_MANAGER"],
      badge: undefined,
    },
    {
      label: "Audit Logs",
      href: "/dashboard/audit-logs",
      icon: FileClock,
      allowedRoles: ["SUPER_ADMIN", "ORGANISATION_ADMIN"],
      badge: "Immutable",
    },
    {
      label: "Settings",
      href: "/dashboard/settings",
      icon: Settings,
      allowedRoles: [
        "SUPER_ADMIN",
        "ORGANISATION_ADMIN",
        "CARE_HOME_MANAGER",
        "CAREGIVER",
        "RESIDENT",
      ],
      badge: undefined,
    },
  ];

  // Filter items by active role
  const visibleNavItems = allNavItems.filter((item) =>
    item.allowedRoles.includes(currentRole),
  );

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-ink/40 backdrop-blur-xs lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-ink/10 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          mobileOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        }`}
      >
        {/* Top Header */}
        <div>
          <div className="h-18 px-6 flex items-center justify-between border-b border-ink/10">
            <Link href="/" className="inline-block">
              <Logo />
            </Link>
            <button
              onClick={onCloseMobile}
              className="p-1.5 rounded-md text-ink/60 hover:text-ink lg:hidden cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Active Tenant / Facility Pill */}
          {/* <div className="p-4 border-b border-ink/5 bg-cream/30">
            <div className="p-3 rounded-md bg-cream border border-ink/10 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-teal-deep uppercase tracking-wider">
                  Tenant Scope
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-mint text-teal-deep font-semibold">
                  {user.roleTier}
                </span>
              </div>
              <p className="text-xs font-bold text-ink truncate">
                {user.organisationName}
              </p>
              <p className="text-[11px] text-teal-brand font-medium truncate">
                {user.careHomeName}
              </p>
            </div>
          </div> */}

          {/* Nav Items */}
          <nav className="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-280px)]">
            {/* <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-ink/40">
              Navigation ({currentRole.replace(/_/g, " ")})
            </p> */}

            {visibleNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onCloseMobile}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-md text-xs sm:text-sm font-medium transition-all ${
                    isActive
                      ? "bg-teal-brand text-white font-semibold shadow-xs shadow-teal-brand/30"
                      : "text-ink/70 hover:text-ink hover:bg-cream"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`h-4 w-4 shrink-0 ${isActive ? "text-white" : "text-ink/50"}`}
                    />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-coral-soft text-coral"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer User Profile & Sign Out */}
        <div className="p-4 border-t border-ink/10 bg-cream/40 space-y-3">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-teal-brand text-white font-bold text-xs shadow-xs">
              {user.avatarInitials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-ink truncate">{user.name}</p>
              <p className="text-[11px] text-ink/60 truncate">
                {user.roleTitle}
              </p>
            </div>
          </div>

          <Link
            href="/login"
            className="w-full flex items-center justify-center gap-2 py-2 rounded-md border border-ink/10 bg-white hover:bg-destructive/10 hover:border-destructive/30 hover:text-destructive text-ink/70 text-xs font-semibold transition-colors"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Sign Out</span>
          </Link>
        </div>
      </aside>
    </>
  );
}
