"use client";

import { useState } from "react";
import { Search, Eye, Trash2, Edit } from "lucide-react";
import PaginatedTable from "../components/PaginatedTable";

export default function CouponsPage() {
  const [search, setSearch] = useState("");
  const [openDrawer, setOpenDrawer] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<any>(null);

  const [coupons, setCoupons] = useState([
    {
      id: "CPN001",
      code: "WELCOME10",
      discount: "10%",
      type: "Percentage",
      validTill: "02/28/2026",
      status: "Active",
    },
    {
      id: "CPN002",
      code: "FLAT100",
      discount: "₹100",
      type: "Flat",
      validTill: "03/15/2026",
      status: "Active",
    },
    {
      id: "CPN003",
      code: "SUMMER20",
      discount: "20%",
      type: "Percentage",
      validTill: "06/30/2026",
      status: "Inactive",
    },
  ]);

  const filteredCoupons = coupons.filter(
    (c) =>
      c.code.toLowerCase().includes(search.toLowerCase()) ||
      c.type.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this coupon?")) {
      setCoupons(coupons.filter((c) => c.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              Coupons & Discounts
            </h1>
            <p className="text-sm text-gray-500">
              Manage all your coupons and discounts for sellers.
            </p>
          </div>
        </div>

        {/* TABLE WITH SEARCH INSIDE */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
          {/* SEARCH BAR INSIDE TABLE CARD */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 w-full sm:w-80">
              <Search className="w-4 h-4 text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Search by code or type..."
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
                <th className="px-4 py-3">Code</th>
                <th className="px-4 py-3">Discount</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Valid Till</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-center">Action</th>
              </tr>
            </thead>

            <PaginatedTable
              data={filteredCoupons}
              defaultRows={5}
              renderRow={(c) => (
                <tr
                  key={c.id}
                  className="border-b last:border-0 hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-3 font-semibold text-gray-800">{c.id}</td>
                  <td className="px-4 py-3 text-gray-700">{c.code}</td>
                  <td className="px-4 py-3 text-green-600 font-medium">{c.discount}</td>
                  <td className="px-4 py-3 text-gray-700">{c.type}</td>
                  <td className="px-4 py-3 text-gray-700">{c.validTill}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        c.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {c.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center flex justify-center gap-2">
                    <button
                      onClick={() => setSelectedCoupon(c)}
                      className="p-1.5 bg-gray-100 rounded-full hover:bg-gray-200"
                    >
                      <Eye className="w-4 h-4 text-red-600" />
                    </button>
                    <button
                      onClick={() => handleDelete(c.id)}
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
    </div>
  );
}
