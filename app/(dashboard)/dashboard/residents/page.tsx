"use client";

import { useState } from "react";
import { useRole } from "@/lib/role-context";
import {
  Users,
  Search,
  Filter,
  Plus,
  Heart,
  AlertCircle,
  Phone,
  Calendar,
  Bed,
  Activity,
  ShieldAlert,
  CheckCircle2,
  Clock,
  FileText,
  UserCheck,
  ChevronRight,
  ExternalLink,
  Sparkles,
} from "lucide-react";

interface Resident {
  id: string;
  referenceNumber: string;
  fullName: string;
  preferredName: string;
  dateOfBirth: string;
  age: number;
  gender: string;
  roomNumber: string;
  bedId: string;
  careLevel:
    | "High Dependency"
    | "Dementia Support"
    | "Residential Assisted"
    | "Nursing Care";
  admissionDate: string;
  careHome: string;
  keyWorker: string;
  allergies: string[];
  dietary: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  status: "In Residence" | "Temporary Hospital" | "Discharged";
  vitalStatus: "Stable" | "Review Required" | "Priority Attention";
}

const mockResidents: Resident[] = [
  {
    id: "res-1",
    referenceNumber: "REG-2026-9041",
    fullName: "Arthur Pendelton",
    preferredName: "Artie",
    dateOfBirth: "1938-04-12",
    age: 87,
    gender: "Male",
    roomNumber: "Suite 104",
    bedId: "Bed 1",
    careLevel: "High Dependency",
    admissionDate: "2024-03-15",
    careHome: "St. Jude's Residential Home",
    keyWorker: "Grace Mbatha",
    allergies: ["Penicillin", "Latex"],
    dietary: "Soft food texture, Low sodium",
    emergencyContact: {
      name: "Helen Pendelton",
      relationship: "Daughter",
      phone: "+44 (0) 7911 234567",
    },
    status: "In Residence",
    vitalStatus: "Stable",
  },
  {
    id: "res-2",
    referenceNumber: "REG-2026-8812",
    fullName: "Margaret 'Maggie' Smith",
    preferredName: "Maggie",
    dateOfBirth: "1942-09-24",
    age: 83,
    gender: "Female",
    roomNumber: "Suite 108",
    bedId: "Bed 1",
    careLevel: "Dementia Support",
    admissionDate: "2024-06-20",
    careHome: "St. Jude's Residential Home",
    keyWorker: "Grace Mbatha",
    allergies: ["Aspirin"],
    dietary: "Diabetic friendly, No nuts",
    emergencyContact: {
      name: "David Smith",
      relationship: "Son",
      phone: "+44 (0) 7822 990112",
    },
    status: "In Residence",
    vitalStatus: "Review Required",
  },
  {
    id: "res-3",
    referenceNumber: "REG-2026-7721",
    fullName: "Robert 'Bob' Chen",
    preferredName: "Bob",
    dateOfBirth: "1945-11-03",
    age: 80,
    gender: "Male",
    roomNumber: "Suite 201",
    bedId: "Bed 2",
    careLevel: "Residential Assisted",
    admissionDate: "2025-01-10",
    careHome: "St. Jude's Residential Home",
    keyWorker: "Liam O'Connor",
    allergies: ["None known"],
    dietary: "Normal standard diet",
    emergencyContact: {
      name: "Jennifer Chen",
      relationship: "Spouse",
      phone: "+44 (0) 7700 900341",
    },
    status: "In Residence",
    vitalStatus: "Stable",
  },
  {
    id: "res-4",
    referenceNumber: "REG-2026-6549",
    fullName: "Evelyn Beatrice Harper",
    preferredName: "Evie",
    dateOfBirth: "1936-02-18",
    age: 90,
    gender: "Female",
    roomNumber: "Suite 112",
    bedId: "Bed 1",
    careLevel: "Nursing Care",
    admissionDate: "2023-11-04",
    careHome: "Meadow View Lodge",
    keyWorker: "Chloe Bennett",
    allergies: ["Sulfa drugs", "Shellfish"],
    dietary: "Pureed, High calorie supplements",
    emergencyContact: {
      name: "Thomas Harper",
      relationship: "Son",
      phone: "+44 (0) 7944 651233",
    },
    status: "In Residence",
    vitalStatus: "Priority Attention",
  },
  {
    id: "res-5",
    referenceNumber: "REG-2026-5120",
    fullName: "Harold James Fletcher",
    preferredName: "Harry",
    dateOfBirth: "1940-07-30",
    age: 85,
    gender: "Male",
    roomNumber: "Suite 204",
    bedId: "Bed 1",
    careLevel: "Residential Assisted",
    admissionDate: "2025-02-01",
    careHome: "Meadow View Lodge",
    keyWorker: "Chloe Bennett",
    allergies: ["Ibuprofen"],
    dietary: "Vegetarian",
    emergencyContact: {
      name: "Claire Fletcher",
      relationship: "Daughter",
      phone: "+44 (0) 7899 432109",
    },
    status: "In Residence",
    vitalStatus: "Stable",
  },
];

