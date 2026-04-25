import type { Metadata } from "next";
import { Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import {
  upsertTechnologyCategory,
  deleteTechnologyCategory,
  upsertTechnologyItem,
  deleteTechnologyItem,
} from "@/app/control/actions";
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
} from "@/components/admin/ui";
import Collapsible from "@/components/admin/Collapsible";
import type { TechnologyCategoryRow, TechnologyItemRow } from "@/lib/types";

export const metadata: Metadata = { title: "Technology" };

function CategoryForm({ row }: { row?: TechnologyCategoryRow }) {
  return (
    <form action={upsertTechnologyCategory} className="space-y-3">
      {row && <input type="hidden" name="id" value={row.id} />}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Field label="Name *">
          <Input name="name" required defaultValue={row?.name ?? ""} />
        </Field>
        <Field label="Slug" hint="Auto if empty">
          <Input name="slug" defaultValue={row?.slug ?? ""} />
        </Field>
        <Field label="Order">
          <Input
            type="number"
            name="order_index"
            defaultValue={row?.order_index ?? 0}
          />
        </Field>
      </div>
      <Field label="Description">
        <Input name="description" defaultValue={row?.description ?? ""} />
      </Field>
      <div className="flex items-center justify-between gap-2">
        <PrimaryButton type="submit">
          {row ? "Save category" : "Create category"}
        </PrimaryButton>
        {row && (
          <form action={deleteTechnologyCategory}>
            <input type="hidden" name="id" value={row.id} />
            <GhostButton
              type="submit"
              className="!text-[var(--rose)] hover:!bg-[var(--rose)]/10 hover:!border-[var(--rose)]/30"
            >
              <Trash2 size={14} /> Delete category
            </GhostButton>
          </form>
        )}
      </div>
    </form>
  );
}

function ItemForm({
  categoryId,
  item,
}: {
  categoryId: string;
  item?: TechnologyItemRow;
}) {
  return (
    <form
      action={upsertTechnologyItem}
      className="grid grid-cols-1 md:grid-cols-12 gap-2 items-end"
    >
      {item && <input type="hidden" name="id" value={item.id} />}
      <input type="hidden" name="category_id" value={categoryId} />
      <div className="md:col-span-3">
        <Field label="Name *">
          <Input name="name" required defaultValue={item?.name ?? ""} />
        </Field>
      </div>
      <div className="md:col-span-2">
        <Field label="Role">
          <Select name="role" defaultValue={item?.role ?? "core"}>
            <option value="core">Core</option>
            <option value="fluent">Fluent</option>
            <option value="familiar">Familiar</option>
          </Select>
        </Field>
      </div>
      <div className="md:col-span-4">
        <Field label="Note">
          <Input name="note" defaultValue={item?.note ?? ""} />
        </Field>
      </div>
      <div className="md:col-span-1">
        <Field label="Order">
          <Input
            type="number"
            name="order_index"
            defaultValue={item?.order_index ?? 0}
          />
        </Field>
      </div>
      <div className="md:col-span-2 flex gap-2">
        <PrimaryButton type="submit" className="flex-1">
          {item ? "Save" : "Add"}
        </PrimaryButton>
        {item && (
          <form action={deleteTechnologyItem}>
            <input type="hidden" name="id" value={item.id} />
            <GhostButton
              type="submit"
              className="!text-[var(--rose)] hover:!bg-[var(--rose)]/10 hover:!border-[var(--rose)]/30"
              aria-label="Delete item"
            >
              <Trash2 size={14} />
            </GhostButton>
          </form>
        )}
      </div>
    </form>
  );
}

export default async function TechnologyPage() {
  const supabase = await createClient();
  const [{ data: categories }, { data: items }] = await Promise.all([
    supabase
      .from("technology_categories")
      .select("*")
      .order("order_index", { ascending: true }),
    supabase
      .from("technology_items")
      .select("*")
      .order("order_index", { ascending: true }),
  ]);

  const cats = (categories ?? []) as TechnologyCategoryRow[];
  const allItems = (items ?? []) as TechnologyItemRow[];

  return (
    <>
      <PageHeader
        title="Technology"
        subtitle={`${cats.length} categor${
          cats.length === 1 ? "y" : "ies"
        } · ${allItems.length} items`}
      />

      <div className="mb-6">
        <Collapsible
          summary={<span className="font-medium text-[var(--text)]">+ New category</span>}
        >
          <CategoryForm />
        </Collapsible>
      </div>

      {cats.length > 0 ? (
        <ul className="space-y-3">
          {cats.map((cat) => {
            const catItems = allItems.filter((i) => i.category_id === cat.id);
            return (
              <li key={cat.id}>
                <Collapsible
                  summary={
                    <div className="flex items-center justify-between gap-3 w-full">
                      <span className="text-sm text-[var(--text)] truncate">
                        <span className="font-mono text-[var(--text-4)] mr-2">
                          #{cat.order_index}
                        </span>
                        {cat.name}
                      </span>
                      <Badge tone="violet">{catItems.length} items</Badge>
                    </div>
                  }
                >
                  <div className="space-y-5">
                    <CategoryForm row={cat} />

                    <div>
                      <h3 className="text-xs font-semibold uppercase tracking-widest text-[var(--text-4)] mb-3">
                        Items
                      </h3>
                      <Card className="p-3 mb-3">
                        <ItemForm categoryId={cat.id} />
                      </Card>
                      {catItems.length > 0 ? (
                        <ul className="space-y-2">
                          {catItems.map((item) => (
                            <li
                              key={item.id}
                              className="bg-[var(--surface-2)] border border-[var(--border)] rounded-md p-3"
                            >
                              <ItemForm categoryId={cat.id} item={item} />
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-xs text-[var(--text-4)]">
                          No items in this category yet.
                        </p>
                      )}
                    </div>
                  </div>
                </Collapsible>
              </li>
            );
          })}
        </ul>
      ) : (
        <Card>
          <Empty title="No categories yet" />
        </Card>
      )}
    </>
  );
}
