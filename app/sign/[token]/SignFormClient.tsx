"use client";

import { useEffect, useRef, useState } from "react";
import {
  signContractAction,
  declineContractAction,
} from "@/app/control/actions-contracts";

type Mode = "type" | "draw";

export default function SignFormClient({
  token,
  defaultName,
}: {
  token: string;
  defaultName: string;
}) {
  const [name, setName] = useState(defaultName);
  const [mode, setMode] = useState<Mode>("type");
  const [drawnDataUrl, setDrawnDataUrl] = useState<string>("");
  const hiddenRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawingRef = useRef(false);

  useEffect(() => {
    if (!hiddenRef.current) return;
    hiddenRef.current.value =
      mode === "type"
        ? `typed:${name}`
        : drawnDataUrl
          ? `drawn:${drawnDataUrl}`
          : "";
  }, [mode, name, drawnDataUrl]);

  // Canvas drawing
  useEffect(() => {
    if (mode !== "draw") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ratio = window.devicePixelRatio || 1;
    canvas.width = canvas.offsetWidth * ratio;
    canvas.height = canvas.offsetHeight * ratio;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(ratio, ratio);
    ctx.lineWidth = 2.2;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#0b3d91";
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
  }, [mode]);

  const startDraw = (x: number, y: number) => {
    drawingRef.current = true;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    ctx.beginPath();
    ctx.moveTo(x, y);
  };
  const moveDraw = (x: number, y: number) => {
    if (!drawingRef.current) return;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    ctx.lineTo(x, y);
    ctx.stroke();
  };
  const endDraw = () => {
    drawingRef.current = false;
    const canvas = canvasRef.current;
    if (canvas) setDrawnDataUrl(canvas.toDataURL("image/png"));
  };
  const clearDraw = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
    setDrawnDataUrl("");
  };

  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    if ("touches" in e && e.touches[0]) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    }
    const me = e as React.MouseEvent;
    return { x: me.clientX - rect.left, y: me.clientY - rect.top };
  };

  return (
    <div className="border-t border-[#e5e7eb] pt-8">
      <h2 className="text-lg font-semibold text-[#111] mb-4">
        Sign this contract
      </h2>

      <form action={signContractAction} className="space-y-5">
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
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-medium text-[#374151]">Signature</p>
            <div className="inline-flex rounded-md border border-[#d1d5db] bg-white p-0.5 text-xs">
              <button
                type="button"
                onClick={() => setMode("type")}
                className={`px-3 py-1 rounded ${
                  mode === "type"
                    ? "bg-[#5c3d1e] text-white"
                    : "text-[#374151]"
                }`}
              >
                Type
              </button>
              <button
                type="button"
                onClick={() => setMode("draw")}
                className={`px-3 py-1 rounded ${
                  mode === "draw"
                    ? "bg-[#5c3d1e] text-white"
                    : "text-[#374151]"
                }`}
              >
                Draw
              </button>
            </div>
          </div>

          {mode === "type" ? (
            <div
              className="px-4 py-6 rounded-md border-2 border-dashed border-[#d1d5db] bg-[#fafafa] text-2xl"
              style={{
                fontFamily:
                  '"Brush Script MT", "Lucida Handwriting", "Apple Chancery", cursive',
                color: "#0b3d91",
                minHeight: 72,
              }}
            >
              {name || (
                <span style={{ color: "#9ca3af", fontStyle: "italic" }}>
                  Your typed signature will appear here
                </span>
              )}
            </div>
          ) : (
            <div className="rounded-md border-2 border-dashed border-[#d1d5db] bg-[#fafafa] overflow-hidden">
              <canvas
                ref={canvasRef}
                className="w-full h-32 bg-white touch-none cursor-crosshair"
                onMouseDown={(e) => {
                  const { x, y } = getPos(e);
                  startDraw(x, y);
                }}
                onMouseMove={(e) => {
                  const { x, y } = getPos(e);
                  moveDraw(x, y);
                }}
                onMouseUp={endDraw}
                onMouseLeave={endDraw}
                onTouchStart={(e) => {
                  e.preventDefault();
                  const { x, y } = getPos(e);
                  startDraw(x, y);
                }}
                onTouchMove={(e) => {
                  e.preventDefault();
                  const { x, y } = getPos(e);
                  moveDraw(x, y);
                }}
                onTouchEnd={endDraw}
              />
              <div className="flex items-center justify-between px-3 py-2 border-t border-[#e5e7eb] bg-white text-xs">
                <span className="text-[#666]">
                  Draw with your mouse or finger.
                </span>
                <button
                  type="button"
                  onClick={clearDraw}
                  className="text-[#5c3d1e] hover:underline"
                >
                  Clear
                </button>
              </div>
            </div>
          )}

          <p className="text-[11px] text-[#666] mt-2">
            Your signature is recorded with a timestamp, your IP address, and
            your device user agent — legally binding under most jurisdictions
            recognising electronic signatures (UETA, ESIGN, eIDAS, IT Act 2000).
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
            signature to be a legally binding electronic signature.
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
