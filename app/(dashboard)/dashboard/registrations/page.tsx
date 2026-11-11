"use client";

import { useState } from "react";
import { useRole } from "@/lib/role-context";
import {
  UserPlus,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  Building2,
  Bed,
  AlertCircle,
  Eye,
  FileCheck,
  Sparkles,
  ArrowRight,
} from "lucide-react";

type AdmissionStatus =
  | "PENDING_REVIEW"
  | "UNDER_EVALUATION"
  | "APPROVED"
  | "ALLOCATED"
  | "REJECTED";

interface RegistrationItem {
  id: string;
  referenceNumber: string;
  applicantName: string;
  applicantDob: string;
  submissionDate: string;
  requestedCareLevel: string;
  targetCareHome: string;
  nokName: string;
  nokPhone: string;
  nokRelationship: string;
  medicalConditions: string;
  mobilityNeeds: string;
  status: AdmissionStatus;
  allocatedRoom?: string;
  allocatedBed?: string;
  allocatedCareHome?: string;
}

const initialRegistrations: RegistrationItem[] = [
  {
    id: "reg-101",
    referenceNumber: "REG-2026-9401",
    applicantName: "Dorothy Gable",
    applicantDob: "1939-05-14",
    submissionDate: "2026-03-28",
    requestedCareLevel: "Dementia Support",
    targetCareHome: "St. Jude's Residential Home",
    nokName: "Michael Gable",
    nokPhone: "+44 (0) 7700 900123",
    nokRelationship: "Son",
    medicalConditions:
      "Moderate vascular dementia, mild hypertension. Requires assistance with evening routine.",
    mobilityNeeds: "Uses walker frame, single-step assistance.",
    status: "PENDING_REVIEW",
  },
  {
    id: "reg-102",
    referenceNumber: "REG-2026-9388",
    applicantName: "George Kenneth Alistair",
    applicantDob: "1941-10-02",
    submissionDate: "2026-03-27",
    requestedCareLevel: "Residential Assisted",
    targetCareHome: "Meadow View Lodge",
    nokName: "Susan Alistair-Brown",
    nokPhone: "+44 (0) 7911 884210",
    nokRelationship: "Daughter",
    medicalConditions:
      "Osteoarthritis in hips, fully alert. Seeks social community & regular meals.",
    mobilityNeeds: "Independent walking stick, ground floor preferred.",
    status: "UNDER_EVALUATION",
  },
  {
    id: "reg-103",
    referenceNumber: "REG-2026-9214",
    applicantName: "Beatrice Mary Campbell",
    applicantDob: "1937-01-20",
    submissionDate: "2026-03-25",
    requestedCareLevel: "High Dependency",
    targetCareHome: "St. Jude's Residential Home",
    nokName: "Patrick Campbell",
    nokPhone: "+44 (0) 7820 441098",
    nokRelationship: "Son",
    medicalConditions:
      "Post-stroke recovery, right side weakness, diabetes management.",
    mobilityNeeds: "Wheelchair transfer required, 2-person assist.",
    status: "APPROVED",
  },
  {
    id: "reg-104",
    referenceNumber: "REG-2026-9102",
    applicantName: "Albert Edward Simmons",
    applicantDob: "1944-08-11",
    submissionDate: "2026-03-21",
    requestedCareLevel: "Residential Assisted",
    targetCareHome: "St. Jude's Residential Home",
    nokName: "Fiona Simmons",
    nokPhone: "+44 (0) 7744 551029",
    nokRelationship: "Spouse",
    medicalConditions: "Mild frailty, self-administers eye drops.",
    mobilityNeeds: "Independent mobility.",
    status: "ALLOCATED",
    allocatedCareHome: "St. Jude's Residential Home",
    allocatedRoom: "Suite 106",
    allocatedBed: "Bed 1",
  },
  {
    id: "reg-105",
    referenceNumber: "REG-2026-8941",
    applicantName: "Thomas Wright",
    applicantDob: "1950-12-05",
    submissionDate: "2026-03-19",
    requestedCareLevel: "Nursing Care",
    targetCareHome: "Oakridge Manor Care Centre",
    nokName: "Claire Wright",
    nokPhone: "+44 (0) 7891 123456",
    nokRelationship: "Daughter",
    medicalConditions:
      "Specialised acute ventilator care requirements exceeding facility clinical registration.",
    mobilityNeeds: "Total bedbound care.",
    status: "REJECTED",
  },
];

