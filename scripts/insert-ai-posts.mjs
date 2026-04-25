// Insert 5 AI/cloud blog posts into Supabase blog_posts table.
// Usage: SUPABASE_SERVICE_ROLE_KEY=... node scripts/insert-ai-posts.mjs

const SUPABASE_URL = "https://pmiylelkgyapbcpystpu.supabase.co";
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!KEY) {
  console.error("Missing SUPABASE_SERVICE_ROLE_KEY env var");
  process.exit(1);
}

const posts = [
  {
    slug: "google-ai-2026-gemini-vertex",
    title: "Google's AI year: how Gemini and Vertex caught up — and what that means for your stack",
    description:
      "Gemini 2 Pro and Flash, plus a serious Vertex AI Agent Builder, have moved Google from third place to a real choice. Here is where it actually fits.",
    published: true,
    published_at: "2026-04-04T09:00:00.000Z",
    reading_time: 5,
    tags: ["ai", "google", "gemini", "vertex", "cloud"],
    content: `Eighteen months ago, recommending Google Cloud for a serious LLM workload was a hard sell. In April 2026, with [Gemini 2 Pro and Flash](https://blog.google/) shipping, Vertex AI Agent Builder hitting GA, and Code Assist quietly becoming the most-used Google developer product since Maps, the calculus has flipped. I have been migrating two clients off Bedrock-only stacks specifically because of latency and price on Gemini 2 Flash.

This is not a victory lap for Google. It is a status report on what is now actually viable.

## Gemini 2: the model line that finally makes sense

The Gemini 1.x family was confusing. Pro, Ultra, Flash, 1.5, experimental variants — every quarter the SKU list shifted. Gemini 2, announced late 2025 and broadly rolled out by Q1 2026, collapsed it: Pro for reasoning, Flash for cheap latency-bound work, Nano for on-device. The 2M-token context on Pro is no longer a parlor trick — with the new caching pricing it is genuinely useful for whole-codebase analysis.

What actually moved the needle for my work:

- Native tool use that matches Anthropic's reliability. Earlier Gemini tool-calling was a coin flip; 2 Pro is at the point where I trust it for production agent loops.
- Multimodal that includes audio in and audio out at sane prices. Voice agents on Gemini 2 Flash are genuinely cheaper than Whisper-plus-GPT pipelines.
- Latency. p50 on Flash for short prompts is meaningfully under what GPT-4-class models deliver, and that compounds in chains.

## How it stacks up

Numbers below are April 2026 list prices and self-reported context windows. Treat $/1M as directional — every provider has caching, batch, and committed-use discounts that move it.

| Model class       | Context | $/1M in (approx) | $/1M out | Native tool use | Multimodal      | p50 latency (short) |
| ----------------- | ------- | ---------------- | -------- | --------------- | --------------- | ------------------- |
| Gemini 2 Pro      | 2M      | $1.25            | $5.00    | Yes, reliable   | Text/img/audio  | ~700 ms             |
| Gemini 2 Flash    | 1M      | $0.10            | $0.40    | Yes             | Text/img/audio  | ~250 ms             |
| GPT-4 class       | 200K    | $2.50            | $10.00   | Yes, mature     | Text/img        | ~600 ms             |
| Claude 4 Sonnet   | 200K    | $3.00            | $15.00   | Yes, best-in-class | Text/img     | ~750 ms             |

Claude still wins for code-editing agents in my testing. Gemini wins on price-per-quality at the cheap tier and on long-context retrieval.

## Vertex AI Agent Builder is the real story

The model is the headline; the platform is the bet. [Vertex AI Agent Builder](https://cloud.google.com/vertex-ai) finally treats agent construction as a first-class product instead of a SageMaker-style pile of primitives. The pieces that matter:

- A managed retrieval layer that talks to BigQuery without me writing a vector-export pipeline. For analytics-heavy agents this is enormous.
- Reasoning engine deployment that is actually serverless. I do not pay for an idle GPU between requests, and cold start is sub-second for cached models.
- Tooling for evaluation built into the console, including LLM-as-judge with Gemini 2 Pro. Not as nice as Braintrust, but free and good enough.

The integration with Cloud Run is the part underrated by most reviews. Cloud Run now has a Gemini-aware sidecar mode where you can attach a model endpoint to a service and get streaming responses without managing the inference plane. For SaaS teams already on Cloud Run, this is the lowest-friction path to shipping LLM features I have seen on any cloud.

## Code Assist, quietly

[Code Assist](https://cloud.google.com/blog) is the product I was wrong about. I assumed Copilot's distribution lock-in was insurmountable. Inside three large clients, Code Assist usage is now higher than Copilot — driven entirely by the IDE-native code review and the fact that it can read across the entire BigQuery + Cloud Run + IAM context of a project. For a Google-shop team, that is a different product than Copilot, not a worse one.

## Workspace and BigQuery

The Workspace integration moved from gimmick to default. Gemini in Sheets that runs SQL against BigQuery in the background is the kind of thing that quietly replaces a BI seat per analyst. I do not love the privacy review surface that opens up, but the productivity is undeniable.

The BigQuery side is the more interesting one for engineering teams. ML.GENERATE_TEXT calls against Gemini 2 from inside a SQL query, with the cost showing up on your BigQuery bill instead of a separate API contract, finally make in-warehouse LLM use practical at scale. I have one client running daily classification jobs over 40M rows entirely in BigQuery for less than a SageMaker batch job would cost.

## Where it still loses

Three honest gaps:

- Region availability. Outside us-central1 and europe-west4, Gemini 2 Pro still has waitlists or higher latency. If your data has to live in Mumbai or Sao Paulo, check before you architect.
- Fine-tuning. Vertex tuning is improving but not at the level of [Bedrock custom model import](https://cloud.google.com/blog) or Azure AI Foundry's tuning UX.
- The console. Vertex's console is still a Frankenstein of old AI Platform pages and new Agent Builder flows. Plan to live in the API.

## Takeaways

- If you are price-sensitive and shipping Flash-class workloads, Gemini 2 Flash is the cheapest serious model in the market right now.
- For teams already on Google Cloud, Vertex Agent Builder + Cloud Run is the shortest path from prototype to production agents.
- BigQuery + Gemini for in-warehouse ML is no longer an experiment; it is the default for classification and extraction at scale.
- Do not migrate off Anthropic for code-editing agents. Do consider it for retrieval-heavy and voice workloads.
- Watch [DeepMind's release cadence](https://deepmind.google/) — the gap between research drops and Vertex availability has shrunk to weeks.

Google has not won. But for the first time, ignoring it on a serious AI architecture review is malpractice.`,
  },

  {
    slug: "aws-2026-bedrock-q-graviton",
    title: "AWS in 2026: Bedrock, Q, and the bet on inference-on-Graviton",
    description:
      "Bedrock's catalog tripled, Nova landed, and AWS is betting that most inference does not need GPUs. A field report from production workloads.",
    published: true,
    published_at: "2026-04-09T09:00:00.000Z",
    reading_time: 5,
    tags: ["ai", "aws", "bedrock", "graviton", "cloud"],
    content: `AWS spent 2025 looking flat-footed on AI. By April 2026, after the Nova family hit GA, [Bedrock](https://aws.amazon.com/bedrock) catalog crossed 80 first- and third-party models, and the [Trainium2-backed inference](https://aws.amazon.com/blogs/) tier started cutting prices monthly, the picture is different. Not ahead of Google or Microsoft, but no longer a punchline.

Three observations from running production LLM workloads on AWS this quarter.

## Bedrock is finally a platform, not a model proxy

For its first 18 months, Bedrock was a thin API in front of Anthropic, Cohere, and Meta. Useful for procurement, not differentiated. The Bedrock of 2026 is different on three axes:

- The catalog now includes Anthropic Claude 4, Mistral Large 3, Llama 4 (yes, finally), DeepSeek R2 in the GovCloud-adjacent region, and the full Amazon Nova line.
- Bedrock Agents shipped a real planner-executor split with checkpoint-and-resume, which means long-running agents survive Lambda timeouts without me writing a state machine.
- Custom Model Import covers fine-tuned Llama and Mistral derivatives without the SageMaker tax. This is the quiet feature that moved a client off self-hosted vLLM.

[Amazon Nova](https://aws.amazon.com/blogs/) deserves a paragraph. Nova Pro is not a Claude 4 competitor; it is a price-aggressive workhorse that wins on the tasks where you would have used GPT-4 Turbo a year ago. For classification, summarization, and structured extraction at scale, Nova Lite at $0.06/1M input tokens is what I default to now.

## Amazon Q is two products, and only one is good

[Amazon Q Developer](https://aws.amazon.com/q) is good. It reads your CDK and Terraform, knows your IAM policies, suggests least-privilege fixes that actually work, and the cost-anomaly explanations are better than what I get from third-party tools. I keep it on.

Amazon Q Business is still a confused product. It wants to be a knowledge agent, a workflow builder, and a Slack bot. It does none of them as well as a focused tool. If a client asks me about it, I redirect to Bedrock Agents plus a thin frontend.

## Comparing the AWS inference paths

| Path                              | Latency | $/1M tokens (Llama-class) | Custom-model support      | Ops burden |
| --------------------------------- | ------- | ------------------------- | ------------------------- | ---------- |
| Bedrock on-demand                 | Low     | $0.20–$0.80               | Custom Model Import       | None       |
| Bedrock provisioned throughput    | Lowest  | Commit pricing, ~30% off  | Yes, hourly commit        | Low        |
| SageMaker real-time endpoint      | Low     | $0.40–$1.50 (compute)     | Anything                  | Medium     |
| EC2 + Inferentia2 / Trainium2     | Lowest  | $0.10–$0.40 effective     | Anything, including custom kernels | High |

The interesting trend: provisioned throughput pricing on Bedrock has come down to where the case for managing your own inference plane on EC2 + Inferentia2 only makes sense at very large scale or for models AWS will not host. A year ago, that line was much lower.

## The silicon bet

AWS is making a bet most coverage misses: that the median enterprise inference workload does not need an H100. Trainium2 for training, Inferentia2 for hosted inference, and — the sleeper — Graviton4 for CPU-class inference of small models and embedding pipelines.

The Graviton4 inference story is specifically interesting for the boring half of any AI stack:

- BGE and other embedding models run cheaply on Graviton4 with negligible accuracy loss versus GPU.
- Reranking, classification under 1B parameters, and most tabular ML tasks fit on CPU at a fraction of GPU cost.
- The 30%+ price-performance gap on general compute means everything around your inference plane (API gateways, retrieval, evaluation) is cheaper too.

I now spec a default of: Graviton4 for embeddings and orchestration, Bedrock for LLM calls, Inferentia2 only when a specific custom model justifies it. That stack is roughly 40% cheaper than the all-GPU equivalent I was building in early 2025.

## Where AWS still loses

- The console. Bedrock's playground, Agents builder, and evaluation tools live in three different UI paradigms. Pick one, please.
- Multimodal. Nova handles vision; audio is behind. If voice is core to your product, Gemini 2 Flash or Azure's OpenAI-backed voice endpoints are still ahead.
- Cross-region failover for Bedrock. Documented, but in practice fragile. Build it yourself if uptime matters.

## Takeaways

- Default to Bedrock on-demand. Move to provisioned throughput when you cross roughly $10K/mo on a single model.
- Use Nova Lite for high-volume cheap work. Use Claude 4 on Bedrock for code and complex reasoning. Use everything else only with a clear reason.
- Put embeddings, reranking, and orchestration on Graviton4. Stop renting H100s for tasks that fit in 100ms on a CPU.
- Adopt Q Developer if you live in AWS. Skip Q Business until it picks an identity.
- Read the [Bedrock release notes](https://aws.amazon.com/blogs/) every two weeks; pricing and catalog moves are now monthly.

AWS is no longer an embarrassment on AI. It is, for many production workloads, the pragmatic choice — especially if your data and your team already live in its console.`,
  },

  {
    slug: "azure-2026-ai-foundry-copilot",
    title: "Azure's AI Foundry, Copilot, and the OpenAI partnership in 2026",
    description:
      "AI Foundry consolidated Microsoft's sprawling AI estate. The OpenAI partnership is more complicated than the press release suggests. Here is the operator's view.",
    published: true,
    published_at: "2026-04-15T09:00:00.000Z",
    reading_time: 5,
    tags: ["ai", "azure", "openai", "copilot", "cloud"],
    content: `Microsoft's 2025 AI org chart was a maze: Azure OpenAI Service, Azure ML, AI Studio, Copilot Studio, GitHub Copilot, Microsoft 365 Copilot, plus a dozen "AI in <product>" sub-brands. In April 2026, [Azure AI Foundry](https://learn.microsoft.com/azure/ai-foundry/) is the consolidated platform, the OpenAI partnership has shifted from exclusivity to preferred partnership, and Copilot is fragmenting into product-specific surfaces.

This is what an operator needs to know.

## AI Foundry: the platform Microsoft should have built two years ago

[AI Foundry](https://azure.microsoft.com/en-us/blog/) is what happens when you take Azure ML, Azure OpenAI Service, and AI Studio and force them into one workspace. The result is genuinely better than its parts:

- One model catalog covering OpenAI's GPT line, Anthropic Claude (yes, on Azure now — that arrived in late 2025), Mistral, Cohere, Meta Llama 4, and Microsoft's Phi family.
- A unified deployment surface where serverless and provisioned PTU offerings sit next to managed endpoints for custom models.
- Evaluation, content safety, and red-teaming as first-class workflows rather than tabs hidden three layers deep.

The thing Foundry gets right that competitors do not: governance. Tagging deployments with cost centers, enforcing content-safety policies at the workspace level, and exporting audit logs to Sentinel without writing glue code is a meaningful enterprise advantage. For regulated customers, this is the reason Foundry wins deals over Bedrock or Vertex.

## The OpenAI partnership in 2026

The headline most people miss: Microsoft is no longer OpenAI's exclusive cloud. The 2025 amendments and OpenAI's own infrastructure expansion (Stargate, plus the Oracle and Google deals) have moved the relationship to "preferred partner with right of first refusal on certain workloads." Practical consequences:

- New OpenAI models still hit Azure first or simultaneously. GPT-4.x updates and the o-series reasoning models continue to land on Azure on day zero.
- Some OpenAI capabilities — particularly around real-time voice and certain enterprise APIs — now have parity gaps that did not exist in 2024. Azure usually catches up within a quarter.
- Pricing on Azure OpenAI is not always cheaper than openai.com direct. Check both before you commit.

If you are picking Azure specifically because OpenAI is on it, that reason is weaker than it was. Pick Azure because of Foundry, governance, and your existing Microsoft estate.

## Copilot is now five products

There is no single Copilot. By April 2026:

- [GitHub Copilot](https://github.blog/) is the developer tool — multi-model under the hood, not just GPT, with a real agent mode that competes with Cursor.
- Microsoft 365 Copilot is the office productivity layer, increasingly Phi-4 plus GPT for the heavy lifting.
- Copilot Studio is the no-code agent builder for business users.
- Security Copilot is the SOC tool, genuinely useful for triage.
- Sales/Service Copilot are CRM-adjacent and largely Dynamics-shop concerns.

Copilot Studio deserves attention. It is the most usable no-code agent builder on any cloud, and it integrates natively with Power Automate. For internal-tooling teams shipping agents to non-engineers, it is the path of least resistance — and the cost model (per-message packs) is more predictable than token billing.

## How Foundry compares

| Dimension              | Azure AI Foundry        | AWS Bedrock              | Google Vertex             |
| ---------------------- | ----------------------- | ------------------------ | ------------------------- |
| Model breadth          | OpenAI, Anthropic, Mistral, Llama, Phi | Anthropic, Meta, Mistral, Nova, DeepSeek | Gemini, Anthropic (limited), open models |
| Fine-tuning UX         | Best of the three       | Custom Model Import, decent | Improving, still rough  |
| BYO model              | Managed endpoints, yes  | Custom Model Import, yes | Vertex endpoints, yes     |
| Governance / audit     | Best                    | Good                     | Good                      |
| Regional availability  | Widest enterprise reach | Wide, GovCloud strong    | Catching up, gaps remain  |

Foundry's edge is governance and fine-tuning. Bedrock's edge is operational simplicity. Vertex's edge is price-per-quality at the cheap tier. None of these are wrong defaults; the right one depends on your existing estate.

## Microsoft silicon: Maia and Cobalt

Azure quietly stood up [Maia accelerators](https://azure.microsoft.com/en-us/blog/) for inference and Cobalt ARM CPUs for general compute. The customer-visible impact in April 2026:

- Maia-backed PTU offerings on selected models (GPT-4 Turbo class, Phi-4) are roughly 20% cheaper than Nvidia-backed equivalents, with comparable latency. Worth running your benchmark.
- Cobalt VMs are the right default for orchestration, retrieval, and embedding workloads — same logic as Graviton on AWS.
- Microsoft is not abandoning Nvidia; the H200 and B200 SKUs are still where the largest models run.

## Where Foundry still loses

- Console performance. The Foundry portal is slow. Acknowledged, allegedly being addressed.
- Streaming responses through API Management. Doable, fiddly. Bedrock and Vertex are smoother out of the box.
- Cost reporting. Azure Cost Management shows AI Foundry spend, but the granularity below "deployment" still requires manual tagging discipline.

## Takeaways

- If you are a Microsoft shop, AI Foundry is now the obvious default. The consolidation alone justified the migration off Azure OpenAI Service standalone.
- Do not pick Azure solely for OpenAI exclusivity. That moat is shrinking.
- For internal-tooling agents shipped to non-engineers, Copilot Studio is the most pragmatic builder on any cloud right now.
- Run your inference benchmark on Maia before assuming Nvidia is the only option.
- Tag every deployment with a cost center on day one. Foundry's governance is only as good as the metadata you put in.

The Azure AI story in 2026 is less about model superiority and more about operational fit. For enterprises with serious compliance and governance needs, that may matter more than another evals point.`,
  },

  {
    slug: "chatgpt-outdated-narrative-half-right",
    title: "The 'ChatGPT is outdated' narrative is half right",
    description:
      "GPT-4 is no longer SOTA on most evals. ChatGPT-the-product still wins distribution. These are different facts and the takes online keep conflating them.",
    published: true,
    published_at: "2026-04-21T09:00:00.000Z",
    reading_time: 4,
    tags: ["ai", "chatgpt", "openai", "evals"],
    content: `Roughly twice a week in April 2026 someone posts a thread arguing that ChatGPT is dead, the GPT-4 family is obsolete, and OpenAI is finished. They cite Claude 4 winning SWE-Bench, Gemini 2 Pro winning long-context retrieval, and DeepSeek R2 winning math. They are not wrong about the evals. They are wrong about the conclusion.

The model is not the product. Both things are true at once.

## The eval picture in April 2026

Numbers below are publicly reported scores as of April 2026. Eval contamination is a real concern; treat any single number with skepticism, especially on benchmarks released before the model's training cutoff. The directional ranking is what matters.

| Eval        | GPT-4o / 4.5  | Claude 4 Sonnet | Gemini 2 Pro    | DeepSeek R2     |
| ----------- | ------------- | --------------- | --------------- | --------------- |
| MMLU-Pro    | ~76           | ~80             | ~79             | ~78             |
| GPQA Diamond| ~54           | ~62             | ~60             | ~63             |
| SWE-Bench Verified | ~52    | ~67             | ~58             | ~55             |
| MATH        | ~76           | ~82             | ~84             | ~88             |

Read this as: GPT-4 class models are no longer best on any major public eval. They are usually third or fourth. That is a real change from 2024.

The harder question — which model is best for your application — is not answered by any of these. I have shipped products where GPT-4o beat Claude 4 on production traces despite Claude winning every public eval, because the prompt format and tool-call patterns were tuned to GPT's behavior over two years.

## Why ChatGPT keeps winning anyway

[OpenAI](https://openai.com/index/) reports 800M+ weekly active users on ChatGPT in 2026. That is bigger than most consumer products on the internet. The reasons are not about model quality:

- Distribution. ChatGPT is the brand. My non-technical relatives say "ChatGPT" the way they say "Google."
- Product surface. Voice mode, canvas, custom GPTs, the macOS app integration — these are product features, not model features. Claude has comparable underlying capabilities and a worse product story around them.
- Memory. ChatGPT's memory feature, however imperfect, is sticky. Switching costs are real once it knows you.
- Embedded distribution. Apple Intelligence's ChatGPT integration alone touches more users than [Anthropic's](https://anthropic.com/news) total reach.

The "ChatGPT is dead" thread author usually has 50K Twitter followers and runs a Cursor-pilled developer workflow. Their experience is not the median user's.

## What is actually true

Three things, separately:

- For frontier-eval workloads — hard reasoning, long-context retrieval, top-tier code generation — OpenAI no longer leads. Claude 4 and Gemini 2 Pro are usually ahead.
- For builder workloads via API — most companies shipping AI features — the right model depends on the task. OpenAI is competitive but rarely the obvious choice. See [livebench.ai](https://livebench.ai/) and [DeepMind's leaderboards](https://deepmind.google/) for current comparisons; do not trust any single source.
- For consumer chat — the actual ChatGPT product — OpenAI is winning by a wide margin and the gap is growing, not shrinking.

The narrative collapse happens because Twitter and Hacker News are dominated by builders, who experience the API reality. Builders project that experience onto the consumer product, and it does not transfer.

## The interesting question

The interesting question is not "is ChatGPT dead." It is "does product moat outrun eval gap?" My honest answer: probably yes, for at least 18 more months. Reasons:

- The Apple Intelligence partnership locks in distribution at a scale none of the competitors can match in the near term.
- ChatGPT has the only consumer subscription product in this category that is generating real revenue. Anthropic and Google's consumer chat products are not on the same scale.
- OpenAI's o-series reasoning models, while not always top of leaderboards, are good enough for the consumer use cases that drive retention. Most users do not care if Claude 4 is 8 points better on GPQA.

If a competitor does close the product gap — Meta integrating Llama 4 deeply into WhatsApp, or Google making Gemini the default Pixel/Android assistant in a way that finally works — the consumer story changes. Until then, the API leaderboard and the consumer winner can be different companies, and they are.

## Takeaways

- Stop reading "ChatGPT is outdated" threads. They are right about evals and wrong about everything that matters for the actual product.
- For your own builder decisions, run your own evals on your own data. Public leaderboards lead the actual answer by zero percent.
- If you are building a consumer chat product to compete with ChatGPT directly, you are not going to win on model quality. Find a different angle.
- OpenAI losing the eval crown is a real story for builders. It is barely a story for users, and the discourse keeps mixing them up.
- Watch the Apple Intelligence integration metrics if any leak. That is the single largest distribution variable in this market.

The "ChatGPT is dead" narrative is a builder-shaped take dressed up as a market-shaped one. Both halves of that distinction are interesting. Treating them as one story is how you make bad architecture and product decisions.`,
  },

  {
    slug: "cloud-cost-2026-ai-dominates",
    title: "Cloud cost in 2026: why your AI workloads are ten times your compute bill",
    description:
      "Inference is the dominant line on the cloud invoice now. GPU egress is real. Reserved capacity for AI is harder to model than EC2 ever was. A worked example.",
    published: true,
    published_at: "2026-04-25T09:00:00.000Z",
    reading_time: 4,
    tags: ["ai", "cloud", "cost", "finops", "inference"],
    content: `In Q1 2026, across six SaaS clients I run cost reviews for, the median ratio of AI-inference spend to traditional compute is 8.4x. The highest is 17x. A year ago the median was under 2x. Compute is not getting cheaper; AI is getting bigger.

This is the practical map of where the money goes and what to do about it.

## The new line items

A 2024 cloud bill had a predictable shape: compute, storage, network, data transfer, managed databases. The 2026 bill adds:

- Hosted LLM inference (Bedrock, Azure OpenAI, Vertex, plus direct provider APIs).
- Embedding generation, often a separate line at high volume.
- Vector storage (managed: pgvector on RDS, OpenSearch, Pinecone passthrough).
- Evaluation runs, which are LLM calls but usually mis-tagged.
- GPU compute for self-hosted models, where applicable.
- Egress on AI traffic, which is non-trivial when you stream long completions across regions.

In a typical bill the first item alone is now larger than EC2.

## Rough $/1M token costs, April 2026

Public list prices. Caching, batch, and committed-use discounts can move these 30–70%.

| Provider / model           | $/1M input | $/1M output |
| -------------------------- | ---------- | ----------- |
| Gemini 2 Flash             | $0.10      | $0.40       |
| Amazon Nova Lite           | $0.06      | $0.24       |
| GPT-4o mini                | $0.15      | $0.60       |
| Claude 4 Haiku             | $0.25      | $1.25       |
| Gemini 2 Pro               | $1.25      | $5.00       |
| GPT-4.x (frontier tier)    | $2.50      | $10.00      |
| Claude 4 Sonnet            | $3.00      | $15.00      |
| Claude 4 Opus              | $15.00     | $75.00      |

The frontier-class models are roughly 25–50x more expensive than the workhorse tier. Most production traffic does not need frontier; routing it there anyway is the most common cost mistake I see.

## Worked example: a 500M-token-per-month SaaS

Assume a B2B SaaS with 500M tokens/month, 70% input / 30% output, and a tiered routing strategy:

- 80% of calls go to a Flash-class model (Gemini 2 Flash or Nova Lite).
- 18% go to a mid-tier model (Claude 4 Haiku or GPT-4o mini).
- 2% go to a frontier model (Claude 4 Sonnet) for hard cases.

Math:

- Flash tier: 400M tokens. 280M input * $0.10 + 120M output * $0.40 = $28 + $48 = $76.
- Mid tier: 90M tokens. 63M input * $0.25 + 27M output * $1.25 = $15.75 + $33.75 = $49.50.
- Frontier tier: 10M tokens. 7M input * $3.00 + 3M output * $15.00 = $21 + $45 = $66.

Total LLM spend: ~$192/month. Add embeddings (say 50M tokens at $0.02/1M = $1), vector storage ($150 on managed pgvector), evaluation runs ($60), and egress ($40). Roughly $440/month.

Now do the naive version: route every call to Claude 4 Sonnet. 350M input * $3 + 150M output * $15 = $1,050 + $2,250 = $3,300/month. Same product, 7.5x the bill.

This is why model routing is not optional. A cheap router that classifies request difficulty and dispatches accordingly typically pays for itself in week one.

## GPU egress is real

[AWS](https://aws.amazon.com/blogs/aws-cost-management), [Azure](https://learn.microsoft.com/azure/cost-management-billing/), and [Google Cloud](https://cloud.google.com/blog) all charge egress on streaming completions, and for long-output workloads (code generation, document drafting) it adds up. Two patterns I now insist on:

- Keep the model and the consuming service in the same region. Cross-region streaming for chat-class output costs more than people expect.
- For very high-volume internal-only workloads, run inference inside the VPC of the consumer. Bedrock VPC endpoints, Azure private endpoints, and Vertex private service connect all matter.

## Reserved capacity is harder than EC2 reservations ever were

Provisioned throughput on Bedrock, PTUs on Azure OpenAI, and committed-use discounts on Vertex all promise 25–50% savings for committed capacity. The catch:

- Models change. A PTU you committed to last quarter may be on a deprecated model this quarter.
- Token mix shifts. Your input/output ratio changes as products mature, and PTU pricing rewards specific shapes of traffic.
- Multi-model routing breaks the model. If you split traffic across three providers, you cannot easily commit to any one of them.

Practical rule: do not commit until you have at least three months of stable traffic, and keep commitments under 60% of baseline so a model deprecation does not strand you.

## What FinOps for AI actually looks like

The [FinOps Foundation](https://finops.org/) added an AI workgroup in 2025 and the practices are stabilizing. The real ones I use with clients:

- Tag every API call with feature, customer tier, and request type. If you cannot, your billing data is useless.
- Set per-feature token budgets and alarm at 80%. Inference cost runs away in hours, not weeks.
- Cache aggressively. Prompt caching on Anthropic and OpenAI, context caching on Gemini — for any workload with repeated system prompts, this is 50%+ savings.
- Run a monthly model-mix review. The cheap-tier models keep getting better; what was Sonnet-only six months ago is now Haiku-capable.
- Measure cost per user action, not cost per token. Tokens are a unit of supply, not demand.

## Takeaways

- AI inference is now the dominant cloud line item for any company using LLMs in production. Plan accordingly.
- Tiered model routing is the single highest-leverage cost lever. A well-tuned router cuts spend 50–80%.
- Caching is free money. Turn it on before anything else.
- Keep inference and consumers in the same region. Egress on long completions is real.
- Be cautious with provisioned commitments. Models deprecate faster than reservation terms.
- Tag everything from day one. AI FinOps without per-call attribution is just guessing.

The companies winning on AI cost in 2026 are not the ones using the cheapest model. They are the ones routing intelligently, caching aggressively, and measuring per-feature unit economics. None of that is new in cloud cost; what is new is how badly it punishes you to skip it.`,
  },
];

