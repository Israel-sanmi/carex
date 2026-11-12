"use client";

import { useState } from "react";
import { useRole } from "@/lib/role-context";
import {
  FileClock,
  Search,
  Filter,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Info,
  Lock,
  Download,
  Calendar,
} from "lucide-react";

interface AuditEntry {
  id: string;
  timestamp: string;
  actorName: string;
  actorRole: string;
  category: "AUTH" | "ADMISSION" | "CARE_PLAN" | "TENANCY" | "SECURITY";
  action: string;
  entityTarget: string;
  ipAddress: string;
  severity: "INFO" | "WARNING" | "CRITICAL";
}

const mockAuditLogs: AuditEntry[] = [
  {
    id: "aud-001",
    timestamp: "2026-03-29 09:12:44",
    actorName: "Victoria Sterling",
    actorRole: "ORGANISATION_ADMIN",
    category: "AUTH",
    action: "Successful multi-factor authentication login",
    entityTarget: "User: v.sterling@apexcare.co.uk",
    ipAddress: "194.72.10.42 (Bristol, UK)",
    severity: "INFO",
  },
  {
    id: "aud-002",
    timestamp: "2026-03-29 08:45:10",
    actorName: "Eleanor Vance",
    actorRole: "CARE_HOME_MANAGER",
    category: "ADMISSION",
    action: "Approved resident admission & assigned Room Suite 106",
    entityTarget: "Resident: Albert Edward Simmons (REG-2026-9102)",
    ipAddress: "82.165.197.1 (St. Jude's Gateway)",
    severity: "INFO",
  },
  {
    id: "aud-003",
    timestamp: "2026-03-29 07:30:22",
    actorName: "Grace Mbatha",
    actorRole: "CAREGIVER",
    category: "CARE_PLAN",
    action: "Recorded vital signs & morning medication round",
    entityTarget: "Resident: Arthur Pendelton (Suite 104)",
    ipAddress: "10.0.4.15 (Internal Clinical Tablet)",
    severity: "INFO",
  },
  {
    id: "aud-004",
    timestamp: "2026-03-28 22:14:09",
    actorName: "SYSTEM_MONITOR",
    actorRole: "SECURITY_DAEMON",
    category: "SECURITY",
    action: "Failed login attempt: 3 invalid password attempts",
    entityTarget: "Account: d.craigie@apexcare.co.uk",
    ipAddress: "185.220.101.5 (External)",
    severity: "WARNING",
  },
  {
    id: "aud-005",
    timestamp: "2026-03-28 16:32:00",
    actorName: "Dr. Alexander Sterling",
    actorRole: "SUPER_ADMIN",
    category: "TENANCY",
    action: "Provisioned new care organisation partition 'Beacon Light Homes'",
    entityTarget: "Tenant: BCN-LIGHT",
    ipAddress: "51.148.22.90 (CarerLoop Core)",
    severity: "INFO",
  },
  {
    id: "aud-006",
    timestamp: "2026-03-27 14:10:15",
    actorName: "Victoria Sterling",
    actorRole: "ORGANISATION_ADMIN",
    category: "SECURITY",
    action: "Suspended staff account pending compliance check",
    entityTarget: "User: Sarah Jenkins (s.jenkins@oakridge.co.uk)",
    ipAddress: "194.72.10.42 (Bristol, UK)",
    severity: "WARNING",
  },
  {
    id: "aud-007",
    timestamp: "2026-03-26 11:20:04",
    actorName: "Eleanor Vance",
    actorRole: "CARE_HOME_MANAGER",
    category: "CARE_PLAN",
    action: "Updated allergy warning list: added 'Latex' alert",
    entityTarget: "Resident: Arthur Pendelton (REG-2026-9041)",
    ipAddress: "82.165.197.1 (St. Jude's Gateway)",
    severity: "CRITICAL",
  },
];

