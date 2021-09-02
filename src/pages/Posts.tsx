import React from "react";
import { isPostPage, PageMetadata, SiteData } from "src/types/siteData";
import { NavBar } from "src/components/NavBar";
import { Footer } from "src/components/Footer";
import { PostSummary } from "src/components/PostSummary";
import { ContentWrapper } from "src/components/ContentWrapper";
import * as twGlobals from "src/twGlobals";

type Props = {
  siteData: SiteData;
  pageData: PageMetadata;
};

function Posts(props: Props): JSX.Element {
  const postPages = props.siteData.pages
    .filter(isPostPage)
    .filter((p) => !p.data.preview)
    .reverse();
  return (
    <div className={`grid grid-rows-layout min-h-full ${twGlobals.gap}`}>
      <NavBar siteData={props.siteData} pageData={props.pageData} />
      <main className={`grid grid-cols-12 ${twGlobals.gap}`}>
        <div className="col-span-12 sm:col-start-2 sm:col-span-10 md:col-start-2 md:col-span-9 xl:col-start-3 xl:col-span-8">
          <ContentWrapper>
            <ol reversed className="space-y-8">
              {postPages.map((page) => {
                return (
                  <li className="mb-paragraph" key={page.data.path}>
                    <PostSummary post={page.data} />
                  </li>
                );
              })}
            </ol>
          </ContentWrapper>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export async function getData(): Promise<PageMetadata> {
  return {
    title: "Posts",
    path: "/posts/",
    tags: [
      "blog",
      "tech",
      "typescript",
      "react",
      "frontend",
      "software development",
      "web development",
    ],
    description:
      "All the latest posts. This blog is about web-focused software development with a hint of business, design, and tiny perfect details.",
  };
}

export default Posts;
