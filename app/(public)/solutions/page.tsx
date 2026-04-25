import type { Metadata } from "next";
import Link from "next/link";
import { solutions } from "@/lib/content/solutions";

export const metadata: Metadata = {
  title: "Solutions",
  description:
    "Outcome-shaped engagements: cloud migrations, cost optimisation, zero-downtime deploys, compliance, DR, internal developer platforms, observability overhauls.",
};

export default function SolutionsPage() {
  return (
    <div className="bg-grid">
      <section className="section pb-12">
        <div className="container-page">
          <span className="eyebrow">Solutions</span>
          <h1 className="mt-6 text-5xl md:text-7xl font-semibold tracking-tight leading-[1.05] text-[var(--text)] max-w-4xl">
            Outcome-shaped{" "}
            <span className="gradient-text">engagements.</span>
          </h1>
          <p className="mt-8 max-w-2xl text-lg text-[var(--text-2)] leading-relaxed">
            When the business outcome is clearer than the toolchain — pick by
            destination, not by stack. Each one is a defined scope with
            measurable results.
          </p>
        </div>
      </section>

      <section className="pb-32">
        <div className="container-page">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {solutions.map((sol) => (
              <Link
                key={sol.slug}
                href={`/solutions/${sol.slug}`}
                className="surface-card group p-7 block transition-transform hover:-translate-y-0.5"
              >
                <span className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-[var(--violet)]">
                  {sol.tagline}
                </span>
                <h2 className="mt-3 text-xl md:text-2xl font-semibold text-[var(--text)] group-hover:text-[var(--accent)] transition-colors tracking-tight">
                  {sol.title}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-[var(--text-3)]">
                  {sol.shortDescription}
                </p>
                <ul className="mt-5 space-y-1.5 pt-5 border-t border-[var(--border)]">
                  {sol.outcomes.map((o) => (
                    <li
                      key={o}
                      className="flex items-start gap-2 text-xs text-[var(--text-3)]"
                    >
                      <span className="text-[var(--accent)] mt-0.5">→</span>
                      <span>{o}</span>
                    </li>
                  ))}
                </ul>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
