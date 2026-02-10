"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  UserCheck,
  Users,
  Calendar,
  BookOpen,
  Settings,
  LogOut,
  ChevronDown,
  ChevronUp,
  Sparkles,
  IndianRupee,
  Layers,
  User,
  Cpu,
  Bell,
  MessageCircle,
} from "lucide-react";
import { useState, useEffect } from "react";

/* ✅ Add prop type */
interface SidebarProps {
  activePath: string;
}

interface NavItem {
  href?: string;
  label: string;
  icon: any;
  submenu?: { href: string; label: string }[];
}

/* ✅ Keep all your menu structure */
const navItems: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },

  {
    label: "Astrologers",
    icon: UserCheck,
    submenu: [
      { href: "/dashboard/astrologers", label: "All Astrologers" },
      { href: "/dashboard/astrologers/add", label: "Add Astrologer" },
      { href: "/dashboard/astrologers/reviews", label: "Reviews & Ratings" },
    ],
  },

  {
    label: "Users",
    icon: Users,
    submenu: [
      { href: "/dashboard/users", label: "All Users" },
      { href: "/dashboard/subscriptions", label: "Subscriptions" },
    ],
  },

  {
    label: "Bookings",
    icon: Calendar,
    submenu: [
      { href: "/admin/bookings", label: "All Consultations" },
      { href: "/admin/bookings/chat", label: "Chat Consultations" },
      { href: "/admin/bookings/call", label: "Call Consultations" },
      { href: "/admin/bookings/video", label: "Video Consultations" },
    ],
  },

  {
    label: "Kundli & Horoscope",
    icon: BookOpen,
    submenu: [
      { href: "/admin/kundli", label: "Kundli Requests" },
      { href: "/admin/horoscope/daily", label: "Daily Horoscope" },
      { href: "/admin/horoscope/monthly", label: "Monthly Horoscope" },
    ],
  },

  {
    label: "Pooja & Remedies",
    icon: Sparkles,
    submenu: [
      { href: "/admin/pooja", label: "All Poojas" },
      { href: "/admin/remedies", label: "Remedies" },
      { href: "/admin/orders", label: "Pooja Orders" },
    ],
  },

  {
    label: "Earnings & Payouts",
    icon: IndianRupee,
    submenu: [
      { href: "/dashboard/earnings", label: "Platform Earnings" },
      { href: "/dashboard/earnings/payouts", label: "Astrologer Payouts" },
      { href: "/dashboard/commission", label: "Commission Settings" },
    ],
  },

  {
    label: "Content Management",
    icon: Layers,
    submenu: [
      { href: "/dashboard/blogs", label: "Blogs & Articles" },
      { href: "/dashboard/banners", label: "Banners" },
      { href: "/dashboard/faqs", label: "FAQs" },
      { href: "/dashboard/testimonials", label: "Testimonials" },
      { href: "/dashboard/Policy", label: "Terms & Policy" },
      { href: "/dashboard/Support", label: "Support" },
      { href: "/dashboard/AboutApp", label: "About App" },
    ],
  },

  {
    label: "AI Astrology",
    icon: Cpu,
    submenu: [
      { href: "/admin/ai/chat", label: "AI Chat Logs" },
      { href: "/admin/ai/reports", label: "Prediction Reports" },
    ],
  },

  {
    label: "Chat & Support",
    icon: MessageCircle,
    submenu: [
      { href: "/dashboard/chat", label: "Live Chat" },
      { href: "/admin/tickets", label: "Support Tickets" },
    ],
  },

  {
    label: "Settings",
    icon: Settings,
    submenu: [
      { href: "/dashboard/settings/profile", label: "Admin Profile" },
      { href: "/dashboard/settings/app", label: "App Settings" },
      { href: "/dashboard/settings/payments", label: "Payment Settings" },
    ],
  },

  { href: "/dashboard/notifications", label: "Notifications", icon: Bell },
];

/* ✅ Sidebar component now typed */
export default function Sidebar({ activePath }: SidebarProps) {
  const router = useRouter();
  const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({});
  const [mobileOpen, setMobileOpen] = useState(false);

  // ✅ Auto-expand submenus if current path matches
  useEffect(() => {
    const newOpenMenus: { [key: string]: boolean } = {};
    navItems.forEach((item) => {
      if (item.submenu?.some((sub) => activePath.startsWith(sub.href))) {
        newOpenMenus[item.label] = true;
      }
    });
    setOpenMenus(newOpenMenus);
  }, [activePath]);

  const toggleMenu = (label: string) => {
    setOpenMenus((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("seller");
    router.replace("/login");
  };

  return (
    <>
      {/* Hamburger Button for Mobile */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-30 p-2 bg-white rounded-md shadow-md"
      >
        <User className="w-6 h-6 text-red-600" />
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-100 z-20 flex flex-col transform transition-transform lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-20 h-15 rounded-lg flex items-center justify-center overflow-hidden">
              <img
                src="/assets/logo.png"
                alt="Logo"
                className="w-18 h-18 object-contain"
              />
            </div>
            <span className="text-lg font-semibold text-gray-800">
              Sri Mangalam
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto hide-scrollbar">
          {navItems.map((item) => {
            const isActive = item.href
              ? activePath === item.href
              : item.submenu?.some((sub) => activePath.startsWith(sub.href));
            return (
              <div key={item.label}>
                <div
                  className={`flex items-center justify-between px-4 py-3 rounded-lg cursor-pointer font-medium text-sm transition-all ${
                    isActive
                      ? "bg-red-50 text-red-600 font-semibold"
                      : "text-gray-600 hover:bg-gray-50 hover:text-red-600"
                  }`}
                  onClick={() => {
                    if (item.submenu) {
                      toggleMenu(item.label);
                    } else if (item.href) {
                      router.push(item.href);
                      setMobileOpen(false);
                    }
                  }}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="w-5 h-5 shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  {item.submenu && (
                    <span className="ml-auto">
                      {openMenus[item.label] ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </span>
                  )}
                </div>

                {item.submenu && openMenus[item.label] && (
                  <div className="ml-8 mt-1 flex flex-col space-y-1">
                    {item.submenu.map((sub) => (
                      <Link
                        key={sub.href}
                        href={sub.href}
                        className={`px-3 py-2 text-sm rounded-lg transition-all ${
                          activePath === sub.href
                            ? "bg-red-100 text-red-600 font-semibold"
                            : "text-gray-600 hover:bg-gray-50 hover:text-red-600"
                        }`}
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-100 mt-auto shrink-0">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 text-gray-500 hover:text-red-600 text-sm font-semibold transition-colors w-full"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
