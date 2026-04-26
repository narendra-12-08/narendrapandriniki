"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { X, MessageSquare, Send, ChevronDown, Loader2 } from "lucide-react";

type Message = { role: "user" | "assistant"; content: string };
type LeadState = { name: string; email: string; company: string };

const GREETING =
  "Hi! I'm Narendra's AI assistant. He's a senior DevOps & Cloud engineer with 5 years of experience helping teams across India, UK, US, Singapore, and Dubai ship reliable platforms. Whether you need cloud migration, Kubernetes, SRE, or AI infrastructure — I can help scope it. What brings you here today?";

const QUICK_REPLIES = [
  "What services do you offer?",
  "How does pricing work?",
  "I have a project to discuss",
  "Are you available now?",
];

function generateSessionId() {
  return `sess_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: GREETING },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId] = useState(generateSessionId);
  const [showLead, setShowLead] = useState(false);
  const [lead, setLead] = useState<LeadState>({ name: "", email: "", company: "" });
  const [leadSubmitting, setLeadSubmitting] = useState(false);
  const [leadSent, setLeadSent] = useState(false);
  const [unread, setUnread] = useState(false);
  const [hasAutoOpened, setHasAutoOpened] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-open after 4 seconds
  useEffect(() => {
    if (hasAutoOpened) return;
    const t = setTimeout(() => {
      setOpen(true);
      setHasAutoOpened(true);
    }, 4000);
    return () => clearTimeout(t);
  }, [hasAutoOpened]);

  // Unread dot when closed and new message arrives
  useEffect(() => {
    if (!open && messages.length > 1) setUnread(true);
  }, [messages, open]);

  useEffect(() => {
    if (open) setUnread(false);
  }, [open]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
  }, [open]);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || loading) return;

      const next: Message[] = [...messages, { role: "user", content: trimmed }];
      setMessages(next);
      setInput("");
      setLoading(true);

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: next,
            sessionId,
          }),
        });
        const data = await res.json();
        const reply = data.reply ?? "Something went wrong. Please try again.";
        setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              "I ran into a connection issue. You can reach Narendra directly at hello@narendrapandrinki.com.",
          },
        ]);
      } finally {
        setLoading(false);
      }
    },
    [messages, loading, sessionId]
  );

  async function handleLeadSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!lead.name || !lead.email) return;
    setLeadSubmitting(true);

    const projectSummary =
      messages
        .filter((m) => m.role === "user")
        .map((m) => m.content)
        .join(" | ") || "Enquiry via site chatbot";

    const conversationSnippet = messages
      .map((m) => `${m.role === "user" ? "Visitor" : "Assistant"}: ${m.content}`)
      .join("\n");

    try {
      await fetch("/api/chat/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          visitorName: lead.name,
          visitorEmail: lead.email,
          visitorCompany: lead.company || undefined,
          projectSummary,
          conversationSnippet,
        }),
      });
      setLeadSent(true);
      setShowLead(false);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `Perfect, ${lead.name}. I've sent your details to Narendra — he'll be in touch within 1–2 business days. Check your inbox (${lead.email}) for a confirmation.`,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `Something went wrong. Please email Narendra directly at hello@narendrapandrinki.com.`,
        },
      ]);
    } finally {
      setLeadSubmitting(false);
    }
  }

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Chat with Narendra's AI assistant"
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2 focus:ring-offset-[var(--bg)]"
        style={{ background: "var(--accent)" }}
      >
        {open ? (
          <ChevronDown className="w-6 h-6 text-[var(--bg)]" />
        ) : (
          <MessageSquare className="w-6 h-6 text-[var(--bg)]" />
        )}
        {unread && !open && (
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[var(--rose)] border-2 border-[var(--bg)]" />
        )}
      </button>

      {/* Chat window */}
      {open && (
        <div
          className="fixed bottom-24 right-6 z-50 flex flex-col rounded-2xl shadow-2xl overflow-hidden"
          style={{
            width: "min(380px, calc(100vw - 48px))",
            height: "min(560px, calc(100vh - 120px))",
            background: "var(--surface)",
            border: "1px solid var(--border)",
          }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-4 py-3 shrink-0"
            style={{ background: "var(--surface-2)", borderBottom: "1px solid var(--border)" }}
          >
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{ background: "var(--accent)", color: "var(--bg)" }}
                >
                  N
                </div>
                <span
                  className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2"
                  style={{ background: "var(--lime)", borderColor: "var(--surface-2)" }}
                />
              </div>
              <div>
                <p className="text-xs font-semibold" style={{ color: "var(--text)" }}>
                  Narendra&apos;s AI Assistant
                </p>
                <p className="text-[10px]" style={{ color: "var(--lime)" }}>
                  Online · Replies instantly
                </p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="p-1 rounded-md hover:bg-[var(--border)] transition-colors"
              style={{ color: "var(--text-3)" }}
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 scroll-smooth">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className="max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed"
                  style={
                    m.role === "user"
                      ? { background: "var(--accent)", color: "var(--bg)" }
                      : { background: "var(--surface-2)", color: "var(--text-2)", border: "1px solid var(--border)" }
                  }
                >
                  {m.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div
                  className="rounded-2xl px-4 py-3"
                  style={{ background: "var(--surface-2)", border: "1px solid var(--border)" }}
                >
                  <Loader2
                    className="w-4 h-4 animate-spin"
                    style={{ color: "var(--accent)" }}
                  />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick replies (only on first message) */}
          {messages.length === 1 && (
            <div className="px-4 pb-2 flex flex-wrap gap-1.5 shrink-0">
              {QUICK_REPLIES.map((qr) => (
                <button
                  key={qr}
                  onClick={() => sendMessage(qr)}
                  className="text-xs px-3 py-1.5 rounded-full border transition-colors hover:opacity-80"
                  style={{
                    borderColor: "var(--accent)",
                    color: "var(--accent)",
                    background: "transparent",
                  }}
                >
                  {qr}
                </button>
              ))}
            </div>
          )}

          {/* Lead capture form */}
          {showLead && !leadSent && (
            <form
              onSubmit={handleLeadSubmit}
              className="px-4 py-3 space-y-2 shrink-0"
              style={{ borderTop: "1px solid var(--border)", background: "var(--surface-2)" }}
            >
              <p className="text-xs font-semibold" style={{ color: "var(--text-2)" }}>
                Send your details to Narendra
              </p>
              <input
                type="text"
                placeholder="Your name *"
                value={lead.name}
                onChange={(e) => setLead((l) => ({ ...l, name: e.target.value }))}
                required
                className="w-full text-sm px-3 py-2 rounded-lg outline-none"
                style={{
                  background: "var(--bg)",
                  border: "1px solid var(--border-2)",
                  color: "var(--text)",
                }}
              />
              <input
                type="email"
                placeholder="Your email *"
                value={lead.email}
                onChange={(e) => setLead((l) => ({ ...l, email: e.target.value }))}
                required
                className="w-full text-sm px-3 py-2 rounded-lg outline-none"
                style={{
                  background: "var(--bg)",
                  border: "1px solid var(--border-2)",
                  color: "var(--text)",
                }}
              />
              <input
                type="text"
                placeholder="Company (optional)"
                value={lead.company}
                onChange={(e) => setLead((l) => ({ ...l, company: e.target.value }))}
                className="w-full text-sm px-3 py-2 rounded-lg outline-none"
                style={{
                  background: "var(--bg)",
                  border: "1px solid var(--border-2)",
                  color: "var(--text)",
                }}
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowLead(false)}
                  className="flex-1 text-sm py-2 rounded-lg border transition-colors"
                  style={{ borderColor: "var(--border-2)", color: "var(--text-3)" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={leadSubmitting}
                  className="flex-1 text-sm py-2 rounded-lg font-semibold transition-opacity disabled:opacity-60"
                  style={{ background: "var(--accent)", color: "var(--bg)" }}
                >
                  {leadSubmitting ? "Sending..." : "Send to Narendra"}
                </button>
              </div>
            </form>
          )}

          {/* Input bar */}
          {!showLead && (
            <div
              className="px-3 py-3 flex items-center gap-2 shrink-0"
              style={{ borderTop: "1px solid var(--border)" }}
            >
              {!leadSent && messages.length >= 3 && (
                <button
                  onClick={() => setShowLead(true)}
                  className="shrink-0 text-xs px-2.5 py-1.5 rounded-lg font-medium transition-opacity hover:opacity-80 whitespace-nowrap"
                  style={{ background: "var(--violet)", color: "#fff" }}
                  title="Share your project details with Narendra"
                >
                  Share project
                </button>
              )}
              <input
                ref={inputRef}
                type="text"
                placeholder="Ask me anything..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage(input);
                  }
                }}
                className="flex-1 text-sm px-3 py-2 rounded-lg outline-none"
                style={{
                  background: "var(--surface-2)",
                  border: "1px solid var(--border-2)",
                  color: "var(--text)",
                }}
              />
              <button
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || loading}
                className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-opacity disabled:opacity-40"
                style={{ background: "var(--accent)" }}
              >
                <Send className="w-3.5 h-3.5" style={{ color: "var(--bg)" }} />
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}
