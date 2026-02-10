"use client";

import { useState } from "react";
import {
  Search,
  Package,
  TrendingUp,
  AlertTriangle,
  Eye,
  X,
  Check,
  Clock,
} from "lucide-react";
import { Doughnut, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import PaginatedTable from "../../components/PaginatedTable";

ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

export default function StockManagementPage() {
  const [search, setSearch] = useState("");
  const [openDrawer, setOpenDrawer] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  // Dummy product stock data
  const stockData = [
    {
      id: 1,
      name: "Paneer Tikka",
      img: "/assets/products/paneer.jpg",
      category: "Dishes",
      stock: 42,
      sold: 138,
      status: "In Stock",
      history: [
        { date: "2026-01-18", qty: 25, note: "Fresh stock received" },
        { date: "2026-01-12", qty: 17, note: "Added after sale" },
        { date: "2026-01-05", qty: 10, note: "Initial batch" },
      ],
    },
    {
      id: 2,
      name: "Lipstick Red",
      img: "/assets/products/lipstick.jpg",
      category: "Beauty",
      stock: 9,
      sold: 310,
      status: "Low Stock",
      history: [
        { date: "2026-01-15", qty: 30, note: "New shipment" },
        { date: "2026-01-10", qty: 10, note: "Restocked after sale" },
      ],
    },
    {
      id: 3,
      name: "Men’s Sneakers",
      img: "/assets/products/shoes.jpg",
      category: "Footwear",
      stock: 0,
      sold: 120,
      status: "Out of Stock",
      history: [{ date: "2025-12-29", qty: 20, note: "Sold out quickly" }],
    },
    {
      id: 4,
      name: "Gold Necklace",
      img: "/assets/products/necklace.jpg",
      category: "Jewelry",
      stock: 20,
      sold: 90,
      status: "In Stock",
      history: [{ date: "2026-01-14", qty: 15, note: "Restocked after sale" }],
    },
  ];

  const filtered = stockData.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalProducts = stockData.length;
  const totalStock = stockData.reduce((a, p) => a + p.stock, 0);
  const lowStock = stockData.filter((p) => p.stock < 10 && p.stock > 0).length;
  const outOfStock = stockData.filter((p) => p.stock === 0).length;

  const stockChartData = {
    labels: ["In Stock", "Low Stock", "Out of Stock"],
    datasets: [
      {
        data: [
          stockData.filter((p) => p.status === "In Stock").length,
          stockData.filter((p) => p.status === "Low Stock").length,
          stockData.filter((p) => p.status === "Out of Stock").length,
        ],
        backgroundColor: ["#10B981", "#F59E0B", "#EF4444"],
        borderWidth: 1,
      },
    ],
  };

  const barChartData = {
    labels: ["Dishes", "Beauty", "Footwear", "Jewelry"],
    datasets: [
      {
        label: "Available Stock",
        data: [42, 9, 0, 20],
        backgroundColor: "#EF4444",
        borderRadius: 4,
      },
    ],
  };

  const handleOpenDrawer = (product: any) => {
    setSelectedProduct(product);
    setOpenDrawer(true);
  };

  const handleRestock = () => {
    alert("✅ Stock updated successfully!");
    setOpenDrawer(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* TOP INSIGHTS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-xl shadow-sm flex items-center gap-3">
            <Package className="w-6 h-6 text-red-600" />
            <div>
              <p className="text-xs text-gray-500">Total Products</p>
              <h3 className="text-lg font-semibold">{totalProducts}</h3>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm flex items-center gap-3">
            <TrendingUp className="w-6 h-6 text-green-600" />
            <div>
              <p className="text-xs text-gray-500">Units in Stock</p>
              <h3 className="text-lg font-semibold">{totalStock}</h3>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-yellow-500" />
            <div>
              <p className="text-xs text-gray-500">Low Stock</p>
              <h3 className="text-lg font-semibold">{lowStock}</h3>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-red-600" />
            <div>
              <p className="text-xs text-gray-500">Out of Stock</p>
              <h3 className="text-lg font-semibold">{outOfStock}</h3>
            </div>
          </div>
        </div>

        {/* SMALLER CHARTS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition">
            <h2 className="text-sm font-semibold text-gray-600 mb-3">
              Stock Overview
            </h2>
            <div className="max-w-[300px] mx-auto">
              <Doughnut
                data={stockChartData}
                options={{ plugins: { legend: { position: "bottom" } } }}
              />
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition">
            <h2 className="text-sm font-semibold text-gray-600 mb-3">
              Category-wise Stock
            </h2>
            <div className="h-[300px]">
              <Bar
                data={barChartData}
                options={{
                  maintainAspectRatio: false,
                  plugins: { legend: { display: false } },
                }}
              />
            </div>
          </div>
        </div>

        {/* STOCK TABLE */}
        <div className="bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800">
              Stock Management
            </h2>
            <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 w-full sm:w-80">
              <Search className="w-4 h-4 text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Search product..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent outline-none text-sm flex-1"
              />
            </div>
          </div>

          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr className="text-left text-gray-600 font-medium">
                <th className="px-4 py-3">Image</th>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Stock Qty</th>
                <th className="px-4 py-3">Sold</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-center">Action</th>
              </tr>
            </thead>

            <PaginatedTable
              data={filtered}
              defaultRows={5}
              renderRow={(item) => (
                <tr
                  key={item.id}
                  className="border-b last:border-0 hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-3">
                    <img
                      src={item.img}
                      alt={item.name}
                      className="w-10 h-10 rounded-md object-cover border"
                    />
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-800">
                    {item.name}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{item.category}</td>
                  <td className="px-4 py-3 font-semibold text-gray-700">
                    {item.stock}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{item.sold}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs font-semibold px-3 py-1 rounded-full ${
                        item.status === "In Stock"
                          ? "bg-green-100 text-green-600"
                          : item.status === "Low Stock"
                          ? "bg-yellow-100 text-yellow-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => handleOpenDrawer(item)}
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

      {/* RESTOCK DRAWER */}
      {openDrawer && selectedProduct && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/30 backdrop-blur-sm">
          <div className="bg-white w-full sm:w-[400px] h-full shadow-xl p-6 flex flex-col animate-slideIn">
            {/* Header */}
            <div className="flex items-center justify-between mb-4 border-b pb-3">
              <h2 className="text-lg font-semibold text-gray-800">
                Restock Product
              </h2>
              <button
                onClick={() => setOpenDrawer(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Product Info */}
            <div className="flex items-center gap-3 mb-6">
              <img
                src={selectedProduct.img}
                alt={selectedProduct.name}
                className="w-16 h-16 rounded-lg border object-cover"
              />
              <div>
                <h3 className="text-md font-semibold text-gray-900">
                  {selectedProduct.name}
                </h3>
                <p className="text-sm text-gray-500">
                  {selectedProduct.category}
                </p>
              </div>
            </div>

            {/* Form */}
            <div className="flex flex-col gap-4 flex-1">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Stock Quantity
                </label>
                <input
                  type="number"
                  defaultValue={selectedProduct.stock}
                  className="w-full mt-1 border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-red-600"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  defaultValue={selectedProduct.status}
                  className="w-full mt-1 border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-red-600"
                >
                  <option>In Stock</option>
                  <option>Low Stock</option>
                  <option>Out of Stock</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Restock Note
                </label>
                <textarea
                  rows={2}
                  placeholder="Add note (e.g. ordered new batch...)"
                  className="w-full mt-1 border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-red-600"
                />
              </div>

              {/* Restock History */}
              <div className="mt-4">
                <h4 className="text-sm font-semibold text-gray-800 mb-2 flex items-center gap-1">
                  <Clock className="w-4 h-4 text-red-600" /> Restock History
                </h4>
                <div className="bg-gray-50 rounded-md border p-2 text-xs text-gray-700 space-y-2 max-h-[120px] overflow-y-auto">
                  {selectedProduct.history.map((h: any, i: number) => (
                    <div
                      key={i}
                      className="flex justify-between items-start border-b last:border-0 pb-1"
                    >
                      <div>
                        <p className="font-medium">{h.note}</p>
                        <p className="text-gray-500">
                          Added {h.qty} pcs — {h.date}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-6 border-t pt-4 flex justify-end">
              <button
                onClick={handleRestock}
                className="flex items-center gap-2 bg-red-600 text-white px-5 py-2 rounded-md font-semibold hover:bg-red-700"
              >
                <Check className="w-4 h-4" /> Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
