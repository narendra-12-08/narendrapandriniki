#!/usr/bin/env node
/**
 * Generates 10 LinkedIn carousel slides (1080x1080 PNG) about Narendra Pandrinki.
 * Saves to ~/Desktop/linkedin-slides/
 * Uses Chrome headless for rendering.
 */

import { execSync } from "child_process";
import { mkdirSync, writeFileSync, rmSync, existsSync } from "fs";
import { join } from "path";
import { homedir } from "os";

const OUT_DIR = join(homedir(), "Desktop", "linkedin-slides");
const TMP_DIR = join(OUT_DIR, ".tmp_html");

mkdirSync(OUT_DIR, { recursive: true });
mkdirSync(TMP_DIR, { recursive: true });

const CHROME =
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

// ─────────────────────────────────────────────
// Design tokens
// ─────────────────────────────────────────────
const BG = "#05060a";
const SURFACE = "#11141f";
const SURFACE2 = "#161a28";
const BORDER = "#232839";
const TEXT = "#eef0f6";
const TEXT2 = "#c4c9d8";
const TEXT3 = "#8a90a3";
const ACCENT = "#22d3ee";
const VIOLET = "#a78bfa";
const LIME = "#a3e635";
const AMBER = "#f59e0b";
const ROSE = "#fb7185";

function css() {
  return `
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      width: 1080px; height: 1080px; overflow: hidden;
      background: ${BG};
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      color: ${TEXT};
      position: relative;
    }
    .grid-bg {
      position: absolute; inset: 0;
      background-image: linear-gradient(${BORDER} 1px, transparent 1px),
                        linear-gradient(90deg, ${BORDER} 1px, transparent 1px);
      background-size: 64px 64px;
      opacity: 0.35;
    }
    .content { position: relative; z-index: 1; padding: 72px; height: 100%; display: flex; flex-direction: column; }
    .eyebrow {
      font-family: 'SF Mono', 'Courier New', monospace;
      font-size: 14px; letter-spacing: 0.2em; text-transform: uppercase;
      color: ${ACCENT}; font-weight: 600;
    }
    .tag {
      display: inline-block; padding: 4px 12px; border-radius: 4px;
      border: 1px solid ${BORDER}; font-size: 12px;
      color: ${TEXT3}; font-family: monospace;
    }
    .pill {
      display: inline-block; padding: 6px 16px; border-radius: 999px;
      background: rgba(34,211,238,0.1); border: 1px solid rgba(34,211,238,0.3);
      color: ${ACCENT}; font-size: 14px; font-weight: 600;
    }
    .card {
      background: ${SURFACE}; border: 1px solid ${BORDER};
      border-radius: 16px; padding: 28px;
    }
    .number {
      font-size: 52px; font-weight: 700; line-height: 1;
      background: linear-gradient(135deg, ${ACCENT}, ${VIOLET});
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    }
    .footer-bar {
      margin-top: auto; padding-top: 32px;
      border-top: 1px solid ${BORDER};
      display: flex; align-items: center; justify-content: space-between;
    }
    .avatar {
      width: 40px; height: 40px; border-radius: 50%;
      background: linear-gradient(135deg, ${ACCENT}, ${VIOLET});
      display: flex; align-items: center; justify-content: center;
      font-weight: 700; font-size: 16px; color: ${BG};
    }
    .slide-num {
      font-family: monospace; font-size: 12px; color: ${TEXT3};
    }
  `;
}

