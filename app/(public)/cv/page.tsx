import type { Metadata } from "next";
import JsonLd from "@/components/seo/JsonLd";
import { personSchema } from "@/lib/seo/schema";
import { skillsMatrix } from "@/lib/content/skills";
import { caseStudies } from "@/lib/content/work";
import { certifications } from "@/lib/content/certifications";

export const metadata: Metadata = {
  title: "CV — Narendra Pandrinki",
  description:
    "CV / resume for Narendra Pandrinki — independent DevOps and platform engineer. Five years experience across AWS, GCP, Azure, Kubernetes, and platform engineering.",
  alternates: { canonical: "/cv" },
};

const printStyles = `
@media print {
  nav, footer { display: none !important; }
  body { background: white !important; color: black !important; }
  a { color: #0066cc !important; }
  .surface-card { border: 1px solid #ddd !important; background: white !important; }
  .gradient-text { background: none !important; -webkit-text-fill-color: black !important; color: black !important; }
  .eyebrow, h1, h2, h3, p, li, span, div { color: black !important; }
  .bg-grid { background: white !important; }
  section { page-break-inside: avoid; }
}
`;

export default function CvPage() {
  return (
    <div>
      <JsonLd data={personSchema()} />
      <style dangerouslySetInnerHTML={{ __html: printStyles }} />

      <section className="section">
        <div className="container-page">
          <div className="flex items-center justify-between gap-6 flex-wrap">
            <p className="eyebrow">Curriculum Vitae</p>
            <p className="text-xs font-mono text-[var(--text-3)]">
              Print this page (Cmd/Ctrl+P) → Save as PDF for an offline copy. No
              fonts to download, nothing tracked.
            </p>
          </div>

          <div className="mt-8 surface-card p-8 md:p-10">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <div>
                <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">
                  Narendra Pandrinki
                </h1>
                <p className="mt-3 text-lg text-[var(--text-2)]">
                  DevOps & Platform Engineer
                </p>
                <p className="mt-1 text-sm text-[var(--text-3)]">
                  Hyderabad, India · Working with teams in India, UK, US, Singapore, Dubai
                </p>
              </div>
              <div className="text-sm font-mono text-[var(--text-2)] space-y-1">
                <div>
                  <a
                    href="mailto:hello@narendrapandrinki.com"
                    className="hover:text-[var(--accent)]"
                  >
                    hello@narendrapandrinki.com
                  </a>
                </div>
                <div>
                  <a
                    href="https://narendrapandrinki.com"
                    className="hover:text-[var(--accent)]"
                  >
                    narendrapandrinki.com
                  </a>
                </div>
                <div className="text-[var(--text-3)]">
                  Available — booking Q3 2026
                </div>
              </div>
            </div>

            <div className="mt-10 pt-8 border-t border-[var(--border)]">
              <p className="eyebrow">Summary</p>
              <p className="mt-4 text-sm md:text-base text-[var(--text-2)] leading-relaxed max-w-3xl">
                Independent DevOps and platform engineer with five years building
                and operating production cloud infrastructure across AWS, GCP, and
                Azure. Embed with engineering teams to design Kubernetes platforms,
                build CI/CD that ships quietly, drive FinOps without slowing
                delivery, and stand up SRE practice that survives an on-call
                rotation. Comfortable as the senior voice in the room and as the
                engineer writing the Terraform — usually both in the same week.
              </p>
            </div>

            <div className="mt-10 pt-8 border-t border-[var(--border)]">
              <p className="eyebrow">Skills</p>
              <div className="mt-4 grid md:grid-cols-2 gap-x-10 gap-y-5">
                {skillsMatrix.map((g) => (
                  <div key={g.name}>
                    <div className="text-xs font-mono uppercase tracking-[0.14em] text-[var(--text-4)]">
                      {g.name}
                    </div>
                    <p className="mt-2 text-sm text-[var(--text-2)] leading-relaxed">
                      {g.skills.map((s) => s.name).join(" · ")}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-10 pt-8 border-t border-[var(--border)]">
              <p className="eyebrow">Selected work</p>
              <div className="mt-4 space-y-6">
                {caseStudies.map((c) => {
                  const headline = c.metrics[0];
                  return (
                    <div key={c.slug}>
                      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                        <h3 className="text-base font-semibold text-[var(--text)]">
                          {c.title}
                        </h3>
                        <div className="text-xs font-mono text-[var(--text-3)]">
                          {c.industry} · {c.duration}
                        </div>
                      </div>
                      <p className="mt-2 text-sm text-[var(--text-2)] leading-relaxed">
                        {c.outcome}
                      </p>
                      {headline && (
                        <p className="mt-2 text-xs font-mono text-[var(--text-3)]">
                          {headline.label}: {headline.value}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-10 pt-8 border-t border-[var(--border)]">
              <p className="eyebrow">Certifications</p>
              <ul className="mt-4 grid md:grid-cols-2 gap-x-10 gap-y-2 text-sm text-[var(--text-2)]">
                {certifications.map((c) => (
                  <li key={c.id} className="flex items-baseline justify-between gap-3">
                    <span>{c.name}</span>
                    <span className="font-mono text-xs text-[var(--text-3)]">
                      {c.year}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-10 pt-8 border-t border-[var(--border)]">
              <p className="eyebrow">Education</p>
              <ul className="mt-4 space-y-3 text-sm text-[var(--text-2)]">
                <li className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                  <span>
                    <strong className="text-[var(--text)]">MSc Data Science</strong>{" "}
                    — University of Hertfordshire
                  </span>
                  <span className="font-mono text-xs text-[var(--text-3)]">
                    2020 – 2022
                  </span>
                </li>
                <li className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                  <span>
                    <strong className="text-[var(--text)]">
                      BTech, Computer Science
                    </strong>{" "}
                    — ICFAI Foundation for Higher Education, Hyderabad
                  </span>
                  <span className="font-mono text-xs text-[var(--text-3)]">
                    2015 – 2019
                  </span>
                </li>
              </ul>
            </div>

            <div className="mt-10 pt-8 border-t border-[var(--border)]">
              <p className="eyebrow">Languages</p>
              <p className="mt-4 text-sm text-[var(--text-2)]">
                English (fluent) · Hindi (native) · Telugu (native)
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
