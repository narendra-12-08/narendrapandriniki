import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Narendra Pandrinki — Platform & Cloud Engineer",
    template: "%s | Narendra Pandrinki",
  },
  description:
    "Independent platform and cloud engineer. I build cloud infrastructure, backend systems, internal tools, and workflow automation for businesses.",
  metadataBase: new URL("https://narendrapandrinki.com"),
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: "https://narendrapandrinki.com",
    siteName: "Narendra Pandrinki",
    title: "Narendra Pandrinki — Platform & Cloud Engineer",
    description:
      "Independent platform and cloud engineer specialising in cloud infrastructure, backend systems, and internal tools.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Narendra Pandrinki — Platform & Cloud Engineer",
    description:
      "Independent platform and cloud engineer specialising in cloud infrastructure, backend systems, and internal tools.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
