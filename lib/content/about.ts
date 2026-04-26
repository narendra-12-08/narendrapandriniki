export const bio = `I'm Narendra Pandrinki, an independent DevOps, platform, and SRE engineer based in India. I've spent the last five years building and operating production platforms for teams that take reliability, audit trails, and engineering velocity seriously — most of that time inside fintech and payments, with the rest spread across B2B SaaS, healthtech, e-commerce, AI/ML infrastructure, and marketplaces.

I started in fintech because that's where the gap between "it works" and "it works under scrutiny" is widest. Payments platforms taught me that reliability is a property of the whole system — the deploy pipeline, the audit log, the on-call rotation, the cost line — and that fixing reliability one component at a time rarely works. The lessons travelled well. The work I do now in healthtech, marketplaces, and AI/ML infra uses the same instincts: deliberate boundaries, tested failovers, observability tied to user journeys, and the unglamorous discipline that turns audits and peak events from fire drills into routine.

I went independent because I prefer the shape of the work. A focused engagement with a team that needs senior platform leadership for a defined period beats most full-time roles, for me and for the customer. I take on a small number of engagements at any one time so the attention is real, and I work alongside in-house teams rather than in parallel to them — pairing, code review, and knowledge transfer happen continuously, not at handover. I work with engineering teams across India, the UK, the US, Singapore, and Dubai, in any timezone that keeps a sensible four-hour overlap.`;

export const principles: { title: string; description: string }[] = [
  {
    title: "Boring is a feature",
    description:
      "The best platforms are the ones nobody talks about. I pick well-understood building blocks, configure them deliberately, and resist the urge to add tools that don't earn their keep. Boring scales; novelty has hidden costs.",
  },
  {
    title: "Production discipline over prototypes",
    description:
      "Anyone can stand something up. The work that matters is what comes after — backups that restore, alerts that fire, runbooks that work at 3am. I optimise for the system that runs reliably for years, not the one that demos well in week three.",
  },
  {
    title: "Write the truth down first",
    description:
      "Every engagement starts with a one-page document describing what the platform actually is today, not what people have been telling leadership. That document is uncomfortable and load-bearing. Without it, every decision afterwards is built on optimism.",
  },
  {
    title: "Reversible changes, in waves",
    description:
      "Big-bang migrations and weekend cutovers fail in correlated ways. Wave-based delivery — small, reversible increments, each one leaving the system measurably better — succeeds in ways that compound. The wave plan is rarely the most ambitious-looking option in the room. It's the one that ships.",
  },
  {
    title: "Knowledge transfer is part of the work",
    description:
      "An engagement that ends with the in-house team unable to operate the system is a failed engagement, regardless of what got delivered. Pairing, code review, and runbook authoring happen alongside the work, not after it. The goal is for me to be replaceable from week one.",
  },
];

export const timeline: { year: string; title: string; description: string }[] = [
  {
    year: "2021",
    title: "First DevOps role at a payments company",
    description:
      "Started my career as a junior DevOps engineer at a payments platform. First exposure to production systems where every change touches money — and to the audit trail discipline that came with it. AWS, Terraform, and the unfashionable parts of reliability engineering.",
  },
  {
    year: "2022",
    title: "Platform team at a Series-B fintech",
    description:
      "Joined a faster-growing fintech and led the rebuild of their CI/CD pipeline and observability stack. Cut mainline build time by 60%, replaced threshold alerts with burn-rate SLOs, and turned the on-call rotation from a noise generator into a working tool.",
  },
  {
    year: "2023",
    title: "Senior DevOps engineer; multi-region work",
    description:
      "Stepped into a senior role and led the multi-region foundation for a payments platform — logical replication, idempotency at the request layer, tested failover with real game days. First time I owned an architecture from design through operational maturity.",
  },
  {
    year: "2024",
    title: "Cross-industry SRE and platform consulting",
    description:
      "Started taking on engagements outside fintech — B2B SaaS, healthtech, e-commerce. The patterns travelled: deliberate boundaries, tested failovers, observability tied to user journeys. Began the transition toward independent work.",
  },
  {
    year: "2025",
    title: "Went independent",
    description:
      "Left full-time employment to work as an independent DevOps and platform engineer. Project, retainer, and fractional engagements across fintech, healthtech, AI/ML infrastructure, and marketplaces. Started taking work from clients in India, the UK, the US, Singapore, and Dubai.",
  },
  {
    year: "2026",
    title: "Where I am now",
    description:
      "Running a small portfolio of engagements with deliberate limits on simultaneous work. Investing in writing — the blog is the part of the practice I take most seriously — and in the boring infrastructure of a sustainable independent practice. Open to the right next engagement.",
  },
];

export const availability = `I take on a small number of engagements at any one time, with a hard cap of one full-time-equivalent across all clients. New project slots usually open at the start of each quarter; retainer and fractional capacity opens less predictably. I work in any timezone with a four-hour overlap to my India (IST) working day — that comfortably covers India, UK, EU, Singapore, Dubai, and US East Coast for the bulk of the day; US West Coast and Australia work with explicit async expectations. If you're considering an engagement that needs to start within the next 30 days, get in touch directly and I'll be honest about whether I can fit it in.`;
