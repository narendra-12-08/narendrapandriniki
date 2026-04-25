import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { services, getService } from "@/lib/content/services";
import Markdown from "@/components/public/Markdown";
import JsonLd from "@/components/seo/JsonLd";
import { serviceSchema, breadcrumbSchema } from "@/lib/seo/schema";

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return { title: "Service" };
  return {
    title: service.title,
    description: service.shortDescription,
    alternates: { canonical: `/services/${service.slug}` },
  };
}

export default async function ServiceDetailPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  const related = services.filter((s) => s.slug !== service.slug).slice(0, 3);

  return (
    <div className="bg-grid">
      <JsonLd
        id={`ld-service-${service.slug}`}
        data={serviceSchema({
          name: service.title,
          description: service.shortDescription,
          slug: service.slug,
        })}
      />
      <JsonLd
        id={`ld-service-breadcrumbs-${service.slug}`}
        data={breadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "Services", url: "/services" },
          { name: service.title, url: `/services/${service.slug}` },
        ])}
      />
      <section className="section pb-10">
        <div className="container-page">
          <Link
            href="/services"
            className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--text-4)] hover:text-[var(--accent)]"
          >
            ← All services
          </Link>
          <div className="mt-8 max-w-4xl">
            <span className="eyebrow">{service.tagline}</span>
            <h1 className="mt-6 text-5xl md:text-7xl font-semibold tracking-tight leading-[1.05] text-[var(--text)]">
              {service.title}
            </h1>
            <p className="mt-8 text-lg md:text-xl text-[var(--text-2)] leading-relaxed">
              {service.description}
            </p>
            <div className="mt-8 flex flex-wrap gap-1.5">
              {service.stack.map((t) => (
                <span key={t} className="tag">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="pb-24">
        <div className="container-page">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-8">
              <Markdown source={service.content} />
            </div>

            <aside className="lg:col-span-4 space-y-5">
              <div className="surface-card p-7 lg:sticky lg:top-24">
                <div>
                  <div className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-[var(--accent)] mb-3">
                    Benefits
                  </div>
                  <ul className="space-y-2.5">
                    {service.benefits.map((b) => (
                      <li
                        key={b}
                        className="flex items-start gap-2.5 text-sm text-[var(--text-2)] leading-relaxed"
                      >
                        <span className="text-[var(--accent)] mt-0.5">→</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-7 pt-7 border-t border-[var(--border)]">
                  <div className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-[var(--violet)] mb-3">
                    Deliverables
                  </div>
                  <ul className="space-y-2.5">
                    {service.deliverables.map((d) => (
                      <li
                        key={d}
                        className="flex items-start gap-2.5 text-sm text-[var(--text-2)] leading-relaxed"
                      >
                        <span className="text-[var(--violet)] mt-0.5">◆</span>
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-7 pt-7 border-t border-[var(--border)]">
                  <Link href="/contact" className="btn-primary w-full">
                    Discuss this engagement
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="section border-t border-[var(--border)] bg-[var(--bg-1)]/40">
        <div className="container-page">
          <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
            <div>
              <span className="eyebrow">Related</span>
              <h2 className="mt-3 text-3xl md:text-4xl font-semibold tracking-tight text-[var(--text)]">
                Adjacent services.
              </h2>
            </div>
            <Link
              href="/services"
              className="font-mono text-sm text-[var(--accent)] hover:opacity-80"
            >
              All services →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {related.map((r) => (
              <Link
                key={r.slug}
                href={`/services/${r.slug}`}
                className="surface-card p-6 block group transition-transform hover:-translate-y-0.5"
              >
                <span className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-[var(--accent)]">
                  {r.tagline}
                </span>
                <h3 className="mt-3 text-lg font-semibold text-[var(--text)] group-hover:text-[var(--accent)] transition-colors">
                  {r.title}
                </h3>
                <p className="mt-3 text-sm text-[var(--text-3)]">
                  {r.shortDescription}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