// ─────────────────────────────────────────────
// Slide definitions
// ─────────────────────────────────────────────
const slides = [
  // 1 — Cover
  {
    filename: "slide-01-intro.png",
    html: `
      <div class="grid-bg"></div>
      <div class="content" style="justify-content: center; gap: 0;">
        <div class="avatar" style="width:72px;height:72px;font-size:28px;margin-bottom:36px;">N</div>
        <div class="eyebrow" style="margin-bottom:24px;">Independent · Cloud · DevOps · AI</div>
        <h1 style="font-size:72px;font-weight:800;line-height:1.05;letter-spacing:-2px;">
          Narendra<br/>
          <span style="background:linear-gradient(135deg,${ACCENT},${VIOLET});-webkit-background-clip:text;-webkit-text-fill-color:transparent;">Pandrinki</span>
        </h1>
        <p style="margin-top:32px;font-size:22px;color:${TEXT2};max-width:680px;line-height:1.6;">
          5 years building production platforms for teams that take reliability, scale, and engineering velocity seriously.
        </p>
        <div style="margin-top:48px;display:flex;gap:16px;flex-wrap:wrap;">
          ${["AWS · GCP · Azure", "Kubernetes", "SRE", "AI/ML Infra", "India-based · Global clients"].map(t => `<span class="pill">${t}</span>`).join("")}
        </div>
        <div class="footer-bar">
          <span style="font-size:15px;color:${TEXT3};">narendrapandrinki.com</span>
          <span class="slide-num">01 / 10</span>
        </div>
      </div>
    `,
    caption: `5 years. 3 clouds. One engineer who ships.\n\nI'm Narendra Pandrinki — an independent DevOps, Platform, and Cloud engineer based in India, working with teams across India, UK, US, Singapore, and Dubai.\n\nIf you're building in fintech, healthtech, AI/ML, or SaaS and need serious platform engineering, this carousel is for you.\n\n👇 Swipe through.\n\n#DevOps #CloudEngineering #PlatformEngineering #AWS #Kubernetes #SRE`,
  },

  // 2 — 5 Years Experience
  {
    filename: "slide-02-experience.png",
    html: `
      <div class="grid-bg"></div>
      <div class="content">
        <div class="eyebrow" style="margin-bottom:20px;">5 Years · Real production systems</div>
        <h2 style="font-size:54px;font-weight:800;line-height:1.1;letter-spacing:-1.5px;">
          What 5 years in<br/>platform engineering<br/>
          <span style="background:linear-gradient(135deg,${ACCENT},${VIOLET});-webkit-background-clip:text;-webkit-text-fill-color:transparent;">actually looks like</span>
        </h2>
        <div style="margin-top:52px;display:grid;grid-template-columns:1fr 1fr;gap:20px;flex:1;">
          ${[
            ["50+", "production workloads migrated to cloud"],
            ["99.99%", "SLA maintained across fintech platforms"],
            ["60%", "average infra cost reduction after FinOps"],
            ["3", "clouds mastered: AWS, GCP, Azure"],
          ].map(([n, l]) => `
            <div class="card" style="display:flex;flex-direction:column;gap:8px;">
              <div class="number">${n}</div>
              <p style="font-size:15px;color:${TEXT2};line-height:1.4;">${l}</p>
            </div>
          `).join("")}
        </div>
        <div class="footer-bar">
          <div style="display:flex;align-items:center;gap:12px;">
            <div class="avatar">N</div>
            <span style="font-size:15px;color:${TEXT3};">Narendra Pandrinki</span>
          </div>
          <span class="slide-num">02 / 10</span>
        </div>
      </div>
    `,
    caption: `Numbers from 5 years of building and operating production platforms:\n\n→ 50+ workloads migrated to cloud\n→ 99.99% SLA maintained across fintech systems\n→ 60% average infrastructure cost reduction via FinOps\n→ AWS, GCP, and Azure — not just one cloud\n\nThis is the result of doing the unglamorous work right: deliberate architecture, tested failovers, and observability tied to user journeys.\n\n#CloudMigration #FinOps #SRE #AWS #GCP #Azure #DevOps`,
  },

  // 3 — Cloud & DevOps
  {
    filename: "slide-03-cloud-devops.png",
    html: `
      <div class="grid-bg"></div>
      <div class="content">
        <div class="eyebrow" style="margin-bottom:20px;">Service 01 · Cloud & DevOps</div>
        <h2 style="font-size:56px;font-weight:800;line-height:1.1;letter-spacing:-1.5px;">
          Cloud that works<br/>
          <span style="background:linear-gradient(135deg,${ACCENT},${VIOLET});-webkit-background-clip:text;-webkit-text-fill-color:transparent;">under pressure</span>
        </h2>
        <p style="margin-top:24px;font-size:19px;color:${TEXT2};line-height:1.6;max-width:720px;">
          Production environments designed deliberately — resilient, cost-aware, and built so your engineers can move fast without paging anyone at 3am.
        </p>
        <div style="margin-top:40px;display:flex;flex-direction:column;gap:16px;">
          ${[
            ["Multi-account landing zones done once, done right", ACCENT],
            ["Right-sized workloads with FinOps visibility from day one", VIOLET],
            ["Hardened IAM, secrets management, network segmentation", LIME],
            ["On-call runbooks your team can actually follow", AMBER],
          ].map(([text, color]) => `
            <div style="display:flex;align-items:center;gap:16px;">
              <div style="width:6px;height:6px;border-radius:50%;background:${color};flex-shrink:0;"></div>
              <span style="font-size:17px;color:${TEXT2};">${text}</span>
            </div>
          `).join("")}
        </div>
        <div style="margin-top:36px;display:flex;gap:12px;flex-wrap:wrap;">
          ${["AWS", "GCP", "Azure", "Terraform", "Pulumi", "CloudFormation"].map(t => `<span class="tag">${t}</span>`).join("")}
        </div>
        <div class="footer-bar">
          <div style="display:flex;align-items:center;gap:12px;">
            <div class="avatar">N</div>
            <span style="font-size:15px;color:${TEXT3};">narendrapandrinki.com/services</span>
          </div>
          <span class="slide-num">03 / 10</span>
        </div>
      </div>
    `,
    caption: `Most cloud accounts are accidents. They grew with the company — a region here, a forgotten experiment there, bills that keep creeping.\n\nI rebuild that. Not by tearing it down — by introducing structure, automation, and ownership in the right places.\n\nWhat this means for you:\n✓ Landing zones that scale without debt\n✓ Cost visibility from week one\n✓ IAM and network posture that passes security audits\n✓ Runbooks your on-call team will actually use\n\n#CloudDevOps #Terraform #AWS #GCP #Azure #LandingZone #FinOps`,
  },

  // 4 — Platform Engineering
  {
    filename: "slide-04-platform.png",
    html: `
      <div class="grid-bg"></div>
      <div class="content">
        <div class="eyebrow" style="margin-bottom:20px;">Service 02 · Platform Engineering</div>
        <h2 style="font-size:52px;font-weight:800;line-height:1.1;letter-spacing:-1.5px;">
          Give your engineers<br/>
          <span style="background:linear-gradient(135deg,${VIOLET},${ACCENT});-webkit-background-clip:text;-webkit-text-fill-color:transparent;">a golden path</span>
        </h2>
        <p style="margin-top:24px;font-size:19px;color:${TEXT2};line-height:1.6;max-width:700px;">
          Internal developer platforms that eliminate friction. Your team ships features — not YAML.
        </p>
        <div style="margin-top:44px;display:grid;grid-template-columns:1fr 1fr;gap:20px;">
          ${[
            ["Kubernetes", "Production-grade clusters, GitOps, multi-tenant isolation"],
            ["CI/CD", "GitHub Actions, ArgoCD, tekton — builds in under 3 min"],
            ["Dev portals", "Backstage, internal tooling, self-service infra provisioning"],
            ["Observability", "OpenTelemetry, Grafana, Loki, Tempo — metrics that matter"],
          ].map(([title, desc]) => `
            <div class="card">
              <div style="font-size:16px;font-weight:700;color:${ACCENT};margin-bottom:8px;">${title}</div>
              <p style="font-size:14px;color:${TEXT3};line-height:1.5;">${desc}</p>
            </div>
          `).join("")}
        </div>
        <div class="footer-bar">
          <div style="display:flex;align-items:center;gap:12px;">
            <div class="avatar">N</div>
            <span style="font-size:15px;color:${TEXT3};">Narendra Pandrinki</span>
          </div>
          <span class="slide-num">04 / 10</span>
        </div>
      </div>
    `,
    caption: `Platform engineering is the difference between a team that ships 10x/day and one that waits 3 weeks for a deployment.\n\nAn internal developer platform isn't a tool — it's a product your engineers use every day. I build it like one.\n\nWhat I deliver:\n→ Kubernetes clusters your team can actually operate\n→ GitOps pipelines with sensible defaults\n→ Self-service infra so senior engineers stop being blockers\n→ Observability that connects to user journeys, not just CPU graphs\n\n#PlatformEngineering #Kubernetes #InternalDeveloperPlatform #GitOps #DevOps #SRE`,
  },

  // 5 — SRE & Reliability
  {
    filename: "slide-05-sre.png",
    html: `
      <div class="grid-bg"></div>
      <div class="content">
        <div class="eyebrow" style="margin-bottom:20px;">Service 03 · SRE & Reliability</div>
        <h2 style="font-size:56px;font-weight:800;line-height:1.1;letter-spacing:-1.5px;">
          Reliability is a<br/>
          <span style="background:linear-gradient(135deg,${LIME},${ACCENT});-webkit-background-clip:text;-webkit-text-fill-color:transparent;">system property</span>
        </h2>
        <p style="margin-top:24px;font-size:19px;color:${TEXT2};line-height:1.6;max-width:720px;">
          Not a dashboard. Not an on-call rotation. The whole system — pipelines, audit logs, cost lines, failover paths.
        </p>
        <div style="margin-top:48px;display:flex;flex-direction:column;gap:20px;">
          ${[
            ["SLOs & error budgets", "Measurable reliability targets your product team can reason about"],
            ["Incident management", "On-call programs, runbooks, post-mortems that actually prevent recurrence"],
            ["Chaos engineering", "Game days, failover drills, load tests before your customers find the limits"],
          ].map(([title, desc]) => `
            <div style="display:flex;gap:20px;align-items:flex-start;">
              <div style="width:3px;background:linear-gradient(${LIME},${ACCENT});border-radius:2px;flex-shrink:0;align-self:stretch;"></div>
              <div>
                <div style="font-size:17px;font-weight:700;color:${TEXT};">${title}</div>
                <p style="font-size:14px;color:${TEXT3};margin-top:4px;line-height:1.5;">${desc}</p>
              </div>
            </div>
          `).join("")}
        </div>
        <div class="footer-bar">
          <div style="display:flex;align-items:center;gap:12px;">
            <div class="avatar">N</div>
            <span style="font-size:15px;color:${TEXT3};">narendrapandrinki.com/services</span>
          </div>
          <span class="slide-num">05 / 10</span>
        </div>
      </div>
    `,
    caption: `Payments platforms taught me something most teams learn the hard way: reliability is a property of the whole system, not a component.\n\nFixing reliability one microservice at a time rarely works. You need SLOs everyone understands, on-call that doesn't burn engineers out, and game days that expose real failure modes before production does.\n\nThat's what I build.\n\n#SRE #SiteReliabilityEngineering #SLO #IncidentManagement #ChaosEngineering #Observability #Fintech`,
  },

  // 6 — AI/ML Infrastructure
  {
    filename: "slide-06-aiml.png",
    html: `
      <div class="grid-bg"></div>
      <div class="content">
        <div class="eyebrow" style="margin-bottom:20px;">Service 04 · AI/ML Infrastructure</div>
        <h2 style="font-size:54px;font-weight:800;line-height:1.1;letter-spacing:-1.5px;">
          AI that ships to<br/>
          <span style="background:linear-gradient(135deg,${VIOLET},${ROSE});-webkit-background-clip:text;-webkit-text-fill-color:transparent;">production</span>
        </h2>
        <p style="margin-top:24px;font-size:19px;color:${TEXT2};line-height:1.6;max-width:700px;">
          Most AI demos never reach users at scale. I build the infrastructure that closes that gap.
        </p>
        <div style="margin-top:44px;display:grid;grid-template-columns:1fr 1fr;gap:16px;">
          ${[
            ["GPU clusters", "AWS, GCP, Azure — spot-optimised, auto-scaling, cost-tracked"],
            ["Model serving", "vLLM, Triton, Ray Serve — low latency at production load"],
            ["MLOps pipelines", "Kubeflow, MLflow, DVC — reproducible, auditable experiments"],
            ["Vector databases", "Pinecone, Weaviate, pgvector — semantic search at scale"],
          ].map(([title, desc]) => `
            <div class="card" style="border-color:rgba(167,139,250,0.3);">
              <div style="font-size:15px;font-weight:700;color:${VIOLET};margin-bottom:8px;">${title}</div>
              <p style="font-size:13px;color:${TEXT3};line-height:1.5;">${desc}</p>
            </div>
          `).join("")}
        </div>
        <div class="footer-bar">
          <div style="display:flex;align-items:center;gap:12px;">
            <div class="avatar">N</div>
            <span style="font-size:15px;color:${TEXT3};">Narendra Pandrinki</span>
          </div>
          <span class="slide-num">06 / 10</span>
        </div>
      </div>
    `,
    caption: `There's a massive gap between a working AI prototype and a production AI system.\n\nThe prototype runs on a laptop. The production system needs:\n→ GPU clusters that scale without burning budget\n→ Model serving that handles real traffic (not just 10 concurrent users)\n→ MLOps pipelines that make experiments reproducible\n→ Vector search that actually returns relevant results at 50ms P99\n\nI've built this for AI/ML startups. I can build it for yours.\n\n#AIInfrastructure #MLOps #GPUClusters #LLM #VectorDatabase #MachineLearning #DevOps`,
  },

  // 7 — Industries
  {
    filename: "slide-07-industries.png",
    html: `
      <div class="grid-bg"></div>
      <div class="content">
        <div class="eyebrow" style="margin-bottom:20px;">Industries · Where I've operated</div>
        <h2 style="font-size:56px;font-weight:800;line-height:1.1;letter-spacing:-1.5px;">
          The sectors where<br/>
          <span style="background:linear-gradient(135deg,${AMBER},${ROSE});-webkit-background-clip:text;-webkit-text-fill-color:transparent;">stakes are real</span>
        </h2>
        <div style="margin-top:48px;display:grid;grid-template-columns:1fr 1fr;gap:16px;flex:1;">
          ${[
            ["Fintech & Payments", "Where 99.99% SLA isn't optional — it's a contract clause", ACCENT],
            ["Healthtech", "HIPAA-adjacent data, audit trails, and zero-downtime deploys", VIOLET],
            ["AI/ML Startups", "From experiment to production without burning cloud budget", ROSE],
            ["B2B SaaS", "Multi-tenant platforms that scale with your enterprise customers", LIME],
            ["E-commerce", "Peak readiness, flash sale survival, inventory at scale", AMBER],
            ["Marketplaces", "Dual-sided reliability — every transaction matters", TEXT3],
          ].map(([name, desc, color]) => `
            <div style="display:flex;gap:14px;align-items:flex-start;">
              <div style="width:8px;height:8px;border-radius:50%;background:${color};flex-shrink:0;margin-top:6px;"></div>
              <div>
                <div style="font-size:16px;font-weight:700;color:${TEXT};">${name}</div>
                <p style="font-size:13px;color:${TEXT3};margin-top:3px;line-height:1.4;">${desc}</p>
              </div>
            </div>
          `).join("")}
        </div>
        <div class="footer-bar">
          <div style="display:flex;align-items:center;gap:12px;">
            <div class="avatar">N</div>
            <span style="font-size:15px;color:${TEXT3};">narendrapandrinki.com</span>
          </div>
          <span class="slide-num">07 / 10</span>
        </div>
      </div>
    `,
    caption: `I started in fintech because that's where the gap between "it works" and "it works under scrutiny" is widest.\n\nThe lessons travelled well.\n\nWhether you're in:\n• Fintech (SLAs are legal commitments)\n• Healthtech (audit trails aren't optional)\n• AI/ML (production ≠ demo)\n• SaaS (multi-tenancy is hard, done wrong)\n• E-commerce (peak season is not the time to find out)\n\n...the instincts are the same: deliberate boundaries, tested failovers, and unglamorous discipline.\n\n#Fintech #Healthtech #AIStartups #B2BSaaS #Ecommerce #CloudEngineering #PlatformEngineering`,
  },

  // 8 — How I Work
  {
    filename: "slide-08-process.png",
    html: `
      <div class="grid-bg"></div>
      <div class="content">
        <div class="eyebrow" style="margin-bottom:20px;">Process · How an engagement works</div>
        <h2 style="font-size:52px;font-weight:800;line-height:1.1;letter-spacing:-1.5px;">
          No surprises.<br/>
          <span style="background:linear-gradient(135deg,${ACCENT},${LIME});-webkit-background-clip:text;-webkit-text-fill-color:transparent;">No hidden scope.</span>
        </h2>
        <div style="margin-top:48px;display:flex;flex-direction:column;gap:24px;flex:1;">
          ${[
            ["01", "Discovery week", "$1,800 fixed. Written assessment + proposed scope. No obligation to continue.", ACCENT],
            ["02", "Scoped delivery", "Fixed-fee against milestones or monthly retainer. No hourly billing. Ever.", VIOLET],
            ["03", "Knowledge transfer", "Pairing, code review, runbooks throughout — not at handover.", LIME],
            ["04", "30-day support window", "Questions, corrections, and small fixes included after delivery.", AMBER],
          ].map(([num, title, desc, color]) => `
            <div style="display:flex;gap:24px;align-items:flex-start;">
              <div style="font-family:monospace;font-size:24px;font-weight:700;color:${color};flex-shrink:0;line-height:1;">${num}</div>
              <div>
                <div style="font-size:17px;font-weight:700;color:${TEXT};">${title}</div>
                <p style="font-size:14px;color:${TEXT3};margin-top:4px;line-height:1.5;">${desc}</p>
              </div>
            </div>
          `).join("")}
        </div>
        <div class="footer-bar">
          <div style="display:flex;align-items:center;gap:12px;">
            <div class="avatar">N</div>
            <span style="font-size:15px;color:${TEXT3};">narendrapandrinki.com/process</span>
          </div>
          <span class="slide-num">08 / 10</span>
        </div>
      </div>
    `,
    caption: `I went independent because I prefer the shape of the work. A focused engagement beats most full-time roles — for me and for the client.\n\nHere's how it works:\n\n1/ Discovery week ($1,800) — I assess your systems and write a clear scope. You own that document whether you hire me or not.\n\n2/ Delivery — fixed-fee with milestones, not an open-ended hourly contract.\n\n3/ Knowledge transfer throughout — not at the end.\n\n4/ 30-day support window — included.\n\nNo surprises. No scope creep by stealth.\n\n#Consulting #IndependentConsultant #DevOps #CloudEngineering #FreelanceEngineering #Transparency`,
  },

  // 9 — Pricing
  {
    filename: "slide-09-pricing.png",
    html: `
      <div class="grid-bg"></div>
      <div class="content">
        <div class="eyebrow" style="margin-bottom:20px;">Pricing · Transparent, no hourly</div>
        <h2 style="font-size:52px;font-weight:800;line-height:1.1;letter-spacing:-1.5px;">
          Fixed fee.<br/>
          <span style="background:linear-gradient(135deg,${LIME},${ACCENT});-webkit-background-clip:text;-webkit-text-fill-color:transparent;">Defined outcome.</span>
        </h2>
        <div style="margin-top:44px;display:grid;grid-template-columns:1fr 1fr;gap:20px;">
          ${[
            {
              label: "DevOps Project",
              price: "From $10,000",
              note: "Discovery from $1,800",
              items: ["Fixed-fee delivery", "4–16 week engagements", "INR rates for India clients"],
              color: ACCENT,
            },
            {
              label: "Platform Retainer",
              price: "$5,500 / month",
              note: "2–4 days per month",
              items: ["Ongoing senior engineering", "Predictable monthly cost", "Cancel with 30 days notice"],
              color: VIOLET,
            },
          ].map(({ label, price, note, items, color }) => `
            <div class="card" style="border-color:${color}33;">
              <div style="font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:0.1em;color:${color};margin-bottom:12px;">${label}</div>
              <div style="font-size:32px;font-weight:800;color:${TEXT};">${price}</div>
              <div style="font-size:13px;color:${TEXT3};margin-bottom:16px;">${note}</div>
              ${items.map(i => `<div style="font-size:14px;color:${TEXT2};display:flex;gap:8px;margin-bottom:8px;"><span style="color:${color};">✓</span>${i}</div>`).join("")}
            </div>
          `).join("")}
        </div>
        <div style="margin-top:20px;padding:16px 20px;background:${SURFACE};border-radius:12px;border:1px solid ${BORDER};">
          <p style="font-size:15px;color:${TEXT2};">I never bill hourly. Work is scoped, agreed in writing, and delivered against milestones.</p>
        </div>
        <div class="footer-bar">
          <div style="display:flex;align-items:center;gap:12px;">
            <div class="avatar">N</div>
            <span style="font-size:15px;color:${TEXT3};">narendrapandrinki.com/pricing</span>
          </div>
          <span class="slide-num">09 / 10</span>
        </div>
      </div>
    `,
    caption: `Honest pricing question I get a lot: "What do you charge?"\n\nHere's the full answer:\n\n→ DevOps projects start at $10,000 (discovery week is $1,800)\n→ Platform retainer from $5,500/month for ongoing senior engineering\n→ INR rates available for India-based clients\n→ Never hourly — always fixed-fee or monthly\n\nWhy no hourly? Because hourly billing creates the wrong incentives. I'm incentivised to be efficient, not to run up hours.\n\n#IndependentConsultant #DevOps #CloudEngineering #Pricing #Consulting #Freelance #SeniorEngineer`,
  },

  // 10 — CTA
  {
    filename: "slide-10-cta.png",
    html: `
      <div class="grid-bg"></div>
      <div class="content" style="justify-content:center;gap:0;">
        <div class="eyebrow" style="margin-bottom:24px;">Available · Q2 2026</div>
        <h2 style="font-size:68px;font-weight:800;line-height:1.05;letter-spacing:-2px;">
          Let&apos;s build<br/>
          <span style="background:linear-gradient(135deg,${ACCENT},${VIOLET});-webkit-background-clip:text;-webkit-text-fill-color:transparent;">something solid.</span>
        </h2>
        <p style="margin-top:32px;font-size:21px;color:${TEXT2};line-height:1.6;max-width:680px;">
          I take on a small number of engagements at a time. If you're building something that needs serious platform engineering, let's talk.
        </p>
        <div style="margin-top:48px;display:flex;flex-direction:column;gap:16px;">
          ${[
            ["→ Email", "hello@narendrapandrinki.com", ACCENT],
            ["→ Portfolio", "narendrapandrinki.com", VIOLET],
            ["→ Services", "narendrapandrinki.com/services", LIME],
          ].map(([label, val, color]) => `
            <div style="display:flex;align-items:center;gap:16px;">
              <span style="font-family:monospace;font-size:16px;color:${color};width:100px;">${label}</span>
              <span style="font-size:17px;color:${TEXT2};">${val}</span>
            </div>
          `).join("")}
        </div>
        <div style="margin-top:48px;padding:20px 28px;background:linear-gradient(135deg,rgba(34,211,238,0.1),rgba(167,139,250,0.1));border:1px solid rgba(34,211,238,0.3);border-radius:16px;">
          <p style="font-size:16px;color:${TEXT2};">
            Discovery week from <strong style="color:${ACCENT};">$1,800</strong> — ends with a written assessment you own regardless of what you decide next.
          </p>
        </div>
        <div class="footer-bar">
          <div style="display:flex;align-items:center;gap:12px;">
            <div class="avatar">N</div>
            <span style="font-size:15px;color:${TEXT3};">Narendra Pandrinki · Independent Engineer</span>
          </div>
          <span class="slide-num">10 / 10</span>
        </div>
      </div>
    `,
    caption: `If you made it to slide 10, you probably have a real problem to solve.\n\nI'm currently taking enquiries for Q2 2026. I work with a small number of clients at a time — so the attention is real, not divided.\n\nStart with a discovery week ($1,800). You'll get:\n✓ Written assessment of your current platform\n✓ Concrete recommendations\n✓ A scoped proposal if you want to continue\n\nYou own that document either way.\n\n→ hello@narendrapandrinki.com\n→ narendrapandrinki.com\n\n#DevOps #CloudEngineering #PlatformEngineering #SRE #Kubernetes #AWS #India #OpenToWork #Consulting`,
  },
];

