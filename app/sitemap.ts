import type { MetadataRoute } from "next";
import { services } from "@/lib/content/services";
import { solutions } from "@/lib/content/solutions";
import { caseStudies } from "@/lib/content/work";
import { industries } from "@/lib/content/industries";
import { allPosts } from "@/lib/content/blog-adapter";

const SITE = "https://narendrapandrinki.com";

type Entry = {
  url: string;
  lastModified: Date;
  changeFrequency:
    | "always"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | "never";
  priority: number;
};

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: Entry[] = [
    { url: "/", changeFrequency: "weekly", priority: 1.0, lastModified: now },
    { url: "/about", changeFrequency: "monthly", priority: 0.9, lastModified: now },
    { url: "/services", changeFrequency: "monthly", priority: 0.9, lastModified: now },
    { url: "/solutions", changeFrequency: "monthly", priority: 0.9, lastModified: now },
    { url: "/work", changeFrequency: "monthly", priority: 0.8, lastModified: now },
    { url: "/blog", changeFrequency: "weekly", priority: 0.8, lastModified: now },
    { url: "/industries", changeFrequency: "monthly", priority: 0.8, lastModified: now },
    { url: "/technology", changeFrequency: "monthly", priority: 0.7, lastModified: now },
    { url: "/process", changeFrequency: "monthly", priority: 0.7, lastModified: now },
    { url: "/pricing", changeFrequency: "monthly", priority: 0.7, lastModified: now },
    { url: "/faq", changeFrequency: "monthly", priority: 0.7, lastModified: now },
    { url: "/contact", changeFrequency: "yearly", priority: 0.8, lastModified: now },
    { url: "/compare", changeFrequency: "monthly", priority: 0.6, lastModified: now },
    { url: "/privacy", changeFrequency: "yearly", priority: 0.3, lastModified: now },
    { url: "/terms", changeFrequency: "yearly", priority: 0.3, lastModified: now },
  ];

  const serviceRoutes: Entry[] = services.map((s) => ({
    url: `/services/${s.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const solutionRoutes: Entry[] = solutions.map((s) => ({
    url: `/solutions/${s.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const workRoutes: Entry[] = caseStudies.map((c) => ({
    url: `/work/${c.slug}`,
    lastModified: now,
    changeFrequency: "yearly",
    priority: 0.7,
  }));

  const industryRoutes: Entry[] = industries.map((i) => ({
    url: `/industries/${i.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const blogRoutes: Entry[] = allPosts.map((p) => ({
    url: `/blog/${p.slug}`,
    lastModified: p.publishedAt ? new Date(p.publishedAt) : now,
    changeFrequency: "yearly",
    priority: 0.6,
  }));

  const all: Entry[] = [
    ...staticRoutes,
    ...serviceRoutes,
    ...solutionRoutes,
    ...workRoutes,
    ...industryRoutes,
    ...blogRoutes,
  ];

  return all.map((e) => ({
    url: `${SITE}${e.url === "/" ? "" : e.url}`,
    lastModified: e.lastModified,
    changeFrequency: e.changeFrequency,
    priority: e.priority,
  }));
}
