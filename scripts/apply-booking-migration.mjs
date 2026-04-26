// Apply 20260801 booking + templates migration via Supabase Management API.
// Usage: node scripts/apply-booking-migration.mjs
import fs from "node:fs";
import path from "node:path";

const TOKEN = process.env.SUPABASE_ACCESS_TOKEN || "sbp_22f242cfa64d215965ea8de1ed18895579a91ac5";
const PROJECT_REF = "pmiylelkgyapbcpystpu";

const files = [
  "supabase/migrations/20260801000000_booking_and_templates.sql",
  "supabase/migrations/20260801000001_seed_email_templates.sql",
];

for (const f of files) {
  const sql = fs.readFileSync(path.resolve(f), "utf8");
  const res = await fetch(
    `https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: sql }),
    }
  );
  const text = await res.text();
  console.log(`${f}: ${res.status}`);
  console.log(text);
  if (!res.ok) process.exit(1);
}

// Verify tables.
const verify = `SELECT table_name FROM information_schema.tables WHERE table_schema='public' AND table_name IN ('bookings','availability_windows','email_templates','page_views') ORDER BY table_name;`;
const v = await fetch(
  `https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`,
  {
    method: "POST",
    headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify({ query: verify }),
  }
);
console.log("verify:", v.status, await v.text());
