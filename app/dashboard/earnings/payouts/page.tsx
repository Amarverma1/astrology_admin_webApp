"use client";

import { useState } from "react";
import {
  Search,
  Download,
  Eye,
  FileDown,
  CheckCircle,
  Clock,
  AlertTriangle,
} from "lucide-react";
import PaginatedTable from "../../components/PaginatedTable";

export default function PayoutsPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [openDrawer, setOpenDrawer] = useState(false);
  const [selectedPayout, setSelectedPayout] = useState<any>(null);

  // 🔹 Mock Payout Data
  const [payouts] = useState([
    {
      id: "PAYOUT001",
      date: "01/22/2026",
      amount: 2339,
      status: "Completed",
      method: "UPI",
      account: "9876543210@upi",
      remarks: "Jan Payout",
    },
    {
      id: "PAYOUT002",
      date: "01/21/2026",
      amount: 1169,
      status: "Pending",
      method: "Bank Account",
      account: "HDFC - 1234567890",
      remarks: "Jan Payout",
    },
    {
      id: "PAYOUT003",
      date: "01/20/2026",
      amount: 7199,
      status: "Completed",
      method: "Wallet",
      account: "Paytm Wallet",
      remarks: "Dec Payout",
    },
    {
      id: "PAYOUT004",
      date: "01/19/2026",
      amount: 499,
      status: "Failed",
      method: "Bank Account",
      account: "ICICI - 9876543210",
      remarks: "Dec Payout",
    },
    {
      id: "PAYOUT005",
      date: "01/18/2026",
      amount: 2000,
      status: "Pending",
      method: "UPI",
      account: "9876543211@upi",
      remarks: "Jan Payout",
    },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-700";
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      case "Failed":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  // 🔹 Filter payouts by status & search
  const filteredPayouts = payouts.filter(
    (p) =>
      (filter === "All" || p.status === filter) &&
      (p.id.toLowerCase().includes(search.toLowerCase()) ||
        p.account.toLowerCase().includes(search.toLowerCase()))
  );

  const pendingPayouts = payouts.filter(
    (p) => p.status === "Pending" &&
           (p.id.toLowerCase().includes(search.toLowerCase()) ||
            p.account.toLowerCase().includes(search.toLowerCase()))
  );

  const handlePDFDownload = () => {
    alert("📄 Payout Statement (AI-generated) downloaded!");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Payouts</h1>
            <p className="text-sm text-gray-500">
              Track all payout transactions, their status, and account/UPI info.
            </p>
          </div>
          <button
            onClick={handlePDFDownload}
            className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-gray-800"
          >
            <FileDown className="w-4 h-4" /> Download PDF Statement
          </button>
        </div>

        {/* FILTER + SEARCH */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition mb-6 flex flex-wrap items-center gap-3">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-1.5 text-sm"
          >
            <option>All</option>
            <option>Completed</option>
            <option>Pending</option>
            <option>Failed</option>
          </select>

          <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 w-full sm:w-80 ml-auto">
            <Search className="w-4 h-4 text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search by payout id or account..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent outline-none text-sm flex-1"
            />
          </div>
        </div>

        {/* ALL PAYOUTS TABLE */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">All Payouts</h2>
          <table className="w-full text-sm border-collapse">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr className="text-gray-600 font-medium">
                <th className="px-4 py-3">Payout ID</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Method</th>
                <th className="px-4 py-3">Account / UPI</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-center">Action</th>
              </tr>
            </thead>

            <PaginatedTable
              data={filteredPayouts}
              defaultRows={5}
              renderRow={(p) => (
                <tr
                  key={p.id}
                  className="border-b last:border-0 hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-3 font-semibold text-gray-800">{p.id}</td>
                  <td className="px-4 py-3 text-gray-700">{p.date}</td>
                  <td className="px-4 py-3 text-green-600 font-medium">₹{p.amount}</td>
                  <td className="px-4 py-3 text-gray-700">{p.method}</td>
                  <td className="px-4 py-3 text-gray-700">{p.account}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                        p.status
                      )}`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => {
                        setSelectedPayout(p);
                        setOpenDrawer(true);
                      }}
                      className="p-1.5 bg-gray-100 rounded-full hover:bg-gray-200"
                    >
                      <Eye className="w-4 h-4 text-red-600" />
                    </button>
                  </td>
                </tr>
              )}
            />
          </table>
        </div>

        {/* PENDING PAYOUTS TABLE */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Pending Payouts</h2>
          <table className="w-full text-sm border-collapse">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr className="text-gray-600 font-medium">
                <th className="px-4 py-3">Payout ID</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Method</th>
                <th className="px-4 py-3">Account / UPI</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>

            <PaginatedTable
              data={pendingPayouts}
              defaultRows={5}
              renderRow={(p) => (
                <tr
                  key={p.id}
                  className="border-b last:border-0 hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-3 font-semibold text-gray-800">{p.id}</td>
                  <td className="px-4 py-3 text-gray-700">{p.date}</td>
                  <td className="px-4 py-3 text-green-600 font-medium">₹{p.amount}</td>
                  <td className="px-4 py-3 text-gray-700">{p.method}</td>
                  <td className="px-4 py-3 text-gray-700">{p.account}</td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => {
                        setSelectedPayout(p);
                        setOpenDrawer(true);
                      }}
                      className="p-1.5 bg-gray-100 rounded-full hover:bg-gray-200"
                    >
                      <Eye className="w-4 h-4 text-red-600" />
                    </button>
                  </td>
                </tr>
              )}
            />
          </table>
        </div>
      </div>

      {/* DRAWER */}
      {openDrawer && selectedPayout && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/30 backdrop-blur-sm">
          <div className="bg-white w-full sm:w-[420px] h-full shadow-xl p-6 flex flex-col animate-slideIn">
            <div className="flex items-center justify-between mb-4 border-b pb-3">
              <h2 className="text-lg font-semibold text-gray-800">Payout Details</h2>
              <button
                onClick={() => setOpenDrawer(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-sm text-gray-700 mb-4">
              <p><strong>Payout ID:</strong> {selectedPayout.id}</p>
              <p><strong>Date:</strong> {selectedPayout.date}</p>
              <p><strong>Amount:</strong> ₹{selectedPayout.amount}</p>
              <p><strong>Method:</strong> {selectedPayout.method}</p>
              <p><strong>Account / UPI:</strong> {selectedPayout.account}</p>
              <p><strong>Status:</strong> {selectedPayout.status}</p>
              <p><strong>Remarks:</strong> {selectedPayout.remarks}</p>
            </div>

            <div className="mt-auto border-t pt-3 flex justify-end">
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
