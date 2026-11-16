"use client";

import { useState } from "react";
import { useRole } from "@/lib/role-context";
import {
  useInvitations,
  useSendInvitationMutation,
  useRevokeInvitationMutation,
} from "@/lib/hooks/use-invitations";
import { useOrganisations } from "@/lib/hooks/use-organisations";
import { useCareHomesByOrganisation } from "@/lib/hooks/use-care-homes";
import {
  InvitationItem,
  InvitationStatus,
  InvitationRole,
  CreateInvitationPayload,
} from "@/lib/api-invitations";
import { toast } from "@/components/ui/toast";
import {
  Mail,
  Send,
  Copy,
  Check,
  Clock,
  RefreshCw,
  Trash2,
  Building2,
  Home,
  CheckCircle2,
  AlertTriangle,
  Search,
  Filter,
  Eye,
  Calendar,
  X,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
} from "lucide-react";

const STATUS_FILTERS: { label: string; value: InvitationStatus | "" }[] = [
  { label: "All Statuses", value: "" },
  { label: "Pending", value: "PENDING" },
  { label: "Accepted", value: "ACCEPTED" },
  { label: "Verified", value: "VERIFIED" },
  { label: "Rejected", value: "REJECTED" },
  { label: "Expired", value: "EXPIRED" },
  { label: "Revoked", value: "REVOKED" },
];

const ALLOWED_INVITER_ROLES = [
  "SUPER_ADMIN",
  "SYSTEM_ADMIN",
  "ORGANISATION_ADMIN",
  "CARE_HOME_ADMIN",
  "CARE_HOME_MANAGER",
];

const AVAILABLE_ROLES: { label: string; value: InvitationRole }[] = [
  { label: "Caregiver", value: "CAREGIVER" },
  { label: "Care Home Manager", value: "CARE_HOME_MANAGER" },
  { label: "Care Home Admin", value: "CARE_HOME_ADMIN" },
  { label: "Organisation Admin", value: "ORGANISATION_ADMIN" },
  { label: "Organisation Support", value: "ORGANISATION_SUPPORT" },
  { label: "Resident", value: "RESIDENT" },
  { label: "System Admin", value: "SYSTEM_ADMIN" },
  { label: "System Support", value: "SYSTEM_SUPPORT" },
  { label: "Super Admin", value: "SUPER_ADMIN" },
];