export default function AuditLogsPage() {
  const { currentRole } = useRole();
  const [logs] = useState<AuditEntry[]>(mockAuditLogs);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");

  if (!["SUPER_ADMIN", "ORGANISATION_ADMIN"].includes(currentRole)) {
    return (
      <div className="p-8 rounded-md bg-white border border-ink/10 text-center max-w-xl mx-auto space-y-4 my-12">
        <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center mx-auto">
          <AlertTriangle className="h-6 w-6" />
        </div>
        <h2 className="text-xl font-bold text-ink font-heading">
          Restricted Compliance Area
        </h2>
        <p className="text-xs text-ink/70 leading-relaxed">
          The immutable audit ledger is restricted to Organisation
          Administrators and Super Administrators for regulatory compliance.
          Switch role to view.
        </p>
      </div>
    );
  }

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.actorName.toLowerCase().includes(search.toLowerCase()) ||
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.entityTarget.toLowerCase().includes(search.toLowerCase()) ||
      log.ipAddress.toLowerCase().includes(search.toLowerCase());
    const matchesCat =
      selectedCategory === "ALL" || log.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

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
              <ShieldCheck className="h-3 w-3" />
              CQC Regulation 17 Compliant
            </span>
          </div>
          <p className="text-sm text-ink/70 mt-1">
            Section 4.9 System Transparency: Cryptographically indexed activity
            records documenting all access and changes.
          </p>
        </div>

        <button
          onClick={() => {}}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md border border-ink/10 bg-white hover:bg-cream text-ink text-sm font-semibold transition-all shadow-xs cursor-pointer"
        >
          <Download className="h-4 w-4 text-teal-brand" />
          Export Audit Report (CSV)
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-md bg-white border border-ink/10 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-ink/40" />
          <input
            type="text"
            placeholder="Search by actor, action description or target..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm rounded-md border border-ink/10 bg-cream/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-brand/20 transition-all"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="h-4 w-4 text-ink/40" />
          <span className="text-xs text-ink/60 font-medium">Category:</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="text-xs rounded-md border border-ink/10 px-3 py-2 bg-cream/30 focus:outline-none focus:ring-2 focus:ring-teal-brand/20 font-medium text-ink"
          >
            <option value="ALL">All Categories</option>
            <option value="AUTH">Authentication (AUTH)</option>
            <option value="ADMISSION">Admissions & Bed (ADMISSION)</option>
            <option value="CARE_PLAN">Care Records (CARE_PLAN)</option>
            <option value="TENANCY">Tenancy & Org (TENANCY)</option>
            <option value="SECURITY">Security Events (SECURITY)</option>
          </select>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="rounded-md bg-white border border-ink/10 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="whitespace-nowrap w-full text-left text-xs text-ink">
            <thead className="bg-cream/40 border-b border-ink/10 text-ink/60 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-6">Timestamp & IP</th>
                <th className="py-3.5 px-4">Actor</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Action Event</th>
                <th className="py-3.5 px-4">Affected Target</th>
                <th className="py-3.5 px-6 text-right">Severity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/5">
              {filteredLogs.map((log) => (
                <tr
                  key={log.id}
                  className="hover:bg-cream/20 transition-colors"
                >
                  <td className="py-4 px-6 font-mono text-[11px]">
                    <div className="font-bold text-ink">{log.timestamp}</div>
                    <div className="text-[10px] text-ink/50 mt-0.5">
                      {log.ipAddress}
                    </div>
                  </td>

                  <td className="py-4 px-4">
                    <span className="font-bold text-ink block">
                      {log.actorName}
                    </span>
                    <span className="text-[10px] text-teal-deep font-semibold">
                      {log.actorRole.replace(/_/g, " ")}
                    </span>
                  </td>

                  <td className="py-4 px-4">
                    <span className="font-mono text-[11px] px-2 py-0.5 rounded-md bg-ink/5 text-ink/70 font-semibold">
                      {log.category}
                    </span>
                  </td>

                  <td className="py-4 px-4 font-medium text-ink max-w-xs">
                    {log.action}
                  </td>

                  <td className="py-4 px-4 font-mono text-[11px] text-ink/70 max-w-xs truncate">
                    {log.entityTarget}
                  </td>

                  <td className="py-4 px-6 text-right">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        log.severity === "INFO"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : log.severity === "WARNING"
                            ? "bg-amber-50 text-amber-800 border border-amber-200"
                            : "bg-rose-50 text-rose-700 border border-rose-200"
                      }`}
                    >
                      {log.severity}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
