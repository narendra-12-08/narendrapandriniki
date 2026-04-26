export type FAQ = {
  id: string;
  category: "engagement" | "technical" | "pricing" | "general";
  question: string;
  answer: string;
};

export const faqs: FAQ[] = [
  {
    id: "1",
    category: "engagement",
    question: "What's the difference between a project, retainer, and fractional engagement?",
    answer:
      "A project is fixed-scope work with a defined start and end — usually four to sixteen weeks — delivering a specific outcome like a platform rebuild, multi-region foundation, or peak readiness programme. A retainer is ongoing capacity, typically two to four days a month, for teams that need a senior platform voice on call without a full-time hire. Fractional is one to three days a week embedded in your engineering team for a defined period — usually three to twelve months — covering the gap between needing senior platform leadership and being ready to hire it full-time.",
  },
  {
    id: "2",
    category: "engagement",
    question: "How do you decide which engagement model fits?",
    answer:
      "On a 30-minute call. If you have a specific outcome in mind and a clear timeline, it's a project. If you have a working platform and need a senior person to back up your team and make calls a few days a month, it's a retainer. If you don't have a senior platform engineer in the team and aren't ready to hire one, it's fractional. Most engagements start as one and evolve into another — projects often turn into retainers; fractional engagements often end with me helping hire the full-time replacement.",
  },
  {
    id: "3",
    category: "engagement",
    question: "Are you available immediately?",
    answer:
      "Sometimes. I usually have one or two slots opening per quarter. Get in touch with what you're trying to do and your timeline and I'll be honest about whether I can start when you need me to. If I can't, I'll often know someone good who can.",
  },
  {
    id: "4",
    category: "engagement",
    question: "Will you sign an NDA?",
    answer:
      "Yes, before any detailed conversation about your platform or business. I keep my own NDA template that's mutual and reasonable, or I'll sign yours if it's not unusually one-sided. Confidentiality continues indefinitely after the engagement ends.",
  },
  {
    id: "5",
    category: "engagement",
    question: "Do you work with my team or in parallel to them?",
    answer:
      "With them. Pairing, code review, and knowledge transfer happen continuously, not at handover. The goal is that your team can operate everything I deliver before I leave, which doesn't happen if I'm working in isolation.",
  },
  {
    id: "6",
    category: "pricing",
    question: "How is pricing structured?",
    answer:
      "Project work is usually fixed-fee with milestones, scoped after a paid discovery week. Retainers are a flat monthly fee for a defined number of days. Fractional engagements are billed monthly based on the agreed days per week. All fees are quoted in USD for international clients and INR for India clients, exclusive of taxes, and invoiced monthly with 14-day terms.",
  },
  {
    id: "7",
    category: "pricing",
    question: "Why fixed-fee and not time-and-materials?",
    answer:
      "Time-and-materials creates a misaligned incentive — the consultant who takes longer earns more. Fixed-fee aligns me with delivering the outcome efficiently. The trade-off is that scope has to be clearly defined up front, which is what the discovery week is for. If scope changes substantially during the engagement, we agree a change in writing.",
  },
  {
    id: "8",
    category: "pricing",
    question: "Do you offer discovery without commitment?",
    answer:
      "The first 30-minute call is free. If we both want to go further, the next step is a paid discovery week — usually one to two thousand pounds — that produces the assessment document and a proposed scope. You're under no obligation to continue after the discovery week, and the assessment is yours either way.",
  },
  {
    id: "9",
    category: "technical",
    question: "What kind of work do you not do?",
    answer:
      "I don't write product code as part of an engagement. I don't pick your CRM, your fraud model, or your ML model. I don't do generic software development. I work on the platform, infrastructure, and operations layers — everything from the application boundary down. If your problem is in the application layer, I'm not the right person.",
  },
  {
    id: "10",
    category: "technical",
    question: "What's your stance on cloud preference?",
    answer:
      "I work primarily on AWS, regularly on GCP, and occasionally on Azure. I pick the cloud that fits the customer's existing footprint and team capability, not the one I prefer. I won't recommend a cloud migration unless the migration is justified by something stronger than 'it's where I'd build greenfield.'",
  },
  {
    id: "11",
    category: "technical",
    question: "Can you cover on-call during an engagement?",
    answer:
      "Yes, on retainer or fractional engagements. I'll join the rotation as a backup tier or, for smaller teams, as a primary on a defined schedule. I don't do 24/7 coverage as the primary on my own — that's not a healthy model for either side. Project engagements don't include on-call by default but can if it makes sense for the work.",
  },
  {
    id: "12",
    category: "general",
    question: "Where are you based and where do you work?",
    answer:
      "Based in India, working with teams globally. Most of my work is remote, with occasional on-site sessions when they meaningfully help — usually for discovery weeks, game days, or significant launches. I overlap comfortably with India, UK, EU, Singapore, Dubai, and US East Coast working hours; for teams further west, we agree a sustainable schedule rather than pretending timezone doesn't matter.",
  },
  {
    id: "13",
    category: "general",
    question: "Do you take on multiple clients at once?",
    answer:
      "Yes, but with limits. I run at most one full-time-equivalent of work across all clients combined. That usually looks like one project plus one retainer, or two fractional engagements, or one project. The limit exists because doing this work well requires sustained attention, and overcommitting is the fastest way to do it badly.",
  },
  {
    id: "14",
    category: "general",
    question: "Will you sign a competitor restriction?",
    answer:
      "Reasonable, narrowly-scoped non-competes for the duration of the engagement, yes. Industry-wide bans extending after the engagement, no — that's incompatible with how I work. If your concern is about a specific competitor or a specific piece of strategic information, let's talk about that directly rather than via a blanket clause.",
  },
];

export function getFAQ(id: string) {
  return faqs.find((f) => f.id === id);
}
