import type { Metadata } from "next";
import Link from "next/link";
import { Badge, Card, Empty, PageHeader, PrimaryButton } from "@/components/admin/ui";
import { listContracts, type ContractStatus } from "@/lib/db/contracts";
import { FilePlus } from "lucide-react";

export const metadata: Metadata = { title: "Contracts" };
export const dynamic = "force-dynamic";

const STATUSES = [
  "all",
  "draft",
  "sent",
  "viewed",
  "signed",
  "declined",
  "cancelled",
] as const;
type StatusFilter = (typeof STATUSES)[number];

const tone: Record<string, "accent" | "violet" | "lime" | "amber" | "rose" | "default"> = {
  draft: "default",
  sent: "accent",
  viewed: "violet",
  signed: "lime",
  declined: "rose",
  cancelled: "default",
};

function fmtDate(d: string | null): string {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default async function ContractsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status: rawStatus } = await searchParams;
  const status: StatusFilter = (
    STATUSES.includes(rawStatus as StatusFilter) ? rawStatus : "all"
  ) as StatusFilter;

  const list = await listContracts({
    status: status === "all" ? "all" : (status as ContractStatus),
  });

  return (
    <>
      <PageHeader
        title="Contracts"
        subtitle={`${list.length} contract${list.length === 1 ? "" : "s"}`}
        actions={
          <Link href="/control/contracts/new">
            <PrimaryButton>
              <FilePlus size={14} />
              New contract
            </PrimaryButton>
          </Link>
        }
      />

      <div className="mb-4 flex flex-wrap items-center gap-2">
        {STATUSES.map((s) => {
          const params = new URLSearchParams();
          if (s !== "all") params.set("status", s);
          const qs = params.toString();
          return (
            <Link
              key={s}
              href={`/control/contracts${qs ? `?${qs}` : ""}`}
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
          <div>
            <div className="hidden md:grid grid-cols-12 gap-4 px-5 py-3 border-b border-[var(--border)] text-[11px] font-semibold uppercase tracking-widest text-[var(--text-4)]">
              <span className="col-span-4">Title</span>
              <span className="col-span-3">Recipient</span>
              <span className="col-span-2">Sent</span>
              <span className="col-span-2">Signed</span>
              <span className="col-span-1">Status</span>
            </div>
            <ul className="divide-y divide-[var(--border)]">
              {list.map((c) => (
                <li
                  key={c.id}
                  className="px-5 py-4 grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 items-center hover:bg-[var(--surface-2)]/40"
                >
                  <Link
                    href={`/control/contracts/${c.id}`}
                    className="md:col-span-4 text-sm font-medium text-[var(--text)] hover:text-[var(--accent)]"
                  >
                    {c.title}
                  </Link>
                  <p className="md:col-span-3 text-sm text-[var(--text-2)] truncate">
                    {c.recipient_name}
                    <span className="text-[var(--text-4)] block text-xs">
                      {c.recipient_email}
                    </span>
                  </p>
                  <p className="md:col-span-2 text-sm text-[var(--text-3)]">
                    {fmtDate(c.sent_at)}
                  </p>
                  <p className="md:col-span-2 text-sm text-[var(--text-3)]">
                    {fmtDate(c.signed_at)}
                  </p>
                  <div className="md:col-span-1">
                    <Badge tone={tone[c.status] ?? "default"}>{c.status}</Badge>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <Empty
            title="No contracts yet"
            hint="Create your first contract to send for signature."
          />
        )}
      </Card>
    </>
  );
}
