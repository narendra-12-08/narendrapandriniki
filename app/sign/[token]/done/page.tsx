import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getContractByToken } from "@/lib/db/contracts";

export const metadata: Metadata = {
  title: "Thank you",
  robots: { index: false, follow: false, nocache: true },
};

export const dynamic = "force-dynamic";

export default async function SignDonePage({
  params,
  searchParams,
}: {
  params: Promise<{ token: string }>;
  searchParams: Promise<{ declined?: string }>;
}) {
  const { token } = await params;
  const { declined } = await searchParams;
  const c = await getContractByToken(token);
  if (!c) notFound();

  const isDeclined = declined === "1" || c.status === "declined";

  return (
    <main className="mx-auto max-w-2xl px-4 sm:px-6 py-16 sm:py-24">
      <div className="sign-card p-8 sm:p-12 text-center">
        {isDeclined ? (
          <>
            <h1 className="text-3xl font-semibold text-[#111]">
              Contract declined
            </h1>
            <p className="mt-3 text-[#444] leading-relaxed">
              We have recorded that you declined to sign this contract. A
              notification has been sent to {c.sender_email}.
            </p>
            <p className="mt-3 text-sm text-[#666]">
              If this was a mistake, reply to the original email and we can
              re-issue the contract.
            </p>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-semibold text-[#111]">
              Thank you, signed
            </h1>
            <p className="mt-3 text-[#444] leading-relaxed">
              The contract <strong>{c.title}</strong> has been signed. A copy
              has been emailed to {c.recipient_email}, and the original is
              available at the link below for your records.
            </p>
            <div className="mt-6">
              <Link
                href={`/sign/${token}`}
                className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold rounded-md text-white"
                style={{ background: "#5c3d1e" }}
              >
                View signed contract
              </Link>
            </div>
          </>
        )}

        <p className="mt-10 text-xs text-[#7d5c3a]">
          Reference:{" "}
          <code style={{ fontFamily: "ui-monospace, monospace" }}>
            {c.signing_token.slice(0, 12)}…
          </code>
        </p>
      </div>
      <p className="text-center mt-8 text-xs text-[#7d5c3a]">
        Narendra Pandrinki ·{" "}
        <a href="https://narendrapandrinki.com">narendrapandrinki.com</a>
      </p>
    </main>
  );
}
