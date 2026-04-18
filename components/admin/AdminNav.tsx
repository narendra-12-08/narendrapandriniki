"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/control/dashboard", label: "Dashboard" },
  { href: "/control/inbox", label: "Inbox" },
  { href: "/control/clients", label: "Clients" },
  { href: "/control/projects", label: "Projects" },
  { href: "/control/invoices", label: "Invoices" },
  { href: "/control/payments", label: "Payments" },
  { href: "/control/blog", label: "Blog" },
  { href: "/control/services", label: "Services" },
  { href: "/control/solutions", label: "Solutions" },
  { href: "/control/settings", label: "Settings" },
];

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/control/login");
  }

  return (
    <nav
      style={{
        backgroundColor: "#2a1608",
        borderRight: "1px solid #3e2610",
        width: "220px",
        flexShrink: 0,
      }}
      className="h-screen sticky top-0 flex flex-col overflow-y-auto"
    >
      <div
        style={{ borderBottom: "1px solid #3e2610" }}
        className="px-6 py-5"
      >
        <Link href="/control/dashboard" style={{ color: "#cfa97e" }} className="font-semibold text-lg">
          NP Admin
        </Link>
      </div>

      <div className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            style={{
              backgroundColor: pathname.startsWith(href)
                ? "#3e2610"
                : "transparent",
              color: pathname.startsWith(href) ? "#cfa97e" : "#9b7653",
            }}
            className={cn(
              "flex items-center px-3 py-2 rounded text-sm font-medium transition-colors hover:opacity-80",
            )}
          >
            {label}
          </Link>
        ))}
      </div>

      <div style={{ borderTop: "1px solid #3e2610" }} className="px-3 py-4 space-y-2">
        <Link
          href="/"
          target="_blank"
          style={{ color: "#7d5c3a" }}
          className="flex items-center px-3 py-2 rounded text-sm hover:opacity-80"
        >
          View site ↗
        </Link>
        <button
          onClick={handleSignOut}
          style={{ color: "#7d5c3a" }}
          className="w-full flex items-center px-3 py-2 rounded text-sm hover:opacity-80 text-left"
        >
          Sign out
        </button>
      </div>
    </nav>
  );
}
