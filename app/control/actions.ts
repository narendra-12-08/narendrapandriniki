"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";

// =====================
// Helpers
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
// Auth
// =====================

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/control/login");
}

// =====================
// Inbox
// =====================

export async function updateInboxStatus(formData: FormData) {
  const id = String(formData.get("id"));
  const status = String(formData.get("status"));
  if (!id || !status) return;
  const supabase = await createClient();
  await supabase.from("inbox_messages").update({ status }).eq("id", id);
  revalidatePath("/control/inbox");
  revalidatePath("/control/dashboard");
}

export async function updateInboxNote(formData: FormData) {
  const id = String(formData.get("id"));
  const notes = str(formData.get("notes"));
  if (!id) return;
  const supabase = await createClient();
  await supabase.from("inbox_messages").update({ notes }).eq("id", id);
  revalidatePath("/control/inbox");
}

// =====================
// Clients
// =====================

export async function createClientRecord(formData: FormData) {
  const name = str(formData.get("name"));
  const email = str(formData.get("email"));
  if (!name || !email) return;
  const supabase = await createClient();
  await supabase.from("clients").insert({
    name,
    email,
    company: str(formData.get("company")),
    phone: str(formData.get("phone")),
    status: str(formData.get("status")) || "active",
  });
  revalidatePath("/control/clients");
}

// =====================
// Services
// =====================

export async function upsertService(formData: FormData) {
  const id = str(formData.get("id"));
  const title = str(formData.get("title"));
  if (!title) return;
  const slug = ensureSlug(str(formData.get("slug")), title);

  const payload = {
    slug,
    title,
    tagline: str(formData.get("tagline")),
    short_description: str(formData.get("short_description")),
    description: str(formData.get("description")),
    content: str(formData.get("content")),
    icon: str(formData.get("icon")),
    benefits: csv(formData.get("benefits")),
    deliverables: csv(formData.get("deliverables")),
    stack: csv(formData.get("stack")),
    order_index: int(formData.get("order_index")),
    published: bool(formData.get("published")),
  };

  const supabase = await createClient();
  if (id) {
    await supabase.from("services").update(payload).eq("id", id);
  } else {
    await supabase.from("services").insert(payload);
  }
  revalidatePath("/control/services");
}

export async function deleteService(formData: FormData) {
  const id = String(formData.get("id"));
  if (!id) return;
  const supabase = await createClient();
  await supabase.from("services").delete().eq("id", id);
  revalidatePath("/control/services");
}

// =====================
// Solutions
// =====================

export async function upsertSolution(formData: FormData) {
  const id = str(formData.get("id"));
  const title = str(formData.get("title"));
  if (!title) return;
  const slug = ensureSlug(str(formData.get("slug")), title);

  const payload = {
    slug,
    title,
    tagline: str(formData.get("tagline")),
    short_description: str(formData.get("short_description")),
    outcomes: csv(formData.get("outcomes")),
    content: str(formData.get("content")),
    order_index: int(formData.get("order_index")),
    published: bool(formData.get("published")),
  };

  const supabase = await createClient();
  if (id) {
    await supabase.from("solutions").update(payload).eq("id", id);
  } else {
    await supabase.from("solutions").insert(payload);
  }
  revalidatePath("/control/solutions");
}

export async function deleteSolution(formData: FormData) {
  const id = String(formData.get("id"));
  if (!id) return;
  const supabase = await createClient();
  await supabase.from("solutions").delete().eq("id", id);
  revalidatePath("/control/solutions");
}

// =====================
// Case studies
// =====================

export async function upsertCaseStudy(formData: FormData) {
  const id = str(formData.get("id"));
  const title = str(formData.get("title"));
  if (!title) return;
  const slug = ensureSlug(str(formData.get("slug")), title);

  // metrics: parse "label:value, label2:value2"
  const metricsRaw = (formData.get("metrics") ?? "").toString();
  const metrics = metricsRaw
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => {
      const [label, ...rest] = p.split(":");
      return { label: label.trim(), value: rest.join(":").trim() };
    })
    .filter((m) => m.label);

  const payload = {
    slug,
    title,
    client: str(formData.get("client")),
    industry: str(formData.get("industry")),
    duration: str(formData.get("duration")),
    team: str(formData.get("team")),
    tags: csv(formData.get("tags")),
    outcome: str(formData.get("outcome")),
    metrics,
    problem: str(formData.get("problem")),
    approach: csv(formData.get("approach")),
    result: str(formData.get("result")),
    stack: csv(formData.get("stack")),
    order_index: int(formData.get("order_index")),
    published: bool(formData.get("published")),
  };

  const supabase = await createClient();
  if (id) {
    await supabase.from("case_studies").update(payload).eq("id", id);
  } else {
    await supabase.from("case_studies").insert(payload);
  }
  revalidatePath("/control/case-studies");
}

export async function deleteCaseStudy(formData: FormData) {
  const id = String(formData.get("id"));
  if (!id) return;
  const supabase = await createClient();
  await supabase.from("case_studies").delete().eq("id", id);
  revalidatePath("/control/case-studies");
}

// =====================
// Industries
// =====================

