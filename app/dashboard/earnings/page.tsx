"use client";

import { useState } from "react";
import {
  IndianRupee,
  TrendingUp,
  TrendingDown,
  CreditCard,
  Banknote,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  PieChart,
  BarChart3,
  Calendar,
  Clock,
  AlertTriangle,
  Receipt,
} from "lucide-react";
import { Bar, Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  Tooltip,
  Legend,
  Title
);

export default function EarningsOverviewPage() {
  const [period, setPeriod] = useState("30");

  // Earnings trend chart
  const earningsTrend = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [
      {
        label: "Net Earnings (₹)",
        data: [42000, 50000, 54500, 58000],
        borderColor: "#16A34A",
        backgroundColor: "rgba(34,197,94,0.15)",
        fill: true,
        tension: 0.4,
      },
      {
        label: "Commission (₹)",
        data: [4500, 5200, 5600, 5900],
        borderColor: "#EF4444",
        backgroundColor: "rgba(239,68,68,0.1)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  // Payout breakdown
  const payoutBreakdown = {
    labels: ["Pending", "Completed", "Failed"],
    datasets: [
      {
        data: [3, 12, 1],
        backgroundColor: ["#F59E0B", "#10B981", "#EF4444"],
      },
    ],
  };

  // Commission & earning ratio
  const commissionRatio = {
    labels: ["Seller Earnings", "Platform Commission"],
    datasets: [
      {
        data: [85, 15],
        backgroundColor: ["#16A34A", "#EF4444"],
      },
    ],
  };

  const earningsCards = [
    {
      title: "Total Earnings",
      value: "₹2,05,500",
      growth: "+8.4%",
      icon: <IndianRupee className="w-5 h-5 text-green-600" />,
      color: "text-green-600",
    },
    {
      title: "Total Payouts",
      value: "₹1,96,300",
      growth: "+5.2%",
      icon: <Wallet className="w-5 h-5 text-blue-600" />,
      color: "text-blue-600",
    },
    {
      title: "Pending Payouts",
      value: "₹9,200",
      growth: "-2.1%",
      icon: <Clock className="w-5 h-5 text-yellow-500" />,
      color: "text-yellow-500",
    },
    {
      title: "Commission Paid",
      value: "₹12,540",
      growth: "+3.1%",
      icon: <Receipt className="w-5 h-5 text-red-600" />,
      color: "text-red-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Earnings Overview</h1>
            <p className="text-sm text-gray-500">
              Track your earnings, commissions, and payouts powered by LMPIO analytics.
            </p>
          </div>

          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white shadow-sm hover:shadow-md transition"
          >
            <option value="7">Last 7 Days</option>
            <option value="30">Last 30 Days</option>
            <option value="90">Last 90 Days</option>
            <option value="365">Last 1 Year</option>
          </select>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {earningsCards.map((c, i) => (
            <div
              key={i}
              className="bg-white p-5 rounded-xl border border-gray-100 hover:shadow-md transition"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold text-gray-600">{c.title}</span>
                {c.icon}
              </div>
              <h2 className="text-2xl font-bold text-gray-900">{c.value}</h2>
              <p className={`text-xs mt-1 flex items-center gap-1 font-medium ${c.color}`}>
                {c.growth.includes("+") ? (
                  <ArrowUpRight className="w-3 h-3" />
                ) : (
                  <ArrowDownRight className="w-3 h-3" />
                )}
                {c.growth} this month
              </p>
            </div>
          ))}
        </div>

        {/* Earnings Trend */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 mb-8 hover:shadow-md transition">
          <h2 className="text-md font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-green-600" /> Earnings & Commission Trend
          </h2>
          <div className="h-[240px]">
            <Line
              data={earningsTrend}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: "bottom" } },
              }}
            />
          </div>
        </div>

        {/* Payout Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="bg-white p-5 rounded-xl border border-gray-100 hover:shadow-md transition">
            <h2 className="text-sm font-semibold text-gray-600 mb-3">
              Payouts Breakdown
            </h2>
            <div className="flex flex-col items-center justify-center h-[180px]">
              <Doughnut
                data={payoutBreakdown}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { position: "bottom" } },
                  cutout: "70%",
                }}
              />
              <p className="text-xs text-gray-500 mt-2">Status of all payout requests</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-gray-100 hover:shadow-md transition">
            <h2 className="text-sm font-semibold text-gray-600 mb-3">
              Earnings vs Commission
            </h2>
            <div className="flex flex-col items-center justify-center h-[180px]">
              <Doughnut
                data={commissionRatio}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { position: "bottom" } },
                  cutout: "70%",
                }}
              />
              <p className="text-xs text-gray-500 mt-2">Earnings-to-commission ratio</p>
            </div>
          </div>
        </div>

        {/* AI Insights Section */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-100 hover:shadow-md transition">
          <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <PieChart className="w-5 h-5 text-green-600" /> AI Earnings Insights
          </h2>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>• You earned 12% more than last month — strong growth trajectory.</li>
            <li>• Average payout time: 2.1 days (excellent).</li>
            <li>• Commission share decreased slightly — optimizing revenue split.</li>
            <li>• Food category generated 47% of total income this month.</li>
            <li>• LMPIO AI predicts ₹2.3L revenue next month based on current trends.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
