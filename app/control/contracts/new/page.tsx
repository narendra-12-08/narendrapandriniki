import type { Metadata } from "next";
import { PageHeader, Card } from "@/components/admin/ui";
import { createClient } from "@/lib/supabase/server";
import { listTemplates } from "@/lib/db/contracts";
import ContractEditor from "@/components/admin/ContractEditor";

export const metadata: Metadata = { title: "New contract" };
export const dynamic = "force-dynamic";

export default async function NewContractPage({
  searchParams,
}: {
  searchParams: Promise<{ err?: string }>;
}) {
  const { err } = await searchParams;

  const supabase = await createClient();
  const [templates, { data: clients }, { data: projects }] = await Promise.all([
    listTemplates(),
    supabase
      .from("clients")
      .select("id, name, email, company")
      .order("name"),
    supabase
      .from("projects")
      .select("id, name, client_id")
      .order("name"),
  ]);

  return (
    <>
      <PageHeader
        title="New contract"
        subtitle="Pick a template or write a custom contract, then send it for e-signature."
      />

      {err === "missing" && (
        <p className="mb-4 p-3 rounded text-sm bg-[var(--rose)]/10 border border-[var(--rose)]/30 text-[var(--rose)]">
          Please fill in the title, body, recipient name and email.
        </p>
      )}

      <Card className="p-6">
        <ContractEditor
          templates={templates}
          clients={clients ?? []}
          projects={projects ?? []}
        />
      </Card>
    </>
  );
}
