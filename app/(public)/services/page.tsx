import type { Metadata } from "next";
import Link from "next/link";
import { getPublishedServices } from "@/lib/db/content";
import Reveal from "@/components/motion/Reveal";
import Stagger from "@/components/motion/Stagger";
import StaggerItem from "@/components/motion/StaggerItem";
import HeroTitle from "@/components/motion/HeroTitle";
import MagneticButton from "@/components/motion/MagneticButton";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Cloud, platform, Kubernetes, CI/CD, IaC, SRE, DevSecOps, databases, migrations, and fractional DevOps leadership.",
};

export default async function ServicesPage() {
  const services = await getPublishedServices();
  return (
    <div className="bg-grid">
      <section className="section pb-12">
        <div className="container-page">
          <Reveal>
            <span className="eyebrow">Services</span>
          </Reveal>
          <HeroTitle className="mt-6 text-5xl md:text-7xl font-semibold tracking-tight leading-[1.05] text-[var(--text)] max-w-4xl">
            Ten focused engagements.{" "}
            <span className="gradient-text">One operator.</span>
          </HeroTitle>
          <Reveal delay={0.4}>
            <p className="mt-8 max-w-2xl text-lg text-[var(--text-2)] leading-relaxed">
              I take on a small number of engagements at any one time so the
              attention is real. Pick the shape that fits — fixed-scope project,
              embedded fractional, or a focused remediation.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="pb-32">
        <div className="container-page">
          <Stagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map((s, idx) => (
              <StaggerItem
                key={s.slug}
                className={
                  idx === 0 || idx === 5 ? "md:col-span-2 lg:col-span-2" : ""
                }
              >
              <Link
                href={`/services/${s.slug}`}
                className="surface-card group p-7 block transition-transform hover:-translate-y-0.5 h-full"
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
                  {s.short_description}
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
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="section border-t border-[var(--border)] bg-[var(--bg-1)]/40">
        <div className="container-page">
          <Reveal>
          <div className="surface-card glow-ring p-10 md:p-14 text-center">
            <span className="eyebrow justify-center">Not sure which</span>
            <h2 className="mt-5 text-3xl md:text-5xl font-semibold tracking-tight text-[var(--text)]">
              Tell me the problem. I&apos;ll tell you the shape.
            </h2>
            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
              <MagneticButton>
                <Link href="/contact" className="btn-primary">
                  Start a conversation
                </Link>
              </MagneticButton>
            </div>
          </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
