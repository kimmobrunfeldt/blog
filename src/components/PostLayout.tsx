import React from "react";
import findIndex from "lodash/findIndex";
import { Icon } from "@iconify/react";
import arrowLeftOutline from "@iconify/icons-teenyicons/left-small-outline";
import { isPostPage, PostMetadata, SiteData } from "src/types/siteData";
import { Footer } from "src/components/Footer";
import { ContentWrapper } from "src/components/ContentWrapper";
import { H } from "src/components/H";
import { Link } from "src/components/Link";
import { NavBar } from "src/components/NavBar";
import { kFormatter, formatPostDate } from "src/util/site";
import { cls } from "src/util/tailwind";
import * as twGlobals from "src/twGlobals";

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
  const mdxContainerCls = cls(`
    mdx max-w-md
    row-start-2 col-span-12 col-start-1
    sm:col-start-2 sm:col-span-10
    lg:row-start-1 lg:col-start-4 lg:col-span-7
    xl:row-start-1 xl:col-start-5 xl:col-span-6
  `);

  return (
    <div className={`grid grid-rows-layout min-h-full ${twGlobals.gap}`}>
      <NavBar siteData={props.siteData} pageData={props.data} />
      <ContentWrapper>
        <main
          className={`grid grid-cols-12 grid-rows-auto-sm lg:grid-rows-auto ${twGlobals.gap}`}
        >
          <div
            className={cls(`
              text-sm mb-10
              row-start-1 col-start-1 col-span-12
              sm:col-start-2 sm:col-span-10
              lg:col-start-2 lg:col-span-2 lg:mb-0
              xl:col-start-3 xl:col-span-2
            `)}
          >
            <div className="text-gray-6 font-bold text">
              {formatPostDate(props.data.createdAt)}
            </div>
            <div className="text-gray-5">
              {kFormatter(props.data.charCount)} chars
            </div>
            <div className="text-gray-5 mt-4 italic text-xs">
              {props.data.tags.join(", ")}
            </div>
          </div>

          {"children" in props ? (
            <article className={mdxContainerCls}>
              <H>{props.data.title}</H>
              {props.children}
            </article>
          ) : (
            <article className={mdxContainerCls}>
              <H>{props.data.title}</H>
              {/* Frontend hydrate adds an additional div inside article, we must match it */}
              <div dangerouslySetInnerHTML={{ __html: props.html }} />
            </article>
          )}

          <div
            className={cls(`
              row-start-3 col-start-1 col-span-12
              sm:col-start-2 sm:col-span-10
              lg:row-start-2 lg:col-start-4 lg:col-span-5
              xl:row-start-2 xl:col-start-5 xl:col-span-4
            `)}
          >
            <Link className="inline-block pt-5" href="/posts">
              <Icon className="inline-block" icon={arrowLeftOutline} /> Back to
              all posts
            </Link>
          </div>
        </main>
      </ContentWrapper>
      <Footer />
    </div>
  );
}
