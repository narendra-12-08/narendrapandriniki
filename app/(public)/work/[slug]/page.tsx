import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getCaseStudyBySlug,
  getPublishedCaseStudies,
} from "@/lib/db/content";

export async function generateStaticParams() {
  const caseStudies = await getPublishedCaseStudies();
  return caseStudies.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const cs = await getCaseStudyBySlug(slug);
  if (!cs) return { title: "Case Study" };
  return {
    title: cs.title,
    description: cs.outcome ?? undefined,
  };
}

export default async function CaseStudyDetailPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const cs = await getCaseStudyBySlug(slug);
  if (!cs) notFound();

  const all = await getPublishedCaseStudies();
  const related = all.filter((c) => c.slug !== cs.slug).slice(0, 3);

  return (
    <div className="bg-grid">
      <section className="section pb-10">
        <div className="container-page">
          <Link
            href="/work"
            className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--text-4)] hover:text-[var(--accent)]"
          >
            ← All case studies
          </Link>

          <div className="mt-8 max-w-5xl">
            <div className="flex flex-wrap items-center gap-3 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-[var(--text-4)]">
              <span className="text-[var(--accent)]">{cs.industry}</span>
              <span>·</span>
              <span>{cs.duration}</span>
              <span>·</span>
              <span>{cs.client}</span>
            </div>
            <h1 className="mt-6 text-4xl md:text-6xl font-semibold tracking-tight leading-[1.08] text-[var(--text)]">
              {cs.title}
            </h1>
            <p className="mt-6 text-lg md:text-xl text-[var(--text-2)] leading-relaxed">
              {cs.outcome}
            </p>
            <div className="mt-8 flex flex-wrap gap-1.5">
              {cs.tags.map((t) => (
                <span key={t} className="tag">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Metrics grid */}
      <section className="pb-16">
        <div className="container-page">
          <div className="surface-card glow-ring p-8 md:p-10">
            <div className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-[var(--accent)] mb-6">
              By the numbers
            </div>
            <dl className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
              {cs.metrics.map((m) => (
                <div key={m.label}>
                  <dd className="font-mono text-2xl md:text-3xl font-semibold text-[var(--text)] tracking-tight">
                    {m.value}
                  </dd>
                  <dt className="mt-2 font-mono text-[0.65rem] uppercase tracking-[0.15em] text-[var(--text-4)]">
                    {m.label}
                  </dt>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="pb-24">
        <div className="container-page">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <aside className="lg:col-span-4">
              <div className="surface-card p-6 lg:sticky lg:top-24 space-y-5 text-sm">
                <div>
                  <div className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-[var(--text-4)] mb-1.5">
                    Client
                  </div>
                  <div className="text-[var(--text)]">{cs.client}</div>
                </div>
                <div>
                  <div className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-[var(--text-4)] mb-1.5">
                    Industry
                  </div>
                  <div className="text-[var(--text)]">{cs.industry}</div>
                </div>
                <div>
                  <div className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-[var(--text-4)] mb-1.5">
                    Duration
                  </div>
                  <div className="text-[var(--text)]">{cs.duration}</div>
                </div>
                <div>
                  <div className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-[var(--text-4)] mb-1.5">
                    Team
                  </div>
                  <div className="text-[var(--text-2)] leading-relaxed">
                    {cs.team}
                  </div>
                </div>
                <div className="pt-5 border-t border-[var(--border)]">
                  <div className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-[var(--text-4)] mb-2">
                    Stack
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {cs.stack.map((s) => (
                      <span key={s} className="tag">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </aside>

            <div className="lg:col-span-8 space-y-12">
              <section>
                <span className="eyebrow">Problem</span>
                <p className="mt-4 text-[var(--text-2)] text-lg leading-[1.8]">
                  {cs.problem}
                </p>
              </section>

              <section>
                <span className="eyebrow">Approach</span>
                <ol className="mt-6 space-y-5">
                  {cs.approach.map((step, i) => (
                    <li key={i} className="surface-card p-6 flex gap-5">
                      <span className="font-mono text-2xl text-[var(--accent)] shrink-0">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <p className="text-[var(--text-2)] leading-relaxed">
                        {step}
                      </p>
                    </li>
                  ))}
                </ol>
              </section>

              <section>
                <span className="eyebrow">Result</span>
                <p className="mt-4 text-[var(--text-2)] text-lg leading-[1.8]">
                  {cs.result}
                </p>
              </section>
            </div>
          </div>
        </div>
      </section>

      <section className="section border-t border-[var(--border)] bg-[var(--bg-1)]/40">
        <div className="container-page">
          <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
            <div>
              <span className="eyebrow">More work</span>
              <h2 className="mt-3 text-3xl md:text-4xl font-semibold tracking-tight text-[var(--text)]">
                Other engagements.
              </h2>
            </div>
            <Link
              href="/work"
              className="font-mono text-sm text-[var(--accent)] hover:opacity-80"
            >
              All case studies →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {related.map((r) => (
              <Link
                key={r.slug}
                href={`/work/${r.slug}`}
                className="surface-card p-6 block group transition-transform hover:-translate-y-0.5"
              >
                <div className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-[var(--accent)]">
                  {r.industry}
                </div>
                <h3 className="mt-3 text-lg font-semibold text-[var(--text)] group-hover:text-[var(--accent)] transition-colors">
                  {r.title}
                </h3>
                <p className="mt-3 text-sm text-[var(--text-3)] line-clamp-2">
                  {r.outcome}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
