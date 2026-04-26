@AGENTS.md

# narendrapandrinki.com — Project Context

You are working on **Narendra Pandrinki's** portfolio site. He is an independent DevOps / Platform / Cloud / Full-stack / AI engineer based in **India**, working with clients across India, UK, US, Singapore, and Dubai. 5 years experience.

**Live site:** https://narendrapandrinki.com
**Admin:** https://narendrapandrinki.com/control/login (email `hello@narendrapandrinki.com`, password in `narendrapandrinki-handover/credentials.md`)
**GitHub:** https://github.com/narendra-12-08/narendrapandriniki

## Stack

- Next.js 16 App Router + React 19 + Tailwind v4
- Supabase (Postgres + Auth + RLS) — project ref `pmiylelkgyapbcpystpu`
- Resend for transactional + inbound email (verified domain `narendrapandrinki.com`)
- Vercel hosting (auto-deploys from `main`)
- Framer Motion for animations

## Critical Next.js 16 quirks

- `params` and `searchParams` are `Promise<...>` — always `await params`.
- The middleware file is `proxy.ts`, NOT `middleware.ts`.
- `metadata.themeColor` is deprecated — use the separate `viewport` export.
- Read `node_modules/next/dist/docs/` if unsure about an API.

## Design system (in `app/globals.css`)

Dark cyan/violet palette. **Use the CSS-variable utility classes**, not hex:

- `--bg #05060a`, `--surface #11141f`, `--surface-2 #161a28`, `--border #232839`, `--text #eef0f6`, `--accent #22d3ee`, `--violet #a78bfa`, `--lime #a3e635`, `--rose #fb7185`
- Classes: `.container-page`, `.surface-card`, `.btn-primary`, `.btn-ghost`, `.eyebrow`, `.gradient-text`, `.section`, `.tag`, `.prose-dark`, `.live-dot`, `.glow-ring`, `.bg-grid`
- Color via `bg-[var(--surface)]`, `text-[var(--text-2)]`, etc. — NOT inline hex.

## Architecture

### Public pages — DB-first with static fallback

`/app/(public)/*` pages call helpers in `lib/db/content.ts` and `lib/db/content-extra.ts`. These query Supabase first; if the table is empty or errors, they fall back to static modules in `lib/content/*`. This means:

- Admin edits via `/control/*` show up live on the public site.
- Site still works on a fresh DB (before seeding).
- Don't import `lib/content/*` directly in pages — use the DB helpers.

### Admin (control panel)

- `/app/control/layout.tsx` — auth check + AdminNav sidebar. Uses `x-pathname` header (set by `proxy.ts`) to suppress chrome on `/control/login` even if a stale auth cookie exists.
- Admin nav lives in `components/admin/AdminNav.tsx`.
- Server actions in `app/control/actions.ts`, `actions-extra.ts`, `actions-contracts.ts`.
- Shared admin UI primitives at `components/admin/ui.tsx` (PageHeader, Card, Field, Input, Textarea, Select, Badge, etc.).

### Content tables (all editable from admin)

`services`, `solutions`, `case_studies`, `industries`, `technology_categories`, `technology_items`, `testimonials`, `blog_posts`, `pricing_tiers`, `faqs`, `principles`, `timeline_entries`, `process_steps`, `skill_groups`, `skill_items`, `certifications`, `pages_content`, `site_settings`.

### Operational tables

`clients`, `leads`, `projects`, `invoices`, `payments`, `notes`, `contact_submissions`, `inbox_messages`, `sent_emails`, `contracts`, `contract_templates`.

### Public sign flow

`/app/sign/[token]/page.tsx` is a public, no-auth route used by clients to sign contracts. Uses the **service-role** client at `lib/supabase/admin.ts` to bypass RLS. Supports typed and drawn signatures, captures IP + user agent + timestamp, sends email via Resend on sign.

## Brand voice

Confident, opinionated, technical, no fluff. No emoji. No "let's dive in", no "in this post we'll explore". Open with a claim, a story, or a number — never with a generic statement. Specific over general. Honest about tradeoffs.

## Common tasks reference

**Apply a SQL migration:**
```bash
TOKEN="$SUPABASE_ACCESS_TOKEN"  # see credentials.md
curl -s -X POST "https://api.supabase.com/v1/projects/pmiylelkgyapbcpystpu/database/query" \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  --data "$(jq -Rs '{query:.}' supabase/migrations/<file>.sql)"
```

**Re-seed content tables:**
```bash
export SUPABASE_SERVICE_ROLE_KEY=...   # from .env.local
export NEXT_PUBLIC_SUPABASE_URL=https://pmiylelkgyapbcpystpu.supabase.co
node --experimental-strip-types scripts/seed.mjs
node --experimental-strip-types scripts/seed-extras.mjs
```

**Deploy:**
```bash
git add -A && git commit -m "..." && git push origin main
# Vercel auto-deploys, OR force:
vercel --prod --yes --scope narendra-12-08s-projects
```

**Local dev:**
```bash
npm install && npm run dev   # http://localhost:3000
```

## Things to avoid

- Don't commit `.env.local` or anything from `narendrapandrinki-handover/`.
- Don't run `npm audit fix --force` (downgrades Next.js 16 → 9).
- Don't introduce hex colors — use design tokens.
- Don't add `metadata.themeColor` — use the `viewport` export.
- Don't bypass `await params` even though it sometimes "works" — it'll fail in production builds.
- Don't write blog posts that sound like AI marketing fluff. Be specific.

## Identity

When committing, the repo is configured to author commits as:

```
Narendra Pandrinki <narendra-12-08@users.noreply.github.com>
```

Don't change this without asking.
