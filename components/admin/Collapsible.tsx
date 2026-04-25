"use client";

import { useState, type ReactNode } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Collapsible({
  summary,
  defaultOpen = false,
  children,
  className,
}: {
  summary: ReactNode;
  defaultOpen?: boolean;
  children: ReactNode;
  className?: string;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div
      className={cn(
        "bg-[var(--surface)] border border-[var(--border)] rounded-xl",
        className
      )}
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-2 px-4 py-3 text-left text-sm text-[var(--text-2)] hover:text-[var(--text)]"
      >
        {open ? (
          <ChevronDown size={14} className="text-[var(--text-3)]" />
        ) : (
          <ChevronRight size={14} className="text-[var(--text-3)]" />
        )}
        <span className="flex-1">{summary}</span>
      </button>
      {open && (
        <div className="px-4 pb-4 pt-1 border-t border-[var(--border)]">
          {children}
        </div>
      )}
    </div>
  );
}
