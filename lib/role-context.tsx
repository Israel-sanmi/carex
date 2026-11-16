"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { getStoredAuth, getCookie, RoleAssignment } from "./cookies";
import { refreshAccessToken } from "./api-auth";

export type RoleType =
  | "SUPER_ADMIN"
  | "SYSTEM_ADMIN"
  | "SYSTEM_SUPPORT"
  | "ORGANISATION_ADMIN"
  | "CARE_HOME_MANAGER"
  | "CAREGIVER"
  | "RESIDENT"
  | string;

export interface UserProfile {
  name: string;
  email: string;
  role: RoleType;
  roleTitle: string;
  roleTier: string;
  organisationName: string;
  careHomeName: string;
  avatarInitials: string;
  userPublicId?: string;
  organisationPublicId?: string;
  assignedRoom?: string;
  shiftBadge?: string;
}

export const ROLE_LABELS: Record<string, { title: string; tier: string }> = {
  SUPER_ADMIN: {
    title: "Platform Super Administrator",
    tier: "Platform Level",
  },
  SYSTEM_ADMIN: {
    title: "System Administrator",
    tier: "Platform Level",
  },
  SYSTEM_SUPPORT: {
    title: "System Support",
    tier: "Platform Level",
  },
  ORGANISATION_ADMIN: {
    title: "Organisation Administrator",
    tier: "Organisation Level",
  },
  CARE_HOME_MANAGER: {
    title: "Care Home Manager",
    tier: "Facility Level",
  },
  CAREGIVER: {
    title: "Frontline Caregiver",
    tier: "Care Delivery Level",
  },
  RESIDENT: {
    title: "Resident / Family Member",
    tier: "Resident Level",
  },
};

export const ROLE_PROFILES: Record<
  string,
  {
    name: string;
    email: string;
    role: string;
    roleTitle: string;
    roleTier: string;
    organisationName: string;
    careHomeName: string;
    avatarInitials: string;
  }
> = {
  SUPER_ADMIN: {
    name: "Platform Super Administrator",
    email: "superadmin@carerloop.platform",
    role: "SUPER_ADMIN",
    roleTitle: "Platform Super Administrator",
    roleTier: "Platform Level",
    organisationName: "CarerLoop Platform",
    careHomeName: "All Facilities",
    avatarInitials: "SA",
  },
  SYSTEM_ADMIN: {
    name: "System Administrator",
    email: "sysadmin@carerloop.platform",
    role: "SYSTEM_ADMIN",
    roleTitle: "System Administrator",
    roleTier: "Platform Level",
    organisationName: "CarerLoop Platform",
    careHomeName: "Assigned Facilities",
    avatarInitials: "SY",
  },
  SYSTEM_SUPPORT: {
    name: "System Support",
    email: "support@carerloop.platform",
    role: "SYSTEM_SUPPORT",
    roleTitle: "System Support",
    roleTier: "Platform Level",
    organisationName: "CarerLoop Support",
    careHomeName: "Support Helpdesk",
    avatarInitials: "SS",
  },
  ORGANISATION_ADMIN: {
    name: "Organisation Administrator",
    email: "admin@careorganisation.co.uk",
    role: "ORGANISATION_ADMIN",
    roleTitle: "Organisation Administrator",
    roleTier: "Organisation Level",
    organisationName: "Care Services Group",
    careHomeName: "All Group Homes",
    avatarInitials: "OA",
  },
  CARE_HOME_MANAGER: {
    name: "Care Home Manager",
    email: "manager@carehome.co.uk",
    role: "CARE_HOME_MANAGER",
    roleTitle: "Care Home Manager",
    roleTier: "Facility Level",
    organisationName: "Care Services Group",
    careHomeName: "Primary Residential Home",
    avatarInitials: "CM",
  },
  CAREGIVER: {
    name: "Frontline Caregiver",
    email: "caregiver@carehome.co.uk",
    role: "CAREGIVER",
    roleTitle: "Frontline Caregiver",
    roleTier: "Care Delivery Level",
    organisationName: "Care Services Group",
    careHomeName: "Primary Residential Home",
    avatarInitials: "CG",
  },
  RESIDENT: {
    name: "Resident / Family Member",
    email: "resident@example.co.uk",
    role: "RESIDENT",
    roleTitle: "Resident / Family Member",
    roleTier: "Resident Level",
    organisationName: "Care Services Group",
    careHomeName: "Primary Residential Home",
    avatarInitials: "RF",
  },
};

