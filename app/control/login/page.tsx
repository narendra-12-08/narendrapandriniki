"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const redirect = params.get("redirect") || "/control/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError("Invalid credentials. Please try again.");
      setLoading(false);
      return;
    }

    router.push(redirect);
    router.refresh();
  }

  return (
    <div
      style={{ backgroundColor: "#1e1208", minHeight: "100vh" }}
      className="flex items-center justify-center p-6"
    >
      <div style={{ width: "100%", maxWidth: "400px" }}>
        <div className="mb-10 text-center">
          <div style={{ color: "#cfa97e" }} className="text-2xl font-semibold mb-2">
            NP
          </div>
          <p style={{ color: "#7d5c3a" }} className="text-sm">
            Owner access only
          </p>
        </div>

        <div
          style={{ backgroundColor: "#2a1608", border: "1px solid #3e2610" }}
          className="rounded-lg p-8"
        >
          <h1 style={{ color: "#faf7f2" }} className="text-xl font-semibold mb-6">
            Sign in
          </h1>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                style={{ color: "#9b7653" }}
                className="block text-sm font-medium mb-2"
              >
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  backgroundColor: "#1e1208",
                  border: "1px solid #3e2610",
                  color: "#faf7f2",
                }}
                className="w-full px-4 py-3 rounded text-sm outline-none focus:ring-1 focus:ring-[#9b7653]"
              />
            </div>

            <div>
              <label
                style={{ color: "#9b7653" }}
                className="block text-sm font-medium mb-2"
              >
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  backgroundColor: "#1e1208",
                  border: "1px solid #3e2610",
                  color: "#faf7f2",
                }}
                className="w-full px-4 py-3 rounded text-sm outline-none focus:ring-1 focus:ring-[#9b7653]"
              />
            </div>

            {error && (
              <p style={{ color: "#ef4444" }} className="text-sm">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{ backgroundColor: "#5c3d1e", color: "#faf7f2" }}
              className="w-full py-3 text-sm font-semibold rounded hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
