import type { Metadata } from "next";
import Link from "next/link";
import { getTechnologyStack } from "@/lib/db/content";
import { technology as staticTechnology } from "@/lib/content/technology";
import { getLogoUrl, getInitials } from "@/lib/content/tech-logos";

function TechIcon({ name }: { name: string }) {
  const url = getLogoUrl(name);
  const initials = getInitials(name);
  return (
    <span className="relative inline-flex items-center justify-center w-9 h-9 rounded-md bg-[var(--surface-2)] border border-[var(--border)] overflow-hidden shrink-0">
      <span className="absolute inset-0 flex items-center justify-center font-mono text-[10px] text-[var(--text-4)]">
        {initials}
      </span>
      {url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={url}
          alt={name}
          loading="lazy"
          width={22}
          height={22}
          className="relative opacity-90"
        />
      )}
    </span>
  );
}

export const metadata: Metadata = {
  title: "Technology",
  description:
    "The tools and platforms I work with day to day — cloud platforms, Kubernetes, infrastructure as code, observability, security, and more.",
};

const roleLabel: Record<string, string> = {
  core: "Core",
  fluent: "Fluent",
  familiar: "Familiar",
};

export default async function TechnologyPage() {
  // DB-first; fall back to the curated static list when the DB is empty
  // (e.g. before the seed has been run).
  const fromDb = await getTechnologyStack();
  const technology =
    fromDb.length > 0
      ? fromDb.map((c) => ({
          slug: c.slug,
          name: c.name,
          description: c.description ?? "",
          items: c.items.map((it) => ({
            name: it.name,
            role: it.role,
            note: it.note ?? undefined,
          })),
        }))
      : staticTechnology;

  return (
    <div>
      <section className="section bg-grid">
        <div className="container-page">
          <p className="eyebrow">Technology</p>
          <h1 className="text-4xl md:text-6xl font-semibold tracking-tight mt-6 max-w-3xl">
            The <span className="gradient-text">tools</span> behind the work
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[var(--text-2)]">
            A working list of what I use, grouped by category and tagged by how
            close I am to each. Core means I run it daily. Fluent means I&rsquo;ll
            pick it up without ceremony. Familiar means I read it well and have
            shipped with it, but it&rsquo;s not where I&rsquo;d default.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <span className="tag"><span className="inline-block w-2 h-2 rounded-full bg-[var(--accent)] mr-2 align-middle" />Core</span>
            <span className="tag"><span className="inline-block w-2 h-2 rounded-full border border-[var(--accent)] mr-2 align-middle" />Fluent</span>
            <span className="tag"><span className="inline-block w-2 h-2 rounded-full bg-[var(--text-3)] mr-2 align-middle opacity-50" />Familiar</span>
          </div>
        </div>
      </section>

      {technology.map((category) => (
        <section key={category.slug} className="section pt-0">
          <div className="container-page">
            <div className="hairline mb-16" />
            <div className="grid md:grid-cols-3 gap-12">
              <div>
                <p className="eyebrow">{category.slug.replace(/-/g, " ")}</p>
                <h2 className="text-2xl md:text-3xl font-semibold tracking-tight mt-4 text-[var(--text)]">
                  {category.name}
                </h2>
                <p className="mt-4 text-[var(--text-2)] leading-relaxed text-sm">
                  {category.description}
                </p>
              </div>
              <div className="md:col-span-2 grid sm:grid-cols-2 gap-4">
                {category.items.map((item) => {
                  if (item.role === "core") {
                    return (
                      <div
                        key={item.name}
                        className="glow-ring surface-card p-5"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <TechIcon name={item.name} />
                            <h3 className="font-semibold text-[var(--text)]">{item.name}</h3>
                          </div>
                          <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--accent)]">
                            {roleLabel[item.role]}
                          </span>
                        </div>
                        {item.note && (
                          <p className="mt-3 text-xs text-[var(--text-2)] leading-relaxed">
                            {item.note}
                          </p>
                        )}
                      </div>
                    );
                  }
                  if (item.role === "fluent") {
                    return (
                      <div key={item.name} className="surface-card p-5">
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <TechIcon name={item.name} />
                            <h3 className="font-medium text-[var(--text)]">{item.name}</h3>
                          </div>
                          <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--violet)]">
                            {roleLabel[item.role]}
                          </span>
                        </div>
                        {item.note && (
                          <p className="mt-3 text-xs text-[var(--text-2)] leading-relaxed">
                            {item.note}
                          </p>
                        )}
                      </div>
                    );
                  }
                  return (
                    <div
                      key={item.name}
                      className="flex items-center justify-between gap-3 px-2 py-3 border-b border-[var(--border)]"
                    >
                      <div className="flex items-center gap-3">
                        <TechIcon name={item.name} />
                        <div>
                          <span className="text-[var(--text-3)]">{item.name}</span>
                          {item.note && (
                            <p className="mt-1 text-xs text-[var(--text-3)] leading-relaxed">
                              {item.note}
                            </p>
                          )}
                        </div>
                      </div>
                      <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--text-3)]">
                        {roleLabel[item.role]}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      ))}

      <section className="section pt-0">
        <div className="container-page">
          <div className="surface-card p-10 md:p-14 text-center">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
              Don&rsquo;t see your stack?
            </h2>
            <p className="mt-4 max-w-xl mx-auto text-[var(--text-2)]">
              These are the tools I lean on most. The work itself rarely depends on a
              specific tool — if your stack looks different, it&rsquo;s usually fine.
            </p>
            <div className="mt-8 flex flex-wrap gap-3 justify-center">
              <Link href="/contact" className="btn-primary">Talk it through</Link>
              <Link href="/process" className="btn-ghost">How I work</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
