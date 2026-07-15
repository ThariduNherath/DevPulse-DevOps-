import { ServiceStatus } from "@/lib/mock-services";

const COLORS: Record<ServiceStatus, string> = {
  healthy: "bg-pulse shadow-[0_0_8px_2px_rgba(94,234,212,0.6)]",
  degraded: "bg-warn shadow-[0_0_8px_2px_rgba(245,165,36,0.6)]",
  critical: "bg-crit shadow-[0_0_8px_2px_rgba(241,85,76,0.6)]",
};

export default function StatusDot({ status }: { status: ServiceStatus }) {
  return (
    <span className="relative flex h-2.5 w-2.5">
      <span
        className={`absolute inline-flex h-full w-full rounded-full ${COLORS[status]} ${
          status === "critical" ? "animate-blink" : ""
        }`}
      />
    </span>
  );
}
