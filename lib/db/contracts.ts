import { randomUUID, randomBytes } from "node:crypto";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export type ContractStatus =
  | "draft"
  | "sent"
  | "viewed"
  | "signed"
  | "declined"
  | "cancelled";

export interface ContractTemplate {
  id: string;
  slug: string;
  name: string;
  body: string;
  category: string;
  created_at: string;
  updated_at: string;
}

export interface Contract {
  id: string;
  client_id: string | null;
  project_id: string | null;
  title: string;
  body_markdown: string;
  status: ContractStatus;
  signing_token: string;
  sender_name: string;
  sender_email: string;
  recipient_name: string;
  recipient_email: string;
  sent_at: string | null;
  viewed_at: string | null;
  signed_at: string | null;
  signer_name: string | null;
  signer_ip: string | null;
  signer_user_agent: string | null;
  signature_data: string | null;
  decline_reason: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Generates a hard-to-guess signing token.
 *  - Primary: crypto.randomUUID() (RFC4122 v4)
 *  - Suffix: 8-byte hex (high-entropy nanoid-style fallback) so the
 *    final token is long enough that a brute-force scan against the
 *    /sign/[token] endpoint is infeasible.
 */
export function generateSigningToken(): string {
  const uuid = randomUUID();
  const suffix = randomBytes(8).toString("hex");
  return `${uuid.replace(/-/g, "")}${suffix}`;
}

// ---------- Authenticated (admin) reads ----------

export async function listTemplates(): Promise<ContractTemplate[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("contract_templates")
    .select("*")
    .order("name", { ascending: true });
  if (error) throw error;
  return (data ?? []) as ContractTemplate[];
}

export async function getTemplate(
  id: string
): Promise<ContractTemplate | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("contract_templates")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return (data as ContractTemplate | null) ?? null;
}

export async function listContracts(
  filter?: { status?: ContractStatus | "all" }
): Promise<Contract[]> {
  const supabase = await createClient();
  let q = supabase.from("contracts").select("*").order("created_at", {
    ascending: false,
  });
  if (filter?.status && filter.status !== "all") {
    q = q.eq("status", filter.status);
  }
  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []) as Contract[];
}

export async function getContract(id: string): Promise<Contract | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("contracts")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return (data as Contract | null) ?? null;
}

export interface CreateContractInput {
  client_id?: string | null;
  project_id?: string | null;
  title: string;
  body_markdown: string;
  recipient_name: string;
  recipient_email: string;
  status?: ContractStatus;
}

export async function createContract(
  input: CreateContractInput
): Promise<Contract> {
  const supabase = await createClient();
  const signing_token = generateSigningToken();
  const { data, error } = await supabase
    .from("contracts")
    .insert({
      client_id: input.client_id ?? null,
      project_id: input.project_id ?? null,
      title: input.title,
      body_markdown: input.body_markdown,
      recipient_name: input.recipient_name,
      recipient_email: input.recipient_email,
      status: input.status ?? "draft",
      signing_token,
    })
    .select("*")
    .single();
  if (error) throw error;
  return data as Contract;
}

export async function updateContractStatus(
  id: string,
  status: ContractStatus,
  extra: Record<string, unknown> = {}
): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("contracts")
    .update({ status, ...extra })
    .eq("id", id);
  if (error) throw error;
}

export async function updateContract(
  id: string,
  patch: Partial<Contract>
): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("contracts")
    .update(patch)
    .eq("id", id);
  if (error) throw error;
}

export async function upsertTemplate(input: {
  id?: string | null;
  slug: string;
  name: string;
  body: string;
  category?: string;
}): Promise<ContractTemplate> {
  const supabase = await createClient();
  const payload = {
    slug: input.slug,
    name: input.name,
    body: input.body,
    category: input.category ?? "general",
  };
  if (input.id) {
    const { data, error } = await supabase
      .from("contract_templates")
      .update(payload)
      .eq("id", input.id)
      .select("*")
      .single();
    if (error) throw error;
    return data as ContractTemplate;
  }
  const { data, error } = await supabase
    .from("contract_templates")
    .insert(payload)
    .select("*")
    .single();
  if (error) throw error;
  return data as ContractTemplate;
}

export async function deleteTemplate(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("contract_templates")
    .delete()
    .eq("id", id);
  if (error) throw error;
}

// ---------- Public (service-role) — used by /sign/[token] ----------

export async function getContractByToken(
  token: string
): Promise<Contract | null> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("contracts")
    .select("*")
    .eq("signing_token", token)
    .maybeSingle();
  if (error) throw error;
  return (data as Contract | null) ?? null;
}

export async function markViewed(token: string): Promise<void> {
  const admin = createAdminClient();
  // Only flip viewed_at the first time, and only when the contract is
  // currently 'sent' (not draft/cancelled/declined/signed).
  const { data: row } = await admin
    .from("contracts")
    .select("id, status, viewed_at")
    .eq("signing_token", token)
    .maybeSingle();
  if (!row) return;
  if (row.viewed_at) return;
  if (row.status !== "sent") return;
  await admin
    .from("contracts")
    .update({ status: "viewed", viewed_at: new Date().toISOString() })
    .eq("id", row.id);
}

export interface SignerData {
  signer_name: string;
  signer_ip: string | null;
  signer_user_agent: string | null;
  signature_data: string;
}

export async function markSigned(
  token: string,
  signer: SignerData
): Promise<Contract | null> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("contracts")
    .update({
      status: "signed",
      signed_at: new Date().toISOString(),
      signer_name: signer.signer_name,
      signer_ip: signer.signer_ip,
      signer_user_agent: signer.signer_user_agent,
      signature_data: signer.signature_data,
    })
    .eq("signing_token", token)
    .in("status", ["sent", "viewed"])
    .select("*")
    .maybeSingle();
  if (error) throw error;
  return (data as Contract | null) ?? null;
}

export async function markDeclined(
  token: string,
  reason: string | null
): Promise<Contract | null> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("contracts")
    .update({
      status: "declined",
      decline_reason: reason,
    })
    .eq("signing_token", token)
    .in("status", ["sent", "viewed"])
    .select("*")
    .maybeSingle();
  if (error) throw error;
  return (data as Contract | null) ?? null;
}
