import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { services, getService } from "@/lib/content/services";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};
  return {
    title: service.title,
    description: service.shortDescription,
  };
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  const otherServices = services.filter((s) => s.slug !== slug).slice(0, 3);

  return (
    <div style={{ backgroundColor: "#faf7f2" }}>
      <section
        style={{ borderBottom: "1px solid #dfc5a5" }}
        className="py-24"
      >
        <div className="container mx-auto px-6 lg:px-12">
          <div className="mb-6">
            <Link
              href="/services"
              style={{ color: "#9b7653" }}
              className="text-sm hover:opacity-80"
            >
              ← Services
            </Link>
          </div>
          <p
            style={{ color: "#9b7653" }}
            className="text-sm font-semibold uppercase tracking-widest mb-4"
          >
            Service
          </p>
          <h1
            style={{ color: "#1e1208" }}
            className="text-4xl md:text-5xl font-semibold max-w-3xl leading-tight mb-6"
          >
            {service.title}
          </h1>
          <p style={{ color: "#7d5c3a" }} className="text-xl max-w-2xl leading-relaxed">
            {service.description}
          </p>
        </div>
      </section>

      <div className="py-20">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid md:grid-cols-3 gap-16">
            <div className="md:col-span-2">
              <div
                style={{ color: "#5c3d1e" }}
                className="prose-custom space-y-6"
              >
                {service.content.trim().split("\n\n").map((para, i) => {
                  if (para.startsWith("## ")) {
                    return (
                      <h2
                        key={i}
                        style={{ color: "#1e1208" }}
                        className="text-2xl font-semibold mt-10 mb-4 first:mt-0"
                      >
                        {para.replace("## ", "")}
                      </h2>
                    );
                  }
                  if (para.startsWith("**") && para.includes("**—")) {
                    return (
                      <p key={i} style={{ color: "#7d5c3a" }} className="leading-relaxed">
                        {para}
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

            <div className="space-y-8">
              <div
                style={{ border: "1px solid #dfc5a5", borderRadius: "8px" }}
                className="p-6"
              >
                <h3
                  style={{ color: "#1e1208" }}
                  className="font-semibold mb-4"
                >
                  What's included
                </h3>
                <ul className="space-y-3">
                  {service.benefits.map((b) => (
                    <li key={b} className="flex items-start gap-3">
                      <span style={{ color: "#cfa97e" }}>—</span>
                      <span style={{ color: "#7d5c3a" }} className="text-sm">
                        {b}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div
                style={{
                  backgroundColor: "#f5ede0",
                  border: "1px solid #dfc5a5",
                  borderRadius: "8px",
                }}
                className="p-6"
              >
                <h3
                  style={{ color: "#1e1208" }}
                  className="font-semibold mb-3"
                >
                  Interested in this service?
                </h3>
                <p style={{ color: "#9b7653" }} className="text-sm mb-4">
                  Tell me about your project and I'll let you know how I can help.
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

      {otherServices.length > 0 && (
        <section
          style={{
            backgroundColor: "#f5ede0",
            borderTop: "1px solid #dfc5a5",
          }}
          className="py-16"
        >
          <div className="container mx-auto px-6 lg:px-12">
            <h2
              style={{ color: "#1e1208" }}
              className="text-xl font-semibold mb-8"
            >
              Other services
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {otherServices.map((s) => (
                <Link
                  key={s.slug}
                  href={`/services/${s.slug}`}
                  style={{ border: "1px solid #dfc5a5", backgroundColor: "#faf7f2" }}
                  className="group p-6 rounded-lg hover:border-[#9b7653] transition-colors block"
                >
                  <h3
                    style={{ color: "#1e1208" }}
                    className="font-semibold mb-2 group-hover:text-[#5c3d1e] transition-colors"
                  >
                    {s.title}
                  </h3>
                  <p style={{ color: "#9b7653" }} className="text-sm">
                    {s.shortDescription}
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
