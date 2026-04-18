"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface Props {
  invoices: { id: string; invoice_number: string; total: number }[];
}

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

    await supabase.from("invoices").update({ status: "paid", paid_at: form.paid_at }).eq("id", form.invoice_id);

    setOpen(false);
    setLoading(false);
    router.refresh();
  }

  return (
    <>
      <button onClick={() => setOpen(true)} style={{ backgroundColor: "#5c3d1e", color: "#faf7f2" }} className="px-4 py-2 text-sm font-medium rounded hover:opacity-90">
        + Record Payment
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.7)" }}>
          <div style={{ backgroundColor: "#2a1608", border: "1px solid #3e2610", width: "100%", maxWidth: "440px" }} className="rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 style={{ color: "#faf7f2" }} className="font-semibold">Record Payment</h2>
              <button onClick={() => setOpen(false)} style={{ color: "#9b7653" }}>✕</button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label style={{ color: "#9b7653" }} className="block text-xs mb-1">Invoice *</label>
                <select name="invoice_id" required value={form.invoice_id} onChange={change} style={{ backgroundColor: "#1e1208", border: "1px solid #3e2610", color: "#faf7f2" }} className="w-full px-3 py-2 text-sm rounded outline-none">
                  <option value="">Select invoice</option>
                  {invoices.map((i) => <option key={i.id} value={i.id}>{i.invoice_number} (£{i.total.toLocaleString()})</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label style={{ color: "#9b7653" }} className="block text-xs mb-1">Amount (£) *</label>
                  <input type="number" name="amount" required value={form.amount} onChange={change} style={{ backgroundColor: "#1e1208", border: "1px solid #3e2610", color: "#faf7f2" }} className="w-full px-3 py-2 text-sm rounded outline-none" />
                </div>
                <div>
                  <label style={{ color: "#9b7653" }} className="block text-xs mb-1">Date *</label>
                  <input type="date" name="paid_at" required value={form.paid_at} onChange={change} style={{ backgroundColor: "#1e1208", border: "1px solid #3e2610", color: "#faf7f2" }} className="w-full px-3 py-2 text-sm rounded outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label style={{ color: "#9b7653" }} className="block text-xs mb-1">Method</label>
                  <select name="method" value={form.method} onChange={change} style={{ backgroundColor: "#1e1208", border: "1px solid #3e2610", color: "#faf7f2" }} className="w-full px-3 py-2 text-sm rounded outline-none">
                    <option value="bank_transfer">Bank Transfer</option>
                    <option value="card">Card</option>
                    <option value="paypal">PayPal</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label style={{ color: "#9b7653" }} className="block text-xs mb-1">Reference</label>
                  <input name="reference" value={form.reference} onChange={change} style={{ backgroundColor: "#1e1208", border: "1px solid #3e2610", color: "#faf7f2" }} className="w-full px-3 py-2 text-sm rounded outline-none" />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setOpen(false)} style={{ color: "#9b7653", border: "1px solid #3e2610" }} className="flex-1 py-2 text-sm rounded">Cancel</button>
                <button type="submit" disabled={loading} style={{ backgroundColor: "#5c3d1e", color: "#faf7f2" }} className="flex-1 py-2 text-sm rounded">
                  {loading ? "Saving..." : "Record"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
