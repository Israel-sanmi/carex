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
  PageHeader,
  Toolbar,
  SearchField,
  Segmented,
  StatusBadge,
  Badge,
  EmptyState,
  ErrorState,
  SkeletonCards,
  Spinner,
  DataItem,
  Modal,
  btn,
  field,
} from "@/components/dashboard/ui";
import StatCard from "@/components/dashboard/stat-card";
import {
  Building2,
  Plus,
  Home,
  CheckCircle2,
  AlertTriangle,
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
  Clock,
  Filter,
  ArrowRight,
  Fingerprint,
} from "lucide-react";

const STATUS_FILTERS: { label: string; value: OrganisationStatus | "" }[] = [
  { label: "All Statuses", value: "" },
  { label: "Active", value: "ACTIVE" },
  { label: "Pending", value: "PENDING" },
  { label: "Suspended", value: "SUSPENDED" },
  { label: "Inactive", value: "INACTIVE" },
];

/* Presentation helpers (pure, no data logic) */
const monogramTones = [
  "bg-mint text-teal-deep",
  "bg-sky-soft text-[#2d6ea3]",
  "bg-lilac-soft text-[#5144a8]",
  "bg-sun-soft text-amber-700",
  "bg-coral-soft text-[#b4532f]",
];

function monogram(name?: string | null) {
  const n = (name ?? "").trim() || "?";
  return n
    .split(/\s+/)
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function monogramTone(name?: string | null) {
  const n = name ?? "";
  return monogramTones[
    [...n].reduce((a, c) => a + c.charCodeAt(0), 0) % monogramTones.length
  ];
}

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
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        icon={Building2}
        eyebrow={
          <Badge tone="teal" icon={Crown}>
            Super Admin Level
          </Badge>
        }
        title="Platform Care Organisations"
        description="Multi-tenant Registry: Provision and oversee independent care provider groups on CarerLoop."
        actions={
          <>
            {/* <button
              onClick={() => refetch()}
              disabled={isFetching}
              className={btn.secondary}
              title="Refresh list"
            >
              <RefreshCw
                className={`h-3.5 w-3.5 ${isFetching ? "animate-spin text-teal-brand" : ""}`}
              />
              <span>Refresh</span>
            </button> */}

            <button
              onClick={() => setShowCreateModal(true)}
              className={`${btn.primary} group`}
            >
              <Plus className="h-4 w-4 transition-transform duration-300 group-hover:rotate-90" />
              <span>Add Organisation</span>
            </button>
          </>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Organisations"
          value={isLoading ? "—" : totalElements}
          icon={Building2}
          tone="teal"
          hint="Multi-Tenant Isolation"
        />
        <StatCard
          label="Active Status"
          value={
            isLoading
              ? "—"
              : organisations.filter(
                  (o) => o.status?.toUpperCase() === "ACTIVE",
                ).length
          }
          icon={CheckCircle2}
          tone="sky"
          hint="Fully operational tenants"
          hintMuted
        />
        <StatCard
          label="Pending / Inactive"
          value={
            isLoading
              ? "—"
              : organisations.filter(
                  (o) => o.status?.toUpperCase() !== "ACTIVE",
                ).length
          }
          icon={Clock}
          tone="sun"
          hint="Under provisioning or review"
          hintMuted
        />
        <StatCard
          label="Matching Filters"
          value={isLoading ? "—" : filteredOrganisations.length}
          icon={Filter}
          tone="lilac"
          hint="Shown on this page"
          hintMuted
        />
      </div>

      {/* Filter Tabs & Search */}
      <Toolbar>
        <SearchField
          value={search}
          onChange={(v) => {
            setSearch(v);
            setPage(0);
          }}
          placeholder="Search organisation by name..."
          className="md:max-w-md"
        />
        <Segmented
          value={selectedStatus}
          onChange={(v) => {
            setSelectedStatus(v);
            setPage(0);
          }}
          className="md:ml-auto"
          options={STATUS_FILTERS.map((st) => ({
            value: st.value,
            label: st.label,
            count:
              !isLoading && organisations.length > 0
                ? st.value
                  ? organisations.filter(
                      (o) =>
                        o.status?.toUpperCase() === st.value.toUpperCase(),
                    ).length
                  : organisations.length
                : undefined,
          }))}
        />
      </Toolbar>

      {/* Content Area */}
      {isLoading ? (
        <SkeletonCards count={6} className="xl:grid-cols-3" />
      ) : isError ? (
        <ErrorState
          title="Failed to load organisations"
          message={
            <span className="font-mono">
              {error instanceof Error ? error.message : "Unknown error"}
            </span>
          }
          onRetry={() => refetch()}
          retrying={isFetching}
        />
      ) : filteredOrganisations.length === 0 ? (
        <div className="bg-white border border-ink/[0.08] rounded-md">
          <EmptyState
            icon={Building2}
            title={
              selectedStatus
                ? `No ${selectedStatus.toLowerCase()} organisations found`
                : "No organisations found"
            }
            description={
              search
                ? `No organisations match "${search}". Try adjusting your search term.`
                : selectedStatus
                  ? `There are no organisations currently marked as ${selectedStatus.toLowerCase()}.`
                  : "There are currently no care organisations provisioned. Click below to add your first organisation."
            }
            action={
              <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
                {selectedStatus && (
                  <button
                    onClick={() => setSelectedStatus("")}
                    className={btn.secondary}
                  >
                    View All Statuses
                  </button>
                )}
                <button
                  onClick={() => setShowCreateModal(true)}
                  className={btn.primary}
                >
                  <Plus className="h-4 w-4" />
                  <span>Create Organisation</span>
                </button>
              </div>
            }
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredOrganisations.map((org) => (
            <article
              key={org.publicId}
              className="group relative flex flex-col bg-white border border-ink/[0.08] rounded-md overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:border-teal-brand/30"
            >
              {/* Accent line */}
              <span className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-teal-brand to-emerald-400 origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100" />

              <div className="flex-1 p-5 space-y-4">
                {/* Card header */}
                <div className="flex items-start gap-3">
                  <span
                    className={`grid place-items-center w-11 h-11 rounded-md text-sm font-bold shrink-0 transition-transform duration-300 group-hover:scale-105 group-hover:-rotate-3 ${monogramTone(org.name)}`}
                    aria-hidden="true"
                  >
                    {monogram(org.name)}
                  </span>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-semibold text-ink leading-snug truncate">
                      {org.name}
                    </h3>
                    <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1">
                      <StatusBadge status={org.status} />
                      <span className="inline-flex items-center gap-1 text-[11px] text-ink/50">
                        <Calendar className="h-3 w-3" />
                        {new Date(org.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center -mr-1.5 -mt-1 shrink-0">
                    <button
                      onClick={() => setEditingOrg(org)}
                      title="Edit organisation"
                      aria-label="Edit organisation"
                      className={btn.icon}
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setViewingOrg(org)}
                      title="View details"
                      aria-label="View details"
                      className={btn.icon}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Details */}
                <dl className="grid grid-cols-1 gap-3 p-3.5 rounded-md bg-[#f8faf9] border border-ink/[0.05]">
                  <DataItem label="Email" icon={Mail}>
                    <span title={org.email}>{org.email}</span>
                  </DataItem>
                  {org.phone && (
                    <DataItem label="Phone" icon={Phone}>
                      {org.phone}
                    </DataItem>
                  )}
                  {(org.city || org.country) && (
                    <DataItem label="Location" icon={MapPin}>
                      {[org.city, org.state, org.country]
                        .filter(Boolean)
                        .join(", ")}
                    </DataItem>
                  )}
                  {org.website && (
                    <DataItem label="Website" icon={Globe}>
                      <a
                        href={
                          org.website.startsWith("http")
                            ? org.website
                            : `https://${org.website}`
                        }
                        target="_blank"
                        rel="noreferrer"
                        className="text-teal-deep hover:underline"
                      >
                        {org.website}
                      </a>
                    </DataItem>
                  )}
                </dl>
              </div>

              {/* Card footer */}
              <div className="flex flex-wrap items-center gap-2 px-5 py-3 border-t border-ink/[0.06] bg-[#fbfcfc]">
                <button
                  onClick={() => setStatusOrg(org)}
                  className={`${btn.secondary} ${btn.sm}`}
                >
                  Change Status
                </button>
                <Link
                  href={`/dashboard/care-homes?orgId=${org.publicId}`}
                  className={`${btn.ghost} ${btn.sm} group/link ml-auto text-teal-deep hover:text-teal-deep hover:bg-mint/60`}
                >
                  <Home className="h-3.5 w-3.5" />
                  <span>Care Homes</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/link:translate-x-0.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3 rounded-md bg-white border border-ink/[0.08] text-xs text-ink/60">
          <span>
            Showing Page{" "}
            <span className="font-semibold text-ink">{page + 1}</span> of{" "}
            <span className="font-semibold text-ink">{totalPages}</span> (
            {totalElements} organisations)
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className={`${btn.secondary} ${btn.sm}`}
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className={`${btn.secondary} ${btn.sm}`}
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Create Organisation Modal */}
      <Modal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        icon={Building2}
        title="Provision Care Organisation"
        description="Register a new care provider group on CarerLoop."
        size="lg"
        footer={
          <>
            <button
              type="button"
              onClick={() => setShowCreateModal(false)}
              className={btn.secondary}
            >
              Cancel
            </button>
            <button
              type="submit"
              form="create-organisation-form"
              disabled={createMutation.isPending}
              className={btn.primary}
            >
              {createMutation.isPending ? (
                <>
                  <Spinner className="h-4 w-4" />
                  <span>Provisioning...</span>
                </>
              ) : (
                <span>Create Organisation</span>
              )}
            </button>
          </>
        }
      >
        <form
          id="create-organisation-form"
          onSubmit={handleCreateSubmit}
          className="grid sm:grid-cols-2 gap-4"
        >
          <div className="sm:col-span-2">
            <label htmlFor="org-create-name" className={field.label}>
              Organisation Name *
            </label>
            <input
              id="org-create-name"
              type="text"
              required
              placeholder="e.g. Apex Care Group Ltd"
              value={createForm.name}
              onChange={(e) =>
                setCreateForm({ ...createForm, name: e.target.value })
              }
              className={field.input}
            />
          </div>

          <div>
            <label htmlFor="org-create-email" className={field.label}>
              Official Email *
            </label>
            <input
              id="org-create-email"
              type="email"
              required
              placeholder="contact@organisation.co.uk"
              value={createForm.email}
              onChange={(e) =>
                setCreateForm({ ...createForm, email: e.target.value })
              }
              className={field.input}
            />
          </div>

          <div>
            <label htmlFor="org-create-phone" className={field.label}>
              Phone
            </label>
            <input
              id="org-create-phone"
              type="tel"
              placeholder="+44 20 7946 0912"
              value={createForm.phone}
              onChange={(e) =>
                setCreateForm({ ...createForm, phone: e.target.value })
              }
              className={field.input}
            />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="org-create-website" className={field.label}>
              Website
            </label>
            <input
              id="org-create-website"
              type="text"
              placeholder="https://www.organisation.co.uk"
              value={createForm.website}
              onChange={(e) =>
                setCreateForm({ ...createForm, website: e.target.value })
              }
              className={field.input}
            />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="org-create-address" className={field.label}>
              Address
            </label>
            <input
              id="org-create-address"
              type="text"
              placeholder="120 High Street, Suite 4"
              value={createForm.address}
              onChange={(e) =>
                setCreateForm({ ...createForm, address: e.target.value })
              }
              className={field.input}
            />
          </div>

          <div>
            <label htmlFor="org-create-city" className={field.label}>
              City
            </label>
            <input
              id="org-create-city"
              type="text"
              placeholder="London"
              value={createForm.city}
              onChange={(e) =>
                setCreateForm({ ...createForm, city: e.target.value })
              }
              className={field.input}
            />
          </div>

          <div>
            <label htmlFor="org-create-state" className={field.label}>
              State / County
            </label>
            <input
              id="org-create-state"
              type="text"
              placeholder="Greater London"
              value={createForm.state}
              onChange={(e) =>
                setCreateForm({ ...createForm, state: e.target.value })
              }
              className={field.input}
            />
          </div>

          <div>
            <label htmlFor="org-create-postal" className={field.label}>
              Postal Code
            </label>
            <input
              id="org-create-postal"
              type="text"
              placeholder="SW1A 1AA"
              value={createForm.postalCode}
              onChange={(e) =>
                setCreateForm({
                  ...createForm,
                  postalCode: e.target.value,
                })
              }
              className={field.input}
            />
          </div>

          <div>
            <label htmlFor="org-create-country" className={field.label}>
              Country
            </label>
            <input
              id="org-create-country"
              type="text"
              placeholder="United Kingdom"
              value={createForm.country}
              onChange={(e) =>
                setCreateForm({ ...createForm, country: e.target.value })
              }
              className={field.input}
            />
          </div>
        </form>
      </Modal>

      {/* Edit Organisation Modal */}
      <Modal
        open={Boolean(editingOrg)}
        onClose={() => setEditingOrg(null)}
        icon={Edit2}
        title="Edit Organisation"
        description={editingOrg?.name}
        size="lg"
        footer={
          <>
            <button
              type="button"
              onClick={() => setEditingOrg(null)}
              className={btn.secondary}
            >
              Cancel
            </button>
            <button
              type="submit"
              form="edit-organisation-form"
              disabled={updateMutation.isPending}
              className={btn.primary}
            >
              {updateMutation.isPending ? (
                <>
                  <Spinner className="h-4 w-4" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>Save Changes</span>
              )}
            </button>
          </>
        }
      >
        {editingOrg && (
          <form
            id="edit-organisation-form"
            onSubmit={handleUpdateSubmit}
            className="grid sm:grid-cols-2 gap-4"
          >
            <div className="sm:col-span-2">
              <label htmlFor="org-edit-name" className={field.label}>
                Organisation Name *
              </label>
              <input
                id="org-edit-name"
                type="text"
                required
                value={editingOrg.name}
                onChange={(e) =>
                  setEditingOrg({ ...editingOrg, name: e.target.value })
                }
                className={field.input}
              />
            </div>

            <div>
              <label htmlFor="org-edit-email" className={field.label}>
                Email *
              </label>
              <input
                id="org-edit-email"
                type="email"
                required
                value={editingOrg.email}
                onChange={(e) =>
                  setEditingOrg({ ...editingOrg, email: e.target.value })
                }
                className={field.input}
              />
            </div>

            <div>
              <label htmlFor="org-edit-phone" className={field.label}>
                Phone
              </label>
              <input
                id="org-edit-phone"
                type="tel"
                value={editingOrg.phone || ""}
                onChange={(e) =>
                  setEditingOrg({ ...editingOrg, phone: e.target.value })
                }
                className={field.input}
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="org-edit-website" className={field.label}>
                Website
              </label>
              <input
                id="org-edit-website"
                type="text"
                value={editingOrg.website || ""}
                onChange={(e) =>
                  setEditingOrg({ ...editingOrg, website: e.target.value })
                }
                className={field.input}
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="org-edit-address" className={field.label}>
                Address
              </label>
              <input
                id="org-edit-address"
                type="text"
                value={editingOrg.address || ""}
                onChange={(e) =>
                  setEditingOrg({ ...editingOrg, address: e.target.value })
                }
                className={field.input}
              />
            </div>

            <div>
              <label htmlFor="org-edit-city" className={field.label}>
                City
              </label>
              <input
                id="org-edit-city"
                type="text"
                value={editingOrg.city || ""}
                onChange={(e) =>
                  setEditingOrg({ ...editingOrg, city: e.target.value })
                }
                className={field.input}
              />
            </div>

            <div>
              <label htmlFor="org-edit-state" className={field.label}>
                State
              </label>
              <input
                id="org-edit-state"
                type="text"
                value={editingOrg.state || ""}
                onChange={(e) =>
                  setEditingOrg({ ...editingOrg, state: e.target.value })
                }
                className={field.input}
              />
            </div>

            <div>
              <label htmlFor="org-edit-postal" className={field.label}>
                Postal Code
              </label>
              <input
                id="org-edit-postal"
                type="text"
                value={editingOrg.postalCode || ""}
                onChange={(e) =>
                  setEditingOrg({
                    ...editingOrg,
                    postalCode: e.target.value,
                  })
                }
                className={field.input}
              />
            </div>

            <div>
              <label htmlFor="org-edit-country" className={field.label}>
                Country
              </label>
              <input
                id="org-edit-country"
                type="text"
                value={editingOrg.country || ""}
                onChange={(e) =>
                  setEditingOrg({ ...editingOrg, country: e.target.value })
                }
                className={field.input}
              />
            </div>
          </form>
        )}
      </Modal>

      {/* Change Status Modal (hidden while its confirmation step is showing,
          so the two portal dialogs never stack) */}
      <Modal
        open={Boolean(statusOrg) && !confirmStatusOrg}
        onClose={() => setStatusOrg(null)}
        icon={RefreshCw}
        title="Update Organisation Status"
        size="sm"
        footer={
          <button onClick={() => setStatusOrg(null)} className={btn.secondary}>
            Close
          </button>
        }
      >
        {statusOrg && (
          <div className="space-y-4">
            <p className="text-sm text-ink/65">
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
                  className={`w-full flex items-center justify-between gap-3 px-3.5 py-3 rounded-md border text-left transition-all cursor-pointer disabled:opacity-50 ${
                    statusOrg.status === st
                      ? "border-teal-brand bg-teal-brand/[0.06]"
                      : "border-ink/10 hover:border-teal-brand/40 hover:bg-mint/30 hover:translate-x-0.5"
                  }`}
                >
                  <StatusBadge status={st} />
                  {statusOrg.status === st ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-teal-brand">
                      <Check className="h-4 w-4" />
                      Current
                    </span>
                  ) : (
                    <ChevronRight className="h-4 w-4 text-ink/30" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </Modal>

      {/* Confirmation Modal for Organisation Status Change */}
      <Modal
        open={Boolean(confirmStatusOrg)}
        onClose={() => setConfirmStatusOrg(null)}
        icon={AlertTriangle}
        title="Confirm Status Change"
        description="Multi-tenant operational update"
        size="sm"
        footer={
          confirmStatusOrg && (
            <>
              <button
                type="button"
                onClick={() => setConfirmStatusOrg(null)}
                disabled={statusMutation.isPending}
                className={btn.secondary}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  await handleStatusChange(
                    confirmStatusOrg.org.publicId,
                    confirmStatusOrg.targetStatus,
                  );
                  setConfirmStatusOrg(null);
                }}
                disabled={statusMutation.isPending}
                className={btn.primary}
              >
                {statusMutation.isPending ? (
                  <>
                    <Spinner className="h-4 w-4" />
                    <span>Updating...</span>
                  </>
                ) : (
                  <span>Confirm & Update</span>
                )}
              </button>
            </>
          )
        }
      >
        {confirmStatusOrg && (
          <div className="space-y-4">
            <p className="text-sm text-ink/70 leading-relaxed">
              Are you sure you want to change the status of{" "}
              <strong className="text-ink">{confirmStatusOrg.org.name}</strong>{" "}
              from{" "}
              <span className="font-semibold text-ink">
                {confirmStatusOrg.org.status}
              </span>{" "}
              to{" "}
              <span className="font-bold text-teal-deep">
                {confirmStatusOrg.targetStatus}
              </span>
              ?
            </p>
            <div className="flex items-center justify-center gap-3 p-3 rounded-md bg-[#f8faf9] border border-ink/[0.06]">
              <StatusBadge status={confirmStatusOrg.org.status} />
              <ArrowRight className="h-4 w-4 text-ink/35" />
              <StatusBadge status={confirmStatusOrg.targetStatus} />
            </div>
            <p className="flex items-start gap-2 p-3 rounded-md bg-amber-50 border border-amber-200/70 text-xs text-amber-800 leading-relaxed">
              <AlertTriangle className="h-4 w-4 shrink-0 mt-px" />
              Changing an organisation&apos;s status directly impacts access
              for all linked care facilities and staff.
            </p>
          </div>
        )}
      </Modal>

      {/* Details View Modal */}
      <Modal
        open={Boolean(viewingOrg)}
        onClose={() => setViewingOrg(null)}
        icon={Building2}
        title={viewingOrg?.name ?? ""}
        footer={
          viewingOrg && (
            <>
              <Link
                href={`/dashboard/care-homes?orgId=${viewingOrg.publicId}`}
                className={`${btn.ghost} group/link sm:mr-auto text-teal-deep hover:text-teal-deep hover:bg-mint/60`}
              >
                <Home className="h-4 w-4" />
                <span>View Managed Care Homes</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/link:translate-x-0.5" />
              </Link>
              <button
                onClick={() => setViewingOrg(null)}
                className={btn.primary}
              >
                Close
              </button>
            </>
          )
        }
      >
        {viewingOrg && (
          <div className="space-y-4">
            <div className="p-3.5 rounded-md bg-[#f8faf9] border border-ink/[0.08]">
              <span className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-ink/45">
                <Fingerprint className="h-3 w-3" />
                Public ID
              </span>
              <div className="mt-1 flex items-center justify-between gap-2 font-mono text-xs text-ink break-all">
                <span>{viewingOrg.publicId}</span>
                <button
                  onClick={() =>
                    handleCopy(viewingOrg.publicId, viewingOrg.publicId)
                  }
                  className={`${btn.icon} !w-8 !h-8 text-teal-brand hover:text-teal-deep shrink-0`}
                  aria-label="Copy Organisation ID"
                  title="Copy ID"
                >
                  {copiedId === viewingOrg.publicId ? (
                    <Check className="h-3.5 w-3.5" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>
            </div>

            <dl className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-md border border-ink/[0.08]">
                <DataItem label="Status">
                  <StatusBadge status={viewingOrg.status} />
                </DataItem>
              </div>
              <div className="p-3 rounded-md border border-ink/[0.08]">
                <DataItem label="Created" icon={Calendar}>
                  {new Date(viewingOrg.createdAt).toLocaleDateString()}
                </DataItem>
              </div>
            </dl>

            <dl className="divide-y divide-ink/[0.06] text-sm">
              <div className="flex items-start justify-between gap-4 py-2.5">
                <dt className="flex items-center gap-1.5 text-ink/55 shrink-0">
                  <Mail className="h-3.5 w-3.5" />
                  Email
                </dt>
                <dd className="font-medium text-ink text-right break-all">
                  {viewingOrg.email}
                </dd>
              </div>
              {viewingOrg.phone && (
                <div className="flex items-start justify-between gap-4 py-2.5">
                  <dt className="flex items-center gap-1.5 text-ink/55 shrink-0">
                    <Phone className="h-3.5 w-3.5" />
                    Phone
                  </dt>
                  <dd className="font-medium text-ink text-right">
                    {viewingOrg.phone}
                  </dd>
                </div>
              )}
              {viewingOrg.website && (
                <div className="flex items-start justify-between gap-4 py-2.5">
                  <dt className="flex items-center gap-1.5 text-ink/55 shrink-0">
                    <Globe className="h-3.5 w-3.5" />
                    Website
                  </dt>
                  <dd className="font-medium text-teal-deep text-right break-all">
                    {viewingOrg.website}
                  </dd>
                </div>
              )}
              {viewingOrg.address && (
                <div className="flex items-start justify-between gap-4 py-2.5">
                  <dt className="flex items-center gap-1.5 text-ink/55 shrink-0">
                    <MapPin className="h-3.5 w-3.5" />
                    Address
                  </dt>
                  <dd className="font-medium text-ink text-right">
                    {[
                      viewingOrg.address,
                      viewingOrg.city,
                      viewingOrg.state,
                      viewingOrg.country,
                      viewingOrg.postalCode,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </dd>
                </div>
              )}
            </dl>
          </div>
        )}
      </Modal>
    </div>
  );
}
