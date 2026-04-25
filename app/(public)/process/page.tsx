import type { Metadata } from "next";
import Link from "next/link";
import { process } from "@/lib/content/process";

export const metadata: Metadata = {
  title: "Process",
  description:
    "How an engagement runs end to end — discovery, architecture, implementation, validation, and handover.",
};

export default function ProcessPage() {
  return (
    <div>
      <section className="section bg-grid">
        <div className="container-page">
          <p className="eyebrow">Process</p>
          <h1 className="text-4xl md:text-6xl font-semibold tracking-tight mt-6 max-w-3xl">
            How an <span className="gradient-text">engagement</span> runs
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[var(--text-2)]">
            Five phases, broadly. Discovery, architecture, implementation,
            validation, handover. Below is the shape of each — what I deliver,
            how long it usually takes, and where the in-house team plugs in.
          </p>
        </div>
      </section>

      <section className="section pt-0">
        <div className="container-page">
          <div className="relative max-w-4xl mx-auto">
            <div
              className="absolute left-6 md:left-10 top-2 bottom-2 w-px"
              style={{ background: "linear-gradient(180deg, var(--accent), var(--violet), transparent)" }}
              aria-hidden="true"
            />
            <ol className="space-y-12 md:space-y-16">
              {process.map((step) => (
                <li key={step.number} className="relative pl-20 md:pl-28">
                  <div className="absolute left-0 top-0 flex items-center justify-center w-12 h-12 md:w-20 md:h-20 rounded-full bg-[var(--surface)] border border-[var(--border-2)]">
                    <span className="font-mono text-lg md:text-2xl font-semibold gradient-text">
                      {String(step.number).padStart(2, "0")}
                    </span>
                  </div>
                  <div className="surface-card p-6 md:p-8">
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-[var(--text)]">
                        {step.title}
                      </h2>
                      <span className="tag font-mono text-xs">{step.duration}</span>
                    </div>
                    <p className="text-[var(--text-2)] leading-relaxed">
                      {step.description}
                    </p>
                    <div className="mt-6 pt-6 border-t border-[var(--border)]">
                      <p className="eyebrow">Deliverables</p>
                      <ul className="mt-4 space-y-2">
                        {step.deliverables.map((d, i) => (
                          <li key={i} className="flex gap-3 text-sm text-[var(--text-2)] leading-relaxed">
                            <span className="text-[var(--accent)] flex-shrink-0">&#10003;</span>
                            <span>{d}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="section pt-0">
        <div className="container-page">
          <div className="surface-card p-10 md:p-14 text-center">
            <p className="eyebrow justify-center">Ready when you are</p>
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mt-4">
              The first step is a 30-minute call
            </h2>
            <p className="mt-4 max-w-xl mx-auto text-[var(--text-2)]">
              Free, no commitment, and usually enough to know whether a paid
              discovery week is worth scheduling.
            </p>
            <div className="mt-8 flex flex-wrap gap-3 justify-center">
              <Link href="/contact" className="btn-primary">Book a call</Link>
              <Link href="/pricing" className="btn-ghost">See pricing</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
