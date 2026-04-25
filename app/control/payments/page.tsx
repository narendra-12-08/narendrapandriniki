import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { formatDate, formatCurrency } from "@/lib/utils";
import PaymentForm from "@/components/admin/PaymentForm";
import { Badge, Card, Empty, PageHeader } from "@/components/admin/ui";

export const metadata: Metadata = { title: "Payments" };

export default async function PaymentsPage() {
  const supabase = await createClient();

  const [{ data: payments }, { data: invoices }] = await Promise.all([
    supabase
      .from("payments")
      .select("*, invoice:invoices(invoice_number, total, client:clients(name))")
      .order("paid_at", { ascending: false }),
    supabase
      .from("invoices")
      .select("id, invoice_number, total")
      .in("status", ["sent", "overdue"]),
  ]);

  const list = (payments ?? []) as Array<{
    id: string;
    invoice?: {
      invoice_number: string;
      total: number;
      client?: { name: string } | null;
    } | null;
    amount: number;
    paid_at: string;
    method: string;
    reference: string | null;
  }>;

  const totalReceived = list.reduce((s, p) => s + Number(p.amount ?? 0), 0);

  return (
    <>
      <PageHeader
        title="Payments"
        subtitle={`${list.length} received · ${formatCurrency(totalReceived)} total`}
        actions={<PaymentForm invoices={invoices ?? []} />}
      />

      <Card>
        {list.length > 0 ? (
          <ul className="divide-y divide-[var(--border)]">
            {list.map((p) => (
              <li
                key={p.id}
                className="p-5 flex items-center justify-between gap-3 hover:bg-[var(--surface-2)]/40"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-[var(--text)] truncate">
                    {p.invoice?.client?.name ?? "—"}
                  </p>
                  <p className="text-xs text-[var(--text-3)] truncate">
                    <span className="font-mono">
                      {p.invoice?.invoice_number ?? "—"}
                    </span>{" "}
                    · {p.method.replace("_", " ")}
                    {p.reference ? ` · Ref ${p.reference}` : ""}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-mono font-semibold text-[var(--lime)] tabular-nums">
                    {formatCurrency(Number(p.amount ?? 0))}
                  </p>
                  <p className="text-xs text-[var(--text-4)] mt-0.5">
                    {formatDate(p.paid_at)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <Empty title="No payments recorded" />
        )}
      </Card>
    </>
  );
}
