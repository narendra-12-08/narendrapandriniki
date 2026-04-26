"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";
import {
  LayoutDashboard,
  Inbox,
  Mail,
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
  User,
  Compass,
  History,
  BadgeIndianRupee,
  HelpCircle,
  ListOrdered,
  TrendingUp,
  Award,
  BarChart3,
  FileSignature,
  FileCog,
  MessageSquare,
  UserPlus,
  Wand2,
  Calendar,
  CalendarDays,
  MailPlus,
  Globe2,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const navGroups: {
  label: string | null; // null for top-level standalone
  items: { href: string; label: string; icon: typeof LayoutDashboard }[];
}[] = [
  // Always visible at the top
  {
    label: null,
    items: [
      { href: "/control/dashboard", label: "Dashboard", icon: LayoutDashboard },
    ],
  },
  // 1. Anything inbound
  {
    label: "Inbox",
    items: [
      { href: "/control/inbox", label: "Messages", icon: Inbox },
      { href: "/control/email", label: "Compose email", icon: Mail },
    ],
  },
  // 2. Lead pipeline + scheduling
  {
    label: "Leads & Bookings",
    items: [
      { href: "/control/leads", label: "Leads", icon: UserPlus },
      { href: "/control/chat-sessions", label: "Chat sessions", icon: MessageSquare },
      { href: "/control/bookings", label: "Call bookings", icon: Calendar },
      { href: "/control/availability", label: "Availability", icon: CalendarDays },
    ],
  },
  // 3. AI tools
  {
    label: "AI Tools",
    items: [
      { href: "/control/ai-assistant", label: "AI Assistant", icon: Wand2 },
    ],
  },
  // 4. Sales & delivery — clients to cash
  {
    label: "Sales & Delivery",
    items: [
      { href: "/control/clients", label: "Clients", icon: Users },
      { href: "/control/projects", label: "Projects", icon: FolderKanban },
      { href: "/control/contracts", label: "Contracts", icon: FileSignature },
      { href: "/control/contract-templates", label: "Contract templates", icon: FileCog },
      { href: "/control/invoices", label: "Invoices", icon: FileText },
      { href: "/control/payments", label: "Payments", icon: CreditCard },
    ],
  },
  // 5. Analytics
  {
    label: "Analytics",
    items: [
      { href: "/control/analytics", label: "Business analytics", icon: BarChart3 },
      { href: "/control/visitors", label: "Visitors", icon: Globe2 },
    ],
  },
  // 6. Public site copy
  {
    label: "Site content",
    items: [
      { href: "/control/services", label: "Services", icon: Sparkles },
      { href: "/control/solutions", label: "Solutions", icon: Target },
      { href: "/control/case-studies", label: "Case Studies", icon: Briefcase },
      { href: "/control/industries", label: "Industries", icon: Building2 },
      { href: "/control/technology", label: "Technology", icon: Cpu },
      { href: "/control/testimonials", label: "Testimonials", icon: Quote },
      { href: "/control/blog", label: "Blog", icon: PenLine },
    ],
  },
  // 7. Personal pages
  {
    label: "About me",
    items: [
      { href: "/control/about", label: "Bio", icon: User },
      { href: "/control/principles", label: "Principles", icon: Compass },
      { href: "/control/timeline", label: "Timeline", icon: History },
      { href: "/control/skills", label: "Skills", icon: TrendingUp },
      { href: "/control/certifications", label: "Certifications", icon: Award },
    ],
  },
  // 8. Commercial pages
  {
    label: "Pricing & Process",
    items: [
      { href: "/control/pricing", label: "Pricing tiers", icon: BadgeIndianRupee },
      { href: "/control/process", label: "Process", icon: ListOrdered },
      { href: "/control/faqs", label: "FAQs", icon: HelpCircle },
    ],
  },
  // 9. Templates + settings
  {
    label: "Settings",
    items: [
      { href: "/control/email-templates", label: "Email templates", icon: MailPlus },
      { href: "/control/settings", label: "Site settings", icon: Settings },
    ],
  },
];

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

  // Each named group's collapsed state. Auto-expand the group containing
  // the current route so the active item is always visible on first load.
  const isGroupActive = (items: { href: string }[]) =>
    items.some((it) => isActive(it.href));
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    for (const g of navGroups) {
      if (g.label) initial[g.label] = !isGroupActive(g.items);
    }
    return initial;
  });
  const toggle = (label: string) =>
    setCollapsed((s) => ({ ...s, [label]: !s[label] }));

  const renderItem = (
    href: string,
    label: string,
    Icon: typeof LayoutDashboard
  ) => {
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
  };

  const SidebarContent = (
    <>
      <div className="px-6 py-5 border-b border-[var(--border)]">
        <Link
          href="/control/dashboard"
          onClick={() => setOpen(false)}
          className="flex items-center gap-2 text-[var(--text)] font-semibold text-lg"
        >
          <span className="relative inline-flex h-7 w-7 items-center justify-center rounded-md bg-[var(--surface-2)] border border-[var(--border-2)]">
            <span className="absolute inset-0 rounded-md opacity-60 blur-sm bg-[radial-gradient(circle,var(--accent),transparent_70%)]" />
            <span className="relative gradient-text text-sm font-bold leading-none">N</span>
          </span>
          <span>Control</span>
        </Link>
        <p className="text-xs text-[var(--text-4)] mt-1 ml-9">
          narendrapandrinki.com
        </p>
      </div>

      <div className="flex-1 px-3 py-4 overflow-y-auto">
        {navGroups.map((group, i) => {
          if (!group.label) {
            return (
              <div key={`top-${i}`} className="space-y-0.5 mb-3">
                {group.items.map((it) =>
                  renderItem(it.href, it.label, it.icon)
                )}
              </div>
            );
          }
          const isCollapsed = collapsed[group.label];
          const groupActive = isGroupActive(group.items);
          return (
            <div key={group.label} className="mb-3">
              <button
                type="button"
                onClick={() => toggle(group.label!)}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-2 rounded-md text-[10px] font-mono uppercase tracking-[0.16em] transition-colors",
                  groupActive
                    ? "text-[var(--text-2)]"
                    : "text-[var(--text-4)] hover:text-[var(--text-3)]"
                )}
              >
                <span>{group.label}</span>
                <ChevronRight
                  size={12}
                  strokeWidth={2}
                  className={cn(
                    "transition-transform",
                    !isCollapsed && "rotate-90"
                  )}
                />
              </button>
              {!isCollapsed && (
                <div className="mt-1 space-y-0.5">
                  {group.items.map((it) =>
                    renderItem(it.href, it.label, it.icon)
                  )}
                </div>
              )}
            </div>
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
          <span className="relative inline-flex h-7 w-7 items-center justify-center rounded-md bg-[var(--surface-2)] border border-[var(--border-2)]">
            <span className="absolute inset-0 rounded-md opacity-60 blur-sm bg-[radial-gradient(circle,var(--accent),transparent_70%)]" />
            <span className="relative gradient-text text-sm font-bold leading-none">N</span>
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
