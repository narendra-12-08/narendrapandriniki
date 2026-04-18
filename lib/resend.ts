import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY);

export const FROM_EMAIL = "hello@narendrapandriniki.com";
export const ADMIN_EMAIL = "emailme0666@yahoo.com";
export const DOMAIN = "narendrapandriniki.com";

export async function sendContactAcknowledgement(
  toEmail: string,
  toName: string
) {
  return resend.emails.send({
    from: `Narendra Pandriniki <${FROM_EMAIL}>`,
    to: toEmail,
    subject: "Thanks for getting in touch",
    html: `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; color: #1e1208;">
        <h2 style="color: #5c3d1e;">Thanks, ${toName}</h2>
        <p>I've received your message and will get back to you within 1–2 business days.</p>
        <p>In the meantime, feel free to review my services at <a href="https://${DOMAIN}/services" style="color:#7d5c3a;">narendrapandriniki.com/services</a>.</p>
        <p style="margin-top: 2rem;">Best,<br/>Narendra Pandriniki<br/>Independent Platform & Cloud Engineer</p>
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
    from: `Site Notifications <${FROM_EMAIL}>`,
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
    from: `Narendra Pandriniki <${FROM_EMAIL}>`,
    to: data.toEmail,
    subject: `Invoice ${data.invoiceNumber} — Narendra Pandriniki`,
    html: `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; color: #1e1208;">
        <h2 style="color: #5c3d1e;">Invoice ${data.invoiceNumber}</h2>
        <p>Dear ${data.toName},</p>
        <p>Please find your invoice details below:</p>
        <table style="width: 100%; border-collapse: collapse; margin: 1rem 0;">
          <tr><td style="padding: 8px 0; font-weight: bold; width: 140px;">Invoice Number</td><td>${data.invoiceNumber}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: bold;">Amount Due</td><td style="font-size: 1.1em; font-weight: bold; color: #5c3d1e;">£${data.total.toLocaleString()}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: bold;">Due Date</td><td>${data.dueDate}</td></tr>
        </table>
        <p>Please arrange payment by the due date. If you have any questions, reply to this email.</p>
        <p style="margin-top: 2rem;">Best regards,<br/>Narendra Pandriniki</p>
      </div>
    `,
  });
}
