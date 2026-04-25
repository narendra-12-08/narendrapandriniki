export type PricingTier = {
  slug: string;
  name: string;
  tagline: string;
  priceLabel: string;
  priceNote: string;
  description: string;
  idealFor: string;
  includes: string[];
  notIncluded?: string[];
  cta: string;
  category: "devops" | "web" | "growth";
};

export const pricingTiers: PricingTier[] = [
  // === DevOps / Platform engagements ===
  {
    slug: "project",
    name: "DevOps Project",
    tagline: "Fixed scope, fixed fee, defined outcome",
    priceLabel: "From $10,000",
    priceNote:
      "Discovery week from $1,800. Project fees scoped after discovery. INR rates available for India clients.",
    description:
      "A defined piece of platform / DevOps work with a clear start, end, and deliverable. Platform rebuilds, multi-region foundations, peak readiness programmes, internal developer platform builds. Fixed-fee with milestones, agreed scope, and a 30-day post-engagement support window.",
    idealFor:
      "Teams with a specific outcome in mind and a timeline of four to sixteen weeks. Often the right fit when something has to happen by a date — an audit, an enterprise customer launch, a peak season, a fundraise milestone.",
    includes: [
      "Paid discovery week with written assessment and proposed scope",
      "Fixed-fee delivery against agreed milestones",
      "Pairing and code review with the in-house team throughout",
      "Validation phase: game day, load test, or restore drill as appropriate",
      "Knowledge transfer and runbook handover",
      "30 days of post-engagement support for questions and corrections",
    ],
    notIncluded: [
      "On-call coverage (available as an add-on or via retainer)",
      "Indefinite scope creep — substantial changes go through a written change request",
      "Product application code or feature work",
    ],
    cta: "Discuss a project",
    category: "devops",
  },
  {
    slug: "retainer",
    name: "Platform Retainer",
    tagline: "Ongoing platform support, predictable monthly cost",
    priceLabel: "From $5,500 / month",
    priceNote: "Two to four days of senior platform engineering per month, billed monthly.",
    description:
      "Senior platform capacity available to your team on an ongoing basis. Architecture review, on-call backup, incident response, hiring panel support, and the day-to-day calls a strong senior would make.",
    idealFor:
      "Engineering teams of 8–60 people with a working but evolving platform, where having a senior platform engineer available a few days a month materially reduces decision risk and on-call load.",
    includes: [
      "Two to four days of senior platform engineering per month",
      "Slack channel access for architecture and operational questions",
      "Backup tier on the on-call rotation",
      "Quarterly platform health review and roadmap input",
      "Hiring panel and technical interview support",
      "Incident response and postmortem support for significant incidents",
    ],
    cta: "Start a retainer conversation",
    category: "devops",
  },
  {
    slug: "fractional",
    name: "Fractional Platform Lead",
    tagline: "Embedded senior platform engineer, 1–3 days per week",
    priceLabel: "From $11,500 / month",
    priceNote: "Pricing scales with days per week. Three to twelve month engagements.",
    description:
      "Embedded part-time as your senior platform engineer or fractional Head of Platform. Architecture, on-call coverage, hiring partner, and the senior voice in the room when infrastructure decisions are being made.",
    idealFor:
      "Companies of 10–60 engineers, post product-market-fit, where infrastructure has become a real constraint and full-time senior platform hiring is in flight or six-plus months out.",
    includes: [
      "One to three days per week embedded with your engineering team",
      "Architecture ownership and quarterly platform roadmap",
      "Active participation in on-call rotation",
      "Hiring partner: JD writing, screening, technical interviews, panel chairing",
      "Knowledge transfer baked into every working session",
      "Clean handover when the full-time hire lands",
    ],
    notIncluded: [
      "Full-time hours or sole responsibility for production at all times",
      "Product application code or feature work",
    ],
    cta: "Discuss a fractional engagement",
    category: "devops",
  },

  // === Custom websites & apps ===
  {
    slug: "website-build",
    name: "Custom Website Build",
    tagline: "Modern, fast, owned by you",
    priceLabel: "From $4,500",
    priceNote: "Fixed-fee. 3 to 6 weeks. Hosted on Vercel, Cloudflare, or AWS.",
    description:
      "A custom-built website on a modern stack — Next.js, Tailwind, hosted on a CDN with proper caching. Designed around your brand, your conversion path, and your content needs. You own the code, the domain, and the deployment. No proprietary CMS lock-in.",
    idealFor:
      "Founders, consultancies, agencies, and growing businesses that have outgrown templated builders and need a fast, branded, SEO-ready site that an engineering team can extend.",
    includes: [
      "Custom design or theme implementation",
      "Up to 12 content pages with reusable components",
      "Lighthouse 95+ performance, accessibility, and SEO scores",
      "Headless CMS option (Sanity, Contentlayer, or markdown-in-repo)",
      "Contact form + transactional email wired up",
      "Analytics (GA4, Plausible, or Vercel Analytics) configured",
      "30 days of post-launch support",
    ],
    notIncluded: [
      "Ongoing content updates (separate retainer)",
      "Custom illustrations or photography",
      "E-commerce checkout (see E-commerce tier)",
    ],
    cta: "Get a website quote",
    category: "web",
  },
  {
    slug: "website-with-crm",
    name: "Website + CRM Integration",
    tagline: "Capture, qualify, and route every lead",
    priceLabel: "From $7,500",
    priceNote:
      "Fixed-fee. 4 to 7 weeks. Includes site build + CRM and pipeline integration.",
    description:
      "A custom website wired into your CRM — HubSpot, Pipedrive, Salesforce, Attio, or a custom Postgres CRM. Every form submission tagged, scored, and routed; every lead synced bidirectionally. Includes Slack/email alerts, attribution, and a clean handover so your sales team starts with structured data, not a tangle of webhooks.",
    idealFor:
      "B2B services and SaaS companies where every inbound lead matters and the cost of a dropped form submission is real revenue.",
    includes: [
      "Everything in Custom Website Build",
      "CRM integration (HubSpot, Pipedrive, Salesforce, Attio, or custom)",
      "Lead scoring and routing rules",
      "Slack and email alerts on key events",
      "UTM and source attribution baked in",
      "Webhook receiver with idempotency and retry logic",
      "Documented field mappings and sync flows",
    ],
    cta: "Discuss CRM integration",
    category: "web",
  },
  {
    slug: "ecommerce-build",
    name: "E-commerce Platform",
    tagline: "Stripe-powered, custom, fast",
    priceLabel: "From $8,500",
    priceNote: "Fixed-fee. 5 to 8 weeks. Stripe Checkout or custom cart.",
    description:
      "A custom e-commerce site built on Next.js with Stripe handling payments, subscriptions, and tax. Inventory, orders, and customers in your own database — not locked into Shopify or a SaaS template. Webhooks, refunds, customer portal, all properly wired.",
    idealFor:
      "Brands and DTC businesses that have outgrown Shopify or want full control over the buying experience, and businesses selling subscriptions, digital products, or services that need flexible billing.",
    includes: [
      "Custom storefront with product catalogue and cart",
      "Stripe Checkout, Subscriptions, and Tax",
      "Order management and customer portal",
      "Webhook handlers with idempotency",
      "Refund and dispute flows",
      "Email receipts and transactional notifications",
      "Admin dashboard for orders, customers, products",
    ],
    cta: "Quote an e-commerce build",
    category: "web",
  },

  // === Growth / SEO / AI integration ===
  {
    slug: "seo-sprint",
    name: "Technical SEO Sprint",
    tagline: "Rankings, structured data, Core Web Vitals",
    priceLabel: "From $2,500",
    priceNote: "Fixed-fee. 2 weeks. Audit + remediation + ongoing monitoring setup.",
    description:
      "A focused two-week sprint to fix the technical SEO foundations of an existing site: site speed, Core Web Vitals, structured data, sitemap, robots, canonicals, internal linking, and Search Console hygiene. Comes with a written baseline report and a 90-day improvement plan.",
    idealFor:
      "Sites that rank below their content quality, e-commerce stores losing organic traffic to faster competitors, and content businesses that have never had a proper technical SEO pass.",
    includes: [
      "Full technical SEO audit with prioritised findings",
      "Core Web Vitals remediation (LCP, INP, CLS)",
      "Structured data (JSON-LD) for relevant entities",
      "Sitemap, robots.txt, and canonical hygiene",
      "Internal linking audit and recommendations",
      "Search Console + Bing Webmaster verification and dashboards",
      "Written baseline report and 90-day plan",
    ],
    cta: "Book an SEO sprint",
    category: "growth",
  },
  {
    slug: "ai-integration",
    name: "AI Integration",
    tagline: "RAG, agents, and AI features that actually work",
    priceLabel: "From $6,000",
    priceNote:
      "Fixed-fee. 3 to 6 weeks. OpenAI, Anthropic, or open-source models on your stack.",
    description:
      "Production AI features for your product or internal tools — customer support copilots, document RAG, contract analysis, AI-assisted onboarding, internal agents that automate real work. Built with proper evals, fallback strategies, observability, and cost guardrails. Not a 'we plugged in ChatGPT' demo.",
    idealFor:
      "SaaS companies adding AI features, services businesses building internal agents, and founders who want a working AI feature shipped — not a hackathon prototype.",
    includes: [
      "Use-case shaping and eval design before any code",
      "Model selection (OpenAI, Anthropic, Gemini, or open-source)",
      "RAG pipeline with vector store, ingestion, and refresh strategy",
      "Streaming responses, retries, and graceful degradation",
      "Cost dashboards and per-tenant attribution",
      "Eval harness and regression suite",
      "Production deployment and monitoring",
    ],
    cta: "Scope an AI feature",
    category: "growth",
  },
  {
    slug: "maintenance-retainer",
    name: "Website Maintenance Retainer",
    tagline: "Updates, fixes, content, peace of mind",
    priceLabel: "From $800 / month",
    priceNote:
      "Monthly retainer. Includes 4–8 hours of work, depending on tier. Cancel anytime.",
    description:
      "Ongoing care for your website or web app — security patches, dependency updates, content edits, small features, performance monitoring, uptime checks, and a real human responding within one business day. The boring discipline that keeps a site fast, secure, and compliant.",
    idealFor:
      "Businesses with a website they rely on for leads or revenue but no in-house engineer to keep it healthy.",
    includes: [
      "4–8 hours of engineering work per month (tier-dependent)",
      "Dependency and security patch management",
      "Uptime and performance monitoring",
      "Small content and design updates",
      "Quarterly performance and SEO health review",
      "1-business-day response on issues",
    ],
    cta: "Start a maintenance retainer",
    category: "growth",
  },
];

export function getTier(slug: string) {
  return pricingTiers.find((t) => t.slug === slug);
}

export function getTiersByCategory(category: PricingTier["category"]) {
  return pricingTiers.filter((t) => t.category === category);
}
