export type BlogPostDraft = {
  id: string;
  slug: string;
  title: string;
  description: string;
  content: string;
  tags: string[];
  category: 'ai' | 'devops' | 'business' | 'cloud' | 'platform' | 'security' | 'reliability';
  publishedAt: string;
  readingTime: number;
  references: { label: string; url: string }[];
};

export const part1: BlogPostDraft[] = [
  {
    id: 'p1-001',
    slug: 'llama-3-open-weights-shift',
    title: 'Llama 3 Is the Moment Open Weights Stopped Being a Toy',
    description: 'Meta dropped Llama 3 in April 2024. The 70B model is the first open-weights release I would actually deploy for a paying client.',
    category: 'ai',
    publishedAt: '2024-04-22',
    readingTime: 4,
    tags: ['llama', 'open-source', 'llm', 'meta'],
    references: [
      { label: 'Meta AI Blog: Introducing Meta Llama 3', url: 'https://ai.meta.com/blog/meta-llama-3/' },
      { label: 'Meta AI Blog index', url: 'https://ai.meta.com/blog/' },
      { label: 'The Verge coverage', url: 'https://www.theverge.com/' },
      { label: 'Hugging Face model card', url: 'https://huggingface.co/meta-llama' }
    ],
    content: `Meta shipped Llama 3 last week and the 70B variant is the first open-weights model I would put in front of a paying client without an apology.

I have spent the last twelve months telling people that "open" models were either toys or trapdoors. Llama 2 70B was fine for chat demos and miserable for anything that touched code, structured output, or long context. Mistral was sharp but small. Everything else was a benchmark cosplay.

Llama 3 is a step change. Not because the architecture is novel, it isn't, but because Meta finally threw enough tokens at it. 15T tokens of pretraining, careful instruction tuning, and an 8K context that they have already promised to extend. The 8B model punches at GPT-3.5. The 70B is genuinely competitive with GPT-4 on a lot of practical tasks.

## Why this matters for platform teams

For the last year I have had the same conversation with every CTO I work with:

- "Can we self-host?"
- "Yes, but the quality gap is brutal."
- "Then we'll keep paying OpenAI."

Llama 3 collapses that gap for a chunk of workloads. Not all of them. But enough that the conversation shifts from "is open viable" to "which workloads stay on a frontier API and which come home".

The economics are obvious once you run the numbers. A 70B model on two A100s with vLLM hits a few hundred tokens a second, and on AWS that is roughly two pounds an hour at on-demand. If you are doing high-volume classification, summarisation, or internal RAG against your own corpus, the API bill stops making sense well below the seven-figure mark.

## Where it still falls down

I do not want to oversell this. Llama 3 has problems:

- The 8K context is short. Half my use cases need 32K minimum.
- Function calling is bolted on, not native. You will write parsing logic.
- The licence is "open weights with strings". If you cross 700M monthly active users you owe Meta a phone call. Most of you won't, but read it.
- Safety tuning is aggressive. You will need to do your own DPO pass for any agent that needs to handle adversarial input gracefully.

## What I am doing about it

For two existing clients this quarter I am moving internal tooling, the stuff nobody outside the company sees, off GPT-4 onto Llama 3 70B running on \`g5.12xlarge\` boxes. The migration is mostly prompt rewriting. The savings pay for the engineering inside a quarter.

I am leaving the customer-facing surface on a frontier API for now. The quality ceiling there still matters. Latency p99 still matters. And if a frontier vendor ships a major upgrade next month I want my product to ride the curve, not eat a six-week fine-tune.

## The strategic read

The interesting question is not whether Llama 3 is good. It is what Meta does next. They have signalled a 400B parameter version is training. If that lands at frontier quality with permissive weights, the entire pricing layer of the LLM market gets compressed in a year.

If you are building a startup whose moat is "we wrap GPT-4", you have maybe twelve months to find a different moat. If you are running platform for an enterprise, start now on the muscles you will need: GPU capacity planning, evaluation harnesses, vector store hygiene, and a serving stack that does not assume the model is somebody else's problem.

The toy era is over. Open weights are now infrastructure. Treat them like it.`
  },
  {
    id: 'p1-002',
    slug: 'gpt-4o-omni-platform-implications',
    title: 'GPT-4o: The Multimodal Bet and What It Breaks in Your Stack',
    description: 'OpenAI shipped GPT-4o in May 2024. Native audio in, audio out. Half the price of GPT-4 Turbo. Here is what actually changes in production systems.',
    category: 'ai',
    publishedAt: '2024-05-15',
    readingTime: 4,
    tags: ['openai', 'gpt-4o', 'multimodal', 'llm'],
    references: [
      { label: 'OpenAI: Hello GPT-4o', url: 'https://openai.com/index/hello-gpt-4o/' },
      { label: 'OpenAI index', url: 'https://openai.com/index/' },
      { label: 'The Verge: OpenAI Spring Update', url: 'https://www.theverge.com/' },
      { label: 'TechCrunch coverage', url: 'https://techcrunch.com/' }
    ],
    content: `OpenAI's spring update did the obvious thing and the non-obvious thing in the same breath.

The obvious thing: a faster, cheaper GPT-4. Half the price of Turbo, twice the rate limits, and 4o now sits at the top of the leaderboard for the workloads most teams care about.

The non-obvious thing: a single model that takes audio, image, and text natively, and emits the same. No separate Whisper hop. No separate TTS hop. One forward pass, end-to-end. The demo that everyone shared was the singing and the flirty voice. The thing engineers should care about is the latency floor.

## Why "one model" matters

Today's voice assistant is a pipeline:

1. VAD detects speech.
2. Whisper transcribes.
3. GPT-4 reasons.
4. A TTS engine speaks.

Every hop adds latency, kills prosody, and discards information. By the time the LLM sees the text, it has lost the user's tone, the pause before they said "yes", the sigh of frustration. Output goes through the same lossy reverse path.

GPT-4o collapses that to one model. End-to-end audio. The reported median voice latency is around 320ms. That is the same ballpark as a human turn-taking gap. Below that threshold, the experience stops feeling like talking to a machine and starts feeling like a phone call.

If you have shipped a voice product on the old pipeline you already know it sounds robotic, especially around interruptions. 4o changes the floor.

## What this breaks

A few things in your stack that will look stupid in six months:

- **Your transcription pipeline as a separate service.** If you run Whisper as a sidecar to feed an LLM, you are paying twice and losing fidelity. Plan to consolidate.
- **Your prompt eval harness.** Most evaluation tooling I have seen assumes text-in, text-out. Audio-in evaluation is a different problem. You will need new metrics, new fixtures, new ways of seeding regression tests.
- **Your latency SLOs.** If your voice product targets 800ms p95 today because that was achievable, your competitors will move to 350ms. Adjust.
- **Your data pipeline.** Audio is heavier than text. Storage, transit, retention, redaction all get harder. Talk to legal early.

## What it does not change

The model is still a stochastic text generator wearing a microphone. It will hallucinate. It will agree with confidently wrong users. It will refuse things it should not refuse and answer things it should. None of the multimodal magic fixes the alignment problem.

It is also still a hosted API with rate limits and a vendor relationship. If you are building anything that needs to run offline, on-device, or in an air-gapped environment, 4o is irrelevant to you and Llama 3 is not.

## What I am doing

For one client I'm rebuilding their support voicebot from a Whisper-then-GPT pipeline onto 4o realtime. I expect the engineering to take a month and the product team to spend two months redesigning the conversation because suddenly the model can handle interruptions gracefully and the old script breaks.

For everyone else I am pushing one habit: stop thinking of "the LLM" as a box that takes a string and emits a string. Start thinking of it as a multimodal endpoint with a context window and a price per second. The shape of your application changes once the model can hear.

## The pricing detail nobody is reading

GPT-4o is half the price of Turbo on input, a third on output. That sounds incremental until you remember that frontier models have halved in price roughly every nine months for two years. If that curve continues, by mid-2025 you are running near-frontier inference for the price of GPT-3.5 today.

Build with that in your roadmap. The thing you cannot afford this year you can afford next year. Architect for the migration, not the snapshot.`
  },
  {
    id: 'p1-003',
    slug: 'devin-hype-and-bust',
    title: 'Devin Was a Demo, Not a Product',
    description: 'Cognition launched Devin in March 2024 as the first AI software engineer. Four months in, the bench dust has settled. Here is what the autonomous agent hype actually delivered.',
    category: 'ai',
    publishedAt: '2024-07-08',
    readingTime: 4,
    tags: ['ai-agents', 'devin', 'autonomous', 'llm'],
    references: [
      { label: 'Cognition Labs', url: 'https://www.cognition.ai/' },
      { label: 'TechCrunch coverage', url: 'https://techcrunch.com/' },
      { label: 'The Verge', url: 'https://www.theverge.com/' },
      { label: 'SWE-bench', url: 'https://www.swebench.com/' }
    ],
    content: `Cognition Labs launched Devin in March 2024 with a polished video, a SWE-bench score, and the phrase "first AI software engineer". The internet lost its mind. Four months later the dust has settled and the picture is clearer.

Devin was a demo. A good demo. Not a product.

## What was real

Cognition built a competent agent harness. The headline number, 13.86% resolution on SWE-bench, was a real improvement over the prior public state of the art at the time. The product surface, an agent that plans, writes code, runs tests, and reports back, was credible. They raised a lot of money quickly and that was rational on the information available in March.

## What was theatre

The launch video was edited. That is fine, every product launch video is edited. But the gap between the curated demo and the live behaviour was wider than usual. Independent reviewers pulled apart specific Upwork and bug-fix demonstrations and found that tasks Devin "completed" had been quietly mangled, that the agent fabricated work product, and that the time-on-task figures hid a lot of human steering.

This was not a Cognition-specific problem. This was the entire 2024 agent market.

## Why agent demos lie

LLM agents have a structural reason to look better in demos than in production:

- **Curated tasks.** A task where the test suite tells you what good looks like is a special case, not the median.
- **Cherry-picked seeds.** Agents are non-deterministic. Run a task ten times, ship the one that worked.
- **Hidden context.** The repo was small, the dependencies were modern, the bug was already half-localised.
- **Loose definitions of done.** "Tests pass" is not the same as "PR merges and the feature works in production for six months".

Production engineering has none of these properties. The repos are old. The dependencies are weird. The tests are flaky. The definition of done is "the on-call doesn't get paged at 3am". Agents fall over hard the moment they leave the curated track.

## Where agents do work in 2024

I am not anti-agent. I run agentic workflows for two clients today. Both are scoped tightly:

- A code review bot that reads PRs, runs static analysis, and posts structured comments. It is wrong sometimes. It is wrong less often than the average junior reviewer, and a human merges.
- A migration tool that proposes changes across a monorepo for a specific framework upgrade. It fails on 30% of files. The 70% it gets right paid for the engineering inside a sprint.

Both are narrow. Both keep a human in the loop. Both are evaluated against deterministic test fixtures, not vibes.

## The lesson for the rest of 2024

The Devin cycle taught the industry three things, slowly:

1. **Benchmark scores do not generalise.** SWE-bench is a useful signal. It is not a product.
2. **Autonomy is a slider, not a switch.** Useful agents in 2024 are 20% autonomous, not 100%. The teams shipping value are the ones who set the slider deliberately and built the harness to match.
3. **The serious players moved quietly.** Anthropic shipped tool use that worked. GitHub iterated on Copilot Workspace without claiming to replace anyone. Cursor built a pleasant editor with good agentic affordances. None of them released a viral video.

If you are evaluating an agent product in the back half of 2024, ignore the demo. Ask for read access to a real customer's repo and run your own task list. Watch the live failure modes. The vendors who survive that test are the ones worth your budget.

## A note on the founders

I have nothing against Cognition. They will iterate. The 2024 launch is not the end of their story, and "first version was oversold" is the modal Silicon Valley path. The lesson is for buyers, not builders. When the first AI engineer ships, you will not need a launch video to recognise it. Your incident channel will quietly stop firing.`
  },
  {
    id: 'p1-004',
    slug: 'crowdstrike-july-2024-lessons',
    title: 'CrowdStrike Took Down Half the Planet. Your Runbook Should Have Caught It.',
    description: 'On 19 July 2024 a CrowdStrike Falcon update bricked 8.5 million Windows machines. The post-mortem is not about CrowdStrike. It is about how nobody held their vendor accountable.',
    category: 'business',
    publishedAt: '2024-07-25',
    readingTime: 5,
    tags: ['incident', 'crowdstrike', 'reliability', 'vendor-risk'],
    references: [
      { label: 'CrowdStrike: Channel File 291 Incident', url: 'https://www.crowdstrike.com/blog/' },
      { label: 'The Register coverage', url: 'https://www.theregister.com/' },
      { label: 'Microsoft response', url: 'https://blogs.microsoft.com/' },
      { label: 'sre.google', url: 'https://sre.google/' },
      { label: 'The Verge', url: 'https://www.theverge.com/' }
    ],
    content: `On 19 July 2024 a CrowdStrike Falcon sensor configuration update bricked roughly 8.5 million Windows endpoints inside a few hours. Airlines stopped. Hospitals stopped. Banks stopped. The London tube boards went dark. It was the largest outage in IT history by reach, and the root cause was a config file with a parsing bug that tripped a kernel-mode driver into a boot loop.

Everyone has written the technical post-mortem. I want to talk about the part nobody is writing.

## CrowdStrike did not fail alone

A lot of senior engineers I respect spent the week pointing at CrowdStrike. Bad QA. No staged rollout. Kernel-mode driver. Channel files outside the standard release pipeline. All true. All damning. None of it is the lesson.

The lesson is that thousands of organisations had granted a single third-party vendor unilateral, unstaged, kernel-level write access to their entire fleet, and had no compensating control. That is not a CrowdStrike failure. That is a procurement failure, a security architecture failure, and a runbook failure on the customer side.

If you signed the contract and ticked "auto-update on", you co-authored this outage.

## The vendor risk question you did not ask

When you onboarded Falcon, did you ask:

- Can we stage updates by ring? Pilot, canary, broad?
- Can we delay channel files by N hours behind the vendor?
- Do we have a documented procedure to roll back a sensor without booting into safe mode on every host?
- Do we have a manual override path if the vendor's cloud is itself down?
- Does our DR plan assume the EDR is the failure mode, or only that the EDR catches the failure?

Most teams I have audited in the last five years answered "no" to all five. CrowdStrike was the bill arriving for that.

## What good looked like on 19 July

A handful of organisations rode the outage well. The pattern was consistent:

- They held updates 24-72 hours behind the vendor's auto-channel by policy.
- They had pre-staged BitLocker recovery keys in a system that was not itself dependent on the bricked endpoints.
- They had a documented "boot into safe mode and delete file X" runbook that a non-specialist could execute.
- They had a phone tree, not just Slack, because Slack ran on laptops that were in a boot loop.

None of that was novel. All of it was boring discipline.

## The wider pattern

CrowdStrike is the loudest example of the same shape we keep seeing:

- 2017 AWS S3 us-east-1 outage. Shared dependency, no regional isolation.
- 2021 Fastly. Single config push, global blast radius.
- 2021 Facebook BGP. Internal tooling on the same plane as the outage.
- 2024 CrowdStrike. Auto-update with no staging.

The common cause is convenience. Centralising a control plane is faster, cheaper, and easier to operate, right up to the moment it fails. Then it is the worst day of your career.

## What to do this quarter

Do not wait for the next CrowdStrike. Pick three vendors with kernel-, hypervisor-, or root-level access to your fleet. For each:

1. Find out if you can stage their updates. If not, raise it in your next QBR.
2. Write a recovery runbook for "this vendor pushed a bad change". Drill it.
3. Verify your recovery dependencies are not themselves on the affected fleet. Recovery keys on the bricked laptop is the canonical anti-pattern.

Do the same for your CI/CD vendor, your auth provider, and your DNS provider. Those are the four ways your business actually goes dark.

## A grim closing thought

The reason CrowdStrike-scale outages will keep happening is that the economics still favour the vendor. Auto-update is a feature. Staged rollout is friction. Customers say they want safety and then sign contracts that prioritise speed. Until enterprise procurement starts treating "we control the update cadence" as a hard requirement on par with SOC 2, you will keep ringing the same bell.

The next one is already in someone's git commit. The only question is whose runbook holds.`
  },
  {
    id: 'p1-005',
    slug: 'claude-3-5-sonnet-coding-shift',
    title: 'Claude 3.5 Sonnet Is the Coding Model I Wanted GPT-4 to Be',
    description: 'Anthropic shipped Claude 3.5 Sonnet in June 2024. After two months of daily use across three client projects, the verdict is in. It is the new default for code.',
    category: 'ai',
    publishedAt: '2024-08-12',
    readingTime: 4,
    tags: ['anthropic', 'claude', 'coding', 'llm'],
    references: [
      { label: 'Anthropic: Claude 3.5 Sonnet', url: 'https://www.anthropic.com/news/claude-3-5-sonnet' },
      { label: 'Anthropic news index', url: 'https://www.anthropic.com/news' },
      { label: 'TechCrunch', url: 'https://techcrunch.com/' },
      { label: 'The Verge', url: 'https://www.theverge.com/' }
    ],
    content: `Two months ago Anthropic shipped Claude 3.5 Sonnet. I have used it daily across three client projects since. It has replaced GPT-4 as my default model for everything that touches code, and the gap is not subtle.

This is not a benchmark post. Benchmarks are noise. This is what changed in my actual workflow.

## What got better

Three things. None of them are "it scored higher on HumanEval".

**Long-context reasoning over real codebases.** Sonnet 3.5 holds 100k+ tokens of mixed code, configs, and prose, and reasons over them without losing the thread. I routinely paste an entire microservice plus its Helm chart plus the Terraform module that provisions it, and ask "where would a sensible person put the rate limit". It answers like someone who read the whole thing, not like someone who skimmed the first chunk.

**Refactor proposals that actually compile.** GPT-4 had a habit of confidently inventing function signatures. Sonnet does this less. Not zero, but the rate is roughly halved by my unscientific count, and the failures are less embarrassing.

**Following instructions about output shape.** "Reply with only the diff. No prose. No explanation. No markdown fences." GPT-4 ignored that instruction one time in five. Sonnet ignores it about one in fifty. That sounds petty until you put it inside a script.

## What is still bad

- It still hallucinates package names. I have wasted twenty minutes on \`pip install\` for a library that does not exist.
- It is overly cautious on security topics. Asking it to write an example exploit for a CVE I am patching gets refused more often than it should.
- It cannot count tokens. Ask it to "summarise this in 200 words" and you get 280, every time.

## The Artifacts feature is the dark horse

The headline of the launch was the Artifacts UI in Claude.ai. Nice toy, I thought. I was wrong. For one client I have replaced an entire internal "prompt to React snippet" tool with a Claude project that uses Artifacts. The team writes a spec, Claude produces a working Artifact, the team iterates in the same chat, and the final code goes into a PR. It is genuinely faster than writing from scratch for the kind of internal tooling where the bar is "works on my screen".

## What it changes for my work

Practical changes I have made:

- All client engagements that include "AI integration" as a deliverable now default to Claude unless the client has a specific reason to prefer OpenAI (usually existing contracts).
- For internal automation, anything that touches code or configuration, I have moved off GPT-4. The cost is roughly the same. The accuracy is better.
- For pure chat, summarisation, and structured extraction, I keep both around and route by job. GPT-4o is faster on short turns. Sonnet is better on long ones.

## The strategic point

The interesting thing about the 3.5 Sonnet release is not the capability. It is the cadence. Anthropic shipped a model that beats their own Opus tier at a Sonnet price point, with the implication that 3.5 Opus is coming and will be another step.

The frontier labs are now releasing roughly every six months. Each release roughly halves the cost-per-quality of the previous one. If you architected your product around GPT-4 in late 2023 and have not revisited the model layer since, you are running on hardware that is fifteen months old in a market where eighteen months is forever.

Build a routing layer. Pin the model in config, not in code. Run an eval suite you trust. When the next release lands, switching should be a Friday afternoon, not a quarter.

## My current default stack

For anyone asking, this is what I run today across client projects:

- Code, refactoring, long-context reasoning: Claude 3.5 Sonnet.
- Voice and low-latency UX: GPT-4o realtime.
- Cheap bulk classification: Llama 3 70B self-hosted, or Haiku 3 if I do not want to operate it.
- Embedding: OpenAI text-embedding-3-large still wins on price-quality but the gap is closing.

That mix will be wrong by Christmas. It is wrong already. Plan for it.`
  },
  {
    id: 'p1-006',
    slug: 'kubernetes-upgrade-discipline',
    title: 'Kubernetes Upgrades Are a Discipline, Not a Project',
    description: 'Most teams I audit are two minor versions behind on k8s and treat each upgrade like a small migration. That is the wrong shape. Upgrades are a habit.',
    category: 'devops',
    publishedAt: '2024-09-02',
    readingTime: 4,
    tags: ['kubernetes', 'upgrades', 'platform', 'reliability'],
    references: [
      { label: 'Kubernetes release notes', url: 'https://kubernetes.io/releases/' },
      { label: 'Kubernetes deprecation policy', url: 'https://kubernetes.io/docs/reference/using-api/deprecation-policy/' },
      { label: 'sre.google: Release Engineering', url: 'https://sre.google/sre-book/release-engineering/' },
      { label: 'kubernetes.io blog', url: 'https://kubernetes.io/blog/' }
    ],
    content: `Roughly half the platforms I audit are running a Kubernetes minor version that left support six months ago. The reasons are always the same. Last upgrade was painful. Nobody wants to own the next one. And the cluster works, so leave it alone.

This is the wrong shape. Upgrades are not a project. They are a discipline. Run them as one and the pain goes away.

## Why teams fall behind

The mechanics of falling behind are predictable:

- The team upgrades from 1.24 to 1.25 in a "project" that takes six weeks.
- The project ends. Everyone celebrates.
- 1.26 ships. Nobody schedules the next project.
- Six months later 1.27 is current and the team is on 1.25.
- Someone notices the gap, sizes the work as "two upgrades, twelve weeks", and quietly de-prioritises it.
- One year later you are on a version with known CVEs and your CNI driver no longer publishes images for it.

The trap is treating each upgrade as a discrete event. Kubernetes ships a minor every fifteen weeks roughly. If your upgrade cadence is slower than that, you accumulate debt by definition.

## What a discipline looks like

Three rules. Boring. Effective.

### 1. Track \`n-1\`, not \`n\`

Do not chase the head of the train. The latest minor lands with rough edges, and the ecosystem (CNI, CSI, ingress, operators) takes a release or two to catch up. Track one minor behind the latest stable. That is your target. Always.

### 2. Upgrade every 12 weeks, on a calendar

Pick a date every quarter. Block it. The work happens whether or not anything has changed. If the upstream version did not move, you still run the drill: validate the upgrade in staging, run the conformance suite, exercise the runbook. Muscle memory is the goal.

### 3. Pre-flight is automation, not a checklist

The pre-flight should be a pipeline:

- Lint manifests against the target version's removed APIs (\`kubent\`, or built-in API deprecation tooling).
- Diff the cluster's current admission webhooks against the target's behaviour changes.
- Run a synthetic load profile and capture latency p50/p95/p99 before and after.
- Snapshot etcd. Verify restore. Yes, before every upgrade. Yes, even though nothing has changed since last quarter.

If any of those steps require a human running a command, you have built a project, not a discipline.

## The upgrade itself

Two patterns work. Pick one and commit:

- **Surge upgrade in place.** Drain nodes, replace with nodes on the new version, repeat. Cheap, simple, slow. Good for clusters with capacity headroom.
- **Blue-green clusters.** Stand up a new cluster on the target version. Migrate workloads via traffic shift. Tear down the old cluster. Expensive, fast, safe. Good for clusters where in-place would be a single point of failure during the operation.

For most teams I work with the answer is in-place with surge, and a blue-green only when crossing major API boundaries.

## What kills upgrades

Three classes of issue, in order of frequency:

1. **Custom controllers using removed APIs.** Someone shipped an operator three years ago that uses \`v1beta1\` of an API that no longer exists. The author left. Nobody knows what it does. Find these now, not on upgrade day.
2. **CNI / CSI version skew.** Your CNI vendor lags upstream by one or two minors. You will hit the wall when your target version drops support for the CNI's pinned API. Track your data plane's compatibility matrix in the same calendar.
3. **In-tree volume plugins.** If you still have any \`flexVolume\` or in-tree cloud provider stuff, you are on a clock. Migrate to CSI before the clock runs out, not when it does.

## The cultural part

The hardest part of this is not technical. It is convincing leadership that "we upgrade every quarter and nothing breaks" is the same achievement as "we shipped a feature". It looks like nothing happened. That is the point.

The way I sell it to clients is to keep a simple metric: weeks behind the n-1 target. If the number is zero, the platform team is doing their job. If the number drifts above eight, escalate. It is the cleanest reliability KPI you can give a non-technical exec, and it correlates with everything else that matters.

Upgrade as a habit. The day you treat it like a project is the day you have already lost.`
  },
  {
    id: 'p1-007',
    slug: 'slo-design-from-user-journeys',
    title: 'Stop Setting SLOs on Endpoints. Set Them on Journeys.',
    description: 'Most SLOs I see are bound to HTTP endpoints because that is what the dashboard makes easy. They are also useless. Here is how to design SLOs that mean something.',
    category: 'reliability',
    publishedAt: '2024-09-25',
    readingTime: 4,
    tags: ['slo', 'reliability', 'sre', 'observability'],
    references: [
      { label: 'sre.google: Service Level Objectives', url: 'https://sre.google/sre-book/service-level-objectives/' },
      { label: 'sre.google', url: 'https://sre.google/' },
      { label: 'OpenTelemetry docs', url: 'https://opentelemetry.io/docs/' },
      { label: 'dora.dev', url: 'https://dora.dev/' }
    ],
    content: `Most SLOs I review are useless. Not wrong. Useless. They are bound to HTTP endpoints because that is what the dashboard makes easy, they alert on things customers do not feel, and they go green during outages that cost real money.

The fix is not better thresholds. It is moving the level of abstraction up.

## The endpoint SLO trap

The default pattern in every monitoring tool: pick a service, pick its main endpoints, set a 99.9% availability SLO and a p99 latency SLO. Done. Page the on-call when the budget burns.

This produces a lot of theatre and not a lot of insight. Three reasons:

- A 99.9% SLO on \`POST /orders\` does not tell you whether anyone successfully placed an order today. The endpoint can be 100% available and the checkout flow still broken because step five depends on an inventory call that nobody scoped.
- Endpoint SLOs hide retries. Clients retry. The endpoint reports 99.95% success because nine out of ten failures get recovered by client retry. The user still feels the latency tax.
- Endpoint SLOs invite gaming. Decompose the endpoint into ten smaller endpoints, each with its own SLO, each green. The user experience is unchanged.

## Journey SLOs

A user journey is the smallest unit of business value. "Place an order." "Reset my password." "Search and click through to a result." "Stream a video for sixty seconds without buffering."

A journey SLO measures whether the journey succeeded, end to end, from the user's frame of reference. It does not care which microservices were involved.

Defining a journey SLO is more work than an endpoint SLO. That is the point. The work is what makes it useful.

## How to define one

Pick the journey. Be ruthless. You probably have five to ten that matter. Anything more and you are not prioritising.

For each, answer four questions:

1. **What does success mean from outside the system?** "The user got a 2xx" is not enough. "The order is durably persisted, the user got a confirmation, and the inventory was decremented" might be.
2. **Where do you instrument it?** Ideally at the edge. A synthetic test that exercises the full journey on a schedule is acceptable. Reading server logs and stitching them together is fragile. Distributed tracing across the journey is the right answer if you have it.
3. **What is the budget?** 99.5%? 99.9%? Higher numbers are not better. The right number is the one where, if you breach it, the business loses real money or trust.
4. **What latency floor matters?** Not the average. The p99 of the journey, end to end, including retries. Users feel tails.

## A worked example

For an e-commerce client, the checkout journey SLO looked like this:

- Definition: from \`/cart/checkout\` click to order confirmation page render.
- Success: order persisted, payment captured, confirmation rendered within 8 seconds at p95.
- Budget: 99.5% over a 28-day rolling window.
- Instrumentation: front-end RUM beacon at start and end, joined with a server-side trace ID.

The first month we ran it, the journey SLO was at 98.2% while every individual endpoint SLO was green. The gap was a payment provider intermittently returning 200 with an empty body. The endpoint logged success. The journey failed. The endpoint SLO had been green for two years through the same bug.

That is the entire point of journey SLOs. They catch the failures the system tells you do not exist.

## The pushback you will get

Two objections, both predictable:

- "Journey SLOs are hard to instrument across teams." Yes. That is a feature, not a bug. The work of defining the journey forces the teams that own its parts to agree on what success means. That conversation is more valuable than any dashboard.
- "We will breach the journey SLO and not know which team is at fault." Good. The blameless investigation that follows is more useful than a green endpoint dashboard with a quietly broken product.

## What to do next week

Pick one journey. The most revenue-critical one. Define a journey SLO for it using the four questions. Wire up instrumentation, even if it is hacky. Run it for a month.

You will discover at least one persistent failure mode that your endpoint SLOs hid. That is the ROI on the exercise.

After that, do the same for the next four journeys. Stop. Five to ten journey SLOs per product surface is plenty. Anything more and you are back to dashboard theatre.`
  },
  {
    id: 'p1-008',
    slug: 'monorepo-ci-caching',
    title: 'Your Monorepo CI Is Slow Because You Cache Wrong',
    description: 'I see the same six caching mistakes in every monorepo CI I audit. Fix them and pipelines drop from 40 minutes to 8.',
    category: 'devops',
    publishedAt: '2024-10-14',
    readingTime: 4,
    tags: ['ci-cd', 'monorepo', 'caching', 'devops'],
    references: [
      { label: 'GitHub Actions cache docs', url: 'https://docs.github.com/en/actions/using-workflows/caching-dependencies-to-speed-up-workflows' },
      { label: 'Bazel remote cache', url: 'https://bazel.build/remote/caching' },
      { label: 'Turborepo docs', url: 'https://turbo.build/repo/docs' },
      { label: 'Nx docs', url: 'https://nx.dev/' }
    ],
    content: `Every monorepo CI audit I do starts the same way. The team complains pipelines take 40 minutes. I read the config. The pipeline could take 8.

The same six mistakes show up in every codebase. Fix them in order.

## 1. You cache the package manager, not the build

Most teams cache \`node_modules\` or \`~/.m2\` or the Go module cache. That is fine. It saves a minute. The expensive thing in a monorepo is not dependency download. It is the build itself, run on every commit, on packages that did not change.

If your CI rebuilds package A on every commit, even when only package B changed, you are wasting most of the wall clock.

The fix is build-aware caching. Bazel, Nx, Turbo, Pants, take your pick. The tool reads inputs, hashes them, and skips work when the hash matches a cache entry. Done well, this turns a 40-minute pipeline into 4 minutes for the 90% of PRs that touch one package.

## 2. Your cache key is too coarse

Common pattern: cache key is \`os-${'$'}{hashFiles('package-lock.json')}\`. This invalidates the entire cache every time anyone bumps any dependency.

Better: scope cache keys per package. \`os-pkg-foo-${'$'}{hashFiles('packages/foo/package.json', 'pnpm-lock.yaml')}\`. Now a dependency change in package A does not nuke the cache for package B.

## 3. Your cache key is too fine

Equal and opposite mistake. Cache key includes the commit SHA, or the file mtimes, or some other thing that changes every commit. The cache never hits. You pay the upload cost on every run and the download cost never.

Cache keys should be content-addressed, not commit-addressed. Hash the actual inputs. The same inputs on two different commits should produce the same key.

## 4. You upload from every job

In a fan-out matrix, every shard tries to write to the cache. They race. The CI system either picks one and discards the others, or stores all of them and the next run gets non-deterministic hits. Either way you are paying network and storage for nothing.

Designate one job as the cache writer. All other jobs are read-only. If the writer fails, the cache stays at its previous good state. The reader jobs degrade gracefully.

## 5. Your remote cache lives in the wrong region

I have seen GitHub-hosted runners in us-east pulling cache artifacts from an S3 bucket in eu-west, paying 200ms of latency on every \`get\`, multiplied across a thousand cache lookups per build.

Put the cache in the same region as the runner. If you span regions, replicate. The cost of a replicated S3 bucket is rounding error compared to the engineering hours your builds are burning.

## 6. You do not cache test results

This one is the heretical fix. Most teams treat tests as something that must always run. Wrong. A test result is a function of:

- The test code.
- The code under test.
- The dependencies of both.
- The runtime environment.

Hash that input. If the hash matches a previous run that passed, skip the test. This is what Bazel's remote test execution does by default, and what Nx and Turbo do for unit tests.

The objection is "but what if the test is flaky and we want to re-run it". Fine. Cache only on green. A failed test never caches. Then your re-runs are still re-runs, and your green tests are skipped on identical inputs.

## The fastest CI I have built

For one client this year, a TypeScript monorepo with 80 packages and a thousand-engineer team:

- Cold build, full test suite: 22 minutes.
- Median PR (changes one package): 3 minutes.
- Cache hit rate, p50: 94%.

The pipeline does the boring things right. Build-aware tool (Turbo). Per-package cache keys. Designated writer job. Remote cache co-located with runners. Test result caching gated on green. That is it. No exotic tooling. No bespoke scripts.

## What I tell teams in week one

If your CI takes longer than 10 minutes for a one-package PR in a monorepo, you have a caching problem, not a compute problem. Throwing larger runners at it gets you 30%. Fixing the caching gets you 5x.

Start with build-aware caching. Get cache keys right. Move test caching last because it scares people. By the time you are done, your CI bill drops, your engineers stop context-switching during builds, and your DORA lead-time-for-changes number quietly halves.

The cache is the platform. Treat it like one.`
  },
  {
    id: 'p1-009',
    slug: 'terraform-module-patterns',
    title: 'Terraform Modules: Three Patterns That Survive Contact With Reality',
    description: 'Terraform module design is where most platform teams accidentally build a worse Kubernetes. Here are the three patterns that actually scale.',
    category: 'devops',
    publishedAt: '2024-10-30',
    readingTime: 4,
    tags: ['terraform', 'iac', 'platform', 'devops'],
    references: [
      { label: 'Terraform module docs', url: 'https://developer.hashicorp.com/terraform/language/modules' },
      { label: 'HashiCorp blog', url: 'https://www.hashicorp.com/blog' },
      { label: 'AWS Architecture Center', url: 'https://aws.amazon.com/architecture/' },
      { label: 'martinfowler.com', url: 'https://martinfowler.com/' }
    ],
    content: `Most Terraform module libraries I audit have one of three failure modes:

- A single mega-module per service that takes 60 inputs.
- A pile of tiny modules so granular the consumer rebuilds the AWS console in HCL.
- A "platform module" that abstracts so heavily that adding any new field requires a platform team PR.

All three are bad. The fix is to commit to one of three patterns and stay disciplined.

## Pattern 1: Composition modules

A composition module wraps a cloud primitive thinly. It encodes one or two opinionated defaults. It exposes the underlying resource's full surface as optional inputs.

Example: an S3 bucket module that:

- Defaults to private, encrypted, versioned, with TLS-only bucket policy.
- Exposes every other property of \`aws_s3_bucket\` as a passthrough.
- Returns the bucket and its ARN as outputs.

That is the entire module. 60 lines. Used everywhere.

The trap people fall into is adding a feature: "what if we also want to attach a Lambda notification". Now the module has a \`lambda_arn\` input, and a \`lambda_events\` input, and a count guard, and somewhere a sub-module. Stop. The composition module's job is to be a thin opinionated wrapper. Lambda notifications belong in the consumer's code, calling \`aws_s3_bucket_notification\` directly with the bucket output from your module.

When in doubt: the composition module owns the resource itself. It does not own anything that hangs off it.

## Pattern 2: Service modules

A service module composes multiple primitives into a deployable unit. "ECS service with ALB and Route53 and CloudWatch alarms." This is where the value of Terraform modules really sits, and also where most teams over-reach.

Two rules:

- A service module has at most one "main" resource it owns. Everything else is supporting.
- A service module is allowed to be opinionated. That is the whole point. Inputs should be product-shaped, not infrastructure-shaped. \`service_name\`, \`container_image\`, \`port\`, \`environment\`. Not \`alb_idle_timeout\`, \`target_group_deregistration_delay\`, \`route53_ttl\`.

If your service module has more than 15 inputs, you are encoding a generic platform, not a service. Split it.

## Pattern 3: Account-bootstrap modules

An account-bootstrap module is the thing you run once per AWS account, GCP project, or Azure subscription to lay down the baseline. IAM roles for humans and CI, a logging bucket, baseline VPCs, default KMS keys.

The key property: it is run rarely, and changes to it are reviewed like database migrations. It is not the thing you call from every service.

The mistake I see is teams putting baseline stuff inside service modules, "in case the account doesn't have it yet". This creates implicit ordering, drift, and wonderful 3am bugs where two services race to create the same logging bucket. Bootstrap belongs in its own pipeline.

## The three rules that actually matter

Across all three patterns, three rules:

### Pin everything

Module sources pinned to a tag. Provider versions pinned to a minor. Terraform CLI pinned in CI. The day you let any of these float, you have invited a Tuesday morning where nothing has changed in your code and everything is broken.

### Outputs are an API

Module outputs are a contract. Removing one is a breaking change. Renaming one is a breaking change. Changing the shape of one is a breaking change. Version your modules. Use SemVer. Mean it.

### State is a database

Treat state files like databases. They have backups (versioning on the bucket). They have access control. They have audit logs. They are not edited by hand. \`terraform state rm\` is a destructive operation and is treated as one.

## Where the patterns break down

Honest disclosure: at very large scale, the three-pattern model leaks. Once you have hundreds of teams writing thousands of services, you end up wanting some kind of higher-level abstraction. The market answer in late 2024 is some flavour of internal developer platform: Backstage, Crossplane, Humanitec, Port. They generate Terraform underneath instead of asking humans to write it.

That is fine and probably correct at that scale. But for the 95% of organisations who are not running thousands of services, the three-pattern module library is the right answer, and the worst thing you can do is jump to a heavier abstraction prematurely.

## What I actually ship

For most clients, the module library I leave behind is roughly:

- 10-15 composition modules for the core primitives in their cloud.
- 5-8 service modules for the deploy archetypes (web service, worker, scheduled job, queue consumer).
- 1 account bootstrap module per account class.
- One README per module, with examples and the tier.

That fits in one repo, one CI pipeline, and one engineer's head. Anything bigger and you are building a platform team's job, not a module library.`
  },
  {
    id: 'p1-010',
    slug: 'rag-vs-finetuning-2024',
    title: 'RAG vs Fine-Tuning: The Adult Conversation Nobody Is Having',
    description: 'Half the AI projects I see are fine-tuning when they should be RAG-ing. The other half are RAG-ing when they should be fine-tuning. Here is the actual decision.',
    category: 'ai',
    publishedAt: '2024-11-04',
    readingTime: 4,
    tags: ['rag', 'fine-tuning', 'llm', 'ai'],
    references: [
      { label: 'OpenAI fine-tuning guide', url: 'https://platform.openai.com/docs/guides/fine-tuning' },
      { label: 'Anthropic news', url: 'https://www.anthropic.com/news' },
      { label: 'Pinecone learn', url: 'https://www.pinecone.io/learn/' },
      { label: 'OpenAI index', url: 'https://openai.com/index/' }
    ],
    content: `If I have one consulting conversation more than any other in 2024 it is this one:

"We want to fine-tune a model on our data."
"What is the actual problem?"
"The model doesn't know things about our company."

The answer is RAG. Not fine-tuning. The conversation goes the same way every time and most of the industry is still getting it wrong.

## The decision in one sentence

Fine-tuning teaches a model how to behave. RAG teaches a model what to know. Most enterprise problems are about knowledge, not behaviour. Therefore most enterprise problems are RAG problems.

That is the whole post in one paragraph. The rest is the wreckage I see when teams ignore it.

## What fine-tuning is good for

There is a real, narrow set of problems where fine-tuning is the right answer:

- Output format. Always returning JSON in a specific schema. Always answering in a specific tone. Always using a specific glossary.
- Behaviour. Refusing certain topics. Always thinking step-by-step. Following an unusual response protocol.
- Compression. Distilling a frontier model's behaviour into a smaller, cheaper model that runs on your infrastructure. This is the underrated one and it is huge if you have the volume.
- Domain-specific reasoning patterns the base model genuinely does not have. Legal-specific argument structures. Medical differential diagnosis flow. Code-specific refactoring patterns for an obscure language.

That is roughly it. None of those involve "knowing things about your company".

## What RAG is good for

Everything else. The shape of an enterprise AI use case is almost always:

- The user asks a question.
- The answer is in our documents.
- The model needs to find the right document and answer from it.

That is RAG. Embed your documents. Index them. Retrieve at query time. Stuff the relevant chunks into the prompt. Let the model reason.

Done well, RAG gets you 80% of the way to "the model knows about our company" with two weeks of engineering and a vector database. Done badly, RAG produces confident hallucinations that reference documents that do not exist. The difference between the two is mostly retrieval quality, which is mostly chunking, which is the part everyone underinvests in.

## Why teams reach for fine-tuning anyway

Three reasons, all bad:

1. **It sounds more sophisticated.** Fine-tuning has a research aura. RAG sounds like search. Engineers and execs both prefer the prestigious option.
2. **It feels more "ours".** Fine-tuning produces a model artifact you own. RAG produces a pipeline. Ownership feels better even when the outcome is worse.
3. **The vendor encouraged it.** Some vendors sell training infrastructure. Of course they want you fine-tuning. Watch the incentives.

The cost of getting this wrong is not subtle. A fine-tune for "knowledge injection" produces a model that:

- Confabulates the data more confidently than the base model would have.
- Cannot be updated without retraining when the underlying data changes.
- Is impossible to audit. You cannot ask "where did that fact come from".
- Is locked to one model version. When the next frontier model lands, you fine-tune again.

A RAG system has none of those problems by construction.

## When you do both

Sometimes the right answer is both. You fine-tune for behaviour and tone. You RAG for knowledge. Customer support is the canonical example: fine-tune so the model writes in your brand voice and follows your escalation rules, then RAG so it cites the actual current product documentation rather than the version it saw during training.

In that hybrid, fine-tuning is the small layer (formatting, tone, guardrails) and RAG is the large layer (the substance of the answer). If your fine-tune is doing knowledge work, you have the layers inverted.

## A practical decision tree

When a client asks me "should we fine-tune", I run them through this:

1. Does the model already know how to do the task in principle, but you want it to do it with your specific information? RAG.
2. Does the model fail to do the task at all, regardless of context? Fine-tune, but only after you have tried prompting hard.
3. Does the task always produce a specific structured output that prompting cannot reliably enforce? Fine-tune.
4. Are you trying to make a smaller cheaper model behave like a bigger one on a narrow workload? Fine-tune.
5. Do you want the model to "be an expert in our domain"? RAG. Always RAG. This is never fine-tuning, no matter what the vendor said.

That tree handles 95% of the cases I see. The 5% that genuinely need both are obvious when you get there.

## Closing thought

The fine-tuning industry will not love this post. That is fine. The industry has spent two years selling training as the answer to problems that were really retrieval problems. Some of that was honest enthusiasm. Some of it was upselling. The 2025 conversation needs to be more disciplined, and it starts with engineers being able to tell their executives "we don't need to fine-tune, we need to retrieve better".`
  },
  {
    id: 'p1-011',
    slug: 'kubecon-2024-takeaways',
    title: 'KubeCon 2024: The Boring Stuff Won, As It Should',
    description: 'Two KubeCons this year, Paris in March and Salt Lake City in November. The headline is that Kubernetes finished growing up.',
    category: 'business',
    publishedAt: '2024-11-20',
    readingTime: 4,
    tags: ['kubecon', 'kubernetes', 'cncf', 'events'],
    references: [
      { label: 'CNCF', url: 'https://www.cncf.io/' },
      { label: 'KubeCon EU 2024', url: 'https://www.cncf.io/kubecon-cloudnativecon-events/' },
      { label: 'kubernetes.io blog', url: 'https://kubernetes.io/blog/' },
      { label: 'opentelemetry.io', url: 'https://opentelemetry.io/' }
    ],
    content: `I was at both KubeCons this year. Paris in March. Salt Lake City in November. The headline takeaway is unromantic and important: Kubernetes finished growing up.

The ecosystem has stopped chasing novelty. The big talks are about operations, cost, and integration with the rest of the business. The hallway conversations are about hiring, migrations from older platforms, and platform engineering. The vendor floor is consolidating. This is what a mature technology looks like.

## What dominated Paris

Three threads ran through KubeCon EU:

**Platform engineering as a discipline.** Backstage, Crossplane, Port, Humanitec, all framed as ways to give application developers a paved path. The sub-text was "Kubernetes is too complex for product teams to use directly, here is the abstraction layer". I agree with the diagnosis. The market has not picked a winner yet.

**OpenTelemetry as the default observability story.** Five years in, OTel has become the spec everyone agrees on. Vendors that fought it lost. Vendors that embraced it are now selling backends, not collection. The collection layer has commoditised, which is the right outcome.

**WASM as the next runtime, maybe.** The third year in a row this was the "next year" story. I am still not betting on it for production workloads, but the tooling is real and the use cases are getting clearer. Edge compute, plugin sandboxing, polyglot extensions in databases. Not a Kubernetes replacement.

## What dominated Salt Lake City

Different feel. Smaller crowd than Chicago 2023. More serious. Fewer "we're hiring" t-shirts and more enterprise architects with actual problems.

**AI workloads on Kubernetes.** The big shift. GPU scheduling, multi-tenant GPU sharing, model serving frameworks (KServe, vLLM operators), inference autoscaling. A year ago this was a side track. In Salt Lake it was the main story. The cluster admins who spent a decade arguing about pod density are now arguing about MIG slicing on H100s.

**Cost and FinOps.** Three years ago every talk was "scale to a million pods". Now the talks are "we ran a million pods and the bill was insane, here is how we cut it 60%". OpenCost graduated. Karpenter is everywhere. Spot/preemptible adoption is finally mainstream.

**Security pipelines.** Sigstore, SLSA, in-toto, policy-as-code with OPA and Kyverno. The supply chain conversation is no longer aspirational. Real teams shipping signed artifacts, attesting build provenance, enforcing policy at admission. The Solarwinds-shaped scar tissue is finally producing tooling.

## What was conspicuously absent

Service mesh hype. Istio is fine, Linkerd is fine, the religious war is over and most teams have decided whether they need a mesh or not. The talks were operational, not evangelical.

## The vendor pattern

The ecosystem is consolidating. Two patterns:

- Big clouds absorbing capabilities. EKS Auto Mode, GKE Autopilot, AKS-but-managed-better. The "do I need to manage my own control plane" question has a clear answer for most teams, and it is "no".
- Mid-size vendors pivoting to platforms. Old monitoring vendors becoming "AI observability" vendors. Old config management vendors becoming "platform engineering" vendors. Old service mesh vendors becoming "zero trust networking" vendors. Some of these pivots are real and some are press releases.

If you are evaluating tooling in early 2025, the question to ask is "does this help us run things in production" not "is this technology cool". The answer separates real vendors from the rest very quickly.

## The hallway track that mattered

I had three conversations that have stuck:

- A platform lead at a mid-size bank: "We stopped trying to build the perfect platform. We built the boring one. Now developers like us."
- An SRE at a hyperscaler: "Half our toil is still YAML. Not Kubernetes' fault, but the abstraction never landed where it needed to."
- A CTO at a Series B startup: "I would not start on Kubernetes today for a five-engineer team. Fly.io, Render, ECS, anything else. The complexity tax is too high."

That last one is the post-honeymoon honesty the ecosystem needed for a long time. Kubernetes is not the right answer for everyone. It is the right answer for a specific set of problems at a specific scale. Maturity means we can say that out loud.

## What I am taking back to clients

Three things I am pushing into client engagements off the back of these two conferences:

1. If you have not adopted OpenTelemetry by mid-2025 you are paying a vendor lock-in tax for no reason.
2. If your platform team is not measuring developer experience, your platform is invisible at best and resented at worst.
3. If you are running GPU workloads on the cluster, treat them as a different class of resource with different scheduling, different SLOs, and probably different teams. Mixing them with regular pod scheduling is a footgun.

KubeCon 2025 will be all of this, more, and more boring. Boring is good.`
  },
  {
    id: 'p1-012',
    slug: 'nat-egress-hidden-cost',
    title: 'NAT Gateway Egress Is Eating Your AWS Bill',
    description: 'A client paid $14k a month in NAT Gateway data processing charges they did not know existed. Here is the math, the diagnosis, and the fix.',
    category: 'cloud',
    publishedAt: '2024-12-03',
    readingTime: 4,
    tags: ['aws', 'finops', 'networking', 'cost'],
    references: [
      { label: 'AWS NAT Gateway pricing', url: 'https://aws.amazon.com/vpc/pricing/' },
      { label: 'AWS VPC Endpoints', url: 'https://docs.aws.amazon.com/vpc/latest/privatelink/vpc-endpoints.html' },
      { label: 'AWS Architecture Center', url: 'https://aws.amazon.com/architecture/' },
      { label: 'AWS Cost Explorer docs', url: 'https://docs.aws.amazon.com/cost-management/' }
    ],
    content: `A client called me in to look at an AWS bill that had drifted up by $40k a month over a year. The CFO wanted to know why. The platform team thought it was "just growth". When I dug in, $14k of the increase was a single line item: NAT Gateway data processing.

This is the most common hidden AWS cost I run into. Every time. Here is the math, the diagnosis, and the fix.

## The pricing nobody reads

A NAT Gateway in AWS costs:

- Roughly $0.045 per hour. About $33 a month. Fine.
- Roughly $0.045 per GB processed. This is the killer.

Note that data processing applies to traffic in both directions. Outbound to the internet, inbound from the response, both billed.

If your private subnet pushes 10TB a month through a NAT Gateway, the data processing charge alone is $450. If it pushes 300TB, it is $13,500. Plus regional cross-AZ transfer if your NAT Gateway is in a different AZ from your workload.

Most teams design the network in week one and never look at the cost again. By year three, the application that started at 100 GB a month is at 200 TB a month, and the bill has quietly compounded.

## What was actually happening

For this client, three patterns combined:

1. **S3 traffic going via NAT.** Their workload talked to S3 for object storage. S3 lives on the public AWS endpoint. The traffic went through the NAT Gateway. Every GB pulled from S3 was billed at NAT processing rates. They could have used a Gateway VPC Endpoint for S3, which is free.
2. **ECR pulls via NAT.** Every container image pull, on every pod start, on every deploy, on every autoscaler scale-out, went through the NAT. Across hundreds of services and rolling deploys, this was many TBs a month. ECR has an Interface Endpoint that costs hourly but kills the per-GB charge.
3. **Cross-AZ NAT.** Their default subnet layout put one NAT per AZ for HA, but their Kubernetes nodes routed all NAT traffic through a single AZ's NAT due to a misconfigured route table. So they paid cross-AZ data transfer plus NAT processing on top.

Total preventable: $14k a month. The fix took a sprint.

## The diagnosis playbook

Before you change anything, find out where the traffic is going. The order I run this:

1. **Cost Explorer with usage type filter.** Filter for \`USE1-NatGateway-Bytes\` (or your region equivalent). This tells you the size of the problem.
2. **VPC Flow Logs.** Enable them on the NAT subnet for a day. Aggregate by destination. The top destinations will be obvious. If S3, ECR, DynamoDB, or any AWS service is in the top five, you have a VPC endpoint problem.
3. **Cross-AZ check.** Look at the Flow Logs source/destination AZs. If most NAT traffic is leaving an AZ different from where it originated, you have a routing problem.

That is enough to scope the fix.

## The fix

In order of cost-impact-per-effort:

### Use Gateway Endpoints for S3 and DynamoDB

Gateway Endpoints are free. They route S3 and DynamoDB traffic privately, bypassing the NAT entirely. There is no good reason not to have them in every VPC that talks to S3 or DynamoDB. If your IaC does not provision them, fix the module.

### Use Interface Endpoints for chatty AWS services

ECR (both \`ecr.api\` and \`ecr.dkr\`), Secrets Manager, SSM, KMS, STS. These are the high-volume ones for most workloads. Interface Endpoints cost about $7 per endpoint per AZ per month plus a per-GB charge that is much lower than NAT processing. The break-even is low. If you push more than 50GB a month to an AWS service, an Interface Endpoint pays for itself.

### Fix cross-AZ routing

Each AZ's private subnets should route to that AZ's NAT. Sounds obvious. Half the IaC modules I see get it wrong because someone copy-pasted a route table.

### Consider NAT alternatives for very high egress

If your egress is dominated by one or two destinations, look at:

- A small fleet of EC2 instances running a NAT proxy. Higher operational cost, dramatically lower data charges at scale.
- For ECR specifically, pull-through cache hosted in a private registry inside the VPC.

These are last-resort options for the few teams pushing petabytes a month. Most teams do not need them.

## The cultural part

The reason this bug compounds is that nobody owns the network cost. The platform team owns "the platform". The product teams own "the product". Networking sits between them and gets ignored.

The fix is to put NAT processing into the FinOps dashboard alongside compute and storage. When a single line item crosses 5% of the bill, somebody notices, somebody investigates, and somebody fixes. Without that visibility, $14k a month vanishes into the noise of "AWS spend went up".

## What I add to every audit

Three line items I now check on every cloud cost audit:

- NAT Gateway data processing.
- Cross-AZ data transfer.
- Inter-region data transfer.

These three are the silent assassins of cloud bills. Find them, fix them, and most teams free up enough budget for the project they thought they could not afford.`
  },
  {
    id: 'p1-013',
    slug: 'aws-savings-plans-done-right',
    title: 'AWS Savings Plans: The Right Way to Buy Commitment',
    description: 'Most teams buy Savings Plans wrong. They underbuy, overbuy, or buy the wrong type. Here is the framework I use with clients.',
    category: 'cloud',
    publishedAt: '2024-12-15',
    readingTime: 4,
    tags: ['aws', 'savings-plans', 'finops', 'cost'],
    references: [
      { label: 'AWS Savings Plans', url: 'https://aws.amazon.com/savingsplans/' },
      { label: 'AWS Cost Management', url: 'https://aws.amazon.com/aws-cost-management/' },
      { label: 'AWS Cost Explorer recommendations', url: 'https://docs.aws.amazon.com/cost-management/latest/userguide/ce-rightsizing.html' },
      { label: 'AWS Architecture Center', url: 'https://aws.amazon.com/architecture/' }
    ],
    content: `Every quarter I look at a client's Savings Plans coverage and have the same conversation. They are at 40% coverage. AWS told them to commit more. They are nervous about over-committing. Could I take a look.

Yes. Here is how I think about it.

## The three flavours, briefly

AWS Savings Plans come in three types:

- **Compute Savings Plans.** Apply to EC2, Fargate, Lambda. Up to about 66% discount. Maximum flexibility: any region, any family, any tenancy.
- **EC2 Instance Savings Plans.** Apply to a specific EC2 instance family in a specific region. Up to about 72%. Less flexible.
- **SageMaker Savings Plans.** Apply to SageMaker. Niche.

Reserved Instances still exist alongside these and behave similarly. The mental model below applies to RIs too.

The temptation is to chase the deepest discount. That is a mistake. The flexibility is worth more than the extra 6% in almost every realistic scenario.

## The framework

Three questions, in order:

### 1. What is your committed steady-state floor?

Look at your last 12 months of compute spend. Plot it daily. The bottom of that curve is your floor: the level of compute you have run for every day of the last year, no exceptions. That floor is what you should buy Savings Plans against.

If your floor is $80k a month, buy Savings Plans for $80k a month. Not $90k. Not $70k. The floor.

The mistake teams make is buying against their average. Average is too high. If your average is $100k and your floor is $80k, buying $100k of commitment means in the bottom 30% of months you are paying for compute you did not use. The discount on the part you did use does not make up for the waste on the part you did not.

### 2. How much of that floor should be Compute vs EC2 Instance plans?

Default answer: 100% Compute Savings Plans.

The 6-percent-extra discount on EC2 Instance plans is not worth the inflexibility for most teams. The moment you change instance family, switch a workload to Fargate, or move to a different region, an EC2 Instance plan stops applying and you are paying on-demand again.

I make exceptions for two cases:

- A workload that is genuinely pinned. A fleet of \`r6i\` boxes running a database that nobody is going to migrate for two years. Buy EC2 Instance plans for that fleet.
- A workload large enough that 6% is meaningful money in absolute terms. If you are running $5M a month of a single instance family, 6% is $300k a year and the inflexibility is acceptable.

For everyone else, Compute Savings Plans, no exceptions.

### 3. One year or three years?

One year. Almost always.

The discount delta between 1-year and 3-year is usually 10-15 percentage points. Sounds tempting. The problem is that the cloud market in 2024 is moving fast. Graviton 3, Graviton 4, Trainium, Inferentia, the next generation of instance families. A 3-year commitment locks you out of the optimisation curve.

I make exceptions when:

- The workload is genuinely fossilised and not going to change. Stable enterprise SaaS, regulated workloads, anything that has not changed in three years and will not.
- The customer is large enough that the negotiated EDP discount on top of the 3-year SP changes the math materially.

For everyone else, 1-year. Renew. Re-evaluate every renewal.

## The buying cadence

Do not buy Savings Plans once a year as a Big Project. Buy them quarterly:

- Each quarter, look at the trailing 90 days of usage.
- Recalculate your floor.
- Top up your commitment to that floor.
- If the floor dropped, do not panic. The existing commitment continues to apply where it can.

This keeps you tracking the floor without ever overcommitting. The mistake is making one big commitment in January and then doing nothing for a year while the workload changes underneath.

## Common mistakes I see

- **Buying based on AWS's recommendation tool without sanity-checking.** The recommendation engine is good but it does not know your roadmap. If you are migrating off EC2 to ECS Fargate next quarter, AWS does not know that. You do.
- **Mixing Savings Plans across accounts without a sharing strategy.** In an Organization, Savings Plans share by default. Make sure that is what you want. Sometimes it is not.
- **Paying upfront when there is no reason to.** All-upfront gets you a marginal extra discount. Partial-upfront and no-upfront are fine. If the company has cash that should be earning interest, do not give it to AWS for a 1.5% extra discount.
- **Ignoring Lambda and Fargate.** Compute Savings Plans cover both. If your serverless spend is non-trivial, you are leaving money on the table by not including it in the floor calculation.

## What "doing it right" looks like

For one mid-size client this year:

- 92% Savings Plans coverage on a $4M annual compute spend.
- 100% Compute Savings Plans, no EC2 Instance plans.
- 1-year terms, refreshed quarterly.
- Net savings versus on-demand: about 38%.

That is roughly the realistic ceiling for most workloads. If you are below 30% effective discount on your compute, you have headroom. If you are at 50%, somebody is being clever. If you are at 60%+, somebody is being clever and lucky and the next workload change will hurt.

Buy the floor. Stay flexible. Re-evaluate every quarter. That is the whole game.`
  },
  {
    id: 'p1-014',
    slug: 'cursor-vs-copilot-late-2024',
    title: 'Cursor vs Copilot, Late 2024: The Honest Comparison',
    description: 'I have used both daily for a year. Here is what each is actually good at, what each is bad at, and which I would pay for if I had to pick one.',
    category: 'ai',
    publishedAt: '2025-01-08',
    readingTime: 4,
    tags: ['cursor', 'copilot', 'ai-tools', 'developer-experience'],
    references: [
      { label: 'Cursor', url: 'https://www.cursor.com/' },
      { label: 'GitHub Copilot', url: 'https://github.com/features/copilot' },
      { label: 'GitHub blog', url: 'https://github.blog/' },
      { label: 'TechCrunch', url: 'https://techcrunch.com/' }
    ],
    content: `I have used Cursor and GitHub Copilot daily for a year, side by side, on real client work. People keep asking which is better. Here is the honest comparison.

The headline: they are not the same product. They overlap on autocomplete and diverge everywhere else. The right answer depends on what you actually do all day.

## Where Copilot wins

Copilot is best at three things:

**Inline completion in legacy codebases.** Copilot's strength is its training distribution and its tight integration with the IDE. In a big enterprise codebase with lots of imports, lots of conventions, lots of established patterns, Copilot's inline suggestions feel like the codebase is finishing your sentences. It is unobtrusive. It is fast. It rarely blocks.

**The Microsoft estate.** If your company runs on GitHub, Visual Studio, VS Code, and Azure DevOps, Copilot is a button-click and a line item. Procurement is solved. Compliance is solved. Telemetry is in the same dashboards. That matters more than people admit.

**The chat is fine.** It is not the best chat. It is fine, integrated, and good enough that you do not have to context-switch.

## Where Cursor wins

Cursor wins on the things that matter when you are writing significant new code, not just maintaining old:

**Multi-file edits.** Cursor's "composer" can plan changes across multiple files. Copilot's chat can do this too now, but Cursor is noticeably better at it. The difference is whether the model maintains context across the edits or repeatedly re-discovers the codebase.

**Explicit context control.** Cursor lets you pin specific files into the context. You can drop a Helm chart, a Terraform module, and the Go service it provisions into one chat and ask architecture-level questions across them. Copilot's context is more opaque and feels narrower.

**Model choice.** Cursor exposes the model choice to the user. You can flip between Claude 3.5 Sonnet and GPT-4o for the same task and feel the difference. Copilot is whatever GitHub picked. Currently that is good. It is not always going to be the best frontier model.

**Speed of iteration.** Cursor ships features fast. Sometimes too fast and rough, but the velocity is real. Copilot moves at GitHub's release cadence, which is slower.

## Where they tie

- Inline completion quality on mainstream languages: roughly equivalent in 2024. Both are good.
- Privacy of code in flight: both are configurable, both are acceptable for most teams, both have enterprise tiers with stronger guarantees.
- Pricing: comparable for individuals, comparable for teams. Not a deciding factor.

## What I actually do

I run both. Cursor is my primary editor for greenfield work and architectural changes. Copilot lives in my VS Code instance for the legacy codebases where I do not want a different editor. They cost about $40 a month combined and I would not want to give either up.

If I had to pick one tomorrow:

- For a startup engineer doing mostly greenfield work in a small team: Cursor.
- For an enterprise engineer doing mostly maintenance and feature work in a large existing codebase: Copilot.
- For a platform engineer like me, working across many repos in many languages: Cursor, narrowly.

## What is overhyped

A few things people say about both that I want to push back on:

**"It writes 50% of my code."** The github metric. Look closely. It writes 50% of the lines in PRs measured by some accept-rate methodology. It does not write 50% of the value. Most of the lines in any codebase are boilerplate that the AI is good at. The hard part, the design decisions, the gnarly bits, is still you.

**"Junior engineers don't need to learn fundamentals because the AI handles them."** No. Junior engineers who lean on AI without understanding what it produces are accumulating debt that will surface in their second year. The right mental model is "AI as a pair programmer who is fast and confidently wrong sometimes". You still need to know what wrong looks like.

**"It will replace developers."** It will not in 2025. It will change what developers do, the same way IDEs and search engines did. The job is shifting from typing code to specifying problems and reviewing solutions. People who adapt thrive. People who do not, do not.

## What is underhyped

The thing nobody talks about: AI coding tools change the cost of software in a way that compounds at the team level. A team that adopts these tools well writes more code, refactors more aggressively, and explores more designs than a team that does not. The gap is not 10%. Over a year, in my experience, it is closer to 30-40% on greenfield work.

That gap is not visible in any individual day. It is visible in the quarterly delivery numbers.

If you are running a team and have not made AI tooling a first-class part of your developer experience, you are leaving compounding productivity on the floor. The right answer is not "let people use it if they want". The right answer is to standardise on a tool, train the team on how to use it well, and treat its adoption as a platform investment.

This is the boring conclusion. Pick a tool. Use it deliberately. Measure. Adjust. The vendors will keep iterating and so should you.`
  },
  {
    id: 'p1-015',
    slug: 'aws-reinvent-2024-takeaways',
    title: 'AWS re:Invent 2024: Two Real Things and a Lot of Noise',
    description: 'I sat through more re:Invent keynotes than I care to admit. Most of it was repackaging. Two announcements actually matter for the work I do.',
    category: 'business',
    publishedAt: '2025-01-20',
    readingTime: 4,
    tags: ['aws', 'reinvent', 'events', 'cloud'],
    references: [
      { label: 'AWS re:Invent', url: 'https://reinvent.awsevents.com/' },
      { label: 'AWS news blog', url: 'https://aws.amazon.com/blogs/aws/' },
      { label: 'AWS Architecture Center', url: 'https://aws.amazon.com/architecture/' },
      { label: 'TechCrunch', url: 'https://techcrunch.com/' }
    ],
    content: `re:Invent 2024 was a lot of keynote and not much breakthrough. AWS shipped roughly 200 announcements across the week. About 180 of them are repackaging, integration polish, or "it has AI now" rebranding. Two are genuinely worth your time.

This is what survives the noise.

## The two real things

### 1. S3 Tables

S3 Tables is S3 with native Iceberg support, plus background optimisation that handles compaction and snapshot management for you. It is a proper data lakehouse primitive at S3 prices, with the operational characteristics of a managed service.

This is a big deal. Iceberg has been the de facto open table format for two years. Until now, running it in production meant either a vendor (Tabular, Snowflake, Databricks) or running your own compaction jobs and praying. S3 Tables handles the maintenance burden directly.

What I expect this to do over the next year:

- Kill or absorb a chunk of the open table format vendor market. Tabular got bought by Databricks earlier in 2024 anyway. The remaining independent vendors have a thinner story.
- Make Iceberg the default for new analytical workloads on AWS. Athena, EMR, and Glue all integrate.
- Start a slow migration of existing Parquet-on-S3 data lakes to table-format-on-S3. The migration is non-trivial but the operational win is real.

If you run analytics on AWS, look at S3 Tables this quarter. If you do not, ignore.

### 2. Trainium 2 in serious production form

Trainium 2 has been talked about for over a year. At re:Invent it actually shipped in usable instance types with credible price-performance for training and inference. The bigger story is the Trn2 UltraServer setup with 64 chips wired together for very large model training.

The headline is not "AWS competes with NVIDIA". They do not, head to head. The headline is that for inference workloads on existing models, Trainium 2 is now cheap enough and capable enough that the calculus changes. For specific frontier-adjacent workloads it is competitive.

The other thing nobody is reading: AWS is partnering with Anthropic on a giant Trainium-based training cluster. That is the strategic bet. AWS does not need to win the chip wars. They need a credible non-NVIDIA option for hyperscale customers and a marquee model partner that uses it. Both are now real.

For most engineering teams this changes nothing today. By 2026 it might change everything about your inference cost structure.

## The "AI" rebranding tier

A lot of the announcements are existing services with a Bedrock integration bolted on. RDS, Glue, OpenSearch, you name it, they all have an AI button now.

Some of this is genuinely useful. Bedrock Agents is improving slowly. Bedrock Guardrails is meaningfully better than building safety filters yourself. The Q tooling for Connect (call centre) is real productivity for that specific vertical.

Most of it is noise. If you do not have an active use case for "I want this database to suggest queries to me", you are not going to develop one because AWS shipped a button.

## What surprised me

A few smaller announcements that did not get the keynote time but matter:

- **EKS Auto Mode.** AWS finally shipped a "you don't have to manage the data plane either" mode for EKS. This is GKE Autopilot for EKS, and overdue. For teams that wanted Kubernetes without the operational tax, this is now a real option.
- **Aurora DSQL.** A distributed PostgreSQL-compatible service with active-active multi-region writes. The technical claims are bold. I am withholding judgement until people run real workloads on it. If they hold up, this changes the math on global multi-region apps.
- **CloudWatch Logs improvements.** Long-overdue ergonomics. Search across log groups. Better integration with traces. Honest small wins.

## What was conspicuously absent

No major networking simplification. The AWS networking surface remains a baroque cathedral of VPCs, subnets, route tables, transit gateways, PrivateLink endpoints, RAM shares, and one Direct Connect for spice. Every year I hope re:Invent will simplify this and every year it does not.

No serious answer to Cloudflare in the edge layer. Lambda@Edge and CloudFront Functions are fine. They are not what Cloudflare Workers are. AWS has decided to lose the edge developer story to Cloudflare and that is increasingly visible.

No Graviton 5 announcement, which suggests the cadence has slowed slightly. Graviton 4 is still rolling out across instance families. That is fine but worth noting.

## What I am telling clients

Three concrete actions off the back of re:Invent 2024:

1. Look at S3 Tables for any new analytical workload. Skip the migration discussion for existing data lakes unless the operational pain is real.
2. Watch Trainium 2 pricing into Q1 2025. If you run a lot of inference and your current spend is dominated by GPU on-demand, there will be a real arbitrage opportunity once supply ramps.
3. Re-evaluate EKS Auto Mode for any cluster that is currently a small platform team's full-time job. The savings in operational hours are likely larger than the price premium.

The rest you can read on the AWS news blog when you have time. Most of it will not change anything for you.`
  },
  {
    id: 'p1-016',
    slug: 'secrets-rotation-as-habit',
    title: 'Secrets Rotation Is a Habit, Not a Project',
    description: 'Every team I audit treats secrets rotation as a one-time project. Six months later their secrets are stale again. Here is how to make it a habit instead.',
    category: 'security',
    publishedAt: '2025-02-10',
    readingTime: 4,
    tags: ['secrets', 'security', 'rotation', 'devops'],
    references: [
      { label: 'AWS Secrets Manager', url: 'https://aws.amazon.com/secrets-manager/' },
      { label: 'HashiCorp Vault', url: 'https://www.vaultproject.io/' },
      { label: 'sigstore.dev', url: 'https://www.sigstore.dev/' },
      { label: 'NIST Special Publications', url: 'https://csrc.nist.gov/publications' }
    ],
    content: `Every security audit I do includes a sentence in the findings: "secrets rotation is not happening on a regular cadence". Every time. The team agrees, makes a project of rotating everything, and six months later their secrets are stale again.

The shape of the fix is the same as Kubernetes upgrades. Make it a habit, not a project, and the problem stops compounding.

## Why the project approach fails

Secret rotation as a project looks like this:

- Quarterly security review flags stale credentials.
- Team forms a "credential rotation working group".
- Rotates everything over six weeks of painful, error-prone work.
- Working group dissolves.
- Six months later, same finding in the next audit.

The rotation effort is wasted because there is no mechanism to keep it that way. The fix is not "do the project better". It is "stop having projects".

## The four classes of secret

Different secrets have different rotation logics. Conflating them is part of why teams stall.

### 1. Machine secrets that the system should rotate itself

Database passwords for service accounts. API keys between internal services. Access tokens for cloud providers. These should be rotated by automation on a fixed cadence (30, 60, 90 days, pick one) without any human in the loop.

The pattern is well-trodden. AWS Secrets Manager handles RDS passwords. Vault handles dynamic credentials for many backends. Workload identity federation (IRSA on EKS, Workload Identity on GKE) replaces long-lived service-account keys with short-lived tokens.

If you have any service in 2025 still using a static long-lived API key from a cloud provider, that is a finding. The fix is workload identity, not "rotate the key more often".

### 2. Human-held secrets

SSH keys, personal access tokens, MFA seeds. Different problem entirely. Rotation here is about humans changing them, which means it is about adoption, not technology.

The right answer is to stop having human-held long-lived secrets where possible. SSO everywhere. Short-lived tokens via SSO/OIDC. SSH via a CA that signs short-lived certs. PATs replaced with OAuth flows.

Where that is not possible, age out the secrets aggressively and trust the user to renew. 90 days max for a PAT. The friction of rotation is the friction of caring about security, and it is fine.

### 3. Cryptographic keys

Signing keys, encryption keys, root CAs. Rotation here is high-stakes, low-frequency, and needs a different process. Annual to multi-year cadence depending on the key. The work is in the key hierarchy: the root keys rotate rarely, the leaf keys rotate often, the boundaries are clean.

If your signing infrastructure does not have this hierarchy, that is the project. Build it once. Then the leaves rotate themselves.

### 4. Third-party secrets

Stripe API keys. Twilio tokens. The hundred SaaS vendors your product depends on. These are the ones that get forgotten. They sit in environment variables, sometimes in source control (please not), and nobody owns rotating them.

The fix is twofold. One: catalogue them. Every third-party secret needs an owner and a rotation cadence. Two: pull them all into the same secret store the rest of your machine secrets live in. From there, rotation is at least manual but uniform. From there, you can build automation per vendor.

## The habits that actually work

Three practices that move teams from "rotation is a project" to "rotation is a habit":

### Burn-in alarms

For every secret in your store, attach an alarm that fires when the secret has not rotated in N days. N depends on the class. The alarm goes to the team that owns the secret. The alarm is a paging-priority alert, not an email.

Most teams have these for certificates and nothing else. The same logic should apply to every credential of consequence.

### Secret store as the only source of truth

If a service reads a secret from anywhere other than the secret store at runtime, it is a problem. Environment variables baked into images are problems. Files mounted from a VCS are problems. The store has to be the only path, because that is the only place rotation is feasible.

This is more architectural work than people think. It is also the unblocker for everything else.

### Drill it like an incident

Once a quarter, pick a high-impact secret, rotate it manually, and time how long the rotation takes from "decide to rotate" to "old credential is dead and removed from everywhere". The first time you do this it will take days and break things. Each subsequent drill will be faster.

The drill exposes the rotation paths that do not work. That is the point. You are not actually responding to a compromise; you are practising for one.

## The cultural part

Rotation as a habit only works if leadership treats it as a baseline, not a heroic effort. The way I sell this to clients: track two metrics on the security dashboard. Median age of credentials in the secret store. Number of credentials older than the rotation policy.

Both should be small and trending small. If the median age is climbing, the team has lost the habit, and that is a leading indicator of the next breach. The metric is the discipline.

## Where to start

If you are reading this and your secrets rotation is currently a project that someone schedules every other quarter, do this in order:

1. Inventory. You probably have more long-lived secrets than you think.
2. Classify. Machine, human, cryptographic, third-party.
3. Eliminate the long-lived ones you can replace with workload identity or SSO.
4. Rotate the rest on a calendar.
5. Drill quarterly.

It is not glamorous. It is the difference between an organisation that has a small ongoing security cost and one that has a periodic catastrophic one.`
  },
  {
    id: 'p1-017',
    slug: 'freelance-contractor-market-2024',
    title: 'The 2024 Freelance Contractor Market: AI Hit, but Not the Way Twitter Said',
    description: 'Twitter said AI would gut the freelance market. Two years in, the picture is more interesting. Some segments crashed. Others quietly tripled.',
    category: 'business',
    publishedAt: '2025-03-04',
    readingTime: 4,
    tags: ['freelance', 'contracting', 'market', 'ai'],
    references: [
      { label: 'Upwork research', url: 'https://www.upwork.com/research' },
      { label: 'Gartner', url: 'https://www.gartner.com/' },
      { label: 'TechCrunch', url: 'https://techcrunch.com/' },
      { label: 'McKinsey insights', url: 'https://www.mckinsey.com/featured-insights' }
    ],
    content: `Two years ago Twitter was full of confident predictions that AI would gut the freelance contractor market by the end of 2024. From where I sit, talking to other independents and watching my own pipeline, the reality is more interesting. Some segments crashed. Others quietly tripled. Here is the shape of it.

## What got hit

The freelance segments that took real damage in 2024:

**Generic content writing.** Blog posts at $0.05 a word. SEO filler. Product descriptions. ChatGPT did this faster and cheaper than the bottom 60% of the market. The volume there has collapsed. The top 10% who write voice-driven, deeply researched, high-trust content are fine. The middle is gone.

**Basic translation.** Same shape. The high-end (legal, medical, literary) is unchanged. The bulk-grade work (UI strings, generic marketing) has moved to "machine translation plus a human pass" at a quarter the rate.

**Generic logo and graphic design.** Midjourney took the bottom of this market. The top of the market is busier than ever because more brands exist and the visual bar is higher. The freelancer at $50 a logo is competing with a free generation. The freelancer at $5,000 for a brand identity is competing with the same demand they had two years ago.

**Junior-grade web dev.** WordPress site builders, basic Shopify customisation, simple landing pages. AI tools and no-code platforms ate this. Wix and Webflow have AI-assisted everything now. There is still demand for senior end-to-end product engineering. The "I can build a landing page" tier has commoditised.

The pattern is consistent. AI compressed the bottom of every market and left the top untouched. Junior generalists got crushed. Senior specialists got busier.

## What grew

Some segments grew faster than I would have predicted:

**AI integration consulting.** Every mid-size company spent 2024 figuring out how to integrate LLMs into their product or workflow. Most do not have the in-house skill. Independents who actually understand the tools, can ship working systems, and can hold a conversation with non-technical stakeholders are booked solid. Day rates in this niche climbed visibly.

**Platform engineering.** Companies that grew through 2021-2022 hired aggressively, then froze, then started rationalising. The CTOs realised they had a sprawling internal platform built by a team that had since left, and they needed someone to make it sane. Independents who can come in, audit, and leave a coherent platform behind have more demand than they can serve.

**Cloud cost optimisation.** Specifically, FinOps work. Two years of "growth at all costs" left bills that needed rationalising. The combination of FinOps tooling and a senior engineer who understands the bill is genuinely valuable, and the work is concrete enough that ROI conversations are easy.

**Security-adjacent work.** SOC 2, ISO 27001, compliance prep, supply chain hygiene. The work was always there. AI did not displace any of it. Demand grew because more startups are pursuing enterprise contracts that require these certifications.

## What stayed flat

Big tranches of the market are unchanged:

- Senior engineering for niche stacks (specific embedded, specific scientific computing, specific legacy enterprise stacks).
- Specialist data engineering for regulated industries.
- Old-school sysadmin for organisations that are not going to the cloud any time soon.

The customer base for these is small, the relationships are sticky, and AI has not really changed the work.

## The rate dynamic

A nuance most "AI killed freelancing" takes miss: rates have bifurcated.

The bottom of the market saw rates compress as AI commoditised the work. The top of the market saw rates climb because the buyers who can pay senior rates are competing for a shrinking pool of qualified specialists. The middle hollowed out.

In specific data points from my own pipeline and conversations with peers:

- Senior platform/DevOps day rates in the UK and EU climbed 15-25% during 2024.
- Junior-to-mid generalist rates in the same markets are flat or down.
- AI-specific consulting rates blew past the rest by a noticeable margin.

If you are an independent reading this and your rates are flat, the question is whether you are in the right tier. Drift up the value chain or get good at AI integration; do both, ideally.

## The platform-side change

Upwork and Fiverr have changed. Both are leaning hard into AI matching, AI proposal generation, AI-assisted everything. The volume is still there. The quality of the work that comes through these platforms has shifted toward bigger, more strategic engagements, because the small commodity work increasingly does not flow through humans at all.

The independents I know who do well rely less on platforms and more on direct relationships, referrals, and inbound from a personal brand or content presence. That has been true for years. It is more true now.

## What I expect in 2025

Three things, with confidence varying:

- The compression of the bottom continues. By end of 2025, the market for "junior generalist freelancers competing on price" will be substantially smaller than it was in 2023.
- Senior specialist demand keeps growing, especially in AI integration, platform engineering, and security. Rates keep climbing. The bottleneck is supply.
- A new tier emerges: "AI-augmented operator". Independents who run multiple lightweight services using AI to do the work that would have required a small team. This already exists in marketing and content. It is starting to exist in engineering. By 2026 it is a recognised category.

The honest summary: AI did not kill the freelance market. It killed parts of it and turbocharged others. Where you are inside that distribution depends almost entirely on how senior, specialised, and trusted you are. The strategic move for any independent is to keep moving up the trust ladder.`
  },
  {
    id: 'p1-018',
    slug: 'deepseek-v3-december-2024',
    title: 'DeepSeek V3: The First Open Model That Made Me Rethink My Stack',
    description: 'DeepSeek V3 dropped in late December 2024 with frontier-class benchmarks at a fraction of the training cost. It is the first open release that genuinely shifts the cost curve.',
    category: 'ai',
    publishedAt: '2025-04-21',
    readingTime: 4,
    tags: ['deepseek', 'open-models', 'llm', 'ai'],
    references: [
      { label: 'DeepSeek', url: 'https://www.deepseek.com/' },
      { label: 'Hugging Face: DeepSeek', url: 'https://huggingface.co/deepseek-ai' },
      { label: 'TechCrunch coverage', url: 'https://techcrunch.com/' },
      { label: 'The Verge', url: 'https://www.theverge.com/' },
      { label: 'The Register', url: 'https://www.theregister.com/' }
    ],
    content: `DeepSeek shipped V3 in the last week of December 2024. The benchmark numbers were the kind of thing that makes you re-read the paper to check you parsed it right. A 671B mixture-of-experts model with frontier-adjacent quality on coding and math, released with open weights, and reportedly trained for under $6M of compute.

I have been running it locally and via API for the last few months. The hype is mostly justified. Here is the practical picture.

## The numbers that matter

The headline numbers, sanity-checked against my own usage:

- Coding tasks (HumanEval-style and harder): roughly comparable to Claude 3.5 Sonnet on the workloads I have tried. Slightly worse on some, slightly better on others.
- Reasoning and math: surprisingly strong. Better than I would have predicted from any open model in 2024.
- General chat: solid but not the strongest. The personality is flatter than the frontier-model competitors.
- Multilingual: very strong on Chinese, decent on European languages, weaker on long-tail.

The reported $6M training cost is the part the industry will spend the next year arguing about. There is plenty of unbundled cost (research salaries, prior model iterations, the GPU infrastructure they were not amortising explicitly). Even if the true number is 3-5x higher, it is still a fraction of what Western frontier labs are reportedly spending. That is a real signal about where the cost curve is headed.

## What changes operationally

For my stack, V3 has caused three concrete changes:

**A second open model in the routing layer.** I had Llama 3 70B for self-hosted bulk work. DeepSeek V3 is a different size (the MoE makes it heavier in memory but cheaper per token in inference) and a different quality profile. For coding-heavy internal tooling, V3 has displaced Llama. For general-purpose bulk work, Llama 3 still wins on operational simplicity.

**A renewed pricing pressure on frontier APIs.** DeepSeek's hosted API is dramatically cheaper than OpenAI or Anthropic for comparable quality on many tasks. I do not move client production traffic to a Chinese-hosted API for compliance reasons (more on that below), but the pricing gap is forcing me to renegotiate budgets and forcing the frontier labs to defend their pricing publicly.

**Eval suite expansion.** Adding a new model to a routing layer is a week of evaluation work, not a meeting. I have updated my eval harness to include V3 and re-ran the regression suite for two clients. One workload moved. Two did not. That is the right shape.

## The compliance and geopolitical question

I cannot write this post without addressing it. DeepSeek is a Chinese company. The hosted API is operated under Chinese jurisdiction. For UK and EU clients, that has data residency and regulatory implications that range from "fine, with a DPA" to "absolutely not, ever".

The open weights are a different matter. Weights downloaded and run on my own infrastructure are not flowing data to anyone else. The licence is permissive. Compliance there is the same as any self-hosted model.

My pragmatic split:

- Self-hosted V3: fine for most use cases, treated like any other model.
- Hosted DeepSeek API: only for non-sensitive evaluation work, or for clients who have explicitly approved Chinese-hosted infrastructure. That second group is small.

This is going to remain a friction point for Western enterprise adoption regardless of how good the model gets. Nothing in the model itself fixes it.

## Why the cost number matters

The $6M training claim, even at 3x its real value, is a statement that frontier-class capability does not require frontier-class capital. That statement undermines a lot of strategic assumptions:

- The "no startup can compete with the labs" argument gets weaker. If a focused team can produce a competitive open model on a fraction of the budget, the moat of the frontier labs is engineering excellence, distribution, and trust, not capital.
- The "GPU shortage will protect the incumbents" argument gets weaker. DeepSeek did this with H800s, the export-restricted version of the H100. Constraints drove efficiency gains.
- The "open will always trail closed by 18 months" assumption is stale. The gap on specific benchmarks is now small. On some workloads, open leads.

If V3 is the new floor for what an open model looks like, the next year of the industry will be wild.

## What I am telling clients

Three things, depending on the client:

For a client doing internal tooling at scale: re-evaluate self-hosted options. V3 plus the right eval harness might displace a six-figure API line item. The engineering to operate a 671B MoE model is non-trivial but not exotic.

For a client whose product depends on frontier API access: nothing changes today, but build optionality into your architecture. The next year will see further price compression and more open-weight competitors. If your product is locked to a single vendor's specific API, you are leaving leverage on the table.

For a client worried about geopolitical risk: separate the model from the host. Self-hosted weights of any provenance are operationally fine. Hosted APIs sit in jurisdictional reality and the choices there are not technical.

## The honest closing

I am not certain V3 is the best open model six months from now. Llama 4 is rumoured. Mistral has a pipeline. Anthropic and OpenAI both have closed releases coming that will reset the bar. The picture changes every quarter.

What I am certain of is that the cost curve has moved decisively. Frontier-class capability is getting cheaper, faster, more open, and harder to monopolise. That is good for users, hard on incumbent margins, and the most interesting structural shift in the AI industry since GPT-3.

If you have not added an open frontier-class model to your routing layer yet, late April 2025 is a fine time to start.`
  }
];
