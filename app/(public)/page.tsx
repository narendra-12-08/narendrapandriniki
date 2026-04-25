import type { Metadata } from "next";
import Link from "next/link";
import { services } from "@/lib/content/services";
import { solutions } from "@/lib/content/solutions";
import { caseStudies } from "@/lib/content/work";
import { testimonials } from "@/lib/content/testimonials";
import Reveal from "@/components/motion/Reveal";
import Stagger from "@/components/motion/Stagger";
import StaggerItem from "@/components/motion/StaggerItem";
import HeroTitle from "@/components/motion/HeroTitle";
import ScrollProgress from "@/components/motion/ScrollProgress";
import ParallaxBlob from "@/components/motion/ParallaxBlob";
import Marquee from "@/components/motion/Marquee";
import MagneticButton from "@/components/motion/MagneticButton";

export const metadata: Metadata = {
  title: "Narendra Pandrinki — Independent DevOps & Platform Engineer",
  description:
    "Independent DevOps, platform, and SRE engineer. Cloud foundations, Kubernetes, CI/CD, observability, and the unglamorous discipline that turns audits and peak events into routine.",
};

const credibilityIndustries = [
  "Fintech",
  "Healthtech",
  "B2B SaaS",
  "E-commerce",
  "AI / ML Infra",
  "Marketplaces",
  "Logistics",
  "Payments",
];

const stackPills = [
  "AWS",
  "GCP",
  "Azure",
  "Kubernetes",
  "Terraform",
  "Pulumi",
  "ArgoCD",
  "Karpenter",
  "Prometheus",
  "Grafana",
  "Datadog",
  "OpenTelemetry",
  "PostgreSQL",
  "Vault",
  "GitHub Actions",
  "Backstage",
  "Crossplane",
  "Helm",
];

