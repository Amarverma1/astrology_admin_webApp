"use client";

import { useEffect, useState, useRef } from "react";
import { Bell, User, Settings, LogOut } from "lucide-react";
import Link from "next/link";
import { Transition } from "@headlessui/react";
import { requestNotificationPermission } from "../../lib/notificationPermission";

export default function Topbar() {
  const [admin, setAdmin] = useState<any>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // ✅ Load admin data from localStorage
  useEffect(() => {
    const savedAdmin = localStorage.getItem("adminInfo");
    if (savedAdmin) setAdmin(JSON.parse(savedAdmin));

    // Example: Set unread notifications (replace with API call)
    // setUnreadCount(3);
  }, []);

  // ✅ Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 🔔 Notification bell click handler
  const handleBellClick = async () => {
    const permission = await requestNotificationPermission();
    if (permission === "granted") {
      console.log("Notification permission granted");
    } else {
      console.log("Notification permission denied");
    }
    window.location.href = "/dashboard/notifications";
  };

  // 🚪 Logout
  const handleLogout = () => {
    localStorage.removeItem("adminInfo");
    localStorage.removeItem("adminToken");
    document.cookie =
      "admin_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.href = "/login";
  };

  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-20">
      <h2 className="font-black text-gray-800 text-lg tracking-tight">Admin Dashboard</h2>

      <div className="flex items-center gap-4 relative">
        {/* 🔔 Notification Bell */}
        <button
          className="relative p-2 hover:bg-gray-100 rounded-full"
          onClick={handleBellClick}
        >
          <Bell className="w-5 h-5 text-gray-600" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 bg-red-500 w-2 h-2 rounded-full animate-pulse" />
          )}
        </button>

        {/* 👤 Admin Avatar + Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            className="flex items-center gap-2 hover:bg-gray-100 rounded-full p-1.5 transition-colors"
            onClick={() => setDropdownOpen((prev) => !prev)}
          >
            <div className="w-8 h-8 bg-yellow-100 text-yellow-700 flex items-center justify-center rounded-full border border-gray-200">
              <User className="w-4 h-4" />
            </div>
            <span className="hidden sm:block font-semibold text-gray-800">
              {admin?.name || "Admin"}
            </span>
          </button>

          {/* Dropdown Menu */}
          <Transition
            show={dropdownOpen}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <div className="absolute right-0 mt-2 w-56 bg-white shadow-lg rounded-md border border-gray-200 z-30">
              {/* Admin Info */}
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-sm font-bold text-gray-800">
                  {admin?.name || "Administrator"}
                </p>
                <p className="text-xs text-gray-500">{admin?.email}</p>
              </div>

              {/* Menu Links */}
              <nav className="flex flex-col py-2">
                <Link
                  href="/dashboard/settings"
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-yellow-600"
                >
                  <Settings className="w-4 h-4" /> Settings
                </Link>
              </nav>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-red-600 border-t border-gray-100"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          </Transition>
        </div>
      </div>
    </header>
  );
}