export default function ResidentsPage() {
  const { currentRole, activeCareHome } = useRole();
  const [search, setSearch] = useState("");
  const [selectedCareLevel, setSelectedCareLevel] = useState("all");
  const [selectedResident, setSelectedResident] = useState<Resident | null>(
    null,
  );

  // If user is RESIDENT, show personal resident portal view
  if (currentRole === "RESIDENT") {
    const myProfile = mockResidents[0]; // Arthur Pendelton
    return (
      <div className="space-y-6 max-w-5xl mx-auto">
        <div className="p-6 rounded-md bg-teal-brand text-white shadow-md relative overflow-hidden">
          <div className="relative z-10">
            <span className="text-xs px-2.5 py-1 rounded-full bg-white/20 font-semibold tracking-wide">
              Resident & Family Portal
            </span>
            <h1 className="text-3xl font-bold font-heading mt-2">
              Welcome back, {myProfile.preferredName}
            </h1>
            <p className="text-white/80 text-sm mt-1">
              {myProfile.careHome} • {myProfile.roomNumber} ({myProfile.bedId})
            </p>
          </div>
          <div className="absolute right-6 -bottom-6 w-36 h-36 rounded-full bg-white/10 blur-xl pointer-events-none" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Details */}
          <div className="md:col-span-2 space-y-6">
            <div className="p-6 rounded-md bg-white border border-ink/10 shadow-xs space-y-4">
              <h2 className="text-lg font-bold text-ink font-heading flex items-center gap-2">
                <Heart className="h-5 w-5 text-coral" />
                Personal Profile & Care Level
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs pt-2">
                <div className="p-3 rounded-md bg-cream/40 border border-ink/5">
                  <span className="text-ink/50 uppercase font-semibold block text-[10px]">
                    Reference Number
                  </span>
                  <span className="font-bold text-ink font-mono text-xs">
                    {myProfile.referenceNumber}
                  </span>
                </div>
                <div className="p-3 rounded-md bg-cream/40 border border-ink/5">
                  <span className="text-ink/50 uppercase font-semibold block text-[10px]">
                    Care Tier
                  </span>
                  <span className="font-bold text-teal-deep text-xs">
                    {myProfile.careLevel}
                  </span>
                </div>
                <div className="p-3 rounded-md bg-cream/40 border border-ink/5">
                  <span className="text-ink/50 uppercase font-semibold block text-[10px]">
                    Admission Date
                  </span>
                  <span className="font-bold text-ink text-xs">
                    {myProfile.admissionDate}
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-md bg-mint/20 border border-teal-brand/20">
                <h3 className="text-xs font-bold text-teal-deep flex items-center gap-1.5">
                  <UserCheck className="h-4 w-4" />
                  Designated Key Worker
                </h3>
                <p className="text-xs text-ink/80 mt-1">
                  Senior Carer{" "}
                  <span className="font-bold">{myProfile.keyWorker}</span>{" "}
                  coordinates your personalized daily routine and clinical
                  support.
                </p>
              </div>

              <div className="space-y-2 pt-2">
                <h3 className="text-xs font-bold text-ink uppercase tracking-wide">
                  Allergies & Dietary Needs
                </h3>
                <div className="flex flex-wrap gap-2">
                  {myProfile.allergies.map((allergy) => (
                    <span
                      key={allergy}
                      className="px-2.5 py-1 rounded-full bg-red-50 text-red-700 border border-red-200 text-xs font-medium flex items-center gap-1"
                    >
                      <AlertCircle className="h-3 w-3" />
                      {allergy}
                    </span>
                  ))}
                  <span className="px-2.5 py-1 rounded-full bg-cream text-ink border border-ink/10 text-xs font-medium">
                    Diet: {myProfile.dietary}
                  </span>
                </div>
              </div>
            </div>

            {/* Daily Schedule Preview */}
            <div className="p-6 rounded-md bg-white border border-ink/10 shadow-xs space-y-4">
              <h2 className="text-lg font-bold text-ink font-heading flex items-center gap-2">
                <Clock className="h-5 w-5 text-teal-brand" />
                Today&apos;s Wellbeing & Activities
              </h2>
              <div className="space-y-3 text-xs">
                <div className="flex items-start gap-3 p-3 rounded-md bg-cream/30 border border-ink/5">
                  <span className="font-bold text-teal-deep w-16">
                    09:00 AM
                  </span>
                  <div>
                    <p className="font-bold text-ink">
                      Morning Medication & Hydration Check
                    </p>
                    <p className="text-ink/60 text-[11px]">
                      Completed by Grace Mbatha
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-md bg-cream/30 border border-ink/5">
                  <span className="font-bold text-teal-deep w-16">
                    11:00 AM
                  </span>
                  <div>
                    <p className="font-bold text-ink">
                      Gentle Movement & Garden Stroll
                    </p>
                    <p className="text-ink/60 text-[11px]">
                      Courtyard Garden with Activity Team
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-md bg-cream/30 border border-ink/5">
                  <span className="font-bold text-teal-deep w-16">
                    02:30 PM
                  </span>
                  <div>
                    <p className="font-bold text-ink">
                      Physiotherapy Mobility Session
                    </p>
                    <p className="text-ink/60 text-[11px]">
                      Ground Floor Wellness Studio
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
            <div className="p-6 rounded-md bg-white border border-ink/10 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-ink font-heading">
                Emergency Contact
              </h3>
              <div className="p-4 rounded-md bg-cream/50 border border-ink/5 space-y-2 text-xs">
                <p className="font-bold text-ink text-sm">
                  {myProfile.emergencyContact.name}
                </p>
                <span className="px-2 py-0.5 rounded-md bg-white text-ink/70 border border-ink/10 font-medium">
                  {myProfile.emergencyContact.relationship}
                </span>
                <p className="text-ink/80 flex items-center gap-1.5 pt-1">
                  <Phone className="h-3.5 w-3.5 text-teal-brand" />
                  {myProfile.emergencyContact.phone}
                </p>
              </div>

              <div className="p-4 rounded-md bg-amber-50 border border-amber-200 text-xs space-y-2">
                <span className="font-bold text-amber-900 block">
                  Duty Nurse Call
                </span>
                <p className="text-amber-800 text-[11px]">
                  Need immediate staff support in Suite 104? Use your bedside
                  pendant or phone extension 204.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Filtered residents for staff views
  const filteredResidents = mockResidents.filter((res) => {
    const matchesSearch =
      res.fullName.toLowerCase().includes(search.toLowerCase()) ||
      res.roomNumber.toLowerCase().includes(search.toLowerCase()) ||
      res.referenceNumber.toLowerCase().includes(search.toLowerCase()) ||
      res.keyWorker.toLowerCase().includes(search.toLowerCase());
    const matchesCare =
      selectedCareLevel === "all" || res.careLevel === selectedCareLevel;
    return matchesSearch && matchesCare;
  });

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-ink font-heading">
              Residents Directory
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-mint text-teal-deep font-semibold">
              {mockResidents.length} Active Records
            </span>
          </div>
          <p className="text-sm text-ink/70 mt-1">
            Centrally manage resident health files, care tiers, bed allocations,
            and allergy cautions.
          </p>
        </div>

        {["ORGANISATION_ADMIN", "CARE_HOME_MANAGER"].includes(currentRole) && (
          <button
            onClick={() => {}}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md bg-teal-brand text-white text-sm font-semibold hover:bg-teal-deep transition-all shadow-sm cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Admit New Resident
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-md bg-white border border-ink/10 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-ink/40" />
          <input
            type="text"
            placeholder="Search by name, room, ref #, or caregiver..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm rounded-md border border-ink/10 bg-cream/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-brand/20 focus:border-teal-brand transition-all"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <Filter className="h-4 w-4 text-ink/40" />
          <span className="text-xs text-ink/60 font-medium">Care Level:</span>
          <select
            value={selectedCareLevel}
            onChange={(e) => setSelectedCareLevel(e.target.value)}
            className="text-xs rounded-md border border-ink/10 px-3 py-2 bg-cream/30 focus:outline-none focus:ring-2 focus:ring-teal-brand/20 font-medium text-ink"
          >
            <option value="all">All Care Levels</option>
            <option value="High Dependency">High Dependency</option>
            <option value="Dementia Support">Dementia Support</option>
            <option value="Residential Assisted">Residential Assisted</option>
            <option value="Nursing Care">Nursing Care</option>
          </select>
        </div>
      </div>

      {/* Residents Table */}
      <div className="rounded-md bg-white border border-ink/10 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="whitespace-nowrap w-full text-left text-xs text-ink">
            <thead className="bg-cream/40 border-b border-ink/10 text-ink/60 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-6">Resident Details</th>
                <th className="py-3.5 px-4">Room & Facility</th>
                <th className="py-3.5 px-4">Care Tier</th>
                <th className="py-3.5 px-4">Allergies & Cautions</th>
                <th className="py-3.5 px-4">Assigned Carer</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/5">
              {filteredResidents.map((res) => (
                <tr
                  key={res.id}
                  className="hover:bg-cream/20 transition-colors cursor-pointer"
                  onClick={() => setSelectedResident(res)}
                >
                  <td className="py-4 px-6">
                    <div className="font-bold text-sm text-ink">
                      {res.fullName}
                    </div>
                    <div className="text-[11px] text-ink/60 flex items-center gap-2 mt-0.5">
                      <span>Preferred: {res.preferredName}</span>
                      <span>•</span>
                      <span>Age: {res.age}</span>
                      <span>•</span>
                      <span className="font-mono text-teal-deep">
                        {res.referenceNumber}
                      </span>
                    </div>
                  </td>

                  <td className="py-4 px-4">
                    <span className="font-semibold text-ink block">
                      {res.roomNumber} ({res.bedId})
                    </span>
                    <span className="text-[11px] text-ink/60">
                      {res.careHome}
                    </span>
                  </td>

                  <td className="py-4 px-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                        res.careLevel === "High Dependency"
                          ? "bg-amber-100 text-amber-800"
                          : res.careLevel === "Dementia Support"
                            ? "bg-purple-100 text-purple-800"
                            : res.careLevel === "Nursing Care"
                              ? "bg-rose-100 text-rose-800"
                              : "bg-mint text-teal-deep"
                      }`}
                    >
                      {res.careLevel}
                    </span>
                  </td>

                  <td className="py-4 px-4">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {res.allergies.map((allergy) => (
                        <span
                          key={allergy}
                          className={`px-2 py-0.5 rounded-md text-[10px] font-semibold ${
                            allergy === "None known"
                              ? "bg-ink/5 text-ink/60"
                              : "bg-red-50 text-red-700 border border-red-200"
                          }`}
                        >
                          {allergy}
                        </span>
                      ))}
                    </div>
                  </td>

                  <td className="py-4 px-4">
                    <span className="font-medium text-ink block">
                      {res.keyWorker}
                    </span>
                    <span className="text-[10px] text-ink/50">
                      Primary Carer
                    </span>
                  </td>

                  <td className="py-4 px-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                      {res.status}
                    </span>
                  </td>

                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedResident(res);
                      }}
                      className="px-3 py-1.5 rounded-md bg-cream hover:bg-mint text-teal-deep text-xs font-semibold transition-all cursor-pointer"
                    >
                      View File
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Resident Detail Modal */}
      {selectedResident && (
        <div className="fixed inset-0 z-50 bg-ink/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-white rounded-md p-6 shadow-2xl border border-ink/10 space-y-6 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between border-b border-ink/10 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-ink/5 text-teal-deep font-bold">
                    {selectedResident.referenceNumber}
                  </span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-mint text-teal-deep font-semibold">
                    {selectedResident.careLevel}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-ink font-heading mt-1">
                  {selectedResident.fullName}
                </h2>
                <p className="text-xs text-ink/60">
                  Preferred name: &ldquo;{selectedResident.preferredName}&rdquo;
                  • DOB: {selectedResident.dateOfBirth} ({selectedResident.age}{" "}
                  y/o)
                </p>
              </div>
              <button
                onClick={() => setSelectedResident(null)}
                className="text-xs p-1 rounded-md text-ink/50 hover:text-ink cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-md bg-cream/40 border border-ink/5">
                <span className="text-ink/50 text-[10px] uppercase font-semibold block">
                  Location
                </span>
                <span className="font-bold text-ink">
                  {selectedResident.roomNumber} ({selectedResident.bedId})
                </span>
                <p className="text-[10px] text-ink/60 truncate">
                  {selectedResident.careHome}
                </p>
              </div>

              <div className="p-3 rounded-md bg-cream/40 border border-ink/5">
                <span className="text-ink/50 text-[10px] uppercase font-semibold block">
                  Key Worker
                </span>
                <span className="font-bold text-ink">
                  {selectedResident.keyWorker}
                </span>
                <p className="text-[10px] text-ink/60">Senior Carer</p>
              </div>

              <div className="p-3 rounded-md bg-cream/40 border border-ink/5">
                <span className="text-ink/50 text-[10px] uppercase font-semibold block">
                  Clinical Status
                </span>
                <span className="font-bold text-emerald-700">
                  {selectedResident.vitalStatus}
                </span>
                <p className="text-[10px] text-ink/60">Updated today</p>
              </div>
            </div>

            {/* Allergies & Dietary */}
            <div className="p-4 rounded-md bg-red-50/50 border border-red-100 space-y-2 text-xs">
              <div className="flex items-center gap-1.5 text-red-800 font-bold">
                <AlertCircle className="h-4 w-4" />
                Medical Precautions & Allergies
              </div>
              <p className="text-red-700">
                Known Allergies:{" "}
                <span className="font-semibold">
                  {selectedResident.allergies.join(", ")}
                </span>
              </p>
              <p className="text-red-700">
                Dietary Regime:{" "}
                <span className="font-semibold">
                  {selectedResident.dietary}
                </span>
              </p>
            </div>

            {/* Emergency Contact */}
            <div className="p-4 rounded-md bg-cream/50 border border-ink/5 space-y-2 text-xs">
              <span className="text-ink/60 uppercase font-bold text-[10px]">
                Primary Next-of-Kin
              </span>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-ink">
                    {selectedResident.emergencyContact.name}
                  </p>
                  <p className="text-ink/60 text-[11px]">
                    {selectedResident.emergencyContact.relationship}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={`tel:${selectedResident.emergencyContact.phone}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-teal-brand text-white font-semibold cursor-pointer hover:bg-teal-deep"
                  >
                    <Phone className="h-3.5 w-3.5" />
                    {selectedResident.emergencyContact.phone}
                  </a>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-ink/10">
              <button
                onClick={() => setSelectedResident(null)}
                className="px-4 py-2 rounded-md border border-ink/10 text-xs font-semibold text-ink/70 hover:bg-cream cursor-pointer"
              >
                Close Window
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedResident(null)}
                  className="px-4 py-2 rounded-md bg-teal-brand text-white text-xs font-semibold hover:bg-teal-deep cursor-pointer"
                >
                  Edit Care Plan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
