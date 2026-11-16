import { useQuery } from "@tanstack/react-query";
import {
  auditLogsApi,
  AuditLogItem,
  AuditLogPageData,
  AuditLogsQueryParams,
} from "../api-audit-logs";

export const AUDIT_LOGS_QUERY_KEY = ["audit-logs"];

export function useAuditLogs(
  params: AuditLogsQueryParams = {},
  options?: { enabled?: boolean }
) {
  return useQuery<AuditLogPageData>({
    queryKey: [
      ...AUDIT_LOGS_QUERY_KEY,
      params.page ?? 0,
      params.size ?? 20,
      params.action ?? "",
      params.entityType ?? "",
      params.entityPublicId ?? "",
      params.actorUserPublicId ?? "",
      params.fromDate ?? "",
      params.toDate ?? "",
    ],
    queryFn: () => auditLogsApi.getAuditLogs(params),
    enabled: options?.enabled ?? true,
  });
}

export function useAuditLog(
  publicId?: string | null,
  options?: { enabled?: boolean }
) {
  return useQuery<AuditLogItem>({
    queryKey: [...AUDIT_LOGS_QUERY_KEY, "detail", publicId],
    queryFn: () => auditLogsApi.getAuditLog(publicId!),
    enabled: !!publicId && (options?.enabled ?? true),
  });
}
