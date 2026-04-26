import type { Metadata } from "next";
import Link from "next/link";
import { Calendar } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import {
  Badge,
  Card,
  Empty,
  Field,
  GhostButton,
  Input,
  PageHeader,
  PrimaryButton,
  DangerButton,
  StatCard,
} from "@/components/admin/ui";
import {
  confirmBooking,
  rescheduleBooking,
  cancelBooking,
  completeBooking,
  noShowBooking,
  deleteBooking,
} from "./actions";

export const metadata: Metadata = { title: "Bookings" };

type Booking = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  starts_at: string;
  duration_minutes: number;
  timezone: string;
  project_summary: string | null;
  meeting_link: string | null;
  status:
    | "requested"
    | "confirmed"
    | "rescheduled"
    | "cancelled"
    | "completed"
    | "no-show";
  created_at: string;
};

function statusTone(s: Booking["status"]) {
  switch (s) {
    case "confirmed":
      return "lime" as const;
    case "requested":
      return "accent" as const;
    case "rescheduled":
      return "violet" as const;
    case "completed":
      return "lime" as const;
    case "cancelled":
      return "rose" as const;
    case "no-show":
      return "rose" as const;
    default:
      return "default" as const;
  }
}

function formatWhen(iso: string, tz: string): string {
  try {
    return (
      new Intl.DateTimeFormat("en-GB", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: tz || "Asia/Kolkata",
      }).format(new Date(iso)) + ` (${tz || "Asia/Kolkata"})`
    );
  } catch {
    return new Date(iso).toUTCString();
  }
}

