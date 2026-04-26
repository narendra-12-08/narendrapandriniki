import type { Metadata } from "next";
import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import LocalSlotTime from "@/components/public/LocalSlotTime";

export const metadata: Metadata = {
  title: "Booking received",
  robots: { index: false, follow: false },
};

export default async function BookingConfirmedPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await searchParams;

  type BookingPreview = {
    name: string;
    email: string;
    starts_at: string;
    duration_minutes: number;
    project_summary: string | null;
    status: string;
  };
  let booking: BookingPreview | null = null;

  if (id) {
    const supabase = createAdminClient();
    const { data } = await supabase
      .from("bookings")
      .select("name, email, starts_at, duration_minutes, project_summary, status")
      .eq("id", id)
      .maybeSingle();
    booking = (data as unknown as BookingPreview) ?? null;
  }

  return (
    <div className="bg-grid">
      <section className="section pb-32">
        <div className="container-page max-w-2xl">
          <span className="eyebrow">Booking received</span>
          <h1 className="mt-6 text-4xl md:text-6xl font-semibold tracking-tight leading-[1.05] text-[var(--text)]">
            Got it. <span className="gradient-text">Talk soon.</span>
          </h1>
          <p className="mt-6 text-lg text-[var(--text-2)]">
            Your request is in. I confirm slots manually within a few hours
            and reply with a meeting link. Check your inbox for a confirmation
            email.
          </p>

          {booking && (
            <div className="mt-8 surface-card p-6 space-y-3">
              <Row label="Name" value={booking.name} />
              <Row label="Email" value={booking.email} />
              <Row
                label="When"
                value={<LocalSlotTime iso={booking.starts_at} />}
              />
              <Row
                label="Duration"
                value={`${booking.duration_minutes} minutes`}
              />
              <Row label="Status" value={booking.status} />
              {booking.project_summary && (
                <div>
                  <p className="text-xs uppercase tracking-widest text-[var(--text-4)]">
                    Project
                  </p>
                  <p className="mt-1 text-sm text-[var(--text-2)] whitespace-pre-wrap">
                    {booking.project_summary}
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="mt-8 flex gap-3">
            <Link href="/" className="btn-ghost">
              Back to home
            </Link>
            <Link href="/work" className="btn-primary">
              See selected work
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-4 text-sm">
      <span className="text-[var(--text-4)] uppercase tracking-widest text-xs">
        {label}
      </span>
      <span className="text-[var(--text)] text-right">{value}</span>
    </div>
  );
}
