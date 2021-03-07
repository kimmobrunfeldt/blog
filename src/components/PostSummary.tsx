import React from "react";
import padStart from "lodash/padStart";
import { Icon } from "@iconify/react";
import arrowRightOutline from "@iconify/icons-teenyicons/right-small-outline";
import { Link } from "src/components/Link";
import { H } from "src/components/H";
import { Chip } from "src/components/Chip";
import { PostMetadata } from "src/types/siteData";
import { kFormatter, formatPostDate } from "src/util/site";
import { cls } from "src/util/tailwind";

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
    className={`relative inline-block mr-3 sm:mr-5 font-heading text-3xl text-gray-7 dark:text-gray-4 ${className}`}
    {...otherProps}
  >
    {padStart(`${orderNumber}`, 2, "0")}
  </span>
);

export function PostSummary({ post }: PostSummaryProps) {
  return (
    <div className="w-full max-w-xl">
      <a
        href={post.path}
        className="cursor-pointer flex flex-row underline-effect-trigger children:min-w-0"
      >
        <OrderNum
          orderNumber={post.orderNumber}
          className="underline-effect flex-shrink-0"
        />

        <H className="mb-3 mt-0" visualLevel={2}>
          {post.title}
        </H>
      </a>

      <div className="flex flex-row">
        <OrderNum
          aria-hidden
          orderNumber={post.orderNumber}
          className="invisible flex-shrink-0"
        />

        <div className="min-w-0">
          <p className="mb-2">{post.description}</p>

          <ul className="text-gray-6 dark:text-gray-4 mb-5 children:inline-block children:mr-2 children:mb-0.5">
            {post.tags.map((tag) => (
              <li key={tag}>
                <Chip>{tag}</Chip>
              </li>
            ))}
          </ul>

          <div
            className={cls(`
              text-xs text-gray-5 mb-5 children:min-w-0
              flex flex-col space-y-2
              sm:space-y-0 sm:flex-row sm:items-center sm:space-x-2
            `)}
          >
            <div className="space-x-2 sm:flex sm:flex-row children:min-w-0">
              <time dateTime={post.createdAt} className="whitespace-nowrap">
                {formatPostDate(post.createdAt)}
              </time>
              <span aria-hidden>&middot;</span>
              <span className="whitespace-nowrap">
                {kFormatter(post.charCount)} chars
              </span>
            </div>
            <span aria-hidden className="hidden sm:inline-block">
              &middot;
            </span>

            <Link className="whitespace-nowrap" href={post.path}>
              Read more{" "}
              <Icon className="inline-block" icon={arrowRightOutline} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
