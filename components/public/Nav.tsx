"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const primary = [
  { href: "/services", label: "Services" },
  { href: "/solutions", label: "Solutions" },
  { href: "/industries", label: "Industries" },
  { href: "/technology", label: "Stack" },
  { href: "/work", label: "Work" },
  { href: "/blog", label: "Blog" },
  { href: "/compare", label: "Compare" },
  { href: "/hire", label: "Hire" },
];

export default function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) =>
    href === "/" ? pathname === href : pathname.startsWith(href);

  return (
    <nav
      className={cn(
        "sticky top-0 z-50 transition-all",
        scrolled
          ? "backdrop-blur-xl bg-[rgba(5,6,10,0.7)] border-b border-[var(--border)]"
          : "bg-transparent border-b border-transparent"
      )}
    >
      <div className="container-page">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="hover:opacity-90">
            <span className="gradient-text text-xl font-semibold tracking-tight leading-none">
              Narendra
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {primary.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "px-3 py-2 rounded-full text-sm transition-colors",
                  isActive(href)
                    ? "text-[var(--text)] bg-[var(--surface)]"
                    : "text-[var(--text-3)] hover:text-[var(--text)] hover:bg-[var(--surface)]"
                )}
              >
                {label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-2">
            <Link
              href="/about"
              className="text-sm text-[var(--text-3)] hover:text-[var(--text)] px-3 py-2"
            >
              About
            </Link>
            <Link href="/contact" className="btn-primary">
              Start a project
            </Link>
          </div>

          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 text-[var(--text-2)]"
            aria-label="Toggle menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {open ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {open && (
          <div className="md:hidden pb-6 pt-2 flex flex-col gap-1 border-t border-[var(--border)]">
            {[...primary, { href: "/about", label: "About" }, { href: "/process", label: "Process" }, { href: "/pricing", label: "Pricing" }].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className="px-3 py-2 rounded-lg text-sm text-[var(--text-2)] hover:bg-[var(--surface)]"
              >
                {label}
              </Link>
            ))}
            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="btn-primary mt-3 self-start"
            >
              Start a project
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
