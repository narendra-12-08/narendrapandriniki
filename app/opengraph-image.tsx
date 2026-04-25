import { ImageResponse } from "next/og";

export const alt =
  "Narendra Pandrinki — DevOps & Platform Engineer · Available globally";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          color: "#e6e8ee",
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          background:
            "linear-gradient(135deg, #05060a 0%, #0a0d14 55%, #0f1422 100%)",
        }}
      >
        {/* subtle grid */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
            display: "flex",
          }}
        />

        {/* cyan glow accent */}
        <div
          style={{
            position: "absolute",
            top: -160,
            right: -160,
            width: 520,
            height: 520,
            borderRadius: 9999,
            background:
              "radial-gradient(circle, rgba(34,211,238,0.28), transparent 70%)",
            display: "flex",
          }}
        />

        {/* Top-left badge */}
        <div
          style={{
            position: "absolute",
            top: 56,
            left: 64,
            display: "flex",
            alignItems: "center",
            gap: 14,
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              border: "1px solid rgba(255,255,255,0.12)",
              background: "rgba(255,255,255,0.04)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
              fontSize: 22,
              color: "#22d3ee",
              fontWeight: 600,
            }}
          >
            np
          </div>
          <div
            style={{
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
              fontSize: 16,
              color: "rgba(230,232,238,0.7)",
              letterSpacing: 1,
              display: "flex",
            }}
          >
            narendrapandrinki
          </div>
        </div>

        {/* Center-left content */}
        <div
          style={{
            position: "absolute",
            left: 64,
            top: 200,
            display: "flex",
            flexDirection: "column",
            maxWidth: 760,
          }}
        >
          <div
            style={{
              fontSize: 88,
              fontWeight: 600,
              letterSpacing: -2,
              lineHeight: 1.02,
              color: "#ffffff",
              display: "flex",
            }}
          >
            Narendra Pandrinki
          </div>
          <div
            style={{
              marginTop: 28,
              fontSize: 32,
              color: "rgba(230,232,238,0.78)",
              lineHeight: 1.25,
              display: "flex",
              flexWrap: "wrap",
            }}
          >
            DevOps & Platform Engineer · Available globally
          </div>
        </div>

        {/* Bottom-left URL */}
        <div
          style={{
            position: "absolute",
            bottom: 56,
            left: 64,
            fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
            fontSize: 18,
            color: "rgba(230,232,238,0.5)",
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: 9999,
              background: "#22d3ee",
              display: "flex",
            }}
          />
          narendrapandrinki.com
        </div>

        {/* Right-side abstract motif: floating dots */}
        <div
          style={{
            position: "absolute",
            right: 80,
            top: 140,
            width: 360,
            height: 360,
            display: "flex",
            flexWrap: "wrap",
            gap: 18,
          }}
        >
          {Array.from({ length: 64 }).map((_, i) => {
            const row = Math.floor(i / 8);
            const col = i % 8;
            const accent = (row + col) % 5 === 0;
            return (
              <div
                key={i}
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 9999,
                  background: accent
                    ? "rgba(34,211,238,0.7)"
                    : "rgba(255,255,255,0.08)",
                  display: "flex",
                }}
              />
            );
          })}
        </div>
      </div>
    ),
    { ...size }
  );
}
