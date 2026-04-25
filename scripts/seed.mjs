// ===================================================================
// narendrapandrinki.com — Content seed script
// -------------------------------------------------------------------
// Reads the static content modules under lib/content/*.ts and upserts
// each row into the corresponding Supabase content table using the
// service-role key. Idempotent: safe to re-run.
//
// Usage:
//   SUPABASE_SERVICE_ROLE_KEY="..." \
//   NEXT_PUBLIC_SUPABASE_URL="https://<ref>.supabase.co" \
//     node --experimental-strip-types scripts/seed.mjs
//
// Node 22+ is required for the experimental TypeScript loader so we
// can `import("../lib/content/services.ts")` directly without a build
// step. If your Node is older, install `tsx` and run with
// `npx tsx scripts/seed.mjs` instead.
// ===================================================================

import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { readFileSync, existsSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = resolve(__dirname, "..");

// -----------------------------------------------------------------
// Env loading — pull from .env.local if not already in process.env
// -----------------------------------------------------------------
function loadDotEnv() {
  const envPath = resolve(ROOT, ".env.local");
  if (!existsSync(envPath)) return;
  const raw = readFileSync(envPath, "utf8");
  for (const line of raw.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq < 0) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!(key in process.env)) {
      process.env[key] = value;
    }
  }
}
loadDotEnv();

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE) {
  console.error(
    "[seed] Missing env: SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY",
  );
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE, {
  auth: { persistSession: false, autoRefreshToken: false },
});

// -----------------------------------------------------------------
// Static content modules — loaded dynamically so this script works
// whether you run it via `node --experimental-strip-types` or via
// `tsx`. Both honour the .ts extension.
// -----------------------------------------------------------------
const contentDir = resolve(ROOT, "lib/content");

async function loadStatic() {
  const [services, solutions, work, industries, technology, testimonials, blog] =
    await Promise.all([
      import(resolve(contentDir, "services.ts")),
      import(resolve(contentDir, "solutions.ts")),
      import(resolve(contentDir, "work.ts")),
      import(resolve(contentDir, "industries.ts")),
      import(resolve(contentDir, "technology.ts")),
      import(resolve(contentDir, "testimonials.ts")),
      import(resolve(contentDir, "_blog_part1.ts")),
    ]);
  return {
    services: services.services,
    solutions: solutions.solutions,
    caseStudies: work.caseStudies,
    industries: industries.industries,
    technology: technology.technology,
    testimonials: testimonials.testimonials,
    blogPosts: blog.part1 ?? [],
  };
}

// -----------------------------------------------------------------
// Seeders
// -----------------------------------------------------------------
async function seedServices(rows) {
  const payload = rows.map((s, i) => ({
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
  }));
  const { error, count } = await supabase
    .from("services")
    .upsert(payload, { onConflict: "slug", count: "exact" });
  if (error) throw new Error(`services: ${error.message}`);
  return count ?? payload.length;
}

async function seedSolutions(rows) {
  const payload = rows.map((s, i) => ({
    slug: s.slug,
    title: s.title,
    tagline: s.tagline ?? null,
    short_description: s.shortDescription ?? null,
    outcomes: s.outcomes ?? [],
    content: s.content ?? null,
    order_index: i,
    published: true,
  }));
  const { error, count } = await supabase
    .from("solutions")
    .upsert(payload, { onConflict: "slug", count: "exact" });
  if (error) throw new Error(`solutions: ${error.message}`);
  return count ?? payload.length;
}

async function seedCaseStudies(rows) {
  const payload = rows.map((c, i) => ({
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
    order_index: i,
    published: true,
  }));
  const { error, count } = await supabase
    .from("case_studies")
    .upsert(payload, { onConflict: "slug", count: "exact" });
  if (error) throw new Error(`case_studies: ${error.message}`);
  return count ?? payload.length;
}

async function seedIndustries(rows) {
  const payload = rows.map((ind, i) => ({
    slug: ind.slug,
    title: ind.title,
    tagline: ind.tagline ?? null,
    short_description: ind.shortDescription ?? null,
    pain_points: ind.painPoints ?? [],
    how_i_help: ind.howIHelp ?? null,
    common_stack: ind.commonStack ?? [],
    typical_engagement: ind.typicalEngagement ?? null,
    content: ind.content ?? null,
    order_index: i,
    published: true,
  }));
  const { error, count } = await supabase
    .from("industries")
    .upsert(payload, { onConflict: "slug", count: "exact" });
  if (error) throw new Error(`industries: ${error.message}`);
  return count ?? payload.length;
}

