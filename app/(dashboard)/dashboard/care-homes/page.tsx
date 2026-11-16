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
  Building2,
  MapPin,
  Phone,
  Mail,
  Plus,
  Search,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Copy,
  Check,
  Edit2,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  X,
  Home,
  SlidersHorizontal,
  Calendar,
} from "lucide-react";

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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-ink font-heading">
              Care Homes & Facilities
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-mint text-teal-deep font-semibold">
              {filteredHomes.length} Facilities Listed
            </span>
          </div>
          <p className="text-sm text-ink/70 mt-1">
            Manage residential care facilities, contact information, and
            operating status.
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
            onClick={() => {
              if (!selectedOrgId && organisations.length > 0) {
                setSelectedOrgId(organisations[0].publicId);
              }
              setShowAddModal(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md bg-teal-brand text-white text-sm font-semibold hover:bg-teal-deep transition-all shadow-sm cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Add Care Home</span>
          </button>
        </div>
      </div>

      {/* Organisation Switcher Banner */}
      <div className="p-4 rounded-md bg-white border border-ink/10 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-md bg-teal-brand/10 text-teal-brand flex items-center justify-center shrink-0">
            <Building2 className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-ink/50 uppercase tracking-wider block">
              Active Organisation Filter
            </span>
            <div className="font-bold text-ink text-sm sm:text-base">
              {currentOrg ? currentOrg.name : "Select an Organisation"}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <label className="text-xs font-medium text-ink/70 whitespace-nowrap">
            Switch Org:
          </label>
          <select
            value={selectedOrgId}
            onChange={(e) => {
              setSelectedOrgId(e.target.value);
              setPage(0);
            }}
            disabled={isLoadingOrgs}
            className="w-full sm:w-72 rounded-md border border-ink/15 bg-cream/30 px-3 py-2 text-xs sm:text-sm text-ink focus:outline-none focus:ring-2 focus:ring-teal-brand/40 font-medium cursor-pointer"
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
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-md bg-white border border-ink/10 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-ink/40" />
          <input
            type="text"
            placeholder="Search by facility name, city or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm rounded-md border border-ink/10 bg-cream/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-brand/20 transition-all text-ink"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <SlidersHorizontal className="h-4 w-4 text-ink/40" />
          <span className="text-xs text-ink/60 font-medium">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs rounded-md border border-ink/10 px-3 py-2 bg-cream/30 focus:outline-none focus:ring-2 focus:ring-teal-brand/20 font-medium text-ink"
          >
            <option value="all">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="PENDING">Pending</option>
            <option value="SUSPENDED">Suspended</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </div>
      </div>

      {/* Content Grid */}
      {isLoadingHomes ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="p-6 rounded-md bg-white border border-ink/10 shadow-xs animate-pulse space-y-4"
            >
              <div className="h-5 bg-ink/10 rounded-md w-1/2" />
              <div className="h-4 bg-ink/10 rounded-md w-1/3" />
              <div className="h-20 bg-cream rounded-md" />
            </div>
          ))}
        </div>
      ) : isHomesError ? (
        <div className="p-8 rounded-md bg-red-50 border border-red-200 text-center space-y-3">
          <AlertTriangle className="h-8 w-8 text-red-600 mx-auto" />
          <p className="text-sm font-semibold text-red-800">
            Failed to load care homes
          </p>
          <p className="text-xs text-red-600 font-mono">
            {homesError instanceof Error ? homesError.message : "Unknown error"}
          </p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 rounded-md bg-red-600 text-white text-xs font-semibold hover:bg-red-700 cursor-pointer"
          >
            Try Again
          </button>
        </div>
      ) : filteredHomes.length === 0 ? (
        <div className="p-12 rounded-md bg-white border border-ink/10 text-center space-y-4 shadow-xs">
          <div className="w-14 h-14 rounded-full bg-cream text-teal-brand flex items-center justify-center mx-auto">
            <Home className="h-7 w-7" />
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h3 className="text-base font-bold text-ink">
              No Care Homes Found
            </h3>
            <p className="text-xs text-ink/60">
              {search
                ? `No facilities match "${search}". Try adjusting your search term.`
                : selectedOrgId
                  ? `No care homes have been registered under "${currentOrg?.name || "this organisation"}". Add the first one below.`
                  : "Please select an organisation above to view and manage care homes."}
            </p>
          </div>
          {selectedOrgId && (
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-teal-brand text-white text-xs font-semibold hover:bg-teal-deep transition-all cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Register First Care Home</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredHomes.map((home) => (
            <div
              key={home.publicId}
              className="p-6 rounded-md bg-white border border-ink/10 shadow-xs hover:border-teal-brand/40 transition-all space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                          home.status === "ACTIVE"
                            ? "bg-emerald-100 text-emerald-800"
                            : home.status === "PENDING"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {home.status}
                      </span>
                      {home.organisationName && (
                        <span className="text-[11px] font-semibold text-teal-deep bg-mint px-2 py-0.5 rounded-md">
                          {home.organisationName}
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-ink mt-1.5 font-heading">
                      {home.name}
                    </h3>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setEditingHome(home)}
                      title="Edit Care Home"
                      className="p-1.5 rounded-md text-ink/50 hover:text-ink hover:bg-cream cursor-pointer"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setViewingHome(home)}
                      title="View Details"
                      className="p-1.5 rounded-md text-ink/50 hover:text-ink hover:bg-cream cursor-pointer"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Details Section */}
                <div className="p-3.5 rounded-md bg-cream/30 border border-ink/5 text-xs space-y-2">
                  <div className="flex items-center gap-2 text-ink/80 truncate">
                    <Mail className="h-3.5 w-3.5 text-teal-brand shrink-0" />
                    <span className="font-medium truncate">{home.email}</span>
                  </div>
                  {home.phone && (
                    <div className="flex items-center gap-2 text-ink/80">
                      <Phone className="h-3.5 w-3.5 text-teal-brand shrink-0" />
                      <span>{home.phone}</span>
                    </div>
                  )}
                  {(home.address || home.city) && (
                    <div className="flex items-center gap-2 text-ink/80">
                      <MapPin className="h-3.5 w-3.5 text-teal-brand shrink-0" />
                      <span>
                        {[
                          home.address,
                          home.city,
                          home.state,
                          home.country,
                          home.postalCode,
                        ]
                          .filter(Boolean)
                          .join(", ")}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Card Footer */}
              <div className="pt-3 border-t border-ink/5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setStatusHome(home)}
                    className="px-2.5 py-1 rounded-md border border-ink/15 text-[11px] font-semibold text-ink/70 hover:bg-cream cursor-pointer"
                  >
                    Change Status
                  </button>
                  <Link
                    href={`/dashboard/users`}
                    className="px-3 py-1 rounded-md bg-teal-brand/10 hover:bg-teal-brand/20 text-teal-deep font-semibold text-xs transition-all cursor-pointer"
                  >
                    Manage Residents
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
            Showing Page {page + 1} of {totalPages} ({totalElements} care homes)
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

      {/* Add Care Home Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-md p-6 shadow-2xl border border-ink/10 space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-ink/10 pb-3">
              <div className="flex items-center gap-2">
                <Home className="h-5 w-5 text-teal-brand" />
                <h3 className="text-lg font-bold text-ink font-heading">
                  Register Care Home Facility
                </h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-md text-ink/40 hover:text-ink cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form
              onSubmit={handleCreateSubmit}
              className="space-y-4 text-xs sm:text-sm"
            >
              <div className="space-y-1">
                <label className="font-semibold text-ink">
                  Parent Care Organisation *
                </label>
                <select
                  required
                  value={selectedOrgId}
                  onChange={(e) => setSelectedOrgId(e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-ink/15 bg-cream/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-brand/30"
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2 space-y-1">
                  <label className="font-semibold text-ink">
                    Facility Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. St. Jude's Residential Home"
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
                    placeholder="stjudes@apexcare.co.uk"
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
                    placeholder="+44 117 496 0281"
                    value={createForm.phone}
                    onChange={(e) =>
                      setCreateForm({ ...createForm, phone: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-md border border-ink/15 bg-cream/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-brand/30"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="font-semibold text-ink">
                    Street Address
                  </label>
                  <input
                    type="text"
                    placeholder="14 Primrose Crescent"
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
                    placeholder="Bristol"
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
                    placeholder="Somerset"
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
                    placeholder="BS8 4HG"
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
                  onClick={() => setShowAddModal(false)}
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
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>Register Facility</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Care Home Modal */}
      {editingHome && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-md p-6 shadow-2xl border border-ink/10 space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-ink/10 pb-3">
              <div className="flex items-center gap-2">
                <Edit2 className="h-5 w-5 text-teal-brand" />
                <h3 className="text-lg font-bold text-ink font-heading">
                  Edit Care Home Facility
                </h3>
              </div>
              <button
                onClick={() => setEditingHome(null)}
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
                    Facility Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingHome.name}
                    onChange={(e) =>
                      setEditingHome({ ...editingHome, name: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-md border border-ink/15 bg-cream/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-brand/30"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-ink">Email *</label>
                  <input
                    type="email"
                    required
                    value={editingHome.email}
                    onChange={(e) =>
                      setEditingHome({ ...editingHome, email: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-md border border-ink/15 bg-cream/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-brand/30"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-ink">Phone</label>
                  <input
                    type="tel"
                    value={editingHome.phone || ""}
                    onChange={(e) =>
                      setEditingHome({ ...editingHome, phone: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-md border border-ink/15 bg-cream/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-brand/30"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="font-semibold text-ink">Address</label>
                  <input
                    type="text"
                    value={editingHome.address || ""}
                    onChange={(e) =>
                      setEditingHome({
                        ...editingHome,
                        address: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 rounded-md border border-ink/15 bg-cream/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-brand/30"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-ink">City</label>
                  <input
                    type="text"
                    value={editingHome.city || ""}
                    onChange={(e) =>
                      setEditingHome({ ...editingHome, city: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-md border border-ink/15 bg-cream/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-brand/30"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-ink">State</label>
                  <input
                    type="text"
                    value={editingHome.state || ""}
                    onChange={(e) =>
                      setEditingHome({ ...editingHome, state: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-md border border-ink/15 bg-cream/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-brand/30"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-ink">Postal Code</label>
                  <input
                    type="text"
                    value={editingHome.postalCode || ""}
                    onChange={(e) =>
                      setEditingHome({
                        ...editingHome,
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
                    value={editingHome.country || ""}
                    onChange={(e) =>
                      setEditingHome({
                        ...editingHome,
                        country: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 rounded-md border border-ink/15 bg-cream/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-brand/30"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-ink/10">
                <button
                  type="button"
                  onClick={() => setEditingHome(null)}
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
      {statusHome && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white rounded-md p-6 shadow-2xl border border-ink/10 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-ink/10 pb-3">
              <h3 className="text-base font-bold text-ink">
                Update Care Home Status
              </h3>
              <button
                onClick={() => setStatusHome(null)}
                className="p-1 rounded-md text-ink/40 hover:text-ink cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="text-xs text-ink/70">
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
                    className={`w-full p-2.5 rounded-md text-left text-xs font-semibold border transition-all cursor-pointer flex items-center justify-between ${
                      statusHome.status === st
                        ? "border-teal-brand bg-teal-brand/10 text-teal-deep"
                        : "border-ink/10 hover:border-ink/30 text-ink/80"
                    }`}
                  >
                    <span>{st}</span>
                    {statusHome.status === st && (
                      <Check className="h-4 w-4 text-teal-brand" />
                    )}
                  </button>
                ),
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setStatusHome(null)}
                className="px-3 py-1.5 rounded-md border border-ink/15 text-xs font-semibold text-ink/70 hover:bg-cream cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Care Home Status Change */}
      {confirmStatusHome && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white rounded-md p-6 shadow-2xl border border-ink/10 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-md bg-amber-500/10 text-amber-600 border border-amber-500/20 shrink-0">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-ink">
                  Confirm Status Change
                </h3>
                <p className="text-xs text-ink/50">
                  Facility operational update
                </p>
              </div>
            </div>

            <p className="text-xs text-ink/70 leading-relaxed">
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

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-ink/10">
              <button
                type="button"
                onClick={() => setConfirmStatusHome(null)}
                disabled={statusMutation.isPending}
                className="px-3.5 py-2 rounded-md border border-ink/15 text-xs font-semibold text-ink/70 hover:bg-cream cursor-pointer transition-colors"
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
      {viewingHome && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-md p-6 shadow-2xl border border-ink/10 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-ink/10 pb-3">
              <div className="flex items-center gap-2">
                <Home className="h-5 w-5 text-teal-brand" />
                <h3 className="text-lg font-bold text-ink">
                  {viewingHome.name}
                </h3>
              </div>
              <button
                onClick={() => setViewingHome(null)}
                className="p-1 rounded-md text-ink/40 hover:text-ink cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-md bg-cream/40 border border-ink/10 space-y-1">
                <span className="text-[10px] uppercase font-bold text-ink/50">
                  Care Home Public ID
                </span>
                <div className="flex items-center justify-between font-mono text-[11px] text-ink break-all">
                  <span>{viewingHome.publicId}</span>
                  <button
                    onClick={() =>
                      handleCopy(viewingHome.publicId, viewingHome.publicId)
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
                    {viewingHome.status}
                  </span>
                </div>
                <div className="p-2.5 rounded-md bg-cream/30 border border-ink/10">
                  <span className="text-[10px] uppercase font-bold text-ink/50 block">
                    Registered
                  </span>
                  <span className="font-semibold text-ink">
                    {new Date(viewingHome.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="space-y-2 border-t border-ink/10 pt-3">
                <div className="flex justify-between">
                  <span className="text-ink/60">Email:</span>
                  <span className="font-medium text-ink">
                    {viewingHome.email}
                  </span>
                </div>
                {viewingHome.phone && (
                  <div className="flex justify-between">
                    <span className="text-ink/60">Phone:</span>
                    <span className="font-medium text-ink">
                      {viewingHome.phone}
                    </span>
                  </div>
                )}
                {viewingHome.address && (
                  <div className="flex justify-between">
                    <span className="text-ink/60">Address:</span>
                    <span className="font-medium text-ink text-right">
                      {[
                        viewingHome.address,
                        viewingHome.city,
                        viewingHome.state,
                        viewingHome.country,
                        viewingHome.postalCode,
                      ]
                        .filter(Boolean)
                        .join(", ")}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-ink/10 flex justify-end">
              <button
                onClick={() => setViewingHome(null)}
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
