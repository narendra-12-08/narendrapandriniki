export type CaseStudy = {
  slug: string;
  title: string;
  client: string;
  industry: string;
  duration: string;
  team: string;
  tags: string[];
  outcome: string;
  metrics: { label: string; value: string }[];
  problem: string;
  approach: string[];
  result: string;
  stack: string[];
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "series-c-payments-platform-rebuild",
    title: "Rebuilding the platform under a payments company without slowing the roadmap",
    client: "Series-C payments platform",
    industry: "Fintech",
    duration: "14 weeks",
    team: "Embedded with 3 platform engineers, 22 product engineers downstream",
    tags: ["Kubernetes", "Multi-region", "PCI-DSS", "GitOps", "FinOps"],
    outcome:
      "Cut deploy time from 38 minutes to under 9, reduced cluster spend by 31%, and got the team out of a quarterly upgrade panic.",
    metrics: [
      { label: "Mainline build time", value: "38m → 9m" },
      { label: "Monthly cluster spend", value: "-31%" },
      { label: "p95 checkout latency", value: "-22%" },
      { label: "On-call pages / week", value: "47 → 6" },
    ],
    problem:
      "Two EKS clusters that had drifted from each other, Helm releases applied from laptops, no error budget, and a CI pipeline so slow that engineers batched merges to avoid waiting. Auditors had questions the team couldn't answer in less than a week.",
    approach: [
      "Audited the current state across infrastructure, CI/CD, observability, and on-call. Wrote a single-page assessment with the three things that mattered and the eleven that didn't.",
      "Replaced Helm-from-laptop with ArgoCD app-of-apps, pinned cluster versions, and introduced a real promotion path from staging to two production regions via PR.",
      "Rebuilt the GitHub Actions pipeline around a layered cache strategy and selective test execution. Killed three abandoned scanners, kept the four that actually blocked merges.",
      "Defined SLOs per user journey (checkout, payout, dispute) and wired Prometheus burn-rate alerts. Deleted 70% of existing alerts on day one with the on-call team's blessing.",
      "Introduced Karpenter with consolidated workload classes, right-sized stateful tier, and structured a savings plan against the post-tuning baseline rather than the bloated one.",
    ],
    result:
      "Three months in, deploys had moved from late evenings to mid-afternoon and the team shipped a multi-region failover drill on schedule. The platform passed its first PCI re-audit without a single open finding, and the on-call rotation became something engineers stopped trying to swap out of.",
    stack: ["AWS", "EKS", "Karpenter", "ArgoCD", "Terraform", "GitHub Actions", "Prometheus", "Grafana", "Vault"],
  },
  {
    slug: "b2b-saas-platform-team-foundation",
    title: "Standing up a platform team where there wasn't one",
    client: "Series-B B2B SaaS (workflow automation)",
    industry: "B2B SaaS",
    duration: "10 weeks",
    team: "Solo, hiring panel for 2 platform engineers in parallel",
    tags: ["Platform engineering", "Backstage", "Golden paths", "Hiring"],
    outcome:
      "Delivered a working internal developer platform, paved-path service template, and hired the two engineers who own it now.",
    metrics: [
      { label: "Time to provision a new service", value: "3 days → 22 minutes" },
      { label: "DORA lead time for change", value: "4.1d → 9h" },
      { label: "Engineer NPS on tooling", value: "-12 → +41" },
      { label: "Platform tickets per week", value: "60+ → 7" },
    ],
    problem:
      "Forty engineers, a wiki nobody read, and a single staff engineer who had become the human service catalog. New services took days to scaffold and three different teams disagreed on what 'production-ready' meant.",
    approach: [
      "Ran a two-week discovery: shadowed three teams, mapped how a change actually reached production, and wrote down every implicit rule that lived in someone's head.",
      "Picked Backstage, but only after agreeing with the CTO that we would not customise the React layer for at least six months. Boring is a feature.",
      "Built one Go service template and one TypeScript service template wired with CI/CD, OpenTelemetry, secrets via External Secrets Operator, and a runbook stub. Made it the only sanctioned way to start a new service.",
      "Wrote three Crossplane compositions for the resources teams actually requested weekly: a Postgres database, an S3 bucket with sane defaults, and a Redis instance.",
      "Ran the hiring panel for the platform team in parallel — JDs, screens, technical interviews — and handed over a working platform plus a documented six-month roadmap on the last day.",
    ],
    result:
      "A platform team of two now owns what was delivered. Service creation became a non-event; the staff engineer who had been the bottleneck went back to product work. Six months on, the team had added two more compositions without my involvement.",
    stack: ["GCP", "GKE", "Backstage", "Crossplane", "ArgoCD", "GitHub Actions", "OpenTelemetry", "External Secrets Operator"],
  },
  {
    slug: "healthtech-hipaa-foundation",
    title: "HIPAA-aligned cloud foundation for a clinical data startup",
    client: "Seed-stage clinical data healthtech",
    industry: "Healthtech",
    duration: "8 weeks",
    team: "Solo, working with the founding CTO",
    tags: ["HIPAA", "Landing zone", "Compliance evidence", "PHI"],
    outcome:
      "Cleared HIPAA technical safeguards review with their first enterprise customer's security team — on the first pass.",
    metrics: [
      { label: "Security review cycles", value: "1 (first pass)" },
      { label: "Encrypted data stores", value: "100%" },
      { label: "IAM roles with break-glass", value: "All privileged paths" },
      { label: "Audit log retention", value: "7 years, immutable" },
    ],
    problem:
      "A two-engineer founding team with a working prototype on a single AWS account, hardcoded credentials in env files, and an enterprise customer asking for a HIPAA attestation in six weeks.",
    approach: [
      "Multi-account org with dedicated accounts for prod, staging, audit, and security tooling. SSO with break-glass procedure documented and rehearsed.",
      "VPC architecture with PHI-handling workloads isolated, all egress through inspected paths, no public subnets in production.",
      "Replaced env-file secrets with Vault on a hardened EKS cluster, dynamic database credentials, secrets rotation automated.",
      "Wired CloudTrail, GuardDuty, and Config into the audit account with immutable storage. Mapped each HIPAA technical safeguard to a specific technical control with evidence collected continuously.",
      "Wrote the actual policies — access management, incident response, change management — in plain English, with the technical controls each one referenced.",
    ],
    result:
      "Passed the customer's review on first submission. The CTO walked into the next sales conversation with a one-page security overview that was true. The same foundation later carried them through SOC 2 Type I without re-architecture.",
    stack: ["AWS", "EKS", "Terraform", "Vault", "CloudTrail", "GuardDuty", "AWS Config", "External Secrets Operator"],
  },
  {
    slug: "ecommerce-black-friday-readiness",
    title: "Getting an e-commerce platform through Black Friday without a war room",
    client: "Mid-market DTC e-commerce platform",
    industry: "E-commerce",
    duration: "6 weeks (peak readiness) + ongoing retainer",
    team: "Embedded with the SRE team of 4",
    tags: ["Capacity planning", "Load testing", "Autoscaling", "Incident response"],
    outcome:
      "Handled 7.2x the previous year's peak with a single sub-five-minute degradation, no all-hands incident, and a smaller bill than the prior year.",
    metrics: [
      { label: "Peak RPS handled", value: "7.2x YoY" },
      { label: "Sev-1 incidents during peak", value: "0" },
      { label: "Total peak-week cloud spend", value: "-18% YoY" },
      { label: "p99 cart latency at peak", value: "<340ms" },
    ],
    problem:
      "Black Friday 2024 had been a 36-hour war room with three near-misses. Leadership wanted 2025 to be boring, and the team had three different opinions on what had actually saved them last time.",
    approach: [
      "Reconstructed the 2024 incident timeline from logs and pages, then ran a blameless retro to separate what worked from what we got lucky on.",
      "Built a representative load test with k6 that drove real user journeys, not synthetic RPS. Calibrated it against last year's traffic shape.",
      "Tuned Karpenter consolidation, HPA target utilisation per service, and pre-warmed the stateful tier ahead of the campaign window. Documented why each number was the number.",
      "Replaced threshold alerts on CPU with burn-rate alerts on the four user journeys that mattered. The on-call team agreed up-front what would and wouldn't get them out of bed.",
      "Ran two full-scale game days in production (with marketing's blessing) two and four weeks before peak. Found and fixed a Redis connection storm both times.",
    ],
    result:
      "Peak weekend ran on autopilot. The incident channel had two messages, both informational. The CTO kept the same playbook for 2026 with marginal tweaks, and the team ran their first holiday on-call rotation that didn't burn anyone out.",
    stack: ["AWS", "EKS", "Karpenter", "Redis", "PostgreSQL", "Datadog", "k6", "Argo Rollouts"],
  },
  {
    slug: "ai-ml-infra-gpu-cost-control",
    title: "Bringing an AI infra bill back under control without slowing training",
    client: "Series-B AI/ML platform (model training & inference)",
    industry: "AI/ML Infrastructure",
    duration: "12 weeks",
    team: "Embedded with 2 ML platform engineers, working alongside the research team",
    tags: ["GPU scheduling", "FinOps", "Karpenter", "Spot", "Inference"],
    outcome:
      "Cut monthly GPU spend by 44% while improving job throughput and shortening time-to-first-token on inference.",
    metrics: [
      { label: "Monthly GPU spend", value: "-44%" },
      { label: "Training job throughput", value: "+27%" },
      { label: "Inference p50 TTFT", value: "-31%" },
      { label: "Spot interruption recovery", value: "<90s checkpointed" },
    ],
    problem:
      "On-demand H100 nodes running 24/7 regardless of queue depth, no checkpointing strategy for spot, and an inference path that overprovisioned because nobody trusted the autoscaler.",
    approach: [
      "Profiled actual GPU utilisation per workload — training vs fine-tuning vs inference — and discovered three of the largest line items were below 30% utilised.",
      "Introduced Karpenter with separate node pools for training (spot, large, interruption-tolerant) and inference (on-demand, smaller, latency-sensitive). Wrote disruption budgets per pool.",
      "Added checkpoint-on-eviction for training jobs with a tested recovery flow, validated by deliberately killing nodes during a real run.",
      "Replaced the inference autoscaler signal from CPU to in-flight request count plus GPU memory headroom. Set conservative scale-down to protect TTFT.",
      "Negotiated a GPU committed-use discount sized against the post-tuning baseline, not the pre-tuning bloat. Locked in savings the same week as the optimisation work.",
    ],
    result:
      "The bill dropped by close to half within the first full billing cycle after tuning. Research velocity went up, not down — fewer queue waits, faster checkpoint recovery, and an inference path with predictable latency. The platform team got time back to work on multi-tenant scheduling.",
    stack: ["AWS", "EKS", "Karpenter", "Kubeflow", "Triton", "Prometheus", "Grafana", "S3"],
  },
  {
    slug: "marketplace-multi-region-failover",
    title: "Real multi-region failover for a two-sided marketplace",
    client: "Series-D logistics marketplace",
    industry: "Marketplaces",
    duration: "16 weeks",
    team: "Embedded with platform team of 5 across two timezones",
    tags: ["Multi-region", "Disaster recovery", "PostgreSQL", "Active-active"],
    outcome:
      "Delivered a tested cross-region failover with documented RTO of 12 minutes and RPO under 30 seconds — and proved it in a live game day.",
    metrics: [
      { label: "Tested RTO", value: "12 minutes" },
      { label: "Measured RPO", value: "< 30 seconds" },
      { label: "Failover game days", value: "4 (all successful)" },
      { label: "Cross-region data sync lag p99", value: "< 2.1s" },
    ],
    problem:
      "A 'multi-region' setup that was a passive copy nobody had ever cut over to. Leadership had been telling enterprise customers it existed; the engineering team knew it didn't really.",
    approach: [
      "Started with the truth: wrote a one-page document describing the actual state of cross-region readiness and shared it with leadership before promising anything.",
      "Built logical replication for the Postgres tier using pglogical with monitored lag, alerts on drift, and a documented promotion procedure.",
      "Made the application stateless-by-default at the request layer, with idempotency keys on writes that crossed regions and explicit conflict policies on the few that could.",
      "Wired Route 53 health-checked failover with sane TTLs, and rehearsed DNS propagation with a partner CDN to understand real-world cutover times.",
      "Ran four game days at increasing severity — staging-only, prod with synthetic traffic, prod with 5% real traffic, full prod cutover. Wrote postmortems for each. Fixed three real bugs only the game days surfaced.",
    ],
    result:
      "The marketplace now has a failover capability it can actually demonstrate. Two enterprise customers signed contracts that were blocked on it. The team runs a full game day quarterly and treats it as routine, not a project.",
    stack: ["AWS", "EKS", "PostgreSQL", "pglogical", "Route 53", "Terraform", "ArgoCD", "Datadog"],
  },
];

export function getCaseStudy(slug: string) {
  return caseStudies.find((c) => c.slug === slug);
}
