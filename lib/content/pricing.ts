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
};

export const pricingTiers: PricingTier[] = [
  {
    slug: "project",
    name: "Project",
    tagline: "Fixed scope, fixed fee, defined outcome",
    priceLabel: "From £8,000",
    priceNote: "Discovery week from £1,500. Project fees scoped after discovery.",
    description:
      "A defined piece of work with a clear start, end, and deliverable. Platform rebuilds, multi-region foundations, peak readiness programmes, internal developer platform builds. Fixed-fee with milestones, agreed scope, and a 30-day post-engagement support window.",
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
  },
  {
    slug: "retainer",
    name: "Retainer",
    tagline: "Ongoing platform support, predictable monthly cost",
    priceLabel: "From £4,500 / month",
    priceNote: "Two to four days of senior platform engineering per month, billed monthly.",
    description:
      "Senior platform capacity available to your team on an ongoing basis. Architecture review, on-call backup, incident response, hiring panel support, and the day-to-day calls a strong senior would make. Suited to teams with a working platform that need senior backup rather than a build-out.",
    idealFor:
      "Engineering teams of 8–60 people with a working but evolving platform, where having a senior platform engineer available a few days a month materially reduces decision risk and on-call load.",
    includes: [
      "Two to four days of senior platform engineering per month",
      "Slack channel access for architecture and operational questions",
      "Backup tier on the on-call rotation",
      "Quarterly platform health review and roadmap input",
      "Hiring panel and technical interview support when you're recruiting",
      "Incident response and postmortem support for significant incidents",
    ],
    cta: "Start a retainer conversation",
  },
  {
    slug: "fractional",
    name: "Fractional",
    tagline: "Embedded senior platform engineer, 1–3 days per week",
    priceLabel: "From £9,500 / month",
    priceNote: "Pricing scales with days per week. Three to twelve month engagements.",
    description:
      "Embedded part-time as your senior platform engineer or fractional Head of Platform. Architecture, on-call coverage, hiring partner, and the senior voice in the room when infrastructure decisions are being made. The right fit for the gap between needing senior platform leadership and being ready to hire a full-time one.",
    idealFor:
      "Companies of 10–60 engineers, post product-market-fit, where infrastructure has become a real constraint and full-time senior platform hiring is in flight or six-plus months out.",
    includes: [
      "One to three days per week embedded with your engineering team",
      "Architecture ownership and quarterly platform roadmap",
      "Active participation in on-call rotation",
      "Hiring partner: JD writing, screening, technical interviews, panel chairing",
      "Knowledge transfer baked into every working session, not deferred to handover",
      "Clean handover when the full-time hire lands",
    ],
    notIncluded: [
      "Full-time hours or sole responsibility for production at all times",
      "Product application code or feature work",
    ],
    cta: "Discuss a fractional engagement",
  },
];

export function getTier(slug: string) {
  return pricingTiers.find((t) => t.slug === slug);
}
