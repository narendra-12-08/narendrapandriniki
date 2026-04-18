"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/solutions", label: "Solutions" },
  { href: "/work", label: "Work" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export default function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <nav
      style={{
        backgroundColor: "#faf7f2",
        borderBottom: "1px solid #dfc5a5",
      }}
      className="sticky top-0 z-50"
    >
      <div className="container mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-16">
          <Link
            href="/"
            style={{ color: "#1e1208" }}
            className="text-lg font-semibold tracking-tight hover:opacity-70 transition-opacity"
          >
            NP
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                style={{
                  color:
                    pathname === href ||
                    (href !== "/" && pathname.startsWith(href))
                      ? "#5c3d1e"
                      : "#9b7653",
                }}
                className={cn(
                  "text-sm font-medium transition-colors hover:opacity-80",
                  (
                    href === "/"
                      ? pathname === href
                      : pathname.startsWith(href)
                  ) && "underline underline-offset-4"
                )}
              >
                {label}
              </Link>
            ))}
          </div>

          <Link
            href="/contact"
            style={{
              backgroundColor: "#5c3d1e",
              color: "#faf7f2",
            }}
            className="hidden md:inline-flex text-sm font-medium px-4 py-2 rounded hover:opacity-90 transition-opacity"
          >
            Work together
          </Link>

          {/* Mobile menu button */}
          <button
            onClick={() => setOpen(!open)}
            style={{ color: "#5c3d1e" }}
            className="md:hidden p-2"
            aria-label="Toggle menu"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {open ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div
            style={{ borderTop: "1px solid #dfc5a5" }}
            className="md:hidden py-4 flex flex-col gap-4"
          >
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                style={{ color: "#5c3d1e" }}
                className="text-sm font-medium py-1"
              >
                {label}
              </Link>
            ))}
            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              style={{ backgroundColor: "#5c3d1e", color: "#faf7f2" }}
              className="text-sm font-medium px-4 py-2 rounded text-center mt-2"
            >
              Work together
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
