import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  CircleDollarSign,
  FileText,
  FolderKanban,
  Inbox as InboxIcon,
  TrendingUp,
  UserPlus,
} from "lucide-react";
import { Badge, Card, Empty, PageHeader } from "@/components/admin/ui";
import AreaChart from "@/components/admin/charts/AreaChart";
import BarChart from "@/components/admin/charts/BarChart";
import DonutChart from "@/components/admin/charts/DonutChart";
import HorizontalBarList from "@/components/admin/charts/HorizontalBarList";
import MetricCard from "@/components/admin/charts/MetricCard";
import {
  getClientStats,
  getInboxStats,
  getInvoiceStats,
  getLeadFunnel,
  getProjectStats,
  getRecentActivity,
  getRevenueByClient,
  getRevenueOverTime,
  getRevenueYTD,
  getUpcomingDueInvoices,
  type ActivityEvent,
} from "@/lib/db/analytics";
import { formatCurrency, formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Dashboard" };

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d}d ago`;
  return formatDate(iso);
}

const ACTIVITY_ICON: Record<ActivityEvent["type"], typeof CircleDollarSign> = {
  invoice: FileText,
  payment: CircleDollarSign,
  project: FolderKanban,
  inbox: InboxIcon,
  lead: UserPlus,
};

const ACTIVITY_COLOR: Record<ActivityEvent["type"], string> = {
  invoice: "var(--accent)",
  payment: "var(--lime)",
  project: "var(--violet)",
  inbox: "var(--accent)",
  lead: "var(--amber)",
};

export default async function DashboardPage() {
  const [
    revenueSeries,
    revenueYTD,
    revenueByClient,
    invoiceStats,
    projectStats,
    clientStats,
    inboxStats,
    leadFunnel,
    activity,
    upcoming,
  ] = await Promise.all([
    getRevenueOverTime(12),
    getRevenueYTD(),
    getRevenueByClient(10),
    getInvoiceStats(),
    getProjectStats(),
    getClientStats(),
    getInboxStats(30),
    getLeadFunnel(),
    getRecentActivity(20),
    getUpcomingDueInvoices(),
  ]);

  // KPI deltas: compare current month to previous (revenue series)
  const len = revenueSeries.length;
  const last = revenueSeries[len - 1]?.revenue ?? 0;
  const prev = revenueSeries[len - 2]?.revenue ?? 0;
  const revenueDelta =
    prev > 0 ? ((last - prev) / prev) * 100 : last > 0 ? 100 : 0;

  const inboxSpark = inboxStats.perDay.map((p) => p.count);
  const revenueSpark = revenueSeries.map((p) => p.revenue);

  // Donut for invoice statuses
  const invoiceDonut = [
    { label: "Paid", value: invoiceStats.paid.count, color: "var(--lime)" },
    { label: "Sent", value: invoiceStats.sent.count, color: "var(--accent)" },
    { label: "Overdue", value: invoiceStats.overdue.count, color: "var(--rose)" },
    { label: "Draft", value: invoiceStats.draft.count, color: "var(--violet)" },
  ].filter((d) => d.value > 0);

  // Lead funnel data
  const leadBars = leadFunnel.map((r) => ({ label: r.status, value: r.count }));

  // Inbox area chart
  const inboxArea = inboxStats.perDay.map((p, i) => {
    const d = new Date(p.date);
    const isFirstOrLast = i === 0 || i === inboxStats.perDay.length - 1;
    return {
      x: isFirstOrLast
        ? d.toLocaleDateString("en-GB", { day: "numeric", month: "short" })
        : "",
      y: p.count,
    };
  });

  const revenueArea = revenueSeries.map((p) => ({
    x: p.label,
    y: p.revenue,
  }));

  const outstandingCount =
    invoiceStats.sent.count + invoiceStats.overdue.count;
  const outstandingAmount =
    invoiceStats.sent.amount + invoiceStats.overdue.amount;

  return (
    <>
      <PageHeader
        title="Dashboard"
        subtitle={`State of the business as of ${formatDate(new Date())}.`}
        actions={
          <Link
            href="/control/analytics"
            className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text-2)] hover:text-[var(--text)] hover:border-[var(--border-2)] transition-colors"
          >
            <TrendingUp size={14} /> Deep dive
          </Link>
        }
      />

      {/* Row 1: KPI tiles */}
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 mb-8">
        <MetricCard
          accent="lime"
          label="Revenue YTD"
          value={formatCurrency(revenueYTD)}
          delta={{
            value: revenueDelta,
            positive: revenueDelta >= 0,
          }}
          spark={revenueSpark}
          hint="Paid invoices, calendar year"
        />
        <MetricCard
          accent="cyan"
          label="Active clients"
          value={clientStats.active}
          hint={`${clientStats.prospect} prospects · ${clientStats.total} total`}
          spark={[
            clientStats.inactive,
            clientStats.prospect,
            clientStats.active,
          ]}
        />
        <MetricCard
          accent="violet"
          label="Active projects"
          value={projectStats.active}
          hint={`${projectStats.complete} complete · ${projectStats.paused} paused`}
          spark={[
            projectStats.discovery,
            projectStats.active,
            projectStats.complete,
          ]}
        />
        <MetricCard
          accent="rose"
          label="Outstanding"
          value={formatCurrency(outstandingAmount)}
          hint={`${outstandingCount} invoice${outstandingCount === 1 ? "" : "s"} pending`}
          spark={inboxSpark}
        />
      </section>

      {/* Row 2: Revenue area chart */}
      <section className="mb-8">
        <Card>
          <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)]">
            <div className="flex items-center gap-2">
              <TrendingUp size={16} className="text-[var(--lime)]" />
              <h2 className="font-semibold text-[var(--text)]">
                Revenue over time
              </h2>
              <Badge tone="lime">12 months</Badge>
            </div>
            <span className="text-xs text-[var(--text-3)] font-mono tabular-nums">
              Total {formatCurrency(revenueSpark.reduce((a, b) => a + b, 0))}
            </span>
          </div>
          <div className="px-5 py-5">
            {revenueSpark.some((v) => v > 0) ? (
              <AreaChart
                data={revenueArea}
                height={240}
                color="var(--lime)"
                formatY={(v) => formatCurrency(v)}
              />
            ) : (
              <Empty title="No paid invoices yet" hint="Revenue will appear here as invoices are paid." />
            )}
          </div>
        </Card>
      </section>

      {/* Row 3: Revenue by client + lead funnel */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-8">
        <Card>
          <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)]">
            <h2 className="font-semibold text-[var(--text)]">Top clients by revenue</h2>
            <Link
              href="/control/clients"
              className="inline-flex items-center gap-1 text-xs text-[var(--text-3)] hover:text-[var(--accent)]"
            >
              View all <ArrowRight size={12} />
            </Link>
          </div>
          {revenueByClient.length > 0 ? (
            <HorizontalBarList
              data={revenueByClient.map((r) => ({
                label: r.client_name,
                value: r.total,
              }))}
              color="var(--accent)"
              formatValue={(v) => formatCurrency(v)}
            />
          ) : (
            <Empty title="No client revenue yet" />
          )}
        </Card>

        <Card>
          <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)]">
            <h2 className="font-semibold text-[var(--text)]">Lead funnel</h2>
            <Link
              href="/control/inbox"
              className="inline-flex items-center gap-1 text-xs text-[var(--text-3)] hover:text-[var(--accent)]"
            >
              Inbox <ArrowRight size={12} />
            </Link>
          </div>
          <div className="px-5 py-5">
            {leadBars.some((b) => b.value > 0) ? (
              <BarChart data={leadBars} color="var(--violet)" height={220} />
            ) : (
              <Empty title="No leads tracked yet" />
            )}
          </div>
        </Card>
      </section>

      {/* Row 4: Inbox area + Invoice donut */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-8">
        <Card>
          <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)]">
            <div className="flex items-center gap-2">
              <InboxIcon size={16} className="text-[var(--accent)]" />
              <h2 className="font-semibold text-[var(--text)]">Inbox · last 30 days</h2>
              {inboxStats.unread > 0 && (
                <Badge tone="accent">{inboxStats.unread} unread</Badge>
              )}
            </div>
            <span className="text-xs text-[var(--text-3)] font-mono tabular-nums">
              {Math.round(inboxStats.conversionRatio * 100)}% replied
            </span>
          </div>
          <div className="px-5 py-5">
            {inboxStats.total > 0 ? (
              <AreaChart data={inboxArea} height={220} color="var(--accent)" />
            ) : (
              <Empty title="No messages in the last 30 days" />
            )}
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)]">
            <div className="flex items-center gap-2">
              <FileText size={16} className="text-[var(--accent)]" />
              <h2 className="font-semibold text-[var(--text)]">Invoice status mix</h2>
            </div>
            <Link
              href="/control/invoices"
              className="inline-flex items-center gap-1 text-xs text-[var(--text-3)] hover:text-[var(--accent)]"
            >
              View all <ArrowRight size={12} />
            </Link>
          </div>
          <div className="px-5 py-6">
            {invoiceStats.total.count > 0 ? (
              <DonutChart data={invoiceDonut} size={170} centerLabel="invoices" />
            ) : (
              <Empty title="No invoices yet" />
            )}
          </div>
        </Card>
      </section>

      {/* Row 5: Recent activity + upcoming due */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
        <Card>
          <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)]">
            <h2 className="font-semibold text-[var(--text)]">Recent activity</h2>
          </div>
          {activity.length > 0 ? (
            <ul className="divide-y divide-[var(--border)]">
              {activity.map((e) => {
                const Icon = ACTIVITY_ICON[e.type];
                const color = ACTIVITY_COLOR[e.type];
                return (
                  <li
                    key={e.id}
                    className="px-5 py-3 flex items-start gap-3"
                  >
                    <span
                      className="mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-md border"
                      style={{
                        background: `color-mix(in oklab, ${color} 12%, transparent)`,
                        borderColor: `color-mix(in oklab, ${color} 30%, transparent)`,
                        color,
                      }}
                    >
                      <Icon size={14} />
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-[var(--text)] truncate">
                        {e.summary}
                      </p>
                      {e.detail && (
                        <p className="text-xs text-[var(--text-4)] truncate">
                          {e.detail}
                        </p>
                      )}
                    </div>
                    <div className="text-right shrink-0">
                      {typeof e.amount === "number" && e.amount > 0 && (
                        <p className="text-sm font-mono tabular-nums text-[var(--text)]">
                          {formatCurrency(e.amount)}
                        </p>
                      )}
                      <p className="text-xs text-[var(--text-4)]">
                        {timeAgo(e.timestamp)}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <Empty title="No recent activity" />
          )}
        </Card>

        <Card>
          <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)]">
            <h2 className="font-semibold text-[var(--text)]">
              Upcoming due (next 14 days)
            </h2>
            <Link
              href="/control/invoices"
              className="inline-flex items-center gap-1 text-xs text-[var(--text-3)] hover:text-[var(--accent)]"
            >
              View all <ArrowRight size={12} />
            </Link>
          </div>
          {upcoming.length > 0 ? (
            <ul className="divide-y divide-[var(--border)]">
              {upcoming.map((inv) => (
                <li
                  key={inv.id}
                  className="px-5 py-3 flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-mono text-[var(--text)]">
                      {inv.invoice_number}
                    </p>
                    <p className="text-xs text-[var(--text-3)] truncate">
                      {inv.client_name ?? "—"} · due {formatDate(inv.due_date)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="font-mono text-sm text-[var(--text)] tabular-nums">
                      {formatCurrency(inv.total)}
                    </span>
                    <Badge tone={inv.days_until_due <= 3 ? "rose" : "accent"}>
                      {inv.days_until_due === 0
                        ? "today"
                        : `${inv.days_until_due}d`}
                    </Badge>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <Empty
              title="Nothing due in the next 14 days"
              hint="Send some invoices and they'll appear here."
            />
          )}
        </Card>
      </section>
    </>
  );
}
