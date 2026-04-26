import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { callGrok, type GrokMessage } from "@/lib/grok";

export const dynamic = "force-dynamic";

const schema = z.object({
  messages: z.array(
    z.object({ role: z.enum(["user", "assistant"]), content: z.string() })
  ),
  sessionId: z.string().min(1).max(100),
  visitorName: z.string().max(100).optional(),
  visitorEmail: z.string().email().optional(),
  visitorCompany: z.string().max(200).optional(),
  pageSource: z.string().max(500).optional(),
});

export async function POST(request: NextRequest) {
  const pageSource =
    request.headers.get("referer") ?? request.headers.get("origin") ?? undefined;

  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request" }, { status: 422 });
    }

    const { messages, sessionId, visitorName, visitorEmail, visitorCompany } =
      parsed.data;

    let reply: string;
    try {
      reply = await callGrok(messages as GrokMessage[]);
    } catch {
      reply =
        "I'm having a moment — sorry about that. Feel free to email Narendra directly at hello@narendrapandrinki.com and he'll get back to you quickly.";
    }

    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      try {
        const { createServiceClient } = await import("@/lib/supabase/server");
        const supabase = await createServiceClient();

        const allMessages = [
          ...messages,
          { role: "assistant" as const, content: reply },
        ];

        await supabase.from("chat_sessions").upsert(
          {
            session_id: sessionId,
            messages: allMessages,
            visitor_name: visitorName ?? null,
            visitor_email: visitorEmail ?? null,
            visitor_company: visitorCompany ?? null,
            page_source: pageSource ?? null,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "session_id" }
        );
      } catch (dbErr) {
        console.error("Chat session save error:", dbErr);
      }
    }

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Chat route error:", error);
    return NextResponse.json(
      { reply: "I ran into an issue. Please try again or email hello@narendrapandrinki.com directly." },
      { status: 200 }
    );
  }
}
