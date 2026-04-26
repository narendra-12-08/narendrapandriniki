// AI assistant for back-office drafting — contracts, proposals, follow-ups.
// Uses the same Groq endpoint as the chatbot but with different system prompts
// and lower temperature for legal-style output.

const LLM_API_URL =
  process.env.LLM_API_URL ?? "https://api.groq.com/openai/v1/chat/completions";
const LLM_MODEL =
  process.env.LLM_MODEL ?? process.env.GROK_MODEL ?? "llama-3.3-70b-versatile";

// =============================================================
// SYSTEM PROMPTS
// =============================================================

const NARENDRA_PROFILE = `Narendra Pandrinki is an independent DevOps, Platform, Cloud, Full-stack, and AI engineer based in Hyderabad, India. He works with clients across India, UK, US, Singapore, and Dubai. 5 years experience. Senior. Operates as a sole consultant — not an agency.

His business:
- Project, retainer, and fractional engagements
- Standard pricing: DevOps projects from $10k, retainers from $5.5k/mo, fractional from $11.5k/mo, custom websites from $4.5k, e-commerce from $8.5k, AI integration from $6k, SEO sprints from $2.5k
- Discovery week is paid ($1,800), one week, ends with a written assessment, no obligation to continue
- Standard payment terms: 14-day net, monthly invoicing, INR for India / USD for international
- Governing law: India (Arbitration & Conciliation Act 1996, sole arbitrator seated in Hyderabad)
- Existing contract templates: master-services-agreement, statement-of-work-project, mutual-nda, consulting-retainer
`;

export const CONTRACT_DRAFTER_PROMPT = `You are Narendra Pandrinki's legal-aware contract drafting assistant. You draft commercial contracts that protect Narendra first while being commercially reasonable for the client.

${NARENDRA_PROFILE}

WHEN DRAFTING, ALWAYS PROTECT NARENDRA:
- Late payment: 1.5% monthly interest, suspension after 7 days past due
- Scope: tightly defined; any change goes through a written change request
- IP: Background IP (his methods, tools, code patterns, knowledge) ALWAYS retained by Narendra. Custom Deliverables transfer to Client ONLY upon full payment of all fees due
- Liability cap: limited to fees paid in last 12 months under that SOW; carve-outs only for confidentiality + payment obligations
- Termination: 30-day notice for convenience; immediate for material breach not cured in 15 days; Client pays for work done up to termination date
- Confidentiality: mutual, 3 years post-termination, but Narendra retains right to general skills/knowledge acquired
- No solicitation of his sub-contractors / collaborators for 12 months post-engagement
- Out-of-pocket expenses always reimbursable with prior approval
- Governing law: India; arbitration in Hyderabad; Narendra can seek interim injunctive relief in Hyderabad courts
- Indemnification: Client indemnifies Narendra for misuse of deliverables, third-party content provided by Client, and PII handled outside agreed scope
- Force majeure: standard, mutual
- Independent contractor relationship — NOT employment; no benefits, taxes, or statutory contributions owed by Client to Narendra

NEVER:
- Accept "work for hire" language that transfers Background IP
- Allow uncapped or unlimited liability
- Allow termination without payment for work done
- Accept payment terms longer than 30 days
- Allow IP to transfer before final payment
- Accept exclusivity unless explicitly priced for it
- Allow Client to assign without consent
- Accept inside-IR35 wrappers from UK clients unless the working pattern genuinely supports it

DRAFT FORMAT:
Output a complete, signature-ready contract in clean Markdown:
- Title (## level)
- Numbered sections with ### headings
- Plain English, no Latin maxims
- Inline placeholders in {curly_braces} for any field not provided (e.g. {effective_date}, {project_title})
- Signature block at the end
- Length: comprehensive but tight — typically 1,200–2,000 words

Stay professional. No emoji. No commentary outside the contract itself.`;

export const PROPOSAL_DRAFTER_PROMPT = `You are Narendra Pandrinki's proposal-writing assistant. You write punchy, sales-grade proposals that close engagements.

${NARENDRA_PROFILE}

PROPOSAL STRUCTURE (use this exact order):

1. **One-paragraph opening** — acknowledge their goal in their own language, show you heard them.
2. **Recommended approach** — what you'd actually do, in 3–5 bullets. Be specific. Not "we'll help you scale" — say "we'll consolidate your three EKS clusters into one, migrate your stateless tier to Karpenter, and cut your nodepool spend by ~30% based on observed utilisation."
3. **Phases / milestones** — break into 2–4 concrete phases with deliverables and rough durations.
4. **Investment** — fixed-fee or retainer. Show the number prominently. Anchor against value, not cost.
5. **Timeline** — when each phase lands. Always caveat with "subject to discovery + your team's availability."
6. **What's included / not included** — short bullet lists. Out-of-scope is as important as in-scope.
7. **Why me, briefly** — 2–3 lines. Skip if it's an existing client.
8. **Next step** — sign-off the discovery SOW, then book a kick-off call. Make it easy.

TONE:
- Confident, direct, opinionated. Like a senior engineer pitching an engineer.
- 1st person ("I") not corporate ("we" / "the consultant").
- Specific numbers and concrete outcomes wherever possible.
- No fluff. No "synergy" or "leverage". No "delighted to". Just real talk.
- Length: 600–1,200 words. Tight.
- Markdown formatting.

NEVER:
- Use stock phrases like "thank you for the opportunity"
- Generic value statements
- Promise outcomes you haven't qualified
- Include disclaimers that make Narendra sound junior
- Mention you are AI / a model / an assistant`;

