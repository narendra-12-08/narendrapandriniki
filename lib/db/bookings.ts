import { createClient } from "@/lib/supabase/server";

export type AvailabilityWindow = {
  id: string;
  weekday: number; // 0=Sun, 6=Sat
  start_time: string; // "HH:MM"
  end_time: string;
  active: boolean;
};

export type Booking = {
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
  source: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

const SLOT_MINUTES = 15;
const IST_OFFSET_MIN = 330; // +05:30

// Convert a date-of-day in IST + HH:MM into an absolute UTC Date.
function istDateAt(year: number, monthIndex: number, day: number, hh: number, mm: number): Date {
  // The wall-clock time in IST is (hh:mm). UTC = wall-clock - 5:30.
  const utcMs = Date.UTC(year, monthIndex, day, hh, mm) - IST_OFFSET_MIN * 60 * 1000;
  return new Date(utcMs);
}

// Get the IST weekday (0..6, Sun..Sat) for a given UTC midnight-of-IST-day.
function istWeekday(d: Date): number {
  // Construct a Date that represents the IST wall clock of `d`.
  const istMs = d.getTime() + IST_OFFSET_MIN * 60 * 1000;
  return new Date(istMs).getUTCDay();
}

export type DaySlots = {
  istDate: string; // YYYY-MM-DD in IST
  istWeekday: number;
  slots: { iso: string }[];
};

export async function getAvailabilityWindows(): Promise<AvailabilityWindow[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("availability_windows")
    .select("id, weekday, start_time, end_time, active")
    .eq("active", true)
    .order("weekday", { ascending: true })
    .order("start_time", { ascending: true });
  return (data ?? []) as AvailabilityWindow[];
}

export async function getBookedStartsAt(
  fromIso: string,
  toIso: string
): Promise<Set<string>> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("bookings")
    .select("starts_at, status")
    .gte("starts_at", fromIso)
    .lt("starts_at", toIso)
    .neq("status", "cancelled");
  const set = new Set<string>();
  for (const r of data ?? []) {
    set.add(new Date(r.starts_at as string).toISOString());
  }
  return set;
}

function parseHHMM(s: string): { h: number; m: number } {
  const [hStr, mStr] = s.split(":");
  return { h: parseInt(hStr ?? "0", 10), m: parseInt(mStr ?? "0", 10) };
}

// Return YYYY-MM-DD for the IST calendar day of UTC date `d`.
function istDateString(d: Date): string {
  const istMs = d.getTime() + IST_OFFSET_MIN * 60 * 1000;
  const dt = new Date(istMs);
  const y = dt.getUTCFullYear();
  const m = String(dt.getUTCMonth() + 1).padStart(2, "0");
  const day = String(dt.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export async function getNextDaysWithSlots(days = 14): Promise<DaySlots[]> {
  const windows = await getAvailabilityWindows();
  if (windows.length === 0) return [];

  const now = new Date();
  // Earliest bookable slot: 2h from now to give some buffer.
  const earliest = new Date(now.getTime() + 2 * 60 * 60 * 1000);

  // Range: today (IST) to today + days (IST)
  const todayIstStr = istDateString(now);
  const [ty, tm, td] = todayIstStr.split("-").map((x) => parseInt(x, 10));
  const startUtc = istDateAt(ty!, (tm! - 1), td!, 0, 0);
  const endUtc = new Date(startUtc.getTime() + days * 24 * 60 * 60 * 1000);

  const booked = await getBookedStartsAt(startUtc.toISOString(), endUtc.toISOString());

  const result: DaySlots[] = [];

  for (let i = 0; i < days; i++) {
    const dayStartUtc = new Date(startUtc.getTime() + i * 24 * 60 * 60 * 1000);
    const istStr = istDateString(dayStartUtc);
    const [yy, mm, dd] = istStr.split("-").map((x) => parseInt(x, 10));
    const wkday = istWeekday(dayStartUtc);

    const dayWindows = windows.filter((w) => w.weekday === wkday);
    const slots: { iso: string }[] = [];

    for (const w of dayWindows) {
      const start = parseHHMM(w.start_time);
      const end = parseHHMM(w.end_time);
      const startMin = start.h * 60 + start.m;
      const endMin = end.h * 60 + end.m;
      for (let mins = startMin; mins + SLOT_MINUTES <= endMin; mins += SLOT_MINUTES) {
        const h = Math.floor(mins / 60);
        const m = mins % 60;
        const slotUtc = istDateAt(yy!, mm! - 1, dd!, h, m);
        if (slotUtc.getTime() < earliest.getTime()) continue;
        const iso = slotUtc.toISOString();
        if (booked.has(iso)) continue;
        slots.push({ iso });
      }
    }

    result.push({ istDate: istStr, istWeekday: wkday, slots });
  }

  return result;
}

export function formatIstSlot(iso: string): string {
  const d = new Date(iso);
  const istMs = d.getTime() + IST_OFFSET_MIN * 60 * 1000;
  const dt = new Date(istMs);
  const hh = String(dt.getUTCHours()).padStart(2, "0");
  const mm = String(dt.getUTCMinutes()).padStart(2, "0");
  return `${hh}:${mm} IST`;
}

export function formatIstDate(iso: string): string {
  const d = new Date(iso);
  const istMs = d.getTime() + IST_OFFSET_MIN * 60 * 1000;
  const dt = new Date(istMs);
  return dt.toUTCString().replace(" GMT", " IST");
}
