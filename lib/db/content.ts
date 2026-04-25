import "server-only";

import { createClient } from "@/lib/supabase/server";
import type {
  BlogPostRow,
  CaseStudyRow,
  IndustryRow,
  ServiceRow,
  SolutionRow,
  TechnologyCategoryRow,
  TechnologyCategoryWithItems,
  TechnologyItemRow,
  TestimonialRow,
} from "@/lib/types";

import { blogPosts as staticBlogPosts } from "@/lib/content/blog";
import { services as staticServices } from "@/lib/content/services";
import { solutions as staticSolutions } from "@/lib/content/solutions";
import { caseStudies as staticCaseStudies } from "@/lib/content/work";

// =====================
// Static-content fallbacks
// =====================
// When the DB is empty (e.g. before the admin has been used to populate
// content) we fall back to the hand-authored content modules so the
// public site keeps rendering. The shapes from lib/content/* are a
// subset of the *Row shapes — fields not present statically default to
// sensible neutral values (`null`, `[]`, `0`, `true`).

function nowIso(): string {
  return new Date().toISOString();
}

function staticServicesAsRows(): ServiceRow[] {
  return staticServices.map((s, i) => ({
    id: `static-service-${s.slug}`,
    slug: s.slug,
    title: s.title,
    tagline: s.tagline ?? null,
    short_description: s.shortDescription ?? null,
    description: s.description ?? null,
    content: s.content ?? null,
    icon: s.icon ?? null,
    benefits: s.benefits ?? [],
    deliverables: s.deliverables ?? [],
    stack: s.stack ?? [],
    order_index: i,
    published: true,
    created_at: nowIso(),
    updated_at: nowIso(),
  }));
}

function staticSolutionsAsRows(): SolutionRow[] {
  return staticSolutions.map((s, i) => ({
    id: `static-solution-${s.slug}`,
    slug: s.slug,
    title: s.title,
    tagline: s.tagline ?? null,
    short_description: s.shortDescription ?? null,
    outcomes: s.outcomes ?? [],
    content: s.content ?? null,
    order_index: i,
    published: true,
    created_at: nowIso(),
    updated_at: nowIso(),
  }));
}

function staticCaseStudiesAsRows(): CaseStudyRow[] {
  return staticCaseStudies.map((c, i) => ({
    id: `static-case-${c.slug}`,
    slug: c.slug,
    title: c.title,
    client: c.client ?? null,
    industry: c.industry ?? null,
    duration: c.duration ?? null,
    team: c.team ?? null,
    tags: c.tags ?? [],
    outcome: c.outcome ?? null,
    metrics: c.metrics ?? [],
    problem: c.problem ?? null,
    approach: c.approach ?? [],
    result: c.result ?? null,
    stack: c.stack ?? [],
    published: true,
    order_index: i,
    created_at: nowIso(),
    updated_at: nowIso(),
  }));
}

function staticBlogPostsAsRows(): BlogPostRow[] {
  return staticBlogPosts.map((p) => ({
    id: `static-blog-${p.slug}`,
    slug: p.slug,
    title: p.title,
    description: p.description ?? null,
    content: p.content ?? null,
    tags: p.tags ?? [],
    published: true,
    published_at: p.publishedAt ?? null,
    reading_time: p.readingTime ?? null,
    created_at: p.publishedAt ?? nowIso(),
    updated_at: p.publishedAt ?? nowIso(),
  }));
}

// =====================
// Services
// =====================
export async function getPublishedServices(): Promise<ServiceRow[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .eq("published", true)
      .order("order_index", { ascending: true });

    if (error) throw error;
    if (data && data.length > 0) return data as ServiceRow[];
  } catch {
    // fall through to static
  }
  return staticServicesAsRows();
}

export async function getServiceBySlug(
  slug: string,
): Promise<ServiceRow | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .eq("slug", slug)
      .eq("published", true)
      .maybeSingle();

    if (error) throw error;
    if (data) return data as ServiceRow;
  } catch {
    // fall through
  }
  return staticServicesAsRows().find((s) => s.slug === slug) ?? null;
}

