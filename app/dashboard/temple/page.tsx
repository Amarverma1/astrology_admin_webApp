"use client";

import { useEffect, useState } from "react";
import { toast } from "../../lib/toast";

const API = process.env.NEXT_PUBLIC_API_BASE;
const IMG = process.env.NEXT_PUBLIC_IMG_BASE;

export default function AdminTemplePage() {
  const [temples, setTemples] = useState<any[]>([]);
  const [selectedTemple, setSelectedTemple] = useState<any>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [form, setForm] = useState({
    name: "",
    description: "",
    location: "",
  });

  const [poojaForm, setPoojaForm] = useState({
    temple_id: "",
    pooja_name: "",
    price: "",
    description: "",
  });

  const [image, setImage] = useState<File | null>(null);
  const [editImage, setEditImage] = useState<File | null>(null);

  /* ================= FETCH ================= */
  const fetchTemples = async () => {
    try {
      const res = await fetch(`${API}/temple`);
      const data = await res.json();
      setTemples(data);
    } catch {
      toast.error("Failed to fetch temples");
    }
  };

  useEffect(() => {
    fetchTemples();
  }, []);

  /* ================= ADD TEMPLE ================= */
  const addTemple = async (e: any) => {
    e.preventDefault();

    try {
      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("description", form.description);
      fd.append("location", form.location);
      if (image) fd.append("image", image);

      const res = await fetch(`${API}/temple/add`, {
        method: "POST",
        body: fd,
      });

      if (!res.ok) throw new Error();

      toast.success("Temple added ✅");
      setForm({ name: "", description: "", location: "" });
      setImage(null);
      fetchTemples();
    } catch {
      toast.error("Add temple failed");
    }
  };

  /* ================= UPDATE TEMPLE ================= */
  const updateTemple = async () => {
    try {
      const fd = new FormData();
      fd.append("name", selectedTemple.name);
      fd.append("description", selectedTemple.description);
      fd.append("location", selectedTemple.location);

      if (editImage) fd.append("image", editImage);

      const res = await fetch(`${API}/temple/${selectedTemple.id}`, {
        method: "PUT",
        body: fd,
      });

      if (!res.ok) throw new Error();

      toast.success("Updated ✅");
      setDrawerOpen(false);
      fetchTemples();
    } catch {
      toast.error("Update failed");
    }
  };

  /* ================= DELETE ================= */
  const deleteTemple = async (id: number) => {
    if (!confirm("Delete temple?")) return;

    try {
      await fetch(`${API}/temple/${id}`, { method: "DELETE" });
      toast.success("Deleted");
      fetchTemples();
    } catch {
      toast.error("Delete failed");
    }
  };

  /* ================= ADD POOJA ================= */
  const addPooja = async (e: any) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API}/temple/pooja/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(poojaForm),
      });

      if (!res.ok) throw new Error();

      toast.success("Pooja added ✅");
      fetchTemples();
    } catch {
      toast.error("Add pooja failed");
    }
  };

  /* ================= OPEN EDIT ================= */
  const openEdit = (temple: any) => {
    setSelectedTemple(temple);
    setDrawerOpen(true);
  };

  return (
    <div className="p-6 space-y-8">

      <h1 className="text-xl font-bold">Temple Management</h1>

      {/* ================= ADD TEMPLE ================= */}
      <form
        onSubmit={addTemple}
        className="bg-white p-6 rounded-xl shadow grid md:grid-cols-2 gap-4"
      >
        <input
          placeholder="Temple Name"
          className="border p-2 rounded"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        <input
          placeholder="Location"
          className="border p-2 rounded"
          value={form.location}
          onChange={(e) =>
            setForm({ ...form, location: e.target.value })
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

        <input type="file" onChange={(e) => setImage(e.target.files?.[0] || null)} />

        <button className="bg-orange-600 text-white py-2 rounded md:col-span-2">
          Add Temple
        </button>
      </form>

      {/* ================= ADD POOJA ================= */}
      <form
        onSubmit={addPooja}
        className="bg-white p-6 rounded-xl shadow grid md:grid-cols-2 gap-4"
      >
        <select
          className="border p-2 rounded"
          onChange={(e) =>
            setPoojaForm({ ...poojaForm, temple_id: e.target.value })
          }
        >
          <option>Select Temple</option>
          {temples.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>

        <input
          placeholder="Pooja Name"
          className="border p-2 rounded"
          onChange={(e) =>
            setPoojaForm({ ...poojaForm, pooja_name: e.target.value })
          }
        />

        <input
          type="number"
          placeholder="Price"
          className="border p-2 rounded"
          onChange={(e) =>
            setPoojaForm({ ...poojaForm, price: e.target.value })
          }
        />

        <textarea
          placeholder="Description"
          className="border p-2 rounded md:col-span-2"
          onChange={(e) =>
            setPoojaForm({ ...poojaForm, description: e.target.value })
          }
        />

        <button className="bg-green-600 text-white py-2 rounded md:col-span-2">
          Add Temple Pooja
        </button>
      </form>

      {/* ================= LIST ================= */}
      <div className="grid md:grid-cols-3 gap-6">
        {temples.map((t) => (
          <div key={t.id} className="bg-white rounded-xl shadow p-4">

            <img
              src={t.main_image ? `${IMG}${t.main_image}` : "/no-image.png"}
              className="h-40 w-full object-cover rounded"
            />

            <h3 className="font-semibold mt-3">{t.name}</h3>
            <p className="text-sm text-gray-500">{t.location}</p>

            <p className="text-xs mt-2 text-gray-600">
              {t.description}
            </p>

            {/* ✅ SHOW POOJAS */}
            <div className="mt-3">
              <h4 className="text-xs font-semibold mb-1">Poojas:</h4>

              {t.poojas?.length === 0 ? (
                <p className="text-xs text-gray-400">No poojas</p>
              ) : (
                t.poojas.map((p: any) => (
                  <div
                    key={p.id}
                    className="text-xs flex justify-between border-b py-1"
                  >
                    <span>{p.pooja_name}</span>
                    <span className="text-orange-600">₹{p.price}</span>
                  </div>
                ))
              )}
            </div>

            <div className="flex gap-2 mt-3">
              <button
                onClick={() => openEdit(t)}
                className="flex-1 bg-blue-50 text-blue-600 py-1 rounded"
              >
                Edit
              </button>

              <button
                onClick={() => deleteTemple(t.id)}
                className="flex-1 bg-red-50 text-red-600 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ================= DRAWER ================= */}
      {drawerOpen && selectedTemple && (
        <div className="fixed top-0 right-0 w-96 h-full bg-white shadow-xl p-6 z-50">

          <h2 className="font-bold mb-4">Edit Temple</h2>

          <input
            className="border p-2 w-full mb-2"
            value={selectedTemple.name}
            onChange={(e) =>
              setSelectedTemple({ ...selectedTemple, name: e.target.value })
            }
          />

          <input
            className="border p-2 w-full mb-2"
            value={selectedTemple.location}
            onChange={(e) =>
              setSelectedTemple({ ...selectedTemple, location: e.target.value })
            }
          />

          <textarea
            className="border p-2 w-full mb-2"
            value={selectedTemple.description}
            onChange={(e) =>
              setSelectedTemple({ ...selectedTemple, description: e.target.value })
            }
          />

          <input type="file" onChange={(e) => setEditImage(e.target.files?.[0] || null)} />

          <button
            onClick={updateTemple}
            className="w-full bg-green-600 text-white py-2 mt-3 rounded"
          >
            Update
          </button>

          <button
            onClick={() => setDrawerOpen(false)}
            className="w-full bg-gray-200 py-2 mt-2 rounded"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}