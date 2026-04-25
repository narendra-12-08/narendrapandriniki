import type { Metadata } from "next";
import { Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";
import { upsertBlogPost, deleteBlogPost } from "@/app/control/actions";
import {
  Badge,
  Card,
  Empty,
  Field,
  GhostButton,
  Input,
  PageHeader,
  PrimaryButton,
  Textarea,
} from "@/components/admin/ui";
import Collapsible from "@/components/admin/Collapsible";
import type { BlogPostRow } from "@/lib/types";

export const metadata: Metadata = { title: "Blog" };

function PostForm({ post }: { post?: BlogPostRow }) {
  return (
    <form action={upsertBlogPost} className="space-y-4">
      {post && <input type="hidden" name="id" value={post.id} />}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Title *">
          <Input name="title" required defaultValue={post?.title ?? ""} />
        </Field>
        <Field label="Slug" hint="Leave empty to auto-generate from title">
          <Input name="slug" defaultValue={post?.slug ?? ""} />
        </Field>
      </div>
      <Field label="Description">
        <Input name="description" defaultValue={post?.description ?? ""} />
      </Field>
      <Field label="Content (markdown)">
        <Textarea
          name="content"
          rows={10}
          defaultValue={post?.content ?? ""}
        />
      </Field>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Field label="Tags" hint="Comma-separated">
          <Input name="tags" defaultValue={post?.tags?.join(", ") ?? ""} />
        </Field>
        <Field label="Reading time (mins)">
          <Input
            type="number"
            name="reading_time"
            defaultValue={post?.reading_time ?? 5}
          />
        </Field>
        <Field label="Published">
          <label className="inline-flex items-center gap-2 mt-1">
            <input
              type="checkbox"
              name="published"
              defaultChecked={post?.published ?? false}
              className="h-4 w-4 accent-[var(--accent)]"
            />
            <span className="text-sm text-[var(--text-2)]">
              Publish immediately
            </span>
          </label>
        </Field>
      </div>
      <div className="flex items-center justify-between gap-2 pt-2">
        <PrimaryButton type="submit">
          {post ? "Save changes" : "Create post"}
        </PrimaryButton>
        {post && (
          <form action={deleteBlogPost}>
            <input type="hidden" name="id" value={post.id} />
            <GhostButton
              type="submit"
              className="!text-[var(--rose)] hover:!bg-[var(--rose)]/10 hover:!border-[var(--rose)]/30"
            >
              <Trash2 size={14} /> Delete
            </GhostButton>
          </form>
        )}
      </div>
    </form>
  );
}

export default async function AdminBlogPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("blog_posts")
    .select("*")
    .order("created_at", { ascending: false });
  const posts = (data ?? []) as BlogPostRow[];

  return (
    <>
      <PageHeader
        title="Blog"
        subtitle={`${posts.length} post${posts.length === 1 ? "" : "s"}`}
      />

      <div className="mb-6">
        <Collapsible summary={<span className="font-medium text-[var(--text)]">+ New post</span>}>
          <PostForm />
        </Collapsible>
      </div>

      {posts.length > 0 ? (
        <ul className="space-y-3">
          {posts.map((post) => (
            <li key={post.id}>
              <Collapsible
                summary={
                  <div className="flex items-center justify-between gap-3 w-full">
                    <span className="text-sm text-[var(--text)] truncate">
                      {post.title}
                    </span>
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge tone={post.published ? "lime" : "default"}>
                        {post.published ? "published" : "draft"}
                      </Badge>
                      <span className="text-xs text-[var(--text-4)]">
                        {formatDate(post.created_at)}
                      </span>
                    </div>
                  </div>
                }
              >
                <PostForm post={post} />
              </Collapsible>
            </li>
          ))}
        </ul>
      ) : (
        <Card>
          <Empty title="No posts yet" hint="Use the form above to create one" />
        </Card>
      )}
    </>
  );
}
