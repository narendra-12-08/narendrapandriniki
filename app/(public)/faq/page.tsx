import type { Metadata } from "next";
import Link from "next/link";
import { faqs, type FAQ } from "@/lib/content/faq";
import JsonLd from "@/components/seo/JsonLd";
import { faqSchema, breadcrumbSchema } from "@/lib/seo/schema";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Common questions about engagements, pricing, technical scope, and how I work as an independent platform engineer.",
  alternates: { canonical: "/faq" },
};

const categoryOrder: FAQ["category"][] = ["engagement", "pricing", "technical", "general"];
const categoryLabels: Record<FAQ["category"], string> = {
  engagement: "Engagement",
  pricing: "Pricing",
  technical: "Technical",
  general: "General",
};

export default function FAQPage() {
  const grouped = categoryOrder.map((cat) => ({
    category: cat,
    items: faqs.filter((f) => f.category === cat),
  }));

  return (
    <div>
      <JsonLd
        id="ld-faq"
        data={faqSchema(
          faqs.map((f) => ({ question: f.question, answer: f.answer }))
        )}
      />
      <JsonLd
        id="ld-faq-breadcrumbs"
        data={breadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "FAQ", url: "/faq" },
        ])}
      />
      <section className="section bg-grid">
        <div className="container-page">
          <p className="eyebrow">FAQ</p>
          <h1 className="text-4xl md:text-6xl font-semibold tracking-tight mt-6 max-w-3xl">
            <span className="gradient-text">Questions</span> people usually ask
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[var(--text-2)]">
            Direct answers to the things that come up most often before, during,
            and after an engagement. If your question isn&rsquo;t here, drop me a line
            and I&rsquo;ll answer it directly.
          </p>
        </div>
      </section>

      {grouped.map(({ category, items }) =>
        items.length === 0 ? null : (
          <section key={category} className="section pt-0">
            <div className="container-page">
              <div className="hairline mb-12" />
              <div className="grid md:grid-cols-3 gap-12">
                <div>
                  <p className="eyebrow">{categoryLabels[category]}</p>
                  <h2 className="text-2xl md:text-3xl font-semibold tracking-tight mt-4 text-[var(--text)]">
                    {categoryLabels[category]} questions
                  </h2>
                </div>
                <div className="md:col-span-2 space-y-3">
                  {items.map((f) => (
                    <details
                      key={f.id}
                      className="surface-card p-6 group"
                    >
                      <summary className="flex items-start justify-between gap-4 cursor-pointer list-none text-[var(--text)] font-medium">
                        <span>{f.question}</span>
                        <span
                          className="text-[var(--accent)] font-mono text-xl leading-none transition-transform group-open:rotate-45 flex-shrink-0"
                          aria-hidden="true"
                        >
                          +
                        </span>
                      </summary>
                      <p className="mt-4 pt-4 border-t border-[var(--border)] text-[var(--text-2)] leading-relaxed text-sm">
                        {f.answer}
                      </p>
                    </details>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )
      )}

      <section className="section pt-0">
        <div className="container-page">
          <div className="surface-card p-10 md:p-14 text-center">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
              Still have a question?
            </h2>
            <p className="mt-4 max-w-xl mx-auto text-[var(--text-2)]">
              Email <a className="text-[var(--accent)]" href="mailto:hello@narendrapandrinki.com">hello@narendrapandrinki.com</a> or
              use the contact form. I read everything.
            </p>
            <div className="mt-8 flex flex-wrap gap-3 justify-center">
              <Link href="/contact" className="btn-primary">Contact</Link>
              <Link href="/process" className="btn-ghost">How I work</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
