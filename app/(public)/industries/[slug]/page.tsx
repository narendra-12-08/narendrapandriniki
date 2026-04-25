import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { industries, getIndustry } from "@/lib/content/industries";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return industries.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const industry = getIndustry(slug);
  if (!industry) return {};
  return {
    title: industry.title,
    description: industry.shortDescription,
  };
}

export default async function IndustryDetailPage({ params }: Props) {
  const { slug } = await params;
  const industry = getIndustry(slug);
  if (!industry) notFound();

  const related = industries.filter((i) => i.slug !== slug).slice(0, 3);

  return (
    <div>
      <section className="section bg-grid">
        <div className="container-page">
          <Link
            href="/industries"
            className="text-sm text-[var(--text-3)] hover:text-[var(--accent)] transition-colors"
          >
            &larr; Industries
          </Link>
          <p className="eyebrow mt-8">{industry.tagline}</p>
          <h1 className="text-4xl md:text-6xl font-semibold tracking-tight mt-6 max-w-4xl">
            <span className="gradient-text">{industry.title}</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[var(--text-2)]">
            {industry.shortDescription}
          </p>
        </div>
      </section>

      <section className="section pt-0">
        <div className="container-page">
          <p className="eyebrow">Pain points I tend to see</p>
          <div className="mt-8 grid md:grid-cols-2 gap-5">
            {industry.painPoints.map((point, i) => (
              <div key={i} className="surface-card p-6 flex gap-4">
                <span className="font-mono text-sm text-[var(--accent)] flex-shrink-0">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="text-[var(--text-2)] leading-relaxed text-sm">
                  {point}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section pt-0">
        <div className="container-page grid md:grid-cols-3 gap-12">
          <div className="md:col-span-2">
            <p className="eyebrow">How I help</p>
            <p className="mt-6 text-lg leading-relaxed text-[var(--text-2)]">
              {industry.howIHelp}
            </p>
          </div>
          <div className="surface-card p-6">
            <p className="eyebrow">Typical engagement</p>
            <p className="mt-4 text-[var(--text)] leading-relaxed">
              {industry.typicalEngagement}
            </p>
            <Link href="/contact" className="btn-primary mt-6 w-full justify-center">
              Discuss a project
            </Link>
          </div>
        </div>
      </section>

      <section className="section pt-0">
        <div className="container-page">
          <p className="eyebrow">Common stack</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {industry.commonStack.map((tech) => (
              <span key={tech} className="tag font-mono">
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="section pt-0">
        <div className="container-page">
          <div className="hairline mb-16" />
          <div className="prose-dark max-w-3xl">
            {industry.content.trim().split("\n\n").map((para, i) => {
              if (para.startsWith("## ")) {
                return <h2 key={i}>{para.replace("## ", "")}</h2>;
              }
              if (para.startsWith("### ")) {
                return <h3 key={i}>{para.replace("### ", "")}</h3>;
              }
              return <p key={i}>{para}</p>;
            })}
          </div>
        </div>
      </section>

      <section className="section pt-0">
        <div className="container-page">
          <div className="surface-card p-10 md:p-14 text-center">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
              Working in {industry.title.toLowerCase()}?
            </h2>
            <p className="mt-4 max-w-xl mx-auto text-[var(--text-2)]">
              Tell me what the platform looks like today and what you&rsquo;re trying to get
              to. I&rsquo;ll be honest about whether I&rsquo;m the right fit.
            </p>
            <div className="mt-8 flex flex-wrap gap-3 justify-center">
              <Link href="/contact" className="btn-primary">Get in touch</Link>
              <Link href="/pricing" className="btn-ghost">See pricing</Link>
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="section pt-0">
          <div className="container-page">
            <p className="eyebrow">Related industries</p>
            <div className="mt-8 grid md:grid-cols-3 gap-5">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/industries/${r.slug}`}
                  className="surface-card p-6 group"
                >
                  <h3 className="text-lg font-semibold text-[var(--text)] group-hover:text-[var(--accent)] transition-colors">
                    {r.title}
                  </h3>
                  <p className="mt-3 text-sm text-[var(--text-2)] leading-relaxed">
                    {r.shortDescription}
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
