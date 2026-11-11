"use client";

import { useState } from "react";
import { useRole } from "@/lib/role-context";
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
} from "lucide-react";

interface Organisation {
  id: string;
  name: string;
  code: string;
  registrationNumber: string;
  tier: "Enterprise Multi-Home" | "Professional" | "Standard";
  homesCount: number;
  totalBeds: number;
  residentCount: number;
  primaryAdmin: string;
  adminEmail: string;
  status: "Active" | "Provisioning" | "Suspended";
  createdDate: string;
}

const mockOrganisations: Organisation[] = [
  {
    id: "org-1",
    name: "Apex Care Group",
    code: "APEX-UK",
    registrationNumber: "CRN-10492811",
    tier: "Enterprise Multi-Home",
    homesCount: 4,
    totalBeds: 165,
    residentCount: 144,
    primaryAdmin: "Victoria Sterling",
    adminEmail: "v.sterling@apexcare.co.uk",
    status: "Active",
    createdDate: "2024-01-15",
  },
  {
    id: "org-2",
    name: "Kindred Care Living",
    code: "KND-LIV",
    registrationNumber: "CRN-20993412",
    tier: "Professional",
    homesCount: 2,
    totalBeds: 72,
    residentCount: 65,
    primaryAdmin: "Edward Hall",
    adminEmail: "e.hall@kindredliving.org",
    status: "Active",
    createdDate: "2024-05-20",
  },
  {
    id: "org-3",
    name: "Serenity Haven Healthcare",
    code: "SH-HEALTH",
    registrationNumber: "CRN-88192033",
    tier: "Enterprise Multi-Home",
    homesCount: 6,
    totalBeds: 240,
    residentCount: 218,
    primaryAdmin: "Dr. Alistair Ross",
    adminEmail: "a.ross@serenityhaven.com",
    status: "Active",
    createdDate: "2024-09-10",
  },
  {
    id: "org-4",
    name: "Beacon Light Homes",
    code: "BCN-LIGHT",
    registrationNumber: "CRN-33441920",
    tier: "Standard",
    homesCount: 1,
    totalBeds: 28,
    residentCount: 24,
    primaryAdmin: "Marianne Lewis",
    adminEmail: "m.lewis@beaconhomes.co.uk",
    status: "Provisioning",
    createdDate: "2026-03-01",
  },
];

