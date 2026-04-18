import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { blogPosts, getBlogPost } from "@/lib/content/blog";
import { formatDate } from "@/lib/utils";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
  };
}

function renderContent(content: string) {
  const sections = content.trim().split("\n\n");
  return sections.map((section, i) => {
    if (section.startsWith("## ")) {
      return (
        <h2
          key={i}
          style={{ color: "#1e1208" }}
          className="text-2xl font-semibold mt-12 mb-5 first:mt-0"
        >
          {section.replace("## ", "")}
        </h2>
      );
    }
    if (section.startsWith("```")) {
      const lines = section.split("\n");
      const code = lines.slice(1, -1).join("\n");
      return (
        <pre
          key={i}
          style={{
            backgroundColor: "#2a1608",
            color: "#cfa97e",
            border: "1px solid #3e2610",
          }}
          className="text-sm p-5 rounded-lg overflow-x-auto my-6 font-mono"
        >
          <code>{code}</code>
        </pre>
      );
    }
    if (section.startsWith("- ")) {
      const items = section.split("\n").filter((l) => l.startsWith("- "));
      return (
        <ul key={i} className="space-y-2 my-4">
          {items.map((item, j) => (
            <li key={j} className="flex items-start gap-3">
              <span style={{ color: "#cfa97e" }} className="mt-0.5">—</span>
              <span style={{ color: "#7d5c3a" }} className="leading-relaxed">
                {item.replace("- ", "")}
              </span>
            </li>
          ))}
        </ul>
      );
    }
    return (
      <p key={i} style={{ color: "#5c3d1e" }} className="leading-relaxed my-4">
        {section}
      </p>
    );
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  const related = blogPosts
    .filter((p) => p.slug !== slug && p.tags.some((t) => post.tags.includes(t)))
    .slice(0, 3);

  return (
    <div style={{ backgroundColor: "#faf7f2" }}>
      <section style={{ borderBottom: "1px solid #dfc5a5" }} className="py-24">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="mb-6">
            <Link href="/blog" style={{ color: "#9b7653" }} className="text-sm hover:opacity-80">
              ← Blog
            </Link>
          </div>
          <div className="flex flex-wrap gap-2 mb-6">
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
          <h1 style={{ color: "#1e1208" }} className="text-4xl md:text-5xl font-semibold max-w-3xl leading-tight mb-6">
            {post.title}
          </h1>
          <div className="flex items-center gap-4">
            <span style={{ color: "#9b7653" }} className="text-sm">{formatDate(post.date)}</span>
            <span style={{ color: "#cfa97e" }}>·</span>
            <span style={{ color: "#9b7653" }} className="text-sm">{post.readingTime} min read</span>
          </div>
        </div>
      </section>

      <div className="py-20">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid md:grid-cols-3 gap-16">
            <div className="md:col-span-2">
              <p style={{ color: "#7d5c3a" }} className="text-lg leading-relaxed mb-8">
                {post.description}
              </p>
              <div>{renderContent(post.content)}</div>
            </div>
            <div>
              <div
                style={{ backgroundColor: "#f5ede0", border: "1px solid #dfc5a5", borderRadius: "8px" }}
                className="p-6 sticky top-24"
              >
                <h3 style={{ color: "#1e1208" }} className="font-semibold mb-3">
                  Need help with this?
                </h3>
                <p style={{ color: "#9b7653" }} className="text-sm mb-4">
                  If this topic is relevant to a problem you're working on, I'd be happy to discuss it.
                </p>
                <Link
                  href="/contact"
                  style={{ backgroundColor: "#5c3d1e", color: "#faf7f2" }}
                  className="block text-center text-sm font-semibold px-4 py-3 rounded hover:opacity-90 transition-opacity"
                >
                  Get in touch
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section style={{ backgroundColor: "#f5ede0", borderTop: "1px solid #dfc5a5" }} className="py-16">
          <div className="container mx-auto px-6 lg:px-12">
            <h2 style={{ color: "#1e1208" }} className="text-xl font-semibold mb-8">Related articles</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {related.map((p) => (
                <Link
                  key={p.slug}
                  href={`/blog/${p.slug}`}
                  style={{ border: "1px solid #dfc5a5", backgroundColor: "#faf7f2" }}
                  className="group p-6 rounded-lg hover:border-[#9b7653] transition-colors block"
                >
                  <p style={{ color: "#9b7653" }} className="text-xs mb-2">{formatDate(p.date)}</p>
                  <h3 style={{ color: "#1e1208" }} className="font-semibold mb-2 group-hover:text-[#5c3d1e] transition-colors text-sm">
                    {p.title}
                  </h3>
                  <p style={{ color: "#9b7653" }} className="text-xs">{p.readingTime} min read</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
