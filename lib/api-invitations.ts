import { request } from "./api-auth";
import { ApiResponse, PaginatedData } from "./api-organisations";

export type InvitationStatus =
  | "PENDING"
  | "ACCEPTED"
  | "VERIFIED"
  | "REJECTED"
  | "EXPIRED"
  | "REVOKED";

export type InvitationRole =
  | "SUPER_ADMIN"
  | "SYSTEM_ADMIN"
  | "SYSTEM_SUPPORT"
  | "ORGANISATION_ADMIN"
  | "ORGANISATION_SUPPORT"
  | "CARE_HOME_ADMIN"
  | "CARE_HOME_MANAGER"
  | "CAREGIVER"
  | "RESIDENT";

export interface InvitationItem {
  publicId: string;
  email: string;
  role: InvitationRole | string;
  status: InvitationStatus | string;
  organisationPublicId?: string;
  organisationName?: string;
  careHomePublicId?: string;
  careHomeName?: string;
  expiresAt: string;
  acceptedAt?: string;
  revokedAt?: string;
  createdAt: string;
}

export interface CreateInvitationPayload {
  email: string;
  role: InvitationRole | string;
  organisationPublicId?: string;
  careHomePublicId?: string;
  registrationReference?: string;
}

export interface CreateInvitationResponse {
  invitationPublicId: string;
  email: string;
  role: string;
  status: string;
  expiresAt: string;
  message?: string;
}

export interface AcceptInvitationPayload {
  token: string;
  password: string;
  firstName: string;
  middleName?: string;
  lastName: string;
}

export interface AcceptInvitationResponse {
  userPublicId: string;
  invitationPublicId: string;
  email: string;
  role: string;
  message?: string;
}

export const invitationsApi = {
  /**
   * GET /api/v1/invitations
   */
  getInvitations: async ({
    page = 0,
    size = 20,
    status,
    role,
  }: {
    page?: number;
    size?: number;
    status?: InvitationStatus | "";
    role?: InvitationRole | "";
  } = {}): Promise<PaginatedData<InvitationItem>> => {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });

    if (status) {
      params.append("status", status);
    }
    if (role) {
      params.append("role", role);
    }

    const res = await request<any>(`/api/v1/invitations?${params.toString()}`);

    const pageData =
      res?.data?.content !== undefined
        ? res.data
        : res?.content !== undefined
        ? res
        : res?.data ?? res;

    return {
      content: Array.isArray(pageData?.content)
        ? pageData.content
        : Array.isArray(pageData)
        ? pageData
        : [],
      page: pageData?.page ?? pageData?.pageNumber ?? pageData?.number ?? 0,
      size: pageData?.size ?? size,
      totalElements:
        pageData?.totalElements ??
        pageData?.totalSize ??
        (Array.isArray(pageData?.content) ? pageData.content.length : 0),
      totalPages:
        pageData?.totalPages ??
        (pageData?.totalElements
          ? Math.ceil(pageData.totalElements / size)
          : 1),
      first: pageData?.first ?? true,
      last: pageData?.last ?? true,
    };
  },

  /**
   * POST /api/v1/invitations
   */
  createInvitation: async (
    payload: CreateInvitationPayload
  ): Promise<CreateInvitationResponse> => {
    const res = await request<any>("/api/v1/invitations", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return res?.data ?? res ?? {};
  },

  /**
   * POST /api/v1/invitations/accept
   */
  acceptInvitation: async (
    payload: AcceptInvitationPayload
  ): Promise<AcceptInvitationResponse> => {
    const res = await request<any>("/api/v1/invitations/accept", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return res?.data ?? res ?? {};
  },

  /**
   * GET /api/v1/invitations/{invitationPublicId}
   */
  getInvitation: async (invitationPublicId: string): Promise<InvitationItem> => {
    const res = await request<any>(`/api/v1/invitations/${invitationPublicId}`);
    return res?.data ?? res;
  },

  /**
   * DELETE /api/v1/invitations/{invitationPublicId}
   */
  revokeInvitation: async (
    invitationPublicId: string
  ): Promise<{ message?: string; success?: boolean }> => {
    const res = await request<any>(`/api/v1/invitations/${invitationPublicId}`, {
      method: "DELETE",
    });
    return res?.data ?? res ?? {};
  },
};
