"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface Props {
  invoiceId: string;
  currentStatus: string;
  invoiceNumber: string;
}

const transitions: Record<string, string[]> = {
  draft: ["sent", "cancelled"],
  sent: ["paid", "overdue", "cancelled"],
  overdue: ["paid", "cancelled"],
  paid: [],
  cancelled: [],
};

const labelMap: Record<string, string> = {
  sent: "Mark sent",
  paid: "Mark paid",
  overdue: "Mark overdue",
  cancelled: "Cancel",
};

export default function InvoiceActions({
  invoiceId,
  currentStatus,
  invoiceNumber,
}: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  void invoiceNumber;

  async function updateStatus(status: string) {
    setLoading(status);
    const supabase = createClient();
    const updates: Record<string, unknown> = { status };
    if (status === "sent") updates.sent_at = new Date().toISOString();
    if (status === "paid") updates.paid_at = new Date().toISOString();
    await supabase.from("invoices").update(updates).eq("id", invoiceId);
    router.refresh();
    setLoading(null);
  }

  const nextStates = transitions[currentStatus] ?? [];

  if (!nextStates.length) return null;

  return (
    <div className="flex gap-1.5 flex-wrap justify-end">
      {nextStates.map((state) => {
        const tone =
          state === "paid"
            ? "bg-[var(--lime)]/10 border-[var(--lime)]/30 text-[var(--lime)] hover:bg-[var(--lime)]/15"
            : state === "cancelled"
            ? "bg-[var(--rose)]/10 border-[var(--rose)]/30 text-[var(--rose)] hover:bg-[var(--rose)]/15"
            : state === "overdue"
            ? "bg-[var(--amber)]/10 border-[var(--amber)]/30 text-[var(--amber)] hover:bg-[var(--amber)]/15"
            : "bg-[var(--accent)]/10 border-[var(--accent)]/30 text-[var(--accent)] hover:bg-[var(--accent)]/15";
        return (
          <button
            key={state}
            onClick={() => updateStatus(state)}
            disabled={loading === state}
            className={`text-[11px] px-2 py-1 rounded-full border transition-colors disabled:opacity-50 ${tone}`}
          >
            {labelMap[state] ?? state}
          </button>
        );
      })}
    </div>
  );
}
