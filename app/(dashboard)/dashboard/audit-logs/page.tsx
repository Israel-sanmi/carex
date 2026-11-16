"use client";

import { useState } from "react";
import { useRole } from "@/lib/role-context";
import { useAuditLogs } from "@/lib/hooks/use-audit-logs";
import { AuditLogItem } from "@/lib/api-audit-logs";
import { toast } from "@/components/ui/toast";
import {
  FileClock,
  Search,
  Filter,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Download,
  Calendar,
  Eye,
  Copy,
  Check,
  X,
  RefreshCw,
  Server,
  Layers,
  Activity,
  Globe,
  ChevronLeft,
  ChevronRight,
  Database,
} from "lucide-react";

const ALLOWED_ROLES = ["SUPER_ADMIN", "SYSTEM_ADMIN", "ORGANISATION_ADMIN"];

const ENTITY_TYPE_FILTERS = [
  { label: "All Entities", value: "" },
  { label: "Auth & Security", value: "AUTH" },
  { label: "User", value: "USER" },
  { label: "Organisation", value: "ORGANISATION" },
  { label: "Care Home", value: "CARE_HOME" },
  { label: "Resident", value: "RESIDENT" },
  { label: "Admission", value: "RESIDENT_ADMISSION" },
  { label: "Invitation", value: "INVITATION" },
];

function getActionColor(action?: string) {
  if (!action) return "bg-ink/5 text-ink/70 border-ink/10";
  const a = action.toUpperCase();
  if (a.includes("DELETE") || a.includes("REVOKE") || a.includes("REJECT") || a.includes("FAILED")) {
    return "bg-rose-50 text-rose-700 border-rose-200";
  }
  if (a.includes("CREATE") || a.includes("APPROVE") || a.includes("ACCEPT") || a.includes("SUCCESS")) {
    return "bg-emerald-50 text-emerald-700 border-emerald-200";
  }
  if (a.includes("UPDATE") || a.includes("MODIFY") || a.includes("EDIT")) {
    return "bg-amber-50 text-amber-800 border-amber-200";
  }
  return "bg-teal-brand/10 text-teal-deep border-teal-brand/20";
}

