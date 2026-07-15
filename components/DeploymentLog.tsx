import { Deployment } from "@/lib/mock-services";
import { formatRelative } from "@/lib/format";

const STATUS_STYLE: Record<Deployment["status"], string> = {
  success: "text-pulse",
  failed: "text-crit",
  running: "text-warn animate-blink",
};

export default function DeploymentLog({ deployments }: { deployments: Deployment[] }) {
  return (
    <div className="rounded-lg border border-border bg-panel">
      <div className="px-4 py-3 border-b border-border font-mono text-[11px] text-muted uppercase tracking-wide">
        deployment history
      </div>
      <div className="divide-y divide-border max-h-72 overflow-y-auto">
        {deployments.map((d) => (
          <div
            key={d.id}
            className="px-4 py-2.5 flex items-center justify-between font-mono text-[12px]"
          >
            <div className="flex items-center gap-3 min-w-0">
              <span className={`w-14 shrink-0 ${STATUS_STYLE[d.status]}`}>{d.status}</span>
              <span className="text-text truncate">{d.service}</span>
              <span className="text-muted">#{d.sha}</span>
              <span className="text-wire hidden sm:inline">{d.branch}</span>
            </div>
            <div className="flex items-center gap-3 text-muted shrink-0">
              <span>{d.durationSec}s</span>
              <span>{formatRelative(d.timestamp)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
