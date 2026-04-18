export interface BlogPostMeta {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  readingTime: number;
  content: string;
}

export const blogPosts: BlogPostMeta[] = [
  {
    slug: "terraform-state-management-production",
    title: "Terraform State Management in Production Environments",
    description:
      "How to structure Terraform state for teams — remote backends, state locking, workspace patterns, and the mistakes to avoid.",
    date: "2026-03-15",
    tags: ["Terraform", "IaC", "AWS", "DevOps"],
    readingTime: 9,
    content: `
Terraform state is the authoritative record of what infrastructure exists. Get it wrong and you get drift, conflicts, and the kind of incident where someone's local state file becomes the source of truth for production.

## The problem with local state

Every new Terraform user starts the same way: running \`terraform apply\` locally, committing the \`terraform.tfstate\` file to git, and wondering why their colleague's apply broke when they both worked on the infrastructure at the same time.

Local state has two fundamental problems: it can't be shared reliably between team members, and it can't be locked to prevent concurrent modifications.

## Remote backends

The solution is a remote backend. For AWS workloads, S3 with DynamoDB state locking is the standard:

\`\`\`hcl
terraform {
  backend "s3" {
    bucket         = "my-org-terraform-state"
    key            = "production/main.tfstate"
    region         = "eu-west-2"
    dynamodb_table = "terraform-state-locks"
    encrypt        = true
  }
}
\`\`\`

The DynamoDB table provides locking. When anyone runs \`terraform apply\`, it acquires the lock. Anyone else who tries to apply concurrently gets an error instead of silently clobbering the state.

## State structure patterns

### Single state file

Simple, but doesn't scale. If your database and your application code are in the same state file, a mistake in an application module can take down your attempt to make an emergency database change because the plan fails.

### Per-environment state files

Better. Separate state files for development, staging, and production:

\`\`\`
state/
  development/
    network/
    compute/
    database/
  staging/
    ...
  production/
    ...
\`\`\`

Changes to development infrastructure can't affect production state, and production plans don't include development resources.

### Per-layer state files

The approach I use for most production environments: separate state by infrastructure layer within each environment. Network, compute, database, and application layers each have their own state file.

This means:
- A change to your application deployment configuration doesn't require a plan that touches your VPC
- Database changes are isolated from compute changes
- Team members can work on different layers concurrently without conflicts

The tradeoff is managing cross-layer dependencies using remote state data sources:

\`\`\`hcl
data "terraform_remote_state" "network" {
  backend = "s3"
  config = {
    bucket = "my-org-terraform-state"
    key    = "production/network/main.tfstate"
    region = "eu-west-2"
  }
}

resource "aws_instance" "app" {
  subnet_id = data.terraform_remote_state.network.outputs.private_subnet_ids[0]
  ...
}
\`\`\`

## State file security

State files contain sensitive data — database passwords, private keys, connection strings. Secure them:

- Encrypt the S3 bucket (both at rest and in transit)
- Restrict IAM access to the state bucket to only the CI/CD roles and specific engineers who need it
- Enable S3 versioning so you can recover from accidental state file deletion
- Never commit state files to git

## Workspaces vs. directories

Terraform workspaces allow multiple state files within a single configuration. The appeal is obvious: one set of files, different state for different environments.

In practice I avoid workspaces for environment separation. The problem is that your entire configuration is shared — there's no clean way to have different resource sizes or feature flags between environments without conditional expressions that make your code harder to understand.

Directory-per-environment with shared modules gives you more flexibility at the cost of some repetition. That's usually the right trade.

## State migration

When you need to restructure your state — moving resources between modules, changing how your state is organised — Terraform provides \`terraform state mv\`:

\`\`\`bash
terraform state mv \
  'module.old_name.aws_instance.app' \
  'module.new_name.aws_instance.app'
\`\`\`

Always do this on a copy of the state first. Always have a backup. Always test with a plan before applying anything.

## Import existing infrastructure

For resources that weren't created by Terraform:

\`\`\`bash
terraform import aws_s3_bucket.data my-existing-bucket-name
\`\`\`

After import, Terraform knows about the resource but your configuration doesn't describe it fully. The generated resource code won't be perfect — plan carefully before applying any changes.

## The operational discipline

Good state management is as much about process as it is about configuration:

- All infrastructure changes go through CI, never from local machines to production
- State lock is taken by CI jobs, not individual engineers
- State file changes are audited through CI logs
- State backups are verified periodically

State management done well becomes invisible. You stop thinking about it because it just works. Get it wrong and you'll think about nothing else during your next incident.
    `,
  },
  {
    slug: "aws-ecs-vs-eks-choosing",
    title: "ECS vs EKS: Choosing the Right Container Platform for Your Team",
    description:
      "A practical comparison of AWS ECS and EKS for production workloads — when each makes sense and what actually matters in the decision.",
    date: "2026-02-28",
    tags: ["AWS", "ECS", "Kubernetes", "Container Orchestration"],
    readingTime: 8,
    content: `
Every team running containers on AWS eventually faces the ECS versus EKS decision. Both are production-capable container orchestration platforms. Neither is universally better. The right choice depends on your team's experience, your operational requirements, and how much you want to own.

## What ECS actually is

ECS is AWS's proprietary container orchestration service. You define task definitions (container specs), services (how many replicas to run), and clusters (logical groupings). AWS handles the scheduling and placement.

With Fargate, you don't manage EC2 instances at all. You specify CPU and memory requirements, and AWS allocates compute capacity. With EC2 launch type, you manage the underlying instances.

The mental model is close to "managed containers" rather than "Kubernetes without the control plane management."

## What EKS actually is

EKS is managed Kubernetes — AWS runs your Kubernetes control plane (API server, etcd, scheduler) and you manage your worker nodes. You get the full Kubernetes API and ecosystem: Helm, ArgoCD, Karpenter, the whole thing.

With EKS managed node groups, AWS handles the EC2 instances under your worker nodes to a degree. With Fargate for EKS, you can run pods without managing nodes at all — though with meaningful limitations.

## The key differences

### Operational complexity

ECS is significantly simpler to operate. There are fewer abstractions, fewer components, and a smaller surface area for things to go wrong. If you've never operated Kubernetes, ECS has a substantially shallower learning curve.

EKS requires either Kubernetes expertise in your team or a willingness to build it. Kubernetes has genuinely useful abstractions, but they come with complexity that bites teams who don't understand them.

### The ecosystem

Kubernetes has a dramatically richer ecosystem. If you need service mesh, advanced autoscaling, GitOps, custom resource definitions, or specific tooling that integrates with Kubernetes APIs, EKS gives you access to a far wider set of options.

ECS ecosystem is AWS-native and narrower. You get deep integration with other AWS services — ALB integration, IAM roles for tasks, CloudWatch — but fewer third-party integrations.

### Cost

For straightforward workloads, ECS Fargate is often cheaper to operate — not necessarily in compute cost, but in the engineering time required to manage it.

EKS at equivalent scale is typically cheaper in compute (EC2 worker nodes vs. Fargate pricing) but costs more in engineering time. The control plane itself costs $0.10/hour.

For large-scale workloads with many services, the operational overhead difference often favours EKS because Kubernetes tooling (Karpenter, KEDA) provides better autoscaling efficiency.

### Multi-cloud and portability

If you're genuinely considering running your workloads across multiple cloud providers, Kubernetes provides portability. ECS is AWS-only.

In my experience, "we might go multi-cloud" is more often a theoretical concern than an actual requirement. But for teams with genuine multi-cloud requirements, this matters.

## When I recommend ECS

- Teams without existing Kubernetes expertise who need to ship quickly
- Simpler architectures with a small number of services
- AWS-native environments where you want deep integration with other AWS services
- Teams that want reduced operational complexity as a priority
- Fargate workloads where you genuinely don't want to manage any nodes

## When I recommend EKS

- Teams with existing Kubernetes expertise
- Environments that need advanced autoscaling, GitOps, or specific Kubernetes tooling
- Larger-scale deployments where Kubernetes tooling provides operational leverage
- Teams building internal developer platforms where Kubernetes APIs provide a foundation
- Genuine multi-cloud requirements

## The team dimension

This is the factor that matters most and gets mentioned least in technical comparisons. If your team doesn't know Kubernetes, EKS won't deliver on its theoretical advantages — it'll deliver incidents and cognitive overhead.

If your team does know Kubernetes, ECS will feel like a limitation within six months.

Be honest about where your team is and where they're going, not where you'd like them to be.

## A note on both

Neither ECS nor EKS solves the hard problems of running containers in production: designing for observability, handling graceful shutdown, managing secrets, structuring CI/CD properly. The orchestration platform is a foundation. What you build on it matters more.
    `,
  },
  {
    slug: "github-actions-ci-optimization",
    title: "Cutting GitHub Actions Build Times in Half",
    description:
      "Practical techniques for making slow GitHub Actions pipelines fast — caching, parallelisation, and the things that actually move the needle.",
    date: "2026-02-10",
    tags: ["CI/CD", "GitHub Actions", "DevOps", "Optimisation"],
    readingTime: 7,
    content: `
Long CI builds are a productivity tax that most teams have accepted without examining. A 30-minute pipeline run, four times a day, for a team of eight engineers costs you four hours of blocked feedback cycles every day. That compounds over quarters.

Most slow pipelines can be cut in half with a day's work. Here's where to start.

## Profile before optimising

Before touching anything, instrument your pipeline to understand where time goes. GitHub Actions shows step durations in the run logs. Add this where needed:

\`\`\`yaml
- name: Build
  run: |
    echo "Build start: $(date)"
    npm run build
    echo "Build end: $(date)"
\`\`\`

In most pipelines, one or two steps account for the majority of time. Don't assume — measure.

## Dependency installation caching

If you're not caching dependencies, every run installs everything from scratch. The setup-node action includes a caching option:

\`\`\`yaml
- uses: actions/setup-node@v4
  with:
    node-version: '20'
    cache: 'npm'
\`\`\`

This caches the npm cache directory keyed on \`package-lock.json\`. If the lockfile hasn't changed, dependencies restore from cache instead of downloading. For a typical project, this saves 1–3 minutes per run.

For monorepos or projects with complex caching needs, use \`actions/cache\` directly with a precise cache key:

\`\`\`yaml
- uses: actions/cache@v4
  with:
    path: ~/.npm
    key: \${{ runner.os }}-npm-\${{ hashFiles('**/package-lock.json') }}
    restore-keys: |
      \${{ runner.os }}-npm-
\`\`\`

## Docker build caching

Docker builds are often the biggest time sink. Without caching, every layer gets rebuilt from scratch. With BuildKit and GitHub Actions cache:

\`\`\`yaml
- name: Build Docker image
  uses: docker/build-push-action@v5
  with:
    context: .
    cache-from: type=gha
    cache-to: type=gha,mode=max
\`\`\`

This stores Docker layer cache in GitHub's Action cache. Layers that haven't changed are restored from cache rather than rebuilt.

Combine this with proper Dockerfile ordering — put frequently-changing layers (your application code) after rarely-changing layers (system packages, dependencies):

\`\`\`dockerfile
FROM node:20-alpine

WORKDIR /app

# Dependencies layer - cached until package.json changes
COPY package*.json ./
RUN npm ci

# Source layer - rebuilt on every code change
COPY . .
RUN npm run build
\`\`\`

## Parallelisation

Most pipelines run jobs sequentially when they could run in parallel. Checks that don't depend on each other should run simultaneously:

\`\`\`yaml
jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm run lint

  typecheck:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm run typecheck

  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm run test

  build:
    needs: [lint, typecheck, test]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm run build
\`\`\`

Lint, typecheck, and test now run in parallel. Build only starts once they've all passed. Total time is max(lint, typecheck, test) + build, not lint + typecheck + test + build.

## Test parallelisation with matrix strategy

For test suites with many files, split across parallel runners:

\`\`\`yaml
jobs:
  test:
    strategy:
      matrix:
        shard: [1, 2, 3, 4]
    runs-on: ubuntu-latest
    steps:
      - run: npm run test -- --shard=\${{ matrix.shard }}/4
\`\`\`

Four runners, each running a quarter of the test suite. If tests take 20 minutes sequentially, this brings it to ~6 minutes.

## Conditional job execution

Not every change needs to run the full pipeline. Use path filters to skip irrelevant jobs:

\`\`\`yaml
jobs:
  frontend-build:
    if: github.event_name == 'push' || contains(github.event.pull_request.changed_files, 'frontend/')
    ...
\`\`\`

Or use the \`dorny/paths-filter\` action for more sophisticated filtering.

## What actually moves the needle

In my experience, the order of impact is usually:

1. **Test parallelisation** — if your tests are slow, splitting them across runners is the biggest single win
2. **Docker build caching** — if you're building Docker images, BuildKit caching saves significant time
3. **Dependency caching** — quick win, but usually not the biggest time sink
4. **Job parallelisation** — restructuring sequential jobs to run in parallel

The theoretical optimisations — rewriting slow tests, switching to faster test frameworks — are real but require more sustained effort. The caching and parallelisation changes above can often be implemented in a few hours and yield half the build time.
    `,
  },
  {
    slug: "postgresql-indexing-production",
    title: "PostgreSQL Indexing for Production Systems",
    description:
      "Practical guide to indexing PostgreSQL databases — when indexes help, when they hurt, and how to diagnose slow queries properly.",
    date: "2026-01-25",
    tags: ["PostgreSQL", "Database", "Performance", "Backend"],
    readingTime: 10,
    content: `
Bad database indexing is one of the most common causes of production performance problems, and it compounds quietly — queries get slower as tables grow, and by the time it's noticeable it's often already affecting users.

Understanding how PostgreSQL uses indexes turns database performance from guesswork into engineering.

## How indexes work

A PostgreSQL index is a separate data structure that stores a subset of your table's data in a way that makes specific access patterns fast. The most common type, a B-tree index, maintains a sorted copy of the indexed column(s), allowing the database to find rows matching a condition in O(log n) instead of scanning the entire table.

The cost of an index is paid on every write: inserts, updates, and deletes must update the index as well as the table. This is why you don't index everything.

## EXPLAIN ANALYZE

Before adding any index, run \`EXPLAIN ANALYZE\` on your slow query:

\`\`\`sql
EXPLAIN ANALYZE
SELECT * FROM orders
WHERE customer_id = 12345
AND status = 'pending'
ORDER BY created_at DESC;
\`\`\`

Read the output from the inside out. Look for:

- **Seq Scan** — full table scan, often a signal that an index would help
- **Index Scan** — using an index, usually efficient
- **Index Only Scan** — all data can be served from the index without touching the table, very efficient
- **actual rows vs. estimated rows** — large discrepancies indicate stale statistics, run \`ANALYZE\`

The \`Buffers\` output (with \`EXPLAIN (ANALYZE, BUFFERS)\`) tells you how much data was read from disk vs. cache — crucial for understanding real performance.

## Single column indexes

For a query filtering on a single column:

\`\`\`sql
CREATE INDEX CONCURRENTLY idx_orders_customer_id
ON orders(customer_id);
\`\`\`

Use \`CONCURRENTLY\` in production — it builds the index without locking the table for writes. It takes longer, but doesn't block your application.

## Composite indexes

When queries filter on multiple columns, a composite index can be dramatically more efficient than separate single-column indexes:

\`\`\`sql
CREATE INDEX CONCURRENTLY idx_orders_customer_status
ON orders(customer_id, status);
\`\`\`

Column order matters. PostgreSQL can use a composite index for queries that filter on the leading columns, but not for queries that filter only on trailing columns.

\`\`\`sql
-- Uses the index (customer_id is leading column)
WHERE customer_id = 123

-- Uses the index (filters on both columns)
WHERE customer_id = 123 AND status = 'pending'

-- Cannot use the index efficiently (status is trailing column only)
WHERE status = 'pending'
\`\`\`

Put your most selective column first, and structure indexes around your actual query patterns.

## Covering indexes

If your query retrieves specific columns, including them in the index can enable index-only scans — the database never touches the table:

\`\`\`sql
CREATE INDEX CONCURRENTLY idx_orders_customer_covering
ON orders(customer_id, status) INCLUDE (total_amount, created_at);
\`\`\`

The \`INCLUDE\` columns are stored in the index but not part of the key. The query can be satisfied entirely from the index.

## Partial indexes

When you consistently query a subset of your table, a partial index is smaller and faster than a full index:

\`\`\`sql
CREATE INDEX CONCURRENTLY idx_orders_pending
ON orders(created_at)
WHERE status = 'pending';
\`\`\`

This index only contains rows where \`status = 'pending'\`. If your pending orders are 5% of total orders, this index is 20x smaller than a full index on \`created_at\`.

## Function-based indexes

When you filter on a function of a column:

\`\`\`sql
-- This query won't use an index on email
WHERE LOWER(email) = LOWER($1)

-- Create a functional index
CREATE INDEX CONCURRENTLY idx_users_email_lower
ON users(LOWER(email));
\`\`\`

## Finding missing indexes

Query \`pg_stat_user_tables\` to find tables with many sequential scans:

\`\`\`sql
SELECT relname, seq_scan, seq_tup_read, idx_scan
FROM pg_stat_user_tables
WHERE schemaname = 'public'
ORDER BY seq_scan DESC;
\`\`\`

Tables with high \`seq_scan\` and low \`idx_scan\` on large tables often need indexes. Cross-reference with \`pg_stat_statements\` to find the slow queries:

\`\`\`sql
SELECT query, mean_exec_time, calls
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 20;
\`\`\`

## Finding unused indexes

Indexes that are never used still have write overhead. Find them:

\`\`\`sql
SELECT schemaname, tablename, indexname, idx_scan
FROM pg_stat_user_indexes
WHERE idx_scan = 0
ORDER BY schemaname, tablename;
\`\`\`

Review before dropping — \`idx_scan = 0\` since statistics were last reset, not ever. Reset statistics with \`SELECT pg_stat_reset()\` on a development database, but be cautious on production.

## Bloat and maintenance

Indexes accumulate bloat over time from updates and deletes. Check index bloat periodically and use \`REINDEX CONCURRENTLY\` when bloat is significant. The autovacuum process helps, but heavily updated tables may need tuning.

## The discipline

Add indexes when you have evidence they're needed — a slow query, a \`EXPLAIN ANALYZE\` showing sequential scans, a growing table with known access patterns. Don't add indexes speculatively.

Review existing indexes periodically. Drop the unused ones. The index you added for a feature that was removed is still being written on every insert.
    `,
  },
  {
    slug: "kubernetes-resource-limits-production",
    title: "Kubernetes Resource Limits Done Right",
    description:
      "Why most Kubernetes resource limits are wrong, and how to set them correctly — with real production consequences of getting it wrong.",
    date: "2026-01-12",
    tags: ["Kubernetes", "Platform Engineering", "DevOps", "Production"],
    readingTime: 8,
    content: `
Resource limits in Kubernetes are one of those configuration areas where the right answer isn't obvious, the documentation doesn't clearly explain the operational consequences, and getting it wrong causes production incidents that are genuinely difficult to diagnose.

## The basics

Every container in Kubernetes can have resource requests and limits set:

\`\`\`yaml
resources:
  requests:
    memory: "256Mi"
    cpu: "250m"
  limits:
    memory: "512Mi"
    cpu: "1000m"
\`\`\`

**Requests** tell the scheduler how much resource the container needs. The scheduler uses requests to decide which node to place the pod on.

**Limits** tell the kubelet the maximum the container is allowed to use.

These are different concepts, and understanding the difference matters.

## The CPU throttling trap

CPU limits look like a sensible safeguard — cap how much CPU a container can consume, prevent one container from starving others. The reality is more complicated.

When a container hits its CPU limit, Kubernetes throttles it using Linux cgroups. The container doesn't crash — it gets CPU time taken away. The result is increased latency, often significantly.

For latency-sensitive applications (most web services), CPU throttling can cause requests to slow down dramatically at exactly the times when load is highest — the opposite of what you want.

**What to do:** Set CPU requests accurately to inform scheduling. Be very cautious with CPU limits, or don't set them at all for latency-sensitive workloads. Monitor throttling with the \`container_cpu_throttled_seconds_total\` metric.

## Memory limits and OOM kills

Memory limits behave differently from CPU limits. When a container exceeds its memory limit, it's killed with an OOMKilled (Out of Memory Killed) status. This is an immediate crash, not a gradual slowdown.

OOM kills in production look like: pod restarts with exit code 137, \`kubectl describe pod\` showing \`OOMKilled\`, application logs ending abruptly.

The common mistake is setting memory limits too low. You see memory usage at 200MB in development, set a limit of 256MB, and then wonder why your pod keeps restarting under production load.

**What to do:** Set memory limits higher than your normal operating memory, with enough headroom for spikes. Use the \`container_memory_working_set_bytes\` metric (not \`container_memory_usage_bytes\` which includes cache) to understand actual memory requirements under load.

## QoS classes

The relationship between requests and limits determines a pod's QoS (Quality of Service) class, which affects eviction priority:

**Guaranteed** — Requests equal limits for all containers. Pods in this class are the last to be evicted under node memory pressure.

**Burstable** — Requests set but lower than limits, or only requests set. Most production workloads should be here.

**BestEffort** — No requests or limits set at all. First to be evicted. Don't use this for anything you care about.

## Setting requests correctly

Accurate requests matter more than limits. The scheduler places pods based on requests — overestimate and you waste node capacity, underestimate and you overcommit nodes, which leads to performance problems under load.

Use \`kubectl top pods\` for live resource usage. Use Prometheus \`container_cpu_usage_seconds_total\` and \`container_memory_working_set_bytes\` for historical data. Set requests to your typical operating level, not your worst-case peak.

## The LimitRange resource

To prevent pods from running without resource configurations, use a LimitRange to set namespace defaults:

\`\`\`yaml
apiVersion: v1
kind: LimitRange
metadata:
  name: default-limits
  namespace: production
spec:
  limits:
  - default:
      memory: 512Mi
      cpu: "500m"
    defaultRequest:
      memory: 256Mi
      cpu: "100m"
    type: Container
\`\`\`

Any container without explicit resource configuration gets these defaults.

## Resource quotas per namespace

Use ResourceQuota to limit total resource consumption per namespace:

\`\`\`yaml
apiVersion: v1
kind: ResourceQuota
metadata:
  name: production-quota
  namespace: production
spec:
  hard:
    requests.cpu: "20"
    requests.memory: 40Gi
    limits.cpu: "40"
    limits.memory: 80Gi
    pods: "100"
\`\`\`

This prevents a single namespace from consuming all cluster resources.

## Vertical Pod Autoscaler

VPA can analyse your pod's actual resource usage and recommend or automatically adjust requests and limits. For greenfield deployments where you don't know the right values, running VPA in recommendation mode for a week or two gives you data-driven starting points:

\`\`\`yaml
apiVersion: autoscaling.k8s.io/v1
kind: VerticalPodAutoscaler
metadata:
  name: my-app-vpa
spec:
  targetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: my-app
  updatePolicy:
    updateMode: "Off"  # Recommendation only, no automatic changes
\`\`\`

## The operational discipline

Review resource configurations periodically. Applications change — they use more memory after features are added, CPU patterns change with load patterns. Configurations set at launch are often wrong six months later.

Add CPU throttling and OOM kill alerts to your monitoring. An alert when \`container_oom_events_total\` increases is worth setting up before you need it.
    `,
  },
  {
    slug: "internal-tools-not-saas",
    title: "When to Build Internal Tools Instead of Buying SaaS",
    description:
      "The decision framework for when custom internal tools beat off-the-shelf SaaS — and when they don't.",
    date: "2025-12-20",
    tags: ["Internal Tools", "Engineering", "Product Strategy"],
    readingTime: 6,
    content: `
The default answer to "we need a tool for this" has become "buy a SaaS product." This is often right. SaaS products exist for most common business problems, someone else carries the operational burden, and they're immediately available.

But the default has become so strong that many teams are now running expensive, fragmented stacks of tools that don't talk to each other, require constant workarounds, and still don't fit their actual workflows.

Knowing when to build is as important as knowing how to build.

## When SaaS clearly wins

**Solved, commodity problems.** Email infrastructure, payment processing, video calls, HR administration, accounting. These are solved problems with well-established vendors. Building your own email delivery infrastructure is not a good use of engineering time.

**Regulatory and compliance requirements.** Payroll, GDPR data handling, financial compliance. These requirements are complex and change. Use products built to handle them.

**Non-differentiating operations.** If the process you're automating is identical to how every other company in your sector does it, SaaS is almost certainly the right answer.

**Small teams without dedicated engineering.** Internal tools have ongoing maintenance costs. If you don't have engineering capacity to maintain what you build, don't build it.

## When building makes sense

**Your workflow is genuinely specific.** The SaaS tools all assume a process that's close to yours but not quite right. The workarounds accumulate. You spend more time making the tool fit than actually using it.

**You need tight integration with your own data.** The tool needs to work with your internal database, your proprietary formats, your specific business logic. APIs help, but there's always friction, and it costs more in engineering time than building.

**The cost calculus adds up.** Five SaaS tools at $500/month each is $6,000/year. A well-built internal tool might cost $15,000 to build and $2,000/year to maintain. At year three, you're ahead, and you have something that actually fits.

**The team will actually use it.** Tools people love using don't feel like work. Generic SaaS often forces users to adapt to the tool. Custom tools can adapt to users.

**Competitive advantage.** If the internal tool directly relates to how you're better than competitors — a more efficient operations process, better information about customers, faster response times — the investment is defensible.

## The hybrid reality

The best outcome is often SaaS for the commodity stuff and custom tools for the differentiated stuff, with a small number of integration points between them.

A sales team might use Salesforce for pipeline management (a commodity problem, rich ecosystem, most salespeople already know it) but have a custom dashboard that pulls Salesforce data alongside internal systems to give account managers the specific view they need.

The key is being clear about what's commodity and what's specific.

## What often goes wrong with custom builds

**Scope creep before launch.** The minimum viable tool keeps growing before it ships. The right discipline is: what's the simplest thing that's useful to real users, and ship that. Add the rest after you have feedback.

**Insufficient maintenance investment.** Internal tools need maintenance. If the team treats them as a one-time project, they rot. Dependencies become outdated. The one engineer who understood the codebase leaves. Establish ownership and maintenance budgets at the start.

**Over-engineering.** An internal tool for 15 users doesn't need microservices, a Kafka event bus, and multi-region redundancy. It needs to work reliably, be maintainable by whoever is responsible for it, and do the job.

## Making the decision

When evaluating build vs. buy:

1. Define the problem you're actually solving, not the tool you imagine building
2. Evaluate whether a SaaS product solves it well enough — a 70% fit might be good enough
3. If building: estimate the realistic build cost, ongoing maintenance cost, and the value delivered
4. Be honest about who will maintain it and whether they have the capacity

The instinct to build is common in engineering-led organisations and it's not wrong — custom tools can be genuinely powerful. The discipline is being rigorous about when the build is worth it.
    `,
  },
  {
    slug: "resend-transactional-email-production",
    title: "Transactional Email in Production with Resend",
    description:
      "Setting up reliable transactional email for production applications — domain configuration, deliverability, and email workflow patterns with Resend.",
    date: "2025-12-05",
    tags: ["Email", "Resend", "Backend", "Infrastructure"],
    readingTime: 6,
    content: `
Transactional email is one of those infrastructure concerns that looks simple until you've had a production incident where your verification emails are ending up in spam or your invoice notifications aren't being delivered. Getting it right requires more than writing the HTML template.

## The deliverability foundation

Everything starts with your domain's email authentication setup. Without it, email from your application will be treated with suspicion by receiving mail servers.

**SPF (Sender Policy Framework)** — A DNS TXT record that lists which mail servers are authorised to send email from your domain. When Resend sends email on your behalf, their servers need to be in your SPF record.

**DKIM (DomainKeys Identified Mail)** — Resend generates a key pair and you publish the public key as a DNS record. Resend signs outgoing email with the private key, and receiving servers verify the signature. This proves the email came from an authorised source and hasn't been tampered with.

**DMARC (Domain-based Message Authentication, Reporting and Conformance)** — A policy that tells receiving servers what to do when SPF or DKIM checks fail. Start in monitoring mode (\`p=none\`) to understand your email flow before moving to \`quarantine\` or \`reject\`.

Resend's onboarding walks you through the DNS records needed for your domain. Don't skip this step.

## Sending patterns

For most applications, sending through Resend's API with the Node.js SDK is straightforward:

\`\`\`typescript
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const { data, error } = await resend.emails.send({
  from: 'Hello <hello@yourdomain.com>',
  to: 'user@example.com',
  subject: 'Your verification code',
  html: '<p>Your code is <strong>123456</strong></p>',
});

if (error) {
  // Handle error - don't silently swallow it
  throw new Error(\`Email send failed: \${error.message}\`);
}
\`\`\`

Always handle errors explicitly. Failed email sends should be logged and, for critical flows (password resets, invoice notifications), retried or alerted.

## Email template architecture

For production applications with multiple email types, centralise your templates:

\`\`\`typescript
// lib/emails/templates/welcome.ts
export function welcomeEmail(data: { name: string; verifyUrl: string }) {
  return {
    subject: \`Welcome, \${data.name}\`,
    html: \`
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h1>Welcome</h1>
        <p>Hi \${data.name},</p>
        <p>Click the link below to verify your email:</p>
        <a href="\${data.verifyUrl}">Verify Email</a>
      </div>
    \`,
  };
}

// lib/emails/send.ts
export async function sendWelcomeEmail(to: string, data: { name: string; verifyUrl: string }) {
  const template = welcomeEmail(data);
  return resend.emails.send({
    from: FROM_EMAIL,
    to,
    ...template,
  });
}
\`\`\`

Separate concerns: the template generates the email content, the send function handles the transport. This makes templates testable independently.

## Webhook handling for inbound email

Resend supports inbound email routing — emails sent to your domain can be received as webhook payloads and processed by your application. This enables contact@yourdomain.com to flow into your admin inbox.

Route handler for receiving inbound email:

\`\`\`typescript
// app/api/email/inbound/route.ts
export async function POST(request: Request) {
  const signature = request.headers.get('svix-signature');

  // Verify the webhook signature before processing
  // ...

  const payload = await request.json();

  // Store in database
  await supabase.from('inbox_messages').insert({
    sender_email: payload.from,
    sender_name: payload.fromName,
    subject: payload.subject,
    body: payload.text || payload.html,
    source: 'inbound_email',
    status: 'unread',
  });

  return Response.json({ received: true });
}
\`\`\`

## Rate limiting and queue patterns

For applications with significant email volume, don't send inline in API handlers. Use a queue:

1. API handler saves email task to queue (database, Redis, SQS)
2. Background worker processes the queue and calls Resend
3. Failed sends are retried with exponential backoff
4. Permanent failures are logged and alerted

This keeps your API responses fast and your email sends reliable regardless of Resend's API latency.

## Monitoring

Track email delivery rates. Resend's dashboard shows send, deliver, open, and click rates. Set up alerts for delivery rate drops — they signal DNS misconfiguration, content issues, or domain reputation problems that need immediate attention.

For critical email flows (password reset, payment confirmation), log every send attempt with the message ID returned by Resend, so you can debug delivery issues for specific users.
    `,
  },
  {
    slug: "nextjs-admin-dashboard-patterns",
    title: "Architecture Patterns for Next.js Admin Dashboards",
    description:
      "How to structure a Next.js application that serves both a public website and a private admin panel — auth, routing, and data fetching patterns.",
    date: "2025-11-18",
    tags: ["Next.js", "Admin Panels", "Architecture", "TypeScript"],
    readingTime: 8,
    content: `
Building an admin dashboard alongside a public-facing website in the same Next.js application is a common pattern that requires careful thought about routing, authentication, and data access. Done well, you get a single deployment that serves both audiences efficiently. Done poorly, you get auth bugs and leaking admin data.

## Route organisation

Use route groups to separate public and admin routes without affecting URLs:

\`\`\`
app/
  (public)/
    layout.tsx          # Public site header/footer
    page.tsx            # Home: /
    about/page.tsx      # /about
    contact/page.tsx    # /contact
  control/
    login/page.tsx      # /control/login
    layout.tsx          # Admin layout (sidebar, nav)
    dashboard/page.tsx  # /control/dashboard
    clients/page.tsx    # /control/clients
\`\`\`

The \`(public)\` group applies the public layout to public routes. The \`control\` directory has its own layout with the admin sidebar. Route groups share a layout without being part of the URL.

## Middleware for auth protection

The middleware file runs before every request and is the right place to protect admin routes:

\`\`\`typescript
// middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith('/control')) {
    return NextResponse.next();
  }

  if (pathname === '/control/login') {
    return NextResponse.next();
  }

  // Check auth for all other /control routes
  const response = NextResponse.next();
  const supabase = createServerClient(/* config */);
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(new URL('/control/login', request.url));
  }

  return response;
}

export const config = {
  matcher: ['/control/:path*'],
};
\`\`\`

The middleware check is the primary security boundary. Don't rely on UI hiding alone.

## Server Components for data fetching

In the App Router, fetch data directly in Server Components for admin pages. No API route needed for reads:

\`\`\`typescript
// app/control/clients/page.tsx
import { createClient } from '@/lib/supabase/server';

export default async function ClientsPage() {
  const supabase = await createClient();

  const { data: clients, error } = await supabase
    .from('clients')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;

  return (
    <div>
      <ClientsTable clients={clients} />
    </div>
  );
}
\`\`\`

Fetching in Server Components means no client-side data loading state, no separate API endpoint to secure, and data arrives with the initial HTML.

## Server Actions for mutations

Use Server Actions for form submissions and mutations:

\`\`\`typescript
// app/control/clients/actions.ts
'use server'

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function createClient(formData: FormData) {
  const supabase = await createClient();

  const { error } = await supabase.from('clients').insert({
    name: formData.get('name') as string,
    email: formData.get('email') as string,
    // ...
  });

  if (error) throw error;

  revalidatePath('/control/clients');
}
\`\`\`

Server Actions run on the server, have access to server-side secrets, and can be called directly from forms without writing API routes.

## Row Level Security

For admin-only data, use Supabase Row Level Security to ensure data is only accessible to authenticated admin users — even if middleware is bypassed:

\`\`\`sql
CREATE POLICY "admin_only" ON clients
  FOR ALL
  USING (auth.role() = 'authenticated');
\`\`\`

Defence in depth: middleware redirects unauthenticated users, but even a direct API call can't read protected data without a valid session.

## Optimistic UI for admin actions

For actions where immediate feedback matters (marking an item as read, updating a status), optimistic UI improves perceived performance:

\`\`\`typescript
'use client'
import { useOptimistic } from 'react';

export function InboxItem({ message }: { message: InboxMessage }) {
  const [optimisticStatus, setOptimisticStatus] = useOptimistic(message.status);

  async function markAsRead() {
    setOptimisticStatus('read');  // Immediate UI update
    await updateMessageStatus(message.id, 'read');  // Server action
  }

  return (
    <div className={optimisticStatus === 'unread' ? 'font-bold' : ''}>
      {/* ... */}
    </div>
  );
}
\`\`\`

## The security checklist

- Middleware checks auth for all \`/control/*\` routes
- Row Level Security on all admin tables in Supabase
- Server Actions validate the user session server-side before any mutation
- No admin data in public API routes
- Admin routes not linked from public navigation
- Separate Supabase service role key not used client-side
    `,
  },
  {
    slug: "aws-vpc-design-production",
    title: "AWS VPC Design for Production Workloads",
    description:
      "How to design a production-grade AWS VPC — subnet architecture, routing, security groups, and the common mistakes that cause security incidents.",
    date: "2025-11-02",
    tags: ["AWS", "Networking", "VPC", "Security"],
    readingTime: 9,
    content: `
Most AWS VPC configurations I've audited have the same pattern: a default VPC created years ago, resources scattered across availability zones without a coherent network design, security groups that have accumulated rules nobody understands, and a vague sense that this might not be secure.

Getting VPC design right at the start saves significant remediation work later.

## The foundational CIDR decision

Your VPC CIDR range is hard to change after resources are deployed. Choose a range large enough for your expected growth, and avoid conflicts with any on-premise networks you might need to connect to.

RFC 1918 private ranges (\`10.0.0.0/8\`, \`172.16.0.0/12\`, \`192.168.0.0/16\`) are the standard. For a production VPC, \`10.0.0.0/16\` (65,534 addresses) is a reasonable default. Use \`10.1.0.0/16\`, \`10.2.0.0/16\` etc. for separate environments.

## Subnet architecture

The standard three-tier architecture separates resources by access pattern:

**Public subnets** — Resources that need direct internet access: load balancers, NAT gateways, bastion hosts. These have routes to an Internet Gateway. Nothing else should be here.

**Private subnets** — Application workloads: EC2 instances, ECS tasks, EKS nodes. These route outbound traffic through a NAT gateway but have no direct inbound internet access.

**Database subnets** — Database instances and data stores. No route to the internet at all. Only accessible from private subnets.

Create subnets in multiple availability zones for resilience:

\`\`\`hcl
# Three AZs, three tiers = nine subnets
locals {
  azs = ["eu-west-2a", "eu-west-2b", "eu-west-2c"]

  public_subnets   = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]
  private_subnets  = ["10.0.11.0/24", "10.0.12.0/24", "10.0.13.0/24"]
  database_subnets = ["10.0.21.0/24", "10.0.22.0/24", "10.0.23.0/24"]
}
\`\`\`

## NAT Gateway positioning

For high availability, put a NAT gateway in each availability zone and route each private subnet to the NAT gateway in its own AZ. This prevents a single AZ outage from taking out all outbound connectivity.

\`\`\`hcl
resource "aws_nat_gateway" "main" {
  count         = length(local.azs)
  allocation_id = aws_eip.nat[count.index].id
  subnet_id     = aws_subnet.public[count.index].id
}
\`\`\`

NAT gateways have hourly costs ($0.045/hour each) plus data processing costs. For non-production environments with lower availability requirements, a single NAT gateway is acceptable.

## Security groups: the key patterns

Security groups are stateful firewalls at the instance/ENI level. The key discipline: be as specific as possible with port ranges and source/destination, and document every rule.

**Application tier:** Accept traffic only from the load balancer's security group, not from the internet. Reference security groups rather than CIDR ranges where possible:

\`\`\`hcl
resource "aws_security_group_rule" "app_from_alb" {
  type                     = "ingress"
  from_port                = 8080
  to_port                  = 8080
  protocol                 = "tcp"
  source_security_group_id = aws_security_group.alb.id
  security_group_id        = aws_security_group.app.id
}
\`\`\`

**Database tier:** Accept traffic only from the application tier's security group. Never from \`0.0.0.0/0\`:

\`\`\`hcl
resource "aws_security_group_rule" "db_from_app" {
  type                     = "ingress"
  from_port                = 5432
  to_port                  = 5432
  protocol                 = "tcp"
  source_security_group_id = aws_security_group.app.id
  security_group_id        = aws_security_group.db.id
}
\`\`\`

## Network ACLs

Network ACLs are stateless firewalls at the subnet level. For most workloads, the default allow-all NACLs combined with tight security groups is sufficient. NACLs add value for an additional layer of protection on database subnets, blocking all inbound except from your private subnet ranges.

## VPC Flow Logs

Enable VPC Flow Logs to CloudWatch or S3 for all production VPCs:

\`\`\`hcl
resource "aws_flow_log" "main" {
  vpc_id          = aws_vpc.main.id
  traffic_type    = "ALL"
  iam_role_arn    = aws_iam_role.flow_log.arn
  log_destination = aws_cloudwatch_log_group.flow_log.arn
}
\`\`\`

Flow logs are invaluable for security incident investigation and diagnosing connectivity problems. The cost is manageable compared to the operational value.

## Private endpoints for AWS services

Route traffic to S3, DynamoDB, and other AWS services through VPC endpoints rather than through the internet. This keeps traffic on the AWS network, reduces NAT gateway data charges, and removes internet exposure:

\`\`\`hcl
resource "aws_vpc_endpoint" "s3" {
  vpc_id       = aws_vpc.main.id
  service_name = "com.amazonaws.eu-west-2.s3"

  route_table_ids = aws_route_table.private[*].id
}
\`\`\`

## The things to avoid

- Resources in the default VPC (created for convenience, not designed for production)
- SSH open to \`0.0.0.0/0\` — use Session Manager instead, no open SSH at all
- Security group rules with port ranges wider than necessary
- Opening database ports to the application subnet CIDR rather than the specific security group
- Manual security group rule changes outside of IaC — leads to undocumented rules that accumulate
    `,
  },
  {
    slug: "supabase-row-level-security",
    title: "Supabase Row Level Security in Practice",
    description:
      "How to use Supabase RLS effectively — policies for multi-tenant apps, admin access patterns, and testing your security model.",
    date: "2025-10-20",
    tags: ["Supabase", "PostgreSQL", "Security", "Backend"],
    readingTime: 7,
    content: `
Row Level Security is one of Supabase's most powerful features, and one of the most underused. Most applications treat it as optional boilerplate rather than what it is: a database-level security boundary that protects your data even when your application code has bugs.

## What RLS actually does

Without RLS, any authenticated Supabase client can read and write any row in any table (subject to column access controls, but not row access controls). With RLS enabled on a table, every query is evaluated against your defined policies. No policy that matches = no access.

\`\`\`sql
-- This prevents all access until policies are defined
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
\`\`\`

Note: the Supabase service role key bypasses RLS. Never use it client-side.

## Owner-only access for admin systems

For systems where only your authenticated user should access data:

\`\`\`sql
-- Allow all operations for authenticated users only
CREATE POLICY "authenticated_users_only" ON clients
  FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');
\`\`\`

This is appropriate for a personal admin system where any authenticated user is an authorised admin.

## Multi-tenant access patterns

For applications where each user should only see their own data:

\`\`\`sql
-- Users can only access their own records
CREATE POLICY "users_own_records" ON client_notes
  FOR ALL
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());
\`\`\`

The \`USING\` clause filters rows for SELECT, UPDATE, and DELETE. The \`WITH CHECK\` clause validates new rows for INSERT and UPDATE.

## Organisation-based multi-tenancy

For team-based access where multiple users share access to the same organisation's data:

\`\`\`sql
-- Allow access to records in the user's organisation
CREATE POLICY "organisation_members" ON projects
  FOR ALL
  USING (
    organisation_id IN (
      SELECT organisation_id FROM organisation_members
      WHERE user_id = auth.uid()
    )
  );
\`\`\`

This is a common pattern but note the performance implication: every row access involves a subquery. For large tables, ensure the subquery is fast (indexed on \`user_id\`) or materialise the check differently.

## Role-based policies with user metadata

Store user roles in JWT custom claims or a separate profiles table:

\`\`\`sql
-- Only users with admin role can access
CREATE POLICY "admin_only" ON invoices
  FOR ALL
  USING (
    (auth.jwt() ->> 'user_role') = 'admin'
  );
\`\`\`

Or with a profiles table:

\`\`\`sql
CREATE POLICY "admin_role_policy" ON invoices
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  );
\`\`\`

## Separating SELECT from write policies

Use different policies for reads and writes when the access rules differ:

\`\`\`sql
-- Anyone authenticated can read published blog posts
CREATE POLICY "read_published_posts" ON blog_posts
  FOR SELECT
  USING (published = true OR author_id = auth.uid());

-- Only the author can write
CREATE POLICY "author_writes" ON blog_posts
  FOR INSERT
  WITH CHECK (author_id = auth.uid());

CREATE POLICY "author_updates" ON blog_posts
  FOR UPDATE
  USING (author_id = auth.uid())
  WITH CHECK (author_id = auth.uid());
\`\`\`

## Testing your RLS policies

Test from the database, not just from your application:

\`\`\`sql
-- Test as a specific user
SET LOCAL role = authenticated;
SET LOCAL "request.jwt.claims" = '{"sub": "user-uuid-here", "role": "authenticated"}';

SELECT * FROM clients; -- Should return only the user's clients

RESET role;
\`\`\`

In Supabase Studio, you can test policies using the API and auth UI. Write explicit test cases:

1. Authenticated user can read their own records ✓
2. Authenticated user cannot read other users' records ✓
3. Unauthenticated request returns no rows ✓
4. Write with correct user_id succeeds ✓
5. Write with mismatched user_id fails ✓

## Performance considerations

Every RLS policy adds query overhead. Policies involving subqueries can be significant at scale.

Mitigations:
- Index the columns used in policy conditions
- Use \`auth.uid()\` directly rather than joining through multiple tables where possible
- For complex multi-tenant systems, consider materialising access rights into a denormalised table
- Use \`EXPLAIN ANALYZE\` to verify policy overhead on your common queries

## The mental model

Think of RLS as the last line of defence, not the only line. Your application should be applying access checks at the API layer too. But RLS means that if your application code has a bug that incorrectly fetches data, the database refuses to return records the user isn't entitled to.

This is defence in depth. Both layers should exist.
    `,
  },
  {
    slug: "on-call-engineering-practices",
    title: "On-Call Engineering That Doesn't Burn Out Your Team",
    description:
      "Practical approaches to on-call rotation design, runbook quality, and incident response that keep systems reliable without destroying work-life balance.",
    date: "2025-10-05",
    tags: ["Operations", "DevOps", "Team", "Reliability"],
    readingTime: 7,
    content: `
Bad on-call practices are an engineering retention problem disguised as an operations problem. When engineers dread being on-call, miss critical alerts because they've learned to ignore the noise, or can't escalate incidents effectively because there are no runbooks, the operational health of your systems reflects those practices.

Getting on-call right is as much about team practices as it is about tooling.

## The alert quality problem

Most on-call rotations have the same problem: too many alerts that wake people up unnecessarily, and not enough signal from the alerts that matter.

The discipline is: every alert should be actionable. If an engineer gets paged and there's nothing to do — or they don't know what to do — the alert needs to change.

Categories of bad alerts:
- **Too sensitive thresholds** — alerting at 70% CPU when the system handles 90% CPU fine
- **No context** — "High error rate" without any information about what's erroring or what to check
- **Symptom-less** — metrics that might indicate a problem, but might not, with no guidance for distinguishing
- **No runbook** — alerts with no documented response procedure

Review your alert-to-wake-up ratio regularly. If more than 30% of pages happen outside business hours and don't require immediate action, your alerts are misconfigured.

## Runbook standards

A runbook that doesn't work under pressure — when an engineer is half-asleep at 3am — isn't worth having. Good runbooks are:

**Immediately actionable.** What do you check first? What's the diagnostic sequence? What does each check tell you?

**Comprehensive for the common cases.** The 20% of root causes that cause 80% of incidents should be fully documented. Edge cases can be handled case by case.

**Regularly verified.** Runbooks rot. After every significant incident, update the runbook to reflect what you actually did.

**Written for the least experienced on-call engineer, not the most experienced.** If a runbook assumes knowledge of undocumented system behaviour, it fails when the experienced engineer isn't available.

Template for a runbook:

\`\`\`markdown
# Service: Payment Processing API

## Alert: High Error Rate (>5%)

### Immediate assessment
1. Check recent deployments: https://github.com/.../deployments
2. Check error distribution: https://grafana.../payment-errors
3. Check external dependency status: Stripe status page

### Common causes and resolution

**Recent deployment introduced errors:**
- Check error stacktraces in CloudWatch Logs
- Rollback procedure: [link to rollback runbook]

**Stripe API issues:**
- Check https://status.stripe.com
- If Stripe is down, errors are expected — no action required
- Alert the business channel with expected timeline

**Database connection pool exhaustion:**
- Check CloudWatch metric: payment-api/db-pool-utilisation
- If >90%, restart the service: [procedure]
- Escalate to database team if persists after restart
\`\`\`

## Rotation design

**Primary + secondary rotation** — Single on-call engineer with a secondary to escalate to. The secondary doesn't need to be awake; they need to be reachable. This prevents the primary from being stuck alone on a complex incident.

**Reasonable rotation size** — Rotations smaller than 4–5 engineers mean too-frequent on-call weeks. Larger rotations mean engineers go months between rotations and lose familiarity.

**Handoff procedures** — At the end of each rotation, the outgoing on-call engineer briefs the incoming one: open issues, recent incidents, anything behaving unusually, monitoring gaps they noticed.

## Post-incident practices

Blameless post-mortems are the mechanism for turning incidents into improvements. The goal is understanding what happened and preventing recurrence, not identifying fault.

A minimal post-mortem structure:
- **Timeline** — What happened, when, and what each response action was
- **Root cause** — The technical and process conditions that led to the incident
- **Customer impact** — What users experienced and for how long
- **Actions** — Specific changes to make, with owners and due dates

The actions are what matter. A post-mortem without concrete, tracked follow-up actions is documentation of a problem, not improvement.

## Measuring on-call health

Track these metrics over time:

- **Pages per week** — A rising trend means degrading alert quality or increasing systemic problems
- **Pages outside business hours** — Should be genuinely urgent
- **Mean time to resolution** — Improving over time indicates good runbook and tooling investment
- **Escalation rate** — Primary escalating to secondary regularly indicates runbook gaps or skill gaps
- **Engineer-reported on-call quality** — Survey your on-call engineers quarterly

On-call that works well feels like an occasional interruption handled effectively. On-call that works badly feels like a constant burden that nobody wants. The difference is almost entirely determined by alert quality, runbook quality, and whether you actually act on post-mortem findings.
    `,
  },
  {
    slug: "docker-build-optimization",
    title: "Optimising Docker Builds for Production",
    description:
      "Layer caching, multi-stage builds, image size reduction, and the patterns that make Docker builds fast in CI.",
    date: "2025-09-22",
    tags: ["Docker", "CI/CD", "DevOps", "Optimisation"],
    readingTime: 6,
    content: `
A Docker build that takes 15 minutes in CI is a 15-minute interruption to every developer's flow. Over a team of 10 engineers with 3 CI runs each per day, that's 7.5 hours of waiting daily. The investment in making builds fast pays back quickly.

## Layer caching fundamentals

Docker builds images layer by layer. Each instruction in your Dockerfile creates a layer, and if neither the instruction nor its context has changed since the last build, Docker reuses the cached layer.

The critical pattern: put things that change infrequently near the top, things that change frequently near the bottom.

Bad order (dependency install is invalidated whenever source changes):
\`\`\`dockerfile
FROM node:20-alpine
COPY . .
RUN npm ci
RUN npm run build
\`\`\`

Good order (dependency install only runs when package.json changes):
\`\`\`dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
\`\`\`

In the second example, \`npm ci\` is only re-run when \`package.json\` or \`package-lock.json\` changes. For most builds, this saves the majority of the build time.

## Multi-stage builds

Multi-stage builds solve two problems: they keep build tools out of production images, and they separate build concerns clearly.

For a Node.js application:
\`\`\`dockerfile
# Build stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Only copy the built output and production dependencies
COPY package*.json ./
RUN npm ci --production
COPY --from=builder /app/dist ./dist

EXPOSE 3000
CMD ["node", "dist/index.js"]
\`\`\`

The production image contains no TypeScript compiler, no development dependencies, no source files. Smaller images pull faster and have a smaller attack surface.

## BuildKit cache mounts

BuildKit (enabled by default in Docker 23+) supports cache mounts that persist across builds:

\`\`\`dockerfile
RUN --mount=type=cache,target=/root/.npm \
    npm ci
\`\`\`

This mounts a persistent cache directory for npm's package cache. Even if \`package-lock.json\` changes (triggering a cache miss on the layer), packages already downloaded are served from the cache rather than re-downloaded.

Same pattern for apt-get:
\`\`\`dockerfile
RUN --mount=type=cache,target=/var/cache/apt \
    apt-get update && apt-get install -y curl
\`\`\`

## Registry-based caching in CI

Local Docker cache is lost between CI runners. Registry-based cache persists:

\`\`\`yaml
# GitHub Actions
- uses: docker/build-push-action@v5
  with:
    context: .
    cache-from: type=gha
    cache-to: type=gha,mode=max
\`\`\`

Or using a registry:
\`\`\`yaml
- uses: docker/build-push-action@v5
  with:
    context: .
    cache-from: type=registry,ref=ghcr.io/myorg/myapp:buildcache
    cache-to: type=registry,ref=ghcr.io/myorg/myapp:buildcache,mode=max
\`\`\`

\`mode=max\` caches all layers including intermediate ones, maximising cache hits.

## Image size reduction

Smaller images are faster to push, pull, and run. Techniques:

**Use Alpine or distroless base images:**
\`\`\`dockerfile
FROM node:20-alpine  # ~180MB vs node:20 at ~1GB
\`\`\`

**Clean up in the same RUN instruction:**
\`\`\`dockerfile
RUN apt-get update && apt-get install -y curl \
    && rm -rf /var/lib/apt/lists/*
\`\`\`

Cleaning in a separate RUN creates a layer that adds files, then a layer that removes them — the image doesn't actually shrink. Same instruction = same layer.

**Use .dockerignore:**
\`\`\`
node_modules
.git
*.md
tests
\`\`\`

Keep the build context small. Everything in the build directory gets sent to the Docker daemon.

## Measuring improvements

Before optimising, benchmark:
\`\`\`bash
time docker build -t myapp . --no-cache
time docker build -t myapp .  # Second run, should be faster with cache
\`\`\`

After changes, compare. For CI builds, GitHub Actions shows step timing — use it to identify which steps are slowest.

A well-optimised build for a typical web application should complete in 2–5 minutes in CI with warm cache, and 5–10 minutes from scratch. If you're significantly above these numbers, the techniques above should move the needle.
    `,
  },
  {
    slug: "infrastructure-as-code-team-practices",
    title: "Infrastructure as Code Practices for Small Engineering Teams",
    description:
      "How to introduce and maintain Infrastructure as Code effectively in teams without dedicated platform engineers — structure, review processes, and avoiding the common pitfalls.",
    date: "2025-09-08",
    tags: ["IaC", "Terraform", "DevOps", "Engineering Practices"],
    readingTime: 7,
    content: `
Infrastructure as Code adoption in small teams often starts with good intentions and ends with a repository that nobody touches because nobody's quite sure what it does, or whether running terraform apply will break something.

Making IaC actually work in practice is about process and conventions as much as it is about Terraform modules.

## Start with what you have

The worst place to start IaC adoption is with greenfield infrastructure that doesn't exist yet. The best place is importing your existing infrastructure.

If your production database was created through the AWS console six months ago, start by writing the Terraform for it and importing the existing resource:

\`\`\`bash
terraform import aws_db_instance.main my-production-db
\`\`\`

This gives you a concrete artifact — infrastructure you understand, with Terraform code you can verify — rather than an abstract promise.

## Module structure for small teams

Resist the urge to build a module library. Start flat:

\`\`\`
infrastructure/
  environments/
    production/
      main.tf
      variables.tf
      outputs.tf
      terraform.tfvars
    staging/
      main.tf
      ...
  modules/      # Add only when you have clear reuse
\`\`\`

One directory per environment. Resources defined directly. If you find yourself copy-pasting the same 20-line resource block across three environments, then extract a module. Not before.

## Review process

Infrastructure changes should go through the same pull request process as application code — but with additional review steps:

**Plan review:** Include the \`terraform plan\` output in the PR. Reviewers should understand exactly what will change before approving:

\`\`\`yaml
# .github/workflows/terraform-plan.yml
- name: Terraform Plan
  run: terraform plan -out=plan.tfplan

- name: Post plan to PR
  uses: borchero/terraform-plan-comment@v1
  with:
    plan: plan.tfplan
\`\`\`

**Destruction review:** Any plan that shows resource destruction should get extra scrutiny. A database being replaced is a data loss event. Configure CI to fail loudly when a plan includes \`destroy\`:

\`\`\`yaml
- name: Check for destructions
  run: |
    if terraform plan -json | jq '.resource_changes[].change.actions[]' | grep -q '"delete"'; then
      echo "::error::This plan includes resource deletion. Review carefully."
      exit 1
    fi
\`\`\`

## State access control

Limit who can run \`terraform apply\` in production. In most small teams, production Terraform runs should happen through CI, not from individual engineers' machines.

CI assumes the IAM role, has the state bucket credentials, and runs against a specific plan file generated and reviewed in the PR process. Engineers can plan locally against a development environment, but production applies are gated.

## Drift detection

Resources get created, modified, or deleted outside of Terraform. Drift is inevitable when teams aren't fully disciplined about IaC. Detect it early:

\`\`\`yaml
# Scheduled workflow - runs every morning
- name: Detect drift
  run: |
    terraform plan -detailed-exitcode
  continue-on-error: true
  id: plan

- name: Alert on drift
  if: steps.plan.outputs.exitcode == '2'
  run: echo "Infrastructure drift detected"
  # Post to Slack, create GitHub issue, etc.
\`\`\`

Exit code 2 means changes needed (drift exists). Address it before it accumulates.

## Documentation that stays current

Comments in Terraform code have a short half-life. What works better:

**Variable descriptions:** Every variable should have a description that explains what it does and its valid values.

**Output descriptions:** Every output should explain what it provides and where it's used.

**Resource naming conventions in a README:** A short document in the infrastructure directory explaining naming conventions, how environments are structured, and how to make changes. This doesn't need to be comprehensive — it needs to answer the three questions a new engineer will have.

## The discipline question

The biggest challenge with team IaC isn't the tooling, it's the discipline to use it consistently. One emergency console change during an incident, left undocumented, becomes drift. Drift becomes confusion. Confusion becomes the reason nobody trusts the Terraform state.

Build the discipline early: if you make a change through the console, you also write the Terraform for it in the same sprint. No exceptions, or you're slowly accumulating a situation where your IaC doesn't reflect reality.
    `,
  },
  {
    slug: "api-design-backend-systems",
    title: "API Design Principles for Backend Systems",
    description:
      "Practical guidance on designing REST APIs that are maintainable, well-documented, and don't require renegotiation with consumers every few months.",
    date: "2025-08-25",
    tags: ["API", "Backend", "Architecture", "TypeScript"],
    readingTime: 8,
    content: `
API design decisions made early compound in both directions. Good design allows your API to evolve gracefully. Poor design creates the kind of breaking changes that require coordinating migration across multiple consumers, or maintaining a growing set of deprecated endpoints.

## Resource orientation

REST APIs should model resources — nouns — rather than operations. The HTTP methods provide the verbs.

Good:
\`\`\`
GET    /invoices          # List invoices
POST   /invoices          # Create invoice
GET    /invoices/:id      # Get invoice
PUT    /invoices/:id      # Replace invoice
PATCH  /invoices/:id      # Update invoice fields
DELETE /invoices/:id      # Delete invoice
\`\`\`

Common mistake: action-based URLs:
\`\`\`
POST /createInvoice
POST /sendInvoice
POST /markInvoicePaid
\`\`\`

These aren't wrong in every case — RPC-style APIs have their place — but for most CRUD-oriented systems, resource-oriented design is more predictable and consistent.

For actions that don't map cleanly to CRUD, sub-resources or actions work:
\`\`\`
POST /invoices/:id/send     # Send invoice to client
POST /invoices/:id/payments # Record a payment against the invoice
\`\`\`

## Response envelope consistency

Pick a response envelope and use it consistently. One pattern:

\`\`\`typescript
// Success response
{
  "data": { "id": "123", "status": "sent" },
  "meta": { "timestamp": "2025-09-01T10:00:00Z" }
}

// Error response
{
  "error": {
    "code": "INVOICE_NOT_FOUND",
    "message": "Invoice 123 does not exist",
    "details": {}
  }
}

// List response
{
  "data": [...],
  "meta": {
    "total": 47,
    "page": 1,
    "per_page": 20,
    "pages": 3
  }
}
\`\`\`

Consistent envelopes mean consumers can write generic error handling and pagination logic. Inconsistency means every endpoint requires specific handling.

## Error codes and messages

HTTP status codes carry coarse error semantics. Use them correctly:

- **400** — Malformed request (invalid JSON, wrong field types)
- **401** — Not authenticated
- **403** — Authenticated but not authorised
- **404** — Resource doesn't exist
- **409** — Conflict (duplicate resource, state conflict)
- **422** — Validation error (valid request format, invalid field values)
- **500** — Server error (unexpected)

Machine-readable error codes separate from the human-readable message allow consumers to handle specific errors programmatically:

\`\`\`typescript
// 422 Validation Error
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request validation failed",
    "details": {
      "fields": {
        "email": "Must be a valid email address",
        "due_date": "Due date must be after issue date"
      }
    }
  }
}
\`\`\`

## Versioning strategy

Version from day one, even if you think you won't need it. URL versioning (\`/v1/invoices\`) is the most visible and easiest to route:

\`\`\`
/api/v1/invoices
/api/v2/invoices  # Breaking changes go here
\`\`\`

Version only when you need to make breaking changes. Non-breaking changes (adding fields, adding endpoints) don't require a version bump.

Document clearly what constitutes a breaking change: removing fields, changing field types, changing status codes, removing endpoints, changing authentication requirements.

## Pagination and filtering

Use consistent query parameter patterns:

\`\`\`
GET /invoices?page=2&per_page=20
GET /invoices?status=pending&client_id=123
GET /invoices?sort=due_date&order=asc
\`\`\`

Return pagination metadata in every list response:
\`\`\`json
{
  "data": [...],
  "meta": {
    "total": 143,
    "page": 2,
    "per_page": 20,
    "has_next": true,
    "has_prev": true
  }
}
\`\`\`

For large datasets, cursor-based pagination is more reliable than page-based (avoids the "page changed while I was paginating" problem).

## Authentication and security

Use bearer tokens in the Authorization header, not query parameters:

\`\`\`
Authorization: Bearer eyJhbG...
\`\`\`

Query parameter tokens appear in server logs and browser history.

Rate limit every endpoint, not just expensive ones. Return \`Retry-After\` headers when rate limits are hit.

## OpenAPI documentation

Generate your OpenAPI spec from code, not the other way around. For TypeScript backends, tools like \`zod-to-openapi\` or \`ts-rest\` can derive the spec from your type definitions:

\`\`\`typescript
const invoiceSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(['draft', 'sent', 'paid', 'overdue']),
  total: z.number().positive(),
});
\`\`\`

This keeps documentation in sync with implementation automatically. Out-of-date API documentation is worse than no documentation — it actively misleads.
    `,
  },
  {
    slug: "backend-for-frontend-pattern",
    title: "The Backend for Frontend Pattern in Practice",
    description:
      "When and how to implement BFF — aggregating upstream services, tailoring responses for specific clients, and the tradeoffs versus direct client-to-service calls.",
    date: "2025-08-10",
    tags: ["Architecture", "Backend", "API", "Microservices"],
    readingTime: 7,
    content: `
The Backend for Frontend pattern addresses a specific problem that emerges when client applications need to consume multiple upstream services: the client ends up making many API calls, receiving more data than it needs, and implementing aggregation logic that belongs on the server.

BFF solves this by introducing a server-side layer tailored to a specific client's needs.

## The problem it solves

Consider a mobile app dashboard that needs to show: the user's profile, their recent orders, their account balance, and their notification count. With direct service calls, the client makes four requests to four different services, waits for all of them to complete, and combines the results.

Problems:
- Four sequential or parallel network calls from the client
- Each service returns its full response; the client uses a fraction of the fields
- Aggregation logic lives in the client
- Changing the dashboard requires changes to the client and potentially all four services

A BFF exposes a single endpoint:
\`\`\`
GET /api/dashboard
\`\`\`

That makes all four calls server-side (in parallel, over low-latency internal network), combines the results, strips unused fields, and returns exactly what the dashboard needs.

## When BFF makes sense

**Multiple downstream services to aggregate.** BFF adds overhead — don't introduce it for a single upstream service.

**Multiple client types with different needs.** A mobile app and a web app calling the same services but needing different data shapes is the canonical use case.

**Strict bandwidth constraints.** Mobile clients benefit significantly from not receiving large payloads with most fields unused.

**Downstream services outside your control.** Third-party APIs with inconsistent interfaces, authentication schemes, and response shapes can be normalised behind a BFF layer.

## When it's overkill

**Small number of services.** If your architecture has three services, direct client calls are simpler.

**Identical client needs.** If all your clients need the same data in the same shape, a single general API is fine.

**Team organisation.** BFF ideally follows Conway's Law — a team owns both the client and its BFF. If the team structure doesn't support this, the BFF becomes a shared API with all the coordination problems that implies.

## Implementation patterns

A BFF for a Next.js app can live in the same codebase as route handlers:

\`\`\`typescript
// app/api/dashboard/route.ts
export async function GET(request: Request) {
  const session = await getSession(request);
  if (!session) return Response.json(null, { status: 401 });

  const [profile, orders, balance, notifications] = await Promise.all([
    fetchUserProfile(session.userId),
    fetchRecentOrders(session.userId),
    fetchAccountBalance(session.userId),
    fetchNotificationCount(session.userId),
  ]);

  return Response.json({
    profile: {
      name: profile.displayName,
      avatar: profile.avatarUrl,
    },
    recentOrders: orders.slice(0, 5).map(o => ({
      id: o.id,
      status: o.status,
      total: o.total,
    })),
    balance: balance.available,
    hasUnreadNotifications: notifications.unread > 0,
  });
}
\`\`\`

The client calls one endpoint and gets exactly what it needs.

## Caching in the BFF

With aggregation happening server-side, caching becomes powerful. The BFF can cache upstream responses at appropriate granularities:

\`\`\`typescript
async function fetchUserProfile(userId: string) {
  // Profile changes infrequently — cache for 5 minutes
  const cached = await cache.get(\`profile:\${userId}\`);
  if (cached) return cached;

  const profile = await profileService.get(userId);
  await cache.set(\`profile:\${userId}\`, profile, 300);
  return profile;
}
\`\`\`

Different upstream services often have different cache characteristics. The BFF can handle this nuance in a way that client-side caching can't.

## Failure handling

When one upstream service fails, the BFF can decide the appropriate response:

\`\`\`typescript
const [profile, orders] = await Promise.allSettled([
  fetchUserProfile(userId),
  fetchRecentOrders(userId),
]);

return Response.json({
  profile: profile.status === 'fulfilled' ? profile.value : null,
  orders: orders.status === 'fulfilled' ? orders.value : [],
  // Dashboard still renders, with degraded data where services failed
});
\`\`\`

This is more sophisticated than client-side handling of the same failure scenario.

## The coordination cost

BFF introduces a server-side layer that needs to be maintained alongside the clients it serves. When an upstream service changes its API, the BFF needs to be updated. When a new client feature requires data that the BFF doesn't currently expose, the BFF needs to be changed.

This is the real cost: not infrastructure, but coordination. The value proposition is that centralising this coordination in the BFF (rather than in each client) is net simpler. For teams with multiple client types and several upstream services, it usually is.
    `,
  },
  {
    slug: "cost-optimisation-aws-practical",
    title: "Practical AWS Cost Optimisation for Growing Startups",
    description:
      "Where AWS bills actually come from and how to reduce them — EC2 right-sizing, data transfer costs, storage tiers, and the things that sneak up on you.",
    date: "2025-07-28",
    tags: ["AWS", "Cost Optimisation", "FinOps", "Cloud"],
    readingTime: 8,
    content: `
AWS cloud bills grow in two ways: intentionally, because your business is growing; and accidentally, because resources were provisioned for testing and never deleted, because data transfer costs weren't considered in the architecture, or because instances were sized for peak load that never materialised.

The second category is where cost optimisation work actually happens.

## Where the money actually goes

Before optimising, understand your bill. AWS Cost Explorer breaks down spend by service, region, and resource tag. If you don't have resource tagging, start there — you can't optimise what you can't measure.

Common patterns in startup bills:

**EC2 instances sized for projected load, not actual load.** m5.xlarge instances running at 8% CPU utilisation are paying for capacity they're not using.

**Data transfer.** Often invisible until the bill arrives. Data leaving AWS (egress) to the internet costs money. Data moving between regions costs money. Data between availability zones costs money for most services. Poor architecture can make data transfer a significant bill item.

**NAT Gateway data processing.** NAT Gateways charge per GB of data processed. High-volume data flows (log shipping, metrics, backups) going through a NAT Gateway add up.

**Idle or forgotten resources.** Development databases, snapshots from terminated instances, load balancers pointed at nothing, Elastic IPs not attached to running instances.

**S3 storage with no lifecycle policies.** Objects accumulate. Without lifecycle policies, that data stays in Standard storage tier forever.

## EC2 right-sizing

Run Cost Explorer's rightsizing recommendations. They're conservative by default — an m5.large that the recommendation engine suggests is often still oversized in practice.

For a more accurate view, use CloudWatch metrics:
- CPU utilisation over the last 30 days
- Memory utilisation (requires CloudWatch agent)
- Network throughput compared to instance limits

A rule of thumb: if average CPU utilisation is below 20%, the instance is probably oversized. P99 CPU utilisation matters more than average for latency-sensitive services.

Savings Plans and Reserved Instances provide 30–60% discounts on compute. For any instance you're confident will run for 12+ months, purchasing a Savings Plan is straightforward cost reduction. Compute Savings Plans apply across instance families and regions, reducing the commitment risk.

## Spot instances where appropriate

Spot instances can be 70–90% cheaper than On-Demand. The constraint is they can be interrupted with 2-minute notice.

Workloads suited for Spot:
- CI/CD workers (stateless, can restart)
- Batch processing jobs
- Development environments
- ECS tasks or EKS nodes where the application handles interruption gracefully

Workloads NOT suited for Spot:
- Primary database instances
- Services where interruption causes user-visible failures

ECS and EKS both support mixed instance groups with Spot and On-Demand nodes, routing appropriate workloads to each.

## Data transfer optimisation

**Use VPC endpoints for S3 and DynamoDB.** Traffic to these services through a VPC endpoint doesn't go through a NAT Gateway and doesn't incur data processing charges. For services that read/write to S3 frequently, this is often a meaningful reduction.

**CloudFront for serving content.** Data transfer from CloudFront to users is cheaper than directly from S3 or EC2. For applications serving significant content, the transfer cost difference plus the CDN performance benefits make CloudFront almost always worth it.

**Same-AZ data transfer.** When possible, keep related services in the same AZ. Cross-AZ data transfer within AWS costs $0.01/GB in both directions. For high-volume data flows, this adds up.

## S3 optimisation

Set lifecycle policies for everything:

\`\`\`json
{
  "Rules": [{
    "Status": "Enabled",
    "Transitions": [
      { "Days": 30, "StorageClass": "STANDARD_IA" },
      { "Days": 90, "StorageClass": "GLACIER" },
      { "Days": 365, "StorageClass": "DEEP_ARCHIVE" }
    ],
    "NoncurrentVersionExpiration": {
      "NoncurrentDays": 30
    }
  }]
}
\`\`\`

Backups older than 30 days are rarely accessed — STANDARD_IA costs 40% less. Long-term archives in GLACIER cost 80% less than Standard.

Enable S3 Intelligent-Tiering for access patterns you can't predict. It automatically moves objects between tiers based on access frequency.

## The ongoing practice

Cost optimisation isn't a one-time project. AWS bills change as usage patterns change, new services are used, and teams provision things that don't get cleaned up.

Monthly reviews of Cost Explorer — 30 minutes — catch drift before it compounds. Budget alerts at thresholds above your expected spend catch unexpected resource creation.

Tagging resources with environment, service, and owner makes attribution possible. Without tags, you're estimating where costs come from.
    `,
  },
  {
    slug: "workflow-automation-without-code",
    title: "Engineering Workflow Automation: Code vs. Low-Code Tools",
    description:
      "When to write custom automation code versus using n8n, Zapier, or Make — a practical framework for choosing the right tool.",
    date: "2025-07-15",
    tags: ["Automation", "Workflow", "Engineering", "n8n"],
    readingTime: 6,
    content: `
Workflow automation tooling has expanded significantly. The choice between writing custom code and using a low-code tool like n8n, Zapier, or Make is now a real decision rather than a default.

Getting it right means faster automation delivery and lower maintenance burden. Getting it wrong means either over-engineering simple workflows or under-engineering complex ones.

## What low-code tools are good at

**Multi-system glue.** Connecting CRM to Slack, triggering invoices when a deal closes, syncing form submissions to a spreadsheet. These are exactly what Zapier, Make, and n8n are designed for. The visual workflow editor maps to the problem structure directly.

**Non-technical ownership.** If the automation will be maintained or extended by someone who doesn't write code, a visual tool is the right choice. The alternative — custom code they can't modify — is a maintenance bottleneck.

**Standard integration patterns.** If the integration pattern is common enough that a connector exists, low-code is almost always faster to implement than custom code.

**Rapid iteration.** Building a workflow in n8n takes minutes. Deploying custom code takes longer. For exploratory automation where you're not sure if it's worth the full investment, low-code lets you validate quickly.

## When custom code is right

**Complex business logic.** When the automation needs to make decisions that go beyond conditional branching — calculations, complex transformations, error recovery logic — custom code is more readable, more testable, and more maintainable than a visual workflow with many nodes.

**High reliability requirements.** Custom code can be tested, monitored with standard APM tools, and operated with the same practices as production services. Low-code tools have their own operational characteristics that may not meet your reliability requirements.

**Non-standard data transformations.** Manipulating complex data structures — nested JSON transformations, binary data, complex date calculations — is awkward in visual tools and natural in code.

**Volume and performance requirements.** If the automation runs frequently and at high volume, custom code gives you direct control over performance. Low-code tools have rate limits and processing costs that matter at scale.

**Security and compliance requirements.** Custom code lets you audit exactly what data flows where. Third-party low-code services process your data through their infrastructure, which may not be acceptable for sensitive information.

## n8n as a middle ground

n8n is self-hosted, which addresses the data sovereignty concern with SaaS tools like Zapier. It's more technically oriented than Zapier — the target user is an engineer who wants a visual workflow tool without the limitations of Zapier's model.

Self-hosting n8n on a small cloud instance ($10–20/month) gives you:
- All the connector ecosystem of a low-code tool
- Full control over data (it doesn't leave your infrastructure)
- Code nodes for complex logic in JavaScript
- An API for triggering workflows programmatically

For internal engineering workflows where you want low-code convenience without data concerns, n8n is often the right choice.

## A framework for deciding

1. **Who maintains it?** Non-technical team → low-code. Engineering team → either.
2. **How complex is the logic?** Simple conditional branching → low-code. Complex transformations and decisions → code.
3. **What are the data sensitivity requirements?** Sensitive data → custom code or self-hosted (n8n). Standard data → any.
4. **What's the volume?** High volume → custom code. Low-moderate volume → low-code.
5. **How quickly do you need it?** Immediate validation → low-code. Production-grade → design properly.

The mistake in both directions is expensive. Custom code for a workflow that should take an hour to build in n8n wastes engineering time. Low-code for a complex, high-volume, business-critical automation creates a fragile system that's difficult to debug and expensive to operate.
    `,
  },
  {
    slug: "database-migrations-production-safety",
    title: "Safe Database Migrations in Production",
    description:
      "How to make schema changes to production databases without downtime — migration patterns, rollback strategies, and the gotchas that cause incidents.",
    date: "2025-07-01",
    tags: ["Database", "PostgreSQL", "DevOps", "Production"],
    readingTime: 8,
    content: `
Database migrations are one of the highest-risk operations in production deployments. Unlike application code deployments that can be rolled back by pushing the previous version, a migration that modifies data or removes columns cannot always be reversed cleanly.

Most production migration incidents are preventable with the right patterns.

## The expand-contract pattern

The safest approach to breaking changes: expand first, then contract.

**Scenario:** Rename a column from \`user_name\` to \`display_name\`.

Naive approach (dangerous — causes downtime):
\`\`\`sql
ALTER TABLE users RENAME COLUMN user_name TO display_name;
\`\`\`

This breaks any deployed application code that references \`user_name\` the moment the migration runs.

Expand-contract approach:
1. **Expand:** Add the new column, populate it, keep the old one
\`\`\`sql
ALTER TABLE users ADD COLUMN display_name TEXT;
UPDATE users SET display_name = user_name;
-- Deploy application code that writes to both columns, reads from display_name
\`\`\`

2. **Deploy application code** that writes to both \`user_name\` and \`display_name\`, reads from \`display_name\`.

3. **Contract:** Remove the old column (after verifying all application instances are updated)
\`\`\`sql
ALTER TABLE users DROP COLUMN user_name;
-- Deploy application code that only references display_name
\`\`\`

This approach allows the migration to be fully reversible and eliminates the deployment-database coupling that causes downtime.

## Lock-safe migrations

Some DDL operations in PostgreSQL acquire aggressive locks that block all reads and writes. The most dangerous: \`ADD COLUMN with DEFAULT\` (PostgreSQL <11), \`ALTER COLUMN TYPE\`, index creation without \`CONCURRENTLY\`.

**Adding columns (PostgreSQL 11+):**
\`\`\`sql
-- Safe: volatile default, no table rewrite
ALTER TABLE orders ADD COLUMN notes TEXT;

-- Also safe in PG 11+: stored default, no longer rewrites entire table
ALTER TABLE orders ADD COLUMN status TEXT DEFAULT 'pending';
\`\`\`

**Creating indexes:**
\`\`\`sql
-- Dangerous: locks the table during index build
CREATE INDEX idx_orders_status ON orders(status);

-- Safe: builds concurrently, minimal locking
CREATE INDEX CONCURRENTLY idx_orders_status ON orders(status);
\`\`\`

**Changing column types:**

Avoid where possible. If necessary, use the expand-contract pattern: add new column with new type, backfill, switch reads/writes, drop old column.

## Backfill migrations

Populating a new column with data from existing rows is one of the most commonly botched migrations.

Naive approach (dangerous on large tables):
\`\`\`sql
UPDATE orders SET status_v2 = CASE
  WHEN status = 'open' THEN 'pending'
  WHEN status = 'closed' THEN 'complete'
END;
\`\`\`

On a table with millions of rows, this holds a lock while writing every row — potentially for minutes.

Batched approach:
\`\`\`sql
DO $$
DECLARE
  batch_size INT := 1000;
  offset_val INT := 0;
BEGIN
  LOOP
    UPDATE orders
    SET status_v2 = CASE
      WHEN status = 'open' THEN 'pending'
      WHEN status = 'closed' THEN 'complete'
    END
    WHERE id IN (
      SELECT id FROM orders WHERE status_v2 IS NULL
      ORDER BY id LIMIT batch_size
    );

    EXIT WHEN NOT FOUND;
    COMMIT;
    PERFORM pg_sleep(0.1);  -- Small sleep to reduce lock contention
  END LOOP;
END $$;
\`\`\`

Batching reduces lock duration to milliseconds per batch. The small sleep prevents the migration from overwhelming the database.

## Migration tooling

Use a migration tool that tracks which migrations have run and which haven't. Popular options:

- **Flyway** — SQL-based migrations, strong production track record
- **Liquibase** — More complex, XML/YAML/SQL, good enterprise features
- **Prisma Migrate** — Excellent for TypeScript/Node.js applications
- **goose** — Simple Go tool, works with any language

Avoid running raw SQL scripts manually. Track state, version your migrations, and run them through the same CI/CD pipeline as application code.

## Rollback strategy

Not all migrations are reversible. Before running any migration:

1. **Verify you have a backup** (or can restore from a recent snapshot)
2. **Write the down migration** — if the migration can be reversed, document how
3. **Identify the irreversible steps** — \`DROP TABLE\`, \`DROP COLUMN\` with data, type changes with lossy conversion

For operations that can't be undone:
- Test on a copy of production data first
- Verify the operation before and after in staging
- Have a communication plan for extended downtime if something goes wrong

## Zero-downtime deployments with migrations

The general principle: your application code must be compatible with both the old schema and the new schema during the migration window.

This means:
- New columns must be nullable (or have defaults) when first added
- Column reads and writes must handle both old and new values during transition
- New tables can be written to before they're fully populated
- Indexes can be added asynchronously without blocking deployments

The discipline is to always think about what happens when half your application instances are running old code and half are running new code, and both schemas exist simultaneously.
    `,
  },
  {
    slug: "observability-production-systems",
    title: "Observability for Production Systems That Actually Helps",
    description:
      "Building observability that answers questions during incidents — logs, metrics, and traces configured for real operational use, not compliance.",
    date: "2025-06-15",
    tags: ["Observability", "Monitoring", "DevOps", "Operations"],
    readingTime: 7,
    content: `
Most production systems have some level of monitoring. Many have observability that's configured but not useful — dashboards nobody looks at except during incidents, alerts that cry wolf, and logs that exist but can't answer the question "why is this slow?"

Useful observability is designed around the questions you'll need to answer under pressure.

## The three pillars, pragmatically

**Logs** tell you what happened and in what sequence. They're your audit trail and your debugging surface. Good logs are structured (JSON), include relevant context (user ID, request ID, correlation ID), and are at the right level (not so verbose you can't find the signal).

**Metrics** tell you what the system is doing in aggregate over time. Request rate, error rate, latency percentiles, queue depth. Metrics are what your alerts are based on and what your dashboards show.

**Traces** tell you where time goes within a request — which service calls, which database queries, which external API calls account for the latency you observed. Traces are invaluable for diagnosing slow requests in distributed systems.

Most production incidents require at least two of the three pillars. Design them together.

## Structured logging

Unstructured logs:
\`\`\`
INFO: Processing order 12345 for user 789 - completed in 245ms
ERROR: Payment failed for order 12345: Card declined
\`\`\`

Structured logs:
\`\`\`json
{"level":"info","message":"order.processing.complete","order_id":"12345","user_id":"789","duration_ms":245,"timestamp":"2025-06-15T10:00:00Z","trace_id":"abc123"}
{"level":"error","message":"payment.failed","order_id":"12345","reason":"card_declined","gateway":"stripe","timestamp":"2025-06-15T10:00:01Z","trace_id":"abc123"}
\`\`\`

Structured logs are queryable. "Show me all payment failures for user 789 in the last hour" is a structured query. It's impossible on unstructured logs at scale.

The \`trace_id\` field is critical: use a correlation ID that ties together all log entries for a single request, so you can reconstruct the full request timeline.

## Metric design

The RED method (Rate, Errors, Duration) applied to every service provides a minimum viable metrics set:

- **Rate** — requests per second
- **Errors** — error rate (errors/total requests)
- **Duration** — response time (P50, P95, P99)

For every external dependency (database, cache, third-party API), track the same RED metrics. This surfaces dependency degradation before it causes user-visible failures.

Business metrics alongside technical metrics:
- Orders created per minute
- Payment success rate
- User signups per hour

Technical metrics tell you the system is slow. Business metrics tell you the slowness is affecting revenue.

## Alert design

The discipline: alert on symptoms that affect users, not on causes.

User-affecting symptoms:
- High error rate (>1% for most services)
- Elevated P99 latency (define what's unacceptable for your service)
- Service unavailability (uptime check failures)

Causes (more context, less urgency):
- High CPU utilisation
- Memory approaching limits
- Queue depth growing

Alert on symptoms. Use cause metrics to investigate why the symptom exists.

False positive alerts are toxic. Every false positive trains the on-call engineer to respond slowly and question alerts before acting. When a real incident happens, this delays response.

Review your false positive rate monthly. Tune ruthlessly.

## Distributed tracing

For systems with more than one service, distributed tracing is the difference between spending 10 minutes or 2 hours diagnosing a latency spike.

OpenTelemetry is the standard:

\`\`\`typescript
import { trace, context } from '@opentelemetry/api';

const tracer = trace.getTracer('order-service');

async function processOrder(orderId: string) {
  const span = tracer.startSpan('processOrder', {
    attributes: { 'order.id': orderId }
  });

  try {
    // All calls within this context will be traced as child spans
    await context.with(trace.setSpan(context.active(), span), async () => {
      await validateOrder(orderId);
      await chargePayment(orderId);
      await fulfillOrder(orderId);
    });
  } finally {
    span.end();
  }
}
\`\`\`

Traces show you: \`processOrder → validateOrder (12ms) → chargePayment (823ms) → fulfillOrder (45ms)\`. The payment charge is slow. Without traces, you'd see the request took 900ms and have no idea where the time went.

## The dashboard that matters

Build one dashboard for the on-call engineer. It should answer: "Is the system healthy right now?"

Include:
- Request rate (is there traffic?)
- Error rate (is anything failing?)
- P99 latency (is it slow?)
- Key dependency health (are databases, caches, external APIs healthy?)

Everything else belongs on deeper investigation dashboards, not the primary operational view.

## The operational investment

Observability infrastructure requires maintenance. Dashboards need updating when services change. Alert thresholds need tuning as load patterns evolve. Log schemas need to be considered when writing new code.

Teams that treat observability as a one-time setup tend to end up with monitoring that was designed for the system as it existed when they set it up, not the system as it exists now. Build the habit of updating monitoring as part of every feature deployment.
    `,
  },
];

export function getBlogPost(slug: string) {
  return blogPosts.find((p) => p.slug === slug);
}