export default async function BookingsAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("bookings")
    .select(
      "id, name, email, phone, company, starts_at, duration_minutes, timezone, project_summary, meeting_link, status, created_at"
    )
    .order("starts_at", { ascending: true });
  if (status && status !== "all") query = query.eq("status", status);

  const { data: rows } = await query;
  const bookings = (rows ?? []) as Booking[];

  // Stats — fetch separately to avoid filter coupling
  const { data: allRows } = await supabase
    .from("bookings")
    .select("starts_at, status, created_at");
  const all = (allRows ?? []) as Pick<
    Booking,
    "starts_at" | "status" | "created_at"
  >[];

  const now = Date.now();
  const today = new Date();
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
  const todayEnd = todayStart + 24 * 60 * 60 * 1000;
  const weekEnd = todayStart + 7 * 24 * 60 * 60 * 1000;
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1).getTime();

  const upcoming = all.filter(
    (b) => new Date(b.starts_at).getTime() >= now && b.status !== "cancelled"
  ).length;
  const todayCount = all.filter((b) => {
    const t = new Date(b.starts_at).getTime();
    return t >= todayStart && t < todayEnd && b.status !== "cancelled";
  }).length;
  const weekCount = all.filter((b) => {
    const t = new Date(b.starts_at).getTime();
    return t >= todayStart && t < weekEnd && b.status !== "cancelled";
  }).length;
  const completedThisMonth = all.filter(
    (b) => b.status === "completed" && new Date(b.starts_at).getTime() >= monthStart
  ).length;

  const statusOptions: { value: string; label: string }[] = [
    { value: "all", label: "All" },
    { value: "requested", label: "Requested" },
    { value: "confirmed", label: "Confirmed" },
    { value: "rescheduled", label: "Rescheduled" },
    { value: "completed", label: "Completed" },
    { value: "cancelled", label: "Cancelled" },
    { value: "no-show", label: "No-show" },
  ];

  return (
    <div>
      <PageHeader
        title="Bookings"
        subtitle="Discovery calls and scheduled chats."
        actions={
          <Link href="/book" target="_blank">
            <GhostButton type="button">
              <Calendar size={14} />
              View public page
            </GhostButton>
          </Link>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Upcoming" value={upcoming} accent="accent" />
        <StatCard label="Today" value={todayCount} accent="violet" />
        <StatCard label="This week" value={weekCount} accent="lime" />
        <StatCard
          label="Completed (month)"
          value={completedThisMonth}
          accent="lime"
        />
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-2">
        {statusOptions.map((o) => {
          const active = (status ?? "all") === o.value;
          return (
            <Link
              key={o.value}
              href={
                o.value === "all"
                  ? "/control/bookings"
                  : `/control/bookings?status=${o.value}`
              }
              className={`px-3 py-1.5 rounded-full text-xs font-medium border ${
                active
                  ? "bg-[var(--accent)]/15 text-[var(--accent)] border-[var(--accent)]/30"
                  : "bg-[var(--surface-2)] text-[var(--text-3)] border-[var(--border)] hover:text-[var(--text)]"
              }`}
            >
              {o.label}
            </Link>
          );
        })}
      </div>

      <Card>
        {bookings.length === 0 ? (
          <Empty
            title="No bookings"
            hint="Bookings made on /book will appear here."
          />
        ) : (
          <div className="divide-y divide-[var(--border)]">
            {bookings.map((b) => (
              <div key={b.id} className="p-5 grid grid-cols-1 lg:grid-cols-12 gap-5">
                <div className="lg:col-span-4">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--text-4)]">
                    {formatWhen(b.starts_at, b.timezone)}
                  </p>
                  <p className="mt-1 text-base font-semibold text-[var(--text)]">
                    {b.name}{" "}
                    <Badge tone={statusTone(b.status)}>{b.status}</Badge>
                  </p>
                  <p className="text-sm text-[var(--text-3)]">
                    <a href={`mailto:${b.email}`} className="hover:underline">
                      {b.email}
                    </a>
                    {b.phone ? ` · ${b.phone}` : ""}
                  </p>
                  {b.company && (
                    <p className="text-sm text-[var(--text-3)]">{b.company}</p>
                  )}
                  <p className="text-xs text-[var(--text-4)] mt-1">
                    {b.duration_minutes} min · TZ {b.timezone}
                  </p>
                  {b.project_summary && (
                    <p className="mt-3 text-sm text-[var(--text-2)] whitespace-pre-wrap">
                      {b.project_summary}
                    </p>
                  )}
                  {b.meeting_link && (
                    <p className="mt-2 text-xs text-[var(--accent)] break-all">
                      <a href={b.meeting_link} target="_blank" rel="noopener">
                        {b.meeting_link}
                      </a>
                    </p>
                  )}
                </div>

                <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <form action={confirmBooking} className="space-y-2">
                    <input type="hidden" name="id" value={b.id} />
                    <Field label="Confirm — meeting link">
                      <Input
                        name="meeting_link"
                        defaultValue={b.meeting_link ?? ""}
                        placeholder="https://meet.google.com/..."
                      />
                    </Field>
                    <PrimaryButton type="submit">Confirm</PrimaryButton>
                  </form>

                  <form action={rescheduleBooking} className="space-y-2">
                    <input type="hidden" name="id" value={b.id} />
                    <Field label="Reschedule (ISO datetime)">
                      <Input
                        name="starts_at"
                        type="datetime-local"
                        defaultValue={toLocalDatetimeInput(b.starts_at)}
                      />
                    </Field>
                    <GhostButton type="submit">Reschedule</GhostButton>
                  </form>

                  <div className="flex flex-wrap gap-2 md:col-span-2">
                    <form action={completeBooking}>
                      <input type="hidden" name="id" value={b.id} />
                      <GhostButton type="submit">Mark complete</GhostButton>
                    </form>
                    <form action={noShowBooking}>
                      <input type="hidden" name="id" value={b.id} />
                      <GhostButton type="submit">No-show</GhostButton>
                    </form>
                    <form action={cancelBooking}>
                      <input type="hidden" name="id" value={b.id} />
                      <DangerButton type="submit">Cancel</DangerButton>
                    </form>
                    <form action={deleteBooking}>
                      <input type="hidden" name="id" value={b.id} />
                      <DangerButton type="submit">Delete</DangerButton>
                    </form>
                    <a
                      href={`/control/email?to=${encodeURIComponent(b.email)}&subject=${encodeURIComponent("About our 15-minute call")}`}
                      className="inline-flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-md bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text-2)] hover:text-[var(--text)]"
                    >
                      Email visitor
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

function toLocalDatetimeInput(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  // Display in IST
  const istMs = d.getTime() + 330 * 60 * 1000;
  const dt = new Date(istMs);
  return `${dt.getUTCFullYear()}-${pad(dt.getUTCMonth() + 1)}-${pad(dt.getUTCDate())}T${pad(dt.getUTCHours())}:${pad(dt.getUTCMinutes())}`;
}
