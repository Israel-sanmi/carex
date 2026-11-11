"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type RoleType = 
  | "SUPER_ADMIN" 
  | "ORGANISATION_ADMIN" 
  | "CARE_HOME_MANAGER" 
  | "CAREGIVER" 
  | "RESIDENT";

export interface UserProfile {
  name: string;
  email: string;
  role: RoleType;
  roleTitle: string;
  roleTier: string;
  organisationName: string;
  careHomeName: string;
  avatarInitials: string;
  assignedRoom?: string;
  shiftBadge?: string;
}

export const ROLE_PROFILES: Record<RoleType, UserProfile> = {
  SUPER_ADMIN: {
    name: "Victoria Sterling",
    email: "v.sterling@carerloop.platform",
    role: "SUPER_ADMIN",
    roleTitle: "Platform Super Administrator",
    roleTier: "Platform Level",
    organisationName: "CarerLoop Platform Operations",
    careHomeName: "All Organisations & Facilities",
    avatarInitials: "VS",
  },
  ORGANISATION_ADMIN: {
    name: "Dr. Alistair Finch",
    email: "a.finch@stjudecare.co.uk",
    role: "ORGANISATION_ADMIN",
    roleTitle: "Executive Organisation Administrator",
    roleTier: "Organisation Level",
    organisationName: "St. Jude Care Services Group",
    careHomeName: "Group Operations (4 Facilities)",
    avatarInitials: "AF",
  },
  CARE_HOME_MANAGER: {
    name: "Sarah Jenkins, RN",
    email: "s.jenkins@meadowview.co.uk",
    role: "CARE_HOME_MANAGER",
    roleTitle: "Registered Care Home Manager",
    roleTier: "Facility Level",
    organisationName: "St. Jude Care Services Group",
    careHomeName: "Meadow View Lodge",
    avatarInitials: "SJ",
    shiftBadge: "On Duty • West Wing Lead",
  },
  CAREGIVER: {
    name: "Marcus Cole",
    email: "m.cole@meadowview.co.uk",
    role: "CAREGIVER",
    roleTitle: "Senior Caregiver / Nurse",
    roleTier: "Care Delivery Level",
    organisationName: "St. Jude Care Services Group",
    careHomeName: "Meadow View Lodge",
    avatarInitials: "MC",
    shiftBadge: "Shift A • Rooms 10A-22C",
  },
  RESIDENT: {
    name: "Eleanor Vance",
    email: "e.vance@example.co.uk",
    role: "RESIDENT",
    roleTitle: "Resident / Next-of-Kin Portal",
    roleTier: "Resident Level",
    organisationName: "St. Jude Care Services Group",
    careHomeName: "Meadow View Lodge",
    avatarInitials: "EV",
    assignedRoom: "Room 14B",
  },
};

interface RoleContextType {
  currentRole: RoleType;
  setCurrentRole: (role: RoleType) => void;
  user: UserProfile;
  activeCareHome: string;
  setActiveCareHome: (home: string) => void;
  availableCareHomes: string[];
  loginAs: (role: RoleType) => void;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: ReactNode }) {
  const [currentRole, setCurrentRole] = useState<RoleType>("CARE_HOME_MANAGER");
  const [activeCareHome, setActiveCareHome] = useState("Meadow View Lodge");

  // Load from localStorage on client mount if available
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedRole = localStorage.getItem("carerloop_role") as RoleType;
      if (savedRole && ROLE_PROFILES[savedRole]) {
        setCurrentRole(savedRole);
      }
    }
  }, []);

  const handleSetRole = (role: RoleType) => {
    setCurrentRole(role);
    if (typeof window !== "undefined") {
      localStorage.setItem("carerloop_role", role);
    }
  };

  const loginAs = (role: RoleType) => {
    handleSetRole(role);
  };

  const user = ROLE_PROFILES[currentRole];

  const availableCareHomes = [
    "Meadow View Lodge (48 Beds)",
    "Oakridge Manor (36 Beds)",
    "Willow Creek Court (30 Beds)",
    "Highland Pines (52 Beds)",
  ];

  return (
    <RoleContext.Provider
      value={{
        currentRole,
        setCurrentRole: handleSetRole,
        user,
        activeCareHome,
        setActiveCareHome,
        availableCareHomes,
        loginAs,
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
