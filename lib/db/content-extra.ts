import "server-only";

import { createClient } from "@/lib/supabase/server";
import {
  bio as staticBio,
  principles as staticPrinciples,
  timeline as staticTimeline,
  availability as staticAvailability,
} from "@/lib/content/about";
import { pricingTiers as staticPricingTiers } from "@/lib/content/pricing";
import { faqs as staticFaqs } from "@/lib/content/faq";
import { process as staticProcess } from "@/lib/content/process";
import { skillsMatrix as staticSkillsMatrix } from "@/lib/content/skills";
import { certifications as staticCertifications } from "@/lib/content/certifications";

// =====================
// Row types
// =====================
export type PrincipleRow = {
  id: string;
  title: string;
  description: string;
  order_index: number;
  published: boolean;
  created_at: string;
  updated_at: string;
};

export type TimelineEntryRow = {
  id: string;
  year: string;
  title: string;
  description: string;
  order_index: number;
  created_at: string;
  updated_at: string;
};

export type PricingTierRow = {
  id: string;
  slug: string;
  name: string;
  tagline: string | null;
  price_label: string | null;
  price_note: string | null;
  description: string | null;
  ideal_for: string | null;
  includes: string[];
  not_included: string[];
  cta: string | null;
  order_index: number;
  published: boolean;
  created_at: string;
  updated_at: string;
};

export type FaqCategory = "engagement" | "technical" | "pricing" | "general";

export type FaqRow = {
  id: string;
  category: FaqCategory;
  question: string;
  answer: string;
  order_index: number;
  published: boolean;
  created_at: string;
  updated_at: string;
};

export type ProcessStepRow = {
  id: string;
  step_number: number;
  title: string;
  duration: string | null;
  description: string | null;
  deliverables: string[];
  order_index: number;
  created_at: string;
  updated_at: string;
};

export type SkillGroupRow = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  order_index: number;
  created_at: string;
  updated_at: string;
};

export type SkillItemRow = {
  id: string;
  group_id: string;
  name: string;
  level: number;
  years: number;
  note: string | null;
  order_index: number;
  created_at: string;
  updated_at: string;
};

export type SkillGroupWithItems = SkillGroupRow & { items: SkillItemRow[] };

export type CertificationRow = {
  id: string;
  name: string;
  issuer: string;
  year: number | null;
  credential_id: string | null;
  url: string | null;
  status: "active" | "expired";
  order_index: number;
  published: boolean;
  created_at: string;
  updated_at: string;
};

export type PagesContentRow = {
  id: string;
  key: string;
  value: string | null;
  created_at: string;
  updated_at: string;
};

// =====================
// Static fallbacks
// =====================
function nowIso(): string {
  return new Date().toISOString();
}

function staticPrinciplesAsRows(): PrincipleRow[] {
  return staticPrinciples.map((p, i) => ({
    id: `static-principle-${i}`,
    title: p.title,
    description: p.description,
    order_index: i,
    published: true,
    created_at: nowIso(),
    updated_at: nowIso(),
  }));
}

function staticTimelineAsRows(): TimelineEntryRow[] {
  return staticTimeline.map((t, i) => ({
    id: `static-timeline-${i}`,
    year: t.year,
    title: t.title,
    description: t.description,
    order_index: i,
    created_at: nowIso(),
    updated_at: nowIso(),
  }));
}

function staticPricingAsRows(): PricingTierRow[] {
  return staticPricingTiers.map((t, i) => ({
    id: `static-tier-${t.slug}`,
    slug: t.slug,
    name: t.name,
    tagline: t.tagline ?? null,
    price_label: t.priceLabel ?? null,
    price_note: t.priceNote ?? null,
    description: t.description ?? null,
    ideal_for: t.idealFor ?? null,
    includes: t.includes ?? [],
    not_included: t.notIncluded ?? [],
    cta: t.cta ?? null,
    order_index: i,
    published: true,
    created_at: nowIso(),
    updated_at: nowIso(),
  }));
}

