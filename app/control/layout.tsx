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
