"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Archive, Check, MailOpen, NotebookPen, Reply, Trash2, UserPlus, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface Props {
  messageId: string;
  currentStatus: string;
  senderEmail: string;
  senderName: string | null;
  subject?: string;
  body?: string | null;
}

export default function InboxActions({
  messageId,
  currentStatus,
  senderEmail,
  senderName,
  subject,
  body,
}: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [note, setNote] = useState("");

  async function deleteMessage() {
    if (!confirm("Permanently delete this message? This cannot be undone.")) return;
    setLoading("delete");
    const supabase = createClient();
    await supabase.from("inbox_messages").delete().eq("id", messageId);
    router.refresh();
    setLoading(null);
  }

  const replyHref = (() => {
    const replySubject =
      subject && subject.toLowerCase().startsWith("re:")
        ? subject
        : `Re: ${subject ?? ""}`;
    const quoted = body
      ? `\n\n\n---\nOn ${new Date().toLocaleDateString()}, ${
          senderName ?? senderEmail
        } wrote:\n` + body.split("\n").map((l) => `> ${l}`).join("\n")
      : "";
    const params = new URLSearchParams({
      to: senderEmail,
      subject: replySubject,
      body: quoted,
      reply_to: messageId,
    });
    return `/control/email?${params.toString()}`;
  })();

  async function updateStatus(status: string) {
    setLoading(status);
    const supabase = createClient();
    await supabase.from("inbox_messages").update({ status }).eq("id", messageId);
    router.refresh();
    setLoading(null);
  }

  async function saveNote() {
    if (!note.trim()) return;
    setLoading("note");
    const supabase = createClient();
    await supabase
      .from("inbox_messages")
      .update({ notes: note, status: "read" })
      .eq("id", messageId);
    setShowNoteInput(false);
    setNote("");
    router.refresh();
    setLoading(null);
  }

  async function convertToLead() {
    setLoading("lead");
    const supabase = createClient();
    const { data } = await supabase
      .from("leads")
      .insert({
        name: senderName || senderEmail,
        email: senderEmail,
        source: "inbox",
        status: "new",
      })
      .select()
      .single();

    if (data) {
      await supabase
        .from("inbox_messages")
        .update({ status: "read", lead_id: data.id })
        .eq("id", messageId);
    }
    router.refresh();
    setLoading(null);
  }

  const btn =
    "inline-flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-full border transition-colors disabled:opacity-50";

  return (
    <div className="space-y-2">
      {showNoteInput && (
        <div className="flex gap-2">
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add note..."
            className="flex-1 px-3 py-1.5 text-xs rounded-md bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text)] outline-none focus:border-[var(--accent)]"
            autoFocus
          />
          <button
            onClick={saveNote}
            disabled={loading === "note"}
            className="px-2.5 py-1 text-xs rounded-md bg-[var(--accent)] text-[#04121a] font-semibold"
          >
            Save
          </button>
          <button
            onClick={() => setShowNoteInput(false)}
            className="px-1.5 py-1 text-xs text-[var(--text-3)] hover:text-[var(--text)]"
          >
            <X size={14} />
          </button>
        </div>
      )}
      <div className="flex gap-1.5 flex-wrap justify-end">
        <Link
          href={replyHref}
          className={`${btn} bg-[var(--accent)]/15 border-[var(--accent)]/40 text-[var(--accent)] hover:bg-[var(--accent)]/25`}
        >
          <Reply size={12} /> Reply
        </Link>
        {currentStatus === "unread" ? (
          <button
            onClick={() => updateStatus("read")}
            disabled={loading === "read"}
            className={`${btn} bg-[var(--surface-2)] border-[var(--border)] text-[var(--text-2)] hover:text-[var(--text)] hover:border-[var(--border-2)]`}
          >
            <MailOpen size={12} /> Mark read
          </button>
        ) : (
          <button
            onClick={() => updateStatus("unread")}
            disabled={loading === "unread"}
            className={`${btn} bg-[var(--surface-2)] border-[var(--border)] text-[var(--text-2)] hover:text-[var(--text)] hover:border-[var(--border-2)]`}
          >
            <MailOpen size={12} /> Unread
          </button>
        )}
        <button
          onClick={() => updateStatus("replied")}
          disabled={loading === "replied"}
          className={`${btn} bg-[var(--lime)]/10 border-[var(--lime)]/30 text-[var(--lime)] hover:bg-[var(--lime)]/15`}
        >
          <Check size={12} /> Replied
        </button>
        <button
          onClick={() => setShowNoteInput(true)}
          className={`${btn} bg-[var(--surface-2)] border-[var(--border)] text-[var(--text-2)] hover:text-[var(--text)] hover:border-[var(--border-2)]`}
        >
          <NotebookPen size={12} /> Note
        </button>
        <button
          onClick={convertToLead}
          disabled={loading === "lead"}
          className={`${btn} bg-[var(--violet)]/10 border-[var(--violet)]/30 text-[var(--violet)] hover:bg-[var(--violet)]/15`}
        >
          <UserPlus size={12} /> Lead
        </button>
        <button
          onClick={() => updateStatus("archived")}
          disabled={loading === "archived"}
          className={`${btn} bg-[var(--surface-2)] border-[var(--border)] text-[var(--text-3)] hover:text-[var(--text)] hover:border-[var(--border-2)]`}
        >
          <Archive size={12} /> Archive
        </button>
        <button
          onClick={deleteMessage}
          disabled={loading === "delete"}
          className={`${btn} bg-[var(--rose)]/10 border-[var(--rose)]/30 text-[var(--rose)] hover:bg-[var(--rose)]/20`}
        >
          <Trash2 size={12} /> Delete
        </button>
      </div>
    </div>
  );
}
