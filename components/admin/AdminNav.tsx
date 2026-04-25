"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Inbox,
  Users,
  FolderKanban,
  FileText,
  CreditCard,
  Sparkles,
  Target,
  Briefcase,
  Building2,
  Cpu,
  Quote,
  PenLine,
  Settings,
  LogOut,
  Menu,
  X,
  ExternalLink,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/control/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/control/inbox", label: "Inbox", icon: Inbox },
  { href: "/control/clients", label: "Clients", icon: Users },
  { href: "/control/projects", label: "Projects", icon: FolderKanban },
  { href: "/control/invoices", label: "Invoices", icon: FileText },
  { href: "/control/payments", label: "Payments", icon: CreditCard },
  { href: "/control/services", label: "Services", icon: Sparkles },
  { href: "/control/solutions", label: "Solutions", icon: Target },
  { href: "/control/case-studies", label: "Case Studies", icon: Briefcase },
  { href: "/control/industries", label: "Industries", icon: Building2 },
  { href: "/control/technology", label: "Technology", icon: Cpu },
  { href: "/control/testimonials", label: "Testimonials", icon: Quote },
  { href: "/control/blog", label: "Blog", icon: PenLine },
  { href: "/control/settings", label: "Settings", icon: Settings },
] as const;

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/control/login");
    router.refresh();
  }

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  const SidebarContent = (
    <>
      <div className="px-6 py-5 border-b border-[var(--border)]">
        <Link
          href="/control/dashboard"
          onClick={() => setOpen(false)}
          className="flex items-center gap-2 text-[var(--text)] font-semibold text-lg"
        >
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-[var(--accent)]/15 text-[var(--accent)] border border-[var(--accent)]/30 text-xs font-bold">
            NP
          </span>
          <span>Control</span>
        </Link>
        <p className="text-xs text-[var(--text-4)] mt-1 ml-9">
          narendrapandrinki.com
        </p>
      </div>

      <div className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors border",
                active
                  ? "bg-[var(--accent)]/15 text-[var(--accent)] border-[var(--accent)]/30"
                  : "text-[var(--text-3)] border-transparent hover:bg-[var(--surface-2)] hover:text-[var(--text)]"
              )}
            >
              <Icon size={16} strokeWidth={1.75} />
              <span>{label}</span>
            </Link>
          );
        })}
      </div>

      <div className="px-3 py-3 border-t border-[var(--border)] space-y-1">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-[var(--text-3)] hover:text-[var(--text)] hover:bg-[var(--surface-2)]"
        >
          <ExternalLink size={16} strokeWidth={1.75} />
          <span>View site</span>
        </Link>
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm text-[var(--text-3)] hover:text-[var(--rose)] hover:bg-[var(--surface-2)] text-left"
        >
          <LogOut size={16} strokeWidth={1.75} />
          <span>Sign out</span>
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile top bar */}
      <div className="md:hidden sticky top-0 z-40 flex items-center justify-between px-4 py-3 bg-[var(--surface)] border-b border-[var(--border)]">
        <Link
          href="/control/dashboard"
          className="flex items-center gap-2 text-[var(--text)] font-semibold"
        >
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-[var(--accent)]/15 text-[var(--accent)] border border-[var(--accent)]/30 text-xs font-bold">
            NP
          </span>
          Control
        </Link>
        <button
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          className="p-2 rounded-md text-[var(--text-2)] hover:bg-[var(--surface-2)]"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Desktop sidebar */}
      <aside
        className="hidden md:flex sticky top-0 h-screen flex-col bg-[var(--surface)] border-r border-[var(--border)]"
        style={{ width: 240 }}
      >
        {SidebarContent}
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/70"
            onClick={() => setOpen(false)}
          />
          <aside
            className="relative flex flex-col bg-[var(--surface)] border-r border-[var(--border)] h-full"
            style={{ width: 260 }}
          >
            <button
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="absolute top-3 right-3 p-1.5 rounded-md text-[var(--text-3)] hover:bg-[var(--surface-2)]"
            >
              <X size={18} />
            </button>
            {SidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
