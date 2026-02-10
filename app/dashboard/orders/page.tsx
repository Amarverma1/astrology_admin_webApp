"use client";

import { useState } from "react";
import { Search, Eye, FileDown } from "lucide-react";
import dynamic from "next/dynamic";
import PaginatedTable from "../components/PaginatedTable";

// ✅ Dynamic Map imports with typing fixes
const MapContainer = dynamic(
  () =>
    import("react-leaflet").then(
      (m) => m.MapContainer as React.ComponentType<any>
    ),
  { ssr: false }
);
const TileLayer = dynamic(
  () =>
    import("react-leaflet").then(
      (m) => m.TileLayer as React.ComponentType<any>
    ),
  { ssr: false }
);
const Marker = dynamic(
  () =>
    import("react-leaflet").then(
      (m) => m.Marker as React.ComponentType<any>
    ),
  { ssr: false }
);
const Popup = dynamic(
  () =>
    import("react-leaflet").then(
      (m) => m.Popup as React.ComponentType<any>
    ),
  { ssr: false }
);

export default function AllOrdersPage() {
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [openDrawer, setOpenDrawer] = useState(false);
  const [openMap, setOpenMap] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  // ✅ Sample data
  const [orders, setOrders] = useState([
    {
      id: "ORD10231",
      customer: "Riya Sharma",
      phone: "+91 9876543210",
      address: "A-23, Green Park, Delhi",
      items: [
        { name: "Paneer Tikka", img: "/assets/products/paneer.jpg", qty: 1 },
        { name: "Butter Naan", img: "/assets/products/naan.jpg", qty: 2 },
      ],
      payment: "Paid",
      total: 499,
      orderDate: "01/25/2026",
      deliveryDate: "01/25/2026",
      status: "Out for Delivery",
      location: { lat: 28.567, lng: 77.21 },
      rider: {
        name: "Rohit Yadav",
        phone: "+91 9870001111",
        location: { lat: 28.565, lng: 77.215 },
      },
    },
    {
      id: "ORD10232",
      customer: "Amit Verma",
      phone: "+91 9123456789",
      address: "Sector 5, Gurgaon",
      items: [
        { name: "Men’s Sneakers", img: "/assets/products/shoes.jpg", qty: 1 },
      ],
      payment: "COD",
      total: 2599,
      orderDate: "01/24/2026",
      deliveryDate: "01/25/2026",
      status: "Preparing",
      location: { lat: 28.459, lng: 77.067 },
      rider: {
        name: "Deepak Singh",
        phone: "+91 9823456789",
        location: { lat: 28.46, lng: 77.065 },
      },
    },
    {
      id: "ORD10233",
      customer: "Sneha Singh",
      phone: "+91 9112233445",
      address: "MG Road, Bengaluru",
      items: [
        { name: "Gold Necklace", img: "/assets/products/necklace.jpg", qty: 1 },
      ],
      payment: "Paid",
      total: 7999,
      orderDate: "01/22/2026",
      deliveryDate: "01/24/2026",
      status: "Delivered",
      location: { lat: 12.973, lng: 77.611 },
      rider: {
        name: "Karan Patel",
        phone: "+91 9901122334",
        location: { lat: 12.975, lng: 77.613 },
      },
    },
  ]);

  const getStatusColor = (status: string) => {
    const map: Record<string, string> = {
      Pending: "bg-yellow-100 text-yellow-600",
      Preparing: "bg-orange-100 text-orange-600",
      "Out for Delivery": "bg-indigo-100 text-indigo-600",
      Delivered: "bg-green-100 text-green-600",
      Cancelled: "bg-red-100 text-red-600",
    };
    return map[status] || "bg-gray-100 text-gray-600";
  };

  const filtered = orders.filter((o) => {
    const matchesSearch =
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      selectedStatus === "All" || o.status === selectedStatus;
    const orderDate = new Date(o.orderDate);
    const from = fromDate ? new Date(fromDate) : null;
    const to = toDate ? new Date(toDate) : null;
    const matchesDate =
      (!from || orderDate >= from) && (!to || orderDate <= to);

    return matchesSearch && matchesStatus && matchesDate;
  });

  const handleStatusChange = (newStatus: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === selectedOrder.id ? { ...o, status: newStatus } : o
      )
    );
    setSelectedOrder({ ...selectedOrder, status: newStatus });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">All Orders</h1>
            <p className="text-sm text-gray-500">
              View, analyze, and manage all customer orders with rider details.
            </p>
          </div>
        </div>

        {/* Filters + Table */}
        <div className="bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition">
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

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-1.5 text-sm"
            >
              <option>All Status</option>
              <option>Pending</option>
              <option>Preparing</option>
              <option>Out for Delivery</option>
              <option>Delivered</option>
              <option>Cancelled</option>
            </select>

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

          {/* Table */}
          <table className="w-full text-sm border-collapse">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr className="text-gray-600 font-medium">
                <th className="px-4 py-3">O. ID</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Address</th>
                <th className="px-4 py-3">Items</th>
                <th className="px-4 py-3">Payment</th>
                <th className="px-4 py-3">Rider</th>
                <th className="px-4 py-3">O. Date</th>
                <th className="px-4 py-3">Status</th>
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
                  <td className="px-4 py-3 font-semibold text-gray-800">
                    {o.id}
                  </td>
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
                  <td className="px-4 py-3 text-gray-700">
                    {o.rider.name}
                    <br />
                    <span className="text-xs text-gray-500">{o.rider.phone}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{o.orderDate}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                        o.status
                      )}`}
                    >
                      {o.status}
                    </span>
                  </td>
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

      {/* Drawer */}
      {openDrawer && selectedOrder && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/30 backdrop-blur-sm">
          <div className="bg-white w-full sm:w-[460px] h-full shadow-xl p-6 flex flex-col animate-slideIn">
            <div className="flex items-center justify-between mb-4 border-b pb-3">
              <h2 className="text-lg font-semibold text-gray-800">
                Order Details
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
              <p><strong>Rider:</strong> {selectedOrder.rider.name} ({selectedOrder.rider.phone})</p>
              <p><strong>Payment:</strong> {selectedOrder.payment}</p>
              <p><strong>Status:</strong></p>
              <select
                value={selectedOrder.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="border border-gray-300 rounded-md px-2 py-1 text-sm"
              >
                <option>Pending</option>
                <option>Preparing</option>
                <option>Out for Delivery</option>
                <option>Delivered</option>
                <option>Cancelled</option>
              </select>
              <p><strong>Total:</strong> ₹{selectedOrder.total}</p>
            </div>

            {/* Map Section */}
            <div className="flex-1 border rounded-lg overflow-hidden relative">
              <MapContainer
                center={[selectedOrder.location.lat, selectedOrder.location.lng] as [number, number]}
                zoom={14}
                scrollWheelZoom={false}
                className="h-[260px] w-full"
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker
                  position={[selectedOrder.location.lat, selectedOrder.location.lng] as [number, number]}
                >
                  <Popup>Customer: {selectedOrder.customer}</Popup>
                </Marker>
                <Marker
                  position={[selectedOrder.rider.location.lat, selectedOrder.rider.location.lng] as [number, number]}
                >
                  <Popup>Rider: {selectedOrder.rider.name}</Popup>
                </Marker>
              </MapContainer>

              <button
                onClick={() => setOpenMap(true)}
                className="absolute bottom-3 right-3 bg-black text-white px-3 py-1 rounded-md text-xs"
              >
                Open Map
              </button>
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

      {/* Popup Map */}
      {openMap && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl p-4 w-[90%] sm:w-[600px] relative">
            <button
              onClick={() => setOpenMap(false)}
              className="absolute top-2 right-2 bg-red-600 text-white w-7 h-7 rounded-full hover:bg-red-700"
            >
              ✕
            </button>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Live Delivery Map
            </h3>
            <div className="h-[350px] border rounded-lg overflow-hidden">
              <MapContainer
                center={[selectedOrder.location.lat, selectedOrder.location.lng] as [number, number]}
                zoom={14}
                scrollWheelZoom={false}
                className="h-full w-full"
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker
                  position={[selectedOrder.location.lat, selectedOrder.location.lng] as [number, number]}
                >
                  <Popup>Customer: {selectedOrder.customer}</Popup>
                </Marker>
                <Marker
                  position={[selectedOrder.rider.location.lat, selectedOrder.rider.location.lng] as [number, number]}
                >
                  <Popup>Rider: {selectedOrder.rider.name}</Popup>
                </Marker>
              </MapContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
