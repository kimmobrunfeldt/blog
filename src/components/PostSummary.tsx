import React from "react";
import { Link, H } from "src/components";
import { PostMetadata } from "src/types/siteData";
import { kFormatter, formatPostDate } from "src/util/site";

export type PostSummaryProps = {
  post: PostMetadata;
};

export function PostSummary({ post }: PostSummaryProps) {
  return (
    <div className="w-full">
      <H className="mb-3" visualLevel={2}>
        {post.title}
      </H>
      <p className="mb-3">{post.description}</p>

      <div className="flex flex-row items-center justify-between text-xs text-gray-5">
        <div className="flex flex-row items-center space-x-1">
          <time dateTime={post.createdAt}>
            {formatPostDate(post.createdAt)}
          </time>
          <span>&middot;</span>
          <span>{kFormatter(post.charCount)} chars</span>
        </div>

        <span>{post.tags.join(", ")}</span>
      </div>

      <Link href={post.path}>Read more</Link>
    </div>
  );
}
