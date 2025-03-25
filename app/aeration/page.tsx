"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Fan,
  Timer,
  ArrowLeft,
  Menu,
  Power,
  Thermometer,
  Wind,
} from "lucide-react";
import Sidebar from "@/components/dashboard/sidebar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Modal } from "@/components/ui/modal";
import Image from "next/image";
import { motion } from "framer-motion";
import { GrainMonitorData } from "../types/grain-monitor";

// Simulated API data for Grain Monitor
const mockData = {
  id: "GTPL-053",
  aht: 23,
  hgs: 0,
  temperatures: {
    t0: 13.9,
    t1: 11.0,
    t2: 33.0,
    deltaT: 3,
  },
  blowerSpeed: 75,
  fans: [true, true, true, true],
  compressor: {
    hp: 295,
    lp: 59,
  },
};

export default function AerationPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const fanAnimation = useRef<gsap.core.Tween | null>(null);
  const [running, setRunning] = useState<boolean>(false);
  const [duration, setDuration] = useState<number>(1);
  const [runningTime, setRunningTime] = useState<{
    hours: number;
    minutes: number;
  }>({ hours: 0, minutes: 0 });
  const [temperature, setTemperature] = useState<{ t0: number; t2: number }>({
    t0: 26.0,
    t2: 32.9,
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("aeration"); // State for active tab
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Grain state variables
  const [isRunning, setIsRunning] = useState(false);
  const [temperatures, setTemperatures] = useState({
    t0: 13.9,
    t1: 11.0,
    t2: 33.0,
  });
  const [blowerPower, setBlowerPower] = useState(75);
  const [fanStatuses, setFanStatuses] = useState([true, true, true, true]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [data, setData] = useState<GrainMonitorData>(mockData);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setData((prev) => ({
        ...prev,
        temperatures: {
          ...prev.temperatures,
          t0: +(prev.temperatures.t0 + (Math.random() - 0.5)).toFixed(1),
          t1: +(prev.temperatures.t1 + (Math.random() - 0.5)).toFixed(1),
          t2: +(prev.temperatures.t2 + (Math.random() - 0.5)).toFixed(1),
        },
        blowerSpeed: Math.min(
          100,
          Math.max(0, prev.blowerSpeed + (Math.random() - 0.5) * 5)
        ),
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from(".aeration-element", {
        duration: 0.8,
        y: 20,
        opacity: 0,
        stagger: 0.1,
        ease: "power2.out",
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (running) {
      fanAnimation.current = gsap.to(".fan-blade", {
        rotate: 360,
        duration: 2,
        repeat: -1,
        ease: "linear",
      });
    } else {
      if (fanAnimation.current) {
        fanAnimation.current.kill();
      }
    }
  }, [running]);

  const handleConfigureClick = () => {
    setIsModalOpen(true);
  };

  return (
    <div className="flex h-screen">
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
            <Sidebar />
          </SheetContent>
        </Sheet>
      ) : (
        <div className="w-64 shrink-0">
          <Sidebar />
        </div>
      )}
      <div
        ref={containerRef}
        className="flex-1 p-6 bg-white dark:bg-black min-h-screen dark:border-gray-700"
      >
        <Card className="max-w-4xl mx-auto bg-white dark:bg-black dark:border-gray-700">
          <div className="border-b border-gray-200 dark:border-gray-700 p-4 flex justify-between items-center aeration-element">
            <div className="flex space-x-4 mt-4">
              <Button
                variant={activeTab === "aeration" ? "default" : "outline"}
                onClick={() => setActiveTab("aeration")}
              >
                Aeration
              </Button>
              <Button
                variant={activeTab === "grain" ? "default" : "outline"}
                onClick={() => setActiveTab("grain")}
              >
                Grain
              </Button>
              <Button
                variant={activeTab === "technik" ? "default" : "outline"}
                onClick={() => setActiveTab("technik")}
              >
                Technik
              </Button>
            </div>
            <div className="text-sm text-black dark:text-white">
              {new Date().toLocaleString()}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === "aeration" && (
              <div>
                {/* Aeration Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="aeration-element">
                    <div className="relative h-80 bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
                      <div className="absolute left-1/2 -translate-x-1/2 w-32 h-64 bg-gradient-to-b from-gray-300 dark:from-gray-700 to-gray-400 dark:to-gray-600 rounded-t-3xl">
                        <div className="absolute -left-12 top-1/2 flex items-center gap-2">
                          <span className="text-sm font-medium text-black dark:text-white">
                            T0
                          </span>
                          <div className="bg-white dark:bg-black p-2 rounded shadow-sm text-black dark:text-white">
                            {temperature.t0}°C
                          </div>
                        </div>
                      </div>
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                        <div className="relative w-24 h-24 bg-green-500 rounded-full flex items-center justify-center">
                          <div className="fan-blade w-16 h-16 text-white">
                            <Fan size={64} />
                          </div>
                          <div className="absolute top-full mt-2 text-center w-full">
                            <div className="text-sm font-medium text-black dark:text-white">
                              100%
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <Card className="p-4 aeration-element bg-white dark:bg-black dark:border-gray-700">
                      <h3 className="text-lg font-medium mb-4 text-black dark:text-white">
                        Control Panel
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-black dark:text-white">
                            Mode:
                          </span>
                          <span className="bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded text-black dark:text-white">
                            CONTINUOUS MODE
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-black dark:text-white">
                            Set Duration (h):
                          </span>
                          <Input
                            type="number"
                            value={duration}
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>
                            ) => setDuration(Number(e.target.value))}
                            className="w-24 bg-white dark:bg-black text-black dark:text-white"
                            min={1}
                            max={24}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-black dark:text-white">
                            T2:
                          </span>
                          <span className="text-black dark:text-white">
                            {temperature.t2}°C
                          </span>
                        </div>
                      </div>
                    </Card>

                    <div className="grid grid-cols-2 gap-4 aeration-element">
                      <Button
                        className={
                          running
                            ? "bg-red-500 hover:bg-red-600"
                            : "bg-green-500 hover:bg-green-600"
                        }
                        onClick={() => setRunning(!running)}
                      >
                        {running ? "AERATION STOP" : "AERATION START"}
                      </Button>
                      <Button variant="secondary">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        BACK
                      </Button>
                    </div>

                    <Card className="p-4 aeration-element bg-white dark:bg-black dark:border-gray-700">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-black dark:text-white">
                            Running Time
                          </h4>
                          <div className="mt-2 flex gap-4">
                            <div className="bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded text-black dark:text-white">
                              {String(runningTime.hours).padStart(2, "0")} h
                            </div>
                            <div className="bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded text-black dark:text-white">
                              {String(runningTime.minutes).padStart(2, "0")} min
                            </div>
                          </div>
                        </div>
                        <Timer className="w-6 h-6 text-gray-400" />
                      </div>
                    </Card>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "grain" && (
              <div>
                {/* Grain Content */}
                <h1 className="text-2xl font-bold text-black dark:text-white">
                  GRAIN TECHNIK
                </h1>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-6">
                  {/* Left Column - Silo and Controls */}
                  <div className="grain-element">
                    <div className="relative h-96 bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
                      {/* Silo Visualization */}
                      <div className="absolute left-1/2 -translate-x-1/2 w-40 h-80 bg-gradient-to-b from-gray-300 dark:from-gray-700 to-gray-400 dark:to-gray-600 rounded-t-3xl">
                        <div className="absolute -left-24 top-1/3 flex items-center gap-2">
                          <span className="text-sm font-medium text-black dark:text-white">
                            T0
                          </span>
                          <div className="bg-white dark:bg-black p-2 rounded shadow-sm text-black dark:text-white">
                            {temperatures.t0}°C
                          </div>
                        </div>
                      </div>

                      {/* Control Buttons */}
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col gap-3 w-full max-w-[200px]">
                        <Button
                          className={
                            isRunning
                              ? "bg-red-500 hover:bg-red-600"
                              : "bg-green-500 hover:bg-green-600"
                          }
                          onClick={() => setIsRunning(!isRunning)}
                        >
                          {isRunning ? "AUTO STOP" : "AUTO START"}
                        </Button>
                        <Button
                          variant="secondary"
                          onClick={handleConfigureClick}
                        >
                          <ArrowLeft className="w-4 h-4 mr-2" />
                          Configure Devices
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Middle Column - Temperature and Flow */}
                  <div className="space-y-6 grain-element">
                    <Card className="p-4 bg-white dark:bg-black dark:border-gray-700">
                      <h3 className="text-lg font-medium mb-4 text-black dark:text-white">
                        Temperature Control
                      </h3>
                      <div className="space-y-4">
                        <TemperatureDisplay
                          label="T0 = Supply Air Temp."
                          value={temperatures.t0}
                        />
                        <TemperatureDisplay
                          label="T1 = Cold Air Temp."
                          value={temperatures.t1}
                        />
                        <TemperatureDisplay
                          label="T2 = Ambient Air Temp."
                          value={temperatures.t2}
                        />
                      </div>
                    </Card>

                    <Card className="p-4 bg-white dark:bg-black dark:border-gray-700">
                      <h3 className="text-lg font-medium mb-4 text-black dark:text-white">
                        Blower Status
                      </h3>
                      <div className="relative w-32 h-32 mx-auto">
                        <div className="absolute inset-0 rounded-full border-8 border-green-200" />
                        <div
                          className="absolute inset-0 rounded-full border-8 border-green-500"
                          style={{
                            clipPath: `polygon(0 0, 100% 0, 100% ${blowerPower}%, 0 ${blowerPower}%)`,
                          }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-2xl font-bold text-black dark:text-white">
                            {blowerPower}%
                          </span>
                        </div>
                      </div>
                    </Card>
                  </div>

                  {/* Right Column - Fan Controls */}
                  <div className="grain-element">
                    <Card className="p-4 h-full bg-white dark:bg-black dark:border-gray-700">
                      <h3 className="text-lg font-medium mb-4 text-black dark:text-white">
                        Fan Controls
                      </h3>
                      <div className="space-y-6">
                        {fanStatuses.map((status, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between"
                          >
                            <span className="font-medium text-black dark:text-white">
                              Fan {index + 1}
                            </span>
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-3 h-3 rounded-full ${
                                  status ? "bg-green-500" : "bg-gray-300"
                                }`}
                              />
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  const newStatuses = [...fanStatuses];
                                  newStatuses[index] = !newStatuses[index];
                                  setFanStatuses(newStatuses);
                                }}
                              >
                                <Power className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </Card>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "technik" && (
              <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 p-8">
                <div className="mx-auto max-w-6xl bg-white/10 backdrop-blur-lg rounded-xl shadow-2xl p-6 text-white">
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-4">
                      <div className="bg-green-500 p-2 rounded-lg">
                        <Wind className="w-6 h-6" />
                      </div>
                      <h1 className="text-2xl font-bold">GRAIN TECHNIK</h1>
                    </div>
                    <div className="text-lg font-mono bg-gray-800/50 px-4 py-2 rounded-lg">
                      {data.id}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Silo */}
                    <div className="flex flex-col items-center space-y-4">
                      <motion.div
                        className="relative w-48 h-64 rounded-2xl overflow-hidden"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                      >
                        <Image
                          src="https://images.unsplash.com/photo-1635774855317-edf3ee4463db?w=800"
                          alt="Industrial Silo"
                          fill
                          className="object-cover"
                        />
                        <div
                          className="absolute bottom-0 w-full bg-gradient-to-t from-amber-500/80 to-amber-500/40 transition-all duration-500"
                          style={{ height: `${data.aht}%` }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      </motion.div>
                      <div className="space-y-2 w-full">
                        <button className="w-full bg-green-500/90 backdrop-blur text-white py-3 rounded-xl hover:bg-green-600 transition-colors font-medium">
                          AUTO START
                        </button>
                        <button className="w-full bg-red-500/90 backdrop-blur text-white py-3 rounded-xl hover:bg-red-600 transition-colors font-medium">
                          AUTO STOP
                        </button>
                        <button className="w-full bg-gray-700/50 backdrop-blur text-white py-3 rounded-xl hover:bg-gray-600/50 transition-colors font-medium">
                          BACK
                        </button>
                      </div>
                    </div>

                    {/* Middle Column - Temperature Readings */}
                    <div className="space-y-6">
                      {[
                        {
                          temp: data.temperatures.t0,
                          label: "SUPPLY AIR TEMP.",
                          delay: 0,
                        },
                        {
                          temp: data.temperatures.t1,
                          label: "COLD AIR TEMP.",
                          delay: 0.1,
                        },
                        {
                          temp: data.temperatures.t2,
                          label: "AMBIENT AIR TEMP.",
                          delay: 0.2,
                        },
                      ].map((item, index) => (
                        <motion.div
                          key={index}
                          className="bg-white/5 backdrop-blur p-6 rounded-xl border border-white/10"
                          initial={{ scale: 0.95, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ duration: 0.3, delay: item.delay }}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="bg-blue-500/20 p-2 rounded-lg">
                                <Thermometer className="text-blue-400 w-6 h-6" />
                              </div>
                              <div className="text-sm text-gray-300">
                                {item.label}
                              </div>
                            </div>
                            <span className="text-2xl font-mono text-blue-300">
                              {item.temp}°C
                            </span>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {/* Right Column - Blower and Fans */}
                    <div className="space-y-6">
                      <div className="relative bg-white/5 backdrop-blur p-6 rounded-xl border border-white/10">
                        <Image
                          src="https://images.unsplash.com/photo-1635774855336-4b753ce47b9f?w=800"
                          alt="Industrial Blower"
                          width={100}
                          height={100}
                          className="rounded-full"
                        />
                        <div
                          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
                                        text-2xl font-bold bg-green-500/90 px-3 py-1 rounded-lg"
                        >
                          {Math.round(data.blowerSpeed)}%
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        {data.fans.map((isActive, index) => (
                          <div
                            key={index}
                            className={`relative p-4 rounded-xl backdrop-blur border ${
                              isActive
                                ? "bg-green-500/20 border-green-500/30"
                                : "bg-white/5 border-white/10"
                            }`}
                          >
                            <motion.div
                              className="w-8 h-8"
                              animate={{ rotate: isActive ? 360 : 0 }}
                              transition={{
                                duration: 2,
                                ease: "linear",
                                repeat: Infinity,
                              }}
                            >
                              <Fan
                                className={`w-full h-full ${
                                  isActive ? "text-green-400" : "text-gray-400"
                                }`}
                              />
                            </motion.div>
                          </div>
                        ))}
                      </div>

                      <div className="bg-white/5 backdrop-blur p-6 rounded-xl border border-white/10">
                        <div className="relative">
                          <Image
                            src="https://images.unsplash.com/photo-1635774855342-78d4b9902d11?w=800"
                            alt="Industrial Compressor"
                            width={200}
                            height={100}
                            className="rounded-lg mb-4"
                          />
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-gray-300">HP</span>
                              <span className="font-mono text-xl text-green-400">
                                {data.compressor.hp}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-gray-300">LP</span>
                              <span className="font-mono text-xl text-blue-400">
                                {data.compressor.lp}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Modal for Configuration */}
          <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
            <div className="p-6 bg-white dark:bg-black">
              <h2 className="text-xl font-bold mb-4 text-black dark:text-white">
                Configure Devices
              </h2>
              <form>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2 text-black dark:text-white">
                    Device Name
                  </label>
                  <input
                    type="text"
                    className="border rounded p-2 w-full bg-white dark:bg-black text-black dark:text-white"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2 text-black dark:text-white">
                    Settings
                  </label>
                  <input
                    type="text"
                    className="border rounded p-2 w-full bg-white dark:bg-black text-black dark:text-white"
                  />
                </div>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  Save
                </Button>
              </form>
            </div>
          </Modal>
        </Card>
      </div>
    </div>
  );
}

function TemperatureDisplay({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="font-medium text-black dark:text-white">{label}</span>
      <div className="flex items-center gap-2">
        <Thermometer className="w-4 h-4 text-red-500" />
        <span className="text-black dark:text-white">{value}°C</span>
      </div>
    </div>
  );
}
