import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { formatDate, formatCurrency } from "@/lib/utils";
import PaymentForm from "@/components/admin/PaymentForm";

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

  const totalReceived = payments?.reduce((sum: number, p: { amount: number }) => sum + p.amount, 0) ?? 0;

  return (
    <div style={{ padding: "2rem" }}>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 style={{ color: "#faf7f2" }} className="text-2xl font-semibold">Payments</h1>
          <p style={{ color: "#9b7653" }} className="text-sm mt-1">
            {payments?.length ?? 0} received · {formatCurrency(totalReceived)} total
          </p>
        </div>
        <PaymentForm invoices={invoices ?? []} />
      </div>

      <div style={{ backgroundColor: "#2a1608", border: "1px solid #3e2610" }} className="rounded-lg overflow-hidden">
        {payments && payments.length > 0 ? (
          <div>
            {payments.map((payment: {
              id: string;
              invoice?: { invoice_number: string; total: number; client?: { name: string } | null } | null;
              amount: number;
              paid_at: string;
              method: string;
              reference: string | null;
            }) => (
              <div key={payment.id} style={{ borderBottom: "1px solid #3e2610" }} className="p-5 flex items-center justify-between last:border-0">
                <div>
                  <p style={{ color: "#faf7f2" }} className="font-medium text-sm">
                    {payment.invoice?.client?.name ?? "—"}
                  </p>
                  <p style={{ color: "#9b7653" }} className="text-xs mt-0.5">
                    {payment.invoice?.invoice_number ?? "—"} · {payment.method}
                    {payment.reference ? ` · Ref: ${payment.reference}` : ""}
                  </p>
                </div>
                <div className="text-right">
                  <p style={{ color: "#4ade80" }} className="font-semibold">
                    {formatCurrency(payment.amount)}
                  </p>
                  <p style={{ color: "#7d5c3a" }} className="text-xs mt-0.5">
                    {formatDate(payment.paid_at)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            <p style={{ color: "#7d5c3a" }} className="text-sm">No payments recorded</p>
          </div>
        )}
      </div>
    </div>
  );
}
