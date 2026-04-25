import { ImageResponse } from "next/og";
import { findPost } from "@/lib/content/blog-adapter";

export const alt = "Narendra Pandrinki — Blog post";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = findPost(slug);
  const title = post?.title ?? "Notes from the platform";
  const tag = post?.tags?.[0] ?? "Notes";
  const date = post?.publishedAt ?? "";

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
        {/* grid */}
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
        <div
          style={{
            position: "absolute",
            top: -200,
            right: -180,
            width: 560,
            height: 560,
            borderRadius: 9999,
            background:
              "radial-gradient(circle, rgba(167,139,250,0.22), transparent 70%)",
            display: "flex",
          }}
        />

        {/* Header */}
        <div
          style={{
            position: "absolute",
            top: 56,
            left: 64,
            right: 64,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: 13,
                border: "1px solid rgba(255,255,255,0.12)",
                background: "rgba(255,255,255,0.04)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily:
                  "ui-monospace, SFMono-Regular, Menlo, monospace",
                fontSize: 20,
                color: "#22d3ee",
                fontWeight: 600,
              }}
            >
              np
            </div>
            <div
              style={{
                fontFamily:
                  "ui-monospace, SFMono-Regular, Menlo, monospace",
                fontSize: 16,
                color: "rgba(230,232,238,0.7)",
                display: "flex",
              }}
            >
              narendrapandrinki.com / blog
            </div>
          </div>
          <div
            style={{
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
              fontSize: 14,
              color: "#22d3ee",
              padding: "8px 14px",
              border: "1px solid rgba(34,211,238,0.4)",
              borderRadius: 999,
              textTransform: "uppercase",
              letterSpacing: 2,
              display: "flex",
            }}
          >
            {tag}
          </div>
        </div>

        {/* Title */}
        <div
          style={{
            position: "absolute",
            left: 64,
            right: 64,
            top: 180,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              fontSize: title.length > 80 ? 56 : 68,
              fontWeight: 600,
              letterSpacing: -1.5,
              lineHeight: 1.08,
              color: "#ffffff",
              display: "flex",
            }}
          >
            {title}
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            position: "absolute",
            bottom: 56,
            left: 64,
            right: 64,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
            fontSize: 18,
            color: "rgba(230,232,238,0.55)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: 9999,
                background: "#a3e635",
                display: "flex",
              }}
            />
            Narendra Pandrinki
          </div>
          <div style={{ display: "flex" }}>{date}</div>
        </div>
      </div>
    ),
    { ...size }
  );
}
