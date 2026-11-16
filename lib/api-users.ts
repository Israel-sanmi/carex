import { request } from "./api-auth";

export type UserStatus = "ACTIVE" | "INACTIVE" | "PENDING" | "SUSPENDED" | string;

export type UserRole =
  | "SUPER_ADMIN"
  | "SYSTEM_ADMIN"
  | "SYSTEM_SUPPORT"
  | "ORGANISATION_ADMIN"
  | "ORGANISATION_SUPPORT"
  | "CARE_HOME_ADMIN"
  | "CARE_HOME_MANAGER"
  | "CAREGIVER"
  | "RESIDENT"
  | string;

export interface UserItem {
  publicId: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  phone?: string;
  status: UserStatus;
  emailVerified?: boolean;
  organisationPublicId?: string;
  organisationName?: string;
  createdAt?: string;
}

export interface UsersPageData {
  content: UserItem[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface UserUpdatePayload {
  firstName: string;
  middleName?: string;
  lastName: string;
  phone?: string;
}

export interface UserRoleAssignment {
  assignmentPublicId: string;
  role: UserRole;
  organisationPublicId?: string;
  organisationName?: string;
  careHomePublicId?: string;
  careHomeName?: string;
  assignedAt?: string;
  revokedAt?: string;
}

export interface AssignRolePayload {
  role: UserRole;
  organisationPublicId?: string;
  careHomePublicId?: string;
}

export interface UpdateRoleStatusPayload {
  status: UserStatus;
}

export const usersApi = {
  /**
   * GET /api/v1/users
   * Query params: search, status, role, page, size
   */
  getUsers: async (
    params: {
      search?: string;
      status?: string;
      role?: string;
      page?: number;
      size?: number;
    } = {}
  ): Promise<UsersPageData> => {
    const searchParams = new URLSearchParams();
    if (params.page !== undefined) searchParams.set("page", params.page.toString());
    if (params.size !== undefined) searchParams.set("size", params.size.toString());
    if (params.search) searchParams.set("search", params.search);
    if (params.status) searchParams.set("status", params.status);
    if (params.role) searchParams.set("role", params.role);

    const qs = searchParams.toString();
    const url = `/api/v1/users${qs ? `?${qs}` : ""}`;
    const res = await request<any>(url);

    const payload = res?.data ?? res ?? {};
    return {
      content: Array.isArray(payload?.content) ? payload.content : [],
      page: typeof payload?.page === "number" ? payload.page : params.page ?? 0,
      size: typeof payload?.size === "number" ? payload.size : params.size ?? 20,
      totalElements:
        typeof payload?.totalElements === "number"
          ? payload.totalElements
          : Array.isArray(payload?.content)
          ? payload.content.length
          : 0,
      totalPages: typeof payload?.totalPages === "number" ? payload.totalPages : 1,
    };
  },

  /**
   * GET /api/v1/users/{publicId}
   */
  getUser: async (publicId: string): Promise<UserItem> => {
    const res = await request<any>(`/api/v1/users/${publicId}`);
    return res?.data ?? res;
  },

  /**
   * PUT /api/v1/users/{publicId}
   */
  updateUser: async (
    publicId: string,
    payload: UserUpdatePayload
  ): Promise<UserItem> => {
    const res = await request<any>(`/api/v1/users/${publicId}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
    return res?.data ?? res;
  },

  /**
   * GET /api/v1/users/{publicId}/roles
   */
  getUserRoles: async (publicId: string): Promise<UserRoleAssignment[]> => {
    const res = await request<any>(`/api/v1/users/${publicId}/roles`);
    const data = res?.data ?? res;
    return Array.isArray(data) ? data : [];
  },

  /**
   * POST /api/v1/users/{publicId}/roles
   */
  assignUserRole: async (
    publicId: string,
    payload: AssignRolePayload
  ): Promise<UserRoleAssignment> => {
    const res = await request<any>(`/api/v1/users/${publicId}/roles`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return res?.data ?? res;
  },

  /**
   * DELETE /api/v1/users/{publicId}/roles/{assignmentPublicId}
   */
  revokeUserRole: async (
    publicId: string,
    assignmentPublicId: string
  ): Promise<void> => {
    await request<any>(
      `/api/v1/users/${publicId}/roles/${assignmentPublicId}`,
      {
        method: "DELETE",
      }
    );
  },

  /**
   * PATCH /api/v1/users/{publicId}/roles/{assignmentPublicId}
   */
  updateUserRoleStatus: async (
    publicId: string,
    assignmentPublicId: string,
    payload: UpdateRoleStatusPayload
  ): Promise<UserItem> => {
    const res = await request<any>(
      `/api/v1/users/${publicId}/roles/${assignmentPublicId}`,
      {
        method: "PATCH",
        body: JSON.stringify(payload),
      }
    );
    return res?.data ?? res;
  },
};
