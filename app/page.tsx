"use client";

import { useEffect, useState } from "react";
import { ServiceMetric, Deployment } from "@/lib/mock-services";
import Header from "@/components/Header";
import AlertBanner from "@/components/AlertBanner";
import ServiceCard from "@/components/ServiceCard";
import DeploymentLog from "@/components/DeploymentLog";

export default function DashboardPage() {
  const [services, setServices] = useState<ServiceMetric[]>([]);
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function poll() {
      try {
        const [metricsRes, deployRes] = await Promise.all([
          fetch("/api/metrics", { cache: "no-store" }),
          fetch("/api/deployments", { cache: "no-store" }),
        ]);
        const metrics = await metricsRes.json();
        const deploys = await deployRes.json();
        if (!cancelled) {
          setServices(metrics.services);
          setDeployments(deploys.deployments);
          setLoading(false);
        }
      } catch (e) {
        // network hiccup — keep last known state, try again next tick
      }
    }

    poll();
    const id = setInterval(poll, 3000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  const healthyCount = services.filter((s) => s.status === "healthy").length;

  return (
    <main className="min-h-screen px-4 py-6 md:px-8 md:py-8 max-w-6xl mx-auto">
      <Header healthyCount={healthyCount} totalCount={services.length} />

      <div className="mb-6">
        <AlertBanner services={services} />
      </div>

      {loading ? (
        <div className="font-mono text-sm text-muted animate-pulse">connecting to services…</div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {services.map((svc) => (
              <ServiceCard key={svc.id} svc={svc} />
            ))}
          </div>

          <DeploymentLog deployments={deployments} />
        </>
      )}

      <footer className="mt-8 text-center text-[11px] font-mono text-wire">
        DevPulse · mock telemetry, refreshes every 3s
      </footer>
    </main>
  );
}
