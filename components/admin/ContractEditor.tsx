"use client";

import { useMemo, useState } from "react";
import Markdown from "@/components/public/Markdown";
import {
  Field,
  GhostButton,
  Input,
  PrimaryButton,
  Select,
  Textarea,
} from "@/components/admin/ui";
import { createAndSendContract } from "@/app/control/actions-contracts";
import type { ContractTemplate } from "@/lib/db/contracts";

interface ClientOpt {
  id: string;
  name: string;
  email: string | null;
  company: string | null;
}

interface ProjectOpt {
  id: string;
  name: string;
  client_id: string | null;
}

export default function ContractEditor({
  templates,
  clients,
  projects,
}: {
  templates: ContractTemplate[];
  clients: ClientOpt[];
  projects: ProjectOpt[];
}) {
  const [templateId, setTemplateId] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [body, setBody] = useState<string>("");
  const [clientId, setClientId] = useState<string>("");
  const [projectId, setProjectId] = useState<string>("");
  const [recipientName, setRecipientName] = useState<string>("");
  const [recipientEmail, setRecipientEmail] = useState<string>("");
  const [showPreview, setShowPreview] = useState<boolean>(true);

  const filteredProjects = useMemo(
    () =>
      clientId
        ? projects.filter((p) => p.client_id === clientId)
        : projects,
    [projects, clientId]
  );

  function handleTemplateChange(id: string) {
    setTemplateId(id);
    if (!id) return;
    const t = templates.find((x) => x.id === id);
    if (!t) return;
    setBody(t.body);
    if (!title) setTitle(t.name);
  }

  function handleClientChange(id: string) {
    setClientId(id);
    const c = clients.find((x) => x.id === id);
    if (c) {
      if (!recipientName) setRecipientName(c.name);
      if (!recipientEmail && c.email) setRecipientEmail(c.email);
    }
    setProjectId("");
  }

  return (
    <form action={createAndSendContract} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Field label="Template (optional)">
          <Select
            value={templateId}
            onChange={(e) => handleTemplateChange(e.target.value)}
          >
            <option value="">— Custom (start blank) —</option>
            {templates.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Title" htmlFor="title">
          <Input
            id="title"
            name="title"
            required
            placeholder="e.g. Master Services Agreement — Acme Corp"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </Field>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Field label="Client (optional)">
          <Select
            name="client_id"
            value={clientId}
            onChange={(e) => handleClientChange(e.target.value)}
          >
            <option value="">—</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
                {c.company ? ` · ${c.company}` : ""}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Project (optional)">
          <Select
            name="project_id"
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
          >
            <option value="">—</option>
            {filteredProjects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </Select>
        </Field>
        <div />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Field label="Recipient name" htmlFor="recipient_name">
          <Input
            id="recipient_name"
            name="recipient_name"
            required
            value={recipientName}
            onChange={(e) => setRecipientName(e.target.value)}
          />
        </Field>
        <Field label="Recipient email" htmlFor="recipient_email">
          <Input
            id="recipient_email"
            name="recipient_email"
            type="email"
            required
            value={recipientEmail}
            onChange={(e) => setRecipientEmail(e.target.value)}
          />
        </Field>
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label
            htmlFor="body_markdown"
            className="block text-xs font-medium text-[var(--text-2)]"
          >
            Body (markdown)
          </label>
          <button
            type="button"
            onClick={() => setShowPreview((v) => !v)}
            className="text-xs text-[var(--text-3)] hover:text-[var(--text)]"
          >
            {showPreview ? "Hide preview" : "Show preview"}
          </button>
        </div>
        <div
          className={`grid gap-4 ${
            showPreview ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1"
          }`}
        >
          <Textarea
            id="body_markdown"
            name="body_markdown"
            required
            rows={28}
            className="min-h-[480px]"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="# My Contract …"
          />
          {showPreview && (
            <div className="min-h-[480px] max-h-[600px] overflow-y-auto p-4 rounded-md bg-[var(--surface-2)] border border-[var(--border)]">
              <article className="markdown-body">
                <Markdown source={body || "*(preview will appear here)*"} />
              </article>
            </div>
          )}
        </div>
        <p className="text-[11px] text-[var(--text-4)] mt-1">
          Use <code>{"{placeholder}"}</code> syntax for fill-ins. Tip: replace
          them in the textarea before sending.
        </p>
      </div>

      <div className="flex flex-wrap gap-3 pt-2">
        <PrimaryButton
          type="submit"
          name="submit_action"
          value="send"
          formAction={createAndSendContract}
        >
          Send for signature
        </PrimaryButton>
        <button
          type="submit"
          name="submit_action"
          value="draft"
          className="inline-flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-md bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text-2)] hover:text-[var(--text)] hover:border-[var(--border-2)] transition-colors"
        >
          Save as draft
        </button>
        <a href="/control/contracts">
          <GhostButton type="button">Cancel</GhostButton>
        </a>
      </div>
    </form>
  );
}
