import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";
import InboxActions from "@/components/admin/InboxActions";

export const metadata: Metadata = { title: "Inbox" };

export default async function InboxPage() {
  const supabase = await createClient();

  const { data: messages } = await supabase
    .from("inbox_messages")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div style={{ padding: "2rem" }}>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 style={{ color: "#faf7f2" }} className="text-2xl font-semibold">
            Inbox
          </h1>
          <p style={{ color: "#9b7653" }} className="text-sm mt-1">
            {messages?.filter((m: { status: string }) => m.status === "unread").length ?? 0} unread
          </p>
        </div>
      </div>

      <div
        style={{ backgroundColor: "#2a1608", border: "1px solid #3e2610" }}
        className="rounded-lg overflow-hidden"
      >
        {messages && messages.length > 0 ? (
          <div>
            {messages.map((msg: {
              id: string;
              status: string;
              subject: string;
              sender_name: string | null;
              sender_email: string;
              source: string;
              created_at: string;
              body: string | null;
              notes: string | null;
            }) => (
              <div
                key={msg.id}
                style={{
                  borderBottom: "1px solid #3e2610",
                  backgroundColor:
                    msg.status === "unread"
                      ? "rgba(207,169,126,0.05)"
                      : "transparent",
                }}
                className="p-5"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      {msg.status === "unread" && (
                        <span
                          style={{ backgroundColor: "#cfa97e" }}
                          className="w-2 h-2 rounded-full flex-shrink-0"
                        />
                      )}
                      <p
                        style={{ color: "#faf7f2" }}
                        className={`font-medium truncate ${
                          msg.status === "unread" ? "font-semibold" : ""
                        }`}
                      >
                        {msg.subject}
                      </p>
                    </div>
                    <p style={{ color: "#9b7653" }} className="text-sm">
                      {msg.sender_name
                        ? `${msg.sender_name} <${msg.sender_email}>`
                        : msg.sender_email}
                    </p>
                    {msg.body && (
                      <p
                        style={{ color: "#7d5c3a" }}
                        className="text-sm mt-2 line-clamp-2"
                      >
                        {msg.body}
                      </p>
                    )}
                    {msg.notes && (
                      <p
                        style={{
                          color: "#cfa97e",
                          backgroundColor: "rgba(207,169,126,0.1)",
                        }}
                        className="text-xs mt-2 px-3 py-1.5 rounded"
                      >
                        Note: {msg.notes}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-3 flex-shrink-0">
                    <div className="flex items-center gap-2">
                      <span
                        style={{
                          backgroundColor: "#3e2610",
                          color: "#9b7653",
                        }}
                        className="text-xs px-2 py-0.5 rounded"
                      >
                        {msg.source}
                      </span>
                      <span style={{ color: "#7d5c3a" }} className="text-xs">
                        {formatDate(msg.created_at)}
                      </span>
                    </div>
                    <InboxActions
                      messageId={msg.id}
                      currentStatus={msg.status}
                      senderEmail={msg.sender_email}
                      senderName={msg.sender_name}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            <p style={{ color: "#7d5c3a" }}>No messages yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
