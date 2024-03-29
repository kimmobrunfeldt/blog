import React from "react";
import findIndex from "lodash/findIndex";
import { PostMetadata, SiteData } from "src/types/siteData";
import { Footer } from "src/components/Footer";
import { ContentWrapper } from "src/components/ContentWrapper";
import { H } from "src/components/H";
import { NavBar } from "src/components/NavBar";
import { kFormatter, formatPostDate, getPosts } from "src/util/site";
import { cls } from "src/util/tailwind";
import * as twGlobals from "src/twGlobals";
import { PostSummaryLink } from "src/components/PostSummaryLink";
import { SubscribeEnvelope } from "./SubscribeEnvelope";
import { Presentic } from "./Presentic/Presentic";

type Props = {
  children: React.ReactNode;
  data: PostMetadata;
  siteData: SiteData;
};

function findRelated(
  current: PostMetadata,
  allPosts: PostMetadata[]
): {
  next?: PostMetadata;
  previous?: PostMetadata;
} {
  const index = findIndex(allPosts, (post) => post.path === current.path);
  const lastIndex = allPosts.length - 1;
  if (index >= lastIndex) {
    return {
      next: undefined,
      previous: allPosts[index - 1],
    };
  }

  if (index === 0) {
    return {
      next: allPosts[index + 1],
      previous: undefined,
    };
  }

  return {
    next: allPosts[index + 1],
    previous: allPosts[index - 1],
  };
}

const context = {
  slideIndex: 0,
  setSlideIndex: (() => undefined) as (index: number) => any,
};
export const PostContext = React.createContext(context);

export function PostLayout(props: Props): JSX.Element {
  const [slideIndex, setSlideIndex] = React.useState(context.slideIndex);
  const mdxContainerCls = cls(`
    mdx max-w-md
    row-start-2 col-span-12 col-start-1
    sm:col-start-2 sm:col-span-10
    lg:row-start-1 lg:col-start-4 lg:col-span-7
    xl:row-start-1 xl:col-start-5 xl:col-span-6
  `);

  const allPosts = getPosts(props.siteData);
  const { previous, next } = findRelated(props.data, allPosts);
  const readTimeMin = Math.max(Math.round(props.data.readTimeMin), 1);

  return (
    <PostContext.Provider value={{ slideIndex, setSlideIndex }}>
      <div
        className={`grid grid-rows-layout min-h-full w-full ${twGlobals.gap}`}
      >
        <NavBar siteData={props.siteData} pageData={props.data} />
        <ContentWrapper className="relative">
          <main className={`grid grid-cols-12 grid-rows-auto ${twGlobals.gap}`}>
            <div
              className={cls(`
              text-sm mb-10
              row-start-1 col-start-1 col-span-12
              sm:col-start-2 sm:col-span-10
              lg:col-start-2 lg:col-span-2 lg:mb-0
              xl:col-start-3 xl:col-span-2
            `)}
            >
              <div className="text-gray-6 dark:text-gray-4 font-bold text">
                {formatPostDate(props.data.createdAt)}
              </div>
              <ul className="text-gray-5">
                <li>
                  {readTimeMin} {readTimeMin > 1 ? "mins" : "min"}
                </li>
                <li>
                  {props.data.wordCount} words,{" "}
                  {kFormatter(props.data.charCount)} chars
                </li>
              </ul>
              <div className="text-gray-5 mt-4 italic text-xs">
                {props.data.tags.join(", ")}
              </div>
            </div>

            <article className={mdxContainerCls}>
              <H>{props.data.title}</H>

              {props.data.layout === "presentic" && (
                <div
                  style={{ height: "33vh" }}
                  className="sticky pointer-events-none z-10 top-0 left-1/2 dark:bg-gray-9"
                >
                  <Presentic
                    slide={slideIndex}
                    alt="Presentation slides"
                    duration={1200}
                    height="100%"
                    src={props.data.presenticSource}
                  />
                </div>
              )}

              {props.children}
            </article>

            <div
              className={cls(`
              max-w-md
              mt-16
              row-start-3 col-span-12 col-start-1
              sm:col-start-2 sm:col-span-10
              lg:row-start-2 lg:col-start-4 lg:col-span-7
              xl:row-start-2 xl:col-start-5 xl:col-span-6
            `)}
            >
              <div className="space-y-6">
                {next && <PostSummaryLink label="Next" post={next} />}
                {previous && (
                  <PostSummaryLink label="Previous" post={previous} />
                )}
              </div>
            </div>
          </main>

          <SubscribeEnvelope />
        </ContentWrapper>
        <Footer />
      </div>
    </PostContext.Provider>
  );
}