export default function OrganisationsPage() {
  const { currentRole } = useRole();
  const [organisations, setOrganisations] =
    useState<Organisation[]>(mockOrganisations);
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newOrgName, setNewOrgName] = useState("");
  const [newOrgCode, setNewOrgCode] = useState("");
  const [newAdminEmail, setNewAdminEmail] = useState("");

  if (currentRole !== "SUPER_ADMIN") {
    return (
      <div className="p-8 rounded-3xl bg-white border border-ink/10 text-center max-w-xl mx-auto space-y-4 my-12">
        <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center mx-auto">
          <AlertTriangle className="h-6 w-6" />
        </div>
        <h2 className="text-xl font-bold text-ink font-heading">
          Restricted Platform Domain
        </h2>
        <p className="text-xs text-ink/70 leading-relaxed">
          The Organisation Directory is accessible strictly to Super
          Administrators managing multi-tenant infrastructure. Switch to the
          Super Admin role from the top bar to inspect this level.
        </p>
      </div>
    );
  }

  const handleCreateOrg = () => {
    if (!newOrgName || !newOrgCode) return;
    const newEntry: Organisation = {
      id: `org-${Date.now()}`,
      name: newOrgName,
      code: newOrgCode.toUpperCase(),
      registrationNumber: `CRN-${Math.floor(10000000 + Math.random() * 90000000)}`,
      tier: "Professional",
      homesCount: 1,
      totalBeds: 30,
      residentCount: 0,
      primaryAdmin: "Admin",
      adminEmail:
        newAdminEmail || "admin@" + newOrgCode.toLowerCase() + ".co.uk",
      status: "Provisioning",
      createdDate: "2026-03-29",
    };
    setOrganisations([newEntry, ...organisations]);
    setShowAddModal(false);
    setNewOrgName("");
    setNewOrgCode("");
    setNewAdminEmail("");
  };

  const filtered = organisations.filter(
    (o) =>
      o.name.toLowerCase().includes(search.toLowerCase()) ||
      o.code.toLowerCase().includes(search.toLowerCase()) ||
      o.primaryAdmin.toLowerCase().includes(search.toLowerCase()),
  );

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
            Section 4.2 Multi-tenant Registry: Provision and oversee independent
            care provider groups on CarerLoop.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-brand text-white text-sm font-semibold hover:bg-teal-deep transition-all shadow-sm cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          Provision Organisation
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-md bg-white border border-ink/10 shadow-xs">
          <span className="text-xs font-semibold text-ink/60 uppercase tracking-wider">
            Tenant Organisations
          </span>
          <p className="text-3xl font-bold text-ink mt-1">
            {organisations.length}
          </p>
          <span className="text-xs text-teal-deep font-semibold">
            100% Tenant Isolation
          </span>
        </div>
        <div className="p-5 rounded-md bg-white border border-ink/10 shadow-xs">
          <span className="text-xs font-semibold text-ink/60 uppercase tracking-wider">
            Total Managed Homes
          </span>
          <p className="text-3xl font-bold text-ink mt-1">
            {organisations.reduce((acc, o) => acc + o.homesCount, 0)}
          </p>
          <span className="text-xs text-ink/60">Across UK Regions</span>
        </div>
        <div className="p-5 rounded-md bg-white border border-ink/10 shadow-xs">
          <span className="text-xs font-semibold text-ink/60 uppercase tracking-wider">
            Total Active Residents
          </span>
          <p className="text-3xl font-bold text-ink mt-1">
            {organisations.reduce((acc, o) => acc + o.residentCount, 0)}
          </p>
          <span className="text-xs text-ink/60">Lives supported centrally</span>
        </div>
      </div>

      {/* Search */}
      <div className="p-4 rounded-md bg-white border border-ink/10 shadow-xs flex items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-ink/40" />
          <input
            type="text"
            placeholder="Search by organisation name, code or admin..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-ink/10 bg-cream/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-brand/20 transition-all"
          />
        </div>
      </div>

      {/* Organisations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((org) => (
          <div
            key={org.id}
            className="p-6 rounded-3xl bg-white border border-ink/10 shadow-xs hover:border-teal-brand/40 transition-all space-y-4"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold font-mono px-2 py-0.5 rounded-md bg-ink/5 text-teal-deep">
                    {org.code}
                  </span>
                  <span
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                      org.status === "Active"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {org.status}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-ink mt-1.5 font-heading">
                  {org.name}
                </h3>
                <p className="text-xs text-ink/60">
                  {org.registrationNumber} • {org.tier}
                </p>
              </div>

              <div className="text-right">
                <span className="text-xs font-bold text-teal-deep block">
                  {org.homesCount} Care Homes
                </span>
                <span className="text-[11px] text-ink/60">
                  {org.residentCount} / {org.totalBeds} Residents
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-md bg-cream/40 border border-ink/5 text-xs grid grid-cols-2 gap-2">
              <div>
                <span className="text-[10px] text-ink/50 uppercase font-semibold block">
                  Designated Org Admin
                </span>
                <p className="font-bold text-ink mt-0.5">{org.primaryAdmin}</p>
                <p className="text-teal-brand text-[11px] truncate">
                  {org.adminEmail}
                </p>
              </div>
              <div>
                <span className="text-[10px] text-ink/50 uppercase font-semibold block">
                  Tenant Onboarded
                </span>
                <p className="font-medium text-ink mt-0.5">{org.createdDate}</p>
                <p className="text-[11px] text-emerald-700 font-semibold">
                  CQC Compliant
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-ink/50 font-mono">
                UUID: tenant-{org.code.toLowerCase()}
              </span>
              <button
                onClick={() => {}}
                className="px-3 py-1.5 rounded-xl bg-cream hover:bg-mint text-teal-deep text-xs font-semibold transition-all cursor-pointer"
              >
                Manage Tenant
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Provision Org Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-ink/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border border-ink/10 space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-ink/10 pb-4">
              <div>
                <h3 className="text-lg font-bold text-ink font-heading">
                  Provision Care Organisation
                </h3>
                <p className="text-xs text-ink/60">
                  Creates an isolated multi-tenant partition on CarerLoop
                </p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-xs p-1 text-ink/50 hover:text-ink cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-ink block mb-1">
                  Organisation Legal Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Sunrise Care Group Ltd"
                  value={newOrgName}
                  onChange={(e) => setNewOrgName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-ink/10 bg-cream/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-brand/20 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-ink block mb-1">
                    Tenant Code (Unique)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. SUNRISE"
                    value={newOrgCode}
                    onChange={(e) => setNewOrgCode(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-ink/10 bg-cream/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-brand/20 uppercase font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="font-semibold text-ink block mb-1">
                    Subscription Plan
                  </label>
                  <select className="w-full px-3 py-2 rounded-xl border border-ink/10 bg-cream/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-brand/20 font-medium">
                    <option>Enterprise Multi-Home</option>
                    <option>Professional</option>
                    <option>Standard</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-ink block mb-1">
                  Primary Organisation Admin Email
                </label>
                <input
                  type="email"
                  placeholder="admin@organisation.co.uk"
                  value={newAdminEmail}
                  onChange={(e) => setNewAdminEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-ink/10 bg-cream/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-brand/20 font-medium"
                />
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
                onClick={handleCreateOrg}
                className="px-4 py-2 rounded-xl bg-teal-brand text-white text-xs font-semibold hover:bg-teal-deep transition-all cursor-pointer"
              >
                Provision Tenant
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
