"use client";

import { useState } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
import Sidebar from "./sidebar";
import MapView from "./map-view";
import ActivityPanel from "./activity-panel";
import StatsPanel from "./stats-panel";
import { MonitoringProvider } from "@/context/monitoring-context";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Plus, Minus, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";

export default function DashboardLayout() {
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { theme, setTheme } = useTheme();
  const [zoomLevel, setZoomLevel] = useState(1);

  const SidebarContent = (
    <div className="relative h-full bg-gray-100 dark:bg-gray-900 text-black dark:text-white">
      <Sidebar />
    </div>
  );

  return (
    <MonitoringProvider>
      <div className="flex h-screen bg-background dark:bg-black">
        {/* Mobile Sidebar */}
        {isMobile ? (
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="fixed top-4 left-4 z-50"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-64">
              {SidebarContent}
            </SheetContent>
          </Sheet>
        ) : (
          <div className="w-64 shrink-0">{SidebarContent}</div>
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 overflow-auto relative">
          {/* Zoom Controls - Responsive & Always on Top */}
          <div
            className={`fixed flex flex-col items-center space-y-2 p-3 rounded-lg z-50 shadow-lg ${
              isMobile
                ? "bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-700"
                : "top-4 right-4 bg-gray-800"
            }`}
          >
            <button
              onClick={() => setZoomLevel((prev) => Math.min(prev + 0.1, 2))}
              className="text-white"
            >
              <Plus className="h-5 w-5" />
            </button>
            <button
              onClick={() => setZoomLevel((prev) => Math.max(prev - 0.1, 1))}
              className="text-white"
            >
              <Minus className="h-5 w-5" />
            </button>
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="text-white"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>
          </div>

          {/* Content with Zoom Effect */}
          <div
            className="relative transform transition-transform origin-top-left"
            style={{
              transform: `scale(${zoomLevel}) translateX(${
                (zoomLevel - 1) * 256
              }px)`,
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div className="space-y-4 md:space-y-6">
                {/* Map Card */}
                <div className="p-4 rounded-lg shadow bg-white dark:bg-gray-800 text-black dark:text-white">
                  <MapView />
                </div>
                {/* Activity Panel Card */}
                <div className="p-4 rounded-lg shadow bg-white dark:bg-gray-800 text-black dark:text-white">
                  <ActivityPanel />
                </div>
              </div>
              <div>
                {/* Stats Panel Card */}
                <div className="p-4 rounded-lg shadow bg-white dark:bg-gray-800 text-black dark:text-white">
                  <StatsPanel />
                </div>
              </div>
            </div>
            <footer className="mt-6 text-center text-sm text-muted-foreground">
              © 2023, powered by Faction Labs
            </footer>
          </div>
        </main>
      </div>
    </MonitoringProvider>
  );
}
