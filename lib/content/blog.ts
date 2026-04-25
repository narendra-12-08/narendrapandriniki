import { part1, type BlogPostDraft } from "./_blog_part1";

export type BlogPost = BlogPostDraft;

export const posts: BlogPost[] = [...part1].sort((a, b) =>
  b.publishedAt.localeCompare(a.publishedAt)
);

export const blogPosts: BlogPost[] = posts;

export function getPost(slug: string): BlogPost | undefined {
  return posts.find((p) => p.slug === slug);
}

export function getBlogPost(slug: string): BlogPost | undefined {
  return getPost(slug);
}