export default function InvitationsPage() {
  const { currentRole, roles, roleAssignments } = useRole();

  // Access control: only SUPER_ADMIN, SYSTEM_ADMIN, ORGANISATION_ADMIN, CARE_HOME_ADMIN, CARE_HOME_MANAGER can invite
  const canInvite =
    ALLOWED_INVITER_ROLES.includes(currentRole) ||
    roles.some((r) => ALLOWED_INVITER_ROLES.includes(r));

  // Search & Filters
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<InvitationStatus | "">(
    "",
  );
  const [selectedRole, setSelectedRole] = useState<InvitationRole | "">("");
  const [page, setPage] = useState(0);
  const pageSize = 20;

  // Modals state
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [viewingInvitation, setViewingInvitation] =
    useState<InvitationItem | null>(null);
  const [revokingId, setRevokingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Send Invitation Form state
  const [formEmail, setFormEmail] = useState("");
  const [formRole, setFormRole] = useState<InvitationRole>("CAREGIVER");
  const [formOrgId, setFormOrgId] = useState("");
  const [formCareHomeId, setFormCareHomeId] = useState("");
  const [formRef, setFormRef] = useState("");

  // Queries & Mutations
  const { data, isLoading, isError, error, refetch, isFetching } =
    useInvitations({
      page,
      size: pageSize,
      status: selectedStatus || undefined,
      role: selectedRole || undefined,
    });

  const sendMutation = useSendInvitationMutation();
  const revokeMutation = useRevokeInvitationMutation();

  // Dropdown queries for Organisation & Care Home (only active when modal is open)
  const { data: orgsData, isLoading: isLoadingOrgs } = useOrganisations(
    { page: 0, size: 100 },
    { enabled: showInviteModal },
  );

  const { data: careHomesData, isLoading: isLoadingHomes } =
    useCareHomesByOrganisation(
      formOrgId || null,
      { page: 0, size: 100 },
      { enabled: showInviteModal && Boolean(formOrgId) },
    );

  const organisations = orgsData?.content || [];
  const careHomes = careHomesData?.content || [];

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.info("Copied to clipboard");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const invitableRoles = AVAILABLE_ROLES.filter((r) => {
    if (
      currentRole === "SUPER_ADMIN" ||
      currentRole === "SYSTEM_ADMIN" ||
      roles.includes("SUPER_ADMIN") ||
      roles.includes("SYSTEM_ADMIN")
    ) {
      return true;
    }
    if (
      currentRole === "ORGANISATION_ADMIN" ||
      roles.includes("ORGANISATION_ADMIN")
    ) {
      return [
        "ORGANISATION_ADMIN",
        "ORGANISATION_SUPPORT",
        "CARE_HOME_ADMIN",
        "CARE_HOME_MANAGER",
        "CAREGIVER",
        "RESIDENT",
      ].includes(r.value);
    }
    // CARE_HOME_ADMIN / CARE_HOME_MANAGER
    return [
      "CARE_HOME_ADMIN",
      "CARE_HOME_MANAGER",
      "CAREGIVER",
      "RESIDENT",
    ].includes(r.value);
  });

  const handleOpenInviteModal = () => {
    const defaultOrg =
      roleAssignments.find((ra) => ra.organisationPublicId)
        ?.organisationPublicId || "";
    setFormOrgId(defaultOrg);

    const defaultHome =
      roleAssignments.find((ra) => ra.careHomePublicId)?.careHomePublicId || "";
    setFormCareHomeId(defaultHome);

    setFormEmail("");
    setFormRole(invitableRoles[0]?.value || "CAREGIVER");
    setFormRef("");
    setShowInviteModal(true);
  };

  const handleSendInviteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formEmail.trim()) {
      toast.error("Please enter a valid recipient email address");
      return;
    }

    const payload: CreateInvitationPayload = {
      email: formEmail.trim(),
      role: formRole,
      organisationPublicId: formOrgId.trim() || undefined,
      careHomePublicId: formCareHomeId.trim() || undefined,
      registrationReference: formRef.trim() || undefined,
    };

    try {
      await sendMutation.mutateAsync(payload);
      setShowInviteModal(false);
    } catch {
      // Handled in mutation hook
    }
  };

  const handleConfirmRevoke = async () => {
    if (!revokingId) return;
    try {
      await revokeMutation.mutateAsync(revokingId);
      setRevokingId(null);
    } catch {
      // Handled in mutation hook
    }
  };

  const rawInvitations = data?.content || [];

  // Filter client-side by search query and case-insensitive status/role
  const filteredInvitations = rawInvitations.filter((inv) => {
    if (
      selectedStatus &&
      inv.status?.toUpperCase() !== selectedStatus.toUpperCase()
    ) {
      return false;
    }
    if (
      selectedRole &&
      inv.role?.toUpperCase() !== selectedRole.toUpperCase()
    ) {
      return false;
    }
    if (search && search.trim()) {
      const term = search.toLowerCase().trim();
      return (
        inv.email?.toLowerCase().includes(term) ||
        inv.organisationName?.toLowerCase().includes(term) ||
        inv.careHomeName?.toLowerCase().includes(term) ||
        inv.publicId?.toLowerCase().includes(term)
      );
    }
    return true;
  });

  const totalElements = data?.totalElements ?? rawInvitations.length;
  const totalPages =
    data?.totalPages ?? (Math.ceil(totalElements / pageSize) || 1);

  if (!canInvite) {
    return (
      <div className="p-8 rounded-md bg-white border border-ink/10 text-center max-w-xl mx-auto space-y-4 my-12 shadow-xs">
        <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center mx-auto">
          <AlertTriangle className="h-6 w-6" />
        </div>
        <h2 className="text-xl font-bold text-ink font-heading">
          Restricted Invitation Domain
        </h2>
        <p className="text-xs text-ink/70 leading-relaxed">
          The Invitation workflow is restricted strictly to Super
          Administrators, System Administrators, Organisation Administrators,
          Care Home Administrators, and Care Home Managers.
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
              Invitations Management
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-mint text-teal-deep font-semibold">
              {isLoading ? "—" : totalElements} Dispatched
            </span>
          </div>
          <p className="text-sm text-ink/70 mt-1">
            Dispatch, track, and manage role-assigned onboarding invitations
            across care organisations and facilities.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleOpenInviteModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md bg-teal-brand text-white text-sm font-semibold hover:bg-teal-deep transition-all shadow-sm cursor-pointer"
          >
            <Send className="h-4 w-4" />
            <span>Send Invitation</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-md bg-white border border-ink/10 shadow-xs">
          <span className="text-xs font-semibold text-ink/60 uppercase tracking-wider">
            Total Invitations
          </span>
          <p className="text-3xl font-bold text-ink mt-1">
            {isLoading ? "—" : totalElements}
          </p>
          <span className="text-xs text-ink/60">Dispatched records</span>
        </div>
        <div className="p-5 rounded-md bg-white border border-ink/10 shadow-xs">
          <span className="text-xs font-semibold text-ink/60 uppercase tracking-wider">
            Pending Onboarding
          </span>
          <p className="text-3xl font-bold text-amber-700 mt-1">
            {isLoading
              ? "—"
              : rawInvitations.filter(
                  (i) => i.status?.toUpperCase() === "PENDING",
                ).length}
          </p>
          <span className="text-xs text-ink/60">Awaiting user acceptance</span>
        </div>
        <div className="p-5 rounded-md bg-white border border-ink/10 shadow-xs">
          <span className="text-xs font-semibold text-ink/60 uppercase tracking-wider">
            Accepted / Verified
          </span>
          <p className="text-3xl font-bold text-emerald-700 mt-1">
            {isLoading
              ? "—"
              : rawInvitations.filter(
                  (i) =>
                    i.status?.toUpperCase() === "ACCEPTED" ||
                    i.status?.toUpperCase() === "VERIFIED",
                ).length}
          </p>
          <span className="text-xs text-teal-deep font-semibold">
            Active onboarding completed
          </span>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="space-y-3">
        {/* Status Tabs */}
        <div className="flex items-center gap-2 border-b border-ink/10 overflow-x-auto pb-1">
          {STATUS_FILTERS.map((st) => {
            const count = st.value
              ? rawInvitations.filter(
                  (i) => i.status?.toUpperCase() === st.value.toUpperCase(),
                ).length
              : rawInvitations.length;

            if (!canInvite) {
              return (
                <div className="p-8 rounded-md bg-white border border-ink/10 text-center max-w-xl mx-auto space-y-4 my-12 shadow-xs">
                  <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center mx-auto">
                    <AlertTriangle className="h-6 w-6" />
                  </div>
                  <h2 className="text-xl font-bold text-ink font-heading">
                    Restricted Invitation Domain
                  </h2>
                  <p className="text-xs text-ink/70 leading-relaxed">
                    The Invitation workflow is restricted strictly to Super
                    Administrators, System Administrators, Organisation
                    Administrators, Care Home Administrators, and Care Home
                    Managers.
                  </p>
                </div>
              );
            }

            return (
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
                {!isLoading && rawInvitations.length > 0 && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      selectedStatus === st.value
                        ? "bg-white/20 text-white"
                        : "bg-ink/10 text-ink/70"
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Search & Role Filter */}
        <div className="p-4 rounded-md bg-white border border-ink/10 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-ink/40" />
            <input
              type="text"
              placeholder="Search by email, organisation or facility..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm rounded-md border border-ink/10 bg-cream/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-brand/20 transition-all text-ink"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="h-4 w-4 text-ink/40" />
            <span className="text-xs text-ink/60 font-medium">Role:</span>
            <select
              value={selectedRole}
              onChange={(e) => {
                setSelectedRole(e.target.value as InvitationRole | "");
                setPage(0);
              }}
              className="text-xs rounded-md border border-ink/10 px-3 py-2 bg-cream/30 focus:outline-none focus:ring-2 focus:ring-teal-brand/20 font-medium text-ink cursor-pointer"
            >
              <option value="">All Roles</option>
              {AVAILABLE_ROLES.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>

            {(search || selectedRole || selectedStatus) && (
              <button
                onClick={() => {
                  setSearch("");
                  setSelectedRole("");
                  setSelectedStatus("");
                }}
                className="text-xs text-ink/60 hover:text-ink ml-2 cursor-pointer whitespace-nowrap"
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Invitations Table Content */}
      {isLoading ? (
        <div className="rounded-md bg-white border border-ink/10 p-6 space-y-4 animate-pulse">
          <div className="h-6 bg-ink/10 rounded w-1/4" />
          <div className="h-12 bg-cream rounded" />
          <div className="h-12 bg-cream rounded" />
          <div className="h-12 bg-cream rounded" />
        </div>
      ) : isError ? (
        <div className="p-8 rounded-md bg-red-50 border border-red-200 text-center space-y-3">
          <AlertTriangle className="h-8 w-8 text-red-600 mx-auto" />
          <p className="text-sm font-semibold text-red-800">
            Failed to load invitations
          </p>
          <p className="text-xs text-red-600 font-mono">
            {error instanceof Error ? error.message : "Unknown error"}
          </p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 rounded-md bg-red-600 text-white text-xs font-semibold hover:bg-red-700 cursor-pointer"
          >
            Try Again
          </button>
        </div>
      ) : filteredInvitations.length === 0 ? (
        <div className="p-12 rounded-md bg-white border border-ink/10 text-center space-y-4 shadow-xs">
          <div className="w-14 h-14 rounded-full bg-cream text-teal-brand flex items-center justify-center mx-auto">
            <Mail className="h-7 w-7" />
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h3 className="text-base font-bold text-ink">
              {selectedStatus || selectedRole || search
                ? "No matching invitations found"
                : "No invitations dispatched yet"}
            </h3>
            <p className="text-xs text-ink/60">
              {selectedStatus || selectedRole || search
                ? "No invitation records matched your active filter criteria."
                : "Dispatch your first role-assigned invitation to onboard care staff or colleagues."}
            </p>
          </div>
          <div className="flex items-center justify-center gap-3">
            {(selectedStatus || selectedRole || search) && (
              <button
                onClick={() => {
                  setSelectedStatus("");
                  setSelectedRole("");
                  setSearch("");
                }}
                className="px-4 py-2 rounded-md border border-ink/15 text-xs font-semibold text-ink/70 hover:bg-cream cursor-pointer"
              >
                Clear Filters
              </button>
            )}
            <button
              onClick={handleOpenInviteModal}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-teal-brand text-white text-xs font-semibold hover:bg-teal-deep transition-all cursor-pointer"
            >
              <Send className="h-3.5 w-3.5" />
              <span>Send New Invitation</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="rounded-md bg-white border border-ink/10 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="whitespace-nowrap w-full text-left text-xs text-ink">
              <thead className="bg-cream/40 border-b border-ink/10 text-ink/60 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3.5 px-6">Recipient Email</th>
                  <th className="py-3.5 px-4">Assigned Role</th>
                  <th className="py-3.5 px-4">Organisation & Facility</th>
                  <th className="py-3.5 px-4">Status & Validity</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/5">
                {filteredInvitations.map((inv) => (
                  <tr
                    key={inv.publicId}
                    className="hover:bg-cream/20 transition-colors"
                  >
                    <td className="py-4 px-6">
                      <div className="font-bold text-sm text-ink">
                        {inv.email}
                      </div>
                      <div className="text-[10px] text-ink/50 flex items-center gap-2 font-mono mt-0.5">
                        <span>
                          Sent: {new Date(inv.createdAt).toLocaleDateString()}
                        </span>
                        <span>•</span>
                        <button
                          onClick={() => handleCopy(inv.publicId, inv.publicId)}
                          className="hover:text-ink cursor-pointer flex items-center gap-1"
                          title="Copy Invitation ID"
                        >
                          {copiedId === inv.publicId ? (
                            <Check className="h-3 w-3 text-emerald-600" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                          <span>{inv.publicId.slice(0, 8)}...</span>
                        </button>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                          inv.role?.includes("SUPER")
                            ? "bg-purple-100 text-purple-800"
                            : inv.role?.includes("ORGANISATION")
                              ? "bg-teal-brand text-white"
                              : inv.role?.includes("MANAGER")
                                ? "bg-mint text-teal-deep"
                                : "bg-ink/5 text-ink/80"
                        }`}
                      >
                        {inv.role?.replace(/_/g, " ")}
                      </span>
                    </td>

                    <td className="py-4 px-4">
                      <div className="font-medium text-ink">
                        {inv.organisationName || "—"}
                      </div>
                      <div className="text-[11px] text-ink/60">
                        {inv.careHomeName || "No specific care home"}
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                            inv.status?.toUpperCase() === "PENDING"
                              ? "bg-amber-50 text-amber-800 border border-amber-200"
                              : inv.status?.toUpperCase() === "ACCEPTED" ||
                                  inv.status?.toUpperCase() === "VERIFIED"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : "bg-gray-100 text-gray-700 border border-gray-200"
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              inv.status?.toUpperCase() === "PENDING"
                                ? "bg-amber-600"
                                : inv.status?.toUpperCase() === "ACCEPTED" ||
                                    inv.status?.toUpperCase() === "VERIFIED"
                                  ? "bg-emerald-600"
                                  : "bg-gray-500"
                            }`}
                          />
                          {inv.status}
                        </span>

                        {inv.expiresAt && (
                          <span className="text-[10px] text-ink/50 font-medium">
                            Exp: {new Date(inv.expiresAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setViewingInvitation(inv)}
                          className="p-1.5 rounded-md border border-ink/10 hover:bg-cream text-ink/70 hover:text-ink text-xs font-semibold cursor-pointer"
                          title="View Details"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </button>

                        {inv.status?.toUpperCase() === "PENDING" && (
                          <button
                            onClick={() => setRevokingId(inv.publicId)}
                            className="p-1.5 rounded-md border border-red-200 hover:bg-red-50 text-red-600 text-xs font-semibold cursor-pointer"
                            title="Revoke Invitation"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 border-t border-ink/10 text-xs text-ink/70">
          <span>
            Showing Page {page + 1} of {totalPages} ({totalElements}{" "}
            invitations)
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="p-2 rounded-md border border-ink/15 disabled:opacity-40 hover:bg-cream cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className="p-2 rounded-md border border-ink/15 disabled:opacity-40 hover:bg-cream cursor-pointer"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Send Invitation Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-md p-6 shadow-2xl border border-ink/10 space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-ink/10 pb-3">
              <div className="flex items-center gap-2">
                <Send className="h-5 w-5 text-teal-brand" />
                <h3 className="text-lg font-bold text-ink font-heading">
                  Dispatch New Invitation
                </h3>
              </div>
              <button
                onClick={() => setShowInviteModal(false)}
                className="p-1 rounded-md text-ink/40 hover:text-ink cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form
              onSubmit={handleSendInviteSubmit}
              className="space-y-4 text-xs sm:text-sm"
            >
              {/* Recipient Email */}
              <div className="space-y-1">
                <label className="font-semibold text-ink block">
                  Work / Recipient Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink/40" />
                  <input
                    type="email"
                    required
                    placeholder="colleague@careorganisation.co.uk"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-md border border-ink/15 bg-cream/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-brand/30"
                  />
                </div>
              </div>

              {/* Assigned Role */}
              <div className="space-y-1">
                <label className="font-semibold text-ink block">
                  Assigned Platform Role *
                </label>
                <select
                  required
                  value={formRole}
                  onChange={(e) =>
                    setFormRole(e.target.value as InvitationRole)
                  }
                  className="w-full px-3 py-2 rounded-md border border-ink/15 bg-cream/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-brand/30 font-medium cursor-pointer"
                >
                  {invitableRoles.map((r) => (
                    <option key={r.value} value={r.value}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Destination Organisation Dropdown */}
              <div className="space-y-1">
                <label className="font-semibold text-ink flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Building2 className="h-4 w-4 text-teal-brand" />
                    <span>Destination Organisation</span>
                  </span>
                  {isLoadingOrgs && (
                    <span className="text-xs text-ink/50 flex items-center gap-1">
                      <RefreshCw className="h-3 w-3 animate-spin text-teal-brand" />{" "}
                      Loading...
                    </span>
                  )}
                </label>
                <select
                  value={formOrgId}
                  onChange={(e) => {
                    setFormOrgId(e.target.value);
                    setFormCareHomeId("");
                  }}
                  className="w-full px-3 py-2 rounded-md border border-ink/15 bg-cream/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-brand/30 font-medium cursor-pointer"
                >
                  <option value="">-- Select Organisation --</option>
                  {organisations
                    .filter((org) => org.status?.toUpperCase() === "ACTIVE")
                    .map((org) => (
                      <option key={org.publicId} value={org.publicId}>
                        {org.name}
                      </option>
                    ))}
                  {roleAssignments
                    .filter(
                      (ra) =>
                        ra.organisationPublicId &&
                        !organisations.some(
                          (o) => o.publicId === ra.organisationPublicId,
                        ),
                    )
                    .map((ra) => (
                      <option
                        key={ra.organisationPublicId}
                        value={ra.organisationPublicId!}
                      >
                        {ra.organisationName || ra.organisationPublicId}
                      </option>
                    ))}
                </select>
              </div>

              {/* Destination Care Home Dropdown */}
              <div className="space-y-1">
                <label className="font-semibold text-ink flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Home className="h-4 w-4 text-teal-brand" />
                    <span>Care Home Facility</span>
                  </span>
                  {isLoadingHomes && (
                    <span className="text-xs text-ink/50 flex items-center gap-1">
                      <RefreshCw className="h-3 w-3 animate-spin text-teal-brand" />{" "}
                      Loading...
                    </span>
                  )}
                </label>
                <select
                  value={formCareHomeId}
                  onChange={(e) => setFormCareHomeId(e.target.value)}
                  disabled={!formOrgId || isLoadingHomes}
                  className="w-full px-3 py-2 rounded-md border border-ink/15 bg-cream/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-brand/30 font-medium cursor-pointer disabled:opacity-60"
                >
                  <option value="">
                    {!formOrgId
                      ? "Select an organisation above first..."
                      : isLoadingHomes
                        ? "Loading care homes..."
                        : careHomes.filter((h) => h.status?.toUpperCase() === "ACTIVE").length === 0
                          ? "No active care homes under this organisation"
                          : "-- Select Care Home Facility --"}
                  </option>
                  {careHomes
                    .filter((home) => home.status?.toUpperCase() === "ACTIVE")
                    .map((home) => (
                      <option key={home.publicId} value={home.publicId}>
                        {home.name} {home.city ? `(${home.city})` : ""}
                      </option>
                    ))}
                  {roleAssignments
                    .filter(
                      (ra) =>
                        ra.careHomePublicId &&
                        !careHomes.some(
                          (h) => h.publicId === ra.careHomePublicId,
                        ),
                    )
                    .map((ra) => (
                      <option
                        key={ra.careHomePublicId}
                        value={ra.careHomePublicId!}
                      >
                        {ra.careHomeName || ra.careHomePublicId}
                      </option>
                    ))}
                </select>
              </div>

              {/* Registration Reference */}
              <div className="space-y-1">
                <label className="font-semibold text-ink block">
                  Registration Reference (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. REF-2026-NURSE-04"
                  value={formRef}
                  onChange={(e) => setFormRef(e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-ink/15 bg-cream/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-brand/30 font-mono text-xs"
                />
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-ink/10">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="px-4 py-2 rounded-md border border-ink/15 text-xs font-semibold text-ink/70 hover:bg-cream cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={sendMutation.isPending}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-teal-brand text-white text-xs font-semibold hover:bg-teal-deep transition-all cursor-pointer disabled:opacity-50"
                >
                  {sendMutation.isPending ? (
                    <>
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <span>Dispatch Invitation</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Revoke Confirmation Dialog */}
      {revokingId && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white rounded-md p-6 shadow-2xl border border-ink/10 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-2 text-red-600">
              <ShieldAlert className="h-6 w-6" />
              <h3 className="text-base font-bold text-ink">
                Revoke Invitation
              </h3>
            </div>
            <p className="text-xs text-ink/70 leading-relaxed">
              Are you sure you want to revoke this invitation? The recipient
              will no longer be able to use their onboarding link to activate
              their account.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setRevokingId(null)}
                className="px-3 py-1.5 rounded-md border border-ink/15 text-xs font-semibold text-ink/70 hover:bg-cream cursor-pointer"
              >
                Keep Active
              </button>
              <button
                onClick={handleConfirmRevoke}
                disabled={revokeMutation.isPending}
                className="px-4 py-1.5 rounded-md bg-red-600 hover:bg-red-700 text-white text-xs font-semibold cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
              >
                {revokeMutation.isPending ? (
                  <>
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                    <span>Revoking...</span>
                  </>
                ) : (
                  <span>Revoke Invitation</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Details View Modal */}
      {viewingInvitation && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-md p-6 shadow-2xl border border-ink/10 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-ink/10 pb-3">
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-teal-brand" />
                <h3 className="text-lg font-bold text-ink">
                  Invitation Details
                </h3>
              </div>
              <button
                onClick={() => setViewingInvitation(null)}
                className="p-1 rounded-md text-ink/40 hover:text-ink cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-md bg-cream/40 border border-ink/10 space-y-1">
                <span className="text-[10px] uppercase font-bold text-ink/50">
                  Invitation Public ID
                </span>
                <div className="flex items-center justify-between font-mono text-[11px] text-ink break-all">
                  <span>{viewingInvitation.publicId}</span>
                  <button
                    onClick={() =>
                      handleCopy(
                        viewingInvitation.publicId,
                        viewingInvitation.publicId,
                      )
                    }
                    className="p-1 text-teal-brand hover:text-teal-deep cursor-pointer shrink-0"
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 rounded-md bg-cream/30 border border-ink/10">
                  <span className="text-[10px] uppercase font-bold text-ink/50 block">
                    Status
                  </span>
                  <span className="font-semibold text-ink">
                    {viewingInvitation.status}
                  </span>
                </div>
                <div className="p-2.5 rounded-md bg-cream/30 border border-ink/10">
                  <span className="text-[10px] uppercase font-bold text-ink/50 block">
                    Assigned Role
                  </span>
                  <span className="font-semibold text-teal-deep">
                    {viewingInvitation.role}
                  </span>
                </div>
              </div>

              <div className="space-y-2 border-t border-ink/10 pt-3">
                <div className="flex justify-between">
                  <span className="text-ink/60">Recipient:</span>
                  <span className="font-medium text-ink">
                    {viewingInvitation.email}
                  </span>
                </div>
                {viewingInvitation.organisationName && (
                  <div className="flex justify-between">
                    <span className="text-ink/60">Organisation:</span>
                    <span className="font-medium text-ink">
                      {viewingInvitation.organisationName}
                    </span>
                  </div>
                )}
                {viewingInvitation.careHomeName && (
                  <div className="flex justify-between">
                    <span className="text-ink/60">Care Home:</span>
                    <span className="font-medium text-ink">
                      {viewingInvitation.careHomeName}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-ink/60">Dispatched:</span>
                  <span className="font-medium text-ink">
                    {new Date(viewingInvitation.createdAt).toLocaleString()}
                  </span>
                </div>
                {viewingInvitation.expiresAt && (
                  <div className="flex justify-between">
                    <span className="text-ink/60">Expires:</span>
                    <span className="font-medium text-ink">
                      {new Date(viewingInvitation.expiresAt).toLocaleString()}
                    </span>
                  </div>
                )}
                {viewingInvitation.acceptedAt && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Accepted:</span>
                    <span className="font-semibold">
                      {new Date(viewingInvitation.acceptedAt).toLocaleString()}
                    </span>
                  </div>
                )}
                {viewingInvitation.revokedAt && (
                  <div className="flex justify-between text-red-600">
                    <span>Revoked:</span>
                    <span className="font-semibold">
                      {new Date(viewingInvitation.revokedAt).toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-ink/10 flex justify-end">
              <button
                onClick={() => setViewingInvitation(null)}
                className="px-4 py-1.5 rounded-md bg-teal-brand text-white text-xs font-semibold hover:bg-teal-deep cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
