import type { Metadata } from "next";
import Link from "next/link";
import { Mail, Phone, Globe, MapPin, ExternalLink } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Badge, Card, Empty, PageHeader } from "@/components/admin/ui";

export const metadata: Metadata = { title: "Leads" };
export const dynamic = "force-dynamic";

type Lead = {
  id: string;
  session_id: string;
  visitor_name: string;
  visitor_email: string;
  visitor_phone: string | null;
  visitor_company: string | null;
  visitor_role: string | null;
  project_type: string | null;
  what_to_build: string | null;
  business_goal: string | null;
  features_required: string | null;
  target_users: string | null;
  budget_range: string | null;
  timeline: string | null;
  current_website: string | null;
  preferred_tech: string | null;
  lead_quality_score: number | null;
  lead_quality_label: string | null;
  conversation_summary: string | null;
  suggested_approach: string | null;
  suggested_tech_stack: string | null;
  next_recommended_action: string | null;
  full_transcript: string | null;
  extra_notes: string | null;
  source: string;
  page_source: string | null;
  status: string;
  ip: string | null;
  user_agent: string | null;
  created_at: string;
};

function qualityTone(label: string | null): "default" | "lime" | "amber" | "rose" {
  if (label === "Hot") return "lime";
  if (label === "Warm") return "amber";
  return "default";
}

function statusTone(status: string): "default" | "accent" | "lime" | "amber" {
  switch (status) {
    case "new": return "accent";
    case "contacted": return "amber";
    case "qualified":
    case "won": return "lime";
    default: return "default";
  }
}

