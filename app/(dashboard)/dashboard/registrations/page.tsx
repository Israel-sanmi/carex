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
  Home,
  Bed,
  AlertCircle,
  Eye,
  FileCheck,
  Sparkles,
  ArrowRight,
  Send,
  Mail,
  Phone,
  User,
  ArrowLeftRight,
  ShieldCheck,
} from "lucide-react";

type AdmissionType = "New Admission" | "Transfer";
type AdmissionStatus =
  | "Pending Admission"
  | "Placed"
  | "Rejected"
  | "Transfer Pending"
  | "Transfer Approved"
  | "Transfer Rejected";

interface AdmissionRequest {
  id: string;
  referenceNumber: string;
  residentName: string;
  email: string;
  phone: string;
  admissionType: AdmissionType;
  previousOrganisation?: string;
  previousCareHome?: string;
  destinationOrganisation: string;
  destinationCareHome: string;
  requestDate: string;
  status: AdmissionStatus;
  careLevel: string;
  medicalNotes: string;
  allocatedRoom?: string;
  allocatedBed?: string;
}

const mockAdmissions: AdmissionRequest[] = [
  {
    id: "adm-01",
    referenceNumber: "REG-2026-9401",
    residentName: "Dorothy Gable",
    email: "dorothy.gable@example.co.uk",
    phone: "+44 (0) 7700 900123",
    admissionType: "New Admission",
    destinationOrganisation: "Apex Care Group",
    destinationCareHome: "St. Jude's Residential Home",
    requestDate: "12 November 2026",
    status: "Pending Admission",
    careLevel: "Dementia Support",
    medicalNotes:
      "Moderate vascular dementia. Requires assistance with evening hydration.",
  },
  {
    id: "adm-02",
    referenceNumber: "TRF-2026-8812",
    residentName: "Robert 'Bob' Chen",
    email: "robert.chen@example.co.uk",
    phone: "+44 (0) 7700 900341",
    admissionType: "Transfer",
    previousOrganisation: "Beacon Light Care Trust",
    previousCareHome: "Beacon Crest Lodge",
    destinationOrganisation: "Apex Care Group",
    destinationCareHome: "Meadow View Lodge",
    requestDate: "10 November 2026",
    status: "Transfer Pending",
    careLevel: "Residential Assisted",
    medicalNotes:
      "Resident seeks relocation closer to daughter in Bath. Osteoarthritis in hips.",
  },
  {
    id: "adm-03",
    referenceNumber: "REG-2026-9214",
    residentName: "Beatrice Mary Campbell",
    email: "beatrice.campbell@example.co.uk",
    phone: "+44 (0) 7820 441098",
    admissionType: "New Admission",
    destinationOrganisation: "Apex Care Group",
    destinationCareHome: "St. Jude's Residential Home",
    requestDate: "08 November 2026",
    status: "Placed",
    careLevel: "High Dependency",
    medicalNotes: "Post-stroke mobility support. Requires 2-carer assist.",
    allocatedRoom: "Suite 104",
    allocatedBed: "Bed 1",
  },
  {
    id: "adm-04",
    referenceNumber: "TRF-2026-7730",
    residentName: "Evelyn Harper",
    email: "evelyn.harper@example.co.uk",
    phone: "+44 (0) 7944 651233",
    admissionType: "Transfer",
    previousOrganisation: "Kindred Care Living",
    previousCareHome: "Somerset Manor",
    destinationOrganisation: "Apex Care Group",
    destinationCareHome: "Oakridge Manor Care Centre",
    requestDate: "05 November 2026",
    status: "Transfer Approved",
    careLevel: "Nursing Care",
    medicalNotes:
      "Transfer completed. Resident successfully moved from previous organisation.",
    allocatedRoom: "Suite 201",
    allocatedBed: "Bed 2",
  },
  {
    id: "adm-05",
    referenceNumber: "REG-2026-8941",
    residentName: "Thomas Wright",
    email: "thomas.wright@example.co.uk",
    phone: "+44 (0) 7891 123456",
    admissionType: "New Admission",
    destinationOrganisation: "Apex Care Group",
    destinationCareHome: "Oakridge Manor Care Centre",
    requestDate: "02 November 2026",
    status: "Rejected",
    careLevel: "Nursing Care",
    medicalNotes:
      "Specialised ventilator care requirements exceeding current facility registration.",
  },
];