export default function HomePage() {
  return (
    <div className="bg-grid">
      <ScrollProgress />

      {/* Hero */}
      <section className="section relative overflow-hidden">
        <ParallaxBlob
          color="cyan"
          size={560}
          opacity={0.28}
          className="left-[-180px] top-[-120px]"
        />
        <ParallaxBlob
          color="violet"
          size={520}
          opacity={0.22}
          className="right-[-160px] top-[40px]"
        />
        <div className="container-page relative">
          <div className="max-w-4xl">
            <Reveal>
              <span className="eyebrow">
                Independent DevOps Engineer · Available
              </span>
            </Reveal>
            <HeroTitle className="mt-6 text-5xl md:text-7xl font-semibold tracking-tight leading-[1.05] text-[var(--text)]">
              Cloud platforms that{" "}
              <span className="gradient-text">ship at noon</span>, not at 11pm
              on Friday.
            </HeroTitle>
            <Reveal delay={0.45}>
              <p className="mt-8 max-w-2xl text-lg md:text-xl leading-relaxed text-[var(--text-2)]">
                I&apos;m Narendra. For five years I&apos;ve been building the
                infrastructure under fintechs, healthtechs, and AI platforms.
                Resilient cloud foundations, Kubernetes that upgrades on a
                Tuesday, pipelines under ten minutes, and the boring discipline
                that decides whether incidents are 20 minutes or two hours.
              </p>
            </Reveal>

            <Reveal delay={0.55}>
              <div className="mt-10 flex flex-col sm:flex-row gap-3">
                <MagneticButton>
                  <Link href="/contact" className="btn-primary">
                    Start a project
                  </Link>
                </MagneticButton>
                <MagneticButton>
                  <Link href="/work" className="btn-ghost">
                    See selected work
                  </Link>
                </MagneticButton>
              </div>
            </Reveal>

            <Reveal delay={0.65}>
              <div className="mt-14 flex flex-wrap gap-6 font-mono text-xs uppercase tracking-[0.18em] text-[var(--text-3)]">
                <span>
                  <span className="text-[var(--text)]">5y</span> experience
                </span>
                <span className="text-[var(--text-4)]">·</span>
                <span>
                  <span className="text-[var(--text)]">30+</span> engagements
                </span>
                <span className="text-[var(--text-4)]">·</span>
                <span>
                  <span className="text-[var(--text)]">3</span> cloud providers
                </span>
                <span className="text-[var(--text-4)]">·</span>
                <span className="inline-flex items-center gap-2">
                  <span className="live-dot" /> India based
                </span>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Industries strip */}
      <section className="border-y border-[var(--border)] bg-[var(--bg-1)]/60">
        <div className="container-page py-8">
          <Reveal>
            <div className="flex flex-wrap items-center gap-x-10 gap-y-4">
              <span className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-[var(--text-4)]">
                Trusted across
              </span>
              {credibilityIndustries.map((name) => (
                <span
                  key={name}
                  className="font-mono text-sm text-[var(--text-3)] tracking-tight"
                >
                  {name}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Stack marquee */}
      <section className="border-b border-[var(--border)] bg-[var(--bg-1)]/30">
        <div className="py-6">
          <Marquee speed={48} itemClassName="gap-8 pr-8 items-center">
            {stackPills.map((s) => (
              <span
                key={s}
                className="font-mono text-sm text-[var(--text-4)] tracking-tight whitespace-nowrap"
              >
                {s}
                <span className="ml-8 text-[var(--text-4)]/40">/</span>
              </span>
            ))}
          </Marquee>
        </div>
      </section>

      {/* What I do — services bento */}
      <section className="section relative">
        <ParallaxBlob
          color="violet"
          size={480}
          opacity={0.18}
          travel={120}
          className="left-[-160px] top-[160px]"
        />
        <div className="container-page relative">
          <Reveal>
            <div className="flex items-end justify-between flex-wrap gap-6 mb-12">
              <div className="max-w-2xl">
                <span className="eyebrow">What I do</span>
                <h2 className="mt-4 text-4xl md:text-5xl font-semibold tracking-tight text-[var(--text)]">
                  The work that keeps platforms{" "}
                  <span className="gradient-text">running quietly</span>.
                </h2>
                <p className="mt-5 text-[var(--text-2)] text-lg leading-relaxed">
                  Ten focused services across cloud, platforms, Kubernetes,
                  CI/CD, IaC, SRE, security, databases, migrations, and
                  fractional leadership. I pick what fits, not what I last used.
                </p>
              </div>
              <Link
                href="/services"
                className="text-sm font-mono text-[var(--accent)] hover:opacity-80 self-start md:self-end"
              >
                All services →
              </Link>
            </div>
          </Reveal>

          <Stagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.slice(0, 6).map((s, idx) => (
              <StaggerItem
                key={s.slug}
                className={idx === 0 ? "lg:col-span-2 lg:row-span-1" : ""}
              >
                <Link
                  href={`/services/${s.slug}`}
                  className="surface-card group p-7 block transition-transform hover:-translate-y-0.5 h-full"
                >
                  <span className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-[var(--accent)]">
                    {s.tagline}
                  </span>
                  <h3 className="mt-3 text-xl font-semibold text-[var(--text)] group-hover:text-[var(--accent)] transition-colors">
                    {s.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-[var(--text-3)]">
                    {s.shortDescription}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-1.5">
                    {s.stack.slice(0, 4).map((t) => (
                      <span key={t} className="tag">
                        {t}
                      </span>
                    ))}
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Outcomes / Solutions */}
      <section className="section border-t border-[var(--border)] bg-[var(--bg-1)]/40 relative">
        <ParallaxBlob
          color="cyan"
          size={520}
          opacity={0.16}
          travel={100}
          className="right-[-180px] top-[60px]"
        />
        <div className="container-page relative">
          <Reveal>
            <div className="flex items-end justify-between flex-wrap gap-6 mb-12">
              <div className="max-w-2xl">
                <span className="eyebrow">Outcomes</span>
                <h2 className="mt-4 text-4xl md:text-5xl font-semibold tracking-tight text-[var(--text)]">
                  What you actually buy.
                </h2>
                <p className="mt-5 text-[var(--text-2)] text-lg leading-relaxed">
                  Engagements framed by the result, not the toolchain. Cost
                  under control. Cutovers without weekends. Audits that take
                  three days, not three weeks.
                </p>
              </div>
              <Link
                href="/solutions"
                className="text-sm font-mono text-[var(--accent)] hover:opacity-80 self-start md:self-end"
              >
                All solutions →
              </Link>
            </div>
          </Reveal>

          <Stagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {solutions.slice(0, 6).map((sol) => (
              <StaggerItem key={sol.slug}>
                <Link
                  href={`/solutions/${sol.slug}`}
                  className="surface-card group p-7 block transition-transform hover:-translate-y-0.5 h-full"
                >
                  <span className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-[var(--violet)]">
                    {sol.tagline}
                  </span>
                  <h3 className="mt-3 text-xl font-semibold text-[var(--text)] group-hover:text-[var(--accent)] transition-colors">
                    {sol.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-[var(--text-3)]">
                    {sol.shortDescription}
                  </p>
                  <ul className="mt-5 space-y-1.5">
                    {sol.outcomes.slice(0, 2).map((o) => (
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
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Case studies preview */}
      <section className="section">
        <div className="container-page">
          <Reveal>
            <div className="flex items-end justify-between flex-wrap gap-6 mb-12">
              <div className="max-w-2xl">
                <span className="eyebrow">Selected work</span>
                <h2 className="mt-4 text-4xl md:text-5xl font-semibold tracking-tight text-[var(--text)]">
                  Recent engagements.
                </h2>
              </div>
              <Link
                href="/work"
                className="text-sm font-mono text-[var(--accent)] hover:opacity-80 self-start md:self-end"
              >
                All case studies →
              </Link>
            </div>
          </Reveal>

          <Stagger className="space-y-4" stagger={0.09}>
            {caseStudies.slice(0, 3).map((cs) => (
              <StaggerItem key={cs.slug}>
                <Link
                  href={`/work/${cs.slug}`}
                  className="surface-card group block p-7 md:p-9 transition-colors"
                >
                  <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-10">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-[var(--text-4)]">
                        <span className="text-[var(--accent)]">
                          {cs.industry}
                        </span>
                        <span>·</span>
                        <span>{cs.duration}</span>
                      </div>
                      <h3 className="mt-3 text-xl md:text-2xl font-semibold tracking-tight text-[var(--text)] group-hover:text-[var(--accent)] transition-colors">
                        {cs.title}
                      </h3>
                      <p className="mt-3 text-sm md:text-base text-[var(--text-3)] leading-relaxed max-w-3xl">
                        {cs.outcome}
                      </p>
                      <div className="mt-5 flex flex-wrap gap-1.5">
                        {cs.tags.slice(0, 5).map((t) => (
                          <span key={t} className="tag">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-3 md:min-w-[260px] md:border-l md:border-[var(--border)] md:pl-8">
                      {cs.metrics.slice(0, 4).map((m) => (
                        <div key={m.label}>
                          <div className="font-mono text-[0.65rem] uppercase tracking-[0.15em] text-[var(--text-4)]">
                            {m.label}
                          </div>
                          <div className="mt-1 font-mono text-sm text-[var(--text)]">
                            {m.value}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Stack bar */}
      <section className="section border-y border-[var(--border)] bg-[var(--bg-1)]/40">
        <div className="container-page">
          <Reveal>
            <div className="max-w-2xl mb-10">
              <span className="eyebrow">Tech I reach for</span>
              <h2 className="mt-4 text-3xl md:text-4xl font-semibold tracking-tight text-[var(--text)]">
                Boring is a feature.
              </h2>
              <p className="mt-4 text-[var(--text-3)]">
                I pick well-understood building blocks and configure them
                deliberately. Tools earn their keep or they leave.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="flex flex-wrap gap-2">
              {stackPills.map((s) => (
                <span key={s} className="tag">
                  {s}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section">
        <div className="container-page">
          <Reveal>
            <div className="max-w-2xl mb-12">
              <span className="eyebrow">In their words</span>
              <h2 className="mt-4 text-4xl md:text-5xl font-semibold tracking-tight text-[var(--text)]">
                From the people who hired me.
              </h2>
            </div>
          </Reveal>

          <Stagger className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {testimonials.map((t) => (
              <StaggerItem key={t.id}>
                <figure className="surface-card p-8 flex flex-col justify-between h-full">
                  <blockquote className="text-[var(--text-2)] leading-relaxed text-[1.05rem]">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>
                  <figcaption className="mt-6 flex items-center gap-3">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border-2)] bg-[var(--surface-2)] font-mono text-xs text-[var(--accent)]">
                      {t.author.slice(0, 1)}
                    </span>
                    <span className="font-mono text-sm text-[var(--text-3)]">
                      {t.author}
                    </span>
                  </figcaption>
                </figure>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* CTA band */}
      <section className="section relative overflow-hidden border-t border-[var(--border)]">
        <ParallaxBlob
          color="violet"
          size={600}
          opacity={0.22}
          travel={60}
          className="left-1/2 top-0 -translate-x-1/2"
        />
        <div className="container-page relative">
          <Reveal>
            <div className="surface-card glow-ring relative p-10 md:p-16 text-center">
              <span className="eyebrow justify-center">Ready when you are</span>
              <h2 className="mt-5 text-4xl md:text-6xl font-semibold tracking-tight text-[var(--text)]">
                Have a hairy DevOps problem?
              </h2>
              <p className="mt-6 max-w-2xl mx-auto text-[var(--text-2)] text-lg">
                Tell me what you&apos;re trying to ship, fix, or untangle. I&apos;ll
                be honest about whether I&apos;m the right person and how I&apos;d
                approach it.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
                <MagneticButton>
                  <Link href="/contact" className="btn-primary">
                    Start a conversation
                  </Link>
                </MagneticButton>
                <MagneticButton>
                  <a
                    href="mailto:hello@narendrapandrinki.com"
                    className="btn-ghost"
                  >
                    hello@narendrapandrinki.com
                  </a>
                </MagneticButton>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
