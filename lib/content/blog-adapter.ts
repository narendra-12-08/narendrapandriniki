/**
 * Defensive adapter — the blog content module is being rewritten.
 * Use whichever export name is present at module load.
 */
import * as blogModule from "@/lib/content/blog";

type AnyPost = {
  id?: string;
  slug: string;
  title: string;
  description: string;
  content: string;
  tags: string[];
  category?: string;
  publishedAt: string;
  readingTime: number;
  references?: { label: string; url: string }[];
};

const mod = blogModule as unknown as {
  blogPosts?: AnyPost[];
  posts?: AnyPost[];
  getBlogPost?: (slug: string) => AnyPost | undefined;
  getPost?: (slug: string) => AnyPost | undefined;
};

export const allPosts: AnyPost[] = (mod.blogPosts ?? mod.posts ?? []) as AnyPost[];

export function findPost(slug: string): AnyPost | undefined {
  if (mod.getBlogPost) return mod.getBlogPost(slug);
  if (mod.getPost) return mod.getPost(slug);
  return allPosts.find((p) => p.slug === slug);
}

export type { AnyPost as BlogPost };
