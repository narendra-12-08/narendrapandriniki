"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface Props {
  messageId: string;
  currentStatus: string;
  senderEmail: string;
  senderName: string | null;
}

export default function InboxActions({
  messageId,
  currentStatus,
  senderEmail,
  senderName,
}: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [note, setNote] = useState("");

  async function updateStatus(status: string) {
    setLoading(status);
    const supabase = createClient();
    await supabase
      .from("inbox_messages")
      .update({ status })
      .eq("id", messageId);
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

  return (
    <div>
      {showNoteInput && (
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add note..."
            style={{
              backgroundColor: "#1e1208",
              border: "1px solid #3e2610",
              color: "#faf7f2",
            }}
            className="px-3 py-1 text-xs rounded flex-1 outline-none"
          />
          <button
            onClick={saveNote}
            disabled={loading === "note"}
            style={{ backgroundColor: "#5c3d1e", color: "#faf7f2" }}
            className="px-3 py-1 text-xs rounded"
          >
            Save
          </button>
          <button
            onClick={() => setShowNoteInput(false)}
            style={{ color: "#9b7653" }}
            className="px-2 py-1 text-xs"
          >
            ✕
          </button>
        </div>
      )}
      <div className="flex gap-2 flex-wrap">
        {currentStatus === "unread" ? (
          <button
            onClick={() => updateStatus("read")}
            disabled={loading === "read"}
            style={{ color: "#9b7653", border: "1px solid #3e2610" }}
            className="text-xs px-2 py-1 rounded hover:opacity-80"
          >
            Mark read
          </button>
        ) : (
          <button
            onClick={() => updateStatus("unread")}
            disabled={loading === "unread"}
            style={{ color: "#9b7653", border: "1px solid #3e2610" }}
            className="text-xs px-2 py-1 rounded hover:opacity-80"
          >
            Mark unread
          </button>
        )}
        <button
          onClick={() => setShowNoteInput(true)}
          style={{ color: "#9b7653", border: "1px solid #3e2610" }}
          className="text-xs px-2 py-1 rounded hover:opacity-80"
        >
          Note
        </button>
        <button
          onClick={convertToLead}
          disabled={loading === "lead"}
          style={{ color: "#cfa97e", border: "1px solid #5c3d1e" }}
          className="text-xs px-2 py-1 rounded hover:opacity-80"
        >
          → Lead
        </button>
        <button
          onClick={() => updateStatus("archived")}
          disabled={loading === "archived"}
          style={{ color: "#7d5c3a", border: "1px solid #3e2610" }}
          className="text-xs px-2 py-1 rounded hover:opacity-80"
        >
          Archive
        </button>
      </div>
    </div>
  );
}
