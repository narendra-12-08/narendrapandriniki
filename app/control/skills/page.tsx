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
  Select,
  Textarea,
} from "@/components/admin/ui";
import Collapsible from "@/components/admin/Collapsible";
import {
  getAllSkillGroupsAdmin,
  type SkillGroupRow,
  type SkillItemRow,
} from "@/lib/db/content-extra";
import {
  upsertSkillGroup,
  deleteSkillGroup,
  upsertSkillItem,
  deleteSkillItem,
} from "@/app/control/actions-extra";

export const metadata: Metadata = { title: "Skills" };

function GroupForm({ row }: { row?: SkillGroupRow }) {
  return (
    <form action={upsertSkillGroup} className="space-y-4">
      {row && <input type="hidden" name="id" value={row.id} />}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Name *">
          <Input name="name" required defaultValue={row?.name ?? ""} />
        </Field>
        <Field label="Slug" hint="Auto-generated if empty">
          <Input name="slug" defaultValue={row?.slug ?? ""} />
        </Field>
      </div>
      <Field label="Description / tagline">
        <Textarea
          name="description"
          rows={2}
          defaultValue={row?.description ?? ""}
        />
      </Field>
      <Field label="Order">
        <Input
          type="number"
          name="order_index"
          defaultValue={row?.order_index ?? 0}
        />
      </Field>
      <div className="flex items-center justify-between gap-2 pt-2">
        <PrimaryButton type="submit">
          {row ? "Save group" : "Create group"}
        </PrimaryButton>
        {row && (
          <form action={deleteSkillGroup}>
            <input type="hidden" name="id" value={row.id} />
            <GhostButton
              type="submit"
              className="!text-[var(--rose)] hover:!bg-[var(--rose)]/10 hover:!border-[var(--rose)]/30"
            >
              <Trash2 size={14} /> Delete group
            </GhostButton>
          </form>
        )}
      </div>
    </form>
  );
}

function ItemForm({
  groupId,
  row,
}: {
  groupId: string;
  row?: SkillItemRow;
}) {
  return (
    <form action={upsertSkillItem} className="space-y-3">
      {row && <input type="hidden" name="id" value={row.id} />}
      <input type="hidden" name="group_id" value={groupId} />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <Field label="Name *">
          <Input name="name" required defaultValue={row?.name ?? ""} />
        </Field>
        <Field label="Level (1–5) *">
          <Select name="level" defaultValue={String(row?.level ?? 3)}>
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Years">
          <Input
            type="number"
            name="years"
            defaultValue={row?.years ?? 0}
          />
        </Field>
        <Field label="Order">
          <Input
            type="number"
            name="order_index"
            defaultValue={row?.order_index ?? 0}
          />
        </Field>
      </div>
      <Field label="Note">
        <Input name="note" defaultValue={row?.note ?? ""} />
      </Field>
      <div className="flex items-center gap-2">
        <PrimaryButton type="submit">
          {row ? "Save" : "Add skill"}
        </PrimaryButton>
        {row && (
          <form action={deleteSkillItem}>
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

export default async function SkillsAdminPage() {
  const groups = await getAllSkillGroupsAdmin();

  return (
    <>
      <PageHeader
        title="Skills"
        subtitle={`${groups.length} group${groups.length === 1 ? "" : "s"}`}
      />

      <div className="mb-6">
        <Collapsible
          summary={<span className="font-medium text-[var(--text)]">+ New skill group</span>}
        >
          <GroupForm />
        </Collapsible>
      </div>

      {groups.length > 0 ? (
        <ul className="space-y-3">
          {groups.map((group) => (
            <li key={group.id}>
              <Collapsible
                summary={
                  <div className="flex items-center justify-between gap-3 w-full">
                    <span className="text-sm text-[var(--text)] truncate">
                      <span className="font-mono text-[var(--text-4)] mr-2">
                        #{group.order_index}
                      </span>
                      {group.name}
                      <span className="ml-3 text-[var(--text-3)] text-xs">
                        {group.items.length} skill
                        {group.items.length === 1 ? "" : "s"}
                      </span>
                    </span>
                  </div>
                }
              >
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xs uppercase tracking-widest text-[var(--text-4)] font-medium mb-3">
                      Group details
                    </h3>
                    <GroupForm row={group} />
                  </div>

                  <div>
                    <h3 className="text-xs uppercase tracking-widest text-[var(--text-4)] font-medium mb-3">
                      Skills in this group
                    </h3>
                    <div className="space-y-3">
                      {group.items.map((item) => (
                        <Collapsible
                          key={item.id}
                          summary={
                            <div className="flex items-center justify-between gap-3 w-full">
                              <span className="text-sm text-[var(--text)] truncate">
                                {item.name}
                              </span>
                              <span className="font-mono text-xs text-[var(--text-3)]">
                                L{item.level} · {item.years}y
                              </span>
                            </div>
                          }
                        >
                          <ItemForm groupId={group.id} row={item} />
                        </Collapsible>
                      ))}
                      <Collapsible
                        summary={
                          <span className="text-sm text-[var(--text-3)]">
                            + Add skill to this group
                          </span>
                        }
                      >
                        <ItemForm groupId={group.id} />
                      </Collapsible>
                    </div>
                  </div>
                </div>
              </Collapsible>
            </li>
          ))}
        </ul>
      ) : (
        <Card>
          <Empty title="No skill groups yet" />
        </Card>
      )}
    </>
  );
}
