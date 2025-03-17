"use client";

import { useEffect, useRef } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import YouAreHere from "./YouAreHere";
import { useTheme } from "next-themes";

const mapContainerStyle = {
  height: "400px",
  width: "100%",
};

const center = {
  lat: 20.5937, // Latitude for India
  lng: 78.9629, // Longitude for India
};

export default function MapView() {
  const { theme } = useTheme();

  return (
    <div
      className={`rounded border ${
        theme === "dark"
          ? "border-gray-700 bg-gray-800"
          : "border-gray-200 bg-white"
      }`}
    >
      <div className="p-3 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-sm font-medium text-black dark:text-white">
          Monitoring Location Overview
        </h2>
      </div>

      <LoadScript googleMapsApiKey="YOUR_API_KEY">
        {" "}
        {/* Replace with your API key */}
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={5}
        >
          <Marker position={center} />
          <YouAreHere />
        </GoogleMap>
      </LoadScript>
    </div>
  );
}
