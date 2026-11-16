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
import { toast } from "@/components/ui/toast";
import {
  Users,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Building2,
  Home,
  AlertCircle,
  AlertTriangle,
  Eye,
  Mail,
  Phone,
  Calendar,
  ShieldCheck,
  ShieldAlert,
  Shield,
  Edit2,
  Plus,
  Trash2,
  RefreshCw,
  X,
  Check,
  ChevronLeft,
  ChevronRight,
  UserCheck,
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
      <div className="p-8 rounded-md bg-white border border-ink/10 text-center max-w-xl mx-auto space-y-4 my-12 shadow-xs">
        <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center mx-auto">
          <AlertTriangle className="h-6 w-6" />
        </div>
        <h2 className="text-xl font-bold text-ink font-heading">
          Restricted Administration Domain
        </h2>
        <p className="text-xs text-ink/70 leading-relaxed">
          User management and role provisioning are restricted to platform and
          organisation administrators.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-ink font-heading">
              User Directory & Identity
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-mint text-teal-deep font-semibold">
              {isLoading ? "—" : totalElements} Accounts
            </span>
          </div>
          <p className="text-sm text-ink/70 mt-1">
            Manage user accounts, assign facility roles, and configure identity
            credentials.
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

          <Link
            href="/dashboard/invitations"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-teal-brand text-white text-xs font-semibold hover:bg-teal-deep transition-all shadow-sm cursor-pointer"
          >
            <Mail className="h-4 w-4" />
            <span>Invite New User</span>
          </Link>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-md bg-white border border-ink/10 shadow-xs">
          <span className="text-xs font-semibold text-ink/60 uppercase tracking-wider">
            Total Accounts
          </span>
          <p className="text-3xl font-bold text-ink mt-1">
            {isLoading ? "—" : totalElements}
          </p>
          <span className="text-xs text-ink/60">Registered users</span>
        </div>

        <div className="p-5 rounded-md bg-white border border-ink/10 shadow-xs">
          <span className="text-xs font-semibold text-ink/60 uppercase tracking-wider">
            Active Accounts
          </span>
          <p className="text-3xl font-bold text-emerald-700 mt-1">
            {isLoading
              ? "—"
              : usersList.filter((u) => u.status?.toUpperCase() === "ACTIVE").length}
          </p>
          <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" />
            Operational users in view
          </span>
        </div>

        <div className="p-5 rounded-md bg-white border border-ink/10 shadow-xs">
          <span className="text-xs font-semibold text-ink/60 uppercase tracking-wider">
            Pending / Suspended
          </span>
          <p className="text-3xl font-bold text-amber-700 mt-1">
            {isLoading
              ? "—"
              : usersList.filter(
                  (u) =>
                    u.status?.toUpperCase() === "PENDING" ||
                    u.status?.toUpperCase() === "SUSPENDED"
                ).length}
          </p>
          <span className="text-xs text-ink/60">Requires attention</span>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="space-y-3">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-ink/[0.04] border border-ink/[0.07] overflow-x-auto scrollbar-none">
          {STATUS_FILTERS.map((st) => {
            const isActive = selectedStatus === st.value;
            return (
              <button
                key={st.value}
                onClick={() => {
                  setSelectedStatus(st.value);
                  setPage(0);
                }}
                className={`tab-btn px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                  isActive
                    ? "bg-teal-brand text-white shadow-xs"
                    : "text-ink/65 hover:text-ink hover:bg-white/60"
                }`}
              >
                <span>{st.label}</span>
              </button>
            );
          })}
        </div>

        {/* Search & Role Filter Bar */}
        <div className="p-4 rounded-md bg-white border border-ink/10 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-ink/40" />
            <input
              type="text"
              placeholder="Search by name, email, phone or org..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(0);
              }}
              className="w-full pl-10 pr-4 py-2 text-sm rounded-md border border-ink/10 bg-cream/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-brand/20 transition-all text-ink"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="h-4 w-4 text-ink/40" />
            <span className="text-xs text-ink/60 font-medium">Role:</span>
            <select
              value={selectedRole}
              onChange={(e) => {
                setSelectedRole(e.target.value as UserRole);
                setPage(0);
              }}
              className="text-xs rounded-md border border-ink/10 px-3 py-2 bg-cream/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-brand/20 font-medium text-ink"
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
                className="text-xs text-teal-deep font-semibold hover:underline cursor-pointer ml-1"
              >
                Reset
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="rounded-md bg-white border border-ink/10 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-8 space-y-4">
            <div className="h-6 w-48 skeleton rounded-md" />
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-12 w-full skeleton rounded-md" />
              ))}
            </div>
          </div>
        ) : isError ? (
          <div className="p-12 text-center space-y-3">
            <AlertCircle className="h-8 w-8 text-destructive mx-auto" />
            <p className="font-bold text-ink text-sm">Failed to load users</p>
            <p className="text-xs text-ink/60">
              There was an issue retrieving the user directory from the server.
            </p>
            <button
              onClick={() => refetch()}
              className="px-4 py-1.5 rounded-md bg-teal-brand text-white text-xs font-semibold hover:bg-teal-deep transition-all cursor-pointer"
            >
              Retry
            </button>
          </div>
        ) : usersList.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-cream text-ink/40 flex items-center justify-center mx-auto">
              <Users className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-ink text-sm">No users found</h3>
            <p className="text-xs text-ink/60 max-w-sm mx-auto">
              {searchTerm || selectedStatus || selectedRole
                ? "No user records match your search criteria. Try adjusting or clearing filters."
                : "No registered users exist in this partition."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="whitespace-nowrap w-full text-left text-xs text-ink">
              <thead className="bg-cream/40 border-b border-ink/10 text-ink/60 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3.5 px-6">User / Identity</th>
                  <th className="py-3.5 px-4">Contact Details</th>
                  <th className="py-3.5 px-4">Organisation</th>
                  <th className="py-3.5 px-4">Email Verification</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/5">
                {usersList.map((u) => {
                  const fullName = `${u.firstName || ""} ${
                    u.middleName ? u.middleName + " " : ""
                  }${u.lastName || ""}`.trim() || "Unnamed User";
                  const initials =
                    ((u.firstName?.[0] || "") + (u.lastName?.[0] || "")).toUpperCase() ||
                    "U";

                  return (
                    <tr
                      key={u.publicId}
                      className="hover:bg-cream/20 transition-colors cursor-pointer"
                      onClick={() => handleOpenManageRoles(u)}
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-mint text-teal-deep font-bold text-xs shadow-xs">
                            {initials}
                          </div>
                          <div>
                            <div className="font-bold text-sm text-ink">
                              {fullName}
                            </div>
                            <div className="text-[10px] text-ink/50 font-mono">
                              {u.publicId}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4 space-y-0.5">
                        <div className="flex items-center gap-1.5 text-ink">
                          <Mail className="h-3.5 w-3.5 text-ink/40" />
                          <span>{u.email}</span>
                        </div>
                        {u.phone && (
                          <div className="flex items-center gap-1.5 text-ink/60 text-[11px]">
                            <Phone className="h-3 w-3 text-ink/40" />
                            <span>{u.phone}</span>
                          </div>
                        )}
                      </td>

                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1.5 font-medium text-ink">
                          <Building2 className="h-3.5 w-3.5 text-teal-brand shrink-0" />
                          <span>{u.organisationName || "Unassigned"}</span>
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        {u.emailVerified ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="h-3 w-3" />
                            Verified
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                            <AlertCircle className="h-3 w-3" />
                            Unverified
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                            u.status?.toUpperCase() === "ACTIVE"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : u.status?.toUpperCase() === "PENDING"
                              ? "bg-amber-50 text-amber-700 border border-amber-200"
                              : u.status?.toUpperCase() === "SUSPENDED"
                              ? "bg-rose-50 text-rose-700 border border-rose-200"
                              : "bg-ink/5 text-ink/70 border border-ink/10"
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              u.status?.toUpperCase() === "ACTIVE"
                                ? "bg-emerald-500"
                                : u.status?.toUpperCase() === "PENDING"
                                ? "bg-amber-500"
                                : "bg-rose-500"
                            }`}
                          />
                          {u.status}
                        </span>
                      </td>

                      <td className="py-4 px-6 text-right">
                        <div
                          className="flex items-center justify-end gap-1.5"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            onClick={() => handleOpenManageRoles(u)}
                            className="px-2.5 py-1.5 rounded-md bg-cream hover:bg-mint text-teal-deep text-xs font-semibold transition-all cursor-pointer inline-flex items-center gap-1"
                            title="Manage user role assignments"
                          >
                            <Shield className="h-3.5 w-3.5" />
                            Roles
                          </button>

                          <button
                            onClick={() => handleOpenEdit(u)}
                            className="px-2.5 py-1.5 rounded-md border border-ink/10 hover:bg-cream text-ink/80 text-xs font-semibold transition-all cursor-pointer inline-flex items-center gap-1"
                            title="Edit user details"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                            Edit
                          </button>
                        </div>
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
              Page {page + 1} of {totalPages} ({totalElements} users)
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
      {/* MODAL 1: Manage Roles & Permissions                                  */}
      {/* -------------------------------------------------------------------- */}
      {managingRolesUser && (
        <div className="fixed inset-0 z-50 bg-ink/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-white rounded-md p-6 shadow-2xl border border-ink/10 space-y-6 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between border-b border-ink/10 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-mint text-teal-deep font-semibold">
                    Identity & Access Management
                  </span>
                  <span className="text-xs font-mono text-ink/50">
                    ID: {managingRolesUser.publicId}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-ink font-heading mt-1">
                  Manage Roles: {managingRolesUser.firstName}{" "}
                  {managingRolesUser.lastName}
                </h2>
                <p className="text-xs text-ink/60">{managingRolesUser.email}</p>
              </div>

              <button
                onClick={() => setManagingRolesUser(null)}
                className="text-ink/40 hover:text-ink p-1 rounded-md cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Current Assigned Roles */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-ink uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-teal-brand" />
                Active Role Assignments ({rolesData?.length ?? 0})
              </h3>

              {isLoadingRoles ? (
                <div className="space-y-2">
                  <div className="h-12 w-full skeleton rounded-md" />
                  <div className="h-12 w-full skeleton rounded-md" />
                </div>
              ) : rolesData && rolesData.length > 0 ? (
                <div className="space-y-2">
                  {rolesData.map((ra) => (
                    <div
                      key={ra.assignmentPublicId}
                      className="p-3.5 rounded-md bg-cream/30 border border-ink/10 flex items-center justify-between gap-4 text-xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-teal-brand text-white font-bold text-[10px]">
                            {ra.role}
                          </span>
                          {ra.assignedAt && (
                            <span className="text-[10px] text-ink/50">
                              Assigned: {new Date(ra.assignedAt).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                        <div className="text-ink/80 flex flex-wrap items-center gap-x-3 text-[11px]">
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

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => handleToggleStatus(managingRolesUser, ra)}
                          disabled={updateRoleStatusMutation.isPending}
                          className="px-2.5 py-1 rounded border border-ink/15 text-[11px] font-semibold text-ink/70 hover:bg-cream cursor-pointer"
                        >
                          {managingRolesUser.status === "ACTIVE"
                            ? "Suspend"
                            : "Activate"}
                        </button>

                        <button
                          onClick={() => handleRevokeRole(ra.assignmentPublicId)}
                          disabled={revokeRoleMutation.isPending}
                          className="p-1.5 rounded text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Revoke role assignment"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 rounded-md bg-cream/20 border border-ink/5 text-center text-xs text-ink/50 italic">
                  No explicit role assignments found for this account.
                </div>
              )}
            </div>

            {/* Grant New Role Assignment Section */}
            <form
              onSubmit={handleAssignRole}
              className="p-4 rounded-md bg-cream/40 border border-ink/10 space-y-3 text-xs"
            >
              <h4 className="font-bold text-ink uppercase tracking-wider flex items-center gap-1.5">
                <Plus className="h-4 w-4 text-teal-brand" />
                Grant New Role Assignment
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-ink">Role *</label>
                  <select
                    value={assignRole}
                    onChange={(e) => setAssignRole(e.target.value as UserRole)}
                    className="w-full p-2 rounded-md border border-ink/15 bg-white text-ink text-xs focus:ring-2 focus:ring-teal-brand/20"
                  >
                    {AVAILABLE_ROLES.map((r) => (
                      <option key={r.value} value={r.value}>
                        {r.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-ink">Organisation Scope</label>
                  <select
                    value={assignOrgId}
                    onChange={(e) => {
                      setAssignOrgId(e.target.value);
                      setAssignCareHomeId("");
                    }}
                    className="w-full p-2 rounded-md border border-ink/15 bg-white text-ink text-xs focus:ring-2 focus:ring-teal-brand/20"
                  >
                    <option value="">-- None / System Level --</option>
                    {activeOrganisations.map((org) => (
                      <option key={org.publicId} value={org.publicId}>
                        {org.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-ink">Care Facility Scope</label>
                  <select
                    value={assignCareHomeId}
                    onChange={(e) => setAssignCareHomeId(e.target.value)}
                    disabled={!assignOrgId}
                    className="w-full p-2 rounded-md border border-ink/15 bg-white text-ink text-xs focus:ring-2 focus:ring-teal-brand/20 disabled:opacity-50"
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

              <div className="text-right pt-1">
                <button
                  type="submit"
                  disabled={assignRoleMutation.isPending}
                  className="px-4 py-2 rounded-md bg-teal-brand text-white font-semibold text-xs hover:bg-teal-deep transition-all cursor-pointer disabled:opacity-50 inline-flex items-center gap-1.5"
                >
                  {assignRoleMutation.isPending && (
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  )}
                  {assignRoleMutation.isPending ? "Assigning..." : "Grant Role Assignment"}
                </button>
              </div>
            </form>

            <div className="pt-2 text-right border-t border-ink/10">
              <button
                onClick={() => setManagingRolesUser(null)}
                className="px-4 py-2 rounded-md bg-cream text-ink text-xs font-semibold hover:bg-mint hover:text-teal-deep cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------------- */}
      {/* MODAL 2: Edit User Profile                                           */}
      {/* -------------------------------------------------------------------- */}
      {editingUser && (
        <div className="fixed inset-0 z-50 bg-ink/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-md p-6 shadow-2xl border border-ink/10 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-ink/10 pb-3">
              <div className="flex items-center gap-2 text-teal-brand">
                <UserCheck className="h-5 w-5" />
                <h3 className="text-lg font-bold text-ink">Edit User Profile</h3>
              </div>
              <button
                onClick={() => setEditingUser(null)}
                className="text-ink/40 hover:text-ink p-1 rounded-md cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-ink">First Name *</label>
                  <input
                    type="text"
                    required
                    value={editFirstName}
                    onChange={(e) => setEditFirstName(e.target.value)}
                    className="w-full p-2.5 rounded-md border border-ink/15 bg-cream/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-brand/20 text-ink text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-ink">Middle Name</label>
                  <input
                    type="text"
                    value={editMiddleName}
                    onChange={(e) => setEditMiddleName(e.target.value)}
                    className="w-full p-2.5 rounded-md border border-ink/15 bg-cream/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-brand/20 text-ink text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-ink">Last Name *</label>
                <input
                  type="text"
                  required
                  value={editLastName}
                  onChange={(e) => setEditLastName(e.target.value)}
                  className="w-full p-2.5 rounded-md border border-ink/15 bg-cream/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-brand/20 text-ink text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-ink">Phone Number</label>
                <input
                  type="text"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  placeholder="+44 7700 900123"
                  className="w-full p-2.5 rounded-md border border-ink/15 bg-cream/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-brand/20 text-ink text-xs"
                />
              </div>

              <div className="p-3 rounded-md bg-cream/40 border border-ink/10 text-[11px] text-ink/70">
                <p>Email: <span className="font-semibold text-ink">{editingUser.email}</span></p>
                <p className="text-[10px] text-ink/50 mt-0.5">Primary email address is bound to identity credentials.</p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 rounded-md border border-ink/15 text-ink/70 hover:bg-cream cursor-pointer font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updateMutation.isPending}
                  className="px-4 py-2 rounded-md bg-teal-brand text-white font-semibold hover:bg-teal-deep cursor-pointer disabled:opacity-50 inline-flex items-center gap-1.5"
                >
                  {updateMutation.isPending && (
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  )}
                  {updateMutation.isPending ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