export default function AuditLogsPage() {
  const { currentRole, roles } = useRole();

  // Role verification
  const isAuthorized =
    ALLOWED_ROLES.includes(currentRole) ||
    roles.some((r) => ALLOWED_ROLES.includes(r));

  // State
  const [page, setPage] = useState(0);
  const pageSize = 20;
  const [search, setSearch] = useState("");
  const [selectedEntityType, setSelectedEntityType] = useState("");
  const [actionFilter, setActionFilter] = useState("");
  const [selectedLog, setSelectedLog] = useState<AuditLogItem | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Queries
  const { data, isLoading, isError, refetch } = useAuditLogs({
    page,
    size: pageSize,
    entityType: selectedEntityType || undefined,
    action: actionFilter || undefined,
  });

  const logs = data?.content || [];
  const totalElements = data?.totalElements || 0;
  const totalPages = data?.totalPages || 1;

  // Client search filtering
  const filteredLogs = logs.filter((log) => {
    const s = search.toLowerCase();
    const actionMatch = (log.action || "").toLowerCase().includes(s);
    const entityMatch = (log.entityType || "").toLowerCase().includes(s);
    const idMatch = (log.entityPublicId || "").toLowerCase().includes(s);
    const ipMatch = (log.ipAddress || "").toLowerCase().includes(s);
    const uaMatch = (log.userAgent || "").toLowerCase().includes(s);
    const publicIdMatch = (log.publicId || "").toLowerCase().includes(s);

    return actionMatch || entityMatch || idMatch || ipMatch || uaMatch || publicIdMatch;
  });

  const copyToClipboard = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      toast.success("Copied to clipboard");
      setTimeout(() => setCopiedKey(null), 2000);
    } catch {
      toast.error("Failed to copy to clipboard");
    }
  };

  const handleExportCsv = () => {
    if (filteredLogs.length === 0) {
      toast.info("No audit logs to export");
      return;
    }

    const headers = [
      "Public ID",
      "Timestamp",
      "Action",
      "Entity Type",
      "Entity Public ID",
      "Actor User ID",
      "Organisation ID",
      "Care Home ID",
      "IP Address",
      "User Agent",
    ];

    const rows = filteredLogs.map((log) => [
      `"${log.publicId || ""}"`,
      `"${log.createdAt || ""}"`,
      `"${(log.action || "").replace(/"/g, '""')}"`,
      `"${log.entityType || ""}"`,
      `"${log.entityPublicId || ""}"`,
      `"${log.actorUserId ?? ""}"`,
      `"${log.organisationId ?? ""}"`,
      `"${log.careHomeId ?? ""}"`,
      `"${log.ipAddress || ""}"`,
      `"${(log.userAgent || "").replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `carerloop-audit-ledger-${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Audit log export downloaded");
  };

  if (!isAuthorized) {
    return (
      <div className="p-8 rounded-md bg-white border border-ink/10 text-center max-w-xl mx-auto space-y-4 my-12 shadow-xs">
        <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center mx-auto">
          <AlertTriangle className="h-6 w-6" />
        </div>
        <h2 className="text-xl font-bold text-ink font-heading">
          Restricted Compliance Area
        </h2>
        <p className="text-xs text-ink/70 leading-relaxed">
          The immutable audit ledger is restricted strictly to Organisation
          Administrators, System Administrators, and Super Administrators for
          regulatory compliance (CQC Regulation 17).
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-ink font-heading">
              Immutable Audit Ledger
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-mint text-teal-deep font-semibold flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5" />
              CQC Regulation 17 Compliant
            </span>
          </div>
          <p className="text-sm text-ink/70 mt-1">
            Tamper-evident activity ledger recording system modifications,
            administrative events, and security access.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={() => refetch()}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-md border border-ink/10 bg-white hover:bg-cream text-ink/80 hover:text-ink transition-all cursor-pointer shadow-xs"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </button>

          <button
            onClick={handleExportCsv}
            disabled={filteredLogs.length === 0}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-md bg-teal-brand text-white text-xs font-semibold hover:bg-teal-deep transition-all shadow-xs cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="h-3.5 w-3.5" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="space-y-3">
        {/* Entity Type Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-ink/[0.04] border border-ink/[0.07] overflow-x-auto scrollbar-none">
          {ENTITY_TYPE_FILTERS.map((ef) => {
            const isActive = selectedEntityType === ef.value;
            return (
              <button
                key={ef.value}
                onClick={() => {
                  setSelectedEntityType(ef.value);
                  setPage(0);
                }}
                className={`tab-btn px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                  isActive
                    ? "bg-teal-brand text-white shadow-xs"
                    : "text-ink/65 hover:text-ink hover:bg-white/60"
                }`}
              >
                <span>{ef.label}</span>
              </button>
            );
          })}
        </div>

        {/* Search & Action Input Bar */}
        <div className="p-4 rounded-md bg-white border border-ink/10 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-ink/40" />
            <input
              type="text"
              placeholder="Search by action, entity ID, IP, or client..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm rounded-md border border-ink/10 bg-cream/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-brand/20 transition-all text-ink"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="h-4 w-4 text-ink/40" />
            <span className="text-xs text-ink/60 font-medium">Action:</span>
            <input
              type="text"
              placeholder="Filter by action name..."
              value={actionFilter}
              onChange={(e) => {
                setActionFilter(e.target.value);
                setPage(0);
              }}
              className="text-xs rounded-md border border-ink/10 px-3 py-2 bg-cream/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-brand/20 text-ink w-48"
            />
            {(search || actionFilter || selectedEntityType) && (
              <button
                onClick={() => {
                  setSearch("");
                  setActionFilter("");
                  setSelectedEntityType("");
                  setPage(0);
                }}
                className="text-xs text-teal-deep font-semibold hover:underline cursor-pointer ml-1"
              >
                Reset
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="rounded-md bg-white border border-ink/10 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-8 space-y-4">
            <div className="h-6 w-48 skeleton rounded-md" />
            <div className="space-y-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-12 w-full skeleton rounded-md" />
              ))}
            </div>
          </div>
        ) : isError ? (
          <div className="p-12 text-center space-y-3">
            <AlertTriangle className="h-8 w-8 text-destructive mx-auto" />
            <p className="font-bold text-ink text-sm">Failed to load audit logs</p>
            <p className="text-xs text-ink/60">
              There was an issue communicating with the audit service.
            </p>
            <button
              onClick={() => refetch()}
              className="px-4 py-1.5 rounded-md bg-teal-brand text-white text-xs font-semibold hover:bg-teal-deep transition-all cursor-pointer"
            >
              Retry
            </button>
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-cream text-ink/40 flex items-center justify-center mx-auto">
              <FileClock className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-ink text-sm">No audit logs found</h3>
            <p className="text-xs text-ink/60 max-w-sm mx-auto">
              {search || actionFilter || selectedEntityType
                ? "No audit records matched your current query criteria. Try adjusting or clearing your filters."
                : "No immutable audit logs have been recorded in the platform ledger yet."}
            </p>
            {(search || actionFilter || selectedEntityType) && (
              <button
                onClick={() => {
                  setSearch("");
                  setActionFilter("");
                  setSelectedEntityType("");
                  setPage(0);
                }}
                className="px-3 py-1.5 rounded-md border border-ink/15 text-xs font-semibold text-ink/70 hover:bg-cream cursor-pointer"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="whitespace-nowrap w-full text-left text-xs text-ink">
              <thead className="bg-cream/40 border-b border-ink/10 text-ink/60 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3.5 px-6">Timestamp & IP</th>
                  <th className="py-3.5 px-4">Action Event</th>
                  <th className="py-3.5 px-4">Entity Type</th>
                  <th className="py-3.5 px-4">Entity Public ID</th>
                  <th className="py-3.5 px-4">Actor / IDs</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/5">
                {filteredLogs.map((log) => {
                  const dateStr = log.createdAt
                    ? new Date(log.createdAt).toLocaleString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })
                    : "—";

                  return (
                    <tr
                      key={log.publicId}
                      className="hover:bg-cream/20 transition-colors cursor-pointer"
                      onClick={() => setSelectedLog(log)}
                    >
                      <td className="py-4 px-6 font-mono text-[11px]">
                        <div className="font-bold text-ink">{dateStr}</div>
                        <div className="text-[10px] text-ink/50 mt-0.5 flex items-center gap-1">
                          <Globe className="h-3 w-3 shrink-0" />
                          <span>{log.ipAddress || "Internal / System"}</span>
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getActionColor(
                            log.action
                          )}`}
                        >
                          {log.action}
                        </span>
                      </td>

                      <td className="py-4 px-4">
                        <span className="font-mono text-[11px] px-2 py-0.5 rounded-md bg-ink/5 text-ink/80 font-semibold">
                          {log.entityType || "SYSTEM"}
                        </span>
                      </td>

                      <td className="py-4 px-4 font-mono text-[11px] text-ink/70">
                        {log.entityPublicId ? (
                          <div className="flex items-center gap-1">
                            <span className="truncate max-w-[140px]">
                              {log.entityPublicId}
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                copyToClipboard(
                                  log.entityPublicId!,
                                  `ent-${log.publicId}`
                                );
                              }}
                              className="text-ink/40 hover:text-ink p-0.5 cursor-pointer"
                              title="Copy Entity ID"
                            >
                              {copiedKey === `ent-${log.publicId}` ? (
                                <Check className="h-3 w-3 text-emerald-600" />
                              ) : (
                                <Copy className="h-3 w-3" />
                              )}
                            </button>
                          </div>
                        ) : (
                          <span className="text-ink/30 italic">None</span>
                        )}
                      </td>

                      <td className="py-4 px-4 text-[11px] text-ink/70">
                        <div className="flex items-center gap-2">
                          {log.actorUserId ? (
                            <span>Actor: #{log.actorUserId}</span>
                          ) : (
                            <span className="text-ink/40">System</span>
                          )}
                          {log.organisationId && (
                            <span className="text-[10px] text-ink/50">
                              • Org: #{log.organisationId}
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedLog(log);
                          }}
                          className="px-2.5 py-1.5 rounded-md bg-cream hover:bg-mint text-teal-deep text-xs font-semibold transition-all cursor-pointer inline-flex items-center gap-1"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          Inspect
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-ink/10 flex items-center justify-between text-xs text-ink/60">
            <span>
              Page {page + 1} of {totalPages} ({totalElements} total entries)
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={page <= 0}
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                className="px-3 py-1.5 rounded-md border border-ink/10 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-cream font-medium cursor-pointer inline-flex items-center gap-1"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                Previous
              </button>
              <button
                disabled={page >= totalPages - 1}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1.5 rounded-md border border-ink/10 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-cream font-medium cursor-pointer inline-flex items-center gap-1"
              >
                Next
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* -------------------------------------------------------------------- */}
      {/* AUDIT LOG INSPECTION MODAL                                           */}
      {/* -------------------------------------------------------------------- */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 bg-ink/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-white rounded-md p-6 shadow-2xl border border-ink/10 space-y-6 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between border-b border-ink/10 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${getActionColor(
                      selectedLog.action
                    )}`}
                  >
                    {selectedLog.action}
                  </span>
                  <span className="font-mono text-xs px-2 py-0.5 rounded bg-ink/5 text-ink/70 font-semibold">
                    {selectedLog.entityType}
                  </span>
                </div>
                <h2 className="text-lg font-bold text-ink font-heading mt-2">
                  Audit Event Details
                </h2>
                <p className="text-xs text-ink/60 font-mono">
                  Log ID: {selectedLog.publicId}
                </p>
              </div>

              <button
                onClick={() => setSelectedLog(null)}
                className="text-ink/40 hover:text-ink p-1 rounded-md cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Core Ledger Attributes */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-md bg-cream/30 border border-ink/5">
                <span className="text-ink/50 text-[10px] uppercase font-semibold block">
                  Timestamp
                </span>
                <span className="font-bold text-ink">
                  {selectedLog.createdAt
                    ? new Date(selectedLog.createdAt).toLocaleString()
                    : "—"}
                </span>
              </div>

              <div className="p-3 rounded-md bg-cream/30 border border-ink/5">
                <span className="text-ink/50 text-[10px] uppercase font-semibold block">
                  IP Address
                </span>
                <span className="font-bold text-ink font-mono">
                  {selectedLog.ipAddress || "Internal"}
                </span>
              </div>

              <div className="p-3 rounded-md bg-cream/30 border border-ink/5">
                <span className="text-ink/50 text-[10px] uppercase font-semibold block">
                  Actor User ID
                </span>
                <span className="font-bold text-ink">
                  {selectedLog.actorUserId ? `#${selectedLog.actorUserId}` : "System"}
                </span>
              </div>

              <div className="p-3 rounded-md bg-cream/30 border border-ink/5">
                <span className="text-ink/50 text-[10px] uppercase font-semibold block">
                  Entity Public ID
                </span>
                <span className="font-bold text-ink font-mono truncate block text-[11px]">
                  {selectedLog.entityPublicId || "—"}
                </span>
              </div>

              <div className="p-3 rounded-md bg-cream/30 border border-ink/5">
                <span className="text-ink/50 text-[10px] uppercase font-semibold block">
                  Organisation ID
                </span>
                <span className="font-bold text-ink">
                  {selectedLog.organisationId ? `#${selectedLog.organisationId}` : "—"}
                </span>
              </div>

              <div className="p-3 rounded-md bg-cream/30 border border-ink/5">
                <span className="text-ink/50 text-[10px] uppercase font-semibold block">
                  Care Home ID
                </span>
                <span className="font-bold text-ink">
                  {selectedLog.careHomeId ? `#${selectedLog.careHomeId}` : "—"}
                </span>
              </div>
            </div>

            {/* User Agent */}
            {selectedLog.userAgent && (
              <div className="p-3 rounded-md bg-cream/30 border border-ink/5 text-xs space-y-1">
                <span className="text-ink/50 text-[10px] uppercase font-semibold block">
                  Client User-Agent
                </span>
                <p className="font-mono text-[11px] text-ink/80 break-all">
                  {selectedLog.userAgent}
                </p>
              </div>
            )}

            {/* Structured Details JSON */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-ink uppercase tracking-wider flex items-center gap-1.5">
                  <Database className="h-3.5 w-3.5 text-teal-brand" />
                  Audit Payload Details (JSON)
                </span>
                {selectedLog.details && (
                  <button
                    onClick={() =>
                      copyToClipboard(
                        JSON.stringify(selectedLog.details, null, 2),
                        "json-payload"
                      )
                    }
                    className="text-xs text-teal-deep font-semibold hover:underline inline-flex items-center gap-1 cursor-pointer"
                  >
                    {copiedKey === "json-payload" ? (
                      <Check className="h-3 w-3 text-emerald-600" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                    Copy JSON
                  </button>
                )}
              </div>

              <div className="p-4 rounded-md bg-ink text-white font-mono text-xs overflow-x-auto max-h-60 leading-relaxed">
                {selectedLog.details &&
                Object.keys(selectedLog.details).length > 0 ? (
                  <pre>{JSON.stringify(selectedLog.details, null, 2)}</pre>
                ) : (
                  <span className="text-white/40 italic">
                    {"// No additional prop payload captured for this action event"}
                  </span>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-ink/10">
              <button
                onClick={() =>
                  copyToClipboard(selectedLog.publicId, "log-public-id")
                }
                className="px-3 py-1.5 rounded-md border border-ink/10 text-xs font-semibold text-ink/70 hover:bg-cream cursor-pointer inline-flex items-center gap-1.5"
              >
                {copiedKey === "log-public-id" ? (
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
                Copy Log ID
              </button>

              <button
                onClick={() => setSelectedLog(null)}
                className="px-4 py-2 rounded-md bg-teal-brand text-white text-xs font-semibold hover:bg-teal-deep cursor-pointer"
              >
                Close Ledger Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
