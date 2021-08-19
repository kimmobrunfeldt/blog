import React from "react";
import padStart from "lodash/padStart";
import { PostMetadata } from "src/types/siteData";

export type PostSummaryLinkProps = {
  post: PostMetadata;
  label: string;
};

export function PostSummaryLink({ post, label }: PostSummaryLinkProps) {
  return (
    <div className="max-w-xs">
      <a href={post.path} className="cursor-pointer underline-effect-trigger">
        <span className="underline-effect inline-block relative mb-1 mt-0 font-heading text-l font-bold text-gray-4">
          {label}
        </span>

        <div
          style={{ lineHeight: "1.2" }}
          className="mb-3 mt-0 font-heading text-2xl font-black"
        >
          {post.title}
        </div>
      </a>
    </div>
  );
}
