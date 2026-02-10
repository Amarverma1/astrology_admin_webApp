// lib/notificationPermission.ts
import { getToken } from "firebase/messaging";
import { messaging } from "./firebase";

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (typeof window === "undefined") return "denied";
  if (!("Notification" in window)) return "denied";

  const permission = await Notification.requestPermission();
  console.log("Notification permission:", permission);

  if (permission === "granted" && messaging) {
    try {
      const token = await getToken(messaging, {
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY!,
      });
      console.log("FCM Token:", token);

      // Optional: send token to backend
      await fetch("/api/save-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
    } catch (err) {
      console.error("Error getting FCM token:", err);
    }
  }

  return permission;
}
