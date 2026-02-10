"use client";

import { useState } from "react";
import { Search, Phone, Mail, Eye, X } from "lucide-react";
import PaginatedTable from "../components/PaginatedTable";

type UserType = {
  id: number;
  name: string;
  phone: string;
  email: string;
  status: "Active" | "Inactive";
  joined: string;
};

export default function UsersPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [openDrawer, setOpenDrawer] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);

  // ONLY USERS (NO ASTROLOGERS)
  const users: UserType[] = [
    {
      id: 1,
      name: "Riya Sharma",
      phone: "9876543210",
      email: "riya@gmail.com",
      status: "Active",
      joined: "2026-01-20",
    },
    {
      id: 2,
      name: "Sneha Singh",
      phone: "9988776655",
      email: "sneha@gmail.com",
      status: "Inactive",
      joined: "2026-01-05",
    },
    {
      id: 3,
      name: "Ankit Patel",
      phone: "9012345678",
      email: "ankit@gmail.com",
      status: "Active",
      joined: "2026-01-02",
    },
  ];

  const filteredUsers = users.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.phone.includes(search) ||
      u.email.toLowerCase().includes(search.toLowerCase());

    const matchStatus =
      statusFilter === "All" || u.status === statusFilter;

    return matchSearch && matchStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-5">

        {/* HEADER */}
        <div>
          <h1 className="text-lg font-semibold text-gray-900">
            Users
          </h1>
          <p className="text-sm text-gray-500">
            View and manage registered users
          </p>
        </div>

        {/* TABLE CARD */}
        <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition">

          {/* SEARCH & FILTER */}
          <div className="flex flex-col sm:flex-row gap-3 p-4">
            <div className="flex items-center bg-gray-50 rounded-lg px-3 py-2 w-full sm:w-80">
              <Search className="w-4 h-4 text-gray-400 mr-2" />
              <input
                className="bg-transparent outline-none text-sm w-full"
                placeholder="Search name, phone or email"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <select
              className="text-sm bg-gray-50 rounded-lg px-3 py-2 outline-none w-full sm:w-40"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          {/* TABLE */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr className="text-gray-600 font-medium">
                  <th className="px-4 py-3 text-left">Name</th>
                  <th className="px-4 py-3 text-left">Phone</th>
                  <th className="px-4 py-3 text-left">Email</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-center">Action</th>
                </tr>
              </thead>

              <PaginatedTable
                data={filteredUsers}
                defaultRows={5}
                renderRow={(u) => (
                  <tr
                    key={u.id}
                    className="hover:bg-gray-50 transition"
                  >
                    <td className="px-4 py-3 font-medium text-gray-800">
                      {u.name}
                    </td>

                    <td className="px-4 py-3 text-gray-600">
                      <Phone className="w-4 h-4 text-gray-400" />
                      {u.phone}
                    </td>

                    <td className="px-4 py-3 text-gray-600 flex items-center gap-1">
                      <Mail className="w-4 h-4 text-gray-400" />
                      {u.email}
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded-full ${
                          u.status === "Active"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {u.status}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => {
                          setSelectedUser(u);
                          setOpenDrawer(true);
                        }}
                        className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition"
                      >
                        <Eye className="w-4 h-4 text-gray-700" />
                      </button>
                    </td>
                  </tr>
                )}
              />
            </table>
          </div>
        </div>
      </div>

      {/* USER DETAILS DRAWER */}
      {openDrawer && selectedUser && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/30">
          <div className="bg-white w-full sm:w-[420px] h-full p-6 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-semibold text-gray-800">
                User Details
              </h3>
              <button onClick={() => setOpenDrawer(false)}>
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="space-y-3 text-sm text-gray-700">
              <p><b>Name:</b> {selectedUser.name}</p>
              <p><b>Phone:</b> {selectedUser.phone}</p>
              <p><b>Email:</b> {selectedUser.email}</p>
              <p><b>Status:</b> {selectedUser.status}</p>
              <p><b>Joined:</b> {selectedUser.joined}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
