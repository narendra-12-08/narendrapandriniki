import type { Metadata } from "next";
import JsonLd from "@/components/seo/JsonLd";
import { personSchema, breadcrumbSchema } from "@/lib/seo/schema";

export const metadata: Metadata = {
  title: "Playbook — How I work, what I believe",
  description:
    "Engineering playbook: the principles and practices I bring to every DevOps and platform engagement. Boring tools, runbooks that work, alerts that mean something.",
  alternates: { canonical: "/playbook" },
};

type Section = { eyebrow: string; title: string; body: string };

const sections: Section[] = [
  {
    eyebrow: "01 — Tooling",
    title: "Boring is a feature.",
    body: `The most reliable platforms I've worked on were assembled from boring components. Postgres instead of the new database with a clever consensus paper. Terraform instead of three half-finished IaC migrations. GitHub Actions instead of the bespoke runner cluster nobody wants to maintain. Boring tools come with documentation written ten years ago that still works, with Stack Overflow answers from people who hit your bug in 2017, and with operational characteristics the on-call engineer has internalised. Newness is a cost, not a feature, and that cost is paid by the team running the system at 03:00. I'll happily reach for new tools when the problem genuinely needs them — Cilium for cross-cluster identity, Karpenter for node-pool economics, OpenTelemetry to escape proprietary lock-in. But the default is the tool a competent senior engineer will recognise on their first day. Every piece of unfamiliar infrastructure is a tax on every future hire. Pay that tax deliberately, not by accident.`,
  },
  {
    eyebrow: "02 — Discipline",
    title: "Production discipline over prototypes.",
    body: `Anybody can stand up a Kubernetes cluster in an afternoon. The work that actually matters happens after the demo: the upgrade path, the backup that restores into a fresh account, the runbook somebody other than the author has run through, the alert that fires before customers notice. A prototype that runs is barely the start. A production system is one that survives a person leaving, a region failing, an exam-pressure incident on a Saturday morning. I treat anything that's left on overnight as production-bound from the first commit — secrets externalised, logs structured, infrastructure version-controlled, change documented. The shortcut you take during the prototype is the production debt the team inherits without ever having agreed to it. If the prototype works, somebody will ship it. Build accordingly.`,
  },
  {
    eyebrow: "03 — Platform",
    title: "Pave the path, don't pave the entire jungle.",
    body: `Platform engineering goes wrong when the platform team decides to standardise everything. Standardise the things that are boring to vary — service template, deployment pipeline, observability bootstrap, secrets injection — and leave the rest alone. The goal isn't a single way to do everything; it's a single golden path that's clearly the easiest path, with deliberate room for teams to step off it where their problem genuinely justifies the cost. Three Crossplane compositions for the resources teams ask for weekly is platform engineering. A 600-page architecture decision register that nobody reads is a vanity project. The test of a paved path is whether engineers reach for it without being told to, because it's faster and safer than the alternative. If they're routing around it, the path isn't paved — it's signposted.`,
  },
  {
    eyebrow: "04 — Disaster recovery",
    title: "Backups that don't restore don't exist.",
    body: `Every team I've joined has had backups. Most of them have never restored from one. A backup you haven't tested is a hypothesis, not a recovery plan, and the moment you need it is exactly the wrong moment to discover the WAL replay takes nine hours, the restore IAM role is missing, or the snapshot encryption key was rotated last month and nobody updated the disaster account. I run backup drills as a routine, not a project — quarterly at minimum, into a clean account with a stopwatch. I write the RTO and RPO down on paper, then prove the actual numbers. Customers don't care that you have backups. They care that the system comes back, in the time you promised them, with the data they entrusted to you. If you haven't restored it this quarter, treat your DR claim as marketing copy until you have.`,
  },
  {
    eyebrow: "05 — Alerts",
    title: "Alerts that don't page someone in 10 minutes shouldn't page them at all.",
    body: `On the second day of every engagement I delete alerts. Often most of them. The alert backlog teams accumulate is the residue of every false positive somebody ever wanted "just in case" — the CPU threshold from 2019, the memory alert that pages every Friday at deploy time, the disk warning on a node that doesn't exist anymore. Alert fatigue is not a culture problem; it's a design problem. Every page should map to a documented action the on-call engineer takes inside ten minutes. If the action is "investigate and probably ignore", the alert is a ticket, not a page. I prefer burn-rate alerts on SLOs tied to user journeys, because they fire when customers are about to notice — not when a graph crosses a number somebody picked at the previous job. The on-call rotation is a finite human resource. Spend it accordingly.`,
  },
  {
    eyebrow: "06 — Runbooks",
    title: "Document the why, not the what.",
    body: `The runbook that says "run kubectl rollout restart" is documentation theatre. The one that says "we restart this deployment when the queue depth exceeds N because the connection pool exhausts at M, and we're working on a real fix tracked in TICKET-123" is documentation that survives the author leaving. Runbooks aren't there to teach somebody Kubernetes; they're there to capture the context the author had in their head when they wrote the alert. What does this signal mean? What did we rule out before we settled on this remediation? What's the longer-term plan? Writing this down is slow and feels redundant when you understand the system. It's the cheapest insurance you ever buy. Three months later, when the person on call has never seen the system before, the runbook is the difference between a fifteen-minute fix and a war room.`,
  },
  {
    eyebrow: "07 — Automation",
    title: "If it's manual three times, automate it the fourth.",
    body: `Premature automation is its own swamp — the bash script nobody understands, the Python tool that runs in one engineer's home directory, the GitHub Action that exists for a workflow that stopped happening last quarter. The discipline I run with is simple: do it manually the first time, take notes the second, draft the automation the third, commit it the fourth. By the fourth pass you understand the failure modes, the edge cases, and the operational shape well enough to build something that won't immediately rot. Automation is a load-bearing piece of infrastructure; it deserves the same rigour as any other production code — version control, code review, tests, observability. The cost of a bad automation isn't the time it took to write; it's the team's belief that automation can be trusted. Lose that belief and you've made the system worse than the manual version it replaced.`,
  },
];

