import type { Metadata } from "next";
import Link from "next/link";
import { comparisons } from "@/lib/content/compare";
import { formatDate } from "@/lib/utils";
import Reveal from "@/components/motion/Reveal";
import Stagger from "@/components/motion/Stagger";
import StaggerItem from "@/components/motion/StaggerItem";
import HeroTitle from "@/components/motion/HeroTitle";

export const metadata: Metadata = {
  title: "Comparisons — DevOps & cloud tooling, scored",
  description:
    "Side-by-side comparisons of the cloud, Kubernetes, IaC, observability, AI coding, and CI/CD tools I work with. Honest scores, opinionated recommendations.",
};

const categoryLabel: Record<string, string> = {
  cloud: "Cloud",
  kubernetes: "Kubernetes",
  iac: "Infrastructure as Code",
  observability: "Observability",
  "ai-coding": "AI coding",
  cicd: "CI/CD",
};

export default function ComparePage() {
  return (
    <div className="bg-grid">
      <section className="section">
        <div className="container-page">
          <div className="max-w-3xl">
            <Reveal>
              <span className="eyebrow">Comparisons</span>
            </Reveal>
            <HeroTitle className="mt-4 text-4xl md:text-6xl font-semibold tracking-tight leading-[1.05] text-[var(--text)]">
              Side-by-side comparisons of the tools I work with.
            </HeroTitle>
            <Reveal delay={0.4}>
              <p className="mt-6 text-lg md:text-xl text-[var(--text-2)] leading-relaxed">
                Scored across the dimensions that matter in production — not the
                ones that look good on a slide. Each comparison is opinionated,
                defensible, and updated for 2026.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="pb-24">
        <div className="container-page">
          <Stagger className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {comparisons.map((c) => (
              <StaggerItem key={c.slug}>
              <Link
                href={`/compare/${c.slug}`}
                className="surface-card p-7 group transition-transform hover:-translate-y-0.5 block h-full"
              >
                <div className="flex items-center justify-between">
                  <div className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-[var(--accent)]">
                    {categoryLabel[c.category]}
                  </div>
                  <div className="font-mono text-[0.65rem] uppercase tracking-[0.15em] text-[var(--text-4)]">
                    {formatDate(c.publishedAt)}
                  </div>
                </div>
                <h2 className="mt-4 text-xl md:text-2xl font-semibold text-[var(--text)] group-hover:text-[var(--accent)] transition-colors leading-snug">
                  {c.title}
                </h2>
                <p className="mt-3 text-sm md:text-[0.95rem] text-[var(--text-2)] leading-relaxed">
                  {c.subtitle}
                </p>
                <div className="mt-5 flex flex-wrap gap-1.5">
                  {c.vendors.map((v) => (
                    <span key={v.vendor} className="tag">
                      {v.vendor}
                    </span>
                  ))}
                </div>
                <div className="mt-6 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.16em] text-[var(--text-3)] group-hover:text-[var(--accent)]">
                  Read comparison <span aria-hidden>→</span>
                </div>
              </Link>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>
    </div>
  );
}
