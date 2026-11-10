"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export type RoleType = 
  | "SUPER_ADMIN" 
  | "ORGANISATION_ADMIN" 
  | "CARE_HOME_MANAGER" 
  | "CAREGIVER" 
  | "RESIDENT";

interface RoleContextType {
  currentRole: RoleType;
  setCurrentRole: (role: RoleType) => void;
  organisationName: string;
  careHomeName: string;
  setCareHomeName: (name: string) => void;
  userName: string;
  userEmail: string;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: ReactNode }) {
  const [currentRole, setCurrentRole] = useState<RoleType>("CARE_HOME_MANAGER");
  const [careHomeName, setCareHomeName] = useState("Meadow View Lodge");
  const organisationName = "St. Jude Care Services Group";
  const userName = "Sarah Jenkins, RN";
  const userEmail = "s.jenkins@meadowview.co.uk";

  return (
    <RoleContext.Provider
      value={{
        currentRole,
        setCurrentRole,
        organisationName,
        careHomeName,
        setCareHomeName,
        userName,
        userEmail,
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

