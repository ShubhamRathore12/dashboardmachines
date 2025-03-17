"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { Fan, Thermometer, Activity, Settings } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Sidebar from "@/components/dashboard/sidebar";
import { Modal } from "@/components/ui/modal";
import Link from "next/link";

export default function DevicesPage() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [image, setImage] = useState<File | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".device-card", {
        duration: 0.8,
        scale: 0.9,
        opacity: 0,
        stagger: 0.15,
        ease: "power3.out",
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const devices = [
    {
      name: "VI MIXER",
      status: "Running",
      temperature: "26.0°C",
      performance: "100%",
      lastActivity: "17/08/23 @ 03:00:08 am",
    },
    {
      name: "VI CUTTER",
      status: "Running",
      temperature: "24.8°C",
      performance: "95%",
      lastActivity: "17/08/23 @ 03:00:08 am",
    },
    {
      name: "AGITATOR MIXER 1",
      status: "Running",
      temperature: "32.9°C",
      performance: "85%",
      lastActivity: "17/08/23 @ 03:00:08 am",
    },
    {
      name: "NAS TANK",
      status: "Running",
      temperature: "33.6°C",
      performance: "90%",
      lastActivity: "17/08/23 @ 03:00:08 am",
    },
  ];

  const handleConfigureClick = () => {
    setIsModalOpen(true);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.size <= 10 * 1024 * 1024) {
      setImage(file);
    } else {
      alert("Please upload an image smaller than 10MB.");
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log("Image uploaded:", image);
    setIsModalOpen(false);
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div ref={containerRef} className="flex-1 p-6 bg-gray-50 min-h-screen">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Devices Overview</h1>
          <Button
            className="bg-blue-600 hover:bg-blue-700"
            onClick={handleConfigureClick}
          >
            <Settings className="w-4 h-4 mr-2" />
            Configure Devices
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {devices.map((device, index) => (
            <Card
              key={index}
              className="device-card p-6 hover:shadow-lg transition-all cursor-pointer"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold">{device.name}</h3>
                  <p className="text-sm text-gray-500">
                    Last active: {device.lastActivity}
                  </p>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                  {device.status}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4">
                <Stat
                  icon={Thermometer}
                  label="Temperature"
                  value={device.temperature}
                  color="text-red-500"
                />
                <Stat
                  icon={Activity}
                  label="Performance"
                  value={device.performance}
                  color="text-blue-500"
                />
                <Stat
                  icon={Fan}
                  label="Fan Speed"
                  value="Normal"
                  color="text-green-500"
                />
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end space-x-3">
                <Link href={`/devices/${device.name}`}>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleConfigureClick}
                >
                  Configure
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">Configure Devices</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Upload Device Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="border rounded p-2 w-full"
              />
            </div>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Save
            </Button>
          </form>
        </div>
      </Modal>
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: any;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="flex flex-col items-center text-center">
      <Icon className={`w-6 h-6 ${color} mb-2`} />
      <span className="text-sm text-gray-500">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}
