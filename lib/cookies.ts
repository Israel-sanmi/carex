"use client";

export interface RoleAssignment {
  role: string;
  organisationPublicId?: string;
  organisationName?: string;
  careHomePublicId?: string;
  careHomeName?: string;
}

export interface AuthUserInfo {
  userPublicId: string;
  firstName: string;
  lastName: string;
  email: string;
  organisationPublicId?: string;
  roles: string[];
  roleAssignments?: RoleAssignment[];
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  tokenType?: string;
  expiresAt?: string;
}

/**
 * Universal cookie getters and setters for the browser
 */
export function setCookie(name: string, value: string, days = 7) {
  if (typeof document === "undefined") return;
  const maxAge = days * 24 * 60 * 60;
  document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

export function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const cookies = document.cookie ? document.cookie.split("; ") : [];
  for (const cookie of cookies) {
    const [k, v] = cookie.split("=");
    if (decodeURIComponent(k) === name) {
      return decodeURIComponent(v || "");
    }
  }
  return null;
}

export function deleteCookie(name: string) {
  if (typeof document === "undefined") return;
  document.cookie = `${encodeURIComponent(name)}=; path=/; max-age=0; SameSite=Lax`;
}

/**
 * Save auth payload in cookies as requested:
 * organisationPublicId, accessToken, refreshToken, userPublicId, roles, roleAssignments
 */
export function setAuthCookies(data: {
  accessToken: string;
  refreshToken: string;
  userPublicId: string;
  organisationPublicId?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  roles?: string[];
  roleAssignments?: RoleAssignment[];
  expiresIn?: number;
}) {
  const days = 7;
  setCookie("accessToken", data.accessToken, days);
  setCookie("refreshToken", data.refreshToken, 30);
  setCookie("userPublicId", data.userPublicId, days);

  if (data.organisationPublicId) {
    setCookie("organisationPublicId", data.organisationPublicId, days);
  } else {
    deleteCookie("organisationPublicId");
  }

  if (data.roles && data.roles.length > 0) {
    setCookie("roles", JSON.stringify(data.roles), days);
  }

  if (data.roleAssignments && data.roleAssignments.length > 0) {
    setCookie("roleAssignments", JSON.stringify(data.roleAssignments), days);
  } else {
    deleteCookie("roleAssignments");
  }

  // Store user summary
  const userSummary = {
    userPublicId: data.userPublicId,
    firstName: data.firstName || "",
    lastName: data.lastName || "",
    email: data.email || "",
  };
  setCookie("user", JSON.stringify(userSummary), days);

  if (data.expiresIn) {
    const expiresAtMs = Date.now() + data.expiresIn * 1000;
    setCookie("tokenExpiresAt", expiresAtMs.toString(), days);
  }
}

/**
 * Read stored auth data from cookies
 */
export function getStoredAuth(): {
  accessToken: string | null;
  refreshToken: string | null;
  userPublicId: string | null;
  organisationPublicId: string | null;
  roles: string[];
  roleAssignments: RoleAssignment[];
  user: {
    userPublicId: string;
    firstName: string;
    lastName: string;
    email: string;
  } | null;
} {
  const accessToken = getCookie("accessToken");
  const refreshToken = getCookie("refreshToken");
  const userPublicId = getCookie("userPublicId");
  const organisationPublicId = getCookie("organisationPublicId");

  let roles: string[] = [];
  const rolesRaw = getCookie("roles");
  if (rolesRaw) {
    try {
      roles = JSON.parse(rolesRaw);
    } catch {
      roles = [rolesRaw];
    }
  }

  let roleAssignments: RoleAssignment[] = [];
  const assignmentsRaw = getCookie("roleAssignments");
  if (assignmentsRaw) {
    try {
      roleAssignments = JSON.parse(assignmentsRaw);
    } catch {
      roleAssignments = [];
    }
  }

  let user = null;
  const userRaw = getCookie("user");
  if (userRaw) {
    try {
      user = JSON.parse(userRaw);
    } catch {
      user = null;
    }
  }

  return {
    accessToken,
    refreshToken,
    userPublicId,
    organisationPublicId,
    roles,
    roleAssignments,
    user,
  };
}

/**
 * Clear all auth cookies upon sign out
 */
export function clearAuthCookies() {
  deleteCookie("accessToken");
  deleteCookie("refreshToken");
  deleteCookie("tokenExpiresAt");
  deleteCookie("userPublicId");
  deleteCookie("organisationPublicId");
  deleteCookie("roles");
  deleteCookie("roleAssignments");
  deleteCookie("user");
}
