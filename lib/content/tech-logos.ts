// Maps technology item names to simpleicons.org slugs.
// CDN: https://cdn.simpleicons.org/{slug}/{color}
// Items not in this map will render with a text initial fallback.

export const techLogoSlug: Record<string, string> = {
  // Cloud
  AWS: "amazonwebservices",
  "Amazon Web Services": "amazonwebservices",
  GCP: "googlecloud",
  "Google Cloud": "googlecloud",
  "Google Cloud Platform": "googlecloud",
  Azure: "microsoftazure",
  "Microsoft Azure": "microsoftazure",
  Cloudflare: "cloudflare",
  DigitalOcean: "digitalocean",

  // Container & Orchestration
  Kubernetes: "kubernetes",
  EKS: "amazoneks",
  GKE: "googlecloud",
  AKS: "microsoftazure",
  Docker: "docker",
  Helm: "helm",
  ArgoCD: "argo",
  Argo: "argo",
  "Argo Rollouts": "argo",
  Flux: "flux",
  Karpenter: "kubernetes",
  Kustomize: "kubernetes",
  Cilium: "cilium",
  Istio: "istio",
  "k9s": "kubernetes",

  // IaC
  Terraform: "terraform",
  OpenTofu: "opentofu",
  Pulumi: "pulumi",
  Crossplane: "kubernetes",
  CloudFormation: "amazonwebservices",

  // CI/CD
  "GitHub Actions": "githubactions",
  GitLab: "gitlab",
  "GitLab CI": "gitlab",
  CircleCI: "circleci",
  Buildkite: "buildkite",
  Jenkins: "jenkins",
  Dagger: "dagger",
  Flagger: "flagger",

  // Observability
  Prometheus: "prometheus",
  Grafana: "grafana",
  Datadog: "datadog",
  Honeycomb: "honeycomb",
  "New Relic": "newrelic",
  OpenTelemetry: "opentelemetry",
  Loki: "grafana",
  Tempo: "grafana",
  Sentry: "sentry",
  Splunk: "splunk",
  Elasticsearch: "elasticsearch",
  Kibana: "kibana",

  // Databases / Streams
  PostgreSQL: "postgresql",
  Postgres: "postgresql",
  MySQL: "mysql",
  Redis: "redis",
  MongoDB: "mongodb",
  Kafka: "apachekafka",
  "Apache Kafka": "apachekafka",
  RabbitMQ: "rabbitmq",
  Snowflake: "snowflake",
  ClickHouse: "clickhouse",
  Cassandra: "apachecassandra",
  DynamoDB: "amazondynamodb",
  BigQuery: "googlecloud",
  Vitess: "vitess",
  Airflow: "apacheairflow",
  dbt: "dbt",

  // Languages
  Python: "python",
  Go: "go",
  Golang: "go",
  TypeScript: "typescript",
  JavaScript: "javascript",
  Bash: "gnubash",
  Shell: "gnubash",
  Rust: "rust",
  Java: "openjdk",

  // Security
  Vault: "vault",
  "HashiCorp Vault": "vault",
  Trivy: "aquasecurity",
  Snyk: "snyk",
  Semgrep: "semgrep",
  Cosign: "sigstore",
  Sigstore: "sigstore",
  OPA: "openpolicyagent",
  "Open Policy Agent": "openpolicyagent",
  Checkov: "checkmarx",
  Falco: "falco",

  // Networking / VCS / Misc
  Git: "git",
  GitHub: "github",
  Linux: "linux",
  Nginx: "nginx",
  Envoy: "envoyproxy",

  // SaaS often referenced
  Notion: "notion",
  Linear: "linear",
  Slack: "slack",
};

const slugify = (name: string) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

export function getLogoUrl(name: string, color = "22d3ee"): string | null {
  const direct = techLogoSlug[name];
  if (direct) return `https://cdn.simpleicons.org/${direct}/${color}`;
  // try slugified fallback
  const slug = slugify(name);
  if (!slug) return null;
  return `https://cdn.simpleicons.org/${slug}/${color}`;
}

export function getInitials(name: string): string {
  const parts = name.split(/[\s-]+/).filter(Boolean);
  if (parts.length === 0) return name.slice(0, 2).toUpperCase();
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}
