import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

function detectDevice(ua: string | null): string {
  if (!ua) return "unknown";
  if (/iPad|Tablet/i.test(ua)) return "tablet";
  if (/iPhone|Android.*Mobile|Mobile/i.test(ua)) return "mobile";
  return "desktop";
}

async function hashIp(ip: string): Promise<string> {
  const data = new TextEncoder().encode(ip + "|narendrapandrinki");
  const buf = await crypto.subtle.digest("SHA-256", data);
  const hex = Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return hex.slice(0, 32);
}

export async function POST(req: NextRequest) {
  let body: { path?: string; referrer?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad json" }, { status: 400 });
  }

  const path = (body.path ?? "").toString().slice(0, 512);
  const referrer = (body.referrer ?? "").toString().slice(0, 1024) || null;
  if (!path || !path.startsWith("/")) {
    return NextResponse.json({ ok: false, error: "bad path" }, { status: 400 });
  }
  // Don't track admin
  if (path.startsWith("/control") || path.startsWith("/api/")) {
    return NextResponse.json({ ok: true, skipped: true });
  }

  const h = req.headers;
  const ua = h.get("user-agent");
  const country = h.get("x-vercel-ip-country");
  const city = h.get("x-vercel-ip-city");
  const region = h.get("x-vercel-ip-country-region");
  const ip =
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip") ||
    "0.0.0.0";

  const ip_hash = await hashIp(ip);
  const device = detectDevice(ua);

  try {
    const supabase = createAdminClient();
    await supabase.from("page_views").insert({
      path,
      referrer,
      country: country ? decodeURIComponent(country) : null,
      city: city ? decodeURIComponent(city) : null,
      region: region ? decodeURIComponent(region) : null,
      ip_hash,
      user_agent: ua ? ua.slice(0, 512) : null,
      device,
    });
  } catch {
    // swallow — analytics is best-effort
  }

  return NextResponse.json({ ok: true });
}