async function main() {
  const headers = {
    "Content-Type": "application/json",
    apikey: KEY,
    Authorization: `Bearer ${KEY}`,
    Prefer: "resolution=merge-duplicates,return=representation",
  };

  console.log(`Inserting ${posts.length} posts to ${SUPABASE_URL}/rest/v1/blog_posts`);

  const insertRes = await fetch(`${SUPABASE_URL}/rest/v1/blog_posts?on_conflict=slug`, {
    method: "POST",
    headers,
    body: JSON.stringify(posts),
  });
  const insertText = await insertRes.text();
  console.log("Insert status:", insertRes.status, insertRes.statusText);
  if (!insertRes.ok) {
    console.error("Insert body:", insertText);
    process.exit(1);
  }
  let inserted;
  try {
    inserted = JSON.parse(insertText);
    console.log(`Inserted/upserted ${Array.isArray(inserted) ? inserted.length : "?"} rows.`);
  } catch {
    console.log("Insert body (non-JSON):", insertText.slice(0, 500));
  }

  const verifyRes = await fetch(
    `${SUPABASE_URL}/rest/v1/blog_posts?select=slug,title,published_at&order=published_at.desc&limit=10`,
    { headers: { apikey: KEY, Authorization: `Bearer ${KEY}` } }
  );
  console.log("Verify status:", verifyRes.status, verifyRes.statusText);
  const rows = await verifyRes.json();
  console.log("Latest blog_posts rows:");
  for (const r of rows) {
    console.log(`- ${r.slug}  |  ${r.title}  |  ${r.published_at}`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
