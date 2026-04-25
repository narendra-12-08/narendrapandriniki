import type { Metadata } from "next";
import Link from "next/link";
import { getPublishedCaseStudies } from "@/lib/db/content";

export const metadata: Metadata = {
  title: "Case Studies",
  description:
    "Selected engagements across fintech, healthtech, AI/ML infra, marketplaces, and SaaS — what was hired, what got delivered, and what changed.",
};

export default async function WorkPage() {
  const caseStudies = await getPublishedCaseStudies();
  return (
    <div className="bg-grid">
      <section className="section pb-12">
        <div className="container-page">
          <span className="eyebrow">Selected work</span>
          <h1 className="mt-6 text-5xl md:text-7xl font-semibold tracking-tight leading-[1.05] text-[var(--text)] max-w-4xl">
            What was hired,{" "}
            <span className="gradient-text">what changed.</span>
          </h1>
          <p className="mt-8 max-w-2xl text-lg text-[var(--text-2)] leading-relaxed">
            Six engagements with measured outcomes. Each one is a slice of the
            same operating philosophy: deliberate boundaries, tested failovers,
            observability tied to user journeys.
          </p>
        </div>
      </section>

      <section className="pb-32">
        <div className="container-page">
          <div className="space-y-4">
            {caseStudies.map((cs, idx) => (
              <Link
                key={cs.slug}
                href={`/work/${cs.slug}`}
                className="surface-card group relative block p-7 md:p-10 transition-all hover:border-[var(--border-strong)]"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
                  <div className="lg:col-span-7">
                    <div className="flex items-center gap-3 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-[var(--text-4)]">
                      <span className="text-[var(--text-4)]">
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      <span>·</span>
                      <span className="text-[var(--accent)]">
                        {cs.industry}
                      </span>
                      <span>·</span>
                      <span>{cs.duration}</span>
                    </div>
                    <h2 className="mt-4 text-2xl md:text-3xl font-semibold tracking-tight text-[var(--text)] group-hover:text-[var(--accent)] transition-colors">
                      {cs.title}
                    </h2>
                    <p className="mt-4 text-[var(--text-2)] leading-relaxed">
                      {cs.outcome}
                    </p>
                    <div className="mt-5 flex flex-wrap gap-1.5">
                      {cs.stack.slice(0, 6).map((t) => (
                        <span key={t} className="tag">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="lg:col-span-5 lg:border-l lg:border-[var(--border)] lg:pl-8">
                    <div className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-[var(--text-4)] mb-4">
                      Outcome
                    </div>
                    <dl className="grid grid-cols-2 gap-x-5 gap-y-4">
                      {cs.metrics.map((m) => (
                        <div key={m.label}>
                          <dt className="font-mono text-[0.6rem] uppercase tracking-[0.15em] text-[var(--text-4)]">
                            {m.label}
                          </dt>
                          <dd className="mt-1 font-mono text-sm text-[var(--text)]">
                            {m.value}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section border-t border-[var(--border)] bg-[var(--bg-1)]/40">
        <div className="container-page">
          <div className="surface-card glow-ring p-10 md:p-14 text-center">
            <span className="eyebrow justify-center">Your project next</span>
            <h2 className="mt-5 text-3xl md:text-5xl font-semibold tracking-tight text-[var(--text)]">
              Ready to add a seventh row?
            </h2>
            <div className="mt-8">
              <Link href="/contact" className="btn-primary">
                Start a conversation
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
