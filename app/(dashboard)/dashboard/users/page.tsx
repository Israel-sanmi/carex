"use client";

import { useState } from "react";
import Link from "next/link";
import { useRole } from "@/lib/role-context";
import {
  useUsers,
  useUserRoles,
  useUpdateUserMutation,
  useAssignRoleMutation,
  useRevokeRoleMutation,
  useUpdateRoleStatusMutation,
} from "@/lib/hooks/use-users";
import { useOrganisations } from "@/lib/hooks/use-organisations";
import { useCareHomesByOrganisation } from "@/lib/hooks/use-care-homes";
import { UserItem, UserRole, UserStatus, UserRoleAssignment } from "@/lib/api-users";
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
  Avatar,
  EmptyState,
  ErrorState,
  Skeleton,
  SkeletonRows,
  Spinner,
  Modal,
} from "@/components/dashboard/ui";
import {
  Users,
  Filter,
  CheckCircle2,
  Building2,
  Home,
  AlertCircle,
  AlertTriangle,
  Mail,
  Phone,
  ShieldCheck,
  Shield,
  Edit2,
  Plus,
  Trash2,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  Clock,
  RotateCcw,
} from "lucide-react";

const ALLOWED_VIEWER_ROLES = [
  "SUPER_ADMIN",
  "SYSTEM_ADMIN",
  "ORGANISATION_ADMIN",
  "CARE_HOME_ADMIN",
  "CARE_HOME_MANAGER",
];

const STATUS_FILTERS: { label: string; value: UserStatus | "" }[] = [
  { label: "All Statuses", value: "" },
  { label: "Active", value: "ACTIVE" },
  { label: "Pending", value: "PENDING" },
  { label: "Suspended", value: "SUSPENDED" },
  { label: "Inactive", value: "INACTIVE" },
];

const AVAILABLE_ROLES: { label: string; value: UserRole }[] = [
  { label: "Caregiver", value: "CAREGIVER" },
  { label: "Care Home Manager", value: "CARE_HOME_MANAGER" },
  { label: "Care Home Admin", value: "CARE_HOME_ADMIN" },
  { label: "Organisation Admin", value: "ORGANISATION_ADMIN" },
  { label: "Organisation Support", value: "ORGANISATION_SUPPORT" },
  { label: "Resident", value: "RESIDENT" },
  { label: "System Support", value: "SYSTEM_SUPPORT" },
  { label: "System Admin", value: "SYSTEM_ADMIN" },
  { label: "Super Admin", value: "SUPER_ADMIN" },
];

