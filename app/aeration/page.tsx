"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Fan, Thermometer, Timer, ArrowLeft } from "lucide-react";
import Sidebar from "@/components/dashboard/sidebar";

export default function AerationPage() {
  // Specify the element type for containerRef (HTMLDivElement) and set initial value to null.
  const containerRef = useRef<HTMLDivElement>(null);

  // Specify the type for the gsap animation instance.
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

  useEffect(() => {
    // Ensure containerRef.current exists before using it.
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

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div
        ref={containerRef}
        className="flex-1 p-6 bg-white dark:bg-black min-h-screen dark:border-gray-700"
      >
        <Card className="max-w-4xl mx-auto bg-white dark:bg-black dark:border-gray-700">
          <div className="border-b border-gray-200 dark:border-gray-700 p-4 flex justify-between items-center aeration-element">
            <h1 className="text-2xl font-bold text-black dark:text-white">
              AERATION
            </h1>
            <div className="text-sm text-black dark:text-white">
              {new Date().toLocaleString()}
            </div>
          </div>
          {/* ... rest of your components */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="aeration-element">
              <div className="relative h-80 bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
                {/* Silo Visualization */}
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
                {/* Fan Visualization */}
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
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setDuration(Number(e.target.value))
                      }
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
        </Card>
      </div>
    </div>
  );
}