// =====================
// Solutions
// =====================
export async function getPublishedSolutions(): Promise<SolutionRow[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("solutions")
      .select("*")
      .eq("published", true)
      .order("order_index", { ascending: true });

    if (error) throw error;
    if (data && data.length > 0) return data as SolutionRow[];
  } catch {
    // fall through
  }
  return staticSolutionsAsRows();
}

export async function getSolutionBySlug(
  slug: string,
): Promise<SolutionRow | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("solutions")
      .select("*")
      .eq("slug", slug)
      .eq("published", true)
      .maybeSingle();

    if (error) throw error;
    if (data) return data as SolutionRow;
  } catch {
    // fall through
  }
  return staticSolutionsAsRows().find((s) => s.slug === slug) ?? null;
}

// =====================
// Case studies
// =====================
export async function getPublishedCaseStudies(): Promise<CaseStudyRow[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("case_studies")
      .select("*")
      .eq("published", true)
      .order("order_index", { ascending: true });

    if (error) throw error;
    if (data && data.length > 0) return data as CaseStudyRow[];
  } catch {
    // fall through
  }
  return staticCaseStudiesAsRows();
}

export async function getCaseStudyBySlug(
  slug: string,
): Promise<CaseStudyRow | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("case_studies")
      .select("*")
      .eq("slug", slug)
      .eq("published", true)
      .maybeSingle();

    if (error) throw error;
    if (data) return data as CaseStudyRow;
  } catch {
    // fall through
  }
  return staticCaseStudiesAsRows().find((c) => c.slug === slug) ?? null;
}

// =====================
// Industries
// =====================
export async function getPublishedIndustries(): Promise<IndustryRow[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("industries")
      .select("*")
      .eq("published", true)
      .order("order_index", { ascending: true });

    if (error) throw error;
    if (data && data.length > 0) return data as IndustryRow[];
  } catch {
    // fall through
  }
  // No static fallback exists for industries yet.
  return [];
}

export async function getIndustryBySlug(
  slug: string,
): Promise<IndustryRow | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("industries")
      .select("*")
      .eq("slug", slug)
      .eq("published", true)
      .maybeSingle();

    if (error) throw error;
    if (data) return data as IndustryRow;
  } catch {
    // fall through
  }
  return null;
}

// =====================
// Testimonials
// =====================
export async function getPublishedTestimonials(): Promise<TestimonialRow[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("testimonials")
      .select("*")
      .eq("published", true)
      .order("order_index", { ascending: true });

    if (error) throw error;
    if (data && data.length > 0) return data as TestimonialRow[];
  } catch {
    // fall through
  }
  return [];
}

// =====================
// Blog posts
// =====================
export async function getPublishedBlogPosts(): Promise<BlogPostRow[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("published", true)
      .order("published_at", { ascending: false });

    if (error) throw error;
    if (data && data.length > 0) return data as BlogPostRow[];
  } catch {
    // fall through
  }
  return staticBlogPostsAsRows();
}

export async function getBlogPostBySlug(
  slug: string,
): Promise<BlogPostRow | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("slug", slug)
      .eq("published", true)
      .maybeSingle();

    if (error) throw error;
    if (data) return data as BlogPostRow;
  } catch {
    // fall through
  }
  return staticBlogPostsAsRows().find((p) => p.slug === slug) ?? null;
}

// =====================
// Technology stack
// =====================
export async function getTechnologyStack(): Promise<
  TechnologyCategoryWithItems[]
> {
  try {
    const supabase = await createClient();
    const [catsRes, itemsRes] = await Promise.all([
      supabase
        .from("technology_categories")
        .select("*")
        .order("order_index", { ascending: true }),
      supabase
        .from("technology_items")
        .select("*")
        .order("order_index", { ascending: true }),
    ]);

    if (catsRes.error) throw catsRes.error;
    if (itemsRes.error) throw itemsRes.error;

    const categories = (catsRes.data ?? []) as TechnologyCategoryRow[];
    const items = (itemsRes.data ?? []) as TechnologyItemRow[];

    if (categories.length > 0) {
      return categories.map((c) => ({
        ...c,
        items: items.filter((it) => it.category_id === c.id),
      }));
    }
  } catch {
    // fall through
  }
  // No static fallback yet.
  return [];
}
