import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export const dynamic = "force-dynamic";

const schema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  company: z.string().max(200).optional(),
  service: z.string().max(200).optional(),
  message: z.string().min(20).max(5000),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.issues },
        { status: 422 }
      );
    }

    const { name, email, company, service, message } = parsed.data;

    if (
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder")
    ) {
      const { createServiceClient } = await import("@/lib/supabase/server");
      const supabase = await createServiceClient();

      await Promise.allSettled([
        supabase.from("contact_submissions").insert({
          name,
          email,
          company: company || null,
          service_interest: service || null,
          message,
          status: "new",
        }),
        supabase.from("inbox_messages").insert({
          subject: `Enquiry from ${name}${company ? ` at ${company}` : ""}`,
          sender_name: name,
          sender_email: email,
          body: message,
          source: "contact_form",
          status: "unread",
        }),
      ]);
    }

    if (
      process.env.RESEND_API_KEY &&
      !process.env.RESEND_API_KEY.includes("placeholder")
    ) {
      const { sendContactAcknowledgement, sendAdminNotification } =
        await import("@/lib/resend");
      await Promise.allSettled([
        sendContactAcknowledgement(email, name),
        sendAdminNotification({ name, email, company, message, service }),
      ]);
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Contact route error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
