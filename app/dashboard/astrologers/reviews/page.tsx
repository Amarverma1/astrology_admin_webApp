"use client";

import { useState } from "react";
import {
  Search,
  Star,
  MessageSquare,
  ThumbsUp,
  Eye,
  Flag,
  CheckCircle,
  X,
  Clock,
} from "lucide-react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import PaginatedTable from "../../components/PaginatedTable";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function AstrologerReviewsPage() {
  const [search, setSearch] = useState("");
  const [openDrawer, setOpenDrawer] = useState(false);
  const [selected, setSelected] = useState<any>(null);

  const reviews = [
    {
      id: 1,
      astrologer: "Pandit Rahul Sharma",
      astrologerImg: "/assets/astrologers/rahul.jpg",
      user: "Riya Sharma",
      userImg: "/assets/users/riya.jpg",
      rating: 5,
      comment: "Very accurate prediction. Explained everything calmly 🙏",
      date: "2026-01-23",
      helpful: 42,
      status: "Approved",
    },
    {
      id: 2,
      astrologer: "Astro Meena Ji",
      astrologerImg: "/assets/astrologers/meena.jpg",
      user: "Amit Verma",
      userImg: "/assets/users/amit.jpg",
      rating: 4,
      comment: "Good guidance but response time was a bit slow.",
      date: "2026-01-20",
      helpful: 18,
      status: "Approved",
    },
    {
      id: 3,
      astrologer: "Guru Dev",
      astrologerImg: "/assets/astrologers/guru.jpg",
      user: "Sneha Singh",
      userImg: "/assets/users/sneha.jpg",
      rating: 2,
      comment: "Did not fully match my expectations.",
      date: "2026-01-18",
      helpful: 5,
      status: "Flagged",
    },
  ];

  const filtered = reviews.filter(
    (r) =>
      r.astrologer.toLowerCase().includes(search.toLowerCase()) ||
      r.user.toLowerCase().includes(search.toLowerCase())
  );

  const ratingCounts = [5, 4, 3, 2, 1].map(
    (n) => reviews.filter((r) => r.rating === n).length
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-5">

        {/* HEADER */}
        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            Astrologer Reviews
          </h1>
          <p className="text-sm text-gray-500">
            Reviews submitted by users
          </p>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Stat icon={MessageSquare} label="Total Reviews" value={reviews.length} />
          <Stat icon={Star} label="Average Rating" value="4.0 / 5" color="text-yellow-500" />
          <Stat icon={CheckCircle} label="Approved" value={2} color="text-green-600" />
          <Stat icon={Flag} label="Flagged" value={1} color="text-red-600" />
        </div>

        {/* CHART */}
        <div className="bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition">
          <p className="text-sm font-medium text-gray-600 mb-2">
            Rating Distribution
          </p>
          <div className="h-[160px]">
            <Bar
              data={{
                labels: ["5★", "4★", "3★", "2★", "1★"],
                datasets: [
                  {
                    data: ratingCounts,
                    backgroundColor: "#EF4444",
                    borderRadius: 6,
                  },
                ],
              }}
              options={{
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: { y: { beginAtZero: true } },
              }}
            />
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-gray-800">
              All Reviews
            </h2>

            <div className="flex items-center bg-gray-50 rounded-lg px-3 py-2 w-72">
              <Search className="w-4 h-4 text-gray-400 mr-2" />
              <input
                className="bg-transparent outline-none text-sm w-full"
                placeholder="Search astrologer or user"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr className="text-gray-600 font-medium">
                <th className="px-4 py-3">Astrologer</th>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Rating</th>
                <th className="px-4 py-3">Review</th>
                <th className="px-4 py-3 text-center">Action</th>
              </tr>
            </thead>

            <PaginatedTable
              data={filtered}
              defaultRows={5}
              renderRow={(r) => (
                <tr
                  key={r.id}
                  className="hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-3">{r.astrologer}</td>
                  <td className="px-4 py-3">{r.user}</td>

                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < r.rating
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </td>

                  <td className="px-4 py-3 text-gray-600 max-w-[260px] truncate">
                    {r.comment}
                  </td>

                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => {
                        setSelected(r);
                        setOpenDrawer(true);
                      }}
                      className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"
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
      {openDrawer && selected && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/30">
          <div className="bg-white w-full sm:w-[420px] h-full p-6 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-semibold text-gray-800">
                Review Details
              </h3>
              <button onClick={() => setOpenDrawer(false)}>
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="space-y-3 text-sm text-gray-700">
              <p><b>Astrologer:</b> {selected.astrologer}</p>
              <p><b>User:</b> {selected.user}</p>
              <p><b>Rating:</b> {selected.rating} / 5</p>
              <p><b>Date:</b> {selected.date}</p>
              <p><b>Helpful:</b> {selected.helpful}</p>
              <p><b>Status:</b> {selected.status}</p>

              <div className="bg-gray-50 rounded-lg p-3">
                {selected.comment}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* STAT CARD */
function Stat({ icon: Icon, label, value, color = "text-red-600" }: any) {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition flex gap-3">
      <Icon className={`w-5 h-5 ${color}`} />
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-sm font-semibold text-gray-900">{value}</p>
      </div>
    </div>
  );
}
