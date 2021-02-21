import React from "react";
import { Link } from "src/components";
import { PostMetadata } from "src/types/siteData";

export type PostSummaryProps = {
  data: PostMetadata;
};

export function PostSummary({ data }: PostSummaryProps) {
  return <Link href={data.path}>{data.title}</Link>;
}
