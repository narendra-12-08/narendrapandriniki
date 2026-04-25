import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Narendra Pandrinki handles personal data on narendrapandrinki.com — what is collected, why, and your rights under UK GDPR.",
};

export default function PrivacyPage() {
  return (
    <div>
      <section className="section bg-grid">
        <div className="container-page">
          <p className="eyebrow">Privacy</p>
          <h1 className="text-4xl md:text-6xl font-semibold tracking-tight mt-6 max-w-3xl">
            <span className="gradient-text">Privacy</span> policy
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
              This privacy policy explains how I, Narendra Pandrinki, an
              independent freelance platform and DevOps engineer based in the
              United Kingdom, handle personal data collected through
              narendrapandrinki.com. I am the data controller for the personal
              data described below. The plain-English version: I don&rsquo;t want
              your data unless I need it to reply to you, I don&rsquo;t share it,
              and I don&rsquo;t keep it longer than I have to.
            </p>

            <h2>What I collect</h2>
            <p>
              When you use the contact form on this website, I collect the
              information you provide directly: your name, your email address,
              and the message you write. I do not require any other information
              to respond to a contact form submission. If you email me directly
              at hello@narendrapandrinki.com, the same applies — I receive
              whatever you choose to send.
            </p>
            <p>
              I use a small amount of privacy-respecting analytics to understand
              which pages people read and where visitors come from. These
              analytics record aggregated, non-identifying information such as
              page paths, referrers, country-level location, and approximate
              device type. They do not build a profile of you, do not follow
              you across other sites, and do not require a cookie banner under
              the PECR rules I rely on. If this changes, this page will be
              updated and a banner will appear before any non-essential cookie
              is set.
            </p>
            <p>
              The site sets only strictly necessary cookies for things like
              session security on administrative areas you will not normally
              encounter. No advertising or tracking cookies are used.
            </p>

            <h2>Why I collect it and the legal basis</h2>
            <p>
              The lawful basis for processing contact form submissions and
              direct emails is legitimate interest under Article 6(1)(f) of the
              UK GDPR. The legitimate interest is replying to you and, if we
              decide to work together, scoping and delivering an engagement.
              You can object to this processing at any time by emailing me, and
              I will delete the data unless I have an overriding lawful reason
              to retain it (for example, an active contract or a legal obligation).
            </p>
            <p>
              The lawful basis for analytics is also legitimate interest, on
              the basis that the analytics are aggregated and do not identify
              individual visitors.
            </p>

            <h2>How I use it</h2>
            <p>
              I use the data you submit only to respond to your inquiry, scope
              potential work, and — where we end up working together — perform
              the engagement and meet related legal and accounting obligations.
            </p>
            <p>
              I do not run a marketing email list. I will not add you to a
              mailing list, send you newsletters, or send any other unsolicited
              email beyond a direct reply to your message.
            </p>

            <h2>Who I share it with</h2>
            <p>
              I do not sell, rent, or share personal data with third parties
              for marketing purposes. The only third parties involved in
              processing your data are infrastructure providers used to run
              this website and my email — for example, the email service that
              delivers contact form submissions, the hosting provider for the
              site, and the analytics provider. Each of these processors is
              bound by their own contracts and data protection terms, and they
              process the data only on my behalf and on my instructions.
            </p>
            <p>
              Where required by law — for example, in response to a valid legal
              request from a UK authority — I may have to disclose information.
              I will resist requests that appear overbroad and will inform you
              where I am legally able to.
            </p>

            <h2>How long I keep it</h2>
            <p>
              Contact form submissions and unanswered email inquiries are
              retained for up to 12 months from the date of the last
              correspondence. After that, I delete them unless we have begun
              an engagement, in which case the relevant correspondence is
              retained for the duration of the engagement and for six years
              afterwards to satisfy UK accounting and tax obligations. Aggregated
              analytics data is retained for up to 24 months.
            </p>

            <h2>Where the data is stored</h2>
            <p>
              The data is processed in the United Kingdom and the European
              Economic Area where possible. Some processors may transfer data
              to the United States or other jurisdictions; where they do, the
              transfer is covered by appropriate safeguards such as the UK
              International Data Transfer Addendum or Standard Contractual
              Clauses.
            </p>

            <h2>Your rights under UK GDPR</h2>
            <p>
              You have the right to ask me what personal data I hold about you,
              to ask me to correct it if it&rsquo;s wrong, to ask me to delete it,
              to ask me to restrict its processing, to object to processing,
              and to receive a copy of the data in a portable format. You also
              have the right to complain to the Information Commissioner&rsquo;s
              Office (ico.org.uk) if you believe I have mishandled your data,
              though I would appreciate the chance to put things right first.
            </p>
            <p>
              To exercise any of these rights, email me at
              hello@narendrapandrinki.com. I will respond within one month, as
              required by law. There is no charge for a reasonable request.
            </p>

            <h2>Security</h2>
            <p>
              I take reasonable technical and organisational measures to
              protect personal data — encryption in transit, access controls
              on the systems that store correspondence, and the same operational
              discipline I bring to client engagements. No system is perfectly
              secure, but I treat your data the way I&rsquo;d want mine treated.
            </p>

            <h2>Changes to this policy</h2>
            <p>
              If this policy changes materially, the &ldquo;last updated&rdquo;
              date at the top will change and, where appropriate, I will note
              the change here. Minor wording fixes will not prompt a notice.
            </p>

            <h2>Contact</h2>
            <p>
              For any privacy question, request, or complaint, email
              hello@narendrapandrinki.com. I am the sole controller for this
              site and will respond personally.
            </p>
          </div>
        </div>
      </section>

      <section className="section pt-0">
        <div className="container-page">
          <div className="surface-card p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <p className="text-sm text-[var(--text-2)]">
              Looking for the engagement terms instead?
            </p>
            <Link href="/terms" className="btn-ghost">
              Read the terms
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
