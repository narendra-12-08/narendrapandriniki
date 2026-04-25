"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  createContract,
  generateSigningToken,
  markDeclined,
  markSigned,
  updateContract,
  upsertTemplate,
  deleteTemplate,
  type Contract,
} from "@/lib/db/contracts";
import { sendCustomEmail, FROM_EMAIL, ADMIN_EMAIL, DOMAIN } from "@/lib/resend";

// ---------------- helpers ----------------

function str(v: FormDataEntryValue | null): string | null {
  const s = (v ?? "").toString().trim();
  return s || null;
}

async function clientIp(): Promise<string | null> {
  const h = await headers();
  const xff = h.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]!.trim();
  return h.get("x-real-ip") ?? h.get("cf-connecting-ip") ?? null;
}

async function userAgent(): Promise<string | null> {
  const h = await headers();
  return h.get("user-agent");
}

async function logEmail(opts: {
  to: string;
  subject: string;
  html: string;
  text?: string;
  resendId?: string;
  status: "sent" | "failed" | "queued";
  error?: string;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  await supabase.from("sent_emails").insert({
    to_email: opts.to,
    subject: opts.subject,
    body_html: opts.html,
    body_text: opts.text ?? null,
    status: opts.status,
    resend_id: opts.resendId ?? null,
    error_message: opts.error ?? null,
    sent_by: user?.id ?? null,
  });
}

function siteUrl(): string {
  return `https://${DOMAIN}`;
}

function signingUrl(token: string): string {
  return `${siteUrl()}/sign/${token}`;
}

function brandedHtml(opts: {
  heading: string;
  intro: string;
  ctaLabel?: string;
  ctaUrl?: string;
  footerNote?: string;
  bodyHtml?: string;
}): string {
  return `
  <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; color: #1e1208; padding: 24px;">
    <h2 style="color: #5c3d1e; margin: 0 0 16px;">${opts.heading}</h2>
    <p style="line-height: 1.6;">${opts.intro}</p>
    ${opts.bodyHtml ?? ""}
    ${
      opts.ctaUrl && opts.ctaLabel
        ? `<p style="margin: 28px 0;">
        <a href="${opts.ctaUrl}" style="display:inline-block; background:#5c3d1e; color:#fff; padding:12px 22px; text-decoration:none; border-radius:6px; font-weight:600;">${opts.ctaLabel}</a>
      </p>
      <p style="font-size: 13px; color:#7d5c3a;">If the button doesn't work, copy this link into your browser:<br/><a href="${opts.ctaUrl}" style="color:#7d5c3a; word-break:break-all;">${opts.ctaUrl}</a></p>`
        : ""
    }
    ${
      opts.footerNote
        ? `<p style="margin-top: 28px; font-size: 13px; color:#7d5c3a;">${opts.footerNote}</p>`
        : ""
    }
    <p style="margin-top: 28px;">Best,<br/>Narendra Pandrinki<br/><span style="color:#7d5c3a;">narendrapandrinki.com</span></p>
  </div>`;
}

async function sendContractInvitationEmail(c: Contract): Promise<void> {
  const url = signingUrl(c.signing_token);
  const html = brandedHtml({
    heading: `Contract for review: ${c.title}`,
    intro: `Hi ${c.recipient_name},<br/><br/>Please review and sign the contract titled <strong>${c.title}</strong> at the link below. The signing flow takes a couple of minutes — review the terms, type your full name, and submit.`,
    ctaLabel: "Review & sign",
    ctaUrl: url,
    footerNote: `Reference: ${c.signing_token.slice(0, 12)}…`,
  });
  const text = `Hi ${c.recipient_name},

Please review and sign the contract "${c.title}" at:
${url}

Reference: ${c.signing_token.slice(0, 12)}…

Best,
Narendra Pandrinki
${FROM_EMAIL}`;

  try {
    const { id } = await sendCustomEmail({
      to: c.recipient_email,
      subject: `Contract for review: ${c.title}`,
      html,
      text,
    });
    await logEmail({
      to: c.recipient_email,
      subject: `Contract for review: ${c.title}`,
      html,
      text,
      status: "sent",
      resendId: id,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Send failed";
    await logEmail({
      to: c.recipient_email,
      subject: `Contract for review: ${c.title}`,
      html,
      text,
      status: "failed",
      error: message,
    });
    throw err;
  }
}

async function sendContractSignedEmails(c: Contract): Promise<void> {
  const url = signingUrl(c.signing_token);
  const summaryHtml = `
    <table style="width:100%; border-collapse: collapse; margin: 12px 0; font-size: 14px;">
      <tr><td style="padding:6px 0; font-weight:bold; width:140px;">Title</td><td>${c.title}</td></tr>
      <tr><td style="padding:6px 0; font-weight:bold;">Signed by</td><td>${c.signer_name ?? c.recipient_name}</td></tr>
      <tr><td style="padding:6px 0; font-weight:bold;">Signed at</td><td>${c.signed_at ?? new Date().toISOString()}</td></tr>
      <tr><td style="padding:6px 0; font-weight:bold;">Reference</td><td><code>${c.signing_token.slice(0, 12)}…</code></td></tr>
    </table>`;

  // Recipient copy
  const recipHtml = brandedHtml({
    heading: `Signed: ${c.title}`,
    intro: `Hi ${c.recipient_name},<br/><br/>Thank you for signing. A copy of the executed contract is available at the link below.`,
    bodyHtml: summaryHtml,
    ctaLabel: "View signed contract",
    ctaUrl: url,
  });
  try {
    const { id } = await sendCustomEmail({
      to: c.recipient_email,
      subject: `Signed: ${c.title}`,
      html: recipHtml,
    });
    await logEmail({
      to: c.recipient_email,
      subject: `Signed: ${c.title}`,
      html: recipHtml,
      status: "sent",
      resendId: id,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Send failed";
    await logEmail({
      to: c.recipient_email,
      subject: `Signed: ${c.title}`,
      html: recipHtml,
      status: "failed",
      error: message,
    });
  }

  // Admin notification
  const adminHtml = brandedHtml({
    heading: `Contract signed: ${c.title}`,
    intro: `${c.recipient_name} (${c.recipient_email}) just signed.`,
    bodyHtml: summaryHtml,
    ctaLabel: "View",
    ctaUrl: url,
  });
  try {
    const { id } = await sendCustomEmail({
      to: ADMIN_EMAIL,
      subject: `Contract signed: ${c.title}`,
      html: adminHtml,
    });
    await logEmail({
      to: ADMIN_EMAIL,
      subject: `Contract signed: ${c.title}`,
      html: adminHtml,
      status: "sent",
      resendId: id,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Send failed";
    await logEmail({
      to: ADMIN_EMAIL,
      subject: `Contract signed: ${c.title}`,
      html: adminHtml,
      status: "failed",
      error: message,
    });
  }
}

// ---------------- Templates CRUD (admin) ----------------

export async function upsertContractTemplate(formData: FormData): Promise<void> {
  const id = str(formData.get("id"));
  const slug = str(formData.get("slug"));
  const name = str(formData.get("name"));
  const body = (formData.get("body") ?? "").toString();
  const category = str(formData.get("category")) ?? "general";
  if (!slug || !name || !body) return;
  await upsertTemplate({ id, slug, name, body, category });
  revalidatePath("/control/contract-templates");
}

export async function deleteContractTemplate(formData: FormData): Promise<void> {
  const id = str(formData.get("id"));
  if (!id) return;
  await deleteTemplate(id);
  revalidatePath("/control/contract-templates");
}

// ---------------- Contracts (admin) ----------------

export async function createAndSendContract(formData: FormData): Promise<void> {
  const title = str(formData.get("title"));
  const body = (formData.get("body_markdown") ?? "").toString();
  const recipient_name = str(formData.get("recipient_name"));
  const recipient_email = str(formData.get("recipient_email"));
  const client_id = str(formData.get("client_id"));
  const project_id = str(formData.get("project_id"));
  const action = str(formData.get("submit_action")) ?? "send"; // 'draft' | 'send'

  if (!title || !body || !recipient_name || !recipient_email) {
    redirect("/control/contracts/new?err=missing");
  }

  const created = await createContract({
    title: title!,
    body_markdown: body,
    recipient_name: recipient_name!,
    recipient_email: recipient_email!,
    client_id,
    project_id,
    status: "draft",
  });

  if (action === "send") {
    await updateContract(created.id, {
      status: "sent",
      sent_at: new Date().toISOString(),
    });
    const sent = { ...created, status: "sent" as const, sent_at: new Date().toISOString() };
    try {
      await sendContractInvitationEmail(sent);
    } catch {
      // logged inside sendContractInvitationEmail; revert status to draft so it can be retried
      await updateContract(created.id, { status: "draft", sent_at: null });
      redirect(`/control/contracts/${created.id}?err=send`);
    }
  }

  revalidatePath("/control/contracts");
  redirect(`/control/contracts/${created.id}`);
}

export async function resendContract(formData: FormData): Promise<void> {
  const id = str(formData.get("id"));
  if (!id) return;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("contracts")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error || !data) return;
  const c = data as Contract;
  if (c.status === "signed" || c.status === "cancelled") return;
  await updateContract(id, {
    status: "sent",
    sent_at: new Date().toISOString(),
  });
  await sendContractInvitationEmail({
    ...c,
    status: "sent",
    sent_at: new Date().toISOString(),
  });
  revalidatePath(`/control/contracts/${id}`);
  revalidatePath("/control/contracts");
}

export async function cancelContract(formData: FormData): Promise<void> {
  const id = str(formData.get("id"));
  if (!id) return;
  await updateContract(id, { status: "cancelled" });
  revalidatePath(`/control/contracts/${id}`);
  revalidatePath("/control/contracts");
}

export async function rotateSigningToken(formData: FormData): Promise<void> {
  const id = str(formData.get("id"));
  if (!id) return;
  await updateContract(id, { signing_token: generateSigningToken() });
  revalidatePath(`/control/contracts/${id}`);
}

// ---------------- Public sign actions ----------------

export async function signContractAction(formData: FormData): Promise<void> {
  const token = str(formData.get("token"));
  const signer_name = str(formData.get("signer_name"));
  const agreed = formData.get("agreed");
  const signature_data = (formData.get("signature_data") ?? "").toString();

  if (!token) redirect("/");
  if (!signer_name || agreed !== "on") {
    redirect(`/sign/${token}?err=missing`);
  }

  const ip = await clientIp();
  const ua = await userAgent();

  const updated = await markSigned(token!, {
    signer_name: signer_name!,
    signer_ip: ip,
    signer_user_agent: ua,
    signature_data: signature_data || `typed:${signer_name}`,
  });

  if (!updated) {
    redirect(`/sign/${token}?err=state`);
  }

  // fire-and-forget emails (await so they actually run in serverless)
  try {
    await sendContractSignedEmails(updated!);
  } catch {
    // swallow — we don't want signing UX to fail because email failed
  }

  // Touch project status if linked? Skip — out of scope.

  // Force admin client to revalidate any open admin views.
  void createAdminClient();

  redirect(`/sign/${token}/done`);
}

export async function declineContractAction(formData: FormData): Promise<void> {
  const token = str(formData.get("token"));
  const reason = str(formData.get("reason"));
  if (!token) redirect("/");

  await markDeclined(token!, reason);
  redirect(`/sign/${token}/done?declined=1`);
}
