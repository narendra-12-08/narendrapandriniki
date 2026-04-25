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
} from "@/components/admin/ui";
import Collapsible from "@/components/admin/Collapsible";
import {
  getAllCertificationsAdmin,
  type CertificationRow,
} from "@/lib/db/content-extra";
import {
  upsertCertification,
  deleteCertification,
} from "@/app/control/actions-extra";

export const metadata: Metadata = { title: "Certifications" };

function CertForm({ row }: { row?: CertificationRow }) {
  return (
    <form action={upsertCertification} className="space-y-4">
      {row && <input type="hidden" name="id" value={row.id} />}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Name *">
          <Input name="name" required defaultValue={row?.name ?? ""} />
        </Field>
        <Field label="Issuer *">
          <Input name="issuer" required defaultValue={row?.issuer ?? ""} />
        </Field>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Field label="Year">
          <Input
            type="number"
            name="year"
            defaultValue={row?.year ?? ""}
          />
        </Field>
        <Field label="Status">
          <Select name="status" defaultValue={row?.status ?? "active"}>
            <option value="active">active</option>
            <option value="expired">expired</option>
          </Select>
        </Field>
        <Field label="Order">
          <Input
            type="number"
            name="order_index"
            defaultValue={row?.order_index ?? 0}
          />
        </Field>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Credential ID">
          <Input
            name="credential_id"
            defaultValue={row?.credential_id ?? ""}
          />
        </Field>
        <Field label="URL">
          <Input name="url" defaultValue={row?.url ?? ""} />
        </Field>
      </div>
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
      <div className="flex items-center justify-between gap-2 pt-2">
        <PrimaryButton type="submit">
          {row ? "Save changes" : "Create certification"}
        </PrimaryButton>
        {row && (
          <form action={deleteCertification}>
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

export default async function CertificationsAdminPage() {
  const rows = await getAllCertificationsAdmin();

  return (
    <>
      <PageHeader
        title="Certifications"
        subtitle={`${rows.length} certification${rows.length === 1 ? "" : "s"}`}
      />

      <div className="mb-6">
        <Collapsible
          summary={<span className="font-medium text-[var(--text)]">+ New certification</span>}
        >
          <CertForm />
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
                        {row.year ?? "—"}
                      </span>
                      {row.name}
                      <span className="ml-3 text-[var(--text-3)] text-xs">
                        {row.issuer}
                      </span>
                    </span>
                    <div className="flex items-center gap-2">
                      <Badge tone={row.status === "active" ? "lime" : "default"}>
                        {row.status}
                      </Badge>
                      <Badge tone={row.published ? "accent" : "default"}>
                        {row.published ? "published" : "draft"}
                      </Badge>
                    </div>
                  </div>
                }
              >
                <CertForm row={row} />
              </Collapsible>
            </li>
          ))}
        </ul>
      ) : (
        <Card>
          <Empty title="No certifications yet" />
        </Card>
      )}
    </>
  );
}
