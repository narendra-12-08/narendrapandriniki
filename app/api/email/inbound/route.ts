import { NextRequest, NextResponse } from "next/server";
import { ADMIN_EMAIL, FROM_EMAIL, sendCustomEmail } from "@/lib/resend";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();

    const subject = payload.subject || payload.headers?.subject || "No subject";
    const fromEmail =
      payload.from || payload.headers?.from || "unknown@unknown.com";
    const fromName = payload.fromName || payload.headers?.fromName || null;
    const htmlBody = typeof payload.html === "string" ? payload.html : "";
    const body =
      payload.text ||
      (htmlBody ? htmlBody.replace(/<[^>]*>/g, "") : "") ||
      "";

    // 1) Save into the admin inbox so it can be replied to from /control/inbox.
    if (
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder")
    ) {
      const { createServiceClient } = await import("@/lib/supabase/server");
      const supabase = await createServiceClient();

      await supabase.from("inbox_messages").insert({
        subject,
        sender_name: fromName,
        sender_email: fromEmail,
        body,
        source: "inbound_email",
        status: "unread",
      });
    }

    // 2) Forward to the personal inbox so notifications hit a real client.
    if (process.env.RESEND_API_KEY) {
      try {
        const sender = fromName ? `${fromName} <${fromEmail}>` : fromEmail;
        const escaped = body.replace(/[&<>]/g, (c: string) => {
          const map: Record<string, string> = { "&": "&amp;", "<": "&lt;", ">": "&gt;" };
          return map[c] ?? c;
        });
        await sendCustomEmail({
          to: ADMIN_EMAIL,
          subject: `[Inbox] ${subject}`,
          html: `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 640px; padding: 16px;">
            <div style="border-bottom: 1px solid #ddd; padding-bottom: 12px; margin-bottom: 12px;">
              <div style="font-size: 12px; color: #888;">From</div>
              <div style="font-weight: 600;">${sender}</div>
              <div style="font-size: 12px; color: #888; margin-top: 8px;">Subject</div>
              <div>${subject}</div>
            </div>
            <div style="white-space: pre-wrap; line-height: 1.6;">${escaped}</div>
            <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #eee; font-size: 12px; color: #888;">
              Forwarded by ${FROM_EMAIL} · Reply from <a href="https://narendrapandrinki.com/control/inbox">the admin inbox</a>.
            </div>
          </div>`,
          text: `From: ${sender}\nSubject: ${subject}\n\n${body}\n\n— Forwarded; reply from https://narendrapandrinki.com/control/inbox`,
        });
      } catch (forwardErr) {
        console.error("Inbound forward failed:", forwardErr);
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error("Inbound email webhook error:", error);
    return NextResponse.json({ error: "Processing failed" }, { status: 500 });
  }
}
