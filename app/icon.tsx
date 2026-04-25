import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#05060a",
          borderRadius: 14,
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 50% 50%, rgba(34,211,238,0.45), transparent 70%)",
            borderRadius: 14,
          }}
        />
        <div
          style={{
            position: "relative",
            fontFamily: "monospace",
            fontWeight: 700,
            fontSize: 36,
            letterSpacing: -1,
            backgroundImage:
              "linear-gradient(135deg,#22d3ee 0%, #a78bfa 50%, #f472b6 100%)",
            backgroundClip: "text",
            color: "transparent",
            display: "flex",
          }}
        >
          Np
        </div>
      </div>
    ),
    { ...size }
  );
}
