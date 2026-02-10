"use client";

import { useState } from "react";
import {
    TrendingUp,
    TrendingDown,
    ShoppingBag,
    Users,
    RotateCcw,
    IndianRupee,
    BarChart3,
    PieChart,
    Activity,
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
    BarElement,
    ArcElement,
    Tooltip,
    Legend,
    Title
);

export default function AIInsightsReportsPage() {
    const [selectedPeriod, setSelectedPeriod] = useState("30");

    // 📈 Sales Trend
    const salesTrend = {
        labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
        datasets: [
            {
                label: "Sales (₹)",
                data: [24500, 32800, 45200, 49900],
                borderColor: "#16A34A",
                backgroundColor: "rgba(34,197,94,0.15)",
                fill: true,
                tension: 0.4,
            },
            {
                label: "Orders",
                data: [210, 290, 370, 410],
                borderColor: "#2563EB",
                backgroundColor: "rgba(37,99,235,0.1)",
                fill: true,
                tension: 0.4,
            },
        ],
    };

    // 🔮 AI Forecast Chart
    const forecastData = {
        labels: [
            "Jan 1", "Jan 5", "Jan 10", "Jan 15", "Jan 20", "Jan 25", "Jan 30",
            "Feb 4", "Feb 9", "Feb 14", "Feb 19", "Feb 24", "Feb 29",
        ],
        datasets: [
            {
                label: "Actual Sales",
                data: [24000, 26000, 28000, 32000, 36000, 42000, 45000],
                borderColor: "#2563EB",
                backgroundColor: "rgba(37,99,235,0.15)",
                fill: true,
                tension: 0.4,
            },
            {
                label: "AI Forecast (Next 30 Days)",
                data: [46000, 47000, 49000, 52000, 54000, 57000],
                borderColor: "#F59E0B",
                backgroundColor: "rgba(245,158,11,0.2)",
                borderDash: [6, 4],
                fill: true,
                tension: 0.4,
            },
        ],
    };

    const categoryBreakdown = {
        labels: ["Food", "Fashion", "Beauty", "Electronics", "Home"],
        datasets: [
            {
                data: [32, 25, 18, 15, 10],
                backgroundColor: ["#EF4444", "#F59E0B", "#10B981", "#3B82F6", "#6366F1"],
            },
        ],
    };

    const returnRefunds = {
        labels: ["Returned", "Cancelled", "Completed"],
        datasets: [
            {
                data: [5, 3, 92],
                backgroundColor: ["#F87171", "#FBBF24", "#10B981"],
            },
        ],
    };

    const sellerPerformance = [
        { metric: "Avg Delivery Time", value: "22 min", trend: "↓ Faster", color: "text-green-600" },
        { metric: "Cancellation Rate", value: "2.1%", trend: "↓ Improved", color: "text-green-600" },
        { metric: "Return Rate", value: "4.8%", trend: "↑ Slight Rise", color: "text-yellow-600" },
        { metric: "Avg Product Rating", value: "4.6★", trend: "↑ Higher", color: "text-green-600" },
    ];

    const topProducts = [
        { name: "Paneer Tikka", category: "Food", sales: 1200, rating: 4.8, growth: "+12%" },
        { name: "Red Dress", category: "Fashion", sales: 980, rating: 4.5, growth: "+8%" },
        { name: "Gold Earrings", category: "Jewelry", sales: 750, rating: 4.9, growth: "+14%" },
        { name: "Face Cream", category: "Beauty", sales: 540, rating: 4.3, growth: "+5%" },
    ];

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* HEADER */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-1">
                            AI Insights & Reports
                        </h1>
                        <p className="text-sm text-gray-500">
                            Data-driven performance insights, revenue forecasts, and smart recommendations for your LMPIO store.
                        </p>
                    </div>

                    <select
                        value={selectedPeriod}
                        onChange={(e) => setSelectedPeriod(e.target.value)}
                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white shadow-sm hover:shadow-md transition"
                    >
                        <option value="7">Last 7 Days</option>
                        <option value="30">Last 30 Days</option>
                        <option value="90">Last 90 Days</option>
                        <option value="365">Last 1 Year</option>
                    </select>
                </div>

                {/* STATS OVERVIEW */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {[
                        {
                            title: "Total Sales",
                            value: "₹1,52,300",
                            icon: <IndianRupee className="w-5 h-5 text-green-600" />,
                            growth: "+12.4% growth",
                            color: "text-green-600",
                        },
                        {
                            title: "Total Orders",
                            value: "4,560",
                            icon: <ShoppingBag className="w-5 h-5 text-blue-600" />,
                            growth: "+9.8% this month",
                            color: "text-green-600",
                        },
                        {
                            title: "Return Orders",
                            value: "120",
                            icon: <RotateCcw className="w-5 h-5 text-yellow-500" />,
                            growth: "+1.2% higher",
                            color: "text-red-500",
                        },
                        {
                            title: "Active Customers",
                            value: "8,940",
                            icon: <Users className="w-5 h-5 text-purple-600" />,
                            growth: "+7.5% new users",
                            color: "text-green-600",
                        },
                    ].map((card, i) => (
                        <div
                            key={i}
                            className="bg-white p-5 rounded-xl border border-gray-100 flex flex-col hover:shadow-md transition"
                        >
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-semibold text-gray-600">
                                    {card.title}
                                </span>
                                {card.icon}
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">{card.value}</h2>
                            <p
                                className={`text-xs mt-1 flex items-center gap-1 font-medium ${card.color}`}
                            >
                                <TrendingUp className="w-3 h-3" /> {card.growth}
                            </p>
                        </div>
                    ))}
                </div>

                {/* AI PERFORMANCE INSIGHTS */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8 hover:shadow-md transition">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-red-600" /> AI Performance Insights
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                        {sellerPerformance.map((item, i) => (
                            <div
                                key={i}
                                className="bg-gray-50 p-4 rounded-lg border border-gray-100 hover:shadow-md transition"
                            >
                                <p className="text-xs text-gray-500">{item.metric}</p>
                                <p className="text-xl font-bold text-gray-900">{item.value}</p>
                                <p className={`text-xs mt-1 font-medium ${item.color}`}>
                                    {item.trend}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* CHARTS SECTION */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                    <div className="bg-white p-5 rounded-xl border border-gray-100 hover:shadow-md transition">
                        <h2 className="text-sm font-semibold text-gray-600 mb-3">
                            Sales & Orders Trend
                        </h2>
                        <div className="h-[240px]">
                            <Line
                                data={salesTrend}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: { legend: { position: "bottom" } },
                                }}
                            />
                        </div>
                    </div>

                    <div className="bg-white p-5 rounded-xl border border-gray-100 hover:shadow-md transition">
                        <h2 className="text-sm font-semibold text-gray-600 mb-3">
                            Category Breakdown
                        </h2>
                        <div className="h-[240px] flex items-center justify-center">
                            <Doughnut
                                data={categoryBreakdown}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: { legend: { position: "bottom" } },
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* 🔮 AI SALES FORECAST */}
                <div className="bg-white p-6 rounded-xl border border-gray-100 mb-10 hover:shadow-md transition">
                    <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-green-600" /> AI Sales Forecast (Next 30 Days)
                    </h2>
                    <p className="text-sm text-gray-500 mb-3">
                        Based on your current sales growth, LMPIO AI predicts steady revenue growth next month.
                    </p>
                    <div className="h-[260px]">
                        <Line
                            data={forecastData}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: { position: "bottom" },
                                },
                            }}
                        />
                    </div>
                </div>


                {/* RETURN / REFUND SUMMARY (Compact) */}
                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 mb-8 hover:shadow-md transition">
                    <h2 className="text-md font-semibold text-gray-800 mb-3 flex items-center gap-2">
                        <RotateCcw className="w-5 h-5 text-yellow-600" /> Returns & Refunds Overview
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Bar Chart */}
                        <div className="h-[200px]">
                            <Bar
                                data={{
                                    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
                                    datasets: [
                                        { label: "Returns", data: [8, 10, 12, 9], backgroundColor: "#F59E0B" },
                                        { label: "Refunds", data: [6, 9, 10, 8], backgroundColor: "#10B981" },
                                    ],
                                }}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: { legend: { position: "bottom" } },
                                }}
                            />
                        </div>

                        {/* Doughnut Chart */}
                        <div className="flex flex-col justify-center items-center">
                            <div className="w-[250px] h-[250px]">
                                <Doughnut
                                    data={returnRefunds}
                                    options={{
                                        responsive: true,
                                        plugins: { legend: { position: "bottom" } },
                                        cutout: "70%",
                                    }}
                                />
                            </div>
                            <p className="text-xs text-gray-500 mt-2">
                                Return performance (Last 30 Days)
                            </p>
                        </div>
                    </div>
                </div>


                {/* TOP PRODUCTS */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-blue-600" /> Top Performing Products
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {topProducts.map((p, i) => (
                            <div key={i} className="border border-gray-100 rounded-lg p-4 bg-gray-50">
                                <p className="font-semibold text-gray-800">{p.name}</p>
                                <p className="text-xs text-gray-500 mb-2">{p.category}</p>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="font-medium text-gray-700">₹{p.sales}</span>
                                    <span className="text-yellow-500 font-semibold">{p.rating}★</span>
                                </div>
                                <p className="text-xs text-green-600 mt-1">{p.growth} growth</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* RETURNS & TOP PRODUCTS & SUMMARY */}
                <div className="bg-gradient-to-r from-red-50 to-orange-50 p-6 rounded-xl border border-orange-100 hover:shadow-md transition">
                    <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <PieChart className="w-5 h-5 text-red-600" /> AI Summary & Recommendations
                    </h2>
                    <ul className="space-y-2 text-sm text-gray-700">
                        <li>• Delivery speed improved by 9% — great performance.</li>
                        <li>• Beauty & Fashion categories are trending — run seasonal offers.</li>
                        <li>• 80% refunds processed under 24 hrs — excellent consistency.</li>
                        <li>• 5 products dropped in rating — check product packaging & QC.</li>
                        <li>• Restock top 3 high-selling items before the weekend rush.</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
