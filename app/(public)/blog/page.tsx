import type { Metadata } from "next";
import Link from "next/link";
import { getPublishedBlogPosts } from "@/lib/db/content";
import type { BlogPostRow } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Notes on DevOps, platform engineering, Kubernetes operations, observability, and the boring infrastructure of running production systems.",
};

export default async function BlogIndexPage() {
  const all = await getPublishedBlogPosts();
  const sorted = [...all].sort((a, b) => {
    const at = a.published_at ? new Date(a.published_at).getTime() : 0;
    const bt = b.published_at ? new Date(b.published_at).getTime() : 0;
    return bt - at;
  });

  // Group by year if more than 15 posts
  const groupByYear = sorted.length > 15;
  const grouped: Record<string, BlogPostRow[]> = {};
  if (groupByYear) {
    for (const p of sorted) {
      const year = p.published_at
        ? new Date(p.published_at).getFullYear().toString()
        : "—";
      (grouped[year] ??= []).push(p);
    }
  }

  return (
    <div className="bg-grid">
      <section className="section pb-12">
        <div className="container-page">
          <span className="eyebrow">Writing</span>
          <h1 className="mt-6 text-5xl md:text-7xl font-semibold tracking-tight leading-[1.05] text-[var(--text)] max-w-4xl">
            Notes from the{" "}
            <span className="gradient-text">on-call rotation.</span>
          </h1>
          <p className="mt-8 max-w-2xl text-lg text-[var(--text-2)] leading-relaxed">
            Things I&apos;ve learned, written down so I don&apos;t have to
            relearn them. Long-form, opinionated, no SEO bait.
          </p>
        </div>
      </section>

      <section className="pb-32">
        <div className="container-page">
          {groupByYear ? (
            <div className="space-y-16">
              {Object.entries(grouped)
                .sort(([a], [b]) => Number(b) - Number(a))
                .map(([year, posts]) => (
                  <div key={year}>
                    <div className="mb-8 flex items-center gap-4">
                      <h2 className="font-mono text-2xl text-[var(--text-4)]">
                        {year}
                      </h2>
                      <span className="hairline flex-1" />
                      <span className="font-mono text-xs text-[var(--text-4)]">
                        {posts.length} posts
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                      {posts.map((p) => (
                        <PostCard key={p.slug} post={p} />
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {sorted.map((p) => (
                <PostCard key={p.slug} post={p} />
              ))}
            </div>
          )}

          {sorted.length === 0 && (
            <div className="surface-card p-12 text-center">
              <p className="text-[var(--text-3)]">No posts yet.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function PostCard({ post }: { post: BlogPostRow }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="surface-card group p-7 block transition-transform hover:-translate-y-0.5"
    >
      <div className="flex items-center justify-between gap-3">
        <span className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-[var(--accent)]">
          {post.tags[0] ?? "Notes"}
        </span>
        <span className="font-mono text-[0.65rem] text-[var(--text-4)]">
          {post.reading_time ?? "—"}m read
        </span>
      </div>
      <h3 className="mt-4 text-lg font-semibold text-[var(--text)] group-hover:text-[var(--accent)] transition-colors leading-snug">
        {post.title}
      </h3>
      <p className="mt-3 text-sm text-[var(--text-3)] leading-relaxed line-clamp-3">
        {post.description}
      </p>
      <div className="mt-5 pt-5 border-t border-[var(--border)] flex items-center justify-between">
        <span className="font-mono text-[0.65rem] uppercase tracking-[0.15em] text-[var(--text-4)]">
          {post.published_at ? formatDate(post.published_at) : ""}
        </span>
        <span className="font-mono text-xs text-[var(--accent)] opacity-0 group-hover:opacity-100 transition-opacity">
          →
        </span>
      </div>
    </Link>
  );
}
