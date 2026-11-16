import { request } from "./api-auth";
import { ApiResponse, PaginatedData } from "./api-organisations";

export type CareHomeStatus = "PENDING" | "ACTIVE" | "SUSPENDED" | "INACTIVE" | string;

export interface CareHomeItem {
  publicId: string;
  organisationPublicId: string;
  organisationName?: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  status: CareHomeStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCareHomePayload {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
}

export type UpdateCareHomePayload = Partial<CreateCareHomePayload>;

export const careHomesApi = {
  /**
   * GET /api/v1/care-homes/me
   */
  getMyCareHomes: async (): Promise<CareHomeItem[]> => {
    const res = await request<ApiResponse<CareHomeItem[]>>(`/api/v1/care-homes/me`);
    return res.data || [];
  },

  /**
   * GET /api/v1/organisations/{organisationPublicId}/care-homes
   */
  getCareHomesByOrganisation: async (
    organisationPublicId: string,
    {
      page = 0,
      size = 20,
    }: {
      page?: number;
      size?: number;
    } = {}
  ): Promise<PaginatedData<CareHomeItem>> => {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });
    const res = await request<any>(
      `/api/v1/organisations/${organisationPublicId}/care-homes?${params.toString()}`
    );

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
   * POST /api/v1/organisations/{organisationPublicId}/care-homes
   */
  createCareHome: async (
    organisationPublicId: string,
    payload: CreateCareHomePayload
  ): Promise<CareHomeItem> => {
    const res = await request<ApiResponse<CareHomeItem>>(
      `/api/v1/organisations/${organisationPublicId}/care-homes`,
      {
        method: "POST",
        body: JSON.stringify(payload),
      }
    );
    return res.data;
  },

  /**
   * GET /api/v1/organisations/{organisationPublicId}/care-homes/{careHomePublicId}
   */
  getCareHome: async (
    organisationPublicId: string,
    careHomePublicId: string
  ): Promise<CareHomeItem> => {
    const res = await request<ApiResponse<CareHomeItem>>(
      `/api/v1/organisations/${organisationPublicId}/care-homes/${careHomePublicId}`
    );
    return res.data;
  },

  /**
   * PATCH /api/v1/organisations/{organisationPublicId}/care-homes/{careHomePublicId}
   */
  updateCareHome: async (
    organisationPublicId: string,
    careHomePublicId: string,
    payload: UpdateCareHomePayload
  ): Promise<CareHomeItem> => {
    const res = await request<ApiResponse<CareHomeItem>>(
      `/api/v1/organisations/${organisationPublicId}/care-homes/${careHomePublicId}`,
      {
        method: "PATCH",
        body: JSON.stringify(payload),
      }
    );
    return res.data;
  },

  /**
   * PATCH /api/v1/organisations/{organisationPublicId}/care-homes/{careHomePublicId}/status
   */
  updateCareHomeStatus: async (
    organisationPublicId: string,
    careHomePublicId: string,
    status: CareHomeStatus
  ): Promise<CareHomeItem> => {
    const res = await request<ApiResponse<CareHomeItem>>(
      `/api/v1/organisations/${organisationPublicId}/care-homes/${careHomePublicId}/status`,
      {
        method: "PATCH",
        body: JSON.stringify({ status }),
      }
    );
    return res.data;
  },
};
