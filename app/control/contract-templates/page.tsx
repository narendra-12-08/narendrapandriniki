import type { Metadata } from "next";
import {
  Card,
  Field,
  GhostButton,
  Input,
  PageHeader,
  PrimaryButton,
  Select,
  Textarea,
  Empty,
  DangerButton,
} from "@/components/admin/ui";
import { listTemplates } from "@/lib/db/contracts";
import {
  upsertContractTemplate,
  deleteContractTemplate,
} from "@/app/control/actions-contracts";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Contract templates" };

const CATEGORIES = ["general", "msa", "sow", "nda", "retainer"];

export default async function ContractTemplatesPage() {
  const templates = await listTemplates();

  return (
    <div className="space-y-8">
      <PageHeader
        title="Contract templates"
        subtitle="Reusable contract bodies. Use {placeholders} for fields you'll fill when sending."
      />

      <Card className="p-6">
        <h2 className="text-sm font-mono uppercase tracking-[0.16em] text-[var(--text-4)] mb-4">
          New template
        </h2>
        <form action={upsertContractTemplate} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Slug" htmlFor="t-slug" hint="URL-safe id, e.g. 'mutual-nda'">
              <Input id="t-slug" name="slug" required placeholder="my-template" />
            </Field>
            <Field label="Name" htmlFor="t-name">
              <Input id="t-name" name="name" required placeholder="Template name" />
            </Field>
          </div>
          <Field label="Category" htmlFor="t-category">
            <Select id="t-category" name="category" defaultValue="general">
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>
          </Field>
          <Field
            label="Body (markdown)"
            htmlFor="t-body"
            hint="Use {placeholder} for fillable fields. They become inputs when you create a contract from this template."
          >
            <Textarea id="t-body" name="body" required rows={14} placeholder="# Title&#10;&#10;This is a contract between {sender_name} and {client_name}…" />
          </Field>
          <div className="pt-2">
            <PrimaryButton type="submit">Save template</PrimaryButton>
          </div>
        </form>
      </Card>

      <div>
        <h2 className="text-sm font-mono uppercase tracking-[0.16em] text-[var(--text-4)] mb-4">
          Existing templates ({templates.length})
        </h2>
        {templates.length === 0 ? (
          <Empty
            title="No templates yet"
            hint="Create your first reusable contract template above."
          />
        ) : (
          <div className="space-y-4">
            {templates.map((t) => (
              <Card key={t.id} className="p-6">
                <details>
                  <summary className="cursor-pointer flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="text-base font-semibold text-[var(--text)]">
                        {t.name}
                      </div>
                      <div className="text-xs font-mono text-[var(--text-3)] mt-0.5">
                        {t.slug} · {t.category}
                      </div>
                    </div>
                    <span className="text-xs text-[var(--text-3)]">Edit</span>
                  </summary>

                  <form
                    action={upsertContractTemplate}
                    className="mt-5 pt-5 border-t border-[var(--border)] space-y-4"
                  >
                    <input type="hidden" name="id" value={t.id} />
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Field label="Slug" htmlFor={`slug-${t.id}`}>
                        <Input
                          id={`slug-${t.id}`}
                          name="slug"
                          required
                          defaultValue={t.slug}
                        />
                      </Field>
                      <Field label="Name" htmlFor={`name-${t.id}`}>
                        <Input
                          id={`name-${t.id}`}
                          name="name"
                          required
                          defaultValue={t.name}
                        />
                      </Field>
                    </div>
                    <Field label="Category" htmlFor={`cat-${t.id}`}>
                      <Select
                        id={`cat-${t.id}`}
                        name="category"
                        defaultValue={t.category ?? "general"}
                      >
                        {CATEGORIES.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </Select>
                    </Field>
                    <Field label="Body" htmlFor={`body-${t.id}`}>
                      <Textarea
                        id={`body-${t.id}`}
                        name="body"
                        required
                        rows={14}
                        defaultValue={t.body}
                      />
                    </Field>
                    <div className="flex items-center justify-between pt-2">
                      <PrimaryButton type="submit">Update</PrimaryButton>
                    </div>
                  </form>

                  <form
                    action={deleteContractTemplate}
                    className="mt-3 pt-3 border-t border-[var(--border)]"
                  >
                    <input type="hidden" name="id" value={t.id} />
                    <DangerButton type="submit">Delete template</DangerButton>
                  </form>
                </details>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
