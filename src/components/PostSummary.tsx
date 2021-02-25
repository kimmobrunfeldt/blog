import React from "react";
import { padStart } from "lodash";
import { Icon } from "@iconify/react";
import arrowRightOutline from "@iconify/icons-teenyicons/right-small-outline";
import { Link, H, Chip } from "src/components";
import { PostMetadata } from "src/types/siteData";
import { kFormatter, formatPostDate } from "src/util/site";

export type PostSummaryProps = {
  post: PostMetadata;
};

type OrderNumProps = JSX.IntrinsicElements["span"] & {
  orderNumber: number;
  className?: string;
};

const OrderNum = ({ orderNumber, className, ...otherProps }: OrderNumProps) => (
  <span
    style={{ top: "-3px" }}
    className={`relative inline-block mr-5 font-heading text-3xl text-gray-7 ${className}`}
    {...otherProps}
  >
    {padStart(`${orderNumber}`, 2, "0")}
  </span>
);

export function PostSummary({ post }: PostSummaryProps) {
  return (
    <div className="w-full">
      <a
        href={post.path}
        className="cursor-pointer flex flex-row underline-effect-trigger"
      >
        <OrderNum orderNumber={post.orderNumber} className="underline-effect" />

        <H className="mb-3 mt-0" visualLevel={2}>
          {post.title}
        </H>
      </a>

      <div className="flex flex-row">
        <OrderNum
          aria-hidden
          orderNumber={post.orderNumber}
          className="invisible"
        />

        <div>
          <p className="mb-3">{post.description}</p>

          <div className="flex flex-row items-center space-x-2 text-xs text-gray-6 mb-2">
            <time dateTime={post.createdAt}>
              {formatPostDate(post.createdAt)}
            </time>
            <span>&middot;</span>
            <span>{kFormatter(post.charCount)} chars</span>
            <span>&middot;</span>
            <ul className="text-gray-5 space-x-2 flex flex-row">
              {post.tags.map((tag) => (
                <li key={tag}>
                  <Chip>{tag}</Chip>
                </li>
              ))}
            </ul>
          </div>

          <Link href={post.path}>
            Read more <Icon className="inline-block" icon={arrowRightOutline} />
          </Link>
        </div>
      </div>
    </div>
  );
}
