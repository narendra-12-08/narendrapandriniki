import type { Metadata } from "next";
import ContactForm from "@/components/public/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch to discuss your engineering requirements. Cloud infrastructure, backend systems, internal tools, and workflow automation.",
};

export default function ContactPage() {
  return (
    <div style={{ backgroundColor: "#faf7f2" }}>
      <section style={{ borderBottom: "1px solid #dfc5a5" }} className="py-24">
        <div className="container mx-auto px-6 lg:px-12">
          <p style={{ color: "#9b7653" }} className="text-sm font-semibold uppercase tracking-widest mb-6">
            Contact
          </p>
          <h1 style={{ color: "#1e1208" }} className="text-4xl md:text-5xl font-semibold max-w-2xl leading-tight mb-6">
            Let's talk about what you need
          </h1>
          <p style={{ color: "#7d5c3a" }} className="text-xl max-w-2xl leading-relaxed">
            Tell me about your engineering requirements. I'll respond within 1–2
            business days with an honest view on whether I can help.
          </p>
        </div>
      </section>

      <div className="py-20">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid md:grid-cols-3 gap-16">
            <div className="md:col-span-2">
              <ContactForm />
            </div>

            <div className="space-y-8">
              <div>
                <h3 style={{ color: "#1e1208" }} className="font-semibold mb-4">
                  What to expect
                </h3>
                <ul className="space-y-4">
                  {[
                    {
                      step: "01",
                      text: "I'll read your message carefully and consider whether your project is a good fit for my services.",
                    },
                    {
                      step: "02",
                      text: "I'll respond within 1–2 business days with either an honest yes, a suggested approach, or a referral if I'm not the right fit.",
                    },
                    {
                      step: "03",
                      text: "If there's a clear fit, we'll schedule a call to understand requirements properly before discussing scope and pricing.",
                    },
                  ].map(({ step, text }) => (
                    <li key={step} className="flex gap-4">
                      <span style={{ color: "#cfa97e" }} className="text-sm font-mono flex-shrink-0 mt-0.5">
                        {step}
                      </span>
                      <p style={{ color: "#7d5c3a" }} className="text-sm leading-relaxed">
                        {text}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>

              <div style={{ borderTop: "1px solid #dfc5a5" }} className="pt-8">
                <h3 style={{ color: "#1e1208" }} className="font-semibold mb-4">
                  Good fits
                </h3>
                <ul className="space-y-2">
                  {[
                    "Cloud infrastructure build or migration",
                    "Backend systems and API development",
                    "Internal tools and admin dashboards",
                    "Workflow automation and integrations",
                    "Platform engineering and DevOps",
                    "Reporting and operations systems",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <span style={{ color: "#cfa97e" }}>—</span>
                      <span style={{ color: "#7d5c3a" }} className="text-sm">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div style={{ borderTop: "1px solid #dfc5a5" }} className="pt-8">
                <p style={{ color: "#9b7653" }} className="text-sm font-semibold uppercase tracking-widest mb-2">
                  Direct email
                </p>
                <a
                  href="mailto:hello@narendrapandrinki.com"
                  style={{ color: "#5c3d1e" }}
                  className="text-sm font-medium hover:opacity-80"
                >
                  hello@narendrapandrinki.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
