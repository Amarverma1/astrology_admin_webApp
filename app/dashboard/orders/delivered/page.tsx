"use client";

import { useState } from "react";
import {
  Search,
  Eye,
  FileDown,
  BarChart3,
  PieChart,
  TrendingUp,
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

// ✅ Chart setup
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

// ✅ Dynamic map imports with explicit typing
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

export default function DeliveredOrdersPage() {
  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [openDrawer, setOpenDrawer] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  // ✅ Delivered orders mock data
  const [orders] = useState([
    {
      id: "ORD10521",
      customer: "Riya Sharma",
      phone: "+91 9876543210",
      address: "A-23, Green Park, Delhi",
      items: [
        { name: "Paneer Tikka", img: "/assets/products/paneer.jpg", qty: 1 },
        { name: "Butter Naan", img: "/assets/products/naan.jpg", qty: 2 },
      ],
      payment: "Paid (UPI)",
      total: 499,
      orderDate: "01/20/2026",
      deliveryDate: "01/20/2026",
      status: "Delivered",
      location: { lat: 28.567, lng: 77.21 },
      rider: {
        name: "Rohit Yadav",
        phone: "+91 9870001111",
        location: { lat: 28.565, lng: 77.215 },
      },
    },
    {
      id: "ORD10522",
      customer: "Amit Verma",
      phone: "+91 9123456789",
      address: "Sector 5, Gurgaon",
      items: [
        { name: "Men’s Sneakers", img: "/assets/products/shoes.jpg", qty: 1 },
      ],
      payment: "COD",
      total: 2599,
      orderDate: "01/19/2026",
      deliveryDate: "01/20/2026",
      status: "Delivered",
      location: { lat: 28.459, lng: 77.067 },
      rider: {
        name: "Deepak Singh",
        phone: "+91 9823456789",
        location: { lat: 28.46, lng: 77.065 },
      },
    },
    {
      id: "ORD10523",
      customer: "Sneha Singh",
      phone: "+91 9112233445",
      address: "MG Road, Bengaluru",
      items: [
        { name: "Gold Necklace", img: "/assets/products/necklace.jpg", qty: 1 },
      ],
      payment: "Paid (Card)",
      total: 7999,
      orderDate: "01/18/2026",
      deliveryDate: "01/19/2026",
      status: "Delivered",
      location: { lat: 12.973, lng: 77.611 },
      rider: {
        name: "Karan Patel",
        phone: "+91 9901122334",
        location: { lat: 12.975, lng: 77.613 },
      },
    },
  ]);

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const avgOrder = (totalRevenue / orders.length).toFixed(0);

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

  // ✅ Chart Data
  const barData = {
    labels: ["Delhi", "Gurgaon", "Bengaluru"],
    datasets: [
      {
        label: "Delivered Orders",
        data: [12, 8, 5],
        backgroundColor: "#CA2034",
      },
    ],
  };

  const doughnutData = {
    labels: ["Dishes", "Shoes", "Jewelry"],
    datasets: [
      {
        data: [45, 30, 25],
        backgroundColor: ["#CA2034", "#F59E0B", "#2563EB"],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            Delivered Orders
          </h1>
          <p className="text-sm text-gray-500">
            Review, analyze, and manage all successfully delivered orders.
          </p>
        </div>

        {/* INSIGHTS SECTION */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <InsightCard
            icon={<BarChart3 className="w-5 h-5 text-red-600" />}
            title="Total Delivered"
            value={orders.length}
            subtitle="All-time successful deliveries"
          />
          <InsightCard
            icon={<IndianRupee className="w-5 h-5 text-green-600" />}
            title="Total Revenue"
            value={`₹${totalRevenue}`}
            subtitle="From all delivered orders"
          />
          <InsightCard
            icon={<TrendingUp className="w-5 h-5 text-blue-600" />}
            title="Average Order"
            value={`₹${avgOrder}`}
            subtitle="Per successful delivery"
          />
          <InsightCard
            icon={<PieChart className="w-5 h-5 text-purple-600" />}
            title="Top Category"
            value="Dishes"
            subtitle="Most delivered product type"
          />
        </div>

        {/* CHARTS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <ChartCard title="Deliveries by City">
            <Bar
              data={barData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                  y: {
                    ticks: {
                      stepSize: 2,
                      color: "#6B7280",
                      font: { size: 10 },
                    },
                    grid: { color: "#F3F4F6" },
                  },
                  x: {
                    ticks: { color: "#6B7280", font: { size: 10 } },
                    grid: { display: false },
                  },
                },
              }}
            />
          </ChartCard>

          <ChartCard title="Top Categories">
            <Doughnut
              data={doughnutData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: "bottom",
                    labels: { boxWidth: 10, font: { size: 10 } },
                  },
                },
                cutout: "70%",
              }}
            />
          </ChartCard>
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

          <table className="w-full text-sm border-collapse">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr className="text-gray-600 font-medium">
                <th className="px-4 py-3">O. ID</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Address</th>
                <th className="px-4 py-3">Items</th>
                <th className="px-4 py-3">Payment</th>
                <th className="px-4 py-3">Rider</th>
                <th className="px-4 py-3">Delivered On</th>
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
                  <td className="px-4 py-3 text-gray-700">
                    {o.rider.name}
                    <br />
                    <span className="text-xs text-gray-500">
                      {o.rider.phone}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{o.deliveryDate}</td>
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

      {/* Drawer with map and details */}
      {openDrawer && selectedOrder && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/30 backdrop-blur-sm">
          <div className="bg-white w-full sm:w-[460px] h-full shadow-xl p-6 flex flex-col animate-slideIn">
            <div className="flex items-center justify-between mb-4 border-b pb-3">
              <h2 className="text-lg font-semibold text-gray-800">
                Delivered Order Details
              </h2>
              <button
                onClick={() => setOpenDrawer(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-sm text-gray-700 mb-4">
              <p>
                <strong>Order ID:</strong> {selectedOrder.id}
              </p>
              <p>
                <strong>Customer:</strong> {selectedOrder.customer} (
                {selectedOrder.phone})
              </p>
              <p>
                <strong>Rider:</strong> {selectedOrder.rider.name} (
                {selectedOrder.rider.phone})
              </p>
              <p>
                <strong>Payment:</strong> {selectedOrder.payment}
              </p>
              <p>
                <strong>Total:</strong> ₹{selectedOrder.total}
              </p>
              <p>
                <strong>Delivered On:</strong> {selectedOrder.deliveryDate}
              </p>
            </div>

            <div className="flex-1 border rounded-lg overflow-hidden relative">
              <MapContainer
                center={
                  [selectedOrder.location.lat, selectedOrder.location.lng] as [
                    number,
                    number
                  ]
                }
                zoom={14}
                scrollWheelZoom={false}
                className="h-[260px] w-full"
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker
                  position={
                    [selectedOrder.location.lat, selectedOrder.location.lng] as [
                      number,
                      number
                    ]
                  }
                >
                  <Popup>Customer: {selectedOrder.customer}</Popup>
                </Marker>
                <Marker
                  position={
                    [
                      selectedOrder.rider.location.lat,
                      selectedOrder.rider.location.lng,
                    ] as [number, number]
                  }
                >
                  <Popup>Rider: {selectedOrder.rider.name}</Popup>
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

/* ✅ Small helper components to make UI clean */
function InsightCard({ icon, title, value, subtitle }: any) {
  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
      <div className="flex items-center gap-3 mb-2">
        {icon}
        <h3 className="font-semibold text-gray-700">{title}</h3>
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
    </div>
  );
}

function ChartCard({ title, children }: any) {
  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
      <h2 className="text-sm font-semibold text-gray-600 mb-3">{title}</h2>
      <div className="h-[200px]">{children}</div>
    </div>
  );
}
