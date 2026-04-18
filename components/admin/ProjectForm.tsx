"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface Props {
  clients: { id: string; name: string; company: string | null }[];
}

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

  function change(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
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
      <button onClick={() => setOpen(true)} style={{ backgroundColor: "#5c3d1e", color: "#faf7f2" }} className="px-4 py-2 text-sm font-medium rounded hover:opacity-90">
        + New Project
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.7)" }}>
          <div style={{ backgroundColor: "#2a1608", border: "1px solid #3e2610", width: "100%", maxWidth: "480px", maxHeight: "90vh", overflowY: "auto" }} className="rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 style={{ color: "#faf7f2" }} className="font-semibold">New Project</h2>
              <button onClick={() => setOpen(false)} style={{ color: "#9b7653" }}>✕</button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label style={{ color: "#9b7653" }} className="block text-xs mb-1">Project Name *</label>
                <input name="name" required value={form.name} onChange={change} style={{ backgroundColor: "#1e1208", border: "1px solid #3e2610", color: "#faf7f2" }} className="w-full px-3 py-2 text-sm rounded outline-none" />
              </div>
              <div>
                <label style={{ color: "#9b7653" }} className="block text-xs mb-1">Client</label>
                <select name="client_id" value={form.client_id} onChange={change} style={{ backgroundColor: "#1e1208", border: "1px solid #3e2610", color: "#faf7f2" }} className="w-full px-3 py-2 text-sm rounded outline-none">
                  <option value="">Select client</option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}{c.company ? ` (${c.company})` : ""}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ color: "#9b7653" }} className="block text-xs mb-1">Service Type</label>
                <input name="service_type" value={form.service_type} onChange={change} style={{ backgroundColor: "#1e1208", border: "1px solid #3e2610", color: "#faf7f2" }} className="w-full px-3 py-2 text-sm rounded outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label style={{ color: "#9b7653" }} className="block text-xs mb-1">Start Date</label>
                  <input type="date" name="start_date" value={form.start_date} onChange={change} style={{ backgroundColor: "#1e1208", border: "1px solid #3e2610", color: "#faf7f2" }} className="w-full px-3 py-2 text-sm rounded outline-none" />
                </div>
                <div>
                  <label style={{ color: "#9b7653" }} className="block text-xs mb-1">Due Date</label>
                  <input type="date" name="due_date" value={form.due_date} onChange={change} style={{ backgroundColor: "#1e1208", border: "1px solid #3e2610", color: "#faf7f2" }} className="w-full px-3 py-2 text-sm rounded outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label style={{ color: "#9b7653" }} className="block text-xs mb-1">Agreed Amount (£)</label>
                  <input type="number" name="agreed_amount" value={form.agreed_amount} onChange={change} style={{ backgroundColor: "#1e1208", border: "1px solid #3e2610", color: "#faf7f2" }} className="w-full px-3 py-2 text-sm rounded outline-none" />
                </div>
                <div>
                  <label style={{ color: "#9b7653" }} className="block text-xs mb-1">Status</label>
                  <select name="status" value={form.status} onChange={change} style={{ backgroundColor: "#1e1208", border: "1px solid #3e2610", color: "#faf7f2" }} className="w-full px-3 py-2 text-sm rounded outline-none">
                    {["discovery", "active", "paused", "complete", "cancelled"].map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setOpen(false)} style={{ color: "#9b7653", border: "1px solid #3e2610" }} className="flex-1 py-2 text-sm rounded">Cancel</button>
                <button type="submit" disabled={loading} style={{ backgroundColor: "#5c3d1e", color: "#faf7f2" }} className="flex-1 py-2 text-sm rounded">
                  {loading ? "Saving..." : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
