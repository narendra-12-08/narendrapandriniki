import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import JsonLd from "@/components/seo/JsonLd";
import {
  personSchema,
  websiteSchema,
  professionalServiceSchema,
} from "@/lib/seo/schema";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = "https://narendrapandrinki.com";
const DESCRIPTION =
  "Independent DevOps & Platform engineer working with engineering teams globally — cloud infrastructure, Kubernetes platforms, CI/CD, observability, FinOps.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Narendra Pandrinki — DevOps & Platform Engineer",
    template: "%s · Narendra Pandrinki",
  },
  description: DESCRIPTION,
  applicationName: "Narendra Pandrinki",
  authors: [{ name: "Narendra Pandrinki", url: SITE_URL }],
  creator: "Narendra Pandrinki",
  publisher: "Narendra Pandrinki",
  keywords: [
    "DevOps engineer",
    "freelance DevOps engineer",
    "independent platform engineer",
    "Kubernetes consultant",
    "AWS consultant",
    "GCP consultant",
    "Azure consultant",
    "Site Reliability Engineer",
    "SRE consultant",
    "Platform engineering",
    "Internal Developer Platform",
    "CI/CD pipelines",
    "Terraform consultant",
    "Cloud cost optimisation",
    "FinOps",
  ],
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: SITE_URL,
    siteName: "Narendra Pandrinki",
    title: "Narendra Pandrinki — DevOps & Platform Engineer",
    description: DESCRIPTION,
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Narendra Pandrinki — DevOps & Platform Engineer · Available globally",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Narendra Pandrinki — DevOps & Platform Engineer",
    description: DESCRIPTION,
    images: ["/og.png"],
    creator: "@narendrapandrinki",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: "#05060a",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
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
      <body className="min-h-full flex flex-col">
        <JsonLd id="ld-person" data={personSchema()} />
        <JsonLd id="ld-website" data={websiteSchema()} />
        <JsonLd id="ld-professional-service" data={professionalServiceSchema()} />
        {children}
      </body>
    </html>
  );
}
