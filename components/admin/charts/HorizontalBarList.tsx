export interface HorizontalBarListProps {
  data: { label: string; value: number; total?: number }[];
  color?: string;
  formatValue?: (v: number) => string;
  className?: string;
}

export default function HorizontalBarList({
  data,
  color = "var(--accent)",
  formatValue,
  className,
}: HorizontalBarListProps) {
  if (!data || data.length === 0) {
    return (
      <div className={className}>
        <p className="px-5 py-8 text-center text-xs text-[var(--text-4)]">
          No data
        </p>
      </div>
    );
  }

  const max = Math.max(...data.map((d) => d.value), 1);
  const fmt = formatValue ?? ((v: number) => String(v));

  return (
    <ul className={className}>
      {data.map((d, i) => {
        const pct = (d.value / max) * 100;
        return (
          <li
            key={`${d.label}-${i}`}
            className="px-5 py-3 border-b border-[var(--border)] last:border-b-0"
          >
            <div className="flex items-center justify-between gap-3 mb-1.5">
              <span className="text-sm text-[var(--text-2)] truncate">
                {d.label}
              </span>
              <span className="text-sm font-mono tabular-nums text-[var(--text)]">
                {fmt(d.value)}
              </span>
            </div>
            <div className="relative h-2 rounded-full bg-[var(--surface-2)] overflow-hidden">
              <div
                className="absolute inset-y-0 left-0 rounded-full"
                style={{
                  width: `${Math.max(2, pct)}%`,
                  background: color,
                  opacity: 0.85,
                }}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}
