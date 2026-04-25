import type { Metadata } from "next";
import Link from "next/link";
import { industries } from "@/lib/content/industries";

export const metadata: Metadata = {
  title: "Industries",
  description:
    "Sectors I work in most often — fintech, healthtech, e-commerce, B2B SaaS, AI/ML infrastructure, marketplaces, media, and edtech.",
};

export default function IndustriesPage() {
  return (
    <div>
      <section className="section bg-grid">
        <div className="container-page">
          <p className="eyebrow">Industries</p>
          <h1 className="text-4xl md:text-6xl font-semibold tracking-tight mt-6 max-w-3xl">
            <span className="gradient-text">Sectors</span> where the work lands hardest
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[var(--text-2)]">
            Five years of independent platform work has clustered around a handful
            of industries. Each one has its own reliability profile, regulatory
            shape, and operational tempo. Below is where I tend to do my best
            work, with notes on what the engagement usually looks like.
          </p>
        </div>
      </section>

      <section className="section pt-0">
        <div className="container-page">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {industries.map((industry) => (
              <Link
                key={industry.slug}
                href={`/industries/${industry.slug}`}
                className="surface-card p-6 group flex flex-col gap-4"
              >
                <p className="eyebrow text-[var(--accent)]">{industry.tagline}</p>
                <h2 className="text-xl font-semibold text-[var(--text)] group-hover:text-[var(--accent)] transition-colors">
                  {industry.title}
                </h2>
                <p className="text-sm leading-relaxed text-[var(--text-2)]">
                  {industry.shortDescription}
                </p>
                <div className="flex flex-wrap gap-1.5 mt-auto pt-4">
                  {industry.commonStack.slice(0, 5).map((tech) => (
                    <span key={tech} className="tag font-mono text-xs">
                      {tech}
                    </span>
                  ))}
                </div>
                <span className="text-sm text-[var(--accent)] mt-2">
                  Read more &rarr;
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section pt-0">
        <div className="container-page">
          <div className="surface-card p-10 md:p-14 text-center">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
              Not on the list?
            </h2>
            <p className="mt-4 max-w-xl mx-auto text-[var(--text-2)]">
              These are the industries I see most often, not the only ones I work in.
              If your sector isn&rsquo;t here, the underlying work is usually similar.
            </p>
            <div className="mt-8 flex flex-wrap gap-3 justify-center">
              <Link href="/contact" className="btn-primary">Start a conversation</Link>
              <Link href="/process" className="btn-ghost">How I work</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
