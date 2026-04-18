export const services = [
  {
    slug: "cloud-devops",
    title: "Cloud & DevOps Engineering",
    shortDescription:
      "AWS, GCP, and Azure infrastructure built properly — resilient, cost-efficient, and production-ready.",
    description:
      "Cloud infrastructure that actually scales. I design, build and manage cloud environments that keep your systems running reliably without burning budget unnecessarily.",
    icon: "cloud",
    benefits: [
      "Resilient multi-region AWS and GCP infrastructure",
      "Cost optimisation and right-sizing",
      "Infrastructure as Code with Terraform and Pulumi",
      "Monitoring, alerting, and incident response runbooks",
      "Security hardening and compliance foundations",
    ],
    content: `
Cloud infrastructure is the foundation every serious business runs on — but most teams inherit environments that grew organically, cost too much, and break at the worst moments.

I build cloud environments that are designed deliberately: right-sized for workloads, properly monitored, secured by default, and easy for your team to operate.

## What I deliver

**Infrastructure as Code** — Every resource defined, versioned, and reproducible. No more snowflake servers or undocumented configurations. Terraform or Pulumi depending on your context.

**AWS & GCP production environments** — VPC networking, ECS/EKS workloads, RDS, S3, CloudFront, IAM policies that follow least-privilege principles, and security group hygiene that doesn't leave doors open.

**Cost engineering** — Analysing current spend, rightsizing instances, moving workloads to spot/preemptible where safe, and building FinOps visibility so you know where every pound is going.

**Monitoring and observability** — CloudWatch, Datadog, or Grafana stacks configured to alert on what matters and stay quiet about what doesn't. On-call runbooks that actually help.

## Typical engagements

- Cloud environment design and build for a new product launch
- Migration from legacy hosting to AWS or GCP
- Infrastructure audit and remediation for existing environments
- Ongoing managed infrastructure and monthly operations retainer
    `,
  },
  {
    slug: "platform-engineering",
    title: "Platform Engineering",
    shortDescription:
      "Internal platforms that give your engineering teams self-service capabilities and kill repetitive toil.",
    description:
      "Developer platforms and internal tooling that eliminate the friction between writing code and getting it to production safely.",
    icon: "layers",
    benefits: [
      "Self-service deployment and environment provisioning",
      "Standardised internal developer platforms",
      "Backstage and portal implementations",
      "Golden paths for common engineering workflows",
      "Reduced on-call and operations burden",
    ],
    content: `
Most engineering teams are slowed down by the same problems: waiting for environments, inconsistent deployments, tribal knowledge about how things actually work, and runbooks that are already out of date.

Platform engineering addresses these structurally. I build internal platforms that give your developers self-service access to what they need, with guardrails that keep things safe.

## What I deliver

**Internal developer platforms** — Backstage implementations, service catalogues, and self-service workflows. Your developers shouldn't have to file tickets to get a new database or deploy to staging.

**Golden paths** — Opinionated, well-maintained templates for new services that encode your organisation's standards: CI/CD, observability, security scanning, documentation. Teams build on the path rather than reinventing it.

**Environment management** — Preview environments on demand, staging environments that mirror production, and teardown automation that doesn't leave £500/month of idle resources running.

**Operations tooling** — Custom internal tools, dashboards, and automation that reduce toil for your platform and operations teams.

## Who this is for

Platform engineering work suits teams of 5–50 engineers who've outgrown ad-hoc processes but haven't yet built dedicated platform capability. I can act as a founding platform engineer or augment an existing team.
    `,
  },
  {
    slug: "backend-systems",
    title: "Backend Systems & APIs",
    shortDescription:
      "Reliable backend services, data pipelines, and APIs built for production workloads.",
    description:
      "Backend systems engineered to handle real workloads — from REST and GraphQL APIs to event-driven pipelines and data processing systems.",
    icon: "server",
    benefits: [
      "Production-grade REST and GraphQL APIs",
      "Event-driven architectures with queues and streams",
      "Database design and query optimisation",
      "Background job and worker systems",
      "Webhooks, integrations, and third-party API wrappers",
    ],
    content: `
Backend systems are where business logic lives — and where shortcuts compound into expensive problems. I build backend services that handle real-world load, fail gracefully, and can be extended without surgery.

## What I build

**APIs** — REST and GraphQL APIs with proper authentication, rate limiting, error handling, and versioning. OpenAPI documented, tested, and ready for client consumption.

**Data pipelines** — ETL systems, event processing, and data transformation workflows. From simple scheduled jobs to complex multi-stage processing pipelines.

**Async systems** — Queue-based architectures using SQS, RabbitMQ, or Kafka for workloads that shouldn't block HTTP responses. Worker pools, retry logic, dead-letter handling.

**Database engineering** — Schema design that doesn't fight you six months later. PostgreSQL, MySQL, and managed database services, with attention to indexing, query performance, and migration safety.

## Technology

I work with Node.js, Python, Go, and TypeScript for backend work, and I'm comfortable integrating with whatever your existing stack uses. I build to production standards: logging, metrics, health checks, graceful shutdown.
    `,
  },
  {
    slug: "internal-tools",
    title: "Internal Tools & Admin Platforms",
    shortDescription:
      "Custom internal applications that replace broken spreadsheets and free your team to do real work.",
    description:
      "Purpose-built internal tools, admin dashboards, and operational platforms that fit how your business actually works — not how a generic SaaS thinks it should.",
    icon: "tool",
    benefits: [
      "Custom admin dashboards and CRM-adjacent tools",
      "Operations management systems",
      "Client portals and reporting interfaces",
      "Role-based access and permission systems",
      "Integration with your existing data sources and tools",
    ],
    content: `
Generic SaaS tools are built for the median business. If your operations are more specific than that — and most real businesses are — you end up with expensive workarounds, duplicate data entry, and staff ignoring the tools you paid for.

I build internal tools that fit your actual workflows, connect to your actual data, and make your team faster rather than slower.

## What I build

**Admin dashboards** — Operational views of your business data. Revenue, orders, customers, tasks, whatever your team needs to see to do their jobs without switching between five systems.

**Client-facing portals** — Secure, branded interfaces where clients can view project status, download reports, sign off on work, or access their data.

**Operations management systems** — Workflow tools built around your specific process. Approval flows, task assignment, status tracking, notification systems.

**Data management UIs** — Internal CRUD interfaces for managing content, configuration, or business records that don't warrant a full CMS but are too complex for a spreadsheet.

## How I approach these projects

Internal tools projects usually start with understanding how work actually flows through your team. I resist adding complexity early, ship something useful fast, and then extend based on real feedback from actual users.
    `,
  },
  {
    slug: "workflow-automation",
    title: "Workflow Automation",
    shortDescription:
      "Eliminate manual, repetitive work. Connect your systems and automate the processes that cost your team hours every week.",
    description:
      "End-to-end workflow automation — connecting systems, automating decisions, and eliminating the manual work that drains your team's time and attention.",
    icon: "zap",
    benefits: [
      "Process analysis and automation opportunity mapping",
      "API integrations between disconnected systems",
      "Automated reporting and notification workflows",
      "Document generation and distribution automation",
      "Data synchronisation across business tools",
    ],
    content: `
Every business has manual work that shouldn't be manual. Data entered in one system, copied to another. Reports assembled from exports, formatted, and emailed every Friday. Status updates pulled from three places and pasted into a fourth.

Workflow automation turns these into systems that run without human intervention.

## What I automate

**Cross-system integrations** — Connecting your CRM, billing system, project management tool, and communication platforms so data flows automatically instead of being copied by hand.

**Automated reporting** — Scheduled reports assembled from live data and distributed to the right people in the right format. No more Friday afternoon CSV wrangling.

**Approval and notification workflows** — Trigger-based actions when things happen in your systems. A new client signs up: create the project folder, send the welcome email, notify the account manager, log it in the CRM.

**Document automation** — Contract generation, invoice creation, report assembly — structured documents generated from templates and data, signed and filed automatically.

## Technology

I work with n8n, Zapier, Make, custom Python/Node.js scripts, and direct API integrations depending on what gives you the best combination of control, reliability, and maintainability.
    `,
  },
  {
    slug: "reporting-dashboards",
    title: "Reporting & Operations Dashboards",
    shortDescription:
      "Business intelligence and reporting systems that give you visibility across your operations without needing a data team.",
    description:
      "Operational dashboards, KPI reporting systems, and business intelligence tools that turn raw data into decisions.",
    icon: "bar-chart",
    benefits: [
      "Real-time operational dashboards",
      "KPI tracking and reporting systems",
      "Custom BI implementations",
      "Scheduled report generation and distribution",
      "Data warehouse and pipeline foundations",
    ],
    content: `
Most businesses are running on data they can't see clearly. Operational data locked in systems with poor reporting, financial data that requires a finance team to extract, and performance metrics that take a week to assemble.

Good reporting infrastructure changes this. Decisions made on real data, faster, with confidence.

## What I build

**Operational dashboards** — Live views of what's happening in your business. Orders, revenue, utilisation, pipeline — visualised for the people who need to act on it.

**KPI systems** — Defined metrics tracked consistently over time, with trend views and threshold alerting. Boards get a clear picture without waiting for the finance team to compile reports.

**Reporting pipelines** — Data from multiple sources consolidated, cleaned, and made available for reporting. Whether you're using Metabase, Looker, or a custom front-end, the data foundation needs to be solid.

**Scheduled distribution** — Weekly operational summaries, monthly board packs, client-facing performance reports — generated and distributed automatically.

## Who uses this

This work suits businesses that have accumulated operational data in various systems but lack the visibility to use it well. I bring enough data engineering knowledge to build the pipelines, and enough product thinking to build interfaces people actually open.
    `,
  },
];

export function getService(slug: string) {
  return services.find((s) => s.slug === slug);
}
