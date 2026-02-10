"use client";

import { useState } from "react";
import {
  Bell,
  CheckCircle,
  AlertTriangle,
  Truck,
  Gift,
  Trash2,
  Package,
  IndianRupee,
  Bike,
} from "lucide-react";

type NotificationType =
  | "order"
  | "product"
  | "rider"
  | "payout"
  | "promo"
  | "system"
  | "warning";

interface Notification {
  id: number;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  time: string;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      title: "New Order Placed",
      message: "Order #ORD-10245 has been created by a customer.",
      type: "order",
      read: false,
      time: "2 min ago",
    },
    {
      id: 2,
      title: "Low Stock Alert",
      message: "Product 'Apple Juice 1L' is out of stock.",
      type: "product",
      read: false,
      time: "10 min ago",
    },
    {
      id: 3,
      title: "Rider Assigned",
      message: "Rider Rahul has been assigned to Order #ORD-10245.",
      type: "rider",
      read: true,
      time: "1 hour ago",
    },
    {
      id: 4,
      title: "Payout Successful",
      message: "₹4,250 credited to your bank account.",
      type: "payout",
      read: false,
      time: "Today, 9:30 AM",
    },
    {
      id: 5,
      title: "System Update",
      message: "New features added to order management.",
      type: "system",
      read: true,
      time: "Yesterday",
    },
  ]);

  const markAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const deleteNotification = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getIcon = (type: NotificationType) => {
    const iconMap = {
      order: <Truck className="text-blue-600" />,
      product: <Package className="text-orange-600" />,
      rider: <Bike className="text-purple-600" />,
      payout: <IndianRupee className="text-green-600" />,
      promo: <Gift className="text-pink-600" />,
      warning: <AlertTriangle className="text-yellow-600" />,
      system: <Bell className="text-gray-600" />,
    };
    return iconMap[type];
  };

  const getBadge = (type: NotificationType) => {
    const badgeMap = {
      order: "bg-blue-100 text-blue-700",
      product: "bg-orange-100 text-orange-700",
      rider: "bg-purple-100 text-purple-700",
      payout: "bg-green-100 text-green-700",
      promo: "bg-pink-100 text-pink-700",
      warning: "bg-yellow-100 text-yellow-700",
      system: "bg-gray-100 text-gray-700",
    };
    return badgeMap[type];
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-black text-gray-900">
              Notifications
            </h1>
            <p className="text-sm text-gray-500">
              {unreadCount} unread notifications
            </p>
          </div>
        </div>

        {/* List */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm divide-y">
          {notifications.length === 0 && (
            <div className="p-10 text-center text-gray-500">
              🎉 You're all caught up!
            </div>
          )}

          {notifications.map((n) => (
            <div
              key={n.id}
              className={`flex gap-4 p-5 transition hover:bg-gray-50 ${
                !n.read ? "bg-red-50/40" : ""
              }`}
            >
              {/* Icon */}
              <div className="mt-1 w-10 h-10 flex items-center justify-center rounded-full bg-gray-100">
                {getIcon(n.type)}
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {n.title}
                    </h3>
                    <span
                      className={`inline-block mt-1 px-2 py-0.5 text-xs rounded-full font-semibold ${getBadge(
                        n.type
                      )}`}
                    >
                      {n.type.toUpperCase()}
                    </span>
                  </div>
                  <span className="text-xs text-gray-400">
                    {n.time}
                  </span>
                </div>

                <p className="text-sm text-gray-600 mt-2">
                  {n.message}
                </p>

                {/* Actions */}
                <div className="flex gap-4 mt-3">
                  {!n.read && (
                    <button
                      onClick={() => markAsRead(n.id)}
                      className="text-xs font-semibold text-green-600 hover:underline flex items-center gap-1"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Mark as read
                    </button>
                  )}
                  <button
                    onClick={() => deleteNotification(n.id)}
                    className="text-xs font-semibold text-red-600 hover:underline flex items-center gap-1"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
