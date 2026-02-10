"use client";

import { useState } from "react";
import { Check, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AddCouponPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    code: "",
    discount: "",
    type: "Percentage",
    validTill: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.code || !formData.discount || !formData.validTill) {
      alert("Please fill all fields!");
      return;
    }

    alert(`✅ Coupon "${formData.code}" added successfully!`);
    setFormData({ code: "", discount: "", type: "Percentage", validTill: "" });
    router.push("/dashboard/coupons");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
           
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Add Coupon</h1>
              <p className="text-sm text-gray-500">
                Create a new coupon for discounts or promotions
              </p>
            </div>
          </div>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition"
        >
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Coupon Code
            </label>
            <input
              type="text"
              name="code"
              value={formData.code}
              onChange={handleChange}
              placeholder="WELCOME10"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Discount
            </label>
            <input
              type="text"
              name="discount"
              value={formData.discount}
              onChange={handleChange}
              placeholder="10% or ₹100"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black"
            >
              <option value="Percentage">Percentage</option>
              <option value="Flat">Flat</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Valid Till
            </label>
            <input
              type="date"
              name="validTill"
              value={formData.validTill}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <button
            type="submit"
            className="w-full mt-4 flex items-center justify-center gap-2 bg-red-600 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-red-800"
          >
            <Check className="w-4 h-4" /> Add Coupon
          </button>
        </form>
      </div>
    </div>
  );
}
