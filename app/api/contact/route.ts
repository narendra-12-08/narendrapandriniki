import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import {
  sendContactAcknowledgement,
  sendAdminNotification,
} from "@/lib/resend";

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

    const supabase = await createClient();

    const { error: dbError } = await supabase
      .from("contact_submissions")
      .insert({
        name,
        email,
        company: company || null,
        service_interest: service || null,
        message,
        status: "new",
      });

    if (dbError) {
      console.error("DB error saving contact:", dbError);
    }

    const { error: inboxError } = await supabase
      .from("inbox_messages")
      .insert({
        subject: `Enquiry from ${name}${company ? ` at ${company}` : ""}`,
        sender_name: name,
        sender_email: email,
        body: message,
        source: "contact_form",
        status: "unread",
      });

    if (inboxError) {
      console.error("DB error saving inbox:", inboxError);
    }

    try {
      await Promise.allSettled([
        sendContactAcknowledgement(email, name),
        sendAdminNotification({ name, email, company, message, service }),
      ]);
    } catch (emailError) {
      console.error("Email error:", emailError);
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
