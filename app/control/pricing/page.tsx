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
  getAllPricingTiersAdmin,
  type PricingTierRow,
} from "@/lib/db/content-extra";
import {
  upsertPricingTier,
  deletePricingTier,
} from "@/app/control/actions-extra";

export const metadata: Metadata = { title: "Pricing" };

function PricingForm({ row }: { row?: PricingTierRow }) {
  return (
    <form action={upsertPricingTier} className="space-y-4">
      {row && <input type="hidden" name="id" value={row.id} />}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Name *">
          <Input name="name" required defaultValue={row?.name ?? ""} />
        </Field>
        <Field label="Slug" hint="Auto-generated if empty">
          <Input name="slug" defaultValue={row?.slug ?? ""} />
        </Field>
      </div>
      <Field label="Tagline">
        <Input name="tagline" defaultValue={row?.tagline ?? ""} />
      </Field>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Price label">
          <Input name="price_label" defaultValue={row?.price_label ?? ""} />
        </Field>
        <Field label="Price note">
          <Input name="price_note" defaultValue={row?.price_note ?? ""} />
        </Field>
      </div>
      <Field label="Description">
        <Textarea
          name="description"
          rows={4}
          defaultValue={row?.description ?? ""}
        />
      </Field>
      <Field label="Ideal for">
        <Textarea
          name="ideal_for"
          rows={3}
          defaultValue={row?.ideal_for ?? ""}
        />
      </Field>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Includes" hint="Comma-separated">
          <Textarea
            name="includes"
            rows={4}
            defaultValue={row?.includes?.join(", ") ?? ""}
          />
        </Field>
        <Field label="Not included" hint="Comma-separated">
          <Textarea
            name="not_included"
            rows={4}
            defaultValue={row?.not_included?.join(", ") ?? ""}
          />
        </Field>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Field label="CTA label">
          <Input name="cta" defaultValue={row?.cta ?? ""} />
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
      <div className="flex items-center justify-between gap-2 pt-2">
        <PrimaryButton type="submit">
          {row ? "Save changes" : "Create tier"}
        </PrimaryButton>
        {row && (
          <form action={deletePricingTier}>
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

export default async function PricingAdminPage() {
  const rows = await getAllPricingTiersAdmin();

  return (
    <>
      <PageHeader
        title="Pricing"
        subtitle={`${rows.length} tier${rows.length === 1 ? "" : "s"}`}
      />

      <div className="mb-6">
        <Collapsible
          summary={<span className="font-medium text-[var(--text)]">+ New pricing tier</span>}
        >
          <PricingForm />
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
                      {row.name}
                      {row.price_label && (
                        <span className="ml-3 text-[var(--text-3)] text-xs">
                          {row.price_label}
                        </span>
                      )}
                    </span>
                    <Badge tone={row.published ? "lime" : "default"}>
                      {row.published ? "published" : "draft"}
                    </Badge>
                  </div>
                }
              >
                <PricingForm row={row} />
              </Collapsible>
            </li>
          ))}
        </ul>
      ) : (
        <Card>
          <Empty title="No pricing tiers yet" />
        </Card>
      )}
    </>
  );
}
