export const caseStudies = [
  {
    slug: "cloud-migration-fintech",
    title: "Cloud Migration & Infrastructure Modernisation",
    client: "Financial services platform",
    summary:
      "Migrated a legacy on-premise infrastructure to AWS, implementing IaC, CI/CD pipelines, and proper security baselines.",
    tags: ["AWS", "Terraform", "CI/CD", "Security"],
    outcome: "60% reduction in infrastructure costs, zero-downtime migration",
    content: `
A financial services platform had been running on owned hardware for over seven years. Growth had made the on-premise approach increasingly expensive and operationally brittle — a single hardware failure had caused a 14-hour outage the previous year.

## The challenge

- Legacy infrastructure with no Infrastructure as Code
- Mixed production and staging workloads on the same hardware
- No CI/CD; deployments done manually by a single engineer
- Limited monitoring with no alerting on critical services
- Security posture with minimal documentation

## What was built

**AWS architecture** — Production environment on AWS across two availability zones with proper network segmentation: public subnets for load balancers, private subnets for application workloads and databases, isolated database subnet groups.

**Infrastructure as Code** — Full Terraform codebase covering all infrastructure resources, with separate state management per environment and a module structure designed for the team's ongoing use.

**CI/CD pipelines** — GitHub Actions workflows for all applications: lint, test, build, push to ECR, deploy to ECS. Staging auto-deploys on merge to main. Production deploys gated on approval.

**Monitoring stack** — CloudWatch dashboards, structured log aggregation, and alerting configured to page the on-call engineer on the things that actually matter.

**Security hardening** — IAM roles with least-privilege policies, secrets in AWS Secrets Manager, encryption at rest and in transit, security group audit and cleanup.

## Outcome

Migration was completed in phases over 12 weeks with zero unplanned downtime. Monthly infrastructure cost decreased by approximately 60% compared to the previous data centre contract. Deployment frequency increased from weekly to multiple times daily. The team could onboard new engineers without a week of tribal knowledge transfer.
    `,
  },
  {
    slug: "internal-ops-platform-agency",
    title: "Internal Operations Platform",
    client: "Digital agency with 40-person team",
    summary:
      "Built a centralised operations platform replacing a fragmented combination of spreadsheets, Notion, and disconnected SaaS tools.",
    tags: ["Internal Tools", "React", "PostgreSQL", "Automation"],
    outcome:
      "Reduced project setup time from 3 hours to 15 minutes, eliminated weekly manual reporting",
    content: `
A digital agency had grown to 40 people and was running their operations across a fragmented mix of tools: client records in one CRM, project tracking in Notion, time tracking in another tool, invoicing in a third, and weekly status reports assembled manually from all of them every Friday afternoon.

## The challenge

The problem wasn't that any single tool was bad — it was that they didn't connect. Project managers spent significant time every week moving data between systems. New projects took hours to set up properly across all tools. Leadership had no single view of utilisation, pipeline, or financials without asking someone to compile it.

## What was built

**Centralised data model** — A PostgreSQL database designed around the agency's actual operations: clients, projects, engagements, team members, time entries, and invoices as first-class entities with proper relationships.

**Operations dashboard** — A React admin interface with views for:
- Active project status across all accounts
- Team utilisation and capacity
- Financial pipeline and invoice status
- Client-level revenue and project history

**Automated project setup** — A project creation workflow that, given a client and project type, automatically creates the folder structure, sets up the project record, assigns default team roles, creates the initial invoice schedule, and sends the client a kickoff confirmation.

**Weekly reporting automation** — Scheduled jobs that compile operational metrics and distribute formatted reports to department heads and leadership — without anyone having to produce them.

**Bidirectional integrations** — Sync with the existing time tracking and accounting tools so data flows automatically rather than being re-entered.

## Outcome

New project setup time decreased from three hours to under 15 minutes. Friday afternoon manual reporting was eliminated entirely. Leadership gained a live operational view that previously required a 30-minute reporting meeting to approximate.
    `,
  },
  {
    slug: "kubernetes-platform-scaleup",
    title: "Kubernetes Platform Engineering",
    client: "B2B SaaS scale-up",
    summary:
      "Designed and built a Kubernetes-based internal platform enabling self-service deployments and environment provisioning for 20 engineers.",
    tags: ["Kubernetes", "Platform Engineering", "Helm", "GitOps"],
    outcome:
      "Deployment lead time from days to minutes, self-service environments eliminated toil",
    content: `
A B2B SaaS company had grown to 20 engineers and was starting to show the friction of a small team's ad-hoc deployment process applied to a larger organisation. Deployments were manual, environments were inconsistent, and the two senior engineers who understood the infrastructure had become a bottleneck.

## The challenge

- Deployments required one of two specific engineers and typically took 45–90 minutes
- Staging environments were provisioned manually and often drifted from production configuration
- No standardised approach to secrets, logging, or health checks across services
- New engineers took weeks to understand how to deploy their changes
- No ability to create preview environments for feature branches

## What was built

**Kubernetes cluster design** — Production and staging EKS clusters with node groups sized for workload requirements, Cluster Autoscaler configured, and proper network policies between namespaces.

**GitOps with ArgoCD** — Declarative GitOps workflow where application state is defined in Git and ArgoCD ensures clusters converge to that state. Deployments become pull requests, not manual operations.

**Helm chart library** — Opinionated Helm charts for the company's application types (API services, workers, scheduled jobs) encoding all the standards: resource limits, health checks, security contexts, log format, metrics exposition.

**Self-service environment provisioning** — Engineers can create preview environments for their branches through a simple workflow. Environments are automatically cleaned up after 48 hours or on merge.

**Developer golden path** — Documented standards and scaffolding tools for creating new services that work with the platform from day one, without requiring platform team involvement.

**Monitoring and alerting** — Prometheus, Grafana, and AlertManager configured with sensible defaults and service-level dashboards that teams can extend.

## Outcome

Deployment lead time went from a 45–90 minute manual process requiring specific engineers to a sub-5-minute automated pipeline any engineer could trigger. Preview environments meant QA and design review could happen before code merged to main. The two senior engineers reclaimed approximately 8 hours per week previously spent on deployment coordination.
    `,
  },
  {
    slug: "reporting-platform-ecommerce",
    title: "Reporting & Analytics Platform",
    client: "Multi-brand e-commerce operator",
    summary:
      "Built a consolidated reporting system pulling data from Shopify, Google Ads, Facebook Ads, and internal databases into a unified analytics platform.",
    tags: ["Data Engineering", "Reporting", "PostgreSQL", "React"],
    outcome:
      "Daily reporting time eliminated, decision-making latency reduced from days to hours",
    content: `
A multi-brand e-commerce operator was running three Shopify stores, Google Ads and Facebook Ads campaigns across all brands, and a wholesale business on a separate system. Every week, the marketing team spent a day assembling a performance report by exporting from each platform, reformatting, and combining in Excel.

## The challenge

The manual process meant:
- Reporting was always 1–2 days old by the time it was usable
- Definitions varied between brands (what counts as a conversion?)
- Ad spend wasn't consistently connected to revenue outcomes
- The marketing team spent time on reporting instead of optimisation
- Leadership couldn't see cross-brand performance without asking for a specific report

## What was built

**Data pipeline** — Scheduled ETL jobs pulling data from the Shopify API, Google Ads API, Facebook Marketing API, and the internal wholesale database into a normalised PostgreSQL data warehouse.

**Unified schema** — A consistent data model across all brands: orders, customers, ad spend, and conversion events defined consistently so cross-brand comparisons are valid.

**Metrics layer** — Calculated metrics (ROAS, CAC, LTV, contribution margin) defined once in the data layer and available consistently across all reporting views.

**Analytics dashboard** — A React dashboard with:
- Daily/weekly/monthly performance across all brands
- Ad spend vs. revenue with contribution margin breakdown
- Customer acquisition and LTV cohort views
- Configurable date ranges and brand filters

**Automated reporting** — Weekly brand performance summaries generated and distributed to brand managers Monday morning. Monthly board pack generated and distributed automatically.

## Outcome

The weekly manual reporting day was eliminated. Marketing decisions that previously waited for reports were made on live data. The team identified a significant underperformance in one brand's paid social channels within the first week of using the platform — something that had been invisible in the manual reporting.
    `,
  },
  {
    slug: "ci-cd-pipeline-rebuild",
    title: "CI/CD Pipeline Overhaul",
    client: "Enterprise software consultancy",
    summary:
      "Rebuilt a fragile, slow CI/CD pipeline into a fast, reliable delivery system supporting multiple teams and environments.",
    tags: ["CI/CD", "GitHub Actions", "Docker", "Testing"],
    outcome: "Build time from 45 minutes to 8 minutes, failure rate dropped 80%",
    content: `
A software consultancy had accumulated technical debt in their delivery pipeline. The CI build took 45 minutes, failed unpredictably due to flaky tests and environment inconsistencies, and was rarely modified because everyone was afraid to break it further.

## The challenge

- 45-minute CI builds blocking development feedback loops
- Flaky test suite causing frequent false failures requiring manual re-runs
- Docker images rebuilt from scratch on every run with no layer caching
- No separation between fast feedback checks and slow integration tests
- Environment configuration inconsistencies causing "works on CI but not locally" problems
- No parallelisation — everything ran sequentially

## What was built

**Build analysis** — Profiled the existing build to understand where time was being spent. Identified that 60% of build time was in Docker image construction and 20% was in avoidable sequential test execution.

**Restructured GitHub Actions workflows** — Separated the pipeline into stages with appropriate parallelisation:
- Fast checks (lint, type-check, unit tests) running in parallel within seconds
- Build stage with proper caching
- Integration tests in parallel matrix
- Environment-specific deployment stages

**Docker build optimisation** — Proper layer ordering for cache efficiency, BuildKit with registry-based cache mounts, and multi-stage builds to reduce final image sizes.

**Test stability** — Identified and fixed the 15 flaky tests responsible for 80% of false CI failures. Introduced test isolation patterns to prevent the environmental issues that caused most of them.

**Local/CI consistency** — Docker Compose configuration for local development that uses the same images and environment variables as CI, eliminating the "works locally" problem.

**Deployment automation** — Automated deployment to staging on merge to main, with production deployment requiring a manual approval gate.

## Outcome

Build time reduced from 45 minutes to 8 minutes. CI failure rate dropped by approximately 80%, with the remaining failures being genuine test failures rather than environmental noise. Development teams could iterate significantly faster. The pipeline could now be modified confidently because it was understood and documented.
    `,
  },
  {
    slug: "invoice-workflow-automation",
    title: "Invoice & Client Management Automation",
    client: "Professional services firm",
    summary:
      "Automated the full invoicing lifecycle from project completion to payment reconciliation, replacing a manual process prone to delays and errors.",
    tags: ["Automation", "Workflow", "Integrations", "Finance"],
    outcome:
      "Invoice-to-payment cycle reduced from 45 days average to 28 days, zero manual data entry",
    content: `
A professional services firm was losing money on slow invoice cycles and spending too much time on manual financial administration. Invoices were created manually, sent at inconsistent times, followed up by email when not paid, and reconciled against bank statements by hand.

## The challenge

- Invoices created manually from scratch for each engagement, prone to errors
- No systematic follow-up on overdue invoices — relied on individuals to chase
- Payment matching done by hand, reconciling bank statements with invoice records
- No visibility into outstanding receivables without manually reviewing every invoice
- Finance team spending significant time on administration that added no value

## What was built

**Invoice generation** — Template-based invoice generation from project records. When a project milestone is marked complete, an invoice is generated automatically with the correct client details, line items, amounts, and due date.

**Automated distribution** — Invoices sent to clients automatically with branded PDF attachments. Delivery confirmed, and records updated.

**Automated payment reminders** — Scheduled reminders sent at configurable intervals before due date, on due date if unpaid, and at 7/14/30 days overdue. Reminders stop when payment is confirmed.

**Payment reconciliation** — Integration with the firm's bank feed to automatically match incoming payments to outstanding invoices, update status, and notify the account manager.

**Receivables dashboard** — Live view of all outstanding invoices by status, client, and age. Overdue items surfaced prominently with last-contact date.

**Reporting** — Monthly cash flow reports and revenue-by-client summaries generated automatically.

## Outcome

Average invoice-to-payment cycle reduced from 45 days to 28 days — a direct improvement in cash flow. Finance administration time reduced significantly. Zero manual data entry in the invoicing process. Overdue invoice follow-up went from an inconsistent manual process to a reliable automated system.
    `,
  },
];

export function getCaseStudy(slug: string) {
  return caseStudies.find((c) => c.slug === slug);
}
