import type { Metadata } from "next";
import JsonLd from "@/components/seo/JsonLd";
import { personSchema, breadcrumbSchema } from "@/lib/seo/schema";
import { getCertifications } from "@/lib/db/content-extra";
import { issuerInitials } from "@/lib/content/certifications";

export const metadata: Metadata = {
  title: "Certifications — Narendra Pandrinki",
  description:
    "Active cloud and platform certifications: AWS, GCP, Azure, Kubernetes (CKA / CKS), HashiCorp Terraform and Vault.",
  alternates: { canonical: "/certifications" },
};

export default async function CertificationsPage() {
  const certifications = await getCertifications();
  return (
    <div>
      <JsonLd
        data={[
          personSchema(),
          breadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "Certifications", url: "/certifications" },
          ]),
        ]}
      />

      <section className="section bg-grid">
        <div className="container-page">
          <p className="eyebrow">Certifications</p>
          <h1 className="text-4xl md:text-6xl font-semibold tracking-tight mt-6 max-w-3xl">
            <span className="gradient-text">Cloud and platform certifications</span>{" "}
            I currently hold.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-[var(--text-2)] leading-relaxed">
            Certifications don't write Terraform. They do answer one specific
            question — that I've sat the exam, paid the renewal fee, and stayed
            current with the body of knowledge a vendor expects of a senior
            engineer on their stack.
          </p>
        </div>
      </section>

      <section className="section pt-0">
        <div className="container-page">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {certifications.map((c) => (
              <a
                key={c.id}
                href={c.url ?? "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="surface-card p-6 flex flex-col hover:border-[var(--accent)] transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-lg border border-[var(--accent)]/40 bg-[var(--accent)]/10 font-mono text-sm text-[var(--accent)]"
                    aria-hidden
                  >
                    {issuerInitials(c.issuer)}
                  </div>
                  <span
                    className={`tag font-mono text-xs ${
                      c.status === "active"
                        ? "text-[var(--lime)] border-[var(--lime)]"
                        : "text-[var(--text-3)]"
                    }`}
                  >
                    {c.status === "active" ? "Active" : "Expired"}
                  </span>
                </div>
                <h2 className="mt-6 text-base font-semibold text-[var(--text)] leading-snug">
                  {c.name}
                </h2>
                <p className="mt-2 text-xs font-mono text-[var(--text-3)]">
                  {c.issuer} · {c.year}
                </p>
                <div className="mt-auto pt-6 text-xs font-mono text-[var(--accent)]">
                  Issuer page &rarr;
                </div>
              </a>
            ))}
          </div>

          <p className="mt-12 text-sm text-[var(--text-3)] max-w-2xl">
            Verify any credential by emailing{" "}
            <a
              href="mailto:hello@narendrapandrinki.com"
              className="text-[var(--accent)] hover:underline"
            >
              hello@narendrapandrinki.com
            </a>{" "}
            with the credential reference. I'll respond with the issuer's
            verification record.
          </p>
        </div>
      </section>
    </div>
  );
}
