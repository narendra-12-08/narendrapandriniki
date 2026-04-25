export type Industry = {
  slug: string;
  title: string;
  tagline: string;
  shortDescription: string;
  painPoints: string[];
  howIHelp: string;
  commonStack: string[];
  typicalEngagement: string;
  content: string;
};

export const industries: Industry[] = [
  {
    slug: "fintech",
    title: "Fintech",
    tagline: "Payments, banking, and the regulators behind them",
    shortDescription:
      "Production-grade platforms for fintechs that take latency, audit trails, and PCI scope as seriously as the product team takes the roadmap.",
    painPoints: [
      "PCI-DSS scope creeping into every service because the boundary was never properly drawn",
      "Auditors asking questions the engineering team can't answer in less than a week",
      "Multi-region failover that exists on paper but has never been tested",
      "Deploy windows shrinking as the customer base grows",
      "Cost lines on the bill that nobody can attribute to a product surface",
    ],
    howIHelp:
      "I've spent the bulk of my career inside payments and banking platforms. I know what a PCI scope reduction actually looks like, what a real audit trail covers, and how to keep deploy frequency high while every change touches money. The work is usually a mix of platform hardening, observability that maps to user journeys (checkout, payout, settlement), and the boring discipline that turns audit prep from a quarterly fire drill into a continuous evidence pipeline.",
    commonStack: ["AWS", "EKS", "Terraform", "ArgoCD", "Vault", "Prometheus", "PostgreSQL", "Kafka"],
    typicalEngagement: "10–16 weeks, often followed by a fractional or retainer engagement",
    content: `Fintech is the industry I've worked in longest, and the one where the gap between "it works" and "it works under scrutiny" matters most. A fintech platform isn't judged only by its uptime — it's judged by whether the audit trail holds, whether the failover actually fails over, and whether the engineering team can hand over evidence without a two-week scramble.

The work I do here is rarely about new technology. It's about deliberate boundaries: between PCI-scoped and non-scoped services, between regions, between humans and production. It's about making sure every change that touches money is reviewed, observable, and reversible.

## What I see most often

Fintechs at Series B or C tend to share a profile. The product worked, the team grew, and the platform underneath got built incrementally without a coherent design. Now there are three or four legitimate concerns at once: PCI scope is too broad, the deploy pipeline is too slow because nobody trusts it, observability covers infrastructure metrics but not user journeys, and the cost line is starting to hurt.

Each of these is solvable. The mistake is treating them as separate projects. They're connected. Tightening PCI scope shrinks the blast radius, which makes the deploy pipeline safer to speed up, which lets you deploy observability changes more confidently, which gives you the data to attack cost. Done in the right order, the work compounds.

## What I bring

A working understanding of the regulatory landscape — PCI-DSS, PSD2, SOC 2, the FCA's operational resilience expectations — without being a compliance consultant. I write the technical controls; your compliance team writes the policies; we make sure each one maps to the other.

I've built multi-region active-active topologies for payment platforms, designed audit log pipelines that have survived actual regulatory inspection, and rebuilt deploy pipelines on platforms processing nine figures of GMV without a customer-visible incident.

## What this isn't

I don't write your KYC integration. I don't pick your card processor. I don't have opinions on your fraud model. I make sure the platform underneath is solid enough that those decisions are made on product merit, not on whether the infrastructure can support them.
`,
  },
  {
    slug: "healthtech",
    title: "Healthtech",
    tagline: "Clinical systems where downtime has real consequences",
    shortDescription:
      "HIPAA-aligned cloud foundations and operational discipline for healthtech teams handling PHI, clinical data, and regulated integrations.",
    painPoints: [
      "Customer security reviews demanding evidence the engineering team doesn't have",
      "PHI handling spread across services that were never designed to be in scope",
      "Audit logging that exists but isn't immutable or queryable in practice",
      "Integration patterns with EHRs and labs that don't fit modern deployment models",
      "On-call rotations where a slow response has clinical consequences",
    ],
    howIHelp:
      "I help healthtech teams build cloud foundations that pass enterprise security reviews on first submission and operational discipline that holds up under clinical pressure. The work covers HIPAA technical safeguards mapped to real controls, PHI isolation, audit pipelines that produce defensible evidence, and incident response procedures tuned for systems where customer impact may be a clinician unable to do their job.",
    commonStack: ["AWS", "EKS", "Terraform", "Vault", "CloudTrail", "PostgreSQL", "OpenTelemetry", "External Secrets Operator"],
    typicalEngagement: "8–14 weeks for foundation work; ongoing retainer for operational support",
    content: `Healthtech sits in an awkward category. The regulatory bar is high, the customer expectations are corporate-grade from day one, and the engineering teams are usually small. A seed-stage healthtech with two engineers may need to pass the same security review as a Series-D fintech.

That mismatch is what I help solve. Not by building enterprise complexity into a startup, but by getting the right structural decisions right early so the foundation scales without re-architecture.

## The shape of the work

A typical first engagement covers four areas. First, account structure: a multi-account org with proper isolation between PHI-handling and non-PHI workloads, so scope is a structural fact rather than a per-service argument. Second, data flow: identifying every place PHI enters, transits, or rests, and ensuring encryption, access logging, and retention policies are correct at each. Third, evidence: continuous collection of the technical evidence that any HIPAA, SOC 2, or HITRUST audit will ask for, structured so that the next audit is a query rather than a project. Fourth, operations: an on-call rotation, runbooks, and incident response process tuned to clinical impact.

## Why first-pass security reviews matter

Enterprise customers in healthcare have demanding security teams. A startup that fails the first review and has to come back with remediations has just lost two months on the deal. A startup that passes on first submission gets into the contract phase quickly and demonstrates operational maturity to every subsequent customer.

The difference is rarely about technical sophistication. It's about whether the foundation was designed deliberately or grew organically. A deliberately-designed foundation answers questions like "how do you isolate PHI?" with one paragraph and a diagram, not with a meeting.

## What I won't do

I'm not your HIPAA compliance officer. I write the technical controls and the evidence pipeline; the policies and the formal compliance posture are your responsibility, with appropriate counsel. The line between technical implementation and compliance attestation is real, and crossing it muddies both.
`,
  },
  {
    slug: "ecommerce",
    title: "E-commerce",
    tagline: "Platforms that need to survive Black Friday with their dignity",
    shortDescription:
      "Capacity planning, autoscaling, and operational readiness for e-commerce platforms where peak traffic is a survivable event, not a war room.",
    painPoints: [
      "Annual peak events that turn into 36-hour war rooms with three near-misses",
      "Autoscaling that can't react fast enough to flash sales and viral moments",
      "Cart and checkout latency that climbs under load just when conversion matters most",
      "Cost spikes during peak that the finance team didn't model",
      "Third-party dependencies — payment providers, fulfilment APIs — that fail in correlated ways",
    ],
    howIHelp:
      "I get e-commerce platforms ready for peak by treating peak readiness as continuous, not seasonal. That means representative load testing, autoscaling tuned to your specific traffic shape, burn-rate alerting on the user journeys that drive revenue, and game days run in production well before the campaign starts. The result is peak weekends that feel boring from inside the incident channel.",
    commonStack: ["AWS", "EKS", "Karpenter", "Redis", "PostgreSQL", "Datadog", "k6", "Argo Rollouts"],
    typicalEngagement: "6–12 weeks pre-peak, often retained year-round for ongoing readiness",
    content: `E-commerce platforms have a peculiar reliability profile. Most of the year, traffic is predictable and the system runs comfortably. But the few days that matter most — Black Friday, Cyber Monday, a viral product moment, a celebrity tweet — drive 5x to 20x baseline traffic in patterns the system has never seen.

If you only think about reliability when peak approaches, you've already lost. The teams that handle peak well treat it as a continuous discipline, with peak readiness as a property of the platform rather than a project that runs in October.

## What I focus on

Representative load testing is the foundation. Synthetic RPS doesn't help; you need a load test that drives real user journeys — search, browse, add to cart, checkout — in proportions calibrated against last year's actual traffic. k6 with proper scenario modelling does this well. The load test runs continuously in pre-prod and on demand against prod with appropriate guardrails.

Autoscaling tuned to your specific shape. E-commerce traffic is bursty in ways generic autoscaling settings don't handle. HPA target utilisation, scale-up and scale-down policies, and Karpenter consolidation all need workload-specific tuning. The right numbers are the numbers your traffic shape demands; anything else is a guess.

Burn-rate alerting on the journeys that drive revenue. CPU and memory don't correlate to revenue. A failed checkout does. SLOs and burn-rate alerts on cart, checkout, and payment are the difference between an incident the team responds to in minutes and one that runs for hours because the underlying metric was healthy.

Game days in production. Two weeks before peak, schedule a deliberate spike test against production with marketing's awareness. Find what breaks. Fix it. Repeat one week before peak. The first time you see your production system at 3x normal load should not be on the day customers are watching.

## The cost dimension

Peak readiness sounds expensive — pre-warmed capacity, headroom in every tier — and it can be. The trick is to use spot capacity and aggressive autoscaling for stateless tiers, hold genuine warm capacity only for stateful tiers and the few critical services, and structure your committed-use discounts to reflect baseline plus a peak surcharge. Done well, peak weeks cost less than the same volume spread across the year.
`,
  },
  {
    slug: "b2b-saas",
    title: "B2B SaaS",
    tagline: "Multi-tenant platforms that grow without grinding to a halt",
    shortDescription:
      "Platform foundations, internal developer platforms, and operational maturity for B2B SaaS teams scaling from product-market fit to mid-market.",
    painPoints: [
      "Engineering velocity slowing as the team grows past 40",
      "A wiki nobody reads and a single staff engineer who has become the human service catalog",
      "Service creation that takes days and a different definition of 'production-ready' on every team",
      "Enterprise customer security reviews exposing infrastructure gaps",
      "Multi-tenant noisy-neighbour problems that the architecture didn't account for",
    ],
    howIHelp:
      "I help B2B SaaS teams build the platform layer that lets product engineers stop fighting infrastructure. That means service templates with paved paths, internal portals (often Backstage), self-service infrastructure provisioning, and the DX metrics that show the work is paying off. I also help with the harder cultural shifts — what 'production-ready' means in practice, who owns what, and how the platform team interfaces with product teams without becoming a bottleneck.",
    commonStack: ["GCP or AWS", "GKE/EKS", "Backstage", "Crossplane", "ArgoCD", "GitHub Actions", "OpenTelemetry", "External Secrets Operator"],
    typicalEngagement: "10–16 weeks for foundation work; fractional or retainer for ongoing platform leadership",
    content: `B2B SaaS companies tend to hit their platform inflection point somewhere between Series A and Series C, and somewhere between 20 and 60 engineers. Below that, ad hoc works. Above it, ad hoc costs you a percentage of every engineer's productivity, every week, forever.

The fix is a real platform — but the wrong version of that fix is over-engineering for a scale you're not at yet. The right version is narrow, opinionated, and shipped quickly.

## What I build

A working internal developer platform, usually based on Backstage but tuned for the team's actual workflow rather than configured for theoretical extensibility. A service template per supported language, wired with CI/CD, observability, secrets, and a runbook stub, so a new service goes from idea to deployed staging environment in under an hour. A handful of self-service infrastructure compositions for the resources teams ask for weekly.

DX metrics that mean something. DORA — lead time for change, deploy frequency, MTTR, change failure rate — but actually instrumented from real signals, not fabricated from someone's spreadsheet. Reviewed monthly, with concrete actions on regressions.

## The cultural piece

The technical work is the easy part. The harder work is getting the org to align on what 'production-ready' means, who owns what, and where the line sits between the platform team and product teams.

I've found this works best when the platform team treats itself as a product team with internal customers. Roadmap, backlog, NPS, the works. Product teams are the customers; their satisfaction with the platform is the platform team's metric. This sounds obvious and is rarely how platform teams are run.

## When this fits

Mid-stage B2B SaaS, 20–80 engineers, where infrastructure is starting to slow you down but a dedicated platform team either doesn't exist yet or exists but is firefighting. The first engagement usually delivers the working platform; subsequent engagements, often fractional, help the in-house team grow into operating it.
`,
  },
  {
    slug: "ai-ml-infrastructure",
    title: "AI/ML Infrastructure",
    tagline: "GPU-heavy platforms where utilisation and latency both matter",
    shortDescription:
      "Training and inference infrastructure for ML platform teams, with a focus on GPU utilisation, cost control, and reliable inference at scale.",
    painPoints: [
      "On-demand GPU nodes running 24/7 regardless of queue depth",
      "Training jobs without checkpointing, making spot instances impractical",
      "Inference paths overprovisioned because nobody trusts the autoscaler",
      "Multi-tenant scheduling that gives every team their own cluster instead of sharing",
      "Cost lines that are growing faster than the model performance gains justify",
    ],
    howIHelp:
      "I work with ML platform teams to bring GPU spend under control without slowing research. The lever is usually a combination of workload-aware scheduling (training vs fine-tuning vs inference, each with its own pool), checkpoint-on-eviction so spot becomes safe for training, autoscaler signals tied to in-flight requests rather than CPU, and committed-use discounts sized against the post-tuning baseline rather than the bloated one.",
    commonStack: ["AWS or GCP", "EKS/GKE", "Karpenter", "Kubeflow", "Ray", "Triton", "Prometheus", "S3"],
    typicalEngagement: "8–14 weeks for cost and reliability work; ongoing for multi-tenant scheduling and platform evolution",
    content: `AI/ML infrastructure is a different shape of problem from typical platform work. The unit of compute is expensive, the workload patterns are different from web traffic, and the people running the workloads are research engineers, not product engineers. The platform that suits them looks different.

## What I help with

GPU utilisation profiling. The first job is always to find out what the GPUs are actually doing. Most environments I look at have at least one major workload running below 30% utilisation, often because the autoscaler can't tell the difference between a queued job and an active one. Profile, identify, fix.

Workload-class separation. Training, fine-tuning, and inference have different tolerance for disruption, different latency requirements, and different cost-performance trade-offs. They should not share node pools. A reasonable split: training on spot with checkpointing, fine-tuning on a mix, inference on on-demand with conservative scaling.

Checkpoint-on-eviction. The thing that makes spot impractical for training is the assumption that interruption costs you the entire run. With checkpoint-on-eviction wired into the training framework and tested by deliberately killing nodes, spot becomes safe for runs of any length. The savings are typically 60–70% on training compute.

Inference autoscaling on the right signal. CPU is the wrong signal for GPU inference. In-flight request count plus GPU memory headroom is the right one. Once you switch, scale-up is faster, scale-down is more conservative, and TTFT improves.

Multi-tenant scheduling. The pattern of giving every research team their own cluster doesn't scale. Real multi-tenancy — quota, fair-share scheduling, priority classes, and clear policies on what happens when capacity is constrained — is harder but unlocks utilisation that single-tenant cannot.

## What I won't do

I'm not your ML engineer. I don't tune your model, pick your framework, or have opinions on your training run beyond what the infrastructure can support. The handoff between ML and platform is at the resource boundary; the platform makes the resources available efficiently and reliably, and what runs on them is your team's call.
`,
  },
  {
    slug: "marketplaces",
    title: "Marketplaces",
    tagline: "Two-sided platforms where reliability is the product",
    shortDescription:
      "Multi-region resilience, real-time event pipelines, and operational maturity for marketplaces where downtime breaks both sides of the network.",
    painPoints: [
      "'Multi-region' that's a passive copy nobody has ever cut over to",
      "Event pipelines where lag spikes during peaks become customer-visible",
      "Database write contention that limits throughput at exactly the wrong times",
      "Region-correlated failures because every dependency lives in the same place",
      "Enterprise customer contracts blocked on disaster recovery commitments the team can't credibly back",
    ],
    howIHelp:
      "I help marketplace platforms build genuine multi-region resilience — not a passive copy in another region but a tested failover with measured RTO and RPO. The work covers logical replication for the data tier, idempotency-by-default at the request layer, health-checked DNS failover, and the discipline of running quarterly game days that prove the capability is real.",
    commonStack: ["AWS", "EKS", "PostgreSQL", "Kafka", "Route 53", "Terraform", "ArgoCD", "Datadog"],
    typicalEngagement: "12–20 weeks for multi-region work; ongoing retainer for game days and operational maturity",
    content: `Marketplaces have the kind of reliability profile where every minute of downtime costs money on both sides of the network. A trade that doesn't execute, a delivery that doesn't dispatch, a match that doesn't happen — these aren't degraded experiences, they're lost transactions.

That makes resilience the product, not a feature of the product. And resilience that hasn't been tested is not resilience.

## The work I do

Truthful current-state assessment. Most multi-region setups I encounter have been described to leadership as more capable than they actually are. The first artefact I produce is a one-page document describing what the platform really does today — what the actual RTO and RPO would be in a real failover, when the procedure was last rehearsed, and what's known to be broken. This is uncomfortable and necessary.

Logical replication for the data tier. For Postgres, pglogical with monitored lag and alerts on drift. The replication is tested by running a cutover in a lower environment, then in prod with synthetic traffic, then with a small percentage of real traffic, then full.

Idempotency by default. The application has to be designed so that a retried request produces the same outcome. Idempotency keys on writes, deduplication on event pipelines, explicit conflict policies for the few cases where conflict is possible. This is the work the application engineers do, supported by infrastructure that makes it easy.

Health-checked failover. Route 53 with appropriate TTLs, partner CDN coordination, and rehearsed propagation timing. The team should know how long DNS propagation takes in their actual deployment, not in theory.

Game days. Quarterly, increasing in severity over time, with proper postmortems for each. The team that runs game days routinely treats failover as boring. The team that doesn't will discover, during a real outage, that their procedure has bit-rotted.

## What this unlocks

Beyond the technical capability, the unlock is commercial. Enterprise customers ask hard questions about disaster recovery during procurement. A marketplace that can answer with a one-page summary, recent game-day reports, and measured RTO/RPO figures wins those contracts. One that can't, doesn't.
`,
  },
  {
    slug: "media-streaming",
    title: "Media & Streaming",
    tagline: "High-throughput delivery where every millisecond shows up",
    shortDescription:
      "CDN strategy, origin scaling, and observability for media platforms where buffering is churn and peaks are predictable but unforgiving.",
    painPoints: [
      "Origin servers that can't keep up with cache miss storms during launches",
      "CDN configurations that haven't been reviewed since the platform launched",
      "Bitrate-ladder and encoding pipelines bottlenecking during content drops",
      "Observability stuck at infrastructure level when the experience metric is buffering ratio",
      "Cost lines on egress and transcoding that aren't tied to viewing data",
    ],
    howIHelp:
      "I work with media platforms on the parts of the stack where throughput, latency, and cost intersect. CDN strategy and cache hierarchy, origin design that survives miss storms, encoding pipeline orchestration, and observability tied to the experience metrics that actually matter — startup time, buffering ratio, bitrate distribution. The work is usually about removing the small inefficiencies that compound at scale.",
    commonStack: ["AWS or GCP", "EKS", "CloudFront/Cloud CDN", "S3/GCS", "Kafka", "Prometheus", "Grafana", "OpenTelemetry"],
    typicalEngagement: "8–14 weeks for stack review and rebuilds; retained for major launches and platform evolution",
    content: `Media and streaming platforms are operationally distinct from most other workloads. Throughput is high, latency budgets are short, and the cost of getting it wrong shows up as churn, not as an incident page. The work I do here is about getting the cache hierarchy right, the origin design resilient, and the observability tied to the metrics that map to viewer experience.

## Where the wins are

Cache hierarchy. Most platforms have a CDN configuration that was set up at launch and has not been reviewed since. Cache key design, TTL strategy, vary-header handling, and shielding configuration all compound; small improvements at each layer multiply into significant cost and performance changes.

Origin resilience. A cache miss storm — when a popular asset expires from cache and a wave of requests hits the origin simultaneously — is the failure mode origin servers see most. Request collapsing, stale-while-revalidate, and origin shielding all help; structuring the cache strategy so that miss storms don't happen in the first place is even better.

Encoding pipeline orchestration. Transcoding is expensive and embarrassingly parallel. Done well, it scales gracefully on spot capacity with checkpointing. Done poorly, it bottlenecks on launch days and costs more than it should during quiet periods.

Experience-tied observability. The metric that matters is not 99th-percentile origin latency. It's startup time, rebuffering ratio, and bitrate distribution as the viewer experiences them. Tying SLOs to these and instrumenting from the player rather than the server changes what the on-call team responds to.

## What I bring

A working understanding of the streaming stack, an opinion about which CDN to use for which workload (the answer is usually not "the one we already have a contract with"), and the operational discipline to run high-stakes launches without burning out the team. The work is rarely about new technology — it's about deliberate use of well-understood building blocks.
`,
  },
  {
    slug: "edtech",
    title: "EdTech",
    tagline: "Platforms that have to work when the school day starts",
    shortDescription:
      "Reliability, scale, and cost discipline for EdTech platforms where peak load is predictable, brief, and absolutely unforgiving.",
    painPoints: [
      "9am traffic spikes that put more load on the system in five minutes than the previous twelve hours combined",
      "Cost lines that grow linearly with users when they could grow sub-linearly",
      "Multi-tenant data isolation that's correct in theory and questionable in practice",
      "Integration patterns with school IT systems that don't fit modern deployment models",
      "Compliance requirements (FERPA, COPPA, GDPR-K) that aren't fully mapped to technical controls",
    ],
    howIHelp:
      "EdTech has a specific reliability profile: predictable but extreme peaks, multi-tenant isolation that has to actually hold, and compliance requirements that vary by region. I help teams design for the peak rather than the average, get tenant isolation structurally correct, and build the cost discipline that makes per-user economics work as the platform scales.",
    commonStack: ["AWS or GCP", "EKS/GKE", "PostgreSQL", "Redis", "Karpenter", "ArgoCD", "Prometheus", "Grafana"],
    typicalEngagement: "8–14 weeks for foundation and peak readiness; ongoing for evolution",
    content: `EdTech is a deceptively hard reliability problem. Average load looks comfortable. Peak load — the first ten minutes after a school day starts, simultaneously across an entire timezone — can be ten times the average, and the platform has to handle it without warmup, without graceful degradation that affects learning, and without surprising the finance team with the bill.

## What I focus on

Designing for the peak. Capacity sizing, autoscaling, and pre-warming all have to be tuned to the peak, not the average. That sounds expensive; it doesn't have to be. With aggressive autoscaling on stateless tiers, pre-warmed capacity only on the stateful tier, and Karpenter or equivalent making node provisioning fast, the cost difference between "ready for peak" and "ready for average" can be modest.

Multi-tenant isolation that actually holds. The most common failure I see is data isolation that's enforced at the application layer with no defence in depth at the data layer. A bug in the application layer becomes a privacy incident. Row-level security, tenant-scoped service accounts, and tested isolation boundaries make the data layer enforce what the application is supposed to.

Cost discipline that scales sub-linearly. Per-user cost should fall as the platform grows, not stay flat. The levers are workload consolidation, multi-tenancy in stateful services where appropriate, and structural use of committed-use discounts. EdTech platforms with healthy unit economics get this right early; ones that don't tend to discover the problem when growth requires raising prices.

Compliance mapping. FERPA, COPPA, GDPR-K, and a patchwork of regional requirements have technical implications that need to be mapped to specific controls. The work is similar to fintech or healthtech — continuous evidence collection rather than per-audit scrambling.

## Where this fits

Mid-stage EdTech, post-product-market-fit, where the next phase of growth requires the platform to be operationally mature in ways the founding team didn't have to think about. The work is usually less about new technology than about getting the right boundaries in place before scale makes them harder to retrofit.
`,
  },
];

export function getIndustry(slug: string) {
  return industries.find((i) => i.slug === slug);
}
