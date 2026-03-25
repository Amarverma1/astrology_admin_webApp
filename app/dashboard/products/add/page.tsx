"use client";

import { useEffect, useState } from "react";
import { UploadCloud, X } from "lucide-react";
import { useRouter } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE!;

interface Category {
  id: number;
  name: string;
}

export default function AddProductPage() {
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);

  const [form, setForm] = useState<any>({
    category_id: "",
    name: "",
    slug: "",
    short_description: "",
    description: "",
    price: "",
    mrp: "",
    discount_percent: "",
    stock: "",
    sku: "",
    rating: "",
    reviews_count: "",
    is_featured: false,
    is_best_seller: false,
    status: true,
    meta_title: "",
    meta_description: "",
  });

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // SLUG
  const slugify = (text: string) =>
    text.toLowerCase().replace(/\s+/g, "-");

  // FETCH CATEGORY
  useEffect(() => {
    fetch(`${API_BASE}/categories`)
      .then((res) => res.json())
      .then(setCategories);
  }, []);

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;

    if (name === "name") {
      setForm({
        ...form,
        name: value,
        slug: slugify(value),
      });
    } else if (type === "checkbox") {
      setForm({ ...form, [name]: checked });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleImage = (e: any) => {
    const file = e.target.files[0];
    if (!file) return;

    setFile(file);
    setPreview(URL.createObjectURL(file));
  };

  // SUBMIT (FormData 🔥)
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, String(value ?? ""));
      });

      if (file) {
        formData.append("image", file);
      }

      const res = await fetch(`${API_BASE}/products/add`, {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        router.push("/dashboard/products");
      }
    } catch (err) {
      console.error(err);
      alert("Error adding product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">

        <h1 className="text-xl font-semibold mb-4">Add Product</h1>

        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-xl shadow grid grid-cols-1 md:grid-cols-2 gap-4"
        >

          {/* CATEGORY */}
          <select name="category_id" onChange={handleChange} className="input">
            <option value="">Select Category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          {/* NAME */}
          <input name="name" placeholder="Product Name" className="input" onChange={handleChange} />

          {/* SLUG */}
          <input value={form.slug} readOnly className="input bg-gray-100" />

          {/* PRICE */}
          <input name="price" type="number" placeholder="Price" className="input" onChange={handleChange} />

          {/* MRP */}
          <input name="mrp" type="number" placeholder="MRP" className="input" onChange={handleChange} />

          {/* STOCK */}
          <input name="stock" type="number" placeholder="Stock" className="input" onChange={handleChange} />

          {/* SKU */}
          <input name="sku" placeholder="SKU" className="input" onChange={handleChange} />

          {/* DISCOUNT */}
          <input name="discount_percent" type="number" placeholder="Discount %" className="input" onChange={handleChange} />

          {/* SHORT DESC */}
          <input name="short_description" placeholder="Short Description" className="input col-span-2" onChange={handleChange} />

          {/* DESCRIPTION */}
          <textarea name="description" placeholder="Description" className="input col-span-2" onChange={handleChange} />

          {/* META */}
          <input name="meta_title" placeholder="Meta Title" className="input col-span-2" onChange={handleChange} />

          <textarea name="meta_description" placeholder="Meta Description" className="input col-span-2" onChange={handleChange} />

          {/* FLAGS */}
          <div className="flex gap-4 col-span-2">
            <label><input type="checkbox" name="is_featured" onChange={handleChange}/> Featured</label>
            <label><input type="checkbox" name="is_best_seller" onChange={handleChange}/> Best Seller</label>
          </div>

          {/* IMAGE */}
          <div className="col-span-2 border-dashed border-2 p-5 text-center rounded">
            <input type="file" onChange={handleImage} className="hidden" id="upload" />
            <label htmlFor="upload" className="cursor-pointer">
              <UploadCloud className="mx-auto" />
              <p>Upload Image</p>
            </label>
          </div>

          {preview && (
            <img src={preview} className="w-24 h-24 rounded border col-span-2" />
          )}

          <button className="col-span-2 bg-green-600 text-white py-2 rounded">
            {loading ? "Adding..." : "Add Product"}
          </button>
        </form>
      </div>

      {/* INPUT STYLE */}
      <style jsx>{`
        .input {
          border: 1px solid #ddd;
          padding: 10px;
          border-radius: 8px;
          width: 100%;
        }
      `}</style>
    </div>
  );
}