"use client";

import { useParams, useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Sidebar from "@/components/dashboard/sidebar";

// Force dynamic rendering so Next.js won't require generateStaticParams
export const dynamic = "force-dynamic";

export default function DeviceDetail() {
  const router = useRouter();
  const params = useParams();

  // Decode the device name if it contains URL-encoded characters
  const deviceName = decodeURIComponent(params.deviceName as string);

  // Example: Hard-coded data, or you could fetch from an API
  const deviceData = {
    name: deviceName,
    status: "Running",
    temperature: "26.0°C",
    performance: "100%",
    lastActivity: "17/08/23 @ 03:00:08 am",
    description: "Detailed information and statistics about the device.",
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 p-6 min-h-screen">
        <Button variant="outline" onClick={() => router.back()}>
          ← Back
        </Button>
        <Card className="mt-6 p-6 bg-white dark:bg-black dark:border-gray-700">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {deviceData.name} Details
          </h1>
          <p className="mt-4 text-gray-700 dark:text-gray-300">
            Status: {deviceData.status}
          </p>
          <p className="mt-2 text-gray-700 dark:text-gray-300">
            Temperature: {deviceData.temperature}
          </p>
          <p className="mt-2 text-gray-700 dark:text-gray-300">
            Performance: {deviceData.performance}
          </p>
          <p className="mt-2 text-gray-700 dark:text-gray-300">
            Last Active: {deviceData.lastActivity}
          </p>
          <p className="mt-4 text-gray-700 dark:text-gray-300">
            {deviceData.description}
          </p>
        </Card>
      </div>
    </div>
  );
}
