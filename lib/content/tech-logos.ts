// Maps technology item names to logo CDN slugs.
// Prefers devicon (multi-color brand logos) when available.
// Falls back to simpleicons (single-color) tinted cyan.

type LogoEntry = { devicon?: string; simpleicons?: string };

export const techLogoMap: Record<string, LogoEntry> = {
  // Cloud
  AWS: { devicon: "amazonwebservices/amazonwebservices-original-wordmark", simpleicons: "amazonwebservices" },
  "Amazon Web Services": { devicon: "amazonwebservices/amazonwebservices-original-wordmark", simpleicons: "amazonwebservices" },
  GCP: { devicon: "googlecloud/googlecloud-original", simpleicons: "googlecloud" },
  "Google Cloud": { devicon: "googlecloud/googlecloud-original", simpleicons: "googlecloud" },
  "Google Cloud Platform": { devicon: "googlecloud/googlecloud-original", simpleicons: "googlecloud" },
  Azure: { devicon: "azure/azure-original", simpleicons: "microsoftazure" },
  "Microsoft Azure": { devicon: "azure/azure-original", simpleicons: "microsoftazure" },
  Cloudflare: { devicon: "cloudflare/cloudflare-original", simpleicons: "cloudflare" },
  DigitalOcean: { devicon: "digitalocean/digitalocean-original", simpleicons: "digitalocean" },
  Vercel: { devicon: "vercel/vercel-original", simpleicons: "vercel" },
  Heroku: { devicon: "heroku/heroku-original", simpleicons: "heroku" },

  // Container & orchestration
  Kubernetes: { devicon: "kubernetes/kubernetes-plain", simpleicons: "kubernetes" },
  EKS: { devicon: "amazonwebservices/amazonwebservices-original-wordmark", simpleicons: "amazoneks" },
  GKE: { devicon: "googlecloud/googlecloud-original", simpleicons: "googlecloud" },
  AKS: { devicon: "azure/azure-original", simpleicons: "microsoftazure" },
  Docker: { devicon: "docker/docker-original", simpleicons: "docker" },
  Helm: { simpleicons: "helm" },
  ArgoCD: { simpleicons: "argo" },
  Argo: { simpleicons: "argo" },
  "Argo Rollouts": { simpleicons: "argo" },
  Flux: { simpleicons: "flux" },
  Karpenter: { devicon: "kubernetes/kubernetes-plain", simpleicons: "kubernetes" },
  Kustomize: { devicon: "kubernetes/kubernetes-plain", simpleicons: "kubernetes" },
  Cilium: { simpleicons: "cilium" },
  Istio: { simpleicons: "istio" },
  k9s: { devicon: "kubernetes/kubernetes-plain", simpleicons: "kubernetes" },

  // IaC
  Terraform: { devicon: "terraform/terraform-original", simpleicons: "terraform" },
  OpenTofu: { simpleicons: "opentofu" },
  Pulumi: { simpleicons: "pulumi" },
  Crossplane: { devicon: "kubernetes/kubernetes-plain", simpleicons: "kubernetes" },
  CloudFormation: { devicon: "amazonwebservices/amazonwebservices-original-wordmark", simpleicons: "amazonwebservices" },
  Ansible: { devicon: "ansible/ansible-original", simpleicons: "ansible" },

  // CI/CD
  "GitHub Actions": { devicon: "githubactions/githubactions-original", simpleicons: "githubactions" },
  GitLab: { devicon: "gitlab/gitlab-original", simpleicons: "gitlab" },
  "GitLab CI": { devicon: "gitlab/gitlab-original", simpleicons: "gitlab" },
  CircleCI: { devicon: "circleci/circleci-plain", simpleicons: "circleci" },
  Buildkite: { simpleicons: "buildkite" },
  Jenkins: { devicon: "jenkins/jenkins-original", simpleicons: "jenkins" },
  Dagger: { simpleicons: "dagger" },
  Flagger: { simpleicons: "flagger" },

  // Observability
  Prometheus: { devicon: "prometheus/prometheus-original", simpleicons: "prometheus" },
  Grafana: { devicon: "grafana/grafana-original", simpleicons: "grafana" },
  Datadog: { simpleicons: "datadog" },
  Honeycomb: { simpleicons: "honeycomb" },
  "New Relic": { devicon: "newrelic/newrelic-original", simpleicons: "newrelic" },
  OpenTelemetry: { simpleicons: "opentelemetry" },
  Loki: { devicon: "grafana/grafana-original", simpleicons: "grafana" },
  Tempo: { devicon: "grafana/grafana-original", simpleicons: "grafana" },
  Sentry: { devicon: "sentry/sentry-original", simpleicons: "sentry" },
  Splunk: { devicon: "splunk/splunk-original", simpleicons: "splunk" },
  Elasticsearch: { devicon: "elasticsearch/elasticsearch-original", simpleicons: "elasticsearch" },
  Kibana: { devicon: "kibana/kibana-original", simpleicons: "kibana" },

  // Databases / streams
  PostgreSQL: { devicon: "postgresql/postgresql-original", simpleicons: "postgresql" },
  Postgres: { devicon: "postgresql/postgresql-original", simpleicons: "postgresql" },
  MySQL: { devicon: "mysql/mysql-original", simpleicons: "mysql" },
  Redis: { devicon: "redis/redis-original", simpleicons: "redis" },
  MongoDB: { devicon: "mongodb/mongodb-original", simpleicons: "mongodb" },
  Kafka: { devicon: "apachekafka/apachekafka-original", simpleicons: "apachekafka" },
  "Apache Kafka": { devicon: "apachekafka/apachekafka-original", simpleicons: "apachekafka" },
  RabbitMQ: { devicon: "rabbitmq/rabbitmq-original", simpleicons: "rabbitmq" },
  Snowflake: { simpleicons: "snowflake" },
  ClickHouse: { simpleicons: "clickhouse" },
  Cassandra: { devicon: "cassandra/cassandra-original", simpleicons: "apachecassandra" },
  DynamoDB: { simpleicons: "amazondynamodb" },
  BigQuery: { devicon: "googlecloud/googlecloud-original", simpleicons: "googlecloud" },
  Vitess: { simpleicons: "vitess" },
  Airflow: { simpleicons: "apacheairflow" },
  dbt: { simpleicons: "dbt" },
  Supabase: { devicon: "supabase/supabase-original", simpleicons: "supabase" },

  // Languages & frameworks
  Python: { devicon: "python/python-original", simpleicons: "python" },
  Go: { devicon: "go/go-original", simpleicons: "go" },
  Golang: { devicon: "go/go-original", simpleicons: "go" },
  TypeScript: { devicon: "typescript/typescript-original", simpleicons: "typescript" },
  JavaScript: { devicon: "javascript/javascript-original", simpleicons: "javascript" },
  Bash: { devicon: "bash/bash-original", simpleicons: "gnubash" },
  Shell: { devicon: "bash/bash-original", simpleicons: "gnubash" },
  Rust: { devicon: "rust/rust-original", simpleicons: "rust" },
  Java: { devicon: "java/java-original", simpleicons: "openjdk" },
  React: { devicon: "react/react-original", simpleicons: "react" },
  "Next.js": { devicon: "nextjs/nextjs-original", simpleicons: "nextdotjs" },
  Node: { devicon: "nodejs/nodejs-original", simpleicons: "nodedotjs" },
  "Node.js": { devicon: "nodejs/nodejs-original", simpleicons: "nodedotjs" },
  Tailwind: { devicon: "tailwindcss/tailwindcss-original", simpleicons: "tailwindcss" },
  "Tailwind CSS": { devicon: "tailwindcss/tailwindcss-original", simpleicons: "tailwindcss" },

  // Security
  Vault: { devicon: "vault/vault-original", simpleicons: "vault" },
  "HashiCorp Vault": { devicon: "vault/vault-original", simpleicons: "vault" },
  Trivy: { simpleicons: "aquasecurity" },
  Snyk: { devicon: "snyk/snyk-original", simpleicons: "snyk" },
  Semgrep: { simpleicons: "semgrep" },
  Cosign: { simpleicons: "sigstore" },
  Sigstore: { simpleicons: "sigstore" },
  OPA: { simpleicons: "openpolicyagent" },
  "Open Policy Agent": { simpleicons: "openpolicyagent" },
  Checkov: { simpleicons: "checkmarx" },
  Falco: { simpleicons: "falco" },

  // VCS / misc
  Git: { devicon: "git/git-original", simpleicons: "git" },
  GitHub: { devicon: "github/github-original", simpleicons: "github" },
  Linux: { devicon: "linux/linux-original", simpleicons: "linux" },
  Nginx: { devicon: "nginx/nginx-original", simpleicons: "nginx" },
  Envoy: { simpleicons: "envoyproxy" },

  // AI / ML
  OpenAI: { simpleicons: "openai" },
  Anthropic: { simpleicons: "anthropic" },
  Claude: { simpleicons: "anthropic" },
  Gemini: { simpleicons: "googlegemini" },
  HuggingFace: { simpleicons: "huggingface" },
  "Hugging Face": { simpleicons: "huggingface" },
  LangChain: { simpleicons: "langchain" },
  Pinecone: { simpleicons: "pinecone" },
  Weaviate: { simpleicons: "weaviate" },
  Ollama: { simpleicons: "ollama" },
  pgvector: { devicon: "postgresql/postgresql-original", simpleicons: "postgresql" },
  MCP: { simpleicons: "anthropic" },

  // SaaS
  Notion: { devicon: "notion/notion-original", simpleicons: "notion" },
  Linear: { simpleicons: "linear" },
  Slack: { devicon: "slack/slack-original", simpleicons: "slack" },
  Stripe: { simpleicons: "stripe" },
  Resend: { simpleicons: "resend" },
};

const slugify = (name: string) =>
  name.toLowerCase().replace(/[^a-z0-9]/g, "");

export function getLogoUrl(name: string): string | null {
  const entry = techLogoMap[name];
  if (entry?.devicon) {
    return `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${entry.devicon}.svg`;
  }
  if (entry?.simpleicons) {
    return `https://cdn.simpleicons.org/${entry.simpleicons}`;
  }
  // Try devicon by slug guess
  const slug = slugify(name);
  if (!slug) return null;
  return `https://cdn.simpleicons.org/${slug}`;
}

export function getInitials(name: string): string {
  const parts = name.split(/[\s-]+/).filter(Boolean);
  if (parts.length === 0) return name.slice(0, 2).toUpperCase();
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}
