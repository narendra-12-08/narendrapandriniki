import type { Metadata } from "next";
import { Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { upsertCaseStudy, deleteCaseStudy } from "@/app/control/actions";
import {
  Badge,
  Card,
  Empty,
  Field,
  GhostButton,
  Input,
  PageHeader,
  PrimaryButton,
  Textarea,
} from "@/components/admin/ui";
import Collapsible from "@/components/admin/Collapsible";
import type { CaseStudyRow } from "@/lib/types";

export const metadata: Metadata = { title: "Case studies" };

function metricsToString(row?: CaseStudyRow) {
  if (!row?.metrics?.length) return "";
  return row.metrics.map((m) => `${m.label}: ${m.value}`).join(", ");
}

function CaseStudyFormFields({ row }: { row?: CaseStudyRow }) {
  return (
    <form action={upsertCaseStudy} className="space-y-4">
      {row && <input type="hidden" name="id" value={row.id} />}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Title *">
          <Input name="title" required defaultValue={row?.title ?? ""} />
        </Field>
        <Field label="Slug" hint="Auto-generated if empty">
          <Input name="slug" defaultValue={row?.slug ?? ""} />
        </Field>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Client">
          <Input name="client" defaultValue={row?.client ?? ""} />
        </Field>
        <Field label="Industry">
          <Input name="industry" defaultValue={row?.industry ?? ""} />
        </Field>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Duration">
          <Input name="duration" defaultValue={row?.duration ?? ""} />
        </Field>
        <Field label="Team">
          <Input name="team" defaultValue={row?.team ?? ""} />
        </Field>
      </div>
      <Field label="Tags" hint="Comma-separated">
        <Input name="tags" defaultValue={row?.tags?.join(", ") ?? ""} />
      </Field>
      <Field label="Outcome (one-liner)">
        <Input name="outcome" defaultValue={row?.outcome ?? ""} />
      </Field>
      <Field
        label="Metrics"
        hint='Comma-separated "label: value" pairs, e.g. "Uptime: 99.99%, Cost: -42%"'
      >
        <Input name="metrics" defaultValue={metricsToString(row)} />
      </Field>
      <Field label="Problem">
        <Textarea name="problem" rows={4} defaultValue={row?.problem ?? ""} />
      </Field>
      <Field label="Approach" hint="Comma-separated bullet points">
        <Input name="approach" defaultValue={row?.approach?.join(", ") ?? ""} />
      </Field>
      <Field label="Result">
        <Textarea name="result" rows={4} defaultValue={row?.result ?? ""} />
      </Field>
      <Field label="Stack" hint="Comma-separated">
        <Input name="stack" defaultValue={row?.stack?.join(", ") ?? ""} />
      </Field>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Order">
          <Input
            type="number"
            name="order_index"
            defaultValue={row?.order_index ?? 0}
          />
        </Field>
        <Field label="Published">
          <label className="inline-flex items-center gap-2 mt-1">
            <input
              type="checkbox"
              name="published"
              defaultChecked={row?.published ?? true}
              className="h-4 w-4 accent-[var(--accent)]"
            />
            <span className="text-sm text-[var(--text-2)]">Visible on site</span>
          </label>
        </Field>
      </div>
      <div className="flex items-center justify-between gap-2 pt-2">
        <PrimaryButton type="submit">
          {row ? "Save changes" : "Create case study"}
        </PrimaryButton>
        {row && (
          <form action={deleteCaseStudy}>
            <input type="hidden" name="id" value={row.id} />
            <GhostButton
              type="submit"
              className="!text-[var(--rose)] hover:!bg-[var(--rose)]/10 hover:!border-[var(--rose)]/30"
            >
              <Trash2 size={14} /> Delete
            </GhostButton>
          </form>
        )}
      </div>
    </form>
  );
}

export default async function CaseStudiesPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("case_studies")
    .select("*")
    .order("order_index", { ascending: true });
  const rows = (data ?? []) as CaseStudyRow[];

  return (
    <>
      <PageHeader
        title="Case studies"
        subtitle={`${rows.length} case ${rows.length === 1 ? "study" : "studies"}`}
      />

      <div className="mb-6">
        <Collapsible
          summary={<span className="font-medium text-[var(--text)]">+ New case study</span>}
        >
          <CaseStudyFormFields />
        </Collapsible>
      </div>

      {rows.length > 0 ? (
        <ul className="space-y-3">
          {rows.map((row) => (
            <li key={row.id}>
              <Collapsible
                summary={
                  <div className="flex items-center justify-between gap-3 w-full">
                    <span className="text-sm text-[var(--text)] truncate">
                      <span className="font-mono text-[var(--text-4)] mr-2">
                        #{row.order_index}
                      </span>
                      {row.title}
                      {row.client && (
                        <span className="text-[var(--text-3)]">
                          {" "}
                          · {row.client}
                        </span>
                      )}
                    </span>
                    <Badge tone={row.published ? "lime" : "default"}>
                      {row.published ? "published" : "draft"}
                    </Badge>
                  </div>
                }
              >
                <CaseStudyFormFields row={row} />
              </Collapsible>
            </li>
          ))}
        </ul>
      ) : (
        <Card>
          <Empty title="No case studies yet" />
        </Card>
      )}
    </>
  );
}
