import type { Metadata } from "next";
import type { ReactElement } from "react";
import JsonLd from "@/components/seo/JsonLd";
import { personSchema, breadcrumbSchema } from "@/lib/seo/schema";
import { getSkillGroups, type SkillItemRow } from "@/lib/db/content-extra";

export const metadata: Metadata = {
  title: "Skills — Narendra Pandrinki",
  description:
    "An honestly rated skills matrix across cloud, Kubernetes, infrastructure as code, observability, security, networking, and data.",
  alternates: { canonical: "/skills" },
};

function SkillRow({ skill }: { skill: SkillItemRow }): ReactElement {
  const dots = [1, 2, 3, 4, 5].map((d) => (
    <span
      key={d}
      aria-hidden
      className={`h-2.5 w-2.5 rounded-full border ${
        d <= skill.level
          ? "bg-[var(--accent)] border-[var(--accent)]"
          : "bg-transparent border-[var(--border-2)]"
      }`}
    />
  ));

  return (
    <div className="flex items-center justify-between gap-6 py-3">
      <div className="min-w-0 flex-1">
        <div className="text-sm text-[var(--text)]">{skill.name}</div>
        {skill.note && (
          <div className="mt-1 text-xs text-[var(--text-3)]">{skill.note}</div>
        )}
      </div>
      <div className="flex items-center gap-4 flex-shrink-0">
        <span className="tag font-mono text-xs">{skill.years}y</span>
        <div
          className="flex items-center gap-1.5"
          aria-label={`Level ${skill.level} of 5`}
        >
          {dots}
        </div>
      </div>
    </div>
  );
}

export default async function SkillsPage() {
  const skillsMatrix = await getSkillGroups();
  const knowsAbout = skillsMatrix.flatMap((g) => g.items.map((i) => i.name));
  const person = personSchema();
  person.knowsAbout = knowsAbout;

  return (
    <div>
      <JsonLd
        data={[
          person,
          breadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "Skills", url: "/skills" },
          ]),
        ]}
      />

      <section className="section bg-grid">
        <div className="container-page">
          <p className="eyebrow">Skills</p>
          <h1 className="text-4xl md:text-6xl font-semibold tracking-tight mt-6 max-w-3xl">
            Skills, <span className="gradient-text">honestly rated.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-[var(--text-2)] leading-relaxed">
            Self-assessment, with the bias declared up front. Five dots means I'd
            architect from scratch and operate it on call. One dot means I've used
            it enough to know I shouldn't pretend otherwise.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 text-xs font-mono text-[var(--text-3)]">
            <span className="tag">5 — design, operate, teach</span>
            <span className="tag">4 — production, comfortable</span>
            <span className="tag">3 — production, with care</span>
            <span className="tag">2 — non-trivial use</span>
            <span className="tag">1 — passing familiarity</span>
          </div>
        </div>
      </section>

      <section className="section pt-0">
        <div className="container-page">
          <div className="grid lg:grid-cols-2 gap-6">
            {skillsMatrix.map((g) => (
              <div key={g.id} className="surface-card p-7">
                <p className="eyebrow">{g.name}</p>
                <h2 className="mt-3 text-xl font-semibold tracking-tight text-[var(--text)]">
                  {g.description}
                </h2>
                <div className="mt-5 divide-y divide-[var(--border)]">
                  {g.items.map((s) => (
                    <SkillRow key={s.id} skill={s} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
