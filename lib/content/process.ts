export type ProcessStep = {
  number: number;
  title: string;
  duration: string;
  description: string;
  deliverables: string[];
};

export const process: ProcessStep[] = [
  {
    number: 1,
    title: "Discovery",
    duration: "1–2 weeks",
    description:
      "Before recommending anything, I spend time inside the system. Reading code, shadowing on-call, reviewing the bill, listening to where engineers complain. The output is a single-page assessment that names the few things that actually matter, separated from the many that don't.",
    deliverables: [
      "Current-state assessment covering platform, CI/CD, observability, and operations",
      "Prioritised list of risks and opportunities with effort estimates",
      "One-page summary for leadership and a longer technical write-up for engineering",
      "Agreed scope and success metrics for the engagement",
    ],
  },
  {
    number: 2,
    title: "Architecture",
    duration: "1–3 weeks",
    description:
      "Working sessions with engineering to design the target state. Decisions get written down with the reasoning behind them — not because documents are fashionable, but because the next person who has to make a decision in the same area needs the context.",
    deliverables: [
      "Architecture decisions documented with trade-offs explicit",
      "Migration or implementation plan broken into reversible waves",
      "Sequencing agreed with engineering, product, and finance where relevant",
      "Risk register with mitigations for each wave",
    ],
  },
  {
    number: 3,
    title: "Implementation",
    duration: "4–12 weeks",
    description:
      "The bulk of the work. Code, configuration, and infrastructure delivered in small reversible increments, each one leaving the system better off. I work alongside the in-house team rather than in parallel — pairing, code review, and knowledge transfer happen continuously, not at handover.",
    deliverables: [
      "Production changes shipped in waves, each independently rolled back if needed",
      "Infrastructure as code, reviewed and merged through the team's normal process",
      "Runbooks written by me and reviewed by the team that will use them",
      "Weekly progress notes against the original assessment",
    ],
  },
  {
    number: 4,
    title: "Validation",
    duration: "1–2 weeks",
    description:
      "Anything I deliver gets exercised before I declare it done. Failover game days, load tests, restore drills, security scans — proof that the thing works under realistic conditions, not just in the absence of stress.",
    deliverables: [
      "Game day or chaos exercise with documented outcomes",
      "Performance and load test results against agreed targets",
      "Backup and restore drill, executed end-to-end",
      "Pre-production review of all changes against the original success metrics",
    ],
  },
  {
    number: 5,
    title: "Handover",
    duration: "1–2 weeks",
    description:
      "Knowledge transfer that actually transfers knowledge. The in-house team operates everything I built before I leave — with me available to back them up, not the other way around. The engagement ends with a 30-day support window and a clear roadmap for what comes next.",
    deliverables: [
      "Documentation reviewed and signed off by the team",
      "Two operational reviews with the in-house team running everything",
      "30-day post-engagement support window for questions and corrections",
      "Recommended next steps and roadmap for the following two quarters",
    ],
  },
];
