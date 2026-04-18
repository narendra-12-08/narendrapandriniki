import type { Metadata } from "next";
import { blogPosts } from "@/lib/content/blog";
import { formatDate } from "@/lib/utils";
import Link from "next/link";

export const metadata: Metadata = { title: "Blog" };

export default function AdminBlogPage() {
  const sorted = [...blogPosts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div style={{ padding: "2rem" }}>
      <div className="mb-8">
        <h1 style={{ color: "#faf7f2" }} className="text-2xl font-semibold">Blog Posts</h1>
        <p style={{ color: "#9b7653" }} className="text-sm mt-1">{blogPosts.length} posts (static content)</p>
      </div>

      <div style={{ backgroundColor: "#2a1608", border: "1px solid #3e2610" }} className="rounded-lg overflow-hidden">
        {sorted.map((post) => (
          <div key={post.slug} style={{ borderBottom: "1px solid #3e2610" }} className="p-5 flex items-center justify-between last:border-0">
            <div>
              <p style={{ color: "#faf7f2" }} className="font-medium text-sm">{post.title}</p>
              <p style={{ color: "#9b7653" }} className="text-xs mt-0.5">
                {formatDate(post.date)} · {post.readingTime} min · {post.tags.join(", ")}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span style={{ backgroundColor: "#1a3a1a", color: "#4ade80" }} className="text-xs px-2 py-0.5 rounded">Published</span>
              <Link
                href={`/blog/${post.slug}`}
                target="_blank"
                style={{ color: "#9b7653" }}
                className="text-xs hover:opacity-80"
              >
                View ↗
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
