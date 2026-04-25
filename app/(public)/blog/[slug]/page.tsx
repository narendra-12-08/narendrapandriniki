import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { allPosts, findPost } from "@/lib/content/blog-adapter";
import { formatDate } from "@/lib/utils";
import Markdown from "@/components/public/Markdown";
import JsonLd from "@/components/seo/JsonLd";
import { articleSchema, breadcrumbSchema } from "@/lib/seo/schema";

export function generateStaticParams() {
  return allPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const post = findPost(slug);
  if (!post) return { title: "Post" };
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      url: `/blog/${post.slug}`,
      publishedTime: post.publishedAt,
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
  };
}

export default async function BlogPostPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const post = findPost(slug);
  if (!post) notFound();

  // Strip leading "# Title" if duplicated in content
  const content = post.content
    .replace(/\r\n/g, "\n")
    .replace(/^\s*#\s+.+\n+/, "");

  const more = allPosts
    .filter((p) => p.slug !== post.slug)
    .slice(0, 3);

  return (
    <div className="bg-grid">
      <JsonLd
        id={`ld-article-${post.slug}`}
        data={articleSchema({
          title: post.title,
          description: post.description,
          datePublished: post.publishedAt,
          slug: post.slug,
        })}
      />
      <JsonLd
        id={`ld-article-breadcrumbs-${post.slug}`}
        data={breadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "Blog", url: "/blog" },
          { name: post.title, url: `/blog/${post.slug}` },
        ])}
      />
      <article>
        <section className="section pb-10">
          <div className="container-page">
            <Link
              href="/blog"
              className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--text-4)] hover:text-[var(--accent)]"
            >
              ← All posts
            </Link>

            <div className="mt-8 max-w-3xl mx-auto">
              <div className="flex flex-wrap gap-1.5 mb-6">
                {post.tags.map((t) => (
                  <span key={t} className="tag">
                    {t}
                  </span>
                ))}
              </div>
              <h1 className="text-4xl md:text-6xl font-semibold tracking-tight leading-[1.08] text-[var(--text)]">
                {post.title}
              </h1>
              <p className="mt-6 text-lg md:text-xl text-[var(--text-2)] leading-relaxed">
                {post.description}
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3 font-mono text-xs uppercase tracking-[0.15em] text-[var(--text-4)]">
                <span>{formatDate(post.publishedAt)}</span>
                <span>·</span>
                <span>{post.readingTime} min read</span>
                {post.category && (
                  <>
                    <span>·</span>
                    <span className="text-[var(--accent)]">{post.category}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="pb-24">
          <div className="container-page">
            <div className="max-w-3xl mx-auto">
              <span className="hairline block mb-10" />
              <Markdown source={content} />

              {post.references && post.references.length > 0 && (
                <div className="mt-16 pt-10 border-t border-[var(--border)]">
                  <span className="eyebrow">References</span>
                  <ol className="mt-5 space-y-2.5 list-decimal pl-5 marker:text-[var(--text-4)] marker:font-mono">
                    {post.references.map((r) => (
                      <li
                        key={r.url}
                        className="text-sm text-[var(--text-2)] pl-2"
                      >
                        <a
                          href={r.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[var(--accent)] underline underline-offset-4 hover:opacity-80"
                        >
                          {r.label}
                        </a>
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          </div>
        </section>
      </article>

      {more.length > 0 && (
        <section className="section border-t border-[var(--border)] bg-[var(--bg-1)]/40">
          <div className="container-page">
            <div className="max-w-3xl mx-auto mb-10">
              <span className="eyebrow">Keep reading</span>
              <h2 className="mt-3 text-3xl md:text-4xl font-semibold tracking-tight text-[var(--text)]">
                More notes.
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {more.map((p) => (
                <Link
                  key={p.slug}
                  href={`/blog/${p.slug}`}
                  className="surface-card p-6 block group transition-transform hover:-translate-y-0.5"
                >
                  <div className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-[var(--accent)]">
                    {p.category ?? p.tags[0] ?? "Notes"}
                  </div>
                  <h3 className="mt-3 text-base font-semibold text-[var(--text)] group-hover:text-[var(--accent)] transition-colors leading-snug">
                    {p.title}
                  </h3>
                  <div className="mt-4 font-mono text-[0.65rem] uppercase tracking-[0.15em] text-[var(--text-4)]">
                    {formatDate(p.publishedAt)} · {p.readingTime}m
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
