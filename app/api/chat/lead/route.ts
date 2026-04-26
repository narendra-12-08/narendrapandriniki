import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { resend, FROM_EMAIL, ADMIN_EMAIL, DOMAIN } from "@/lib/resend";
import { extractConversationData } from "@/lib/grok";

export const dynamic = "force-dynamic";

const schema = z.object({
  sessionId: z.string().min(1),
  visitorName: z.string().min(1).max(100),
  visitorEmail: z.string().email(),
  visitorPhone: z.string().max(30).optional(),
  visitorCompany: z.string().max(200).optional(),
  projectSummary: z.string().min(1).max(5000),
  conversationSnippet: z.string().max(15000).optional(),
});

function scoreLead(data: {
  phone?: string | null;
  company?: string | null;
  projectType?: string | null;
  whatToBuild?: string | null;
  businessGoal?: string | null;
  budgetRange?: string | null;
  timeline?: string | null;
  featuresRequired?: string | null;
}): { score: number; label: string } {
  let score = 20; // base: has name + email
  if (data.phone) score += 10;
  if (data.company) score += 5;
  if (data.projectType) score += 10;
  if (data.whatToBuild) score += 15;
  if (data.businessGoal) score += 10;
  if (data.budgetRange) score += 20;
  if (data.timeline) score += 10;
  if (data.featuresRequired) score += 5;
  const capped = Math.min(score, 100);
  return {
    score: capped,
    label: capped >= 70 ? "Hot" : capped >= 40 ? "Warm" : "Cold",
  };
}

function labelColour(label: string): { bg: string; text: string } {
  if (label === "Hot") return { bg: "#fef2f2", text: "#dc2626" };
  if (label === "Warm") return { bg: "#fffbeb", text: "#d97706" };
  return { bg: "#f0f9ff", text: "#0369a1" };
}

function row(label: string, value: string | null | undefined): string {
  if (!value) return "";
  return `<tr>
    <td style="padding:6px 0;font-size:13px;font-weight:600;color:#6b7280;width:150px;vertical-align:top;">${label}</td>
    <td style="padding:6px 0;font-size:14px;color:#111827;vertical-align:top;">${value}</td>
  </tr>`;
}

