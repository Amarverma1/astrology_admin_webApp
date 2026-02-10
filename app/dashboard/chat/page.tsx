"use client";

import { useState } from "react";
import { Search, Eye } from "lucide-react";
import PaginatedTable from "../components/PaginatedTable";

export default function ChatPage() {
  const [search, setSearch] = useState("");
  const [openDrawer, setOpenDrawer] = useState(false);
  const [selectedChat, setSelectedChat] = useState<any>(null);

  // 🔹 Mock chat data
  const [chats] = useState([
    {
      id: "CH001",
      customer: "Riya Sharma",
      lastMessage: "Hello, I have an issue with my order",
      date: "01/22/2026",
      status: "Open",
    },
    {
      id: "CH002",
      customer: "Amit Verma",
      lastMessage: "Thank you for resolving the issue",
      date: "01/21/2026",
      status: "Closed",
    },
    {
      id: "CH003",
      customer: "Sneha Singh",
      lastMessage: "I want to change my address",
      date: "01/20/2026",
      status: "Open",
    },
  ]);

  const filteredChats = chats.filter(
    (c) =>
      c.customer.toLowerCase().includes(search.toLowerCase()) ||
      c.lastMessage.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Open":
        return "bg-yellow-100 text-yellow-700";
      case "Closed":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">Chat</h1>
            <p className="text-sm text-gray-500">All customer chat conversations.</p>
          </div>
        </div>

        {/* TABLE WITH SEARCH INSIDE */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
          {/* SEARCH */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 w-full sm:w-80">
              <Search className="w-4 h-4 text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Search by customer or message..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent outline-none text-sm flex-1"
              />
            </div>
          </div>

          <table className="w-full text-sm border-collapse">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr className="text-gray-600 font-medium">
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Last Message</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-center">Action</th>
              </tr>
            </thead>

            <PaginatedTable
              data={filteredChats}
              defaultRows={5}
              renderRow={(c) => (
                <tr
                  key={c.id}
                  className="border-b last:border-0 hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-3 font-semibold text-gray-800">{c.id}</td>
                  <td className="px-4 py-3 text-gray-700">{c.customer}</td>
                  <td className="px-4 py-3 text-gray-700">{c.lastMessage}</td>
                  <td className="px-4 py-3 text-gray-700">{c.date}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                        c.status
                      )}`}
                    >
                      {c.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => {
                        setSelectedChat(c);
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
      {openDrawer && selectedChat && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/30 backdrop-blur-sm">
          <div className="bg-white w-full sm:w-[420px] h-full shadow-xl p-6 flex flex-col animate-slideIn">
            <div className="flex items-center justify-between mb-4 border-b pb-3">
              <h2 className="text-lg font-semibold text-gray-800">Chat Details</h2>
              <button
                onClick={() => setOpenDrawer(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-sm text-gray-700 mb-4">
              <p><strong>ID:</strong> {selectedChat.id}</p>
              <p><strong>Customer:</strong> {selectedChat.customer}</p>
              <p><strong>Last Message:</strong> {selectedChat.lastMessage}</p>
              <p><strong>Date:</strong> {selectedChat.date}</p>
              <p><strong>Status:</strong> {selectedChat.status}</p>
            </div>

            <div className="mt-auto border-t pt-3 flex justify-end">
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