export async function upsertIndustry(formData: FormData) {
  const id = str(formData.get("id"));
  const title = str(formData.get("title"));
  if (!title) return;
  const slug = ensureSlug(str(formData.get("slug")), title);

  const payload = {
    slug,
    title,
    tagline: str(formData.get("tagline")),
    short_description: str(formData.get("short_description")),
    pain_points: csv(formData.get("pain_points")),
    how_i_help: str(formData.get("how_i_help")),
    common_stack: csv(formData.get("common_stack")),
    typical_engagement: str(formData.get("typical_engagement")),
    content: str(formData.get("content")),
    order_index: int(formData.get("order_index")),
    published: bool(formData.get("published")),
  };

  const supabase = await createClient();
  if (id) {
    await supabase.from("industries").update(payload).eq("id", id);
  } else {
    await supabase.from("industries").insert(payload);
  }
  revalidatePath("/control/industries");
}

export async function deleteIndustry(formData: FormData) {
  const id = String(formData.get("id"));
  if (!id) return;
  const supabase = await createClient();
  await supabase.from("industries").delete().eq("id", id);
  revalidatePath("/control/industries");
}

// =====================
// Technology
// =====================

export async function upsertTechnologyCategory(formData: FormData) {
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
    await supabase.from("technology_categories").update(payload).eq("id", id);
  } else {
    await supabase.from("technology_categories").insert(payload);
  }
  revalidatePath("/control/technology");
}

export async function deleteTechnologyCategory(formData: FormData) {
  const id = String(formData.get("id"));
  if (!id) return;
  const supabase = await createClient();
  await supabase.from("technology_categories").delete().eq("id", id);
  revalidatePath("/control/technology");
}

export async function upsertTechnologyItem(formData: FormData) {
  const id = str(formData.get("id"));
  const category_id = str(formData.get("category_id"));
  const name = str(formData.get("name"));
  if (!category_id || !name) return;

  const payload = {
    category_id,
    name,
    role: (str(formData.get("role")) || "core") as "core" | "fluent" | "familiar",
    note: str(formData.get("note")),
    order_index: int(formData.get("order_index")),
  };

  const supabase = await createClient();
  if (id) {
    await supabase.from("technology_items").update(payload).eq("id", id);
  } else {
    await supabase.from("technology_items").insert(payload);
  }
  revalidatePath("/control/technology");
}

export async function deleteTechnologyItem(formData: FormData) {
  const id = String(formData.get("id"));
  if (!id) return;
  const supabase = await createClient();
  await supabase.from("technology_items").delete().eq("id", id);
  revalidatePath("/control/technology");
}

// =====================
// Testimonials
// =====================

export async function upsertTestimonial(formData: FormData) {
  const id = str(formData.get("id"));
  const quote = str(formData.get("quote"));
  const author = str(formData.get("author"));
  if (!quote || !author) return;

  const payload = {
    quote,
    author,
    role: str(formData.get("role")),
    company: str(formData.get("company")),
    industry: str(formData.get("industry")),
    order_index: int(formData.get("order_index")),
    published: bool(formData.get("published")),
  };

  const supabase = await createClient();
  if (id) {
    await supabase.from("testimonials").update(payload).eq("id", id);
  } else {
    await supabase.from("testimonials").insert(payload);
  }
  revalidatePath("/control/testimonials");
}

export async function deleteTestimonial(formData: FormData) {
  const id = String(formData.get("id"));
  if (!id) return;
  const supabase = await createClient();
  await supabase.from("testimonials").delete().eq("id", id);
  revalidatePath("/control/testimonials");
}

// =====================
// Blog posts (DB)
// =====================

export async function upsertBlogPost(formData: FormData) {
  const id = str(formData.get("id"));
  const title = str(formData.get("title"));
  if (!title) return;
  const slug = ensureSlug(str(formData.get("slug")), title);
  const published = bool(formData.get("published"));

  const payload = {
    slug,
    title,
    description: str(formData.get("description")),
    content: str(formData.get("content")),
    tags: csv(formData.get("tags")),
    published,
    published_at: published ? new Date().toISOString() : null,
    reading_time: int(formData.get("reading_time")) || null,
  };

  const supabase = await createClient();
  if (id) {
    await supabase.from("blog_posts").update(payload).eq("id", id);
  } else {
    await supabase.from("blog_posts").insert(payload);
  }
  revalidatePath("/control/blog");
}

export async function deleteBlogPost(formData: FormData) {
  const id = String(formData.get("id"));
  if (!id) return;
  const supabase = await createClient();
  await supabase.from("blog_posts").delete().eq("id", id);
  revalidatePath("/control/blog");
}

// =====================
// Site settings
// =====================

export async function upsertSiteSetting(formData: FormData) {
  const key = str(formData.get("key"));
  const value = (formData.get("value") ?? "").toString();
  if (!key) return;
  const supabase = await createClient();
  // Try update by key, fall back to insert
  const { data: existing } = await supabase
    .from("site_settings")
    .select("id")
    .eq("key", key)
    .maybeSingle();
  if (existing?.id) {
    await supabase
      .from("site_settings")
      .update({ value, updated_at: new Date().toISOString() })
      .eq("id", existing.id);
  } else {
    await supabase.from("site_settings").insert({ key, value });
  }
  revalidatePath("/control/settings");
}

export async function deleteSiteSetting(formData: FormData) {
  const id = String(formData.get("id"));
  if (!id) return;
  const supabase = await createClient();
  await supabase.from("site_settings").delete().eq("id", id);
  revalidatePath("/control/settings");
}
