"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import Modal from "./Modal";

interface Props {
  clients: { id: string; name: string; company: string | null }[];
  projects: { id: string; name: string; client_id: string | null }[];
}

const inputCls =
  "w-full px-3 py-2 text-sm rounded-md bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text)] outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/25";

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
  const dueDate = new Date(Date.now() + 30 * 86400000)
    .toISOString()
    .split("T")[0];

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

  function change(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
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

  const filteredProjects = form.client_id
    ? projects.filter((p) => p.client_id === form.client_id)
    : projects;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-semibold rounded-md bg-[var(--accent)] text-[#04121a] hover:bg-[var(--accent-2)]"
      >
        <Plus size={14} /> New invoice
      </button>

      <Modal open={open} onClose={() => setOpen(false)} title="New invoice" maxWidth={520}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[var(--text-2)] mb-1.5">
              Invoice number
            </label>
            <input
              name="invoice_number"
              value={form.invoice_number}
              onChange={change}
              className={`${inputCls} font-mono`}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[var(--text-2)] mb-1.5">
                Client
              </label>
              <select
                name="client_id"
                value={form.client_id}
                onChange={change}
                className={inputCls}
              >
                <option value="">Select client</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--text-2)] mb-1.5">
                Project
              </label>
              <select
                name="project_id"
                value={form.project_id}
                onChange={change}
                className={inputCls}
              >
                <option value="">Select project</option>
                {filteredProjects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[var(--text-2)] mb-1.5">
                Issue date
              </label>
              <input
                type="date"
                name="issue_date"
                value={form.issue_date}
                onChange={change}
                className={inputCls}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--text-2)] mb-1.5">
                Due date
              </label>
              <input
                type="date"
                name="due_date"
                value={form.due_date}
                onChange={change}
                className={inputCls}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[var(--text-2)] mb-1.5">
                Subtotal (£) *
              </label>
              <input
                type="number"
                step="0.01"
                name="subtotal"
                required
                value={form.subtotal}
                onChange={change}
                className={inputCls}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--text-2)] mb-1.5">
                Tax rate (%)
              </label>
              <input
                type="number"
                step="0.01"
                name="tax_rate"
                value={form.tax_rate}
                onChange={change}
                className={inputCls}
              />
            </div>
          </div>
          {subtotal > 0 && (
            <div className="rounded-md bg-[var(--surface-2)] border border-[var(--border)] p-3 text-sm space-y-1.5">
              <div className="flex justify-between text-[var(--text-3)]">
                <span>Subtotal</span>
                <span className="font-mono text-[var(--text)]">
                  £{subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-[var(--text-3)]">
                <span>Tax ({taxRate}%)</span>
                <span className="font-mono text-[var(--text)]">
                  £{taxAmount.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between font-semibold pt-1.5 border-t border-[var(--border)]">
                <span className="text-[var(--accent)]">Total</span>
                <span className="font-mono text-[var(--accent)]">
                  £{total.toFixed(2)}
                </span>
              </div>
            </div>
          )}
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
              {loading ? "Saving..." : "Create invoice"}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
