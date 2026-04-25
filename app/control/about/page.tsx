import type { Metadata } from "next";
import { saveAboutContent } from "@/app/control/actions-extra";
import { getBioParagraphs, getAvailabilityText } from "@/lib/db/content-extra";
import {
  Card,
  Field,
  PageHeader,
  PrimaryButton,
  Textarea,
} from "@/components/admin/ui";

export const metadata: Metadata = { title: "About content" };

export default async function AboutAdminPage() {
  const [paragraphs, availability] = await Promise.all([
    getBioParagraphs(),
    getAvailabilityText(),
  ]);

  // Always render at least one empty paragraph slot for adding new content.
  const slots = paragraphs.length > 0 ? paragraphs : [""];

  return (
    <>
      <PageHeader
        title="About"
        subtitle="Bio paragraphs and availability text shown on /about"
      />

      <form action={saveAboutContent}>
        <Card className="p-6 space-y-5">
          <div>
            <label className="block text-xs font-medium text-[var(--text-2)] mb-1.5">
              Bio paragraphs
            </label>
            <p className="text-[11px] text-[var(--text-4)] mb-3">
              Each textarea is one paragraph. Leave a textarea empty to remove
              it. Add a new one by filling the bottom slot.
            </p>
            <div className="space-y-3">
              {slots.map((p, i) => (
                <Textarea
                  key={i}
                  name="bio_paragraph"
                  rows={4}
                  defaultValue={p}
                  placeholder={`Paragraph ${i + 1}`}
                />
              ))}
              <Textarea
                name="bio_paragraph"
                rows={4}
                placeholder="New paragraph (optional)"
              />
            </div>
          </div>

          <Field label="Availability text" hint="Shown in the availability card on /about">
            <Textarea
              name="availability_text"
              rows={6}
              defaultValue={availability}
            />
          </Field>

          <div>
            <PrimaryButton type="submit">Save changes</PrimaryButton>
          </div>
        </Card>
      </form>
    </>
  );
}
