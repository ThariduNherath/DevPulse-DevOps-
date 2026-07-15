"use client";

import { useEffect, useState } from "react";

export default function Header({
  healthyCount,
  totalCount,
}: {
  healthyCount: number;
  totalCount: number;
}) {
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    const update = () => setTime(new Date().toLocaleTimeString("en-GB", { hour12: false }));
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  const allHealthy = healthyCount === totalCount;

  return (
    <header className="relative overflow-hidden rounded-lg border border-border bg-panel px-5 py-4 mb-6">
      <div className="absolute inset-y-0 left-0 w-1/3 pointer-events-none">
        <div className="h-full w-24 bg-gradient-to-r from-pulse/10 to-transparent animate-scan" />
      </div>
      <div className="relative flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-mono text-lg tracking-tight text-text">
            DevPulse<span className="text-pulse">.</span>
          </h1>
          <p className="text-[11px] text-muted font-mono mt-0.5">
            real-time infrastructure monitor
          </p>
        </div>
        <div className="flex items-center gap-5 font-mono text-[12px]">
          <div className="flex items-center gap-2">
            <span
              className={`h-2 w-2 rounded-full ${
                allHealthy ? "bg-pulse" : "bg-warn"
              }`}
            />
            <span className="text-muted">
              {healthyCount}/{totalCount} healthy
            </span>
          </div>
          <div className="text-muted tabular-nums">{time || "--:--:--"}</div>
        </div>
      </div>
    </header>
  );
}
