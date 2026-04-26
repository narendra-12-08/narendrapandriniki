import type { Metadata } from "next";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import {
  Card,
  Empty,
  Field,
  GhostButton,
  Input,
  PageHeader,
  PrimaryButton,
  Select,
  DangerButton,
  Badge,
} from "@/components/admin/ui";

export const metadata: Metadata = { title: "Availability" };

const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

type Window = {
  id: string;
  weekday: number;
  start_time: string;
  end_time: string;
  active: boolean;
};

async function addWindow(formData: FormData): Promise<void> {
  "use server";
  const weekday = parseInt((formData.get("weekday") ?? "1").toString(), 10);
  const start_time = (formData.get("start_time") ?? "10:00").toString();
  const end_time = (formData.get("end_time") ?? "17:00").toString();
  if (!Number.isInteger(weekday) || weekday < 0 || weekday > 6) return;
  const supabase = await createClient();
  await supabase
    .from("availability_windows")
    .insert({ weekday, start_time, end_time, active: true });
  revalidatePath("/control/availability");
}

async function toggleWindow(formData: FormData): Promise<void> {
  "use server";
  const id = (formData.get("id") ?? "").toString();
  const active = (formData.get("active") ?? "false").toString() === "true";
  const supabase = await createClient();
  await supabase
    .from("availability_windows")
    .update({ active: !active })
    .eq("id", id);
  revalidatePath("/control/availability");
}

async function deleteWindow(formData: FormData): Promise<void> {
  "use server";
  const id = (formData.get("id") ?? "").toString();
  const supabase = await createClient();
  await supabase.from("availability_windows").delete().eq("id", id);
  revalidatePath("/control/availability");
}

export default async function AvailabilityPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("availability_windows")
    .select("id, weekday, start_time, end_time, active")
    .order("weekday", { ascending: true })
    .order("start_time", { ascending: true });

  const windows = (data ?? []) as Window[];

  return (
    <div>
      <PageHeader
        title="Availability"
        subtitle="Weekly recurring windows in IST. The /book page generates 15-min slots from these."
      />

      <Card className="p-6 mb-8">
        <form
          action={addWindow}
          className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end"
        >
          <Field label="Day" htmlFor="weekday">
            <Select id="weekday" name="weekday" defaultValue="1">
              {DAYS.map((d, i) => (
                <option key={i} value={i}>
                  {d}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Start (IST)" htmlFor="start_time">
            <Input
              id="start_time"
              name="start_time"
              type="time"
              defaultValue="10:00"
              required
            />
          </Field>
          <Field label="End (IST)" htmlFor="end_time">
            <Input
              id="end_time"
              name="end_time"
              type="time"
              defaultValue="17:00"
              required
            />
          </Field>
          <PrimaryButton type="submit">Add window</PrimaryButton>
        </form>
      </Card>

      <Card>
        {windows.length === 0 ? (
          <Empty
            title="No availability set"
            hint="Add at least one window above before bookings can be made."
          />
        ) : (
          <div className="divide-y divide-[var(--border)]">
            {windows.map((w) => (
              <div
                key={w.id}
                className="px-5 py-4 flex flex-wrap items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs uppercase tracking-widest text-[var(--text-4)] w-20">
                    {DAYS[w.weekday]}
                  </span>
                  <span className="text-[var(--text)] font-medium">
                    {w.start_time} – {w.end_time} IST
                  </span>
                  <Badge tone={w.active ? "lime" : "default"}>
                    {w.active ? "active" : "off"}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <form action={toggleWindow}>
                    <input type="hidden" name="id" value={w.id} />
                    <input
                      type="hidden"
                      name="active"
                      value={String(w.active)}
                    />
                    <GhostButton type="submit">
                      {w.active ? "Disable" : "Enable"}
                    </GhostButton>
                  </form>
                  <form action={deleteWindow}>
                    <input type="hidden" name="id" value={w.id} />
                    <DangerButton type="submit">Delete</DangerButton>
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
