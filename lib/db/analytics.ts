import { createClient } from "@/lib/supabase/server";

// =====================================================================
// Types
// =====================================================================

export interface MonthlyRevenuePoint {
  /** ISO month "YYYY-MM" */
  month: string;
  /** Short label e.g. "Jan" */
  label: string;
  /** Sum of paid invoice totals in that month */
  revenue: number;
}

export interface RevenueByClientRow {
  client_id: string;
  client_name: string;
  total: number;
  invoice_count: number;
}

export interface InvoiceStats {
  total: { count: number; amount: number };
  paid: { count: number; amount: number };
  overdue: { count: number; amount: number };
  draft: { count: number; amount: number };
  sent: { count: number; amount: number };
  cancelled: { count: number; amount: number };
}

export interface ProjectStats {
  active: number;
  complete: number;
  paused: number;
  discovery: number;
  cancelled: number;
  total: number;
}

export interface ClientStats {
  active: number;
  prospect: number;
  inactive: number;
  total: number;
}

export interface InboxStatsPoint {
  date: string;
  count: number;
}

export interface InboxStats {
  perDay: InboxStatsPoint[];
  total: number;
  unread: number;
  replied: number;
  archived: number;
  read: number;
  /** replied / total */
  conversionRatio: number;
}

export interface LeadFunnelRow {
  status: "new" | "contacted" | "qualified" | "proposal" | "won" | "lost";
  count: number;
}

export interface ServiceCount {
  service: string;
  count: number;
}

export interface ServiceRevenue {
  service: string;
  revenue: number;
  project_count: number;
}

export interface ActivityEvent {
  id: string;
  type: "invoice" | "payment" | "project" | "inbox" | "lead";
  summary: string;
  detail?: string;
  amount?: number | null;
  timestamp: string;
}

export interface UpcomingInvoice {
  id: string;
  invoice_number: string;
  total: number;
  due_date: string;
  status: string;
  client_name: string | null;
  days_until_due: number;
}

export interface AgingBuckets {
  current: { count: number; amount: number }; // 0-15d overdue
  thirty: { count: number; amount: number }; // 15-30
  sixty: { count: number; amount: number }; // 30-60
  older: { count: number; amount: number }; // 60+
}

// =====================================================================
// Helpers
// =====================================================================

function monthKey(d: Date): string {
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
}

function monthLabel(d: Date): string {
  return d.toLocaleDateString("en-GB", { month: "short" });
}

function dayKey(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function safeDate(s: string | null | undefined): Date | null {
  if (!s) return null;
  const d = new Date(s);
  return isNaN(d.getTime()) ? null : d;
}

// =====================================================================
// Revenue
// =====================================================================

export async function getRevenueOverTime(
  months = 12
): Promise<MonthlyRevenuePoint[]> {
  const supabase = await createClient();
  const since = new Date();
  since.setUTCDate(1);
  since.setUTCHours(0, 0, 0, 0);
  since.setUTCMonth(since.getUTCMonth() - (months - 1));

  const { data, error } = await supabase
    .from("invoices")
    .select("total, paid_at, status")
    .eq("status", "paid")
    .gte("paid_at", since.toISOString());

  const buckets = new Map<string, number>();
  const points: MonthlyRevenuePoint[] = [];
  for (let i = 0; i < months; i++) {
    const d = new Date(since);
    d.setUTCMonth(since.getUTCMonth() + i);
    const key = monthKey(d);
    buckets.set(key, 0);
    points.push({ month: key, label: monthLabel(d), revenue: 0 });
  }

  if (error || !data) return points;

  for (const row of data as { total: number | null; paid_at: string | null }[]) {
    const d = safeDate(row.paid_at);
    if (!d) continue;
    const key = monthKey(d);
    if (!buckets.has(key)) continue;
    buckets.set(key, (buckets.get(key) ?? 0) + Number(row.total ?? 0));
  }

  return points.map((p) => ({ ...p, revenue: buckets.get(p.month) ?? 0 }));
}

export async function getRevenueByClient(
  limit = 10
): Promise<RevenueByClientRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("invoices")
    .select("total, status, client_id, clients(name, company)")
    .eq("status", "paid");

  if (error || !data) return [];

  const map = new Map<string, RevenueByClientRow>();
  for (const row of data as unknown as {
    total: number | null;
    client_id: string | null;
    clients:
      | { name: string | null; company: string | null }
      | { name: string | null; company: string | null }[]
      | null;
  }[]) {
    if (!row.client_id) continue;
    const existing = map.get(row.client_id);
    const clientRef = Array.isArray(row.clients)
      ? row.clients[0] ?? null
      : row.clients;
    const name =
      clientRef?.company || clientRef?.name || "Unknown client";
    const amount = Number(row.total ?? 0);
    if (existing) {
      existing.total += amount;
      existing.invoice_count += 1;
    } else {
      map.set(row.client_id, {
        client_id: row.client_id,
        client_name: name,
        total: amount,
        invoice_count: 1,
      });
    }
  }

  return Array.from(map.values())
    .sort((a, b) => b.total - a.total)
    .slice(0, limit);
}

