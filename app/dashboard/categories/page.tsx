"use client";

import { useEffect, useState } from "react";
import { Edit, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE!;
const IMG_BASE = process.env.NEXT_PUBLIC_IMG_BASE!;

interface Category {
  id: number;
  name: string;
  slug: string;
  image: string | File;
  description: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [filtered, setFiltered] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [preview, setPreview] = useState<string | null>(null);

  const [editModal, setEditModal] = useState(false);
  const [selected, setSelected] = useState<Category | null>(null);

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_BASE}/categories`);
      const data = await res.json();
      setCategories(data);
      setFiltered(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setFiltered(
      categories.filter((c) =>
        c.name.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, categories]);

  const deleteCategory = async (id: number) => {
    if (!confirm("Delete this category?")) return;

    try {
      await fetch(`${API_BASE}/categories/${id}`, {
        method: "DELETE",
      });

      toast.success("Category deleted successfully 🗑️");
      fetchCategories();
    } catch {
      toast.error("Delete failed");
    }
  };

  const openEdit = (cat: Category) => {
    setSelected(cat);
    setPreview(null);
    setEditModal(true);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-5">

        {/* HEADER */}
        <div>
          <h1 className="text-lg font-semibold text-gray-900">
            Categories
          </h1>
          <p className="text-sm text-gray-500">
            Manage your product categories
          </p>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition">

          {/* SEARCH */}
          <div className="flex gap-3 p-4">
            <input
              placeholder="Search categories..."
              className="bg-gray-50 px-3 py-2 rounded-lg text-sm outline-none w-full sm:w-80"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">

              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left">Category</th>
                  <th className="px-4 py-3 text-left">Slug</th>
                  <th className="px-4 py-3 text-center">Action</th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((cat) => (
                  <tr key={cat.id} className="hover:bg-gray-50">

                    <td className="px-4 py-3 flex items-center gap-3">
                      <img
                        src={`${IMG_BASE}${cat.image}`}
                        className="w-10 h-10 rounded-lg object-cover border"
                      />
                      <span>{cat.name}</span>
                    </td>

                    <td className="px-4 py-3 text-gray-500">
                      {cat.slug}
                    </td>

                    <td className="px-4 py-3 text-center">
                      <div className="flex justify-center gap-2">

                        <button
                          onClick={() => openEdit(cat)}
                          className="p-2 rounded-full bg-blue-50 hover:bg-blue-100"
                        >
                          <Edit className="w-4 h-4 text-blue-600" />
                        </button>

                        <button
                          onClick={() => deleteCategory(cat.id)}
                          className="p-2 rounded-full bg-red-50 hover:bg-red-100"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>

                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filtered.length === 0 && (
              <p className="p-4 text-center text-gray-400">
                No categories found
              </p>
            )}
          </div>
        </div>
      </div>

      {/* EDIT DRAWER */}
      {editModal && selected && (
        <div className="fixed inset-0 bg-black/30 flex justify-end z-50">

          <div className="bg-white w-full sm:w-[420px] h-full p-6 shadow-xl overflow-y-auto">

            <div className="flex justify-between mb-4">
              <h3>Edit Category</h3>
              <button onClick={() => setEditModal(false)}>✖</button>
            </div>

            <div className="space-y-4">

              <input
                value={selected.name}
                onChange={(e) =>
                  setSelected({ ...selected, name: e.target.value })
                }
                className="w-full border p-2 rounded"
              />

              <input
                value={selected.slug}
                onChange={(e) =>
                  setSelected({ ...selected, slug: e.target.value })
                }
                className="w-full border p-2 rounded"
              />

              <input
                type="file"
                accept="image/*"
                onChange={(e: any) => {
                  const file = e.target.files[0];
                  if (!file) return;

                  setSelected({ ...selected, image: file });
                  setPreview(URL.createObjectURL(file));
                }}
                className="w-full border p-2 rounded"
              />

              {(preview || selected.image) && (
                <img
                  src={
                    preview
                      ? preview
                      : typeof selected.image === "string"
                      ? `${IMG_BASE}${selected.image}`
                      : URL.createObjectURL(selected.image)
                  }
                  className="w-24 h-24 rounded border"
                />
              )}

              <textarea
                value={selected.description}
                onChange={(e) =>
                  setSelected({
                    ...selected,
                    description: e.target.value,
                  })
                }
                className="w-full border p-2 rounded"
              />

              <button
                onClick={async () => {
                  if (!selected) return;

                  const formData = new FormData();
                  formData.append("name", selected.name);
                  formData.append("slug", selected.slug);
                  formData.append("description", selected.description || "");

                  if (selected.image instanceof File) {
                    formData.append("image", selected.image);
                  }

                  try {
                    await fetch(`${API_BASE}/categories/${selected.id}`, {
                      method: "PUT",
                      body: formData,
                    });

                    toast.success("Category updated successfully ✅");
                    setEditModal(false);
                    fetchCategories();
                  } catch {
                    toast.error("Update failed ❌");
                  }
                }}
                className="w-full bg-green-600 text-white py-2 rounded"
              >
                Update Category
              </button>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}