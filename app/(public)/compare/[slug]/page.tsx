import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { comparisons, getComparison, type CompareScore } from "@/lib/content/compare";
import { formatDate } from "@/lib/utils";
import Markdown from "@/components/public/Markdown";

const categoryLabel: Record<string, string> = {
  cloud: "Cloud",
  kubernetes: "Kubernetes",
  iac: "Infrastructure as Code",
  observability: "Observability",
  "ai-coding": "AI coding",
  cicd: "CI/CD",
};

export function generateStaticParams() {
  return comparisons.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const c = getComparison(slug);
  if (!c) return { title: "Comparison" };
  return {
    title: c.title,
    description: c.subtitle,
  };
}

function colorForScore(value: number): string {
  if (value >= 8) return "bg-[var(--accent)]";
  if (value >= 6) return "bg-[var(--lime)]";
  if (value >= 4) return "bg-[var(--amber)]";
  return "bg-[var(--rose)]";
}

function ScoreBar({ value, max = 10 }: { value: number; max?: number }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div className="flex items-center gap-2.5 min-w-0">
      <div
        className="relative h-2 w-full rounded-full bg-[var(--surface-2)] overflow-hidden"
        role="img"
        aria-label={`Score ${value} out of ${max}`}
      >
        <div
          className={`absolute inset-y-0 left-0 ${colorForScore(value)} rounded-full`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="font-mono text-xs text-[var(--text-2)] tabular-nums w-6 text-right">
        {value}
      </span>
    </div>
  );
}

function totalScore(v: CompareScore, dims: { label: string }[]): number {
  return dims.reduce((sum, d) => sum + (v.scores[d.label] ?? 0), 0);
}

