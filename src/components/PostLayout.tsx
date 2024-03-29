import React from "react";
import defaultTheme from "tailwindcss/defaultTheme";
import findIndex from "lodash/findIndex";
import { PostMetadata, SiteData } from "src/types/siteData";
import { Footer } from "src/components/Footer";
import { ContentWrapper } from "src/components/ContentWrapper";
import { H } from "src/components/H";
import { NavBar } from "src/components/NavBar";
import {
  kFormatter,
  formatPostDate,
  getPosts,
  addMediaListener,
  removeMediaListener,
  safeMatchesMediaQuery,
} from "src/util/site";
import { cls } from "src/util/tailwind";
import * as twGlobals from "src/twGlobals";
import { PostSummaryLink } from "src/components/PostSummaryLink";
import { SubscribeEnvelope } from "./SubscribeEnvelope";
import { Presentic } from "./Presentic/Presentic";
import { TableOfContents } from "./TableOfContents";
import { Collapse } from "react-collapse";
import rightIcon from "@iconify/icons-teenyicons/right-outline";
import { Link } from ".";
import Icon from "@iconify/react";

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
  setSlideIndex: (() => undefined) as (index: number) => void,
};
export const PostContext = React.createContext(context);

export function PostLayout(props: Props): JSX.Element {
  const [slideIndex, setSlideIndex] = React.useState(context.slideIndex);
  const ctx = React.useMemo(() => ({ slideIndex, setSlideIndex }), [
    slideIndex,
  ]);

  const [isLargeScreen, setIsLargeScreen] = React.useState(
    safeMatchesMediaQuery(`(min-width: ${(defaultTheme as any).screens.lg})`)
  );
  const [tocOpen, setTocOpen] = React.useState(false);
  const toggleTocOpen = () => setTocOpen(!tocOpen);

  React.useEffect(() => {
    const darkQuery = window.matchMedia(
      `(min-width: ${(defaultTheme as any).screens.lg})`
    );
    const cb = (event: MediaQueryListEvent) => {
      setIsLargeScreen(event.matches ? true : false);
    };

    addMediaListener(darkQuery, cb);
    return () => {
      removeMediaListener(darkQuery, cb);
    };
  }, []);

  const allPosts = getPosts(props.siteData);
  const { previous, next } = findRelated(props.data, allPosts);
  const readTimeMin = Math.max(Math.round(props.data.readTimeMin), 1);

  return (
    <PostContext.Provider value={ctx}>
      <div
        className={`grid grid-rows-layout min-h-full w-full ${twGlobals.gap}`}
      >
        <NavBar
          presenticLayout={props.data.layout === "presentic"}
          tocLayout={props.data.showToc}
          siteData={props.siteData}
          pageData={props.data}
        />
        <ContentWrapper>
          <main className={`grid grid-cols-12 grid-rows-auto ${twGlobals.gap}`}>
            <div
              className={cls(
                props.data.layout === "presentic"
                  ? `
                    text-sm mb-12
                    row-start-1 col-start-1 col-span-12
                    sm:col-start-2 sm:col-span-10
                    lg:col-start-2 lg:col-span-2 lg:mb-0
                    xl:col-start-2 xl:col-span-3
                    2xl:col-start-3 2xl:col-span-2
                    `
                  : `
                    text-sm mb-10
                    row-start-1 col-start-1 col-span-12
                    sm:col-start-2 sm:col-span-10
                    ${
                      props.data.showToc
                        ? `
                          lg:col-start-2 lg:col-span-3 lg:mb-0
                          xl:col-start-2 xl:col-span-3
                        `
                        : `
                          lg:col-start-2 lg:col-span-2 lg:mb-0
                          xl:col-start-3 xl:col-span-2
                        `
                    }
                    `
              )}
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
              <div className="text-gray-5 mt-4 italic text-xs max-w-[250px]">
                {props.data.tags.join(", ")}
              </div>

              {props.data.layout === "presentic" && (
                <H className={"hidden mb-0 xl:block"}>{props.data.title}</H>
              )}

              {props.data.showToc && (
                <div className="sticky top-6 mt-8">
                  <Link
                    className="flex items-center lg:hidden mb-3"
                    onClick={toggleTocOpen}
                  >
                    <span className="pr-2">Show table of contents</span>
                    <Icon
                      height={12}
                      className={tocOpen ? "rotate-90" : ""}
                      icon={rightIcon}
                    />
                  </Link>

                  {isLargeScreen ? (
                    <TableOfContents headers={props.data.headers} />
                  ) : (
                    <Collapse isOpened={tocOpen}>
                      <TableOfContents headers={props.data.headers} />
                    </Collapse>
                  )}
                </div>
              )}
            </div>

            <article
              className={cls(
                props.data.layout === "presentic"
                  ? `
                    mdx max-w-[620px]
                    row-start-2 col-span-12 col-start-1
                    sm:col-start-2 sm:col-span-10
                    lg:row-start-1 lg:col-start-4 lg:col-span-7
                    xl:row-start-2 xl:col-start-2 xl:col-span-10
                    xl:flex xl:flex-row-reverse xl:justify-end
                    xl:max-w-full
                    2xl:col-start-3 2xl:col-span-9
                    `
                  : `
                    mdx max-w-[620px]
                    row-start-2 col-span-12 col-start-1
                    sm:col-start-2 sm:col-span-10
                    ${
                      props.data.showToc
                        ? `
                          lg:row-start-1 lg:col-start-5 lg:col-span-7
                          xl:row-start-1 xl:col-start-5 xl:col-span-7
                        `
                        : `
                          lg:row-start-1 lg:col-start-4 lg:col-span-7
                          xl:row-start-1 xl:col-start-5 xl:col-span-6
                        `
                    }
                    `
              )}
            >
              {
                <H
                  className={cls(
                    props.data.layout === "presentic" ? `block xl:hidden` : ``
                  )}
                >
                  {props.data.title}
                </H>
              }

              {props.data.layout === "presentic" && (
                <div
                  style={{ height: "33vh" }}
                  className={cls(`
                    sticky
                    flex-1
                    pointer-events-none z-10
                    top-0
                    pt-2
                    pb-1
                    mb-paragraph
                    max-w-[750px]
                    -mx-2 md:-mx-4
                    bg-white dark:bg-gray-9
                    xl:-mx-0
                    xl:row-start-1 xl:col-start-7 xl:col-span-6
                    xl:top-[20%]
                    xl:ml-8
                  `)}
                >
                  <div
                    className={cls(`
                      h-full w-full
                      p-2 md:p-3
                      border rounded-md border-rust-6 border-opacity-30
                    `)}
                  >
                    <Presentic
                      className="mt-0 mb-0 h-full"
                      svgContainerClassName="h-full"
                      slide={ctx.slideIndex}
                      alt="Presentation slides"
                      duration={1200}
                      height="100%"
                      src={props.data.presenticSource}
                    />
                  </div>
                </div>
              )}

              <div className="overflow-x-hidden flex-1 xl:max-w-lg xl:w-full">
                {props.children}
              </div>
            </article>

            <div
              className={cls(
                props.data.layout === "presentic"
                  ? `
                    max-w-md
                    mt-16
                    row-start-3 col-span-12 col-start-1
                    sm:col-start-2 sm:col-span-10
                    lg:row-start-2 lg:col-start-4 lg:col-span-7
                    xl:row-start-3 xl:col-start-5 xl:col-span-6
                    `
                  : `
                    max-w-md
                    mt-16
                    row-start-3 col-span-12 col-start-1
                    sm:col-start-2 sm:col-span-10
                    lg:row-start-2 lg:col-start-4 lg:col-span-7
                    xl:row-start-2 xl:col-start-5 xl:col-span-6
                    `
              )}
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
