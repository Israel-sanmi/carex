import { request } from "./api-auth";

export type OrganisationStatus = "PENDING" | "ACTIVE" | "SUSPENDED" | "INACTIVE";

export interface OrganisationItem {
  publicId: string;
  name: string;
  email: string;
  phone?: string;
  website?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  status: OrganisationStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  status: number;
  message: string;
  data: T;
  errors?: Record<string, any>;
  timestamp?: string;
}

export interface PaginatedData<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

export interface CreateOrganisationPayload {
  name: string;
  email: string;
  phone?: string;
  website?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
}

export type UpdateOrganisationPayload = Partial<CreateOrganisationPayload>;

export const organisationsApi = {
  /**
   * GET /api/v1/organisations
   */
  getOrganisations: async ({
    page = 0,
    size = 20,
    search = "",
    status,
  }: {
    page?: number;
    size?: number;
    search?: string;
    status?: OrganisationStatus | "";
  } = {}): Promise<PaginatedData<OrganisationItem>> => {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });
    if (search && search.trim()) {
      params.append("search", search.trim());
    }
    if (status) {
      params.append("status", status);
    }

    const res = await request<any>(
      `/api/v1/organisations?${params.toString()}`
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
   * POST /api/v1/organisations
   */
  createOrganisation: async (
    payload: CreateOrganisationPayload
  ): Promise<OrganisationItem> => {
    const res = await request<ApiResponse<OrganisationItem>>(
      `/api/v1/organisations`,
      {
        method: "POST",
        body: JSON.stringify(payload),
      }
    );
    return res.data;
  },

  /**
   * GET /api/v1/organisations/{publicId}
   */
  getOrganisation: async (publicId: string): Promise<OrganisationItem> => {
    const res = await request<ApiResponse<OrganisationItem>>(
      `/api/v1/organisations/${publicId}`
    );
    return res.data;
  },

  /**
   * PATCH /api/v1/organisations/{publicId}
   */
  updateOrganisation: async (
    publicId: string,
    payload: UpdateOrganisationPayload
  ): Promise<OrganisationItem> => {
    const res = await request<ApiResponse<OrganisationItem>>(
      `/api/v1/organisations/${publicId}`,
      {
        method: "PATCH",
        body: JSON.stringify(payload),
      }
    );
    return res.data;
  },

  /**
   * PATCH /api/v1/organisations/{publicId}/status
   */
  updateOrganisationStatus: async (
    publicId: string,
    status: OrganisationStatus
  ): Promise<OrganisationItem> => {
    const res = await request<ApiResponse<OrganisationItem>>(
      `/api/v1/organisations/${publicId}/status`,
      {
        method: "PATCH",
        body: JSON.stringify({ status }),
      }
    );
    return res.data;
  },
};
