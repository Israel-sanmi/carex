"use client";

import { useState } from "react";
import Link from "next/link";
import { useRole } from "@/lib/role-context";
import {
  useResidentRegistrations,
  useAdmitResidentMutation,
  useRejectResidentMutation,
} from "@/lib/hooks/use-registrations";
import { useOrganisations } from "@/lib/hooks/use-organisations";
import { useCareHomesByOrganisation } from "@/lib/hooks/use-care-homes";
import {
  ResidentOnboardingStatus,
  ResidentRegistrationItem,
} from "@/lib/api-registrations";
import { toast } from "@/components/ui/toast";
import StatCard from "@/components/dashboard/stat-card";
import {
  Avatar,
  Badge,
  type BadgeTone,
  DataItem,
  EmptyState,
  ErrorState,
  Modal,
  PageHeader,
  Panel,
  SearchField,
  Segmented,
  SkeletonRows,
  Spinner,
  Toolbar,
  btn,
  field,
  table,
} from "@/components/dashboard/ui";
import {
  Users,
  CheckCircle2,
  XCircle,
  Building2,
  Home,
  Eye,
  Calendar,
  Mail,
  Phone,
  MapPin,
  RefreshCw,
  X,
  Check,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  ClipboardList,
  ListFilter,
  FileStack,
  Search,
  Layers,
} from "lucide-react";

/* Presentation-only helpers ---------------------------------------- */

const statusTone: Record<ResidentOnboardingStatus, BadgeTone> = {
  PENDING_VERIFICATION: "amber",
  VERIFIED: "sky",
  PLACED: "green",
  REJECTED: "red",
};

const statusIcon = {
  PENDING_VERIFICATION: Mail,
  VERIFIED: CheckCircle2,
  PLACED: Home,
  REJECTED: XCircle,
} as const;

function OnboardingBadge({ status }: { status: ResidentOnboardingStatus }) {
  return (
    <Badge tone={statusTone[status] ?? "red"} icon={statusIcon[status] ?? XCircle}>
      {status.replace(/_/g, " ")}
    </Badge>
  );
}

function fullNameOf(res: ResidentRegistrationItem) {
  return `${res.firstName || ""} ${res.middleName ? res.middleName + " " : ""}${res.lastName || ""}`.trim();
}

