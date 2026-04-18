import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { formatDate, formatCurrency } from "@/lib/utils";
import InvoiceForm from "@/components/admin/InvoiceForm";
import InvoiceActions from "@/components/admin/InvoiceActions";

export const metadata: Metadata = { title: "Invoices" };

const statusColors: Record<string, { bg: string; text: string }> = {
  draft: { bg: "#3e2610", text: "#9b7653" },
  sent: { bg: "#1a3a2a", text: "#4ade80" },
  paid: { bg: "#1a3a1a", text: "#4ade80" },
  overdue: { bg: "#3a1a1a", text: "#ef4444" },
  cancelled: { bg: "#3e2610", text: "#7d5c3a" },
};

export default async function InvoicesPage() {
  const supabase = await createClient();

  const [{ data: invoices }, { data: clients }, { data: projects }] =
    await Promise.all([
      supabase
        .from("invoices")
        .select("*, client:clients(name, company)")
        .order("created_at", { ascending: false }),
      supabase.from("clients").select("id, name, company"),
      supabase.from("projects").select("id, name, client_id"),
    ]);

  const totalUnpaid =
    invoices
      ?.filter((i: { status: string }) => i.status === "sent" || i.status === "overdue")
      .reduce((sum: number, i: { total: number }) => sum + i.total, 0) ?? 0;

  return (
    <div style={{ padding: "2rem" }}>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 style={{ color: "#faf7f2" }} className="text-2xl font-semibold">Invoices</h1>
          <p style={{ color: "#9b7653" }} className="text-sm mt-1">
            {invoices?.length ?? 0} total · {formatCurrency(totalUnpaid)} outstanding
          </p>
        </div>
        <InvoiceForm clients={clients ?? []} projects={projects ?? []} />
      </div>

      <div style={{ backgroundColor: "#2a1608", border: "1px solid #3e2610" }} className="rounded-lg overflow-hidden">
        {invoices && invoices.length > 0 ? (
          <div>
            <div style={{ borderBottom: "1px solid #3e2610" }} className="grid grid-cols-12 gap-4 px-5 py-3">
              {["Invoice", "Client", "Total", "Due", "Status", "Actions"].map((h) => (
                <span key={h} style={{ color: "#7d5c3a" }} className={`text-xs font-semibold uppercase tracking-widest ${h === "Invoice" ? "col-span-2" : h === "Client" ? "col-span-3" : h === "Actions" ? "col-span-2 text-right" : "col-span-2"}`}>{h}</span>
              ))}
            </div>
            {invoices.map((inv: {
              id: string;
              invoice_number: string;
              client?: { name: string; company: string | null } | null;
              total: number;
              due_date: string;
              status: string;
            }) => {
              const sc = statusColors[inv.status] ?? statusColors.draft;
              return (
                <div key={inv.id} style={{ borderBottom: "1px solid #3e2610" }} className="grid grid-cols-12 gap-4 px-5 py-4 items-center last:border-0">
                  <p style={{ color: "#faf7f2" }} className="text-sm font-mono col-span-2">{inv.invoice_number}</p>
                  <p style={{ color: "#9b7653" }} className="text-sm col-span-3 truncate">{inv.client?.name ?? "—"}</p>
                  <p style={{ color: "#cfa97e" }} className="text-sm font-semibold col-span-2">{formatCurrency(inv.total)}</p>
                  <p style={{ color: "#9b7653" }} className="text-sm col-span-2">{formatDate(inv.due_date)}</p>
                  <span style={{ backgroundColor: sc.bg, color: sc.text }} className="text-xs px-2 py-0.5 rounded col-span-1 inline-block capitalize">{inv.status}</span>
                  <div className="col-span-2 flex justify-end">
                    <InvoiceActions invoiceId={inv.id} currentStatus={inv.status} invoiceNumber={inv.invoice_number} />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-12 text-center">
            <p style={{ color: "#7d5c3a" }} className="text-sm">No invoices yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
