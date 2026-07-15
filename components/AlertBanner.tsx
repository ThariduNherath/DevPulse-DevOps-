import { ServiceMetric } from "@/lib/mock-services";

export default function AlertBanner({ services }: { services: ServiceMetric[] }) {
  const alerts = services.filter((s) => s.status !== "healthy");

  if (alerts.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-panel px-4 py-2.5 font-mono text-[12px] text-muted flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-pulse" />
        all systems nominal — no active alerts
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-crit/40 bg-crit/5 px-4 py-2.5 font-mono text-[12px] flex flex-wrap items-center gap-x-4 gap-y-1">
      <span className="text-crit uppercase tracking-wide">
        {alerts.length} alert{alerts.length > 1 ? "s" : ""}
      </span>
      {alerts.map((a) => (
        <span key={a.id} className={a.status === "critical" ? "text-crit" : "text-warn"}>
          {a.name} · {a.status} · {a.latencyMs.toFixed(0)}ms
        </span>
      ))}
    </div>
  );
}
