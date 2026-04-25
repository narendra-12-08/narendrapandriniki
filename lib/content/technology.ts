export type TechItem = {
  name: string;
  role: "core" | "fluent" | "familiar";
  note?: string;
};

export type TechCategory = {
  slug: string;
  name: string;
  description: string;
  items: TechItem[];
};

export const technology: TechCategory[] = [
  {
    slug: "cloud-platforms",
    name: "Cloud Platforms",
    description:
      "Most of my work lives on AWS, with regular GCP engagements and occasional Azure. I pick the cloud that fits the customer, not the one I prefer.",
    items: [
      { name: "AWS", role: "core", note: "Primary cloud for the majority of my engagements; deep on EKS, networking, IAM, and FinOps." },
      { name: "GCP", role: "core", note: "Strong on GKE, Workload Identity, and BigQuery-adjacent platforms." },
      { name: "Azure", role: "fluent", note: "AKS, Azure DevOps, and Entra ID; less frequent but well-trodden." },
    ],
  },
  {
    slug: "containers-orchestration",
    name: "Container & Orchestration",
    description:
      "Kubernetes is the substrate I spend the most time on. Production-grade clusters, GitOps deploys, autoscaling, and the operational maturity to run them without drama.",
    items: [
      { name: "Kubernetes", role: "core", note: "Production clusters, multi-tenancy, upgrade discipline, security baseline." },
      { name: "EKS", role: "core" },
      { name: "GKE", role: "core" },
      { name: "AKS", role: "fluent" },
      { name: "Docker", role: "core", note: "Image hardening, multi-stage builds, distroless bases." },
      { name: "Helm", role: "core", note: "Chart authoring and library charts; opinionated about when not to use it." },
      { name: "ArgoCD", role: "core", note: "App-of-apps, ApplicationSets, sync waves, drift detection." },
      { name: "Flux", role: "fluent" },
      { name: "Karpenter", role: "core", note: "Pool design, disruption budgets, consolidation tuning." },
    ],
  },
  {
    slug: "infrastructure-as-code",
    name: "Infrastructure as Code",
    description:
      "Terraform is the default; OpenTofu for new work where that fits the customer. Pulumi when the team has a strong reason to write infra in TypeScript or Go.",
    items: [
      { name: "Terraform", role: "core", note: "Module catalogues, workspace strategy, policy as code, drift detection." },
      { name: "OpenTofu", role: "core" },
      { name: "Pulumi", role: "fluent", note: "Used selectively where TypeScript/Go infra is the right fit." },
      { name: "CloudFormation", role: "familiar", note: "I read it; I don't recommend new work in it." },
      { name: "Crossplane", role: "core", note: "Self-service infrastructure compositions for platform teams." },
    ],
  },
  {
    slug: "ci-cd",
    name: "CI/CD",
    description:
      "Pipelines that are fast, deterministic, and trustworthy. I have no religion about CI tools; I pick what fits the team.",
    items: [
      { name: "GitHub Actions", role: "core", note: "Default for most teams; reusable workflows, layered caching, OIDC into cloud." },
      { name: "GitLab CI", role: "core" },
      { name: "Buildkite", role: "fluent", note: "Strong choice for heavy integration tests or self-hosted runners." },
      { name: "CircleCI", role: "fluent" },
      { name: "Argo Rollouts", role: "core", note: "Canary and blue-green progressive delivery on Kubernetes." },
      { name: "Flagger", role: "fluent" },
    ],
  },
  {
    slug: "observability",
    name: "Observability",
    description:
      "SLOs grounded in user journeys, alerting that pages people only when it matters, distributed tracing across services, and logs as a managed product rather than a dumping ground.",
    items: [
      { name: "Prometheus", role: "core", note: "Metrics, alerting rules, recording rules, federation for multi-cluster." },
      { name: "Grafana", role: "core", note: "Dashboards designed to answer questions, not to look impressive." },
      { name: "Datadog", role: "core", note: "Used heavily; opinionated about how to keep the bill from running away." },
      { name: "Honeycomb", role: "fluent", note: "Strong choice for trace-driven debugging cultures." },
      { name: "OpenTelemetry", role: "core", note: "Instrumentation standard; collectors, sampling strategy, exporters." },
      { name: "Loki", role: "fluent" },
      { name: "Tempo", role: "fluent" },
      { name: "New Relic", role: "fluent" },
    ],
  },
  {
    slug: "databases",
    name: "Databases & Streaming",
    description:
      "The boring half of reliability. Backup and restore that's tested, migrations that don't lock, replication that doesn't lag, and event pipelines that don't fall over at peak.",
    items: [
      { name: "PostgreSQL", role: "core", note: "HA topology, logical replication, online schema change with pgroll, performance tuning." },
      { name: "MySQL", role: "fluent", note: "gh-ost for online schema changes; ProxySQL for connection management." },
      { name: "Redis", role: "core", note: "Caching strategy, sentinel/cluster, eviction policies tuned to workload." },
      { name: "MongoDB", role: "fluent" },
      { name: "Kafka", role: "core", note: "Topic design, consumer group strategy, lag monitoring, schema discipline." },
      { name: "RabbitMQ", role: "fluent" },
    ],
  },
  {
    slug: "languages",
    name: "Languages",
    description:
      "Languages I write in regularly for tooling, automation, and platform code. I don't write product code in any of them as part of an engagement.",
    items: [
      { name: "Python", role: "core", note: "Most of my automation and tooling; data work and ML platform integration." },
      { name: "Go", role: "core", note: "Operators, controllers, CLI tooling, performance-sensitive platform code." },
      { name: "TypeScript", role: "fluent", note: "Pulumi programs, Backstage customisation, occasional internal tools." },
      { name: "Bash", role: "core", note: "Where the right answer is genuinely a shell script." },
      { name: "Rust", role: "familiar", note: "I read it and contribute to it; not my primary language for new tooling." },
    ],
  },
  {
    slug: "security",
    name: "Security",
    description:
      "Security baked into the pipeline. Threat modelling, supply chain integrity, secrets discipline, and runtime defence — without slowing engineers down or generating dashboards nobody reads.",
    items: [
      { name: "HashiCorp Vault", role: "core", note: "Dynamic secrets, PKI, transit, integration with Kubernetes auth." },
      { name: "Trivy", role: "core", note: "Container, IaC, and filesystem scanning in the pipeline." },
      { name: "Snyk", role: "fluent" },
      { name: "Cosign", role: "core", note: "Image signing and verification, SLSA provenance, keyless with OIDC." },
      { name: "OPA", role: "core", note: "Policy as code for IaC, admission control, and authorisation." },
      { name: "Falco", role: "fluent", note: "Runtime threat detection on Kubernetes." },
    ],
  },
];

export function getCategory(slug: string) {
  return technology.find((c) => c.slug === slug);
}
