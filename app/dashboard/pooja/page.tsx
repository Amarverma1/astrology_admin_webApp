"use client";

import { useEffect, useState } from "react";
import { toast } from "../../lib/toast";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE;
const IMG_BASE = process.env.NEXT_PUBLIC_IMG_BASE;

export default function AdminPoojaPage() {
  const [poojas, setPoojas] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    pooja_name: "",
    description: "",
    price: "",
    duration: "",
  });

  const [image, setImage] = useState<File | null>(null);

  // ✅ EDIT STATES
  const [editOpen, setEditOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  /* ================= GET ALL ================= */
  const fetchPoojas = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/pooja`);
      const data = await res.json();
      setPoojas(data);
    } catch (err) {
      toast.error("Failed to fetch poojas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPoojas();
  }, []);

  /* ================= ADD ================= */
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!form.pooja_name || !form.price) {
      toast.error("Please fill required fields");
      return;
    }

    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (image) fd.append("image", image);

      const res = await fetch(`${API_BASE}/pooja/add`, {
        method: "POST",
        body: fd,
      });

      if (!res.ok) throw new Error();

      toast.success("Pooja added ✅");

      setForm({
        pooja_name: "",
        description: "",
        price: "",
        duration: "",
      });
      setImage(null);

      fetchPoojas();
    } catch {
      toast.error("Add failed");
    }
  };

  /* ================= DELETE ================= */
  const deletePooja = async (id: number) => {
    if (!confirm("Delete this pooja?")) return;

    await fetch(`${API_BASE}/pooja/${id}`, { method: "DELETE" });

    toast.success("Deleted");
    fetchPoojas();
  };

  /* ================= OPEN EDIT ================= */
  const openEdit = (p: any) => {
    setEditId(p.id);
    setForm({
      pooja_name: p.pooja_name,
      description: p.description || "",
      price: p.price,
      duration: p.duration || "",
    });
    setImage(null);
    setEditOpen(true);
  };

  /* ================= UPDATE ================= */
  const updatePooja = async (e: any) => {
    e.preventDefault();

    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (image) fd.append("image", image);

      const res = await fetch(`${API_BASE}/pooja/${editId}`, {
        method: "PUT",
        body: fd,
      });

      if (!res.ok) throw new Error();

      toast.success("Updated ✅");
      setEditOpen(false);
      fetchPoojas();
    } catch {
      toast.error("Update failed");
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">

      <h1 className="text-lg font-semibold mb-4">Manage Poojas</h1>

      {/* ================= ADD FORM ================= */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow mb-8 grid md:grid-cols-2 gap-4"
      >
        <input
          placeholder="Pooja Name *"
          className="border p-2 rounded"
          value={form.pooja_name}
          onChange={(e) =>
            setForm({ ...form, pooja_name: e.target.value })
          }
        />

        <input
          placeholder="Duration"
          className="border p-2 rounded"
          value={form.duration}
          onChange={(e) =>
            setForm({ ...form, duration: e.target.value })
          }
        />

        <input
          type="number"
          placeholder="Price *"
          className="border p-2 rounded"
          value={form.price}
          onChange={(e) =>
            setForm({ ...form, price: e.target.value })
          }
        />

        <input
          type="file"
          onChange={(e) =>
            setImage(e.target.files?.[0] || null)
          }
        />

        <textarea
          placeholder="Description"
          className="border p-2 rounded md:col-span-2"
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
        />

        <button className="bg-orange-600 text-white py-2 rounded md:col-span-2">
          Add Pooja
        </button>
      </form>

      {/* ================= LIST ================= */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {poojas.map((p) => (
          <div key={p.id} className="bg-white p-3 rounded shadow">
            <img
              src={p.image ? `${IMG_BASE}${p.image}` : "/no-image.png"}
              className="h-40 w-full object-cover rounded"
            />

            <h3 className="font-semibold text-sm mt-2">
              {p.pooja_name}
            </h3>

            <p className="text-xs">{p.duration}</p>

            <p className="text-orange-600 font-bold">₹{p.price}</p>

            <div className="flex gap-2 mt-2">
              <button
                onClick={() => openEdit(p)}
                className="flex-1 bg-blue-50 text-blue-600 text-xs py-1 rounded"
              >
                Edit
              </button>

              <button
                onClick={() => deletePooja(p.id)}
                className="flex-1 bg-red-50 text-red-600 text-xs py-1 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ================= RIGHT DRAWER ================= */}
      {editOpen && (
        <div className="fixed inset-0 bg-black/30 flex justify-end z-50">
          <div className="w-full md:w-[400px] bg-white p-6 h-full overflow-auto">
            <h2 className="text-lg font-semibold mb-4">
              Edit Pooja
            </h2>

            <form onSubmit={updatePooja} className="space-y-3">
              <input
                value={form.pooja_name}
                onChange={(e) =>
                  setForm({ ...form, pooja_name: e.target.value })
                }
                className="border p-2 w-full rounded"
                placeholder="Name"
              />

              <input
                value={form.duration}
                onChange={(e) =>
                  setForm({ ...form, duration: e.target.value })
                }
                className="border p-2 w-full rounded"
                placeholder="Duration"
              />

              <input
                type="number"
                value={form.price}
                onChange={(e) =>
                  setForm({ ...form, price: e.target.value })
                }
                className="border p-2 w-full rounded"
                placeholder="Price"
              />

              <input
                type="file"
                onChange={(e) =>
                  setImage(e.target.files?.[0] || null)
                }
              />

              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                className="border p-2 w-full rounded"
                placeholder="Description"
              />

              <button className="w-full bg-green-600 text-white py-2 rounded">
                Update
              </button>

              <button
                type="button"
                onClick={() => setEditOpen(false)}
                className="w-full border py-2 rounded"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}