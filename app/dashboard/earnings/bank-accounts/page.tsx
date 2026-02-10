"use client";

import { useState } from "react";
import {
  Search,
  Eye,
  Plus,
  Trash2,
  Edit,
} from "lucide-react";
import PaginatedTable from "../../components/PaginatedTable";

export default function BankAccountsPage() {
  const [search, setSearch] = useState("");
  const [openDrawer, setOpenDrawer] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<any>(null);

  // 🔹 Mock bank accounts
  const [accounts, setAccounts] = useState([
    {
      id: "ACC001",
      type: "Bank Account",
      bankName: "HDFC Bank",
      accountNumber: "1234567890",
      ifsc: "HDFC0001234",
      branch: "MG Road, Mumbai",
      addedOn: "01/12/2026",
      status: "Active",
    },
    {
      id: "ACC002",
      type: "UPI",
      upiId: "9876543210@upi",
      addedOn: "01/15/2026",
      status: "Active",
    },
    {
      id: "ACC003",
      type: "Bank Account",
      bankName: "ICICI Bank",
      accountNumber: "9876543210",
      ifsc: "ICIC0009876",
      branch: "Andheri, Mumbai",
      addedOn: "01/18/2026",
      status: "Inactive",
    },
  ]);

  // 🔹 Filtered accounts based on search
  const filteredAccounts = accounts.filter(
    (a) =>
      a.id.toLowerCase().includes(search.toLowerCase()) ||
      (a.bankName && a.bankName.toLowerCase().includes(search.toLowerCase())) ||
      (a.upiId && a.upiId.toLowerCase().includes(search.toLowerCase()))
  );

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this account?")) {
      setAccounts(accounts.filter((a) => a.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              Bank & UPI Accounts
            </h1>
            <p className="text-sm text-gray-500">
              Manage all linked bank accounts and UPI IDs for payouts.
            </p>
          </div>
          <button className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-gray-800">
            <Plus className="w-4 h-4" /> Add New Account
          </button>
        </div>

        {/* BANK ACCOUNTS TABLE */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
          {/* SEARCH BAR INSIDE TABLE */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 w-full sm:w-80 ml-auto">
              <Search className="w-4 h-4 text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Search by bank name, UPI ID, or account..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent outline-none text-sm flex-1"
              />
            </div>
          </div>

          <table className="w-full text-sm border-collapse">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr className="text-gray-600 font-medium">
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Bank / UPI</th>
                <th className="px-4 py-3">Account / UPI ID</th>
                <th className="px-4 py-3">Branch / IFSC</th>
                <th className="px-4 py-3">Added On</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-center">Action</th>
              </tr>
            </thead>

            <PaginatedTable
              data={filteredAccounts}
              defaultRows={5}
              renderRow={(a) => (
                <tr
                  key={a.id}
                  className="border-b last:border-0 hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-3 font-semibold text-gray-800">{a.id}</td>
                  <td className="px-4 py-3 text-gray-700">{a.type}</td>
                  <td className="px-4 py-3 text-gray-700">
                    {a.type === "Bank Account" ? a.bankName : "-"}
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    {a.type === "Bank Account" ? a.accountNumber : a.upiId}
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    {a.type === "Bank Account" ? `${a.branch} / ${a.ifsc}` : "-"}
                  </td>
                  <td className="px-4 py-3 text-gray-700">{a.addedOn}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        a.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {a.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center flex justify-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedAccount(a);
                        setOpenDrawer(true);
                      }}
                      className="p-1.5 bg-gray-100 rounded-full hover:bg-gray-200"
                    >
                      <Eye className="w-4 h-4 text-red-600" />
                    </button>
                    <button
                      onClick={() => handleDelete(a.id)}
                      className="p-1.5 bg-gray-100 rounded-full hover:bg-gray-200"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                    <button className="p-1.5 bg-gray-100 rounded-full hover:bg-gray-200">
                      <Edit className="w-4 h-4 text-blue-600" />
                    </button>
                  </td>
                </tr>
              )}
            />
          </table>
        </div>
      </div>

      {/* DRAWER */}
      {openDrawer && selectedAccount && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/30 backdrop-blur-sm">
          <div className="bg-white w-full sm:w-[420px] h-full shadow-xl p-6 flex flex-col animate-slideIn">
            <div className="flex items-center justify-between mb-4 border-b pb-3">
              <h2 className="text-lg font-semibold text-gray-800">
                Account Details
              </h2>
              <button
                onClick={() => setOpenDrawer(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-sm text-gray-700 mb-4">
              <p><strong>ID:</strong> {selectedAccount.id}</p>
              <p><strong>Type:</strong> {selectedAccount.type}</p>
              {selectedAccount.type === "Bank Account" && (
                <>
                  <p><strong>Bank Name:</strong> {selectedAccount.bankName}</p>
                  <p><strong>Account Number:</strong> {selectedAccount.accountNumber}</p>
                  <p><strong>Branch:</strong> {selectedAccount.branch}</p>
                  <p><strong>IFSC:</strong> {selectedAccount.ifsc}</p>
                </>
              )}
              {selectedAccount.type === "UPI" && (
                <p><strong>UPI ID:</strong> {selectedAccount.upiId}</p>
              )}
              <p><strong>Added On:</strong> {selectedAccount.addedOn}</p>
              <p><strong>Status:</strong> {selectedAccount.status}</p>
            </div>

            <div className="mt-auto border-t pt-3 flex justify-end gap-2">
              <button
                onClick={() => setOpenDrawer(false)}
                className="bg-red-600 text-white px-5 py-2 rounded-md text-sm font-semibold hover:bg-red-700"
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
