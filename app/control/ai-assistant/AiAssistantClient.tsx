"use client";

import { useActionState, useState, useTransition } from "react";
import {
  Sparkles,
  FileSignature,
  Mail,
  MessageSquare,
  Wand2,
  Copy,
  Save,
  Loader2,
} from "lucide-react";
import {
  Card,
  Field,
  Input,
  Textarea,
  Select,
  PrimaryButton,
  GhostButton,
} from "@/components/admin/ui";
import {
  generateDraft,
  saveDraftAsContract,
  type DraftFormState,
} from "./actions";

const MODES = [
  {
    id: "contract",
    label: "Contract",
    icon: FileSignature,
    hint: "MSA / SOW / NDA / retainer — protective terms baked in.",
  },
  {
    id: "proposal",
    label: "Proposal",
    icon: Sparkles,
    hint: "Punchy proposal: approach, phases, fee, timeline.",
  },
  {
    id: "followup",
    label: "Follow-up email",
    icon: Mail,
    hint: "Short, warm, one clear ask.",
  },
  {
    id: "custom",
    label: "Custom",
    icon: MessageSquare,
    hint: "Write any draft with a system prompt of your own.",
  },
] as const;

interface Props {
  leads: { id: string; label: string }[];
  prefillLeadId?: string;
  prefillMode?: (typeof MODES)[number]["id"];
  prefillBrief?: string;
}

