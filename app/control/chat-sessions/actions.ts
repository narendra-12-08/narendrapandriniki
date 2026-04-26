"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function deleteChatSession(formData: FormData): Promise<void> {
  const id = formData.get("id")?.toString();
  if (!id) return;
  const supabase = await createClient();
  await supabase.from("chat_sessions").delete().eq("id", id);
  revalidatePath("/control/chat-sessions");
}

export async function clearAllChatSessions(): Promise<void> {
  const supabase = await createClient();
  await supabase.from("chat_sessions").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  revalidatePath("/control/chat-sessions");
}

export async function clearAbandonedChatSessions(): Promise<void> {
  // Wipe sessions that never captured a name/email — pure tyre-kickers.
  const supabase = await createClient();
  await supabase
    .from("chat_sessions")
    .delete()
    .is("visitor_email", null)
    .is("visitor_name", null);
  revalidatePath("/control/chat-sessions");
}

export async function deleteLead(formData: FormData): Promise<void> {
  const id = formData.get("id")?.toString();
  if (!id) return;
  const supabase = await createClient();
  await supabase.from("chatbot_leads").delete().eq("id", id);
  revalidatePath("/control/leads");
}

export async function clearAllChatbotLeads(): Promise<void> {
  const supabase = await createClient();
  await supabase
    .from("chatbot_leads")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000");
  revalidatePath("/control/leads");
}
