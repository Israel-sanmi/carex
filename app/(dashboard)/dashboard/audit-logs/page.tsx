"use client";

import { useState } from "react";
import { useRole } from "@/lib/role-context";
import { useAuditLogs } from "@/lib/hooks/use-audit-logs";
import { AuditLogItem } from "@/lib/api-audit-logs";
import { toast } from "@/components/ui/toast";
import {
  btn,
  field,
  table,
  PageHeader,
  Panel,
  Toolbar,
  SearchField,
  Segmented,
  Badge,
  EmptyState,
  ErrorState,
  SkeletonRows,
  DataItem,
  Modal,
  type BadgeTone,
} from "@/components/dashboard/ui";
import {
  FileClock,
  Filter,
  ShieldCheck,
  Download,
  Eye,
  Copy,
  Check,
  RefreshCw,
  Globe,
  ChevronLeft,
  ChevronRight,
  Database,
  Clock,
  User,
  Building2,
  Home,
  Hash,
  Lock,
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

/** Presentational: maps an action name to a badge tone. */
function getActionTone(action?: string): BadgeTone {
  if (!action) return "slate";
  const a = action.toUpperCase();
  if (
    a.includes("DELETE") ||
    a.includes("REVOKE") ||
    a.includes("REJECT") ||
    a.includes("FAILED") ||
    a.includes("REMOVE")
  ) {
    return "red";
  }
  if (
    a.includes("CREATE") ||
    a.includes("APPROVE") ||
    a.includes("ACCEPT") ||
    a.includes("SUCCESS")
  ) {
    return "green";
  }
  if (a.includes("UPDATE") || a.includes("MODIFY") || a.includes("EDIT")) {
    return "sky";
  }
  if (
    a.includes("LOGIN") ||
    a.includes("LOGOUT") ||
    a.includes("AUTH") ||
    a.includes("PASSWORD") ||
    a.includes("TOKEN")
  ) {
    return "violet";
  }
  return "slate";
}

const toneDot: Record<BadgeTone, string> = {
  teal: "bg-teal-brand",
  green: "bg-emerald-500",
  amber: "bg-amber-500",
  coral: "bg-coral",
  red: "bg-red-500",
  violet: "bg-lilac",
  sky: "bg-sky",
  slate: "bg-ink/30",
};

function formatTimestamp(createdAt?: string) {
  return createdAt
    ? new Date(createdAt).toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
    : "—";
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
      <div className="space-y-6">
        <Panel className="max-w-xl mx-auto my-6 sm:my-12">
          <EmptyState
            icon={Lock}
            title="Restricted Compliance Area"
            description="The immutable audit ledger is restricted strictly to Organisation Administrators, System Administrators, and Super Administrators for regulatory compliance (CQC Regulation 17)."
            className="!py-8"
          />
        </Panel>
      </div>
    );
  }

  const hasFilters = Boolean(search || actionFilter || selectedEntityType);

  const resetFilters = () => {
    setSearch("");
    setActionFilter("");
    setSelectedEntityType("");
    setPage(0);
  };

  /** Inline copy button for an entity id (stops row click). */
  const renderEntityCopy = (log: AuditLogItem) => (
    <button
      onClick={(e) => {
        e.stopPropagation();
        copyToClipboard(log.entityPublicId!, `ent-${log.publicId}`);
      }}
      className="grid place-items-center w-6 h-6 rounded-md text-ink/40 hover:text-ink hover:bg-ink/5 transition-colors cursor-pointer shrink-0"
      title="Copy Entity ID"
      aria-label="Copy Entity ID"
    >
      {copiedKey === `ent-${log.publicId}` ? (
        <Check className="h-3 w-3 text-emerald-600" />
      ) : (
        <Copy className="h-3 w-3" />
      )}
    </button>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        icon={FileClock}
        eyebrow={
          <Badge tone="teal" icon={ShieldCheck}>
            CQC Regulation 17 Compliant
          </Badge>
        }
        title="Immutable Audit Ledger"
        description="Tamper-evident activity ledger recording system modifications, administrative events, and security access."
        actions={
          <>
            <button
              onClick={() => refetch()}
              disabled={isLoading}
              className={btn.secondary}
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </button>

            <button
              onClick={handleExportCsv}
              disabled={filteredLogs.length === 0}
              className={`${btn.primary} group`}
            >
              <Download className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
              Export CSV
            </button>
          </>
        }
      />

      {/* Filters */}
      <div className="space-y-3">
        {/* Entity Type Tabs */}
        <Segmented
          value={selectedEntityType}
          onChange={(v) => {
            setSelectedEntityType(v);
            setPage(0);
          }}
          options={ENTITY_TYPE_FILTERS.map((ef) => ({
            value: ef.value,
            label: ef.label,
          }))}
          className="w-full sm:w-auto"
        />

        {/* Search & Action Filter */}
        <Toolbar>
          <SearchField
            value={search}
            onChange={setSearch}
            placeholder="Search by action, entity ID, IP, or client..."
          />

          <div className="flex items-center gap-2 w-full md:w-auto">
            <label className="relative flex-1 md:flex-none">
              <span className="sr-only">Filter by action name</span>
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-ink/35 pointer-events-none" />
              <input
                type="text"
                placeholder="Filter by action name..."
                value={actionFilter}
                onChange={(e) => {
                  setActionFilter(e.target.value);
                  setPage(0);
                }}
                className={`${field.input} pl-9 font-mono !text-xs md:w-56`}
              />
            </label>
            {hasFilters && (
              <button
                onClick={resetFilters}
                className={`${btn.ghost} ${btn.sm} text-teal-deep`}
              >
                Reset
              </button>
            )}
          </div>
        </Toolbar>
      </div>

      {/* Ledger */}
      <Panel flush>
        {isLoading ? (
          <SkeletonRows rows={6} />
        ) : isError ? (
          <div className="p-4 sm:p-5">
            <ErrorState
              title="Failed to load audit logs"
              message="There was an issue communicating with the audit service."
              onRetry={() => refetch()}
            />
          </div>
        ) : filteredLogs.length === 0 ? (
          <EmptyState
            icon={FileClock}
            title="No audit logs found"
            description={
              hasFilters
                ? "No audit records matched your current query criteria. Try adjusting or clearing your filters."
                : "No immutable audit logs have been recorded in the platform ledger yet."
            }
            action={
              hasFilters ? (
                <button
                  onClick={resetFilters}
                  className={`${btn.secondary} ${btn.sm}`}
                >
                  Clear Filters
                </button>
              ) : undefined
            }
          />
        ) : (
          <>
            {/* Desktop: dense ledger table */}
            <div className={`${table.wrap} hidden md:block`}>
              <table className={table.table}>
                <thead>
                  <tr>
                    <th className={table.th}>Timestamp & IP</th>
                    <th className={table.th}>Action Event</th>
                    <th className={table.th}>Entity Type</th>
                    <th className={table.th}>Entity Public ID</th>
                    <th className={table.th}>Actor / IDs</th>
                    <th className={`${table.th} text-right`}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLogs.map((log) => {
                    const dateStr = formatTimestamp(log.createdAt);
                    const tone = getActionTone(log.action);

                    return (
                      <tr
                        key={log.publicId}
                        className={`${table.tr} cursor-pointer`}
                        onClick={() => setSelectedLog(log)}
                      >
                        <td className={`${table.td} whitespace-nowrap`}>
                          <div className="flex items-start gap-2.5">
                            <span
                              className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${toneDot[tone]}`}
                            />
                            <div className="font-mono text-[11px]">
                              <div className="font-semibold text-ink tabular-nums">
                                {dateStr}
                              </div>
                              <div className="text-[10px] text-ink/45 mt-0.5 flex items-center gap-1">
                                <Globe className="h-3 w-3 shrink-0" />
                                <span>{log.ipAddress || "Internal / System"}</span>
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className={table.td}>
                          <Badge tone={tone} className="font-mono !text-[10px] tracking-wide">
                            {log.action}
                          </Badge>
                        </td>

                        <td className={table.td}>
                          <span className="font-mono text-[11px] px-2 py-0.5 rounded-md bg-ink/[0.05] text-ink/75 font-semibold whitespace-nowrap">
                            {log.entityType || "SYSTEM"}
                          </span>
                        </td>

                        <td className={`${table.td} font-mono text-[11px] text-ink/65`}>
                          {log.entityPublicId ? (
                            <div className="flex items-center gap-1">
                              <span className="truncate max-w-[140px]">
                                {log.entityPublicId}
                              </span>
                              {renderEntityCopy(log)}
                            </div>
                          ) : (
                            <span className="text-ink/30 italic">None</span>
                          )}
                        </td>

                        <td className={`${table.td} text-[11px] text-ink/65 whitespace-nowrap`}>
                          <div className="flex items-center gap-2">
                            {log.actorUserId ? (
                              <span className="inline-flex items-center gap-1">
                                <User className="h-3 w-3 text-ink/35" />
                                Actor: <span className="font-mono">#{log.actorUserId}</span>
                              </span>
                            ) : (
                              <span className="text-ink/40">System</span>
                            )}
                            {log.organisationId && (
                              <span className="text-[10px] text-ink/45 font-mono">
                                • Org: #{log.organisationId}
                              </span>
                            )}
                          </div>
                        </td>

                        <td className={`${table.td} text-right`}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedLog(log);
                            }}
                            className={`${btn.ghost} ${btn.sm} text-teal-deep`}
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

            {/* Mobile: vertical timeline */}
            <ol className="md:hidden relative px-4 py-4">
              {filteredLogs.map((log, i) => {
                const dateStr = formatTimestamp(log.createdAt);
                const tone = getActionTone(log.action);
                const isLast = i === filteredLogs.length - 1;

                return (
                  <li key={log.publicId} className="relative pl-6 pb-4 last:pb-0">
                    {!isLast && (
                      <span
                        className="absolute left-[5px] top-4 bottom-0 w-px bg-ink/10"
                        aria-hidden="true"
                      />
                    )}
                    <span
                      className={`absolute left-0 top-2.5 w-[11px] h-[11px] rounded-full ring-4 ring-white ${toneDot[tone]}`}
                      aria-hidden="true"
                    />
                    <div
                      onClick={() => setSelectedLog(log)}
                      className="group rounded-md border border-ink/[0.07] bg-white p-3 cursor-pointer transition-all hover:-translate-y-0.5 hover:border-teal-brand/25 active:translate-y-0"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <Badge
                          tone={tone}
                          className="font-mono !text-[10px] tracking-wide max-w-[70%] truncate"
                        >
                          {log.action}
                        </Badge>
                        <ChevronRight className="h-4 w-4 text-ink/25 shrink-0 transition-transform group-hover:translate-x-0.5" />
                      </div>
                      <div className="mt-2 font-mono text-[11px] text-ink font-semibold tabular-nums">
                        {dateStr}
                      </div>
                      <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-ink/55">
                        <span className="font-mono px-1.5 py-px rounded-md bg-ink/[0.05] text-ink/70 font-semibold">
                          {log.entityType || "SYSTEM"}
                        </span>
                        <span className="inline-flex items-center gap-1 font-mono">
                          <Globe className="h-3 w-3" />
                          {log.ipAddress || "Internal / System"}
                        </span>
                      </div>
                      <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-ink/55">
                        {log.actorUserId ? (
                          <span>Actor: #{log.actorUserId}</span>
                        ) : (
                          <span className="text-ink/40">System</span>
                        )}
                        {log.organisationId && (
                          <span className="text-ink/45">• Org: #{log.organisationId}</span>
                        )}
                      </div>
                      {log.entityPublicId ? (
                        <div className="mt-1.5 flex items-center gap-1 font-mono text-[11px] text-ink/60 min-w-0">
                          <Hash className="h-3 w-3 shrink-0 text-ink/35" />
                          <span className="truncate">{log.entityPublicId}</span>
                          {renderEntityCopy(log)}
                        </div>
                      ) : (
                        <div className="mt-1.5 font-mono text-[11px] text-ink/30 italic">
                          None
                        </div>
                      )}
                    </div>
                  </li>
                );
              })}
            </ol>
          </>
        )}

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="px-5 py-3.5 border-t border-ink/[0.06] bg-[#f8faf9] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-ink/55">
            <span className="tabular-nums">
              Page {page + 1} of {totalPages} ({totalElements} total entries)
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={page <= 0}
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                className={`${btn.secondary} ${btn.sm} flex-1 sm:flex-none`}
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                Previous
              </button>
              <button
                disabled={page >= totalPages - 1}
                onClick={() => setPage((p) => p + 1)}
                className={`${btn.secondary} ${btn.sm} flex-1 sm:flex-none`}
              >
                Next
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}
      </Panel>

      {/* -------------------------------------------------------------------- */}
      {/* AUDIT LOG INSPECTION MODAL                                           */}
      {/* -------------------------------------------------------------------- */}
      {selectedLog && (
        <Modal
          open
          onClose={() => setSelectedLog(null)}
          size="lg"
          icon={Database}
          title="Audit Event Details"
          description={
            <span className="font-mono text-xs break-all">
              Log ID: {selectedLog.publicId}
            </span>
          }
          footer={
            <>
              <button
                onClick={() =>
                  copyToClipboard(selectedLog.publicId, "log-public-id")
                }
                className={`${btn.secondary} sm:mr-auto`}
              >
                {copiedKey === "log-public-id" ? (
                  <Check className="h-4 w-4 text-emerald-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
                Copy Log ID
              </button>

              <button
                onClick={() => setSelectedLog(null)}
                className={btn.primary}
              >
                Close Ledger Record
              </button>
            </>
          }
        >
          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                tone={getActionTone(selectedLog.action)}
                className="font-mono tracking-wide"
              >
                {selectedLog.action}
              </Badge>
              <span className="font-mono text-[11px] px-2 py-0.5 rounded-md bg-ink/[0.05] text-ink/70 font-semibold">
                {selectedLog.entityType}
              </span>
            </div>

            {/* Core Ledger Attributes */}
            <dl className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-md bg-cream/50 border border-ink/[0.06]">
                <DataItem label="Timestamp" icon={Clock}>
                  <span className="tabular-nums">
                    {selectedLog.createdAt
                      ? new Date(selectedLog.createdAt).toLocaleString()
                      : "—"}
                  </span>
                </DataItem>
              </div>
              <div className="p-3 rounded-md bg-cream/50 border border-ink/[0.06]">
                <DataItem label="IP Address" icon={Globe}>
                  <span className="font-mono">
                    {selectedLog.ipAddress || "Internal"}
                  </span>
                </DataItem>
              </div>
              <div className="p-3 rounded-md bg-cream/50 border border-ink/[0.06]">
                <DataItem label="Actor User ID" icon={User}>
                  {selectedLog.actorUserId ? `#${selectedLog.actorUserId}` : "System"}
                </DataItem>
              </div>
              <div className="p-3 rounded-md bg-cream/50 border border-ink/[0.06]">
                <DataItem label="Entity Public ID" icon={Hash}>
                  <span className="font-mono text-[11px]">
                    {selectedLog.entityPublicId || "—"}
                  </span>
                </DataItem>
              </div>
              <div className="p-3 rounded-md bg-cream/50 border border-ink/[0.06]">
                <DataItem label="Organisation ID" icon={Building2}>
                  {selectedLog.organisationId ? `#${selectedLog.organisationId}` : "—"}
                </DataItem>
              </div>
              <div className="p-3 rounded-md bg-cream/50 border border-ink/[0.06]">
                <DataItem label="Care Home ID" icon={Home}>
                  {selectedLog.careHomeId ? `#${selectedLog.careHomeId}` : "—"}
                </DataItem>
              </div>
            </dl>

            {/* User Agent */}
            {selectedLog.userAgent && (
              <div className="p-3 rounded-md bg-cream/50 border border-ink/[0.06] space-y-1">
                <span className="block text-[11px] font-medium uppercase tracking-wider text-ink/45">
                  Client User-Agent
                </span>
                <p className="font-mono text-[11px] text-ink/80 break-all">
                  {selectedLog.userAgent}
                </p>
              </div>
            )}

            {/* Structured Details JSON */}
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-semibold text-ink/60 uppercase tracking-wider flex items-center gap-1.5">
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
                    className={`${btn.ghost} ${btn.sm} text-teal-deep`}
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

              <div className="p-4 rounded-md bg-ink text-white/90 font-mono text-xs overflow-x-auto max-h-60 leading-relaxed shadow-inner">
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
          </div>
        </Modal>
      )}
    </div>
  );
}
