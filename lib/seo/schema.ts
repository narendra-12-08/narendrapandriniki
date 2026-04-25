/**
 * Schema.org JSON-LD builders for narendrapandrinki.com.
 * All builders return plain JSON-serialisable objects.
 */

export const SITE_URL = "https://narendrapandrinki.com";
export const SITE_NAME = "Narendra Pandrinki";
export const OWNER_EMAIL = "hello@narendrapandrinki.com";

const KNOWS_ABOUT = [
  "DevOps",
  "Platform Engineering",
  "Site Reliability Engineering",
  "Kubernetes",
  "Amazon Web Services",
  "Google Cloud Platform",
  "Microsoft Azure",
  "Terraform",
  "CI/CD",
  "Observability",
  "FinOps",
  "Cloud Security",
  "Internal Developer Platforms",
  "Infrastructure as Code",
];

export function personSchema(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${SITE_URL}/#person`,
    name: "Narendra Pandrinki",
    givenName: "Narendra",
    familyName: "Pandrinki",
    url: SITE_URL,
    email: `mailto:${OWNER_EMAIL}`,
    jobTitle: "DevOps & Platform Engineer",
    description:
      "Independent DevOps and platform engineer working with engineering teams globally — cloud infrastructure, Kubernetes platforms, CI/CD, observability, and FinOps.",
    sameAs: [SITE_URL],
    knowsAbout: KNOWS_ABOUT,
  };
}

export function websiteSchema(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: SITE_NAME,
    url: SITE_URL,
    description:
      "Independent DevOps and platform engineering — cloud infrastructure, Kubernetes, CI/CD, observability, FinOps.",
    inLanguage: "en-GB",
    publisher: { "@id": `${SITE_URL}/#person` },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

/**
 * Organization-style alias of the practice. Useful for Google's Organization
 * panel even though the operation is a single individual.
 */
export function organizationSchema(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: SITE_URL,
    email: `mailto:${OWNER_EMAIL}`,
    description:
      "Independent DevOps and platform engineering practice run by Narendra Pandrinki.",
    founder: { "@id": `${SITE_URL}/#person` },
    sameAs: [SITE_URL],
  };
}

export function professionalServiceSchema(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${SITE_URL}/#service`,
    name: SITE_NAME,
    url: SITE_URL,
    email: `mailto:${OWNER_EMAIL}`,
    description:
      "Independent DevOps and platform engineering — cloud infrastructure, Kubernetes platforms, CI/CD, observability, FinOps.",
    provider: { "@id": `${SITE_URL}/#person` },
    areaServed: {
      "@type": "Place",
      name: "Worldwide",
    },
    serviceType: [
      "DevOps Engineering",
      "Platform Engineering",
      "Site Reliability Engineering",
      "Cloud Architecture",
      "Kubernetes Consulting",
      "CI/CD Engineering",
    ],
    knowsAbout: KNOWS_ABOUT,
  };
}

export function breadcrumbSchema(
  items: { name: string; url: string }[]
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${SITE_URL}${item.url}`,
    })),
  };
}

export function articleSchema(post: {
  title: string;
  description: string;
  datePublished: string;
  dateModified?: string;
  slug: string;
}): Record<string, unknown> {
  const url = `${SITE_URL}/blog/${post.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.datePublished,
    dateModified: post.dateModified ?? post.datePublished,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
    author: { "@id": `${SITE_URL}/#person` },
    publisher: { "@id": `${SITE_URL}/#person` },
    image: [`${SITE_URL}/blog/${post.slug}/opengraph-image`],
  };
}

export function serviceSchema(service: {
  name: string;
  description: string;
  slug: string;
}): Record<string, unknown> {
  const url = `${SITE_URL}/services/${service.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    description: service.description,
    url,
    provider: { "@id": `${SITE_URL}/#person` },
    areaServed: { "@type": "Place", name: "Worldwide" },
    serviceType: service.name,
  };
}

export function faqSchema(
  items: { question: string; answer: string }[]
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((it) => ({
      "@type": "Question",
      name: it.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: it.answer,
      },
    })),
  };
}