export default function UsersPage() {
  const { currentRole, roles } = useRole();

  const isAuthorized =
    ALLOWED_VIEWER_ROLES.includes(currentRole) ||
    roles.some((r) => ALLOWED_VIEWER_ROLES.includes(r));

  // Filter & Search states
  const [selectedStatus, setSelectedStatus] = useState<UserStatus | "">("");
  const [selectedRole, setSelectedRole] = useState<UserRole | "">("");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const pageSize = 20;

  // Modals state
  const [editingUser, setEditingUser] = useState<UserItem | null>(null);
  const [managingRolesUser, setManagingRolesUser] = useState<UserItem | null>(null);

  // Edit user form state
  const [editFirstName, setEditFirstName] = useState("");
  const [editMiddleName, setEditMiddleName] = useState("");
  const [editLastName, setEditLastName] = useState("");
  const [editPhone, setEditPhone] = useState("");

  // Assign role form state
  const [assignRole, setAssignRole] = useState<UserRole>("CAREGIVER");
  const [assignOrgId, setAssignOrgId] = useState("");
  const [assignCareHomeId, setAssignCareHomeId] = useState("");

  // Queries
  const { data, isLoading, isError, refetch } = useUsers({
    page,
    size: pageSize,
    status: selectedStatus || undefined,
    role: selectedRole || undefined,
    search: searchTerm.trim() || undefined,
  });

  const { data: rolesData, isLoading: isLoadingRoles } = useUserRoles(
    managingRolesUser?.publicId,
    { enabled: Boolean(managingRolesUser) }
  );

  // Mutations
  const updateMutation = useUpdateUserMutation();
  const assignRoleMutation = useAssignRoleMutation();
  const revokeRoleMutation = useRevokeRoleMutation();
  const updateRoleStatusMutation = useUpdateRoleStatusMutation();

  // Reference lookups for assigning roles
  const { data: orgsData } = useOrganisations(
    { page: 0, size: 100 },
    { enabled: Boolean(managingRolesUser) }
  );

  const { data: careHomesData } = useCareHomesByOrganisation(
    assignOrgId || null,
    { page: 0, size: 100 },
    { enabled: Boolean(managingRolesUser && assignOrgId) }
  );

  const activeOrganisations =
    orgsData?.content?.filter((o) => o.status?.toUpperCase() === "ACTIVE") || [];
  const activeCareHomes =
    careHomesData?.content?.filter((h) => h.status?.toUpperCase() === "ACTIVE") || [];

  const usersList = data?.content || [];
  const totalElements = data?.totalElements || 0;
  const totalPages = data?.totalPages || 1;

  // Handlers
  const handleOpenEdit = (user: UserItem) => {
    setEditingUser(user);
    setEditFirstName(user.firstName || "");
    setEditMiddleName(user.middleName || "");
    setEditLastName(user.lastName || "");
    setEditPhone(user.phone || "");
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    try {
      await updateMutation.mutateAsync({
        publicId: editingUser.publicId,
        payload: {
          firstName: editFirstName.trim(),
          middleName: editMiddleName.trim() || undefined,
          lastName: editLastName.trim(),
          phone: editPhone.trim() || undefined,
        },
      });
      setEditingUser(null);
    } catch {
      // Toast handled by mutation hook
    }
  };

  const handleOpenManageRoles = (user: UserItem) => {
    setManagingRolesUser(user);
    setAssignRole("CAREGIVER");
    setAssignOrgId(user.organisationPublicId || "");
    setAssignCareHomeId("");
  };

  const handleAssignRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!managingRolesUser) return;

    try {
      await assignRoleMutation.mutateAsync({
        publicId: managingRolesUser.publicId,
        payload: {
          role: assignRole,
          organisationPublicId: assignOrgId || undefined,
          careHomePublicId: assignCareHomeId || undefined,
        },
      });
      setAssignRole("CAREGIVER");
      setAssignCareHomeId("");
    } catch {
      // Toast handled by mutation hook
    }
  };

  const handleRevokeRole = async (assignmentPublicId: string) => {
    if (!managingRolesUser) return;
    if (!confirm("Are you sure you want to revoke this role assignment?")) return;

    try {
      await revokeRoleMutation.mutateAsync({
        publicId: managingRolesUser.publicId,
        assignmentPublicId,
      });
    } catch {
      // Toast handled by mutation hook
    }
  };

  const handleToggleStatus = async (user: UserItem, assignment: UserRoleAssignment) => {
    const nextStatus = user.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
    try {
      await updateRoleStatusMutation.mutateAsync({
        publicId: user.publicId,
        assignmentPublicId: assignment.assignmentPublicId,
        payload: { status: nextStatus },
      });
    } catch {
      // Toast handled by mutation hook
    }
  };

  if (!isAuthorized) {
    return (
      <div className="space-y-6">
        <div className="max-w-xl mx-auto my-12 bg-white border border-ink/[0.08] rounded-md">
          <EmptyState
            icon={AlertTriangle}
            title="Restricted Administration Domain"
            description="User management and role provisioning are restricted to platform and organisation administrators."
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        icon={Users}
        eyebrow={
          <Badge tone="teal" dot>
            {isLoading ? "—" : totalElements} Accounts
          </Badge>
        }
        title="User Directory & Identity"
        description="Manage user accounts, assign facility roles, and configure identity credentials."
        actions={
          <>
            <button
              onClick={() => refetch()}
              disabled={isLoading}
              className={`${btn.secondary} group`}
            >
              <RefreshCw
                className={`h-4 w-4 transition-transform duration-500 group-hover:rotate-180 ${
                  isLoading ? "animate-spin" : ""
                }`}
              />
              Refresh
            </button>

            <Link href="/dashboard/invitations" className={`${btn.primary} group`}>
              <Mail className="h-4 w-4 transition-transform group-hover:-translate-y-0.5" />
              <span>Invite New User</span>
            </Link>
          </>
        }
      />

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          className="col-span-2 lg:col-span-1"
          label="Total Accounts"
          value={isLoading ? "—" : totalElements}
          icon={Users}
          tone="teal"
          hint="Registered users"
          hintMuted
        />
        <StatCard
          label="Active Accounts"
          value={
            isLoading
              ? "—"
              : usersList.filter((u) => u.status?.toUpperCase() === "ACTIVE").length
          }
          icon={CheckCircle2}
          tone="sky"
          hint="Operational users in view"
        />
        <StatCard
          label="Pending / Suspended"
          value={
            isLoading
              ? "—"
              : usersList.filter(
                  (u) =>
                    u.status?.toUpperCase() === "PENDING" ||
                    u.status?.toUpperCase() === "SUSPENDED"
                ).length
          }
          icon={Clock}
          tone="sun"
          hint="Requires attention"
          hintMuted
        />
      </div>

      {/* Filters Bar */}
      <div className="space-y-3">
        {/* Status Filter Tabs */}
        <Segmented
          value={selectedStatus}
          onChange={(v) => {
            setSelectedStatus(v);
            setPage(0);
          }}
          options={STATUS_FILTERS.map((st) => ({ value: st.value, label: st.label }))}
          className="w-full sm:w-auto"
        />

        {/* Search & Role Filter Bar */}
        <Toolbar>
          <SearchField
            value={searchTerm}
            onChange={(v) => {
              setSearchTerm(v);
              setPage(0);
            }}
            placeholder="Search by name, email, phone or org..."
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
                setSelectedRole(e.target.value as UserRole);
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

            {(searchTerm || selectedStatus || selectedRole) && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedStatus("");
                  setSelectedRole("");
                  setPage(0);
                }}
                className={`${btn.ghost} shrink-0 text-teal-deep`}
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Reset
              </button>
            )}
          </div>
        </Toolbar>
      </div>

      {/* Main Table */}
      <Panel
        flush
        icon={Users}
        title="User accounts"
        description="Select a user to manage their role assignments"
      >
        {isLoading ? (
          <SkeletonRows rows={5} />
        ) : isError ? (
          <div className="p-5">
            <ErrorState
              title="Failed to load users"
              message="There was an issue retrieving the user directory from the server."
              onRetry={() => refetch()}
            />
          </div>
        ) : usersList.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No users found"
            description={
              searchTerm || selectedStatus || selectedRole
                ? "No user records match your search criteria. Try adjusting or clearing filters."
                : "No registered users exist in this partition."
            }
          />
        ) : (
          <>
            {/* Desktop table */}
            <div className={`hidden md:block ${table.wrap}`}>
              <table className={table.table}>
                <thead>
                  <tr>
                    <th className={table.th}>User / Identity</th>
                    <th className={table.th}>Contact Details</th>
                    <th className={table.th}>Organisation</th>
                    <th className={table.th}>Email Verification</th>
                    <th className={table.th}>Status</th>
                    <th className={`${table.th} text-right`}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {usersList.map((u) => {
                    const fullName = `${u.firstName || ""} ${
                      u.middleName ? u.middleName + " " : ""
                    }${u.lastName || ""}`.trim() || "Unnamed User";

                    return (
                      <tr
                        key={u.publicId}
                        className={`${table.tr} cursor-pointer`}
                        onClick={() => handleOpenManageRoles(u)}
                      >
                        <td className={table.td}>
                          <div className="flex items-center gap-3 min-w-0">
                            <Avatar
                              name={`${u.firstName || ""} ${u.lastName || ""}`.trim() || "U"}
                              className="transition-transform duration-300 group-hover:scale-105"
                            />
                            <div className="min-w-0">
                              <div className="font-semibold text-sm text-ink truncate max-w-[16rem]">
                                {fullName}
                              </div>
                              <div className="text-[10px] text-ink/45 font-mono truncate max-w-[16rem]">
                                {u.publicId}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className={table.td}>
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-1.5 text-ink text-xs">
                              <Mail className="h-3.5 w-3.5 text-ink/35 shrink-0" />
                              <span className="truncate max-w-[14rem]">{u.email}</span>
                            </div>
                            {u.phone && (
                              <div className="flex items-center gap-1.5 text-ink/55 text-[11px]">
                                <Phone className="h-3 w-3 text-ink/35 shrink-0" />
                                <span>{u.phone}</span>
                              </div>
                            )}
                          </div>
                        </td>

                        <td className={table.td}>
                          <div className="flex items-center gap-1.5 text-xs font-medium text-ink">
                            <Building2 className="h-3.5 w-3.5 text-teal-brand shrink-0" />
                            <span className="truncate max-w-[12rem]">
                              {u.organisationName || "Unassigned"}
                            </span>
                          </div>
                        </td>

                        <td className={table.td}>
                          {u.emailVerified ? (
                            <Badge tone="green" icon={CheckCircle2}>
                              Verified
                            </Badge>
                          ) : (
                            <Badge tone="amber" icon={AlertCircle}>
                              Unverified
                            </Badge>
                          )}
                        </td>

                        <td className={table.td}>
                          <StatusBadge status={u.status} />
                        </td>

                        <td className={`${table.td} text-right`}>
                          <div
                            className="flex items-center justify-end gap-1"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              onClick={() => handleOpenManageRoles(u)}
                              className={`${btn.ghost} ${btn.sm} text-teal-deep hover:bg-mint`}
                              title="Manage user role assignments"
                            >
                              <Shield className="h-3.5 w-3.5" />
                              Roles
                            </button>

                            <button
                              onClick={() => handleOpenEdit(u)}
                              className={btn.icon}
                              title="Edit user details"
                              aria-label="Edit user details"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
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
              {usersList.map((u) => {
                const fullName = `${u.firstName || ""} ${
                  u.middleName ? u.middleName + " " : ""
                }${u.lastName || ""}`.trim() || "Unnamed User";

                return (
                  <li
                    key={u.publicId}
                    className="p-4 cursor-pointer transition-colors active:bg-mint/40 hover:bg-mint/20"
                    onClick={() => handleOpenManageRoles(u)}
                  >
                    <div className="flex items-start gap-3">
                      <Avatar name={`${u.firstName || ""} ${u.lastName || ""}`.trim() || "U"} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <div className="font-semibold text-sm text-ink truncate">
                              {fullName}
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-ink/60 mt-0.5 min-w-0">
                              <Mail className="h-3 w-3 text-ink/35 shrink-0" />
                              <span className="truncate">{u.email}</span>
                            </div>
                          </div>
                          <StatusBadge status={u.status} className="shrink-0" />
                        </div>

                        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[11px] text-ink/60">
                          {u.phone && (
                            <span className="inline-flex items-center gap-1">
                              <Phone className="h-3 w-3 text-ink/35" />
                              {u.phone}
                            </span>
                          )}
                          <span className="inline-flex items-center gap-1 min-w-0">
                            <Building2 className="h-3 w-3 text-teal-brand shrink-0" />
                            <span className="truncate">{u.organisationName || "Unassigned"}</span>
                          </span>
                          {u.emailVerified ? (
                            <Badge tone="green" icon={CheckCircle2}>
                              Verified
                            </Badge>
                          ) : (
                            <Badge tone="amber" icon={AlertCircle}>
                              Unverified
                            </Badge>
                          )}
                        </div>

                        <div
                          className="mt-3 flex items-center gap-2"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            onClick={() => handleOpenManageRoles(u)}
                            className={`${btn.secondary} ${btn.sm} flex-1`}
                            title="Manage user role assignments"
                          >
                            <Shield className="h-3.5 w-3.5 text-teal-brand" />
                            Roles
                          </button>
                          <button
                            onClick={() => handleOpenEdit(u)}
                            className={`${btn.secondary} ${btn.sm} flex-1`}
                            title="Edit user details"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                            Edit
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </>
        )}

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="px-5 py-3.5 border-t border-ink/[0.06] bg-[#f8faf9] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-ink/60">
            <span className="tabular-nums">
              Page <span className="font-semibold text-ink">{page + 1}</span> of {totalPages} (
              {totalElements} users)
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={page <= 0}
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                className={`${btn.secondary} ${btn.sm} group`}
              >
                <ChevronLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
                Previous
              </button>
              <button
                disabled={page >= totalPages - 1}
                onClick={() => setPage((p) => p + 1)}
                className={`${btn.secondary} ${btn.sm} group`}
              >
                Next
                <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>
          </div>
        )}
      </Panel>

      {/* -------------------------------------------------------------------- */}
      {/* MODAL 1: Manage Roles & Permissions                                  */}
      {/* -------------------------------------------------------------------- */}
      {managingRolesUser && (
        <Modal
          open
          onClose={() => setManagingRolesUser(null)}
          size="lg"
          icon={Shield}
          title={
            <>
              Manage Roles: {managingRolesUser.firstName} {managingRolesUser.lastName}
            </>
          }
          description={managingRolesUser.email}
          footer={
            <button
              type="button"
              onClick={() => setManagingRolesUser(null)}
              className={btn.secondary}
            >
              Done
            </button>
          }
        >
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="teal" icon={ShieldCheck}>
                Identity & Access Management
              </Badge>
              <span className="text-[11px] font-mono text-ink/45 break-all">
                ID: {managingRolesUser.publicId}
              </span>
            </div>

            {/* Current Assigned Roles */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold text-ink uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-teal-brand" />
                Active Role Assignments
                <span className="px-1.5 rounded-full bg-ink/[0.06] text-[10px] text-ink/60 tabular-nums">
                  {rolesData?.length ?? 0}
                </span>
              </h3>

              {isLoadingRoles ? (
                <div className="space-y-2">
                  <Skeleton className="h-14 w-full" />
                  <Skeleton className="h-14 w-full" />
                </div>
              ) : rolesData && rolesData.length > 0 ? (
                <ul className="space-y-2">
                  {rolesData.map((ra) => (
                    <li
                      key={ra.assignmentPublicId}
                      className="p-3.5 rounded-md bg-white border border-ink/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all hover:border-teal-brand/30 hover:shadow-sm"
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <span className="grid place-items-center w-9 h-9 rounded-md bg-mint text-teal-brand shrink-0">
                          <ShieldCheck className="h-4 w-4" />
                        </span>
                        <div className="min-w-0 space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge tone="teal">{ra.role}</Badge>
                            {ra.assignedAt && (
                              <span className="text-[10px] text-ink/50">
                                Assigned: {new Date(ra.assignedAt).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                          <div className="text-ink/70 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px]">
                            {ra.organisationName && (
                              <span className="flex items-center gap-1">
                                <Building2 className="h-3 w-3 text-ink/40" />
                                {ra.organisationName}
                              </span>
                            )}
                            {ra.careHomeName && (
                              <span className="flex items-center gap-1">
                                <Home className="h-3 w-3 text-ink/40" />
                                {ra.careHomeName}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-auto">
                        <button
                          onClick={() => handleToggleStatus(managingRolesUser, ra)}
                          disabled={updateRoleStatusMutation.isPending}
                          className={`${btn.secondary} ${btn.sm}`}
                        >
                          {managingRolesUser.status === "ACTIVE"
                            ? "Suspend"
                            : "Activate"}
                        </button>

                        <button
                          onClick={() => handleRevokeRole(ra.assignmentPublicId)}
                          disabled={revokeRoleMutation.isPending}
                          className={`${btn.icon} text-red-600 hover:text-red-700 hover:bg-red-50`}
                          title="Revoke role assignment"
                          aria-label="Revoke role assignment"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-5 rounded-md border border-dashed border-ink/15 bg-ink/[0.015] text-center text-xs text-ink/50">
                  No explicit role assignments found for this account.
                </div>
              )}
            </div>

            {/* Grant New Role Assignment Section */}
            <form
              onSubmit={handleAssignRole}
              className="p-4 sm:p-5 rounded-md bg-gradient-to-br from-mint/50 to-white border border-teal-brand/15 space-y-4"
            >
              <h4 className="text-xs font-semibold text-ink uppercase tracking-wider flex items-center gap-1.5">
                <Plus className="h-4 w-4 text-teal-brand" />
                Grant New Role Assignment
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className={field.label}>Role *</label>
                  <select
                    value={assignRole}
                    onChange={(e) => setAssignRole(e.target.value as UserRole)}
                    className={`${field.input} cursor-pointer`}
                  >
                    {AVAILABLE_ROLES.map((r) => (
                      <option key={r.value} value={r.value}>
                        {r.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={field.label}>Organisation Scope</label>
                  <select
                    value={assignOrgId}
                    onChange={(e) => {
                      setAssignOrgId(e.target.value);
                      setAssignCareHomeId("");
                    }}
                    className={`${field.input} cursor-pointer`}
                  >
                    <option value="">-- None / System Level --</option>
                    {activeOrganisations.map((org) => (
                      <option key={org.publicId} value={org.publicId}>
                        {org.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={field.label}>Care Facility Scope</label>
                  <select
                    value={assignCareHomeId}
                    onChange={(e) => setAssignCareHomeId(e.target.value)}
                    disabled={!assignOrgId}
                    className={`${field.input} cursor-pointer`}
                  >
                    <option value="">-- None / All Homes in Org --</option>
                    {activeCareHomes.map((home) => (
                      <option key={home.publicId} value={home.publicId}>
                        {home.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={assignRoleMutation.isPending}
                  className={`${btn.primary} w-full sm:w-auto`}
                >
                  {assignRoleMutation.isPending ? (
                    <Spinner className="h-3.5 w-3.5" />
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}
                  {assignRoleMutation.isPending ? "Assigning..." : "Grant Role Assignment"}
                </button>
              </div>
            </form>
          </div>
        </Modal>
      )}

      {/* -------------------------------------------------------------------- */}
      {/* MODAL 2: Edit User Profile                                           */}
      {/* -------------------------------------------------------------------- */}
      {editingUser && (
        <Modal
          open
          onClose={() => setEditingUser(null)}
          size="sm"
          icon={UserCheck}
          title="Edit User Profile"
          footer={
            <>
              <button
                type="button"
                onClick={() => setEditingUser(null)}
                className={btn.secondary}
              >
                Cancel
              </button>
              <button
                type="submit"
                form="edit-user-form"
                disabled={updateMutation.isPending}
                className={btn.primary}
              >
                {updateMutation.isPending && <Spinner className="h-3.5 w-3.5" />}
                {updateMutation.isPending ? "Saving..." : "Save Changes"}
              </button>
            </>
          }
        >
          <form id="edit-user-form" onSubmit={handleSaveEdit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className={field.label}>First Name *</label>
                <input
                  type="text"
                  required
                  value={editFirstName}
                  onChange={(e) => setEditFirstName(e.target.value)}
                  className={field.input}
                />
              </div>

              <div>
                <label className={field.label}>Middle Name</label>
                <input
                  type="text"
                  value={editMiddleName}
                  onChange={(e) => setEditMiddleName(e.target.value)}
                  className={field.input}
                />
              </div>
            </div>

            <div>
              <label className={field.label}>Last Name *</label>
              <input
                type="text"
                required
                value={editLastName}
                onChange={(e) => setEditLastName(e.target.value)}
                className={field.input}
              />
            </div>

            <div>
              <label className={field.label}>Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-ink/35 pointer-events-none" />
                <input
                  type="text"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  placeholder="+44 7700 900123"
                  className={`${field.input} pl-10`}
                />
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-md bg-mint/40 border border-teal-brand/15 text-xs text-ink/70">
              <Mail className="h-4 w-4 text-teal-brand shrink-0 mt-0.5" />
              <div className="min-w-0">
                <p>
                  Email:{" "}
                  <span className="font-semibold text-ink break-all">{editingUser.email}</span>
                </p>
                <p className="text-[11px] text-ink/50 mt-0.5">
                  Primary email address is bound to identity credentials.
                </p>
              </div>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