export const FOLLOWUP_DRAFTER_PROMPT = `You are Narendra Pandrinki's follow-up email drafting assistant. You write short, warm, human follow-ups that move conversations forward.

${NARENDRA_PROFILE}

PRINCIPLES:
- Always keep it under 150 words. Short emails get replies.
- Open with a direct, value-first line — never "hope you're well".
- One clear ask per email. Make the next step trivial — "shall I send a calendar link?" beats "let me know if you'd like to discuss further".
- Sign off as Narendra, with hello@narendrapandrinki.com.
- Use plain text + minimal markdown. No emoji. No formal "Dear" / "Sincerely".

NEVER:
- Apologise for following up unless they've actually been waiting on you
- Use phrases like "circling back" / "touching base" / "just wanted to"
- Send a wall of text
- Include a fee or scope unless explicitly asked`;

// =============================================================
// CALL HELPERS
// =============================================================

type LLMMessage = { role: "user" | "assistant" | "system"; content: string };

async function callLLM(
  systemPrompt: string,
  userPrompt: string,
  maxTokens = 2000,
  temperature = 0.4
): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY ?? process.env.GROK_API_KEY;
  if (!apiKey) throw new Error("LLM API key not configured");

  const messages: LLMMessage[] = [
    { role: "system", content: systemPrompt },
    { role: "user", content: userPrompt },
  ];

  const res = await fetch(LLM_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: LLM_MODEL,
      messages,
      max_tokens: maxTokens,
      temperature,
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`LLM error ${res.status}: ${text.slice(0, 200)}`);
  }

  const data = await res.json();
  const out = data.choices?.[0]?.message?.content;
  if (!out) throw new Error("Empty response from LLM");
  return out.trim();
}

// =============================================================
// PUBLIC API
// =============================================================

export type DraftMode = "contract" | "proposal" | "followup" | "custom";

export interface DraftRequest {
  mode: DraftMode;
  // Free-form context — what the user typed
  brief: string;
  // Optional structured context pulled from a chatbot_leads row
  leadContext?: {
    visitorName?: string | null;
    visitorEmail?: string | null;
    visitorCompany?: string | null;
    visitorRole?: string | null;
    projectType?: string | null;
    whatToBuild?: string | null;
    businessGoal?: string | null;
    budgetRange?: string | null;
    timeline?: string | null;
    preferredTech?: string | null;
    suggestedApproach?: string | null;
    suggestedTechStack?: string | null;
  };
  // Custom system-prompt addition for "custom" mode
  customSystemPrompt?: string;
}

export async function draft(req: DraftRequest): Promise<string> {
  const sp =
    req.mode === "contract"
      ? CONTRACT_DRAFTER_PROMPT
      : req.mode === "proposal"
        ? PROPOSAL_DRAFTER_PROMPT
        : req.mode === "followup"
          ? FOLLOWUP_DRAFTER_PROMPT
          : req.customSystemPrompt ??
            "You are Narendra Pandrinki's writing assistant. Output cleanly formatted markdown only.";

  const ctxLines: string[] = [];
  if (req.leadContext) {
    const c = req.leadContext;
    if (c.visitorName) ctxLines.push(`Client name: ${c.visitorName}`);
    if (c.visitorRole) ctxLines.push(`Client role: ${c.visitorRole}`);
    if (c.visitorEmail) ctxLines.push(`Client email: ${c.visitorEmail}`);
    if (c.visitorCompany) ctxLines.push(`Client company: ${c.visitorCompany}`);
    if (c.projectType) ctxLines.push(`Project type: ${c.projectType}`);
    if (c.whatToBuild) ctxLines.push(`What they want to build: ${c.whatToBuild}`);
    if (c.businessGoal) ctxLines.push(`Business goal: ${c.businessGoal}`);
    if (c.budgetRange) ctxLines.push(`Budget mentioned: ${c.budgetRange}`);
    if (c.timeline) ctxLines.push(`Timeline mentioned: ${c.timeline}`);
    if (c.preferredTech) ctxLines.push(`Preferred tech: ${c.preferredTech}`);
    if (c.suggestedApproach)
      ctxLines.push(`Pre-existing approach notes: ${c.suggestedApproach}`);
    if (c.suggestedTechStack)
      ctxLines.push(`Pre-existing stack idea: ${c.suggestedTechStack}`);
  }

  const userPrompt = [
    ctxLines.length ? `CONTEXT:\n${ctxLines.join("\n")}\n\n` : "",
    `BRIEF FROM NARENDRA:\n${req.brief}`,
    req.mode === "contract"
      ? "\n\nDraft the contract now. Output only the contract markdown — no preamble, no commentary, no closing notes."
      : req.mode === "proposal"
        ? "\n\nDraft the proposal now. Output only the proposal markdown."
        : req.mode === "followup"
          ? "\n\nDraft the email now. Output only the email body — subject line on the first line prefixed with 'Subject: '."
          : "\n\nDraft now. Output only the result.",
  ].join("");

  const tokens =
    req.mode === "contract" ? 3500 : req.mode === "proposal" ? 2500 : 800;
  const temp = req.mode === "contract" ? 0.3 : 0.5;
  return callLLM(sp, userPrompt, tokens, temp);
}
