import type { Metadata } from "next";
import Link from "next/link";
import { Filter } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";
import InboxActions from "@/components/admin/InboxActions";
import { Badge, Card, Empty, PageHeader } from "@/components/admin/ui";

export const metadata: Metadata = { title: "Inbox" };

const STATUSES = ["all", "unread", "read", "replied", "archived"] as const;
const SOURCES = ["all", "contact_form", "inbound_email", "manual"] as const;

type Status = (typeof STATUSES)[number];
type Source = (typeof SOURCES)[number];

function statusTone(status: string) {
  switch (status) {
    case "unread":
      return "accent";
    case "read":
      return "default";
    case "replied":
      return "lime";
    case "archived":
      return "default";
    default:
      return "default";
  }
}

export default async function InboxPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; source?: string }>;
}) {
  const { status: rawStatus, source: rawSource } = await searchParams;

  const status: Status = (
    STATUSES.includes(rawStatus as Status) ? rawStatus : "all"
  ) as Status;
  const source: Source = (
    SOURCES.includes(rawSource as Source) ? rawSource : "all"
  ) as Source;

  const supabase = await createClient();

  let query = supabase
    .from("inbox_messages")
    .select("*")
    .order("created_at", { ascending: false });
  if (status !== "all") query = query.eq("status", status);
  if (source !== "all") query = query.eq("source", source);

  const { data: messages } = await query;

  const list = (messages ?? []) as Array<{
    id: string;
    status: string;
    subject: string;
    sender_name: string | null;
    sender_email: string;
    source: string;
    created_at: string;
    body: string | null;
    notes: string | null;
  }>;

  const unread = list.filter((m) => m.status === "unread").length;

  const buildHref = (next: { status?: Status; source?: Source }) => {
    const s = next.status ?? status;
    const src = next.source ?? source;
    const params = new URLSearchParams();
    if (s !== "all") params.set("status", s);
    if (src !== "all") params.set("source", src);
    const qs = params.toString();
    return `/control/inbox${qs ? `?${qs}` : ""}`;
  };

  return (
    <>
      <PageHeader
        title="Inbox"
        subtitle={`${list.length} message${list.length === 1 ? "" : "s"} · ${unread} unread`}
      />

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-[var(--text-4)]">
          <Filter size={12} /> Status
        </span>
        {STATUSES.map((s) => (
          <Link
            key={s}
            href={buildHref({ status: s })}
            className={`text-xs px-2.5 py-1 rounded-full border transition-colors capitalize ${
              status === s
                ? "bg-[var(--accent)]/15 border-[var(--accent)]/30 text-[var(--accent)]"
                : "bg-[var(--surface-2)] border-[var(--border)] text-[var(--text-3)] hover:text-[var(--text)]"
            }`}
          >
            {s}
          </Link>
        ))}
        <span className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-[var(--text-4)] ml-2">
          Source
        </span>
        {SOURCES.map((s) => (
          <Link
            key={s}
            href={buildHref({ source: s })}
            className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
              source === s
                ? "bg-[var(--violet)]/15 border-[var(--violet)]/30 text-[var(--violet)]"
                : "bg-[var(--surface-2)] border-[var(--border)] text-[var(--text-3)] hover:text-[var(--text)]"
            }`}
          >
            {s.replace("_", " ")}
          </Link>
        ))}
      </div>

      <Card>
        {list.length > 0 ? (
          <ul className="divide-y divide-[var(--border)]">
            {list.map((msg) => (
              <li
                key={msg.id}
                className={`p-5 transition-colors hover:bg-[var(--surface-2)]/40 ${
                  msg.status === "unread"
                    ? "bg-[var(--accent)]/[0.03]"
                    : ""
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2.5 mb-1">
                      {msg.status === "unread" && (
                        <span className="h-2 w-2 rounded-full bg-[var(--accent)] shrink-0" />
                      )}
                      <p
                        className={`text-[var(--text)] truncate ${
                          msg.status === "unread"
                            ? "font-semibold"
                            : "font-medium"
                        }`}
                      >
                        {msg.subject}
                      </p>
                      <Badge tone={statusTone(msg.status)}>{msg.status}</Badge>
                      <Badge tone="default">
                        {msg.source.replace("_", " ")}
                      </Badge>
                    </div>
                    <p className="text-sm text-[var(--text-3)]">
                      {msg.sender_name
                        ? `${msg.sender_name} <${msg.sender_email}>`
                        : msg.sender_email}{" "}
                      · {formatDate(msg.created_at)}
                    </p>
                    {msg.body && (
                      <p className="text-sm text-[var(--text-2)] mt-2 whitespace-pre-wrap line-clamp-3">
                        {msg.body}
                      </p>
                    )}
                    {msg.notes && (
                      <p className="mt-2 text-xs text-[var(--accent)] bg-[var(--accent)]/10 border border-[var(--accent)]/20 rounded-md px-3 py-1.5">
                        Note: {msg.notes}
                      </p>
                    )}
                  </div>
                  <div className="lg:max-w-md w-full">
                    <InboxActions
                      messageId={msg.id}
                      currentStatus={msg.status}
                      senderEmail={msg.sender_email}
                      senderName={msg.sender_name}
                    />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <Empty title="No messages" hint="Try clearing filters" />
        )}
      </Card>
    </>
  );
}
