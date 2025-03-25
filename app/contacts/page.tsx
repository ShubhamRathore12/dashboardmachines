// app/contacts/page.tsx
"use client";

import { useTheme } from "next-themes";
import Sidebar from "@/components/dashboard/sidebar";
import { useState } from "react"; // Import useState for managing sidebar state
import { Button } from "@/components/ui/button"; // Import Button component
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"; // Import Sheet components
import { Menu } from "lucide-react"; // Import Menu icon
import { useMediaQuery } from "@/hooks/use-media-query";

export default function ContactPage() {
  const { theme } = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State for sidebar visibility
  const isMobile = useMediaQuery("(max-width: 768px)");
  const SidebarContent = (
    <div className="relative h-full bg-gray-100 dark:bg-gray-900 text-black dark:text-white">
      <Sidebar />
    </div>
  );

  return (
    <div className={`flex h-screen bg-gray-50 dark:bg-black`}>
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
      <div className="flex-1 p-6">
        <h1 className="text-3xl font-bold mb-8 text-black dark:text-white">
          Contact Us
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <form className="contact-form bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4 text-black dark:text-white">
              Get in Touch
            </h2>
            {["Name", "Email", "Message"].map((field, index) => (
              <div className="mb-4" key={index}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {field}
                </label>
                {field === "Message" ? (
                  <textarea
                    className="mt-1 block w-full p-2 border rounded-md bg-gray-100 dark:bg-gray-700 text-black dark:text-white"
                    rows={4}
                  />
                ) : (
                  <input
                    type={field === "Email" ? "email" : "text"}
                    className="mt-1 block w-full p-2 border rounded-md bg-gray-100 dark:bg-gray-700 text-black dark:text-white"
                  />
                )}
              </div>
            ))}
            <button
              type="submit"
              className="w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
            >
              Send Message
            </button>
          </form>

          <div className="h-80 flex items-center justify-center">
            <p className="text-lg text-black dark:text-white">
              3D Animation Removed
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
