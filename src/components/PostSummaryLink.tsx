import React from "react";
import padStart from "lodash/padStart";
import { PostMetadata } from "src/types/siteData";

export type PostSummaryLinkProps = {
  post: PostMetadata;
  label: string;
};

type OrderNumProps = JSX.IntrinsicElements["span"] & {
  orderNumber: number;
  className?: string;
};

const OrderNum = ({ orderNumber, className, ...otherProps }: OrderNumProps) => (
  <span
    style={{ top: "-2px" }}
    className={`relative inline-block mr-2 sm:mr-4 font-heading text-xl text-gray-7 dark:text-gray-4 ${className}`}
    {...otherProps}
  >
    {padStart(`${orderNumber}`, 2, "0")}
  </span>
);

export function PostSummaryLink({ post, label }: PostSummaryLinkProps) {
  return (
    <div className="w-full max-w-xl">
      <span
        style={{ left: "44px" }}
        className="relative mb-3 mt-0 font-heading text-l font-bold text-gray-4"
      >
        {label}
      </span>

      <a
        href={post.path}
        className="cursor-pointer flex flex-row underline-effect-trigger children:min-w-0"
      >
        <OrderNum
          orderNumber={post.orderNumber}
          className="underline-effect flex-shrink-0"
        />

        <span
          style={{ lineHeight: "1.2" }}
          className="mb-3 mt-0 max-w-xs font-heading text-2xl font-black"
        >
          {post.title}
        </span>
      </a>
      {/*
      <div
        style={{ left: "44px", height: "2px", width: "65px" }}
        className="relative bg-rust-6"
      />
      */}
    </div>
  );
}
