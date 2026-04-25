export type Solution = {
  slug: string;
  title: string;
  tagline: string;
  shortDescription: string;
  outcomes: string[];
  content: string;
};

export const solutions: Solution[] = [
  {
    slug: "cloud-migration",
    title: "Cloud Migration",
    tagline: "On-prem → cloud, or cloud → cloud",
    shortDescription:
      "Migrate without a 'big bang' weekend. Wave-based, reversible, customer-impact-near-zero.",
    outcomes: [
      "Cutover playbooks rehearsed in lower environments",
      "Cost target hit within 90 days post-migration",
      "Old environment safely decommissioned, not forgotten",
    ],
    content: `
Cloud migration as theatre is a budget killer. A migration that succeeds is a series of small, reversible cutovers — each one leaving the business measurably better off and the old environment one step closer to retirement.

## How I run them

Discovery and dependency mapping first; wave plan agreed across engineering, finance, and product; stateless workloads first, then async/batch, then stateful with the most care; bidirectional sync during cutover so rollback is real, not theoretical; post-migration cleanup tracked to actual decommissioning.

## Outcomes you should expect

Zero or near-zero downtime per workload, cost baseline hit by month three, a documented operational model your team owns afterwards, and an old environment that is genuinely turned off — not still running because nobody's sure if it's needed.
    `,
  },
  {
    slug: "cloud-cost-optimisation",
    title: "Cloud Cost Optimisation",
    tagline: "FinOps without the consultancy theatre",
    shortDescription:
      "Find the 25–40% you didn't know you were spending. Lock it in. Build the discipline so it doesn't come back.",
    outcomes: [
      "Quick-win savings within 30 days, no architecture risk",
      "Tagging, budgets, and alerts that survive after I leave",
      "Savings plans / CUDs structured against stable baseline",
    ],
    content: `
Most cloud bills have 25–40% slack. It's not in one place — it's in idle dev environments, oversized RDS instances, NAT gateway egress, log retention nobody picked, GP2 volumes that should be GP3, and snapshots from 2022.

## The first 30 days

Audit, prioritise quick wins (no architecture risk), execute, set up tagging and budget alerts, structure your committed-use discount strategy. Most teams see 15–25% off the bill in the first month.

## Months 2–3

The structural work: rightsizing pipeline, autoscaling tuning, multi-tenant resource sharing, region/AZ rationalisation, log/metric retention discipline. This is where the next 10–15% comes from — and where it stays gone.

## Discipline that lasts

Cost dashboards your engineers actually look at, weekly cost-of-change report, blameless reviews when bills spike. Cost becomes a property of how you build, not a quarterly fire drill.
    `,
  },
  {
    slug: "zero-downtime-deploys",
    title: "Zero-Downtime Deployments",
    tagline: "Ship in the middle of the day",
    shortDescription:
      "Progressive delivery with automated rollback. Friday afternoons stop being scary.",
    outcomes: [
      "Deploys at noon Tuesday instead of 11pm Friday",
      "Automated rollback on SLO regression",
      "Deploy frequency up, change failure rate down",
    ],
    content: `
Deploys are scary because they're high-stakes one-shot events. Replace them with progressive, observable, automatically-rolled-back changes and they become non-events.

## What changes

Argo Rollouts or Flagger for canary / blue-green strategies, traffic shifted by percentage with health checks at each step, automated rollback when SLOs degrade, feature flags decoupling deploy from release. Suddenly the engineer who shipped the bug isn't in a Slack war room — the platform rolled it back at 1% traffic.

## Outcomes

Multi-deploy-a-day cadence even on critical services, SLO-driven rollback within 60 seconds of regression, and a deploy culture where small frequent changes replace heroic releases.
    `,
  },
  {
    slug: "compliance-foundations",
    title: "Compliance Foundations",
    tagline: "SOC 2 · ISO 27001 · HIPAA · PCI",
    shortDescription:
      "Engineering work that turns 'we need to be SOC 2' into 'we are, here's the evidence pipeline'.",
    outcomes: [
      "Controls mapped to actual technical evidence",
      "Continuous evidence collection, not pre-audit panic",
      "Audit-ready in 60–90 days for greenfield posture",
    ],
    content: `
Compliance frameworks aren't security. They're documentation of security. Treat them as engineering problems and they become a foundation; treat them as paperwork and they become a quarterly fire.

## What I deliver

Control catalog mapped to your actual technical reality (Drata / Vanta / Tugboat aware), evidence collection pipelines wired into CI/CD and infrastructure, identity baseline (SSO, MFA, least privilege), data classification and encryption posture, vendor risk process that doesn't die in a spreadsheet.

## Reality check

I'm an engineer, not an auditor. I make your environment audit-able. The auditor still has to certify. But the difference between 'auditor takes 4 weeks pulling evidence' and 'auditor takes 3 days reviewing evidence' is what this engagement creates.
    `,
  },
  {
    slug: "disaster-recovery",
    title: "Disaster Recovery & Business Continuity",
    tagline: "Test it, or you don't have it",
    shortDescription:
      "RTO and RPO targets that match your business. Drilled. Documented. Honest.",
    outcomes: [
      "Tested DR procedure with measured RTO/RPO",
      "Quarterly drill cadence with tracked findings",
      "Backup integrity verified — not just configured",
    ],
    content: `
'We have backups' is a position. 'We tested restore last quarter and the RTO was 47 minutes' is a plan.

## What I deliver

Business impact analysis to set realistic RTO/RPO per workload, backup architecture aligned to those targets (multi-region, off-account, encrypted), tested restore procedure documented and rehearsed, runbook for full-region failure, communication plan for outage scenarios.

## What gets caught

Most engagements find at least one of: a backup that doesn't restore, a 'documented' RTO that's actually 4× longer in practice, a critical workload nobody had backed up, or a restore procedure that requires credentials only the person who's on holiday has.
    `,
  },
  {
    slug: "internal-developer-platform",
    title: "Internal Developer Platform",
    tagline: "Make the right thing the easy thing",
    shortDescription:
      "Self-service platform that lets engineers ship without filing tickets — with safety rails that mean nobody nukes prod by accident.",
    outcomes: [
      "Lead time for change measured in hours, not days",
      "New service from idea to deployed in <2 hours",
      "Platform team scales 10× the engineers it serves",
    ],
    content: `
Platform engineering is a force multiplier. A 4-person platform team should be making 60 engineers each measurably faster. The way you get there is by removing the work people repeat — not by adding more dashboards.

## What I build

Service templates with paved CI/CD and observability, internal dev portal (Backstage or equivalent) with a real service catalog, self-service infrastructure provisioning with policy guardrails, runtime platform abstraction so deploy targets stay stable as infra evolves underneath, DX scorecards published per team.

## Phasing

Quarter 1: golden path service template and self-service prod-grade staging environments. Quarter 2: portal with catalog and ownership graph. Quarter 3: runtime abstraction and DX metrics. Each phase is independently valuable; teams adopt as the platform earns trust.
    `,
  },
  {
    slug: "kubernetes-platform",
    title: "Kubernetes Platform",
    tagline: "From 'we use k8s' to 'we run k8s well'",
    shortDescription:
      "Cluster strategy, GitOps, autoscaling, security baseline, upgrade muscle. The full operational maturity stack.",
    outcomes: [
      "Quarterly cluster upgrades become routine",
      "Pod-level + node-level autoscaling tuned to traffic",
      "GitOps audit trail covers 100% of deploys",
    ],
    content: `
Kubernetes adoption is fastest when treated as a platform, not a project. The teams that struggle are the ones that 'launched on k8s' and never went back to make it operationally serious.

## What I bring

Cluster topology decided deliberately (per-team, per-environment, multi-region — with documented blast radius), GitOps with ArgoCD or Flux as the only deployment surface, autoscaling at pod (HPA/VPA) and node (Karpenter / cluster autoscaler) levels, security baseline (Pod Security Standards, network policy, image signing, supply chain), and an upgrade playbook so 1.27 → 1.30 is a Tuesday afternoon, not a quarterly project.

## Outcome

A platform engineers can ship on safely, an operations team that isn't drowning in cluster minutiae, and a roadmap for quarterly upgrade cadence.
    `,
  },
  {
    slug: "observability-overhaul",
    title: "Observability Overhaul",
    tagline: "From dashboards to answers",
    shortDescription:
      "Replace 200 alerts and 50 dashboards with SLOs, traces, and runbooks people actually use.",
    outcomes: [
      "70–90% alert noise reduction",
      "MTTR cut by half on typical engagements",
      "Distributed tracing covers your top user journeys",
    ],
    content: `
Most observability stacks are graveyards. Dashboards built once and never reopened, alerts firing into channels nobody reads, $40k/month log bills nobody questions.

## What I rebuild

User-journey SLOs replacing metric-vanity targets, error-budget-burn alerting that pages 1–2 actionable times per shift, distributed tracing with sampling that captures the slow tail, log strategy with retention by tier, runbooks linked from every alert.

## What stays

Whatever vendor you're already paying — Datadog, Grafana Cloud, New Relic, Honeycomb, native Prometheus. I optimise the stack you have unless there's a strong case to switch.
    `,
  },
  {
    slug: "incident-response-uplift",
    title: "Incident Response Uplift",
    tagline: "When it breaks, be ready",
    shortDescription:
      "Severity matrix, paging policy, comms templates, postmortem culture — battle-tested and human-friendly.",
    outcomes: [
      "Defined severities and clear escalation",
      "Blameless postmortems with action items closed to deadline",
      "On-call rotation that doesn't burn people out",
    ],
    content: `
Most incident response post-mortems read the same: confusion about who owned what, a war room of 14 people none of whom were the right one, action items written and forgotten. Fix the structural issues and the next incident is half the duration with a quarter of the stress.

## What I install

Severity matrix tied to user impact (not 'how stressed is the engineer'), paging policy with primary/secondary/escalation, comms templates per audience (internal, customer-facing, leadership), postmortem template with action items tracked in your project tool with deadlines, on-call schedule that's humane (rotation length, comp, handoff).

## Outcome

Incidents become smaller, faster, and learning-rich rather than retraumatising.
    `,
  },
];

export function getSolution(slug: string) {
  return solutions.find((s) => s.slug === slug);
}
