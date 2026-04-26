import type { Metadata } from "next";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import {
  Badge,
  Card,
  Empty,
  Field,
  Input,
  PageHeader,
  PrimaryButton,
  DangerButton,
  Select,
  Textarea,
} from "@/components/admin/ui";

export const metadata: Metadata = { title: "Email templates" };

type Template = {
  id: string;
  slug: string;
  name: string;
  subject: string;
  body_text: string;
  category: string | null;
  variables: { key: string; label?: string }[];
  updated_at: string;
};

function parseVariables(input: string): { key: string; label: string }[] {
  return input
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((k) => ({ key: k, label: k.replace(/_/g, " ") }));
}

async function createTemplate(formData: FormData): Promise<void> {
  "use server";
  const slug = (formData.get("slug") ?? "").toString().trim();
  const name = (formData.get("name") ?? "").toString().trim();
  const subject = (formData.get("subject") ?? "").toString().trim();
  const body_text = (formData.get("body_text") ?? "").toString();
  const category = (formData.get("category") ?? "general").toString().trim() || "general";
  const variables = parseVariables((formData.get("variables") ?? "").toString());
  if (!slug || !name || !subject || !body_text) return;
  const supabase = await createClient();
  await supabase
    .from("email_templates")
    .insert({ slug, name, subject, body_text, category, variables });
  revalidatePath("/control/email-templates");
  revalidatePath("/control/email");
}

async function updateTemplate(formData: FormData): Promise<void> {
  "use server";
  const id = (formData.get("id") ?? "").toString();
  const slug = (formData.get("slug") ?? "").toString().trim();
  const name = (formData.get("name") ?? "").toString().trim();
  const subject = (formData.get("subject") ?? "").toString().trim();
  const body_text = (formData.get("body_text") ?? "").toString();
  const category = (formData.get("category") ?? "general").toString().trim() || "general";
  const variables = parseVariables((formData.get("variables") ?? "").toString());
  if (!id) return;
  const supabase = await createClient();
  await supabase
    .from("email_templates")
    .update({ slug, name, subject, body_text, category, variables })
    .eq("id", id);
  revalidatePath("/control/email-templates");
  revalidatePath("/control/email");
}

async function deleteTemplate(formData: FormData): Promise<void> {
  "use server";
  const id = (formData.get("id") ?? "").toString();
  const supabase = await createClient();
  await supabase.from("email_templates").delete().eq("id", id);
  revalidatePath("/control/email-templates");
  revalidatePath("/control/email");
}

export default async function EmailTemplatesAdmin() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("email_templates")
    .select("id, slug, name, subject, body_text, category, variables, updated_at")
    .order("name", { ascending: true });
  const templates = (data ?? []) as Template[];

  const categories = ["general", "lead", "sales", "project", "billing"];

  return (
    <div>
      <PageHeader
        title="Email templates"
        subtitle="Reusable bodies for the compose-email flow."
      />

      <Card className="p-6 mb-8">
        <h2 className="text-base font-semibold text-[var(--text)] mb-4">
          New template
        </h2>
        <form action={createTemplate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Slug" htmlFor="slug">
            <Input id="slug" name="slug" placeholder="e.g. welcome-after-chat" required />
          </Field>
          <Field label="Name" htmlFor="name">
            <Input id="name" name="name" placeholder="Display name" required />
          </Field>
          <Field label="Category" htmlFor="category">
            <Select id="category" name="category" defaultValue="general">
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Variables (comma-separated)" htmlFor="variables" hint="e.g. first_name, project_name, due_date">
            <Input id="variables" name="variables" placeholder="first_name, project_name" />
          </Field>
          <div className="md:col-span-2">
            <Field label="Subject" htmlFor="subject">
              <Input id="subject" name="subject" required />
            </Field>
          </div>
          <div className="md:col-span-2">
            <Field label="Body (plain text)" htmlFor="body_text">
              <Textarea id="body_text" name="body_text" rows={8} required />
            </Field>
          </div>
          <div className="md:col-span-2">
            <PrimaryButton type="submit">Create template</PrimaryButton>
          </div>
        </form>
      </Card>

      <Card>
        {templates.length === 0 ? (
          <Empty title="No templates yet" hint="Create one above." />
        ) : (
          <div className="divide-y divide-[var(--border)]">
            {templates.map((t) => (
              <div key={t.id} className="p-5">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                  <div>
                    <p className="text-base font-semibold text-[var(--text)]">
                      {t.name}{" "}
                      <Badge tone="default">{t.category ?? "general"}</Badge>
                    </p>
                    <p className="text-xs font-mono text-[var(--text-4)]">{t.slug}</p>
                  </div>
                </div>
                <form action={updateTemplate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input type="hidden" name="id" value={t.id} />
                  <Field label="Slug">
                    <Input name="slug" defaultValue={t.slug} required />
                  </Field>
                  <Field label="Name">
                    <Input name="name" defaultValue={t.name} required />
                  </Field>
                  <Field label="Category">
                    <Select name="category" defaultValue={t.category ?? "general"}>
                      {categories.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </Select>
                  </Field>
                  <Field label="Variables (comma-separated)">
                    <Input
                      name="variables"
                      defaultValue={(t.variables ?? [])
                        .map((v) => v.key)
                        .join(", ")}
                    />
                  </Field>
                  <div className="md:col-span-2">
                    <Field label="Subject">
                      <Input name="subject" defaultValue={t.subject} required />
                    </Field>
                  </div>
                  <div className="md:col-span-2">
                    <Field label="Body (plain text)">
                      <Textarea
                        name="body_text"
                        rows={10}
                        defaultValue={t.body_text}
                        required
                      />
                    </Field>
                  </div>
                  <div className="md:col-span-2 flex items-center gap-2">
                    <PrimaryButton type="submit">Save</PrimaryButton>
                    <a
                      href={`/control/email?templateId=${t.id}`}
                      className="inline-flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-md bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text-2)] hover:text-[var(--text)]"
                    >
                      Use in composer
                    </a>
                  </div>
                </form>
                <form action={deleteTemplate} className="mt-3">
                  <input type="hidden" name="id" value={t.id} />
                  <DangerButton type="submit">Delete template</DangerButton>
                </form>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
