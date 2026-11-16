"use client";

import { useState } from "react";
import { useRole } from "@/lib/role-context";
import {
  useResidentAdmissions,
  useApproveAdmissionMutation,
  useRejectAdmissionMutation,
} from "@/lib/hooks/use-resident-admissions";
import {
  ResidentAdmission,
  AdmissionStatus,
} from "@/lib/api-resident-admissions";
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
  StatusBadge,
  Avatar,
  EmptyState,
  ErrorState,
  SkeletonRows,
  Spinner,
  DataItem,
  Modal,
} from "@/components/dashboard/ui";
import {
  Users,
  CheckCircle2,
  XCircle,
  Building2,
  Home,
  AlertCircle,
  Eye,
  Calendar,
  Phone,
  Mail,
  MapPin,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  ArrowLeftRight,
  Heart,
  RefreshCw,
  UserCheck,
  Building,
} from "lucide-react";

const STATUS_FILTERS: { label: string; value: AdmissionStatus }[] = [
  { label: "Pending Review", value: "PENDING" },
  { label: "Approved Admissions", value: "APPROVED" },
  { label: "Rejected", value: "REJECTED" },
];

const ALLOWED_REVIEWERS = [
  "SUPER_ADMIN",
  "SYSTEM_ADMIN",
  "ORGANISATION_ADMIN",
  "CARE_HOME_ADMIN",
  "CARE_HOME_MANAGER",
];

function calculateAge(dob?: string): number | null {
  if (!dob) return null;
  const birth = new Date(dob);
  if (isNaN(birth.getTime())) return null;
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const m = now.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--;
  return age >= 0 ? age : null;
}

