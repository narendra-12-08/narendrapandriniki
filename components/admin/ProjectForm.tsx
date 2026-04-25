"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import Modal from "./Modal";

interface Props {
  clients: { id: string; name: string; company: string | null }[];
}

const inputCls =
  "w-full px-3 py-2 text-sm rounded-md bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text)] outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/25";

export default function ProjectForm({ clients }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    client_id: "",
    service_type: "",
    scope_summary: "",
    start_date: "",
    due_date: "",
    agreed_amount: "",
    status: "discovery",
  });

  function change(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const supabase = createClient();
    await supabase.from("projects").insert({
      name: form.name,
      client_id: form.client_id || null,
      service_type: form.service_type || null,
      scope_summary: form.scope_summary || null,
      start_date: form.start_date || null,
      due_date: form.due_date || null,
      agreed_amount: form.agreed_amount ? parseFloat(form.agreed_amount) : null,
      status: form.status,
      payment_status: "unpaid",
    });
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
        <Plus size={14} /> New project
      </button>

      <Modal open={open} onClose={() => setOpen(false)} title="New project" maxWidth={520}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[var(--text-2)] mb-1.5">
              Name *
            </label>
            <input
              name="name"
              required
              value={form.name}
              onChange={change}
              className={inputCls}
            />
          </div>
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
                  {c.company ? ` (${c.company})` : ""}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-[var(--text-2)] mb-1.5">
              Service type
            </label>
            <input
              name="service_type"
              value={form.service_type}
              onChange={change}
              className={inputCls}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[var(--text-2)] mb-1.5">
                Start date
              </label>
              <input
                type="date"
                name="start_date"
                value={form.start_date}
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
                Agreed amount ($)
              </label>
              <input
                type="number"
                step="0.01"
                name="agreed_amount"
                value={form.agreed_amount}
                onChange={change}
                className={inputCls}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--text-2)] mb-1.5">
                Status
              </label>
              <select
                name="status"
                value={form.status}
                onChange={change}
                className={inputCls}
              >
                {["discovery", "active", "paused", "complete", "cancelled"].map(
                  (s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  )
                )}
              </select>
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
              {loading ? "Saving..." : "Create"}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
