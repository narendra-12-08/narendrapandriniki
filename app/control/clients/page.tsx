import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";
import ClientActions from "@/components/admin/ClientActions";
import { Badge, Card, Empty, PageHeader } from "@/components/admin/ui";

export const metadata: Metadata = { title: "Clients" };

const CLIENT_STATUSES = ["all", "active", "prospect", "inactive"] as const;

export default async function ClientsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status: rawStatus } = await searchParams;
  const status = (
    CLIENT_STATUSES.includes(rawStatus as (typeof CLIENT_STATUSES)[number])
      ? rawStatus
      : "all"
  ) as (typeof CLIENT_STATUSES)[number];

  const supabase = await createClient();

  let clientQuery = supabase
    .from("clients")
    .select("*")
    .order("created_at", { ascending: false });
  if (status !== "all") clientQuery = clientQuery.eq("status", status);

  const [{ data: clients }, { data: leads }] = await Promise.all([
    clientQuery,
    supabase.from("leads").select("*").order("created_at", { ascending: false }),
  ]);

  const clientList = (clients ?? []) as Array<{
    id: string;
    name: string;
    email: string;
    company: string | null;
    phone: string | null;
    status: string;
    created_at: string;
  }>;
  const leadList = (leads ?? []) as Array<{
    id: string;
    name: string;
    email: string;
    company: string | null;
    status: string;
    source: string | null;
    created_at: string;
  }>;

  return (
    <>
      <PageHeader
        title="Clients"
        subtitle={`${clientList.length} clients · ${leadList.length} leads`}
        actions={<ClientActions mode="add" />}
      />

      <div className="mb-4 flex flex-wrap items-center gap-2">
        {CLIENT_STATUSES.map((s) => {
          const params = new URLSearchParams();
          if (s !== "all") params.set("status", s);
          const qs = params.toString();
          return (
            <Link
              key={s}
              href={`/control/clients${qs ? `?${qs}` : ""}`}
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

      <section className="space-y-8">
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-[var(--text-4)] mb-3">
            Leads
          </h2>
          <Card>
            {leadList.length > 0 ? (
              <ul className="divide-y divide-[var(--border)]">
                {leadList.map((lead) => (
                  <li
                    key={lead.id}
                    className="p-4 flex items-center justify-between gap-3 hover:bg-[var(--surface-2)]/40"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-[var(--text)] truncate">
                        {lead.name}
                      </p>
                      <p className="text-xs text-[var(--text-3)] truncate">
                        {lead.email}
                        {lead.company ? ` · ${lead.company}` : ""}
                        {lead.source ? ` · ${lead.source}` : ""}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <Badge tone="violet">{lead.status}</Badge>
                      <span className="text-xs text-[var(--text-4)]">
                        {formatDate(lead.created_at)}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <Empty title="No leads yet" />
            )}
          </Card>
        </div>

        <div>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-[var(--text-4)] mb-3">
            Clients
          </h2>
          <Card>
            {clientList.length > 0 ? (
              <ul className="divide-y divide-[var(--border)]">
                {clientList.map((client) => (
                  <li
                    key={client.id}
                    className="p-4 flex items-center justify-between gap-3 hover:bg-[var(--surface-2)]/40"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-[var(--text)] truncate">
                        {client.name}
                      </p>
                      <p className="text-xs text-[var(--text-3)] truncate">
                        {client.email}
                        {client.company ? ` · ${client.company}` : ""}
                        {client.phone ? ` · ${client.phone}` : ""}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <Badge
                        tone={client.status === "active" ? "lime" : "default"}
                      >
                        {client.status}
                      </Badge>
                      <span className="text-xs text-[var(--text-4)]">
                        {formatDate(client.created_at)}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <Empty title="No clients yet" />
            )}
          </Card>
        </div>
      </section>
    </>
  );
}
