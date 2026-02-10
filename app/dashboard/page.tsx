"use client";

import { Bar, Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend
);

export default function DashboardPage() {
  /* -------------------- STATIC ASTRO DATA -------------------- */

  const stats = [
    { label: "Total Astrologers", value: 18, color: "bg-indigo-100 text-indigo-600" },
    { label: "Active Users", value: 1240, color: "bg-green-100 text-green-600" },
    { label: "Today Consultations", value: 86, color: "bg-blue-100 text-blue-600" },
    { label: "Pending Requests", value: 12, color: "bg-yellow-100 text-yellow-600" },
    { label: "Reports Generated", value: 320, color: "bg-purple-100 text-purple-600" },
    { label: "Live Sessions", value: 4, color: "bg-pink-100 text-pink-600" },
  ];

  const weeklyConsultationData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Consultations",
        data: [120, 140, 110, 160, 190, 210, 180],
        borderColor: "#6366F1",
        backgroundColor: "rgba(99,102,241,0.25)",
        tension: 0.3,
      },
    ],
  };

  const consultationTypeData = {
    labels: ["Chat", "Call", "Video"],
    datasets: [
      {
        data: [420, 280, 160],
        backgroundColor: ["#BFDBFE", "#BBF7D0", "#FDE68A"],
      },
    ],
  };

  const zodiacInterestData = {
    labels: ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra"],
    datasets: [
      {
        data: [120, 90, 140, 160, 110, 100, 130],
        backgroundColor: [
          "#FECACA",
          "#FDBA74",
          "#FCD34D",
          "#A7F3D0",
          "#93C5FD",
          "#C4B5FD",
          "#F9A8D4",
        ],
      },
    ],
  };

  /* -------------------- UI -------------------- */

  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Overview</h1>
        <p className="text-gray-500 text-sm">Astrology platform snapshot</p>
      </div>

      {/* Stats (SAME CARD STYLE) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {stats.map((s, i) => (
          <div
            key={i}
            className="rounded-xl shadow-sm bg-white p-5 hover:shadow-md transition-shadow duration-200"
          >
            <p
              className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${s.color} mb-2`}
            >
              {s.label}
            </p>
            <h3 className="text-2xl font-bold">{s.value}</h3>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition">
          <h2 className="text-sm font-semibold mb-3">
            Weekly Consultations
          </h2>
          <Line data={weeklyConsultationData} />
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition">
          <h2 className="text-sm font-semibold mb-3">
            Consultation Types
          </h2>
          <Bar data={consultationTypeData} />
        </div>
      </div>

      {/* Zodiac + Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition">
          <h2 className="text-sm font-semibold text-gray-600 mb-3">
            Zodiac Interest
          </h2>
          <Doughnut
            data={zodiacInterestData}
            options={{ plugins: { legend: { position: "bottom" } } }}
          />
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition lg:col-span-2">
          <h2 className="text-sm font-semibold text-gray-600 mb-4">
            Platform Insights
          </h2>

          <ul className="space-y-2 text-sm text-gray-700">
            <li>🌙 Peak consultation time: <b>7 PM – 10 PM</b></li>
            <li>🔮 Most requested service: <b>Kundli Matching</b></li>
            <li>⭐ Highest astrologer rating: <b>4.9 / 5</b></li>
            <li>📈 Weekly user growth: <b>+12%</b></li>
            <li>🪐 Most searched zodiac: <b>Cancer</b></li>
          </ul>
        </div>
      </div>
    </div>
  );
}
