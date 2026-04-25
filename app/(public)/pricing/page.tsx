import type { Metadata } from "next";
import Link from "next/link";
import { getPricingTiers } from "@/lib/db/content-extra";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Three engagement models — project, retainer, and fractional. Transparent pricing for senior platform and DevOps work.",
};

export default async function PricingPage() {
  const pricingTiers = await getPricingTiers();
  const middleSlug = pricingTiers[1]?.slug;

  return (
    <div>
      <section className="section bg-grid">
        <div className="container-page">
          <p className="eyebrow">Pricing</p>
          <h1 className="text-4xl md:text-6xl font-semibold tracking-tight mt-6 max-w-3xl">
            Three ways to <span className="gradient-text">work together</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[var(--text-2)]">
            Project, retainer, or fractional. Each fits a different shape of need.
            Most engagements start as one and evolve into another. All fees are
            in USD for international clients (INR for India), exclusive of taxes, invoiced monthly with 14-day terms.
          </p>
        </div>
      </section>

      <section className="section pt-0">
        <div className="container-page">
          <div className="grid lg:grid-cols-3 gap-6">
            {pricingTiers.map((tier) => {
              const isHighlighted = tier.slug === middleSlug;
              return (
                <div
                  key={tier.slug}
                  className={`surface-card p-8 flex flex-col ${isHighlighted ? "glow-ring" : ""}`}
                >
                  {isHighlighted && (
                    <div className="mb-4">
                      <span className="tag font-mono text-xs text-[var(--accent)] border-[var(--accent)]">
                        Most common
                      </span>
                    </div>
                  )}
                  <h2 className="text-2xl font-semibold tracking-tight text-[var(--text)]">
                    {tier.name}
                  </h2>
                  <p className="mt-2 text-sm text-[var(--text-3)]">{tier.tagline}</p>

                  <div className="mt-6 pb-6 border-b border-[var(--border)]">
                    <p className="text-3xl md:text-4xl font-semibold gradient-text">
                      {tier.price_label}
                    </p>
                    <p className="mt-2 text-xs text-[var(--text-3)] leading-relaxed">
                      {tier.price_note}
                    </p>
                  </div>

                  <p className="mt-6 text-sm text-[var(--text-2)] leading-relaxed">
                    {tier.description}
                  </p>

                  <div className="mt-6 pt-6 border-t border-[var(--border)]">
                    <p className="eyebrow text-xs">Ideal for</p>
                    <p className="mt-3 text-sm text-[var(--text-2)] leading-relaxed">
                      {tier.ideal_for}
                    </p>
                  </div>

                  <div className="mt-6 pt-6 border-t border-[var(--border)]">
                    <p className="eyebrow text-xs">Includes</p>
                    <ul className="mt-3 space-y-2">
                      {tier.includes.map((item, i) => (
                        <li key={i} className="flex gap-3 text-sm text-[var(--text-2)] leading-relaxed">
                          <span className="text-[var(--accent)] flex-shrink-0">&#10003;</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {tier.not_included && tier.not_included.length > 0 && (
                    <div className="mt-6 pt-6 border-t border-[var(--border)]">
                      <p className="eyebrow text-xs">Not included</p>
                      <ul className="mt-3 space-y-2">
                        {tier.not_included.map((item, i) => (
                          <li
                            key={i}
                            className="flex gap-3 text-sm text-[var(--text-3)] leading-relaxed line-through"
                          >
                            <span className="flex-shrink-0 not-[]:no-underline">&#215;</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="mt-8 pt-2">
                    <Link
                      href="/contact"
                      className={isHighlighted ? "btn-primary w-full justify-center" : "btn-ghost w-full justify-center"}
                    >
                      {tier.cta}
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
          <div className="surface-card p-10 md:p-14 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <p className="eyebrow">Questions about pricing?</p>
              <h2 className="text-2xl md:text-3xl font-semibold tracking-tight mt-3">
                There&rsquo;s a longer answer in the FAQ
              </h2>
              <p className="mt-3 text-[var(--text-2)] max-w-xl">
                Discovery weeks, fixed-fee versus time-and-materials, scope changes,
                NDAs, on-call coverage, and the rest.
              </p>
            </div>
            <Link href="/faq" className="btn-primary flex-shrink-0">
              Read the FAQ
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
