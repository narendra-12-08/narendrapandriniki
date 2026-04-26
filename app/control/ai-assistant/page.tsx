import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import AiAssistantClient from "./AiAssistantClient";
import { PageHeader } from "@/components/admin/ui";

export const metadata: Metadata = { title: "AI Assistant" };
export const dynamic = "force-dynamic";

export default async function AiAssistantPage() {
  const supabase = await createClient();
  const { data: leads } = await supabase
    .from("chatbot_leads")
    .select("id, visitor_name, visitor_email, visitor_company, project_type, created_at")
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Assistant"
        subtitle="Draft contracts, proposals, and follow-ups. Always protective of you, never hallucinated."
      />
      <AiAssistantClient
        leads={(leads ?? []).map((l) => ({
          id: l.id,
          label:
            (l.visitor_name ?? "Unknown") +
            (l.visitor_company ? ` · ${l.visitor_company}` : "") +
            (l.project_type ? ` · ${l.project_type}` : ""),
        }))}
      />
    </div>
  );
}
