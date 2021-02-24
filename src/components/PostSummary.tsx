import React from "react";
import { padStart } from "lodash";
import { Icon } from "@iconify/react";
import arrowRightOutline from "@iconify/icons-teenyicons/right-small-outline";
import { Link, H } from "src/components";
import { PostMetadata } from "src/types/siteData";
import { kFormatter, formatPostDate } from "src/util/site";

export type PostSummaryProps = {
  post: PostMetadata;
};

export function PostSummary({ post }: PostSummaryProps) {
  return (
    <a
      href={post.path}
      className="w-full cursor-pointer flex flex-row underline-effect-trigger"
    >
      <div>
        <span className="relative underline-effect inline-block -top-0.5 mr-4 font-heading text-3xl text-gray-7">
          {padStart(`${post.orderNumber}`, 2, "0")}
        </span>
      </div>

      <div>
        <H className="mb-3 mt-0" visualLevel={2}>
          {post.title}
        </H>

        <p className="mb-3">{post.description}</p>

        <div className="flex flex-row items-center space-x-2 text-xs text-gray-5 mb-2">
          <time dateTime={post.createdAt}>
            {formatPostDate(post.createdAt)}
          </time>
          <span>&middot;</span>
          <span>{kFormatter(post.charCount)} chars</span>
          <span>&middot;</span>
          <span>{post.tags.join(", ")}</span>
        </div>

        {/*<Link underline={false} href={post.path}>
          Read more <Icon className="inline-block" icon={arrowRightOutline} />
        </Link>*/}
      </div>
    </a>
  );
}
