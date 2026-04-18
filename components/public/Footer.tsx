import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      style={{
        backgroundColor: "#2a1608",
        color: "#cfa97e",
        borderTop: "1px solid #3e2610",
      }}
    >
      <div className="container mx-auto px-6 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <div
              style={{ color: "#faf7f2" }}
              className="text-xl font-semibold mb-4"
            >
              Narendra Pandriniki
            </div>
            <p style={{ color: "#9b7653" }} className="text-sm leading-relaxed max-w-sm">
              Independent platform and cloud engineer. I build cloud
              infrastructure, backend systems, internal tools, and operational
              platforms for businesses that need reliable engineering done
              properly.
            </p>
          </div>

          <div>
            <div
              style={{ color: "#faf7f2" }}
              className="text-xs font-semibold uppercase tracking-widest mb-4"
            >
              Services
            </div>
            <ul className="space-y-2 text-sm">
              {[
                ["Cloud & DevOps", "/services/cloud-devops"],
                ["Platform Engineering", "/services/platform-engineering"],
                ["Backend Systems", "/services/backend-systems"],
                ["Internal Tools", "/services/internal-tools"],
                ["Workflow Automation", "/services/workflow-automation"],
                ["Reporting Dashboards", "/services/reporting-dashboards"],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link
                    href={href}
                    style={{ color: "#9b7653" }}
                    className="hover:opacity-80 transition-opacity"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div
              style={{ color: "#faf7f2" }}
              className="text-xs font-semibold uppercase tracking-widest mb-4"
            >
              Company
            </div>
            <ul className="space-y-2 text-sm">
              {[
                ["About", "/about"],
                ["Work", "/work"],
                ["Blog", "/blog"],
                ["Contact", "/contact"],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link
                    href={href}
                    style={{ color: "#9b7653" }}
                    className="hover:opacity-80 transition-opacity"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div
          style={{ borderTop: "1px solid #3e2610" }}
          className="mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <p style={{ color: "#7d5c3a" }} className="text-xs">
            © {year} Narendra Pandriniki. All rights reserved.
          </p>
          <p style={{ color: "#7d5c3a" }} className="text-xs">
            narendrapandriniki.com
          </p>
        </div>
      </div>
    </footer>
  );
}
