import type { Metadata } from "next";
import { Trash2 } from "lucide-react";
import {
  Badge,
  Card,
  Empty,
  Field,
  GhostButton,
  Input,
  PageHeader,
  PrimaryButton,
  Select,
  Textarea,
} from "@/components/admin/ui";
import Collapsible from "@/components/admin/Collapsible";
import {
  getAllFaqsAdmin,
  type FaqRow,
  type FaqCategory,
} from "@/lib/db/content-extra";
import { upsertFaq, deleteFaq } from "@/app/control/actions-extra";

export const metadata: Metadata = { title: "FAQs" };

const CATEGORIES: FaqCategory[] = [
  "engagement",
  "pricing",
  "technical",
  "general",
];

function FaqForm({ row }: { row?: FaqRow }) {
  return (
    <form action={upsertFaq} className="space-y-4">
      {row && <input type="hidden" name="id" value={row.id} />}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Field label="Category *">
          <Select name="category" defaultValue={row?.category ?? "general"}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
        </Field>
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
      <Field label="Question *">
        <Input name="question" required defaultValue={row?.question ?? ""} />
      </Field>
      <Field label="Answer *">
        <Textarea
          name="answer"
          rows={5}
          required
          defaultValue={row?.answer ?? ""}
        />
      </Field>
      <div className="flex items-center justify-between gap-2 pt-2">
        <PrimaryButton type="submit">
          {row ? "Save changes" : "Create FAQ"}
        </PrimaryButton>
        {row && (
          <form action={deleteFaq}>
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

export default async function FaqsAdminPage() {
  const rows = await getAllFaqsAdmin();
  const grouped = CATEGORIES.map((cat) => ({
    category: cat,
    items: rows.filter((r) => r.category === cat),
  }));

  return (
    <>
      <PageHeader
        title="FAQs"
        subtitle={`${rows.length} question${rows.length === 1 ? "" : "s"}`}
      />

      <div className="mb-6">
        <Collapsible
          summary={<span className="font-medium text-[var(--text)]">+ New FAQ</span>}
        >
          <FaqForm />
        </Collapsible>
      </div>

      {rows.length > 0 ? (
        <div className="space-y-8">
          {grouped.map(({ category, items }) =>
            items.length === 0 ? null : (
              <div key={category}>
                <h2 className="text-xs uppercase tracking-widest text-[var(--text-4)] font-medium mb-3">
                  {category}
                </h2>
                <ul className="space-y-3">
                  {items.map((row) => (
                    <li key={row.id}>
                      <Collapsible
                        summary={
                          <div className="flex items-center justify-between gap-3 w-full">
                            <span className="text-sm text-[var(--text)] truncate">
                              <span className="font-mono text-[var(--text-4)] mr-2">
                                #{row.order_index}
                              </span>
                              {row.question}
                            </span>
                            <Badge tone={row.published ? "lime" : "default"}>
                              {row.published ? "published" : "draft"}
                            </Badge>
                          </div>
                        }
                      >
                        <FaqForm row={row} />
                      </Collapsible>
                    </li>
                  ))}
                </ul>
              </div>
            )
          )}
        </div>
      ) : (
        <Card>
          <Empty title="No FAQs yet" />
        </Card>
      )}
    </>
  );
}
