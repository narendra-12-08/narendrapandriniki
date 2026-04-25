export interface AreaChartProps {
  data: { x: string; y: number }[];
  height?: number;
  color?: string;
  formatY?: (v: number) => string;
  className?: string;
}

export default function AreaChart({
  data,
  height = 220,
  color = "var(--accent)",
  formatY,
  className,
}: AreaChartProps) {
  const width = 1000; // viewBox unit; SVG scales via preserveAspectRatio
  const padL = 56;
  const padR = 16;
  const padT = 16;
  const padB = 28;

  if (!data || data.length === 0) {
    return (
      <div
        className={className}
        style={{ height }}
        aria-label="No data"
      >
        <div className="h-full w-full flex items-center justify-center text-xs text-[var(--text-4)]">
          No data
        </div>
      </div>
    );
  }

  const ys = data.map((d) => d.y);
  const max = Math.max(...ys, 0);
  const min = 0;
  const range = max - min || 1;
  const innerW = width - padL - padR;
  const innerH = height - padT - padB;
  const n = data.length;
  const stepX = n > 1 ? innerW / (n - 1) : innerW;

  const pts = data.map((d, i) => {
    const x = padL + i * stepX;
    const y = padT + innerH - ((d.y - min) / range) * innerH;
    return { x, y };
  });

  const linePath = pts
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`)
    .join(" ");
  const areaPath =
    `M ${pts[0].x.toFixed(2)} ${(padT + innerH).toFixed(2)} ` +
    pts.map((p) => `L ${p.x.toFixed(2)} ${p.y.toFixed(2)}`).join(" ") +
    ` L ${pts[pts.length - 1].x.toFixed(2)} ${(padT + innerH).toFixed(2)} Z`;

  const midY = padT + innerH / 2;
  const midValue = max / 2;
  const fmt = formatY ?? ((v: number) => String(Math.round(v)));

  const gradId = `area-grad-${Math.abs(
    data.reduce((s, d) => s + d.y, 0) * 1000 + n
  ).toString(36)}`;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width="100%"
      height={height}
      preserveAspectRatio="none"
      className={className}
      role="img"
    >
      <defs>
        <linearGradient id={gradId} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* mid gridline */}
      <line
        x1={padL}
        x2={width - padR}
        y1={midY}
        y2={midY}
        stroke="var(--border)"
        strokeDasharray="3 3"
        strokeWidth="1"
      />

      {/* y-axis labels: max + mid */}
      <text
        x={padL - 8}
        y={padT + 4}
        fontSize="11"
        fill="var(--text-4)"
        textAnchor="end"
        fontFamily="ui-monospace, SFMono-Regular, monospace"
      >
        {fmt(max)}
      </text>
      <text
        x={padL - 8}
        y={midY + 4}
        fontSize="11"
        fill="var(--text-4)"
        textAnchor="end"
        fontFamily="ui-monospace, SFMono-Regular, monospace"
      >
        {fmt(midValue)}
      </text>
      <text
        x={padL - 8}
        y={padT + innerH + 4}
        fontSize="11"
        fill="var(--text-4)"
        textAnchor="end"
        fontFamily="ui-monospace, SFMono-Regular, monospace"
      >
        0
      </text>

      <path d={areaPath} fill={`url(#${gradId})`} />
      <path
        d={linePath}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      {/* x-axis extremes */}
      <text
        x={padL}
        y={height - 8}
        fontSize="11"
        fill="var(--text-4)"
        textAnchor="start"
      >
        {data[0].x}
      </text>
      {n > 1 && (
        <text
          x={width - padR}
          y={height - 8}
          fontSize="11"
          fill="var(--text-4)"
          textAnchor="end"
        >
          {data[n - 1].x}
        </text>
      )}
    </svg>
  );
}
