"use client";

import { useState } from "react";
import Link from "next/link";
import { useRole, RoleType } from "@/lib/role-context";
import {
  Users,
  Search,
  Filter,
  UserPlus,
  ShieldCheck,
  Mail,
  CheckCircle2,
  AlertCircle,
  Lock,
  Unlock,
  Building2,
  Crown,
} from "lucide-react";

interface UserRecord {
  id: string;
  name: string;
  email: string;
  role: RoleType;
  careHome: string;
  organisation: string;
  status: "Active" | "Suspended" | "Pending Invitation";
  lastLogin: string;
}

const initialUsers: UserRecord[] = [
  {
    id: "usr-1",
    name: "Dr. Alexander Sterling",
    email: "alexander.sterling@carerloop.com",
    role: "SUPER_ADMIN",
    careHome: "Global Platform Access",
    organisation: "CarerLoop Platform Infrastructure",
    status: "Active",
    lastLogin: "Today, 08:30 AM",
  },
  {
    id: "usr-2",
    name: "Victoria Sterling",
    email: "v.sterling@apexcare.co.uk",
    role: "ORGANISATION_ADMIN",
    careHome: "All Facilities (Apex Group)",
    organisation: "Apex Care Group",
    status: "Active",
    lastLogin: "Today, 09:12 AM",
  },
  {
    id: "usr-3",
    name: "Eleanor Vance",
    email: "e.vance@stjudes.org.uk",
    role: "CARE_HOME_MANAGER",
    careHome: "St. Jude's Residential Home",
    organisation: "Apex Care Group",
    status: "Active",
    lastLogin: "Yesterday, 04:45 PM",
  },
  {
    id: "usr-4",
    name: "Grace Mbatha",
    email: "grace.m@stjudes.org.uk",
    role: "CAREGIVER",
    careHome: "St. Jude's Residential Home",
    organisation: "Apex Care Group",
    status: "Active",
    lastLogin: "Today, 06:50 AM",
  },
  {
    id: "usr-5",
    name: "Marcus Thorne",
    email: "m.thorne@meadowview.org.uk",
    role: "CARE_HOME_MANAGER",
    careHome: "Meadow View Lodge",
    organisation: "Apex Care Group",
    status: "Active",
    lastLogin: "2 days ago",
  },
  {
    id: "usr-6",
    name: "Chloe Bennett",
    email: "chloe.b@meadowview.org.uk",
    role: "CAREGIVER",
    careHome: "Meadow View Lodge",
    organisation: "Apex Care Group",
    status: "Active",
    lastLogin: "Today, 07:15 AM",
  },
  {
    id: "usr-7",
    name: "Sarah Jenkins",
    email: "s.jenkins@oakridge.co.uk",
    role: "CARE_HOME_MANAGER",
    careHome: "Oakridge Manor Care Centre",
    organisation: "Apex Care Group",
    status: "Suspended",
    lastLogin: "14 days ago",
  },
  {
    id: "usr-8",
    name: "Daniel Craigie",
    email: "d.craigie@apexcare.co.uk",
    role: "CAREGIVER",
    careHome: "St. Jude's Residential Home",
    organisation: "Apex Care Group",
    status: "Pending Invitation",
    lastLogin: "Never",
  },
];