export default async function ComparisonPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const c = getComparison(slug);
  if (!c) notFound();

  const maxPossible = c.dimensions.length * 10;
  const totals = c.vendors.map((v) => ({
    vendor: v.vendor,
    total: totalScore(v, c.dimensions),
  }));
  const topTotal = Math.max(...totals.map((t) => t.total));

  const related = comparisons
    .filter((other) => other.slug !== c.slug && other.category === c.category)
    .concat(comparisons.filter((other) => other.slug !== c.slug && other.category !== c.category))
    .slice(0, 2);

  return (
    <div className="bg-grid">
      <article>
        {/* Hero */}
        <section className="section pb-10">
          <div className="container-page">
            <Link
              href="/compare"
              className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--text-4)] hover:text-[var(--accent)]"
            >
              ← All comparisons
            </Link>
            <div className="mt-8 max-w-3xl">
              <span className="eyebrow">{categoryLabel[c.category]}</span>
              <h1 className="mt-4 text-4xl md:text-6xl font-semibold tracking-tight leading-[1.05] text-[var(--text)]">
                {c.title}
              </h1>
              <p className="mt-6 text-lg md:text-xl text-[var(--text-2)] leading-relaxed">
                {c.subtitle}
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3 font-mono text-xs uppercase tracking-[0.15em] text-[var(--text-4)]">
                <span>{formatDate(c.publishedAt)}</span>
                <span>·</span>
                <span>{c.vendors.length} vendors</span>
                <span>·</span>
                <span>{c.dimensions.length} dimensions</span>
              </div>
            </div>
          </div>
        </section>

        {/* Score table */}
        <section className="pb-16">
          <div className="container-page">
            <div className="surface-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[var(--border)]">
                      <th className="text-left font-mono text-[0.65rem] uppercase tracking-[0.16em] text-[var(--text-4)] px-5 py-4 sticky left-0 bg-[var(--surface)] z-10">
                        Dimension
                      </th>
                      {c.vendors.map((v) => (
                        <th
                          key={v.vendor}
                          className="text-left font-mono text-[0.65rem] uppercase tracking-[0.16em] text-[var(--text-2)] px-5 py-4 min-w-[180px]"
                        >
                          {v.vendor}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {c.dimensions.map((d) => (
                      <tr
                        key={d.label}
                        className="border-b border-[var(--border)]/60 last:border-b-0"
                      >
                        <td className="px-5 py-4 text-[var(--text-2)] sticky left-0 bg-[var(--surface)] z-10 align-middle">
                          {d.label}
                        </td>
                        {c.vendors.map((v) => (
                          <td key={v.vendor} className="px-5 py-4 align-middle">
                            <ScoreBar value={v.scores[d.label] ?? 0} />
                          </td>
                        ))}
                      </tr>
                    ))}
                    {/* Total row */}
                    <tr className="border-t-2 border-[var(--border)] bg-[var(--surface-2)]/40">
                      <td className="px-5 py-5 font-mono text-[0.7rem] uppercase tracking-[0.16em] text-[var(--text)] sticky left-0 bg-[var(--surface-2)]/80 z-10 align-middle">
                        Total
                      </td>
                      {c.vendors.map((v) => {
                        const total = totalScore(v, c.dimensions);
                        const pct = (total / maxPossible) * 100;
                        const isTop = total === topTotal;
                        return (
                          <td key={v.vendor} className="px-5 py-5 align-middle">
                            <div className="flex items-center gap-3 min-w-0">
                              <div
                                className={`relative h-3 w-full rounded-full bg-[var(--surface-2)] overflow-hidden ${
                                  isTop ? "glow-ring" : ""
                                }`}
                              >
                                <div
                                  className={`absolute inset-y-0 left-0 rounded-full ${
                                    isTop
                                      ? "bg-[var(--accent)]"
                                      : "bg-[var(--text-3)]"
                                  }`}
                                  style={{ width: `${pct}%` }}
                                />
                              </div>
                              <span className="font-mono text-xs text-[var(--text)] tabular-nums whitespace-nowrap">
                                {total}/{maxPossible}
                              </span>
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* Vendor cards */}
        <section className="pb-16">
          <div className="container-page">
            <div className="max-w-3xl mb-8">
              <span className="eyebrow">By vendor</span>
              <h2 className="mt-3 text-3xl md:text-4xl font-semibold tracking-tight text-[var(--text)]">
                Where each one wins, where each one loses.
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {c.vendors.map((v) => (
                <div key={v.vendor} className="surface-card p-7">
                  <h3 className="text-2xl font-semibold gradient-text">
                    {v.vendor}
                  </h3>
                  <p className="mt-4 text-sm text-[var(--text-2)] leading-relaxed">
                    {v.summary}
                  </p>
                  <div className="mt-6 space-y-4">
                    <div>
                      <div className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-[var(--lime)]">
                        Best for
                      </div>
                      <p className="mt-1.5 text-sm text-[var(--text-2)] leading-relaxed">
                        {v.bestFor}
                      </p>
                    </div>
                    <div>
                      <div className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-[var(--rose)]">
                        Weak at
                      </div>
                      <p className="mt-1.5 text-sm text-[var(--text-2)] leading-relaxed">
                        {v.weakAt}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Recommendation */}
        <section className="pb-16">
          <div className="container-page">
            <div className="surface-card glow-ring p-8 md:p-10">
              <span className="eyebrow">Recommendation</span>
              <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <div className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-[var(--text-4)]">
                    Primary pick
                  </div>
                  <div className="mt-2 text-3xl md:text-4xl font-semibold gradient-text">
                    {c.recommendation.primary}
                  </div>
                </div>
                <div>
                  <div className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-[var(--text-4)]">
                    Runner-up
                  </div>
                  <div className="mt-2 text-2xl md:text-3xl font-semibold text-[var(--text)]">
                    {c.recommendation.runnerUp}
                  </div>
                </div>
                <div className="md:col-span-1">
                  <div className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-[var(--text-4)]">
                    Takeaway
                  </div>
                  <p className="mt-2 text-sm text-[var(--text-2)] leading-relaxed">
                    {c.takeaway}
                  </p>
                </div>
              </div>
              <div className="mt-8 pt-6 border-t border-[var(--border)]">
                <p className="text-[var(--text-2)] leading-relaxed text-[1.0625rem]">
                  {c.recommendation.reasoning}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Long-form analysis */}
        <section className="pb-20">
          <div className="container-page">
            <div className="max-w-3xl mx-auto">
              <span className="hairline block mb-10" />
              <Markdown source={c.content} />

              {c.references.length > 0 && (
                <div className="mt-16 pt-10 border-t border-[var(--border)]">
                  <span className="eyebrow">References</span>
                  <ol className="mt-5 space-y-2.5 list-decimal pl-5 marker:text-[var(--text-4)] marker:font-mono">
                    {c.references.map((r) => (
                      <li
                        key={r.url}
                        className="text-sm text-[var(--text-2)] pl-2"
                      >
                        <a
                          href={r.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[var(--accent)] underline underline-offset-4 hover:opacity-80"
                        >
                          {r.label}
                        </a>
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          </div>
        </section>
      </article>

      {related.length > 0 && (
        <section className="section border-t border-[var(--border)] bg-[var(--bg-1)]/40">
          <div className="container-page">
            <div className="max-w-3xl mb-10">
              <span className="eyebrow">Related comparisons</span>
              <h2 className="mt-3 text-3xl md:text-4xl font-semibold tracking-tight text-[var(--text)]">
                Keep comparing.
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/compare/${r.slug}`}
                  className="surface-card p-6 block group transition-transform hover:-translate-y-0.5"
                >
                  <div className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-[var(--accent)]">
                    {categoryLabel[r.category]}
                  </div>
                  <h3 className="mt-3 text-base font-semibold text-[var(--text)] group-hover:text-[var(--accent)] transition-colors leading-snug">
                    {r.title}
                  </h3>
                  <p className="mt-3 text-sm text-[var(--text-2)] leading-relaxed">
                    {r.subtitle}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
