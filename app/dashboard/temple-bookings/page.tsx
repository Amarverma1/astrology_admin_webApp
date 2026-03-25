"use client";

import { useEffect, useState } from "react";
import { toast } from "../../lib/toast";

const API = process.env.NEXT_PUBLIC_API_BASE;

export default function AdminTempleBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  /* ================= FETCH BOOKINGS ================= */
  const fetchBookings = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${API}/temple/bookings`);

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Server error");
      }

      // ✅ Correct handling
      setBookings(data.data || []);

    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to fetch bookings");
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  /* ================= UPDATE STATUS ================= */
  const updateStatus = async (
    id: number,
    booking_status: string,
    payment_status: string
  ) => {
    try {
      const res = await fetch(`${API}/temple/booking/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ booking_status, payment_status }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      toast.success("Status updated ✅");
      fetchBookings();
    } catch (err: any) {
      toast.error(err.message || "Update failed");
    }
  };

  /* ================= DELETE ================= */
  const deleteBooking = async (id: number) => {
    if (!confirm("Delete this booking?")) return;

    try {
      const res = await fetch(`${API}/temple/booking/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error();

      toast.success("Deleted");
      fetchBookings();
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="p-6">

      <h1 className="text-xl font-bold mb-4">Temple Bookings</h1>

      {loading ? (
        <p>Loading...</p>
      ) : bookings.length === 0 ? (
        <p>No bookings found</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl shadow">

          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3">Temple</th>
                <th className="p-3">User</th>
                <th className="p-3">Pooja</th>
                <th className="p-3">Date</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Status</th>
                <th className="p-3">Payment</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>

            <tbody>
              {bookings.map((b) => (
                <tr key={b.id} className="border-t">

                  <td className="p-3">{b.temple_name}</td>

                  <td className="p-3">
                    {b.user_name}
                    <br />
                    <span className="text-xs text-gray-500">
                      {b.user_phone}
                    </span>
                  </td>

                  <td className="p-3">{b.pooja_name}</td>

                  <td className="p-3">
                    {b.pooja_date} <br />
                    <span className="text-xs text-gray-500">
                      {b.pooja_time}
                    </span>
                  </td>

                  <td className="p-3 text-orange-600 font-semibold">
                    ₹{b.amount}
                  </td>

                  <td className="p-3">
                    <select
                      value={b.booking_status}
                      onChange={(e) =>
                        updateStatus(
                          b.id,
                          e.target.value,
                          b.payment_status
                        )
                      }
                      className="border p-1 rounded"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>

                  <td className="p-3">
                    <select
                      value={b.payment_status}
                      onChange={(e) =>
                        updateStatus(
                          b.id,
                          b.booking_status,
                          e.target.value
                        )
                      }
                      className="border p-1 rounded"
                    >
                      <option value="pending">Pending</option>
                      <option value="paid">Paid</option>
                      <option value="failed">Failed</option>
                    </select>
                  </td>

                  <td className="p-3">
                    <button
                      onClick={() => deleteBooking(b.id)}
                      className="bg-red-50 text-red-600 px-3 py-1 rounded text-xs"
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
    </div>
  );
}