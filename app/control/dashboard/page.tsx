import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  CircleDollarSign,
  FolderKanban,
  Inbox as InboxIcon,
  Users,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { formatDate, formatCurrency } from "@/lib/utils";
import { Badge, Card, Empty, PageHeader, StatCard } from "@/components/admin/ui";

export const metadata: Metadata = { title: "Dashboard" };

type InvoiceLite = {
  id: string;
  invoice_number: string;
  total: number;
  due_date: string;
  status: "draft" | "sent" | "paid" | "overdue" | "cancelled";
};
type InboxLite = {
  id: string;
  subject: string;
  sender_name: string | null;
  sender_email: string;
  status: string;
  created_at: string;
};

export default async function DashboardPage() {
  const supabase = await createClient();

  const [
    { count: activeClients },
    { count: activeProjects },
    { count: unreadCount },
    { data: outstandingInvoices },
    { data: recentInbox },
    { data: recentInvoices },
  ] = await Promise.all([
    supabase
      .from("clients")
      .select("*", { count: "exact", head: true })
      .eq("status", "active"),
    supabase
      .from("projects")
      .select("*", { count: "exact", head: true })
      .eq("status", "active"),
    supabase
      .from("inbox_messages")
      .select("*", { count: "exact", head: true })
      .eq("status", "unread"),
    supabase
      .from("invoices")
      .select("id, total, status, due_date")
      .in("status", ["sent", "overdue"]),
    supabase
      .from("inbox_messages")
      .select("id, subject, sender_name, sender_email, status, created_at")
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("invoices")
      .select("id, invoice_number, total, status, due_date")
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  const inv = (outstandingInvoices ?? []) as Pick<
    InvoiceLite,
    "id" | "total" | "status" | "due_date"
  >[];
  const unpaid = inv.filter((i) => i.status === "sent");
  const overdue = inv.filter((i) => i.status === "overdue");
  const unpaidAmt = unpaid.reduce((s, i) => s + Number(i.total ?? 0), 0);
  const overdueAmt = overdue.reduce((s, i) => s + Number(i.total ?? 0), 0);

  return (
    <>
      <PageHeader
        title="Dashboard"
        subtitle={`Welcome back. Here's the state of the business as of ${formatDate(
          new Date()
        )}.`}
      />

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-10">
        <StatCard
          label="Active clients"
          value={activeClients ?? 0}
          href="/control/clients"
          accent="accent"
          hint="Currently engaged"
        />
        <StatCard
          label="Active projects"
          value={activeProjects ?? 0}
          href="/control/projects"
          accent="violet"
          hint="In flight"
        />
        <StatCard
          label="Unpaid invoices"
          value={unpaid.length}
          href="/control/invoices"
          accent="lime"
          hint={formatCurrency(unpaidAmt)}
        />
        <StatCard
          label="Overdue invoices"
          value={overdue.length}
          href="/control/invoices"
          accent={overdue.length > 0 ? "rose" : "amber"}
          hint={formatCurrency(overdueAmt)}
        />
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card>
          <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)]">
            <div className="flex items-center gap-2">
              <InboxIcon size={16} className="text-[var(--accent)]" />
              <h2 className="font-semibold text-[var(--text)]">
                Recent messages
              </h2>
              {(unreadCount ?? 0) > 0 && (
                <Badge tone="accent">{unreadCount} unread</Badge>
              )}
            </div>
            <Link
              href="/control/inbox"
              className="inline-flex items-center gap-1 text-xs text-[var(--text-3)] hover:text-[var(--accent)]"
            >
              View all <ArrowRight size={12} />
            </Link>
          </div>

          {recentInbox && recentInbox.length > 0 ? (
            <ul className="divide-y divide-[var(--border)]">
              {(recentInbox as InboxLite[]).map((msg) => (
                <li
                  key={msg.id}
                  className="px-5 py-3.5 hover:bg-[var(--surface-2)]/40 transition-colors"
                >
                  <Link href="/control/inbox" className="block">
                    <div className="flex items-start gap-3">
                      {msg.status === "unread" && (
                        <span className="mt-1.5 h-2 w-2 rounded-full bg-[var(--accent)] shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[var(--text)] truncate">
                          {msg.subject}
                        </p>
                        <p className="text-xs text-[var(--text-3)] truncate">
                          {msg.sender_name
                            ? `${msg.sender_name} · `
                            : ""}
                          {msg.sender_email}
                        </p>
                      </div>
                      <span className="text-xs text-[var(--text-4)] shrink-0">
                        {formatDate(msg.created_at)}
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <Empty title="No messages yet" />
          )}
        </Card>

        <Card>
          <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)]">
            <div className="flex items-center gap-2">
              <CircleDollarSign size={16} className="text-[var(--lime)]" />
              <h2 className="font-semibold text-[var(--text)]">
                Recent invoices
              </h2>
            </div>
            <Link
              href="/control/invoices"
              className="inline-flex items-center gap-1 text-xs text-[var(--text-3)] hover:text-[var(--accent)]"
            >
              View all <ArrowRight size={12} />
            </Link>
          </div>

          {recentInvoices && recentInvoices.length > 0 ? (
            <ul className="divide-y divide-[var(--border)]">
              {(recentInvoices as InvoiceLite[]).map((inv) => {
                const tone =
                  inv.status === "paid"
                    ? "lime"
                    : inv.status === "overdue"
                    ? "rose"
                    : inv.status === "sent"
                    ? "accent"
                    : "default";
                return (
                  <li
                    key={inv.id}
                    className="px-5 py-3.5 hover:bg-[var(--surface-2)]/40 transition-colors"
                  >
                    <Link
                      href="/control/invoices"
                      className="flex items-center justify-between gap-3"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-mono text-[var(--text)]">
                          {inv.invoice_number}
                        </p>
                        <p className="text-xs text-[var(--text-3)]">
                          Due {formatDate(inv.due_date)}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-sm text-[var(--text)] tabular-nums">
                          {formatCurrency(Number(inv.total ?? 0))}
                        </span>
                        <Badge tone={tone}>{inv.status}</Badge>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          ) : (
            <Empty title="No invoices yet" />
          )}
        </Card>
      </section>

      <section className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <Link
          href="/control/clients"
          className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4 hover:border-[var(--accent)]/40 hover:bg-[var(--surface-2)]/40 transition-colors flex items-center gap-3"
        >
          <Users size={18} className="text-[var(--accent)]" />
          <div>
            <p className="text-sm font-medium text-[var(--text)]">
              Clients
            </p>
            <p className="text-xs text-[var(--text-3)]">
              Manage clients and leads
            </p>
          </div>
        </Link>
        <Link
          href="/control/projects"
          className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4 hover:border-[var(--violet)]/40 hover:bg-[var(--surface-2)]/40 transition-colors flex items-center gap-3"
        >
          <FolderKanban size={18} className="text-[var(--violet)]" />
          <div>
            <p className="text-sm font-medium text-[var(--text)]">
              Projects
            </p>
            <p className="text-xs text-[var(--text-3)]">
              Track active engagements
            </p>
          </div>
        </Link>
        <Link
          href="/control/invoices"
          className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4 hover:border-[var(--lime)]/40 hover:bg-[var(--surface-2)]/40 transition-colors flex items-center gap-3"
        >
          <CircleDollarSign size={18} className="text-[var(--lime)]" />
          <div>
            <p className="text-sm font-medium text-[var(--text)]">
              Invoices
            </p>
            <p className="text-xs text-[var(--text-3)]">
              Bill and chase
            </p>
          </div>
        </Link>
      </section>
    </>
  );
}
