"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useRole } from "@/lib/role-context";
import { useOrganisations } from "@/lib/hooks/use-organisations";
import {
  useCareHomesByOrganisation,
  useMyCareHomes,
  useCreateCareHomeMutation,
  useUpdateCareHomeMutation,
  useUpdateCareHomeStatusMutation,
} from "@/lib/hooks/use-care-homes";
import {
  CareHomeItem,
  CareHomeStatus,
  CreateCareHomePayload,
} from "@/lib/api-care-homes";
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
  MapPin,
  Phone,
  Mail,
  Plus,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Copy,
  Check,
  Edit2,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Home,
  Calendar,
  Clock,
  Ban,
  Users,
  ArrowRight,
  Fingerprint,
} from "lucide-react";

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

const STATUS_OPTIONS = [
  { value: "all", label: "All" },
  { value: "ACTIVE", label: "Active" },
  { value: "PENDING", label: "Pending" },
  { value: "SUSPENDED", label: "Suspended" },
  { value: "INACTIVE", label: "Inactive" },
];

function CareHomesContent() {
  const searchParams = useSearchParams();
  const urlOrgId = searchParams.get("orgId") || "";

  const { roleAssignments } = useRole();

  // Search & Organisation selection
  const [selectedOrgId, setSelectedOrgId] = useState<string>(urlOrgId);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [page, setPage] = useState(0);
  const pageSize = 20;

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingHome, setEditingHome] = useState<CareHomeItem | null>(null);
  const [viewingHome, setViewingHome] = useState<CareHomeItem | null>(null);
  const [statusHome, setStatusHome] = useState<CareHomeItem | null>(null);
  const [confirmStatusHome, setConfirmStatusHome] = useState<{
    home: CareHomeItem;
    targetStatus: CareHomeStatus;
  } | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // New Care Home Form
  const [createForm, setCreateForm] = useState<CreateCareHomePayload>({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    country: "United Kingdom",
    postalCode: "",
  });

  // Query organisations so admin can switch organisation filter
  const { data: orgsData, isLoading: isLoadingOrgs } = useOrganisations({
    page: 0,
    size: 100,
  });

  const organisations = orgsData?.content || [];

  // Automatically select the first organisation if none is selected yet
  useEffect(() => {
    if (!selectedOrgId) {
      if (urlOrgId) {
        setSelectedOrgId(urlOrgId);
      } else if (organisations.length > 0) {
        setSelectedOrgId(organisations[0].publicId);
      } else {
        const assignedOrg = roleAssignments.find(
          (ra) => ra.organisationPublicId,
        )?.organisationPublicId;
        if (assignedOrg) {
          setSelectedOrgId(assignedOrg);
        }
      }
    }
  }, [urlOrgId, organisations, selectedOrgId, roleAssignments]);

  // Query care homes for the selected organisation
  const {
    data: careHomesPage,
    isLoading: isLoadingHomes,
    isError: isHomesError,
    error: homesError,
    refetch,
    isFetching,
  } = useCareHomesByOrganisation(
    selectedOrgId || null,
    { page, size: pageSize },
    { enabled: Boolean(selectedOrgId) },
  );

  // Also query my care homes if no organisation selected or as fallback
  const { data: myCareHomes } = useMyCareHomes({
    enabled: !selectedOrgId,
  });

  // Mutations
  const createMutation = useCreateCareHomeMutation();
  const updateMutation = useUpdateCareHomeMutation();
  const statusMutation = useUpdateCareHomeStatusMutation();

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.info("Care Home ID copied to clipboard");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrgId) {
      toast.error("Please select a parent organisation first");
      return;
    }
    if (!createForm.name || !createForm.email) {
      toast.error("Care home name and official email are required");
      return;
    }

    try {
      await createMutation.mutateAsync({
        organisationPublicId: selectedOrgId,
        payload: createForm,
      });
      setShowAddModal(false);
      setCreateForm({
        name: "",
        email: "",
        phone: "",
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
    if (!editingHome) return;

    try {
      await updateMutation.mutateAsync({
        organisationPublicId: editingHome.organisationPublicId || selectedOrgId,
        careHomePublicId: editingHome.publicId,
        payload: {
          name: editingHome.name,
          email: editingHome.email,
          phone: editingHome.phone,
          address: editingHome.address,
          city: editingHome.city,
          state: editingHome.state,
          country: editingHome.country,
          postalCode: editingHome.postalCode,
        },
      });
      setEditingHome(null);
    } catch {
      // handled in mutation hook
    }
  };

  const handleStatusChange = async (
    home: CareHomeItem,
    status: CareHomeStatus,
  ) => {
    try {
      await statusMutation.mutateAsync({
        organisationPublicId: home.organisationPublicId || selectedOrgId,
        careHomePublicId: home.publicId,
        status,
      });
      setStatusHome(null);
    } catch {
      // handled in mutation hook
    }
  };

  const rawHomes: CareHomeItem[] = selectedOrgId
    ? careHomesPage?.content || []
    : myCareHomes || [];

  const filteredHomes = rawHomes.filter((home) => {
    const matchesSearch =
      !search ||
      home.name.toLowerCase().includes(search.toLowerCase()) ||
      (home.city && home.city.toLowerCase().includes(search.toLowerCase())) ||
      (home.email && home.email.toLowerCase().includes(search.toLowerCase()));

    const matchesStatus =
      statusFilter === "all" ||
      home.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const totalElements = careHomesPage?.totalElements ?? filteredHomes.length;
  const totalPages =
    careHomesPage?.totalPages ?? (Math.ceil(totalElements / pageSize) || 1);

  const currentOrg = organisations.find((o) => o.publicId === selectedOrgId);

  // Presentation-only counts over the already-loaded list
  const countByStatus = (st: string) =>
    rawHomes.filter((h) => h.status?.toUpperCase() === st).length;
  const activeCount = countByStatus("ACTIVE");
  const pendingCount = countByStatus("PENDING");
  const offlineCount = countByStatus("SUSPENDED") + countByStatus("INACTIVE");

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        icon={Home}
        eyebrow={
          <>
            <Badge tone="teal" dot>
              {filteredHomes.length} Facilities Listed
            </Badge>
            {currentOrg && (
              <span className="inline-flex items-center gap-1 text-ink/55">
                <Building2 className="h-3 w-3" />
                {currentOrg.name}
              </span>
            )}
          </>
        }
        title="Care Homes & Facilities"
        description="Manage residential care facilities, contact information, and operating status."
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
              onClick={() => {
                if (!selectedOrgId && organisations.length > 0) {
                  setSelectedOrgId(organisations[0].publicId);
                }
                setShowAddModal(true);
              }}
              className={`${btn.primary} group`}
            >
              <Plus className="h-4 w-4 transition-transform duration-300 group-hover:rotate-90" />
              <span>Add Care Home</span>
            </button>
          </>
        }
      />

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Facilities"
          value={isLoadingHomes ? "—" : totalElements}
          icon={Home}
          tone="teal"
          hint={currentOrg ? currentOrg.name : "Across your access"}
          hintMuted
        />
        <StatCard
          label="Active"
          value={isLoadingHomes ? "—" : activeCount}
          icon={CheckCircle2}
          tone="sky"
          hint="Operational facilities"
          hintMuted
        />
        <StatCard
          label="Pending"
          value={isLoadingHomes ? "—" : pendingCount}
          icon={Clock}
          tone="sun"
          hint="Awaiting activation"
          hintMuted
        />
        <StatCard
          label="Suspended / Inactive"
          value={isLoadingHomes ? "—" : offlineCount}
          icon={Ban}
          tone="coral"
          hint="Not currently operating"
          hintMuted
        />
      </div>

      {/* Organisation switcher */}
      <Toolbar className="md:justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <span className="grid place-items-center w-10 h-10 rounded-md bg-teal-brand/10 text-teal-brand shrink-0">
            <Building2 className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <span className="block text-[11px] font-semibold uppercase tracking-wider text-ink/45">
              Active Organisation Filter
            </span>
            <div className="text-sm sm:text-base font-semibold text-ink truncate">
              {currentOrg ? currentOrg.name : "Select an Organisation"}
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-2 w-full md:w-auto">
          <label
            htmlFor="care-homes-org-switch"
            className="text-xs font-medium text-ink/60 whitespace-nowrap"
          >
            Switch Org:
          </label>
          <select
            id="care-homes-org-switch"
            value={selectedOrgId}
            onChange={(e) => {
              setSelectedOrgId(e.target.value);
              setPage(0);
            }}
            disabled={isLoadingOrgs}
            className={`${field.input} md:w-72 cursor-pointer font-medium`}
          >
            <option value="">
              {isLoadingOrgs
                ? "Loading organisations..."
                : "-- Select Organisation --"}
            </option>
            {organisations.map((org) => (
              <option key={org.publicId} value={org.publicId}>
                {org.name} ({org.status})
              </option>
            ))}
          </select>
        </div>
      </Toolbar>

      {/* Search & status filter */}
      <Toolbar>
        <SearchField
          value={search}
          onChange={(v) => setSearch(v)}
          placeholder="Search by facility name, city or email..."
          className="md:max-w-md"
        />
        <Segmented
          value={statusFilter}
          onChange={(v) => setStatusFilter(v)}
          className="md:ml-auto"
          options={STATUS_OPTIONS.map((o) => ({
            value: o.value,
            label: o.label,
            count:
              rawHomes.length > 0
                ? o.value === "all"
                  ? rawHomes.length
                  : countByStatus(o.value)
                : undefined,
          }))}
        />
      </Toolbar>

      {/* Content Grid */}
      {isLoadingHomes ? (
        <SkeletonCards count={6} className="xl:grid-cols-3" />
      ) : isHomesError ? (
        <ErrorState
          title="Failed to load care homes"
          message={
            <span className="font-mono">
              {homesError instanceof Error
                ? homesError.message
                : "Unknown error"}
            </span>
          }
          onRetry={() => refetch()}
          retrying={isFetching}
        />
      ) : filteredHomes.length === 0 ? (
        <div className="bg-white border border-ink/[0.08] rounded-md">
          <EmptyState
            icon={Home}
            title="No Care Homes Found"
            description={
              search
                ? `No facilities match "${search}". Try adjusting your search term.`
                : selectedOrgId
                  ? `No care homes have been registered under "${currentOrg?.name || "this organisation"}". Add the first one below.`
                  : "Please select an organisation above to view and manage care homes."
            }
            action={
              selectedOrgId && (
                <button
                  onClick={() => setShowAddModal(true)}
                  className={btn.primary}
                >
                  <Plus className="h-4 w-4" />
                  <span>Register First Care Home</span>
                </button>
              )
            }
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredHomes.map((home) => {
            const fullAddress = [
              home.address,
              home.city,
              home.state,
              home.country,
              home.postalCode,
            ]
              .filter(Boolean)
              .join(", ");
            return (
              <article
                key={home.publicId}
                className="group relative flex flex-col bg-white border border-ink/[0.08] rounded-md overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:border-teal-brand/30"
              >
                {/* Accent line */}
                <span className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-teal-brand to-emerald-400 origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100" />

                <div className="flex-1 p-5 space-y-4">
                  {/* Card header */}
                  <div className="flex items-start gap-3">
                    <span
                      className={`grid place-items-center w-11 h-11 rounded-md text-sm font-bold shrink-0 transition-transform duration-300 group-hover:scale-105 group-hover:-rotate-3 ${monogramTone(home.name)}`}
                      aria-hidden="true"
                    >
                      {monogram(home.name)}
                    </span>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-semibold text-ink leading-snug truncate">
                        {home.name}
                      </h3>
                      <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                        <StatusBadge status={home.status} />
                        {home.organisationName && (
                          <Badge tone="teal" className="max-w-full truncate">
                            {home.organisationName}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center -mr-1.5 -mt-1 shrink-0">
                      <button
                        onClick={() => setEditingHome(home)}
                        title="Edit Care Home"
                        aria-label="Edit Care Home"
                        className={btn.icon}
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setViewingHome(home)}
                        title="View Details"
                        aria-label="View Details"
                        className={btn.icon}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Details */}
                  <dl className="grid grid-cols-1 gap-3 p-3.5 rounded-md bg-[#f8faf9] border border-ink/[0.05]">
                    <DataItem label="Email" icon={Mail}>
                      <span title={home.email}>{home.email}</span>
                    </DataItem>
                    {home.phone && (
                      <DataItem label="Phone" icon={Phone}>
                        {home.phone}
                      </DataItem>
                    )}
                    {(home.address || home.city) && (
                      <DataItem label="Address" icon={MapPin}>
                        <span title={fullAddress}>{fullAddress}</span>
                      </DataItem>
                    )}
                  </dl>
                </div>

                {/* Card footer */}
                <div className="flex flex-wrap items-center gap-2 px-5 py-3 border-t border-ink/[0.06] bg-[#fbfcfc]">
                  <button
                    onClick={() => setStatusHome(home)}
                    className={`${btn.secondary} ${btn.sm}`}
                  >
                    Change Status
                  </button>
                  <Link
                    href={`/dashboard/users`}
                    className={`${btn.ghost} ${btn.sm} group/link ml-auto text-teal-deep hover:text-teal-deep hover:bg-mint/60`}
                  >
                    <Users className="h-3.5 w-3.5" />
                    Manage Residents
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/link:translate-x-0.5" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3 rounded-md bg-white border border-ink/[0.08] text-xs text-ink/60">
          <span>
            Showing Page{" "}
            <span className="font-semibold text-ink">{page + 1}</span> of{" "}
            <span className="font-semibold text-ink">{totalPages}</span> (
            {totalElements} care homes)
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

      {/* Add Care Home Modal */}
      <Modal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        icon={Home}
        title="Register Care Home Facility"
        description="Add a new residential facility under a care organisation."
        size="lg"
        footer={
          <>
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className={btn.secondary}
            >
              Cancel
            </button>
            <button
              type="submit"
              form="create-care-home-form"
              disabled={createMutation.isPending}
              className={btn.primary}
            >
              {createMutation.isPending ? (
                <>
                  <Spinner className="h-4 w-4" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>Register Facility</span>
              )}
            </button>
          </>
        }
      >
        <form
          id="create-care-home-form"
          onSubmit={handleCreateSubmit}
          className="grid sm:grid-cols-2 gap-4"
        >
          <div className="sm:col-span-2">
            <label htmlFor="ch-create-org" className={field.label}>
              Parent Care Organisation *
            </label>
            <select
              id="ch-create-org"
              required
              value={selectedOrgId}
              onChange={(e) => setSelectedOrgId(e.target.value)}
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
            </select>
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="ch-create-name" className={field.label}>
              Facility Name *
            </label>
            <input
              id="ch-create-name"
              type="text"
              required
              placeholder="e.g. St. Jude's Residential Home"
              value={createForm.name}
              onChange={(e) =>
                setCreateForm({ ...createForm, name: e.target.value })
              }
              className={field.input}
            />
          </div>

          <div>
            <label htmlFor="ch-create-email" className={field.label}>
              Official Email *
            </label>
            <input
              id="ch-create-email"
              type="email"
              required
              placeholder="stjudes@apexcare.co.uk"
              value={createForm.email}
              onChange={(e) =>
                setCreateForm({ ...createForm, email: e.target.value })
              }
              className={field.input}
            />
          </div>

          <div>
            <label htmlFor="ch-create-phone" className={field.label}>
              Phone
            </label>
            <input
              id="ch-create-phone"
              type="tel"
              placeholder="+44 117 496 0281"
              value={createForm.phone}
              onChange={(e) =>
                setCreateForm({ ...createForm, phone: e.target.value })
              }
              className={field.input}
            />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="ch-create-address" className={field.label}>
              Street Address
            </label>
            <input
              id="ch-create-address"
              type="text"
              placeholder="14 Primrose Crescent"
              value={createForm.address}
              onChange={(e) =>
                setCreateForm({ ...createForm, address: e.target.value })
              }
              className={field.input}
            />
          </div>

          <div>
            <label htmlFor="ch-create-city" className={field.label}>
              City
            </label>
            <input
              id="ch-create-city"
              type="text"
              placeholder="Bristol"
              value={createForm.city}
              onChange={(e) =>
                setCreateForm({ ...createForm, city: e.target.value })
              }
              className={field.input}
            />
          </div>

          <div>
            <label htmlFor="ch-create-state" className={field.label}>
              State / County
            </label>
            <input
              id="ch-create-state"
              type="text"
              placeholder="Somerset"
              value={createForm.state}
              onChange={(e) =>
                setCreateForm({ ...createForm, state: e.target.value })
              }
              className={field.input}
            />
          </div>

          <div>
            <label htmlFor="ch-create-postal" className={field.label}>
              Postal Code
            </label>
            <input
              id="ch-create-postal"
              type="text"
              placeholder="BS8 4HG"
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
            <label htmlFor="ch-create-country" className={field.label}>
              Country
            </label>
            <input
              id="ch-create-country"
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

      {/* Edit Care Home Modal */}
      <Modal
        open={Boolean(editingHome)}
        onClose={() => setEditingHome(null)}
        icon={Edit2}
        title="Edit Care Home Facility"
        description={editingHome?.name}
        size="lg"
        footer={
          <>
            <button
              type="button"
              onClick={() => setEditingHome(null)}
              className={btn.secondary}
            >
              Cancel
            </button>
            <button
              type="submit"
              form="edit-care-home-form"
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
        {editingHome && (
          <form
            id="edit-care-home-form"
            onSubmit={handleUpdateSubmit}
            className="grid sm:grid-cols-2 gap-4"
          >
            <div className="sm:col-span-2">
              <label htmlFor="ch-edit-name" className={field.label}>
                Facility Name *
              </label>
              <input
                id="ch-edit-name"
                type="text"
                required
                value={editingHome.name}
                onChange={(e) =>
                  setEditingHome({ ...editingHome, name: e.target.value })
                }
                className={field.input}
              />
            </div>

            <div>
              <label htmlFor="ch-edit-email" className={field.label}>
                Email *
              </label>
              <input
                id="ch-edit-email"
                type="email"
                required
                value={editingHome.email}
                onChange={(e) =>
                  setEditingHome({ ...editingHome, email: e.target.value })
                }
                className={field.input}
              />
            </div>

            <div>
              <label htmlFor="ch-edit-phone" className={field.label}>
                Phone
              </label>
              <input
                id="ch-edit-phone"
                type="tel"
                value={editingHome.phone || ""}
                onChange={(e) =>
                  setEditingHome({ ...editingHome, phone: e.target.value })
                }
                className={field.input}
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="ch-edit-address" className={field.label}>
                Address
              </label>
              <input
                id="ch-edit-address"
                type="text"
                value={editingHome.address || ""}
                onChange={(e) =>
                  setEditingHome({
                    ...editingHome,
                    address: e.target.value,
                  })
                }
                className={field.input}
              />
            </div>

            <div>
              <label htmlFor="ch-edit-city" className={field.label}>
                City
              </label>
              <input
                id="ch-edit-city"
                type="text"
                value={editingHome.city || ""}
                onChange={(e) =>
                  setEditingHome({ ...editingHome, city: e.target.value })
                }
                className={field.input}
              />
            </div>

            <div>
              <label htmlFor="ch-edit-state" className={field.label}>
                State
              </label>
              <input
                id="ch-edit-state"
                type="text"
                value={editingHome.state || ""}
                onChange={(e) =>
                  setEditingHome({ ...editingHome, state: e.target.value })
                }
                className={field.input}
              />
            </div>

            <div>
              <label htmlFor="ch-edit-postal" className={field.label}>
                Postal Code
              </label>
              <input
                id="ch-edit-postal"
                type="text"
                value={editingHome.postalCode || ""}
                onChange={(e) =>
                  setEditingHome({
                    ...editingHome,
                    postalCode: e.target.value,
                  })
                }
                className={field.input}
              />
            </div>

            <div>
              <label htmlFor="ch-edit-country" className={field.label}>
                Country
              </label>
              <input
                id="ch-edit-country"
                type="text"
                value={editingHome.country || ""}
                onChange={(e) =>
                  setEditingHome({
                    ...editingHome,
                    country: e.target.value,
                  })
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
        open={Boolean(statusHome) && !confirmStatusHome}
        onClose={() => setStatusHome(null)}
        icon={RefreshCw}
        title="Update Care Home Status"
        size="sm"
        footer={
          <button
            onClick={() => setStatusHome(null)}
            className={btn.secondary}
          >
            Close
          </button>
        }
      >
        {statusHome && (
          <div className="space-y-4">
            <p className="text-sm text-ink/65">
              Select status for{" "}
              <strong className="text-ink">{statusHome.name}</strong>:
            </p>

            <div className="space-y-2">
              {(["ACTIVE", "SUSPENDED", "INACTIVE"] as CareHomeStatus[]).map(
                (st) => (
                  <button
                    key={st}
                    onClick={() => {
                      if (statusHome.status === st) return;
                      setConfirmStatusHome({
                        home: statusHome,
                        targetStatus: st,
                      });
                    }}
                    disabled={statusMutation.isPending}
                    className={`w-full flex items-center justify-between gap-3 px-3.5 py-3 rounded-md border text-left transition-all cursor-pointer disabled:opacity-50 ${
                      statusHome.status === st
                        ? "border-teal-brand bg-teal-brand/[0.06]"
                        : "border-ink/10 hover:border-teal-brand/40 hover:bg-mint/30 hover:translate-x-0.5"
                    }`}
                  >
                    <StatusBadge status={st} />
                    {statusHome.status === st ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-teal-brand">
                        <Check className="h-4 w-4" />
                        Current
                      </span>
                    ) : (
                      <ChevronRight className="h-4 w-4 text-ink/30" />
                    )}
                  </button>
                ),
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* Confirmation Modal for Care Home Status Change */}
      <Modal
        open={Boolean(confirmStatusHome)}
        onClose={() => setConfirmStatusHome(null)}
        icon={AlertTriangle}
        title="Confirm Status Change"
        description="Facility operational update"
        size="sm"
        footer={
          confirmStatusHome && (
            <>
              <button
                type="button"
                onClick={() => setConfirmStatusHome(null)}
                disabled={statusMutation.isPending}
                className={btn.secondary}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  await handleStatusChange(
                    confirmStatusHome.home,
                    confirmStatusHome.targetStatus,
                  );
                  setConfirmStatusHome(null);
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
        {confirmStatusHome && (
          <div className="space-y-4">
            <p className="text-sm text-ink/70 leading-relaxed">
              Are you sure you want to change the status of{" "}
              <strong className="text-ink">
                {confirmStatusHome.home.name}
              </strong>{" "}
              from{" "}
              <span className="font-semibold text-ink">
                {confirmStatusHome.home.status}
              </span>{" "}
              to{" "}
              <span className="font-bold text-teal-deep">
                {confirmStatusHome.targetStatus}
              </span>
              ?
            </p>
            <div className="flex items-center justify-center gap-3 p-3 rounded-md bg-[#f8faf9] border border-ink/[0.06]">
              <StatusBadge status={confirmStatusHome.home.status} />
              <ArrowRight className="h-4 w-4 text-ink/35" />
              <StatusBadge status={confirmStatusHome.targetStatus} />
            </div>
          </div>
        )}
      </Modal>

      {/* Details View Modal */}
      <Modal
        open={Boolean(viewingHome)}
        onClose={() => setViewingHome(null)}
        icon={Home}
        title={viewingHome?.name ?? ""}
        description={viewingHome?.organisationName}
        footer={
          <button
            onClick={() => setViewingHome(null)}
            className={btn.primary}
          >
            Close
          </button>
        }
      >
        {viewingHome && (
          <div className="space-y-4">
            <div className="p-3.5 rounded-md bg-[#f8faf9] border border-ink/[0.08]">
              <span className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-ink/45">
                <Fingerprint className="h-3 w-3" />
                Care Home Public ID
              </span>
              <div className="mt-1 flex items-center justify-between gap-2 font-mono text-xs text-ink break-all">
                <span>{viewingHome.publicId}</span>
                <button
                  onClick={() =>
                    handleCopy(viewingHome.publicId, viewingHome.publicId)
                  }
                  className={`${btn.icon} !w-8 !h-8 text-teal-brand hover:text-teal-deep shrink-0`}
                  aria-label="Copy Care Home ID"
                  title="Copy ID"
                >
                  {copiedId === viewingHome.publicId ? (
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
                  <StatusBadge status={viewingHome.status} />
                </DataItem>
              </div>
              <div className="p-3 rounded-md border border-ink/[0.08]">
                <DataItem label="Registered" icon={Calendar}>
                  {new Date(viewingHome.createdAt).toLocaleDateString()}
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
                  {viewingHome.email}
                </dd>
              </div>
              {viewingHome.phone && (
                <div className="flex items-start justify-between gap-4 py-2.5">
                  <dt className="flex items-center gap-1.5 text-ink/55 shrink-0">
                    <Phone className="h-3.5 w-3.5" />
                    Phone
                  </dt>
                  <dd className="font-medium text-ink text-right">
                    {viewingHome.phone}
                  </dd>
                </div>
              )}
              {viewingHome.address && (
                <div className="flex items-start justify-between gap-4 py-2.5">
                  <dt className="flex items-center gap-1.5 text-ink/55 shrink-0">
                    <MapPin className="h-3.5 w-3.5" />
                    Address
                  </dt>
                  <dd className="font-medium text-ink text-right">
                    {[
                      viewingHome.address,
                      viewingHome.city,
                      viewingHome.state,
                      viewingHome.country,
                      viewingHome.postalCode,
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

export default function CareHomesPage() {
  return (
    <Suspense
      fallback={
        <div className="p-12 text-center text-ink/50 text-sm">
          <RefreshCw className="h-5 w-5 animate-spin mx-auto mb-2 text-teal-brand" />
          Loading Care Homes...
        </div>
      }
    >
      <CareHomesContent />
    </Suspense>
  );
}
