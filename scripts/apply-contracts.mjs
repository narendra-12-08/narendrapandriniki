// Apply contracts migration + seed templates via Supabase Management API.
// Usage: node scripts/apply-contracts.mjs
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const PROJECT_REF = "pmiylelkgyapbcpystpu";
const TOKEN =
  process.env.SUPABASE_ACCESS_TOKEN ??
  "sbp_4a311241146325e646276b85b29411619ca34203";

async function runQuery(query) {
  const res = await fetch(
    `https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    }
  );
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${text}`);
  }
  return text;
}

const migrationPath = resolve(
  __dirname,
  "../supabase/migrations/20260501000000_contracts.sql"
);
const seedPath = resolve(
  __dirname,
  "../supabase/seeds/contract_templates.sql"
);

console.log("Applying migration 20260501000000_contracts.sql...");
const migOut = await runQuery(readFileSync(migrationPath, "utf-8"));
console.log("Migration result:", migOut.slice(0, 200));

console.log("Seeding contract templates...");
const seedOut = await runQuery(readFileSync(seedPath, "utf-8"));
console.log("Seed result:", seedOut.slice(0, 200));

console.log("Verifying...");
const verify = await runQuery(
  "SELECT table_name FROM information_schema.tables WHERE table_schema='public' AND table_name IN ('contracts','contract_templates') ORDER BY table_name;"
);
console.log("Tables:", verify);

const tplCount = await runQuery(
  "SELECT slug, name, category FROM contract_templates ORDER BY slug;"
);
console.log("Templates:", tplCount);
