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
import {
  Users,
  Search,
  CheckCircle2,
  XCircle,
  Building2,
  Home,
  AlertCircle,
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
} from "lucide-react";

export default function UsersPage() {
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

  return (
    <div className="space-y-6 text-ink">
      {/* Page Title & Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-ink font-heading">
              User & Resident Management
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-mint text-teal-deep font-semibold">
              {data?.totalSize ?? 0} Registrations
            </span>
          </div>
          <p className="text-sm text-ink/70 mt-1">
            Review self-registered resident applicants, verify accounts, admit
            into care homes, or reject applications.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/invitations"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-teal-brand text-white text-xs sm:text-sm font-semibold hover:bg-teal-deep transition-all shadow-sm cursor-pointer"
          >
            <Mail className="h-4 w-4" />
            <span>Send Invitation</span>
          </Link>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-ink/10 overflow-x-auto pb-1">
        {statuses.map((st) => (
          <button
            key={st.value}
            onClick={() => {
              setSelectedStatus(st.value);
              setPage(0);
            }}
            className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-t-lg transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              selectedStatus === st.value
                ? "bg-teal-brand text-white shadow-xs"
                : "text-ink/65 hover:text-ink hover:bg-cream/60"
            }`}
          >
            <span>{st.label}</span>
            {selectedStatus === st.value && data?.totalSize !== undefined && (
              <span className="text-[11px] px-2 py-0.2 rounded-full bg-white/20 text-white font-mono">
                {data.totalSize}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div className="p-3.5 rounded-md bg-white border border-ink/10 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-ink/40" />
          <input
            type="text"
            placeholder="Search by name, email, phone or address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-md border border-ink/10 bg-cream/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-brand/20 transition-all text-ink"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink/40 hover:text-ink p-1"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <div className="text-xs text-ink/60 font-medium">
          Showing{" "}
          <span className="font-semibold text-ink">
            {filteredResidents.length}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-ink">{data?.totalSize ?? 0}</span>{" "}
          records
        </div>
      </div>

      {/* Main Table or Loading / Error State */}
      <div className="rounded-md bg-white border border-ink/10 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center space-y-3">
            <div className="relative mx-auto h-10 w-10">
              <div className="h-10 w-10 rounded-full border-4 border-teal-brand/20 border-t-teal-brand animate-spin" />
            </div>
            <p className="text-xs text-ink/60 font-medium">
              Loading resident registrations...
            </p>
          </div>
        ) : isError ? (
          <div className="p-10 text-center space-y-3">
            <div className="grid h-12 w-12 place-items-center rounded-full bg-coral-soft text-coral mx-auto">
              <AlertCircle className="h-6 w-6" />
            </div>
            <p className="text-sm font-semibold text-coral">
              {(error as any)?.message || "Failed to load registrations"}
            </p>
            <button
              onClick={() => refetch()}
              className="px-4 py-1.5 rounded-md bg-teal-brand text-white text-xs font-semibold hover:bg-teal-deep"
            >
              Retry
            </button>
          </div>
        ) : filteredResidents.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <div className="grid h-14 w-14 place-items-center rounded-full bg-cream text-ink/40 mx-auto">
              <Users className="h-7 w-7" />
            </div>
            <h3 className="text-base font-bold text-ink">
              No registrations found
            </h3>
            <p className="text-xs text-ink/60 max-w-sm mx-auto leading-relaxed">
              {searchTerm
                ? `No registrations match your search "${searchTerm}".`
                : `There are currently no resident applications with status "${selectedStatus.replace(/_/g, " ")}".`}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="whitespace-nowrap w-full text-left text-xs text-ink">
              <thead className="bg-cream/40 border-b border-ink/10 text-ink/60 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3.5 px-6">Resident Applicant</th>
                  <th className="py-3.5 px-4">Contact Details</th>
                  <th className="py-3.5 px-4">Demographics</th>
                  <th className="py-3.5 px-4">Address</th>
                  <th className="py-3.5 px-4">Status & Source</th>
                  {selectedStatus === "REJECTED" && (
                    <th className="py-3.5 px-4">Rejection Reason</th>
                  )}
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/5">
                {filteredResidents.map((res) => {
                  const fullName =
                    `${res.firstName || ""} ${res.middleName ? res.middleName + " " : ""}${res.lastName || ""}`.trim();
                  const initials =
                    (
                      (res.firstName?.[0] || "") + (res.lastName?.[0] || "")
                    ).toUpperCase() || "R";

                  return (
                    <tr
                      key={res.publicId}
                      className="hover:bg-cream/20 transition-colors"
                    >
                      {/* Name & ID */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-mint text-teal-deep font-bold text-xs shadow-xs">
                            {initials}
                          </div>
                          <div>
                            <div className="font-bold text-sm text-ink">
                              {fullName}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="py-4 px-4 space-y-0.5">
                        <div className="flex items-center gap-1.5 text-ink/80">
                          <Mail className="h-3.5 w-3.5 text-ink/40" />
                          <span>{res.email || "—"}</span>
                        </div>
                        {res.phone && (
                          <div className="flex items-center gap-1.5 text-ink/60 text-[11px]">
                            <Phone className="h-3 w-3 text-ink/40" />
                            <span>{res.phone}</span>
                          </div>
                        )}
                      </td>

                      {/* Demographics */}
                      <td className="py-4 px-4 space-y-0.5">
                        <div className="flex items-center gap-1.5 text-ink/80">
                          <Calendar className="h-3.5 w-3.5 text-ink/40" />
                          <span>{res.dateOfBirth || "—"}</span>
                        </div>
                        <div className="text-[11px] text-ink/60">
                          Gender:{" "}
                          <span className="font-medium text-ink/80">
                            {res.gender || "—"}
                          </span>
                        </div>
                      </td>

                      {/* Address */}
                      <td className="py-4 px-4 max-w-xs truncate text-ink/70">
                        {res.address ? (
                          <div
                            className="flex items-center gap-1.5"
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
                      <td className="py-4 px-4 space-y-1">
                        <div>
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                              res.onboardingStatus === "PENDING_VERIFICATION"
                                ? "bg-amber-50 text-amber-800 border-amber-200"
                                : res.onboardingStatus === "VERIFIED"
                                  ? "bg-sky-50 text-sky-800 border-sky-200"
                                  : res.onboardingStatus === "PLACED"
                                    ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                                    : "bg-rose-50 text-rose-800 border-rose-200"
                            }`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                res.onboardingStatus === "PENDING_VERIFICATION"
                                  ? "bg-amber-500 animate-pulse"
                                  : res.onboardingStatus === "VERIFIED"
                                    ? "bg-sky-500"
                                    : res.onboardingStatus === "PLACED"
                                      ? "bg-emerald-500"
                                      : "bg-rose-500"
                              }`}
                            />
                            {res.onboardingStatus.replace(/_/g, " ")}
                          </span>
                        </div>
                        <div className="text-[10px] text-ink/50 uppercase tracking-wider font-semibold">
                          {res.registrationSource?.replace(/_/g, " ") ||
                            "SELF REGISTRATION"}
                        </div>
                      </td>

                      {/* Rejection Reason Column */}
                      {selectedStatus === "REJECTED" && (
                        <td className="py-4 px-4 max-w-xs text-rose-700 text-xs font-medium">
                          {res.rejectionReason || "—"}
                        </td>
                      )}

                      {/* Actions */}
                      <td className="py-4 px-6 text-right">
                        <div className="inline-flex items-center gap-2">
                          <button
                            onClick={() => setViewTarget(res)}
                            className="p-1.5 rounded-md hover:bg-cream text-ink/60 hover:text-ink transition-colors cursor-pointer"
                            title="View resident profile"
                          >
                            <Eye className="h-4 w-4" />
                          </button>

                          {(res.onboardingStatus === "PENDING_VERIFICATION" ||
                            res.onboardingStatus === "VERIFIED") && (
                            <>
                              <button
                                onClick={() => handleOpenAdmit(res)}
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-all shadow-xs cursor-pointer"
                              >
                                <Check className="h-3.5 w-3.5" />
                                <span>Admit</span>
                              </button>

                              <button
                                onClick={() => handleOpenReject(res)}
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-xs border border-rose-200 transition-all cursor-pointer"
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
        )}

        {/* Pagination Bar */}
        {data && data.totalPages > 1 && (
          <div className="p-4 border-t border-ink/10 flex items-center justify-between text-xs text-ink/70">
            <div>
              Page <span className="font-semibold text-ink">{page + 1}</span> of{" "}
              <span className="font-semibold text-ink">{data.totalPages}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0 || isLoading}
                className="px-3 py-1.5 rounded-md border border-ink/15 text-xs font-semibold hover:bg-cream disabled:opacity-40 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                Previous
              </button>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={page >= data.totalPages - 1 || isLoading}
                className="px-3 py-1.5 rounded-md border border-ink/15 text-xs font-semibold hover:bg-cream disabled:opacity-40 transition-colors flex items-center gap-1 cursor-pointer"
              >
                Next
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* --------------------------------------------------------------------- */}
      {/* ADMIT RESIDENT MODAL */}
      {/* --------------------------------------------------------------------- */}
      {admitTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
          <div className="relative w-full max-w-lg rounded-md bg-white border border-ink/15 shadow-2xl p-6 space-y-5 text-ink">
            <div className="flex items-center justify-between border-b border-ink/10 pb-3">
              <div className="flex items-center gap-2 text-emerald-700">
                <CheckCircle2 className="h-5 w-5" />
                <h3 className="text-lg font-bold text-ink">
                  Admit & Place Resident
                </h3>
              </div>
              <button
                onClick={() => setAdmitTarget(null)}
                className="p-1 rounded-md text-ink/40 hover:text-ink cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Resident summary card */}
            <div className="p-3.5 rounded-md bg-cream/50 border border-ink/10 text-xs space-y-1">
              <div className="font-bold text-sm text-ink">
                {admitTarget.firstName} {admitTarget.lastName}
              </div>
              <div className="text-ink/65 flex items-center gap-3">
                <span>DOB: {admitTarget.dateOfBirth}</span>
                <span>•</span>
                <span>Email: {admitTarget.email}</span>
              </div>
            </div>

            <form
              onSubmit={handleConfirmAdmit}
              className="space-y-4 text-xs sm:text-sm"
            >
              {/* Destination Organisation */}
              <div className="space-y-1.5">
                <label className="font-semibold text-ink flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Building2 className="h-4 w-4 text-teal-brand" />
                    <span>Destination Organisation *</span>
                  </span>
                  {isLoadingOrgs && (
                    <span className="text-xs text-ink/50 flex items-center gap-1">
                      <RefreshCw className="h-3 w-3 animate-spin text-teal-brand" />{" "}
                      Loading...
                    </span>
                  )}
                </label>
                <div className="space-y-1.5">
                  <select
                    value={admitOrgId}
                    onChange={(e) => {
                      setAdmitOrgId(e.target.value);
                      setAdmitCareHomeId("");
                    }}
                    disabled={isLoadingOrgs}
                    className="w-full rounded-md border border-ink/15 bg-cream/30 px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-teal-brand/40"
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
              </div>

              {/* Destination Care Home */}
              <div className="space-y-1.5">
                <label className="font-semibold text-ink flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Home className="h-4 w-4 text-teal-brand" />
                    <span>Care Home Facility *</span>
                  </span>
                  {isLoadingHomes && (
                    <span className="text-xs text-ink/50 flex items-center gap-1">
                      <RefreshCw className="h-3 w-3 animate-spin text-teal-brand" />{" "}
                      Loading...
                    </span>
                  )}
                </label>
                <div className="space-y-1.5">
                  <select
                    value={admitCareHomeId}
                    onChange={(e) => setAdmitCareHomeId(e.target.value)}
                    disabled={!admitOrgId || isLoadingHomes}
                    className="w-full rounded-md border border-ink/15 bg-cream/30 px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-teal-brand/40 disabled:opacity-60"
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
              </div>

              {/* Admission Date */}
              <div className="space-y-1.5">
                <label className="font-semibold text-ink flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-teal-brand" />
                  <span>Admission Date *</span>
                </label>
                <input
                  type="date"
                  required
                  value={admissionDate}
                  onChange={(e) => setAdmissionDate(e.target.value)}
                  className="w-full rounded-md border border-ink/15 bg-cream/30 px-3 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-teal-brand/40"
                />
              </div>

              {/* Action buttons */}
              <div className="pt-3 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setAdmitTarget(null)}
                  className="px-4 py-2.5 rounded-md border border-ink/15 text-xs font-semibold hover:bg-cream transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={admitMutation.isPending}
                  className="px-5 py-2.5 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold transition-all shadow-sm cursor-pointer disabled:opacity-50 flex items-center gap-2"
                >
                  <span>
                    {admitMutation.isPending
                      ? "Admitting..."
                      : "Confirm Admission"}
                  </span>
                  <Check className="h-4 w-4" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --------------------------------------------------------------------- */}
      {/* REJECT RESIDENT MODAL */}
      {/* --------------------------------------------------------------------- */}
      {rejectTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
          <div className="relative w-full max-w-md rounded-md bg-white border border-ink/15 shadow-2xl p-6 space-y-5 text-ink">
            <div className="flex items-center justify-between border-b border-ink/10 pb-3">
              <div className="flex items-center gap-2 text-rose-700">
                <XCircle className="h-5 w-5" />
                <h3 className="text-lg font-bold text-ink">
                  Reject Application
                </h3>
              </div>
              <button
                onClick={() => setRejectTarget(null)}
                className="p-1 rounded-md text-ink/40 hover:text-ink cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="text-xs text-ink/70 leading-relaxed">
              You are declining the registration of{" "}
              <span className="font-semibold text-ink">
                {rejectTarget.firstName} {rejectTarget.lastName}
              </span>
              . Please state the administrative reason for this rejection.
            </p>

            <form
              onSubmit={handleConfirmReject}
              className="space-y-4 text-xs sm:text-sm"
            >
              <div className="space-y-1.5">
                <label className="font-semibold text-ink">
                  Reason for Rejection *
                </label>
                <textarea
                  required
                  rows={4}
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="e.g. Incomplete verification documentation, facility at maximum capacity, or out of catchment area..."
                  className="w-full rounded-md border border-ink/15 bg-cream/30 p-3 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-teal-brand/40 shadow-xs"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setRejectTarget(null)}
                  className="px-4 py-2.5 rounded-md border border-ink/15 text-xs font-semibold hover:bg-cream transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={rejectMutation.isPending}
                  className="px-5 py-2.5 rounded-md bg-rose-600 hover:bg-rose-700 text-white text-xs sm:text-sm font-semibold transition-all shadow-sm cursor-pointer disabled:opacity-50 flex items-center gap-2"
                >
                  <span>
                    {rejectMutation.isPending
                      ? "Declining..."
                      : "Confirm Rejection"}
                  </span>
                  <X className="h-4 w-4" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --------------------------------------------------------------------- */}
      {/* VIEW DETAILS DRAWER / MODAL */}
      {/* --------------------------------------------------------------------- */}
      {viewTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
          <div className="relative w-full max-w-lg rounded-md bg-white border border-ink/15 shadow-2xl p-6 space-y-5 text-ink">
            <div className="flex items-center justify-between border-b border-ink/10 pb-3">
              <div className="flex items-center gap-2 text-teal-brand">
                <UserCheck className="h-5 w-5" />
                <h3 className="text-lg font-bold text-ink">
                  Resident Application Profile
                </h3>
              </div>
              <button
                onClick={() => setViewTarget(null)}
                className="p-1 rounded-md text-ink/40 hover:text-ink cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-2 gap-3 p-3.5 rounded-md bg-cream/50 border border-ink/10">
                <div>
                  <span className="text-[11px] text-ink/60 uppercase font-semibold">
                    First Name
                  </span>
                  <p className="font-bold text-ink">{viewTarget.firstName}</p>
                </div>
                <div>
                  <span className="text-[11px] text-ink/60 uppercase font-semibold">
                    Last Name
                  </span>
                  <p className="font-bold text-ink">{viewTarget.lastName}</p>
                </div>
                {viewTarget.middleName && (
                  <div>
                    <span className="text-[11px] text-ink/60 uppercase font-semibold">
                      Middle Name
                    </span>
                    <p className="font-bold text-ink">
                      {viewTarget.middleName}
                    </p>
                  </div>
                )}
                <div>
                  <span className="text-[11px] text-ink/60 uppercase font-semibold">
                    Gender
                  </span>
                  <p className="font-bold text-ink">{viewTarget.gender}</p>
                </div>
                <div>
                  <span className="text-[11px] text-ink/60 uppercase font-semibold">
                    Date of Birth
                  </span>
                  <p className="font-bold text-ink">{viewTarget.dateOfBirth}</p>
                </div>
                <div>
                  <span className="text-[11px] text-ink/60 uppercase font-semibold">
                    Onboarding Status
                  </span>
                  <p className="font-bold text-teal-deep">
                    {viewTarget.onboardingStatus.replace(/_/g, " ")}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-teal-brand" />
                  <span className="font-medium text-ink">
                    {viewTarget.email}
                  </span>
                </div>
                {viewTarget.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-teal-brand" />
                    <span className="font-medium text-ink">
                      {viewTarget.phone}
                    </span>
                  </div>
                )}
                {viewTarget.address && (
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-teal-brand shrink-0 mt-0.5" />
                    <span className="font-medium text-ink">
                      {viewTarget.address}
                    </span>
                  </div>
                )}
              </div>

              {viewTarget.rejectionReason && (
                <div className="p-3.5 rounded-md bg-rose-50 border border-rose-200 text-rose-800 space-y-1">
                  <p className="font-bold text-xs">Rejection Justification:</p>
                  <p className="text-xs leading-relaxed">
                    {viewTarget.rejectionReason}
                  </p>
                </div>
              )}

              <div className="pt-2 text-right">
                <button
                  onClick={() => setViewTarget(null)}
                  className="px-5 py-2 rounded-md bg-teal-brand text-white font-semibold text-xs hover:bg-teal-deep transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
