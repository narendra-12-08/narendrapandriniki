import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendCustomEmail, ADMIN_EMAIL, FROM_EMAIL } from "@/lib/resend";
import {
  getNextDaysWithSlots,
  formatIstSlot,
} from "@/lib/db/bookings";
import LocalSlotTime from "@/components/public/LocalSlotTime";

export const metadata: Metadata = {
  title: "Book a 15-minute call",
  description:
    "Pick a slot and tell me about your project. Free 15-minute discovery call, no obligation, no sales deck.",
};

const WEEKDAY_LABEL = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

async function createBookingAction(formData: FormData): Promise<void> {
  "use server";

  const slotIso = (formData.get("slot") ?? "").toString();
  const name = (formData.get("name") ?? "").toString().trim();
  const email = (formData.get("email") ?? "").toString().trim();
  const phone = (formData.get("phone") ?? "").toString().trim() || null;
  const company = (formData.get("company") ?? "").toString().trim() || null;
  const project_summary =
    (formData.get("project_summary") ?? "").toString().trim() || null;
  const visitorTz =
    (formData.get("visitor_tz") ?? "").toString().trim() || "Asia/Kolkata";

  if (!slotIso || !name || !email) {
    redirect(`/book?slot=${encodeURIComponent(slotIso)}&err=missing`);
  }

  const startsAt = new Date(slotIso);
  if (isNaN(startsAt.getTime())) redirect("/book?err=slot");

  const supabase = createAdminClient();

  // Re-check the slot isn't already taken.
  const { data: clash } = await supabase
    .from("bookings")
    .select("id")
    .eq("starts_at", startsAt.toISOString())
    .neq("status", "cancelled")
    .limit(1);
  if (clash && clash.length > 0) {
    redirect(`/book?err=taken`);
  }

  const { data: inserted, error } = await supabase
    .from("bookings")
    .insert({
      name,
      email,
      phone,
      company,
      project_summary,
      starts_at: startsAt.toISOString(),
      duration_minutes: 15,
      timezone: visitorTz,
      status: "requested",
      source: "site",
    })
    .select("id")
    .single();

  if (error || !inserted) {
    redirect("/book?err=db");
  }

  const slotIst = formatIstSlot(slotIso);
  const slotPretty = `${new Date(slotIso).toUTCString()} (UTC) — ${slotIst}`;

  // Visitor confirmation
  try {
    await sendCustomEmail({
      to: email,
      subject: "Booking received — pending confirmation",
      text: `Hi ${name},\n\nThanks for booking a 15-minute call. I have your request for:\n\n${slotPretty}\n\nI confirm slots manually within a few hours and will reply with a meeting link. If anything changes on your end, just reply to this email.\n\nBest,\nNarendra`,
    });
  } catch {
    // non-fatal
  }

  // Admin notification
  try {
    await sendCustomEmail({
      to: ADMIN_EMAIL,
      subject: `New booking request from ${name}`,
      text: `New booking from ${name} <${email}>\nWhen: ${slotPretty}\nVisitor TZ: ${visitorTz}\nPhone: ${phone ?? "—"}\nCompany: ${company ?? "—"}\n\nProject:\n${project_summary ?? "—"}\n\nManage: https://narendrapandrinki.com/control/bookings`,
    });
  } catch {
    // non-fatal — From: ${FROM_EMAIL}
    void FROM_EMAIL;
  }

  redirect(`/book/confirmed?id=${inserted.id}`);
}

