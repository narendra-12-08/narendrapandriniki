import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
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
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 50% 40%, rgba(34,211,238,0.45), transparent 70%)",
          }}
        />
        <div
          style={{
            position: "relative",
            fontFamily: "monospace",
            fontWeight: 700,
            fontSize: 100,
            letterSpacing: -3,
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
