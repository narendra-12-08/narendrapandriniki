import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card, PageHeader } from "@/components/admin/ui";
import MetricCard from "@/components/admin/charts/MetricCard";
import HorizontalBarList from "@/components/admin/charts/HorizontalBarList";
import DonutChart from "@/components/admin/charts/DonutChart";

export const metadata: Metadata = { title: "Visitors" };

type PageView = {
  path: string;
  referrer: string | null;
  country: string | null;
  ip_hash: string | null;
  device: string | null;
  created_at: string;
};

const PERIODS = [7, 30, 90] as const;
type Period = (typeof PERIODS)[number];

function topN<T extends string>(
  rows: { key: T | null }[],
  n: number,
  fallback: T = "Unknown" as T
): { label: string; value: number }[] {
  const counts = new Map<string, number>();
  for (const r of rows) {
    const k = (r.key ?? fallback) as string;
    if (!k) continue;
    counts.set(k, (counts.get(k) ?? 0) + 1);
  }
  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([label, value]) => ({ label, value }));
}

export default async function VisitorsPage({
  searchParams,
}: {
  searchParams: Promise<{ period?: string }>;
}) {
  const { period: rawPeriod } = await searchParams;
  const period: Period = (() => {
    const n = parseInt(rawPeriod ?? "30", 10);
    if (PERIODS.includes(n as Period)) return n as Period;
    return 30;
  })();

  const supabase = await createClient();
  const since = new Date(Date.now() - period * 24 * 60 * 60 * 1000).toISOString();

  const { data: pvRows } = await supabase
    .from("page_views")
    .select("path, referrer, country, ip_hash, device, created_at")
    .gte("created_at", since)
    .order("created_at", { ascending: false })
    .limit(20000);
  const views = (pvRows ?? []) as PageView[];

  const total = views.length;
  const uniques = new Set(views.map((v) => v.ip_hash ?? "")).size;

  const topCountries = topN(
    views.map((v) => ({ key: v.country })),
    8
  );
  const topPages = topN(
    views.map((v) => ({ key: v.path })),
    10
  );
  const topReferrers = topN(
    views
      .filter((v) => v.referrer && !v.referrer.includes("narendrapandrinki.com"))
      .map((v) => ({ key: hostnameOf(v.referrer) })),
    8
  );
  const deviceCounts = topN(
    views.map((v) => ({ key: v.device ?? "unknown" })),
    5
  );

  // Funnel
  const { count: chatSessions } = await supabase
    .from("chat_sessions")
    .select("id", { head: true, count: "exact" })
    .gte("created_at", since);
  const { count: chatLeads } = await supabase
    .from("chatbot_leads")
    .select("id", { head: true, count: "exact" })
    .gte("created_at", since);
  const { count: bookings } = await supabase
    .from("bookings")
    .select("id", { head: true, count: "exact" })
    .gte("created_at", since);

  const visitorsForFunnel = uniques || 1;
  const sessions = chatSessions ?? 0;
  const leads = chatLeads ?? 0;
  const books = bookings ?? 0;

  const pct = (n: number, d: number) => (d > 0 ? ((n / d) * 100).toFixed(1) : "0.0");

  return (
    <div>
      <PageHeader
        title="Visitors"
        subtitle={`Last ${period} days · ${total.toLocaleString()} page views`}
        actions={
          <div className="flex gap-1">
            {PERIODS.map((p) => (
              <Link
                key={p}
                href={`/control/visitors?period=${p}`}
                className={`px-3 py-1.5 rounded-md text-xs font-medium border ${
                  p === period
                    ? "bg-[var(--accent)]/15 text-[var(--accent)] border-[var(--accent)]/30"
                    : "bg-[var(--surface-2)] text-[var(--text-3)] border-[var(--border)]"
                }`}
              >
                {p}d
              </Link>
            ))}
          </div>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <MetricCard label="Page views" value={total.toLocaleString()} accent="cyan" />
        <MetricCard label="Unique visitors" value={uniques.toLocaleString()} accent="violet" />
        <MetricCard label="Chat sessions" value={(sessions).toLocaleString()} accent="lime" />
        <MetricCard label="Bookings" value={books.toLocaleString()} accent="rose" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <div className="px-5 py-4 border-b border-[var(--border)]">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--text-4)]">
              Funnel
            </p>
          </div>
          <div className="p-5 space-y-4">
            <FunnelStep label="Visitors (unique)" value={uniques} base={visitorsForFunnel} />
            <FunnelStep
              label="Chat sessions"
              value={sessions}
              base={visitorsForFunnel}
              note={`${pct(sessions, visitorsForFunnel)}% of visitors`}
            />
            <FunnelStep
              label="Captured leads"
              value={leads}
              base={visitorsForFunnel}
              note={`${pct(leads, sessions || 1)}% of chats`}
            />
            <FunnelStep
              label="Bookings"
              value={books}
              base={visitorsForFunnel}
              note={`${pct(books, leads || 1)}% of leads`}
            />
          </div>
        </Card>

        <Card>
          <div className="px-5 py-4 border-b border-[var(--border)]">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--text-4)]">
              Devices
            </p>
          </div>
          <div className="p-5">
            <DonutChart
              data={deviceCounts.map((d) => ({ label: d.label, value: d.value }))}
              centerLabel="views"
            />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <div className="px-5 py-4 border-b border-[var(--border)]">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--text-4)]">
              Top countries
            </p>
          </div>
          <HorizontalBarList data={topCountries} color="var(--accent)" />
        </Card>
        <Card>
          <div className="px-5 py-4 border-b border-[var(--border)]">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--text-4)]">
              Top pages
            </p>
          </div>
          <HorizontalBarList data={topPages} color="var(--violet)" />
        </Card>
        <Card>
          <div className="px-5 py-4 border-b border-[var(--border)]">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--text-4)]">
              Top referrers
            </p>
          </div>
          <HorizontalBarList data={topReferrers} color="var(--lime)" />
        </Card>
      </div>
    </div>
  );
}

function FunnelStep({
  label,
  value,
  base,
  note,
}: {
  label: string;
  value: number;
  base: number;
  note?: string;
}) {
  const pct = base > 0 ? Math.min(100, (value / base) * 100) : 0;
  return (
    <div>
      <div className="flex items-center justify-between text-sm">
        <span className="text-[var(--text-2)]">{label}</span>
        <span className="font-mono text-[var(--text)] tabular-nums">
          {value.toLocaleString()}
        </span>
      </div>
      <div className="mt-1.5 h-2 rounded-full bg-[var(--surface-2)] overflow-hidden">
        <div
          className="h-full rounded-full bg-[var(--accent)]"
          style={{ width: `${Math.max(2, pct)}%`, opacity: 0.85 }}
        />
      </div>
      {note && <p className="mt-1 text-[11px] text-[var(--text-4)]">{note}</p>}
    </div>
  );
}

function hostnameOf(url: string | null): string | null {
  if (!url) return null;
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
}
