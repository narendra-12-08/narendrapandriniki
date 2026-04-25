import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getBlogPostBySlug,
  getPublishedBlogPosts,
} from "@/lib/db/content";
import { formatDate } from "@/lib/utils";
import Markdown from "@/components/public/Markdown";
import JsonLd from "@/components/seo/JsonLd";
import { articleSchema, breadcrumbSchema } from "@/lib/seo/schema";

export async function generateStaticParams() {
  const allPosts = await getPublishedBlogPosts();
  return allPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) return { title: "Post" };
  return {
    title: post.title,
    description: post.description ?? undefined,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description ?? undefined,
      url: `/blog/${post.slug}`,
      publishedTime: post.published_at ?? undefined,
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description ?? undefined,
    },
  };
}

export default async function BlogPostPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) notFound();

  // Strip leading "# Title" if duplicated in content
  const content = (post.content ?? "")
    .replace(/\r\n/g, "\n")
    .replace(/^\s*#\s+.+\n+/, "");

  const all = await getPublishedBlogPosts();
  const more = all.filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <div className="bg-grid">
      <JsonLd
        id={`ld-article-${post.slug}`}
        data={articleSchema({
          title: post.title,
          description: post.description ?? "",
          datePublished: post.published_at ?? new Date().toISOString(),
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
                {post.published_at && (
                  <span>{formatDate(post.published_at)}</span>
                )}
                {post.reading_time != null && (
                  <>
                    <span>·</span>
                    <span>{post.reading_time} min read</span>
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

              {/* References were attached to legacy static posts; the
                  managed blog_posts table doesn't carry them. If we
                  bring them back, add a JSONB column + render here. */}
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
                    {p.tags[0] ?? "Notes"}
                  </div>
                  <h3 className="mt-3 text-base font-semibold text-[var(--text)] group-hover:text-[var(--accent)] transition-colors leading-snug">
                    {p.title}
                  </h3>
                  <div className="mt-4 font-mono text-[0.65rem] uppercase tracking-[0.15em] text-[var(--text-4)]">
                    {p.published_at ? formatDate(p.published_at) : ""}
                    {p.reading_time != null ? ` · ${p.reading_time}m` : ""}
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
