import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Markdown from "@/components/public/Markdown";
import { getContractByToken, markViewed } from "@/lib/db/contracts";
import SignFormClient from "./SignFormClient";

export const metadata: Metadata = {
  title: "Sign contract",
  robots: { index: false, follow: false, nocache: true },
};

export const dynamic = "force-dynamic";

function fmt(d: string | null): string {
  if (!d) return "—";
  return new Date(d).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function SignPage({
  params,
  searchParams,
}: {
  params: Promise<{ token: string }>;
  searchParams: Promise<{ err?: string }>;
}) {
  const { token } = await params;
  const { err } = await searchParams;

  const contract = await getContractByToken(token);
  if (!contract) notFound();

  if (contract.status === "sent") {
    await markViewed(token);
  }

  const isFinal =
    contract.status === "signed" ||
    contract.status === "declined" ||
    contract.status === "cancelled";

  return (
    <main className="mx-auto max-w-3xl px-4 sm:px-6 py-8 sm:py-14">
      <div className="sign-card p-6 sm:p-10">
        <div className="border-b border-[#e5e7eb] pb-5 mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-widest text-[#7d5c3a] font-semibold">
              Contract for signature
            </p>
            <h1 className="text-2xl sm:text-3xl font-semibold mt-1.5 text-[#111] tracking-tight">
              {contract.title}
            </h1>
          </div>
          <div className="text-xs text-[#666] no-print">
            Reference:{" "}
            <code style={{ fontFamily: "ui-monospace, monospace" }}>
              {contract.signing_token.slice(0, 12)}…
            </code>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8 text-sm">
          <div>
            <p className="text-[11px] uppercase tracking-widest text-[#7d5c3a] font-semibold mb-1">
              From
            </p>
            <p className="font-semibold text-[#111]">{contract.sender_name}</p>
            <p className="text-[#444]">{contract.sender_email}</p>
            <p className="text-[#666] text-xs mt-1">
              Hyderabad, India · narendrapandrinki.com
            </p>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-widest text-[#7d5c3a] font-semibold mb-1">
              To
            </p>
            <p className="font-semibold text-[#111]">
              {contract.recipient_name}
            </p>
            <p className="text-[#444]">{contract.recipient_email}</p>
            <p className="text-[#666] text-xs mt-1">
              Sent: {fmt(contract.sent_at)} · Status:{" "}
              <strong>{contract.status}</strong>
            </p>
          </div>
        </div>

        <article className="markdown-body">
          <Markdown source={contract.body_markdown} />
        </article>

        {contract.status === "signed" && (
          <div
            className="mt-10 p-5 rounded-lg"
            style={{ background: "#ecfdf5", border: "1px solid #a7f3d0" }}
          >
            <p className="font-semibold text-[#065f46]">Signed</p>
            <p className="text-sm text-[#065f46] mt-1">
              Signed by <strong>{contract.signer_name}</strong> on{" "}
              {fmt(contract.signed_at)}.
            </p>
            {contract.signature_data && (
              <SignatureDisplay data={contract.signature_data} />
            )}
          </div>
        )}

        {contract.status === "declined" && (
          <div
            className="mt-10 p-5 rounded-lg"
            style={{ background: "#fef2f2", border: "1px solid #fecaca" }}
          >
            <p className="font-semibold text-[#991b1b]">Declined</p>
            {contract.decline_reason && (
              <p className="text-sm text-[#991b1b] mt-1">
                Reason: {contract.decline_reason}
              </p>
            )}
          </div>
        )}

        {contract.status === "cancelled" && (
          <div
            className="mt-10 p-5 rounded-lg"
            style={{ background: "#f3f4f6", border: "1px solid #e5e7eb" }}
          >
            <p className="font-semibold text-[#374151]">Cancelled</p>
            <p className="text-sm text-[#4b5563] mt-1">
              This contract has been withdrawn by the sender.
            </p>
          </div>
        )}

        {!isFinal && (
          <div className="mt-12 no-print">
            {err === "missing" && (
              <p
                className="mb-4 p-3 rounded text-sm"
                style={{
                  background: "#fef2f2",
                  border: "1px solid #fecaca",
                  color: "#991b1b",
                }}
              >
                Please type your full name and confirm you have read the
                agreement.
              </p>
            )}
            {err === "state" && (
              <p
                className="mb-4 p-3 rounded text-sm"
                style={{
                  background: "#fef2f2",
                  border: "1px solid #fecaca",
                  color: "#991b1b",
                }}
              >
                This contract can no longer be signed (status changed).
              </p>
            )}

            <SignFormClient
              token={token}
              defaultName={contract.recipient_name}
            />
          </div>
        )}

        <footer className="mt-14 pt-6 border-t border-[#e5e7eb] text-xs text-[#7d5c3a]">
          <p>
            Narendra Pandrinki · hello@narendrapandrinki.com ·{" "}
            <a href="https://narendrapandrinki.com">narendrapandrinki.com</a>
          </p>
          <p className="mt-1">
            This document is generated electronically. By signing, you
            acknowledge that you intend to be bound under the Indian Information
            Technology Act, 2000 and applicable e-signature law.
          </p>
        </footer>
      </div>
    </main>
  );
}

function SignatureDisplay({ data }: { data: string }) {
  if (data.startsWith("typed:")) {
    const name = data.slice("typed:".length);
    return (
      <p
        className="mt-3 px-4 py-3 rounded bg-white border border-[#a7f3d0] text-2xl"
        style={{
          fontFamily:
            '"Brush Script MT", "Lucida Handwriting", "Apple Chancery", cursive',
          color: "#0b3d91",
        }}
      >
        {name}
      </p>
    );
  }
  if (data.startsWith("data:image/")) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={data} alt="Signature" className="mt-3 max-h-32" />;
  }
  return null;
}
