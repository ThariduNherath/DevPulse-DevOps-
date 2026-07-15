const STROKE: Record<string, string> = {
  healthy: "#5EEAD4",
  degraded: "#F5A524",
  critical: "#F1554C",
};

export default function Trace({
  data,
  status,
}: {
  data: number[];
  status: "healthy" | "degraded" | "critical";
}) {
  const w = 240;
  const h = 46;
  const max = 100;
  const step = w / (data.length - 1);

  const points = data
    .map((v, i) => {
      const x = i * step;
      const y = h - (v / max) * h;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  const color = STROKE[status];

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-12" preserveAspectRatio="none">
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.9"
      />
      <polyline
        points={`0,${h} ${points} ${w},${h}`}
        fill={color}
        opacity="0.06"
      />
    </svg>
  );
}
