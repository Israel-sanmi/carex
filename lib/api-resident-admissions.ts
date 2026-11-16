import { request } from "./api-auth";

export type AdmissionStatus = "PENDING" | "APPROVED" | "REJECTED" | string;

export interface OrganisationSummary {
  id?: number;
  publicId: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  website?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  status?: string;
  systemDefault?: boolean;
}

export interface CareHomeSummary {
  id?: number;
  publicId: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  status?: string;
  systemDefault?: boolean;
  organisation?: OrganisationSummary;
}

export interface ResidentUserSummary {
  id?: number;
  publicId: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  phone?: string;
  status?: string;
  emailVerified?: boolean;
  organisation?: OrganisationSummary;
}

export interface ResidentDetails {
  id?: number;
  publicId: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  dateOfBirth?: string;
  gender?: string;
  email?: string;
  phone?: string;
  address?: string;
  admissionDate?: string;
  status?: string;
  rejectionReason?: string;
  medicalNotes?: string;
  onboardingStatus?: string;
  registrationSource?: string;
  registrationReferenceHash?: string;
  organisation?: OrganisationSummary;
  user?: ResidentUserSummary;
}

export interface ReviewerSummary {
  id?: number;
  publicId: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  status?: string;
  organisation?: OrganisationSummary;
}

export interface ResidentAdmission {
  id?: number;
  publicId: string;
  createdAt: string;
  updatedAt?: string;
  status: AdmissionStatus;
  resident: ResidentDetails;
  invitation?: any;
  sourceOrganisation?: OrganisationSummary;
  sourceCareHome?: CareHomeSummary;
  destinationOrganisation?: OrganisationSummary;
  destinationCareHome?: CareHomeSummary;
  reviewedAt?: string;
  reviewedBy?: ReviewerSummary;
  rejectionReason?: string;
  transferReason?: string;
}

export interface ResidentAdmissionsPageResponse {
  content: ResidentAdmission[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface RejectAdmissionPayload {
  reason: string;
}

export const residentAdmissionsApi = {
  /**
   * GET /api/v1/resident-admissions
   * Query params: page, size, status (PENDING, APPROVED, REJECTED)
   */
  getAdmissions: async ({
    page = 0,
    size = 20,
    status = "PENDING",
  }: {
    page?: number;
    size?: number;
    status?: string;
  }): Promise<ResidentAdmissionsPageResponse> => {
    const params = new URLSearchParams();
    params.set("page", page.toString());
    params.set("size", size.toString());
    if (status) {
      params.set("status", status.toUpperCase());
    }

    const res = await request<any>(
      `/api/v1/resident-admissions?${params.toString()}`
    );

    // Normalize response if nested under data
    const data = res?.data ?? res ?? {};
    return {
      content: Array.isArray(data?.content) ? data.content : [],
      page: typeof data?.page === "number" ? data.page : page,
      size: typeof data?.size === "number" ? data.size : size,
      totalElements:
        typeof data?.totalElements === "number"
          ? data.totalElements
          : Array.isArray(data?.content)
          ? data.content.length
          : 0,
      totalPages: typeof data?.totalPages === "number" ? data.totalPages : 1,
    };
  },

  /**
   * GET /api/v1/resident-admissions/{publicId}
   */
  getAdmission: async (publicId: string): Promise<ResidentAdmission> => {
    const res = await request<any>(`/api/v1/resident-admissions/${publicId}`);
    return res?.data ?? res;
  },

  /**
   * POST /api/v1/resident-admissions/{publicId}/approve
   */
  approveAdmission: async (publicId: string): Promise<ResidentAdmission> => {
    const res = await request<any>(
      `/api/v1/resident-admissions/${publicId}/approve`,
      {
        method: "POST",
      }
    );
    return res?.data ?? res ?? {};
  },

  /**
   * POST /api/v1/resident-admissions/{publicId}/reject
   */
  rejectAdmission: async (
    publicId: string,
    payload: RejectAdmissionPayload
  ): Promise<ResidentAdmission> => {
    const res = await request<any>(
      `/api/v1/resident-admissions/${publicId}/reject`,
      {
        method: "POST",
        body: JSON.stringify(payload),
      }
    );
    return res?.data ?? res ?? {};
  },
};
