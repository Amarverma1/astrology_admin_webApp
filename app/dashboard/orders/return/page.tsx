"use client";

import { useState } from "react";
import {
  Search,
  Eye,
  FileDown,
  RotateCcw,
  BarChart3,
  PieChart,
  AlertTriangle,
  IndianRupee,
  Bike,
  CreditCard,
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

export default function ReturnedOrdersPage() {
  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [openDrawer, setOpenDrawer] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  // ✅ Sample Returned Orders data with Refund + Rider
  const [orders] = useState([
    {
      id: "RET20101",
      customer: "Riya Sharma",
      phone: "+91 9876543210",
      address: "A-23, Green Park, Delhi",
      items: [
        { name: "Red Dress", img: "/assets/products/dress.jpg", qty: 1 },
      ],
      payment: "Paid (UPI)",
      total: 1299,
      orderDate: "01/20/2026",
      returnDate: "01/24/2026",
      status: "Returned",
      reason: "Size not fitting",
      condition: "Good",
      refundStatus: "Processed",
      location: { lat: 28.567, lng: 77.210 },
      rider: { name: "Rohit Yadav", phone: "+91 9870001111", lat: 28.568, lng: 77.214 },
    },
    {
      id: "RET20102",
      customer: "Amit Verma",
      phone: "+91 9123456789",
      address: "Sector 5, Gurgaon",
      items: [
        { name: "Wireless Headphones", img: "/assets/products/headphones.jpg", qty: 1 },
      ],
      payment: "Paid (Card)",
      total: 2599,
      orderDate: "01/18/2026",
      returnDate: "01/22/2026",
      status: "Returned",
      reason: "Product not working",
      condition: "Defective",
      refundStatus: "Pending",
      location: { lat: 28.459, lng: 77.067 },
      rider: { name: "Deepak Singh", phone: "+91 9823456789", lat: 28.460, lng: 77.065 },
    },
    {
      id: "RET20103",
      customer: "Sneha Singh",
      phone: "+91 9112233445",
      address: "MG Road, Bengaluru",
      items: [
        { name: "Gold Earrings", img: "/assets/products/earrings.jpg", qty: 1 },
      ],
      payment: "Paid (Card)",
      total: 5999,
      orderDate: "01/16/2026",
      returnDate: "01/20/2026",
      status: "Returned",
      reason: "Received wrong item",
      condition: "Unused",
      refundStatus: "Failed",
      location: { lat: 12.973, lng: 77.611 },
      rider: { name: "Karan Patel", phone: "+91 9901122334", lat: 12.975, lng: 77.613 },
    },
  ]);

  const totalReturns = orders.length;
  const totalValue = orders.reduce((sum, o) => sum + o.total, 0);
  const avgValue = (totalValue / totalReturns).toFixed(0);

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

  const getRefundColor = (status: string) => {
    switch (status) {
      case "Processed":
        return "text-green-600 bg-green-50";
      case "Pending":
        return "text-yellow-600 bg-yellow-50";
      case "Failed":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  // ✅ Charts
  const barData = {
    labels: ["Delhi", "Gurgaon", "Bengaluru"],
    datasets: [
      {
        label: "Returned Orders",
        data: [5, 3, 2],
        backgroundColor: "#F59E0B",
      },
    ],
  };

  const doughnutData = {
    labels: ["Size Issue", "Defective", "Wrong Item"],
    datasets: [
      {
        data: [40, 35, 25],
        backgroundColor: ["#F59E0B", "#EF4444", "#3B82F6"],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            Returned Orders
          </h1>
          <p className="text-sm text-gray-500">
            Track and analyze all returned orders, riders, and refund progress.
          </p>
        </div>

        {/* INSIGHTS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-5 rounded-xl shadow-sm border  hover:shadow-md transition">
            <div className="flex items-center gap-3 mb-2">
              <RotateCcw className="w-5 h-5 text-amber-600" />
              <h3 className="font-semibold text-gray-700">Total Returns</h3>
            </div>
            <p className="text-2xl font-bold text-gray-900">{totalReturns}</p>
            <p className="text-xs text-gray-500">Total returned orders</p>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm border  hover:shadow-md transition">
            <div className="flex items-center gap-3 mb-2">
              <IndianRupee className="w-5 h-5 text-green-600" />
              <h3 className="font-semibold text-gray-700">Total Value</h3>
            </div>
            <p className="text-2xl font-bold text-gray-900">₹{totalValue}</p>
            <p className="text-xs text-gray-500">Total returned order worth</p>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm border  hover:shadow-md transition">
            <div className="flex items-center gap-3 mb-2">
              <AlertTriangle className="w-5 h-5 text-yellow-500" />
              <h3 className="font-semibold text-gray-700">Avg Order Value</h3>
            </div>
            <p className="text-2xl font-bold text-gray-900">₹{avgValue}</p>
            <p className="text-xs text-gray-500">Per returned order</p>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm border  hover:shadow-md transition">
            <div className="flex items-center gap-3 mb-2">
              <PieChart className="w-5 h-5 text-purple-600" />
              <h3 className="font-semibold text-gray-700">Top Reason</h3>
            </div>
            <p className="text-2xl font-bold text-gray-900">Size Issue</p>
            <p className="text-xs text-gray-500">Most common return cause</p>
          </div>
        </div>

        {/* CHARTS (Compact) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100  hover:shadow-md transition">
            <h2 className="text-sm font-semibold text-gray-600 mb-3">
              Returns by City
            </h2>
            <div className="h-[200px]">
              <Bar data={barData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100  hover:shadow-md transition">
            <h2 className="text-sm font-semibold text-gray-600 mb-3">
              Return Reasons
            </h2>
            <div className="h-[200px] flex items-center justify-center">
              <Doughnut data={doughnutData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: "bottom" } }, cutout: "70%" }} />
            </div>
          </div>
        </div>

        {/* FILTERS + TABLE */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
          <div className="flex flex-wrap items-center gap-3 mb-5">
            <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="border border-gray-300 rounded-md px-3 py-1.5 text-sm" />
            <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="border border-gray-300 rounded-md px-3 py-1.5 text-sm" />

            <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 w-full sm:w-80 ml-auto">
              <Search className="w-4 h-4 text-gray-400 mr-2" />
              <input type="text" placeholder="Search by name or order id..." value={search} onChange={(e) => setSearch(e.target.value)} className="bg-transparent outline-none text-sm flex-1" />
            </div>

            <button className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-gray-800">
              <FileDown className="w-4 h-4" /> Export
            </button>
          </div>

          {/* TABLE */}
          <table className="w-full text-sm border-collapse">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr className="text-gray-600 font-medium">
                <th className="px-4 py-3">R. ID</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Address</th>
                <th className="px-4 py-3">Items</th>
                <th className="px-4 py-3">Rider</th>
                <th className="px-4 py-3">Payment</th>
                <th className="px-4 py-3">Refund Status</th>
                <th className="px-4 py-3">Returned On</th>
                <th className="px-4 py-3 text-center">Action</th>
              </tr>
            </thead>

            <PaginatedTable
              data={filtered}
              defaultRows={5}
              renderRow={(o) => (
                <tr key={o.id} className="border-b last:border-0 hover:bg-gray-50 transition">
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
                        <img src={item.img} alt={item.name} className="w-8 h-8 rounded-md border" />
                        <span className="text-gray-700 text-sm">{item.name} (x{item.qty})</span>
                      </div>
                    ))}
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    {o.rider.name}
                    <br />
                    <span className="text-xs text-gray-500">{o.rider.phone}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-700">{o.payment}</td>
                  <td className={`px-4 py-3 text-sm font-medium rounded-lg ${getRefundColor(o.refundStatus)}`}>
                    {o.refundStatus}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{o.returnDate}</td>
                  <td className="px-4 py-3 text-center">
                    <button onClick={() => { setSelectedOrder(o); setOpenDrawer(true); }} className="p-1.5 bg-gray-100 rounded-full hover:bg-gray-200">
                      <Eye className="w-4 h-4 text-amber-600" />
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
              <h2 className="text-lg font-semibold text-gray-800">Returned Order Details</h2>
              <button onClick={() => setOpenDrawer(false)} className="p-2 hover:bg-gray-100 rounded-full">✕</button>
            </div>

            <div className="space-y-2 text-sm text-gray-700 mb-4">
              <p><strong>Order ID:</strong> {selectedOrder.id}</p>
              <p><strong>Customer:</strong> {selectedOrder.customer} ({selectedOrder.phone})</p>
              <p><strong>Address:</strong> {selectedOrder.address}</p>
              <p><strong>Rider:</strong> {selectedOrder.rider.name} ({selectedOrder.rider.phone})</p>
              <p><strong>Reason:</strong> {selectedOrder.reason}</p>
              <p><strong>Condition:</strong> {selectedOrder.condition}</p>
              <p><strong>Payment:</strong> {selectedOrder.payment}</p>
              <p><strong>Refund Status:</strong> {selectedOrder.refundStatus}</p>
              <p><strong>Total:</strong> ₹{selectedOrder.total}</p>
              <p><strong>Returned On:</strong> {selectedOrder.returnDate}</p>
            </div>

            {/* MAP */}
            <div className="flex-1 border rounded-lg overflow-hidden relative">
              <MapContainer
                center={[selectedOrder.location.lat, selectedOrder.location.lng]}
                zoom={14}
                scrollWheelZoom={false}
                className="h-[260px] w-full"
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {/* Customer marker */}
                <Marker position={[selectedOrder.location.lat, selectedOrder.location.lng]}>
                  <Popup>Customer: {selectedOrder.customer}</Popup>
                </Marker>
                {/* Rider marker */}
                <Marker position={[selectedOrder.rider.lat, selectedOrder.rider.lng]}>
                  <Popup>Rider: {selectedOrder.rider.name}</Popup>
                </Marker>
              </MapContainer>
            </div>

            <div className="mt-4 border-t pt-3 flex justify-end">
              <button onClick={() => setOpenDrawer(false)} className="bg-amber-600 text-white px-5 py-2 rounded-md text-sm font-semibold hover:bg-amber-700">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