function esc(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] ?? c));
}

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
      visitorPhone,
      visitorCompany,
      projectSummary,
      conversationSnippet,
    } = parsed.data;

    // Extract structured data from transcript
    const extracted = conversationSnippet
      ? await extractConversationData(conversationSnippet)
      : {};

    const {
      projectType,
      whatToBuild,
      businessGoal,
      featuresRequired,
      targetUsers,
      budgetRange,
      timeline,
      currentWebsite,
      preferredTech,
      extraNotes,
      suggestedApproach,
      suggestedTechStack,
      nextRecommendedAction,
    } = extracted;

    const { score, label } = scoreLead({
      phone: visitorPhone,
      company: visitorCompany,
      projectType,
      whatToBuild,
      businessGoal,
      budgetRange,
      timeline,
      featuresRequired,
    });

    const { bg: labelBg, text: labelText } = labelColour(label);

    const subjectProject = projectType || (whatToBuild ? whatToBuild.slice(0, 40) : null) || visitorName;
    const emailSubject = `New Project Lead from Portfolio Chatbot – ${subjectProject}`;

    const transcriptHtml = conversationSnippet
      ? `<details style="margin-top:24px;"><summary style="cursor:pointer;font-size:13px;color:#6b7280;font-weight:500;">View full conversation transcript</summary><pre style="margin-top:8px;padding:14px;background:#f9fafb;border:1px solid #e5e7eb;border-radius:6px;font-size:12px;white-space:pre-wrap;overflow:auto;color:#374151;">${esc(conversationSnippet)}</pre></details>`
      : "";

    const adminHtml = `
<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:660px;margin:0 auto;color:#111827;background:#ffffff;">
  <!-- Header -->
  <div style="background:#0e1117;padding:28px 32px;border-radius:8px 8px 0 0;">
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;">
      <span style="background:rgba(34,211,238,0.15);border:1px solid rgba(34,211,238,0.3);color:#22d3ee;font-weight:700;font-size:13px;padding:5px 10px;border-radius:6px;flex-shrink:0;">NP</span>
      <div>
        <div style="color:#ffffff;font-weight:600;font-size:16px;">New Project Lead</div>
        <div style="color:#6b7280;font-size:12px;margin-top:2px;">via Portfolio Chatbot · narendrapandrinki.com</div>
      </div>
    </div>
    <span style="background:${labelBg};color:${labelText};padding:4px 14px;border-radius:20px;font-size:12px;font-weight:700;letter-spacing:0.5px;text-transform:uppercase;">${label} Lead · ${score}/100</span>
  </div>

  <div style="padding:32px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 8px 8px;">

    <!-- Contact -->
    <h3 style="font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#9ca3af;font-weight:600;margin:0 0 10px;">Contact</h3>
    <table style="width:100%;border-collapse:collapse;margin-bottom:28px;">
      ${row("Name", visitorName)}
      ${row("Email", `<a href="mailto:${visitorEmail}" style="color:#0891b2;">${visitorEmail}</a>`)}
      ${row("Phone", visitorPhone)}
      ${row("Company", visitorCompany)}
    </table>

    <!-- Project details -->
    <h3 style="font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#9ca3af;font-weight:600;margin:0 0 10px;">Project</h3>
    <table style="width:100%;border-collapse:collapse;margin-bottom:28px;">
      ${row("Project type", projectType)}
      ${row("What to build", whatToBuild || projectSummary)}
      ${row("Business goal", businessGoal)}
      ${row("Features needed", featuresRequired)}
      ${row("Target users", targetUsers)}
      ${row("Budget range", budgetRange)}
      ${row("Timeline", timeline)}
      ${row("Current website", currentWebsite)}
      ${row("Preferred tech", preferredTech)}
      ${row("Extra notes", extraNotes)}
    </table>

    <!-- Narendra's brief -->
    ${suggestedApproach || suggestedTechStack || nextRecommendedAction ? `
    <div style="background:#f0fdf4;border-left:4px solid #22c55e;padding:18px 22px;border-radius:0 8px 8px 0;margin-bottom:28px;">
      <h3 style="font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#16a34a;font-weight:700;margin:0 0 12px;">Suggested brief</h3>
      ${suggestedApproach ? `<p style="font-size:14px;color:#166534;margin:0 0 10px;line-height:1.6;"><strong>Approach:</strong> ${esc(suggestedApproach)}</p>` : ""}
      ${suggestedTechStack ? `<p style="font-size:14px;color:#166534;margin:0 0 10px;line-height:1.6;"><strong>Tech stack:</strong> ${esc(suggestedTechStack)}</p>` : ""}
      ${nextRecommendedAction ? `<p style="font-size:14px;color:#166534;margin:0;line-height:1.6;"><strong>Next action:</strong> ${esc(nextRecommendedAction)}</p>` : ""}
    </div>
    ` : ""}

    <!-- CTA -->
    <div style="display:flex;gap:12px;margin-bottom:24px;flex-wrap:wrap;">
      <a href="mailto:${visitorEmail}" style="background:#0891b2;color:#ffffff;padding:10px 20px;border-radius:6px;text-decoration:none;font-size:14px;font-weight:600;">Reply to ${visitorName} →</a>
      <a href="https://${DOMAIN}/control/chat-sessions" style="background:#f9fafb;color:#374151;padding:10px 20px;border-radius:6px;text-decoration:none;font-size:14px;font-weight:600;border:1px solid #e5e7eb;">View in admin →</a>
    </div>

    ${transcriptHtml}
  </div>
</div>`;

    const visitorHtml = `
<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:600px;margin:0 auto;color:#111827;background:#ffffff;">
  <div style="padding:32px;">
    <div style="margin-bottom:24px;">
      <span style="background:#0e1117;color:#22d3ee;font-weight:700;font-size:13px;padding:5px 10px;border-radius:6px;">NP</span>
    </div>
    <h2 style="color:#111827;font-size:22px;font-weight:700;margin:0 0 8px;">Thanks, ${esc(visitorName)}</h2>
    <p style="color:#6b7280;font-size:14px;margin:0 0 24px;">I've received your project details and will be in touch within 1–2 business days.</p>
    <p style="font-size:15px;line-height:1.7;color:#374151;">In the meantime, here are a few things worth exploring:</p>
    <ul style="line-height:2;padding-left:20px;color:#374151;font-size:14px;">
      <li><a href="https://${DOMAIN}/services" style="color:#0891b2;">Services</a> — full breakdown of what I do and how</li>
      <li><a href="https://${DOMAIN}/work" style="color:#0891b2;">Case studies</a> — recent projects with measurable outcomes</li>
      <li><a href="https://${DOMAIN}/pricing" style="color:#0891b2;">Pricing</a> — how engagements are structured and scoped</li>
    </ul>
    <p style="margin-top:32px;font-size:15px;line-height:1.6;color:#374151;">Best,<br/><strong>Narendra Pandrinki</strong><br/><span style="color:#0891b2;font-size:13px;">Independent Platform &amp; Cloud Engineer</span></p>
  </div>
</div>`;

    const results = await Promise.allSettled([
      // Save extended fields to DB
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
              visitor_phone: visitorPhone ?? null,
              visitor_company: visitorCompany ?? null,
              project_summary: projectSummary,
              project_type: projectType ?? null,
              features_required: featuresRequired ?? null,
              business_goal: businessGoal ?? null,
              target_users: targetUsers ?? null,
              budget_range: budgetRange ?? null,
              timeline: timeline ?? null,
              current_website: currentWebsite ?? null,
              preferred_tech: preferredTech ?? null,
              extra_notes: extraNotes ?? null,
              lead_quality_score: score,
              lead_quality_label: label,
              lead_captured: true,
              email_sent: true,
              updated_at: new Date().toISOString(),
            },
            { onConflict: "session_id" }
          ),
          supabase.from("inbox_messages").insert({
            subject: emailSubject,
            sender_name: visitorName,
            sender_email: visitorEmail,
            body: [
              `Type: ${projectType ?? "Not specified"}`,
              `Project: ${whatToBuild || projectSummary}`,
              visitorCompany ? `Company: ${visitorCompany}` : null,
              visitorPhone ? `Phone: ${visitorPhone}` : null,
              budgetRange ? `Budget: ${budgetRange}` : null,
              timeline ? `Timeline: ${timeline}` : null,
              `Lead quality: ${label} (${score}/100)`,
              `Via: Site chatbot`,
            ]
              .filter(Boolean)
              .join("\n"),
            source: "chatbot",
            status: "unread",
          }),
        ]);
      })(),

      // Notify Narendra
      resend.emails.send({
        from: `Site Notifications <${FROM_EMAIL}>`,
        to: ADMIN_EMAIL,
        subject: emailSubject,
        html: adminHtml,
      }),

      // Acknowledge visitor
      resend.emails.send({
        from: `Narendra Pandrinki <${FROM_EMAIL}>`,
        to: visitorEmail,
        subject: "I'll be in touch — Narendra Pandrinki",
        html: visitorHtml,
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