export default async function BookPage({
  searchParams,
}: {
  searchParams: Promise<{ slot?: string; err?: string }>;
}) {
  const { slot, err } = await searchParams;

  const days = await getNextDaysWithSlots(14);
  const noAvailability = days.every((d) => d.slots.length === 0);

  // If a slot is selected, show the form
  if (slot) {
    return (
      <div className="bg-grid">
        <section className="section pb-12">
          <div className="container-page max-w-2xl">
            <span className="eyebrow">Book a call</span>
            <h1 className="mt-6 text-4xl md:text-5xl font-semibold tracking-tight leading-[1.05] text-[var(--text)]">
              Almost done. Tell me about <span className="gradient-text">your project.</span>
            </h1>

            <div className="mt-6 surface-card p-5 inline-flex items-center gap-3">
              <span className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--accent)]">
                Selected
              </span>
              <span className="text-[var(--text)] text-sm">
                <LocalSlotTime iso={slot} /> · 15 minutes
              </span>
            </div>

            {err === "missing" && (
              <p className="mt-4 text-sm text-[var(--rose)]">
                Name and email are required.
              </p>
            )}
            {err === "taken" && (
              <p className="mt-4 text-sm text-[var(--rose)]">
                That slot was just taken. Please pick another.
              </p>
            )}

            <form action={createBookingAction} className="mt-8 space-y-5">
              <input type="hidden" name="slot" value={slot} />
              <input type="hidden" name="visitor_tz" id="visitor_tz" />
              <script
                // best-effort tz capture
                dangerouslySetInnerHTML={{
                  __html: `try{document.getElementById('visitor_tz').value=Intl.DateTimeFormat().resolvedOptions().timeZone||''}catch(e){}`,
                }}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Your name" name="name" required />
                <FormField label="Email" name="email" type="email" required />
                <FormField label="Phone (optional)" name="phone" />
                <FormField label="Company (optional)" name="company" />
              </div>

              <div>
                <label
                  htmlFor="project_summary"
                  className="block text-sm font-medium text-[var(--text-2)] mb-1.5"
                >
                  What is the project? (a few sentences is fine)
                </label>
                <textarea
                  id="project_summary"
                  name="project_summary"
                  rows={5}
                  className="w-full px-3.5 py-2.5 rounded-md text-sm bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] placeholder:text-[var(--text-4)] outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/25"
                  placeholder="What you're trying to do, the constraint that matters, what good looks like."
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button type="submit" className="btn-primary">
                  Confirm booking
                </button>
                <Link
                  href="/book"
                  className="text-sm text-[var(--text-3)] hover:text-[var(--text)]"
                >
                  Pick a different time
                </Link>
              </div>
            </form>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="bg-grid">
      <section className="section pb-12">
        <div className="container-page">
          <span className="eyebrow">Book a call</span>
          <h1 className="mt-6 text-5xl md:text-7xl font-semibold tracking-tight leading-[1.05] text-[var(--text)] max-w-4xl">
            Book a 15-minute call with{" "}
            <span className="gradient-text">Narendra.</span>
          </h1>
          <p className="mt-8 max-w-2xl text-lg text-[var(--text-2)] leading-relaxed">
            A short discovery call. No deck, no obligation. We figure out
            whether I am the right fit for your problem — half the time the
            honest answer is &ldquo;no, here is who you should talk to&rdquo;,
            and that is fine.
          </p>
          <p className="mt-3 text-sm text-[var(--text-3)]">
            Times shown in your local timezone. I work from India (IST).
          </p>
        </div>
      </section>

      <section className="pb-32">
        <div className="container-page">
          {err === "taken" && (
            <div className="mb-6 rounded-md border border-[var(--rose)]/30 bg-[var(--rose)]/10 px-4 py-3 text-sm text-[var(--rose)]">
              That slot was just taken — please pick another.
            </div>
          )}
          {err === "db" && (
            <div className="mb-6 rounded-md border border-[var(--rose)]/30 bg-[var(--rose)]/10 px-4 py-3 text-sm text-[var(--rose)]">
              Something went wrong saving your booking. Please try again or
              email <a href="mailto:hello@narendrapandrinki.com" className="underline">hello@narendrapandrinki.com</a>.
            </div>
          )}

          {noAvailability ? (
            <div className="surface-card p-8 max-w-2xl">
              <h2 className="text-xl font-semibold text-[var(--text)]">
                No open slots in the next two weeks.
              </h2>
              <p className="mt-3 text-[var(--text-2)]">
                I am at capacity. Email me with what you are trying to do and
                I will reply with the next opening or refer you to someone who
                can help sooner.
              </p>
              <a
                href="mailto:hello@narendrapandrinki.com"
                className="btn-primary mt-5 inline-flex"
              >
                Email me directly
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {days.map((d) => (
                <DayCard key={d.istDate} day={d} weekdayLabel={WEEKDAY_LABEL[d.istWeekday] ?? ""} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function FormField({
  label,
  name,
  type = "text",
  required,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="block text-sm font-medium text-[var(--text-2)] mb-1.5"
      >
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        className="w-full px-3.5 py-2.5 rounded-md text-sm bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] placeholder:text-[var(--text-4)] outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/25"
      />
    </div>
  );
}

function DayCard({
  day,
  weekdayLabel,
}: {
  day: { istDate: string; slots: { iso: string }[] };
  weekdayLabel: string;
}) {
  const empty = day.slots.length === 0;
  const [yy, mm, dd] = day.istDate.split("-");
  return (
    <div className="surface-card p-5">
      <div className="flex items-baseline justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--text-4)]">
            {weekdayLabel}
          </p>
          <p className="mt-1 text-lg font-semibold text-[var(--text)]">
            {dd}/{mm}/{yy}
          </p>
        </div>
        {empty && (
          <span className="text-[10px] uppercase tracking-widest text-[var(--text-4)]">
            —
          </span>
        )}
      </div>
      {empty ? (
        <p className="mt-4 text-sm text-[var(--text-4)]">No openings.</p>
      ) : (
        <div className="mt-4 grid grid-cols-2 gap-2">
          {day.slots.map((s) => (
            <Link
              key={s.iso}
              href={`/book?slot=${encodeURIComponent(s.iso)}`}
              className="text-center px-2 py-2 rounded-md bg-[var(--surface-2)] border border-[var(--border)] text-sm text-[var(--text-2)] hover:text-[var(--text)] hover:border-[var(--accent)]/50 transition-colors"
            >
              <LocalSlotTime iso={s.iso} variant="time" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