interface RoleContextType {
  currentRole: RoleType;
  setCurrentRole: (role: RoleType) => void;
  roles: string[];
  roleAssignments: RoleAssignment[];
  user: UserProfile;
  activeCareHome: string;
  setActiveCareHome: (home: string) => void;
  availableCareHomes: string[];
  isAuthenticated: boolean;
  setAuthSession: (data: any) => void;
  clearAuthSession: () => void;
  loginAs?: (role: RoleType) => void;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: ReactNode }) {
  const [currentRole, setCurrentRole] = useState<RoleType>("CARE_HOME_MANAGER");
  const [roles, setRoles] = useState<string[]>(["CARE_HOME_MANAGER"]);
  const [roleAssignments, setRoleAssignments] = useState<RoleAssignment[]>([]);
  const [activeCareHome, setActiveCareHome] = useState("Meadow View Lodge");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: "Care Team Member",
    email: "user@carerloop.platform",
    role: "CARE_HOME_MANAGER",
    roleTitle: "Care Home Manager",
    roleTier: "Facility Level",
    organisationName: "Care Organisation",
    careHomeName: "Care Facility",
    avatarInitials: "CT",
  });

  // Sync auth state from stored cookies on mount
  const syncFromCookies = () => {
    const auth = getStoredAuth();
    if (auth.accessToken && auth.user) {
      setIsAuthenticated(true);
      const userRoles = auth.roles.length > 0 ? auth.roles : ["CARE_HOME_MANAGER"];
      setRoles(userRoles);

      // Default role to first in list or active assignment
      const primaryRole =
        auth.roleAssignments[0]?.role || userRoles[0] || "CARE_HOME_MANAGER";
      setCurrentRole(primaryRole);

      setRoleAssignments(auth.roleAssignments);

      const orgName =
        auth.roleAssignments[0]?.organisationName || "Care Organisation";
      const homeName =
        auth.roleAssignments[0]?.careHomeName || "Primary Facility";
      setActiveCareHome(homeName);

      const fullName =
        `${auth.user.firstName || ""} ${auth.user.lastName || ""}`.trim() ||
        auth.user.email;
      const initials = (
        (auth.user.firstName?.[0] || "") + (auth.user.lastName?.[0] || "")
      ).toUpperCase() || "CL";

      const meta = ROLE_LABELS[primaryRole] || {
        title: primaryRole.replace(/_/g, " "),
        tier: "Assigned Level",
      };

      setUserProfile({
        name: fullName,
        email: auth.user.email,
        role: primaryRole,
        roleTitle: meta.title,
        roleTier: meta.tier,
        organisationName: orgName,
        careHomeName: homeName,
        avatarInitials: initials,
        userPublicId: auth.userPublicId || undefined,
        organisationPublicId: auth.organisationPublicId || undefined,
      });
    } else {
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    syncFromCookies();
  }, []);

  // Proactive background token refresh & tab visibility focus check
  useEffect(() => {
    if (!isAuthenticated) return;

    // Refresh every 10 minutes (backend access token expires in 15 minutes / 900s)
    const interval = setInterval(() => {
      const rt = getCookie("refreshToken");
      if (rt) {
        refreshAccessToken().catch(() => {});
      }
    }, 10 * 60 * 1000);

    // Refresh on tab visibility return if nearing or past expiry
    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        const rt = getCookie("refreshToken");
        const expiresAt = Number(getCookie("tokenExpiresAt") || 0);
        if (rt && expiresAt && Date.now() > expiresAt - 2 * 60 * 1000) {
          refreshAccessToken().catch(() => {});
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [isAuthenticated]);

  const handleSetRole = (role: RoleType) => {
    setCurrentRole(role);
    const meta = ROLE_LABELS[role] || {
      title: role.replace(/_/g, " "),
      tier: "Assigned Level",
    };
    setUserProfile((prev) => ({
      ...prev,
      role,
      roleTitle: meta.title,
      roleTier: meta.tier,
    }));
  };

  const setAuthSession = (data: any) => {
    if (!data) return;
    setIsAuthenticated(true);
    const userRoles = data.roles || [];
    setRoles(userRoles);

    const primaryRole =
      data.roleAssignments?.[0]?.role || userRoles[0] || "CARE_HOME_MANAGER";
    setCurrentRole(primaryRole);

    const assignments = data.roleAssignments || [];
    setRoleAssignments(assignments);

    const orgName = assignments[0]?.organisationName || "Care Organisation";
    const homeName = assignments[0]?.careHomeName || "Primary Facility";
    setActiveCareHome(homeName);

    const fullName = `${data.firstName || ""} ${data.lastName || ""}`.trim() || data.email;
    const initials = (
      (data.firstName?.[0] || "") + (data.lastName?.[0] || "")
    ).toUpperCase() || "CL";

    const meta = ROLE_LABELS[primaryRole] || {
      title: primaryRole.replace(/_/g, " "),
      tier: "Assigned Level",
    };

    setUserProfile({
      name: fullName,
      email: data.email,
      role: primaryRole,
      roleTitle: meta.title,
      roleTier: meta.tier,
      organisationName: orgName,
      careHomeName: homeName,
      avatarInitials: initials,
      userPublicId: data.userPublicId,
      organisationPublicId: data.organisationPublicId,
    });
  };

  const clearAuthSession = () => {
    setIsAuthenticated(false);
    setRoles([]);
    setRoleAssignments([]);
    setUserProfile({
      name: "Guest",
      email: "",
      role: "RESIDENT",
      roleTitle: "Resident / Family Member",
      roleTier: "Public",
      organisationName: "",
      careHomeName: "",
      avatarInitials: "G",
    });
  };

  const availableCareHomes =
    roleAssignments.length > 0
      ? Array.from(
          new Set(
            roleAssignments
              .map((a) => a.careHomeName)
              .filter((name): name is string => Boolean(name))
          )
        )
      : [activeCareHome];

  return (
    <RoleContext.Provider
      value={{
        currentRole,
        setCurrentRole: handleSetRole,
        roles,
        roleAssignments,
        user: userProfile,
        activeCareHome,
        setActiveCareHome,
        availableCareHomes,
        isAuthenticated,
        setAuthSession,
        clearAuthSession,
      }}
    >
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error("useRole must be used within a RoleProvider");
  }
  return context;
}
