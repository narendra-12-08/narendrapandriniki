import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms",
  description:
    "Terms of use for narendrapandrinki.com — site use, contact, engagements, intellectual property, and governing law.",
};

export default function TermsPage() {
  return (
    <div>
      <section className="section bg-grid">
        <div className="container-page">
          <p className="eyebrow">Terms</p>
          <h1 className="text-4xl md:text-6xl font-semibold tracking-tight mt-6 max-w-3xl">
            <span className="gradient-text">Terms</span> of use
          </h1>
          <p className="mt-6 text-sm text-[var(--text-3)] font-mono">
            Last updated: 2026-04-25
          </p>
        </div>
      </section>

      <section className="section pt-0">
        <div className="container-page">
          <div className="prose-dark max-w-3xl">
            <p>
              These terms cover your use of narendrapandrinki.com. They are
              short on purpose. By using the site you agree to them. If you
              don&rsquo;t agree, please don&rsquo;t use the site.
            </p>

            <h2>Use of the site</h2>
            <p>
              This website is informational. It describes the work I do as an
              independent platform and DevOps engineer. Nothing on it is a
              binding offer to perform work, and nothing on it is professional
              advice for your specific situation. Don&rsquo;t make decisions of
              consequence based on a webpage; talk to me, or to someone, first.
            </p>

            <h2>Contact form</h2>
            <p>
              You can use the contact form to get in touch. Submitting the form
              does not create a contract or any obligation on either side. I
              try to respond to every legitimate inquiry, but I reserve the
              right not to respond to spam, abuse, or messages clearly outside
              what I do.
            </p>

            <h2>Engagements</h2>
            <p>
              Any actual work I perform is governed by a separate written
              engagement agreement signed by both parties. That agreement —
              not this website — sets out the scope, fees, deliverables,
              warranties, liability, confidentiality, and other terms specific
              to the engagement. Where anything on this site differs from a
              signed agreement, the signed agreement controls.
            </p>

            <h2>Intellectual property</h2>
            <p>
              All content on this site — text, code samples, design, the
              site itself — is mine unless otherwise credited, and is protected
              by copyright. You&rsquo;re welcome to read it, share links to it,
              and quote short passages with attribution. You&rsquo;re not welcome
              to scrape it for training data or to republish substantial
              portions without written permission.
            </p>

            <h2>No warranty</h2>
            <p>
              The site is provided &ldquo;as is&rdquo;. I make no warranties about
              accuracy, completeness, or availability of the content. I&rsquo;ll do
              my best to keep it accurate and up to date, but pages may be
              outdated, opinions may have evolved, and links may break.
            </p>

            <h2>Limitation of liability</h2>
            <p>
              To the extent permitted by law, I am not liable for any indirect,
              incidental, or consequential loss arising from your use of this
              website. Nothing in these terms limits liability for fraud, death
              or personal injury caused by negligence, or any other liability
              that cannot lawfully be limited.
            </p>

            <h2>Privacy</h2>
            <p>
              How I handle personal data submitted through this site is set out
              in the <Link href="/privacy">privacy policy</Link>. Please read it.
            </p>

            <h2>Changes to these terms</h2>
            <p>
              I may update these terms from time to time. The &ldquo;last
              updated&rdquo; date at the top will reflect any change. Continuing
              to use the site after a change means you accept the updated
              terms.
            </p>

            <h2>Governing law</h2>
            <p>
              These terms are governed by the laws of India. Any
              dispute arising from your use of the site is subject to the
              exclusive jurisdiction of the competent courts of India.
            </p>

            <h2>Contact</h2>
            <p>
              Questions about these terms? Email
              hello@narendrapandrinki.com.
            </p>
          </div>
        </div>
      </section>

      <section className="section pt-0">
        <div className="container-page">
          <div className="surface-card p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <p className="text-sm text-[var(--text-2)]">
              For data handling specifics, see the privacy policy.
            </p>
            <Link href="/privacy" className="btn-ghost">
              Read the privacy policy
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
