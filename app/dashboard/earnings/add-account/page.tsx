"use client";

import { useState } from "react";
import { Banknote, CreditCard, Check, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AddBankAccountPage() {
  const router = useRouter();
  const [accountType, setAccountType] = useState<"Bank" | "UPI">("Bank");
  const [formData, setFormData] = useState({
    bankName: "",
    accountNumber: "",
    ifsc: "",
    branch: "",
    upiId: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (accountType === "Bank") {
      if (!formData.bankName || !formData.accountNumber || !formData.ifsc || !formData.branch) {
        alert("Please fill all bank account fields!");
        return;
      }
    } else {
      if (!formData.upiId) {
        alert("Please enter UPI ID!");
        return;
      }
    }

    // Save logic here
    alert(`✅ ${accountType === "Bank" ? "Bank Account" : "UPI ID"} added successfully!`);

    // Reset and redirect
    setFormData({ bankName: "", accountNumber: "", ifsc: "", branch: "", upiId: "" });
    router.push("/dashboard/bank-accounts");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
           
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Add Bank / UPI Account
              </h1>
              <p className="text-sm text-gray-500">
                Add a new bank account or UPI ID for payouts
              </p>
            </div>
          </div>
        </div>

        {/* TYPE TOGGLE */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setAccountType("Bank")}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md font-semibold text-sm ${
              accountType === "Bank"
                ? "bg-black text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <Banknote className="w-4 h-4" /> Bank Account
          </button>
          <button
            onClick={() => setAccountType("UPI")}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md font-semibold text-sm ${
              accountType === "UPI"
                ? "bg-black text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <CreditCard className="w-4 h-4" /> UPI
          </button>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition"
        >
          {accountType === "Bank" ? (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bank Name
                </label>
                <input
                  type="text"
                  name="bankName"
                  value={formData.bankName}
                  onChange={handleInputChange}
                  placeholder="HDFC Bank"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Account Number
                </label>
                <input
                  type="text"
                  name="accountNumber"
                  value={formData.accountNumber}
                  onChange={handleInputChange}
                  placeholder="1234567890"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  IFSC Code
                </label>
                <input
                  type="text"
                  name="ifsc"
                  value={formData.ifsc}
                  onChange={handleInputChange}
                  placeholder="HDFC0001234"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Branch
                </label>
                <input
                  type="text"
                  name="branch"
                  value={formData.branch}
                  onChange={handleInputChange}
                  placeholder="MG Road, Mumbai"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black"
                />
              </div>
            </>
          ) : (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                UPI ID
              </label>
              <input
                type="text"
                name="upiId"
                value={formData.upiId}
                onChange={handleInputChange}
                placeholder="9876543210@upi"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black"
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full mt-4 flex items-center justify-center gap-2 bg-red-600 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-red-800"
          >
            <Check className="w-4 h-4" /> Add {accountType === "Bank" ? "Bank Account" : "UPI"}
          </button>
        </form>
      </div>
    </div>
  );
}
