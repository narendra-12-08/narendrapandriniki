import type { Metadata } from "next";
import { Trash2 } from "lucide-react";
import {
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
import {
  getAllTimelineAdmin,
  type TimelineEntryRow,
} from "@/lib/db/content-extra";
import {
  upsertTimelineEntry,
  deleteTimelineEntry,
} from "@/app/control/actions-extra";

export const metadata: Metadata = { title: "Timeline" };

function TimelineForm({ row }: { row?: TimelineEntryRow }) {
  return (
    <form action={upsertTimelineEntry} className="space-y-4">
      {row && <input type="hidden" name="id" value={row.id} />}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Year *">
          <Input name="year" required defaultValue={row?.year ?? ""} />
        </Field>
        <Field label="Order">
          <Input
            type="number"
            name="order_index"
            defaultValue={row?.order_index ?? 0}
          />
        </Field>
      </div>
      <Field label="Title *">
        <Input name="title" required defaultValue={row?.title ?? ""} />
      </Field>
      <Field label="Description *">
        <Textarea
          name="description"
          rows={4}
          required
          defaultValue={row?.description ?? ""}
        />
      </Field>
      <div className="flex items-center justify-between gap-2 pt-2">
        <PrimaryButton type="submit">
          {row ? "Save changes" : "Create entry"}
        </PrimaryButton>
        {row && (
          <form action={deleteTimelineEntry}>
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

export default async function TimelineAdminPage() {
  const rows = await getAllTimelineAdmin();

  return (
    <>
      <PageHeader
        title="Timeline"
        subtitle={`${rows.length} entr${rows.length === 1 ? "y" : "ies"}`}
      />

      <div className="mb-6">
        <Collapsible
          summary={<span className="font-medium text-[var(--text)]">+ New entry</span>}
        >
          <TimelineForm />
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
                      <span className="font-mono text-[var(--accent)] mr-2">
                        {row.year}
                      </span>
                      {row.title}
                    </span>
                    <span className="font-mono text-[var(--text-4)] text-xs">
                      #{row.order_index}
                    </span>
                  </div>
                }
              >
                <TimelineForm row={row} />
              </Collapsible>
            </li>
          ))}
        </ul>
      ) : (
        <Card>
          <Empty title="No timeline entries yet" />
        </Card>
      )}
    </>
  );
}