export default function AiAssistantClient({
  leads,
  prefillLeadId,
  prefillMode,
  prefillBrief,
}: Props) {
  const [state, formAction, pending] = useActionState<DraftFormState, FormData>(
    generateDraft,
    {} as DraftFormState
  );
  const [mode, setMode] = useState<(typeof MODES)[number]["id"]>(
    prefillMode && MODES.some((m) => m.id === prefillMode) ? prefillMode : "contract"
  );
  const [editedOutput, setEditedOutput] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [, startTransition] = useTransition();

  const currentOutput = editedOutput || state.output || "";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentOutput);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore
    }
  };

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* INPUT */}
      <form action={formAction} className="space-y-5">
        <Card className="p-5 space-y-4">
          <div>
            <div className="text-xs font-mono uppercase tracking-[0.16em] text-[var(--text-4)] mb-2">
              Draft type
            </div>
            <div className="grid grid-cols-2 gap-2">
              {MODES.map((m) => {
                const Icon = m.icon;
                const active = mode === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setMode(m.id)}
                    className={`flex items-start gap-3 p-3 rounded-lg border text-left transition-colors ${
                      active
                        ? "bg-[var(--accent)]/10 border-[var(--accent)]/40 text-[var(--text)]"
                        : "bg-[var(--surface-2)] border-[var(--border)] text-[var(--text-3)] hover:text-[var(--text)]"
                    }`}
                  >
                    <Icon
                      size={16}
                      className={
                        active ? "text-[var(--accent)] mt-0.5" : "text-[var(--text-3)] mt-0.5"
                      }
                    />
                    <div>
                      <div className="text-sm font-semibold">{m.label}</div>
                      <div className="text-[11px] leading-snug text-[var(--text-4)] mt-0.5">
                        {m.hint}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
            <input type="hidden" name="mode" value={mode} />
          </div>

          {leads.length > 0 && (
            <Field
              label="Pull context from a chatbot lead (optional)"
              htmlFor="leadId"
              hint="Select a recent lead — their project info will be passed to the AI."
            >
              <Select id="leadId" name="leadId" defaultValue={prefillLeadId ?? ""}>
                <option value="">— None —</option>
                {leads.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.label}
                  </option>
                ))}
              </Select>
            </Field>
          )}

          <Field
            label="Brief"
            htmlFor="brief"
            hint={
              mode === "contract"
                ? "What's the engagement? e.g. 'MSA + SOW for AKS migration, $14k fixed-fee, 6 weeks, payable in 3 milestones.'"
                : mode === "proposal"
                  ? "What problem is it, what would you propose, rough fee + timeline."
                  : mode === "followup"
                    ? "Who is it to, what's the situation, what's the ask."
                    : "Describe what you want drafted."
            }
          >
            <Textarea
              id="brief"
              name="brief"
              rows={8}
              required
              placeholder="Tell the assistant what to draft. The more specific, the better the output."
              defaultValue={state.brief ?? prefillBrief ?? ""}
            />
          </Field>

          {mode === "custom" && (
            <Field
              label="Custom system prompt"
              htmlFor="customSystemPrompt"
              hint="Override the default writing voice. Optional."
            >
              <Textarea
                id="customSystemPrompt"
                name="customSystemPrompt"
                rows={3}
                placeholder="e.g. 'You are a legal assistant drafting a partnership memorandum...'"
              />
            </Field>
          )}

          {state.error && (
            <div className="rounded-md p-3 text-sm bg-[var(--rose)]/10 border border-[var(--rose)]/30 text-[var(--rose)]">
              {state.error}
            </div>
          )}

          <div className="pt-2">
            <PrimaryButton type="submit" disabled={pending}>
              {pending ? (
                <>
                  <Loader2 size={14} className="animate-spin" /> Drafting…
                </>
              ) : (
                <>
                  <Wand2 size={14} /> Generate draft
                </>
              )}
            </PrimaryButton>
          </div>
        </Card>
      </form>

      {/* OUTPUT */}
      <div className="space-y-4">
        <Card className="p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="text-xs font-mono uppercase tracking-[0.16em] text-[var(--text-4)]">
              Output
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopy}
                disabled={!currentOutput}
                className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-md border border-[var(--border)] bg-[var(--surface-2)] text-[var(--text-3)] hover:text-[var(--text)] disabled:opacity-40"
              >
                <Copy size={12} /> {copied ? "Copied" : "Copy"}
              </button>
            </div>
          </div>

          {currentOutput ? (
            <Textarea
              rows={28}
              value={currentOutput}
              onChange={(e) => setEditedOutput(e.target.value)}
              className="font-mono text-xs leading-relaxed"
            />
          ) : (
            <div className="rounded-md border border-dashed border-[var(--border)] p-6 text-center text-sm text-[var(--text-3)]">
              {pending
                ? "Drafting…"
                : "Generated draft will appear here. Edit before saving."}
            </div>
          )}
        </Card>

        {/* Save as contract */}
        {currentOutput && mode === "contract" && (
          <Card className="p-5 space-y-3">
            <div className="text-xs font-mono uppercase tracking-[0.16em] text-[var(--text-4)]">
              Save as draft contract (sendable from /control/contracts)
            </div>
            <form
              action={(fd) => {
                fd.set("body", currentOutput);
                startTransition(() => {
                  saveDraftAsContract(fd);
                });
              }}
              className="grid sm:grid-cols-2 gap-3"
            >
              <Field label="Title" htmlFor="contract-title">
                <Input id="contract-title" name="title" required placeholder="MSA — Acme Corp" />
              </Field>
              <Field label="Recipient name" htmlFor="contract-recipient-name">
                <Input
                  id="contract-recipient-name"
                  name="recipient_name"
                  required
                  placeholder="Jane Doe"
                />
              </Field>
              <Field label="Recipient email" htmlFor="contract-recipient-email">
                <Input
                  id="contract-recipient-email"
                  name="recipient_email"
                  type="email"
                  required
                  placeholder="jane@example.com"
                />
              </Field>
              <div className="flex items-end">
                <GhostButton type="submit">
                  <Save size={14} /> Save as draft contract
                </GhostButton>
              </div>
            </form>
            <p className="text-[11px] text-[var(--text-4)]">
              Saves to <code>/control/contracts</code> as a draft. From there, set the signing
              link, send by email, and track signing status.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
