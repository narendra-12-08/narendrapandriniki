"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface Props {
  clients: { id: string; name: string; company: string | null }[];
  projects: { id: string; name: string; client_id: string | null }[];
}

function generateInvoiceNumber(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const rand = Math.floor(Math.random() * 900) + 100;
  return `INV-${year}${month}-${rand}`;
}

export default function InvoiceForm({ clients, projects }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const today = new Date().toISOString().split("T")[0];
  const dueDate = new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0];

  const [form, setForm] = useState({
    invoice_number: generateInvoiceNumber(),
    client_id: "",
    project_id: "",
    issue_date: today,
    due_date: dueDate,
    subtotal: "",
    tax_rate: "20",
    notes: "",
    status: "draft",
  });

  function change(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  }

  const subtotal = parseFloat(form.subtotal) || 0;
  const taxRate = parseFloat(form.tax_rate) || 0;
  const taxAmount = (subtotal * taxRate) / 100;
  const total = subtotal + taxAmount;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const supabase = createClient();
    await supabase.from("invoices").insert({
      invoice_number: form.invoice_number,
      client_id: form.client_id || null,
      project_id: form.project_id || null,
      issue_date: form.issue_date,
      due_date: form.due_date,
      subtotal,
      tax_rate: taxRate,
      tax_amount: taxAmount,
      total,
      notes: form.notes || null,
      status: form.status,
    });
    setOpen(false);
    setLoading(false);
    router.refresh();
  }

  return (
    <>
      <button onClick={() => setOpen(true)} style={{ backgroundColor: "#5c3d1e", color: "#faf7f2" }} className="px-4 py-2 text-sm font-medium rounded hover:opacity-90">
        + New Invoice
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.7)" }}>
          <div style={{ backgroundColor: "#2a1608", border: "1px solid #3e2610", width: "100%", maxWidth: "480px", maxHeight: "90vh", overflowY: "auto" }} className="rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 style={{ color: "#faf7f2" }} className="font-semibold">New Invoice</h2>
              <button onClick={() => setOpen(false)} style={{ color: "#9b7653" }}>✕</button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label style={{ color: "#9b7653" }} className="block text-xs mb-1">Invoice Number</label>
                <input name="invoice_number" value={form.invoice_number} onChange={change} style={{ backgroundColor: "#1e1208", border: "1px solid #3e2610", color: "#faf7f2" }} className="w-full px-3 py-2 text-sm rounded font-mono outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label style={{ color: "#9b7653" }} className="block text-xs mb-1">Client</label>
                  <select name="client_id" value={form.client_id} onChange={change} style={{ backgroundColor: "#1e1208", border: "1px solid #3e2610", color: "#faf7f2" }} className="w-full px-3 py-2 text-sm rounded outline-none">
                    <option value="">Select client</option>
                    {clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ color: "#9b7653" }} className="block text-xs mb-1">Project</label>
                  <select name="project_id" value={form.project_id} onChange={change} style={{ backgroundColor: "#1e1208", border: "1px solid #3e2610", color: "#faf7f2" }} className="w-full px-3 py-2 text-sm rounded outline-none">
                    <option value="">Select project</option>
                    {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label style={{ color: "#9b7653" }} className="block text-xs mb-1">Issue Date</label>
                  <input type="date" name="issue_date" value={form.issue_date} onChange={change} style={{ backgroundColor: "#1e1208", border: "1px solid #3e2610", color: "#faf7f2" }} className="w-full px-3 py-2 text-sm rounded outline-none" />
                </div>
                <div>
                  <label style={{ color: "#9b7653" }} className="block text-xs mb-1">Due Date</label>
                  <input type="date" name="due_date" value={form.due_date} onChange={change} style={{ backgroundColor: "#1e1208", border: "1px solid #3e2610", color: "#faf7f2" }} className="w-full px-3 py-2 text-sm rounded outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label style={{ color: "#9b7653" }} className="block text-xs mb-1">Subtotal (£) *</label>
                  <input type="number" name="subtotal" required value={form.subtotal} onChange={change} style={{ backgroundColor: "#1e1208", border: "1px solid #3e2610", color: "#faf7f2" }} className="w-full px-3 py-2 text-sm rounded outline-none" />
                </div>
                <div>
                  <label style={{ color: "#9b7653" }} className="block text-xs mb-1">Tax Rate (%)</label>
                  <input type="number" name="tax_rate" value={form.tax_rate} onChange={change} style={{ backgroundColor: "#1e1208", border: "1px solid #3e2610", color: "#faf7f2" }} className="w-full px-3 py-2 text-sm rounded outline-none" />
                </div>
              </div>
              {subtotal > 0 && (
                <div style={{ backgroundColor: "#1e1208", border: "1px solid #3e2610" }} className="rounded p-3 text-sm space-y-1">
                  <div className="flex justify-between">
                    <span style={{ color: "#9b7653" }}>Subtotal</span>
                    <span style={{ color: "#faf7f2" }}>£{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: "#9b7653" }}>Tax ({taxRate}%)</span>
                    <span style={{ color: "#faf7f2" }}>£{taxAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-semibold" style={{ borderTop: "1px solid #3e2610", paddingTop: "8px" }}>
                    <span style={{ color: "#cfa97e" }}>Total</span>
                    <span style={{ color: "#cfa97e" }}>£{total.toFixed(2)}</span>
                  </div>
                </div>
              )}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setOpen(false)} style={{ color: "#9b7653", border: "1px solid #3e2610" }} className="flex-1 py-2 text-sm rounded">Cancel</button>
                <button type="submit" disabled={loading} style={{ backgroundColor: "#5c3d1e", color: "#faf7f2" }} className="flex-1 py-2 text-sm rounded">
                  {loading ? "Saving..." : "Create Invoice"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
