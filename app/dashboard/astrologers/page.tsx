"use client";

import { useState, useEffect } from "react";
import {
  Eye,
  Trash2,
  Edit,
  X,
  CheckCircle,
  Wifi,
  WifiOff,
  Loader2,
} from "lucide-react";
import apiClient from "@/lib/apiClient";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css'; // prebuilt styles


/* -------------------- TYPES -------------------- */
type Astrologer = {
  user_id: number;
  name: string;
  email: string;
  mobile: string;
  is_active: boolean;
  is_blocked: boolean;
  created_at: string;
  updated_at: string;
  astrologer_profile_id?: number;
  bio?: string;
  experience_years?: number;
  languages?: string;
  education?: string;
  profile_photo?: string;
  rating?: string;
  total_reviews?: number;
  is_verified?: boolean;
  is_online?: boolean;
  chat_price_per_min?: string;
  call_price_per_min?: string;
  video_price_per_min?: string;
  currency?: string;
  specializations?: string;
};

/* -------------------- TOGGLE -------------------- */
function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className={`w-10 h-5 flex items-center rounded-full px-1 transition ${checked ? "bg-green-500" : "bg-gray-300"
        }`}
    >
      <span
        className={`w-4 h-4 bg-white rounded-full shadow transform transition ${checked ? "translate-x-5" : ""
          }`}
      />
    </button>
  );
}

