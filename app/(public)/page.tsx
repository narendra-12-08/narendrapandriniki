import type { Metadata } from "next";
import Link from "next/link";
import { services } from "@/lib/content/services";
import { solutions } from "@/lib/content/solutions";
import { caseStudies } from "@/lib/content/work";

export const metadata: Metadata = {
  title: "Narendra Pandrinki — Platform & Cloud Engineer",
  description:
    "Independent platform and cloud engineer. Cloud infrastructure, backend systems, internal tools, and workflow automation for businesses.",
};

const credibilityItems = [
  "AWS & GCP production environments",
  "Kubernetes & container platforms",
  "Infrastructure as Code (Terraform)",
  "CI/CD pipeline design",
  "Backend APIs & data systems",
  "Internal tools & admin dashboards",
  "Workflow & process automation",
  "Reporting & operations platforms",
];

export default function HomePage() {
  return (
    <div style={{ backgroundColor: "#faf7f2" }}>
      {/* Hero */}
      <section
        style={{ backgroundColor: "#faf7f2", borderBottom: "1px solid #dfc5a5" }}
        className="py-24 md:py-36"
      >
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-3xl">
            <p
              style={{ color: "#9b7653" }}
              className="text-sm font-semibold uppercase tracking-widest mb-6"
            >
              Independent Engineering Consultancy
            </p>
            <h1
              style={{ color: "#1e1208" }}
              className="text-4xl md:text-6xl font-semibold leading-tight mb-8"
            >
              Cloud infrastructure and backend systems that{" "}
              <span style={{ color: "#5c3d1e" }}>work at scale</span>
            </h1>
            <p
              style={{ color: "#7d5c3a" }}
              className="text-xl leading-relaxed mb-10 max-w-2xl"
            >
              I build and manage cloud environments, backend systems, internal
              tools, and workflow automation for businesses that need reliable
              engineering delivered properly — without the overhead of a full
              team.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/contact"
                style={{ backgroundColor: "#5c3d1e", color: "#faf7f2" }}
                className="inline-flex items-center justify-center px-8 py-4 text-sm font-semibold rounded hover:opacity-90 transition-opacity"
              >
                Start a conversation
              </Link>
              <Link
                href="/work"
                style={{
                  color: "#5c3d1e",
                  border: "1px solid #9b7653",
                }}
                className="inline-flex items-center justify-center px-8 py-4 text-sm font-semibold rounded hover:opacity-80 transition-opacity"
              >
                See the work
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Credibility strip */}
      <section
        style={{ backgroundColor: "#f5ede0", borderBottom: "1px solid #dfc5a5" }}
        className="py-8"
      >
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex flex-wrap gap-x-8 gap-y-3">
            {credibilityItems.map((item) => (
              <span
                key={item}
                style={{ color: "#9b7653" }}
                className="text-sm font-medium"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Value prop */}
      <section className="py-24" style={{ backgroundColor: "#faf7f2" }}>
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <p
                style={{ color: "#9b7653" }}
                className="text-sm font-semibold uppercase tracking-widest mb-4"
              >
                What I do
              </p>
              <h2
                style={{ color: "#1e1208" }}
                className="text-3xl md:text-4xl font-semibold leading-tight mb-6"
              >
                Engineering that keeps your operations running
              </h2>
              <p style={{ color: "#7d5c3a" }} className="text-lg leading-relaxed mb-6">
                Businesses hire me when they need someone who can take ownership
                of complex engineering problems — cloud infrastructure, backend
                systems, automation, internal tools — and deliver them properly,
                without hand-holding.
              </p>
              <p style={{ color: "#7d5c3a" }} className="text-lg leading-relaxed">
                I work as a direct extension of your team or as an independent
                consultant, depending on what the engagement needs. Projects,
                retainers, or specific scopes of work.
              </p>
            </div>
            <div className="space-y-6">
              {[
                {
                  title: "Cloud infrastructure that scales",
                  desc: "AWS and GCP environments built properly — resilient, cost-efficient, and production-ready from day one.",
                },
                {
                  title: "Backend systems built for production",
                  desc: "APIs, data pipelines, and async systems engineered to handle real workloads and evolve without surgery.",
                },
                {
                  title: "Internal tools that fit your workflow",
                  desc: "Admin dashboards, operational platforms, and client portals built around how your business actually works.",
                },
                {
                  title: "Automation that removes manual work",
                  desc: "Workflow automation and system integrations that eliminate repetitive tasks and connect your tools properly.",
                },
              ].map(({ title, desc }) => (
                <div
                  key={title}
                  style={{ borderLeft: "2px solid #cfa97e" }}
                  className="pl-6"
                >
                  <h3
                    style={{ color: "#1e1208" }}
                    className="font-semibold mb-2"
                  >
                    {title}
                  </h3>
                  <p style={{ color: "#9b7653" }} className="text-sm leading-relaxed">
                    {desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services preview */}
      <section
        style={{
          backgroundColor: "#f5ede0",
          borderTop: "1px solid #dfc5a5",
          borderBottom: "1px solid #dfc5a5",
        }}
        className="py-24"
      >
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p
                style={{ color: "#9b7653" }}
                className="text-sm font-semibold uppercase tracking-widest mb-3"
              >
                Services
              </p>
              <h2
                style={{ color: "#1e1208" }}
                className="text-3xl md:text-4xl font-semibold"
              >
                What I build
              </h2>
            </div>
            <Link
              href="/services"
              style={{ color: "#5c3d1e" }}
              className="hidden sm:inline text-sm font-semibold underline underline-offset-4"
            >
              All services →
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <Link
                key={service.slug}
                href={`/services/${service.slug}`}
                style={{
                  backgroundColor: "#faf7f2",
                  border: "1px solid #dfc5a5",
                }}
                className="group p-7 rounded-lg hover:border-[#9b7653] transition-colors block"
              >
                <h3
                  style={{ color: "#1e1208" }}
                  className="font-semibold mb-3 group-hover:text-[#5c3d1e] transition-colors"
                >
                  {service.title}
                </h3>
                <p style={{ color: "#9b7653" }} className="text-sm leading-relaxed">
                  {service.shortDescription}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Solutions preview */}
      <section className="py-24" style={{ backgroundColor: "#faf7f2" }}>
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p
                style={{ color: "#9b7653" }}
                className="text-sm font-semibold uppercase tracking-widest mb-3"
              >
                Solutions
              </p>
              <h2
                style={{ color: "#1e1208" }}
                className="text-3xl md:text-4xl font-semibold"
              >
                Outcomes for your business
              </h2>
            </div>
            <Link
              href="/solutions"
              style={{ color: "#5c3d1e" }}
              className="hidden sm:inline text-sm font-semibold underline underline-offset-4"
            >
              All solutions →
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {solutions.slice(0, 6).map((solution) => (
              <Link
                key={solution.slug}
                href={`/solutions/${solution.slug}`}
                style={{ border: "1px solid #dfc5a5" }}
                className="group p-7 rounded-lg hover:border-[#9b7653] transition-colors block"
              >
                <h3
                  style={{ color: "#1e1208" }}
                  className="font-semibold mb-3 group-hover:text-[#5c3d1e] transition-colors"
                >
                  {solution.title}
                </h3>
                <p style={{ color: "#9b7653" }} className="text-sm leading-relaxed">
                  {solution.shortDescription}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Work preview */}
      <section
        style={{
          backgroundColor: "#f5ede0",
          borderTop: "1px solid #dfc5a5",
          borderBottom: "1px solid #dfc5a5",
        }}
        className="py-24"
      >
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p
                style={{ color: "#9b7653" }}
                className="text-sm font-semibold uppercase tracking-widest mb-3"
              >
                Case Studies
              </p>
              <h2
                style={{ color: "#1e1208" }}
                className="text-3xl md:text-4xl font-semibold"
              >
                Selected work
              </h2>
            </div>
            <Link
              href="/work"
              style={{ color: "#5c3d1e" }}
              className="hidden sm:inline text-sm font-semibold underline underline-offset-4"
            >
              All work →
            </Link>
          </div>

          <div className="space-y-6">
            {caseStudies.slice(0, 3).map((study) => (
              <Link
                key={study.slug}
                href={`/work/${study.slug}`}
                style={{
                  backgroundColor: "#faf7f2",
                  border: "1px solid #dfc5a5",
                }}
                className="group flex flex-col md:flex-row md:items-center gap-6 p-7 rounded-lg hover:border-[#9b7653] transition-colors block"
              >
                <div className="flex-1">
                  <div className="flex flex-wrap gap-2 mb-3">
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
                  <h3
                    style={{ color: "#1e1208" }}
                    className="font-semibold text-lg mb-2 group-hover:text-[#5c3d1e] transition-colors"
                  >
                    {study.title}
                  </h3>
                  <p style={{ color: "#9b7653" }} className="text-sm">
                    {study.client}
                  </p>
                </div>
                <div
                  style={{ borderLeft: "1px solid #dfc5a5" }}
                  className="hidden md:block pl-8 min-w-[200px]"
                >
                  <p
                    style={{ color: "#9b7653" }}
                    className="text-xs font-semibold uppercase tracking-widest mb-1"
                  >
                    Outcome
                  </p>
                  <p style={{ color: "#5c3d1e" }} className="text-sm font-medium">
                    {study.outcome}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        style={{ backgroundColor: "#2a1608" }}
        className="py-24"
      >
        <div className="container mx-auto px-6 lg:px-12 text-center">
          <p
            style={{ color: "#cfa97e" }}
            className="text-sm font-semibold uppercase tracking-widest mb-6"
          >
            Work with me
          </p>
          <h2
            style={{ color: "#faf7f2" }}
            className="text-3xl md:text-4xl font-semibold mb-6 max-w-2xl mx-auto leading-tight"
          >
            Have an engineering problem that needs solving?
          </h2>
          <p
            style={{ color: "#9b7653" }}
            className="text-lg mb-10 max-w-xl mx-auto"
          >
            Tell me what you're trying to build or fix. I'll let you know
            whether I can help and how I'd approach it.
          </p>
          <Link
            href="/contact"
            style={{ backgroundColor: "#cfa97e", color: "#1e1208" }}
            className="inline-flex items-center justify-center px-10 py-4 text-sm font-semibold rounded hover:opacity-90 transition-opacity"
          >
            Get in touch
          </Link>
        </div>
      </section>
    </div>
  );
}
