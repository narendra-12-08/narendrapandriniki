import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatDate, formatCurrency } from "@/lib/utils";
import InvoiceForm from "@/components/admin/InvoiceForm";
import InvoiceActions from "@/components/admin/InvoiceActions";
import { Badge, Card, Empty, PageHeader } from "@/components/admin/ui";

export const metadata: Metadata = { title: "Invoices" };

const STATUSES = ["all", "draft", "sent", "paid", "overdue", "cancelled"] as const;
type StatusFilter = (typeof STATUSES)[number];

const tone: Record<string, "accent" | "violet" | "lime" | "amber" | "rose" | "default"> = {
  draft: "default",
  sent: "accent",
  paid: "lime",
  overdue: "rose",
  cancelled: "default",
};

export default async function InvoicesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status: rawStatus } = await searchParams;
  const status: StatusFilter = (
    STATUSES.includes(rawStatus as StatusFilter) ? rawStatus : "all"
  ) as StatusFilter;

  const supabase = await createClient();

  let query = supabase
    .from("invoices")
    .select("*, client:clients(name, company)")
    .order("created_at", { ascending: false });
  if (status !== "all") query = query.eq("status", status);

  const [{ data: invoices }, { data: clients }, { data: projects }] =
    await Promise.all([
      query,
      supabase.from("clients").select("id, name, company"),
      supabase.from("projects").select("id, name, client_id"),
    ]);

  const list = (invoices ?? []) as Array<{
    id: string;
    invoice_number: string;
    client?: { name: string; company: string | null } | null;
    total: number;
    due_date: string;
    status: string;
  }>;

  const totalUnpaid = list
    .filter((i) => i.status === "sent" || i.status === "overdue")
    .reduce((s, i) => s + Number(i.total ?? 0), 0);

  return (
    <>
      <PageHeader
        title="Invoices"
        subtitle={`${list.length} total · ${formatCurrency(totalUnpaid)} outstanding`}
        actions={<InvoiceForm clients={clients ?? []} projects={projects ?? []} />}
      />

      <div className="mb-4 flex flex-wrap items-center gap-2">
        {STATUSES.map((s) => {
          const params = new URLSearchParams();
          if (s !== "all") params.set("status", s);
          const qs = params.toString();
          return (
            <Link
              key={s}
              href={`/control/invoices${qs ? `?${qs}` : ""}`}
              className={`text-xs px-2.5 py-1 rounded-full border transition-colors capitalize ${
                status === s
                  ? "bg-[var(--accent)]/15 border-[var(--accent)]/30 text-[var(--accent)]"
                  : "bg-[var(--surface-2)] border-[var(--border)] text-[var(--text-3)] hover:text-[var(--text)]"
              }`}
            >
              {s}
            </Link>
          );
        })}
      </div>

      <Card>
        {list.length > 0 ? (
          <div>
            <div className="hidden md:grid grid-cols-12 gap-4 px-5 py-3 border-b border-[var(--border)] text-[11px] font-semibold uppercase tracking-widest text-[var(--text-4)]">
              <span className="col-span-2">Invoice</span>
              <span className="col-span-3">Client</span>
              <span className="col-span-2 text-right">Total</span>
              <span className="col-span-2">Due</span>
              <span className="col-span-1">Status</span>
              <span className="col-span-2 text-right">Actions</span>
            </div>
            <ul className="divide-y divide-[var(--border)]">
              {list.map((inv) => (
                <li
                  key={inv.id}
                  className="px-5 py-4 grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 items-center hover:bg-[var(--surface-2)]/40"
                >
                  <p className="md:col-span-2 text-sm font-mono text-[var(--text)]">
                    {inv.invoice_number}
                  </p>
                  <p className="md:col-span-3 text-sm text-[var(--text-2)] truncate">
                    {inv.client?.name ?? "—"}
                  </p>
                  <p className="md:col-span-2 text-sm font-mono font-semibold text-[var(--text)] md:text-right tabular-nums">
                    {formatCurrency(Number(inv.total ?? 0))}
                  </p>
                  <p className="md:col-span-2 text-sm text-[var(--text-3)]">
                    {formatDate(inv.due_date)}
                  </p>
                  <div className="md:col-span-1">
                    <Badge tone={tone[inv.status] ?? "default"}>
                      {inv.status}
                    </Badge>
                  </div>
                  <div className="md:col-span-2 flex md:justify-end">
                    <InvoiceActions
                      invoiceId={inv.id}
                      currentStatus={inv.status}
                      invoiceNumber={inv.invoice_number}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <Empty title="No invoices" />
        )}
      </Card>
    </>
  );
}
