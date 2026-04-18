import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description:
    "Independent platform and cloud engineer. Who I help, what I build, and how I work.",
};

const capabilities = [
  "Cloud infrastructure design and build (AWS, GCP)",
  "Infrastructure as Code — Terraform, Pulumi",
  "Container orchestration — Kubernetes, ECS, EKS",
  "CI/CD pipeline design and implementation",
  "Backend APIs and data systems",
  "Internal tools and admin dashboards",
  "Workflow automation and system integrations",
  "Reporting systems and operational dashboards",
  "Platform engineering and developer tooling",
  "Monitoring, observability, and incident response",
];

const workingWith = [
  {
    title: "Growing SaaS businesses",
    desc: "Teams that have outgrown their initial infrastructure and need it rebuilt properly before the next phase of growth.",
  },
  {
    title: "Digital agencies",
    desc: "Agencies that need internal operations platforms, client portals, or backend systems for their clients.",
  },
  {
    title: "Scale-ups building platform capability",
    desc: "Engineering teams that need to establish a platform engineering function or build internal developer tooling.",
  },
  {
    title: "Businesses automating manual processes",
    desc: "Organisations with operational processes that should be automated but haven't been yet.",
  },
];

export default function AboutPage() {
  return (
    <div style={{ backgroundColor: "#faf7f2" }}>
      {/* Header */}
      <section
        style={{ borderBottom: "1px solid #dfc5a5" }}
        className="py-24"
      >
        <div className="container mx-auto px-6 lg:px-12">
          <p
            style={{ color: "#9b7653" }}
            className="text-sm font-semibold uppercase tracking-widest mb-6"
          >
            About
          </p>
          <h1
            style={{ color: "#1e1208" }}
            className="text-4xl md:text-5xl font-semibold max-w-3xl leading-tight mb-8"
          >
            Engineering delivered as a service, not a job title
          </h1>
          <p
            style={{ color: "#7d5c3a" }}
            className="text-xl leading-relaxed max-w-2xl"
          >
            I work with businesses as an independent engineer — taking on the
            infrastructure, backend systems, internal tools, and automation work
            that needs to be done properly but doesn't justify a full-time hire.
          </p>
        </div>
      </section>

      {/* Who I help */}
      <section className="py-20" style={{ borderBottom: "1px solid #dfc5a5" }}>
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid md:grid-cols-5 gap-12">
            <div className="md:col-span-2">
              <p
                style={{ color: "#9b7653" }}
                className="text-sm font-semibold uppercase tracking-widest mb-4"
              >
                Who I work with
              </p>
              <h2
                style={{ color: "#1e1208" }}
                className="text-2xl md:text-3xl font-semibold leading-tight"
              >
                Teams that need engineering done properly
              </h2>
            </div>
            <div className="md:col-span-3 grid sm:grid-cols-2 gap-6">
              {workingWith.map(({ title, desc }) => (
                <div
                  key={title}
                  style={{ border: "1px solid #dfc5a5" }}
                  className="p-6 rounded-lg"
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

      {/* What I build */}
      <section
        className="py-20"
        style={{
          backgroundColor: "#f5ede0",
          borderBottom: "1px solid #dfc5a5",
        }}
      >
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid md:grid-cols-5 gap-12">
            <div className="md:col-span-2">
              <p
                style={{ color: "#9b7653" }}
                className="text-sm font-semibold uppercase tracking-widest mb-4"
              >
                Capability
              </p>
              <h2
                style={{ color: "#1e1208" }}
                className="text-2xl md:text-3xl font-semibold leading-tight mb-4"
              >
                What I build and manage
              </h2>
              <p style={{ color: "#7d5c3a" }} className="text-base leading-relaxed">
                A cross-section of infrastructure, backend, and operations
                engineering — the technical foundation businesses run on.
              </p>
            </div>
            <div className="md:col-span-3">
              <ul className="space-y-3">
                {capabilities.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span
                      style={{ color: "#cfa97e" }}
                      className="mt-1 flex-shrink-0"
                    >
                      —
                    </span>
                    <span style={{ color: "#5c3d1e" }} className="text-base">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How I work */}
      <section className="py-20" style={{ borderBottom: "1px solid #dfc5a5" }}>
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-3xl">
            <p
              style={{ color: "#9b7653" }}
              className="text-sm font-semibold uppercase tracking-widest mb-4"
            >
              How I work
            </p>
            <h2
              style={{ color: "#1e1208" }}
              className="text-2xl md:text-3xl font-semibold mb-8"
            >
              Direct, accountable, and commercially focused
            </h2>
            <div className="space-y-8">
              {[
                {
                  step: "01",
                  title: "Discovery first",
                  body: "Before writing code or proposing architecture, I understand what you're actually trying to achieve — what the business requires, what constraints matter, and what success looks like. Most engineering problems are solved by clear thinking before the work begins.",
                },
                {
                  step: "02",
                  title: "Architecture once",
                  body: "I design the system clearly before building it. Not overengineered, not speculative — designed for the actual requirements with the right level of abstraction and future flexibility.",
                },
                {
                  step: "03",
                  title: "Execution in batches",
                  body: "Work is delivered in usable increments. You see progress and can give feedback throughout the engagement, not just at handover. Most projects benefit from shipping something useful early rather than waiting for everything to be perfect.",
                },
                {
                  step: "04",
                  title: "Documentation and handover",
                  body: "Everything I build comes with documentation your team can actually use. Runbooks, architecture diagrams, deployment processes, and the tribal knowledge written down — not left in my head.",
                },
              ].map(({ step, title, body }) => (
                <div key={step} className="grid grid-cols-12 gap-6">
                  <div className="col-span-1">
                    <span
                      style={{ color: "#cfa97e" }}
                      className="text-sm font-mono"
                    >
                      {step}
                    </span>
                  </div>
                  <div className="col-span-11">
                    <h3
                      style={{ color: "#1e1208" }}
                      className="font-semibold mb-2"
                    >
                      {title}
                    </h3>
                    <p style={{ color: "#7d5c3a" }} className="leading-relaxed">
                      {body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why hire */}
      <section
        className="py-20"
        style={{ backgroundColor: "#f5ede0", borderBottom: "1px solid #dfc5a5" }}
      >
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-3xl">
            <p
              style={{ color: "#9b7653" }}
              className="text-sm font-semibold uppercase tracking-widest mb-4"
            >
              Why businesses hire me
            </p>
            <h2
              style={{ color: "#1e1208" }}
              className="text-2xl md:text-3xl font-semibold mb-8"
            >
              Senior engineering without the overhead
            </h2>
            <p style={{ color: "#7d5c3a" }} className="text-lg leading-relaxed mb-6">
              A senior engineer costs £80–120k/year as a full-time hire — plus
              recruitment, onboarding, management overhead, and the time it takes
              to become effective. For businesses that need significant engineering
              capability without a full-time headcount, an independent engagement
              is often far more effective.
            </p>
            <p style={{ color: "#7d5c3a" }} className="text-lg leading-relaxed mb-6">
              I bring cross-functional depth: infrastructure, backend, and
              product-facing tooling. Most engineering problems span more than one
              of these. Having someone who can take end-to-end ownership avoids
              the coordination overhead of multiple specialists.
            </p>
            <p style={{ color: "#7d5c3a" }} className="text-lg leading-relaxed">
              Engagements are shaped around what you need: a defined project with
              a clear end point, an ongoing monthly retainer, or specific advisory
              work. I'm a direct extension of your team, not a vendor.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-xl">
            <h2
              style={{ color: "#1e1208" }}
              className="text-2xl md:text-3xl font-semibold mb-4"
            >
              Let's talk about what you need
            </h2>
            <p style={{ color: "#7d5c3a" }} className="text-lg mb-8">
              Tell me about your engineering problem. I'll respond with an honest
              view on whether I can help and how.
            </p>
            <Link
              href="/contact"
              style={{ backgroundColor: "#5c3d1e", color: "#faf7f2" }}
              className="inline-flex items-center justify-center px-8 py-4 text-sm font-semibold rounded hover:opacity-90 transition-opacity"
            >
              Get in touch
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
