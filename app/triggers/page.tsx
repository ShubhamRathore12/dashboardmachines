// app/triggers/page.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { Card } from "@/components/ui/card"; // Assuming you have a Card component
import { PlusCircle, Menu } from "lucide-react"; // Import icons
import Sidebar from "@/components/dashboard/sidebar"; // Import the Sidebar component
import { Button } from "@/components/ui/button"; // Import Button component
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"; // Import Sheet components
import { useMediaQuery } from "@/hooks/use-media-query";

export default function TriggersPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State for sidebar visibility
  const isMobile = useMediaQuery("(max-width: 768px)");
  const SidebarContent = (
    <div className="relative h-full bg-gray-100 dark:bg-gray-900 text-black dark:text-white">
      <Sidebar />
    </div>
  );

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".trigger-card", {
        duration: 0.8,
        y: 20,
        opacity: 0,
        stagger: 0.1,
        ease: "power2.out",
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const triggers = [
    { id: 1, name: "Trigger 1", description: "Description for trigger 1" },
    { id: 2, name: "Trigger 2", description: "Description for trigger 2" },
    { id: 3, name: "Trigger 3", description: "Description for trigger 3" },
  ];

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-black">
      {/* Hamburger Menu for Mobile */}
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
      )}{" "}
      {/* Sidebar for larger screens */}
      <div ref={containerRef} className="flex-1 p-6">
        <h1 className="text-3xl font-bold mb-8 text-black dark:text-white">
          Triggers
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {triggers.map((trigger) => (
            <Card
              key={trigger.id}
              className="trigger-card p-4 hover:shadow-xl transition-shadow bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
            >
              <h2 className="text-lg font-semibold text-black dark:text-white">
                {trigger.name}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {trigger.description}
              </p>
            </Card>
          ))}
        </div>

        <button className="mt-6 p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition">
          <PlusCircle className="w-4 h-4 inline" /> Add Trigger
        </button>
      </div>
    </div>
  );
}
