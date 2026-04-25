import { Resend } from "resend";

let _resend: Resend | null = null;
export function getResend(): Resend {
  if (!_resend) {
    _resend = new Resend(process.env.RESEND_API_KEY ?? "re_placeholder");
  }
  return _resend;
}
export const resend = { emails: { send: (...args: Parameters<Resend["emails"]["send"]>) => getResend().emails.send(...args) } };

export const FROM_ADDRESS = "hello@narendrapandrinki.com";
export const FROM_EMAIL = "Narendra Pandrinki <hello@narendrapandrinki.com>";
// Personal inbox where notifications + forwarded inbound mail land.
// hello@narendrapandrinki.com is the public-facing send address (FROM_EMAIL).
// All admin/notification email is routed to the personal inbox below.
export const ADMIN_EMAIL = "narendra1208@icloud.com";
export const DOMAIN = "narendrapandrinki.com";

export async function sendContactAcknowledgement(
  toEmail: string,
  toName: string
) {
  return resend.emails.send({
    from: FROM_EMAIL,
    to: toEmail,
    subject: "Thanks for getting in touch",
    html: `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; color: #1e1208;">
        <h2 style="color: #5c3d1e;">Thanks, ${toName}</h2>
        <p>I've received your message and will get back to you within 1–2 business days.</p>
        <p>In the meantime, feel free to review my services at <a href="https://${DOMAIN}/services" style="color:#7d5c3a;">narendrapandrinki.com/services</a>.</p>
        <p style="margin-top: 2rem;">Best,<br/>Narendra Pandrinki<br/>Independent Platform & Cloud Engineer</p>
      </div>
    `,
  });
}

export async function sendAdminNotification(data: {
  name: string;
  email: string;
  company?: string;
  message: string;
  service?: string;
}) {
  return resend.emails.send({
    from: `Site Notifications <${FROM_ADDRESS}>`,
    to: ADMIN_EMAIL,
    subject: `New inquiry from ${data.name}`,
    html: `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; color: #1e1208;">
        <h2 style="color: #5c3d1e;">New Contact Form Submission</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px 0; font-weight: bold; width: 120px;">Name</td><td>${data.name}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: bold;">Email</td><td><a href="mailto:${data.email}">${data.email}</a></td></tr>
          ${data.company ? `<tr><td style="padding: 8px 0; font-weight: bold;">Company</td><td>${data.company}</td></tr>` : ""}
          ${data.service ? `<tr><td style="padding: 8px 0; font-weight: bold;">Service</td><td>${data.service}</td></tr>` : ""}
          <tr><td style="padding: 8px 0; font-weight: bold; vertical-align: top;">Message</td><td>${data.message.replace(/\n/g, "<br/>")}</td></tr>
        </table>
        <p style="margin-top: 1.5rem;"><a href="https://${DOMAIN}/control/inbox" style="color:#7d5c3a;">View in admin</a></p>
      </div>
    `,
  });
}

export async function sendInvoiceEmail(data: {
  toEmail: string;
  toName: string;
  invoiceNumber: string;
  total: number;
  dueDate: string;
}) {
  return resend.emails.send({
    from: FROM_EMAIL,
    to: data.toEmail,
    subject: `Invoice ${data.invoiceNumber} — Narendra Pandrinki`,
    html: `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; color: #1e1208;">
        <h2 style="color: #5c3d1e;">Invoice ${data.invoiceNumber}</h2>
        <p>Dear ${data.toName},</p>
        <p>Please find your invoice details below:</p>
        <table style="width: 100%; border-collapse: collapse; margin: 1rem 0;">
          <tr><td style="padding: 8px 0; font-weight: bold; width: 140px;">Invoice Number</td><td>${data.invoiceNumber}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: bold;">Amount Due</td><td style="font-size: 1.1em; font-weight: bold; color: #5c3d1e;">$${data.total.toLocaleString()}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: bold;">Due Date</td><td>${data.dueDate}</td></tr>
        </table>
        <p>Please arrange payment by the due date. If you have any questions, reply to this email.</p>
        <p style="margin-top: 2rem;">Best regards,<br/>Narendra Pandrinki</p>
      </div>
    `,
  });
}

export async function sendCustomEmail({
  to,
  subject,
  html,
  text,
}: {
  to: string;
  subject: string;
  html?: string;
  text?: string;
}): Promise<{ id: string }> {
  const result = await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject,
    html: html ?? `<pre style="font-family: ui-monospace, monospace; white-space: pre-wrap;">${(text ?? "").replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c] ?? c))}</pre>`,
    text: text ?? undefined,
  });
  if (result.error) {
    throw new Error(result.error.message ?? "Resend send failed");
  }
  const id = result.data?.id;
  if (!id) {
    throw new Error("Resend returned no message id");
  }
  return { id };
}

export async function sendWelcomeEmail({
  to,
  name,
}: {
  to: string;
  name: string;
}) {
  return resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: `Welcome, ${name}`,
    html: `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; color: #1e1208;">
        <h2 style="color: #5c3d1e;">Welcome, ${name}</h2>
        <p>Thanks for reaching out. I read every message myself and reply within 1–2 business days.</p>
        <p>While you're waiting, a few things you might find useful:</p>
        <ul style="line-height: 1.7;">
          <li><a href="https://${DOMAIN}/services" style="color:#7d5c3a;">Services</a> — what I do and how engagements typically run</li>
          <li><a href="https://${DOMAIN}/work" style="color:#7d5c3a;">Selected work</a> — recent case studies with measurable outcomes</li>
          <li><a href="https://${DOMAIN}/blog" style="color:#7d5c3a;">Writing</a> — notes on platform engineering, cloud, and infra</li>
        </ul>
        <p>If anything's time-sensitive, reply directly to this email and I'll prioritise it.</p>
        <p style="margin-top: 2rem;">Best,<br/>Narendra Pandrinki<br/><span style="color:#7d5c3a;">Independent Platform &amp; Cloud Engineer</span></p>
      </div>
    `,
  });
}
