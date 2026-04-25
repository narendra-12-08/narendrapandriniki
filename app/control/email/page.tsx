import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Mail, Check, Clock, AlertTriangle } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { sendCustomEmail } from "@/lib/resend";
import {
  Badge,
  Card,
  Empty,
  Field,
  Input,
  PageHeader,
  PrimaryButton,
  Textarea,
} from "@/components/admin/ui";

export const metadata: Metadata = { title: "Compose email" };

interface SentEmailRow {
  id: string;
  to_email: string;
  subject: string;
  status: "sent" | "failed" | "queued";
  resend_id: string | null;
  error_message: string | null;
  created_at: string;
}

// ---------------------------------------------------------------
// Server action — runs on submit. Logs the send into sent_emails
// regardless of success, then dispatches to Resend.
// ---------------------------------------------------------------
async function sendEmailAction(formData: FormData): Promise<void> {
  "use server";

  const to = (formData.get("to") ?? "").toString().trim();
  const subject = (formData.get("subject") ?? "").toString().trim();
  const body = (formData.get("body") ?? "").toString();

  if (!to || !subject || !body) {
    redirect("/control/email?err=missing");
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Render: send the body as both plain text and a <pre>-wrapped HTML
  // version so the recipient gets a readable message regardless of
  // their email client's preference. Keep it deliberately minimal —
  // this composer is for typing, not designing.
  const escaped = body.replace(
    /[&<>]/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c] ?? c),
  );
  const html = `<div style="font-family: ui-monospace, SFMono-Regular, Menlo, monospace; white-space: pre-wrap; line-height: 1.55; color: #1e1208; max-width: 640px;">${escaped}</div>`;

  // Insert a queued log row first so we have an id to update.
  const { data: inserted, error: insertErr } = await supabase
    .from("sent_emails")
    .insert({
      to_email: to,
      subject,
      body_html: html,
      body_text: body,
      status: "queued",
      sent_by: user?.id ?? null,
    })
    .select("id")
    .single();

  if (insertErr || !inserted) {
    redirect("/control/email?err=db");
  }

  try {
    const { id } = await sendCustomEmail({ to, subject, html, text: body });
    await supabase
      .from("sent_emails")
      .update({ status: "sent", resend_id: id })
      .eq("id", inserted.id);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Unknown send failure";
    await supabase
      .from("sent_emails")
      .update({ status: "failed", error_message: message })
      .eq("id", inserted.id);
    redirect("/control/email?err=send");
  }

  redirect("/control/email?sent=1");
}

// ---------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------
function statusBadge(status: SentEmailRow["status"]) {
  switch (status) {
    case "sent":
      return (
        <Badge tone="lime">
          <Check size={11} className="mr-1" />
          sent
        </Badge>
      );
    case "failed":
      return (
        <Badge tone="rose">
          <AlertTriangle size={11} className="mr-1" />
          failed
        </Badge>
      );
    case "queued":
    default:
      return (
        <Badge tone="amber">
          <Clock size={11} className="mr-1" />
          queued
        </Badge>
      );
  }
}

function relativeTime(iso: string): string {
  const then = new Date(iso).getTime();
  const now = Date.now();
  const diff = Math.max(0, now - then);
  const m = Math.floor(diff / 60_000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d}d ago`;
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// ---------------------------------------------------------------
// Page
// ---------------------------------------------------------------
export default async function ComposeEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ sent?: string; err?: string }>;
}) {
  const { sent, err } = await searchParams;

  const supabase = await createClient();
  const { data: rows } = await supabase
    .from("sent_emails")
    .select("id, to_email, subject, status, resend_id, error_message, created_at")
    .order("created_at", { ascending: false })
    .limit(25);

  const recent = (rows ?? []) as SentEmailRow[];

  return (
    <div>
      <PageHeader
        title="Compose email"
        subtitle="Send a one-off email and keep an audit trail."
      />

      {sent === "1" && (
        <div className="mb-5 rounded-md border border-[var(--lime)]/30 bg-[var(--lime)]/10 px-4 py-3 text-sm text-[var(--lime)]">
          Email sent.
        </div>
      )}
      {err === "missing" && (
        <div className="mb-5 rounded-md border border-[var(--rose)]/30 bg-[var(--rose)]/10 px-4 py-3 text-sm text-[var(--rose)]">
          To, subject, and body are all required.
        </div>
      )}
      {err === "send" && (
        <div className="mb-5 rounded-md border border-[var(--rose)]/30 bg-[var(--rose)]/10 px-4 py-3 text-sm text-[var(--rose)]">
          Send failed — check the recent sends list for the error message.
        </div>
      )}
      {err === "db" && (
        <div className="mb-5 rounded-md border border-[var(--rose)]/30 bg-[var(--rose)]/10 px-4 py-3 text-sm text-[var(--rose)]">
          Could not record the send in the database.
        </div>
      )}

      <Card className="p-6 md:p-8 mb-10">
        <form action={sendEmailAction} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field label="To" htmlFor="to">
              <Input
                id="to"
                name="to"
                type="email"
                required
                placeholder="recipient@example.com"
              />
            </Field>
            <Field label="Subject" htmlFor="subject">
              <Input
                id="subject"
                name="subject"
                type="text"
                required
                placeholder="Subject line"
              />
            </Field>
          </div>
          <Field
            label="Body"
            htmlFor="body"
            hint="Plain text. Sent as both text and a monospace HTML version."
          >
            <Textarea
              id="body"
              name="body"
              required
              rows={14}
              className="min-h-[280px]"
              placeholder="Write your message…"
            />
          </Field>
          <div className="flex items-center justify-end pt-2 border-t border-[var(--border)]">
            <PrimaryButton type="submit">
              <Mail size={14} />
              Send email
            </PrimaryButton>
          </div>
        </form>
      </Card>

      <div>
        <PageHeader title="Recent sends" subtitle="Last 25 messages dispatched from this composer." />
        <Card>
          {recent.length === 0 ? (
            <Empty
              title="No emails yet"
              hint="Send your first message above and it will show up here."
            />
          ) : (
            <div className="divide-y divide-[var(--border)]">
              {recent.map((row) => (
                <div
                  key={row.id}
                  className="px-5 py-4 flex items-start gap-4"
                >
                  <div className="font-mono text-[10px] uppercase tracking-widest text-[var(--text-4)] w-20 shrink-0 pt-1">
                    {relativeTime(row.created_at)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm text-[var(--text)] font-medium truncate">
                        {row.to_email}
                      </span>
                      {statusBadge(row.status)}
                    </div>
                    <div className="text-sm text-[var(--text-2)] mt-1 truncate">
                      {row.subject}
                    </div>
                    {row.status === "failed" && row.error_message && (
                      <div className="mt-1 text-xs text-[var(--rose)] font-mono break-words">
                        {row.error_message}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
