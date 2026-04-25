import type { Metadata } from "next";
import { Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { upsertTestimonial, deleteTestimonial } from "@/app/control/actions";
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
import type { TestimonialRow } from "@/lib/types";

export const metadata: Metadata = { title: "Testimonials" };

function TestimonialFormFields({ row }: { row?: TestimonialRow }) {
  return (
    <form action={upsertTestimonial} className="space-y-4">
      {row && <input type="hidden" name="id" value={row.id} />}
      <Field label="Quote *">
        <Textarea name="quote" rows={4} required defaultValue={row?.quote ?? ""} />
      </Field>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Author *">
          <Input name="author" required defaultValue={row?.author ?? ""} />
        </Field>
        <Field label="Role">
          <Input name="role" defaultValue={row?.role ?? ""} />
        </Field>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Company">
          <Input name="company" defaultValue={row?.company ?? ""} />
        </Field>
        <Field label="Industry">
          <Input name="industry" defaultValue={row?.industry ?? ""} />
        </Field>
      </div>
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
          {row ? "Save changes" : "Create testimonial"}
        </PrimaryButton>
        {row && (
          <form action={deleteTestimonial}>
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

export default async function TestimonialsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("testimonials")
    .select("*")
    .order("order_index", { ascending: true });
  const rows = (data ?? []) as TestimonialRow[];

  return (
    <>
      <PageHeader
        title="Testimonials"
        subtitle={`${rows.length} testimonial${rows.length === 1 ? "" : "s"}`}
      />

      <div className="mb-6">
        <Collapsible
          summary={<span className="font-medium text-[var(--text)]">+ New testimonial</span>}
        >
          <TestimonialFormFields />
        </Collapsible>
      </div>

      {rows.length > 0 ? (
        <ul className="space-y-3">
          {rows.map((row) => (
            <li key={row.id}>
              <Collapsible
                summary={
                  <div className="flex items-center justify-between gap-3 w-full">
                    <span className="text-sm text-[var(--text)] truncate italic">
                      &ldquo;{row.quote.slice(0, 80)}
                      {row.quote.length > 80 ? "…" : ""}&rdquo; — {row.author}
                    </span>
                    <Badge tone={row.published ? "lime" : "default"}>
                      {row.published ? "published" : "draft"}
                    </Badge>
                  </div>
                }
              >
                <TestimonialFormFields row={row} />
              </Collapsible>
            </li>
          ))}
        </ul>
      ) : (
        <Card>
          <Empty title="No testimonials yet" />
        </Card>
      )}
    </>
  );
}
