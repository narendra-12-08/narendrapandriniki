"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface Props {
  invoiceId: string;
  currentStatus: string;
  invoiceNumber: string;
}

export default function InvoiceActions({ invoiceId, currentStatus, invoiceNumber }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

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

  const transitions: Record<string, string[]> = {
    draft: ["sent", "cancelled"],
    sent: ["paid", "overdue", "cancelled"],
    overdue: ["paid", "cancelled"],
    paid: [],
    cancelled: [],
  };

  const nextStates = transitions[currentStatus] ?? [];

  return (
    <div className="flex gap-1.5">
      {nextStates.map((state) => (
        <button
          key={state}
          onClick={() => updateStatus(state)}
          disabled={loading === state}
          style={{
            color: state === "paid" ? "#4ade80" : state === "cancelled" ? "#ef4444" : "#cfa97e",
            border: `1px solid ${state === "paid" ? "#1a3a1a" : state === "cancelled" ? "#3a1a1a" : "#5c3d1e"}`,
          }}
          className="text-xs px-2 py-1 rounded hover:opacity-80 capitalize"
        >
          {state === "sent" ? "Mark Sent" : state === "paid" ? "Mark Paid" : state === "overdue" ? "Mark Overdue" : "Cancel"}
        </button>
      ))}
    </div>
  );
}
