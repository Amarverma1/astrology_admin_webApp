"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import apiClient from "@/lib/apiClient";
import { toast } from "../../../lib/toast"; // ✅ your toast system (top-right)

export default function AddAstrologerPage() {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.mobile) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);
      const res = await apiClient.post("/admin/astrologers/add", formData);

      if (res.data?.success) {
        toast.success("Astrologer added successfully ✅");
        setFormData({ name: "", email: "", mobile: "" });
      } else {
        if (res.status === 409) {
  toast.error("An astrologer with this email or mobile already exists ⚠️");
} else {
  toast.error(res.data?.message || "Something went wrong");
}

      }
    } catch (err: any) {
      console.error("Add astrologer error:", err);
      toast.error(
        err.response?.data?.message || "Server error while adding astrologer"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Add Astrologer</h1>
          <p className="text-sm text-gray-500">
            Add a new astrologer using name, email, and mobile number.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-xl shadow-sm space-y-4"
        >
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              name="name"
              placeholder="Enter astrologer name"
              value={formData.name}
              onChange={handleChange}
              className="input"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              placeholder="Enter email"
              value={formData.email}
              onChange={handleChange}
              className="input"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Mobile Number <span className="text-red-500">*</span>
            </label>
            <input
              name="mobile"
              placeholder="Enter mobile number"
              value={formData.mobile}
              onChange={handleChange}
              className="input"
              required
            />
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={loading}
              className={`flex items-center gap-2 bg-red-600 text-white px-6 py-2 rounded-lg text-sm hover:bg-red-700 transition ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              <Plus size={16} />
              {loading ? "Saving..." : "Add Astrologer"}
            </button>
          </div>
        </form>
      </div>

      {/* Styles */}
      <style jsx>{`
        .input {
          width: 100%;
          border: 1px solid #e5e7eb;
          border-radius: 0.375rem;
          padding: 0.5rem 0.75rem;
          font-size: 0.875rem;
          outline: none;
          transition: border 0.2s;
        }
        .input:focus {
          border-color: #ef4444;
          box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.1);
        }
      `}</style>
    </div>
  );
}
