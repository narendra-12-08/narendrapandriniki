import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/seo/JsonLd";
import {
  professionalServiceSchema,
  faqSchema,
  breadcrumbSchema,
  SITE_URL,
} from "@/lib/seo/schema";
import { pricingTiers } from "@/lib/content/pricing";
import { caseStudies } from "@/lib/content/work";

export const metadata: Metadata = {
  title: "Hire — Senior DevOps & Platform Engineer",
  description:
    "Senior DevOps and platform engineer available globally. Project, retainer, or fractional engagements. Currently booking Q3 2026.",
  alternates: { canonical: "/hire" },
};

const strengths: { title: string; body: string }[] = [
  {
    title: "Cloud architecture, three providers",
    body: "AWS, GCP, and Azure landing zones, multi-account organisations, networking, identity, and the boring controls that hold up under audit.",
  },
  {
    title: "Kubernetes in production",
    body: "EKS, GKE, AKS — cluster design, upgrades that don't surprise anyone, GitOps with ArgoCD, and node-pool economics that survive a finance review.",
  },
  {
    title: "CI/CD that ships quietly",
    body: "GitHub Actions, GitLab CI, Buildkite. Pipelines tuned for fast mainline, signed builds, selective tests, and merges that don't require a coffee.",
  },
  {
    title: "FinOps without slowing teams down",
    body: "Right-sizing, Karpenter and Spot strategies, committed-use instruments sized against tuned baselines — not the bloat that paid for the bill last quarter.",
  },
  {
    title: "SRE and observability",
    body: "SLOs per user journey, burn-rate alerts, OpenTelemetry, Datadog or Prometheus/Grafana — and ruthless deletion of alerts nobody acts on.",
  },
  {
    title: "Platform engineering",
    body: "Internal developer platforms, paved-path service templates, Backstage when it earns its weight, Crossplane compositions for the resources teams ask for weekly.",
  },
];

const hiringFaqs: { question: string; answer: string }[] = [
  {
    question: "What timezone do you work in?",
    answer:
      "Hyderabad, India (IST). I prefer engagements with at least four hours of overlap with my working day. That comfortably covers India, UK, EU, Singapore, Dubai, and US East. I've worked with US West and Australia teams; I structure those with explicit async expectations.",
  },
  {
    question: "What is the minimum contract length?",
    answer:
      "Four weeks is the practical floor. Six months is the sweet spot — long enough to design, build, and validate something properly, short enough to stay focused. Discovery weeks are paid and standalone, with no obligation to continue.",
  },
  {
    question: "Are you willing to do background checks and security clearance?",
    answer:
      "Yes. I've completed BPSS-equivalent checks for regulated clients and standard background checks for fintech and healthtech engagements. Higher-clearance work is available on request, lead time depending.",
  },
  {
    question: "How do you handle invoicing and contracting?",
    answer:
      "I invoice in INR for India clients and in USD for international clients, against a master services agreement and per-engagement statements of work. Comfortable signing your paper or providing my own. ",
  },
  {
    question: "Will you sign an NDA before a deeper conversation?",
    answer:
      "Always. I sign a mutual NDA before any architecture conversation goes past surface level. I'll sign yours, or send a short bilateral one if you don't have a template ready.",
  },
];

