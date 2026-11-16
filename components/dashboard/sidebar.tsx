"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useRole } from "@/lib/role-context";
import { useLogoutMutation } from "@/lib/hooks/use-auth-mutations";
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
  X,
  Loader2,
} from "lucide-react";

interface SidebarProps {
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

type NavGroup = "Overview" | "Care" | "People" | "System";

export default function Sidebar({ mobileOpen, onCloseMobile }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { currentRole, roles, user } = useRole();
  const logoutMutation = useLogoutMutation();

  const handleSignOut = async () => {
    await logoutMutation.mutateAsync();
    router.push("/login");
  };

  // Role-based visibility matrix (Section 5)
  const allNavItems: {
    label: string;
    href: string;
    icon: typeof LayoutDashboard;
    allowedRoles: string[];
    badge?: string;
    group: NavGroup;
  }[] = [
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
      group: "Overview",
    },
    {
      label: "Organisations",
      href: "/dashboard/organisations",
      icon: Building2,
      allowedRoles: ["SUPER_ADMIN"],
      badge: "Platform",
      group: "Care",
    },
    {
      label: "Care Homes",
      href: "/dashboard/care-homes",
      icon: Home,
      allowedRoles: ["SUPER_ADMIN", "ORGANISATION_ADMIN", "CARE_HOME_MANAGER"],
      group: "Care",
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
      group: "Care",
    },
    {
      label: "Admissions & Intake",
      href: "/dashboard/registrations",
      icon: UserPlus,
      allowedRoles: ["SUPER_ADMIN", "ORGANISATION_ADMIN", "CARE_HOME_MANAGER"],
      badge: "4",
      group: "Care",
    },
    {
      label: "User Management",
      href: "/dashboard/users",
      icon: UserCheck,
      allowedRoles: ["SUPER_ADMIN", "ORGANISATION_ADMIN", "CARE_HOME_MANAGER"],
      group: "People",
    },
    {
      label: "Invitations",
      href: "/dashboard/invitations",
      icon: Mail,
      allowedRoles: ["SUPER_ADMIN", "ORGANISATION_ADMIN", "CARE_HOME_MANAGER"],
      group: "People",
    },
    {
      label: "Audit Logs",
      href: "/dashboard/audit-logs",
      icon: FileClock,
      allowedRoles: ["SUPER_ADMIN", "ORGANISATION_ADMIN"],
      badge: "Immutable",
      group: "System",
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
      group: "System",
    },
  ];

  const visibleNavItems = allNavItems.filter(
    (item) =>
      item.allowedRoles.includes(currentRole) ||
      item.allowedRoles.some((r) => roles.includes(r)),
  );

  const groups: NavGroup[] = ["Overview", "Care", "People", "System"];

  const isActive = (href: string) =>
    href === "/dashboard"
      ? pathname === href
      : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      {/* Mobile backdrop - only rendered when mobileOpen is true */}
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-ink/50 backdrop-blur-xs lg:hidden transition-opacity duration-300 animate-in fade-in cursor-pointer"
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 flex flex-col text-white overflow-hidden bg-[linear-gradient(180deg,#073b38_0%,#062b29_55%,#05201f_100%)] transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] lg:translate-x-0 ${
          mobileOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        }`}
      >
        {/* Ambient glow */}
        <div className="absolute -top-24 -left-20 w-72 h-72 rounded-full bg-emerald-400/15 blur-3xl pointer-events-none" />
        <div className="absolute bottom-20 -right-24 w-60 h-60 rounded-full bg-teal-300/10 blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="relative h-18 shrink-0 px-6 flex items-center justify-between border-b border-white/10">
          <Link
            href="/"
            className="inline-block transition-opacity hover:opacity-90"
          >
            <Logo light />
          </Link>
          <button
            onClick={onCloseMobile}
            className="p-1.5 rounded-md text-white/60 hover:text-white hover:bg-white/10 lg:hidden"
            aria-label="Close navigation"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="relative flex-1 overflow-y-auto px-3 py-5 space-y-6 [scrollbar-width:thin]">
          {groups.map((group) => {
            const items = visibleNavItems.filter((i) => i.group === group);
            if (!items.length) return null;
            return (
              <div key={group}>
                <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-white/35">
                  {group}
                </p>
                <ul className="space-y-0.5">
                  {items.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.href);
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          onClick={onCloseMobile}
                          className={`group relative flex items-center justify-between gap-2 px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-200 ${
                            active
                              ? "bg-white/10 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
                              : "text-white/60 hover:text-white hover:bg-white/[0.06]"
                          }`}
                        >
                          {/* Active indicator */}
                          <span
                            className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 rounded-r-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)] transition-all duration-300 ${
                              active ? "h-6 opacity-100" : "h-0 opacity-0"
                            }`}
                          />
                          <span className="flex items-center gap-3 min-w-0">
                            <span
                              className={`grid place-items-center w-8 h-8 rounded-md shrink-0 transition-all duration-200 ${
                                active
                                  ? "bg-emerald-400 text-teal-950 shadow-lg shadow-emerald-500/30"
                                  : "bg-white/5 text-white/60 group-hover:text-white group-hover:bg-white/10 group-hover:scale-105"
                              }`}
                            >
                              <Icon className="h-4 w-4" />
                            </span>
                            <span className="truncate">{item.label}</span>
                          </span>

                          {item.badge && (
                            <span
                              className={`text-[10px] px-2 py-0.5 rounded-full font-semibold shrink-0 ${
                                /^\d+$/.test(item.badge)
                                  ? "bg-coral text-white min-w-5 text-center"
                                  : active
                                    ? "bg-white/15 text-white"
                                    : "bg-white/[0.08] text-white/60"
                              }`}
                            >
                              {item.badge}
                            </span>
                          )}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </nav>

        {/* Profile + sign out */}
        <div className="relative p-3 border-t border-white/10">
          <div className="flex items-center gap-3 p-2.5 rounded-md bg-white/[0.06] border border-white/10">
            <div className="relative shrink-0">
              <div className="grid h-10 w-10 place-items-center rounded-md bg-gradient-to-br from-emerald-300 to-teal-600 text-teal-950 font-bold text-xs shadow-md">
                {user.avatarInitials}
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#05201f]" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold truncate">{user.name}</p>
              <p className="text-[11px] text-white/50 truncate">
                {user.roleTitle}
              </p>
            </div>
            <button
              onClick={handleSignOut}
              disabled={logoutMutation.isPending}
              title="Sign out"
              aria-label="Sign out"
              className="grid place-items-center w-9 h-9 rounded-md text-white/50 hover:text-white hover:bg-red-500/80 transition-all disabled:opacity-50"
            >
              {logoutMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <LogOut className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
