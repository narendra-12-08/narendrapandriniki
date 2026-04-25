"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";

// =====================
// Form helpers
// =====================
function csv(value: FormDataEntryValue | null): string[] {
  const s = (value ?? "").toString().trim();
  if (!s) return [];
  return s
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);
}

function str(value: FormDataEntryValue | null): string | null {
  const s = (value ?? "").toString().trim();
  return s || null;
}

function bool(value: FormDataEntryValue | null): boolean {
  return value === "on" || value === "true" || value === "1";
}

function int(value: FormDataEntryValue | null, fallback = 0): number {
  const n = parseInt((value ?? "").toString(), 10);
  return Number.isFinite(n) ? n : fallback;
}

function ensureSlug(raw: string | null, fallback: string): string {
  return slugify((raw && raw.trim()) || fallback || "untitled");
}

// =====================
// pages_content (key/value)
// =====================
async function upsertPagesContent(key: string, value: string) {
  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("pages_content")
    .select("id")
    .eq("key", key)
    .maybeSingle();
  if (existing?.id) {
    await supabase
      .from("pages_content")
      .update({ value })
      .eq("id", existing.id);
  } else {
    await supabase.from("pages_content").insert({ key, value });
  }
}

// =====================
// About: bio paragraphs + availability
// =====================
export async function saveAboutContent(formData: FormData) {
  // Multiple textareas posted as bio_paragraph[] (one per paragraph).
  const paragraphs = formData
    .getAll("bio_paragraph")
    .map((v) => v.toString().trim())
    .filter(Boolean);
  await upsertPagesContent("bio_paragraphs", JSON.stringify(paragraphs));

  const availability = (formData.get("availability_text") ?? "").toString();
  await upsertPagesContent("availability_text", availability);

  revalidatePath("/about");
  revalidatePath("/control/about");
}

// =====================
// Principles
// =====================
export async function upsertPrinciple(formData: FormData) {
  const id = str(formData.get("id"));
  const title = str(formData.get("title"));
  const description = str(formData.get("description"));
  if (!title || !description) return;
  const payload = {
    title,
    description,
    order_index: int(formData.get("order_index")),
    published: bool(formData.get("published")),
  };
  const supabase = await createClient();
  if (id) {
    await supabase.from("principles").update(payload).eq("id", id);
  } else {
    await supabase.from("principles").insert(payload);
  }
  revalidatePath("/about");
  revalidatePath("/control/principles");
}

export async function deletePrinciple(formData: FormData) {
  const id = String(formData.get("id"));
  if (!id) return;
  const supabase = await createClient();
  await supabase.from("principles").delete().eq("id", id);
  revalidatePath("/about");
  revalidatePath("/control/principles");
}

// =====================
// Timeline entries
// =====================
export async function upsertTimelineEntry(formData: FormData) {
  const id = str(formData.get("id"));
  const year = str(formData.get("year"));
  const title = str(formData.get("title"));
  const description = str(formData.get("description"));
  if (!year || !title || !description) return;
  const payload = {
    year,
    title,
    description,
    order_index: int(formData.get("order_index")),
  };
  const supabase = await createClient();
  if (id) {
    await supabase.from("timeline_entries").update(payload).eq("id", id);
  } else {
    await supabase.from("timeline_entries").insert(payload);
  }
  revalidatePath("/about");
  revalidatePath("/control/timeline");
}

export async function deleteTimelineEntry(formData: FormData) {
  const id = String(formData.get("id"));
  if (!id) return;
  const supabase = await createClient();
  await supabase.from("timeline_entries").delete().eq("id", id);
  revalidatePath("/about");
  revalidatePath("/control/timeline");
}

// =====================
// Pricing tiers
// =====================
export async function upsertPricingTier(formData: FormData) {
  const id = str(formData.get("id"));
  const name = str(formData.get("name"));
  if (!name) return;
  const slug = ensureSlug(str(formData.get("slug")), name);
  const payload = {
    slug,
    name,
    tagline: str(formData.get("tagline")),
    price_label: str(formData.get("price_label")),
    price_note: str(formData.get("price_note")),
    description: str(formData.get("description")),
    ideal_for: str(formData.get("ideal_for")),
    includes: csv(formData.get("includes")),
    not_included: csv(formData.get("not_included")),
    cta: str(formData.get("cta")),
    order_index: int(formData.get("order_index")),
    published: bool(formData.get("published")),
  };
  const supabase = await createClient();
  if (id) {
    await supabase.from("pricing_tiers").update(payload).eq("id", id);
  } else {
    await supabase.from("pricing_tiers").insert(payload);
  }
  revalidatePath("/pricing");
  revalidatePath("/control/pricing");
}

export async function deletePricingTier(formData: FormData) {
  const id = String(formData.get("id"));
  if (!id) return;
  const supabase = await createClient();
  await supabase.from("pricing_tiers").delete().eq("id", id);
  revalidatePath("/pricing");
  revalidatePath("/control/pricing");
}