export default function RegistrationsPage() {
  const { currentRole } = useRole();
  const [admissions, setAdmissions] =
    useState<AdmissionRequest[]>(mockAdmissions);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<
    "ALL" | "New Admission" | "Transfer"
  >("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  // Review Modal state (Section 3)
  const [selectedAdmission, setSelectedAdmission] =
    useState<AdmissionRequest | null>(null);

  // Invite Resident Modal state (Section 2)
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteOrg, setInviteOrg] = useState("Apex Care Group");
  const [inviteHome, setInviteHome] = useState("St. Jude's Residential Home");
  const [inviteSuccess, setInviteSuccess] = useState(false);

  // Allocate Bed Modal state
  const [allocatingAdm, setAllocatingAdm] = useState<AdmissionRequest | null>(
    null,
  );
  const [allocRoom, setAllocRoom] = useState("Suite 106");
  const [allocBed, setAllocBed] = useState("Bed 1");

  const filteredItems = admissions.filter((item) => {
    const matchesSearch =
      item.residentName.toLowerCase().includes(search.toLowerCase()) ||
      item.referenceNumber.toLowerCase().includes(search.toLowerCase()) ||
      item.email.toLowerCase().includes(search.toLowerCase()) ||
      item.destinationCareHome.toLowerCase().includes(search.toLowerCase());
    const matchesType =
      typeFilter === "ALL" || item.admissionType === typeFilter;
    const matchesStatus =
      statusFilter === "ALL" || item.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleApprove = (id: string) => {
    const target = admissions.find((a) => a.id === id);
    if (!target) return;

    if (target.admissionType === "Transfer") {
      setAdmissions((prev) =>
        prev.map((a) =>
          a.id === id
            ? {
                ...a,
                status: "Transfer Approved",
                allocatedRoom: "Suite 108",
                allocatedBed: "Bed 1",
              }
            : a,
        ),
      );
      if (selectedAdmission?.id === id) {
        setSelectedAdmission((prev) =>
          prev ? { ...prev, status: "Transfer Approved" } : null,
        );
      }
    } else {
      // For New Admission, open Bed allocation modal
      setAllocatingAdm(target);
    }
  };

  const handleReject = (id: string) => {
    const target = admissions.find((a) => a.id === id);
    const nextStatus =
      target?.admissionType === "Transfer" ? "Transfer Rejected" : "Rejected";
    setAdmissions((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: nextStatus } : a)),
    );
    if (selectedAdmission?.id === id) {
      setSelectedAdmission((prev) =>
        prev ? { ...prev, status: nextStatus } : null,
      );
    }
  };

  const handleConfirmBedAllocation = () => {
    if (!allocatingAdm) return;
    setAdmissions((prev) =>
      prev.map((a) =>
        a.id === allocatingAdm.id
          ? {
              ...a,
              status: "Placed",
              allocatedRoom: allocRoom,
              allocatedBed: allocBed,
            }
          : a,
      ),
    );
    if (selectedAdmission?.id === allocatingAdm.id) {
      setSelectedAdmission((prev) =>
        prev
          ? {
              ...prev,
              status: "Placed",
              allocatedRoom: allocRoom,
              allocatedBed: allocBed,
            }
          : null,
      );
    }
    setAllocatingAdm(null);
  };

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) return;

    const newRequest: AdmissionRequest = {
      id: `adm-${Date.now()}`,
      referenceNumber: `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      residentName: "Invited Resident",
      email: inviteEmail,
      phone: "Awaiting registration",
      admissionType: "New Admission",
      destinationOrganisation: inviteOrg,
      destinationCareHome: inviteHome,
      requestDate: "12 November 2026",
      status: "Pending Admission",
      careLevel: "Evaluation Pending",
      medicalNotes: "Invitation dispatched by Organisation Administrator.",
    };

    setAdmissions([newRequest, ...admissions]);
    setInviteSuccess(true);
    setTimeout(() => {
      setInviteSuccess(false);
      setShowInviteModal(false);
      setInviteEmail("");
    }, 1500);
  };

  const pendingCount = admissions.filter(
    (a) => a.status === "Pending Admission" || a.status === "Transfer Pending",
  ).length;

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-ink dark:text-white font-heading">
              Admissions & Intake Review
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 font-semibold">
              {pendingCount} Awaiting Decision
            </span>
          </div>
          <p className="text-sm text-ink/70 dark:text-slate-300 mt-1">
            Section 3: Review incoming self-registrations and transfer requests.
            Approving officially admits the resident and allocates a care home
            bed.
          </p>
        </div>

        {/* Section 2 "Invite Resident" button */}
        <button
          onClick={() => setShowInviteModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white text-sm font-semibold transition-all shadow-sm cursor-pointer"
        >
          <UserPlus className="h-4 w-4" />
          Invite Resident (Section 2)
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-md glass dark:bg-slate-900/80 border border-ink/10 dark:border-white/10 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-ink/40 dark:text-slate-500" />
          <input
            type="text"
            placeholder="Search by name, ref #, email or care home..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm rounded-md border border-ink/10 dark:border-white/10 bg-cream/30 dark:bg-slate-800 text-ink dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Admission Type Filter */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-ink/60 dark:text-slate-400 font-medium">
              Type:
            </span>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as any)}
              className="rounded-md border border-ink/10 dark:border-white/10 px-3 py-2 bg-cream/30 dark:bg-slate-800 text-ink dark:text-white font-medium text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="ALL">All Types</option>
              <option value="New Admission">New Admission</option>
              <option value="Transfer">Care Transfer</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-ink/60 dark:text-slate-400 font-medium">
              Status:
            </span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-md border border-ink/10 dark:border-white/10 px-3 py-2 bg-cream/30 dark:bg-slate-800 text-ink dark:text-white font-medium text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="Pending Admission">Pending Admission</option>
              <option value="Placed">Placed / Admitted</option>
              <option value="Rejected">Rejected</option>
              <option value="Transfer Pending">Transfer Pending</option>
              <option value="Transfer Approved">Transfer Approved</option>
              <option value="Transfer Rejected">Transfer Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Section 3 Admissions Table displaying all specified fields */}
      <div className="rounded-md glass dark:bg-slate-900/80 border border-ink/10 dark:border-white/10 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-ink dark:text-slate-200">
            <thead className="bg-cream/40 dark:bg-slate-800/60 border-b border-ink/10 dark:border-white/10 text-ink/60 dark:text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-6">Resident Details</th>
                <th className="py-3.5 px-4">Admission Type</th>
                <th className="py-3.5 px-4">Previous Organisation / Home</th>
                <th className="py-3.5 px-4">Destination Facility</th>
                <th className="py-3.5 px-4">Request Date</th>
                <th className="py-3.5 px-4">Current Status (Section 4)</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/5 dark:divide-white/5">
              {filteredItems.map((adm) => (
                <tr
                  key={adm.id}
                  className="hover:bg-cream/20 dark:hover:bg-slate-800/40 transition-colors cursor-pointer"
                  onClick={() => setSelectedAdmission(adm)}
                >
                  <td className="py-4 px-6">
                    <div className="font-bold text-sm text-ink dark:text-white">
                      {adm.residentName}
                    </div>
                    <div className="text-[11px] text-ink/60 dark:text-slate-400 flex items-center gap-2 mt-0.5">
                      <span>{adm.email}</span>
                      <span>•</span>
                      <span>{adm.phone}</span>
                    </div>
                    <span className="font-mono text-[10px] text-teal-deep dark:text-emerald-400 block mt-0.5">
                      {adm.referenceNumber}
                    </span>
                  </td>

                  <td className="py-4 px-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                        adm.admissionType === "Transfer"
                          ? "bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-500/20"
                          : "bg-mint dark:bg-emerald-950/60 text-teal-deep dark:text-emerald-300 border border-teal-brand/20 dark:border-emerald-500/20"
                      }`}
                    >
                      {adm.admissionType === "Transfer" ? (
                        <ArrowLeftRight className="w-3 h-3" />
                      ) : (
                        <UserPlus className="w-3 h-3" />
                      )}
                      {adm.admissionType}
                    </span>
                  </td>

                  <td className="py-4 px-4">
                    {adm.previousOrganisation ? (
                      <div>
                        <span className="font-semibold text-ink dark:text-white block">
                          {adm.previousOrganisation}
                        </span>
                        <span className="text-[11px] text-ink/60 dark:text-slate-400">
                          {adm.previousCareHome}
                        </span>
                      </div>
                    ) : (
                      <span className="text-ink/40 dark:text-slate-500 italic">
                        N/A (New Intake)
                      </span>
                    )}
                  </td>

                  <td className="py-4 px-4">
                    <span className="font-semibold text-ink dark:text-white block">
                      {adm.destinationCareHome}
                    </span>
                    <span className="text-[11px] text-ink/60 dark:text-slate-400">
                      {adm.destinationOrganisation}
                    </span>
                  </td>

                  <td className="py-4 px-4 text-ink/70 dark:text-slate-300">
                    {adm.requestDate}
                  </td>

                  <td className="py-4 px-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        adm.status === "Placed" ||
                        adm.status === "Transfer Approved"
                          ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/30"
                          : adm.status === "Rejected" ||
                              adm.status === "Transfer Rejected"
                            ? "bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-500/30"
                            : "bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 border border-purple-300 dark:border-purple-500/30"
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      {adm.status}
                    </span>
                    {adm.allocatedRoom && (
                      <span className="block text-[10px] text-teal-deep dark:text-emerald-400 font-semibold mt-0.5">
                        {adm.allocatedRoom} ({adm.allocatedBed})
                      </span>
                    )}
                  </td>

                  <td className="py-4 px-6 text-right">
                    <div
                      className="flex items-center justify-end gap-1.5"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {(adm.status === "Pending Admission" ||
                        adm.status === "Transfer Pending") && (
                        <>
                          <button
                            onClick={() => handleApprove(adm.id)}
                            className="px-3 py-1.5 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(adm.id)}
                            className="px-3 py-1.5 rounded-md bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-500/30 text-xs font-semibold transition-all cursor-pointer"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => setSelectedAdmission(adm)}
                        className="px-2.5 py-1.5 rounded-md border border-ink/10 dark:border-white/10 hover:bg-cream dark:hover:bg-slate-800 text-ink dark:text-slate-300 text-xs font-semibold cursor-pointer"
                      >
                        Details
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Section 3 Admission Review Screen Modal */}
      {selectedAdmission && (
        <div className="fixed inset-0 z-50 bg-ink/40 dark:bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-xl glass dark:bg-slate-900 rounded-md p-6 sm:p-8 shadow-2xl border border-white/80 dark:border-white/10 space-y-6 animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between border-b border-ink/10 dark:border-white/10 pb-4">
              <div>
                <span className="font-mono text-xs font-bold text-teal-deep dark:text-emerald-400">
                  {selectedAdmission.referenceNumber}
                </span>
                <h3 className="text-xl font-bold text-ink dark:text-white font-heading mt-1">
                  Admission Review: {selectedAdmission.residentName}
                </h3>
                <p className="text-xs text-ink/60 dark:text-slate-400">
                  Request Date: {selectedAdmission.requestDate} • Type:{" "}
                  <span className="font-semibold text-ink dark:text-white">
                    {selectedAdmission.admissionType}
                  </span>
                </p>
              </div>
              <button
                onClick={() => setSelectedAdmission(null)}
                className="text-xs p-1 text-ink/50 hover:text-ink dark:hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Illustrative Layout matching Section 3 */}
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-md bg-cream/40 dark:bg-slate-800/60 border border-ink/5 dark:border-white/5">
                  <span className="text-[10px] uppercase font-bold text-ink/50 dark:text-slate-400 block">
                    Resident Contact
                  </span>
                  <p className="font-bold text-ink dark:text-white text-sm mt-0.5">
                    {selectedAdmission.residentName}
                  </p>
                  <p className="text-ink/70 dark:text-slate-300">
                    {selectedAdmission.email}
                  </p>
                  <p className="text-ink/70 dark:text-slate-300">
                    {selectedAdmission.phone}
                  </p>
                </div>

                <div className="p-3.5 rounded-md bg-cream/40 dark:bg-slate-800/60 border border-ink/5 dark:border-white/5">
                  <span className="text-[10px] uppercase font-bold text-ink/50 dark:text-slate-400 block">
                    Current Status
                  </span>
                  <span className="inline-block mt-1 font-bold text-emerald-700 dark:text-emerald-400">
                    {selectedAdmission.status}
                  </span>
                  {selectedAdmission.allocatedRoom && (
                    <p className="text-[11px] text-teal-deep dark:text-emerald-300 mt-1">
                      Allocated: {selectedAdmission.allocatedRoom} (
                      {selectedAdmission.allocatedBed})
                    </p>
                  )}
                </div>
              </div>

              {/* Destination vs Previous */}
              <div className="p-4 rounded-md bg-cream/30 dark:bg-slate-800/40 border border-ink/5 dark:border-white/5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-ink dark:text-white">
                    Requested Destination:
                  </span>
                  <span className="font-semibold text-teal-deep dark:text-emerald-400">
                    {selectedAdmission.destinationOrganisation} —{" "}
                    {selectedAdmission.destinationCareHome}
                  </span>
                </div>
                {selectedAdmission.previousOrganisation && (
                  <div className="flex items-center justify-between pt-1 border-t border-ink/5 dark:border-white/5">
                    <span className="font-bold text-amber-800 dark:text-amber-400">
                      Previous Organisation (Transfer):
                    </span>
                    <span className="text-ink/80 dark:text-slate-300">
                      {selectedAdmission.previousOrganisation} —{" "}
                      {selectedAdmission.previousCareHome}
                    </span>
                  </div>
                )}
              </div>

              {/* Clinical Dossier */}
              <div className="space-y-1.5">
                <span className="font-bold text-ink dark:text-white">
                  Clinical & Medical Summary:
                </span>
                <p className="p-3.5 rounded-md bg-white dark:bg-slate-800 border border-ink/10 dark:border-white/10 text-ink/80 dark:text-slate-300 leading-relaxed">
                  {selectedAdmission.medicalNotes}
                </p>
              </div>

              {/* Section 3 Consequence Note */}
              <div className="p-3.5 rounded-md bg-mint/30 dark:bg-emerald-950/40 border border-teal-brand/20 dark:border-emerald-500/20 text-[11px] text-teal-deep dark:text-emerald-300 leading-relaxed">
                <span className="font-bold">Administrative Consequence: </span>
                {selectedAdmission.admissionType === "Transfer"
                  ? "Approving this transfer officially migrates the resident's care record to your care home. If rejected, the resident remains officially placed with their previous care organisation."
                  : "Approving confirms the resident as an official member of your care home, allocates room/bed, and grants full access to services."}
              </div>
            </div>

            {/* Actions Bar (Section 3 Approve / Reject) */}
            <div className="flex items-center justify-between pt-4 border-t border-ink/10 dark:border-white/10">
              <button
                onClick={() => setSelectedAdmission(null)}
                className="px-4 py-2 rounded-md border border-ink/10 dark:border-white/10 text-xs font-semibold text-ink/70 dark:text-slate-400 hover:bg-cream dark:hover:bg-slate-800 cursor-pointer"
              >
                Close
              </button>

              {(selectedAdmission.status === "Pending Admission" ||
                selectedAdmission.status === "Transfer Pending") && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleReject(selectedAdmission.id)}
                    className="px-4 py-2 rounded-md bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-500/30 text-xs font-semibold cursor-pointer"
                  >
                    Reject Admission
                  </button>
                  <button
                    onClick={() => handleApprove(selectedAdmission.id)}
                    className="px-5 py-2 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-md cursor-pointer"
                  >
                    Approve & Admit Resident
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Bed Allocation Modal for Approved New Admissions */}
      {allocatingAdm && (
        <div className="fixed inset-0 z-50 bg-ink/40 dark:bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg glass dark:bg-slate-900 rounded-md p-6 sm:p-8 shadow-2xl border border-white/80 dark:border-white/10 space-y-5 animate-in fade-in zoom-in-95">
            <div className="border-b border-ink/10 dark:border-white/10 pb-4">
              <span className="text-xs font-mono font-bold text-teal-deep dark:text-emerald-400">
                {allocatingAdm.referenceNumber}
              </span>
              <h3 className="text-lg font-bold text-ink dark:text-white font-heading mt-1">
                Allocate Bed Slot for {allocatingAdm.residentName}
              </h3>
              <p className="text-xs text-ink/60 dark:text-slate-400">
                Facility: {allocatingAdm.destinationCareHome}
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-ink dark:text-slate-200 block mb-1">
                    Room / Suite
                  </label>
                  <select
                    value={allocRoom}
                    onChange={(e) => setAllocRoom(e.target.value)}
                    className="w-full px-3 py-2 rounded-md border border-ink/10 dark:border-white/10 bg-cream/30 dark:bg-slate-800 text-ink dark:text-white font-medium"
                  >
                    <option value="Suite 104">
                      Suite 104 (Ground floor, garden view)
                    </option>
                    <option value="Suite 106">
                      Suite 106 (En-suite wet room)
                    </option>
                    <option value="Suite 203">
                      Suite 203 (First floor lift access)
                    </option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-ink dark:text-slate-200 block mb-1">
                    Bed Assignment
                  </label>
                  <select
                    value={allocBed}
                    onChange={(e) => setAllocBed(e.target.value)}
                    className="w-full px-3 py-2 rounded-md border border-ink/10 dark:border-white/10 bg-cream/30 dark:bg-slate-800 text-ink dark:text-white font-medium"
                  >
                    <option value="Bed 1">Bed 1 (Window side)</option>
                    <option value="Bed 2">Bed 2 (Door side)</option>
                  </select>
                </div>
              </div>

              <div className="p-3.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-xs">
                Confirming placement changes status to{" "}
                <span className="font-bold">Placed</span> and issues full
                resident services access.
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-ink/10 dark:border-white/10">
              <button
                onClick={() => setAllocatingAdm(null)}
                className="px-4 py-2 rounded-md border border-ink/10 dark:border-white/10 text-xs font-semibold text-ink/70 dark:text-slate-400 hover:bg-cream dark:hover:bg-slate-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmBedAllocation}
                className="px-5 py-2 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-md cursor-pointer"
              >
                Confirm Admission & Bed
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Section 2 "Invite Resident" Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 bg-ink/40 dark:bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg glass dark:bg-slate-900 rounded-md p-6 sm:p-8 shadow-2xl border border-white/80 dark:border-white/10 space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-ink/10 dark:border-white/10 pb-4">
              <div>
                <h3 className="text-lg font-bold text-ink dark:text-white font-heading">
                  Invite Resident (Section 2)
                </h3>
                <p className="text-xs text-ink/60 dark:text-slate-400">
                  Send a direct onboarding invitation to a prospective or
                  transferring resident.
                </p>
              </div>
              <button
                onClick={() => setShowInviteModal(false)}
                className="text-xs p-1 text-ink/50 hover:text-ink dark:hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            {inviteSuccess ? (
              <div className="p-6 text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 dark:text-emerald-400 mx-auto" />
                <h4 className="font-bold text-base text-ink dark:text-white">
                  Invitation Dispatched!
                </h4>
                <p className="text-xs text-ink/70 dark:text-slate-300">
                  An onboarding email with secure token has been sent to{" "}
                  {inviteEmail}.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSendInvite} className="space-y-4 text-xs">
                <div className="space-y-1.5">
                  <label className="font-semibold text-ink dark:text-slate-200">
                    Resident Email Address{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="resident@example.co.uk"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-md border border-ink/10 dark:border-white/10 bg-cream/30 dark:bg-slate-800 text-ink dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-ink dark:text-slate-200">
                    Destination Care Organisation
                  </label>
                  <select
                    value={inviteOrg}
                    onChange={(e) => setInviteOrg(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-md border border-ink/10 dark:border-white/10 bg-cream/30 dark:bg-slate-800 text-ink dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Apex Care Group">Apex Care Group</option>
                    <option value="Kindred Care Living">
                      Kindred Care Living
                    </option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-ink dark:text-slate-200">
                    Target Care Home
                  </label>
                  <select
                    value={inviteHome}
                    onChange={(e) => setInviteHome(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-md border border-ink/10 dark:border-white/10 bg-cream/30 dark:bg-slate-800 text-ink dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
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

                <div className="p-3.5 rounded-md bg-mint/30 dark:bg-emerald-950/40 border border-teal-brand/20 dark:border-emerald-500/20 text-[11px] text-teal-deep dark:text-emerald-300 leading-relaxed">
                  The recipient will receive an onboarding link. If they are
                  new, they set their password; if they are transferring from
                  another facility, they authenticate with their existing
                  credentials.
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-ink/10 dark:border-white/10">
                  <button
                    type="button"
                    onClick={() => setShowInviteModal(false)}
                    className="px-4 py-2 rounded-md border border-ink/10 dark:border-white/10 text-xs font-semibold text-ink/70 dark:text-slate-400 hover:bg-cream dark:hover:bg-slate-800 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-md cursor-pointer flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Dispatch Resident Invitation
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
