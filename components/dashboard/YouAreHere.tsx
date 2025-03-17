"use client";

import { useEffect, useState } from "react";
import { middleOfUSA } from "../../lib/constants"; // Ensure this path is correct
import { Popup, useMap } from "@vis.gl/react-maplibre"; // Ensure you have the correct import
import { getLocation } from "../../lib/api"; // Ensure this path is correct

// Helper to compare two number arrays for equality.
function arraysEqual(a: number[], b: number[]) {
  if (a.length !== b.length) return false;
  return a.every((val, index) => val === b[index]);
}

export default function YouAreHere() {
  const [popupLocation, setPopupLocation] = useState<number[]>(middleOfUSA);
  const mapRef = useMap();
  const map = mapRef.current;

  useEffect(() => {
    if (!map) return;
    (async () => {
      const location = await getLocation();
      // Compare arrays by value.
      if (!arraysEqual(location, middleOfUSA)) {
        setPopupLocation(location);
        map.flyTo({ center: location, zoom: 8 });
      }
    })();
  }, [map]);

  if (!map) return null;

  return (
    <Popup longitude={popupLocation[0]} latitude={popupLocation[1]}>
      <h3>You are approximately here!</h3>
    </Popup>
  );
}
