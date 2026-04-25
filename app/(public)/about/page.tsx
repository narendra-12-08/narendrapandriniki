import type { Metadata } from "next";
import Link from "next/link";
import { bio, principles, timeline, availability } from "@/lib/content/about";
import JsonLd from "@/components/seo/JsonLd";
import { personSchema, breadcrumbSchema } from "@/lib/seo/schema";

export const metadata: Metadata = {
  title: "About",
  description:
    "Narendra Pandrinki — independent DevOps, platform, and SRE engineer. Five years building production platforms across fintech, healthtech, AI/ML, and marketplaces.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  const bioParagraphs = bio.trim().split(/\n\n+/);
  return (
    <div className="bg-grid">
      <JsonLd id="ld-about-person" data={personSchema()} />
      <JsonLd
        id="ld-about-breadcrumbs"
        data={breadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "About", url: "/about" },
        ])}
      />
      <section className="section pb-12">
        <div className="container-page">
          <span className="eyebrow">About</span>
          <h1 className="mt-6 text-5xl md:text-7xl font-semibold tracking-tight leading-[1.05] text-[var(--text)] max-w-4xl">
            Independent DevOps engineer.{" "}
            <span className="gradient-text">UK based.</span> Five years in.
          </h1>
        </div>
      </section>

      <section className="pb-24">
        <div className="container-page">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <aside className="lg:col-span-4">
              <div className="surface-card p-7 lg:sticky lg:top-24">
                <div className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-[var(--text-4)] mb-4">
                  At a glance
                </div>
                <dl className="space-y-4 text-sm">
                  <div>
                    <dt className="text-[var(--text-4)] font-mono text-xs uppercase tracking-wider">
                      Name
                    </dt>
                    <dd className="text-[var(--text)] mt-1">
                      Narendra Pandrinki
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[var(--text-4)] font-mono text-xs uppercase tracking-wider">
                      Based
                    </dt>
                    <dd className="text-[var(--text)] mt-1">United Kingdom</dd>
                  </div>
                  <div>
                    <dt className="text-[var(--text-4)] font-mono text-xs uppercase tracking-wider">
                      Practice
                    </dt>
                    <dd className="text-[var(--text)] mt-1">Independent · solo</dd>
                  </div>
                  <div>
                    <dt className="text-[var(--text-4)] font-mono text-xs uppercase tracking-wider">
                      Focus
                    </dt>
                    <dd className="text-[var(--text)] mt-1">
                      Cloud, Kubernetes, SRE, platforms
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[var(--text-4)] font-mono text-xs uppercase tracking-wider">
                      Industries
                    </dt>
                    <dd className="text-[var(--text)] mt-1">
                      Fintech, healthtech, AI infra, marketplaces, SaaS
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[var(--text-4)] font-mono text-xs uppercase tracking-wider">
                      Email
                    </dt>
                    <dd className="mt-1">
                      <a
                        href="mailto:hello@narendrapandrinki.com"
                        className="text-[var(--accent)] hover:opacity-80"
                      >
                        hello@narendrapandrinki.com
                      </a>
                    </dd>
                  </div>
                </dl>
              </div>
            </aside>

            <div className="lg:col-span-8">
              <span className="eyebrow">Bio</span>
              {bioParagraphs.map((p, i) => (
                <p
                  key={i}
                  className="mt-5 text-[var(--text-2)] text-lg leading-[1.8]"
                >
                  {p}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section border-t border-[var(--border)] bg-[var(--bg-1)]/40">
        <div className="container-page">
          <div className="max-w-2xl mb-12">
            <span className="eyebrow">Principles</span>
            <h2 className="mt-4 text-4xl md:text-5xl font-semibold tracking-tight text-[var(--text)]">
              How I work.
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {principles.map((p, i) => (
              <article key={p.title} className="surface-card p-7">
                <div className="font-mono text-xs text-[var(--text-4)] mb-3">
                  {String(i + 1).padStart(2, "0")} /{" "}
                  {String(principles.length).padStart(2, "0")}
                </div>
                <h3 className="text-xl font-semibold text-[var(--text)] tracking-tight">
                  {p.title}
                </h3>
                <p className="mt-3 text-[var(--text-3)] leading-relaxed">
                  {p.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-page">
          <div className="max-w-2xl mb-12">
            <span className="eyebrow">Timeline</span>
            <h2 className="mt-4 text-4xl md:text-5xl font-semibold tracking-tight text-[var(--text)]">
              Five years, briefly.
            </h2>
          </div>

          <ol className="relative max-w-3xl">
            <span
              className="absolute left-[1.4rem] top-0 bottom-0 w-px bg-gradient-to-b from-[var(--accent)]/40 via-[var(--border-2)] to-transparent"
              aria-hidden
            />
            {timeline.map((entry) => (
              <li key={entry.year} className="relative pl-16 pb-10">
                <span className="absolute left-0 top-0 inline-flex h-12 w-12 items-center justify-center rounded-full border border-[var(--border-2)] bg-[var(--surface)] font-mono text-xs text-[var(--accent)]">
                  {entry.year}
                </span>
                <h3 className="text-lg font-semibold text-[var(--text)]">
                  {entry.title}
                </h3>
                <p className="mt-2 text-[var(--text-3)] leading-relaxed">
                  {entry.description}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section border-t border-[var(--border)] bg-[var(--bg-1)]/40">
        <div className="container-page">
          <div className="surface-card glow-ring p-10 md:p-14 max-w-4xl">
            <div className="flex items-center gap-3">
              <span className="live-dot" />
              <span className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--lime)]">
                Currently available
              </span>
            </div>
            <h2 className="mt-5 text-3xl md:text-4xl font-semibold tracking-tight text-[var(--text)]">
              Availability.
            </h2>
            <p className="mt-5 text-[var(--text-2)] leading-relaxed text-lg">
              {availability}
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link href="/contact" className="btn-primary">
                Start a conversation
              </Link>
              <a
                href="mailto:hello@narendrapandrinki.com"
                className="btn-ghost"
              >
                hello@narendrapandrinki.com
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