// ─────────────────────────────────────────────
// Render each slide
// ─────────────────────────────────────────────
console.log(`Generating ${slides.length} slides → ${OUT_DIR}\n`);

const captions = [];

for (let i = 0; i < slides.length; i++) {
  const slide = slides[i];
  const htmlFile = join(TMP_DIR, `slide-${i + 1}.html`);
  const pngFile = join(OUT_DIR, slide.filename);

  const fullHtml = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>${css()}</style>
</head>
<body>
${slide.html}
</body>
</html>`;

  writeFileSync(htmlFile, fullHtml);

  execSync(
    `"${CHROME}" --headless=new --disable-gpu --screenshot="${pngFile}" \
     --window-size=1080,1080 --hide-scrollbars \
     --default-background-color=000000 \
     "file://${htmlFile}" 2>/dev/null`,
    { stdio: "pipe" }
  );

  console.log(`  ✓ ${slide.filename}`);
  captions.push({ file: slide.filename, caption: slide.caption });
}

// Save captions as a text file
const captionText = captions
  .map((c, i) => `═══════════════════════════════\nSlide ${i + 1}: ${c.file}\n═══════════════════════════════\n${c.caption}\n`)
  .join("\n");

writeFileSync(join(OUT_DIR, "linkedin-captions.txt"), captionText);

// Cleanup tmp
rmSync(TMP_DIR, { recursive: true, force: true });

console.log(`\nDone! ${slides.length} slides + captions saved to:\n  ${OUT_DIR}\n`);
