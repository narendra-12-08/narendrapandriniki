import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();

    const subject = payload.subject || payload.headers?.subject || "No subject";
    const fromEmail =
      payload.from || payload.headers?.from || "unknown@unknown.com";
    const fromName = payload.fromName || payload.headers?.fromName || null;
    const body =
      payload.text ||
      (typeof payload.html === "string"
        ? payload.html.replace(/<[^>]*>/g, "")
        : "") ||
      "";

    if (
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder")
    ) {
      const { createClient } = await import("@/lib/supabase/server");
      const supabase = await createClient();

      await supabase.from("inbox_messages").insert({
        subject,
        sender_name: fromName,
        sender_email: fromEmail,
        body,
        source: "inbound_email",
        status: "unread",
      });
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error("Inbound email webhook error:", error);
    return NextResponse.json({ error: "Processing failed" }, { status: 500 });
  }
}
