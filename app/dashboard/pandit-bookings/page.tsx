"use client";

import { useEffect, useState } from "react";
import { toast } from "../../lib/toast";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [editId, setEditId] = useState<number | null>(null);
  const [statusForm, setStatusForm] = useState({
    booking_status: "",
    payment_status: "",
  });

  /* ================= FETCH BOOKINGS ================= */
  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/pooja/bookings/all`);
      const data = await res.json();
      setBookings(data);
    } catch (err) {
      toast.error("Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  /* ================= DELETE ================= */
  const deleteBooking = async (id: number) => {
    if (!confirm("Delete this booking?")) return;

    try {
      await fetch(`${API_BASE}/pooja/booking/${id}`, {
        method: "DELETE",
      });

      toast.success("Booking deleted");
      fetchBookings();
    } catch {
      toast.error("Delete failed");
    }
  };

  /* ================= OPEN EDIT ================= */
  const openEdit = (b: any) => {
    setEditId(b.id);
    setStatusForm({
      booking_status: b.booking_status || "pending",
      payment_status: b.payment_status || "pending",
    });
  };

  /* ================= UPDATE ================= */
  const updateStatus = async () => {
    try {
      const res = await fetch(
        `${API_BASE}/pooja/booking/${editId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(statusForm),
        }
      );

      if (!res.ok) throw new Error();

      toast.success("Status updated ✅");
      setEditId(null);
      fetchBookings();
    } catch {
      toast.error("Update failed");
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">

      <h1 className="text-xl font-semibold mb-4">
        📿 Pooja Bookings
      </h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="overflow-auto bg-white rounded-xl shadow">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="p-3">User</th>
                <th className="p-3">Pooja</th>
                <th className="p-3">Date & Time</th>
                <th className="p-3">Address</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Status</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {bookings.map((b) => (
                <tr key={b.id} className="border-t">

                  {/* USER */}
                  <td className="p-3">
                    <div className="font-medium">
                      {b.user_name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {b.user_phone}
                    </div>
                  </td>

                  {/* POOJA */}
                  <td className="p-3">
                    {b.pooja_name || "N/A"}
                  </td>

                  {/* DATE */}
                  <td className="p-3">
                    {b.pooja_date} <br />
                    <span className="text-xs text-gray-500">
                      {b.pooja_time}
                    </span>
                  </td>

                  {/* ADDRESS */}
                  <td className="p-3 text-xs">
                    {b.address}, {b.city}
                  </td>

                  {/* AMOUNT */}
                  <td className="p-3 font-semibold text-orange-600">
                    ₹{b.amount}
                  </td>

                  {/* STATUS */}
                  <td className="p-3">
                    <div className="text-xs">
                      Booking:{" "}
                      <span className="font-medium">
                        {b.booking_status || "pending"}
                      </span>
                    </div>
                    <div className="text-xs">
                      Payment:{" "}
                      <span className="font-medium">
                        {b.payment_status || "pending"}
                      </span>
                    </div>
                  </td>

                  {/* ACTIONS */}
                  <td className="p-3 space-y-2">
                    <button
                      onClick={() => openEdit(b)}
                      className="block w-full bg-blue-50 text-blue-600 text-xs py-1 rounded"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => deleteBooking(b.id)}
                      className="block w-full bg-red-50 text-red-600 text-xs py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ================= EDIT DRAWER ================= */}
      {editId && (
        <div className="fixed inset-0 bg-black/30 flex justify-end z-50">
          <div className="w-full md:w-[350px] bg-white p-6 h-full">
            <h2 className="text-lg font-semibold mb-4">
              Update Status
            </h2>

            {/* BOOKING STATUS */}
            <select
              className="border p-2 w-full mb-3 rounded"
              value={statusForm.booking_status}
              onChange={(e) =>
                setStatusForm({
                  ...statusForm,
                  booking_status: e.target.value,
                })
              }
            >
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>

            {/* PAYMENT STATUS */}
            <select
              className="border p-2 w-full mb-3 rounded"
              value={statusForm.payment_status}
              onChange={(e) =>
                setStatusForm({
                  ...statusForm,
                  payment_status: e.target.value,
                })
              }
            >
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="failed">Failed</option>
            </select>

            <button
              onClick={updateStatus}
              className="w-full bg-green-600 text-white py-2 rounded"
            >
              Update
            </button>

            <button
              onClick={() => setEditId(null)}
              className="w-full mt-2 border py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}