export default function ResidentsPage() {
  const { currentRole, user } = useRole();

  // Access control
  const canReview =
    ALLOWED_REVIEWERS.includes(currentRole) ||
    currentRole === "SUPER_ADMIN" ||
    currentRole === "ORGANISATION_ADMIN" ||
    currentRole === "CARE_HOME_MANAGER";

  // Filter & Search states
  const [selectedStatus, setSelectedStatus] =
    useState<AdmissionStatus>("PENDING");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const pageSize = 20;

  // Modals state
  const [viewingAdmission, setViewingAdmission] =
    useState<ResidentAdmission | null>(null);
  const [approvingAdmission, setApprovingAdmission] =
    useState<ResidentAdmission | null>(null);
  const [rejectingAdmission, setRejectingAdmission] =
    useState<ResidentAdmission | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  // Queries & Mutations
  const { data, isLoading, isError, refetch } = useResidentAdmissions({
    page,
    size: pageSize,
    status: selectedStatus,
  });

  const approveMutation = useApproveAdmissionMutation();
  const rejectMutation = useRejectAdmissionMutation();

  const admissions = data?.content || [];
  const totalElements = data?.totalElements || 0;
  const totalPages = data?.totalPages || 1;

  // Filter on client side by search query
  const filteredAdmissions = admissions.filter((item) => {
    const res = item.resident;
    const fullName = `${res?.firstName || ""} ${res?.middleName || ""} ${
      res?.lastName || ""
    }`.toLowerCase();
    const email = (res?.email || "").toLowerCase();
    const phone = (res?.phone || "").toLowerCase();
    const destHome = (item.destinationCareHome?.name || "").toLowerCase();
    const destOrg = (item.destinationOrganisation?.name || "").toLowerCase();
    const s = search.toLowerCase();

    return (
      fullName.includes(s) ||
      email.includes(s) ||
      phone.includes(s) ||
      destHome.includes(s) ||
      destOrg.includes(s) ||
      (item.publicId || "").toLowerCase().includes(s)
    );
  });

  // Action handlers
  const handleConfirmApproval = async () => {
    if (!approvingAdmission) return;
    try {
      await approveMutation.mutateAsync(approvingAdmission.publicId);
      setApprovingAdmission(null);
      if (viewingAdmission?.publicId === approvingAdmission.publicId) {
        setViewingAdmission(null);
      }
    } catch {
      // Toast handled by mutation hook
    }
  };

  const handleConfirmRejection = async () => {
    if (!rejectingAdmission) return;
    const trimmed = rejectionReason.trim();
    if (!trimmed) return;
    try {
      await rejectMutation.mutateAsync({
        publicId: rejectingAdmission.publicId,
        reason: trimmed,
      });
      setRejectingAdmission(null);
      setRejectionReason("");
      if (viewingAdmission?.publicId === rejectingAdmission.publicId) {
        setViewingAdmission(null);
      }
    } catch {
      // Toast handled by mutation hook
    }
  };

  // --------------------------------------------------------------------------
  // RESIDENT SELF-PORTAL VIEW (When authenticated user role is RESIDENT)
  // --------------------------------------------------------------------------
  if (currentRole === "RESIDENT") {
    return (
      <div className="space-y-6 max-w-5xl mx-auto">
        <section className="relative overflow-hidden rounded-md bg-gradient-to-br from-teal-brand to-teal-deep p-6 sm:p-8 text-white shadow-lg shadow-teal-brand/20">
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center gap-5">
            <Avatar name={user.name} size="lg" className="!ring-white/30" />
            <div className="min-w-0">
              <span className="inline-flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-full bg-white/15 font-semibold tracking-wide backdrop-blur-sm">
                <Heart className="h-3 w-3" />
                Resident & Family Portal
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mt-2 leading-tight">
                Welcome back, {user.name}
              </h1>
              <p className="text-white/80 text-sm mt-1">
                {user.organisationName} • {user.careHomeName}
              </p>
            </div>
          </div>
          <div className="absolute right-6 -bottom-10 w-44 h-44 rounded-full bg-white/10 blur-2xl pointer-events-none animate-float-slow" />
          <div className="absolute -left-10 -top-10 w-32 h-32 rounded-full bg-mint/20 blur-2xl pointer-events-none" />
        </section>

        <Panel
          title="Resident Account Details"
          description="Your registered contact and facility information"
          icon={Heart}
        >
          <dl className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-md bg-cream/50 border border-ink/[0.06]">
              <DataItem label="Email Address" icon={Mail}>
                {user.email || "—"}
              </DataItem>
            </div>
            <div className="p-4 rounded-md bg-cream/50 border border-ink/[0.06]">
              <DataItem label="Organisation" icon={Building2}>
                <span className="text-teal-deep">
                  {user.organisationName || "—"}
                </span>
              </DataItem>
            </div>
            <div className="p-4 rounded-md bg-cream/50 border border-ink/[0.06]">
              <DataItem label="Assigned Care Facility" icon={Home}>
                {user.careHomeName || "Pending Facility Allocation"}
              </DataItem>
            </div>
          </dl>

          <div className="mt-4 flex items-start gap-3 p-4 rounded-md bg-mint/40 border border-teal-brand/20">
            <span className="grid place-items-center w-9 h-9 rounded-md bg-white text-teal-brand shadow-sm shrink-0">
              <ShieldCheck className="h-4 w-4" />
            </span>
            <div className="min-w-0">
              <h3 className="text-sm font-semibold text-teal-deep">
                Active Onboarding Status
              </h3>
              <p className="text-xs text-ink/75 mt-1 leading-relaxed">
                Your resident profile and care directives are registered with{" "}
                <span className="font-bold">{user.careHomeName}</span>. Any
                care plan modifications or visit appointments can be
                coordinated through your primary care staff.
              </p>
            </div>
          </div>
        </Panel>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // STAFF & ADMIN VIEW: Resident Admissions & Intake Directory
  // --------------------------------------------------------------------------
  const pagination =
    totalPages > 1 ? (
      <div className="px-5 py-3.5 border-t border-ink/[0.06] bg-[#f8faf9] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-ink/60">
        <span className="tabular-nums">
          Page {page + 1} of {totalPages}
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
    ) : null;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        icon={Users}
        eyebrow={
          <Badge tone="teal" dot>
            {isLoading ? "—" : totalElements} Records
          </Badge>
        }
        title="Residents & Admissions Review"
        description="Review resident applications, verify clinical directives, and admit or reject intake requests."
        actions={
          <button
            onClick={() => refetch()}
            disabled={isLoading}
            className={btn.secondary}
          >
            <RefreshCw
              className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
        }
      />

      {/* Filters Bar */}
      <Toolbar>
        <Segmented<AdmissionStatus>
          value={selectedStatus}
          onChange={(v) => {
            setSelectedStatus(v);
            setPage(0);
          }}
          options={STATUS_FILTERS.map((st) => ({
            value: st.value,
            label: st.label,
            count:
              selectedStatus === st.value && !isLoading
                ? totalElements
                : undefined,
          }))}
          className="shrink-0"
        />
        <SearchField
          value={search}
          onChange={setSearch}
          placeholder="Search by resident name, email, phone, facility..."
        />
        <div className="text-xs text-ink/55 font-medium whitespace-nowrap md:pr-2 tabular-nums">
          Showing {filteredAdmissions.length} of {totalElements} admissions
        </div>
      </Toolbar>

      {/* Admissions List */}
      <div>
        {isLoading ? (
          <Panel flush>
            <SkeletonRows rows={5} />
          </Panel>
        ) : isError ? (
          <ErrorState
            title="Failed to load resident admissions"
            message="There was an issue communicating with the backend admissions service."
            onRetry={() => refetch()}
          />
        ) : filteredAdmissions.length === 0 ? (
          <Panel flush>
            <EmptyState
              icon={Users}
              title={`No ${selectedStatus.toLowerCase()} resident admissions found`}
              description={
                search
                  ? "No resident admission matched your current search filters. Try clearing your search."
                  : `There are currently no resident admission requests flagged with status ${selectedStatus}.`
              }
              action={
                search ? (
                  <button
                    onClick={() => setSearch("")}
                    className={`${btn.secondary} ${btn.sm}`}
                  >
                    Clear Search
                  </button>
                ) : undefined
              }
            />
            {pagination}
          </Panel>
        ) : (
          <>
            {/* Desktop table */}
            <Panel flush className="hidden md:block">
              <div className={table.wrap}>
                <table className={table.table}>
                  <thead>
                    <tr>
                      <th className={table.th}>Resident Details</th>
                      <th className={table.th}>Destination Facility</th>
                      <th className={table.th}>Clinical / Directives</th>
                      <th className={table.th}>Application Date</th>
                      <th className={table.th}>Status</th>
                      <th className={`${table.th} text-right`}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAdmissions.map((adm) => {
                      const res = adm.resident;
                      const fullName =
                        res?.firstName || res?.lastName
                          ? `${res.firstName} ${
                              res.middleName ? res.middleName + " " : ""
                            }${res.lastName}`
                          : "Unnamed Resident";
                      const age = calculateAge(res?.dateOfBirth);

                      return (
                        <tr
                          key={adm.publicId}
                          className={`${table.tr} cursor-pointer`}
                          onClick={() => setViewingAdmission(adm)}
                        >
                          <td className={table.td}>
                            <div className="flex items-center gap-3 min-w-0">
                              <Avatar name={fullName} />
                              <div className="min-w-0">
                                <div className="font-semibold text-sm text-ink flex items-center gap-2">
                                  <span className="truncate max-w-[200px] group-hover:text-teal-deep transition-colors">
                                    {fullName}
                                  </span>
                                  {res?.gender && (
                                    <Badge tone="slate">{res.gender}</Badge>
                                  )}
                                </div>
                                <div className="text-[11px] text-ink/55 flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-0.5">
                                  {res?.dateOfBirth && (
                                    <span className="whitespace-nowrap">
                                      DOB: {res.dateOfBirth}
                                      {age !== null ? ` (${age} yrs)` : ""}
                                    </span>
                                  )}
                                  {res?.email && (
                                    <>
                                      <span className="text-ink/25">•</span>
                                      <span className="truncate max-w-[140px]">
                                        {res.email}
                                      </span>
                                    </>
                                  )}
                                  {res?.phone && (
                                    <>
                                      <span className="text-ink/25">•</span>
                                      <span className="whitespace-nowrap">
                                        {res.phone}
                                      </span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>

                          <td className={table.td}>
                            <div className="font-medium text-ink flex items-center gap-1.5 whitespace-nowrap">
                              <Home className="h-3.5 w-3.5 text-teal-brand shrink-0" />
                              <span>
                                {adm.destinationCareHome?.name ||
                                  "Unspecified Facility"}
                              </span>
                            </div>
                            <div className="text-[11px] text-ink/55 flex items-center gap-1 mt-0.5 whitespace-nowrap">
                              <Building2 className="h-3 w-3 shrink-0" />
                              <span>
                                {adm.destinationOrganisation?.name ||
                                  "Organisation"}
                              </span>
                            </div>
                          </td>

                          <td className={`${table.td} max-w-xs`}>
                            {res?.medicalNotes ? (
                              <p className="flex items-center gap-1.5 text-[11px] text-[#b4532f] font-medium">
                                <AlertCircle className="h-3.5 w-3.5 shrink-0 text-coral" />
                                <span className="truncate max-w-[200px]">
                                  {res.medicalNotes}
                                </span>
                              </p>
                            ) : (
                              <span className="text-[11px] text-ink/40 italic">
                                No medical notes
                              </span>
                            )}
                            {adm.sourceCareHome && (
                              <Badge
                                tone="violet"
                                icon={ArrowLeftRight}
                                className="mt-1"
                              >
                                Transfer from {adm.sourceCareHome.name}
                              </Badge>
                            )}
                          </td>

                          <td className={`${table.td} whitespace-nowrap text-ink/65 tabular-nums`}>
                            {adm.createdAt
                              ? new Date(adm.createdAt).toLocaleDateString(
                                  "en-GB",
                                  {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                  },
                                )
                              : "—"}
                          </td>

                          <td className={table.td}>
                            <StatusBadge status={adm.status} />
                          </td>

                          <td className={`${table.td} text-right`}>
                            <div
                              className="flex items-center justify-end gap-1.5"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <button
                                onClick={() => setViewingAdmission(adm)}
                                className={`${btn.ghost} ${btn.sm} text-teal-deep`}
                              >
                                <Eye className="h-3.5 w-3.5" />
                                Inspect
                              </button>

                              {canReview && adm.status === "PENDING" && (
                                <>
                                  <button
                                    onClick={() => setApprovingAdmission(adm)}
                                    className={`${btn.primary} ${btn.sm}`}
                                  >
                                    <CheckCircle2 className="h-3.5 w-3.5" />
                                    Approve
                                  </button>
                                  <button
                                    onClick={() => {
                                      setRejectingAdmission(adm);
                                      setRejectionReason("");
                                    }}
                                    className={`${btn.dangerSoft} ${btn.sm}`}
                                  >
                                    <XCircle className="h-3.5 w-3.5" />
                                    Reject
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              {pagination}
            </Panel>

            {/* Mobile cards */}
            <div className="md:hidden space-y-3">
              {filteredAdmissions.map((adm) => {
                const res = adm.resident;
                const fullName =
                  res?.firstName || res?.lastName
                    ? `${res.firstName} ${
                        res.middleName ? res.middleName + " " : ""
                      }${res.lastName}`
                    : "Unnamed Resident";
                const age = calculateAge(res?.dateOfBirth);

                return (
                  <article
                    key={adm.publicId}
                    onClick={() => setViewingAdmission(adm)}
                    className="bg-white border border-ink/[0.08] rounded-md p-4 cursor-pointer transition-all hover:-translate-y-0.5 active:translate-y-0"
                  >
                    <div className="flex items-start gap-3">
                      <Avatar name={fullName} size="lg" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-semibold text-ink leading-snug truncate">
                            {fullName}
                          </h3>
                          <StatusBadge status={adm.status} className="shrink-0" />
                        </div>
                        <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[11px] text-ink/55">
                          {res?.gender && <Badge tone="slate">{res.gender}</Badge>}
                          {res?.dateOfBirth && (
                            <span>
                              DOB: {res.dateOfBirth}
                              {age !== null ? ` (${age} yrs)` : ""}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 grid grid-cols-1 gap-1.5 text-xs text-ink/70">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <Home className="h-3.5 w-3.5 text-teal-brand shrink-0" />
                        <span className="font-medium text-ink truncate">
                          {adm.destinationCareHome?.name ||
                            "Unspecified Facility"}
                        </span>
                        <span className="text-ink/30">·</span>
                        <span className="truncate text-ink/55">
                          {adm.destinationOrganisation?.name || "Organisation"}
                        </span>
                      </div>
                      {res?.email && (
                        <div className="flex items-center gap-1.5 min-w-0">
                          <Mail className="h-3.5 w-3.5 text-ink/35 shrink-0" />
                          <span className="truncate">{res.email}</span>
                        </div>
                      )}
                      {res?.phone && (
                        <div className="flex items-center gap-1.5">
                          <Phone className="h-3.5 w-3.5 text-ink/35 shrink-0" />
                          <span>{res.phone}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-ink/35 shrink-0" />
                        <span>
                          {adm.createdAt
                            ? new Date(adm.createdAt).toLocaleDateString(
                                "en-GB",
                                {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                },
                              )
                            : "—"}
                        </span>
                      </div>
                    </div>

                    {res?.medicalNotes ? (
                      <p className="mt-3 flex items-start gap-1.5 p-2.5 rounded-md bg-coral-soft/60 border border-coral/20 text-[11px] text-[#b4532f] font-medium">
                        <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-px text-coral" />
                        <span className="line-clamp-2">{res.medicalNotes}</span>
                      </p>
                    ) : (
                      <p className="mt-3 text-[11px] text-ink/40 italic">
                        No medical notes
                      </p>
                    )}
                    {adm.sourceCareHome && (
                      <Badge tone="violet" icon={ArrowLeftRight} className="mt-2">
                        Transfer from {adm.sourceCareHome.name}
                      </Badge>
                    )}

                    <div
                      className="mt-4 pt-3 border-t border-ink/[0.06] flex flex-wrap items-center gap-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => setViewingAdmission(adm)}
                        className={`${btn.secondary} ${btn.sm} flex-1`}
                      >
                        <Eye className="h-3.5 w-3.5" />
                        Inspect
                      </button>

                      {canReview && adm.status === "PENDING" && (
                        <>
                          <button
                            onClick={() => setApprovingAdmission(adm)}
                            className={`${btn.primary} ${btn.sm} flex-1`}
                          >
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Approve
                          </button>
                          <button
                            onClick={() => {
                              setRejectingAdmission(adm);
                              setRejectionReason("");
                            }}
                            className={`${btn.dangerSoft} ${btn.sm} flex-1`}
                          >
                            <XCircle className="h-3.5 w-3.5" />
                            Reject
                          </button>
                        </>
                      )}
                    </div>
                  </article>
                );
              })}
              {pagination && (
                <div className="bg-white border border-ink/[0.08] rounded-md overflow-hidden">
                  {pagination}
                </div>
              )}
            </div>
          </>
        )}

        {/* Pagination for loading / error states (same condition as before) */}
        {(isLoading || isError) && pagination && (
          <div className="mt-3 bg-white border border-ink/[0.08] rounded-md overflow-hidden">
            {pagination}
          </div>
        )}
      </div>

      {/* -------------------------------------------------------------------- */}
      {/* MODAL 1: Full Admission Details & Inspection Modal                   */}
      {/* -------------------------------------------------------------------- */}
      {viewingAdmission && (
        <Modal
          open
          onClose={() => setViewingAdmission(null)}
          size="lg"
          title={
            <>
              {viewingAdmission.resident?.firstName || ""}{" "}
              {viewingAdmission.resident?.middleName
                ? viewingAdmission.resident.middleName + " "
                : ""}
              {viewingAdmission.resident?.lastName || "Unnamed Resident"}
            </>
          }
          description={
            <>
              Target Facility:{" "}
              {viewingAdmission.destinationCareHome?.name || "Unassigned"} (
              {viewingAdmission.destinationOrganisation?.name})
            </>
          }
          icon={UserCheck}
          footer={
            <>
              <button
                onClick={() => setViewingAdmission(null)}
                className={`${btn.secondary} sm:mr-auto`}
              >
                Close
              </button>

              {canReview && viewingAdmission.status === "PENDING" && (
                <>
                  <button
                    onClick={() => {
                      setRejectingAdmission(viewingAdmission);
                      setRejectionReason("");
                    }}
                    className={btn.dangerSoft}
                  >
                    <XCircle className="h-4 w-4" />
                    Reject Admission
                  </button>
                  <button
                    onClick={() => setApprovingAdmission(viewingAdmission)}
                    className={btn.primary}
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Approve Admission
                  </button>
                </>
              )}
            </>
          }
        >
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={viewingAdmission.status} />
              <span className="text-[11px] font-mono text-ink/45 break-all">
                ID: {viewingAdmission.publicId}
              </span>
            </div>

            {/* Resident Demographics */}
            <section className="space-y-3">
              <h3 className="text-[11px] font-semibold text-ink/60 uppercase tracking-wider">
                Resident Profile & Demographics
              </h3>
              <dl className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-md bg-cream/50 border border-ink/[0.06]">
                  <DataItem label="Date of Birth" icon={Calendar}>
                    {viewingAdmission.resident?.dateOfBirth || "Not provided"}
                  </DataItem>
                </div>
                <div className="p-3 rounded-md bg-cream/50 border border-ink/[0.06]">
                  <DataItem label="Gender">
                    {viewingAdmission.resident?.gender || "Not provided"}
                  </DataItem>
                </div>
                <div className="p-3 rounded-md bg-cream/50 border border-ink/[0.06]">
                  <DataItem label="Contact Phone" icon={Phone}>
                    {viewingAdmission.resident?.phone || "None listed"}
                  </DataItem>
                </div>
                <div className="p-3 rounded-md bg-cream/50 border border-ink/[0.06] col-span-2">
                  <DataItem label="Email Address" icon={Mail}>
                    {viewingAdmission.resident?.email || "None listed"}
                  </DataItem>
                </div>
                <div className="p-3 rounded-md bg-cream/50 border border-ink/[0.06]">
                  <DataItem label="Onboarding Status">
                    <span className="text-teal-deep">
                      {viewingAdmission.resident?.onboardingStatus || "ACTIVE"}
                    </span>
                  </DataItem>
                </div>
              </dl>

              {viewingAdmission.resident?.address && (
                <div className="flex items-start gap-2.5 p-3 rounded-md bg-cream/50 border border-ink/[0.06]">
                  <MapPin className="h-4 w-4 text-teal-brand shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <span className="block text-[11px] font-medium uppercase tracking-wider text-ink/45">
                      Residential Address
                    </span>
                    <span className="text-sm font-medium text-ink break-words">
                      {viewingAdmission.resident.address}
                    </span>
                  </div>
                </div>
              )}
            </section>

            {/* Medical Directives & Notes */}
            <section className="space-y-3">
              <h3 className="text-[11px] font-semibold text-ink/60 uppercase tracking-wider flex items-center gap-1.5">
                <AlertCircle className="h-3.5 w-3.5 text-coral" />
                Medical Directives & Clinical Notes
              </h3>
              <div
                className={`p-4 rounded-md text-sm leading-relaxed whitespace-pre-wrap border ${
                  viewingAdmission.resident?.medicalNotes
                    ? "bg-coral-soft/50 border-coral/25 text-[#8a3f22] border-l-4 border-l-coral"
                    : "bg-cream/50 border-ink/[0.08] text-ink/65"
                }`}
              >
                {viewingAdmission.resident?.medicalNotes ||
                  "No specific clinical notes or allergy directives were recorded with this intake application."}
              </div>
            </section>

            {/* Transfer Information if present */}
            {viewingAdmission.sourceCareHome && (
              <section className="space-y-3">
                <h3 className="text-[11px] font-semibold text-[#5144a8] uppercase tracking-wider flex items-center gap-1.5">
                  <ArrowLeftRight className="h-3.5 w-3.5" />
                  Inter-Facility Transfer Data
                </h3>
                <div className="flex items-start gap-3 p-3.5 rounded-md bg-lilac-soft/60 border border-lilac/25 text-xs">
                  <Building className="h-4 w-4 text-lilac shrink-0 mt-0.5" />
                  <div className="space-y-1 min-w-0">
                    <p className="text-[#3d3380] font-semibold text-sm">
                      Origin Facility: {viewingAdmission.sourceCareHome.name} (
                      {viewingAdmission.sourceOrganisation?.name})
                    </p>
                    {viewingAdmission.transferReason && (
                      <p className="text-[#5144a8]">
                        Reason for Transfer: {viewingAdmission.transferReason}
                      </p>
                    )}
                  </div>
                </div>
              </section>
            )}

            {/* Review Audit Info (if reviewed or rejected) */}
            {(viewingAdmission.reviewedAt ||
              viewingAdmission.rejectionReason) && (
              <section className="space-y-3">
                <h3 className="text-[11px] font-semibold text-ink/60 uppercase tracking-wider">
                  Review Audit Record
                </h3>
                <div className="p-3.5 rounded-md bg-cream/50 border border-ink/[0.08] text-xs space-y-1.5">
                  {viewingAdmission.reviewedAt && (
                    <p className="text-ink/65">
                      Reviewed on:{" "}
                      <span className="font-semibold text-ink">
                        {new Date(
                          viewingAdmission.reviewedAt,
                        ).toLocaleString()}
                      </span>
                    </p>
                  )}
                  {viewingAdmission.reviewedBy && (
                    <p className="text-ink/65">
                      Reviewer:{" "}
                      <span className="font-semibold text-ink">
                        {viewingAdmission.reviewedBy.firstName}{" "}
                        {viewingAdmission.reviewedBy.lastName} (
                        {viewingAdmission.reviewedBy.email})
                      </span>
                    </p>
                  )}
                  {viewingAdmission.rejectionReason && (
                    <div className="p-2.5 rounded-md bg-red-50 text-red-800 border border-red-200 mt-2">
                      <span className="font-bold block text-[10px] uppercase tracking-wider">
                        Rejection Reason:
                      </span>
                      {viewingAdmission.rejectionReason}
                    </div>
                  )}
                </div>
              </section>
            )}
          </div>
        </Modal>
      )}

      {/* -------------------------------------------------------------------- */}
      {/* MODAL 2: Approve Admission Confirmation Modal                        */}
      {/* -------------------------------------------------------------------- */}
      {approvingAdmission && (
        <Modal
          open
          onClose={() => {
            if (!approveMutation.isPending) setApprovingAdmission(null);
          }}
          size="sm"
          icon={CheckCircle2}
          title="Confirm Admission Approval"
          description="Are you sure you want to approve the admission of:"
          footer={
            <>
              <button
                type="button"
                disabled={approveMutation.isPending}
                onClick={() => setApprovingAdmission(null)}
                className={btn.secondary}
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={approveMutation.isPending}
                onClick={handleConfirmApproval}
                className={btn.primary}
              >
                {approveMutation.isPending && <Spinner className="h-4 w-4" />}
                {approveMutation.isPending ? "Approving..." : "Confirm & Admit"}
              </button>
            </>
          }
        >
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 rounded-md bg-mint/40 border border-teal-brand/15">
              <Avatar
                name={`${approvingAdmission.resident?.firstName ?? ""} ${
                  approvingAdmission.resident?.lastName ?? ""
                }`}
              />
              <div className="min-w-0">
                <p className="font-semibold text-sm text-teal-deep truncate">
                  {approvingAdmission.resident?.firstName}{" "}
                  {approvingAdmission.resident?.lastName}
                </p>
                <p className="text-xs text-ink/60">
                  to{" "}
                  <span className="font-semibold text-ink">
                    {approvingAdmission.destinationCareHome?.name ||
                      "designated care facility"}
                  </span>
                  ?
                </p>
              </div>
            </div>

            <ul className="space-y-2 text-xs text-ink/70">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-px" />
                <span>
                  Onboarding status will be confirmed as{" "}
                  <span className="font-bold text-emerald-700">APPROVED</span>.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-px" />
                <span>
                  Care staff at{" "}
                  {approvingAdmission.destinationCareHome?.name || "the home"}{" "}
                  will be notified to arrange bed assignment and intake
                  routines.
                </span>
              </li>
            </ul>
          </div>
        </Modal>
      )}

      {/* -------------------------------------------------------------------- */}
      {/* MODAL 3: Reject Admission Modal (with Required Reason)               */}
      {/* -------------------------------------------------------------------- */}
      {rejectingAdmission && (
        <Modal
          open
          onClose={() => {
            if (rejectMutation.isPending) return;
            setRejectingAdmission(null);
            setRejectionReason("");
          }}
          size="sm"
          tone="danger"
          icon={XCircle}
          title="Reject Admission Application"
          description={
            <>
              You are about to reject the admission of{" "}
              <span className="font-semibold text-ink">
                {rejectingAdmission.resident?.firstName}{" "}
                {rejectingAdmission.resident?.lastName}
              </span>
              .
            </>
          }
          footer={
            <>
              <button
                type="button"
                disabled={rejectMutation.isPending}
                onClick={() => {
                  setRejectingAdmission(null);
                  setRejectionReason("");
                }}
                className={btn.secondary}
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={rejectMutation.isPending || !rejectionReason.trim()}
                onClick={handleConfirmRejection}
                className={btn.danger}
              >
                {rejectMutation.isPending && <Spinner className="h-4 w-4" />}
                {rejectMutation.isPending ? "Rejecting..." : "Confirm Rejection"}
              </button>
            </>
          }
        >
          <div>
            <label className={field.label} htmlFor="rejection-reason">
              Rejection Reason <span className="text-red-600">*</span>
            </label>
            <textarea
              id="rejection-reason"
              rows={4}
              required
              placeholder="Specify clinical incapacity, registration discrepancy, or lack of vacancy..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className={`${field.input} resize-none focus:!border-red-500 focus:!ring-red-500/10`}
            />
            <p className={field.hint}>
              This explanation will be permanently recorded in the audit trail.
            </p>
          </div>
        </Modal>
      )}
    </div>
  );
}
