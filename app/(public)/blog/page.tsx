import type { Metadata } from "next";
import Link from "next/link";
import { blogPosts } from "@/lib/content/blog";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Engineering articles on DevOps, AWS, Kubernetes, Terraform, backend systems, and platform engineering.",
};

export default function BlogPage() {
  const sorted = [...blogPosts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const allTags = Array.from(new Set(blogPosts.flatMap((p) => p.tags))).sort();

  return (
    <div style={{ backgroundColor: "#faf7f2" }}>
      <section style={{ borderBottom: "1px solid #dfc5a5" }} className="py-24">
        <div className="container mx-auto px-6 lg:px-12">
          <p style={{ color: "#9b7653" }} className="text-sm font-semibold uppercase tracking-widest mb-6">
            Blog
          </p>
          <h1 style={{ color: "#1e1208" }} className="text-4xl md:text-5xl font-semibold max-w-2xl leading-tight mb-6">
            Engineering writing
          </h1>
          <p style={{ color: "#7d5c3a" }} className="text-xl max-w-2xl leading-relaxed">
            Articles on cloud infrastructure, platform engineering, backend
            systems, and the operational practices that keep software running
            well.
          </p>
        </div>
      </section>

      <div className="py-20">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid md:grid-cols-4 gap-12">
            <div className="md:col-span-3 space-y-8">
              {sorted.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  style={{ border: "1px solid #dfc5a5" }}
                  className="group flex flex-col sm:flex-row gap-6 p-7 rounded-lg hover:border-[#9b7653] transition-colors block"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-3">
                      <span style={{ color: "#9b7653" }} className="text-sm">
                        {formatDate(post.date)}
                      </span>
                      <span style={{ color: "#cfa97e" }}>·</span>
                      <span style={{ color: "#9b7653" }} className="text-sm">
                        {post.readingTime} min read
                      </span>
                    </div>
                    <h2
                      style={{ color: "#1e1208" }}
                      className="text-xl font-semibold mb-3 group-hover:text-[#5c3d1e] transition-colors"
                    >
                      {post.title}
                    </h2>
                    <p style={{ color: "#7d5c3a" }} className="text-sm leading-relaxed mb-4">
                      {post.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          style={{ backgroundColor: "#ecdcc6", color: "#5c3d1e" }}
                          className="text-xs font-medium px-2 py-1 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div>
              <div
                style={{ border: "1px solid #dfc5a5" }}
                className="p-6 rounded-lg sticky top-24"
              >
                <h3 style={{ color: "#1e1208" }} className="font-semibold mb-4 text-sm uppercase tracking-widest">
                  Topics
                </h3>
                <div className="flex flex-wrap gap-2">
                  {allTags.map((tag) => (
                    <span
                      key={tag}
                      style={{ backgroundColor: "#f5ede0", color: "#5c3d1e", border: "1px solid #dfc5a5" }}
                      className="text-xs font-medium px-3 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