function staticFaqsAsRows(): FaqRow[] {
  return staticFaqs.map((f, i) => ({
    id: `static-faq-${f.id}`,
    category: f.category,
    question: f.question,
    answer: f.answer,
    order_index: i,
    published: true,
    created_at: nowIso(),
    updated_at: nowIso(),
  }));
}

function staticProcessAsRows(): ProcessStepRow[] {
  return staticProcess.map((s, i) => ({
    id: `static-step-${s.number}`,
    step_number: s.number,
    title: s.title,
    duration: s.duration,
    description: s.description,
    deliverables: s.deliverables ?? [],
    order_index: i,
    created_at: nowIso(),
    updated_at: nowIso(),
  }));
}

function slugifySimple(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

function staticSkillGroupsAsRows(): SkillGroupWithItems[] {
  return staticSkillsMatrix.map((g, i) => {
    const groupId = `static-group-${i}`;
    return {
      id: groupId,
      name: g.name,
      slug: slugifySimple(g.name),
      description: g.tagline ?? null,
      order_index: i,
      created_at: nowIso(),
      updated_at: nowIso(),
      items: g.skills.map((s, j) => ({
        id: `${groupId}-${j}`,
        group_id: groupId,
        name: s.name,
        level: s.level,
        years: s.years ?? 0,
        note: s.note ?? null,
        order_index: j,
        created_at: nowIso(),
        updated_at: nowIso(),
      })),
    };
  });
}

function staticCertificationsAsRows(): CertificationRow[] {
  return staticCertifications.map((c, i) => ({
    id: `static-cert-${c.id}`,
    name: c.name,
    issuer: c.issuer,
    year: c.year,
    credential_id: c.credentialId ?? null,
    url: c.url ?? null,
    status: c.status,
    order_index: i,
    published: true,
    created_at: nowIso(),
    updated_at: nowIso(),
  }));
}

// =====================
// Helpers
// =====================

export async function getPagesContent(key: string): Promise<string | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("pages_content")
      .select("value")
      .eq("key", key)
      .maybeSingle();
    if (error) throw error;
    if (data && typeof data.value === "string") return data.value;
  } catch {
    // fall through
  }
  // Static fallbacks for known keys
  if (key === "availability_text") return staticAvailability;
  if (key === "bio_paragraphs") {
    return JSON.stringify(staticBio.trim().split(/\n\n+/));
  }
  return null;
}

export async function getBioParagraphs(): Promise<string[]> {
  const raw = await getPagesContent("bio_paragraphs");
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.every((p) => typeof p === "string")) {
        return parsed;
      }
    } catch {
      // not JSON — treat as a single paragraph
      return [raw];
    }
  }
  return staticBio.trim().split(/\n\n+/);
}

export async function getAvailabilityText(): Promise<string> {
  const v = await getPagesContent("availability_text");
  return v ?? staticAvailability;
}

export async function getPrinciples(): Promise<PrincipleRow[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("principles")
      .select("*")
      .eq("published", true)
      .order("order_index", { ascending: true });
    if (error) throw error;
    if (data && data.length > 0) return data as PrincipleRow[];
  } catch {
    // fall through
  }
  return staticPrinciplesAsRows();
}

export async function getTimeline(): Promise<TimelineEntryRow[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("timeline_entries")
      .select("*")
      .order("order_index", { ascending: true });
    if (error) throw error;
    if (data && data.length > 0) return data as TimelineEntryRow[];
  } catch {
    // fall through
  }
  return staticTimelineAsRows();
}

export async function getPricingTiers(): Promise<PricingTierRow[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("pricing_tiers")
      .select("*")
      .eq("published", true)
      .order("order_index", { ascending: true });
    if (error) throw error;
    if (data && data.length > 0) return data as PricingTierRow[];
  } catch {
    // fall through
  }
  return staticPricingAsRows();
}

