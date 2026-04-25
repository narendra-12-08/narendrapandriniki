import type { Metadata } from "next";
import Link from "next/link";
import { services } from "@/lib/content/services";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Cloud, platform, Kubernetes, CI/CD, IaC, SRE, DevSecOps, databases, migrations, and fractional DevOps leadership.",
};

export default function ServicesPage() {
  return (
    <div className="bg-grid">
      <section className="section pb-12">
        <div className="container-page">
          <span className="eyebrow">Services</span>
          <h1 className="mt-6 text-5xl md:text-7xl font-semibold tracking-tight leading-[1.05] text-[var(--text)] max-w-4xl">
            Ten focused engagements.{" "}
            <span className="gradient-text">One operator.</span>
          </h1>
          <p className="mt-8 max-w-2xl text-lg text-[var(--text-2)] leading-relaxed">
            I take on a small number of engagements at any one time so the
            attention is real. Pick the shape that fits — fixed-scope project,
            embedded fractional, or a focused remediation.
          </p>
        </div>
      </section>

      <section className="pb-32">
        <div className="container-page">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map((s, idx) => (
              <Link
                key={s.slug}
                href={`/services/${s.slug}`}
                className={`surface-card group p-7 block transition-transform hover:-translate-y-0.5 ${
                  idx === 0 || idx === 5
                    ? "md:col-span-2 lg:col-span-2"
                    : ""
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-[var(--accent)]">
                    {s.tagline}
                  </span>
                  <span className="font-mono text-[0.65rem] text-[var(--text-4)]">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                </div>
                <h2 className="mt-3 text-xl md:text-2xl font-semibold text-[var(--text)] group-hover:text-[var(--accent)] transition-colors tracking-tight">
                  {s.title}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-[var(--text-3)]">
                  {s.shortDescription}
                </p>
                <div className="mt-5 flex flex-wrap gap-1.5">
                  {s.stack.slice(0, 5).map((t) => (
                    <span key={t} className="tag">
                      {t}
                    </span>
                  ))}
                </div>
                <div className="mt-6 font-mono text-xs text-[var(--accent)] opacity-0 group-hover:opacity-100 transition-opacity">
                  Read more →
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section border-t border-[var(--border)] bg-[var(--bg-1)]/40">
        <div className="container-page">
          <div className="surface-card glow-ring p-10 md:p-14 text-center">
            <span className="eyebrow justify-center">Not sure which</span>
            <h2 className="mt-5 text-3xl md:text-5xl font-semibold tracking-tight text-[var(--text)]">
              Tell me the problem. I&apos;ll tell you the shape.
            </h2>
            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
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
