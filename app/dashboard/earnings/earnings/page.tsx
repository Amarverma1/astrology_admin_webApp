"use client";

import { useState } from "react";
import {
  Search,
  Download,
  Eye,
  IndianRupee,
  BarChart3,
  Clock,
  AlertTriangle,
  CheckCircle,
  FileDown,
  CreditCard,
  Wallet,
  Building2,
  TrendingUp,
} from "lucide-react";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import PaginatedTable from "../../components/PaginatedTable";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

export default function EarningsPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [openDrawer, setOpenDrawer] = useState(false);
  const [selectedEarning, setSelectedEarning] = useState<any>(null);

  // 🧾 Mock Earning Data
  const [earnings] = useState([
    {
      id: "ORD10988",
      orderDate: "01/22/2026",
      customer: "Riya Sharma",
      category: "Food",
      total: 499,
      commission: 49.9,
      earning: 449.1,
      payoutStatus: "Completed",
      paymentMode: "UPI",
      type: "UPI",
    },
    {
      id: "ORD10989",
      orderDate: "01/22/2026",
      customer: "Amit Verma",
      category: "Fashion",
      total: 2599,
      commission: 260,
      earning: 2339,
      payoutStatus: "Pending",
      paymentMode: "Card",
      type: "Bank Account",
    },
    {
      id: "ORD10990",
      orderDate: "01/21/2026",
      customer: "Sneha Singh",
      category: "Jewelry",
      total: 7999,
      commission: 800,
      earning: 7199,
      payoutStatus: "Completed",
      paymentMode: "UPI",
      type: "UPI",
    },
    {
      id: "ORD10991",
      orderDate: "01/20/2026",
      customer: "Rahul Patel",
      category: "Beauty",
      total: 1299,
      commission: 130,
      earning: 1169,
      payoutStatus: "Failed",
      paymentMode: "Wallet",
      type: "Wallet",
    },
  ]);

  const filtered = earnings.filter(
    (e) =>
      (filter === "All" || e.payoutStatus === filter) &&
      (e.id.toLowerCase().includes(search.toLowerCase()) ||
        e.customer.toLowerCase().includes(search.toLowerCase()))
  );

  // 📊 Earnings by Category
  const categoryData = {
    labels: ["Food", "Fashion", "Jewelry", "Beauty"],
    datasets: [
      {
        label: "Earnings (₹)",
        data: [449, 2339, 7199, 1169],
        backgroundColor: ["#F43F5E", "#3B82F6", "#10B981", "#F59E0B"],
      },
    ],
  };

  // 📆 Monthly Earnings Summary
  const monthlyEarningsData = {
    labels: ["Sep", "Oct", "Nov", "Dec", "Jan"],
    datasets: [
      {
        label: "Earnings (₹)",
        data: [28500, 31200, 36500, 40200, 45100],
        borderColor: "#16A34A",
        backgroundColor: "rgba(34,197,94,0.15)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

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

  const handlePDFDownload = () => {
    alert("📄 Monthly Earnings Statement (AI-generated) downloaded!");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Earnings</h1>
            <p className="text-sm text-gray-500">
              Review all order earnings, commissions, and payout status with
              monthly summary.
            </p>
          </div>
          <button
            onClick={handlePDFDownload}
            className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-gray-800"
          >
            <FileDown className="w-4 h-4" /> Download PDF Statement
          </button>
        </div>

        {/* INSIGHTS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            {
              title: "Total Earnings",
              value: "₹10,156",
              icon: <IndianRupee className="w-5 h-5 text-green-600" />,
              color: "text-green-600",
              desc: "All-time seller income",
            },
            {
              title: "Pending Payouts",
              value: "₹2,339",
              icon: <Clock className="w-5 h-5 text-yellow-500" />,
              color: "text-yellow-500",
              desc: "Awaiting transfer",
            },
            {
              title: "Commission Paid",
              value: "₹1,239",
              icon: <AlertTriangle className="w-5 h-5 text-red-600" />,
              color: "text-red-600",
              desc: "Fees deducted by LMPIO",
            },
            {
              title: "Payout Success Rate",
              value: "92%",
              icon: <CheckCircle className="w-5 h-5 text-blue-600" />,
              color: "text-blue-600",
              desc: "All-time payout success",
            },
          ].map((c, i) => (
            <div
              key={i}
              className="bg-white p-5 rounded-xl border border-gray-100 hover:shadow-md transition"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold text-gray-600">
                  {c.title}
                </span>
                {c.icon}
              </div>
              <h2 className="text-2xl font-bold text-gray-900">{c.value}</h2>
              <p className="text-xs text-gray-500 mt-1">{c.desc}</p>
            </div>
          ))}
        </div>

        {/* MONTHLY SUMMARY CHART */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 mb-8 hover:shadow-md transition">
          <h2 className="text-md font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-600" /> Monthly Earnings
            Summary
          </h2>
          <div className="h-[200px]">
            <Line
              data={monthlyEarningsData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: "bottom" } },
              }}
            />
          </div>
        </div>

        {/* CATEGORY CHART */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 mb-8 hover:shadow-md transition">
          <h2 className="text-md font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-green-600" /> Earnings by Category
          </h2>
          <div className="h-[200px]">
            <Bar
              data={categoryData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
              }}
            />
          </div>
        </div>

        {/* FILTERS + TABLE */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
          <div className="flex flex-wrap items-center gap-3 mb-5">
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
                placeholder="Search by order id or customer..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent outline-none text-sm flex-1"
              />
            </div>
          </div>

          <table className="w-full text-sm border-collapse">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr className="text-gray-600 font-medium">
                <th className="px-4 py-3">Order ID</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Commission</th>
                <th className="px-4 py-3">Earning</th>
                <th className="px-4 py-3">Payment Mode</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Payout</th>
                <th className="px-4 py-3 text-center">Action</th>
              </tr>
            </thead>

            <PaginatedTable
              data={filtered}
              defaultRows={5}
              renderRow={(e) => (
                <tr
                  key={e.id}
                  className="border-b last:border-0 hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-3 font-semibold text-gray-800">{e.id}</td>
                  <td className="px-4 py-3 text-gray-700">{e.customer}</td>
                  <td className="px-4 py-3 text-gray-600">{e.category}</td>
                  <td className="px-4 py-3 text-gray-800">₹{e.total}</td>
                  <td className="px-4 py-3 text-red-600">₹{e.commission}</td>
                  <td className="px-4 py-3 text-green-600 font-medium">₹{e.earning}</td>
                  <td className="px-4 py-3 text-gray-700">{e.paymentMode}</td>
                  <td className="px-4 py-3 text-gray-700">{e.type}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                        e.payoutStatus
                      )}`}
                    >
                      {e.payoutStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => {
                        setSelectedEarning(e);
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
      {openDrawer && selectedEarning && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/30 backdrop-blur-sm">
          <div className="bg-white w-full sm:w-[420px] h-full shadow-xl p-6 flex flex-col animate-slideIn">
            <div className="flex items-center justify-between mb-4 border-b pb-3">
              <h2 className="text-lg font-semibold text-gray-800">
                Earning Details
              </h2>
              <button
                onClick={() => setOpenDrawer(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-sm text-gray-700 mb-4">
              <p><strong>Order ID:</strong> {selectedEarning.id}</p>
              <p><strong>Customer:</strong> {selectedEarning.customer}</p>
              <p><strong>Category:</strong> {selectedEarning.category}</p>
              <p><strong>Total Amount:</strong> ₹{selectedEarning.total}</p>
              <p><strong>Commission:</strong> ₹{selectedEarning.commission}</p>
              <p><strong>Net Earning:</strong> ₹{selectedEarning.earning}</p>
              <p><strong>Payment Mode:</strong> {selectedEarning.paymentMode}</p>
              <p><strong>Type:</strong> {selectedEarning.type}</p>
              <p><strong>Payout Status:</strong> {selectedEarning.payoutStatus}</p>
              <p><strong>Order Date:</strong> {selectedEarning.orderDate}</p>
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