export async function getRevenueYTD(year?: number): Promise<number> {
  const supabase = await createClient();
  const y = year ?? new Date().getUTCFullYear();
  const start = new Date(Date.UTC(y, 0, 1)).toISOString();
  const end = new Date(Date.UTC(y + 1, 0, 1)).toISOString();

  const { data, error } = await supabase
    .from("invoices")
    .select("total")
    .eq("status", "paid")
    .gte("paid_at", start)
    .lt("paid_at", end);

  if (error || !data) return 0;
  return (data as { total: number | null }[]).reduce(
    (s, r) => s + Number(r.total ?? 0),
    0
  );
}

// =====================================================================
// Stats
// =====================================================================

export async function getInvoiceStats(): Promise<InvoiceStats> {
  const supabase = await createClient();
  const empty = { count: 0, amount: 0 };
  const stats: InvoiceStats = {
    total: { ...empty },
    paid: { ...empty },
    overdue: { ...empty },
    draft: { ...empty },
    sent: { ...empty },
    cancelled: { ...empty },
  };

  const { data, error } = await supabase
    .from("invoices")
    .select("total, status");

  if (error || !data) return stats;

  for (const row of data as { total: number | null; status: string }[]) {
    const amount = Number(row.total ?? 0);
    stats.total.count += 1;
    stats.total.amount += amount;
    const key = row.status as keyof InvoiceStats;
    if (key in stats && key !== "total") {
      stats[key].count += 1;
      stats[key].amount += amount;
    }
  }
  return stats;
}

export async function getProjectStats(): Promise<ProjectStats> {
  const supabase = await createClient();
  const stats: ProjectStats = {
    active: 0,
    complete: 0,
    paused: 0,
    discovery: 0,
    cancelled: 0,
    total: 0,
  };
  const { data, error } = await supabase.from("projects").select("status");
  if (error || !data) return stats;
  for (const row of data as { status: string }[]) {
    stats.total += 1;
    if (row.status in stats) {
      (stats as unknown as Record<string, number>)[row.status] += 1;
    }
  }
  return stats;
}

export async function getClientStats(): Promise<ClientStats> {
  const supabase = await createClient();
  const stats: ClientStats = { active: 0, prospect: 0, inactive: 0, total: 0 };
  const { data, error } = await supabase.from("clients").select("status");
  if (error || !data) return stats;
  for (const row of data as { status: string }[]) {
    stats.total += 1;
    if (row.status in stats) {
      (stats as unknown as Record<string, number>)[row.status] += 1;
    }
  }
  return stats;
}

// =====================================================================
// Inbox
// =====================================================================

