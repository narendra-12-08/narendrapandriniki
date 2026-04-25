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
  getAllProcessStepsAdmin,
  type ProcessStepRow,
} from "@/lib/db/content-extra";
import {
  upsertProcessStep,
  deleteProcessStep,
} from "@/app/control/actions-extra";

export const metadata: Metadata = { title: "Process" };

function StepForm({ row }: { row?: ProcessStepRow }) {
  return (
    <form action={upsertProcessStep} className="space-y-4">
      {row && <input type="hidden" name="id" value={row.id} />}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Field label="Step number *">
          <Input
            type="number"
            name="step_number"
            required
            defaultValue={row?.step_number ?? 1}
          />
        </Field>
        <Field label="Duration">
          <Input name="duration" defaultValue={row?.duration ?? ""} />
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
      <Field label="Description">
        <Textarea
          name="description"
          rows={4}
          defaultValue={row?.description ?? ""}
        />
      </Field>
      <Field label="Deliverables" hint="Comma-separated">
        <Textarea
          name="deliverables"
          rows={4}
          defaultValue={row?.deliverables?.join(", ") ?? ""}
        />
      </Field>
      <div className="flex items-center justify-between gap-2 pt-2">
        <PrimaryButton type="submit">
          {row ? "Save changes" : "Create step"}
        </PrimaryButton>
        {row && (
          <form action={deleteProcessStep}>
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

export default async function ProcessAdminPage() {
  const rows = await getAllProcessStepsAdmin();

  return (
    <>
      <PageHeader
        title="Process steps"
        subtitle={`${rows.length} step${rows.length === 1 ? "" : "s"}`}
      />

      <div className="mb-6">
        <Collapsible
          summary={<span className="font-medium text-[var(--text)]">+ New step</span>}
        >
          <StepForm />
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
                        {String(row.step_number).padStart(2, "0")}
                      </span>
                      {row.title}
                      {row.duration && (
                        <span className="ml-3 text-[var(--text-3)] text-xs">
                          {row.duration}
                        </span>
                      )}
                    </span>
                  </div>
                }
              >
                <StepForm row={row} />
              </Collapsible>
            </li>
          ))}
        </ul>
      ) : (
        <Card>
          <Empty title="No process steps yet" />
        </Card>
      )}
    </>
  );
}
