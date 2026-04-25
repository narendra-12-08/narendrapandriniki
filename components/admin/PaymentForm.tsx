"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import Modal from "./Modal";

interface Props {
  invoices: { id: string; invoice_number: string; total: number }[];
}

const inputCls =
  "w-full px-3 py-2 text-sm rounded-md bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text)] outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/25";

export default function PaymentForm({ invoices }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const today = new Date().toISOString().split("T")[0];
  const [form, setForm] = useState({
    invoice_id: "",
    amount: "",
    paid_at: today,
    method: "bank_transfer",
    reference: "",
    notes: "",
  });

  function change(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const supabase = createClient();
    await supabase.from("payments").insert({
      invoice_id: form.invoice_id,
      amount: parseFloat(form.amount),
      paid_at: form.paid_at,
      method: form.method,
      reference: form.reference || null,
      notes: form.notes || null,
    });

    await supabase
      .from("invoices")
      .update({ status: "paid", paid_at: form.paid_at })
      .eq("id", form.invoice_id);

    setOpen(false);
    setLoading(false);
    router.refresh();
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-semibold rounded-md bg-[var(--accent)] text-[#04121a] hover:bg-[var(--accent-2)]"
      >
        <Plus size={14} /> Record payment
      </button>

      <Modal open={open} onClose={() => setOpen(false)} title="Record payment">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[var(--text-2)] mb-1.5">
              Invoice *
            </label>
            <select
              name="invoice_id"
              required
              value={form.invoice_id}
              onChange={change}
              className={inputCls}
            >
              <option value="">Select invoice</option>
              {invoices.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.invoice_number} (${i.total.toLocaleString()})
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[var(--text-2)] mb-1.5">
                Amount ($) *
              </label>
              <input
                type="number"
                step="0.01"
                name="amount"
                required
                value={form.amount}
                onChange={change}
                className={inputCls}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--text-2)] mb-1.5">
                Date *
              </label>
              <input
                type="date"
                name="paid_at"
                required
                value={form.paid_at}
                onChange={change}
                className={inputCls}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[var(--text-2)] mb-1.5">
                Method
              </label>
              <select
                name="method"
                value={form.method}
                onChange={change}
                className={inputCls}
              >
                <option value="bank_transfer">Bank transfer</option>
                <option value="card">Card</option>
                <option value="paypal">PayPal</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--text-2)] mb-1.5">
                Reference
              </label>
              <input
                name="reference"
                value={form.reference}
                onChange={change}
                className={inputCls}
              />
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="flex-1 py-2 text-sm rounded-md bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text-2)] hover:text-[var(--text)]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2 text-sm font-semibold rounded-md bg-[var(--accent)] text-[#04121a] hover:bg-[var(--accent-2)] disabled:opacity-60"
            >
              {loading ? "Saving..." : "Record"}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
