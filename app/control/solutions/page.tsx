import type { Metadata } from "next";
import { Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { upsertSolution, deleteSolution } from "@/app/control/actions";
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
import type { SolutionRow } from "@/lib/types";

export const metadata: Metadata = { title: "Solutions" };

function SolutionFormFields({ row }: { row?: SolutionRow }) {
  return (
    <form action={upsertSolution} className="space-y-4">
      {row && <input type="hidden" name="id" value={row.id} />}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Title *">
          <Input name="title" required defaultValue={row?.title ?? ""} />
        </Field>
        <Field label="Slug" hint="Auto-generated if empty">
          <Input name="slug" defaultValue={row?.slug ?? ""} />
        </Field>
      </div>
      <Field label="Tagline">
        <Input name="tagline" defaultValue={row?.tagline ?? ""} />
      </Field>
      <Field label="Short description">
        <Input
          name="short_description"
          defaultValue={row?.short_description ?? ""}
        />
      </Field>
      <Field label="Outcomes" hint="Comma-separated">
        <Input name="outcomes" defaultValue={row?.outcomes?.join(", ") ?? ""} />
      </Field>
      <Field label="Content (markdown)">
        <Textarea name="content" rows={8} defaultValue={row?.content ?? ""} />
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
          {row ? "Save changes" : "Create solution"}
        </PrimaryButton>
        {row && (
          <form action={deleteSolution}>
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

export default async function SolutionsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("solutions")
    .select("*")
    .order("order_index", { ascending: true });
  const rows = (data ?? []) as SolutionRow[];

  return (
    <>
      <PageHeader
        title="Solutions"
        subtitle={`${rows.length} solution${rows.length === 1 ? "" : "s"}`}
      />

      <div className="mb-6">
        <Collapsible
          summary={<span className="font-medium text-[var(--text)]">+ New solution</span>}
        >
          <SolutionFormFields />
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
                    </span>
                    <Badge tone={row.published ? "lime" : "default"}>
                      {row.published ? "published" : "draft"}
                    </Badge>
                  </div>
                }
              >
                <SolutionFormFields row={row} />
              </Collapsible>
            </li>
          ))}
        </ul>
      ) : (
        <Card>
          <Empty title="No solutions yet" />
        </Card>
      )}
    </>
  );
}
