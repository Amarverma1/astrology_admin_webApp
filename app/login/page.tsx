"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import apiClient from "@/lib/apiClient";
import { Loader2, Eye, EyeOff } from "lucide-react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // 👈 NEW
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await apiClient.post("/admin/login", { email, password });

      if (res.data?.token) {
        localStorage.setItem("adminToken", res.data.token);

        if (res.data.admin) {
          localStorage.setItem("adminInfo", JSON.stringify(res.data.admin));
        }

        router.push("/dashboard");
      } else {
        alert("Unexpected response from server");
      }
    } catch (err: any) {
      alert(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-900 px-4">
      <div className="bg-gray-800 rounded-lg shadow-md p-8 w-full max-w-sm">
        <h1 className="text-xl font-semibold text-yellow-400 text-center mb-6">
          Astrology Admin Panel
        </h1>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="px-3 py-2 rounded bg-gray-700 text-gray-100 text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-yellow-400"
            required
          />

          {/* PASSWORD WITH EYE BUTTON */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 pr-10 rounded bg-gray-700 text-gray-100 text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-yellow-400"
              required
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-yellow-400"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-yellow-400 text-gray-900 font-medium py-2 rounded text-sm hover:bg-yellow-500 transition-colors flex items-center justify-center"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin w-4 h-4 mr-2" />
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </button>
        </form>

        <p className="text-gray-400 text-xs text-center mt-6">
          © 2026 Astrology Admin Panel
        </p>
      </div>
    </main>
  );
}
