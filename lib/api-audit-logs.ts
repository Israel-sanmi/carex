import { request } from "./api-auth";

export interface AuditLogItem {
  publicId: string;
  organisationId?: number;
  careHomeId?: number;
  actorUserId?: number;
  action: string;
  entityType: string;
  entityPublicId?: string;
  details?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}

export interface AuditLogPageData {
  content: AuditLogItem[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first?: boolean;
  last?: boolean;
}

export interface AuditLogsQueryParams {
  page?: number;
  size?: number;
  action?: string;
  entityType?: string;
  entityPublicId?: string;
  actorUserPublicId?: string;
  fromDate?: string;
  toDate?: string;
}

export const auditLogsApi = {
  /**
   * GET /api/v1/audit-logs
   */
  getAuditLogs: async (
    params: AuditLogsQueryParams = {}
  ): Promise<AuditLogPageData> => {
    const searchParams = new URLSearchParams();
    if (params.page !== undefined) searchParams.set("page", params.page.toString());
    if (params.size !== undefined) searchParams.set("size", params.size.toString());
    if (params.action) searchParams.set("action", params.action);
    if (params.entityType) searchParams.set("entityType", params.entityType);
    if (params.entityPublicId) searchParams.set("entityPublicId", params.entityPublicId);
    if (params.actorUserPublicId)
      searchParams.set("actorUserPublicId", params.actorUserPublicId);
    if (params.fromDate) searchParams.set("fromDate", params.fromDate);
    if (params.toDate) searchParams.set("toDate", params.toDate);

    const qs = searchParams.toString();
    const url = `/api/v1/audit-logs${qs ? `?${qs}` : ""}`;
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
      first: payload?.first ?? true,
      last: payload?.last ?? true,
    };
  },

  /**
   * GET /api/v1/audit-logs/{publicId}
   */
  getAuditLog: async (publicId: string): Promise<AuditLogItem> => {
    const res = await request<any>(`/api/v1/audit-logs/${publicId}`);
    return res?.data ?? res;
  },
};
