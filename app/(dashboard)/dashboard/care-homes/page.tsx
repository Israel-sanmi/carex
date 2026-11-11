"use client";

import { useState } from "react";
import { useRole } from "@/lib/role-context";
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  Users,
  Bed,
  Plus,
  Search,
  SlidersHorizontal,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
} from "lucide-react";

interface CareHome {
  id: string;
  name: string;
  code: string;
  organisation: string;
  address: string;
  city: string;
  postalCode: string;
  phone: string;
  email: string;
  manager: string;
  capacity: number;
  occupied: number;
  staffCount: number;
  cqcRating: "Outstanding" | "Good" | "Requires Improvement";
  status: "Active" | "Maintenance";
}

const mockCareHomes: CareHome[] = [
  {
    id: "ch-1",
    name: "St. Jude's Residential Home",
    code: "STJ-01",
    organisation: "Apex Care Group",
    address: "14 Primrose Crescent",
    city: "Bristol",
    postalCode: "BS8 4HG",
    phone: "+44 (0) 117 496 0281",
    email: "stjudes@apexcare.co.uk",
    manager: "Eleanor Vance",
    capacity: 48,
    occupied: 42,
    staffCount: 34,
    cqcRating: "Good",
    status: "Active",
  },
  {
    id: "ch-2",
    name: "Meadow View Lodge",
    code: "MVL-02",
    organisation: "Apex Care Group",
    address: "88 Willow Green",
    city: "Bath",
    postalCode: "BA2 9PQ",
    phone: "+44 (0) 122 590 1144",
    email: "meadowview@apexcare.co.uk",
    manager: "Marcus Thorne",
    capacity: 32,
    occupied: 30,
    staffCount: 26,
    cqcRating: "Outstanding",
    status: "Active",
  },
  {
    id: "ch-3",
    name: "Oakridge Manor Care Centre",
    code: "OMC-03",
    organisation: "Apex Care Group",
    address: "5 Highfield Avenue",
    city: "Gloucester",
    postalCode: "GL1 3TR",
    phone: "+44 (0) 145 233 4902",
    email: "oakridge@apexcare.co.uk",
    manager: "Sarah Jenkins",
    capacity: 60,
    occupied: 54,
    staffCount: 42,
    cqcRating: "Good",
    status: "Active",
  },
  {
    id: "ch-4",
    name: "Hazelwood House",
    code: "HZH-04",
    organisation: "Apex Care Group",
    address: "21 Elmhurst Lane",
    city: "Cheltenham",
    postalCode: "GL50 2EE",
    phone: "+44 (0) 124 251 7708",
    email: "hazelwood@apexcare.co.uk",
    manager: "David Bell",
    capacity: 25,
    occupied: 18,
    staffCount: 19,
    cqcRating: "Good",
    status: "Active",
  },
];

