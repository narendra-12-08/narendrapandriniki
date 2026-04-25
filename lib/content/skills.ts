export type SkillLevel = 1 | 2 | 3 | 4 | 5;

export type Skill = {
  name: string;
  level: SkillLevel;
  years: number;
  note?: string;
};

export type SkillGroup = {
  name: string;
  tagline: string;
  skills: Skill[];
};

export const skillsMatrix: SkillGroup[] = [
  {
    name: "Cloud Platforms",
    tagline: "Multi-cloud by necessity, opinionated by experience.",
    skills: [
      { name: "AWS", level: 5, years: 5 },
      { name: "GCP", level: 4, years: 3 },
      { name: "Azure", level: 4, years: 2 },
      { name: "Multi-cloud architecture", level: 4, years: 3 },
    ],
  },
  {
    name: "Container Orchestration",
    tagline: "Kubernetes in production across three providers, daily.",
    skills: [
      { name: "Kubernetes", level: 5, years: 4 },
      { name: "Amazon EKS", level: 5, years: 4 },
      { name: "Google GKE", level: 4, years: 3 },
      { name: "Azure AKS", level: 4, years: 2 },
      { name: "Helm", level: 5, years: 4 },
      { name: "ArgoCD", level: 5, years: 3 },
    ],
  },
  {
    name: "Infrastructure as Code",
    tagline: "Reproducible infrastructure or it doesn't exist.",
    skills: [
      { name: "Terraform", level: 5, years: 5 },
      { name: "OpenTofu", level: 4, years: 2 },
      { name: "Pulumi", level: 3, years: 2 },
      { name: "Crossplane", level: 3, years: 1 },
    ],
  },
  {
    name: "CI/CD",
    tagline: "Pipelines that ship quietly and fail loudly.",
    skills: [
      { name: "GitHub Actions", level: 5, years: 4 },
      { name: "GitLab CI", level: 4, years: 3 },
      { name: "Buildkite", level: 3, years: 2 },
      { name: "Argo Rollouts", level: 4, years: 2 },
    ],
  },
  {
    name: "Observability",
    tagline: "SLOs first, dashboards second, alerts that mean something.",
    skills: [
      { name: "Prometheus / Grafana", level: 5, years: 4 },
      { name: "Datadog", level: 5, years: 4 },
      { name: "OpenTelemetry", level: 5, years: 3 },
      { name: "Honeycomb", level: 4, years: 2 },
      { name: "Loki", level: 4, years: 2 },
    ],
  },
  {
    name: "Databases",
    tagline: "Backups that restore, replicas that catch up, indexes that earn rent.",
    skills: [
      { name: "PostgreSQL", level: 5, years: 5 },
      { name: "MySQL", level: 4, years: 4 },
      { name: "Redis", level: 5, years: 4 },
      { name: "Kafka", level: 4, years: 3 },
      { name: "MongoDB", level: 3, years: 2 },
    ],
  },
  {
    name: "Languages",
    tagline: "Pick the right one, write it like you mean it.",
    skills: [
      { name: "Python", level: 5, years: 5 },
      { name: "Go", level: 4, years: 3 },
      { name: "TypeScript", level: 5, years: 4 },
      { name: "Bash", level: 5, years: 5 },
      { name: "Rust", level: 2, years: 1, note: "learning" },
    ],
  },
  {
    name: "Security",
    tagline: "Supply chain hardening, secrets discipline, least privilege by default.",
    skills: [
      { name: "HashiCorp Vault", level: 4, years: 3 },
      { name: "Trivy", level: 4, years: 2 },
      { name: "Cosign", level: 4, years: 2 },
      { name: "OPA / Gatekeeper", level: 3, years: 2 },
      { name: "SLSA", level: 3, years: 1 },
    ],
  },
  {
    name: "Networking",
    tagline: "Cloud networks that look boring on the diagram.",
    skills: [
      { name: "VPC / Subnets", level: 5, years: 5 },
      { name: "Cilium", level: 4, years: 2 },
      { name: "Service Mesh / Istio", level: 3, years: 2 },
      { name: "DNS", level: 5, years: 5 },
    ],
  },
  {
    name: "Data & Streams",
    tagline: "Pipelines for data, with the same discipline as for code.",
    skills: [
      { name: "Kafka", level: 4, years: 3 },
      { name: "Kinesis", level: 4, years: 3 },
      { name: "dbt", level: 3, years: 2 },
      { name: "Airflow", level: 3, years: 2 },
    ],
  },
];

export function allSkillNames(): string[] {
  return skillsMatrix.flatMap((g) => g.skills.map((s) => s.name));
}
