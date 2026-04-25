import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import Sparkline from "./Sparkline";

export type MetricAccent = "cyan" | "violet" | "lime" | "rose";

export interface MetricCardProps {
  label: string;
  value: ReactNode;
  delta?: { value: number; positive: boolean };
  spark?: number[];
  accent?: MetricAccent;
  hint?: string;
  className?: string;
}

const accentColor: Record<MetricAccent, string> = {
  cyan: "var(--accent)",
  violet: "var(--violet)",
  lime: "var(--lime)",
  rose: "var(--rose)",
};

const accentBorder: Record<MetricAccent, string> = {
  cyan: "border-l-[var(--accent)]",
  violet: "border-l-[var(--violet)]",
  lime: "border-l-[var(--lime)]",
  rose: "border-l-[var(--rose)]",
};

const accentText: Record<MetricAccent, string> = {
  cyan: "text-[var(--accent)]",
  violet: "text-[var(--violet)]",
  lime: "text-[var(--lime)]",
  rose: "text-[var(--rose)]",
};

export default function MetricCard({
  label,
  value,
  delta,
  spark,
  accent = "cyan",
  hint,
  className,
}: MetricCardProps) {
  return (
    <div
      className={cn(
        "h-full bg-[var(--surface)] border border-[var(--border)] border-l-2 rounded-xl p-5 flex flex-col gap-3 transition-colors hover:border-[var(--border-2)]",
        accentBorder[accent],
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs uppercase tracking-widest text-[var(--text-4)] font-medium">
          {label}
        </p>
        {delta && (
          <span
            className={cn(
              "inline-flex items-center gap-0.5 text-xs font-mono tabular-nums px-1.5 py-0.5 rounded-full border",
              delta.positive
                ? "text-[var(--lime)] border-[var(--lime)]/30 bg-[var(--lime)]/10"
                : "text-[var(--rose)] border-[var(--rose)]/30 bg-[var(--rose)]/10"
            )}
          >
            {delta.positive ? (
              <ArrowUpRight size={11} />
            ) : (
              <ArrowDownRight size={11} />
            )}
            {Math.abs(delta.value).toFixed(1)}%
          </span>
        )}
      </div>

      <p
        className={cn(
          "text-3xl font-mono font-semibold tabular-nums leading-none",
          accentText[accent]
        )}
      >
        {value}
      </p>

      {hint && <p className="text-xs text-[var(--text-3)]">{hint}</p>}

      {spark && spark.length > 0 && (
        <div className="mt-auto pt-2 -mx-1">
          <Sparkline
            data={spark}
            width={200}
            height={32}
            color={accentColor[accent]}
            style={{ width: "100%", height: 32 }}
          />
        </div>
      )}
    </div>
  );
}