export default function CareHomesPage() {
  const { currentRole, user, activeCareHome, setActiveCareHome } = useRole();
  const [search, setSearch] = useState("");
  const [filterRating, setFilterRating] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);

  // Scoping logic: Care home managers see primarily their assigned home, while Org & Super admins see all
  const filteredHomes = mockCareHomes.filter((home) => {
    const matchesSearch =
      home.name.toLowerCase().includes(search.toLowerCase()) ||
      home.city.toLowerCase().includes(search.toLowerCase()) ||
      home.manager.toLowerCase().includes(search.toLowerCase());
    const matchesRating =
      filterRating === "all" || home.cqcRating === filterRating;
    return matchesSearch && matchesRating;
  });

  const totalBeds = mockCareHomes.reduce((acc, h) => acc + h.capacity, 0);
  const totalOccupied = mockCareHomes.reduce((acc, h) => acc + h.occupied, 0);
  const avgOccupancy = Math.round((totalOccupied / totalBeds) * 100);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-ink font-heading">
              Care Homes & Facilities
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-mint text-teal-deep font-semibold">
              {mockCareHomes.length} Facilities
            </span>
          </div>
          <p className="text-sm text-ink/70 mt-1">
            Manage residential care facilities, bed capacity, allocations, and
            compliance standards.
          </p>
        </div>

        {["SUPER_ADMIN", "ORGANISATION_ADMIN"].includes(currentRole) && (
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-brand text-white text-sm font-semibold hover:bg-teal-deep transition-all shadow-sm cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Add Care Home
          </button>
        )}
      </div>

      {/* Capacity & Occupancy KPI Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-md bg-white border border-ink/10 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-ink/60 uppercase tracking-wider">
              Total Facilities
            </span>
            <Building2 className="h-5 w-5 text-teal-brand" />
          </div>
          <p className="text-3xl font-bold text-ink mt-2">
            {mockCareHomes.length}
          </p>
          <span className="text-xs text-ink/60">Across South West Region</span>
        </div>

        <div className="p-5 rounded-md bg-white border border-ink/10 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-ink/60 uppercase tracking-wider">
              Total Bed Capacity
            </span>
            <Bed className="h-5 w-5 text-teal-brand" />
          </div>
          <p className="text-3xl font-bold text-ink mt-2">{totalBeds}</p>
          <span className="text-xs text-teal-deep font-semibold">
            {totalOccupied} Currently Occupied
          </span>
        </div>

        <div className="p-5 rounded-md bg-white border border-ink/10 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-ink/60 uppercase tracking-wider">
              Group Occupancy
            </span>
            <div className="h-6 w-6 rounded-full bg-mint flex items-center justify-center text-teal-deep text-xs font-bold">
              %
            </div>
          </div>
          <p className="text-3xl font-bold text-ink mt-2">{avgOccupancy}%</p>
          <div className="w-full bg-cream rounded-full h-1.5 mt-2">
            <div
              className="bg-teal-brand h-1.5 rounded-full"
              style={{ width: `${avgOccupancy}%` }}
            />
          </div>
        </div>

        <div className="p-5 rounded-md bg-white border border-ink/10 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-ink/60 uppercase tracking-wider">
              Available Beds
            </span>
            <Sparkles className="h-5 w-5 text-amber-500" />
          </div>
          <p className="text-3xl font-bold text-teal-deep mt-2">
            {totalBeds - totalOccupied}
          </p>
          <span className="text-xs text-ink/60">Ready for instant intake</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-md bg-white border border-ink/10 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-ink/40" />
          <input
            type="text"
            placeholder="Search by facility name, city or manager..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-ink/10 bg-cream/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-brand/20 focus:border-teal-brand transition-all"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <SlidersHorizontal className="h-4 w-4 text-ink/40" />
          <span className="text-xs text-ink/60 font-medium">CQC Rating:</span>
          <select
            value={filterRating}
            onChange={(e) => setFilterRating(e.target.value)}
            className="text-xs rounded-xl border border-ink/10 px-3 py-2 bg-cream/30 focus:outline-none focus:ring-2 focus:ring-teal-brand/20 font-medium text-ink"
          >
            <option value="all">All Ratings</option>
            <option value="Outstanding">Outstanding</option>
            <option value="Good">Good</option>
            <option value="Requires Improvement">Requires Improvement</option>
          </select>
        </div>
      </div>

      {/* Care Homes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredHomes.map((home) => {
          const occupancyRate = Math.round(
            (home.occupied / home.capacity) * 100,
          );
          const isSelected = activeCareHome === home.name;

          return (
            <div
              key={home.id}
              className={`p-6 rounded-3xl bg-white border transition-all hover:shadow-md ${
                isSelected
                  ? "border-teal-brand ring-2 ring-teal-brand/20 bg-mint/5"
                  : "border-ink/10 hover:border-ink/20"
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-ink/5 text-ink/70">
                      {home.code}
                    </span>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-mint text-teal-deep">
                      CQC: {home.cqcRating}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-ink mt-1 font-heading">
                    {home.name}
                  </h3>
                  <p className="text-xs text-ink/60 flex items-center gap-1.5 mt-1">
                    <MapPin className="h-3.5 w-3.5 text-teal-brand" />
                    {home.address}, {home.city} {home.postalCode}
                  </p>
                </div>

                <button
                  onClick={() => setActiveCareHome(home.name)}
                  className={`text-xs px-3 py-1.5 rounded-xl font-semibold transition-all cursor-pointer ${
                    isSelected
                      ? "bg-teal-brand text-white shadow-xs"
                      : "bg-cream text-ink/70 hover:bg-mint hover:text-teal-deep"
                  }`}
                >
                  {isSelected ? "Active View" : "Select View"}
                </button>
              </div>

              {/* Occupancy bar */}
              <div className="mt-5 p-4 rounded-md bg-cream/40 border border-ink/5 space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-ink/70">Occupancy Level</span>
                  <span className="text-teal-deep">
                    {home.occupied} / {home.capacity} Beds ({occupancyRate}%)
                  </span>
                </div>
                <div className="w-full bg-ink/10 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      occupancyRate > 90 ? "bg-amber-500" : "bg-teal-brand"
                    }`}
                    style={{ width: `${occupancyRate}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-ink/60 pt-1">
                  <span>{home.capacity - home.occupied} vacant beds</span>
                  <span className="text-emerald-700 font-semibold">
                    {home.staffCount} Dedicated Carers
                  </span>
                </div>
              </div>

              {/* Contact & Manager Footer */}
              <div className="mt-5 pt-4 border-t border-ink/5 grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[11px] text-ink/50 uppercase font-semibold">
                    Care Home Manager
                  </span>
                  <p className="font-bold text-ink mt-0.5">{home.manager}</p>
                </div>
                <div>
                  <span className="text-[11px] text-ink/50 uppercase font-semibold">
                    Contact Direct
                  </span>
                  <p className="font-medium text-ink mt-0.5 truncate">
                    {home.phone}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Care Home Modal mock */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-ink/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border border-ink/10 space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-ink/10 pb-4">
              <div>
                <h3 className="text-lg font-bold text-ink font-heading">
                  Register New Care Home
                </h3>
                <p className="text-xs text-ink/60">
                  Add a new residential facility under your care organisation
                </p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-xs p-1 rounded-md text-ink/50 hover:text-ink cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-ink block mb-1">
                  Facility Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Primrose Court Nursing Centre"
                  className="w-full px-3 py-2 rounded-xl border border-ink/10 bg-cream/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-brand/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-ink block mb-1">
                    Total Bed Capacity
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 40"
                    className="w-full px-3 py-2 rounded-xl border border-ink/10 bg-cream/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-brand/20"
                  />
                </div>
                <div>
                  <label className="font-semibold text-ink block mb-1">
                    Facility Code
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. PCN-05"
                    className="w-full px-3 py-2 rounded-xl border border-ink/10 bg-cream/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-brand/20"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-ink block mb-1">
                  Address & Postcode
                </label>
                <input
                  type="text"
                  placeholder="Street, City, Postal Code"
                  className="w-full px-3 py-2 rounded-xl border border-ink/10 bg-cream/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-brand/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-ink block mb-1">
                    Assigned Manager
                  </label>
                  <input
                    type="text"
                    placeholder="Manager full name"
                    className="w-full px-3 py-2 rounded-xl border border-ink/10 bg-cream/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-brand/20"
                  />
                </div>
                <div>
                  <label className="font-semibold text-ink block mb-1">
                    Direct Phone
                  </label>
                  <input
                    type="tel"
                    placeholder="+44 (0) ..."
                    className="w-full px-3 py-2 rounded-xl border border-ink/10 bg-cream/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-brand/20"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-ink/10">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded-xl border border-ink/10 text-xs font-semibold text-ink/70 hover:bg-cream cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded-xl bg-teal-brand text-white text-xs font-semibold hover:bg-teal-deep cursor-pointer"
              >
                Save Facility
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
