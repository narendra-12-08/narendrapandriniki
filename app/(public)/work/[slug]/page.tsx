import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { caseStudies, getCaseStudy } from "@/lib/content/work";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return caseStudies.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) return {};
  return {
    title: study.title,
    description: study.summary,
  };
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) notFound();

  return (
    <div style={{ backgroundColor: "#faf7f2" }}>
      <section style={{ borderBottom: "1px solid #dfc5a5" }} className="py-24">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="mb-6">
            <Link href="/work" style={{ color: "#9b7653" }} className="text-sm hover:opacity-80">
              ← Work
            </Link>
          </div>
          <div className="flex flex-wrap gap-2 mb-6">
            {study.tags.map((tag) => (
              <span
                key={tag}
                style={{ backgroundColor: "#ecdcc6", color: "#5c3d1e" }}
                className="text-xs font-medium px-2 py-1 rounded"
              >
                {tag}
              </span>
            ))}
          </div>
          <h1 style={{ color: "#1e1208" }} className="text-4xl md:text-5xl font-semibold max-w-3xl leading-tight mb-4">
            {study.title}
          </h1>
          <p style={{ color: "#9b7653" }} className="text-sm mb-6">{study.client}</p>
          <div
            style={{ backgroundColor: "#f5ede0", border: "1px solid #dfc5a5" }}
            className="inline-block px-6 py-4 rounded-lg"
          >
            <p style={{ color: "#9b7653" }} className="text-xs font-semibold uppercase tracking-widest mb-1">
              Key outcome
            </p>
            <p style={{ color: "#5c3d1e" }} className="font-semibold">{study.outcome}</p>
          </div>
        </div>
      </section>

      <div className="py-20">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid md:grid-cols-3 gap-16">
            <div className="md:col-span-2">
              <div className="space-y-6">
                {study.content.trim().split("\n\n").map((para, i) => {
                  if (para.startsWith("## ")) {
                    return (
                      <h2 key={i} style={{ color: "#1e1208" }} className="text-2xl font-semibold mt-10 mb-4 first:mt-0">
                        {para.replace("## ", "")}
                      </h2>
                    );
                  }
                  if (para.startsWith("- ")) {
                    const items = para.split("\n").filter((l) => l.startsWith("- "));
                    return (
                      <ul key={i} className="space-y-2">
                        {items.map((item, j) => (
                          <li key={j} className="flex items-start gap-3">
                            <span style={{ color: "#cfa97e" }}>—</span>
                            <span style={{ color: "#7d5c3a" }} className="leading-relaxed">
                              {item.replace("- ", "")}
                            </span>
                          </li>
                        ))}
                      </ul>
                    );
                  }
                  if (para.startsWith("**")) {
                    return (
                      <p key={i} style={{ color: "#7d5c3a" }} className="leading-relaxed font-medium">
                        {para.replace(/\*\*/g, "")}
                      </p>
                    );
                  }
                  return (
                    <p key={i} style={{ color: "#7d5c3a" }} className="leading-relaxed">
                      {para}
                    </p>
                  );
                })}
              </div>
            </div>

            <div>
              <div
                style={{ backgroundColor: "#f5ede0", border: "1px solid #dfc5a5", borderRadius: "8px" }}
                className="p-6 sticky top-24"
              >
                <h3 style={{ color: "#1e1208" }} className="font-semibold mb-3">
                  Have a similar project?
                </h3>
                <p style={{ color: "#9b7653" }} className="text-sm mb-4">
                  I'd be happy to discuss your requirements and see if I can help.
                </p>
                <Link
                  href="/contact"
                  style={{ backgroundColor: "#5c3d1e", color: "#faf7f2" }}
                  className="block text-center text-sm font-semibold px-4 py-3 rounded hover:opacity-90 transition-opacity"
                >
                  Get in touch
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
