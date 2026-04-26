import Link from "next/link";

const cols: { title: string; links: [string, string][] }[] = [
  {
    title: "Services",
    links: [
      ["Cloud & DevOps", "/services/cloud-devops"],
      ["Platform Engineering", "/services/platform-engineering"],
      ["Kubernetes & Containers", "/services/kubernetes"],
      ["CI/CD Pipelines", "/services/cicd-pipelines"],
      ["Infrastructure as Code", "/services/infrastructure-as-code"],
      ["Site Reliability", "/services/sre-observability"],
      ["DevSecOps", "/services/devsecops"],
      ["Database Operations", "/services/database-operations"],
    ],
  },
  {
    title: "Solutions",
    links: [
      ["Cloud Migrations", "/solutions/cloud-migration"],
      ["Cost Optimisation", "/solutions/cloud-cost-optimisation"],
      ["Zero-Downtime Deploys", "/solutions/zero-downtime-deploys"],
      ["Compliance Foundations", "/solutions/compliance-foundations"],
      ["Disaster Recovery", "/solutions/disaster-recovery"],
      ["Internal Developer Platform", "/solutions/internal-developer-platform"],
    ],
  },
  {
    title: "Company",
    links: [
      ["About", "/about"],
      ["Process", "/process"],
      ["Pricing", "/pricing"],
      ["Industries", "/industries"],
      ["Stack", "/technology"],
      ["Case Studies", "/work"],
      ["Blog", "/blog"],
      ["Comparisons", "/compare"],
      ["FAQ", "/faq"],
      ["Hire", "/hire"],
      ["CV", "/cv"],
      ["Skills", "/skills"],
      ["Certifications", "/certifications"],
      ["Playbook", "/playbook"],
      ["Contact", "/contact"],
    ],
  },
];

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative border-t border-[var(--border)] bg-[var(--bg-1)]">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--accent)]/40 to-transparent" />
      <div className="container-page py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          <div className="md:col-span-4">
            <Link href="/" className="inline-flex items-center gap-3">
              <span className="relative inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--border-2)] bg-[var(--surface)]">
                <span className="absolute inset-0 rounded-lg opacity-70 blur-md bg-[radial-gradient(circle,var(--accent),transparent_70%)]" />
                <span className="relative gradient-text font-bold text-lg leading-none -mt-0.5">N</span>
              </span>
              <span className="gradient-text text-xl font-semibold tracking-tight leading-none">
                Narendra Pandrinki
              </span>
            </Link>
            <p className="mt-5 text-sm text-[var(--text-3)] leading-relaxed max-w-sm">
              Independent DevOps & Platform engineer. Building reliable cloud
              infrastructure, ship-it-quietly pipelines, and platforms engineers
              actually want to use.
            </p>
            <p className="mt-4 text-sm text-[var(--text-3)] leading-relaxed max-w-sm">
              Based in India. Working with teams across India, UK, US, Singapore, and Dubai.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <span className="live-dot" />
              <span className="text-xs font-mono text-[var(--text-3)]">
                Working with engineering teams globally · Available Q2 2026
              </span>
            </div>
            <a
              href="mailto:hello@narendrapandrinki.com"
              className="mt-6 inline-flex items-center gap-2 text-sm text-[var(--text-2)] hover:text-[var(--accent)]"
            >
              <span className="font-mono">→</span> hello@narendrapandrinki.com
            </a>
          </div>

          <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-8">
            {cols.map((col) => (
              <div key={col.title}>
                <div className="text-xs font-mono uppercase tracking-[0.16em] text-[var(--text-4)] mb-4">
                  {col.title}
                </div>
                <ul className="space-y-2.5 text-sm">
                  {col.links.map(([label, href]) => (
                    <li key={href}>
                      <Link
                        href={href}
                        className="text-[var(--text-3)] hover:text-[var(--accent)] transition-colors"
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-[var(--border)] flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs font-mono text-[var(--text-4)]">
            © {year} Narendra Pandrinki · narendrapandrinki.com
          </p>
          <div className="flex items-center gap-4 text-xs font-mono text-[var(--text-4)]">
            <Link href="/privacy" className="hover:text-[var(--text-2)]">Privacy</Link>
            <Link href="/terms" className="hover:text-[var(--text-2)]">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
