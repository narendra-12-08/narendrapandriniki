"use client";

import { useEffect, useRef, useState } from "react";
import {
  signContractAction,
  declineContractAction,
} from "@/app/control/actions-contracts";

export default function SignFormClient({
  token,
  defaultName,
}: {
  token: string;
  defaultName: string;
}) {
  const [name, setName] = useState(defaultName);
  const hiddenRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (hiddenRef.current) {
      hiddenRef.current.value = `typed:${name}`;
    }
  }, [name]);

  return (
    <div className="border-t border-[#e5e7eb] pt-8">
      <h2 className="text-lg font-semibold text-[#111] mb-4">
        Sign this contract
      </h2>

      <form action={signContractAction} className="space-y-4">
        <input type="hidden" name="token" value={token} />

        <div>
          <label
            htmlFor="signer_name"
            className="block text-xs font-medium text-[#374151] mb-1.5"
          >
            Full legal name
          </label>
          <input
            id="signer_name"
            name="signer_name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            className="w-full px-3 py-2.5 rounded-md text-sm bg-white border border-[#d1d5db] text-[#111] outline-none focus:border-[#5c3d1e] focus:ring-2 focus:ring-[#5c3d1e]/30"
          />
        </div>

        <div>
          <p className="block text-xs font-medium text-[#374151] mb-1.5">
            Signature
          </p>
          <div
            className="px-4 py-6 rounded-md border-2 border-dashed border-[#d1d5db] bg-[#fafafa] text-2xl"
            style={{
              fontFamily:
                '"Brush Script MT", "Lucida Handwriting", "Apple Chancery", cursive',
              color: "#0b3d91",
              minHeight: 64,
            }}
          >
            {name || (
              <span style={{ color: "#9ca3af", fontStyle: "italic" }}>
                Your signature will appear here
              </span>
            )}
          </div>
          <p className="text-[11px] text-[#666] mt-1">
            Your typed name above is recorded as your electronic signature,
            with a timestamp and your IP address.
          </p>
          <input
            ref={hiddenRef}
            type="hidden"
            name="signature_data"
            defaultValue={`typed:${defaultName}`}
          />
        </div>

        <label className="flex items-start gap-3 text-sm text-[#374151] cursor-pointer">
          <input type="checkbox" name="agreed" required className="mt-1" />
          <span>
            I have read the contract above and agree to its terms. I intend my
            typed name to be a legally binding electronic signature.
          </span>
        </label>

        <div className="flex flex-wrap gap-3 pt-2">
          <button
            type="submit"
            className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold rounded-md text-white"
            style={{ background: "#5c3d1e" }}
          >
            Sign contract
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium rounded-md border border-[#d1d5db] text-[#374151] bg-white"
          >
            Print / save PDF
          </button>
        </div>
      </form>

      <details className="mt-8">
        <summary className="text-sm text-[#7d5c3a] cursor-pointer">
          Decline this contract
        </summary>
        <form action={declineContractAction} className="mt-3 space-y-3">
          <input type="hidden" name="token" value={token} />
          <textarea
            name="reason"
            placeholder="Optional reason for declining"
            rows={3}
            className="w-full px-3 py-2 rounded-md text-sm bg-white border border-[#d1d5db] text-[#111] outline-none focus:border-[#5c3d1e]"
          />
          <button
            type="submit"
            className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md border border-[#fecaca] text-[#991b1b] bg-[#fef2f2]"
          >
            Decline
          </button>
        </form>
      </details>
    </div>
  );
}
