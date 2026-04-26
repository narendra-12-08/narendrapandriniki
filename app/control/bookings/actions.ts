"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { sendCustomEmail } from "@/lib/resend";

async function db() {
  return await createClient();
}

export async function confirmBooking(formData: FormData): Promise<void> {
  const id = (formData.get("id") ?? "").toString();
  const meetingLink = (formData.get("meeting_link") ?? "").toString().trim() || null;
  const supabase = await db();

  const { data: row } = await supabase
    .from("bookings")
    .select("email, name, starts_at")
    .eq("id", id)
    .maybeSingle();

  await supabase
    .from("bookings")
    .update({ status: "confirmed", meeting_link: meetingLink })
    .eq("id", id);

  if (row) {
    try {
      await sendCustomEmail({
        to: row.email as string,
        subject: "Your call is confirmed",
        text: `Hi ${row.name},\n\nYour 15-minute call is confirmed for ${new Date(row.starts_at as string).toUTCString()}.\n\n${meetingLink ? `Meeting link: ${meetingLink}\n\n` : ""}Reply if anything changes.\n\nBest,\nNarendra`,
      });
    } catch {}
  }
  revalidatePath("/control/bookings");
}

export async function rescheduleBooking(formData: FormData): Promise<void> {
  const id = (formData.get("id") ?? "").toString();
  const newStart = (formData.get("starts_at") ?? "").toString().trim();
  if (!id || !newStart) return;
  const dt = new Date(newStart);
  if (isNaN(dt.getTime())) return;
  const supabase = await db();
  await supabase
    .from("bookings")
    .update({ status: "rescheduled", starts_at: dt.toISOString() })
    .eq("id", id);
  revalidatePath("/control/bookings");
}

export async function cancelBooking(formData: FormData): Promise<void> {
  const id = (formData.get("id") ?? "").toString();
  const supabase = await db();
  await supabase.from("bookings").update({ status: "cancelled" }).eq("id", id);
  revalidatePath("/control/bookings");
}

export async function completeBooking(formData: FormData): Promise<void> {
  const id = (formData.get("id") ?? "").toString();
  const supabase = await db();
  await supabase.from("bookings").update({ status: "completed" }).eq("id", id);
  revalidatePath("/control/bookings");
}

export async function noShowBooking(formData: FormData): Promise<void> {
  const id = (formData.get("id") ?? "").toString();
  const supabase = await db();
  await supabase.from("bookings").update({ status: "no-show" }).eq("id", id);
  revalidatePath("/control/bookings");
}

export async function deleteBooking(formData: FormData): Promise<void> {
  const id = (formData.get("id") ?? "").toString();
  const supabase = await db();
  await supabase.from("bookings").delete().eq("id", id);
  revalidatePath("/control/bookings");
}