function timeAgo(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  const m = Math.round(ms / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.round(h / 24);
  return `${d}d ago`;
}

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("chatbot_leads")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);
  if (status && status !== "all") query = query.eq("status", status);

  const { data: rawLeads } = await query;
  const leads = (rawLeads ?? []) as Lead[];

  const stats = {
    total: leads.length,
    hot: leads.filter((l) => l.lead_quality_label === "Hot").length,
    warm: leads.filter((l) => l.lead_quality_label === "Warm").length,
    cold: leads.filter((l) => l.lead_quality_label === "Cold").length,
    new: leads.filter((l) => l.status === "new").length,
  };

  const filters = ["all", "new", "contacted", "qualified", "won", "lost"] as const;
  const activeFilter = (status ?? "all") as (typeof filters)[number];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Leads"
        subtitle="Captured from the site chatbot — full conversation, project picture, and recommended next action."
      />

      {/* Stat row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: "Total", value: stats.total, tone: "text-[var(--text)]" },
          { label: "Hot", value: stats.hot, tone: "text-[var(--lime)]" },
          { label: "Warm", value: stats.warm, tone: "text-[var(--amber)]" },
          { label: "Cold", value: stats.cold, tone: "text-[var(--text-3)]" },
          { label: "New (untouched)", value: stats.new, tone: "text-[var(--accent)]" },
        ].map((s) => (
          <Card key={s.label} className="p-4">
            <div className={`font-mono text-2xl ${s.tone}`}>{s.value}</div>
            <div className="text-xs uppercase tracking-[0.16em] text-[var(--text-4)] mt-1">
              {s.label}
            </div>
          </Card>
        ))}
      </div>

      {/* Status filter */}
      <div className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <Link
            key={f}
            href={f === "all" ? "/control/leads" : `/control/leads?status=${f}`}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
              activeFilter === f
                ? "bg-[var(--accent)]/15 text-[var(--accent)] border-[var(--accent)]/40"
                : "bg-[var(--surface-2)] text-[var(--text-3)] border-[var(--border)] hover:text-[var(--text)]"
            }`}
          >
            {f}
          </Link>
        ))}
      </div>

      {/* Lead list */}
      {leads.length === 0 ? (
        <Empty
          title="No leads yet"
          hint="When a visitor finishes a chat session and hits 'Share project', their lead lands here."
        />
      ) : (
        <div className="space-y-4">
          {leads.map((l) => {
            const location = l.extra_notes
              ?.split("\n")
              .find((line) => line.startsWith("Location:"))
              ?.replace("Location:", "")
              .trim();

            return (
              <Card key={l.id} className="p-6">
                <details>
                  <summary className="cursor-pointer">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h3 className="text-lg font-semibold text-[var(--text)]">
                            {l.visitor_name}
                          </h3>
                          <Badge tone={qualityTone(l.lead_quality_label)}>
                            {l.lead_quality_label ?? "—"} · {l.lead_quality_score ?? 0}/100
                          </Badge>
                          <Badge tone={statusTone(l.status)}>{l.status}</Badge>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[var(--text-3)]">
                          <a
                            href={`mailto:${l.visitor_email}`}
                            className="inline-flex items-center gap-1 hover:text-[var(--accent)]"
                          >
                            <Mail size={12} /> {l.visitor_email}
                          </a>
                          {l.visitor_phone && (
                            <span className="inline-flex items-center gap-1">
                              <Phone size={12} /> {l.visitor_phone}
                            </span>
                          )}
                          {l.visitor_company && (
                            <span className="inline-flex items-center gap-1">
                              <Globe size={12} /> {l.visitor_company}
                              {l.visitor_role && ` · ${l.visitor_role}`}
                            </span>
                          )}
                          {location && (
                            <span className="inline-flex items-center gap-1">
                              <MapPin size={12} /> {location}
                            </span>
                          )}
                          <span>{timeAgo(l.created_at)}</span>
                        </div>
                      </div>
                      <div className="text-xs text-[var(--text-3)]">
                        {l.project_type ?? "Project"}
                      </div>
                    </div>

                    {l.conversation_summary && (
                      <p className="mt-3 text-sm text-[var(--text-2)] leading-relaxed line-clamp-2">
                        {l.conversation_summary}
                      </p>
                    )}
                  </summary>

                  <div className="mt-6 pt-6 border-t border-[var(--border)] space-y-6">
                    {/* Suggested project scope */}
                    {l.suggested_approach && (
                      <div className="rounded-lg border border-[var(--lime)]/30 bg-[var(--lime)]/5 p-4">
                        <div className="text-xs font-mono uppercase tracking-[0.16em] text-[var(--lime)] mb-2">
                          Suggested project scope
                        </div>
                        <p className="text-sm text-[var(--text-2)] leading-relaxed whitespace-pre-wrap">
                          {l.suggested_approach}
                        </p>
                        {l.suggested_tech_stack && (
                          <p className="mt-2 text-xs text-[var(--text-3)]">
                            <strong>Stack:</strong> {l.suggested_tech_stack}
                          </p>
                        )}
                        {l.next_recommended_action && (
                          <p className="mt-2 text-xs text-[var(--text-3)]">
                            <strong>Next action:</strong> {l.next_recommended_action}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Project details grid */}
                    <div className="grid sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
                      {[
                        ["What to build", l.what_to_build],
                        ["Business goal", l.business_goal],
                        ["Features needed", l.features_required],
                        ["Target users", l.target_users],
                        ["Budget", l.budget_range],
                        ["Timeline", l.timeline],
                        ["Current website", l.current_website],
                        ["Preferred tech", l.preferred_tech],
                      ].map(([k, v]) =>
                        v ? (
                          <div key={k}>
                            <div className="text-xs uppercase tracking-[0.14em] text-[var(--text-4)] font-mono">
                              {k}
                            </div>
                            <div className="mt-1 text-[var(--text-2)] leading-snug">
                              {v}
                            </div>
                          </div>
                        ) : null
                      )}
                    </div>

                    {/* Extra notes */}
                    {l.extra_notes && (
                      <details>
                        <summary className="cursor-pointer text-xs text-[var(--text-3)] hover:text-[var(--text)]">
                          Extra notes
                        </summary>
                        <pre className="mt-2 text-xs text-[var(--text-2)] whitespace-pre-wrap font-mono leading-relaxed">
                          {l.extra_notes}
                        </pre>
                      </details>
                    )}

                    {/* Transcript */}
                    {l.full_transcript && (
                      <details>
                        <summary className="cursor-pointer text-xs text-[var(--text-3)] hover:text-[var(--text)]">
                          Full conversation transcript
                        </summary>
                        <pre className="mt-2 text-xs text-[var(--text-2)] whitespace-pre-wrap font-mono leading-relaxed bg-[var(--surface-2)] border border-[var(--border)] rounded-md p-3 max-h-[400px] overflow-auto">
                          {l.full_transcript}
                        </pre>
                      </details>
                    )}

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2 pt-2">
                      <a
                        href={`mailto:${l.visitor_email}?subject=${encodeURIComponent(`Re: your enquiry — ${l.project_type ?? "your project"}`)}`}
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm bg-[var(--accent)]/15 text-[var(--accent)] border border-[var(--accent)]/30 hover:bg-[var(--accent)]/25"
                      >
                        <Mail size={14} /> Email reply
                      </a>
                      {l.page_source && (
                        <a
                          href={l.page_source}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm bg-[var(--surface-2)] text-[var(--text-3)] border border-[var(--border)] hover:text-[var(--text)]"
                        >
                          <ExternalLink size={14} /> Source page
                        </a>
                      )}
                    </div>
                  </div>
                </details>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