export default function PlaybookPage() {
  return (
    <div>
      <JsonLd
        data={[
          personSchema(),
          breadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "Playbook", url: "/playbook" },
          ]),
        ]}
      />

      <section className="section bg-grid">
        <div className="container-page">
          <p className="eyebrow">Playbook</p>
          <h1 className="text-4xl md:text-6xl font-semibold tracking-tight mt-6 max-w-3xl">
            How I work, <span className="gradient-text">what I believe.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-[var(--text-2)] leading-relaxed">
            Seven principles I bring to every engagement. They're opinionated on
            purpose. If you read one and disagree, that's a useful signal — for
            you and for me.
          </p>
        </div>
      </section>

      <section className="section pt-0">
        <div className="container-page">
          <div className="grid gap-6">
            {sections.map((s) => (
              <article key={s.title} className="surface-card p-8 md:p-10">
                <p className="eyebrow font-mono">{s.eyebrow}</p>
                <h2 className="mt-4 text-2xl md:text-3xl font-semibold tracking-tight text-[var(--text)] max-w-3xl">
                  {s.title}
                </h2>
                <p className="mt-5 text-base text-[var(--text-2)] leading-relaxed max-w-3xl">
                  {s.body}
                </p>
              </article>
            ))}
          </div>

          <div className="mt-16 surface-card p-10 md:p-14 glow-ring">
            <p className="eyebrow">Disagree?</p>
            <h2 className="mt-4 text-2xl md:text-3xl font-semibold tracking-tight max-w-2xl">
              Want to disagree?
            </h2>
            <p className="mt-3 text-base text-[var(--text-2)] leading-relaxed max-w-2xl">
              <a
                href="mailto:hello@narendrapandrinki.com"
                className="text-[var(--accent)] hover:underline"
              >
                hello@narendrapandrinki.com
              </a>{" "}
              — I love arguing about this stuff.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
