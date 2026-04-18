export const solutions = [
  {
    slug: "admin-dashboards",
    title: "Admin Dashboards",
    shortDescription:
      "Custom operational dashboards for managing your business without fighting generic SaaS tools.",
    content: `
Admin dashboards are the control rooms of modern businesses. When they're built well, your team can see exactly what's happening, take action directly, and move fast. When they're built badly — or they're just a wrapped spreadsheet or a configuration-heavy SaaS tool — they become the thing everyone works around.

I build admin dashboards designed around your actual operations: the data you need, the actions you take, the workflows your team follows. Not a templated UI that sort-of-fits.

## What's typically included

**Data visibility** — Revenue, pipeline, orders, clients, tasks. Whatever drives your operations, surfaced clearly with the right filters and the right level of granularity.

**Action interfaces** — CRUD interfaces for the records your team manages. Clients, orders, content, configuration. Designed for how your team actually works.

**Role-based access** — Different people see and do different things. Sales sees pipeline. Finance sees invoices. Ops sees tasks. Admins see everything.

**Notification and alert systems** — The right people get notified when something needs attention, without the noise of constant pings about things that don't matter.

**Integration hooks** — Connects to your existing systems: CRM, billing, database, third-party APIs.
    `,
  },
  {
    slug: "client-portals",
    title: "Client Portals",
    shortDescription:
      "Secure, branded portals where your clients access project updates, reports, files, and approvals.",
    content: `
Your clients shouldn't need to chase you for updates, dig through email threads for files, or wait for a status call to know where their project stands.

Client portals give them a direct view of what they need — and give you control over exactly what they see and when.

## What's typically included

**Project status views** — Real-time or scheduled views of project progress, milestones, and upcoming deliverables.

**Document and file access** — Secure file uploads, downloads, and version management. Reports, contracts, deliverables — all accessible without emailing attachments.

**Approval workflows** — Clients can review and sign off on work items, proposals, or deliverables directly in the portal, with a full audit trail.

**Secure messaging** — In-portal communication threads that keep context attached to the right project, instead of spreading across email and Slack.

**Branded experience** — Your domain, your brand, your design. Not a third-party portal with someone else's logo.
    `,
  },
  {
    slug: "internal-operations-platforms",
    title: "Internal Operations Platforms",
    shortDescription:
      "Centralised operations systems that replace fragmented tools and give your team one place to work.",
    content: `
Most teams reach a point where their operations are running across too many tools: tasks in one place, client records in another, projects somewhere else, and communication fragmented across email and Slack. Coordination becomes the job.

Internal operations platforms solve this by building a system designed around your specific workflows — not by adding another generic tool.

## What's typically included

**Unified task and workflow management** — Task assignment, status tracking, and handoff workflows built around your actual process, not a template.

**Client and project management** — CRM-adjacent functionality built for how your team manages engagements, not how a generic CRM vendor thinks you should.

**Document and knowledge management** — Standard operating procedures, runbooks, templates, and knowledge bases attached to the right contexts.

**Reporting and operational visibility** — Dashboards that show leadership what's happening across the business without requiring manual reporting.

**Automation and integrations** — Connections to the tools you can't replace, so data flows between systems rather than being manually maintained.
    `,
  },
  {
    slug: "workflow-systems",
    title: "Workflow Automation Systems",
    shortDescription:
      "End-to-end automation systems that eliminate manual, repetitive work across your operations.",
    content: `
Most operational workflows contain manual steps that exist purely because the systems involved don't talk to each other. Data copied from one system to another. Status updates triggered by email. Approvals requested and tracked in spreadsheets.

Workflow automation systems replace these with reliable, audited, automatic processes.

## What's typically included

**Process mapping** — Working with your team to identify where time is being spent on manual work and prioritising the automation opportunities with the highest return.

**System integrations** — Connecting the tools your business runs on so data flows automatically: CRM, billing, project management, communication tools, databases.

**Trigger-based workflows** — Events in one system automatically trigger actions in others. A deal closes: create the project, send the onboarding email, notify the team.

**Document automation** — Contracts, invoices, reports, and briefs generated from templates and data, distributed automatically, and stored correctly.

**Monitoring and alerting** — Automated workflows still need oversight. Failure alerts, audit logs, and monitoring dashboards ensure you know when something breaks.
    `,
  },
  {
    slug: "reporting-platforms",
    title: "Reporting & KPI Platforms",
    shortDescription:
      "Business intelligence infrastructure that turns your operational data into clear, reliable reporting.",
    content: `
Business decisions made on unclear or incomplete data are one of the most expensive problems companies face — and one of the most fixable. The data usually exists; it just isn't visible in a usable form.

Reporting and KPI platforms consolidate data from across your operations and make it accessible to decision-makers without requiring an analyst to produce every report.

## What's typically included

**Data consolidation** — Pulling data from multiple sources — your database, your CRM, your billing system — into a unified view with consistent definitions.

**KPI dashboards** — The metrics that actually matter to your business, tracked consistently, with trend data and period comparisons. Boards and leadership teams get visibility without waiting.

**Scheduled reports** — Weekly operational summaries, monthly financial reports, client-facing performance reports — generated and distributed automatically.

**Custom analytics** — Cohort analysis, funnel reporting, revenue attribution, utilisation — built around the specific business questions you need to answer.

**Self-service tooling** — Where appropriate, giving teams the ability to build their own queries and views on top of the consolidated data without requiring engineering support.
    `,
  },
  {
    slug: "cloud-standardisation",
    title: "Cloud Environment Standardisation",
    shortDescription:
      "Bring order to sprawling cloud environments with infrastructure standards, security baselines, and cost governance.",
    content: `
Cloud environments that grew organically tend to accumulate technical debt in a particular way: inconsistent naming, undocumented resources, security groups with holes that nobody noticed, costs that keep climbing without clear explanation.

Cloud standardisation projects bring this under control systematically.

## What's typically included

**Environment audit** — Full inventory of existing resources, security posture assessment, cost analysis, and identification of technical debt and risk.

**Infrastructure as Code migration** — Bringing existing manually-provisioned resources under Terraform or Pulumi management so they're reproducible, auditable, and version-controlled.

**Security baseline** — IAM policies following least privilege, encryption at rest and in transit, network segmentation, secrets management, and compliance foundations.

**Cost governance** — Tagging standards, budget alerts, rightsizing analysis, and elimination of unused resources. FinOps visibility from day one.

**Standards and runbooks** — Documentation of how your cloud environment is structured, how new resources should be provisioned, and how incidents should be handled. The tribal knowledge written down.

**Monitoring and observability** — Centralised logging, metrics collection, and alerting configured for your environment, with dashboards for operational visibility.
    `,
  },
];

export function getSolution(slug: string) {
  return solutions.find((s) => s.slug === slug);
}
