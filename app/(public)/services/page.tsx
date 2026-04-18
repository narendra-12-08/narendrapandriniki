import type { Metadata } from "next";
import Link from "next/link";
import { services } from "@/lib/content/services";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Cloud & DevOps, platform engineering, backend systems, internal tools, workflow automation, and reporting dashboards.",
};

export default function ServicesPage() {
  return (
    <div style={{ backgroundColor: "#faf7f2" }}>
      <section
        style={{ borderBottom: "1px solid #dfc5a5" }}
        className="py-24"
      >
        <div className="container mx-auto px-6 lg:px-12">
          <p
            style={{ color: "#9b7653" }}
            className="text-sm font-semibold uppercase tracking-widest mb-6"
          >
            Services
          </p>
          <h1
            style={{ color: "#1e1208" }}
            className="text-4xl md:text-5xl font-semibold max-w-2xl leading-tight mb-6"
          >
            Engineering services for businesses that need it done properly
          </h1>
          <p style={{ color: "#7d5c3a" }} className="text-xl max-w-2xl leading-relaxed">
            I work across the stack — from cloud infrastructure to backend
            systems to internal tooling — taking ownership of the engineering
            problems that matter to your operations.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="space-y-6">
            {services.map((service, index) => (
              <Link
                key={service.slug}
                href={`/services/${service.slug}`}
                style={{ border: "1px solid #dfc5a5" }}
                className="group flex flex-col md:flex-row items-start gap-8 p-8 rounded-lg hover:border-[#9b7653] transition-colors block"
              >
                <div
                  style={{ color: "#cfa97e" }}
                  className="text-2xl font-mono flex-shrink-0"
                >
                  {String(index + 1).padStart(2, "0")}
                </div>
                <div className="flex-1">
                  <h2
                    style={{ color: "#1e1208" }}
                    className="text-xl font-semibold mb-3 group-hover:text-[#5c3d1e] transition-colors"
                  >
                    {service.title}
                  </h2>
                  <p style={{ color: "#7d5c3a" }} className="leading-relaxed mb-4">
                    {service.description}
                  </p>
                  <ul className="space-y-1">
                    {service.benefits.slice(0, 3).map((b) => (
                      <li
                        key={b}
                        style={{ color: "#9b7653" }}
                        className="text-sm flex items-start gap-2"
                      >
                        <span style={{ color: "#cfa97e" }}>—</span>
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex-shrink-0">
                  <span
                    style={{ color: "#5c3d1e" }}
                    className="text-sm font-semibold group-hover:underline"
                  >
                    Learn more →
                  </span>
                </div>
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
          <h2
            style={{ color: "#faf7f2" }}
            className="text-2xl md:text-3xl font-semibold mb-4"
          >
            Not sure which service fits?
          </h2>
          <p style={{ color: "#9b7653" }} className="text-lg mb-8 max-w-xl mx-auto">
            Tell me what you're trying to achieve. I'll suggest the right
            approach.
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
