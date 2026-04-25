import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatDate, formatCurrency } from "@/lib/utils";
import ProjectForm from "@/components/admin/ProjectForm";
import { Badge, Card, Empty, PageHeader } from "@/components/admin/ui";

export const metadata: Metadata = { title: "Projects" };

const STATUSES = ["all", "discovery", "active", "paused", "complete", "cancelled"] as const;
type StatusFilter = (typeof STATUSES)[number];

const statusTone: Record<string, "accent" | "violet" | "lime" | "amber" | "rose" | "default"> = {
  discovery: "violet",
  active: "lime",
  paused: "amber",
  complete: "default",
  cancelled: "rose",
};

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status: rawStatus } = await searchParams;
  const status: StatusFilter = (
    STATUSES.includes(rawStatus as StatusFilter) ? rawStatus : "all"
  ) as StatusFilter;

  const supabase = await createClient();

  let query = supabase
    .from("projects")
    .select("*, client:clients(name, company)")
    .order("created_at", { ascending: false });
  if (status !== "all") query = query.eq("status", status);

  const [{ data: projects }, { data: clients }] = await Promise.all([
    query,
    supabase.from("clients").select("id, name, company"),
  ]);

  const list = (projects ?? []) as Array<{
    id: string;
    name: string;
    client?: { name: string; company: string | null } | null;
    service_type: string | null;
    status: string;
    agreed_amount: number | null;
    payment_status: string;
    due_date: string | null;
    created_at: string;
  }>;

  return (
    <>
      <PageHeader
        title="Projects"
        subtitle={`${list.length} ${
          status === "all" ? "total" : status
        }`}
        actions={<ProjectForm clients={clients ?? []} />}
      />

      <div className="mb-4 flex flex-wrap items-center gap-2">
        {STATUSES.map((s) => {
          const params = new URLSearchParams();
          if (s !== "all") params.set("status", s);
          const qs = params.toString();
          return (
            <Link
              key={s}
              href={`/control/projects${qs ? `?${qs}` : ""}`}
              className={`text-xs px-2.5 py-1 rounded-full border transition-colors capitalize ${
                status === s
                  ? "bg-[var(--accent)]/15 border-[var(--accent)]/30 text-[var(--accent)]"
                  : "bg-[var(--surface-2)] border-[var(--border)] text-[var(--text-3)] hover:text-[var(--text)]"
              }`}
            >
              {s}
            </Link>
          );
        })}
      </div>

      <Card>
        {list.length > 0 ? (
          <ul className="divide-y divide-[var(--border)]">
            {list.map((project) => (
              <li
                key={project.id}
                className="p-5 hover:bg-[var(--surface-2)]/40"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="font-medium text-[var(--text)]">
                      {project.name}
                    </p>
                    <p className="text-xs text-[var(--text-3)] mt-0.5">
                      {project.client?.name ?? "No client"}
                      {project.service_type
                        ? ` · ${project.service_type}`
                        : ""}
                    </p>
                    {project.due_date && (
                      <p className="text-xs text-[var(--text-4)] mt-1">
                        Due {formatDate(project.due_date)}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-3 shrink-0 flex-wrap justify-end">
                    {project.agreed_amount && (
                      <span className="text-sm font-mono font-semibold text-[var(--text)] tabular-nums">
                        {formatCurrency(project.agreed_amount)}
                      </span>
                    )}
                    <Badge tone={statusTone[project.status] ?? "default"}>
                      {project.status}
                    </Badge>
                    <Badge
                      tone={
                        project.payment_status === "paid"
                          ? "lime"
                          : project.payment_status === "partial"
                          ? "amber"
                          : "default"
                      }
                    >
                      {project.payment_status}
                    </Badge>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <Empty title="No projects" />
        )}
      </Card>
    </>
  );
}
