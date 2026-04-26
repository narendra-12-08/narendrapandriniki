"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { draft, type DraftMode } from "@/lib/ai-drafter";

export type DraftFormState = {
  output?: string;
  error?: string;
  mode?: DraftMode;
  brief?: string;
  leadId?: string;
};

export async function generateDraft(
  _prev: DraftFormState,
  formData: FormData
): Promise<DraftFormState> {
  const mode = (formData.get("mode") ?? "contract") as DraftMode;
  const brief = (formData.get("brief") ?? "").toString().trim();
  const leadId = (formData.get("leadId") ?? "").toString().trim() || undefined;
  const customSystemPrompt = formData.get("customSystemPrompt")?.toString().trim();

  if (!brief) {
    return { error: "Please describe what you want drafted.", mode, brief: "" };
  }

  let leadContext: Record<string, string | null> | undefined;
  if (leadId) {
    const supabase = await createClient();
    const { data } = await supabase
      .from("chatbot_leads")
      .select(
        "visitor_name, visitor_email, visitor_company, visitor_role, project_type, what_to_build, business_goal, budget_range, timeline, preferred_tech, suggested_approach, suggested_tech_stack"
      )
      .eq("id", leadId)
      .single();
    if (data) {
      leadContext = {
        visitorName: data.visitor_name,
        visitorEmail: data.visitor_email,
        visitorCompany: data.visitor_company,
        visitorRole: data.visitor_role,
        projectType: data.project_type,
        whatToBuild: data.what_to_build,
        businessGoal: data.business_goal,
        budgetRange: data.budget_range,
        timeline: data.timeline,
        preferredTech: data.preferred_tech,
        suggestedApproach: data.suggested_approach,
        suggestedTechStack: data.suggested_tech_stack,
      };
    }
  }

  try {
    const output = await draft({
      mode,
      brief,
      leadContext: leadContext as never,
      customSystemPrompt: customSystemPrompt || undefined,
    });
    return { output, mode, brief, leadId };
  } catch (e) {
    return {
      error: e instanceof Error ? e.message : "Draft failed",
      mode,
      brief,
      leadId,
    };
  }
}

export async function saveDraftAsContract(formData: FormData): Promise<void> {
  "use server";
  const title = (formData.get("title") ?? "").toString().trim();
  const body = (formData.get("body") ?? "").toString();
  const recipientName = (formData.get("recipient_name") ?? "").toString().trim();
  const recipientEmail = (formData.get("recipient_email") ?? "").toString().trim();
  if (!title || !body || !recipientName || !recipientEmail) return;

  const supabase = await createClient();
  const token =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID().replace(/-/g, "")
      : Math.random().toString(36).slice(2) + Date.now().toString(36);

  await supabase.from("contracts").insert({
    title,
    body_markdown: body,
    recipient_name: recipientName,
    recipient_email: recipientEmail,
    signing_token: token,
    status: "draft",
  });

  revalidatePath("/control/contracts");
}
