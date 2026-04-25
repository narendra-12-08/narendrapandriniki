import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { solutions, getSolution } from "@/lib/content/solutions";
import Markdown from "@/components/public/Markdown";

export function generateStaticParams() {
  return solutions.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const sol = getSolution(slug);
  if (!sol) return { title: "Solution" };
  return {
    title: sol.title,
    description: sol.shortDescription,
  };
}

export default async function SolutionDetailPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const sol = getSolution(slug);
  if (!sol) notFound();

  return (
    <div className="bg-grid">
      <section className="section pb-10">
        <div className="container-page">
          <Link
            href="/solutions"
            className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--text-4)] hover:text-[var(--accent)]"
          >
            ← All solutions
          </Link>
          <div className="mt-8 max-w-4xl">
            <span className="eyebrow">{sol.tagline}</span>
            <h1 className="mt-6 text-5xl md:text-7xl font-semibold tracking-tight leading-[1.05] text-[var(--text)]">
              {sol.title}
            </h1>
            <p className="mt-8 text-lg md:text-xl text-[var(--text-2)] leading-relaxed">
              {sol.shortDescription}
            </p>
          </div>
        </div>
      </section>

      <section className="pb-16">
        <div className="container-page">
          <div className="surface-card p-8 md:p-10 max-w-4xl">
            <div className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-[var(--accent)] mb-5">
              Outcomes you should expect
            </div>
            <ul className="space-y-3.5">
              {sol.outcomes.map((o) => (
                <li
                  key={o}
                  className="flex items-start gap-3 text-[var(--text-2)] text-base leading-relaxed"
                >
                  <span
                    className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[var(--accent)]/40 bg-[var(--accent-soft)] text-[var(--accent)] mt-0.5"
                    aria-hidden
                  >
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 12 12"
                      fill="none"
                    >
                      <path
                        d="M2.5 6L5 8.5L9.5 4"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <span>{o}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="pb-24">
        <div className="container-page">
          <div className="max-w-3xl">
            <Markdown source={sol.content} />
          </div>
        </div>
      </section>

      <section className="section border-t border-[var(--border)] bg-[var(--bg-1)]/40">
        <div className="container-page">
          <div className="surface-card glow-ring p-10 md:p-14 text-center">
            <span className="eyebrow justify-center">Next step</span>
            <h2 className="mt-5 text-3xl md:text-5xl font-semibold tracking-tight text-[var(--text)]">
              Talk through {sol.title.toLowerCase()}.
            </h2>
            <p className="mt-5 max-w-xl mx-auto text-[var(--text-2)]">
              A 30-minute call to understand the shape, the constraints, and
              whether I&apos;m the right person for it.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
              <Link href="/contact" className="btn-primary">
                Start a conversation
              </Link>
              <Link href="/work" className="btn-ghost">
                See related work
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
