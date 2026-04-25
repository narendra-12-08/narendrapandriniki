import type { CSSProperties } from "react";

export interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  className?: string;
  style?: CSSProperties;
  strokeWidth?: number;
}

export default function Sparkline({
  data,
  width = 120,
  height = 32,
  color = "var(--accent)",
  className,
  style,
  strokeWidth = 2,
}: SparklineProps) {
  if (!data || data.length === 0) {
    return (
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className={className}
        style={style}
        aria-hidden
      />
    );
  }

  const n = data.length;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const padY = strokeWidth + 1;
  const innerH = height - padY * 2;
  const stepX = n > 1 ? width / (n - 1) : width;

  const points = data
    .map((v, i) => {
      const x = i * stepX;
      const y = padY + innerH - ((v - min) / range) * innerH;
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      style={style}
      aria-hidden
    >
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