// =====================
// FAQs
// =====================
export async function upsertFaq(formData: FormData) {
  const id = str(formData.get("id"));
  const question = str(formData.get("question"));
  const answer = str(formData.get("answer"));
  if (!question || !answer) return;
  const category = (str(formData.get("category")) || "general") as
    | "engagement"
    | "technical"
    | "pricing"
    | "general";
  const payload = {
    category,
    question,
    answer,
    order_index: int(formData.get("order_index")),
    published: bool(formData.get("published")),
  };
  const supabase = await createClient();
  if (id) {
    await supabase.from("faqs").update(payload).eq("id", id);
  } else {
    await supabase.from("faqs").insert(payload);
  }
  revalidatePath("/faq");
  revalidatePath("/control/faqs");
}

export async function deleteFaq(formData: FormData) {
  const id = String(formData.get("id"));
  if (!id) return;
  const supabase = await createClient();
  await supabase.from("faqs").delete().eq("id", id);
  revalidatePath("/faq");
  revalidatePath("/control/faqs");
}

// =====================
// Process steps
// =====================
export async function upsertProcessStep(formData: FormData) {
  const id = str(formData.get("id"));
  const title = str(formData.get("title"));
  if (!title) return;
  const payload = {
    step_number: int(formData.get("step_number")),
    title,
    duration: str(formData.get("duration")),
    description: str(formData.get("description")),
    deliverables: csv(formData.get("deliverables")),
    order_index: int(formData.get("order_index")),
  };
  const supabase = await createClient();
  if (id) {
    await supabase.from("process_steps").update(payload).eq("id", id);
  } else {
    await supabase.from("process_steps").insert(payload);
  }
  revalidatePath("/process");
  revalidatePath("/control/process");
}

export async function deleteProcessStep(formData: FormData) {
  const id = String(formData.get("id"));
  if (!id) return;
  const supabase = await createClient();
  await supabase.from("process_steps").delete().eq("id", id);
  revalidatePath("/process");
  revalidatePath("/control/process");
}

// =====================
// Skill groups + items
// =====================
export async function upsertSkillGroup(formData: FormData) {
  const id = str(formData.get("id"));
  const name = str(formData.get("name"));
  if (!name) return;
  const slug = ensureSlug(str(formData.get("slug")), name);
  const payload = {
    slug,
    name,
    description: str(formData.get("description")),
    order_index: int(formData.get("order_index")),
  };
  const supabase = await createClient();
  if (id) {
    await supabase.from("skill_groups").update(payload).eq("id", id);
  } else {
    await supabase.from("skill_groups").insert(payload);
  }
  revalidatePath("/skills");
  revalidatePath("/control/skills");
}

export async function deleteSkillGroup(formData: FormData) {
  const id = String(formData.get("id"));
  if (!id) return;
  const supabase = await createClient();
  await supabase.from("skill_groups").delete().eq("id", id);
  revalidatePath("/skills");
  revalidatePath("/control/skills");
}

export async function upsertSkillItem(formData: FormData) {
  const id = str(formData.get("id"));
  const group_id = str(formData.get("group_id"));
  const name = str(formData.get("name"));
  if (!group_id || !name) return;
  const level = Math.max(1, Math.min(5, int(formData.get("level"), 3)));
  const payload = {
    group_id,
    name,
    level,
    years: int(formData.get("years")),
    note: str(formData.get("note")),
    order_index: int(formData.get("order_index")),
  };
  const supabase = await createClient();
  if (id) {
    await supabase.from("skill_items").update(payload).eq("id", id);
  } else {
    await supabase.from("skill_items").insert(payload);
  }
  revalidatePath("/skills");
  revalidatePath("/control/skills");
}

export async function deleteSkillItem(formData: FormData) {
  const id = String(formData.get("id"));
  if (!id) return;
  const supabase = await createClient();
  await supabase.from("skill_items").delete().eq("id", id);
  revalidatePath("/skills");
  revalidatePath("/control/skills");
}

// =====================
// Certifications
// =====================
export async function upsertCertification(formData: FormData) {
  const id = str(formData.get("id"));
  const name = str(formData.get("name"));
  const issuer = str(formData.get("issuer"));
  if (!name || !issuer) return;
  const status = (str(formData.get("status")) || "active") as
    | "active"
    | "expired";
  const yearVal = str(formData.get("year"));
  const payload = {
    name,
    issuer,
    year: yearVal ? int(yearVal) : null,
    credential_id: str(formData.get("credential_id")),
    url: str(formData.get("url")),
    status,
    order_index: int(formData.get("order_index")),
    published: bool(formData.get("published")),
  };
  const supabase = await createClient();
  if (id) {
    await supabase.from("certifications").update(payload).eq("id", id);
  } else {
    await supabase.from("certifications").insert(payload);
  }
  revalidatePath("/certifications");
  revalidatePath("/control/certifications");
}

export async function deleteCertification(formData: FormData) {
  const id = String(formData.get("id"));
  if (!id) return;
  const supabase = await createClient();
  await supabase.from("certifications").delete().eq("id", id);
  revalidatePath("/certifications");
  revalidatePath("/control/certifications");
}
