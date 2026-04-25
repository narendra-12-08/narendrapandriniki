import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/control/", "/api/"],
      },
    ],
    sitemap: "https://narendrapandrinki.com/sitemap.xml",
    host: "https://narendrapandrinki.com",
  };
}
