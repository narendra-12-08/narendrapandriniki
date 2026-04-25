import type { Metadata } from "next";
import ContactForm from "@/components/public/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Tell me about your project. Independent DevOps and platform engineer based in Hyderabad, India. Taking on a small number of engagements at a time across India, UK, US, Singapore, and Dubai.",
};

const faq = [
  {
    q: "What happens after I submit?",
    a: "I read every message myself. You get a reply within one or two business days, usually with a few clarifying questions and an honest read on whether I can help.",
  },
  {
    q: "How do you scope and price work?",
    a: "Discovery is a fixed-fee one-week sprint that ends with a written assessment. Delivery work is then either fixed-fee per phase or a weekly retainer. I never bill hourly.",
  },
  {
    q: "Do you sign NDAs and DPAs?",
    a: "Yes. Mutual NDA and a standard DPA are part of every engagement. Happy to use yours or mine.",
  },
  {
    q: "Where are you based?",
    a: "Hyderabad, India (IST). I work with teams across India, UK, EU, Singapore, Dubai, and US East timezones with comfortable overlap. US West and Australia work with explicit async expectations.",
  },
  {
    q: "What if it isn't a fit?",
    a: "I'll say so, and where I can I'll refer you to someone in my network who's better suited.",
  },
];

export default function ContactPage() {
  return (
    <div className="bg-grid">
      <section className="section pb-12">
        <div className="container-page">
          <span className="eyebrow">Contact</span>
          <h1 className="mt-6 text-5xl md:text-7xl font-semibold tracking-tight leading-[1.05] text-[var(--text)] max-w-4xl">
            Tell me about{" "}
            <span className="gradient-text">the problem.</span>
          </h1>
          <p className="mt-8 max-w-2xl text-lg text-[var(--text-2)] leading-relaxed">
            What you&apos;re trying to ship, fix, or untangle. Constraints,
            timeline, who else is in the room. The more concrete, the better
            the first reply.
          </p>
        </div>
      </section>

      <section className="pb-32">
        <div className="container-page">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left: FAQ + email */}
            <aside className="lg:col-span-5 space-y-8">
              <div className="surface-card p-7">
                <div className="flex items-center gap-3">
                  <span className="live-dot" />
                  <span className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--lime)]">
                    Available · Q2 2026
                  </span>
                </div>
                <p className="mt-4 text-[var(--text-2)] leading-relaxed">
                  Independent DevOps engineer based in Hyderabad, India.
                  Working with teams across India, UK, US, Singapore, and Dubai.
                  Small number of concurrent engagements, capped at one FTE.
                </p>
                <a
                  href="mailto:hello@narendrapandrinki.com"
                  className="mt-6 inline-flex items-center gap-2 text-[var(--accent)] hover:opacity-80"
                >
                  <span className="font-mono">→</span>
                  hello@narendrapandrinki.com
                </a>
              </div>

              <div>
                <span className="eyebrow">What happens next</span>
                <ul className="mt-5 space-y-4">
                  {faq.map((item, i) => (
                    <li key={i} className="surface-card p-6">
                      <div className="flex items-start gap-3">
                        <span className="font-mono text-xs text-[var(--accent)] mt-1">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <div>
                          <h3 className="text-[var(--text)] font-semibold">
                            {item.q}
                          </h3>
                          <p className="mt-2 text-sm text-[var(--text-3)] leading-relaxed">
                            {item.a}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>

            {/* Right: form */}
            <div className="lg:col-span-7">
              <div className="surface-card glow-ring p-7 md:p-10">
                <div className="mb-6">
                  <span className="eyebrow">Send a message</span>
                  <h2 className="mt-3 text-2xl md:text-3xl font-semibold text-[var(--text)] tracking-tight">
                    Start the conversation.
                  </h2>
                </div>
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
