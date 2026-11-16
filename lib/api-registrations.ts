import { request } from "./api-auth";

export type ResidentOnboardingStatus =
  | "PENDING_VERIFICATION"
  | "VERIFIED"
  | "PLACED"
  | "REJECTED";

export interface ResidentRegistrationItem {
  publicId: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  phone?: string;
  dateOfBirth: string;
  gender: string;
  address?: string;
  onboardingStatus: ResidentOnboardingStatus;
  registrationSource: string;
  rejectionReason?: string;
}

export interface PageResponse<T> {
  content: T[];
  pageNumber: number;
  offset: number;
  size: number;
  empty: boolean;
  numberOfElements: number;
  totalSize: number;
  totalPages: number;
}

export interface AdmitResidentPayload {
  organisationPublicId: string;
  careHomePublicId: string;
  admissionDate: string;
}

export interface RejectResidentPayload {
  reason: string;
}

export const adminRegistrationsApi = {
  /**
   * GET /api/v1/admin/resident-registrations
   */
  getRegistrations: async ({
    status = "PENDING_VERIFICATION",
    page = 0,
    size = 20,
  }: {
    status: ResidentOnboardingStatus;
    page?: number;
    size?: number;
  }): Promise<PageResponse<ResidentRegistrationItem>> => {
    const params = new URLSearchParams({
      status,
      page: page.toString(),
      size: size.toString(),
    });
    return request<PageResponse<ResidentRegistrationItem>>(
      `/api/v1/admin/resident-registrations?${params.toString()}`
    );
  },

  /**
   * POST /api/v1/admin/resident-registrations/{residentPublicId}/admit
   */
  admitResident: async (
    residentPublicId: string,
    payload: AdmitResidentPayload
  ): Promise<ResidentRegistrationItem> => {
    return request<ResidentRegistrationItem>(
      `/api/v1/admin/resident-registrations/${residentPublicId}/admit`,
      {
        method: "POST",
        body: JSON.stringify(payload),
      }
    );
  },

  /**
   * POST /api/v1/admin/resident-registrations/{residentPublicId}/reject
   */
  rejectResident: async (
    residentPublicId: string,
    payload: RejectResidentPayload
  ): Promise<ResidentRegistrationItem> => {
    return request<ResidentRegistrationItem>(
      `/api/v1/admin/resident-registrations/${residentPublicId}/reject`,
      {
        method: "POST",
        body: JSON.stringify(payload),
      }
    );
  },
};
