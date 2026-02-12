
"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import { messaging } from "../lib/firebase";
import { onMessage } from "firebase/messaging";
import { requestNotificationPermission } from "../lib/notificationPermission";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

  // 🔐 AUTH CHECK
  useEffect(() => {
    if (typeof window === "undefined") return;

    const token = localStorage.getItem("adminToken");
    if (!token) {
      router.replace("//login");
    } else {
      setLoading(false);
    }
  }, [router]);

  // 🔔 REGISTER SERVICE WORKER & LISTEN FOR NOTIFICATIONS
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!messaging) return;

    // ✅ Register Firebase Service Worker (for background notifications)
    // In DashboardLayout useEffect
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/firebase-messaging-sw.js")
        .then((registration) => {
          console.log("SW registered:", registration);

          // Make it take control immediately
          registration.update();
          if (registration.waiting) {
            registration.waiting.postMessage({ type: "SKIP_WAITING" });
          }

          navigator.serviceWorker.ready.then((reg) => {
            console.log("SW ready:", reg);
          });
        })
        .catch((err) => console.error("SW registration failed:", err));
    }


    // ✅ Listen for foreground messages
    const unsubscribe = onMessage(messaging, (payload) => {
      console.log("📩 Foreground notification received:", payload);

      if (Notification.permission === "granted") {
        new Notification(payload.notification?.title || "Nakshtra Sutra", {
          body: payload.notification?.body,
          icon: "/logo1.png",
        });
      }

      // Optional: navigate if route provided
      if (payload?.data?.route) {
        router.push(payload.data.route);
      }
    });

    return () => unsubscribe();
  }, [router]);

  // ✅ OPTIONAL: Ask notification permission after user clicks Bell
  // You can remove the direct call here to prevent auto-block
  // requestNotificationPermission();

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-600">
        Checking authentication...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
  <Sidebar />
  <div className="flex-1 flex flex-col lg:ml-60">
    <Topbar />
    <main className="p-2 sm:p-6 lg:p-8">
      {children}
    </main>
  </div>
</div>

  );
}
