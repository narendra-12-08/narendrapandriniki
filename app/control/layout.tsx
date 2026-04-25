import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import AdminNav from "@/components/admin/AdminNav";

export const metadata = {
  title: {
    default: "Control",
    template: "%s | Control",
  },
  robots: { index: false, follow: false },
};

export default async function ControlLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const h = await headers();
  const pathname = h.get("x-pathname") ?? "";
  const isLoginRoute =
    pathname === "/control/login" || pathname.endsWith("/control/login");

  // Login page never gets admin chrome, regardless of any stale session.
  if (isLoginRoute) {
    return (
      <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
        {children}
      </div>
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] md:flex">
      <AdminNav />
      <main className="flex-1 min-w-0">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-10 py-6 lg:py-10">
          {children}
        </div>
      </main>
    </div>
  );
}
