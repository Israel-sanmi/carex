"use client";

import { useState } from "react";
import { useRole, RoleType } from "@/lib/role-context";
import {
  Mail,
  Send,
  Copy,
  Check,
  Clock,
  RefreshCw,
  Trash2,
  UserPlus,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

interface Invitation {
  id: string;
  email: string;
  role: RoleType;
  careHome: string;
  invitedBy: string;
  sentDate: string;
  expiresInDays: number;
  status: "Pending" | "Accepted" | "Expired";
  token: string;
}

const initialInvitations: Invitation[] = [
  {
    id: "inv-1",
    email: "daniel.craigie@apexcare.co.uk",
    role: "CAREGIVER",
    careHome: "St. Jude's Residential Home",
    invitedBy: "Eleanor Vance",
    sentDate: "2026-03-27",
    expiresInDays: 5,
    status: "Pending",
    token: "tok_inv_98f12a801ba",
  },
  {
    id: "inv-2",
    email: "nathan.brooks@apexcare.co.uk",
    role: "CARE_HOME_MANAGER",
    careHome: "Oakridge Manor Care Centre",
    invitedBy: "Victoria Sterling",
    sentDate: "2026-03-25",
    expiresInDays: 3,
    status: "Pending",
    token: "tok_inv_44c891ee20a",
  },
  {
    id: "inv-3",
    email: "fiona.clark@apexcare.co.uk",
    role: "CAREGIVER",
    careHome: "Meadow View Lodge",
    invitedBy: "Marcus Thorne",
    sentDate: "2026-03-15",
    expiresInDays: 0,
    status: "Expired",
    token: "tok_inv_11b723ea99d",
  },
  {
    id: "inv-4",
    email: "sarah.jenkins@oakridge.co.uk",
    role: "CARE_HOME_MANAGER",
    careHome: "Oakridge Manor Care Centre",
    invitedBy: "Victoria Sterling",
    sentDate: "2026-02-10",
    expiresInDays: 0,
    status: "Accepted",
    token: "tok_inv_completed_1",
  },
];

export default function InvitationsPage() {
  const { currentRole } = useRole();
  const [invitations, setInvitations] =
    useState<Invitation[]>(initialInvitations);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  // Form states
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState<RoleType>("CAREGIVER");
  const [newCareHome, setNewCareHome] = useState("St. Jude's Residential Home");

  const handleCreateInvite = () => {
    if (!newEmail) return;
    const newEntry: Invitation = {
      id: `inv-${Date.now()}`,
      email: newEmail,
      role: newRole,
      careHome: newCareHome,
      invitedBy: "You",
      sentDate: "Today",
      expiresInDays: 7,
      status: "Pending",
      token: `tok_inv_${Math.random().toString(36).substring(2, 12)}`,
    };
    setInvitations([newEntry, ...invitations]);
    setShowInviteModal(false);
    setNewEmail("");
  };

  const handleCopyLink = (token: string) => {
    const link = `${window.location.origin}/accept-invitation?token=${token}`;
    navigator.clipboard.writeText(link);
    setCopiedToken(token);
    setTimeout(() => setCopiedToken(null), 2500);
  };

  const handleRevoke = (id: string) => {
    setInvitations((prev) => prev.filter((i) => i.id !== id));
  };

  const handleResend = (id: string) => {
    setInvitations((prev) =>
      prev.map((i) =>
        i.id === id
          ? { ...i, sentDate: "Just now", expiresInDays: 7, status: "Pending" }
          : i,
      ),
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-ink font-heading">
              Staff Onboarding & Invitations
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-mint text-teal-deep font-semibold">
              {invitations.filter((i) => i.status === "Pending").length} Pending
            </span>
          </div>
          <p className="text-sm text-ink/70 mt-1">
            Invitation Management: Securely dispatch role-assigned
            invites with cryptographic onboarding links.
          </p>
        </div>

        <button
          onClick={() => setShowInviteModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md bg-teal-brand text-white text-sm font-semibold hover:bg-teal-deep transition-all shadow-sm cursor-pointer"
        >
          <Send className="h-4 w-4" />
          Send New Invitation
        </button>
      </div>

      {/* Invitations Table */}
      <div className="rounded-md  bg-white border border-ink/10 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="whitespace-nowrap w-full text-left text-xs text-ink">
            <thead className="bg-cream/40 border-b border-ink/10 text-ink/60 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-6">Recipient Email</th>
                <th className="py-3.5 px-4">Assigned Role</th>
                <th className="py-3.5 px-4">Facility Boundary</th>
                <th className="py-3.5 px-4">Dispatched By</th>
                <th className="py-3.5 px-4">Status & Expiry</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/5">
              {invitations.map((inv) => (
                <tr
                  key={inv.id}
                  className="hover:bg-cream/20 transition-colors"
                >
                  <td className="py-4 px-6">
                    <div className="font-bold text-sm text-ink">
                      {inv.email}
                    </div>
                    <span className="text-[10px] text-ink/50 font-mono">
                      Dispatched {inv.sentDate}
                    </span>
                  </td>

                  <td className="py-4 px-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                        inv.role === "SUPER_ADMIN"
                          ? "bg-purple-100 text-purple-800"
                          : inv.role === "ORGANISATION_ADMIN"
                            ? "bg-teal-brand text-white"
                            : inv.role === "CARE_HOME_MANAGER"
                              ? "bg-mint text-teal-deep"
                              : "bg-ink/5 text-ink/80"
                      }`}
                    >
                      {inv.role.replace(/_/g, " ")}
                    </span>
                  </td>

                  <td className="py-4 px-4 font-medium text-ink">
                    {inv.careHome}
                  </td>

                  <td className="py-4 px-4 text-ink/70">{inv.invitedBy}</td>

                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                          inv.status === "Pending"
                            ? "bg-amber-50 text-amber-800 border border-amber-200"
                            : inv.status === "Accepted"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-ink/5 text-ink/50"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            inv.status === "Pending"
                              ? "bg-amber-600"
                              : inv.status === "Accepted"
                                ? "bg-emerald-600"
                                : "bg-ink/40"
                          }`}
                        />
                        {inv.status}
                      </span>
                      {inv.status === "Pending" && (
                        <span className="text-[10px] text-ink/50 font-medium">
                          ({inv.expiresInDays}d left)
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {inv.status === "Pending" && (
                        <>
                          <button
                            onClick={() => handleCopyLink(inv.token)}
                            className="p-1.5 rounded-md border border-ink/10 hover:bg-cream text-ink/70 hover:text-ink text-xs font-semibold flex items-center gap-1 cursor-pointer"
                            title="Copy onboarding URL"
                          >
                            {copiedToken === inv.token ? (
                              <Check className="h-3.5 w-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="h-3.5 w-3.5" />
                            )}
                          </button>

                          <button
                            onClick={() => handleResend(inv.id)}
                            className="p-1.5 rounded-md border border-ink/10 hover:bg-cream text-ink/70 hover:text-ink text-xs font-semibold cursor-pointer"
                            title="Resend invitation email"
                          >
                            <RefreshCw className="h-3.5 w-3.5" />
                          </button>

                          <button
                            onClick={() => handleRevoke(inv.id)}
                            className="p-1.5 rounded-md border border-red-200 hover:bg-red-50 text-red-600 text-xs font-semibold cursor-pointer"
                            title="Revoke invitation"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </>
                      )}

                      {inv.status === "Expired" && (
                        <button
                          onClick={() => handleResend(inv.id)}
                          className="px-2.5 py-1 rounded-md bg-teal-brand text-white text-[11px] font-semibold hover:bg-teal-deep cursor-pointer"
                        >
                          Reissue
                        </button>
                      )}

                      {inv.status === "Accepted" && (
                        <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Active User
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 bg-ink/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-md p-6 shadow-2xl border border-ink/10 space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-ink/10 pb-4">
              <div>
                <h3 className="text-lg font-bold text-ink font-heading">
                  Invite Colleague to CarerLoop
                </h3>
                <p className="text-xs text-ink/60">
                  An onboarding link will be sent to their email
                </p>
              </div>
              <button
                onClick={() => setShowInviteModal(false)}
                className="text-xs p-1 text-ink/50 hover:text-ink cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-ink block mb-1">
                  Work Email Address
                </label>
                <input
                  type="email"
                  placeholder="colleague@careorganisation.co.uk"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-ink/10 bg-cream/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-brand/20 font-medium"
                />
              </div>

              <div>
                <label className="font-semibold text-ink block mb-1">
                  Assigned Role
                </label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as RoleType)}
                  className="w-full px-3 py-2 rounded-md border border-ink/10 bg-cream/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-brand/20 font-medium"
                >
                  <option value="CAREGIVER">
                    Caregiver (Daily logs, vitals, round view)
                  </option>
                  <option value="CARE_HOME_MANAGER">
                    Care Home Manager (Facility & staff coordination)
                  </option>
                  <option value="ORGANISATION_ADMIN">
                    Organisation Administrator (Multi-home executive)
                  </option>
                  {currentRole === "SUPER_ADMIN" && (
                    <option value="SUPER_ADMIN">
                      Super Administrator (Platform operations)
                    </option>
                  )}
                </select>
              </div>

              <div>
                <label className="font-semibold text-ink block mb-1">
                  Assigned Care Home
                </label>
                <select
                  value={newCareHome}
                  onChange={(e) => setNewCareHome(e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-ink/10 bg-cream/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-brand/20 font-medium"
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
                  <option value="Hazelwood House">
                    Hazelwood House (Cheltenham)
                  </option>
                  <option value="All Facilities (Apex Group)">
                    All Facilities in Group (Org Admin only)
                  </option>
                </select>
              </div>

              <div className="p-3.5 rounded-md bg-cream border border-ink/10 text-ink/80 text-[11px] space-y-1">
                <span className="font-bold text-teal-deep block">
                  Security Note:
                </span>
                <p>
                  Invitations expire after 7 days. The invitee will choose their
                  secure password and accept statutory privacy terms upon
                  onboarding.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-ink/10">
              <button
                onClick={() => setShowInviteModal(false)}
                className="px-4 py-2 rounded-md border border-ink/10 text-xs font-semibold text-ink/70 hover:bg-cream cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateInvite}
                className="px-4 py-2 rounded-md bg-teal-brand text-white text-xs font-semibold hover:bg-teal-deep transition-all cursor-pointer"
              >
                Dispatch Invitation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
