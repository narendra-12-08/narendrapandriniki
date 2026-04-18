# Production Setup — narendrapandriniki.com

## 1. Supabase

### Create project
1. Go to supabase.com → New project
2. Copy **Project URL** and **anon/public key**

### Run schema
1. Go to Supabase SQL editor
2. Paste the full contents of `supabase/schema.sql`
3. Run it — creates all tables, RLS policies, indexes

### Create admin user
1. Supabase → Authentication → Users → Invite user
2. Use `emailme0666@yahoo.com` as the email
3. Set a strong password
4. This is your login for `/control/login`

---

## 2. Resend

### Get API key
1. resend.com → Create account → API Keys → Create key
2. Copy the key (starts with `re_`)

### Verify domain
1. Resend → Domains → Add domain → `narendrapandriniki.com`
2. Add the DNS records shown (SPF, DKIM, DMARC)
3. Wait for verification

### Configure inbound email (optional)
1. Resend → Inbound → Add inbound address
2. Point to: `https://narendrapandriniki.com/api/email/inbound`
3. This routes email sent to `hello@narendrapandriniki.com` into your admin inbox

---

## 3. Update Vercel env vars

Go to vercel.com → narendrapandriniki project → Settings → Environment Variables

Replace the placeholder values:

| Variable | Value |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon/public key |
| `RESEND_API_KEY` | Your Resend API key (starts with `re_`) |

Redeploy after updating.

---

## 4. DNS — narendrapandriniki.com

Point your domain to Vercel:

```
A    @    76.76.21.21
CNAME www  cname.vercel-dns.com
```

After DNS propagates, Vercel automatically provisions SSL.

---

## 5. Vercel–GitHub CI/CD (optional)

To auto-deploy on push:
1. vercel.com → narendrapandriniki → Settings → Git
2. Connect GitHub → narendra-12-08/narendrapandriniki

---

## Current live URLs

- **Production (Vercel):** https://narendrapandriniki.vercel.app
- **GitHub:** https://github.com/narendra-12-08/narendrapandriniki
- **Admin:** https://narendrapandriniki.vercel.app/control/login
- **Target domain:** https://narendrapandriniki.com (after DNS)
