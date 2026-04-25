export interface BarChartProps {
  data: { label: string; value: number }[];
  color?: string;
  height?: number;
  formatValue?: (v: number) => string;
  className?: string;
}

export default function BarChart({
  data,
  color = "var(--accent)",
  height = 220,
  formatValue,
  className,
}: BarChartProps) {
  const width = 1000;
  const padT = 24;
  const padB = 36;
  const padL = 16;
  const padR = 16;
  const innerW = width - padL - padR;
  const innerH = height - padT - padB;

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

  const max = Math.max(...data.map((d) => d.value), 1);
  const n = data.length;
  const slot = innerW / n;
  const barW = Math.max(8, slot * 0.6);
  const fmt = formatValue ?? ((v: number) => String(v));

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width="100%"
      height={height}
      preserveAspectRatio="none"
      className={className}
      role="img"
    >
      {data.map((d, i) => {
        const cx = padL + slot * i + slot / 2;
        const h = innerH * (d.value / max);
        const x = cx - barW / 2;
        const y = padT + innerH - h;
        return (
          <g key={`${d.label}-${i}`}>
            {/* Background track */}
            <rect
              x={x}
              y={padT}
              width={barW}
              height={innerH}
              rx={4}
              fill="var(--surface-2)"
              opacity={0.6}
            />
            {/* Value bar */}
            <rect
              x={x}
              y={y}
              width={barW}
              height={Math.max(2, h)}
              rx={4}
              fill={color}
              opacity={0.9}
            />
            {/* Value text */}
            <text
              x={cx}
              y={Math.max(padT + 12, y - 6)}
              fontSize="12"
              fill="var(--text-2)"
              textAnchor="middle"
              fontFamily="ui-monospace, SFMono-Regular, monospace"
            >
              {fmt(d.value)}
            </text>
            {/* Label */}
            <text
              x={cx}
              y={height - 10}
              fontSize="11"
              fill="var(--text-4)"
              textAnchor="middle"
            >
              {d.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