export async function getInboxStats(days = 30): Promise<InboxStats> {
  const supabase = await createClient();
  const since = new Date();
  since.setUTCHours(0, 0, 0, 0);
  since.setUTCDate(since.getUTCDate() - (days - 1));

  const empty: InboxStats = {
    perDay: [],
    total: 0,
    unread: 0,
    replied: 0,
    archived: 0,
    read: 0,
    conversionRatio: 0,
  };

  const { data, error } = await supabase
    .from("inbox_messages")
    .select("status, created_at")
    .gte("created_at", since.toISOString());

  // Build day buckets
  const buckets = new Map<string, number>();
  const perDay: InboxStatsPoint[] = [];
  for (let i = 0; i < days; i++) {
    const d = new Date(since);
    d.setUTCDate(since.getUTCDate() + i);
    const key = dayKey(d);
    buckets.set(key, 0);
    perDay.push({ date: key, count: 0 });
  }

  if (error || !data) return { ...empty, perDay };

  const stats: InboxStats = { ...empty, perDay };
  for (const row of data as { status: string; created_at: string }[]) {
    const d = safeDate(row.created_at);
    if (d) {
      const key = dayKey(d);
      if (buckets.has(key)) buckets.set(key, (buckets.get(key) ?? 0) + 1);
    }
    stats.total += 1;
    switch (row.status) {
      case "unread":
        stats.unread += 1;
        break;
      case "read":
        stats.read += 1;
        break;
      case "replied":
        stats.replied += 1;
        break;
      case "archived":
        stats.archived += 1;
        break;
    }
  }

  stats.perDay = perDay.map((p) => ({
    date: p.date,
    count: buckets.get(p.date) ?? 0,
  }));
  stats.conversionRatio = stats.total > 0 ? stats.replied / stats.total : 0;
  return stats;
}

// =====================================================================
// Leads
// =====================================================================

export async function getLeadFunnel(): Promise<LeadFunnelRow[]> {
  const supabase = await createClient();
  const order: LeadFunnelRow["status"][] = [
    "new",
    "contacted",
    "qualified",
    "proposal",
    "won",
    "lost",
  ];
  const counts = new Map<LeadFunnelRow["status"], number>(
    order.map((s) => [s, 0])
  );

  const { data, error } = await supabase.from("leads").select("status");
  if (error || !data) {
    return order.map((s) => ({ status: s, count: 0 }));
  }
  for (const row of data as { status: LeadFunnelRow["status"] }[]) {
    if (counts.has(row.status))
      counts.set(row.status, (counts.get(row.status) ?? 0) + 1);
  }
  return order.map((s) => ({ status: s, count: counts.get(s) ?? 0 }));
}

// =====================================================================
// Services / inquiries
// =====================================================================

