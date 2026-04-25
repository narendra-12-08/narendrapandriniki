import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Eye,
  Send,
  XCircle,
  Copy,
} from "lucide-react";
import { Card, PageHeader, Badge, GhostButton, DangerButton, PrimaryButton } from "@/components/admin/ui";
import Markdown from "@/components/public/Markdown";
import { getContract } from "@/lib/db/contracts";
import {
  resendContract,
  cancelContract,
  rotateSigningToken,
} from "@/app/control/actions-contracts";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Contract" };

const SITE_URL = "https://narendrapandrinki.com";

function statusTone(status: string): "default" | "accent" | "lime" | "rose" | "amber" {
  switch (status) {
    case "signed":
      return "lime";
    case "declined":
    case "cancelled":
      return "rose";
    case "viewed":
      return "amber";
    case "sent":
      return "accent";
    default:
      return "default";
  }
}

export default async function ContractDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const contract = await getContract(id);
  if (!contract) notFound();

  const signingUrl = `${SITE_URL}/sign/${contract.signing_token}`;

  const timeline: { label: string; at: string | null; tone: string }[] = [
    { label: "Created", at: contract.created_at, tone: "default" },
    { label: "Sent", at: contract.sent_at, tone: "accent" },
    { label: "Viewed", at: contract.viewed_at, tone: "amber" },
    {
      label: contract.status === "declined" ? "Declined" : "Signed",
      at: contract.status === "declined" ? contract.created_at : contract.signed_at,
      tone: contract.status === "declined" ? "rose" : "lime",
    },
  ];

  return (
    <div className="space-y-6">
      <Link
        href="/control/contracts"
        className="inline-flex items-center gap-2 text-sm text-[var(--text-3)] hover:text-[var(--text)]"
      >
        <ArrowLeft size={14} /> All contracts
      </Link>

      <PageHeader
        title={contract.title}
        subtitle={`To: ${contract.recipient_name} <${contract.recipient_email}>`}
      />

      <div className="flex flex-wrap gap-3 items-center">
        <Badge tone={statusTone(contract.status)}>{contract.status}</Badge>
        <span className="text-xs font-mono text-[var(--text-3)]">
          Created {new Date(contract.created_at).toLocaleString()}
        </span>
      </div>

      <Card className="p-6">
        <h2 className="text-sm font-mono uppercase tracking-[0.16em] text-[var(--text-4)] mb-4">
          Signing link
        </h2>
        <div className="flex flex-wrap items-center gap-3">
          <a
            href={signingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--accent)] font-mono text-sm break-all"
          >
            {signingUrl}
          </a>
        </div>
        <p className="mt-3 text-xs text-[var(--text-3)]">
          Anyone with this link can view and sign. Rotate the token below if you ever need to invalidate it.
        </p>

        <div className="mt-5 flex flex-wrap gap-2 pt-5 border-t border-[var(--border)]">
          {(contract.status === "draft" ||
            contract.status === "sent" ||
            contract.status === "viewed") && (
            <form action={resendContract}>
              <input type="hidden" name="id" value={contract.id} />
              <PrimaryButton type="submit">
                <Send size={14} /> Resend by email
              </PrimaryButton>
            </form>
          )}
          {contract.status !== "signed" &&
            contract.status !== "cancelled" && (
              <form action={cancelContract}>
                <input type="hidden" name="id" value={contract.id} />
                <DangerButton type="submit">
                  <XCircle size={14} /> Cancel contract
                </DangerButton>
              </form>
            )}
          <form action={rotateSigningToken}>
            <input type="hidden" name="id" value={contract.id} />
            <GhostButton type="submit">
              <Copy size={14} /> Rotate token
            </GhostButton>
          </form>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-sm font-mono uppercase tracking-[0.16em] text-[var(--text-4)] mb-4">
          Timeline
        </h2>
        <ol className="space-y-3">
          {timeline.map((t) => (
            <li key={t.label} className="flex items-center gap-3 text-sm">
              {t.at ? (
                <CheckCircle2 className="text-[var(--lime)]" size={16} />
              ) : (
                <Clock className="text-[var(--text-4)]" size={16} />
              )}
              <span className={t.at ? "text-[var(--text)]" : "text-[var(--text-4)]"}>
                {t.label}
              </span>
              <span className="text-xs font-mono text-[var(--text-3)] ml-auto">
                {t.at ? new Date(t.at).toLocaleString() : "—"}
              </span>
            </li>
          ))}
        </ol>
      </Card>

      {contract.status === "signed" && (
        <Card className="p-6">
          <h2 className="text-sm font-mono uppercase tracking-[0.16em] text-[var(--text-4)] mb-4">
            Signature
          </h2>
          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-xs text-[var(--text-4)]">Signer name</div>
              <div className="text-[var(--text)] mt-1">
                {contract.signer_name ?? "—"}
              </div>
            </div>
            <div>
              <div className="text-xs text-[var(--text-4)]">Signed at</div>
              <div className="text-[var(--text)] mt-1">
                {contract.signed_at
                  ? new Date(contract.signed_at).toLocaleString()
                  : "—"}
              </div>
            </div>
            <div>
              <div className="text-xs text-[var(--text-4)]">Signer IP</div>
              <div className="font-mono text-xs text-[var(--text-2)] mt-1">
                {contract.signer_ip ?? "—"}
              </div>
            </div>
            <div>
              <div className="text-xs text-[var(--text-4)]">User agent</div>
              <div className="font-mono text-xs text-[var(--text-2)] mt-1 truncate">
                {contract.signer_user_agent ?? "—"}
              </div>
            </div>
          </div>
          {contract.signature_data && (
            <div className="mt-5 pt-5 border-t border-[var(--border)]">
              <div className="text-xs text-[var(--text-4)] mb-2">Typed signature</div>
              <div className="text-xl font-serif italic text-[var(--text)]">
                {contract.signature_data}
              </div>
            </div>
          )}
        </Card>
      )}

      <Card className="p-6 md:p-8">
        <h2 className="text-sm font-mono uppercase tracking-[0.16em] text-[var(--text-4)] mb-5">
          Body
        </h2>
        <article className="prose-dark">
          <Markdown source={contract.body_markdown} />
        </article>
      </Card>
    </div>
  );
}
