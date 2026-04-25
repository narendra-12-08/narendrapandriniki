"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import Modal from "./Modal";

interface Props {
  mode: "add";
}

export default function ClientActions({ mode }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    type: "client" as "client" | "lead",
  });
  const [loading, setLoading] = useState(false);

  void mode;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const supabase = createClient();
    const table = form.type === "lead" ? "leads" : "clients";
    await supabase.from(table).insert({
      name: form.name,
      email: form.email,
      company: form.company || null,
      phone: form.phone || null,
      status: form.type === "lead" ? "new" : "active",
    });
    setOpen(false);
    setForm({ name: "", email: "", company: "", phone: "", type: "client" });
    setLoading(false);
    router.refresh();
  }

  const inputCls =
    "w-full px-3 py-2 text-sm rounded-md bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text)] outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/25";

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-semibold rounded-md bg-[var(--accent)] text-[#04121a] hover:bg-[var(--accent-2)]"
      >
        <Plus size={14} /> New
      </button>

      <Modal open={open} onClose={() => setOpen(false)} title="Add client or lead">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            {(["client", "lead"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setForm((p) => ({ ...p, type: t }))}
                className={`py-2 text-sm rounded-md border capitalize transition-colors ${
                  form.type === t
                    ? "bg-[var(--accent)]/15 border-[var(--accent)]/30 text-[var(--accent)]"
                    : "bg-[var(--surface-2)] border-[var(--border)] text-[var(--text-3)] hover:text-[var(--text)]"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          {(["name", "email", "company", "phone"] as const).map((field) => (
            <div key={field}>
              <label className="block text-xs font-medium text-[var(--text-2)] mb-1.5 capitalize">
                {field}
                {field === "name" || field === "email" ? " *" : ""}
              </label>
              <input
                type={field === "email" ? "email" : "text"}
                required={field === "name" || field === "email"}
                value={form[field]}
                onChange={(e) =>
                  setForm((p) => ({ ...p, [field]: e.target.value }))
                }
                className={inputCls}
              />
            </div>
          ))}
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
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