export default function UsersPage() {
  const { currentRole } = useRole();
  const [users, setUsers] = useState<UserRecord[]>(initialUsers);
  const [search, setSearch] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("ALL");

  const toggleUserStatus = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const nextStatus = u.status === "Active" ? "Suspended" : "Active";
          return { ...u, status: nextStatus };
        }
        return u;
      }),
    );
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.careHome.toLowerCase().includes(search.toLowerCase());
    const matchesRole = selectedRole === "ALL" || u.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-ink font-heading">
              User & Access Management
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-mint text-teal-deep font-semibold">
              {users.length} Team Members
            </span>
          </div>
          <p className="text-sm text-ink/70 mt-1">
            Manage accounts, role assignments, security status
            and facility boundaries.
          </p>
        </div>

        <Link
          href="/dashboard/invitations"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md bg-teal-brand text-white text-sm font-semibold hover:bg-teal-deep transition-all shadow-sm cursor-pointer"
        >
          <UserPlus className="h-4 w-4" />
          Invite Staff Member
        </Link>
      </div>

      {/* Search and Role Filter */}
      <div className="p-4 rounded-md bg-white border border-ink/10 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-ink/40" />
          <input
            type="text"
            placeholder="Search by name, email or facility..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm rounded-md border border-ink/10 bg-cream/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-brand/20 transition-all"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="h-4 w-4 text-ink/40" />
          <span className="text-xs text-ink/60 font-medium">Filter Role:</span>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="text-xs rounded-md border border-ink/10 px-3 py-2 bg-cream/30 focus:outline-none focus:ring-2 focus:ring-teal-brand/20 font-medium text-ink"
          >
            <option value="ALL">All Roles</option>
            <option value="SUPER_ADMIN">Super Administrator</option>
            <option value="ORGANISATION_ADMIN">
              Organisation Administrator
            </option>
            <option value="CARE_HOME_MANAGER">Care Home Manager</option>
            <option value="CAREGIVER">Caregiver</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-md bg-white border border-ink/10 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="whitespace-nowrap w-full text-left text-xs text-ink">
            <thead className="bg-cream/40 border-b border-ink/10 text-ink/60 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-6">User Identity</th>
                <th className="py-3.5 px-4">Role & Scope</th>
                <th className="py-3.5 px-4">Assigned Facility</th>
                <th className="py-3.5 px-4">Account Status</th>
                <th className="py-3.5 px-4">Last Activity</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/5">
              {filteredUsers.map((usr) => (
                <tr
                  key={usr.id}
                  className="hover:bg-cream/20 transition-colors"
                >
                  <td className="py-4 px-6">
                    <div className="font-bold text-sm text-ink">{usr.name}</div>
                    <div className="text-[11px] text-ink/60">{usr.email}</div>
                  </td>

                  <td className="py-4 px-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                        usr.role === "SUPER_ADMIN"
                          ? "bg-purple-100 text-purple-800"
                          : usr.role === "ORGANISATION_ADMIN"
                            ? "bg-teal-brand text-white"
                            : usr.role === "CARE_HOME_MANAGER"
                              ? "bg-mint text-teal-deep"
                              : "bg-ink/5 text-ink/80"
                      }`}
                    >
                      {usr.role.replace(/_/g, " ")}
                    </span>
                  </td>

                  <td className="py-4 px-4 font-medium text-ink">
                    {usr.careHome}
                  </td>

                  <td className="py-4 px-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                        usr.status === "Active"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : usr.status === "Suspended"
                            ? "bg-rose-50 text-rose-700 border border-rose-200"
                            : "bg-amber-50 text-amber-800 border border-amber-200"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          usr.status === "Active"
                            ? "bg-emerald-600"
                            : usr.status === "Suspended"
                              ? "bg-rose-600"
                              : "bg-amber-600"
                        }`}
                      />
                      {usr.status}
                    </span>
                  </td>

                  <td className="py-4 px-4 text-ink/60">{usr.lastLogin}</td>

                  <td className="py-4 px-6 text-right">
                    {usr.status !== "Pending Invitation" ? (
                      <button
                        onClick={() => toggleUserStatus(usr.id)}
                        className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                          usr.status === "Active"
                            ? "bg-red-50 text-red-700 hover:bg-red-100"
                            : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                        }`}
                      >
                        {usr.status === "Active" ? (
                          <>
                            <Lock className="h-3 w-3" />
                            Suspend
                          </>
                        ) : (
                          <>
                            <Unlock className="h-3 w-3" />
                            Reactivate
                          </>
                        )}
                      </button>
                    ) : (
                      <span className="text-xs text-ink/40 font-medium">
                        Invitation Sent
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
