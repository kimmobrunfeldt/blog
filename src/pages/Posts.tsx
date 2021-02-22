import React from "react";
import { isPostPage, PageMetadata, SiteData } from "src/types/siteData";
import { H, P, Header, Footer, PostSummary, HLevel } from "src/components";

type Props = {
  siteData: SiteData;
  pageData: PageMetadata;
};

function Posts(props: Props): JSX.Element {
  const postPages = props.siteData.pages.filter(isPostPage);
  return (
    <div className={`grid grid-rows-layout min-h-full gap-global`}>
      <Header currentPath={props.pageData.path} />
      <main className={`grid grid-cols-12 gap-global`}>
        <div className="col-start-3 col-span-4">
          <H visualLevel={2}>Posts</H>
          <HLevel>
            <P>All the blog posts.</P>
            <ul>
              {postPages.map((page) => {
                return (
                  <li className="mt-8 mb-paragraph" key={page.data.path}>
                    <PostSummary data={page.data} />
                  </li>
                );
              })}
            </ul>
          </HLevel>
        </div>
        <div className="col-span-4">test</div>
      </main>
      <Footer />
    </div>
  );
}

export async function getData(): Promise<PageMetadata> {
  return {
    title: "Posts",
    path: "/posts",
    tags: ["blog", "tech", "posts"],
    description: "All the latest posts.",
  };
}

export default Posts;
