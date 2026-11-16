"use client";

import { useState } from "react";
import Link from "next/link";
import { useRole } from "@/lib/role-context";
import {
  useOrganisations,
  useCreateOrganisationMutation,
  useUpdateOrganisationMutation,
  useUpdateOrganisationStatusMutation,
} from "@/lib/hooks/use-organisations";
import {
  OrganisationItem,
  OrganisationStatus,
  CreateOrganisationPayload,
} from "@/lib/api-organisations";
import { toast } from "@/components/ui/toast";
import {
  Building2,
  Search,
  Plus,
  ShieldCheck,
  Home,
  Users,
  CheckCircle2,
  AlertTriangle,
  MoreVertical,
  ExternalLink,
  Crown,
  RefreshCw,
  Mail,
  Phone,
  Globe,
  MapPin,
  Calendar,
  Copy,
  Check,
  Edit2,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";

const STATUS_FILTERS: { label: string; value: OrganisationStatus | "" }[] = [
  { label: "All Statuses", value: "" },
  { label: "Active", value: "ACTIVE" },
  { label: "Pending", value: "PENDING" },
  { label: "Suspended", value: "SUSPENDED" },
  { label: "Inactive", value: "INACTIVE" },
];

export default function OrganisationsPage() {
  const { currentRole, roles } = useRole();

  // Search & Filters
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<OrganisationStatus | "">(
    "",
  );
  const [page, setPage] = useState(0);
  const pageSize = 20;

  // Modals state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingOrg, setEditingOrg] = useState<OrganisationItem | null>(null);
  const [viewingOrg, setViewingOrg] = useState<OrganisationItem | null>(null);
  const [statusOrg, setStatusOrg] = useState<OrganisationItem | null>(null);
  const [confirmStatusOrg, setConfirmStatusOrg] = useState<{
    org: OrganisationItem;
    targetStatus: OrganisationStatus;
  } | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // New Org Form
  const [createForm, setCreateForm] = useState<CreateOrganisationPayload>({
    name: "",
    email: "",
    phone: "",
    website: "",
    address: "",
    city: "",
    state: "",
    country: "United Kingdom",
    postalCode: "",
  });

  // Queries & Mutations
  const { data, isLoading, isError, error, refetch, isFetching } =
    useOrganisations({
      page,
      size: pageSize,
      search: search.trim(),
      status: selectedStatus || undefined,
    });

  const createMutation = useCreateOrganisationMutation();
  const updateMutation = useUpdateOrganisationMutation();
  const statusMutation = useUpdateOrganisationStatusMutation();

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.info("Organisation ID copied to clipboard");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createForm.name || !createForm.email) {
      toast.error("Organisation name and email are required");
      return;
    }

    try {
      await createMutation.mutateAsync(createForm);
      setShowCreateModal(false);
      setCreateForm({
        name: "",
        email: "",
        phone: "",
        website: "",
        address: "",
        city: "",
        state: "",
        country: "United Kingdom",
        postalCode: "",
      });
    } catch {
      // handled in mutation hook
    }
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOrg) return;

    try {
      await updateMutation.mutateAsync({
        publicId: editingOrg.publicId,
        payload: {
          name: editingOrg.name,
          email: editingOrg.email,
          phone: editingOrg.phone,
          website: editingOrg.website,
          address: editingOrg.address,
          city: editingOrg.city,
          state: editingOrg.state,
          country: editingOrg.country,
          postalCode: editingOrg.postalCode,
        },
      });
      setEditingOrg(null);
    } catch {
      // handled in mutation hook
    }
  };

  const handleStatusChange = async (
    publicId: string,
    status: OrganisationStatus,
  ) => {
    try {
      await statusMutation.mutateAsync({ publicId, status });
      setStatusOrg(null);
    } catch {
      // handled in mutation hook
    }
  };

  const organisations = data?.content || [];

  // Robust case-insensitive status and search filtering
  const filteredOrganisations = organisations.filter((org) => {
    if (
      selectedStatus &&
      org.status?.toUpperCase() !== selectedStatus.toUpperCase()
    ) {
      return false;
    }
    if (search && search.trim()) {
      const term = search.toLowerCase().trim();
      return (
        org.name?.toLowerCase().includes(term) ||
        org.email?.toLowerCase().includes(term) ||
        org.city?.toLowerCase().includes(term) ||
        org.publicId?.toLowerCase().includes(term)
      );
    }
    return true;
  });

  const totalElements = data?.totalElements ?? organisations.length;
  const totalPages =
    data?.totalPages ?? (Math.ceil(totalElements / pageSize) || 1);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-ink font-heading">
              Platform Care Organisations
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-teal-brand text-white font-semibold flex items-center gap-1">
              <Crown className="h-3 w-3" />
              Super Admin Level
            </span>
          </div>
          <p className="text-sm text-ink/70 mt-1">
            Multi-tenant Registry: Provision and oversee independent care
            provider groups on CarerLoop.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md border border-ink/15 text-xs font-semibold text-ink/80 hover:bg-cream transition-all cursor-pointer disabled:opacity-50"
            title="Refresh list"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${isFetching ? "animate-spin text-teal-brand" : ""}`}
            />
            <span>Refresh</span>
          </button> */}

          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md bg-teal-brand text-white text-sm font-semibold hover:bg-teal-deep transition-all shadow-sm cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Add Organisation</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-md bg-white border border-ink/10 shadow-xs">
          <span className="text-xs font-semibold text-ink/60 uppercase tracking-wider">
            Total Organisations
          </span>
          <p className="text-3xl font-bold text-ink mt-1">
            {isLoading ? "—" : totalElements}
          </p>
          <span className="text-xs text-teal-deep font-semibold">
            Multi-Tenant Isolation
          </span>
        </div>
        <div className="p-5 rounded-md bg-white border border-ink/10 shadow-xs">
          <span className="text-xs font-semibold text-ink/60 uppercase tracking-wider">
            Active Status
          </span>
          <p className="text-3xl font-bold text-emerald-700 mt-1">
            {isLoading
              ? "—"
              : organisations.filter(
                  (o) => o.status?.toUpperCase() === "ACTIVE",
                ).length}
          </p>
          <span className="text-xs text-ink/60">Fully operational tenants</span>
        </div>
        <div className="p-5 rounded-md bg-white border border-ink/10 shadow-xs">
          <span className="text-xs font-semibold text-ink/60 uppercase tracking-wider">
            Pending / Inactive
          </span>
          <p className="text-3xl font-bold text-amber-700 mt-1">
            {isLoading
              ? "—"
              : organisations.filter(
                  (o) => o.status?.toUpperCase() !== "ACTIVE",
                ).length}
          </p>
          <span className="text-xs text-ink/60">
            Under provisioning or review
          </span>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 border-b border-ink/10 overflow-x-auto pb-1">
          {STATUS_FILTERS.map((st) => {
            const count = st.value
              ? organisations.filter(
                  (o) => o.status?.toUpperCase() === st.value.toUpperCase(),
                ).length
              : organisations.length;

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
                {!isLoading && organisations.length > 0 && (
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

        <div className="p-4 rounded-md bg-white border border-ink/10 shadow-xs flex items-center justify-between gap-4">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-ink/40" />
            <input
              type="text"
              placeholder="Search organisation by name..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(0);
              }}
              className="w-full pl-10 pr-4 py-2 text-sm rounded-md border border-ink/10 bg-cream/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-brand/20 transition-all text-ink"
            />
          </div>
          {search && (
            <button
              onClick={() => setSearch("")}
              className="text-xs text-ink/60 hover:text-ink cursor-pointer"
            >
              Clear Search
            </button>
          )}
        </div>
      </div>

      {/* Content Area */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="p-6 rounded-md bg-white border border-ink/10 shadow-xs animate-pulse space-y-4"
            >
              <div className="h-5 bg-ink/10 rounded-md w-1/2" />
              <div className="h-4 bg-ink/10 rounded-md w-1/3" />
              <div className="h-16 bg-cream rounded-md" />
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className="p-8 rounded-md bg-red-50 border border-red-200 text-center space-y-3">
          <AlertTriangle className="h-8 w-8 text-red-600 mx-auto" />
          <p className="text-sm font-semibold text-red-800">
            Failed to load organisations
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
      ) : filteredOrganisations.length === 0 ? (
        <div className="p-12 rounded-md bg-white border border-ink/10 text-center space-y-4 shadow-xs">
          <div className="w-14 h-14 rounded-full bg-cream text-teal-brand flex items-center justify-center mx-auto">
            <Building2 className="h-7 w-7" />
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h3 className="text-base font-bold text-ink">
              {selectedStatus
                ? `No ${selectedStatus.toLowerCase()} organisations found`
                : "No organisations found"}
            </h3>
            <p className="text-xs text-ink/60">
              {search
                ? `No organisations match "${search}". Try adjusting your search term.`
                : selectedStatus
                  ? `There are no organisations currently marked as ${selectedStatus.toLowerCase()}.`
                  : "There are currently no care organisations provisioned. Click below to add your first organisation."}
            </p>
          </div>
          <div className="flex items-center justify-center gap-3">
            {selectedStatus && (
              <button
                onClick={() => setSelectedStatus("")}
                className="px-4 py-2 rounded-md border border-ink/15 text-xs font-semibold text-ink/80 hover:bg-cream cursor-pointer"
              >
                View All Statuses
              </button>
            )}
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-teal-brand text-white text-xs font-semibold hover:bg-teal-deep transition-all cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Create Organisation</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredOrganisations.map((org) => (
            <div
              key={org.publicId}
              className="p-6 rounded-md bg-white border border-ink/10 shadow-xs hover:border-teal-brand/40 transition-all space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                          org.status === "ACTIVE"
                            ? "bg-emerald-100 text-emerald-800"
                            : org.status === "PENDING"
                              ? "bg-amber-100 text-amber-800"
                              : org.status === "SUSPENDED"
                                ? "bg-red-100 text-red-800"
                                : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {org.status}
                      </span>
                      <span className="text-xs text-ink/50 flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(org.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-ink mt-1.5 font-heading">
                      {org.name}
                    </h3>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setEditingOrg(org)}
                      title="Edit organisation"
                      className="p-1.5 rounded-md text-ink/50 hover:text-ink hover:bg-cream cursor-pointer"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setViewingOrg(org)}
                      title="View details"
                      className="p-1.5 rounded-md text-ink/50 hover:text-ink hover:bg-cream cursor-pointer"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Details list */}
                <div className="p-3.5 rounded-md bg-cream/30 border border-ink/5 text-xs space-y-2">
                  <div className="flex items-center gap-2 text-ink/80 truncate">
                    <Mail className="h-3.5 w-3.5 text-teal-brand shrink-0" />
                    <span className="font-medium truncate">{org.email}</span>
                  </div>
                  {org.phone && (
                    <div className="flex items-center gap-2 text-ink/80">
                      <Phone className="h-3.5 w-3.5 text-teal-brand shrink-0" />
                      <span>{org.phone}</span>
                    </div>
                  )}
                  {(org.city || org.country) && (
                    <div className="flex items-center gap-2 text-ink/80">
                      <MapPin className="h-3.5 w-3.5 text-teal-brand shrink-0" />
                      <span>
                        {[org.city, org.state, org.country]
                          .filter(Boolean)
                          .join(", ")}
                      </span>
                    </div>
                  )}
                  {org.website && (
                    <div className="flex items-center gap-2 text-teal-deep font-semibold">
                      <Globe className="h-3.5 w-3.5 text-teal-brand shrink-0" />
                      <a
                        href={
                          org.website.startsWith("http")
                            ? org.website
                            : `https://${org.website}`
                        }
                        target="_blank"
                        rel="noreferrer"
                        className="hover:underline truncate"
                      >
                        {org.website}
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom footer */}
              <div className="pt-3 border-t border-ink/5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setStatusOrg(org)}
                    className="px-2.5 py-1 rounded-md border border-ink/15 text-[11px] font-semibold text-ink/70 hover:bg-cream cursor-pointer"
                  >
                    Change Status
                  </button>
                  <Link
                    href={`/dashboard/care-homes?orgId=${org.publicId}`}
                    className="px-3 py-1 rounded-md bg-teal-brand/10 hover:bg-teal-brand/20 text-teal-deep font-semibold text-xs transition-all cursor-pointer flex items-center gap-1"
                  >
                    <Home className="h-3 w-3" />
                    <span>Care Homes</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 border-t border-ink/10 text-xs text-ink/70">
          <span>
            Showing Page {page + 1} of {totalPages} ({totalElements}{" "}
            organisations)
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

      {/* Create Organisation Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-md p-6 shadow-2xl border border-ink/10 space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-ink/10 pb-3">
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-teal-brand" />
                <h3 className="text-lg font-bold text-ink font-heading">
                  Provision Care Organisation
                </h3>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 rounded-md text-ink/40 hover:text-ink cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form
              onSubmit={handleCreateSubmit}
              className="space-y-4 text-xs sm:text-sm"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2 space-y-1">
                  <label className="font-semibold text-ink">
                    Organisation Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Apex Care Group Ltd"
                    value={createForm.name}
                    onChange={(e) =>
                      setCreateForm({ ...createForm, name: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-md border border-ink/15 bg-cream/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-brand/30"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-ink">
                    Official Email *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="contact@organisation.co.uk"
                    value={createForm.email}
                    onChange={(e) =>
                      setCreateForm({ ...createForm, email: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-md border border-ink/15 bg-cream/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-brand/30"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-ink">Phone</label>
                  <input
                    type="tel"
                    placeholder="+44 20 7946 0912"
                    value={createForm.phone}
                    onChange={(e) =>
                      setCreateForm({ ...createForm, phone: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-md border border-ink/15 bg-cream/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-brand/30"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="font-semibold text-ink">Website</label>
                  <input
                    type="text"
                    placeholder="https://www.organisation.co.uk"
                    value={createForm.website}
                    onChange={(e) =>
                      setCreateForm({ ...createForm, website: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-md border border-ink/15 bg-cream/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-brand/30"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="font-semibold text-ink">Address</label>
                  <input
                    type="text"
                    placeholder="120 High Street, Suite 4"
                    value={createForm.address}
                    onChange={(e) =>
                      setCreateForm({ ...createForm, address: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-md border border-ink/15 bg-cream/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-brand/30"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-ink">City</label>
                  <input
                    type="text"
                    placeholder="London"
                    value={createForm.city}
                    onChange={(e) =>
                      setCreateForm({ ...createForm, city: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-md border border-ink/15 bg-cream/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-brand/30"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-ink">
                    State / County
                  </label>
                  <input
                    type="text"
                    placeholder="Greater London"
                    value={createForm.state}
                    onChange={(e) =>
                      setCreateForm({ ...createForm, state: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-md border border-ink/15 bg-cream/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-brand/30"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-ink">Postal Code</label>
                  <input
                    type="text"
                    placeholder="SW1A 1AA"
                    value={createForm.postalCode}
                    onChange={(e) =>
                      setCreateForm({
                        ...createForm,
                        postalCode: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 rounded-md border border-ink/15 bg-cream/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-brand/30"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-ink">Country</label>
                  <input
                    type="text"
                    placeholder="United Kingdom"
                    value={createForm.country}
                    onChange={(e) =>
                      setCreateForm({ ...createForm, country: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-md border border-ink/15 bg-cream/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-brand/30"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-ink/10">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-md border border-ink/15 text-xs font-semibold text-ink/70 hover:bg-cream cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-teal-brand text-white text-xs font-semibold hover:bg-teal-deep transition-all cursor-pointer disabled:opacity-50"
                >
                  {createMutation.isPending ? (
                    <>
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                      <span>Provisioning...</span>
                    </>
                  ) : (
                    <span>Create Organisation</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Organisation Modal */}
      {editingOrg && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-md p-6 shadow-2xl border border-ink/10 space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-ink/10 pb-3">
              <div className="flex items-center gap-2">
                <Edit2 className="h-5 w-5 text-teal-brand" />
                <h3 className="text-lg font-bold text-ink font-heading">
                  Edit Organisation
                </h3>
              </div>
              <button
                onClick={() => setEditingOrg(null)}
                className="p-1 rounded-md text-ink/40 hover:text-ink cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form
              onSubmit={handleUpdateSubmit}
              className="space-y-4 text-xs sm:text-sm"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2 space-y-1">
                  <label className="font-semibold text-ink">
                    Organisation Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingOrg.name}
                    onChange={(e) =>
                      setEditingOrg({ ...editingOrg, name: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-md border border-ink/15 bg-cream/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-brand/30"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-ink">Email *</label>
                  <input
                    type="email"
                    required
                    value={editingOrg.email}
                    onChange={(e) =>
                      setEditingOrg({ ...editingOrg, email: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-md border border-ink/15 bg-cream/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-brand/30"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-ink">Phone</label>
                  <input
                    type="tel"
                    value={editingOrg.phone || ""}
                    onChange={(e) =>
                      setEditingOrg({ ...editingOrg, phone: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-md border border-ink/15 bg-cream/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-brand/30"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="font-semibold text-ink">Website</label>
                  <input
                    type="text"
                    value={editingOrg.website || ""}
                    onChange={(e) =>
                      setEditingOrg({ ...editingOrg, website: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-md border border-ink/15 bg-cream/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-brand/30"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="font-semibold text-ink">Address</label>
                  <input
                    type="text"
                    value={editingOrg.address || ""}
                    onChange={(e) =>
                      setEditingOrg({ ...editingOrg, address: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-md border border-ink/15 bg-cream/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-brand/30"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-ink">City</label>
                  <input
                    type="text"
                    value={editingOrg.city || ""}
                    onChange={(e) =>
                      setEditingOrg({ ...editingOrg, city: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-md border border-ink/15 bg-cream/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-brand/30"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-ink">State</label>
                  <input
                    type="text"
                    value={editingOrg.state || ""}
                    onChange={(e) =>
                      setEditingOrg({ ...editingOrg, state: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-md border border-ink/15 bg-cream/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-brand/30"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-ink">Postal Code</label>
                  <input
                    type="text"
                    value={editingOrg.postalCode || ""}
                    onChange={(e) =>
                      setEditingOrg({
                        ...editingOrg,
                        postalCode: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 rounded-md border border-ink/15 bg-cream/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-brand/30"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-ink">Country</label>
                  <input
                    type="text"
                    value={editingOrg.country || ""}
                    onChange={(e) =>
                      setEditingOrg({ ...editingOrg, country: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-md border border-ink/15 bg-cream/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-brand/30"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-ink/10">
                <button
                  type="button"
                  onClick={() => setEditingOrg(null)}
                  className="px-4 py-2 rounded-md border border-ink/15 text-xs font-semibold text-ink/70 hover:bg-cream cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updateMutation.isPending}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-teal-brand text-white text-xs font-semibold hover:bg-teal-deep transition-all cursor-pointer disabled:opacity-50"
                >
                  {updateMutation.isPending ? (
                    <>
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>Save Changes</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Change Status Modal */}
      {statusOrg && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white rounded-md p-6 shadow-2xl border border-ink/10 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-ink/10 pb-3">
              <h3 className="text-base font-bold text-ink">
                Update Organisation Status
              </h3>
              <button
                onClick={() => setStatusOrg(null)}
                className="p-1 rounded-md text-ink/40 hover:text-ink cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="text-xs text-ink/70">
              Select new operational status for{" "}
              <strong className="text-ink">{statusOrg.name}</strong>:
            </p>

            <div className="space-y-2">
              {(
                [
                  "ACTIVE",
                  "PENDING",
                  "SUSPENDED",
                  "INACTIVE",
                ] as OrganisationStatus[]
              ).map((st) => (
                <button
                  key={st}
                  onClick={() => {
                    if (statusOrg.status === st) return;
                    setConfirmStatusOrg({ org: statusOrg, targetStatus: st });
                  }}
                  disabled={statusMutation.isPending}
                  className={`w-full p-2.5 rounded-md text-left text-xs font-semibold border transition-all cursor-pointer flex items-center justify-between ${
                    statusOrg.status === st
                      ? "border-teal-brand bg-teal-brand/10 text-teal-deep"
                      : "border-ink/10 hover:border-ink/30 text-ink/80"
                  }`}
                >
                  <span>{st}</span>
                  {statusOrg.status === st && (
                    <Check className="h-4 w-4 text-teal-brand" />
                  )}
                </button>
              ))}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setStatusOrg(null)}
                className="px-3 py-1.5 rounded-md border border-ink/15 text-xs font-semibold text-ink/70 hover:bg-cream cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Organisation Status Change */}
      {confirmStatusOrg && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white rounded-2xl p-6 shadow-2xl border border-ink/10 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 border border-amber-500/20 shrink-0">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-ink">
                  Confirm Status Change
                </h3>
                <p className="text-xs text-ink/50">Multi-tenant operational update</p>
              </div>
            </div>

            <p className="text-xs text-ink/70 leading-relaxed">
              Are you sure you want to change the status of{" "}
              <strong className="text-ink">{confirmStatusOrg.org.name}</strong> from{" "}
              <span className="font-semibold text-ink">{confirmStatusOrg.org.status}</span> to{" "}
              <span className="font-bold text-teal-deep">{confirmStatusOrg.targetStatus}</span>?
              Changing an organisation's status directly impacts access for all linked care facilities and staff.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-ink/10">
              <button
                type="button"
                onClick={() => setConfirmStatusOrg(null)}
                disabled={statusMutation.isPending}
                className="px-3.5 py-2 rounded-md border border-ink/15 text-xs font-semibold text-ink/70 hover:bg-cream cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  await handleStatusChange(
                    confirmStatusOrg.org.publicId,
                    confirmStatusOrg.targetStatus
                  );
                  setConfirmStatusOrg(null);
                }}
                disabled={statusMutation.isPending}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-teal-brand text-white text-xs font-semibold hover:bg-teal-deep transition-all cursor-pointer disabled:opacity-50 shadow-sm"
              >
                {statusMutation.isPending ? (
                  <>
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                    <span>Updating...</span>
                  </>
                ) : (
                  <span>Confirm & Update</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Details View Modal */}
      {viewingOrg && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-md p-6 shadow-2xl border border-ink/10 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-ink/10 pb-3">
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-teal-brand" />
                <h3 className="text-lg font-bold text-ink">
                  {viewingOrg.name}
                </h3>
              </div>
              <button
                onClick={() => setViewingOrg(null)}
                className="p-1 rounded-md text-ink/40 hover:text-ink cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-md bg-cream/40 border border-ink/10 space-y-1">
                <span className="text-[10px] uppercase font-bold text-ink/50">
                  Public ID
                </span>
                <div className="flex items-center justify-between font-mono text-[11px] text-ink break-all">
                  <span>{viewingOrg.publicId}</span>
                  <button
                    onClick={() =>
                      handleCopy(viewingOrg.publicId, viewingOrg.publicId)
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
                    {viewingOrg.status}
                  </span>
                </div>
                <div className="p-2.5 rounded-md bg-cream/30 border border-ink/10">
                  <span className="text-[10px] uppercase font-bold text-ink/50 block">
                    Created
                  </span>
                  <span className="font-semibold text-ink">
                    {new Date(viewingOrg.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="space-y-2 border-t border-ink/10 pt-3">
                <div className="flex justify-between">
                  <span className="text-ink/60">Email:</span>
                  <span className="font-medium text-ink">
                    {viewingOrg.email}
                  </span>
                </div>
                {viewingOrg.phone && (
                  <div className="flex justify-between">
                    <span className="text-ink/60">Phone:</span>
                    <span className="font-medium text-ink">
                      {viewingOrg.phone}
                    </span>
                  </div>
                )}
                {viewingOrg.website && (
                  <div className="flex justify-between">
                    <span className="text-ink/60">Website:</span>
                    <span className="font-medium text-teal-deep">
                      {viewingOrg.website}
                    </span>
                  </div>
                )}
                {viewingOrg.address && (
                  <div className="flex justify-between">
                    <span className="text-ink/60">Address:</span>
                    <span className="font-medium text-ink text-right">
                      {[
                        viewingOrg.address,
                        viewingOrg.city,
                        viewingOrg.state,
                        viewingOrg.country,
                        viewingOrg.postalCode,
                      ]
                        .filter(Boolean)
                        .join(", ")}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-ink/10 flex justify-between items-center">
              <Link
                href={`/dashboard/care-homes?orgId=${viewingOrg.publicId}`}
                className="text-xs font-semibold text-teal-deep hover:underline flex items-center gap-1"
              >
                <Home className="h-3.5 w-3.5" />
                <span>View Managed Care Homes</span>
              </Link>
              <button
                onClick={() => setViewingOrg(null)}
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