export async function getFaqs(): Promise<FaqRow[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("faqs")
      .select("*")
      .eq("published", true)
      .order("category", { ascending: true })
      .order("order_index", { ascending: true });
    if (error) throw error;
    if (data && data.length > 0) return data as FaqRow[];
  } catch {
    // fall through
  }
  return staticFaqsAsRows();
}

export async function getProcessSteps(): Promise<ProcessStepRow[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("process_steps")
      .select("*")
      .order("step_number", { ascending: true });
    if (error) throw error;
    if (data && data.length > 0) return data as ProcessStepRow[];
  } catch {
    // fall through
  }
  return staticProcessAsRows();
}

export async function getSkillGroups(): Promise<SkillGroupWithItems[]> {
  try {
    const supabase = await createClient();
    const [groupsRes, itemsRes] = await Promise.all([
      supabase
        .from("skill_groups")
        .select("*")
        .order("order_index", { ascending: true }),
      supabase
        .from("skill_items")
        .select("*")
        .order("order_index", { ascending: true }),
    ]);
    if (groupsRes.error) throw groupsRes.error;
    if (itemsRes.error) throw itemsRes.error;
    const groups = (groupsRes.data ?? []) as SkillGroupRow[];
    const items = (itemsRes.data ?? []) as SkillItemRow[];
    if (groups.length > 0) {
      return groups.map((g) => ({
        ...g,
        items: items.filter((it) => it.group_id === g.id),
      }));
    }
  } catch {
    // fall through
  }
  return staticSkillGroupsAsRows();
}

export async function getCertifications(): Promise<CertificationRow[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("certifications")
      .select("*")
      .eq("published", true)
      .order("year", { ascending: false })
      .order("order_index", { ascending: true });
    if (error) throw error;
    if (data && data.length > 0) return data as CertificationRow[];
  } catch {
    // fall through
  }
  return staticCertificationsAsRows();
}

// Admin variants — return everything regardless of published flag.
// Server components in /app/control/* read these.
export async function getAllPrinciplesAdmin(): Promise<PrincipleRow[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("principles")
    .select("*")
    .order("order_index", { ascending: true });
  return (data ?? []) as PrincipleRow[];
}

export async function getAllTimelineAdmin(): Promise<TimelineEntryRow[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("timeline_entries")
    .select("*")
    .order("order_index", { ascending: true });
  return (data ?? []) as TimelineEntryRow[];
}

export async function getAllPricingTiersAdmin(): Promise<PricingTierRow[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("pricing_tiers")
    .select("*")
    .order("order_index", { ascending: true });
  return (data ?? []) as PricingTierRow[];
}

export async function getAllFaqsAdmin(): Promise<FaqRow[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("faqs")
    .select("*")
    .order("category", { ascending: true })
    .order("order_index", { ascending: true });
  return (data ?? []) as FaqRow[];
}

export async function getAllProcessStepsAdmin(): Promise<ProcessStepRow[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("process_steps")
    .select("*")
    .order("step_number", { ascending: true });
  return (data ?? []) as ProcessStepRow[];
}

export async function getAllSkillGroupsAdmin(): Promise<SkillGroupWithItems[]> {
  const supabase = await createClient();
  const [groupsRes, itemsRes] = await Promise.all([
    supabase
      .from("skill_groups")
      .select("*")
      .order("order_index", { ascending: true }),
    supabase
      .from("skill_items")
      .select("*")
      .order("order_index", { ascending: true }),
  ]);
  const groups = (groupsRes.data ?? []) as SkillGroupRow[];
  const items = (itemsRes.data ?? []) as SkillItemRow[];
  return groups.map((g) => ({
    ...g,
    items: items.filter((it) => it.group_id === g.id),
  }));
}

export async function getAllCertificationsAdmin(): Promise<CertificationRow[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("certifications")
    .select("*")
    .order("year", { ascending: false })
    .order("order_index", { ascending: true });
  return (data ?? []) as CertificationRow[];
}
