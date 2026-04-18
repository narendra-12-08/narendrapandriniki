import type { Metadata } from "next";
import Link from "next/link";
import { solutions } from "@/lib/content/solutions";

export const metadata: Metadata = {
  title: "Solutions",
  description:
    "Business-oriented engineering solutions — admin dashboards, client portals, internal operations platforms, workflow systems, and more.",
};

export default function SolutionsPage() {
  return (
    <div style={{ backgroundColor: "#faf7f2" }}>
      <section style={{ borderBottom: "1px solid #dfc5a5" }} className="py-24">
        <div className="container mx-auto px-6 lg:px-12">
          <p
            style={{ color: "#9b7653" }}
            className="text-sm font-semibold uppercase tracking-widest mb-6"
          >
            Solutions
          </p>
          <h1
            style={{ color: "#1e1208" }}
            className="text-4xl md:text-5xl font-semibold max-w-2xl leading-tight mb-6"
          >
            Engineering outcomes, not just deliverables
          </h1>
          <p style={{ color: "#7d5c3a" }} className="text-xl max-w-2xl leading-relaxed">
            These are the business outcomes I deliver — structured around what
            your business needs, backed by the engineering services that make
            them happen.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {solutions.map((solution) => (
              <Link
                key={solution.slug}
                href={`/solutions/${solution.slug}`}
                style={{ border: "1px solid #dfc5a5" }}
                className="group flex flex-col p-8 rounded-lg hover:border-[#9b7653] transition-colors block min-h-[220px]"
              >
                <h2
                  style={{ color: "#1e1208" }}
                  className="text-xl font-semibold mb-3 group-hover:text-[#5c3d1e] transition-colors"
                >
                  {solution.title}
                </h2>
                <p style={{ color: "#7d5c3a" }} className="text-sm leading-relaxed flex-1">
                  {solution.shortDescription}
                </p>
                <p
                  style={{ color: "#9b7653" }}
                  className="text-sm font-medium mt-6 group-hover:text-[#5c3d1e] transition-colors"
                >
                  Learn more →
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section
        style={{ backgroundColor: "#2a1608" }}
        className="py-20"
      >
        <div className="container mx-auto px-6 lg:px-12 text-center">
          <h2 style={{ color: "#faf7f2" }} className="text-2xl md:text-3xl font-semibold mb-4">
            Have a different requirement?
          </h2>
          <p style={{ color: "#9b7653" }} className="text-lg mb-8 max-w-xl mx-auto">
            Tell me what your business needs. Most engineering problems have a
            solution if we approach them properly.
          </p>
          <Link
            href="/contact"
            style={{ backgroundColor: "#cfa97e", color: "#1e1208" }}
            className="inline-flex items-center px-8 py-4 text-sm font-semibold rounded hover:opacity-90 transition-opacity"
          >
            Discuss your requirements
          </Link>
        </div>
      </section>
    </div>
  );
}
