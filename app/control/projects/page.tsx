import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { formatDate, formatCurrency } from "@/lib/utils";
import ProjectForm from "@/components/admin/ProjectForm";

export const metadata: Metadata = { title: "Projects" };

const statusColors: Record<string, string> = {
  discovery: "#cfa97e",
  active: "#4ade80",
  paused: "#fbbf24",
  complete: "#9b7653",
  cancelled: "#ef4444",
};

export default async function ProjectsPage() {
  const supabase = await createClient();

  const [{ data: projects }, { data: clients }] = await Promise.all([
    supabase.from("projects").select("*, client:clients(name, company)").order("created_at", { ascending: false }),
    supabase.from("clients").select("id, name, company"),
  ]);

  return (
    <div style={{ padding: "2rem" }}>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 style={{ color: "#faf7f2" }} className="text-2xl font-semibold">Projects</h1>
          <p style={{ color: "#9b7653" }} className="text-sm mt-1">{projects?.length ?? 0} total</p>
        </div>
        <ProjectForm clients={clients ?? []} />
      </div>

      <div style={{ backgroundColor: "#2a1608", border: "1px solid #3e2610" }} className="rounded-lg overflow-hidden">
        {projects && projects.length > 0 ? (
          <div>
            {projects.map((project: {
              id: string;
              name: string;
              client?: { name: string; company: string | null } | null;
              service_type: string | null;
              status: string;
              agreed_amount: number | null;
              payment_status: string;
              due_date: string | null;
              created_at: string;
            }) => (
              <div key={project.id} style={{ borderBottom: "1px solid #3e2610" }} className="p-5 last:border-0">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <p style={{ color: "#faf7f2" }} className="font-medium">{project.name}</p>
                    <p style={{ color: "#9b7653" }} className="text-xs mt-0.5">
                      {project.client?.name ?? "No client"}
                      {project.service_type ? ` · ${project.service_type}` : ""}
                    </p>
                    {project.due_date && (
                      <p style={{ color: "#7d5c3a" }} className="text-xs mt-1">Due: {formatDate(project.due_date)}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    {project.agreed_amount && (
                      <span style={{ color: "#cfa97e" }} className="text-sm font-semibold">
                        {formatCurrency(project.agreed_amount)}
                      </span>
                    )}
                    <span style={{ color: statusColors[project.status] ?? "#9b7653", backgroundColor: "rgba(0,0,0,0.2)" }} className="text-xs px-2 py-0.5 rounded capitalize">
                      {project.status}
                    </span>
                    <span style={{ color: project.payment_status === "paid" ? "#4ade80" : "#fbbf24", backgroundColor: "rgba(0,0,0,0.2)" }} className="text-xs px-2 py-0.5 rounded">
                      {project.payment_status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            <p style={{ color: "#7d5c3a" }} className="text-sm">No projects yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
