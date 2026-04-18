import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Settings" };

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div style={{ padding: "2rem" }}>
      <div className="mb-8">
        <h1 style={{ color: "#faf7f2" }} className="text-2xl font-semibold">Settings</h1>
      </div>

      <div className="max-w-lg space-y-6">
        <div style={{ backgroundColor: "#2a1608", border: "1px solid #3e2610" }} className="rounded-lg p-6">
          <h2 style={{ color: "#faf7f2" }} className="font-semibold mb-4">Account</h2>
          <div className="space-y-3">
            <div>
              <p style={{ color: "#7d5c3a" }} className="text-xs uppercase tracking-widest mb-1">Signed in as</p>
              <p style={{ color: "#cfa97e" }} className="text-sm">{user?.email}</p>
            </div>
            <div>
              <p style={{ color: "#7d5c3a" }} className="text-xs uppercase tracking-widest mb-1">Last sign in</p>
              <p style={{ color: "#9b7653" }} className="text-sm">{user?.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString() : "—"}</p>
            </div>
          </div>
        </div>

        <div style={{ backgroundColor: "#2a1608", border: "1px solid #3e2610" }} className="rounded-lg p-6">
          <h2 style={{ color: "#faf7f2" }} className="font-semibold mb-4">Site</h2>
          <div className="space-y-3 text-sm">
            {[
              ["Domain", "narendrapandriniki.com"],
              ["Email", "hello@narendrapandriniki.com"],
              ["Admin", "/control/dashboard"],
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between">
                <span style={{ color: "#9b7653" }}>{label}</span>
                <span style={{ color: "#faf7f2", fontFamily: "monospace" }}>{value}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ backgroundColor: "#2a1608", border: "1px solid #3e2610" }} className="rounded-lg p-6">
          <h2 style={{ color: "#faf7f2" }} className="font-semibold mb-2">Environment</h2>
          <p style={{ color: "#9b7653" }} className="text-xs mb-4">Configure via Vercel environment variables.</p>
          <div className="space-y-2 text-xs">
            {[
              "NEXT_PUBLIC_SUPABASE_URL",
              "NEXT_PUBLIC_SUPABASE_ANON_KEY",
              "RESEND_API_KEY",
            ].map((key) => (
              <div key={key} className="flex items-center gap-2">
                <span style={{ backgroundColor: "#3e2610", color: "#9b7653" }} className="px-2 py-0.5 rounded font-mono">
                  {key}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
