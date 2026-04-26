import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { resend, FROM_EMAIL, ADMIN_EMAIL, DOMAIN } from "@/lib/resend";

export const dynamic = "force-dynamic";

const schema = z.object({
  sessionId: z.string().min(1),
  visitorName: z.string().min(1).max(100),
  visitorEmail: z.string().email(),
  visitorCompany: z.string().max(200).optional(),
  projectSummary: z.string().min(10).max(5000),
  conversationSnippet: z.string().max(10000).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Validation failed" }, { status: 422 });
    }

    const {
      sessionId,
      visitorName,
      visitorEmail,
      visitorCompany,
      projectSummary,
      conversationSnippet,
    } = parsed.data;

    const results = await Promise.allSettled([
      // Save to DB as inbox message
      (async () => {
        if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return;
        const { createServiceClient } = await import("@/lib/supabase/server");
        const supabase = await createServiceClient();
        await Promise.all([
          supabase.from("chat_sessions").upsert(
            {
              session_id: sessionId,
              visitor_name: visitorName,
              visitor_email: visitorEmail,
              visitor_company: visitorCompany ?? null,
              project_summary: projectSummary,
              lead_captured: true,
              email_sent: true,
              updated_at: new Date().toISOString(),
            },
            { onConflict: "session_id" }
          ),
          supabase.from("inbox_messages").insert({
            subject: `Chat lead: ${visitorName}${visitorCompany ? ` (${visitorCompany})` : ""}`,
            sender_name: visitorName,
            sender_email: visitorEmail,
            body: `Project: ${projectSummary}\n\nCompany: ${visitorCompany ?? "Not provided"}\n\nVia: Site chatbot`,
            source: "chatbot",
            status: "unread",
          }),
        ]);
      })(),

      // Notify Narendra
      resend.emails.send({
        from: `Site Notifications <${FROM_EMAIL}>`,
        to: ADMIN_EMAIL,
        subject: `New chat lead: ${visitorName}`,
        html: `
          <div style="font-family: Georgia, serif; max-width: 640px; margin: 0 auto; color: #1e1208;">
            <h2 style="color: #0891b2; margin-bottom: 4px;">New lead from site chatbot</h2>
            <p style="color: #666; margin-top: 0; font-size: 14px;">Submitted via the AI assistant on narendrapandrinki.com</p>
            <table style="width: 100%; border-collapse: collapse; margin: 1.5rem 0;">
              <tr><td style="padding: 8px 0; font-weight: bold; width: 130px; vertical-align: top;">Name</td><td>${visitorName}</td></tr>
              <tr><td style="padding: 8px 0; font-weight: bold; vertical-align: top;">Email</td><td><a href="mailto:${visitorEmail}" style="color:#0891b2;">${visitorEmail}</a></td></tr>
              ${visitorCompany ? `<tr><td style="padding: 8px 0; font-weight: bold; vertical-align: top;">Company</td><td>${visitorCompany}</td></tr>` : ""}
              <tr><td style="padding: 8px 0; font-weight: bold; vertical-align: top;">Project</td><td style="white-space: pre-wrap;">${projectSummary}</td></tr>
            </table>
            ${
              conversationSnippet
                ? `<details style="margin-top: 1rem;"><summary style="cursor: pointer; color: #666; font-size: 14px;">View conversation</summary><pre style="margin-top: 8px; padding: 12px; background: #f5f5f5; border-radius: 6px; font-size: 12px; white-space: pre-wrap; overflow: auto;">${conversationSnippet.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c] ?? c))}</pre></details>`
                : ""
            }
            <p style="margin-top: 1.5rem;"><a href="https://${DOMAIN}/control/inbox" style="color:#0891b2;">View in admin inbox →</a></p>
          </div>
        `,
      }),

      // Acknowledge to visitor
      resend.emails.send({
        from: `Narendra Pandrinki <${FROM_EMAIL}>`,
        to: visitorEmail,
        subject: "I'll be in touch — Narendra Pandrinki",
        html: `
          <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; color: #1e1208;">
            <h2 style="color: #0891b2;">Thanks, ${visitorName}</h2>
            <p>I've received your project details and will get back to you within 1–2 business days.</p>
            <p>In the meantime, you might find these useful:</p>
            <ul style="line-height: 1.8;">
              <li><a href="https://${DOMAIN}/services" style="color:#0891b2;">Services</a> — full breakdown of what I do</li>
              <li><a href="https://${DOMAIN}/work" style="color:#0891b2;">Case studies</a> — recent projects with measurable outcomes</li>
              <li><a href="https://${DOMAIN}/pricing" style="color:#0891b2;">Pricing</a> — how engagements are structured and scoped</li>
            </ul>
            <p style="margin-top: 2rem;">Best,<br/><strong>Narendra Pandrinki</strong><br/><span style="color:#0891b2;">Independent Platform &amp; Cloud Engineer</span></p>
          </div>
        `,
      }),
    ]);

    const failed = results.filter((r) => r.status === "rejected");
    if (failed.length > 0) {
      console.error("Some lead actions failed:", failed);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Lead route error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
