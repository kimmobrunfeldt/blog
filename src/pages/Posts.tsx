import React from "react";
import { isPostPage, PageMetadata, SiteData } from "src/types/siteData";
import { Header, Footer, PostSummary } from "src/components";

type Props = {
  siteData: SiteData;
  pageData: PageMetadata;
};

function Posts(props: Props): JSX.Element {
  const postPages = props.siteData.pages.filter(isPostPage);
  return (
    <div className={`grid grid-rows-layout min-h-full gap-global`}>
      <Header siteData={props.siteData} pageData={props.pageData} />
      <main className={`grid grid-cols-12 gap-global`}>
        <div className="col-start-3 col-span-6">
          <ol className="space-y-20">
            {postPages.map((page) => {
              return (
                <li className="mb-paragraph" key={page.data.path}>
                  <PostSummary post={page.data} />
                </li>
              );
            })}
          </ol>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export async function getData(): Promise<PageMetadata> {
  return {
    title: "Posts",
    path: "/",
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
      "All the latest posts. This blog is about web-focused software development with a hint of design, business, and neat little things.",
  };
}

export default Posts;