export default function HirePage() {
  const wins = caseStudies.slice(0, 3);

  return (
    <div>
      <JsonLd
        data={[
          professionalServiceSchema(),
          faqSchema(hiringFaqs),
          breadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "Hire", url: "/hire" },
          ]),
        ]}
      />

      <section className="section bg-grid">
        <div className="container-page">
          <p className="eyebrow">Hire</p>
          <h1 className="text-4xl md:text-6xl font-semibold tracking-tight mt-6 max-w-4xl">
            Senior DevOps engineer.{" "}
            <span className="gradient-text">Available globally for engagements.</span>
          </h1>
          <div className="mt-6 flex items-center gap-3">
            <span className="live-dot" />
            <span className="text-xs font-mono text-[var(--text-2)]">
              Currently booking Q3 2026
            </span>
          </div>

          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "Years", value: "5y" },
              { label: "Engagements", value: "30+" },
              { label: "Cloud providers", value: "3" },
              { label: "Remote", value: "100%" },
            ].map((m) => (
              <div
                key={m.label}
                className="surface-card p-5 font-mono"
              >
                <div className="text-2xl text-[var(--text)]">{m.value}</div>
                <div className="mt-1 text-xs uppercase tracking-[0.16em] text-[var(--text-4)]">
                  {m.label}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <a
              href={`mailto:hello@narendrapandrinki.com?subject=${encodeURIComponent(
                "Engagement enquiry"
              )}`}
              className="btn-primary"
            >
              Email hello@narendrapandrinki.com
            </a>
            <Link href="/cv" className="btn-ghost">
              View CV
            </Link>
          </div>
        </div>
      </section>

      <section className="section pt-0">
        <div className="container-page">
          <p className="eyebrow">What I do best</p>
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight mt-4 max-w-2xl">
            Six things you'd hire a senior platform engineer for.
          </h2>
          <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {strengths.map((s) => (
              <div key={s.title} className="surface-card p-6">
                <h3 className="text-lg font-semibold text-[var(--text)]">{s.title}</h3>
                <p className="mt-3 text-sm text-[var(--text-2)] leading-relaxed">
                  {s.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section pt-0">
        <div className="container-page">
          <p className="eyebrow">Engagement options</p>
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight mt-4 max-w-2xl">
            Three shapes. Pick the one that fits the problem.
          </h2>
          <div className="mt-10 grid lg:grid-cols-3 gap-5">
            {pricingTiers.map((t) => (
              <div key={t.slug} className="surface-card p-7 flex flex-col">
                <h3 className="text-xl font-semibold text-[var(--text)]">{t.name}</h3>
                <p className="mt-2 text-sm text-[var(--text-3)]">{t.tagline}</p>
                <div className="mt-5 pt-5 border-t border-[var(--border)]">
                  <p className="text-2xl font-semibold gradient-text">{t.priceLabel}</p>
                  <p className="mt-2 text-xs text-[var(--text-3)] leading-relaxed">
                    {t.priceNote}
                  </p>
                </div>
                <div className="mt-auto pt-6">
                  <Link href="/pricing" className="btn-ghost w-full justify-center">
                    {t.cta}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section pt-0">
        <div className="container-page">
          <p className="eyebrow">Past wins</p>
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight mt-4 max-w-2xl">
            Three recent engagements, picked because the numbers held up.
          </h2>
          <div className="mt-10 grid md:grid-cols-3 gap-5">
            {wins.map((c) => {
              const headline = c.metrics[0];
              return (
                <div key={c.slug} className="surface-card p-6 flex flex-col">
                  <div className="flex items-center justify-between text-xs font-mono text-[var(--text-4)] uppercase tracking-[0.14em]">
                    <span>{c.industry}</span>
                    <span>{c.duration}</span>
                  </div>
                  <p className="mt-5 text-sm text-[var(--text-2)] leading-relaxed">
                    {c.outcome}
                  </p>
                  {headline && (
                    <div className="mt-6 pt-5 border-t border-[var(--border)]">
                      <div className="text-xs uppercase tracking-[0.14em] text-[var(--text-4)] font-mono">
                        {headline.label}
                      </div>
                      <div className="mt-2 text-2xl font-mono gradient-text">
                        {headline.value}
                      </div>
                    </div>
                  )}
                  <div className="mt-auto pt-6">
                    <Link
                      href={`/work/${c.slug}`}
                      className="text-sm text-[var(--accent)] hover:opacity-80"
                    >
                      Read the engagement &rarr;
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section pt-0">
        <div className="container-page">
          <p className="eyebrow">How to start</p>
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight mt-4 max-w-2xl">
            Three steps. No portal. No forms.
          </h2>
          <div className="mt-10 grid md:grid-cols-3 gap-5">
            {[
              {
                n: 1,
                title: "Send a 3-line email",
                body: "Who you are, what's broken or what you're building, and the rough timeline. That's enough to know whether a call makes sense.",
              },
              {
                n: 2,
                title: "30-min discovery call within 48h",
                body: "I'll come back inside two working days with calendar slots. The first call is free and is for me to understand the problem and tell you whether I'm the right fit.",
              },
              {
                n: 3,
                title: "Proposal within a week",
                body: "If we both want to move forward, you get a written proposal with scope, milestones, fee, and assumptions. No surprises later.",
              },
            ].map((s) => (
              <div key={s.n} className="surface-card p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--accent)] text-[var(--accent)] font-mono">
                  {s.n}
                </div>
                <h3 className="mt-5 text-lg font-semibold text-[var(--text)]">
                  {s.title}
                </h3>
                <p className="mt-3 text-sm text-[var(--text-2)] leading-relaxed">
                  {s.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section pt-0">
        <div className="container-page">
          <p className="eyebrow">FAQ for hiring</p>
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight mt-4 max-w-2xl">
            The questions that come up before contracts.
          </h2>
          <div className="mt-10 surface-card divide-y divide-[var(--border)]">
            {hiringFaqs.map((f) => (
              <details key={f.question} className="group p-6">
                <summary className="flex cursor-pointer items-center justify-between gap-4 text-base font-medium text-[var(--text)]">
                  <span>{f.question}</span>
                  <span className="font-mono text-[var(--text-3)] group-open:rotate-45 transition-transform">
                    +
                  </span>
                </summary>
                <p className="mt-4 text-sm text-[var(--text-2)] leading-relaxed">
                  {f.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="section pt-0">
        <div className="container-page">
          <div className="surface-card p-10 md:p-14 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 glow-ring">
            <div>
              <p className="eyebrow">Ready when you are</p>
              <h2 className="mt-4 text-2xl md:text-3xl font-semibold tracking-tight max-w-2xl">
                Three lines is enough to start a conversation.
              </h2>
              <p className="mt-3 text-sm text-[var(--text-2)] max-w-xl leading-relaxed">
                Tell me who you are, what's on fire (or what you're building), and a
                rough timeline. I respond inside two working days.
              </p>
            </div>
            <a
              href={`mailto:hello@narendrapandrinki.com?subject=${encodeURIComponent(
                "Engagement enquiry"
              )}`}
              className="btn-primary"
            >
              hello@narendrapandrinki.com
            </a>
          </div>
          <p className="mt-6 text-xs font-mono text-[var(--text-4)]">
            {SITE_URL}/hire
          </p>
        </div>
      </section>
    </div>
  );
}
