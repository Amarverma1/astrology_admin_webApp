"use client";

import { useState } from "react";
import {
  Search,
  Eye,
  FileDown,
  XCircle,
  BarChart3,
  PieChart,
  AlertTriangle,
  IndianRupee,
} from "lucide-react";
import dynamic from "next/dynamic";
import PaginatedTable from "../../components/PaginatedTable";
import { Doughnut, Bar } from "react-chartjs-2";
import {

  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

// ✅ Dynamic Map imports
const MapContainer = dynamic(
  () => import("react-leaflet").then((m) => m.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((m) => m.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((m) => m.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import("react-leaflet").then((m) => m.Popup),
  { ssr: false }
);

export default function CancelledOrdersPage() {
  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [openDrawer, setOpenDrawer] = useState(false);
  const [openMap, setOpenMap] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  // ✅ Cancelled Orders data
  const [orders] = useState([
    {
      id: "ORD10611",
      customer: "Riya Sharma",
      phone: "+91 9876543210",
      address: "A-23, Green Park, Delhi",
      items: [
        { name: "Butter Chicken", img: "/assets/products/butterchicken.jpg", qty: 1 },
      ],
      payment: "Paid (UPI)",
      total: 349,
      orderDate: "01/23/2026",
      cancelDate: "01/23/2026",
      status: "Cancelled",
      reason: "Customer unavailable",
      location: { lat: 28.567, lng: 77.210 },
    },
    {
      id: "ORD10612",
      customer: "Amit Verma",
      phone: "+91 9123456789",
      address: "Sector 5, Gurgaon",
      items: [
        { name: "Men’s Sneakers", img: "/assets/products/shoes.jpg", qty: 1 },
      ],
      payment: "COD",
      total: 2599,
      orderDate: "01/22/2026",
      cancelDate: "01/22/2026",
      status: "Cancelled",
      reason: "Payment not confirmed",
      location: { lat: 28.459, lng: 77.067 },
    },
    {
      id: "ORD10613",
      customer: "Sneha Singh",
      phone: "+91 9112233445",
      address: "MG Road, Bengaluru",
      items: [
        { name: "Gold Necklace", img: "/assets/products/necklace.jpg", qty: 1 },
      ],
      payment: "Paid (Card)",
      total: 7999,
      orderDate: "01/21/2026",
      cancelDate: "01/21/2026",
      status: "Cancelled",
      reason: "Seller rejected due to stock issue",
      location: { lat: 12.973, lng: 77.611 },
    },
  ]);

  const totalCancelled = orders.length;
  const totalLoss = orders.reduce((sum, o) => sum + o.total, 0);
  const avgLoss = (totalLoss / totalCancelled).toFixed(0);

  const filtered = orders.filter((o) => {
    const matchesSearch =
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.toLowerCase().includes(search.toLowerCase());
    const orderDate = new Date(o.orderDate);
    const from = fromDate ? new Date(fromDate) : null;
    const to = toDate ? new Date(toDate) : null;
    const matchesDate =
      (!from || orderDate >= from) && (!to || orderDate <= to);
    return matchesSearch && matchesDate;
  });

  // ✅ Charts
  const barData = {
    labels: ["Delhi", "Gurgaon", "Bengaluru"],
    datasets: [
      {
        label: "Cancelled Orders",
        data: [4, 3, 2],
        backgroundColor: "#EF4444",
      },
    ],
  };

  const doughnutData = {
    labels: ["Customer Unavailable", "Payment Issue", "Stock Issue"],
    datasets: [
      {
        data: [45, 30, 25],
        backgroundColor: ["#EF4444", "#F59E0B", "#6366F1"],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            Cancelled Orders
          </h1>
          <p className="text-sm text-gray-500">
            Review all cancelled orders, understand reasons, and identify trends.
          </p>
        </div>

        {/* INSIGHTS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-5 rounded-xl shadow-sm border">
            <div className="flex items-center gap-3 mb-2">
              <XCircle className="w-5 h-5 text-red-600" />
              <h3 className="font-semibold text-gray-700">Total Cancelled</h3>
            </div>
            <p className="text-2xl font-bold text-gray-900">{totalCancelled}</p>
            <p className="text-xs text-gray-500">All-time cancellations</p>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm border">
            <div className="flex items-center gap-3 mb-2">
              <IndianRupee className="w-5 h-5 text-red-500" />
              <h3 className="font-semibold text-gray-700">Revenue Lost</h3>
            </div>
            <p className="text-2xl font-bold text-gray-900">₹{totalLoss}</p>
            <p className="text-xs text-gray-500">Total cancelled order value</p>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm border">
            <div className="flex items-center gap-3 mb-2">
              <AlertTriangle className="w-5 h-5 text-yellow-500" />
              <h3 className="font-semibold text-gray-700">Avg Order Loss</h3>
            </div>
            <p className="text-2xl font-bold text-gray-900">₹{avgLoss}</p>
            <p className="text-xs text-gray-500">Per cancelled order</p>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm border">
            <div className="flex items-center gap-3 mb-2">
              <PieChart className="w-5 h-5 text-purple-600" />
              <h3 className="font-semibold text-gray-700">Top Reason</h3>
            </div>
            <p className="text-2xl font-bold text-gray-900">Customer Unavailable</p>
            <p className="text-xs text-gray-500">Most common cancellation cause</p>
          </div>
        </div>

        {/* CHARTS (small height) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-sm font-semibold text-gray-600 mb-3">
              Cancellations by City
            </h2>
            <div className="h-[200px]">
              <Bar
                data={barData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { display: false } },
                }}
              />
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-sm font-semibold text-gray-600 mb-3">
              Cancellation Reasons
            </h2>
            <div className="h-[200px] flex items-center justify-center">
              <Doughnut
                data={doughnutData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { position: "bottom" } },
                  cutout: "70%",
                }}
              />
            </div>
          </div>
        </div>

        {/* FILTERS + TABLE */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
          <div className="flex flex-wrap items-center gap-3 mb-5">
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-1.5 text-sm"
            />
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-1.5 text-sm"
            />

            <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 w-full sm:w-80 ml-auto">
              <Search className="w-4 h-4 text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Search by name or order id..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent outline-none text-sm flex-1"
              />
            </div>

            <button className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-gray-800">
              <FileDown className="w-4 h-4" /> Export
            </button>
          </div>

          {/* TABLE */}
          <table className="w-full text-sm border-collapse">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr className="text-gray-600 font-medium">
                <th className="px-4 py-3">O. ID</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Address</th>
                <th className="px-4 py-3">Items</th>
                <th className="px-4 py-3">Payment</th>
                <th className="px-4 py-3">Reason</th>
                <th className="px-4 py-3">Cancelled On</th>
                <th className="px-4 py-3 text-center">Action</th>
              </tr>
            </thead>

            <PaginatedTable
              data={filtered}
              defaultRows={5}
              renderRow={(o) => (
                <tr
                  key={o.id}
                  className="border-b last:border-0 hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-3 font-semibold text-gray-800">{o.id}</td>
                  <td className="px-4 py-3 text-gray-800">
                    {o.customer}
                    <br />
                    <span className="text-xs text-gray-500">{o.phone}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{o.address}</td>
                  <td className="px-4 py-3 space-y-1">
                    {o.items.map((item, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <img
                          src={item.img}
                          alt={item.name}
                          className="w-8 h-8 rounded-md border"
                        />
                        <span className="text-gray-700 text-sm">
                          {item.name} (x{item.qty})
                        </span>
                      </div>
                    ))}
                  </td>
                  <td className="px-4 py-3 text-gray-700">{o.payment}</td>
                  <td className="px-4 py-3 text-red-600 font-medium">{o.reason}</td>
                  <td className="px-4 py-3 text-gray-600">{o.cancelDate}</td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => {
                        setSelectedOrder(o);
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
      {openDrawer && selectedOrder && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/30 backdrop-blur-sm">
          <div className="bg-white w-full sm:w-[460px] h-full shadow-xl p-6 flex flex-col animate-slideIn">
            <div className="flex items-center justify-between mb-4 border-b pb-3">
              <h2 className="text-lg font-semibold text-gray-800">
                Cancelled Order Details
              </h2>
              <button
                onClick={() => setOpenDrawer(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-sm text-gray-700 mb-4">
              <p><strong>Order ID:</strong> {selectedOrder.id}</p>
              <p><strong>Customer:</strong> {selectedOrder.customer} ({selectedOrder.phone})</p>
              <p><strong>Address:</strong> {selectedOrder.address}</p>
              <p><strong>Reason:</strong> {selectedOrder.reason}</p>
              <p><strong>Payment:</strong> {selectedOrder.payment}</p>
              <p><strong>Total:</strong> ₹{selectedOrder.total}</p>
              <p><strong>Cancelled On:</strong> {selectedOrder.cancelDate}</p>
            </div>

            <div className="flex-1 border rounded-lg overflow-hidden relative">
              <MapContainer
                center={[selectedOrder.location.lat, selectedOrder.location.lng]}
                zoom={14}
                scrollWheelZoom={false}
                className="h-[260px] w-full"
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={[selectedOrder.location.lat, selectedOrder.location.lng]}>
                  <Popup>Customer: {selectedOrder.customer}</Popup>
                </Marker>
              </MapContainer>
            </div>

            <div className="mt-4 border-t pt-3 flex justify-end">
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
