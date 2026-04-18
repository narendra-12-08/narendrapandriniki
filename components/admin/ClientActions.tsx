"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

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

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        style={{ backgroundColor: "#5c3d1e", color: "#faf7f2" }}
        className="px-4 py-2 text-sm font-medium rounded hover:opacity-90"
      >
        + Add
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.7)" }}>
          <div style={{ backgroundColor: "#2a1608", border: "1px solid #3e2610", width: "100%", maxWidth: "440px" }} className="rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 style={{ color: "#faf7f2" }} className="font-semibold">Add Client / Lead</h2>
              <button onClick={() => setOpen(false)} style={{ color: "#9b7653" }}>✕</button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex gap-3">
                {(["client", "lead"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setForm((p) => ({ ...p, type: t }))}
                    style={{
                      backgroundColor: form.type === t ? "#5c3d1e" : "#3e2610",
                      color: form.type === t ? "#faf7f2" : "#9b7653",
                    }}
                    className="flex-1 py-2 text-sm rounded capitalize"
                  >
                    {t}
                  </button>
                ))}
              </div>
              {["name", "email", "company", "phone"].map((field) => (
                <div key={field}>
                  <label style={{ color: "#9b7653" }} className="block text-xs mb-1 capitalize">{field}{field === "name" || field === "email" ? " *" : ""}</label>
                  <input
                    type={field === "email" ? "email" : "text"}
                    required={field === "name" || field === "email"}
                    value={form[field as keyof typeof form] as string}
                    onChange={(e) => setForm((p) => ({ ...p, [field]: e.target.value }))}
                    style={{ backgroundColor: "#1e1208", border: "1px solid #3e2610", color: "#faf7f2" }}
                    className="w-full px-3 py-2 text-sm rounded outline-none"
                  />
                </div>
              ))}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setOpen(false)} style={{ color: "#9b7653", border: "1px solid #3e2610" }} className="flex-1 py-2 text-sm rounded">Cancel</button>
                <button type="submit" disabled={loading} style={{ backgroundColor: "#5c3d1e", color: "#faf7f2" }} className="flex-1 py-2 text-sm rounded">
                  {loading ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
