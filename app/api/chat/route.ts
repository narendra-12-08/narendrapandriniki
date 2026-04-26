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
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request" }, { status: 422 });
    }

    const { messages, sessionId, visitorName, visitorEmail, visitorCompany } =
      parsed.data;

    const reply = await callGrok(messages as GrokMessage[]);

    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
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
          updated_at: new Date().toISOString(),
        },
        { onConflict: "session_id" }
      );
    }

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Chat route error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
