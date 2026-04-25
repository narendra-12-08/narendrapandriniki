import type { Metadata } from "next";
import { Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { upsertSiteSetting, deleteSiteSetting } from "@/app/control/actions";
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

export const metadata: Metadata = { title: "Settings" };

interface SettingRow {
  id: string;
  key: string;
  value: string;
  updated_at: string;
}

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data } = await supabase
    .from("site_settings")
    .select("*")
    .order("key", { ascending: true });

  const settings = (data ?? []) as SettingRow[];

  return (
    <>
      <PageHeader
        title="Settings"
        subtitle="Account, site identity and key-value site settings"
      />

      <section className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
        <Card className="p-5">
          <h2 className="font-semibold text-[var(--text)] mb-4">Account</h2>
          <div className="space-y-3">
            <div>
              <p className="text-[11px] uppercase tracking-widest text-[var(--text-4)] mb-1">
                Signed in as
              </p>
              <p className="text-sm font-mono text-[var(--accent)]">
                {user?.email}
              </p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-widest text-[var(--text-4)] mb-1">
                Last sign in
              </p>
              <p className="text-sm text-[var(--text-2)]">
                {user?.last_sign_in_at
                  ? new Date(user.last_sign_in_at).toLocaleString()
                  : "—"}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="font-semibold text-[var(--text)] mb-4">Site</h2>
          <dl className="space-y-2.5 text-sm">
            {[
              ["Domain", "narendrapandrinki.com"],
              ["Email", "hello@narendrapandrinki.com"],
              ["Admin", "/control/dashboard"],
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between">
                <dt className="text-[var(--text-3)]">{label}</dt>
                <dd className="font-mono text-[var(--text)]">{value}</dd>
              </div>
            ))}
          </dl>
        </Card>
      </section>

      <h2 className="text-xs font-semibold uppercase tracking-widest text-[var(--text-4)] mb-3">
        Site settings (key/value)
      </h2>

      <Card className="p-5 mb-6">
        <form action={upsertSiteSetting} className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
          <Field label="Key *">
            <Input name="key" required placeholder="e.g. cta_headline" />
          </Field>
          <Field label="Value">
            <Input name="value" />
          </Field>
          <PrimaryButton type="submit">Add / update</PrimaryButton>
        </form>
      </Card>

      {settings.length > 0 ? (
        <ul className="space-y-3">
          {settings.map((row) => (
            <li key={row.id}>
              <Card className="p-4">
                <form
                  action={upsertSiteSetting}
                  className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end"
                >
                  <div className="md:col-span-3">
                    <Field label="Key">
                      <Input name="key" defaultValue={row.key} required />
                    </Field>
                  </div>
                  <div className="md:col-span-7">
                    <Field label="Value">
                      <Textarea
                        name="value"
                        rows={2}
                        defaultValue={row.value}
                      />
                    </Field>
                  </div>
                  <div className="md:col-span-2 flex gap-2">
                    <PrimaryButton type="submit" className="flex-1">
                      Save
                    </PrimaryButton>
                  </div>
                </form>
                <form action={deleteSiteSetting} className="mt-3 flex justify-end">
                  <input type="hidden" name="id" value={row.id} />
                  <GhostButton
                    type="submit"
                    className="!text-[var(--rose)] hover:!bg-[var(--rose)]/10 hover:!border-[var(--rose)]/30"
                  >
                    <Trash2 size={14} /> Delete
                  </GhostButton>
                </form>
              </Card>
            </li>
          ))}
        </ul>
      ) : (
        <Card>
          <Empty title="No settings yet" hint="Add a key/value above" />
        </Card>
      )}
    </>
  );
}
