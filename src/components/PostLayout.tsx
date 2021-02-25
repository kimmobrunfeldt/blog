import React from "react";
import { findIndex } from "lodash";
import { Icon } from "@iconify/react";
import arrowLeftOutline from "@iconify/icons-teenyicons/left-small-outline";
import { isPostPage, PostMetadata, SiteData } from "src/types/siteData";
import { Footer, H, Header, levelToClass, Link } from "src/components";
import { kFormatter, formatPostDate } from "src/util/site";
import { PostSummary } from "./PostSummary";

type PropsWithChildren = {
  children: React.ReactNode;
  data: PostMetadata;
  siteData: SiteData;
};

type PropsWithHtml = {
  html: string;
  data: PostMetadata;
  siteData: SiteData;
};

type Props = PropsWithChildren | PropsWithHtml;

function findRelated(
  current: PostMetadata,
  allPosts: PostMetadata[]
): PostMetadata {
  const index = findIndex(allPosts, (post) => post.path === current.path);
  const lastIndex = allPosts.length - 1;
  const secondLastIndex = lastIndex - 1;
  if (index >= secondLastIndex) {
    const relatedIndex = Math.max(index - 1, 0);
    return allPosts[relatedIndex];
  }

  return allPosts[index + 1];
}

export function PostLayout(props: Props): JSX.Element {
  const mdxContainerCls = "mdx row-start-0 col-span-4 max-w-xl";

  return (
    <div className={`grid grid-rows-layout min-h-full gap-global`}>
      <Header siteData={props.siteData} pageData={props.data} />
      <main className={`grid grid-cols-12 grid-rows-post gap-global`}>
        <div className="row-start-0 col-start-3 col-span-2 text-sm">
          <div className="text-gray-6 font-bold text">
            {formatPostDate(props.data.createdAt)}
          </div>
          <div className="text-gray-5">
            {kFormatter(props.data.charCount)} chars
          </div>
          <div className="text-gray-5 mt-4 italic text-xs">
            {props.data.tags.join(", ")}
          </div>

          <Link className="inline-block pt-7" href="/posts">
            <Icon className="inline-block" icon={arrowLeftOutline} /> Back to
            posts
          </Link>
        </div>

        {"children" in props ? (
          <article className={mdxContainerCls}>{props.children}</article>
        ) : (
          <article className={mdxContainerCls}>
            {/* Frontend hydrate adds an additional div inside article, we must match it */}
            <div dangerouslySetInnerHTML={{ __html: props.html }} />
          </article>
        )}

        <div className="row-start-0 col-start-5 col-span-4 pt-10">
          <Link className="inline-block pt-5" href="/posts">
            <Icon className="inline-block" icon={arrowLeftOutline} /> Back to
            all posts
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
