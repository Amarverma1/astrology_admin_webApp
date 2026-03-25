"use client";

import { useState, useEffect } from "react";
import { Search, Eye, FileDown } from "lucide-react";
import dynamic from "next/dynamic";
import axios from "axios";
import PaginatedTable from "../components/PaginatedTable";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE!;

/* MAP COMPONENTS */
const MapContainer = dynamic(
  () => import("react-leaflet").then((m) => m.MapContainer as any),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((m) => m.TileLayer as any),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((m) => m.Marker as any),
  { ssr: false }
);
const Popup = dynamic(
  () => import("react-leaflet").then((m) => m.Popup as any),
  { ssr: false }
);

export default function AllOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [openDrawer, setOpenDrawer] = useState(false);
  const [openMap, setOpenMap] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  /* HELPERS */
  const capitalize = (s: string) =>
    s ? s.charAt(0).toUpperCase() + s.slice(1) : "";

  const getStatusColor = (status: string) => {
    const map: Record<string, string> = {
      Pending: "bg-yellow-100 text-yellow-600",
      Confirmed: "bg-blue-100 text-blue-600",
      Processing: "bg-orange-100 text-orange-600",
      Shipped: "bg-indigo-100 text-indigo-600",
      Delivered: "bg-green-100 text-green-600",
      Cancelled: "bg-red-100 text-red-600",
    };
    return map[status] || "bg-gray-100 text-gray-600";
  };

  /* FETCH ORDERS */
  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${API_BASE}/order/admin/orders`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });

      const formatted = res.data.map((o: any) => ({
        id: `ORD${o.id}`,
        rawId: o.id,
        customer: o.user_name || "User",
        phone: o.phone || "",
        address: o.address || "N/A",
        items: [
          {
            name: o.product_name,
            img: o.preview_image,
            qty: o.total_quantity,
          },
        ],
        payment: o.payment_method,
        total: o.total_amount,
        orderDate: new Date(o.created_at).toLocaleDateString(),
        status: capitalize(o.status),
        location: { lat: 28.61, lng: 77.20 },
        rider: {
          name: "Not Assigned",
          phone: "",
          location: { lat: 28.61, lng: 77.20 },
        },
      }));

      setOrders(formatted);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  /* UPDATE STATUS */
  const handleStatusChange = async (newStatus: string) => {
    try {
      await axios.put(
        `${API_BASE}/admin/orders/${selectedOrder.rawId}/status`,
        { status: newStatus.toLowerCase() },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setOrders((prev) =>
        prev.map((o) =>
          o.rawId === selectedOrder.rawId
            ? { ...o, status: newStatus }
            : o
        )
      );

      setSelectedOrder({ ...selectedOrder, status: newStatus });
    } catch (err) {
      console.error(err);
    }
  };

  /* FILTER */
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

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold">All Orders</h1>
          <p className="text-sm text-gray-500">
            Manage all customer orders
          </p>
        </div>

        {/* FILTERS */}
        <div className="bg-white p-5 rounded-xl shadow-sm mb-5">

          <div className="flex flex-wrap gap-3 mb-4">

            <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="border px-3 py-1 rounded" />
            <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="border px-3 py-1 rounded" />

            <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className="border px-3 py-1 rounded">
              <option value="All">All</option>
              <option>Pending</option>
              <option>Confirmed</option>
              <option>Processing</option>
              <option>Shipped</option>
              <option>Delivered</option>
              <option>Cancelled</option>
            </select>

            <div className="flex items-center border px-3 rounded ml-auto">
              <Search className="w-4 h-4 mr-2" />
              <input
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="outline-none text-sm"
              />
            </div>

            <button className="bg-black text-white px-4 py-1 rounded flex items-center gap-2">
              <FileDown className="w-4 h-4" /> Export
            </button>
          </div>

          {/* TABLE */}
          {loading ? (
            <p className="text-center py-10">Loading...</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th>ID</th>
                  <th>Customer</th>
                  <th>Address</th>
                  <th>Items</th>
                  <th>Payment</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <PaginatedTable
                data={filtered}
                defaultRows={5}
                renderRow={(o) => (
                  <tr key={o.id} className="border-b">
                    <td>{o.id}</td>
                    <td>{o.customer}</td>
                    <td>{o.address}</td>
                    <td>{o.items[0]?.name}</td>
                    <td>{o.payment}</td>
                    <td>{o.orderDate}</td>
                    <td>
                      <span className={`px-2 py-1 rounded ${getStatusColor(o.status)}`}>
                        {o.status}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => {
                          setSelectedOrder(o);
                          setOpenDrawer(true);
                        }}
                      >
                        <Eye className="w-4 h-4 text-red-600" />
                      </button>
                    </td>
                  </tr>
                )}
              />
            </table>
          )}

        </div>
      </div>

      {/* DRAWER */}
      {openDrawer && selectedOrder && (
        <div className="fixed right-0 top-0 h-full w-[400px] bg-white shadow-lg p-5">
          <h2 className="text-lg font-bold mb-3">Order Details</h2>

          <p><b>ID:</b> {selectedOrder.id}</p>
          <p><b>Customer:</b> {selectedOrder.customer}</p>
          <p><b>Address:</b> {selectedOrder.address}</p>

          <select
            value={selectedOrder.status}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="border mt-3 p-2 w-full"
          >
            <option>Pending</option>
            <option>Confirmed</option>
            <option>Processing</option>
            <option>Shipped</option>
            <option>Delivered</option>
            <option>Cancelled</option>
          </select>

         

          <button
            onClick={() => setOpenDrawer(false)}
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}