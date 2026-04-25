export type Service = {
  slug: string;
  title: string;
  tagline: string;
  shortDescription: string;
  description: string;
  icon: string;
  benefits: string[];
  deliverables: string[];
  stack: string[];
  content: string;
};

export const services: Service[] = [
  {
    slug: "cloud-devops",
    title: "Cloud & DevOps Engineering",
    tagline: "AWS · GCP · Azure",
    shortDescription:
      "Production cloud environments designed deliberately — resilient, cost-aware, and ready for the day you actually need them.",
    description:
      "End-to-end cloud architecture and DevOps. Networks, IAM, workloads, observability, runbooks. Built so your engineers can move fast without paging anyone at 3am.",
    icon: "cloud",
    benefits: [
      "Multi-account, multi-region foundations done once and done right",
      "Right-sized workloads with FinOps visibility from day one",
      "Hardened IAM, secrets, network segmentation, encryption defaults",
      "On-call runbooks your team can actually follow",
    ],
    deliverables: [
      "Cloud landing zone and environment hierarchy",
      "Terraform-managed accounts, networks, IAM, workloads",
      "Monitoring, log aggregation, alerting baseline",
      "Cost dashboards and budget guardrails",
    ],
    stack: ["AWS", "GCP", "Azure", "Terraform", "Pulumi", "CloudFormation"],
    content: `
Most cloud accounts are accidents. They grew with the company — a region here, a side-project there, a forgotten experiment running in us-east-1. Six months later nobody remembers why anything is named the way it is, and the bill keeps creeping.

I rebuild that. Not by tearing it all down — by introducing structure, automation, and ownership in the right places, and migrating workloads piece by piece.

## What you get

**Landing zone foundation** — Multi-account org, SSO with breakglass, audit logging into a separate account, network baseline. The non-negotiables, set up cleanly.

**Workload-level architecture** — VPCs, subnets, load balancers, container/serverless platforms (ECS/EKS, Cloud Run, Lambda) sized to actual traffic. Stateless tier autoscaling. Stateful tier reviewed for blast radius.

**FinOps from day one** — Tagging policy, per-team budgets with alerts, savings plans/CUDs structured by stable baseline, weekly cost report into your inbox. Most teams find 25–40% they didn't know they were spending.

**Operational glue** — CloudWatch/Datadog/Grafana, log pipelines, paging policies tuned to severity, postmortem templates. The boring foundations that decide whether incidents are 20 minutes or 2 hours.

## Typical engagement

Two to twelve weeks. Discovery week → foundation rebuild → workload migration in waves → handover with documentation and a 30-day support window.
    `,
  },
  {
    slug: "platform-engineering",
    title: "Platform Engineering",
    tagline: "Internal developer platforms",
    shortDescription:
      "Self-service platforms that turn 'open a ticket and wait three days' into 'open a PR and ship in fifteen minutes'.",
    description:
      "Internal developer platforms, golden paths, service templates, and the tooling that lets your engineers stop fighting infrastructure and start shipping.",
    icon: "layers",
    benefits: [
      "Self-service environment, service, and resource provisioning",
      "Golden paths that bake in security, observability, and compliance",
      "Backstage / portal implementations tuned to your org",
      "DX metrics: lead time, deploy frequency, change failure rate",
    ],
    deliverables: [
      "Internal developer portal with service catalog",
      "Service template (CI/CD, observability, security wired in)",
      "Self-service provisioning workflows",
      "DX scorecard and improvement roadmap",
    ],
    stack: ["Backstage", "ArgoCD", "Crossplane", "Helm", "Kustomize", "GitHub Actions"],
    content: `
The promise of platform engineering is simple: stop making every team reinvent CI/CD, observability, secrets, and deployment. Build it once. Pave a path. Make the right thing the easy thing.

The reality is messier. Most "platforms" are a wiki page nobody reads, a Helm chart that's three versions out of date, and a Slack channel where the same five questions get asked every sprint.

## What I build

**Service templates with paved paths** — Spin up a new Go/Node/Python service with one command. CI/CD wired in, secrets scaffolded, observability auto-instrumented, SLO defaults set, runbook stubbed. Teams get from zero to a deployed staging environment in under an hour.

**Backstage (or equivalent) portals** — Service catalog, ownership graph, tech docs, scorecards. The "where does this run, who owns it, what's its health?" question solved in one place.

**Self-service infrastructure** — Crossplane / Terraform Cloud / internal CLI for "I need a new database" without a ticket. Guardrails around regions, sizes, and costs so nobody can accidentally provision a $4k/month cluster on a Friday.

**DX metrics** — DORA, but actually instrumented. Lead time for change, deploy frequency, MTTR, change failure rate. Reviewed monthly, with concrete actions on regressions.

## Who this fits

Best for teams of 8–80 engineers, where the platform problem has become real but a dedicated platform team doesn't exist yet — or exists but is firefighting and needs a lift.
    `,
  },
  {
    slug: "kubernetes",
    title: "Kubernetes & Container Orchestration",
    tagline: "EKS · GKE · AKS · self-hosted",
    shortDescription:
      "Production-grade Kubernetes — clusters that scale, upgrade cleanly, and don't wake people up.",
    description:
      "Cluster architecture, multi-tenancy, autoscaling, GitOps, security policy, upgrade strategy, and the operational maturity to run it without drama.",
    icon: "container",
    benefits: [
      "Production clusters with sane defaults and clear ownership",
      "GitOps-driven deploys with full audit trail",
      "Right-sized autoscaling at pod and node level",
      "Pod security, network policy, supply chain hardening",
    ],
    deliverables: [
      "Cluster architecture document and Terraform modules",
      "ArgoCD/Flux app-of-apps GitOps setup",
      "Workload migration runbook",
      "Upgrade playbook and tested DR procedure",
    ],
    stack: ["EKS", "GKE", "AKS", "ArgoCD", "Flux", "Helm", "Cilium", "Karpenter"],
    content: `
Kubernetes works. What doesn't work is treating it as a destination instead of a substrate. Most "Kubernetes problems" turn out to be "we never decided what good looks like" problems.

I take you from 'we have a cluster running' to 'we have a platform engineers can ship on safely'.

## What I cover

**Cluster topology** — How many clusters, why, how they're segregated by team / environment / blast radius. Documented decisions.

**GitOps deploy pipeline** — ArgoCD or Flux, app-of-apps, environment promotion via PR. No more kubectl apply from laptops, no more 'who changed prod last Tuesday'.

**Autoscaling that actually scales** — HPA + VPA configured per workload, Karpenter or Cluster Autoscaler tuned, stop-the-bleed budgets, bin-packing optimisations. Capacity that follows traffic without drama.

**Security baseline** — Pod Security Standards, network policy with Cilium or Calico, image signing with Cosign, runtime monitoring, secrets via External Secrets Operator. Supply chain hardened.

**Upgrade muscle** — Tested upgrade procedure, deprecated-API scanner, blue/green node group strategy. Going from 1.27 to 1.30 is a Tuesday afternoon, not a quarterly project.

## Where I help most

Teams running 1–20 clusters, somewhere on the spectrum from "we deployed it last year and haven't touched it since" to "we want to consolidate seven snowflakes into a managed platform".
    `,
  },
  {
    slug: "cicd-pipelines",
    title: "CI/CD Pipeline Engineering",
    tagline: "GitHub Actions · GitLab · Buildkite",
    shortDescription:
      "Pipelines that are fast, deterministic, and trustworthy. Merging to main should be a non-event.",
    description:
      "Build, test, scan, sign, and deploy. Cached, parallel, reproducible. Configured once and maintained as code.",
    icon: "git-branch",
    benefits: [
      "Sub-10-minute mainline pipelines on real-world repos",
      "Reproducible builds with hermetic dependencies",
      "Progressive delivery with automated rollback",
      "Clear visibility into flake rates and pipeline health",
    ],
    deliverables: [
      "Pipeline architecture and reusable workflows",
      "Build cache and dependency hosting",
      "Progressive delivery (canary / blue-green) integration",
      "Pipeline observability dashboard",
    ],
    stack: ["GitHub Actions", "GitLab CI", "Buildkite", "Argo Rollouts", "Flagger", "Dagger"],
    content: `
A bad pipeline is a tax on every change you ship. A 35-minute build means engineers context-switch, lose flow, and start avoiding small commits. Flaky tests teach people to retry instead of investigate. Both compound.

## What I rebuild

**Build pipeline** — Caching strategy (layer / dep / test), parallel matrix where it pays, hermetic toolchain pinning, reproducible artifacts. Targets: <8 min PR build, <12 min mainline including deploy to staging.

**Test layer** — Selective test execution, flake detection and quarantine, parallelism matched to your test suite shape. Track and publish flake rate weekly — it tends to drop the moment people see the number.

**Security & compliance** — SAST, SCA, secret scanning, container scanning, SBOM generation, image signing. All in pipeline, all blocking, none that slow you down meaningfully.

**Progressive delivery** — Argo Rollouts or Flagger for canary / blue-green deploys. Automated rollback on SLO regression. Deploys at noon on Tuesday, not at 11pm on Friday.

**Pipeline observability** — Dashboards for build duration, queue time, flake rate, deploy frequency. The pipeline is a product; treat it like one.

## Tooling honesty

I don't have a religion about CI tools. GitHub Actions is the right answer most of the time. Buildkite or self-hosted runners win when you're heavy on integration tests or need GPU/custom hardware. I pick what fits, not what I last used.
    `,
  },
  {
    slug: "infrastructure-as-code",
    title: "Infrastructure as Code",
    tagline: "Terraform · Pulumi · OpenTofu",
    shortDescription:
      "Every resource defined, versioned, reviewed, and reproducible. The end of click-ops drift.",
    description:
      "Terraform/OpenTofu modules and Pulumi programs that scale across teams without becoming a swamp. Workspace strategy, state management, policy as code, drift detection.",
    icon: "code-2",
    benefits: [
      "Modular, composable IaC that doesn't rot",
      "PR-driven changes with plan review and policy gates",
      "Drift detection and reconciliation",
      "Module catalog teams actually want to use",
    ],
    deliverables: [
      "Module catalog with versioning policy",
      "Workspace / state strategy",
      "Atlantis / Terraform Cloud / Spacelift setup",
      "Policy library (OPA / Sentinel / Checkov)",
    ],
    stack: ["Terraform", "OpenTofu", "Pulumi", "Atlantis", "Spacelift", "OPA", "Checkov"],
    content: `
IaC is one of those things that's only as good as the second person to use it. Module that worked great for the original author? Confusing for the next team. State file in someone's laptop? Time bomb. No drift detection? Click-ops returns by Q3.

I set up IaC the way it survives.

## What I deliver

**Module catalog** — Composable, versioned modules for the resources your org actually uses. Documented inputs, sensible defaults, examples. Semver discipline. Hosted privately with proper change logs.

**Workspace strategy** — Per-environment, per-team workspaces with clear blast radius. State stored remotely with locking. Backed up. Recoverable.

**PR-driven changes** — Atlantis or Terraform Cloud running plans automatically on PRs. Plans reviewed in code review. Apply gated on approvals. Audit log preserved forever.

**Policy as code** — OPA or Sentinel checking PRs for org policy: required tags, allowed regions, instance size caps, no public S3 buckets. Compliance shifts left.

**Drift detection** — Scheduled drift reports. Anything that changed outside Terraform shows up in Slack within 24 hours. Click-ops becomes visible.

## What I steer you away from

Mega-monorepo with one giant state file. 'IaC by ChatGPT' modules with 200 lines and no inputs. Pulumi when you don't have a strong reason to write infra in TypeScript. Pick boring, pick composable, pick what your team can maintain.
    `,
  },
  {
    slug: "sre-observability",
    title: "Site Reliability & Observability",
    tagline: "SLOs · alerting · incident response",
    shortDescription:
      "Know what's broken before customers do, and prove it isn't broken when they say it is.",
    description:
      "SLOs, error budgets, alerting that pages people only when it matters, distributed tracing, log strategy, incident response, and postmortems that change the system.",
    icon: "activity",
    benefits: [
      "SLOs grounded in user journeys, not metric vanity",
      "Alert noise reduced 70–90% in typical engagements",
      "Distributed tracing across services with sampling strategy",
      "Postmortems that actually drive change",
    ],
    deliverables: [
      "SLO catalog and error budget policy",
      "Alerting rule library and routing",
      "Tracing + log pipeline architecture",
      "Incident response runbook and postmortem template",
    ],
    stack: ["Prometheus", "Grafana", "Datadog", "Honeycomb", "OpenTelemetry", "Loki", "Tempo"],
    content: `
The job of observability isn't to collect metrics. It's to answer questions: is the system healthy, is it degrading, where, why, what changed. Most stacks I encounter are full of dashboards nobody opens and alerts nobody trusts.

## What I rebuild

**SLOs that mean something** — Defined per user journey ('checkout completes in <800ms p95') not per metric. Error budget burn alerts replace 90% of threshold pages. The on-call rotation becomes 1–2 actionable pages per shift, not 30.

**Alert hygiene** — Audit existing alerts; delete what nobody acts on; tune what's noisy; add what's missing. Alert routing per team and severity. Quiet hours on warning-tier.

**Distributed tracing** — OpenTelemetry instrumentation, head-based and tail-based sampling depending on volume, trace-driven debugging culture. The 'why is this request slow' question goes from a 2-hour investigation to a 5-minute span lookup.

**Logs as a product** — Structured logging standard, correlation IDs everywhere, retention by tier, query cost visibility. Stop paying $40k/month for logs no human ever reads.

**Incident response** — Defined severities, paging matrix, comms templates, blameless postmortems, action items tracked to closure. Incidents become learning artifacts.

## Where engagements start

Either an alert audit (typically 2 weeks, immediate quality-of-life win for on-call) or an SLO-first reset of how the team thinks about reliability. Both end with measurable outcomes.
    `,
  },
  {
    slug: "devsecops",
    title: "DevSecOps & Supply Chain",
    tagline: "Shift-left, prove-everywhere",
    shortDescription:
      "Security baked into the pipeline — without slowing engineers down or generating dashboards nobody reads.",
    description:
      "Threat modelling, IaC scanning, dependency hygiene, container hardening, secrets management, runtime detection, SBOM and image signing, audit-ready evidence.",
    icon: "shield-check",
    benefits: [
      "Provable software supply chain (SLSA-aligned)",
      "Vulnerability triage that doesn't drown engineers",
      "Secrets out of code, out of CI logs, out of the chat",
      "Compliance evidence collected automatically",
    ],
    deliverables: [
      "Threat model and risk register",
      "Pipeline security gates (SAST, SCA, IaC, container, secrets)",
      "SBOM generation and image signing",
      "Compliance evidence pipeline (SOC2 / ISO 27001)",
    ],
    stack: ["Trivy", "Snyk", "Semgrep", "Checkov", "Cosign", "OPA", "HashiCorp Vault"],
    content: `
Security teams don't slow engineering down. Bad security tooling does. Two-day vulnerability backlogs, scanners with 80% false positives, secret rotations done by Slack message — that's where breaches live.

## What I implement

**Pipeline gates** — SAST (Semgrep), SCA (Snyk / Grype), IaC scanning (Checkov / tfsec), container scanning (Trivy), secret scanning (gitleaks). Configured to block what matters and warn on the rest. Whitelisting via PR with expiry.

**Supply chain integrity** — SBOMs generated per build, container images signed with Cosign, provenance attested via SLSA. You can prove what's in production and that nothing else is.

**Secrets discipline** — Vault or cloud-native secret manager, dynamic credentials where possible, zero secrets in env files or CI variables. Rotation automated. Access audited.

**Runtime defense** — Falco / GuardDuty / Defender tuned for your workloads, alert routing into the SOC channel that actually exists, integration with your incident response.

**Compliance evidence pipeline** — SOC2 / ISO 27001 / HIPAA controls mapped to actual technical evidence. Evidence collected continuously instead of scrambled together two weeks before audit.

## What I won't do

Add tools without removing tools. The average startup has 9 security scanners and reads the output of 2. I'd rather have you running 4 well than 12 poorly.
    `,
  },
  {
    slug: "database-operations",
    title: "Database Operations",
    tagline: "Postgres · MySQL · Redis · Kafka",
    shortDescription:
      "The boring half of reliability. Backups that restore. Migrations that don't lock. Replicas that don't lag.",
    description:
      "Production database operations: HA topology, backup and restore drills, migration strategy, performance tuning, connection management, and the unsexy work that decides whether outages are recoverable.",
    icon: "database",
    benefits: [
      "Tested backup and restore — not just configured, tested",
      "Zero-downtime schema migrations",
      "Connection pooling and lock contention sorted",
      "Replication topology with documented failover",
    ],
    deliverables: [
      "HA topology design and deployment",
      "Backup/restore runbook with quarterly drill schedule",
      "Migration framework (Flyway / Liquibase / Sqitch / pgroll)",
      "Performance baseline and ongoing query review",
    ],
    stack: ["PostgreSQL", "MySQL", "Redis", "Kafka", "PgBouncer", "pgroll", "Vitess"],
    content: `
Almost every catastrophic outage I've seen at scale traces to the database. Untested backups. Long-running migrations holding locks. Replicas drifting. Connection pools exhausted. The fixes are well known. They just don't get done.

## What I deliver

**HA & DR** — Primary/replica topology, automated failover (Patroni, RDS multi-AZ, Cloud SQL HA), tested DR procedures with documented RTO/RPO. Quarterly restore drills — yes, actually run them.

**Migration safety** — Online schema change framework. PostgreSQL: pgroll or pg-osc; MySQL: gh-ost. Migrations run on PRs with timing estimates. No more 'we ran a migration and the site went down for 40 minutes'.

**Connection management** — PgBouncer / ProxySQL configured with sane pool sizes. Connection storms from autoscaling pods diagnosed and fixed.

**Performance baseline** — Slow query log review cadence, index health monitoring, query plan regression detection. Top 20 queries by time profiled monthly.

**Backups that restore** — Documented backup tier, retention policy, encryption, off-account replication, restore time tested. The backup that hasn't been restored doesn't exist.

## When this matters most

Pre-Series-B teams with one Postgres and growing fast, post-incident teams that just lost data and want it never to happen again, or platforms operating multi-tenant databases where the blast radius of one bad query is everyone.
    `,
  },
  {
    slug: "cloud-migration",
    title: "Cloud Migration & Modernisation",
    tagline: "Lift, shift, then improve",
    shortDescription:
      "From on-prem or one cloud to another, with a migration plan that prioritises customer continuity over engineering aesthetics.",
    description:
      "Migration strategy (rehost / replatform / refactor), wave planning, network bridges, data sync, cutover playbooks, and post-migration optimisation.",
    icon: "arrow-right-left",
    benefits: [
      "Realistic wave plan, not a wishlist",
      "Bidirectional sync during cutover, not 'big bang'",
      "Cost target hit by month 3 post-migration",
      "Zero or near-zero downtime cutover for critical workloads",
    ],
    deliverables: [
      "Migration assessment and wave plan",
      "Network bridge / interconnect setup",
      "Cutover playbook per workload",
      "Post-migration optimisation and decommission plan",
    ],
    stack: ["AWS DMS", "GCP DTS", "Datastream", "Site-to-Site VPN", "Direct Connect", "Anthos"],
    content: `
Cloud migrations fail when they're sold as transformation projects. They succeed when they're sold as a series of small, reversible cutovers that each leave the business better off.

## How I approach it

**Discovery first** — Inventory of what exists, dependency mapping, cost baseline, risk register. Two weeks. Output: a wave plan that engineering, finance, and product all agree on.

**Wave-based execution** — Each wave is 1–4 weeks, ends with workloads moved and the previous environment safely retired. Stateless tier first, async/batch second, stateful tier with the most care.

**Cutover playbooks** — Per workload: pre-checks, data sync method, traffic shift mechanism, rollback procedure, validation steps. Rehearsed in lower environments. Run with a comms cell.

**Post-migration cleanup** — The hidden 30% of migration cost is decommissioning. Retire old infra, cancel licenses, claw back DNS, remove shadow accounts. Done by month 3 or it never gets done.

## What I won't promise

A 'big bang' migration of a multi-year-old monolith done in six weeks. The companies that win at migrations move slowly enough not to break things and quickly enough not to lose momentum.
    `,
  },
  {
    slug: "fractional-devops",
    title: "Fractional DevOps Lead",
    tagline: "1–3 days/week, ongoing",
    shortDescription:
      "Senior DevOps leadership without the full-time hire — for teams between 'a developer set this up' and 'we need our own platform team'.",
    description:
      "Embedded part-time as your senior platform/DevOps engineer. Architecture, on-call coverage, hiring help, and the day-to-day calls a strong senior would make.",
    icon: "users",
    benefits: [
      "Senior decision-making without the hiring runway",
      "On-call coverage and escalation point",
      "Hiring panel for your future full-time DevOps lead",
      "Knowledge transfer baked into every engagement",
    ],
    deliverables: [
      "Quarterly platform roadmap",
      "Weekly working sessions with engineering",
      "On-call rotation participation",
      "Hiring scorecard and interview support",
    ],
    stack: ["Whatever your stack is", "—", "—"],
    content: `
The hardest stage for a growing engineering team is between Series A and Series C. Too small for a platform team. Too big for 'one of the developers handles infra in their 20%'. Hiring a full-time DevOps lead is a 4–6 month process and your environment is going to break before then.

I cover that gap.

## How fractional engagements work

**1–3 days/week embedded** — Joining your engineering Slack, attending architecture and on-call reviews, owning the platform roadmap, and being the senior voice in the room when infra decisions are being made.

**On-call coverage** — Backup tier on your rotation. The 2am page that nobody else can solve still gets solved.

**Quarterly roadmap** — Honest assessment, prioritised plan, executed across the quarter with your team. Not a deck — actual delivery.

**Hiring partner** — When you're ready to hire your full-time platform lead, I help write the JD, screen candidates, and run technical interviews. Then I hand over.

## Who this fits

10–60 engineer companies, post product-market-fit, where infrastructure is becoming a real constraint and full-time hiring is in flight or 6+ months out.
    `,
  },
];

export function getService(slug: string) {
  return services.find((s) => s.slug === slug);
}
