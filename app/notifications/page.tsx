"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import Sidebar from "@/components/dashboard/sidebar"; // Import the Sidebar component
import { useTheme } from "next-themes"; // Import useTheme for dark/light mode
import { Card } from "@/components/ui/card"; // Assuming you have a Card component
import { Bell, CheckCircle, Info, XCircle } from "lucide-react"; // Import icons

export default function NotificationPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".notification-card", {
        duration: 0.8,
        y: 20,
        opacity: 0,
        stagger: 0.1,
        ease: "power2.out",
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const notifications = [
    {
      id: 1,
      message: "New user registered",
      time: "2 mins ago",
      icon: <Bell className="w-5 h-5 text-blue-500" />,
    },
    {
      id: 2,
      message: "Server maintenance scheduled",
      time: "1 hour ago",
      icon: <Info className="w-5 h-5 text-yellow-500" />,
    },
    {
      id: 3,
      message: "New comment on your post",
      time: "3 hours ago",
      icon: <CheckCircle className="w-5 h-5 text-green-500" />,
    },
    {
      id: 4,
      message: "Password changed successfully",
      time: "5 hours ago",
      icon: <XCircle className="w-5 h-5 text-red-500" />,
    },
  ];

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div
        ref={containerRef}
        className={`flex-1 p-6 ${
          theme === "dark" ? "bg-black" : "bg-gray-50"
        } min-h-screen`}
      >
        <h1
          className={`text-3xl font-bold mb-8 ${
            theme === "dark" ? "text-white" : "text-black"
          }`}
        >
          Notifications
        </h1>

        <div className="grid grid-cols-1 gap-6">
          {notifications.map((notification) => (
            <Card
              key={notification.id}
              className={`notification-card p-4 hover:shadow-xl transition-shadow transform hover:scale-105 ${
                theme === "dark" ? "bg-gray-800" : "bg-white"
              } rounded-lg border border-gray-200 dark:border-gray-700`}
            >
              <div className="flex items-center mb-2">
                {notification.icon}
                <p
                  className={`text-lg ml-2 ${
                    theme === "dark" ? "text-white" : "text-black"
                  }`}
                >
                  {notification.message}
                </p>
              </div>
              <span
                className={`text-sm ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {notification.time}
              </span>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
