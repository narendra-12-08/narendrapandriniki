import type { Metadata } from "next";
import Link from "next/link";
import { caseStudies } from "@/lib/content/work";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Selected engineering case studies — cloud migrations, platform builds, internal tools, and automation projects.",
};

export default function WorkPage() {
  return (
    <div style={{ backgroundColor: "#faf7f2" }}>
      <section style={{ borderBottom: "1px solid #dfc5a5" }} className="py-24">
        <div className="container mx-auto px-6 lg:px-12">
          <p style={{ color: "#9b7653" }} className="text-sm font-semibold uppercase tracking-widest mb-6">
            Work
          </p>
          <h1 style={{ color: "#1e1208" }} className="text-4xl md:text-5xl font-semibold max-w-2xl leading-tight mb-6">
            Selected engineering projects
          </h1>
          <p style={{ color: "#7d5c3a" }} className="text-xl max-w-2xl leading-relaxed">
            Case studies from cloud infrastructure, platform engineering,
            backend systems, and internal tooling projects.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="space-y-8">
            {caseStudies.map((study) => (
              <Link
                key={study.slug}
                href={`/work/${study.slug}`}
                style={{ border: "1px solid #dfc5a5" }}
                className="group flex flex-col md:flex-row gap-8 p-8 rounded-lg hover:border-[#9b7653] transition-colors block"
              >
                <div className="flex-1">
                  <div className="flex flex-wrap gap-2 mb-4">
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
                  <h2
                    style={{ color: "#1e1208" }}
                    className="text-2xl font-semibold mb-2 group-hover:text-[#5c3d1e] transition-colors"
                  >
                    {study.title}
                  </h2>
                  <p style={{ color: "#9b7653" }} className="text-sm mb-4">
                    {study.client}
                  </p>
                  <p style={{ color: "#7d5c3a" }} className="leading-relaxed">
                    {study.summary}
                  </p>
                </div>
                <div
                  style={{ borderLeft: "1px solid #dfc5a5" }}
                  className="hidden md:flex flex-col justify-center pl-8 min-w-[220px]"
                >
                  <p style={{ color: "#9b7653" }} className="text-xs font-semibold uppercase tracking-widest mb-2">
                    Outcome
                  </p>
                  <p style={{ color: "#5c3d1e" }} className="font-medium leading-relaxed">
                    {study.outcome}
                  </p>
                  <p style={{ color: "#9b7653" }} className="text-sm font-semibold mt-6 group-hover:text-[#5c3d1e] transition-colors">
                    Read case study →
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section style={{ backgroundColor: "#2a1608" }} className="py-20">
        <div className="container mx-auto px-6 lg:px-12 text-center">
          <h2 style={{ color: "#faf7f2" }} className="text-2xl md:text-3xl font-semibold mb-4">
            Working on something similar?
          </h2>
          <p style={{ color: "#9b7653" }} className="text-lg mb-8 max-w-xl mx-auto">
            Let's talk about whether I can help.
          </p>
          <Link
            href="/contact"
            style={{ backgroundColor: "#cfa97e", color: "#1e1208" }}
            className="inline-flex items-center px-8 py-4 text-sm font-semibold rounded hover:opacity-90 transition-opacity"
          >
            Get in touch
          </Link>
        </div>
      </section>
    </div>
  );
}
