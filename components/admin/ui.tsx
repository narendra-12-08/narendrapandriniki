import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-[var(--text)] tracking-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm text-[var(--text-3)] mt-1.5">{subtitle}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

export function Card({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "bg-[var(--surface)] border border-[var(--border)] rounded-xl",
        className
      )}
    >
      {children}
    </div>
  );
}

export function StatCard({
  label,
  value,
  href,
  accent = "accent",
  hint,
}: {
  label: string;
  value: ReactNode;
  href?: string;
  accent?: "accent" | "violet" | "lime" | "amber" | "rose";
  hint?: string;
}) {
  const colorMap: Record<string, string> = {
    accent: "border-l-[var(--accent)]",
    violet: "border-l-[var(--violet)]",
    lime: "border-l-[var(--lime)]",
    amber: "border-l-[var(--amber)]",
    rose: "border-l-[var(--rose)]",
  };
  const valueColor: Record<string, string> = {
    accent: "text-[var(--accent)]",
    violet: "text-[var(--violet)]",
    lime: "text-[var(--lime)]",
    amber: "text-[var(--amber)]",
    rose: "text-[var(--rose)]",
  };

  const inner = (
    <div
      className={cn(
        "h-full bg-[var(--surface)] border border-[var(--border)] border-l-2 rounded-xl p-5 transition-colors hover:border-[var(--border-2)]",
        colorMap[accent]
      )}
    >
      <p className="text-xs uppercase tracking-widest text-[var(--text-4)] font-medium">
        {label}
      </p>
      <p
        className={cn(
          "text-3xl font-mono font-semibold mt-2 tabular-nums",
          valueColor[accent]
        )}
      >
        {value}
      </p>
      {hint && (
        <p className="text-xs text-[var(--text-3)] mt-2">{hint}</p>
      )}
    </div>
  );

  return href ? <Link href={href}>{inner}</Link> : inner;
}

const badgeStyles: Record<string, string> = {
  default:
    "bg-[var(--surface-2)] text-[var(--text-3)] border-[var(--border)]",
  accent:
    "bg-[var(--accent)]/12 text-[var(--accent)] border-[var(--accent)]/30",
  violet:
    "bg-[var(--violet)]/12 text-[var(--violet)] border-[var(--violet)]/30",
  lime:
    "bg-[var(--lime)]/12 text-[var(--lime)] border-[var(--lime)]/30",
  amber:
    "bg-[var(--amber)]/12 text-[var(--amber)] border-[var(--amber)]/30",
  rose:
    "bg-[var(--rose)]/12 text-[var(--rose)] border-[var(--rose)]/30",
};

export function Badge({
  children,
  tone = "default",
  className,
}: {
  children: ReactNode;
  tone?: keyof typeof badgeStyles;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium border capitalize",
        badgeStyles[tone],
        className
      )}
    >
      {children}
    </span>
  );
}

export function Empty({
  title,
  hint,
}: {
  title: string;
  hint?: string;
}) {
  return (
    <div className="p-12 text-center">
      <p className="text-[var(--text-2)] font-medium">{title}</p>
      {hint && <p className="text-sm text-[var(--text-4)] mt-1">{hint}</p>}
    </div>
  );
}

// Form primitives — for use in server-action forms
export function Field({
  label,
  htmlFor,
  hint,
  children,
}: {
  label: string;
  htmlFor?: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="block text-xs font-medium text-[var(--text-2)] mb-1.5"
      >
        {label}
      </label>
      {children}
      {hint && (
        <p className="text-[11px] text-[var(--text-4)] mt-1">{hint}</p>
      )}
    </div>
  );
}

const inputBase =
  "w-full px-3 py-2 rounded-md text-sm bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text)] placeholder:text-[var(--text-4)] outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/25";

export function Input(
  props: React.InputHTMLAttributes<HTMLInputElement>
) {
  const { className, ...rest } = props;
  return <input {...rest} className={cn(inputBase, className)} />;
}

export function Textarea(
  props: React.TextareaHTMLAttributes<HTMLTextAreaElement>
) {
  const { className, ...rest } = props;
  return (
    <textarea
      {...rest}
      className={cn(inputBase, "min-h-[100px] font-mono text-xs", className)}
    />
  );
}

export function Select(
  props: React.SelectHTMLAttributes<HTMLSelectElement>
) {
  const { className, children, ...rest } = props;
  return (
    <select {...rest} className={cn(inputBase, className)}>
      {children}
    </select>
  );
}

export function PrimaryButton(
  props: React.ButtonHTMLAttributes<HTMLButtonElement>
) {
  const { className, children, ...rest } = props;
  return (
    <button
      {...rest}
      className={cn(
        "inline-flex items-center justify-center gap-2 px-3.5 py-2 text-sm font-semibold rounded-md bg-[var(--accent)] text-[#04121a] hover:bg-[var(--accent-2)] disabled:opacity-60 transition-colors",
        className
      )}
    >
      {children}
    </button>
  );
}

export function GhostButton(
  props: React.ButtonHTMLAttributes<HTMLButtonElement>
) {
  const { className, children, ...rest } = props;
  return (
    <button
      {...rest}
      className={cn(
        "inline-flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-md bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text-2)] hover:text-[var(--text)] hover:border-[var(--border-2)] transition-colors",
        className
      )}
    >
      {children}
    </button>
  );
}

export function DangerButton(
  props: React.ButtonHTMLAttributes<HTMLButtonElement>
) {
  const { className, children, ...rest } = props;
  return (
    <button
      {...rest}
      className={cn(
        "inline-flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-md bg-[var(--rose)]/10 border border-[var(--rose)]/30 text-[var(--rose)] hover:bg-[var(--rose)]/15 transition-colors",
        className
      )}
    >
      {children}
    </button>
  );
}