export async function getTopServicesInquired(
  limit = 8
): Promise<ServiceCount[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("contact_submissions")
    .select("service_interest");

  if (error || !data) return [];

  const map = new Map<string, number>();
  for (const row of data as { service_interest: string | null }[]) {
    const key = (row.service_interest ?? "").trim();
    if (!key) continue;
    map.set(key, (map.get(key) ?? 0) + 1);
  }
  return Array.from(map.entries())
    .map(([service, count]) => ({ service, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

export async function getEngagementsByIndustry(): Promise<ServiceCount[]> {
  // clients table has no industry column; case_studies provides industry
  // grouping but isn't a project tally. Return [] gracefully.
  return [];
}

export async function getRevenueByService(): Promise<ServiceRevenue[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("service_type, agreed_amount");

  if (error || !data) return [];

  const map = new Map<string, ServiceRevenue>();
  for (const row of data as {
    service_type: string | null;
    agreed_amount: number | null;
  }[]) {
    const key = row.service_type ?? "Unspecified";
    const amount = Number(row.agreed_amount ?? 0);
    const existing = map.get(key);
    if (existing) {
      existing.revenue += amount;
      existing.project_count += 1;
    } else {
      map.set(key, {
        service: key,
        revenue: amount,
        project_count: 1,
      });
    }
  }
  return Array.from(map.values()).sort((a, b) => b.revenue - a.revenue);
}

export async function getMrrEstimate(): Promise<number> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("agreed_amount, service_type, start_date, due_date, status")
    .eq("status", "active");

  if (error || !data) return 0;

  let mrr = 0;
  for (const row of data as {
    agreed_amount: number | null;
    service_type: string | null;
    start_date: string | null;
    due_date: string | null;
  }[]) {
    const amount = Number(row.agreed_amount ?? 0);
    if (amount <= 0) continue;
    const svc = (row.service_type ?? "").toLowerCase();
    const isRecurring = /retain|fraction|monthly|ongoing/.test(svc);

    if (isRecurring) {
      mrr += amount;
      continue;
    }

    // Spread fixed-fee project across its duration in months
    const start = safeDate(row.start_date);
    const end = safeDate(row.due_date);
    if (start && end && end > start) {
      const months = Math.max(
        1,
        (end.getUTCFullYear() - start.getUTCFullYear()) * 12 +
          (end.getUTCMonth() - start.getUTCMonth()) +
          1
      );
      mrr += amount / months;
    }
  }
  return Math.round(mrr);
}

// =====================================================================
// Activity feed
// =====================================================================

export async function getRecentActivity(
  limit = 20
): Promise<ActivityEvent[]> {
  const supabase = await createClient();
  const events: ActivityEvent[] = [];

  const [invRes, payRes, projRes, inboxRes] = await Promise.all([
    supabase
      .from("invoices")
      .select("id, invoice_number, total, status, created_at, sent_at, paid_at")
      .order("created_at", { ascending: false })
      .limit(limit),
    supabase
      .from("payments")
      .select("id, amount, paid_at, reference, invoice_id")
      .order("paid_at", { ascending: false })
      .limit(limit),
    supabase
      .from("projects")
      .select("id, name, status, created_at")
      .order("created_at", { ascending: false })
      .limit(limit),
    supabase
      .from("inbox_messages")
      .select("id, subject, sender_email, sender_name, created_at")
      .order("created_at", { ascending: false })
      .limit(limit),
  ]);

  for (const row of (invRes.data ?? []) as {
    id: string;
    invoice_number: string;
    total: number | null;
    status: string;
    created_at: string;
    sent_at: string | null;
    paid_at: string | null;
  }[]) {
    const ts = row.paid_at ?? row.sent_at ?? row.created_at;
    const verb =
      row.status === "paid"
        ? "paid"
        : row.status === "sent"
        ? "sent"
        : row.status === "overdue"
        ? "is overdue"
        : "created";
    events.push({
      id: `inv-${row.id}`,
      type: "invoice",
      summary: `Invoice ${row.invoice_number} ${verb}`,
      amount: Number(row.total ?? 0),
      timestamp: ts,
    });
  }

  for (const row of (payRes.data ?? []) as {
    id: string;
    amount: number | null;
    paid_at: string;
    reference: string | null;
  }[]) {
    events.push({
      id: `pay-${row.id}`,
      type: "payment",
      summary: `Payment received${row.reference ? ` · ${row.reference}` : ""}`,
      amount: Number(row.amount ?? 0),
      timestamp: row.paid_at,
    });
  }

  for (const row of (projRes.data ?? []) as {
    id: string;
    name: string;
    status: string;
    created_at: string;
  }[]) {
    events.push({
      id: `proj-${row.id}`,
      type: "project",
      summary: `Project "${row.name}" — ${row.status}`,
      timestamp: row.created_at,
    });
  }

  for (const row of (inboxRes.data ?? []) as {
    id: string;
    subject: string;
    sender_email: string;
    sender_name: string | null;
    created_at: string;
  }[]) {
    events.push({
      id: `msg-${row.id}`,
      type: "inbox",
      summary: `New message: ${row.subject}`,
      detail: row.sender_name
        ? `${row.sender_name} <${row.sender_email}>`
        : row.sender_email,
      timestamp: row.created_at,
    });
  }

  return events
    .filter((e) => !!e.timestamp)
    .sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )
    .slice(0, limit);
}

// =====================================================================
// Upcoming + aging
// =====================================================================

export async function getUpcomingDueInvoices(): Promise<UpcomingInvoice[]> {
  const supabase = await createClient();
  const now = new Date();
  const today = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
  );
  const horizon = new Date(today);
  horizon.setUTCDate(horizon.getUTCDate() + 14);

  const { data, error } = await supabase
    .from("invoices")
    .select(
      "id, invoice_number, total, due_date, status, clients(name, company)"
    )
    .eq("status", "sent")
    .gte("due_date", today.toISOString().slice(0, 10))
    .lte("due_date", horizon.toISOString().slice(0, 10))
    .order("due_date", { ascending: true });

  if (error || !data) return [];

  return (
    data as unknown as {
      id: string;
      invoice_number: string;
      total: number | null;
      due_date: string;
      status: string;
      clients:
        | { name: string | null; company: string | null }
        | { name: string | null; company: string | null }[]
        | null;
    }[]
  ).map((row) => {
    const due = new Date(row.due_date);
    const days = Math.max(
      0,
      Math.round((due.getTime() - today.getTime()) / 86400000)
    );
    const clientRef = Array.isArray(row.clients)
      ? row.clients[0] ?? null
      : row.clients;
    return {
      id: row.id,
      invoice_number: row.invoice_number,
      total: Number(row.total ?? 0),
      due_date: row.due_date,
      status: row.status,
      client_name: clientRef?.company || clientRef?.name || null,
      days_until_due: days,
    };
  });
}

export async function getReceivablesAging(): Promise<AgingBuckets> {
  const supabase = await createClient();
  const buckets: AgingBuckets = {
    current: { count: 0, amount: 0 },
    thirty: { count: 0, amount: 0 },
    sixty: { count: 0, amount: 0 },
    older: { count: 0, amount: 0 },
  };

  const { data, error } = await supabase
    .from("invoices")
    .select("total, due_date, status")
    .in("status", ["sent", "overdue"]);

  if (error || !data) return buckets;

  const now = Date.now();
  for (const row of data as {
    total: number | null;
    due_date: string;
    status: string;
  }[]) {
    const due = safeDate(row.due_date);
    if (!due) continue;
    const ageDays = Math.max(
      0,
      Math.floor((now - due.getTime()) / 86400000)
    );
    const amount = Number(row.total ?? 0);
    let bucket: keyof AgingBuckets;
    if (ageDays <= 15) bucket = "current";
    else if (ageDays <= 30) bucket = "thirty";
    else if (ageDays <= 60) bucket = "sixty";
    else bucket = "older";
    buckets[bucket].count += 1;
    buckets[bucket].amount += amount;
  }
  return buckets;
}

// =====================================================================
// Project duration + tenure (for analytics page)
// =====================================================================

export async function getAverageProjectDurationDays(): Promise<{
  avgDays: number;
  sampleSize: number;
}> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("start_date, due_date, status")
    .in("status", ["active", "complete"]);

  if (error || !data) return { avgDays: 0, sampleSize: 0 };

  const days: number[] = [];
  for (const row of data as {
    start_date: string | null;
    due_date: string | null;
  }[]) {
    const s = safeDate(row.start_date);
    const e = safeDate(row.due_date);
    if (s && e && e > s) {
      days.push((e.getTime() - s.getTime()) / 86400000);
    }
  }
  if (days.length === 0) return { avgDays: 0, sampleSize: 0 };
  const avg = days.reduce((a, b) => a + b, 0) / days.length;
  return { avgDays: Math.round(avg), sampleSize: days.length };
}

export interface TenureBucketRow {
  label: string;
  count: number;
}

export async function getClientTenureDistribution(): Promise<TenureBucketRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("clients")
    .select("created_at, status")
    .eq("status", "active");

  if (error || !data) {
    return [
      { label: "<3m", count: 0 },
      { label: "3–6m", count: 0 },
      { label: "6–12m", count: 0 },
      { label: "1–2y", count: 0 },
      { label: "2y+", count: 0 },
    ];
  }

  const buckets = [
    { label: "<3m", max: 90, count: 0 },
    { label: "3–6m", max: 180, count: 0 },
    { label: "6–12m", max: 365, count: 0 },
    { label: "1–2y", max: 730, count: 0 },
    { label: "2y+", max: Infinity, count: 0 },
  ];
  const now = Date.now();
  for (const row of data as { created_at: string }[]) {
    const d = safeDate(row.created_at);
    if (!d) continue;
    const days = (now - d.getTime()) / 86400000;
    for (const b of buckets) {
      if (days <= b.max) {
        b.count += 1;
        break;
      }
    }
  }
  return buckets.map((b) => ({ label: b.label, count: b.count }));
}
