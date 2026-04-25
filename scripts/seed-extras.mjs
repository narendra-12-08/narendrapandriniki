// ===================================================================
// narendrapandrinki.com — Editable-sections seed script
// -------------------------------------------------------------------
// Reads static content from lib/content/* (about, pricing, faq, process,
// skills, certifications) and upserts into the corresponding tables
// added by 20260401000000_editable_sections.sql.
//
// Usage:
//   SUPABASE_SERVICE_ROLE_KEY="..." \
//   NEXT_PUBLIC_SUPABASE_URL="https://<ref>.supabase.co" \
//     node --experimental-strip-types scripts/seed-extras.mjs
//
// Idempotent: safe to re-run.
// ===================================================================

import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { readFileSync, existsSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = resolve(__dirname, "..");

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
    let val = trimmed.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = val;
  }
}
loadDotEnv();

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

async function upsertByKey(table, rows, conflictKey) {
  const { error } = await supabase
    .from(table)
    .upsert(rows, { onConflict: conflictKey });
  if (error) throw new Error(`upsert ${table}: ${error.message}`);
  console.log(`  ✓ ${table}: ${rows.length} rows`);
}

async function replaceAll(table, rows) {
  // Wipe and insert — used for tables without a natural unique key.
  const { error: delErr } = await supabase
    .from(table)
    .delete()
    .gte("created_at", "1900-01-01");
  if (delErr) throw new Error(`delete ${table}: ${delErr.message}`);
  if (rows.length === 0) {
    console.log(`  ✓ ${table}: cleared`);
    return;
  }
  const { error } = await supabase.from(table).insert(rows);
  if (error) throw new Error(`insert ${table}: ${error.message}`);
  console.log(`  ✓ ${table}: ${rows.length} rows`);
}

async function main() {
  console.log("Seeding editable sections...");

  // ---- About ----
  const { bio, principles, timeline, availability } = await import(
    "../lib/content/about.ts"
  );
  const bioParagraphs = bio.trim().split(/\n\n+/);
  await upsertByKey(
    "pages_content",
    [
      { key: "bio_paragraphs", value: JSON.stringify(bioParagraphs) },
      { key: "availability_text", value: availability },
    ],
    "key",
  );

  await replaceAll(
    "principles",
    principles.map((p, i) => ({
      title: p.title,
      description: p.description,
      order_index: i,
      published: true,
    })),
  );

  await replaceAll(
    "timeline_entries",
    timeline.map((t, i) => ({
      year: t.year,
      title: t.title,
      description: t.description,
      order_index: i,
    })),
  );

  // ---- Pricing ----
  const { pricingTiers } = await import("../lib/content/pricing.ts");
  await upsertByKey(
    "pricing_tiers",
    pricingTiers.map((t, i) => ({
      slug: t.slug,
      name: t.name,
      tagline: t.tagline,
      price_label: t.priceLabel,
      price_note: t.priceNote,
      description: t.description,
      ideal_for: t.idealFor,
      includes: t.includes ?? [],
      not_included: t.notIncluded ?? [],
      cta: t.cta,
      order_index: i,
      published: true,
    })),
    "slug",
  );

  // ---- FAQs ----
  const { faqs } = await import("../lib/content/faq.ts");
  await replaceAll(
    "faqs",
    faqs.map((f, i) => ({
      category: f.category,
      question: f.question,
      answer: f.answer,
      order_index: i,
      published: true,
    })),
  );

  // ---- Process ----
  const { process: processSteps } = await import("../lib/content/process.ts");
  await replaceAll(
    "process_steps",
    processSteps.map((s, i) => ({
      step_number: s.number,
      title: s.title,
      duration: s.duration,
      description: s.description,
      deliverables: s.deliverables ?? [],
      order_index: i,
    })),
  );

  // ---- Skills (groups + items) ----
  const { skillsMatrix } = await import("../lib/content/skills.ts");
  // Wipe items via cascade by deleting groups
  {
    const { error } = await supabase
      .from("skill_groups")
      .delete()
      .gte("created_at", "1900-01-01");
    if (error) throw new Error(`delete skill_groups: ${error.message}`);
  }
  for (let i = 0; i < skillsMatrix.length; i++) {
    const g = skillsMatrix[i];
    const slug = slugify(g.name);
    const { data: inserted, error } = await supabase
      .from("skill_groups")
      .insert({
        name: g.name,
        slug,
        description: g.tagline ?? null,
        order_index: i,
      })
      .select("id")
      .single();
    if (error) throw new Error(`insert skill_groups: ${error.message}`);
    const groupId = inserted.id;
    const items = g.skills.map((s, j) => ({
      group_id: groupId,
      name: s.name,
      level: s.level,
      years: s.years ?? 0,
      note: s.note ?? null,
      order_index: j,
    }));
    if (items.length > 0) {
      const { error: itemErr } = await supabase.from("skill_items").insert(items);
      if (itemErr) throw new Error(`insert skill_items: ${itemErr.message}`);
    }
  }
  console.log(`  ✓ skill_groups + skill_items seeded (${skillsMatrix.length} groups)`);

  // ---- Certifications ----
  const { certifications } = await import("../lib/content/certifications.ts");
  await replaceAll(
    "certifications",
    certifications.map((c, i) => ({
      name: c.name,
      issuer: c.issuer,
      year: c.year,
      credential_id: c.credentialId ?? null,
      url: c.url ?? null,
      status: c.status,
      order_index: i,
      published: true,
    })),
  );

  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
