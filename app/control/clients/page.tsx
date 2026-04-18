import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";
import ClientActions from "@/components/admin/ClientActions";

export const metadata: Metadata = { title: "Clients" };

export default async function ClientsPage() {
  const supabase = await createClient();

  const [{ data: clients }, { data: leads }] = await Promise.all([
    supabase.from("clients").select("*").order("created_at", { ascending: false }),
    supabase.from("leads").select("*").order("created_at", { ascending: false }),
  ]);

  return (
    <div style={{ padding: "2rem" }}>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 style={{ color: "#faf7f2" }} className="text-2xl font-semibold">Clients & Leads</h1>
          <p style={{ color: "#9b7653" }} className="text-sm mt-1">{clients?.length ?? 0} clients · {leads?.length ?? 0} leads</p>
        </div>
        <ClientActions mode="add" />
      </div>

      {/* Leads */}
      <div className="mb-8">
        <h2 style={{ color: "#cfa97e" }} className="text-sm font-semibold uppercase tracking-widest mb-4">Leads</h2>
        <div style={{ backgroundColor: "#2a1608", border: "1px solid #3e2610" }} className="rounded-lg overflow-hidden">
          {leads && leads.length > 0 ? (
            <div>
              {leads.map((lead: {
                id: string;
                name: string;
                email: string;
                company: string | null;
                status: string;
                source: string | null;
                created_at: string;
                notes: string | null;
              }) => (
                <div key={lead.id} style={{ borderBottom: "1px solid #3e2610" }} className="p-4 flex items-center justify-between last:border-0">
                  <div>
                    <p style={{ color: "#faf7f2" }} className="font-medium text-sm">{lead.name}</p>
                    <p style={{ color: "#9b7653" }} className="text-xs">{lead.email}{lead.company ? ` · ${lead.company}` : ""}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span style={{ backgroundColor: "#3e2610", color: "#cfa97e" }} className="text-xs px-2 py-0.5 rounded">{lead.status}</span>
                    <span style={{ color: "#7d5c3a" }} className="text-xs">{formatDate(lead.created_at)}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <p style={{ color: "#7d5c3a" }} className="text-sm">No leads yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Clients */}
      <div>
        <h2 style={{ color: "#cfa97e" }} className="text-sm font-semibold uppercase tracking-widest mb-4">Clients</h2>
        <div style={{ backgroundColor: "#2a1608", border: "1px solid #3e2610" }} className="rounded-lg overflow-hidden">
          {clients && clients.length > 0 ? (
            <div>
              {clients.map((client: {
                id: string;
                name: string;
                email: string;
                company: string | null;
                phone: string | null;
                status: string;
                created_at: string;
              }) => (
                <div key={client.id} style={{ borderBottom: "1px solid #3e2610" }} className="p-4 flex items-center justify-between last:border-0">
                  <div>
                    <p style={{ color: "#faf7f2" }} className="font-medium text-sm">{client.name}</p>
                    <p style={{ color: "#9b7653" }} className="text-xs">
                      {client.email}
                      {client.company ? ` · ${client.company}` : ""}
                      {client.phone ? ` · ${client.phone}` : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span style={{ backgroundColor: client.status === "active" ? "#1a3a1a" : "#3e2610", color: client.status === "active" ? "#4ade80" : "#9b7653" }} className="text-xs px-2 py-0.5 rounded">{client.status}</span>
                    <span style={{ color: "#7d5c3a" }} className="text-xs">{formatDate(client.created_at)}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <p style={{ color: "#7d5c3a" }} className="text-sm">No clients yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
