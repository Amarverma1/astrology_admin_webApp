"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UploadCloud, X, CheckCircle } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE!;

export default function AddCategoryPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
  });

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // ✅ success popup
  const [successOpen, setSuccessOpen] = useState(false);

  // 🔥 slug
  const generateSlug = (text: string) =>
    text.toLowerCase().replace(/\s+/g, "-");

  const handleChange = (e: any) => {
    const { name, value } = e.target;

    if (name === "name") {
      setForm({
        ...form,
        name: value,
        slug: generateSlug(value),
      });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  // 📸 upload
  const handleImageUpload = (e: any) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  };

  // 🚀 submit
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("slug", form.slug);
      formData.append("description", form.description);

      if (file) {
        formData.append("image", file);
      }

      const res = await fetch(`${API_BASE}/categories`, {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        setSuccessOpen(true);

        // auto redirect after 2 sec
        setTimeout(() => {
          router.push("/dashboard/categories");
        }, 2000);
      } else {
        alert("❌ Failed to add category");
      }
    } catch (err) {
      console.error(err);
      alert("Error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-2xl mx-auto space-y-5">

          {/* HEADER */}
          <div>
            <h1 className="text-lg font-semibold text-gray-900">
              Add Category
            </h1>
            <p className="text-sm text-gray-500">
              Create a new product category
            </p>
          </div>

          {/* CARD */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* NAME */}
              <input
                name="name"
                placeholder="Category Name"
                className="w-full bg-gray-50 border px-3 py-2 rounded-lg"
                onChange={handleChange}
                required
              />

              {/* SLUG */}
              <input
                value={form.slug}
                readOnly
                className="w-full bg-gray-100 border px-3 py-2 rounded-lg"
              />

              {/* IMAGE */}
              <div className="border-2 border-dashed p-6 text-center rounded-lg">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="upload"
                />

                <label htmlFor="upload">
                  <UploadCloud className="mx-auto mb-2" />
                  <p>Upload Image</p>
                </label>
              </div>

              {/* PREVIEW */}
              {preview && (
                <div className="relative w-fit">
                  <img src={preview} className="w-32 h-32 rounded-lg" />
                  <button
                    type="button"
                    onClick={() => {
                      setPreview(null);
                      setFile(null);
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full"
                  >
                    <X size={12} />
                  </button>
                </div>
              )}

              {/* DESCRIPTION */}
              <textarea
                name="description"
                placeholder="Description"
                className="w-full bg-gray-50 border px-3 py-2 rounded-lg"
                onChange={handleChange}
              />

              {/* BUTTON */}
              <button
                disabled={loading}
                className="w-full bg-red-600 text-white py-2.5 rounded-lg flex justify-center items-center gap-2"
              >
                {loading && (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                )}
                {loading ? "Adding..." : "Add Category"}
              </button>

            </form>
          </div>
        </div>
      </div>

      {/* ✅ SUCCESS POPUP */}
      {successOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white rounded-2xl p-6 w-[300px] text-center shadow-xl animate-scaleIn">

            <CheckCircle className="mx-auto text-green-500 mb-3" size={40} />

            <h2 className="text-lg font-semibold text-gray-800">
              Success!
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Category added successfully
            </p>

            <button
              onClick={() => router.push("/dashboard/categories")}
              className="mt-4 w-full bg-green-600 text-white py-2 rounded-lg"
            >
              Go to Categories
            </button>

          </div>
        </div>
      )}

      {/* animation */}
      <style jsx>{`
        .animate-scaleIn {
          animation: scaleIn 0.3s ease;
        }
        @keyframes scaleIn {
          from {
            transform: scale(0.8);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
}