import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false, // ❌ not needed for JWT in localStorage
});

/**
 * 🔐 Attach JWT token to every request
 */
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * 🚨 Global response handler (optional but recommended)
 */
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      console.warn("Unauthorized – token missing or expired");

      // Optional: auto logout
      // localStorage.removeItem("seller_token");
      // window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default api;