export default function RegistrationsPage() {
  const { currentRole } = useRole();
  const [registrations, setRegistrations] =
    useState<RegistrationItem[]>(initialRegistrations);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<AdmissionStatus | "ALL">("ALL");
  const [selectedReg, setSelectedReg] = useState<RegistrationItem | null>(null);

  // Allocate Bed Modal state
  const [allocatingReg, setAllocatingReg] = useState<RegistrationItem | null>(
    null,
  );
  const [allocCareHome, setAllocCareHome] = useState(
    "St. Jude's Residential Home",
  );
  const [allocRoom, setAllocRoom] = useState("Suite 203");
  const [allocBed, setAllocBed] = useState("Bed 1");

  const filteredItems = registrations.filter((item) => {
    const matchesSearch =
      item.applicantName.toLowerCase().includes(search.toLowerCase()) ||
      item.referenceNumber.toLowerCase().includes(search.toLowerCase()) ||
      item.nokName.toLowerCase().includes(search.toLowerCase());
    const matchesTab = activeTab === "ALL" || item.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const updateStatus = (id: string, newStatus: AdmissionStatus) => {
    setRegistrations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r)),
    );
    if (selectedReg?.id === id) {
      setSelectedReg((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  const handleConfirmAllocation = () => {
    if (!allocatingReg) return;
    setRegistrations((prev) =>
      prev.map((r) =>
        r.id === allocatingReg.id
          ? {
              ...r,
              status: "ALLOCATED",
              allocatedCareHome: allocCareHome,
              allocatedRoom: allocRoom,
              allocatedBed: allocBed,
            }
          : r,
      ),
    );
    setAllocatingReg(null);
  };

  const countByStatus = {
    ALL: registrations.length,
    PENDING_REVIEW: registrations.filter((r) => r.status === "PENDING_REVIEW")
      .length,
    UNDER_EVALUATION: registrations.filter(
      (r) => r.status === "UNDER_EVALUATION",
    ).length,
    APPROVED: registrations.filter((r) => r.status === "APPROVED").length,
    ALLOCATED: registrations.filter((r) => r.status === "ALLOCATED").length,
    REJECTED: registrations.filter((r) => r.status === "REJECTED").length,
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-ink font-heading">
              Admissions & Intake Pipeline
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-coral/20 text-coral font-semibold">
              {countByStatus.PENDING_REVIEW} Action Required
            </span>
          </div>
          <p className="text-sm text-ink/70 mt-1">
            Section 4.5 Admission Pipeline: Track applications from digital
            submission through clinical review to bed allocation.
          </p>
        </div>
      </div>

      {/* Tabs / Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-ink/10">
        <button
          onClick={() => setActiveTab("ALL")}
          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap cursor-pointer transition-all ${
            activeTab === "ALL"
              ? "bg-teal-brand text-white shadow-xs"
              : "bg-white text-ink/70 hover:bg-cream border border-ink/10"
          }`}
        >
          All Applications ({countByStatus.ALL})
        </button>
        <button
          onClick={() => setActiveTab("PENDING_REVIEW")}
          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap cursor-pointer transition-all ${
            activeTab === "PENDING_REVIEW"
              ? "bg-amber-500 text-white shadow-xs"
              : "bg-white text-ink/70 hover:bg-cream border border-ink/10"
          }`}
        >
          Pending Review ({countByStatus.PENDING_REVIEW})
        </button>
        <button
          onClick={() => setActiveTab("UNDER_EVALUATION")}
          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap cursor-pointer transition-all ${
            activeTab === "UNDER_EVALUATION"
              ? "bg-blue-600 text-white shadow-xs"
              : "bg-white text-ink/70 hover:bg-cream border border-ink/10"
          }`}
        >
          Under Evaluation ({countByStatus.UNDER_EVALUATION})
        </button>
        <button
          onClick={() => setActiveTab("APPROVED")}
          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap cursor-pointer transition-all ${
            activeTab === "APPROVED"
              ? "bg-emerald-600 text-white shadow-xs"
              : "bg-white text-ink/70 hover:bg-cream border border-ink/10"
          }`}
        >
          Approved / Ready for Bed ({countByStatus.APPROVED})
        </button>
        <button
          onClick={() => setActiveTab("ALLOCATED")}
          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap cursor-pointer transition-all ${
            activeTab === "ALLOCATED"
              ? "bg-teal-deep text-white shadow-xs"
              : "bg-white text-ink/70 hover:bg-cream border border-ink/10"
          }`}
        >
          Allocated & Placed ({countByStatus.ALLOCATED})
        </button>
      </div>

      {/* Search Input */}
      <div className="p-4 rounded-md bg-white border border-ink/10 shadow-xs flex items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-ink/40" />
          <input
            type="text"
            placeholder="Search by reference code or applicant name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-ink/10 bg-cream/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-brand/20 transition-all"
          />
        </div>
      </div>

      {/* Registrations List */}
      <div className="space-y-4">
        {filteredItems.map((reg) => (
          <div
            key={reg.id}
            className="p-5 rounded-md bg-white border border-ink/10 shadow-xs hover:border-teal-brand/40 transition-all space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-md bg-cream text-teal-deep border border-ink/5">
                    {reg.referenceNumber}
                  </span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-mint text-teal-deep">
                    {reg.requestedCareLevel}
                  </span>
                  <span className="text-xs text-ink/50">
                    Submitted {reg.submissionDate}
                  </span>
                </div>
                <h3 className="text-base font-bold text-ink mt-1 font-heading">
                  {reg.applicantName}
                </h3>
                <p className="text-xs text-ink/60">
                  Target Facility:{" "}
                  <span className="font-semibold text-ink">
                    {reg.targetCareHome}
                  </span>{" "}
                  • Next-of-Kin: {reg.nokName} ({reg.nokRelationship},{" "}
                  {reg.nokPhone})
                </p>
              </div>

              {/* Status Badge */}
              <div className="flex items-center gap-3">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    reg.status === "PENDING_REVIEW"
                      ? "bg-amber-100 text-amber-800"
                      : reg.status === "UNDER_EVALUATION"
                        ? "bg-blue-100 text-blue-800"
                        : reg.status === "APPROVED"
                          ? "bg-emerald-100 text-emerald-800"
                          : reg.status === "ALLOCATED"
                            ? "bg-teal-brand text-white"
                            : "bg-red-100 text-red-800"
                  }`}
                >
                  {reg.status.replace("_", " ")}
                </span>
              </div>
            </div>

            {/* Medical / Care Summary Preview */}
            <div className="p-3.5 rounded-xl bg-cream/40 border border-ink/5 text-xs text-ink/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <p>
                  <span className="font-semibold text-ink">
                    Clinical Profile:
                  </span>{" "}
                  {reg.medicalConditions}
                </p>
                <p>
                  <span className="font-semibold text-ink">
                    Mobility & Transfer:
                  </span>{" "}
                  {reg.mobilityNeeds}
                </p>
                {reg.allocatedRoom && (
                  <p className="text-teal-deep font-bold flex items-center gap-1.5 pt-1">
                    <Bed className="h-3.5 w-3.5" />
                    Allocated: {reg.allocatedCareHome} • {reg.allocatedRoom} (
                    {reg.allocatedBed})
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 self-end sm:self-center">
                <button
                  onClick={() => setSelectedReg(reg)}
                  className="px-3 py-1.5 rounded-xl border border-ink/10 bg-white hover:bg-cream text-xs font-semibold text-ink flex items-center gap-1.5 cursor-pointer"
                >
                  <Eye className="h-3.5 w-3.5 text-teal-brand" />
                  View Dossier
                </button>

                {reg.status === "PENDING_REVIEW" && (
                  <button
                    onClick={() => updateStatus(reg.id, "UNDER_EVALUATION")}
                    className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-all cursor-pointer"
                  >
                    Start Evaluation
                  </button>
                )}

                {reg.status === "UNDER_EVALUATION" && (
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => updateStatus(reg.id, "APPROVED")}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-all cursor-pointer"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => updateStatus(reg.id, "REJECTED")}
                      className="px-3 py-1.5 rounded-xl bg-red-100 hover:bg-red-200 text-red-800 text-xs font-semibold transition-all cursor-pointer"
                    >
                      Reject
                    </button>
                  </div>
                )}

                {reg.status === "APPROVED" && (
                  <button
                    onClick={() => {
                      setAllocatingReg(reg);
                      setAllocCareHome(reg.targetCareHome);
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-teal-brand hover:bg-teal-deep text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                  >
                    <Bed className="h-3.5 w-3.5" />
                    Allocate Bed & Room
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Allocate Bed Modal */}
      {allocatingReg && (
        <div className="fixed inset-0 z-50 bg-ink/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border border-ink/10 space-y-5 animate-in fade-in zoom-in-95">
            <div className="border-b border-ink/10 pb-4">
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-cream text-teal-deep font-bold">
                {allocatingReg.referenceNumber}
              </span>
              <h3 className="text-lg font-bold text-ink font-heading mt-1">
                Allocate Placement for {allocatingReg.applicantName}
              </h3>
              <p className="text-xs text-ink/60">
                Final step of the admission pipeline: Assign physical room and
                bed slot.
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-ink block mb-1">
                  Target Care Home
                </label>
                <select
                  value={allocCareHome}
                  onChange={(e) => setAllocCareHome(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-ink/10 bg-cream/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-brand/20 font-medium"
                >
                  <option value="St. Jude's Residential Home">
                    St. Jude&apos;s Residential Home (Bristol)
                  </option>
                  <option value="Meadow View Lodge">
                    Meadow View Lodge (Bath)
                  </option>
                  <option value="Oakridge Manor Care Centre">
                    Oakridge Manor Care Centre (Gloucester)
                  </option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-ink block mb-1">
                    Room / Suite
                  </label>
                  <select
                    value={allocRoom}
                    onChange={(e) => setAllocRoom(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-ink/10 bg-cream/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-brand/20 font-medium"
                  >
                    <option value="Suite 104">
                      Suite 104 (Ground floor, wetroom)
                    </option>
                    <option value="Suite 106">Suite 106 (Garden view)</option>
                    <option value="Suite 203">
                      Suite 203 (First floor, lift access)
                    </option>
                    <option value="Suite 205">Suite 205 (Sunny aspect)</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-ink block mb-1">
                    Bed Slot
                  </label>
                  <select
                    value={allocBed}
                    onChange={(e) => setAllocBed(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-ink/10 bg-cream/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-brand/20 font-medium"
                  >
                    <option value="Bed 1">Bed 1 (Window)</option>
                    <option value="Bed 2">Bed 2 (Door side)</option>
                  </select>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-mint/30 border border-teal-brand/20 text-teal-deep text-xs">
                <p className="font-semibold">Automatic Next Steps:</p>
                <p className="text-[11px] mt-0.5">
                  Confirming this placement will generate the permanent resident
                  master record, notify the key worker, and update facility
                  occupancy.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-ink/10">
              <button
                onClick={() => setAllocatingReg(null)}
                className="px-4 py-2 rounded-xl border border-ink/10 text-xs font-semibold text-ink/70 hover:bg-cream cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAllocation}
                className="px-4 py-2 rounded-xl bg-teal-brand text-white text-xs font-semibold hover:bg-teal-deep transition-all cursor-pointer"
              >
                Confirm Bed Allocation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dossier Modal */}
      {selectedReg && (
        <div className="fixed inset-0 z-50 bg-ink/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-white rounded-3xl p-6 shadow-2xl border border-ink/10 space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between border-b border-ink/10 pb-4">
              <div>
                <span className="font-mono text-xs font-bold text-teal-deep">
                  {selectedReg.referenceNumber}
                </span>
                <h3 className="text-xl font-bold text-ink font-heading mt-1">
                  Admission Dossier: {selectedReg.applicantName}
                </h3>
                <p className="text-xs text-ink/60">
                  Target Care Home: {selectedReg.targetCareHome}
                </p>
              </div>
              <button
                onClick={() => setSelectedReg(null)}
                className="text-xs p-1 text-ink/50 hover:text-ink cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-md bg-cream/40 border border-ink/5 space-y-2">
                <span className="text-[10px] uppercase font-bold text-ink/50">
                  Next-of-Kin Contact
                </span>
                <p className="font-bold text-ink">
                  {selectedReg.nokName} ({selectedReg.nokRelationship})
                </p>
                <p className="text-teal-brand font-medium">
                  {selectedReg.nokPhone}
                </p>
              </div>

              <div className="space-y-1">
                <span className="font-bold text-ink">
                  Clinical Profile & History:
                </span>
                <p className="p-3 rounded-xl bg-white border border-ink/10 text-ink/80 leading-relaxed">
                  {selectedReg.medicalConditions}
                </p>
              </div>

              <div className="space-y-1">
                <span className="font-bold text-ink">Mobility Assessment:</span>
                <p className="p-3 rounded-xl bg-white border border-ink/10 text-ink/80 leading-relaxed">
                  {selectedReg.mobilityNeeds}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-4 border-t border-ink/10">
              <button
                onClick={() => setSelectedReg(null)}
                className="px-4 py-2 rounded-xl bg-cream hover:bg-mint text-teal-deep text-xs font-semibold cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
