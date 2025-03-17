"use client";

import { useTheme } from "next-themes";
import Sidebar from "@/components/dashboard/sidebar";

export default function ContactPage() {
  const { theme } = useTheme();

  return (
    <div
      className={`flex h-screen ${
        theme === "dark" ? "bg-black" : "bg-gray-50"
      }`}
    >
      <Sidebar />
      <div className="flex-1 p-6">
        <h1
          className={`text-3xl font-bold mb-8 ${
            theme === "dark" ? "text-white" : "text-black"
          }`}
        >
          Contact Us
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <form className="contact-form bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2
              className={`text-2xl font-semibold mb-4 ${
                theme === "dark" ? "text-white" : "text-black"
              }`}
            >
              Get in Touch
            </h2>
            {["Name", "Email", "Message"].map((field, index) => (
              <div className="mb-4" key={index}>
                <label
                  className={`block text-sm font-medium ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  {field}
                </label>
                {field === "Message" ? (
                  <textarea
                    className={`mt-1 block w-full p-2 border rounded-md ${
                      theme === "dark"
                        ? "bg-gray-700 text-white"
                        : "bg-gray-100 text-black"
                    }`}
                    rows={4}
                  />
                ) : (
                  <input
                    type={field === "Email" ? "email" : "text"}
                    className={`mt-1 block w-full p-2 border rounded-md ${
                      theme === "dark"
                        ? "bg-gray-700 text-white"
                        : "bg-gray-100 text-black"
                    }`}
                  />
                )}
              </div>
            ))}
            <button
              type="submit"
              className={`w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition`}
            >
              Send Message
            </button>
          </form>

          <div className="h-80 flex items-center justify-center">
            <p
              className={`text-lg ${
                theme === "dark" ? "text-white" : "text-black"
              }`}
            >
              3D Animation Removed
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
