import type { Metadata } from "next";
import { createServiceClient } from "@/lib/supabase/server";
import { PageHeader, Card } from "@/components/admin/ui";
import { formatDistanceToNow } from "date-fns";
import { MessageSquare, Mail, User, CheckCircle, Clock } from "lucide-react";

export const metadata: Metadata = { title: "Chat Sessions" };
export const dynamic = "force-dynamic";

type ChatSession = {
  id: string;
  session_id: string;
  visitor_name: string | null;
  visitor_email: string | null;
  visitor_company: string | null;
  messages: Array<{ role: string; content: string }>;
  project_summary: string | null;
  lead_captured: boolean;
  email_sent: boolean;
  created_at: string;
  updated_at: string;
};

export default async function ChatSessionsPage() {
  const supabase = await createServiceClient();
  const { data: sessions } = await supabase
    .from("chat_sessions")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);

  const rows = (sessions ?? []) as ChatSession[];
  const total = rows.length;
  const leads = rows.filter((s) => s.lead_captured).length;
  const withEmail = rows.filter((s) => s.visitor_email).length;

  return (
    <div className="space-y-8">
      <PageHeader
        title="Chat Sessions"
        subtitle={`${total} total · ${leads} leads captured · ${withEmail} emails collected`}
      />

      {/* KPI row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total sessions", value: total, icon: MessageSquare },
          { label: "Leads captured", value: leads, icon: User },
          { label: "Emails collected", value: withEmail, icon: Mail },
          { label: "Conversion rate", value: total ? `${Math.round((leads / total) * 100)}%` : "—", icon: CheckCircle },
        ].map(({ label, value, icon: Icon }) => (
          <Card key={label} className="p-5 flex items-start gap-4">
            <div className="p-2 rounded-lg" style={{ background: "var(--surface-2)" }}>
              <Icon className="w-4 h-4" style={{ color: "var(--accent)" }} />
            </div>
            <div>
              <p className="text-2xl font-semibold" style={{ color: "var(--text)" }}>
                {value}
              </p>
              <p className="text-xs mt-0.5" style={{ color: "var(--text-3)" }}>
                {label}
              </p>
            </div>
          </Card>
        ))}
      </div>

      {rows.length === 0 ? (
        <Card className="p-12 text-center">
          <MessageSquare className="w-8 h-8 mx-auto mb-3" style={{ color: "var(--text-4)" }} />
          <p style={{ color: "var(--text-3)" }}>No chat sessions yet.</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {rows.map((s) => (
            <Card key={s.id} className="p-0 overflow-hidden">
              {/* Session header */}
              <div
                className="flex items-start justify-between px-5 py-4"
                style={{ borderBottom: s.messages.length > 0 ? "1px solid var(--border)" : "none" }}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="mt-0.5 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                    style={{ background: "var(--surface-2)", color: "var(--accent)" }}
                  >
                    {s.visitor_name ? s.visitor_name[0].toUpperCase() : "?"}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-sm" style={{ color: "var(--text)" }}>
                        {s.visitor_name ?? "Anonymous visitor"}
                      </span>
                      {s.visitor_company && (
                        <span className="text-xs" style={{ color: "var(--text-3)" }}>
                          · {s.visitor_company}
                        </span>
                      )}
                      {s.lead_captured && (
                        <span
                          className="text-[10px] font-mono uppercase tracking-wide px-2 py-0.5 rounded-full"
                          style={{ background: "color-mix(in srgb, var(--lime) 15%, transparent)", color: "var(--lime)" }}
                        >
                          Lead
                        </span>
                      )}
                      {s.email_sent && (
                        <span
                          className="text-[10px] font-mono uppercase tracking-wide px-2 py-0.5 rounded-full"
                          style={{ background: "color-mix(in srgb, var(--accent) 15%, transparent)", color: "var(--accent)" }}
                        >
                          Email sent
                        </span>
                      )}
                    </div>
                    {s.visitor_email && (
                      <a
                        href={`mailto:${s.visitor_email}`}
                        className="text-xs hover:opacity-70 transition-opacity"
                        style={{ color: "var(--accent)" }}
                      >
                        {s.visitor_email}
                      </a>
                    )}
                    {s.project_summary && (
                      <p className="mt-1 text-xs leading-relaxed max-w-lg" style={{ color: "var(--text-3)" }}>
                        {s.project_summary.length > 200 ? s.project_summary.slice(0, 200) + "…" : s.project_summary}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs shrink-0 ml-4" style={{ color: "var(--text-4)" }}>
                  <Clock className="w-3 h-3" />
                  <span>{formatDistanceToNow(new Date(s.created_at), { addSuffix: true })}</span>
                  <span className="ml-1">· {s.messages.length} msg</span>
                </div>
              </div>

              {/* Message thread (collapsed, last 3 shown) */}
              {s.messages.length > 0 && (
                <div className="px-5 py-3 space-y-2 max-h-48 overflow-y-auto" style={{ background: "var(--bg)" }}>
                  {s.messages.slice(-6).map((m, i) => (
                    <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                      <div
                        className="max-w-[80%] text-xs px-3 py-2 rounded-xl leading-relaxed"
                        style={
                          m.role === "user"
                            ? { background: "var(--accent)", color: "var(--bg)" }
                            : { background: "var(--surface)", color: "var(--text-2)", border: "1px solid var(--border)" }
                        }
                      >
                        {m.content}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