export default function RegistrationsPage() {
  const { roleAssignments } = useRole();

  // Status Filter
  const [selectedStatus, setSelectedStatus] =
    useState<ResidentOnboardingStatus>("VERIFIED");
  const [page, setPage] = useState(0);
  const [pageSize] = useState(20);
  const [searchTerm, setSearchTerm] = useState("");

  // Modals state
  const [admitTarget, setAdmitTarget] =
    useState<ResidentRegistrationItem | null>(null);
  const [rejectTarget, setRejectTarget] =
    useState<ResidentRegistrationItem | null>(null);
  const [viewTarget, setViewTarget] = useState<ResidentRegistrationItem | null>(
    null,
  );

  // Admit form state
  const [admitOrgId, setAdmitOrgId] = useState<string>("");
  const [admitCareHomeId, setAdmitCareHomeId] = useState<string>("");
  const [admissionDate, setAdmissionDate] = useState<string>("");

  // Reject form state
  const [rejectionReason, setRejectionReason] = useState("");

  // React Query hooks
  const { data, isLoading, isError, error, refetch, isFetching } =
    useResidentRegistrations(selectedStatus, page, pageSize);

  const admitMutation = useAdmitResidentMutation();
  const rejectMutation = useRejectResidentMutation();

  // On-demand fetch of organisations when Admit modal is open
  const { data: orgsData, isLoading: isLoadingOrgs } = useOrganisations(
    { page: 0, size: 100 },
    { enabled: Boolean(admitTarget) },
  );

  // On-demand fetch of care homes for selected organisation when Admit modal is open
  const { data: careHomesData, isLoading: isLoadingHomes } =
    useCareHomesByOrganisation(
      admitOrgId || null,
      { page: 0, size: 100 },
      { enabled: Boolean(admitTarget && admitOrgId) },
    );

  // Handle open admit modal
  const handleOpenAdmit = (resident: ResidentRegistrationItem) => {
    setAdmitTarget(resident);
    const defaultOrg =
      roleAssignments.find((ra) => ra.organisationPublicId)
        ?.organisationPublicId || "";
    setAdmitOrgId(defaultOrg);

    const defaultHome =
      roleAssignments.find((ra) => ra.careHomePublicId)?.careHomePublicId || "";
    setAdmitCareHomeId(defaultHome);
    setAdmissionDate(new Date().toISOString().split("T")[0]);
  };

  // Submit admit
  const handleConfirmAdmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!admitTarget) return;

    if (!admitOrgId) {
      toast.error("Please select a destination organisation");
      return;
    }
    if (!admitCareHomeId) {
      toast.error("Please select an assigned care home facility");
      return;
    }
    if (!admissionDate) {
      toast.error("Please provide a valid admission date");
      return;
    }

    try {
      await admitMutation.mutateAsync({
        residentPublicId: admitTarget.publicId,
        payload: {
          organisationPublicId: admitOrgId,
          careHomePublicId: admitCareHomeId,
          admissionDate,
        },
      });
      setAdmitTarget(null);
    } catch {
      // Toast is handled in mutation hook
    }
  };

  // Handle open reject modal
  const handleOpenReject = (resident: ResidentRegistrationItem) => {
    setRejectTarget(resident);
    setRejectionReason("");
  };

  // Submit reject
  const handleConfirmReject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectTarget) return;

    if (!rejectionReason.trim()) {
      toast.error("Rejection reason is required");
      return;
    }

    try {
      await rejectMutation.mutateAsync({
        residentPublicId: rejectTarget.publicId,
        payload: {
          reason: rejectionReason.trim(),
        },
      });
      setRejectTarget(null);
    } catch {
      // Toast is handled in mutation hook
    }
  };

  // Filter content by search
  const content = data?.content || [];
  const filteredResidents = content.filter((r) => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    const fullName =
      `${r.firstName || ""} ${r.middleName || ""} ${r.lastName || ""}`.toLowerCase();
    return (
      fullName.includes(q) ||
      (r.email && r.email.toLowerCase().includes(q)) ||
      (r.phone && r.phone.toLowerCase().includes(q)) ||
      (r.address && r.address.toLowerCase().includes(q)) ||
      (r.publicId && r.publicId.toLowerCase().includes(q))
    );
  });

  const statuses: {
    label: string;
    value: ResidentOnboardingStatus;
    badgeColor: string;
  }[] = [
    {
      label: "Email Verified",
      value: "VERIFIED",
      badgeColor: "bg-sky-100 text-sky-800 border-sky-200",
    },
    {
      label: "Admitted & Placed",
      value: "PLACED",
      badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-200",
    },
    {
      label: "Rejected",
      value: "REJECTED",
      badgeColor: "bg-rose-100 text-rose-800 border-rose-200",
    },
    {
      label: "Pending Verification",
      value: "PENDING_VERIFICATION",
      badgeColor: "bg-amber-100 text-amber-800 border-amber-200",
    },
  ];

  const activeStatusLabel =
    statuses.find((s) => s.value === selectedStatus)?.label ?? selectedStatus;

  return (
    <div className="space-y-6 text-ink">
      {/* Page Title & Action Bar */}
      <PageHeader
        icon={UserCheck}
        eyebrow={
          <Badge tone="teal" dot>
            {data?.totalSize ?? 0} Registrations
          </Badge>
        }
        title="Admissions & Intake Registrations"
        description="Review self-registered resident applicants, verify accounts, admit into care homes, or reject applications."
        actions={
          <>
            <button
              type="button"
              onClick={() => refetch()}
              disabled={isFetching}
              className={btn.secondary}
              title="Refresh registrations"
            >
              <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
              <span>Refresh</span>
            </button>
            <Link href="/dashboard/invitations" className={`${btn.primary} group`}>
              <Mail className="h-4 w-4 transition-transform group-hover:-rotate-12" />
              <span>Send Invitation</span>
            </Link>
          </>
        }
      />

      {/* Summary (derived from the already-loaded page) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label={activeStatusLabel}
          value={data?.totalSize ?? 0}
          icon={ClipboardList}
          tone="teal"
          hint="Total records in this status"
          hintMuted
        />
        <StatCard
          label="Loaded on this page"
          value={content.length}
          icon={FileStack}
          tone="sky"
          hint={`Up to ${pageSize} per page`}
          hintMuted
        />
        <StatCard
          label="Matching search"
          value={filteredResidents.length}
          icon={ListFilter}
          tone="lilac"
          hint={searchTerm ? `For “${searchTerm}”` : "No search applied"}
          hintMuted
        />
        <StatCard
          label="Page"
          value={`${page + 1} / ${Math.max(1, data?.totalPages ?? 1)}`}
          icon={Layers}
          tone="sun"
          hint={isFetching ? "Refreshing…" : "Up to date"}
          hintMuted
        />
      </div>

      {/* Status filter + search */}
      <Toolbar className="md:flex-wrap">
        <Segmented<ResidentOnboardingStatus>
          value={selectedStatus}
          onChange={(v) => {
            setSelectedStatus(v);
            setPage(0);
          }}
          options={statuses.map((st) => ({
            value: st.value,
            label: st.label,
            count:
              selectedStatus === st.value && data?.totalSize !== undefined
                ? data.totalSize
                : undefined,
          }))}
          className="md:shrink-0"
        />
        <SearchField
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search by name, email, phone or address..."
          className="md:min-w-[16rem]"
        />
        <div className="text-xs text-ink/60 font-medium whitespace-nowrap md:ml-auto px-1">
          Showing{" "}
          <span className="font-semibold text-ink tabular-nums">
            {filteredResidents.length}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-ink tabular-nums">{data?.totalSize ?? 0}</span>{" "}
          records
        </div>
      </Toolbar>

      {/* Main Table or Loading / Error State */}
      <Panel flush>
        {isLoading ? (
          <div>
            <p className="sr-only">Loading resident registrations...</p>
            <SkeletonRows rows={6} />
          </div>
        ) : isError ? (
          <div className="p-5">
            <ErrorState
              title="Failed to load registrations"
              message={(error as Error | null)?.message || "Failed to load registrations"}
              onRetry={() => refetch()}
              retrying={isFetching}
            />
          </div>
        ) : filteredResidents.length === 0 ? (
          <EmptyState
            icon={searchTerm ? Search : Users}
            title="No registrations found"
            description={
              searchTerm
                ? `No registrations match your search "${searchTerm}".`
                : `There are currently no resident applications with status "${selectedStatus.replace(/_/g, " ")}".`
            }
          />
        ) : (
          <>
            {/* Desktop table */}
            <div className={`hidden md:block ${table.wrap}`}>
              <table className={table.table}>
                <thead>
                  <tr>
                    <th className={table.th}>Resident Applicant</th>
                    <th className={table.th}>Contact Details</th>
                    <th className={table.th}>Demographics</th>
                    <th className={table.th}>Address</th>
                    <th className={table.th}>Status & Source</th>
                    {selectedStatus === "REJECTED" && (
                      <th className={table.th}>Rejection Reason</th>
                    )}
                    <th className={`${table.th} text-right`}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredResidents.map((res) => {
                    const fullName = fullNameOf(res);

                    return (
                      <tr key={res.publicId} className={table.tr}>
                        {/* Name & ID */}
                        <td className={table.td}>
                          <div className="flex items-center gap-3">
                            <Avatar
                              name={`${res.firstName || ""} ${res.lastName || ""}`}
                              className="transition-transform group-hover:scale-105"
                            />
                            <div className="font-semibold text-sm text-ink whitespace-nowrap">
                              {fullName}
                            </div>
                          </div>
                        </td>

                        {/* Contact */}
                        <td className={`${table.td} text-xs`}>
                          <div className="flex items-center gap-1.5 text-ink/80 whitespace-nowrap">
                            <Mail className="h-3.5 w-3.5 text-ink/40" />
                            <span>{res.email || "—"}</span>
                          </div>
                          {res.phone && (
                            <div className="mt-0.5 flex items-center gap-1.5 text-ink/60 text-[11px] whitespace-nowrap">
                              <Phone className="h-3 w-3 text-ink/40" />
                              <span>{res.phone}</span>
                            </div>
                          )}
                        </td>

                        {/* Demographics */}
                        <td className={`${table.td} text-xs`}>
                          <div className="flex items-center gap-1.5 text-ink/80 whitespace-nowrap">
                            <Calendar className="h-3.5 w-3.5 text-ink/40" />
                            <span>{res.dateOfBirth || "—"}</span>
                          </div>
                          <div className="mt-0.5 text-[11px] text-ink/60 whitespace-nowrap">
                            Gender:{" "}
                            <span className="font-medium text-ink/80">
                              {res.gender || "—"}
                            </span>
                          </div>
                        </td>

                        {/* Address */}
                        <td className={`${table.td} text-xs max-w-[14rem] text-ink/70`}>
                          {res.address ? (
                            <div
                              className="flex items-center gap-1.5 min-w-0"
                              title={res.address}
                            >
                              <MapPin className="h-3.5 w-3.5 shrink-0 text-ink/40" />
                              <span className="truncate">{res.address}</span>
                            </div>
                          ) : (
                            "—"
                          )}
                        </td>

                        {/* Status & Source */}
                        <td className={table.td}>
                          <OnboardingBadge status={res.onboardingStatus} />
                          <div className="mt-1 text-[10px] text-ink/50 uppercase tracking-wider font-semibold whitespace-nowrap">
                            {res.registrationSource?.replace(/_/g, " ") ||
                              "SELF REGISTRATION"}
                          </div>
                        </td>

                        {/* Rejection Reason Column */}
                        {selectedStatus === "REJECTED" && (
                          <td className={`${table.td} max-w-xs text-red-700 text-xs font-medium`}>
                            {res.rejectionReason || "—"}
                          </td>
                        )}

                        {/* Actions */}
                        <td className={`${table.td} text-right`}>
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              onClick={() => setViewTarget(res)}
                              className={btn.icon}
                              title="View resident profile"
                              aria-label="View resident profile"
                            >
                              <Eye className="h-4 w-4" />
                            </button>

                            {(res.onboardingStatus === "PENDING_VERIFICATION" ||
                              res.onboardingStatus === "VERIFIED") && (
                              <>
                                <button
                                  onClick={() => handleOpenAdmit(res)}
                                  className={`${btn.primary} ${btn.sm} !bg-emerald-600 hover:!bg-emerald-700`}
                                >
                                  <Check className="h-3.5 w-3.5" />
                                  <span>Admit</span>
                                </button>

                                <button
                                  onClick={() => handleOpenReject(res)}
                                  className={`${btn.dangerSoft} ${btn.sm}`}
                                >
                                  <X className="h-3.5 w-3.5" />
                                  <span>Reject</span>
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

            {/* Mobile cards */}
            <ul className="md:hidden divide-y divide-ink/[0.06]">
              {filteredResidents.map((res) => {
                const fullName = fullNameOf(res);
                return (
                  <li key={res.publicId} className="p-4 space-y-3">
                    <div className="flex items-start gap-3">
                      <Avatar name={`${res.firstName || ""} ${res.lastName || ""}`} />
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-sm text-ink truncate">
                          {fullName}
                        </p>
                        <p className="text-[10px] text-ink/50 uppercase tracking-wider font-semibold">
                          {res.registrationSource?.replace(/_/g, " ") ||
                            "SELF REGISTRATION"}
                        </p>
                      </div>
                      <OnboardingBadge status={res.onboardingStatus} />
                    </div>

                    <div className="grid grid-cols-1 gap-1.5 text-xs text-ink/75">
                      <div className="flex items-center gap-2 min-w-0">
                        <Mail className="h-3.5 w-3.5 shrink-0 text-ink/40" />
                        <span className="truncate">{res.email || "—"}</span>
                      </div>
                      {res.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-3.5 w-3.5 shrink-0 text-ink/40" />
                          <span>{res.phone}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3.5 w-3.5 shrink-0 text-ink/40" />
                        <span>
                          {res.dateOfBirth || "—"}
                          <span className="text-ink/45"> · Gender: </span>
                          <span className="font-medium">{res.gender || "—"}</span>
                        </span>
                      </div>
                      {res.address && (
                        <div className="flex items-start gap-2 min-w-0">
                          <MapPin className="h-3.5 w-3.5 shrink-0 mt-0.5 text-ink/40" />
                          <span className="break-words">{res.address}</span>
                        </div>
                      )}
                    </div>

                    {selectedStatus === "REJECTED" && (
                      <p className="px-3 py-2 rounded-md bg-red-50 border border-red-200/70 text-xs font-medium text-red-700">
                        {res.rejectionReason || "—"}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => setViewTarget(res)}
                        className={`${btn.secondary} ${btn.sm}`}
                      >
                        <Eye className="h-3.5 w-3.5" />
                        <span>View</span>
                      </button>
                      {(res.onboardingStatus === "PENDING_VERIFICATION" ||
                        res.onboardingStatus === "VERIFIED") && (
                        <>
                          <button
                            onClick={() => handleOpenAdmit(res)}
                            className={`${btn.primary} ${btn.sm} !bg-emerald-600 hover:!bg-emerald-700`}
                          >
                            <Check className="h-3.5 w-3.5" />
                            <span>Admit</span>
                          </button>
                          <button
                            onClick={() => handleOpenReject(res)}
                            className={`${btn.dangerSoft} ${btn.sm}`}
                          >
                            <X className="h-3.5 w-3.5" />
                            <span>Reject</span>
                          </button>
                        </>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </>
        )}

        {/* Pagination Bar */}
        {data && data.totalPages > 1 && (
          <div className="px-4 sm:px-5 py-3.5 border-t border-ink/[0.06] bg-[#f8faf9] flex items-center justify-between gap-3 text-xs text-ink/70">
            <div>
              Page <span className="font-semibold text-ink">{page + 1}</span> of{" "}
              <span className="font-semibold text-ink">{data.totalPages}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0 || isLoading}
                className={`${btn.secondary} ${btn.sm} group`}
              >
                <ChevronLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
                <span className="hidden sm:inline">Previous</span>
              </button>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={page >= data.totalPages - 1 || isLoading}
                className={`${btn.secondary} ${btn.sm} group`}
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>
          </div>
        )}
      </Panel>

      {/* ADMIT RESIDENT MODAL */}
      {admitTarget && (
        <Modal
          open
          onClose={() => setAdmitTarget(null)}
          icon={CheckCircle2}
          title="Admit & Place Resident"
          description="Assign this applicant to an organisation and care home."
          footer={
            <>
              <button
                type="button"
                onClick={() => setAdmitTarget(null)}
                className={btn.secondary}
              >
                Cancel
              </button>
              <button
                type="submit"
                form="admit-resident-form"
                disabled={admitMutation.isPending}
                className={`${btn.primary} !bg-emerald-600 hover:!bg-emerald-700`}
              >
                {admitMutation.isPending && <Spinner className="h-4 w-4" />}
                <span>
                  {admitMutation.isPending
                    ? "Admitting..."
                    : "Confirm Admission"}
                </span>
                {!admitMutation.isPending && <Check className="h-4 w-4" />}
              </button>
            </>
          }
        >
          <div className="flex items-center gap-3 p-3.5 rounded-md bg-mint/40 border border-teal-brand/15 mb-5">
            <Avatar name={`${admitTarget.firstName || ""} ${admitTarget.lastName || ""}`} />
            <div className="min-w-0 text-xs">
              <div className="font-semibold text-sm text-ink truncate">
                {admitTarget.firstName} {admitTarget.lastName}
              </div>
              <div className="text-ink/65 flex flex-wrap items-center gap-x-3 gap-y-0.5">
                <span>DOB: {admitTarget.dateOfBirth}</span>
                <span className="hidden sm:inline">•</span>
                <span className="break-all">Email: {admitTarget.email}</span>
              </div>
            </div>
          </div>

          <form
            id="admit-resident-form"
            onSubmit={handleConfirmAdmit}
            className="space-y-4"
          >
            <div>
              <label className={`${field.label} flex items-center justify-between`}>
                <span className="flex items-center gap-1.5">
                  <Building2 className="h-3.5 w-3.5 text-teal-brand" />
                  <span>Destination Organisation *</span>
                </span>
                {isLoadingOrgs && (
                  <span className="text-[11px] font-medium text-ink/50 flex items-center gap-1">
                    <RefreshCw className="h-3 w-3 animate-spin text-teal-brand" />{" "}
                    Loading...
                  </span>
                )}
              </label>
              <select
                value={admitOrgId}
                onChange={(e) => {
                  setAdmitOrgId(e.target.value);
                  setAdmitCareHomeId("");
                }}
                disabled={isLoadingOrgs}
                className={field.input}
              >
                <option value="">
                  {isLoadingOrgs
                    ? "Loading organisations..."
                    : "-- Select an organisation --"}
                </option>
                {orgsData?.content
                  ?.filter((org) => org.status?.toUpperCase() === "ACTIVE")
                  ?.map((org) => (
                    <option key={org.publicId} value={org.publicId}>
                      {org.name}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className={`${field.label} flex items-center justify-between`}>
                <span className="flex items-center gap-1.5">
                  <Home className="h-3.5 w-3.5 text-teal-brand" />
                  <span>Care Home Facility *</span>
                </span>
                {isLoadingHomes && (
                  <span className="text-[11px] font-medium text-ink/50 flex items-center gap-1">
                    <RefreshCw className="h-3 w-3 animate-spin text-teal-brand" />{" "}
                    Loading...
                  </span>
                )}
              </label>
              <select
                value={admitCareHomeId}
                onChange={(e) => setAdmitCareHomeId(e.target.value)}
                disabled={!admitOrgId || isLoadingHomes}
                className={field.input}
              >
                <option value="">
                  {!admitOrgId
                    ? "Select an organisation above first..."
                    : isLoadingHomes
                      ? "Loading care homes..."
                      : (careHomesData?.content?.filter((h) => h.status?.toUpperCase() === "ACTIVE")?.length ?? 0) === 0
                        ? "No active care homes found for this organisation"
                        : "-- Select a care home --"}
                </option>
                {careHomesData?.content
                  ?.filter((home) => home.status?.toUpperCase() === "ACTIVE")
                  ?.map((home) => (
                    <option key={home.publicId} value={home.publicId}>
                      {home.name} {home.city ? `(${home.city})` : ""}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className={`${field.label} flex items-center gap-1.5`}>
                <Calendar className="h-3.5 w-3.5 text-teal-brand" />
                <span>Admission Date *</span>
              </label>
              <input
                type="date"
                required
                value={admissionDate}
                onChange={(e) => setAdmissionDate(e.target.value)}
                className={field.input}
              />
            </div>
          </form>
        </Modal>
      )}

      {/* REJECT RESIDENT MODAL */}
      {rejectTarget && (
        <Modal
          open
          onClose={() => setRejectTarget(null)}
          icon={XCircle}
          tone="danger"
          size="sm"
          title="Reject Application"
          footer={
            <>
              <button
                type="button"
                onClick={() => setRejectTarget(null)}
                className={btn.secondary}
              >
                Cancel
              </button>
              <button
                type="submit"
                form="reject-resident-form"
                disabled={rejectMutation.isPending}
                className={btn.danger}
              >
                {rejectMutation.isPending && <Spinner className="h-4 w-4" />}
                <span>
                  {rejectMutation.isPending
                    ? "Declining..."
                    : "Confirm Rejection"}
                </span>
                {!rejectMutation.isPending && <X className="h-4 w-4" />}
              </button>
            </>
          }
        >
          <p className="text-sm text-ink/70 leading-relaxed mb-4">
            You are declining the registration of{" "}
            <span className="font-semibold text-ink">
              {rejectTarget.firstName} {rejectTarget.lastName}
            </span>
            . Please state the administrative reason for this rejection.
          </p>

          <form
            id="reject-resident-form"
            onSubmit={handleConfirmReject}
            className="space-y-4"
          >
            <div>
              <label className={field.label}>Reason for Rejection *</label>
              <textarea
                required
                rows={4}
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="e.g. Incomplete verification documentation, facility at maximum capacity, or out of catchment area..."
                className={`${field.input} resize-y`}
              />
            </div>
          </form>
        </Modal>
      )}

      {/* VIEW DETAILS DRAWER / MODAL */}
      {viewTarget && (
        <Modal
          open
          onClose={() => setViewTarget(null)}
          icon={UserCheck}
          title="Resident Application Profile"
          footer={
            <button onClick={() => setViewTarget(null)} className={btn.primary}>
              Close
            </button>
          }
        >
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <Avatar
                size="lg"
                name={`${viewTarget.firstName || ""} ${viewTarget.lastName || ""}`}
              />
              <div className="min-w-0">
                <p className="font-semibold text-ink truncate">{fullNameOf(viewTarget)}</p>
                <div className="mt-1">
                  <OnboardingBadge status={viewTarget.onboardingStatus} />
                </div>
              </div>
            </div>

            <dl className="grid grid-cols-2 gap-4 p-4 rounded-md bg-[#f8faf9] border border-ink/[0.06]">
              <DataItem label="First Name">{viewTarget.firstName}</DataItem>
              <DataItem label="Last Name">{viewTarget.lastName}</DataItem>
              {viewTarget.middleName && (
                <DataItem label="Middle Name">{viewTarget.middleName}</DataItem>
              )}
              <DataItem label="Gender">{viewTarget.gender}</DataItem>
              <DataItem label="Date of Birth" icon={Calendar}>
                {viewTarget.dateOfBirth}
              </DataItem>
              <DataItem label="Onboarding Status">
                <span className="text-teal-deep">
                  {viewTarget.onboardingStatus.replace(/_/g, " ")}
                </span>
              </DataItem>
            </dl>

            <div className="space-y-2.5 text-sm">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="grid place-items-center w-8 h-8 rounded-md bg-mint text-teal-brand shrink-0">
                  <Mail className="h-4 w-4" />
                </span>
                <span className="font-medium text-ink break-all">
                  {viewTarget.email}
                </span>
              </div>
              {viewTarget.phone && (
                <div className="flex items-center gap-2.5">
                  <span className="grid place-items-center w-8 h-8 rounded-md bg-mint text-teal-brand shrink-0">
                    <Phone className="h-4 w-4" />
                  </span>
                  <span className="font-medium text-ink">
                    {viewTarget.phone}
                  </span>
                </div>
              )}
              {viewTarget.address && (
                <div className="flex items-start gap-2.5">
                  <span className="grid place-items-center w-8 h-8 rounded-md bg-mint text-teal-brand shrink-0">
                    <MapPin className="h-4 w-4" />
                  </span>
                  <span className="font-medium text-ink pt-1.5">
                    {viewTarget.address}
                  </span>
                </div>
              )}
            </div>

            {viewTarget.rejectionReason && (
              <div className="p-3.5 rounded-md bg-red-50 border border-red-200 text-red-800 space-y-1">
                <p className="font-semibold text-xs">Rejection Justification:</p>
                <p className="text-xs leading-relaxed">
                  {viewTarget.rejectionReason}
                </p>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}