async function seedTechnology(categories) {
  // Upsert categories first.
  const catPayload = categories.map((c, i) => ({
    slug: c.slug,
    name: c.name,
    description: c.description ?? null,
    order_index: i,
  }));
  const { error: catErr } = await supabase
    .from("technology_categories")
    .upsert(catPayload, { onConflict: "slug" });
  if (catErr) throw new Error(`technology_categories: ${catErr.message}`);

  // Read the rows back to get IDs.
  const { data: catRows, error: readErr } = await supabase
    .from("technology_categories")
    .select("id, slug");
  if (readErr) throw new Error(`technology_categories read: ${readErr.message}`);
  const catBySlug = new Map(catRows.map((r) => [r.slug, r.id]));

  // Wipe items for these categories then re-insert (no natural unique key).
  const catIds = catRows.map((r) => r.id);
  if (catIds.length > 0) {
    const { error: delErr } = await supabase
      .from("technology_items")
      .delete()
      .in("category_id", catIds);
    if (delErr) throw new Error(`technology_items wipe: ${delErr.message}`);
  }

  const itemPayload = [];
  for (const cat of categories) {
    const categoryId = catBySlug.get(cat.slug);
    if (!categoryId) continue;
    cat.items.forEach((it, i) => {
      itemPayload.push({
        category_id: categoryId,
        name: it.name,
        role: it.role,
        note: it.note ?? null,
        order_index: i,
      });
    });
  }

  if (itemPayload.length > 0) {
    const { error: insErr } = await supabase
      .from("technology_items")
      .insert(itemPayload);
    if (insErr) throw new Error(`technology_items: ${insErr.message}`);
  }

  return { categories: catPayload.length, items: itemPayload.length };
}

async function seedTestimonials(rows) {
  // No natural unique key in the schema. Wipe + re-insert.
  const { error: delErr } = await supabase
    .from("testimonials")
    .delete()
    .gte("created_at", "1900-01-01");
  if (delErr) throw new Error(`testimonials wipe: ${delErr.message}`);

  const payload = rows.map((t, i) => ({
    quote: t.quote,
    author: t.author,
    role: null,
    company: null,
    industry: null,
    order_index: i,
    published: true,
  }));
  const { error, count } = await supabase
    .from("testimonials")
    .insert(payload, { count: "exact" });
  if (error) throw new Error(`testimonials: ${error.message}`);
  return count ?? payload.length;
}

async function seedBlogPosts(rows) {
  const payload = rows.map((p) => ({
    slug: p.slug,
    title: p.title,
    description: p.description ?? null,
    content: p.content ?? null,
    tags: p.tags ?? [],
    reading_time: p.readingTime ?? null,
    published: true,
    published_at: p.publishedAt ?? null,
  }));
  const { error, count } = await supabase
    .from("blog_posts")
    .upsert(payload, { onConflict: "slug", count: "exact" });
  if (error) throw new Error(`blog_posts: ${error.message}`);
  return count ?? payload.length;
}

// -----------------------------------------------------------------
// Main
// -----------------------------------------------------------------
async function main() {
  console.log("[seed] Loading static content modules…");
  const data = await loadStatic();
  console.log("[seed] Loaded:", {
    services: data.services.length,
    solutions: data.solutions.length,
    caseStudies: data.caseStudies.length,
    industries: data.industries.length,
    technologyCategories: data.technology.length,
    testimonials: data.testimonials.length,
    blogPosts: data.blogPosts.length,
  });

  const summary = {};

  console.log("[seed] services…");
  summary.services = await seedServices(data.services);

  console.log("[seed] solutions…");
  summary.solutions = await seedSolutions(data.solutions);

  console.log("[seed] case_studies…");
  summary.caseStudies = await seedCaseStudies(data.caseStudies);

  console.log("[seed] industries…");
  summary.industries = await seedIndustries(data.industries);

  console.log("[seed] technology…");
  summary.technology = await seedTechnology(data.technology);

  console.log("[seed] testimonials…");
  summary.testimonials = await seedTestimonials(data.testimonials);

  console.log("[seed] blog_posts…");
  summary.blogPosts = await seedBlogPosts(data.blogPosts);

  console.log("\n[seed] Done. Summary:");
  console.log(JSON.stringify(summary, null, 2));
}

main().catch((err) => {
  console.error("[seed] FAILED:", err);
  process.exit(1);
});
