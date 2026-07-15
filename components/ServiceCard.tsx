import { ServiceMetric } from "@/lib/mock-services";
import { formatUptime } from "@/lib/format";
import StatusDot from "./StatusDot";
import Trace from "./Trace";

const BORDER: Record<string, string> = {
  healthy: "border-border",
  degraded: "border-warn/40",
  critical: "border-crit/50",
};

export default function ServiceCard({ svc }: { svc: ServiceMetric }) {
  return (
    <div
      className={`rounded-lg border ${BORDER[svc.status]} bg-panel p-4 flex flex-col gap-3 transition-colors`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <StatusDot status={svc.status} />
          <span className="font-mono text-sm text-text">{svc.name}</span>
        </div>
        <span className="text-[11px] text-muted font-mono">{svc.region}</span>
      </div>

      <Trace data={svc.history} status={svc.status} />

      <div className="grid grid-cols-3 gap-2 text-[11px] font-mono">
        <div>
          <div className="text-muted">CPU</div>
          <div className={svc.cpu > 85 ? "text-crit" : svc.cpu > 65 ? "text-warn" : "text-text"}>
            {svc.cpu.toFixed(0)}%
          </div>
        </div>
        <div>
          <div className="text-muted">MEM</div>
          <div className="text-text">{svc.mem.toFixed(0)}%</div>
        </div>
        <div>
          <div className="text-muted">LATENCY</div>
          <div className={svc.latencyMs > 500 ? "text-crit" : svc.latencyMs > 250 ? "text-warn" : "text-text"}>
            {svc.latencyMs.toFixed(0)}ms
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between text-[11px] font-mono text-muted border-t border-border pt-2">
        <span>uptime {formatUptime(svc.uptimeSec)}</span>
        <span className="uppercase tracking-wide">{svc.status}</span>
      </div>
    </div>
  );
}