/* -------------------- PAGE -------------------- */
export default function AllAstrologersPage() {
  const [data, setData] = useState<Astrologer[]>([]);
  const [loading, setLoading] = useState(false);

  // filters
  const [search, setSearch] = useState("");
  const [isActive, setIsActive] = useState("All");
  const [isBlocked, setIsBlocked] = useState("All");
  const [isVerified, setIsVerified] = useState("All");
  const [isOnline, setIsOnline] = useState("All");
  const [minRating, setMinRating] = useState("");
  const [maxRating, setMaxRating] = useState("");
  const [minExp, setMinExp] = useState("");
  const [maxExp, setMaxExp] = useState("");

  // At the top of your component
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [toDelete, setToDelete] = useState<Astrologer | null>(null);


  // pagination
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  // drawer
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selected, setSelected] = useState<Astrologer | null>(null);

  /* -------------------- FETCH ASTROLOGERS -------------------- */
  const fetchAstrologers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();

      if (search) params.append("search", search);
      if (isActive !== "All") params.append("is_active", String(isActive === "Active"));
      if (isBlocked !== "All") params.append("is_blocked", String(isBlocked === "Blocked"));
      if (isVerified !== "All") params.append("is_verified", String(isVerified === "Verified"));
      if (isOnline !== "All") params.append("is_online", String(isOnline === "Online"));
      if (minRating) params.append("min_rating", minRating);
      if (maxRating) params.append("max_rating", maxRating);
      if (minExp) params.append("min_experience", minExp);
      if (maxExp) params.append("max_experience", maxExp);
      params.append("page", String(page));
      params.append("limit", String(limit));

      const res = await apiClient.get(`/admin/astrologers?${params.toString()}`);

      if (res.data?.astrologers) {
        setData(res.data.astrologers);
        setTotalPages(res.data.totalPages);
      }
    } catch (err) {
      console.error("Failed to load astrologers:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!toDelete) return;

    try {
      const res = await apiClient.delete(`/admin/users/${toDelete.user_id}`);
      if (res.data?.success) {
        fetchAstrologers(); // refresh table
        setDeleteModalOpen(false);
        setToDelete(null);
      }
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };


  useEffect(() => {
    fetchAstrologers();
  }, [page, limit, search, isActive, isBlocked, isVerified, isOnline]);

  /* -------------------- HANDLE TOGGLES -------------------- */
  const toggleActive = async (id: number) => {
    try {
      const res = await apiClient.patch(`/admin/users/${id}/toggle-active`);
      if (res.data?.success) fetchAstrologers();
    } catch (e) {
      console.error("Active toggle failed", e);
    }
  };

  const toggleBlocked = async (id: number) => {
    try {
      const res = await apiClient.patch(`/admin/users/${id}/toggle-block`);
      if (res.data?.success) fetchAstrologers();
    } catch (e) {
      console.error("Block toggle failed", e);
    }
  };

  /* -------------------- RENDER -------------------- */
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold mb-4">All Astrologers</h1>

      <div className="bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition">
        {/* Filters Section */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <div className="flex items-center bg-gray-50 rounded-lg shadow-sm px-3 py-2 w-64">
            <input
              type="text"
              placeholder="Search astrologer..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent outline-none flex-1 text-sm text-gray-700 placeholder-gray-400"
            />
          </div>

          {/* Filters */}
          {["isActive", "isBlocked", "isVerified", "isOnline"].map((filter) => {
            const stateMap: Record<string, any> = {
              isActive: { state: isActive, setter: setIsActive, options: ["All", "Active", "Inactive"] },
              isBlocked: { state: isBlocked, setter: setIsBlocked, options: ["All", "Blocked", "Unblocked"] },
              isVerified: { state: isVerified, setter: setIsVerified, options: ["All", "Verified", "Unverified"] },
              isOnline: { state: isOnline, setter: setIsOnline, options: ["All", "Online", "Offline"] },
            };
            const f = stateMap[filter];
            return (
              <select
                key={filter}
                value={f.state}
                onChange={(e) => {
                  setPage(1);
                  f.setter(e.target.value);
                }}
                className="input-filter"
              >
                {f.options.map((opt) => (
                  <option key={opt}>{opt}</option>
                ))}
              </select>
            );
          })}

          {/* Range Filters */}
          {[
            { placeholder: "Min Rating", value: minRating, setter: setMinRating },
            { placeholder: "Max Rating", value: maxRating, setter: setMaxRating },
            { placeholder: "Min Exp", value: minExp, setter: setMinExp },
            { placeholder: "Max Exp", value: maxExp, setter: setMaxExp },
          ].map(({ placeholder, value, setter }) => (
            <input
              key={placeholder}
              placeholder={placeholder}
              type="number"
              value={value}
              onChange={(e) => setter(e.target.value)}
              className="input-filter w-24"
            />
          ))}

          <button
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
            onClick={() => {
              setPage(1);
              fetchAstrologers();
            }}
          >
            Apply
          </button>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex justify-center items-center py-10 text-gray-500">
            <Loader2 className="animate-spin w-5 h-5 mr-2" />
            Loading astrologers...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-100 text-gray-700 border-b">
                <tr>
                  <th className="text-left px-3 py-2">Photo</th>
                  <th className="text-left px-3 py-2">Astrologer</th>
                  <th className="text-left px-3 py-2">Contact</th>
                  <th className="text-left px-3 py-2">Rating</th>
                  <th className="text-center px-3 py-2">Status</th>
                  <th className="text-center px-3 py-2">Active</th>
                  <th className="text-center px-3 py-2">Blocked</th>
                  <th className="text-center px-3 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-6 text-gray-500">
                      No astrologers found
                    </td>
                  </tr>
                ) : (
                  data.map((a) => (
                    <tr key={a.user_id} className="hover:bg-gray-50 transition">
                      <td className="px-3 py-3">
                        <img
                          src={a.profile_photo ? `/uploads/${a.profile_photo}` : "/default-user.png"}
                          className="w-10 h-10 rounded-full object-cover"
                          alt={a.name}
                        />
                      </td>
                      <td className="px-3 py-3">
                        <div>
                          <p className="font-medium flex items-center">
                            {a.name}
                            {a.is_verified && <CheckCircle className="text-blue-500 w-4 h-4" />}
                          </p>
                          <p className="text-xs text-gray-500">{a.specializations}</p>
                        </div>
                      </td>
                      <td>
                        <p>{a.mobile}</p>
                        <p className="text-xs text-gray-500">{a.email}</p>
                      </td>
                      <td>⭐ {a.rating || "0.0"} ({a.total_reviews || 0})</td>
                      <td className="text-center">
                        {a.is_online ? (
                          <span className="flex items-center justify-center text-green-600 text-xs gap-1">
                            <Wifi className="w-3 h-3" /> Online
                          </span>
                        ) : (
                          <span className="flex items-center justify-center text-gray-400 text-xs gap-1">
                            <WifiOff className="w-3 h-3" /> Offline
                          </span>
                        )}
                      </td>
                      <td className="text-center ">
                        <Toggle checked={a.is_active} onChange={() => toggleActive(a.user_id)} />
                      </td>
                      <td className="text-center">
                        <Toggle checked={a.is_blocked} onChange={() => toggleBlocked(a.user_id)} />
                      </td>
                      <td className="text-center">
                        <button
                          onClick={() => {
                            setSelected(a);
                            setDrawerOpen(true);
                          }}
                          className="p-1.5 hover:bg-gray-100 rounded"
                        >
                          <Eye size={16} />
                        </button>
                        <button className="p-1.5 hover:bg-gray-100 rounded">
                          <Edit size={16} />
                        </button>
                        <button
                          className="p-1.5 hover:bg-gray-100 rounded text-red-600"
                          onClick={() => {
                            confirmAlert({
                              title: 'Delete Astrologer',
                              message: `Are you sure you want to delete ${a.name}? This action cannot be undone.`,
                              buttons: [
                                {
                                  label: 'Cancel',
                                  onClick: () => { } // do nothing
                                },
                                {
                                  label: 'Delete',
                                  onClick: async () => {
                                    try {
                                      const res = await apiClient.delete(`/admin/${a.user_id}`);
                                      if (res.data?.success) {
                                        fetchAstrologers(); // refresh table
                                      }
                                    } catch (err) {
                                      console.error("Delete failed:", err);
                                    }
                                  }
                                }
                              ],
                              closeOnEscape: true,
                              closeOnClickOutside: true,
                            });
                          }}
                        >
                          <Trash2 size={16} />
                        </button>


                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-3 mt-6">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1 text-sm bg-gray-100 rounded disabled:opacity-50"
            >
              Prev
            </button>
            <span className="text-sm text-gray-600">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1 text-sm bg-gray-100 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Drawer */}
      {drawerOpen && selected && <Drawer selected={selected} close={() => setDrawerOpen(false)} />}
    </div>
  );
}



/* -------------------- DRAWER -------------------- */
function Drawer({ selected, close }: { selected: Astrologer; close: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/30 flex justify-end z-50">
      <div className="flex-1" onClick={close} />
      <div className="bg-white w-[480px] h-full p-6 shadow-2xl overflow-y-auto border-l border-gray-100">
        <div className="flex justify-between items-center mb-5">
          <h2 className="font-semibold text-lg text-gray-800">Astrologer Details</h2>
          <X className="cursor-pointer text-gray-500 hover:text-gray-700" onClick={close} />
        </div>

        {/* Profile Section */}
        <div className="text-center border-b border-gray-100 pb-5">
          <img
            src={selected.profile_photo ? `/uploads/${selected.profile_photo}` : "/default-user.png"}
            className="w-28 h-28 rounded-full mx-auto mb-3 object-cover border border-gray-200 shadow-sm"
            alt={selected.name}
          />
          <h3 className="font-bold text-lg text-gray-800">{selected.name}</h3>
          <div className="flex justify-center gap-2 mt-1">
            {selected.is_verified && (
              <span className="flex items-center gap-1 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                <CheckCircle className="w-3 h-3" /> Verified
              </span>
            )}
            {selected.is_online ? (
              <span className="flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                <Wifi className="w-3 h-3" /> Online
              </span>
            ) : (
              <span className="flex items-center gap-1 text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                <WifiOff className="w-3 h-3" /> Offline
              </span>
            )}
            {selected.is_blocked && (
              <span className="flex items-center gap-1 text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                Blocked
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-2">
            ⭐ {selected.rating || "0.0"} ({selected.total_reviews || 0} reviews)
          </p>
        </div>

        {/* Details */}
        <div className="mt-6 text-sm text-gray-700 space-y-5">
          <Section title="Contact Info">
            <div className="grid grid-cols-2 gap-y-2">
              <p><b>Email:</b><br />{selected.email || "—"}</p>
              <p><b>Mobile:</b><br />{selected.mobile || "—"}</p>
              <p><b>User ID:</b><br />{selected.user_id}</p>
              <p><b>Profile ID:</b><br />{selected.astrologer_profile_id}</p>
            </div>
          </Section>

          <Section title="Profile Info">
            <div className="grid grid-cols-2 gap-y-2">
              <p><b>Experience:</b><br />{selected.experience_years || 0} yrs</p>
              <p><b>Education:</b><br />{selected.education || "—"}</p>
              <p><b>Languages:</b><br />{selected.languages || "—"}</p>
              <p><b>Verified:</b><br />{selected.is_verified ? "Yes" : "No"}</p>
            </div>
            <p className="mt-2"><b>Bio:</b><br />{selected.bio || "—"}</p>
          </Section>

          <Section title="Specializations">
            <p>{selected.specializations || "—"}</p>
          </Section>

          <Section title="Pricing (per minute)">
            <div className="grid grid-cols-3 text-center border border-gray-100 rounded-lg overflow-hidden">
              <div className="py-2 bg-gray-50">
                <p className="text-xs text-gray-500">Chat</p>
                <p className="font-semibold text-gray-800">₹{selected.chat_price_per_min || "—"}</p>
              </div>
              <div className="py-2 border-x border-gray-100">
                <p className="text-xs text-gray-500">Call</p>
                <p className="font-semibold text-gray-800">₹{selected.call_price_per_min || "—"}</p>
              </div>
              <div className="py-2 bg-gray-50">
                <p className="text-xs text-gray-500">Video</p>
                <p className="font-semibold text-gray-800">₹{selected.video_price_per_min || "—"}</p>
              </div>
            </div>
          </Section>

          <Section title="Account Details">
            <div className="grid grid-cols-2 gap-y-2">
              <p><b>Currency:</b><br />{selected.currency || "INR"}</p>
              <p><b>Joined:</b><br />{new Date(selected.created_at).toLocaleDateString()}</p>
              <p><b>Last Updated:</b><br />{new Date(selected.updated_at).toLocaleDateString()}</p>
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
}

/* -------------------- SECTION -------------------- */
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="font-semibold text-gray-800 mb-2 border-l-4 border-yellow-400 pl-2">
        {title}
      </h4>
      {children}
    </div>
  );
}

/* --------- Tailwind Filter Input Helper --------- */
<style jsx>{`
  .input-filter {
    @apply px-3 py-2 text-sm rounded bg-gray-100 border border-gray-200 outline-none focus:ring-2 focus:ring-blue-400 transition;
  }
`}</style>
