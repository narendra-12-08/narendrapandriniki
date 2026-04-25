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
  Textarea,
} from "@/components/admin/ui";
import Collapsible from "@/components/admin/Collapsible";
import {
  getAllPrinciplesAdmin,
  type PrincipleRow,
} from "@/lib/db/content-extra";
import { upsertPrinciple, deletePrinciple } from "@/app/control/actions-extra";

export const metadata: Metadata = { title: "Principles" };

function PrincipleForm({ row }: { row?: PrincipleRow }) {
  return (
    <form action={upsertPrinciple} className="space-y-4">
      {row && <input type="hidden" name="id" value={row.id} />}
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
          {row ? "Save changes" : "Create principle"}
        </PrimaryButton>
        {row && (
          <form action={deletePrinciple}>
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

export default async function PrinciplesAdminPage() {
  const rows = await getAllPrinciplesAdmin();

  return (
    <>
      <PageHeader
        title="Principles"
        subtitle={`${rows.length} principle${rows.length === 1 ? "" : "s"}`}
      />

      <div className="mb-6">
        <Collapsible
          summary={<span className="font-medium text-[var(--text)]">+ New principle</span>}
        >
          <PrincipleForm />
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
                <PrincipleForm row={row} />
              </Collapsible>
            </li>
          ))}
        </ul>
      ) : (
        <Card>
          <Empty title="No principles yet" />
        </Card>
      )}
    </>
  );
}
