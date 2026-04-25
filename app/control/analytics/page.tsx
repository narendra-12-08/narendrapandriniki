import type { Metadata } from "next";
import Link from "next/link";
import {
  Activity,
  CalendarRange,
  CircleDollarSign,
  FolderKanban,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import { Badge, Card, Empty, PageHeader } from "@/components/admin/ui";
import AreaChart from "@/components/admin/charts/AreaChart";
import BarChart from "@/components/admin/charts/BarChart";
import DonutChart from "@/components/admin/charts/DonutChart";
import HorizontalBarList from "@/components/admin/charts/HorizontalBarList";
import MetricCard from "@/components/admin/charts/MetricCard";
import {
  getAverageProjectDurationDays,
  getClientStats,
  getClientTenureDistribution,
  getInvoiceStats,
  getLeadFunnel,
  getMrrEstimate,
  getProjectStats,
  getReceivablesAging,
  getRevenueByClient,
  getRevenueByService,
  getRevenueOverTime,
  getRevenueYTD,
  getTopServicesInquired,
} from "@/lib/db/analytics";
import { formatCurrency } from "@/lib/utils";

export const metadata: Metadata = { title: "Analytics" };

export default async function AnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<{ year?: string }>;
}) {
  const { year: rawYear } = await searchParams;
  const currentYear = new Date().getUTCFullYear();
  const year = (() => {
    const n = Number(rawYear);
    if (!Number.isInteger(n)) return currentYear;
    if (n < 2020 || n > currentYear + 1) return currentYear;
    return n;
  })();

  const yearOptions = [currentYear + 1, currentYear, currentYear - 1, currentYear - 2];

  const [
    revenueSeries,
    revenueYTD,
    revenueByClient,
    revenueByService,
    mrr,
    invoiceStats,
    projectStats,
    clientStats,
    leadFunnel,
    topServices,
    aging,
    avgProject,
    tenure,
  ] = await Promise.all([
    getRevenueOverTime(12),
    getRevenueYTD(year),
    getRevenueByClient(10),
    getRevenueByService(),
    getMrrEstimate(),
    getInvoiceStats(),
    getProjectStats(),
    getClientStats(),
    getLeadFunnel(),
    getTopServicesInquired(8),
    getReceivablesAging(),
    getAverageProjectDurationDays(),
    getClientTenureDistribution(),
  ]);

  const totalLeads = leadFunnel.reduce((s, r) => s + r.count, 0);
  const won = leadFunnel.find((r) => r.status === "won")?.count ?? 0;
  const lost = leadFunnel.find((r) => r.status === "lost")?.count ?? 0;
  const closed = won + lost;
  const winRate = closed > 0 ? (won / closed) * 100 : 0;
  const qualifiedRate =
    totalLeads > 0
      ? ((leadFunnel.find((r) => r.status === "qualified")?.count ?? 0) /
          totalLeads) *
        100
      : 0;

  const revenueArea = revenueSeries.map((p) => ({ x: p.label, y: p.revenue }));
  const revenueSpark = revenueSeries.map((p) => p.revenue);

  const projectStatusDonut = [
    { label: "Active", value: projectStats.active, color: "var(--accent)" },
    { label: "Discovery", value: projectStats.discovery, color: "var(--violet)" },
    { label: "Paused", value: projectStats.paused, color: "var(--amber)" },
    { label: "Complete", value: projectStats.complete, color: "var(--lime)" },
    { label: "Cancelled", value: projectStats.cancelled, color: "var(--rose)" },
  ].filter((d) => d.value > 0);

  const clientMixDonut = [
    { label: "Active", value: clientStats.active, color: "var(--accent)" },
    { label: "Prospect", value: clientStats.prospect, color: "var(--violet)" },
    { label: "Inactive", value: clientStats.inactive, color: "var(--rose)" },
  ].filter((d) => d.value > 0);

  const agingTotal =
    aging.current.amount +
    aging.thirty.amount +
    aging.sixty.amount +
    aging.older.amount;

  return (
    <>
      <PageHeader
        title="Analytics"
        subtitle="Deep dive on revenue, pipeline, operations, and clients."
        actions={
          <div className="flex items-center gap-1.5 bg-[var(--surface-2)] border border-[var(--border)] rounded-md p-1">
            <CalendarRange size={14} className="text-[var(--text-4)] ml-1.5" />
            {yearOptions.map((y) => (
              <Link
                key={y}
                href={`/control/analytics?year=${y}`}
                className={
                  y === year
                    ? "px-2 py-1 rounded text-xs font-mono bg-[var(--accent)]/15 text-[var(--accent)] border border-[var(--accent)]/30"
                    : "px-2 py-1 rounded text-xs font-mono text-[var(--text-3)] hover:text-[var(--text)] border border-transparent"
                }
              >
                {y}
              </Link>
            ))}
          </div>
        }
      />

      {/* ================= REVENUE ================= */}
      <section className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <CircleDollarSign size={16} className="text-[var(--lime)]" />
          <h2 className="text-lg font-semibold text-[var(--text)]">Revenue</h2>
          <Badge tone="lime">{year}</Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-5">
          <MetricCard
            accent="lime"
            label={`Revenue ${year}`}
            value={formatCurrency(revenueYTD)}
            spark={revenueSpark}
          />
          <MetricCard
            accent="cyan"
            label="MRR estimate"
            value={formatCurrency(mrr)}
            hint="Active retainer + amortised fixed-fee"
          />
          <MetricCard
            accent="violet"
            label="Paid invoices"
            value={invoiceStats.paid.count}
            hint={formatCurrency(invoiceStats.paid.amount)}
          />
          <MetricCard
            accent="rose"
            label="Outstanding"
            value={formatCurrency(
              invoiceStats.sent.amount + invoiceStats.overdue.amount
            )}
            hint={`${invoiceStats.sent.count + invoiceStats.overdue.count} invoices`}
          />
        </div>

        <Card className="mb-5">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)]">
            <h3 className="font-semibold text-[var(--text)]">
              Monthly revenue (last 12 months)
            </h3>
            <span className="text-xs text-[var(--text-3)] font-mono tabular-nums">
              Total {formatCurrency(revenueSpark.reduce((a, b) => a + b, 0))}
            </span>
          </div>
          <div className="px-5 py-5">
            {revenueSpark.some((v) => v > 0) ? (
              <AreaChart
                data={revenueArea}
                height={260}
                color="var(--lime)"
                formatY={(v) => formatCurrency(v)}
              />
            ) : (
              <Empty title="No paid invoices in the last 12 months" />
            )}
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <Card>
            <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)]">
              <h3 className="font-semibold text-[var(--text)]">Revenue by service</h3>
              <span className="text-xs text-[var(--text-3)]">Project agreed amounts</span>
            </div>
            {revenueByService.length > 0 ? (
              <HorizontalBarList
                data={revenueByService.map((r) => ({
                  label: `${r.service} (${r.project_count})`,
                  value: r.revenue,
                }))}
                color="var(--violet)"
                formatValue={(v) => formatCurrency(v)}
              />
            ) : (
              <Empty title="No projects with service type yet" />
            )}
          </Card>

          <Card>
            <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)]">
              <h3 className="font-semibold text-[var(--text)]">Top clients by revenue</h3>
              <span className="text-xs text-[var(--text-3)]">All-time, paid only</span>
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
        </div>
      </section>

      {/* ================= PIPELINE ================= */}
      <section className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <Target size={16} className="text-[var(--violet)]" />
          <h2 className="text-lg font-semibold text-[var(--text)]">Pipeline</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
          <MetricCard
            accent="violet"
            label="Total leads"
            value={totalLeads}
            hint={`${won} won · ${lost} lost`}
          />
          <MetricCard
            accent="lime"
            label="Win rate"
            value={`${winRate.toFixed(0)}%`}
            hint="Won / (won + lost)"
          />
          <MetricCard
            accent="cyan"
            label="Qualified rate"
            value={`${qualifiedRate.toFixed(0)}%`}
            hint="Qualified / total leads"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <Card>
            <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)]">
              <h3 className="font-semibold text-[var(--text)]">Lead funnel</h3>
            </div>
            <div className="px-5 py-5">
              {totalLeads > 0 ? (
                <BarChart
                  data={leadFunnel.map((r) => ({
                    label: r.status,
                    value: r.count,
                  }))}
                  color="var(--violet)"
                  height={240}
                />
              ) : (
                <Empty title="No leads tracked yet" />
              )}
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)]">
              <h3 className="font-semibold text-[var(--text)]">Top inquiry sources</h3>
              <span className="text-xs text-[var(--text-3)]">Contact form service interest</span>
            </div>
            {topServices.length > 0 ? (
              <HorizontalBarList
                data={topServices.map((s) => ({
                  label: s.service,
                  value: s.count,
                }))}
                color="var(--accent)"
              />
            ) : (
              <Empty title="No tagged inquiries yet" />
            )}
          </Card>
        </div>
      </section>

      {/* ================= OPERATIONS ================= */}
      <section className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <FolderKanban size={16} className="text-[var(--accent)]" />
          <h2 className="text-lg font-semibold text-[var(--text)]">Operations</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
          <MetricCard
            accent="cyan"
            label="Active projects"
            value={projectStats.active}
            hint={`${projectStats.complete} complete · ${projectStats.paused} paused`}
          />
          <MetricCard
            accent="violet"
            label="Avg project duration"
            value={
              avgProject.sampleSize > 0
                ? `${avgProject.avgDays}d`
                : "—"
            }
            hint={`${avgProject.sampleSize} sample${avgProject.sampleSize === 1 ? "" : "s"}`}
          />
          <MetricCard
            accent="rose"
            label="Receivables outstanding"
            value={formatCurrency(agingTotal)}
            hint="Sent + overdue invoices"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <Card>
            <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)]">
              <h3 className="font-semibold text-[var(--text)]">Project status mix</h3>
            </div>
            <div className="px-5 py-6">
              {projectStats.total > 0 ? (
                <DonutChart data={projectStatusDonut} size={170} centerLabel="projects" />
              ) : (
                <Empty title="No projects yet" />
              )}
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)]">
              <div className="flex items-center gap-2">
                <Activity size={14} className="text-[var(--rose)]" />
                <h3 className="font-semibold text-[var(--text)]">Receivables aging</h3>
              </div>
            </div>
            <div className="px-5 py-5">
              {agingTotal > 0 ? (
                <BarChart
                  data={[
                    { label: "0–15d", value: aging.current.amount },
                    { label: "15–30d", value: aging.thirty.amount },
                    { label: "30–60d", value: aging.sixty.amount },
                    { label: "60d+", value: aging.older.amount },
                  ]}
                  color="var(--rose)"
                  height={220}
                  formatValue={(v) => formatCurrency(v)}
                />
              ) : (
                <Empty title="Nothing outstanding — nice." />
              )}
              <div className="mt-3 grid grid-cols-4 gap-2 text-center">
                {[
                  { label: "0–15d", b: aging.current },
                  { label: "15–30d", b: aging.thirty },
                  { label: "30–60d", b: aging.sixty },
                  { label: "60d+", b: aging.older },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-md bg-[var(--surface-2)] border border-[var(--border)] py-2"
                  >
                    <p className="text-[10px] uppercase tracking-wider text-[var(--text-4)]">
                      {item.label}
                    </p>
                    <p className="text-sm font-mono tabular-nums text-[var(--text)]">
                      {item.b.count}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* ================= CLIENTS ================= */}
      <section className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Users size={16} className="text-[var(--accent)]" />
          <h2 className="text-lg font-semibold text-[var(--text)]">Clients</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
          <MetricCard
            accent="cyan"
            label="Active clients"
            value={clientStats.active}
          />
          <MetricCard
            accent="violet"
            label="Prospects"
            value={clientStats.prospect}
          />
          <MetricCard
            accent="rose"
            label="Inactive"
            value={clientStats.inactive}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <Card>
            <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)]">
              <h3 className="font-semibold text-[var(--text)]">Active vs prospect mix</h3>
            </div>
            <div className="px-5 py-6">
              {clientStats.total > 0 ? (
                <DonutChart data={clientMixDonut} size={170} centerLabel="clients" />
              ) : (
                <Empty title="No clients yet" />
              )}
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)]">
              <div className="flex items-center gap-2">
                <TrendingUp size={14} className="text-[var(--accent)]" />
                <h3 className="font-semibold text-[var(--text)]">Active client tenure</h3>
              </div>
            </div>
            <div className="px-5 py-5">
              {tenure.some((b) => b.count > 0) ? (
                <BarChart
                  data={tenure.map((b) => ({ label: b.label, value: b.count }))}
                  color="var(--accent)"
                  height={220}
                />
              ) : (
                <Empty title="No active clients yet" />
              )}
            </div>
          </Card>
        </div>
      </section>
    </>
  );
}
