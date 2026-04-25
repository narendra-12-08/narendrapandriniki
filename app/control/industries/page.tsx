import type { Metadata } from "next";
import { Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { upsertIndustry, deleteIndustry } from "@/app/control/actions";
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
import type { IndustryRow } from "@/lib/types";

export const metadata: Metadata = { title: "Industries" };

function IndustryFormFields({ row }: { row?: IndustryRow }) {
  return (
    <form action={upsertIndustry} className="space-y-4">
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
      <Field label="Pain points" hint="Comma-separated">
        <Input
          name="pain_points"
          defaultValue={row?.pain_points?.join(", ") ?? ""}
        />
      </Field>
      <Field label="How I help">
        <Textarea
          name="how_i_help"
          rows={4}
          defaultValue={row?.how_i_help ?? ""}
        />
      </Field>
      <Field label="Common stack" hint="Comma-separated">
        <Input
          name="common_stack"
          defaultValue={row?.common_stack?.join(", ") ?? ""}
        />
      </Field>
      <Field label="Typical engagement">
        <Input
          name="typical_engagement"
          defaultValue={row?.typical_engagement ?? ""}
        />
      </Field>
      <Field label="Content (markdown)">
        <Textarea name="content" rows={6} defaultValue={row?.content ?? ""} />
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
          {row ? "Save changes" : "Create industry"}
        </PrimaryButton>
        {row && (
          <form action={deleteIndustry}>
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

export default async function IndustriesPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("industries")
    .select("*")
    .order("order_index", { ascending: true });
  const rows = (data ?? []) as IndustryRow[];

  return (
    <>
      <PageHeader
        title="Industries"
        subtitle={`${rows.length} industr${rows.length === 1 ? "y" : "ies"}`}
      />

      <div className="mb-6">
        <Collapsible
          summary={<span className="font-medium text-[var(--text)]">+ New industry</span>}
        >
          <IndustryFormFields />
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
                <IndustryFormFields row={row} />
              </Collapsible>
            </li>
          ))}
        </ul>
      ) : (
        <Card>
          <Empty title="No industries yet" />
        </Card>
      )}
    </>
  );
}
