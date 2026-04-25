import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign contract",
  robots: { index: false, follow: false, nocache: true },
};

/**
 * Standalone layout for the public signing flow.
 * Light theme override so the page prints clean (Print > Save as PDF) and
 * is visually distinct from the dark site theme.
 */
export default function SignLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="min-h-screen sign-layout"
      style={{
        background: "#ffffff",
        color: "#1a1a1a",
        colorScheme: "light",
      }}
    >
      <style>{`
        .sign-layout { font-family: Georgia, "Times New Roman", serif; }
        .sign-layout a { color: #0b5ed7; }
        .sign-layout .sign-card { background: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; }
        .sign-layout .markdown-body p,
        .sign-layout .markdown-body li { color: #2a2a2a !important; }
        .sign-layout .markdown-body h1,
        .sign-layout .markdown-body h2,
        .sign-layout .markdown-body h3 { color: #111111 !important; }
        .sign-layout .markdown-body code { background: #f3f4f6; color: #111; padding: 1px 4px; border-radius: 4px; }
        .sign-layout .markdown-body pre { background: #f9fafb !important; border-color: #e5e7eb !important; }
        .sign-layout .markdown-body pre code { color: #111 !important; }
        .sign-layout .markdown-body strong { color: #111111; }
        @media print {
          .no-print { display: none !important; }
          .sign-layout { background: #fff !important; }
          .sign-card { border: none !important; }
        }
      `}</style>
      {children}
    </div>
  );
}
