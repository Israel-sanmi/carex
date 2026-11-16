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
import StatCard from "@/components/dashboard/stat-card";
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
  EmptyState,
  ErrorState,
  SkeletonRows,
  Spinner,
  DataItem,
  Modal,
  type BadgeTone,
} from "@/components/dashboard/ui";
import {
  Mail,
  Send,
  Copy,
  Check,
  Clock,
  Trash2,
  Building2,
  Home,
  CheckCircle2,
  AlertTriangle,
  Filter,
  Eye,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  ShieldCheck,
  RotateCcw,
  Hash,
  XCircle,
} from "lucide-react";

/** Presentation-only: maps an invitation role to a badge colour. */
const roleTone = (role?: string | null): BadgeTone =>
  role?.includes("SUPER")
    ? "violet"
    : role?.includes("ORGANISATION")
      ? "teal"
      : role?.includes("MANAGER")
        ? "sky"
        : "slate";

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
  // { label: "System Admin", value: "SYSTEM_ADMIN" },
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
      <div className="space-y-6">
        <div className="max-w-xl mx-auto my-12 bg-white border border-ink/[0.08] rounded-md">
          <EmptyState
            icon={AlertTriangle}
            title="Restricted Invitation Domain"
            description="The Invitation workflow is restricted strictly to Super Administrators, System Administrators, Organisation Administrators, Care Home Administrators, and Care Home Managers."
          />
        </div>
      </div>
    );
  }

  const hasFilters = Boolean(selectedStatus || selectedRole || search);

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        icon={Mail}
        title="Invitations Management"
        description="Dispatch, track, and manage role-assigned onboarding invitations across care organisations and facilities."
        actions={
          <button onClick={handleOpenInviteModal} className={`${btn.primary} group`}>
            <Send className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            <span>Send Invitation</span>
          </button>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          className="col-span-2 lg:col-span-1"
          label="Total Invitations"
          value={isLoading ? "—" : totalElements}
          icon={Mail}
          tone="teal"
          hint="Dispatched records"
          hintMuted
        />
        <StatCard
          label="Pending Onboarding"
          value={
            isLoading
              ? "—"
              : rawInvitations.filter(
                  (i) => i.status?.toUpperCase() === "PENDING",
                ).length
          }
          icon={Clock}
          tone="sun"
          hint="Awaiting user acceptance"
          hintMuted
        />
        <StatCard
          label="Accepted / Verified"
          value={
            isLoading
              ? "—"
              : rawInvitations.filter(
                  (i) =>
                    i.status?.toUpperCase() === "ACCEPTED" ||
                    i.status?.toUpperCase() === "VERIFIED",
                ).length
          }
          icon={CheckCircle2}
          tone="sky"
          hint="Active onboarding completed"
        />
      </div>

      {/* Filters Bar */}
      <div className="space-y-3">
        {/* Status Tabs */}
        <Segmented
          value={selectedStatus}
          onChange={(v) => {
            setSelectedStatus(v);
            setPage(0);
          }}
          options={STATUS_FILTERS.map((st) => ({
            value: st.value,
            label: st.label,
            count:
              !isLoading && rawInvitations.length > 0
                ? st.value
                  ? rawInvitations.filter(
                      (i) => i.status?.toUpperCase() === st.value.toUpperCase(),
                    ).length
                  : rawInvitations.length
                : undefined,
          }))}
          className="w-full sm:w-auto"
        />

        {/* Search & Role Filter */}
        <Toolbar>
          <SearchField
            value={search}
            onChange={setSearch}
            placeholder="Search by email, organisation or facility..."
            className="md:max-w-md"
          />

          <div className="flex items-center gap-2 w-full md:w-auto md:ml-auto">
            <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-ink/55 font-medium shrink-0">
              <Filter className="h-3.5 w-3.5" />
              Role
            </span>
            <select
              value={selectedRole}
              onChange={(e) => {
                setSelectedRole(e.target.value as InvitationRole | "");
                setPage(0);
              }}
              aria-label="Filter by role"
              className={`${field.input} md:w-56 cursor-pointer`}
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
                className={`${btn.ghost} shrink-0`}
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Reset Filters
              </button>
            )}
          </div>
        </Toolbar>
      </div>

      {/* Invitations Table Content */}
      <Panel
        flush
        icon={Send}
        title="Dispatched invitations"
        description="Track onboarding links, their status and validity"
      >
        {isLoading ? (
          <SkeletonRows rows={4} />
        ) : isError ? (
          <div className="p-5">
            <ErrorState
              title="Failed to load invitations"
              message={
                <span className="font-mono">
                  {error instanceof Error ? error.message : "Unknown error"}
                </span>
              }
              onRetry={() => refetch()}
              retrying={isFetching}
            />
          </div>
        ) : filteredInvitations.length === 0 ? (
          <EmptyState
            icon={Mail}
            title={
              hasFilters
                ? "No matching invitations found"
                : "No invitations dispatched yet"
            }
            description={
              hasFilters
                ? "No invitation records matched your active filter criteria."
                : "Dispatch your first role-assigned invitation to onboard care staff or colleagues."
            }
            action={
              <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
                {hasFilters && (
                  <button
                    onClick={() => {
                      setSelectedStatus("");
                      setSelectedRole("");
                      setSearch("");
                    }}
                    className={btn.secondary}
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    Clear Filters
                  </button>
                )}
                <button onClick={handleOpenInviteModal} className={`${btn.primary} group`}>
                  <Send className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  <span>Send New Invitation</span>
                </button>
              </div>
            }
          />
        ) : (
          <>
            {/* Desktop table */}
            <div className={`hidden md:block ${table.wrap}`}>
              <table className={table.table}>
                <thead>
                  <tr>
                    <th className={table.th}>Recipient Email</th>
                    <th className={table.th}>Assigned Role</th>
                    <th className={table.th}>Organisation & Facility</th>
                    <th className={table.th}>Status & Validity</th>
                    <th className={`${table.th} text-right`}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInvitations.map((inv) => (
                    <tr key={inv.publicId} className={table.tr}>
                      <td className={table.td}>
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="grid place-items-center w-9 h-9 rounded-md bg-mint text-teal-brand shrink-0 transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-105">
                            <Mail className="h-4 w-4" />
                          </span>
                          <div className="min-w-0">
                            <div className="font-semibold text-sm text-ink truncate max-w-[16rem]">
                              {inv.email}
                            </div>
                            <div className="text-[10px] text-ink/45 flex items-center gap-2 font-mono mt-0.5">
                              <span>
                                Sent: {new Date(inv.createdAt).toLocaleDateString()}
                              </span>
                              <span className="text-ink/25">•</span>
                              <button
                                onClick={() => handleCopy(inv.publicId, inv.publicId)}
                                className="hover:text-ink cursor-pointer flex items-center gap-1 transition-colors"
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
                          </div>
                        </div>
                      </td>

                      <td className={table.td}>
                        <Badge tone={roleTone(inv.role)}>
                          {inv.role?.replace(/_/g, " ")}
                        </Badge>
                      </td>

                      <td className={table.td}>
                        <div className="flex items-center gap-1.5 text-xs font-medium text-ink">
                          <Building2 className="h-3.5 w-3.5 text-teal-brand shrink-0" />
                          <span className="truncate max-w-[14rem]">
                            {inv.organisationName || "—"}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] text-ink/55 mt-0.5">
                          <Home className="h-3 w-3 text-ink/35 shrink-0" />
                          <span className="truncate max-w-[14rem]">
                            {inv.careHomeName || "No specific care home"}
                          </span>
                        </div>
                      </td>

                      <td className={table.td}>
                        <div className="flex flex-col items-start gap-1">
                          <StatusBadge status={inv.status} />
                          {inv.expiresAt && (
                            <span className="inline-flex items-center gap-1 text-[10px] text-ink/50 font-medium">
                              <Calendar className="h-3 w-3" />
                              Exp: {new Date(inv.expiresAt).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </td>

                      <td className={`${table.td} text-right`}>
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setViewingInvitation(inv)}
                            className={btn.icon}
                            title="View Details"
                            aria-label="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>

                          {inv.status?.toUpperCase() === "PENDING" && (
                            <button
                              onClick={() => setRevokingId(inv.publicId)}
                              className={`${btn.icon} text-red-600 hover:text-red-700 hover:bg-red-50`}
                              title="Revoke Invitation"
                              aria-label="Revoke Invitation"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <ul className="md:hidden divide-y divide-ink/[0.06]">
              {filteredInvitations.map((inv) => (
                <li key={inv.publicId} className="p-4 transition-colors hover:bg-mint/20">
                  <div className="flex items-start gap-3">
                    <span className="grid place-items-center w-9 h-9 rounded-md bg-mint text-teal-brand shrink-0">
                      <Mail className="h-4 w-4" />
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="font-semibold text-sm text-ink truncate min-w-0">
                          {inv.email}
                        </div>
                        <StatusBadge status={inv.status} className="shrink-0" />
                      </div>

                      <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                        <Badge tone={roleTone(inv.role)}>
                          {inv.role?.replace(/_/g, " ")}
                        </Badge>
                      </div>

                      <div className="mt-2 space-y-0.5 text-[11px] text-ink/60">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <Building2 className="h-3 w-3 text-teal-brand shrink-0" />
                          <span className="truncate">{inv.organisationName || "—"}</span>
                        </div>
                        <div className="flex items-center gap-1.5 min-w-0">
                          <Home className="h-3 w-3 text-ink/35 shrink-0" />
                          <span className="truncate">
                            {inv.careHomeName || "No specific care home"}
                          </span>
                        </div>
                      </div>

                      <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] text-ink/45 font-mono">
                        <span>Sent: {new Date(inv.createdAt).toLocaleDateString()}</span>
                        {inv.expiresAt && (
                          <>
                            <span className="text-ink/25">•</span>
                            <span>Exp: {new Date(inv.expiresAt).toLocaleDateString()}</span>
                          </>
                        )}
                        <span className="text-ink/25">•</span>
                        <button
                          onClick={() => handleCopy(inv.publicId, inv.publicId)}
                          className="hover:text-ink cursor-pointer inline-flex items-center gap-1"
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

                      <div className="mt-3 flex items-center gap-2">
                        <button
                          onClick={() => setViewingInvitation(inv)}
                          className={`${btn.secondary} ${btn.sm} flex-1`}
                          title="View Details"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          Details
                        </button>
                        {inv.status?.toUpperCase() === "PENDING" && (
                          <button
                            onClick={() => setRevokingId(inv.publicId)}
                            className={`${btn.dangerSoft} ${btn.sm} flex-1`}
                            title="Revoke Invitation"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Revoke
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
      </Panel>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 rounded-md bg-white border border-ink/[0.08] text-xs text-ink/60">
          <span className="tabular-nums">
            Showing Page <span className="font-semibold text-ink">{page + 1}</span> of{" "}
            {totalPages} ({totalElements} invitations)
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className={`${btn.secondary} ${btn.sm} group`}
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className={`${btn.secondary} ${btn.sm} group`}
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>
      )}

      {/* Send Invitation Modal */}
      <Modal
        open={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        icon={Send}
        title="Dispatch New Invitation"
        description="Invite a colleague and pre-assign their platform role and scope."
        footer={
          <>
            <button
              type="button"
              onClick={() => setShowInviteModal(false)}
              className={btn.secondary}
            >
              Cancel
            </button>
            <button
              type="submit"
              form="send-invitation-form"
              disabled={sendMutation.isPending}
              className={`${btn.primary} group`}
            >
              {sendMutation.isPending ? (
                <>
                  <Spinner className="h-3.5 w-3.5" />
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <Send className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  <span>Dispatch Invitation</span>
                </>
              )}
            </button>
          </>
        }
      >
        <form
          id="send-invitation-form"
          onSubmit={handleSendInviteSubmit}
          className="space-y-5"
        >
          {/* Recipient Email */}
          <div>
            <label className={field.label}>Work / Recipient Email Address *</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-ink/35 pointer-events-none" />
              <input
                type="email"
                required
                placeholder="colleague@careorganisation.co.uk"
                value={formEmail}
                onChange={(e) => setFormEmail(e.target.value)}
                className={`${field.input} pl-10`}
              />
            </div>
          </div>

          {/* Assigned Role */}
          <fieldset>
            <legend className={field.label}>Assigned Platform Role *</legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {invitableRoles.map((r) => {
                const selected = formRole === r.value;
                return (
                  <label
                    key={r.value}
                    className={`relative flex items-center gap-2.5 px-3 py-2.5 rounded-md border cursor-pointer transition-all hover:-translate-y-0.5 ${
                      selected
                        ? "border-teal-brand bg-mint/60 ring-4 ring-teal-brand/10"
                        : "border-ink/12 bg-white hover:border-teal-brand/40"
                    }`}
                  >
                    <input
                      type="radio"
                      name="invite-role"
                      required
                      value={r.value}
                      checked={selected}
                      onChange={() => setFormRole(r.value)}
                      className="sr-only"
                    />
                    <span
                      className={`grid place-items-center w-7 h-7 rounded-md shrink-0 transition-colors ${
                        selected ? "bg-teal-brand text-white" : "bg-ink/[0.04] text-ink/45"
                      }`}
                    >
                      {selected ? (
                        <Check className="h-3.5 w-3.5" />
                      ) : (
                        <ShieldCheck className="h-3.5 w-3.5" />
                      )}
                    </span>
                    <span
                      className={`text-sm font-medium ${selected ? "text-teal-deep" : "text-ink/80"}`}
                    >
                      {r.label}
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>

          {/* Destination Organisation Dropdown */}
          <div>
            <label className={`${field.label} flex items-center justify-between`}>
              <span className="flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5 text-teal-brand" />
                <span>Destination Organisation</span>
              </span>
              {isLoadingOrgs && (
                <span className="text-[11px] font-medium text-ink/50 flex items-center gap-1">
                  <Spinner className="h-3 w-3 text-teal-brand" /> Loading...
                </span>
              )}
            </label>
            <select
              value={formOrgId}
              onChange={(e) => {
                setFormOrgId(e.target.value);
                setFormCareHomeId("");
              }}
              className={`${field.input} cursor-pointer`}
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
          <div>
            <label className={`${field.label} flex items-center justify-between`}>
              <span className="flex items-center gap-1.5">
                <Home className="h-3.5 w-3.5 text-teal-brand" />
                <span>Care Home Facility</span>
              </span>
              {isLoadingHomes && (
                <span className="text-[11px] font-medium text-ink/50 flex items-center gap-1">
                  <Spinner className="h-3 w-3 text-teal-brand" /> Loading...
                </span>
              )}
            </label>
            <select
              value={formCareHomeId}
              onChange={(e) => setFormCareHomeId(e.target.value)}
              disabled={!formOrgId || isLoadingHomes}
              className={`${field.input} cursor-pointer`}
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
          <div>
            <label className={field.label}>Registration Reference (Optional)</label>
            <div className="relative">
              <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-ink/35 pointer-events-none" />
              <input
                type="text"
                placeholder="e.g. REF-2026-NURSE-04"
                value={formRef}
                onChange={(e) => setFormRef(e.target.value)}
                className={`${field.input} pl-10 font-mono`}
              />
            </div>
          </div>
        </form>
      </Modal>

      {/* Revoke Confirmation Dialog */}
      <Modal
        open={Boolean(revokingId)}
        onClose={() => setRevokingId(null)}
        size="sm"
        tone="danger"
        icon={ShieldAlert}
        title="Revoke Invitation"
        footer={
          <>
            <button onClick={() => setRevokingId(null)} className={btn.secondary}>
              Keep Active
            </button>
            <button
              onClick={handleConfirmRevoke}
              disabled={revokeMutation.isPending}
              className={btn.danger}
            >
              {revokeMutation.isPending ? (
                <>
                  <Spinner className="h-3.5 w-3.5" />
                  <span>Revoking...</span>
                </>
              ) : (
                <span>Revoke Invitation</span>
              )}
            </button>
          </>
        }
      >
        <p className="text-sm text-ink/70 leading-relaxed">
          Are you sure you want to revoke this invitation? The recipient will no
          longer be able to use their onboarding link to activate their account.
        </p>
      </Modal>

      {/* Details View Modal */}
      {viewingInvitation && (
        <Modal
          open
          onClose={() => setViewingInvitation(null)}
          size="sm"
          icon={Mail}
          title="Invitation Details"
          description={viewingInvitation.email}
          footer={
            <button onClick={() => setViewingInvitation(null)} className={btn.primary}>
              Close
            </button>
          }
        >
          <div className="space-y-4">
            <dl className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-md bg-ink/[0.02] border border-ink/[0.08]">
                <DataItem label="Status">
                  <StatusBadge status={viewingInvitation.status} />
                </DataItem>
              </div>
              <div className="p-3 rounded-md bg-ink/[0.02] border border-ink/[0.08]">
                <DataItem label="Assigned Role">
                  <span className="text-teal-deep">{viewingInvitation.role}</span>
                </DataItem>
              </div>
            </dl>

            <dl className="divide-y divide-ink/[0.06] rounded-md border border-ink/[0.08] text-xs">
              <div className="flex items-start justify-between gap-4 px-3.5 py-2.5">
                <dt className="flex items-center gap-1.5 text-ink/55 shrink-0">
                  <Mail className="h-3.5 w-3.5" />
                  Recipient
                </dt>
                <dd className="font-medium text-ink text-right break-all">
                  {viewingInvitation.email}
                </dd>
              </div>
              {viewingInvitation.organisationName && (
                <div className="flex items-start justify-between gap-4 px-3.5 py-2.5">
                  <dt className="flex items-center gap-1.5 text-ink/55 shrink-0">
                    <Building2 className="h-3.5 w-3.5" />
                    Organisation
                  </dt>
                  <dd className="font-medium text-ink text-right">
                    {viewingInvitation.organisationName}
                  </dd>
                </div>
              )}
              {viewingInvitation.careHomeName && (
                <div className="flex items-start justify-between gap-4 px-3.5 py-2.5">
                  <dt className="flex items-center gap-1.5 text-ink/55 shrink-0">
                    <Home className="h-3.5 w-3.5" />
                    Care Home
                  </dt>
                  <dd className="font-medium text-ink text-right">
                    {viewingInvitation.careHomeName}
                  </dd>
                </div>
              )}
              <div className="flex items-start justify-between gap-4 px-3.5 py-2.5">
                <dt className="flex items-center gap-1.5 text-ink/55 shrink-0">
                  <Send className="h-3.5 w-3.5" />
                  Dispatched
                </dt>
                <dd className="font-medium text-ink text-right">
                  {new Date(viewingInvitation.createdAt).toLocaleString()}
                </dd>
              </div>
              {viewingInvitation.expiresAt && (
                <div className="flex items-start justify-between gap-4 px-3.5 py-2.5">
                  <dt className="flex items-center gap-1.5 text-ink/55 shrink-0">
                    <Calendar className="h-3.5 w-3.5" />
                    Expires
                  </dt>
                  <dd className="font-medium text-ink text-right">
                    {new Date(viewingInvitation.expiresAt).toLocaleString()}
                  </dd>
                </div>
              )}
              {viewingInvitation.acceptedAt && (
                <div className="flex items-start justify-between gap-4 px-3.5 py-2.5 bg-emerald-50/50 text-emerald-700">
                  <dt className="flex items-center gap-1.5 shrink-0">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Accepted
                  </dt>
                  <dd className="font-semibold text-right">
                    {new Date(viewingInvitation.acceptedAt).toLocaleString()}
                  </dd>
                </div>
              )}
              {viewingInvitation.revokedAt && (
                <div className="flex items-start justify-between gap-4 px-3.5 py-2.5 bg-red-50/50 text-red-600">
                  <dt className="flex items-center gap-1.5 shrink-0">
                    <XCircle className="h-3.5 w-3.5" />
                    Revoked
                  </dt>
                  <dd className="font-semibold text-right">
                    {new Date(viewingInvitation.revokedAt).toLocaleString()}
                  </dd>
                </div>
              )}
            </dl>
          </div>
        </Modal>
      )}
    </div>
  );
}
