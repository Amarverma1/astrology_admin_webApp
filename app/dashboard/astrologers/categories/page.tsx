"use client";

import { useState } from "react";
import { Search, Eye } from "lucide-react";
import PaginatedTable from "../../components/PaginatedTable";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function CategoriesPage() {
  const [searchAll, setSearchAll] = useState("");
  const [searchUsed, setSearchUsed] = useState("");

  // Dummy categories data
  const allCategories = [
    { id: 1, name: "Dishes", img: "/assets/categories/food.jpg", parent: "-", type: "Head", active: true },
    { id: 2, name: "Beauty Products", img: "/assets/categories/beauty.jpg", parent: "-", type: "Head", active: true },
    { id: 3, name: "Face Cream", img: "/assets/categories/cream.jpg", parent: "Beauty Products", type: "Sub", active: true },
    { id: 4, name: "Shoes", img: "/assets/categories/shoes.jpg", parent: "-", type: "Head", active: false },
    { id: 5, name: "Men Shoes", img: "/assets/categories/men-shoes.jpg", parent: "Shoes", type: "Sub", active: true },
  ];

  const usedCategories = [
    { id: 6, name: "Jewelry", img: "/assets/categories/jewelry.jpg", parent: "-", type: "Head", active: true },
    { id: 7, name: "Gold Necklace", img: "/assets/categories/necklace.jpg", parent: "Jewelry", type: "Sub", active: true },
    { id: 8, name: "Street Food", img: "/assets/categories/street.jpg", parent: "Dishes", type: "Sub", active: true },
  ];

  const filteredAll = allCategories.filter((cat) =>
    cat.name.toLowerCase().includes(searchAll.toLowerCase())
  );

  const filteredUsed = usedCategories.filter((cat) =>
    cat.name.toLowerCase().includes(searchUsed.toLowerCase())
  );

  const toggleActive = (id: number, setFunc: any) => {
    setFunc((prev: any) =>
      prev.map((cat: any) =>
        cat.id === id ? { ...cat, active: !cat.active } : cat
      )
    );
  };

  // Doughnut chart for category insights
  const categoryData = {
    labels: ["Food", "Beauty", "Fashion", "Footwear"],
    datasets: [
      {
        label: "Top Categories",
        data: [45, 25, 20, 10],
        backgroundColor: ["#EF4444", "#F59E0B", "#3B82F6", "#10B981"],
        borderWidth: 2,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Side: Category Insights */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <div className="bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition">
            <h2 className="text-sm font-semibold text-gray-600 mb-3">
              Top Categories
            </h2>
            <Doughnut
              data={categoryData}
              options={{
                plugins: { legend: { position: "bottom" } },
              }}
            />
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition">
            <h2 className="text-sm font-semibold text-gray-600 mb-3">
              Quick Stats
            </h2>
            <ul className="text-sm text-gray-700 space-y-2">
              <li>🟢 Active Categories: <b>7</b></li>
              <li>🔴 Inactive Categories: <b>2</b></li>
              <li>⭐ Top Used: <b>Dishes</b></li>
            </ul>
          </div>
        </div>

        {/* Right Side: Tables */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          {/* All Categories Table */}
          <div className="bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-800">All Categories</h2>
              <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 w-full sm:w-80">
                <Search className="w-4 h-4 text-gray-400 mr-2" />
                <input
                  type="text"
                  placeholder="Search category..."
                  value={searchAll}
                  onChange={(e) => setSearchAll(e.target.value)}
                  className="bg-transparent outline-none text-sm flex-1"
                />
              </div>
            </div>

            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100 sticky top-0 z-10">
                <tr className="text-left text-gray-600 font-medium">
                  <th className="px-4 py-3">Image</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Parent</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-center">View</th>
                </tr>
              </thead>

              <PaginatedTable
                data={filteredAll}
                defaultRows={4}
                renderRow={(item) => (
                  <tr key={item.id} className="border-b last:border-0 hover:bg-gray-50 transition">
                    <td className="px-4 py-3">
                      <img
                        src={item.img}
                        alt={item.name}
                        className="w-10 h-10 rounded-md object-cover border border-gray-200"
                      />
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-800">
                      {item.name}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{item.parent}</td>
                    <td className="px-4 py-3 text-gray-600">{item.type}</td>
                    <td className="px-4 py-3">
                      <label className="inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={item.active}
                          onChange={() => toggleActive(item.id, setCategories)}
                          className="sr-only peer"
                        />
                        <div className="relative w-10 h-5 bg-gray-200 rounded-full peer-checked:bg-red-600 transition-all">
                          <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transform transition-all peer-checked:translate-x-5"></div>
                        </div>
                      </label>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button className="p-1.5 bg-gray-100 rounded-full hover:bg-gray-200 text-gray-700">
                        <Eye className="w-4 h-4 text-red-600" />
                      </button>
                    </td>
                  </tr>
                )}
              />
            </table>
          </div>

          {/* Used Categories Table */}
          <div className="bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-800">Used By You Categories</h2>
              <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 w-full sm:w-80">
                <Search className="w-4 h-4 text-gray-400 mr-2" />
                <input
                  type="text"
                  placeholder="Search category..."
                  value={searchUsed}
                  onChange={(e) => setSearchUsed(e.target.value)}
                  className="bg-transparent outline-none text-sm flex-1"
                />
              </div>
            </div>

            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100 sticky top-0 z-10">
                <tr className="text-left text-gray-600 font-medium">
                  <th className="px-4 py-3">Image</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Parent</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-center">View</th>
                </tr>
              </thead>

              <PaginatedTable
                data={filteredUsed}
                defaultRows={4}
                renderRow={(item) => (
                  <tr key={item.id} className="border-b last:border-0 hover:bg-gray-50 transition">
                    <td className="px-4 py-3">
                      <img
                        src={item.img}
                        alt={item.name}
                        className="w-10 h-10 rounded-md object-cover border border-gray-200"
                      />
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-800">
                      {item.name}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{item.parent}</td>
                    <td className="px-4 py-3 text-gray-600">{item.type}</td>
                    <td className="px-4 py-3">
                      <label className="inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={item.active}
                          onChange={() => toggleActive(item.id, setCategories)}
                          className="sr-only peer"
                        />
                        <div className="relative w-10 h-5 bg-gray-200 rounded-full peer-checked:bg-red-600 transition-all">
                          <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transform transition-all peer-checked:translate-x-5"></div>
                        </div>
                      </label>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button className="p-1.5 bg-gray-100 rounded-full hover:bg-gray-200 text-gray-700">
                        <Eye className="w-4 h-4 text-red-600" />
                      </button>
                    </td>
                  </tr>
                )}
              />
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
