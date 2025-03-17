"use client";

import { useRouter } from "next/router";

export default function DeviceDetailsPage() {
  const router = useRouter();
  const { deviceName } = router.query; // Get the device name from the query parameters

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">{deviceName}</h1>
      {/* Add more details about the device here */}
      <p>Details about the device will go here.</p>
      <button
        onClick={() => router.back()}
        className="mt-4 bg-blue-600 text-white p-2 rounded"
      >
        Go Back
      </button>
    </div>
  );
}
