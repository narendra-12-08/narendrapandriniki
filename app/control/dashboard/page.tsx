import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatDate, formatCurrency } from "@/lib/utils";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const supabase = await createClient();

  const [
    { count: totalLeads },
    { count: activeClients },
    { count: activeProjects },
    { data: invoices },
    { data: recentInquiries },
  ] = await Promise.all([
    supabase.from("leads").select("*", { count: "exact", head: true }),
    supabase
      .from("clients")
      .select("*", { count: "exact", head: true })
      .eq("status", "active"),
    supabase
      .from("projects")
      .select("*", { count: "exact", head: true })
      .eq("status", "active"),
    supabase
      .from("invoices")
      .select("*")
      .in("status", ["sent", "overdue"])
      .order("due_date", { ascending: true }),
    supabase
      .from("inbox_messages")
      .select("*")
      .eq("status", "unread")
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  const unpaidInvoices =
    invoices?.filter((i) => i.status === "sent") || [];
  const overdueInvoices =
    invoices?.filter((i) => i.status === "overdue") || [];

  const stats = [
    {
      label: "Total Leads",
      value: totalLeads ?? 0,
      href: "/control/clients",
      color: "#cfa97e",
    },
    {
      label: "Active Clients",
      value: activeClients ?? 0,
      href: "/control/clients",
      color: "#9b7653",
    },
    {
      label: "Active Projects",
      value: activeProjects ?? 0,
      href: "/control/projects",
      color: "#7d5c3a",
    },
    {
      label: "Unpaid Invoices",
      value: unpaidInvoices.length,
      href: "/control/invoices",
      color: "#5c3d1e",
    },
    {
      label: "Overdue",
      value: overdueInvoices.length,
      href: "/control/invoices",
      color: overdueInvoices.length > 0 ? "#ef4444" : "#5c3d1e",
    },
    {
      label: "Unread Messages",
      value: recentInquiries?.length ?? 0,
      href: "/control/inbox",
      color: "#cfa97e",
    },
  ];

  return (
    <div style={{ padding: "2rem" }}>
      <div className="mb-8">
        <h1 style={{ color: "#faf7f2" }} className="text-2xl font-semibold">
          Dashboard
        </h1>
        <p style={{ color: "#9b7653" }} className="text-sm mt-1">
          Business overview
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        {stats.map(({ label, value, href, color }) => (
          <Link
            key={label}
            href={href}
            style={{
              backgroundColor: "#2a1608",
              border: "1px solid #3e2610",
            }}
            className="block p-5 rounded-lg hover:border-[#5c3d1e] transition-colors"
          >
            <div style={{ color }} className="text-3xl font-semibold mb-1">
              {value}
            </div>
            <div style={{ color: "#9b7653" }} className="text-sm">
              {label}
            </div>
          </Link>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Recent inbox */}
        <div
          style={{
            backgroundColor: "#2a1608",
            border: "1px solid #3e2610",
          }}
          className="rounded-lg p-6"
        >
          <div className="flex items-center justify-between mb-5">
            <h2 style={{ color: "#faf7f2" }} className="font-semibold">
              Recent Inbox
            </h2>
            <Link
              href="/control/inbox"
              style={{ color: "#9b7653" }}
              className="text-xs hover:opacity-80"
            >
              View all →
            </Link>
          </div>
          {recentInquiries && recentInquiries.length > 0 ? (
            <div className="space-y-3">
              {recentInquiries.map((msg: { id: string; subject: string; sender_email: string; created_at: string }) => (
                <Link
                  key={msg.id}
                  href={`/control/inbox`}
                  style={{ borderBottom: "1px solid #3e2610" }}
                  className="block py-3 last:border-0"
                >
                  <p style={{ color: "#faf7f2" }} className="text-sm font-medium">
                    {msg.subject}
                  </p>
                  <p style={{ color: "#9b7653" }} className="text-xs mt-0.5">
                    {msg.sender_email} · {formatDate(msg.created_at)}
                  </p>
                </Link>
              ))}
            </div>
          ) : (
            <p style={{ color: "#7d5c3a" }} className="text-sm">
              No unread messages
            </p>
          )}
        </div>

        {/* Overdue invoices */}
        <div
          style={{
            backgroundColor: "#2a1608",
            border: "1px solid #3e2610",
          }}
          className="rounded-lg p-6"
        >
          <div className="flex items-center justify-between mb-5">
            <h2 style={{ color: "#faf7f2" }} className="font-semibold">
              Outstanding Invoices
            </h2>
            <Link
              href="/control/invoices"
              style={{ color: "#9b7653" }}
              className="text-xs hover:opacity-80"
            >
              View all →
            </Link>
          </div>
          {invoices && invoices.length > 0 ? (
            <div className="space-y-3">
              {invoices.slice(0, 5).map((inv: { id: string; invoice_number: string; total: number; due_date: string; status: string }) => (
                <Link
                  key={inv.id}
                  href={`/control/invoices`}
                  style={{ borderBottom: "1px solid #3e2610" }}
                  className="block py-3 last:border-0"
                >
                  <div className="flex items-center justify-between">
                    <p style={{ color: "#faf7f2" }} className="text-sm font-medium">
                      {inv.invoice_number}
                    </p>
                    <p style={{ color: "#cfa97e" }} className="text-sm font-semibold">
                      {formatCurrency(inv.total)}
                    </p>
                  </div>
                  <div className="flex items-center justify-between mt-0.5">
                    <p style={{ color: "#9b7653" }} className="text-xs">
                      Due {formatDate(inv.due_date)}
                    </p>
                    <span
                      style={{
                        color: inv.status === "overdue" ? "#ef4444" : "#9b7653",
                        backgroundColor:
                          inv.status === "overdue"
                            ? "rgba(239,68,68,0.1)"
                            : "transparent",
                      }}
                      className="text-xs px-2 py-0.5 rounded"
                    >
                      {inv.status}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p style={{ color: "#7d5c3a" }} className="text-sm">
              No outstanding invoices
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
