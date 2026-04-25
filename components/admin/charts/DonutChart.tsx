export interface DonutDatum {
  label: string;
  value: number;
  color?: string;
}

export interface DonutChartProps {
  data: DonutDatum[];
  size?: number;
  thickness?: number;
  centerLabel?: string;
  formatTotal?: (v: number) => string;
  className?: string;
}

const PALETTE = [
  "var(--accent)",
  "var(--violet)",
  "var(--lime)",
  "var(--rose)",
  "var(--amber)",
  "#7dd3fc",
  "#c4b5fd",
];

export default function DonutChart({
  data,
  size = 160,
  thickness = 22,
  centerLabel,
  formatTotal,
  className,
}: DonutChartProps) {
  const total = data.reduce((s, d) => s + d.value, 0);
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - thickness / 2 - 2;
  const C = 2 * Math.PI * r;
  const fmt = formatTotal ?? ((v: number) => String(v));

  let cursor = 0;

  if (total <= 0) {
    return (
      <div className={className}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          role="img"
        >
          <circle
            cx={cx}
            cy={cy}
            r={r}
            stroke="var(--surface-2)"
            strokeWidth={thickness}
            fill="none"
          />
          <text
            x={cx}
            y={cy + 4}
            textAnchor="middle"
            fontSize="13"
            fill="var(--text-4)"
          >
            No data
          </text>
        </svg>
      </div>
    );
  }

  return (
    <div
      className={className}
      style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img">
        {/* track */}
        <circle
          cx={cx}
          cy={cy}
          r={r}
          stroke="var(--surface-2)"
          strokeWidth={thickness}
          fill="none"
        />
        <g transform={`rotate(-90 ${cx} ${cy})`}>
          {data.map((d, i) => {
            const frac = d.value / total;
            const dash = frac * C;
            const offset = -cursor * C;
            const stroke = d.color ?? PALETTE[i % PALETTE.length];
            cursor += frac;
            return (
              <circle
                key={`${d.label}-${i}`}
                cx={cx}
                cy={cy}
                r={r}
                stroke={stroke}
                strokeWidth={thickness}
                strokeDasharray={`${dash} ${C - dash}`}
                strokeDashoffset={offset}
                fill="none"
              />
            );
          })}
        </g>
        <text
          x={cx}
          y={cy - 2}
          textAnchor="middle"
          fontSize="22"
          fontWeight="600"
          fill="var(--text)"
          fontFamily="ui-monospace, SFMono-Regular, monospace"
        >
          {fmt(total)}
        </text>
        {centerLabel && (
          <text
            x={cx}
            y={cy + 16}
            textAnchor="middle"
            fontSize="10"
            fill="var(--text-4)"
            style={{ textTransform: "uppercase", letterSpacing: 1.5 }}
          >
            {centerLabel}
          </text>
        )}
      </svg>
      <ul className="space-y-1.5 text-sm">
        {data.map((d, i) => {
          const stroke = d.color ?? PALETTE[i % PALETTE.length];
          const pct = total > 0 ? Math.round((d.value / total) * 100) : 0;
          return (
            <li
              key={`${d.label}-${i}`}
              className="flex items-center gap-2 text-[var(--text-2)]"
            >
              <span
                aria-hidden
                style={{
                  display: "inline-block",
                  width: 10,
                  height: 10,
                  borderRadius: 3,
                  background: stroke,
                }}
              />
              <span className="text-[var(--text-3)]">{d.label}</span>
              <span className="font-mono text-[var(--text)] tabular-nums">
                {d.value}
              </span>
              <span className="text-xs text-[var(--text-4)]">({pct}%)</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
